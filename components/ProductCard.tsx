import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Product } from '../typings';
import { printPrice, transparentImageUrlBase } from '../utilities';
import PriceHistoryChart from './PriceHistoryChart';

interface Props {
  product: Product;
}

function handleClick() {
  console.log('ok');
}

function ProductCard({ product }: Props) {
  const linkHref = '/product/' + [product.id];
  return (
    <div
      className='relative bg-stone-50 max-w-[22em] min-w-[14em] flex flex-wrap m-1.5 p-0 
      sm:rounded-3xl sm:shadow-lg
      sm:ring-2 ring-white ring-opacity-50
      hover:scale-[102%] hover:shadow-2xl duration-300 ease-in-out cursor-pointer hover:bg-opacity-30
      dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:ring-2 dark:m-1.5'
      onClick={handleClick}
    >
      {/* Title div */}
      <div
        className='w-full pt-2 px-2 rounded-3xl text-[#3C8DA3]
    text-sm text-center h-14 font-semibold leading-4 z-20
    dark:bg-slate-800 dark:bg-opacity-70'
      >
        {product.name}
      </div>

      {/* Image div with overlayed size and price */}
      <div className='flex flex-auto relative w-auto h-auto'>
        <Image
          src={transparentImageUrlBase + product.id + '.jpg'}
          alt=''
          width={180}
          height={180}
          className='p-2 z-0 pt-0 object-cover mx-auto mt-0 w-[auto] -translate-y-14 scale-[60%]'
          // hover:scale-[110%] hover:-rotate-2 duration-500 ease-in-out'
        />

        {/* Size div */}
        <div
          className='z-20 absolute -top-4 left-4 p-1 px-2 bg-white bg-opacity-80
       text-xs text-slate-600 font-semibold rounded-3xl shadow-sm'
        >
          {product.size}
        </div>

        {/* Price div */}
        <div
          className='z-20 absolute top-20 left-40 p-1 bg-[#75F3A3] border-2 border-white
       w-auto text-center font-bold rounded-3xl shadow-lg
       dark:text-black'
        >
          {printPrice(product.currentPrice)}
        </div>

        {/* Price history chart div */}
        <div className='z-20 absolute pt-16 top-16 left-2 w-11/12 h-6 opacity-70'>
          <PriceHistoryChart priceHistory={product.priceHistory} />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
