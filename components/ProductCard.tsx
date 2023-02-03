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

function WideProductCard({ product }: Props) {
  const linkHref = '/product/' + [product.id];
  return (
    <div
      className='bg-stone-50 rounded-3xl shadow-lg max-w-[17em] min-w-[15em] flex flex-wrap m-1 p-1 
      bg-opacity-20 backdrop-blur-md ring-2 ring-white ring-opacity-50
      hover:scale-[102%] hover:shadow-2xl duration-300 ease-in-out cursor-pointer hover:bg-opacity-30
      dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:ring-2 dark:m-1.5'
      onClick={handleClick}
    >
      {/* Title div */}
      <div
        className='w-full pt-3 px-2 rounded-3xl text-black
    text-md text-center h-14 font-semibold leading-4 z-20
    dark:bg-slate-800 dark:bg-opacity-70'
      >
        {product.name}
      </div>

      {/* Image div with overlayed size and price */}
      <div className='mt-1 relative w-full'>
        <Image
          src={transparentImageUrlBase + product.id + '.jpg'}
          alt=''
          width={180}
          height={180}
          className='object-cover scale-[110%] mx-auto hover:scale-[120%] hover:-rotate-2 
          duration-500 ease-in-out'
        />

        {/* Size div */}
        <div
          className='absolute top-4 left-4 p-1 px-4 bg-white bg-opacity-80
       text-sm text-slate-600 font-semibold rounded-3xl shadow-lg'
        >
          {product.size}
        </div>

        {/* Price div */}
        <div
          className='absolute top-40 left-40 p-1 bg-yellow-400 border-2 border-yellow-300
       w-auto text-center font-bold rounded-3xl shadow-lg
       dark:text-black'
        >
          {printPrice(product.currentPrice)}
        </div>
      </div>

      {/* Price history chart div */}
      <div className='w-full'>
        <PriceHistoryChart priceHistory={product.priceHistory} />
      </div>
    </div>
  );
}

export default WideProductCard;
