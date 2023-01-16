import { CosmosClient, FeedOptions } from '@azure/cosmos';
import ProductCard from '../components/ProductCard';
import { Product } from '../typings';

interface Props {
  products: Product[];
}

// Products will be populated at build time by getStaticProps()
function Home({ products }: Props) {
  return (
    <div className='flex flex-col px-16 bg-gradient-to-tr from-lime-500 to-lime-200'>
      <h2 className='my-8 text-2xl'>Products Available</h2>
      <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols:6'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

// This function gets called at build time on server-side.
export async function getStaticProps() {
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

  // Set cosmos query options
  const options: FeedOptions = {
    maxItemCount: 20,
  };

  // Fetch products as Product objects
  const products = (await container.items.readAll(options).fetchNext()).resources as Product[];
  console.log(`--- Fetching ${products.length} products`);

  return {
    props: {
      products,
    },
  };
}

export default Home;
