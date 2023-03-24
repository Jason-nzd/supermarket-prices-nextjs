import { GetStaticProps } from 'next';
import React, { useContext } from 'react';
import { Product } from '../../typings';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory } from '../../utilities/cosmosdb';
import { OrderByMode, PriceHistoryLimit, Store } from '../../utilities/utilities';
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
      <NavBar />
      {/* Background Div */}
      <div className='pt-1 pb-12'>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Categorised Product Grids*/}
          <div className='grid-title'>Apples</div>
          <ProductsGrid products={apples} />
          <div className='grid-title'>Bananas</div>
          <ProductsGrid products={bananas} />
          <div className='grid-title'>Oranges & Mandarins</div>
          <ProductsGrid products={oranges} />
          <div className='grid-title'>Lemons & Limes</div>
          <ProductsGrid products={lemons} />
          <div className='grid-title'>Kiwifruit</div>
          <ProductsGrid products={kiwifruit} />
          <div className='grid-title'>Peaches, Plus, & Nectarines</div>
          <ProductsGrid products={peaches} />
          <div className='grid-title'>Berries</div>
          <ProductsGrid products={berries} />
          <div className='grid-title'>Grapes</div>
          <ProductsGrid products={grapes} />
          <div className='grid-title'>Other Fruit</div>
          <ProductsGrid products={other} />
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

  const apples: Product[] = [];
  const bananas: Product[] = [];
  const oranges: Product[] = [];
  const lemons: Product[] = [];
  const kiwifruit: Product[] = [];
  const peaches: Product[] = [];
  const berries: Product[] = [];
  const grapes: Product[] = [];
  let other: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    if (name.includes('apple')) apples.push(product);
    else if (name.includes('banana')) bananas.push(product);
    else if (name.includes('orange') || name.includes('mandarin')) oranges.push(product);
    else if (name.includes('lemon') || name.includes('lime')) lemons.push(product);
    else if (name.includes('kiwifruit')) kiwifruit.push(product);
    else if (name.includes('peach') || name.includes('nectarine')) peaches.push(product);
    else if (name.includes('berries') || name.includes('berry')) berries.push(product);
    else if (name.includes('grapes')) grapes.push(product);
    else other.push(product);
  });
  other = other.slice(0, 20);

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
