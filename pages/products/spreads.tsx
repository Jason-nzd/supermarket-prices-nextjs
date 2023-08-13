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
import Footer from '../../components/Footer';
import NavBar from 'components/NavBar/NavBar';

interface Props {
  valueButters: Product[];
  premiumButters: Product[];
  jams: Product[];
  honey: Product[];
  vegemite: Product[];
  hazelnut: Product[];
  marmalade: Product[];
  other: Product[];
  lastChecked: string;
}

const Category = ({
  valueButters,
  premiumButters,
  jams,
  honey,
  vegemite,
  hazelnut,
  marmalade,
  other,
  lastChecked,
}: Props) => {
  const theme = useContext(DarkModeContext).darkMode ? 'dark' : 'light';

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Categorised Product Grids*/}
          <ProductsGrid title='Value Nut Butters' products={valueButters} />
          <ProductsGrid title='Premium Nut Butters' products={premiumButters} />
          <ProductsGrid title='Jams' products={jams} />
          <ProductsGrid title='Honey' products={honey} />
          <ProductsGrid title='Vegemite & Marmite' products={vegemite} />
          <ProductsGrid title='Hazelnut' products={hazelnut} />
          <ProductsGrid title='Marmalade' products={marmalade} />
          <ProductsGrid title='Other Spreads' products={other} />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    'spreads',
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within2Days
  );

  let valueButters: Product[] = [];
  let premiumButters: Product[] = [];
  let jams: Product[] = [];
  let honey: Product[] = [];
  let vegemite: Product[] = [];
  let hazelnut: Product[] = [];
  let marmalade: Product[] = [];
  let other: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    if (name.match(/(fogg|pic|mother|brothers|macro|ceres).*butter/g)) premiumButters.push(product);
    else if (name.match('butter')) valueButters.push(product);
    else if (name.match('jam|berry')) jams.push(product);
    else if (name.includes('honey')) honey.push(product);
    else if (name.match('vegemite|marmite|yeast')) vegemite.push(product);
    else if (name.match('hazelnut|nutella')) hazelnut.push(product);
    else if (name.match('marmalade|lemon')) marmalade.push(product);
    else other.push(product);
  });

  // Sort all by unit price
  valueButters = sortProductsByUnitPrice(valueButters).slice(0, 15);
  premiumButters = sortProductsByUnitPrice(premiumButters).slice(0, 15);
  jams = sortProductsByUnitPrice(jams).slice(0, 15);
  honey = sortProductsByUnitPrice(honey).slice(0, 15);
  vegemite = sortProductsByUnitPrice(vegemite).slice(0, 15);
  hazelnut = sortProductsByUnitPrice(hazelnut).slice(0, 15);
  marmalade = sortProductsByUnitPrice(marmalade).slice(0, 15);
  other = sortProductsByUnitPrice(other).slice(0, 15);

  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      valueButters,
      premiumButters,
      jams,
      honey,
      vegemite,
      hazelnut,
      marmalade,
      other,
      lastChecked,
    },
  };
};

export default Category;
