import { GetStaticProps } from 'next';
import React from 'react';
import { Product } from '../../typings';
import _ from 'lodash';
import ProductsGrid from '../../components/ProductsGrid';
import { DBFetchByCategory, DBFetchByName, DBGetProduct } from '../../utilities/cosmosdb';
import { printPrice } from '../../utilities/utilities';

interface Props {
  size6: Product[];
  size7: Product[];
  size8plus: Product[];
  other: Product[];
}

const Category = ({ size6, size7, size8plus, other }: Props) => {
  return (
    <main>
      {/* Background Div */}
      <div className=''>
        {/* Central Aligned Div */}
        <div className='px-2 mx-auto w-fit lg:max-w-[99%] 2xl:max-w-[70%]'>
          {/* Categorised Product Grids*/}
          <div className='grid-title'>Mixed Range Eggs</div>
          <ProductsGrid products={other} />
          <div className='grid-title'>Size 6 Eggs</div>
          <ProductsGrid products={size6} />
          <div className='grid-title'>Size 7 Eggs</div>
          <ProductsGrid products={size7} />
          <div className='grid-title'>Size 8 and Above Eggs</div>
          <ProductsGrid products={size8plus} />
        </div>
      </div>
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let products = await DBFetchByCategory('eggs', 100);

  // Sub-categories to display separately on page
  let size6: Product[] = [];
  let size7: Product[] = [];
  let size8plus: Product[] = [];
  let other: Product[] = [];

  // Try derive per unit price of each product
  products.forEach((product) => {
    // Use regex to match digits
    const size = product.size?.toLowerCase();
    const quantityString = size?.match(/\d/g)?.join('');

    // Parse to int and check is within valid range
    if (quantityString !== undefined && parseInt(quantityString) < 50) {
      const quantity = parseInt(quantityString);

      // Set per egg unit price
      product.unitPrice = product.currentPrice / quantity;
      const pricePerEgg = printPrice(product.unitPrice);

      // Update size tag
      product.size = quantity + ' Pack\n\n' + pricePerEgg + '/egg';
    }
  });

  // Filter out products that could not derive a per unit price
  products = products.filter((product) => {
    if (product.unitPrice === undefined) return false;
    return true;
  });

  // Sort by unit price
  products.sort((a, b) => {
    if (a.unitPrice! < b.unitPrice!) return -1;
    if (a.unitPrice! > b.unitPrice!) return 1;
    return 0;
  });

  // Loop through all products and split by category
  products.forEach((product) => {
    if (product.name.toLowerCase().includes('size 6')) size6.push(product);
    else if (product.name.toLowerCase().includes('size 7')) size7.push(product);
    else if (
      product.name.toLowerCase().includes('size 8') ||
      product.name.toLowerCase().includes('size 9') ||
      product.name.toLowerCase().includes('size 10') ||
      product.name.toLowerCase().includes('jumbo')
    )
      size8plus.push(product);
    else other.push(product);
  });

  size6 = size6.slice(0, 10);
  size7 = size7.slice(0, 10);
  size8plus = size8plus.slice(0, 10);
  other = other.slice(0, 10);

  return {
    props: {
      size6,
      size7,
      size8plus,
      other,
    },
  };
};

export default Category;
