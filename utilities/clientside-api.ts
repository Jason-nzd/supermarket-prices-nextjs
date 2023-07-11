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
      queryAddLastChecked(LastChecked.Within2Days, false),
  };
  // Exclude ORDER_BY as the CosmosDB API doesn't support it

  return await fetchProductsUsingAPI(queryObject, maxItems);
}

// When running on the client-side, fetches can be made to the REST API
async function fetchProductsUsingAPI(queryObject: object, maxItems: number): Promise<Product[]> {
  let resultingProducts: Product[] = [];

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

  const queryObject = {
    query:
      `SELECT * FROM products p WHERE CONTAINS(p.name, '${searchTerm}', true)` +
      queryAddLimitStore(store, false) +
      queryAddLastChecked(lastChecked) +
      queryAddPriceHistoryLimit(priceHistoryLimit),
  };

  console.log(JSON.stringify(queryObject));

  return await fetchProductsUsingAPI(queryObject, maxItems);
}
