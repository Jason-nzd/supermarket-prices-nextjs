import { DatedPrice, Product } from "@/typings";
import { Store } from "./enums";

export * from "./enums";

// Flexible schema interface for handling both old and new CosmosDB document formats
export interface ProductDocument {
  id: string;
  name: string;
  sourceSite?: string;
  category?: string | string[];
  size?: string;
  lastChecked?: string | Date;
  lastUpdated?: string;
  unitPrice?: string | number;
  unitName?: string;
  currentPrice?: number;
  priceHistory: PriceHistoryItem[];
  // Allow additional CosmosDB internal fields (_rid, _self, _etag, _ts, etc.)
  [key: string]: unknown;
}

// Price history item with flexible field names for old and new schemas
export interface PriceHistoryItem {
  date?: string | Date;
  Date?: string | Date;
  price?: number;
  Price?: number;
}

export function getStoreEnum(product: Product): Store {
  if (product.sourceSite.includes("countdown") || product.sourceSite.includes("woolworths"))
    return Store.Countdown
  else if (product.sourceSite.includes("thewarehouse")) return Store.Warehouse
  else if (product.sourceSite.includes("paknsave")) return Store.Paknsave;
  else if (product.sourceSite.includes("newworld")) return Store.NewWorld;
  else return Store.Any;
}

// dbDocumentToProduct
// -------------------
// Transforms a CosmosDB document into a Product, handling flexible schemas
// Always derives unitPrice from priceHistory and size to ensure accuracy
export function dbDocumentToProduct(document: ProductDocument): Product {
  // Always use id and name as-is
  const { id, name } = document;

  // Handle category - if array, take first item
  const category: string = Array.isArray(document.category) ? document.category[0] : (document.category ?? '');

  // Handle size
  const size = document.size ?? '';

  // Handle priceHistory - normalize date formats to yyyy-mm-dd
  const priceHistory: DatedPrice[] = document.priceHistory.map((ph: PriceHistoryItem) => {
    let date = ph.date || ph.Date || '';
    const price = ph.price ?? ph.Price ?? 0;

    // Convert date to yyyy-mm-dd if needed
    if (date instanceof Date) {
      date = date.toISOString().split('T')[0];
    } else if (typeof date === 'string' && date.length > 10) {
      date = new Date(date).toISOString().split('T')[0];
    }

    return { date, price };
  });

  // Handle lastChecked - convert to yyyy-mm-dd string format
  let lastChecked = document.lastChecked || '';
  if (lastChecked instanceof Date) {
    lastChecked = lastChecked.toISOString().split('T')[0];
  } else if (typeof lastChecked === 'string' && lastChecked.length > 10) {
    // Convert ISO string or other format to yyyy-mm-dd
    lastChecked = new Date(lastChecked).toISOString().split('T')[0];
  }

  // Handle unitPrice - always derive from name, size, and the current price
  const currentPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : 0;
  const unitPrice = deriveUnitPriceString(name, size, currentPrice);

  // Handle flexible sourceSite
  let sourceSite = document.sourceSite || '';
  if (/countdown|woolworths/i.test(sourceSite)) {
    sourceSite = 'countdown.co.nz';
  }

  const cleanedProduct: Product = {
    id,
    name,
    size,
    sourceSite,
    priceHistory,
    category,
    lastChecked,
    unitPrice
  };

  return cleanedProduct;
}

