import { useContext } from 'react';
import ProductsGrid from '../components/ProductsGrid';
import { Product } from '../typings';
import { DBFetchAll } from '../utilities/cosmosdb';
import { OrderByMode, PriceHistoryLimit, Store } from '../utilities/utilities';
import { ThemeContext } from './_app';

interface Props {
  countdownProducts: Product[];
  paknsaveProducts: Product[];
  warehouseProducts: Product[];
}

// Products props will be populated at build time by getStaticProps()
export default function Home({ countdownProducts, paknsaveProducts, warehouseProducts }: Props) {
  const theme = useContext(ThemeContext);

  return (
    <div className={theme}>
      {/* Background Div */}
      <div className='pt-1 pb-12'>
        {/* Central Aligned Div */}
        <div className='px-2 mx-auto w-[100%] 2xl:w-[70%] transition-all duration-500 min-h-screen'>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>
            Today's Trending Products
          </div>
          {countdownProducts && <ProductsGrid products={countdownProducts} />}
          {paknsaveProducts && <ProductsGrid products={paknsaveProducts} />}
          {warehouseProducts && <ProductsGrid products={warehouseProducts} />}
        </div>
      </div>
    </div>
  );
}

// Perform a DB lookup for each store, so all stores get some coverage on the home page
export async function getStaticProps() {
  const countdownProducts = await DBFetchAll(
    8,
    Store.Countdown,
    PriceHistoryLimit.FourOrMore,
    OrderByMode.Latest
  );

  const paknsaveProducts = await DBFetchAll(
    8,
    Store.Paknsave,
    PriceHistoryLimit.TwoOrMore,
    OrderByMode.Latest
  );

  const warehouseProducts = await DBFetchAll(
    4,
    Store.Warehouse,
    PriceHistoryLimit.TwoOrMore,
    OrderByMode.Latest
  );

  return {
    props: {
      countdownProducts,
      paknsaveProducts,
      warehouseProducts,
    },
  };
}
