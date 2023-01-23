import { FeedOptions, SqlQuerySpec } from '@azure/cosmos';
import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import ProductCard from '../components/ProductCard';
import { Product } from '../typings';
import { connectToCosmosDB } from '../utilities';

interface Props {
  products: Product[];
}

// Products will be populated at build time by getStaticProps()
function Home({ products }: Props) {
  return (
    <main className='container'>
      {/* <NavBar /> */}
      <div className=''>
        <div className='grid'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}

// This function gets called at build time on server-side.
export async function getStaticProps() {
  // Get CosmosDB container
  const container = await connectToCosmosDB();

  // Set cosmos query options - limit to fetching 24 items at a time
  const options: FeedOptions = {
    maxItemCount: 24,
  };

  // Fetch products as Product objects
  const products = (await container.items.readAll(options).fetchNext()).resources as Product[];
  const querySpec: SqlQuerySpec = {
    query: 'SELECT * FROM products p WHERE CONTAINS(p.name, @name, true)',
    parameters: [{ name: '@name', value: 'milk' }],
  };
  // const products = (await container.items.query(querySpec, options).fetchNext())
  //   .resources as Product[];
  console.log(`--- Fetching ${products.length} products`);

  return {
    props: {
      products,
    },
  };
}

export default Home;
