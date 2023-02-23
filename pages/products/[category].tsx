import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { Product } from '../../typings';
import {
  cleanProductFields,
  connectToCosmosDB,
  searchProductName,
  sortProductsByName,
} from '../../utilities';
import _ from 'lodash';
import { FeedOptions, SqlQuerySpec } from '@azure/cosmos';
import ProductsGrid from '../../components/ProductsGrid';

interface Props {
  products: Product[];
  hasMoreSearchResults: boolean;
}

const Category = ({ products, hasMoreSearchResults }: Props) => {
  const router = useRouter();
  const { category } = router.query;

  return (
    <main>
      {/* Background Div */}
      <div className=''>
        {/* Central Aligned Div */}
        <div className='mx-auto w-full 2xl:max-w-[70%] '>
          {/* Page Title */}
          <div className='my-4 pl-2 text-xl text-[#3C8DA3] font-bold'>
            {_.startCase(category?.toString())}
          </div>

          <ProductsGrid products={products} />

          {hasMoreSearchResults && <div className='text-center m-4 text-lg'>Page 1 2 3 4 5</div>}
        </div>
      </div>
    </main>
  );
};

export const categoryNames = ['milk', 'eggs', 'bread', 'meat', 'fruit', 'vegetables', 'ice cream'];

// Takes an array of category search terms, and returns them in { path } format
export function getAllStaticPaths() {
  return categoryNames.map((name) => {
    return {
      params: {
        category: name,
      },
    };
  });
}

// Builds static pages for dynamic routes such /products/milk
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllStaticPaths(),
    fallback: false, // can also be true or 'blocking'
  };
};

// Gets products from DB based on search term
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const searchTerm = params?.category as string;

  // Create a new products array to be populated by multiple DB lookups
  let products: Product[] = [];

  // Establish CosmosDB connection
  const container = await connectToCosmosDB();

  // Set cosmos query options
  const options: FeedOptions = {
    maxItemCount: 20,
  };

  // Countdown SQL Query
  const countdownQuery: SqlQuerySpec = {
    query: 'SELECT * FROM products p WHERE CONTAINS(p.name, @name, true)',
    parameters: [{ name: '@name', value: searchTerm }],
  };

  // Perform Countdown DB Fetch
  const countdownResponse = await container.items.query(countdownQuery, options).fetchNext();
  const hasMoreSearchResults = countdownResponse.hasMoreResults;

  // Push products into array and set only specific fields from CosmosDB
  countdownResponse.resources.map((productDocument) => {
    products.push(cleanProductFields(productDocument));
  });

  // Pak n Save SQL Query
  // const paknsaveQuery: SqlQuerySpec = {
  //   query:
  //     "SELECT * FROM products p WHERE CONTAINS(p.name, @name, true) AND p.sourceSite = 'paknsave.co.nz'",
  //   parameters: [{ name: '@name', value: searchTerm }],
  // };
  const paknsaveQuery: SqlQuerySpec = {
    query: 'SELECT * FROM products p WHERE ARRAY_CONTAINS(p.category, @name, true)',
    parameters: [{ name: '@name', value: searchTerm }],
  };

  // Perform DB fetch and push products into array
  const paknsaveResponse = await container.items.query(paknsaveQuery, options).fetchNext();
  paknsaveResponse.resources.map((productDocument) => {
    products.push(cleanProductFields(productDocument));
  });

  // The Warehouse SQL Query
  const warehouseQuery: SqlQuerySpec = {
    query:
      "SELECT * FROM products p WHERE CONTAINS(p.name, @name, true) AND p.sourceSite = 'thewarehouse.co.nz'",
    parameters: [{ name: '@name', value: searchTerm }],
  };

  // Perform DB fetch and push products into array
  const warehouseResponse = await container.items.query(warehouseQuery, options).fetchNext();
  // warehouseResponse.resources.map((productDocument) => {
  //   const { id, name, currentPrice, size, sourceSite, priceHistory } = productDocument;
  //   const p: Product = { id, name, currentPrice, size, sourceSite, priceHistory };
  //   products.push(p);
  // });

  // Sort all stores products by name
  sortProductsByName(products);

  return {
    props: {
      products,
      hasMoreSearchResults,
    },
  };
};

export default Category;
