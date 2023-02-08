import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import ProductCard from '../../components/ProductCard';
import { Product } from '../../typings';
import { searchProductName } from '../../utilities';
import _ from 'lodash';

interface Props {
  products: Product[];
}

const Category = ({ products }: Props) => {
  const router = useRouter();
  const { category } = router.query;

  return (
    <main>
      {/* Background Div */}
      <div className='flex flex-col bg-top bg-cover bg-scroll'>
        {/* Central Aligned Div */}
        <div className='m-auto max-w-[99%] 2xl:max-w-[75%] '>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>
            {_.startCase(category?.toString())}
          </div>

          {/* Products Grid */}
          <div
            className='grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-5'
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export const categoryNames = ['milk', 'eggs', 'bread', 'meat', 'fruit', 'vegetables', 'ice cream'];

// Takes an array of category search terms, and returns them in { path } format
export function getAllStaticPaths() {
  return categoryNames.map((name) => {
    return {
      params: {
        category: name,
      },
    };
  });
}

// Builds static pages for dynamic routes such /products/milk
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllStaticPaths(),
    fallback: false, // can also be true or 'blocking'
  };
};

// Gets products from DB based on search term
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const searchTerm = params?.category as string;
  const products = await searchProductName(searchTerm);

  return {
    props: {
      products,
    },
  };
};

export default Category;
