import { Container, CosmosClient, FeedOptions, ItemResponse, SqlQuerySpec } from '@azure/cosmos';
import { Product } from '../typings';
import { cleanProductFields, OrderByMode, PriceHistoryLimit, Store } from './utilities';

// CosmosDB Variables
const dbName = 'supermarket-prices';
const containerName = 'products';

// CosmosDB Singletons
let cosmosClient: CosmosClient;
let container: Container;

// Establish CosmosDB connection - returns true if successfully connected
export async function connectToCosmosDB(): Promise<boolean> {
  // If already connected we can return here
  if (container != null) return true;

  // Check for valid connection string stored in .env
  const COSMOS_CONSTRING = process.env.COSMOS_CONSTRING;
  if (!COSMOS_CONSTRING) {
    console.log('Azure CosmosDB Connection string not found');
    return false;
  }

  // Try to connect to CosmosDB using connection string
  try {
    cosmosClient = new CosmosClient(COSMOS_CONSTRING);

    // Connect to database & container
    const database = await cosmosClient.database(dbName);
    container = await database.container(containerName);

    return true;
  } catch (error) {
    console.log(
      'Invalid CosmosDB connection string, or unable to connect to CosmosDB\n' +
        'Check .env.local in root folder, with COSMOS_CONSTRING=<your CosmoDB read connection string>'
    );
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

// Fetch all products with optional parameters for customized queries
export async function DBFetchAll(
  maxItems: number = 20,
  store: Store = Store.Any,
  priceHistoryLimit: PriceHistoryLimit = PriceHistoryLimit.Any,
  orderBy: OrderByMode = OrderByMode.None
): Promise<Product[]> {
  // Query is built using the follow base, and adding on optional extra conditions
  const querySpec: SqlQuerySpec = {
    query:
      'SELECT * FROM products p' +
      queryAddLimitStore(store, false) +
      queryAddPriceHistoryLimit(priceHistoryLimit) +
      queryAddOrderBy(orderBy),
  };

  // Log completed queries to console
  console.warn('\n' + querySpec.query);

  // Use fetchProductsByQuerySpec to do the actual CosmosDB lookup
  return await fetchProductsByQuerySpec(querySpec, maxItems);
}

// Takes a completed query and performs the CosmosDB lookup
async function fetchProductsByQuerySpec(query: SqlQuerySpec, maxItems: number): Promise<Product[]> {
  // Set Cosmos Query options
  const options: FeedOptions = {
    maxItemCount: maxItems,
  };

  let resultingProducts: Product[] = [];

  // Establish CosmosDB connection
  if (await connectToCosmosDB()) {
    try {
      // Perform DB Fetch
      const dbResponse = await container.items.query(query, options).fetchNext();

      // Push products into array and clean specific fields from CosmosDB
      dbResponse.resources.map((productDocument) => {
        resultingProducts.push(cleanProductFields(productDocument));
      });
    } catch (error) {
      console.log(error);
    }
  }
  return resultingProducts;
}

// Takes an orderby enum and returns the corresponding SQL query add-on
function queryAddOrderBy(orderBy: OrderByMode): string {
  let sqlQueryAddon = '';
  switch (orderBy) {
    case OrderByMode.DateNewest:
      sqlQueryAddon = ' ORDER BY p.lastUpdated DESC';
      break;
    case OrderByMode.DateOldest:
      sqlQueryAddon = ' ORDER BY p.lastUpdated';
      break;
    case OrderByMode.PriceLowest:
      sqlQueryAddon = ' ORDER BY p.currentPrice';
      break;
    case OrderByMode.PriceHighest:
      sqlQueryAddon = ' ORDER BY p.currentPrice DESC';
      break;
    default:
    case OrderByMode.None:
      break;
  }
  return sqlQueryAddon;
}

// Takes a Store enum and returns a query string to be added onto an existing query
//  useAND=true if adding onto other WHERE conditions, useAND=false if this is the only condition
function queryAddLimitStore(store: Store, useAND: boolean = true): string {
  let queryAddon = '';
  let optionalAND = useAND ? ' AND ' : ' WHERE ';

  switch (store) {
    case Store.Countdown:
      queryAddon = optionalAND + "p.sourceSite = 'countdown.co.nz'";
      break;

    case Store.Paknsave:
      queryAddon = optionalAND + "p.sourceSite = 'paknsave.co.nz'";
      break;

    case Store.Warehouse:
      queryAddon = optionalAND + "p.sourceSite = 'thewarehouse.co.nz'";
      break;

    default:
      break;
  }
  return queryAddon;
}

// Takes a PriceHistoryLimit enum and returns a query string add-on to be added onto an existing query
//  can limit to products that have multiple price history elements to look at
function queryAddPriceHistoryLimit(
  priceHistoryLimit: PriceHistoryLimit,
  useAND: boolean = true
): string {
  let queryAddon = '';
  let optionalAND = useAND ? ' AND ' : ' WHERE ';

  switch (priceHistoryLimit) {
    case PriceHistoryLimit.TwoOrMore:
      queryAddon = optionalAND + 'ARRAY_LENGTH(p.priceHistory)>=2';
      break;

    case PriceHistoryLimit.FourOrMore:
      queryAddon = optionalAND + 'ARRAY_LENGTH(p.priceHistory)>=4';
      break;

    case PriceHistoryLimit.Any:
    default:
      break;
  }
  return queryAddon;
}

// Fetch products by searching category
export async function DBFetchByCategory(
  searchTerm: string,
  maxItems: number = 20,
  store: Store = Store.Any,
  priceHistoryLimit: PriceHistoryLimit = PriceHistoryLimit.Any,
  orderBy: OrderByMode = OrderByMode.None
): Promise<Product[]> {
  const queryBase = 'SELECT * FROM products p WHERE ARRAY_CONTAINS(p.name, @name, true)';
  const query: SqlQuerySpec = {
    query:
      queryBase +
      queryAddLimitStore(store, false) +
      queryAddPriceHistoryLimit(priceHistoryLimit) +
      queryAddOrderBy(orderBy),
    parameters: [{ name: '@name', value: searchTerm }],
  };

  return await fetchProductsByQuerySpec(query, maxItems);
}

// Fetch products by searching name, with optional store selection
export async function DBFetchByName(
  searchTerm: string,
  maxItems: number = 20,
  store: Store = Store.Any,
  priceHistoryLimit: PriceHistoryLimit = PriceHistoryLimit.Any,
  orderBy: OrderByMode = OrderByMode.None
): Promise<Product[]> {
  const queryBase = 'SELECT * FROM products p WHERE CONTAINS(p.name, @name, true)';
  const query: SqlQuerySpec = {
    query:
      queryBase +
      queryAddLimitStore(store, false) +
      queryAddPriceHistoryLimit(priceHistoryLimit) +
      queryAddOrderBy(orderBy),
    parameters: [{ name: '@name', value: searchTerm }],
  };

  return await fetchProductsByQuerySpec(query, maxItems);
}
