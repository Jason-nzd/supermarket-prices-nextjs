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
import { DarkModeContext } from '../_app';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer';

interface Props {
  products: Product[];
  hasMoreSearchResults: boolean;
  lastChecked: string;
}

const Category = ({ products, hasMoreSearchResults, lastChecked }: Props) => {
  const router = useRouter();
  const { category } = router.query;
  const theme = useContext(DarkModeContext).darkMode ? 'dark' : 'light';

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div min-h-[50rem]'>
          {/* Filter Selection */}
          <div className='ml-20'>{/* <ResultsFilterPanel /> */}</div>

          {/* Products Grid */}
          <ProductsGrid title={_.startCase(category?.toString())} products={products} />

          {/* Pagination */}
          {hasMoreSearchResults && <div className='text-center m-4 text-lg'>Page 1 2 3 4 5</div>}
        </div>
      </div>
      <Footer />
    </main>
  );
};

// Define all sub categories into separate arrays
export const freshCategory = [
  'eggs',
  'fruit',
  'fresh-vegetables',
  'salads-coleslaw',
  'bread',
  'bread-rolls',
  'specialty-bread',
];
export const chilledCategory = [
  'milk',
  'long-life-milk',
  'sour-cream',
  'cream',
  'yoghurt',
  'butter',
  'cheese',
  'cheese-slices',
  'salami',
  'vegan-vegetarian',
];
export const meatCategory = [
  'seafood',
  'salmon',
  'ham',
  'bacon',
  'pork',
  'beef-lamb',
  'chicken',
  'mince-patties',
  'sausages',
  'deli-meats',
];
export const frozenCategory = [
  'ice-cream',
  'ice-blocks',
  'pastries-cheesecake',
  'frozen-chips',
  'hash-browns',
  'frozen-vegetables',
  'frozen-fruit',
  'frozen-seafood',
  'pies-sausage-rolls',
  'pizza',
  'other-savouries',
];
export const pantryCategory = [
  'rice',
  'beans-spaghetti',
  'canned-fish',
  'canned-meat',
  'cereal',
  'spreads',
  'baking',
  'sauces',
  'oils-vinegars',
  'world-foods',
];
export const snacksCategory = [
  'chocolate',
  'chips',
  'crackers',
  'biscuits',
  'muesli-bars',
  'nuts-bulk-mix',
  'sweets-lollies',
  'other-snacks',
];
export const drinksCategory = [
  'black-tea',
  'green-tea',
  'herbal-tea',
  'drinking-chocolate',
  'coffee',
  'soft-drinks',
  'energy-drinks',
  'juice',
];
export const petsCategory = ['cat-food', 'cat-treats', 'dog-food', 'dog-treats'];

// Combine all sub-category arrays into one array.
// Each sub category will be built into fully static export pages
let categoryNames = freshCategory.concat(
  chilledCategory,
  meatCategory,
  frozenCategory,
  pantryCategory,
  snacksCategory,
  drinksCategory,
  petsCategory
);

// Remove special sub-categories witch have custom made pages instead of generated pages
categoryNames = categoryNames.filter((name) => {
  return !['eggs', 'fruit', 'milk', 'fresh-vegetables', 'spreads'].includes(name);
});

// Takes an array of categories, and returns them in { path } format
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
    LastChecked.Within7Days
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
