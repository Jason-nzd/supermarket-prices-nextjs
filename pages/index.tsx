import { CosmosClient } from '@azure/cosmos';
import ProductCard from '../components/ProductCard';

interface Props {
  products: Product[];
}

interface Product {
  name: string;
  id: string;
  price: number;
  size: string;
  lastUpdated: string;
  source: string;
}

// Products will be populated at build time by getStaticProps()
function Home({ products }: Props) {
  return (
    <div className='flex flex-col px-16 bg-green-500'>
      <h2 className='my-8 text-2xl'>Products Available</h2>
      <div className='grid grid-cols-3 md:grid-cols-5 lg:grid-cols:6'>
        {products.map((product) => (
          <ProductCard product={product} />
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
  // const { database } = await cosmosClient.database('supermarket-prices');
  const { database } = await cosmosClient.databases.createIfNotExists({ id: 'supermarket-prices' });
  const { container } = await database.containers.createIfNotExists({ id: 'products' });
  const products = (await (await container.items.readAll().fetchAll()).resources) as Product[];

  return {
    props: {
      products,
    },
  };
}

export default Home;
