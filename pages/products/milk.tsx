import { GetStaticProps } from 'next';
import React, { useContext } from 'react';
import { Product } from '../../typings';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory } from '../../utilities/cosmosdb';
import { DarkModeContext } from '../_app';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import {
  OrderByMode,
  PriceHistoryLimit,
  Store,
  sortProductsByUnitPrice,
  utcDateToLongDate,
} from '../../utilities/utilities';

interface Props {
  standardMilk: Product[];
  trimMilk: Product[];
  oatMilk: Product[];
  flavouredMilk: Product[];
  otherMilk: Product[];
  lastChecked: string;
}

const Category = ({
  standardMilk,
  trimMilk,
  oatMilk,
  flavouredMilk,
  otherMilk,
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
          <div className='grid-title'>Standard Milk</div>
          <ProductsGrid products={standardMilk} />
          <div className='grid-title'>Trim Milk</div>
          <ProductsGrid products={trimMilk} />
          <div className='grid-title'>Oat Almond & Soy Milk</div>
          <ProductsGrid products={oatMilk} />
          <div className='grid-title'>Flavoured Milk</div>
          <ProductsGrid products={flavouredMilk} />
          <div className='grid-title'>Other Milk</div>
          <ProductsGrid products={otherMilk} />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Fetch all milk from DB
  let allMilk = await DBFetchByCategory('milk', 300);

  let standardMilk: Product[] = [];
  let trimMilk: Product[] = [];
  let oatMilk: Product[] = [];
  let flavouredMilk: Product[] = [];
  let otherMilk: Product[] = [];

  // Filter into sub categories
  allMilk.forEach((product) => {
    const name = product.name.toLowerCase();
    if (!name.includes('powder')) {
      if (name.match('oat|almond|soy|lacto')) oatMilk.push(product);
      else if (name.match('trim|lite|light.blue')) trimMilk.push(product);
      else if (name.match('standard|original|blue')) standardMilk.push(product);
      else if (name.match('chocolate|caramel|flavoured')) flavouredMilk.push(product);
      else if (name.match('milk')) otherMilk.push(product);
    }
  });

  console.log('Total Milk Fetched: ' + allMilk.length);

  // Sort all by unit price
  standardMilk = sortProductsByUnitPrice(standardMilk).slice(0, 15);
  trimMilk = sortProductsByUnitPrice(trimMilk).slice(0, 15);
  oatMilk = sortProductsByUnitPrice(oatMilk).slice(0, 15);
  flavouredMilk = sortProductsByUnitPrice(flavouredMilk).slice(0, 15);
  otherMilk = sortProductsByUnitPrice(otherMilk).slice(0, 15);

  const lastChecked = utcDateToLongDate(new Date());

  return {
    props: {
      standardMilk,
      trimMilk,
      oatMilk,
      flavouredMilk,
      otherMilk,
      lastChecked,
    },
  };
};

export default Category;
