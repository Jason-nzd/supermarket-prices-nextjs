import {
  Container,
  CosmosClient,
  FeedOptions,
  FeedResponse,
  ItemResponse,
  SqlParameter,
  SqlQuerySpec,
} from '@azure/cosmos';
import { useSampleProductsInstead } from './sample-products';
import { Product } from '../typings';
import {
  cleanProductFields,
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
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
  } catch (error) {
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
  orderBy: OrderByMode = OrderByMode.None,
  useRestAPIInsteadOfSDK: boolean = false
): Promise<Product[]> {
  // Query is built using the follow base, and adding on optional extra conditions
  const querySpec: SqlQuerySpec = {
    query:
      'SELECT * FROM products p' +
      queryAddLimitStore(store, false) +
      queryAddPriceHistoryLimit(priceHistoryLimit) +
      queryAddOrderBy(orderBy),
  };

  if (useRestAPIInsteadOfSDK) return await fetchProductsUsingAPI(querySpec, maxItems);
  else return await fetchProductsUsingSDK(querySpec, maxItems);
}

// When running on the client-side, fetches can be made to the REST API
async function fetchProductsUsingAPI(
  querySpec: SqlQuerySpec,
  maxItems: number
): Promise<Product[]> {
  let resultingProducts: Product[] = [];

  // CosmosDB Rest API doesn't support ORDER BY, so it needs to be removed
  const orderByIndex = querySpec.query.indexOf('ORDER BY');
  if (orderByIndex > 0) querySpec.query = querySpec.query.substring(0, orderByIndex);

  try {
    // Fetch response using POST
    const apiResponse = await fetch('https://api.kiwiprice.xyz/', {
      method: 'POST',
      body: JSON.stringify(querySpec),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'x-ms-max-item-count': maxItems.toString(),
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      signal: AbortSignal.timeout(8000),
    });

    // If successful, set resultingProducts to response json
    if (apiResponse.status === 200) {
      const apiJsonResponse = await apiResponse.json();
      const apiProducts: Product[] = apiJsonResponse.Documents;

      // Push products into array and clean unwanted fields from CosmosDB
      apiProducts.map((productDocument) => {
        resultingProducts.push(cleanProductFields(productDocument));
      });
    } else {
      console.log(apiResponse.statusText);
    }
  } catch (error) {
    console.error(error);
    // Todo: show error on page
  }
  return resultingProducts;
}

// Takes a completed query and performs the CosmosDB lookup
async function fetchProductsUsingSDK(
  querySpec: SqlQuerySpec,
  maxItems: number
): Promise<Product[]> {
  let resultingProducts: Product[] = [];

  // Log query to console
  console.log('SDK: ' + querySpec.query);
  if (querySpec.parameters !== undefined)
    console.log('\t' + querySpec.parameters[0].name + ' = ' + querySpec.parameters[0].value);

  // Access CosmosDB directly using the SDK
  if (await connectToCosmosDB()) {
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
        dbResponse.resources.map((productDocument, index) => {
          resultingProducts.push(cleanProductFields(productDocument));
        });
      }
    } catch (error) {
      console.log('Error on fetchProductsUsingSDK()\n' + error);
    }
  } else return useSampleProductsInstead();

  return resultingProducts;
}

// Takes an orderby enum and returns the corresponding SQL query add-on
function queryAddOrderBy(orderBy: OrderByMode): string {
  let sqlQueryAddon = '';
  switch (orderBy) {
    case OrderByMode.Latest:
      sqlQueryAddon = ' ORDER BY p.lastChecked DESC';
      break;
    case OrderByMode.Oldest:
      sqlQueryAddon = ' ORDER BY p.lastChecked';
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
function queryAddLastChecked(lastChecked: LastChecked, useAND: boolean = true) {
  let queryAddon = useAND ? ' AND ' : ' WHERE ';
  queryAddon += "p.lastChecked > '";

  let todayModified = new Date();
  switch (lastChecked) {
    case LastChecked.Within2Days:
      todayModified.setDate(todayModified.getDate() - 2);
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
  lastChecked: LastChecked = LastChecked.Within7Days,
  useRestAPIInsteadOfSDK: boolean = false
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
  if (useRestAPIInsteadOfSDK) return await fetchProductsUsingAPI(querySpec, maxItems);
  else return await fetchProductsUsingSDK(querySpec, maxItems);
}

// Fetch products by searching name, with optional store selection
export async function DBFetchByName(
  searchTerm: string,
  maxItems: number = 60,
  store: Store = Store.Any,
  priceHistoryLimit: PriceHistoryLimit = PriceHistoryLimit.Any,
  orderBy: OrderByMode = OrderByMode.None,
  lastChecked: LastChecked = LastChecked.Within7Days,
  useRestAPIInsteadOfSDK: boolean = false
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

  if (useRestAPIInsteadOfSDK) return await fetchProductsUsingAPI(querySpec, maxItems);
  else return await fetchProductsUsingSDK(querySpec, maxItems);
}

// Fetch products by searching with custom query
export async function DBFetchByQuery(
  sqlQuery: string,
  sqlParameters?: SqlParameter[],
  maxItems: number = 60,
  useRestAPIInsteadOfSDK: boolean = false
): Promise<Product[]> {
  const querySpec: SqlQuerySpec = {
    query: sqlQuery,
    parameters: sqlParameters,
  };
  if (useRestAPIInsteadOfSDK) return await fetchProductsUsingAPI(querySpec, maxItems);
  else return await fetchProductsUsingSDK(querySpec, maxItems);
}
