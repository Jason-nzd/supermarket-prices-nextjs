import {
  Container,
  CosmosClient,
  FeedOptions,
  FeedResponse,
  ItemResponse,
  SqlParameter,
  SqlQuerySpec,
} from '@azure/cosmos';
import { getSampleProductsInstead } from './sample-products';
import { Product } from '../typings';
import {
  cleanProductFields,
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  sortProductsByUnitPrice,
  Store,
  utcDateToMediumDate,
} from './utilities';

// CosmosDB Env Variables
const COSMOS_CONSTRING = process.env.COSMOS_CONSTRING;
const COSMOS_DBNAME = process.env.COSMOS_DBNAME;
const COSMOS_CONTAINER = process.env.COSMOS_CONTAINER;

// CosmosDB Singletons
let cosmosClient: CosmosClient;
let container: Container;

// Establish CosmosDB connection - returns true if successfully connected
export async function connectToCosmosDB(): Promise<boolean> {
  // If already connected we can return here
  if (container != null) return true;

  // Check for any connection string stored in .env
  if (!COSMOS_CONSTRING) {
    console.log('Azure CosmosDB Connection string not found');
    return false;
  }

  // Try to connect to CosmosDB using connection string
  try {
    cosmosClient = new CosmosClient(COSMOS_CONSTRING);

    // Connect to database & container
    const database = await cosmosClient.database(COSMOS_DBNAME!);
    container = await database.container(COSMOS_CONTAINER!);

    return true;
  } catch {
    console.log(
      'Invalid CosmosDB connection string, Database name, or Container name\n' +
      'Check env variables for:\n' +
      '\tCOSMOS_CONSTRING=<your CosmoDB read connection string>\n' +
      '\tCOSMOS_DBNAME=<your-database-name>\n' +
      '\tCOSMOS_CONTAINER=<your-container-name>\n'
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
    } catch {
      // If an error occurs during lookup, reject promise
      return Promise.reject();
    }
  }
  // If no item is found, reject promise
  return Promise.reject();
}

// Search DB for products with a search term, optional category, and optional exclude terms
// excludeRegex can be a single word, formatted as "(pineapple|mango|cheese)", or any similar regex
export async function DBFetchByNameAndExcludeRegex(
  includeTerm: string,
  excludeRegex: string,
  limitToCategory: string = ''
) {
  let unfilteredProducts: Product[] = [];
  let filteredProducts: Product[] = [];

  // If a category is specified, only fetch from that category
  if (limitToCategory != '') {
    unfilteredProducts = await DBFetchByCategory(
      limitToCategory,
      300,
      Store.Any,
      PriceHistoryLimit.Any,
      OrderByMode.None,
      LastChecked.Within7Days
    );
  } else {
    unfilteredProducts = await DBFetchByName(
      includeTerm,
      300,
      Store.Any,
      PriceHistoryLimit.Any,
      OrderByMode.None,
      LastChecked.Within7Days
    );
  }

  // Loop through products including only matching names,
  // and excluding any names that match the exclude regex.
  unfilteredProducts.forEach((product) => {
    const name = product.name.toLowerCase();

    // Use excludeRegex only if it is a valid length
    if (excludeRegex.length > 2) {
      if (name.match(includeTerm) && !name.match(excludeRegex)) {
        filteredProducts.push(product);
      }
    } else {
      if (name.match(includeTerm)) {
        filteredProducts.push(product);
      }
    }
  });

  // Sort by unit price
  filteredProducts = sortProductsByUnitPrice(filteredProducts);

  // Limit number of results
  filteredProducts = filteredProducts.slice(0, 30);

  return filteredProducts;
}

// Fetch all products with optional parameters for customized queries
export async function DBFetchAll(
  maxItems: number = 20,
  store: Store = Store.Any,
  priceHistoryLimit: PriceHistoryLimit = PriceHistoryLimit.Any,
  orderBy: OrderByMode = OrderByMode.None
): Promise<Product[]> {
  // SQL query is built using a base plus conditional WHERE clauses
  const querySpec: SqlQuerySpec = {
    query:
      'SELECT * FROM products p' +
      queryAddLimitStore(store, false) +
      queryAddPriceHistoryLimit(priceHistoryLimit) +
      queryAddLastChecked(LastChecked.Within7Days) +
      queryAddOrderBy(orderBy),
  };

  return await fetchProductsUsingSDK(querySpec, maxItems);
}

