import { useState } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Product } from '../typings';
import ProductCard from './card/ProductCard';
import Link from 'next/link';

interface Props {
  titles?: string[];
  subTitle?: string;
  products: Product[];
  trimColumns?: boolean;
  createSearchLink?: boolean;
  createDeepLink?: string;
}

function ProductsGrid({
  titles = [],
  subTitle = '',
  products,
  trimColumns = false,
  createSearchLink = true,
  createDeepLink = '',
}: Props) {
  let numColumnsToShow = 3;
  let trimmedProducts: Product[] = [];
  if (trimColumns) {
    trimmedProducts = products;

    // For mobile viewports, trim products to 3 columns
    if (useMediaQuery('600px')) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 2));
    }
    // For small viewports, trim products to 3 columns
    if (useMediaQuery('980px')) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 3));
    }
    // For medium viewports, trim products to 4 columns
    if (useMediaQuery('1340px')) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 4));
      numColumnsToShow = 4;
    }
    // For large viewports, trim products to 5 columns
    if (useMediaQuery('2100px')) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 5));
      numColumnsToShow = 5;
    }
  }

  // const [scrollIndex, setScrollIndex] = useState(0);
  // const [productsWindow, setProductsWindow] = useState<Product[]>(
  //   products.slice(0, numColumnsToShow)
  // );

  // const scrollLeft = () => {
  //   if (scrollIndex > 0) {
  //     setScrollIndex(scrollIndex - 1);
  //     const startIndex = (scrollIndex - 1) * numColumnsToShow;
  //     const endIndex = scrollIndex * numColumnsToShow;

  //     setProductsWindow(products.slice(startIndex, endIndex));
  //     console.log('window - [' + startIndex + ' - ' + endIndex + ']');
  //   }
  // };

  // const scrollRight = () => {
  //   if (numColumnsToShow * scrollIndex < products.length) {
  //     setScrollIndex(scrollIndex + 1);
  //     const startIndex = scrollIndex * numColumnsToShow;
  //     const endIndex = (scrollIndex + 1) * numColumnsToShow;

  //     setProductsWindow(products.slice(startIndex, endIndex));
  //     console.log('window - [' + startIndex + ' - ' + endIndex + ']');
  //   }
  // };

  if (products.length > 0)
    return (
      <div>
        {/* Display grid title as-is if no createSearchLink option is set */}
        {!createSearchLink && createDeepLink.length == 0 && (
          <div className='grid-title'>{titles[0]}</div>
        )}

        {/* Create search links for each word */}
        {createDeepLink.length == 0 && createSearchLink && titles.length >= 1 && (
          <div className='flex w-fit mx-auto grid-title'>
            {titles.map((word) => (
              <Link
                href={`/client-search/?query=${word}`}
                key={word}
                className='hover-to-white mx-4'
              >
                {word}
              </Link>
            ))}
          </div>
        )}

        {/* Create deep category links for each word */}
        {createDeepLink.length > 1 && !createSearchLink && titles.length >= 1 && (
          <div className='flex w-fit mx-auto grid-title'>
            {titles.map((word) => (
              <Link
                href={`${createDeepLink}${word.toLowerCase()}`}
                key={word}
                className='hover-to-white mx-4'
              >
                {word}
              </Link>
            ))}
          </div>
        )}

        {/* Display sub-title only if it is non-blank */}
        {subTitle != '' && (
          <div className='mb-2 text-[#3C8DA3] text-center dark:text-zinc-300'>{subTitle}</div>
        )}
        <div className='flex items-center'>
          {/* {products.length +
        ' total products, window = ' +
        productsWindow.length +
        ' scroll = ' +
        scrollIndex}
      <button className='h-full border-2 rounded-xl p-2 hover:bg-white' onClick={scrollLeft}>
        L
      </button> */}

          {/* Div for products grid */}
          <div
            className='grid w-full mb-2
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
            {/* {productsWindow.map((product) => (
              <ProductCard key={product.id} product={product} />
                ))} */}
          </div>
          {/* <button className='h-full border-2 rounded-xl p-2 hover:bg-white' onClick={scrollRight}>
             R
             </button> */}
        </div>
      </div>
    );
  else return <div></div>;
}

export default ProductsGrid;

// Get the final multiplier that fits within the range of inputNum
// eg. inputNum = 45, multiplier = 6, returns 42 (7 multiples of 6)
function nextMultipleDown(inputNum: number, multiplier: number): number {
  let currentMultiple = multiplier;
  let lastMultiple = multiplier;
  while (true) {
    currentMultiple += multiplier;
    if (currentMultiple === inputNum) return inputNum;
    if (currentMultiple > inputNum) return lastMultiple;

    lastMultiple = currentMultiple;
  }
}
