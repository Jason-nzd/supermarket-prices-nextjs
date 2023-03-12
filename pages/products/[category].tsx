import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Product } from '../../typings';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByName } from '../../utilities/cosmosdb';
import ResultsFilterPanel from '../../components/ResultsFilterPanel';
import { OrderByMode, PriceHistoryLimit, Store } from '../../utilities/utilities';

interface Props {
  products: Product[];
  hasMoreSearchResults: boolean;
}

const Category = ({ products, hasMoreSearchResults }: Props) => {
  const router = useRouter();
  const { category } = router.query;

  return (
    <main>
      {/* Central Aligned Div */}
      <div className='px-2 mx-auto w-fit lg:max-w-[99%] 2xl:max-w-[70%]'>
        {/* Top Bar with Title and Filter Selection */}
        <div className='flex items-center w-fit'>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>
            {_.startCase(category?.toString())}
          </div>

          {/* Filter Selection */}
          <div className='ml-20'>{/* <ResultsFilterPanel /> */}</div>
        </div>

        {/* Products Grid */}
        <ProductsGrid products={products} />

        {/* Pagination */}
        {hasMoreSearchResults && <div className='text-center m-4 text-lg'>Page 1 2 3 4 5</div>}
      </div>
    </main>
  );
};

export const categoryNames = ['meat', 'vegetables', 'ice cream', 'cat', 'chocolate'];

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
    fallback: false,
  };
};

// Gets products from DB based on search term
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const searchTerm = params?.category as string;

  const products = await DBFetchByName(
    searchTerm,
    40,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.Latest
  );

  const hasMoreSearchResults = false;

  return {
    props: {
      products,
      hasMoreSearchResults,
    },
  };
};

export default Category;
