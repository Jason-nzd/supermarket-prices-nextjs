import { useContext } from 'react';
import Footer from '../components/Footer';
import NavBar from '../components/NavBar/NavBar';
import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { DBFetchAll } from '../utilities/cosmosdb';
import { OrderByMode, PriceHistoryLimit, Store, utcDateToMediumDate } from '../utilities/utilities';
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
            <ProductsGrid
              title=''
              products={countdownProducts}
              key='countdown'
              trimColumns={true}
            />
          )}
          {paknsaveProducts && (
            <ProductsGrid products={paknsaveProducts} key='paknsave' trimColumns={true} />
          )}
          {warehouseProducts && (
            <ProductsGrid
              title=''
              products={warehouseProducts}
              key='warehouse'
              trimColumns={true}
            />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

// Perform a DB lookup for each store, so all stores get some coverage on the home page
export async function getStaticProps() {
  const latestCountdownProducts = await DBFetchAll(
    40,
    Store.Countdown,
    PriceHistoryLimit.FourOrMore,
    OrderByMode.LatestPriceChange
  );

  // Filter out certain products which don't have interesting price fluctuations
  const countdownProducts = latestCountdownProducts
    .filter((product) => {
      return !product.name.toLowerCase().match('harris|bake|granola|cola');
    })
    .slice(0, 10);

  const paknsaveProducts = await DBFetchAll(
    10,
    Store.Paknsave,
    PriceHistoryLimit.FourOrMore,
    OrderByMode.LatestPriceChange
  );

  const warehouseProducts = await DBFetchAll(
    10,
    Store.Warehouse,
    PriceHistoryLimit.FourOrMore,
    OrderByMode.LatestPriceChange
  );

  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      countdownProducts,
      paknsaveProducts,
      warehouseProducts,
      lastChecked,
    },
  };
}
