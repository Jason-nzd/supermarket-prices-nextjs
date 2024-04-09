import { GetStaticPaths, GetStaticProps } from 'next';
import React, { useContext } from 'react';
import { Product } from 'typings';
import { utcDateToMediumDate } from 'utilities/utilities';
import ProductsGrid from 'components/ProductsGrid';
import { DBFetchByNameAndExcludeRegex } from 'utilities/cosmosdb';

import { DarkModeContext } from '../../_app';
import NavBar from '../../../components/NavBar/NavBar';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/router';

import _ from 'lodash';

interface Props {
  products: Product[];
  lastChecked: string;
}

const Fruit = ({ products, lastChecked }: Props) => {
  const router = useRouter();
  const { fruit } = router.query;
  const fruitTitle: string = fruit as string;
  const theme = useContext(DarkModeContext).darkMode ? 'dark' : 'light';

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Categorised Product Grids*/}
          <ProductsGrid titles={[_.startCase(fruitTitle)]} products={products} />
        </div>
      </div>
      <Footer />
    </main>
  );
};

const fruitNames = ['apples', 'bananas'];

// getAllStaticPaths()
// -------------------
// Takes an array of categories, and returns them in { path } format needed for static generation
export function getAllStaticPaths() {
  return fruitNames.map((name) => {
    return {
      params: {
        fruit: name,
      },
    };
  });
}

// Build static pages for all paths such /products/fruit/kiwifruit
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllStaticPaths(),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const searchTerm = params?.fruit as string;

  const products = await DBFetchByNameAndExcludeRegex(searchTerm, '', 'fruit');

  // Store date, to be displayed in static page title bar
  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      products,
      lastChecked,
    },
  };
};

export default Fruit;
