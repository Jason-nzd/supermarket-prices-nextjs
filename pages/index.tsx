import { FeedOptions, SqlQuerySpec } from '@azure/cosmos';
import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { cleanProductFields, connectToCosmosDB, sortProductsByDate } from '../utilities';

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
  const container = await connectToCosmosDB();

  // Set cosmos query options
  const options: FeedOptions = {
    maxItemCount: 20,
  };
  const querySpec: SqlQuerySpec = {
    query: 'SELECT * FROM products p WHERE ARRAY_LENGTH(p.priceHistory)>2',
  };

  // Create a new products array, set only specific fields from CosmosDB
  let products: Product[] = [];

  // Perform DB fetch
  const response = await container.items.query(querySpec, options).fetchNext();
  const hasMoreSearchResults = response.hasMoreResults;

  response.resources.map((productDocument) => {
    products.push(cleanProductFields(productDocument));
  });

  return {
    props: {
      products,
    },
  };
}

export default Home;
