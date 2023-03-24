import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { Product } from '../../typings';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory, DBFetchByName } from '../../utilities/cosmosdb';
import ResultsFilterPanel from '../../components/ResultsFilterPanel';
import { OrderByMode, PriceHistoryLimit, Store } from '../../utilities/utilities';
import { ThemeContext } from '../_app';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

interface Props {
  products: Product[];
  hasMoreSearchResults: boolean;
}

const Category = ({ products, hasMoreSearchResults }: Props) => {
  const router = useRouter();
  const { category } = router.query;
  const theme = useContext(ThemeContext);

  return (
    <main className={theme}>
      <NavBar />
      {/* Background Div */}
      <div className='pt-1 pb-12'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>
            {_.startCase(category?.toString())}
          </div>

          {/* Filter Selection */}
          <div className='ml-20'>{/* <ResultsFilterPanel /> */}</div>

          {/* Products Grid */}
          <ProductsGrid products={products} />

          {/* Pagination */}
          {hasMoreSearchResults && <div className='text-center m-4 text-lg'>Page 1 2 3 4 5</div>}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const categoryNames = [
  'rice',
  'fresh-vegetables',
  'ice-cream',
  'frozen-chips',
  'chocolate',
  'cat-food',
  'fish-seafood',
  'salmon',
  'ham',
  'bacon',
  'salami',
  'chips',
  'corn-chips',
  'yoghurt',
];

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

  // Try fetch products that have price history to show
  let products = await DBFetchByCategory(
    searchTerm,
    60,
    Store.Any,
    PriceHistoryLimit.TwoOrMore,
    OrderByMode.None,
    true
  );

  // If too few results are found, re-run query with any price history
  if (products.length <= 10) {
    products = await DBFetchByCategory(
      searchTerm,
      60,
      Store.Any,
      PriceHistoryLimit.Any,
      OrderByMode.None,
      true
    );
  }

  const hasMoreSearchResults = false;

  return {
    props: {
      products,
      hasMoreSearchResults,
    },
  };
};

export default Category;
