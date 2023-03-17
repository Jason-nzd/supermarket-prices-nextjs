import { GetStaticProps } from 'next';
import React from 'react';
import { Product } from '../../typings';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByName } from '../../utilities/cosmosdb';
import { OrderByMode, PriceHistoryLimit, Store } from '../../utilities/utilities';

interface Props {
  products: Product[];
}

const Category = ({ products }: Props) => {
  return (
    <main>
      {/* Background Div */}
      <div className=''>
        {/* Central Aligned Div */}
        <div className='px-2 mx-auto w-[100%] 2xl:w-[70%] transition-all duration-500'>
          {/* Categorised Product Grids*/}
          <div className='grid-title'>Bread</div>
          <ProductsGrid products={products} />
        </div>
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByName(
    'bread',
    40,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.Latest
  );

  return {
    props: {
      products,
    },
  };
};

export default Category;
