import { GetStaticProps } from 'next';
import React, { useContext } from 'react';
import { Product } from '../../typings';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory } from '../../utilities/cosmosdb';
import { DarkModeContext } from '../_app';
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer';
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  sortProductsByUnitPrice,
  utcDateToMediumDate,
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
          <ProductsGrid titles={['Standard Milk']} products={standardMilk} />
          <ProductsGrid titles={['Trim Milk']} products={trimMilk} />
          <ProductsGrid titles={['Oat Milk', 'Almond Milk', 'Soy Milk']} products={oatMilk} />
          <ProductsGrid titles={['Flavoured Milk']} products={flavouredMilk} />
          <ProductsGrid titles={['Other Milk']} products={otherMilk} createSearchLink={false} />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Fetch milk from DB
  let allMilk = await DBFetchByCategory(
    'milk',
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  // Append long life milk
  allMilk = allMilk.concat(
    await DBFetchByCategory(
      'long-life-milk',
      300,
      Store.Any,
      PriceHistoryLimit.Any,
      OrderByMode.None,
      LastChecked.Within3Days
    )
  );

  // Create sub categories of milk
  let standardMilk: Product[] = [];
  let trimMilk: Product[] = [];
  let oatMilk: Product[] = [];
  let flavouredMilk: Product[] = [];
  let otherMilk: Product[] = [];

  // Filter milk into sub categories based on product name keywords
  allMilk.forEach((product) => {
    const name = product.name.toLowerCase();
    if (!name.includes('powder')) {
      if (name.match('oat|almond|soy|lacto')) oatMilk.push(product);
      else if (name.match('trim|lite|light.blue|reduced')) trimMilk.push(product);
      else if (name.match('standard|original|blue|gate.milk.2l')) standardMilk.push(product);
      else if (name.match('chocolate|caramel|flavoured')) flavouredMilk.push(product);
      else if (name.match('milk')) otherMilk.push(product);
    }
  });

  // Sort all by unit price
  standardMilk = sortProductsByUnitPrice(standardMilk).slice(0, 15);
  trimMilk = sortProductsByUnitPrice(trimMilk).slice(0, 15);
  oatMilk = sortProductsByUnitPrice(oatMilk).slice(0, 15);
  flavouredMilk = sortProductsByUnitPrice(flavouredMilk).slice(0, 15);
  otherMilk = sortProductsByUnitPrice(otherMilk).slice(0, 15);

  // Store date, to be displayed in static page title bar
  const lastChecked = utcDateToMediumDate(new Date());

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
