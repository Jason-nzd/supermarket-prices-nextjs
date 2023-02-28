import { Container, CosmosClient, FeedOptions, ItemResponse, SqlQuerySpec } from '@azure/cosmos';
import { DatedPrice, Product } from './typings';

// CosmosDB Variables
const dbName = 'supermarket-prices';
const containerName = 'products';

// CosmosDB Singletons
let cosmosClient: CosmosClient;
let container: Container;

// CDN Variables
export const transparentImageUrlBase: string = 'https://d1hhwouzawkav1.cloudfront.net/';

// Enums
enum Store {
  Countdown,
  Paknsave,
  Warehouse,
  CountdownPaknSave,
  CountdownWarehouse,
  PaknsaveWarehouse,
  All,
}

// Establish CosmosDB connection
export async function connectToCosmosDB() {
  // If already connected we can return here
  if (container != null) return;

  // Check for valid connection string stored in .env
  console.log(`--- Connecting to CosmosDB..`);
  const COSMOS_CONSTRING = process.env.COSMOS_CONSTRING;
  if (!COSMOS_CONSTRING) {
    console.log('Azure CosmosDB Connection string not found');
    return false;
  }

  // Try to connect to CosmosDB using connection string
  try {
    cosmosClient = new CosmosClient(COSMOS_CONSTRING);

    // Connect to database
    const database = await cosmosClient.database(dbName);

    // Container to container
    container = await database.container(containerName);

    return true;
  } catch (error) {
    console.log('Invalid CosmosDB connection string, or unable to connect to CosmosDB');
    return false;
  }
}

// Get a specific product using id, optional partition key
export async function DBGetProduct(id: string, partitionKey?: string): Promise<Product> {
  // Establish CosmosDB connection
  if (await connectToCosmosDB()) {
    // Try to get the product with or without partition key
    let response: ItemResponse<Product>;
    try {
      if (partitionKey) response = await container.item(id, partitionKey).read();
      else response = await container.item(id).read();

      if (response.statusCode === 200) return response.resource as Product;
    } catch (error) {
      // If an error occurs during lookup, reject promise
      return Promise.reject();
    }
  }
  // If no item is found, reject promise
  return Promise.reject();
}

// Fetch products by searching name, with optional store selection
export async function DBFetchByName(
  searchTerm: string,
  maxItems: number = 20,
  store: Store = Store.All
) {
  // Establish CosmosDB connection
  if (await connectToCosmosDB()) {
    // SQL Query
    const queryBase = 'SELECT * FROM products p WHERE CONTAINS(p.name, @name, true)';
    const query: SqlQuerySpec = {
      query: queryBase + limitSQLQueryToStore(store),
      parameters: [{ name: '@name', value: searchTerm }],
    };

    return await fetchProductsByQuerySpec(query, maxItems);
  }
}

async function fetchProductsByQuerySpec(query: SqlQuerySpec, maxItems: number) {
  // Set Cosmos Query options
  const options: FeedOptions = {
    maxItemCount: maxItems,
  };

  let resultingProducts: Product[] = [];
  try {
    // Perform DB Fetch
    const dbResponse = await container.items.query(query, options).fetchNext();

    // Push products into array and set only specific fields from CosmosDB
    dbResponse.resources.map((productDocument) => {
      resultingProducts.push(cleanProductFields(productDocument));
    });
  } catch (error) {
    console.log(error);
  }
  return resultingProducts;
}

// Takes a Store enum and returns a SQL Query section to be added onto an existing query
function limitSQLQueryToStore(store: Store): string {
  let queryAddon = '';
  switch (store) {
    case Store.Countdown:
      queryAddon = " AND p.sourceSite = 'countdown.co.nz'";
      break;

    case Store.Paknsave:
      queryAddon = " AND p.sourceSite = 'paknsave.co.nz'";
      break;

    case Store.Warehouse:
      queryAddon = " AND p.sourceSite = 'thewarehouse.co.nz'";
      break;

    default:
      break;
  }
  return queryAddon;
}

// Fetch products by searching category
export async function DBFetchByCategory(
  searchTerm: string,
  maxItems: number = 20,
  store: Store = Store.All
) {
  // Establish CosmosDB connection
  if (await connectToCosmosDB()) {
    // SQL Query
    const queryBase = 'SELECT * FROM products p WHERE ARRAY_CONTAINS(p.name, @name, true)';
    const query: SqlQuerySpec = {
      query: queryBase + limitSQLQueryToStore(store),
      parameters: [{ name: '@name', value: searchTerm }],
    };

    return await fetchProductsByQuerySpec(query, maxItems);
  }
}

// Removes undesired fields that CosmosDB creates
export function cleanProductFields(document: Product) {
  let { id, name, currentPrice, size, sourceSite, priceHistory, category, lastUpdated } = document;
  if (!category) category = ['No Category'];
  if (!lastUpdated) lastUpdated = '';
  const cleanedProduct: Product = {
    id,
    name,
    currentPrice,
    size,
    sourceSite,
    priceHistory,
    category,
    lastUpdated,
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
