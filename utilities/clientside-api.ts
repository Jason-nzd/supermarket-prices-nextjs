import { Product } from 'typings';
import { LastChecked, PriceHistoryLimit, Store, cleanProductFields } from './utilities';
import { queryAddLastChecked, queryAddLimitStore, queryAddPriceHistoryLimit } from './cosmosdb';

// Fetch all products, with optional store selection
export async function DBFetchAllAPI(
  maxItems: number = 20,
  store: Store = Store.Any,
  priceHistoryLimit: PriceHistoryLimit = PriceHistoryLimit.Any
): Promise<Product[]> {
  const queryObject = {
    query:
      'SELECT * FROM products p' +
      queryAddLimitStore(store, false) +
      queryAddPriceHistoryLimit(priceHistoryLimit) +
      queryAddLastChecked(LastChecked.Within3Days, false),
  };
  // Exclude ORDER_BY as the CosmosDB API doesn't support it

  return await fetchProductsUsingAPI(queryObject, maxItems);
}

// When running on the client-side, fetches can be made to the REST API
async function fetchProductsUsingAPI(queryObject: object, maxItems: number): Promise<Product[]> {
  const maxRetries = 5;
  const retryDelay = 4000;
  const timeout = 30000;

  let retries = 0;

  while (retries <= maxRetries) {
    try {
      // Fetch response using POST
      const apiResponse = await fetch('https://api.kiwiprice.xyz/', {
        method: 'POST',
        body: JSON.stringify(queryObject),
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-ms-max-item-count': maxItems.toString(),
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        signal: AbortSignal.timeout(timeout),
      });

      // If successful, set resultingProducts to response json
      if (apiResponse.status === 200) {
        const apiJsonResponse = await apiResponse.json();
        const apiProducts: Product[] = apiJsonResponse.Documents;

        // Push products into array and clean unwanted fields from CosmosDB
        const resultingProducts: Product[] = apiProducts.map((productDocument) => {
          return cleanProductFields(productDocument);
        });

        return resultingProducts;
      } else {
        console.log(apiResponse.statusText);
        throw new Error(apiResponse.statusText);
      }
    } catch (error) {
      console.error(`REST API Retrying ${retries + 1}/${maxRetries}:`, error);

      // If all retries fail, rethrow the error
      if (retries === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      retries++;
    }
  }
  // If unable to connect to API, return an empty array
  return [];
}

// Fetch products by product name, with optional store selection
export async function DBFetchByNameAPI(
  searchTerm: string,
  maxItems: number = 60,
  store: Store = Store.Any,
  priceHistoryLimit: PriceHistoryLimit = PriceHistoryLimit.Any,
  lastChecked: LastChecked = LastChecked.Within7Days
): Promise<Product[]> {
  // Replace hyphens in search term
  searchTerm = searchTerm.replace('-', ' ');

  // Split search terms and build an SQL query using 'AND CONTAINS()' for each word
  const searchTerms = searchTerm.split(' ');
  const remainingSearchTerms = searchTerms.slice(1)

  const queryObject = {
    query:
      `SELECT * FROM products p WHERE CONTAINS(p.name, '${searchTerms[0]}', true)` +
      remainingSearchTerms.reduce((str, term) => str + ` AND CONTAINS(p.name, '${term}', true)`, "") +
      queryAddLimitStore(store, false) +
      queryAddLastChecked(lastChecked) +
      queryAddPriceHistoryLimit(priceHistoryLimit),
  };

  return await fetchProductsUsingAPI(queryObject, maxItems);
}