// deriveUnitPriceString
// ---------------------
// Try to derive a unit price string such as 500/kg from the product name/size/price
// Return an empty string if unable to derive one
export function deriveUnitPriceString(name: string, size: string, price: number): string {

  let quantity: number = 0;
  let unit: string = "";

  // Try regex match any digits combined with standard units found in size
  let matchedUnit = size
    ?.toLowerCase()
    .match(/\d+(\.\d+)?\s?(g|kg|l|ml)\b/g)
    ?.join('');

  if (!matchedUnit) {
    // If none found try match in name
    matchedUnit = name
      ?.toLowerCase()
      .match(/\d+(\.\d+)?\s?(g|kg|l|ml)\b/g)
      ?.join('');
  }

  if (matchedUnit) {
    // Regex any digits or decimals
    const unitDigits = matchedUnit.match(/\d|\./g)?.join('')
    // Then parse to quantity
    if (unitDigits) quantity = parseFloat(unitDigits);

    // Regex any words
    unit = matchedUnit.match(/(g|kg|l|ml)\b/g)?.join('') || "";

    // Handle edge case where size contains a 'multiplier x sub-unit' - eg. 4 x 107mL
    const matchMultipliedSizeString = size?.match(/\d+\sx\s\d+mL$/g)?.join('');
    if (matchMultipliedSizeString) {
      const splitMultipliedSize = matchMultipliedSizeString.split('x');
      const multiplier = parseInt(splitMultipliedSize[0].trim());
      const subUnitSize = parseInt(splitMultipliedSize[1].trim());

      // set the quantity, overriding any earlier logic
      quantity = multiplier * subUnitSize;
    }

    // If size is simply 'kg', process it as 1kg
    if (size === 'kg' || size?.includes('per kg')) {
      quantity = 1;
      unit = 'kg';
    }

    // If units are in grams, convert to /kg
    if (quantity > 0 && unit === 'g') {
      quantity = quantity / 1000;
      unit = 'kg';
    }

    // If units are in mL, divide by 1000 and use L instead
    if (quantity > 0 && unit === 'ml') {
      quantity = quantity / 1000;
      unit = 'L';
    }

    // Capitalize L for Litres
    unit = unit.replace("l", "L");

    // Check is within valid range
    if (quantity > 0 && quantity < 9999) {

      // Divide total price by unit quantity
      const decimalPrice = parseFloat((price / quantity).toPrecision(2));
      const wholeNumberPrice = parseFloat((price / quantity).toFixed(0));

      // Return as whole number if possible or with 2 decimals.
      if (decimalPrice == wholeNumberPrice)
        return wholeNumberPrice + '/' + unit;
      else
        return decimalPrice + "/" + unit;
    }
  } else {
    // Try find "per each", "per kg" type of sizes or names
    const nameAndsize = name + " " + size;
    if (nameAndsize.includes("per kg")) return price + "/kg"
  }
  // Return empty if unable to derive
  // console.log("Unable to derive unitPrice: " + name + " - " + size)
  return "";
}


// getPriceAvgDifference()
// ---------------------------
// Gets the % difference in price between the current price and its historical average.
export function getPriceAvgDifference(
  priceHistory: DatedPrice[],
  daysOfPriceHistoryToCompare: number = 120
) {
  let pricesSummed = 0;
  let avgHistoricalPrice = 0;

  // Get the oldest date to stop comparing prices to
  const comparisonDateCutoff =
    new Date(Date.now() - daysOfPriceHistoryToCompare * 24 * 60 * 60 * 1000);

  // Loop from most recent to oldest prices
  for (let i = priceHistory.length - 1; i >= 0; i--) {

    // Sum each price
    pricesSummed += priceHistory[i].price;

    // Once at the end of the historical range, calculate the avg price
    if ((new Date(priceHistory[i].date) < comparisonDateCutoff) || (i == 0)) {
      avgHistoricalPrice = pricesSummed / (priceHistory.length - i);
      break;
    }
  }

  // Return the difference in price between the current and average price
  const currentPrice = priceHistory[priceHistory.length - 1].price;
  //console.log(currentPrice + " / " + avgHistoricalPrice + " = " + Math.round((currentPrice / avgHistoricalPrice) * 100 - 100))
  return Math.round((currentPrice / avgHistoricalPrice) * 100 - 100);
}


// toShortDate()
// -------------
// Takes any date/string and returns 'Mar 16' or 'Today'
// Uses manual formatting to avoid locale/timezone hydration mismatches
export function toShortDate(dateInput: Date | string, returnTodayString: boolean = false): string {
  const date = new Date(dateInput);
  const now = new Date();

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const month = months[date.getUTCMonth()];
  const dayNum = date.getUTCDate();
  const result = `${month} ${dayNum}`;

  const nowMonth = months[now.getUTCMonth()];
  const nowDayNum = now.getUTCDate();
  const nowResult = `${nowMonth} ${nowDayNum}`;

  if (result === nowResult && returnTodayString) return 'Today';
  else return result;
}

