import { Container, CosmosClient, FeedOptions, SqlQuerySpec } from '@azure/cosmos';
import { Product } from './typings';

export const transparentImageUrlBase: string =
  'https://d1hhwouzawkav1.cloudfront.net/transparent-cd-images/';

// Helper function - Adds $ symbol and 2 decimal points if applicable
export function printPrice(price: number) {
  // Check if a whole integer such as 8, and return without any decimals - $8
  if (price.toString() === parseInt(price.toString()).toString()) return '$' + price;
  // Else ensure 2 decimals instead of 1, such as $6.50 instead of $6.5
  else return '$' + price.toFixed(2);
}

// Establish a cosmosdb connection, usually called just once
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

// Get search results from cosmos, return as array of Product objects
export async function getSearch(searchTerm: string): Promise<Product[]> {
  const container = await connectToCosmosDB();

  // Set cosmos query options - limit to fetching 24 items at a time
  const options: FeedOptions = {
    maxItemCount: 30,
  };

  const querySpec: SqlQuerySpec = {
    query:
      'SELECT * FROM products p WHERE CONTAINS(p.name, @name, true) AND ARRAY_LENGTH(p.priceHistory)>1',
    parameters: [{ name: '@name', value: searchTerm }],
  };

  const response = await container.items
    // .query('SELECT * FROM products p WHERE ARRAY_LENGTH(p.priceHistory)>1', options)
    .query(querySpec, options)
    .fetchNext();
  return response.resources as Product[];
}

// Get a specific product using id and optional partition key
export async function getProduct(id: string, partitionKey?: string): Promise<Product> {
  const container = await connectToCosmosDB();
  const response = await container.item(id).read();

  console.log(response);
  if (response.statusCode === 200) {
    return response.resource as Product;
  } else return Promise.reject();
}
