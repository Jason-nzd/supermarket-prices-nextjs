import { FeedOptions } from '@azure/cosmos';
import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
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

          {/* Products Grid */}
          <div
            className='grid
            grid-cols-2
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-4
            3xl:grid-cols-5'
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

// This function gets called at build time on server-side.
export async function getStaticProps() {
  // Get CosmosDB container
  const container = await connectToCosmosDB();

  // Set cosmos query options - limit to fetching 42 items at a time
  const options: FeedOptions = {
    maxItemCount: 25,
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