// toLongDate()
// ------------
// Takes any date/string and returns 'Friday, 11 August 2023'
// Uses manual formatting to avoid locale/timezone hydration mismatches
export function toLongDate(dateInput: Date | string): string {
  const date = new Date(dateInput);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayName = days[date.getUTCDay()];
  const dayNum = date.getUTCDate();
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${dayName}, ${dayNum} ${month} ${year}`;
}

// toMediumDate()
// --------------
// Takes any date/string and returns 'Friday 11 Aug'
// Uses manual formatting to avoid locale/timezone hydration mismatches
export function toMediumDate(dateInput: Date | string): string {
  const date = new Date(dateInput);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getUTCDay()];
  const dayNum = date.getUTCDate();
  const month = months[date.getUTCMonth()];

  return `${dayName} ${dayNum} ${month}`;
}

// toDateOnly()
// ------------
// Clean any hours, seconds, etc, from date.
// (converts '2023-06-18T23:46:27.222Z' to '2023-06-18')
export function toDateOnly(dateInput: Date | string): Date {
  return new Date(new Date(dateInput).toString().split('T')[0]);
}

// toDaysElapsed()
// ---------------
// Takes any date/string and returns number of days elapsed since.
// Can also return easier to read strings such as 'today' if 0 days of difference.
export function toDaysElapsed(dateInput: Date | string): string {
  const now = new Date();
  const then = new Date(dateInput);
  const elapsedDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 3600 * 24));

  if (elapsedDays == 0) return 'Today';
  else if (elapsedDays == 1) return 'Yesterday';
  else if (elapsedDays < 7) return elapsedDays.toString() + ' days ago';
  else return Math.floor(elapsedDays / 7).toString() + ' weeks ago';
}

// toMonthYear()
// -------------
// Takes any date/string and returns 'April 2023'
// Uses manual formatting to avoid locale/timezone hydration mismatches
export function toMonthYear(dateInput: Date | string): string {
  const date = new Date(dateInput);

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();

  return `${month} ${year}`;
}

// productIsCurrent()
// ------------------
// Checks if product was recently scraped within a certain number of days.
// Defaults to 5 days.
export function productIsCurrent(product: Product, withinDays: number = 5): boolean {
  const productDate = new Date(product.lastChecked);
  const withinDate = new Date();
  withinDate.setDate(withinDate.getDate() - withinDays);

  return productDate >= withinDate;
}

// sortProductsByUnitPrice()
// -------------------------
// Parses unitPrice string and sorts from lowest to highest
// Products without unitPrice are sorted to the bottom
export function sortProductsByUnitPrice(products: Product[]): Product[] {
  return products.sort((a, b) => {
    // Parse unit price from string (e.g., "3.3/kg" -> 3.3)
    const getUnitPriceNum = (unitPrice: string): number => {
      if (!unitPrice || !unitPrice.includes('/')) return 9999;
      const num = parseFloat(unitPrice.split('/')[0]);
      return isNaN(num) ? 9999 : num;
    };

    const aUnitPrice = getUnitPriceNum(a.unitPrice);
    const bUnitPrice = getUnitPriceNum(b.unitPrice);

    return aUnitPrice - bUnitPrice;
  });
}

// printPrice()
// ------------
// Adds $ symbol and 2 decimal points if applicable
export function printPrice(price: number): string {
  // If a whole integer such as 8, return without any decimals - $8
  if (price.toString() === parseInt(price.toString()).toString()) {
    return '$' + price;
    // Else return with decimals extended - 8.4 becomes $8.40
  } else {
    return '$' + price.toFixed(2);
  }
}

// printProductCountSubTitle()
// ---------------------------
// Displays the number of products shown in the grid, and the total number of products in the database.
// Example: "Showing cheapest 40/234 in-stock products"
export function printProductCountSubTitle(numProductsShown: number, numProductsInDB: number): string {
  return `Showing cheapest ${numProductsShown}/${numProductsInDB} in-stock products`;
}

