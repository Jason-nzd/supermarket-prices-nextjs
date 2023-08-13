import { DatedPrice, Product } from '../typings';

// Enums
export enum PriceTrend {
  Increased,
  Decreased,
  Same,
}
export enum Store {
  Countdown,
  Paknsave,
  Warehouse,
  CountdownPaknSave,
  CountdownWarehouse,
  PaknsaveWarehouse,
  Any,
}
export enum OrderByMode {
  Latest,
  Oldest,
  LatestPriceChange,
  OldestPriceChange,
  PriceLowest,
  PriceHighest,
  UnitPriceLowest,
  UnitPriceHighest,
  Name,
  None,
}
export enum PriceHistoryLimit {
  Any,
  TwoOrMore,
  FourOrMore,
}
export enum LastChecked {
  Within2Days,
  Within7Days,
  Within30Days,
  Any,
}

// Removes undesired fields that CosmosDB creates
export function cleanProductFields(document: Product): Product {
  let {
    id,
    name,
    currentPrice,
    size,
    sourceSite,
    priceHistory,
    category,
    lastUpdated,
    lastChecked,
    unitPrice,
    unitName,
    originalUnitQuantity,
  } = document;
  try {
    // Also check for valid date and category formats
    if (lastUpdated === undefined || lastUpdated === null) {
      console.log(name + ' has null date - ' + lastUpdated);
      // } else if (!lastUpdated.toString().endsWith('Z')) {
      //   console.log(name + ' has non-utc date - ' + lastUpdated);
    }
    if (!category) category = ['No Category'];
    if (!lastChecked) lastChecked = lastUpdated;
    if (!unitPrice) {
      // unitPrice = null;
      // unitName = null;
      const derivedUnitString = deriveUnitPriceString(document);

      if (derivedUnitString) {
        unitPrice = Number.parseFloat(derivedUnitString.split('/')[0] as string);
        unitName = derivedUnitString.split('/')[1];
      } else {
        unitPrice = null;
        unitName = null;
      }
    } else if (unitPrice < 0.2 || unitPrice > 600) {
      console.log('[Unusual UnitPrice] = ' + name + ' - ' + unitPrice + '/' + unitName);
      unitPrice = null;
    }
    if (!originalUnitQuantity) originalUnitQuantity = null;
  } catch (error) {
    console.log(`Error on cleanProductFields() for ${name}\n` + error);
  }
  const cleanedProduct: Product = {
    id,
    name,
    currentPrice,
    size,
    sourceSite,
    priceHistory,
    category,
    lastUpdated,
    lastChecked,
    unitPrice,
    unitName,
    originalUnitQuantity,
  };
  return cleanedProduct;
}

export function deriveUnitPriceString(product: Product): string | undefined {
  let quantity: number | undefined;
  let deriveUnitPriceFromName = false;

  // Try match any units found in size or name
  let matchedUnit = product.size
    ?.toLowerCase()
    .match(/\d+(\.\d+)?\s?(g|kg|l|ml)\b/g)
    ?.join('');
  if (!matchedUnit) {
    matchedUnit = product.name
      ?.toLowerCase()
      .match(/\d+(\.\d+)?\s?(g|kg|l|ml)\b/g)
      ?.join('');
    deriveUnitPriceFromName = true;
  }

  if (matchedUnit) {
    // Get any digits or decimals from size or name, then parse to a float
    let regexSizeOnlyDigits = deriveUnitPriceFromName
      ? product.name?.match(/\d|\./g)?.join('')
      : product.size?.match(/\d|\./g)?.join('');
    if (regexSizeOnlyDigits) quantity = parseFloat(regexSizeOnlyDigits);

    // Get unit name
    product.unitName = matchedUnit.match(/(g|kg|l|ml)/g)?.join('');

    // Handle edge case where size contains a 'multiplier x sub-unit' - eg. 4 x 107mL
    let matchMultipliedSizeString = product.size?.match(/\d+\sx\s\d+mL$/g)?.join('');
    if (matchMultipliedSizeString) {
      const splitMultipliedSize = matchMultipliedSizeString.split('x');
      const multiplier = parseInt(splitMultipliedSize[0].trim());
      const subUnitSize = parseInt(splitMultipliedSize[1].trim());
      quantity = multiplier * subUnitSize;
    }

    // If size is simply 'kg', process it as 1kg
    if (product.size === 'kg' || product.size?.includes('per kg')) {
      quantity = 1;
      product.unitName = 'kg';
    }

    // If units are in grams, convert to /kg
    if (quantity && product.unitName === 'g') {
      quantity = quantity / 1000;
      product.unitName = 'kg';
    }

    // If units are in mL, divide by 1000 and use L instead
    if (quantity && product.unitName === 'ml') {
      quantity = quantity / 1000;
      product.unitName = 'L';
    }

    // Capitalize L for Litres
    if (quantity && product.unitName === 'l') product.unitName = 'L';

    // Parse to int and check is within valid range
    if (quantity && quantity > 0 && quantity < 9999) {
      // Set per unit price
      product.unitPrice = parseFloat((product.currentPrice / quantity).toPrecision(2));

      return product.unitPrice + '/' + product.unitName;
    }
  }
  return undefined;
}

