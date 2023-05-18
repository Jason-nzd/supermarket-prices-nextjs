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
  utcDateToLongDate,
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
          <div className='grid-title'>Value Nut Butters</div>
          <ProductsGrid products={valueButters} trimColumns={false} />
          <div className='grid-title'>Premium Nut Butters</div>
          <ProductsGrid products={premiumButters} trimColumns={false} />
          <div className='grid-title'>Jams</div>
          <ProductsGrid products={jams} trimColumns={false} />
          <div className='grid-title'>Honey</div>
          <ProductsGrid products={honey} trimColumns={false} />
          <div className='grid-title'>Vegemite & Marmite</div>
          <ProductsGrid products={vegemite} trimColumns={false} />
          <div className='grid-title'>Hazelnut</div>
          <ProductsGrid products={hazelnut} trimColumns={false} />
          <div className='grid-title'>Marmalade</div>
          <ProductsGrid products={marmalade} trimColumns={false} />
          <div className='grid-title'>Other Spreads</div>
          <ProductsGrid products={other} trimColumns={false} />
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
  valueButters = sortProductsByUnitPrice(valueButters).slice(0, 40);
  premiumButters = sortProductsByUnitPrice(premiumButters).slice(0, 40);
  jams = sortProductsByUnitPrice(jams).slice(0, 40);
  honey = sortProductsByUnitPrice(honey).slice(0, 40);
  vegemite = sortProductsByUnitPrice(vegemite).slice(0, 20);
  hazelnut = sortProductsByUnitPrice(hazelnut).slice(0, 20);
  marmalade = sortProductsByUnitPrice(marmalade).slice(0, 20);
  other = sortProductsByUnitPrice(other).slice(0, 20);

  const lastChecked = utcDateToLongDate(new Date());

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
