import { FeedOptions, SqlQuerySpec } from '@azure/cosmos';
import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { connectToCosmosDB } from '../utilities';

interface Props {
  products: Product[];
}

// Products props will be populated at build time by getStaticProps()
function Home({ products }: Props) {
  return (
    <main>
      {/* Background Div */}
      <div className=''>
        {/* Central Aligned Div */}
        <div className='mx-auto w-full 2xl:max-w-[70%] '>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'></div>

          <ProductsGrid products={products} />
        </div>
      </div>
    </main>
  );
}

// This function gets called at build time on server-side.
export async function getStaticProps() {
  // Establish CosmosDB connection
  const countdownContainer = await connectToCosmosDB('supermarket-prices', 'products');

  // Set cosmos query options
  const options: FeedOptions = {
    maxItemCount: 15,
  };
  const querySpec: SqlQuerySpec = {
    query: 'SELECT * FROM products',
  };

  // Create a new products array, set only specific fields from CosmosDB
  let products: Product[] = [];

  // Perform DB fetch
  const response = await countdownContainer.items.query(querySpec, options).fetchNext();
  const hasMoreSearchResults = response.hasMoreResults;

  response.resources.map((productDocument) => {
    const { id, name, currentPrice, size, sourceSite, priceHistory } = productDocument;
    const p: Product = { id, name, currentPrice, size, sourceSite, priceHistory };
    products.push(p);
  });

  // Add 2nd database
  const multiStoreContainer = await connectToCosmosDB('supermarket-prices', 'supermarket-products');
  const multiStoreResponse = await multiStoreContainer.items.query(querySpec, options).fetchNext();
  multiStoreResponse.resources.map((productDocument) => {
    const { id, name, currentPrice, sourceSite, priceHistory } = productDocument;
    let size = '';

    const p: Product = { id, name, currentPrice, size, sourceSite, priceHistory };
    products.push(p);
  });

  // Sort all stores products by date
  products.sort((a, b) => {
    const dateA = new Date(a.priceHistory[a.priceHistory.length - 1].date);
    const dateB = new Date(b.priceHistory[b.priceHistory.length - 1].date);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });

  return {
    props: {
      products,
    },
  };
}

export default Home;
