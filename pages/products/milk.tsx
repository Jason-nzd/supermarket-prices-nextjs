import { GetStaticProps } from 'next';
import React from 'react';
import { Product } from '../../typings';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByName, DBGetProduct } from '../../utilities/cosmosdb';

interface Props {
  milkProducts: Product[];
  trimMilkProducts: Product[];
  oatMilkProducts: Product[];
  otherMilkProducts: Product[];
}

const Category = ({
  milkProducts,
  trimMilkProducts,
  oatMilkProducts,
  otherMilkProducts,
}: Props) => {
  return (
    <main>
      {/* Background Div */}
      <div className=''>
        {/* Central Aligned Div */}
        <div className='central-responsive-div'>
          {/* Categorised Product Grids*/}
          <div className='grid-title'>Standard Milk</div>
          <ProductsGrid products={milkProducts} />
          <div className='grid-title'>Trim Milk</div>
          <ProductsGrid products={trimMilkProducts} />
          <div className='grid-title'>Oat Milk</div>
          <ProductsGrid products={oatMilkProducts} />
          <div className='grid-title'>Other Milk</div>
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

  // Trim milk - specific items
  const trimMilkProducts: Product[] = [];
  trimMilkProducts.push(await DBGetProduct('282780', 'Countdown Trim Milk'));
  trimMilkProducts.push(await DBGetProduct('282773', 'Countdown Trim Milk'));
  trimMilkProducts.push(await DBGetProduct('282726', 'Anchor Trim Milk 99 7 Fat Free'));
  trimMilkProducts.push(await DBGetProduct('282817', 'Anchor Trim Milk 99 7 Fat Free'));
  trimMilkProducts.push(await DBGetProduct('P5201486', 'Value Trim Milk'));
  trimMilkProducts.push(await DBGetProduct('R939536', 'Meadow Fresh Trim Milk 2L White'));
  trimMilkProducts.push(await DBGetProduct('R939535', 'Meadow Fresh Calci Trim Milk 2L'));

  // Other milk use name lookups
  const oatMilkProducts = await DBFetchByName('oat milk', 10);
  const otherMilkProducts = await DBFetchByName('soy milk', 10);

  return {
    props: {
      milkProducts,
      trimMilkProducts,
      oatMilkProducts,
      otherMilkProducts,
    },
  };
};

export default Category;