// Takes an SDK querySpec and performs the actual CosmosDB lookup
async function fetchProductsUsingSDK(
  querySpec: SqlQuerySpec,
  maxItems: number
): Promise<Product[]> {
  const resultingProducts: Product[] = [];

  // Log query to console
  //console.log('SDK: ' + querySpec.query);

  if (await connectToCosmosDB()) {
    // Access CosmosDB directly using the SDK
    try {
      // Set Cosmos Query options
      const options: FeedOptions = {
        maxItemCount: maxItems,
      };

      // Perform DB Fetch
      const dbResponse: FeedResponse<Product> = await container.items
        .query(querySpec, options)
        .fetchNext();

      if (dbResponse.resources !== undefined) {
        // Push products into array and clean specific fields from CosmosDB
        dbResponse.resources.map((productDocument) => {
          resultingProducts.push(cleanProductFields(productDocument));
        });
      }
    } catch (error) {
      console.log('Error on fetchProductsUsingSDK()\n' + error);
    }
  } else return getSampleProductsInstead();

  return resultingProducts;
}

// Takes an orderBy enum and returns the corresponding SQL query add-on
export function queryAddOrderBy(orderBy: OrderByMode): string {
  let sqlQueryAddon = '';
  switch (orderBy) {
    case OrderByMode.Latest:
      sqlQueryAddon = ' ORDER BY p.lastChecked DESC';
      break;
    case OrderByMode.Oldest:
      sqlQueryAddon = ' ORDER BY p.lastChecked';
      break;
    case OrderByMode.LatestPriceChange:
      sqlQueryAddon = ' ORDER BY p.lastUpdated DESC';
      break;
    case OrderByMode.OldestPriceChange:
      sqlQueryAddon = ' ORDER BY p.lastUpdated';
      break;
    case OrderByMode.PriceLowest:
      sqlQueryAddon = ' ORDER BY p.currentPrice';
      break;
    case OrderByMode.PriceHighest:
      sqlQueryAddon = ' ORDER BY p.currentPrice DESC';
      break;
    case OrderByMode.UnitPriceLowest:
      sqlQueryAddon = ' ORDER BY p.unitPrice';
      break;
    case OrderByMode.UnitPriceHighest:
      sqlQueryAddon = ' ORDER BY p.unitPrice DESC';
      break;
    case OrderByMode.Name:
      sqlQueryAddon = ' ORDER BY p.name';
      break;
    default:
    case OrderByMode.None:
      break;
  }
  return sqlQueryAddon;
}

// Takes a Store enum and returns a query string to be added onto an existing query
//  useAND=true if adding onto other WHERE conditions, useAND=false if this is the only condition
export function queryAddLimitStore(store: Store, useAND: boolean = true): string {
  let queryAddon = '';
  const optionalAND = useAND ? ' AND ' : ' WHERE ';

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

    case Store.NewWorld:
      queryAddon = optionalAND + "p.sourceSite = 'newworld.co.nz'";
      break;

    default:
      break;
  }
  return queryAddon;
}

// Takes a PriceHistoryLimit enum and returns a query string add-on to be added onto an existing query
//  can limit to products that have multiple price history elements to look at
export function queryAddPriceHistoryLimit(
  priceHistoryLimit: PriceHistoryLimit,
  useAND: boolean = true
): string {
  let queryAddon = useAND ? ' AND ' : ' WHERE ';

  switch (priceHistoryLimit) {
    case PriceHistoryLimit.TwoOrMore:
      queryAddon += 'ARRAY_LENGTH(p.priceHistory)>=2';
      break;

    case PriceHistoryLimit.FourOrMore:
      queryAddon += 'ARRAY_LENGTH(p.priceHistory)>=4';
      break;

    case PriceHistoryLimit.Any:
    default:
      return '';
  }
  return queryAddon;
}

