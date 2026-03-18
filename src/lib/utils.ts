import { DatedPrice, Product } from "@/typings";
import { Store } from "./enums";

export * from "./enums";

export function getStoreEnum(product: Product): Store {
  if (product.sourceSite.includes("countdown") || product.sourceSite.includes("woolworths"))
    return Store.Countdown
  else if (product.sourceSite.includes("thewarehouse")) return Store.Warehouse
  else if (product.sourceSite.includes("paknsave")) return Store.Paknsave;
  else if (product.sourceSite.includes("newworld")) return Store.NewWorld;
  else return Store.Any;
}

// cleanProductFields
// -------------------
// Validates data and cleans undesired fields that CosmosDB creates
export function cleanProductFields(document: Product): Product {
  const {
    id,
    name,
    sourceSite,
    priceHistory,
    category,
    lastChecked,
  } = document;

  let {
    size,
    unitPrice,
    unitPriceNum,
  } = document;

  try {
    if (id.length < 1) console.log(`Bad Product ID for ${id} - ${name}`)
    if (name.length < 2) console.log(`Bad name for ${id} - ${name}`)
    if (!category) console.log(`Missing category for ${id} - ${name}`)

    if (size == undefined) size = "";

    // lastChecked should be a date string in the format yyyy-mm-dd
    if (lastChecked.length != 10) console.log(`${id}\t - ${name}\t - Improper lastChecked: ${lastChecked}`)

    // TODO: move unit price handling to server side only
    // ensure unitPrice is limited 2 numbers max
    if (unitPrice && unitPrice.length > 2) {
      const unitNum = unitPrice.split("/")[0];
      let unitName = unitPrice.split("/")[1]
      unitName = unitName.replace("1ea", "ea")
      unitPrice = parseFloat(unitNum).toFixed(2) + "/" + unitName;
      unitPriceNum = parseFloat(unitNum)
    }
    // try derive a unit price string if missing
    if (!unitPrice || unitPrice === "") unitPrice = deriveUnitPriceString(document);
    if (unitPriceNum === undefined) unitPriceNum = 9999
  } catch (error) {
    console.log(`Error on cleanProductFields() for ${name}\n` + error);
  }

  const cleanedProduct: Product = {
    id,
    name,
    size,
    sourceSite,
    priceHistory: priceHistory?.map((ph: any) => ({
      date: ph.date || ph.Date,
      price: ph.price !== undefined ? ph.price : ph.Price
    })) || [],
    category,
    lastChecked,
    unitPrice,
    unitPriceNum
  };
  return cleanedProduct;
}

// deriveUnitPriceString
// ---------------------
// Try to derive a unit price string such as 500/kg from the product name/size
// Return an empty string if unable to derive one
export function deriveUnitPriceString(product: Product): string {
  let quantity: number = 0;
  let unit: string = "";
  let deriveUnitPriceFromName = false;

  // Try regex match any standard units found in size
  let matchedUnit = product.size
    ?.toLowerCase()
    .match(/\d+(\.\d+)?\s?(g|kg|l|ml)\b/g)
    ?.join('');

  if (!matchedUnit) {
    // If none found try match in name
    matchedUnit = product.name
      ?.toLowerCase()
      .match(/\d+(\.\d+)?\s?(g|kg|l|ml)\b/g)
      ?.join('');
    deriveUnitPriceFromName = true;
  }

  if (matchedUnit) {
    const nameOrSize = deriveUnitPriceFromName ? product.name : product.size || "";

    // Regex any digits or decimals
    const unitNumbers = nameOrSize.match(/\d|\./g)?.join('')
    // Then parse to quantity
    if (unitNumbers) quantity = parseFloat(unitNumbers);

    // Regex any words
    unit = matchedUnit.match(/(g|kg|l|ml)\b/g)?.join('') || "";

    // Handle edge case where size contains a 'multiplier x sub-unit' - eg. 4 x 107mL
    const matchMultipliedSizeString = product.size?.match(/\d+\sx\s\d+mL$/g)?.join('');
    if (matchMultipliedSizeString) {
      const splitMultipliedSize = matchMultipliedSizeString.split('x');
      const multiplier = parseInt(splitMultipliedSize[0].trim());
      const subUnitSize = parseInt(splitMultipliedSize[1].trim());

      // set the quantity, overriding any earlier logic
      quantity = multiplier * subUnitSize;
    }

    // If size is simply 'kg', process it as 1kg
    if (product.size === 'kg' || product.size?.includes('per kg')) {
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

    // Parse to int and check is within valid range
    if (quantity > 0 && quantity < 9999) {
      // Set per unit price
      const currentPrice = product.priceHistory[product.priceHistory.length - 1].price;
      const dividedUnitPrice = parseFloat((currentPrice / quantity).toPrecision(2));
      return dividedUnitPrice + '/' + unit;
    }
  }
  // Return empty if unable to derive
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


// utcDateToShortDate()
// --------------------
// Will take a UTC Date and return in format Mar 16, or 'Today'
export function utcDateToShortDate(utcDate: Date | string, returnTodayString: boolean = false): string {
  const date = new Date(utcDate).toDateString(); // Thu Mar 16 2023
  const now = new Date().toDateString();

  if (date === now && returnTodayString) return 'Today';
  else return date.substring(4, 10); // Mar 16
}

// stringDateToLongDate()
// -------------------
// Takes string date and returns 'Friday, 11 August 2023'
export function stringDateToLongDate(stringDate: string): string {
  return new Date(stringDate).toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// utcDateToShortDate()
// --------------------
// Takes UTC Date and returns 'Friday, 11 Aug'
export function utcDateToMediumDate(utcDate: Date | string): string {
  return new Date(utcDate).toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

// cleanDate()
// -----------
// Clean any hours, seconds, etc, from date.
// (converts '2023-06-18T23:46:27.222Z' to '2023-06-18')
export function cleanDate(utcDate: Date | string): Date {
  return new Date(new Date(utcDate).toString().split('T')[0]);
}

// daysElapsedSinceDateFormatted()
// -------------------------------
// Takes string date and returns number of days elapsed since.
// Can also return easier to read strings such as 'today' if 0 days of difference.
export function daysElapsedSinceDateFormatted(stringDate: string): string {
  const now = new Date();
  const then = new Date(stringDate);
  const elapsedDays = Math.floor((now.getTime() - then.getTime()) / (1000 * 3600 * 24));

  if (elapsedDays == 0) return 'Today';
  else if (elapsedDays == 1) return 'Yesterday';
  else if (elapsedDays < 7) return elapsedDays.toString() + ' days ago';
  else return Math.floor(elapsedDays / 7).toString() + ' weeks ago';
}

// stringDateToMonthYear
// ------------------
// Takes a string date and returns 'April 2023'
export function stringDateToMonthYear(stringDate: string): string {
  return new Date(stringDate).toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
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
export function sortProductsByUnitPrice(products: Product[]): Product[] {
  return products.sort((a, b) => {
    // If no unit price is available, sort to bottom
    if (a.unitPriceNum === null) a.unitPriceNum = 9999;
    if (b.unitPriceNum === null) b.unitPriceNum = 9999;

    // Else sort from lowest to highest unit price
    if (a.unitPriceNum! < b.unitPriceNum!) return -1;
    if (a.unitPriceNum! > b.unitPriceNum!) return 1;
    return 0;
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

