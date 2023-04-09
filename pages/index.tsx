import { useContext } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { DBFetchAll } from '../utilities/cosmosdb';
import { OrderByMode, PriceHistoryLimit, Store, utcDateToShortDate } from '../utilities/utilities';
import { ThemeContext } from './_app';
import fs from 'fs';

interface Props {
  countdownProducts: Product[];
  paknsaveProducts: Product[];
  warehouseProducts: Product[];
}

// Products props will be populated at build time by getStaticProps()
export default function Home({ countdownProducts, paknsaveProducts, warehouseProducts }: Props) {
  const theme = useContext(ThemeContext);

  return (
    <main className={theme}>
      <NavBar />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>
            Today's Trending Products
          </div>
          {countdownProducts && (
            <ProductsGrid products={countdownProducts} key='countdown' trimColumns={true} />
          )}
          {paknsaveProducts && (
            <ProductsGrid products={paknsaveProducts} key='paknsave' trimColumns={true} />
          )}
          {warehouseProducts && (
            <ProductsGrid products={warehouseProducts} key='warehouse' trimColumns={true} />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

// Perform a DB lookup for each store, so all stores get some coverage on the home page
export async function getStaticProps() {
  const countdownProducts = await DBFetchAll(
    10,
    Store.Countdown,
    PriceHistoryLimit.FourOrMore,
    OrderByMode.Latest
  );

  const paknsaveProducts = await DBFetchAll(
    10,
    Store.Paknsave,
    PriceHistoryLimit.TwoOrMore,
    OrderByMode.Latest
  );

  const warehouseProducts = await DBFetchAll(
    10,
    Store.Warehouse,
    PriceHistoryLimit.TwoOrMore,
    OrderByMode.Latest
  );

  // Write the last Checked date to json, to later be read by components
  fs.writeFileSync(
    './utilities/dbLastChecked.json',
    JSON.stringify(utcDateToShortDate(countdownProducts[0].lastChecked, false, true))
  );

  return {
    props: {
      countdownProducts,
      paknsaveProducts,
      warehouseProducts,
    },
  };
}
