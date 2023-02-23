import { Container, CosmosClient, FeedOptions, SqlQuerySpec } from '@azure/cosmos';
import { DatedPrice, Product } from './typings';

export const transparentImageUrlBase: string = 'https://d1hhwouzawkav1.cloudfront.net/';

// Adds $ symbol and 2 decimal points if applicable
export function printPrice(price: number) {
  // If a whole integer such as 8, return without any decimals - $8
  if (price.toString() === parseInt(price.toString()).toString()) {
    return '$' + price;
    // Else return with decimals extended - 8.4 becomes $8.40
  } else {
    return '$' + price.toFixed(2);
  }
}

// Takes a DatedPrice[] object and returns if price is trending down
export function priceTrend(priceHistory: DatedPrice[]): PriceTrend {
  if (priceHistory.length > 1) {
    const latestPrice = priceHistory[priceHistory.length - 1].price;
    const olderPrice = priceHistory[priceHistory.length - 2].price;
    if (latestPrice < olderPrice) return PriceTrend.Decreased;
    else return PriceTrend.Increased;
  } else return PriceTrend.Same;
}

export enum PriceTrend {
  Increased,
  Decreased,
  Same,
}

// Establish CosmosDB connection
export async function connectToCosmosDB(): Promise<Container> {
  let cosmosClient: CosmosClient;
  let container: Container;

  // Check for valid connection string stored in .env
  console.log(`--- Connecting to CosmosDB..`);
  const COSMOS_CONSTRING = process.env.COSMOS_CONSTRING;
  if (!COSMOS_CONSTRING) {
    throw Error('Azure CosmosDB Connection string not found');
  }

  // Try to connect to CosmosDB using connection string
  try {
    cosmosClient = new CosmosClient(COSMOS_CONSTRING);

    // Connect to database
    const database = await cosmosClient.database('supermarket-prices');

    // Container to container
    container = await database.container('products');

    return container;
  } catch (error) {
    throw 'Invalid CosmosDB connection string, or unable to connect to CosmosDB';
  }
}

// Get search results from cosmos, return as array of Product objects
export async function searchProductName(
  searchTerm: string,
  onlyProductsWithHistory: boolean
): Promise<Product[]> {
  const container = await connectToCosmosDB();

  // Set cosmos query options - limit to fetching 24 items at a time
  const options: FeedOptions = {
    maxItemCount: 30,
  };

  const onlyWithHistory = onlyProductsWithHistory ? 'AND ARRAY_LENGTH(p.priceHistory)>1' : '';

  const querySpec: SqlQuerySpec = {
    query: 'SELECT * FROM products p WHERE CONTAINS(p.name, @name, true)' + onlyWithHistory,
    parameters: [{ name: '@name', value: searchTerm }],
  };

  const response = await container.items.query(querySpec, options).fetchNext();

  // Create a new products array, set only specific fields from CosmosDB
  let products: Product[] = [];
  const documents = response.resources.map((productDocument) => {
    const { id, name, currentPrice, size, sourceSite, priceHistory, category } = productDocument;
    const p: Product = { id, name, currentPrice, size, sourceSite, priceHistory, category };
    products.push(p);
  });

  return products;
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

export function cleanProductFields(document: Product) {
  let { id, name, currentPrice, size, sourceSite, priceHistory, category } = document;
  if (!category) category = ['No Category'];
  const cleanedProduct: Product = {
    id,
    name,
    currentPrice,
    size,
    sourceSite,
    priceHistory,
    category,
  };
  return cleanedProduct;
}

export function sortProductsByName(products: Product[]) {
  products.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

export function sortProductsByDate(products: Product[]) {
  return products.sort((a, b) => {
    const dateA = new Date(a.priceHistory[a.priceHistory.length - 1].date);
    const dateB = new Date(b.priceHistory[b.priceHistory.length - 1].date);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });
}
