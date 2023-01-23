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
  const [scrollY, setScrollY] = useState(0);
  function logit() {
    setScrollY(window.pageYOffset);
    console.log(new Date().getTime());
  }
  useEffect(() => {
    function watchScroll() {
      window.addEventListener('scroll', logit);
    }
    watchScroll();
    return () => {
      window.removeEventListener('scroll', logit);
    };
  });

  return (
    <div className='bg-blue-600'>
      <NavBar />
      {/* <div className='fixed'>Scroll position: {scrollY}px</div> */}
      <div
        className='flex flex-col px-2 md:px-8 lg:px-16 bg-gradient-to-tr
       from-lime-500 to-lime-200
       dark:from-slate-800 dark:to-slate-900'
      >
        <div className='mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 max-w-[140em] m-auto'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
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
