import React from 'react';
import NavBar from '../components/NavBar';
import WideProductCard from '../components/ProductCard';
import { Product } from '../typings';
import { getSearch } from '../utilities';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';

interface Props {
  products: Product[];
  searchTerm: string;
}

function search({ searchTerm, products }: Props) {
  const router = useRouter();
  const { terms } = router.query;
  const queryParams = router.query;

  return (
    <div className=''>
      <div
        className='flex flex-col px-2 md:px-8 lg:px-16 bg-gradient-to-tr
         from-lime-500 to-lime-200
         dark:from-slate-800 dark:to-slate-900'
      >
        <div className='mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 max-w-[140em] m-auto'>
          {products.map((product) => (
            <WideProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

// This function gets called at build time on server-side.

export const getStaticProps: GetStaticProps<{ products: Product[] }> = async (context) => {
  console.log(context.params);
  const products = await getSearch('ice cream');
  return {
    props: {
      products,
    },
  };
};

export default search;
