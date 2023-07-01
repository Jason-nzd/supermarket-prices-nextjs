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
import NavBar from '../../components/NavBar/NavBar';
import Footer from '../../components/Footer';

interface Props {
  apples: Product[];
  bananas: Product[];
  citrus: Product[];
  pears: Product[];
  kiwifruit: Product[];
  peaches: Product[];
  berries: Product[];
  pineapple: Product[];
  grapes: Product[];
  other: Product[];
  lastChecked: string;
}

const Category = ({
  apples,
  bananas,
  citrus,
  pears,
  kiwifruit,
  peaches,
  berries,
  pineapple,
  grapes,
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
          {apples.length > 0 && (
            <div>
              <div className='grid-title'>Apples</div>
              <ProductsGrid products={apples} trimColumns={false} />
            </div>
          )}
          {bananas.length > 0 && (
            <div>
              <div className='grid-title'>Bananas</div>
              <ProductsGrid products={bananas} trimColumns={false} />
            </div>
          )}
          {citrus.length > 0 && (
            <div>
              <div className='grid-title'>Citrus</div>
              <ProductsGrid products={citrus} trimColumns={false} />
            </div>
          )}
          {pears.length > 0 && (
            <div>
              <div className='grid-title'>Pears</div>
              <ProductsGrid products={pears} trimColumns={false} />
            </div>
          )}
          {kiwifruit.length > 0 && (
            <div>
              <div className='grid-title'>Kiwifruit & Feijoa</div>
              <ProductsGrid products={kiwifruit} trimColumns={false} />
            </div>
          )}
          {peaches.length > 0 && (
            <div>
              <div className='grid-title'>Peaches, Plums, & Nectarines</div>
              <ProductsGrid products={peaches} trimColumns={false} />
            </div>
          )}
          {berries.length > 0 && (
            <div>
              <div className='grid-title'>Berries</div>
              <ProductsGrid products={berries} trimColumns={false} />
            </div>
          )}
          {pineapple.length > 0 && (
            <div>
              <div className='grid-title'>Pineapple, Mango & Melon</div>
              <ProductsGrid products={pineapple} trimColumns={false} />
            </div>
          )}
          {grapes.length > 0 && (
            <div>
              <div className='grid-title'>Grapes</div>
              <ProductsGrid products={grapes} trimColumns={false} />
            </div>
          )}
          {other.length > 0 && (
            <div>
              <div className='grid-title'>Other Fruit</div>
              <ProductsGrid products={other} trimColumns={true} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    'fresh-fruit',
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days
  );

  let apples: Product[] = [];
  let bananas: Product[] = [];
  let citrus: Product[] = [];
  let pears: Product[] = [];
  let kiwifruit: Product[] = [];
  let peaches: Product[] = [];
  let berries: Product[] = [];
  let grapes: Product[] = [];
  let pineapple: Product[] = [];
  let other: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    if (name.includes('apple') && !name.includes('pineapple')) apples.push(product);
    else if (name.includes('banana')) bananas.push(product);
    else if (name.match('orange|mandarin|lemon|lime') && !name.match('avocado|juice'))
      citrus.push(product);
    else if (name.match('pears')) pears.push(product);
    else if (name.match('feijoa|kiwifruit')) kiwifruit.push(product);
    else if (name.match('peach|nectarine|plums')) peaches.push(product);
    else if (name.match('berry|berries')) berries.push(product);
    else if (name.match('pineapple|mango|melon')) pineapple.push(product);
    else if (name.includes('grapes')) grapes.push(product);
    else other.push(product);
  });
  other = other.slice(0, 20);

  // Sort all by unit price
  apples = sortProductsByUnitPrice(apples).slice(0, 15);
  bananas = sortProductsByUnitPrice(bananas).slice(0, 15);
  citrus = sortProductsByUnitPrice(citrus).slice(0, 15);
  kiwifruit = sortProductsByUnitPrice(kiwifruit).slice(0, 15);
  peaches = sortProductsByUnitPrice(peaches).slice(0, 15);
  pineapple = sortProductsByUnitPrice(pineapple).slice(0, 15);
  berries = sortProductsByUnitPrice(berries).slice(0, 15);
  grapes = sortProductsByUnitPrice(grapes).slice(0, 15);
  other = other.slice(0, 30);

  const lastChecked = utcDateToLongDate(new Date());

  return {
    props: {
      apples,
      bananas,
      citrus,
      pears,
      kiwifruit,
      peaches,
      berries,
      pineapple,
      grapes,
      other,
      lastChecked,
    },
  };
};

export default Category;
