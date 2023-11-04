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
          <ProductsGrid title='Apples' products={apples} trimColumns={false} />
          <ProductsGrid title='Bananas' products={bananas} trimColumns={false} />
          <ProductsGrid title='Citrus' products={citrus} trimColumns={false} />
          <ProductsGrid title='Pears' products={pears} trimColumns={false} />
          <ProductsGrid title='Kiwifruit & Feijoa' products={kiwifruit} trimColumns={false} />
          <ProductsGrid
            title='Peaches, Plums, & Nectarines'
            products={peaches}
            trimColumns={false}
          />
          <ProductsGrid title='Berries' products={berries} trimColumns={false} />
          <ProductsGrid title='Pineapple, Mango & Melon' products={pineapple} trimColumns={false} />
          <ProductsGrid title='Grapes' products={grapes} trimColumns={false} />
          <ProductsGrid title='Other Fruit' products={other} trimColumns={true} />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    'fruit',
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  // console.log(products.length + ' total fruit found (last checked within 7 days)');

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
  other = other.slice(0, 25);

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

  const lastChecked = utcDateToMediumDate(new Date());

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
