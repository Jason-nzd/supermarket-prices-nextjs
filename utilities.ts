// Helper function - Adds $ symbol and 2 decimal points if applicable
export function printPrice(price: number) {
  // Check if a whole integer such as 8, and return without any decimals - $8
  if (price.toString() === parseInt(price.toString()).toString()) return '$' + price;
  // Else ensure 2 decimals instead of 1, such as $6.50 instead of $6.5
  else return '$' + price.toFixed(2);
}
