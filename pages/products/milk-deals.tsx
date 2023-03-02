import { GetStaticProps } from 'next';
import React from 'react';
import { Product } from '../../typings';
import { DBFetchByName, DBGetProduct } from '../../utilities/utilities';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';

interface Props {
  milkProducts: Product[];
  trimMilkProducts: Product[];
  oatSoyProducts: Product[];
  otherMilkProducts: Product[];
}

const Category = ({ milkProducts, trimMilkProducts, oatSoyProducts, otherMilkProducts }: Props) => {
  return (
    <main>
      {/* Background Div */}
      <div className=''>
        {/* Central Aligned Div */}
        <div className='mx-auto w-full 2xl:max-w-[70%] '>
          {/* Categorised Product Grids*/}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>Standard Milk</div>
          <ProductsGrid products={milkProducts} />
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>Trim Milk</div>
          <ProductsGrid products={trimMilkProducts} />
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>Oat & Soy Milk</div>
          <ProductsGrid products={oatSoyProducts} />
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>Other Milk</div>
          <ProductsGrid products={otherMilkProducts} />
        </div>
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // 2L Standard Milk using specific item lookups
  let milkProducts: Product[] = [];
  milkProducts.push(await DBGetProduct('282765', 'Countdown Standard Milk'));
  milkProducts.push(await DBGetProduct('R1528048', 'Cow & Gate Blue Standard Milk 2L'));
  milkProducts.push(await DBGetProduct('P5201479', 'Value Standard Milk'));

  // Other milk use name lookups
  const trimMilkProducts = await DBFetchByName('trim milk', 10);
  const oatSoyProducts = await DBFetchByName('oat milk', 10);
  const otherMilkProducts = await DBFetchByName('soy milk', 10);

  return {
    props: {
      milkProducts,
      trimMilkProducts,
      oatSoyProducts,
      otherMilkProducts,
    },
  };
};

export default Category;
