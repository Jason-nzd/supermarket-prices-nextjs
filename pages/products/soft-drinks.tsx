import { GetStaticProps } from 'next';
import React, { useContext } from 'react';
import { Product } from '../../typings';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory } from '../../utilities/cosmosdb';
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  sortProductsByUnitPrice,
  utcDateToMediumDate,
} from '../../utilities/utilities';
import { DarkModeContext } from '../_app';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer';

interface Props {
  cans: Product[];
  large: Product[];
  lastChecked: string;
}

const Category = ({ cans, large, lastChecked }: Props) => {
  const theme = useContext(DarkModeContext).darkMode ? 'dark' : 'light';

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div min-h-[50rem]'>
          {/* Categorised Product Grids*/}
          <ProductsGrid
            titles={['Soft Drinks (Cans & Small Bottles)']}
            products={cans}
            trimColumns={true}
            createSearchLink={false}
          />
          <ProductsGrid
            titles={['Soft Drinks (Large Bottles)']}
            products={large}
            trimColumns={true}
            createSearchLink={false}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Fetch entire soft-drinks category from DB
  const products = await DBFetchByCategory(
    'soft-drinks',
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  // Separate cans and large soft drinks
  let cans: Product[] = [];
  let large: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    const size = product.size?.toLowerCase() || '';

    if (name.match('can|pack|tray') || size.match('can|pack|tray')) cans.push(product);
    else large.push(product);
  });

  // Sort all by unit price and limit total number of products shown
  cans = sortProductsByUnitPrice(cans).slice(0, 30);
  large = sortProductsByUnitPrice(large).slice(0, 30);

  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      cans,
      large,
      lastChecked,
    },
  };
};

export default Category;
