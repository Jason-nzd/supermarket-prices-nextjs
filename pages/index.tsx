import { useContext } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar/NavBar';
import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { DBFetchAll } from '../utilities/cosmosdb';
import { OrderByMode, PriceHistoryLimit, Store, utcDateToLongDate } from '../utilities/utilities';
import { DarkModeContext } from './_app';

interface Props {
  countdownProducts: Product[];
  paknsaveProducts: Product[];
  warehouseProducts: Product[];
  lastChecked: string;
}

// Products props will be populated at build time by getStaticProps()
export default function Home({
  countdownProducts,
  paknsaveProducts,
  warehouseProducts,
  lastChecked,
}: Props) {
  const theme = useContext(DarkModeContext).darkMode ? 'dark' : 'light';

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Page Title */}
          <div className='grid-title'>Today's Trending Products</div>
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

  const lastChecked = utcDateToLongDate(new Date());

  return {
    props: {
      countdownProducts,
      paknsaveProducts,
      warehouseProducts,
      lastChecked,
    },
  };
}
