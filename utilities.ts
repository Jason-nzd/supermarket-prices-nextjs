import { Container, CosmosClient, FeedOptions } from '@azure/cosmos';

// Helper function - Adds $ symbol and 2 decimal points if applicable
export function printPrice(price: number) {
  // Check if a whole integer such as 8, and return without any decimals - $8
  if (price.toString() === parseInt(price.toString()).toString()) return '$' + price;
  // Else ensure 2 decimals instead of 1, such as $6.50 instead of $6.5
  else return '$' + price.toFixed(2);
}

export async function connectToCosmosDB(): Promise<Container> {
  // Create Cosmos client using connection string stored in .env
  console.log(`--- Connecting to CosmosDB..`);
  const COSMOS_CONSTRING = process.env.COSMOS_CONSTRING;
  if (!COSMOS_CONSTRING) {
    throw Error('Azure CosmosDB Connection string not found');
  }
  const cosmosClient = new CosmosClient(COSMOS_CONSTRING);

  // Connect to supermarket-prices database
  const database = await cosmosClient.database('supermarket-prices');
  const container = await database.container('products');

  return container;
}
