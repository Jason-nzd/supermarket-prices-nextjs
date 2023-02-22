import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Product } from '../../typings';
import { connectToCosmosDB, searchProductName } from '../../utilities';
import _ from 'lodash';
import { FeedOptions, SqlQuerySpec } from '@azure/cosmos';
import ProductsGrid from '../../components/ProductsGrid';

interface Props {
  products: Product[];
  hasMoreSearchResults: boolean;
}

const Category = ({ products, hasMoreSearchResults }: Props) => {
  return (
    <main>
      {/* Background Div */}
      <div className=''>
        {/* Central Aligned Div */}
        <div className='mx-auto w-full 2xl:max-w-[70%] '>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>Milk Deals</div>

          <ProductsGrid products={products} />

          {hasMoreSearchResults && <div className='text-center m-4 text-lg'>Page 1 2 3 4 5</div>}
        </div>
      </div>
    </main>
  );
};

// Gets products from DB based on search term
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // Create a new products array, set only specific fields from CosmosDB
  let products: Product[] = [];

  // Establish CosmosDB connection
  const countdownContainer = await connectToCosmosDB('supermarket-prices', 'products');
  const multiStoreContainer = await connectToCosmosDB('supermarket-prices', 'supermarket-products');

  const countdownStandardMilk: Product = (
    await countdownContainer.item('282765', 'Countdown Standard Milk').read()
  ).resource;
  const warehouseStandardMilk: Product = (
    await multiStoreContainer.item('R1528048', 'Cow & Gate Blue Standard Milk 2L').read()
  ).resource;
  const paknsaveStandardMilk: Product = (
    await multiStoreContainer.item('P5201479', 'Value Standard Milk').read()
  ).resource;

  products.push(countdownStandardMilk);
  products.push(warehouseStandardMilk);
  products.push(paknsaveStandardMilk);

  //   // Set cosmos query options
  //   const options: FeedOptions = {
  //     maxItemCount: 15,
  //   };
  //   const querySpec: SqlQuerySpec = {
  //     query: 'SELECT * FROM products p WHERE CONTAINS(p.name, @name, true)',
  //     parameters: [{ name: '@name', value: searchTerm }],
  //   };

  //   // Perform DB fetch
  //   const response = await countdownContainer.items.query(querySpec, options).fetchNext();
  //   const hasMoreSearchResults = response.hasMoreResults;

  //   response.resources.map((productDocument) => {
  //     const { id, name, currentPrice, size, sourceSite, priceHistory } = productDocument;
  //     const p: Product = { id, name, currentPrice, size, sourceSite, priceHistory };
  //     products.push(p);
  //   });

  //   // Add 2nd database
  //   const multiStoreResponse = await multiStoreContainer.items.query(querySpec, options).fetchNext();
  //   multiStoreResponse.resources.map((productDocument) => {
  //     const { id, name, currentPrice, sourceSite, priceHistory } = productDocument;
  //     let size = '';

  //     const p: Product = { id, name, currentPrice, size, sourceSite, priceHistory };
  //     products.push(p);
  //   });

  //   // Sort all stores products by name
  //   products.sort((a, b) => {
  //     if (a.name < b.name) return -1;
  //     if (a.name > b.name) return 1;
  //     return 0;
  //   });

  return {
    props: {
      products,
      //   hasMoreSearchResults,
    },
  };
};

export default Category;
