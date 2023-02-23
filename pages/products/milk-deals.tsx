import { GetStaticProps } from 'next';
import React from 'react';
import { Product } from '../../typings';
import { connectToCosmosDB } from '../../utilities';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';

interface Props {
  products: Product[];
}

const Category = ({ products }: Props) => {
  return (
    <main>
      {/* Background Div */}
      <div className=''>
        {/* Central Aligned Div */}
        <div className='mx-auto w-full 2xl:max-w-[70%] '>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>Milk Deals</div>
          <ProductsGrid products={products} />
        </div>
      </div>
    </main>
  );
};

// Gets products
export const getStaticProps: GetStaticProps = async () => {
  // Create a new products array, set only specific fields from CosmosDB
  let products: Product[] = [];

  // Establish CosmosDB connection
  const container = await connectToCosmosDB();

  const countdownStandardMilk: Product = (
    await container.item('282765', 'Countdown Standard Milk').read()
  ).resource;
  const warehouseStandardMilk: Product = (
    await container.item('R1528048', 'Cow & Gate Blue Standard Milk 2L').read()
  ).resource;
  const paknsaveStandardMilk: Product = (
    await container.item('P5201479', 'Value Standard Milk').read()
  ).resource;

  products.push(countdownStandardMilk);
  products.push(warehouseStandardMilk);
  products.push(paknsaveStandardMilk);

  return {
    props: {
      products,
    },
  };
};

export default Category;
