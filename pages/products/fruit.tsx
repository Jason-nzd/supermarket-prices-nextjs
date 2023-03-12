import { GetStaticProps } from 'next';
import React from 'react';
import { Product } from '../../typings';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory, DBFetchByName } from '../../utilities/cosmosdb';

interface Props {
  apples: Product[];
  bananas: Product[];
  citrus: Product[];
  berries: Product[];
  other: Product[];
}

const Category = ({ apples, bananas, citrus, berries, other }: Props) => {
  return (
    <main>
      {/* Background Div */}
      <div className=''>
        {/* Central Aligned Div */}
        <div className='mx-auto w-full 2xl:max-w-[70%] '>
          {/* Categorised Product Grids*/}
          <div className='grid-title'>Apples</div>
          <ProductsGrid products={apples} />
          <div className='grid-title'>Bananas</div>
          <ProductsGrid products={bananas} />
          <div className='grid-title'>Oranges, Mandarins, Lemons, Limes</div>
          <ProductsGrid products={citrus} />
          <div className='grid-title'>Berries</div>
          <ProductsGrid products={berries} />
          <div className='grid-title'>Other Fruit</div>
          <ProductsGrid products={other} />
        </div>
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const countdownFruit = await DBFetchByCategory('fruit-veg', 60);
  const paknFruit = await DBFetchByCategory('fresh-fruit', 60);
  const products = countdownFruit.concat(paknFruit);

  const apples: Product[] = [];
  const bananas: Product[] = [];
  const citrus: Product[] = [];
  const berries: Product[] = [];
  let other: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    if (name.includes('apple')) apples.push(product);
    else if (name.includes('banana')) bananas.push(product);
    else if (name.includes('orange') || name.includes('mandarin')) citrus.push(product);
    else if (name.includes('lemon') || name.includes('lime')) citrus.push(product);
    else if (name.includes('berries') || name.includes('berry')) berries.push(product);
    else other.push(product);
  });
  other = other.slice(0, 20);

  // console.log(apples.length, bananas.length, citrus.length, berries.length, other.length);

  return {
    props: {
      apples,
      bananas,
      citrus,
      berries,
      other,
    },
  };
};

export default Category;