// Limit to products that have been recently checked
export function queryAddLastChecked(lastChecked: LastChecked, useAND: boolean = true) {
  let queryAddon = useAND ? ' AND ' : ' WHERE ';
  queryAddon += "p.lastChecked > '";

  const todayModified = new Date();
  switch (lastChecked) {
    case LastChecked.Within3Days:
      todayModified.setDate(todayModified.getDate() - 3);
      break;

    case LastChecked.Within7Days:
      todayModified.setDate(todayModified.getDate() - 7);
      break;

    case LastChecked.Within30Days:
      todayModified.setDate(todayModified.getDate() - 30);
      break;

    case LastChecked.Any:
    default:
      return '';
  }

  // Convert processed date to ISO, example: p.lastChecked > '2023-04-02T07:05:25.902Z'
  queryAddon += todayModified.toISOString();

  // To improve potential caching, remove hours, mins, seconds, example: p.lastChecked > '2023-04-02'
  queryAddon = queryAddon.split('T')[0] + "'";

  return queryAddon;
}

// Fetch products by searching category
export async function DBFetchByCategory(
  searchTerm: string,
  maxItems: number = 20,
  store: Store = Store.Any,
  priceHistoryLimit: PriceHistoryLimit = PriceHistoryLimit.Any,
  orderBy: OrderByMode = OrderByMode.None,
  lastChecked: LastChecked = LastChecked.Within7Days
): Promise<Product[]> {
  const queryBase = 'SELECT * FROM products p WHERE ARRAY_CONTAINS(p.category, @name, true)';
  const querySpec: SqlQuerySpec = {
    query:
      queryBase +
      queryAddLimitStore(store, false) +
      queryAddLastChecked(lastChecked) +
      queryAddPriceHistoryLimit(priceHistoryLimit) +
      queryAddOrderBy(orderBy),
    parameters: [{ name: '@name', value: searchTerm }],
  };
  return await fetchProductsUsingSDK(querySpec, maxItems);
}

// Fetch products by searching name, with optional store selection
export async function DBFetchByName(
  searchTerm: string,
  maxItems: number = 60,
  store: Store = Store.Any,
  priceHistoryLimit: PriceHistoryLimit = PriceHistoryLimit.Any,
  orderBy: OrderByMode = OrderByMode.None,
  lastChecked: LastChecked = LastChecked.Within7Days
): Promise<Product[]> {
  // Replace hyphens in search term
  searchTerm = searchTerm.replace('-', ' ');

  const queryBase = 'SELECT * FROM products p WHERE CONTAINS(p.name, @name, true)';
  const querySpec: SqlQuerySpec = {
    query:
      queryBase +
      queryAddLimitStore(store, false) +
      queryAddLastChecked(lastChecked) +
      queryAddPriceHistoryLimit(priceHistoryLimit) +
      queryAddOrderBy(orderBy),
    parameters: [{ name: '@name', value: searchTerm }],
  };

  return await fetchProductsUsingSDK(querySpec, maxItems);
}

// Fetch products by searching with custom query
export async function DBFetchByQuery(
  sqlQuery: string,
  sqlParameters?: SqlParameter[],
  maxItems: number = 60
): Promise<Product[]> {
  const querySpec: SqlQuerySpec = {
    query: sqlQuery,
    parameters: sqlParameters,
  };

  return await fetchProductsUsingSDK(querySpec, maxItems);
}

// Fetch the most recent date from the database
export async function DBGetMostRecentDate(): Promise<string> {
  const querySpec: SqlQuerySpec = {
    query: 'SELECT * FROM products p ORDER BY p.lastChecked DESC',
  };

  // Access CosmosDB directly using the SDK
  if (await connectToCosmosDB()) {

    try {
      // Perform DB Fetch
      const dbResponse: FeedResponse<Product> = await container.items
        .query(querySpec, { maxItemCount: 1 })
        .fetchNext();

      if (dbResponse.resources !== undefined) {
        // Return the last checked date in medium date format
        return utcDateToMediumDate(dbResponse.resources[0].lastChecked);
      }
    } catch (error) {
      console.log('Error on DBMostRecentDate()\n' + error);
    }
  }
  return '';
}