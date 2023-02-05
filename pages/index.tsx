import { FeedOptions } from '@azure/cosmos';
import { useEffect, useState } from 'react';
import WideProductCard from '../components/ProductCard';
import { Product } from '../typings';
import { connectToCosmosDB } from '../utilities';

interface Props {
  products: Product[];
}

// Products will be populated at build time by getStaticProps()
function Home({ products }: Props) {
  return (
    <main>
      <div
        className="flex flex-col px-2 md:px-8 lg:px-16 
      bg-top bg-cover bg-scroll bg-[url('../public/images/pexels-polina-tankilevitch-3735162-1.2k.jpg')]"
      >
        <div
          className='mt-8 grid max-w-[140em] m-auto
        grid-cols-2
        md:grid-cols-3 
        lg:grid-cols-4 
        xl:grid-cols-5 
        2xl:grid-cols-6'
        >
          {products.map((product) => (
            <WideProductCard key={product.id} product={product} />
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
    maxItemCount: 30,
  };

  // Fetch products as Product objects
  // const allProducts = (await container.items.readAll(options).fetchNext()).resources as Product[];

  const response = await container.items
    .query('SELECT * FROM products p WHERE ARRAY_LENGTH(p.priceHistory)>1', options)
    .fetchNext();
  const products = response.resources as Product[];

  return {
    props: {
      products,
    },
  };
}

export default Home;