// getPriceLowDifference()
// ---------------------------
// Gets the % difference in price between the current price and its historical lowest.
export function getPriceLowDifference(priceHistory: DatedPrice[]) {
  // Loop through the price history and find the lowest price
  let lowestPrice = 9999;
  priceHistory.forEach((datedPrice) => {
    if (datedPrice.price < lowestPrice) lowestPrice = datedPrice.price;
  });

  // Return the difference in price between the current and lowest price
  const currentPrice = priceHistory[priceHistory.length - 1].price;
  return Math.round((currentPrice / lowestPrice) * 100 - 100);
}

// getLowerQuartilePriceDifference()
// ---------------------------
// Gets the % difference in price between the current and lower quartile average.
export function getLowerQuartilePriceDifference(priceHistory: DatedPrice[]) {
  // Extract only prices from the DatedPrice array
  let pricesOnly: number[] = [];
  priceHistory.forEach((datedPrice) => {
    pricesOnly.push(datedPrice.price);
  });

  // Sort prices
  pricesOnly.sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  // Select the index of the lower quartile
  const quartileIndex = Math.ceil(pricesOnly.length / 4);

  // Loop through the lower quartile and add up all the prices
  let lowerQuartileSummed = 0;
  for (let i = 0; i < quartileIndex; i++) {
    lowerQuartileSummed += pricesOnly[i];
    console.log(lowerQuartileSummed);
  }

  // Calculate the lower quartile price
  const lowerQuartilePrice = lowerQuartileSummed / quartileIndex;

  // Return the difference in price between the current and lower quartile price
  const currentPrice = priceHistory[priceHistory.length - 1].price;
  return Math.round((currentPrice / lowerQuartilePrice) * 100 - 100);
}

// getPriceAvgDifference()
// ---------------------------
// Gets the % difference in price between the current price and its historical average.
export function getPriceAvgDifference(priceHistory: DatedPrice[]) {
  // Loop through priceHistory array and sum up prices
  let pricesSummed = 0;
  priceHistory.forEach((datedPrice) => {
    pricesSummed += datedPrice.price;
  });

  // Calculate the average price
  const avgPrice = pricesSummed / priceHistory.length;

  // Return the difference in price between the current and average price
  const currentPrice = priceHistory[priceHistory.length - 1].price;
  return Math.round((currentPrice / avgPrice) * 100 - 100);
}

// getLastPriceChangePercent()
// ---------------------------
// Gets the % difference in price between the current and previous price.
export function getLastPriceChangePercent(priceHistory: DatedPrice[]) {
  // Return 0 if there are fewer than 2 price history entries
  if (priceHistory.length < 2) return 0;

  const currentPrice = priceHistory[priceHistory.length - 1].price;
  const prevPrice = priceHistory[priceHistory.length - 2].price;
  const priceChange = currentPrice / prevPrice;

  return Math.round(priceChange * 100 - 100);
}

// utcDateToShortDate()
// --------------------
// Will take a UTC Date and return in format Mar 16, or 'Today'
export function utcDateToShortDate(utcDate: Date, returnTodayString: boolean = false): string {
  var date = new Date(utcDate).toDateString(); // Thu Mar 16 2023
  var now = new Date().toDateString();

  if (date === now && returnTodayString) return 'Today';
  else return date.substring(4, 10); // Mar 16
}

// utcDateToLongDate
// -----------------
// Takes UTC Date and returns 'Friday, 11 August 2023'
export function utcDateToLongDate(utcDate: Date): string {
  return new Date(utcDate).toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// utcDateToShortDate
// -----------------
// Takes UTC Date and returns 'Friday, 11 Aug'
export function utcDateToMediumDate(utcDate: Date): string {
  return new Date(utcDate).toLocaleString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
}

// utcDateToMonthYear
// ------------------
// Takes UTC Date and returns 'April 2023'
export function utcDateToMonthYear(utcDate: Date): string {
  return new Date(utcDate).toLocaleString('en-GB', {
    month: 'long',
    year: 'numeric',
  });
}

// sortProductsByName()
// --------------------
export function sortProductsByName(products: Product[]): Product[] {
  return products.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

// sortProductsByDate()
// --------------------
export function sortProductsByDate(products: Product[]): Product[] {
  return products.sort((a, b) => {
    const dateA = new Date(a.priceHistory[a.priceHistory.length - 1].date);
    const dateB = new Date(b.priceHistory[b.priceHistory.length - 1].date);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });
}

// sortProductsByUnitPrice()
// -------------------------
export function sortProductsByUnitPrice(products: Product[]): Product[] {
  return products.sort((a, b) => {
    // If no unit price is available, sort to bottom
    if (a.unitPrice === null) a.unitPrice = 9999;
    if (b.unitPrice === null) b.unitPrice = 9999;

    // Else sort from lowest to highest unit price
    if (a.unitPrice! < b.unitPrice!) return -1;
    if (a.unitPrice! > b.unitPrice!) return 1;
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

// priceTrend()
// ------------
// Takes a DatedPrice[] object and returns if price is trending up/down
export function priceTrend(priceHistory: DatedPrice[]): PriceTrend {
  if (priceHistory.length > 1) {
    const latestPrice = priceHistory[priceHistory.length - 1].price;
    const olderPrice = priceHistory[priceHistory.length - 2].price;
    if (latestPrice < olderPrice) return PriceTrend.Decreased;
    else return PriceTrend.Increased;
  } else return PriceTrend.Same;
}
