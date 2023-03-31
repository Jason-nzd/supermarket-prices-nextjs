import { useEffect, useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Product } from '../typings';
import ProductCard from './card/ProductCard';

interface Props {
  products: Product[];
  trimColumns?: boolean;
}

function ProductsGrid({ products, trimColumns = false }: Props) {
  let trimmedProducts: Product[] = [];
  if (trimColumns) {
    // Trim products to 3 columns
    if (useMediaQuery('980px')) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 3));
    }
    // Trim products to 4 columns
    if (useMediaQuery('1340px')) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 4));
    }
    // Trim products to 5 columns
    if (useMediaQuery('2100px')) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 5));
    }
  }
  return (
    <div
      className='grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-4
            3xl:grid-cols-5'
    >
      {!trimColumns &&
        products.map((product) => <ProductCard key={product.id} product={product} />)}
      {trimColumns &&
        trimmedProducts.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

export default ProductsGrid;

function nextMultipleDown(inputNum: number, multiplier: number): number {
  let currentMultiple = 0;
  let lastMultiple = 0;
  while (true) {
    currentMultiple += multiplier;
    if (currentMultiple === inputNum) return inputNum;
    if (currentMultiple > inputNum) return lastMultiple;

    lastMultiple = currentMultiple;
  }
}
