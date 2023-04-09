import { GetStaticProps } from 'next';
import React, { useContext } from 'react';
import { Product } from '../../typings';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory } from '../../utilities/cosmosdb';
import {
  OrderByMode,
  PriceHistoryLimit,
  Store,
  sortProductsByUnitPrice,
} from '../../utilities/utilities';
import { ThemeContext } from '../_app';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

interface Props {
  apples: Product[];
  bananas: Product[];
  oranges: Product[];
  lemons: Product[];
  kiwifruit: Product[];
  peaches: Product[];
  berries: Product[];
  grapes: Product[];
  other: Product[];
}

const Category = ({
  apples,
  bananas,
  oranges,
  lemons,
  kiwifruit,
  peaches,
  berries,
  grapes,
  other,
}: Props) => {
  const theme = useContext(ThemeContext);

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={new Date()} />
      {/* Background Div */}
      <div className='content-body'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Categorised Product Grids*/}
          <div className='grid-title'>Apples</div>
          <ProductsGrid products={apples} trimColumns={true} />
          <div className='grid-title'>Bananas</div>
          <ProductsGrid products={bananas} trimColumns={true} />
          <div className='grid-title'>Oranges & Mandarins</div>
          <ProductsGrid products={oranges} trimColumns={true} />
          <div className='grid-title'>Lemons & Limes</div>
          <ProductsGrid products={lemons} trimColumns={true} />
          <div className='grid-title'>Kiwifruit</div>
          <ProductsGrid products={kiwifruit} trimColumns={true} />
          <div className='grid-title'>Peaches, Plus, & Nectarines</div>
          <ProductsGrid products={peaches} trimColumns={true} />
          <div className='grid-title'>Berries</div>
          <ProductsGrid products={berries} trimColumns={true} />
          <div className='grid-title'>Grapes</div>
          <ProductsGrid products={grapes} trimColumns={true} />
          <div className='grid-title'>Other Fruit</div>
          <ProductsGrid products={other} trimColumns={true} />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    'fresh-fruit',
    200,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    true
  );

  let apples: Product[] = [];
  let bananas: Product[] = [];
  let oranges: Product[] = [];
  let lemons: Product[] = [];
  let kiwifruit: Product[] = [];
  let peaches: Product[] = [];
  let berries: Product[] = [];
  let grapes: Product[] = [];
  let other: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    if (name.includes('apple') && !name.includes('pineapple')) apples.push(product);
    else if (name.includes('banana')) bananas.push(product);
    else if (name.match('orange|mandarin')) oranges.push(product);
    else if (!name.includes('avocado') && name.match('lemon|lime')) lemons.push(product);
    else if (name.includes('kiwifruit')) kiwifruit.push(product);
    else if (name.match('peach|nectarine')) peaches.push(product);
    else if (name.match('berries|berry')) berries.push(product);
    else if (name.includes('grapes')) grapes.push(product);
    else other.push(product);
  });
  other = other.slice(0, 20);

  // Sort all by unit price
  apples = sortProductsByUnitPrice(apples).slice(0, 15);
  bananas = sortProductsByUnitPrice(bananas).slice(0, 15);
  oranges = sortProductsByUnitPrice(oranges).slice(0, 15);
  kiwifruit = sortProductsByUnitPrice(kiwifruit).slice(0, 15);
  peaches = sortProductsByUnitPrice(peaches).slice(0, 15);
  berries = sortProductsByUnitPrice(berries).slice(0, 15);
  grapes = sortProductsByUnitPrice(grapes).slice(0, 15);
  other = other.slice(0, 30);

  // console.log(apples.length, bananas.length, citrus.length, berries.length, other.length);

  return {
    props: {
      apples,
      bananas,
      oranges,
      lemons,
      kiwifruit,
      peaches,
      berries,
      grapes,
      other,
    },
  };
};

export default Category;
