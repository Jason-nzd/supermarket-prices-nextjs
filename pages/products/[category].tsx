import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { Product } from '../../typings';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory } from '../../utilities/cosmosdb';
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  sortProductsByUnitPrice,
  utcDateToLongDate,
} from '../../utilities/utilities';
import { ThemeContext } from '../_app';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

interface Props {
  products: Product[];
  hasMoreSearchResults: boolean;
  lastChecked: string;
}

const Category = ({ products, hasMoreSearchResults, lastChecked }: Props) => {
  const router = useRouter();
  const { category } = router.query;
  const theme = useContext(ThemeContext);

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div min-h-[50rem]'>
          {/* Page Title */}
          <div className='grid-title'>{_.startCase(category?.toString())}</div>

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
  //fresh
  'fresh-vegetables',
  'bread',
  'bread-rolls',

  //chilled
  //'milk',
  'yoghurt',
  'cheese',

  //meat
  'seafood',
  'salmon',
  'ham',
  'bacon',
  'beef-lamb',
  'chicken',
  'mince-patties',
  'salami',

  //frozen
  'ice-cream',
  'frozen-chips',
  'frozen-vegetables',
  'frozen-seafood',
  'pies-sausage-rolls',

  //pantry
  'rice',
  'chocolate',
  'cat-food',
  'chips',
  'corn-chips',
  'biscuits',
  'muesli-bars',

  //drinks
  'black-tea',
  'green-tea',
  'herbal-tea',
  'drinking-chocolate',
  'coffee',
  'soft-drinks',

  //other
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

  let products = await DBFetchByCategory(
    searchTerm,
    100,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within30Days
  );

  // Sort by unit price
  products = sortProductsByUnitPrice(products);

  const hasMoreSearchResults = false;

  const lastChecked = utcDateToLongDate(new Date());

  return {
    props: {
      products,
      hasMoreSearchResults,
      lastChecked,
    },
  };
};

export default Category;
