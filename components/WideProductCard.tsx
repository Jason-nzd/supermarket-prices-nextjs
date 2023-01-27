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
    <div className=' w-[16em] flex flex-wrap p-2' onClick={handleClick}>
      {/* Title div */}
      <div
        className='w-full bg-white rounded-t-3xl pt-1 px-2 
    text-md text-center h-14 font-semibold'
      >
        {product.name}
      </div>

      {/* Image div with overlayed size and price */}
      <div className='bg-white relative'>
        <Image
          src={transparentImageUrlBase + product.id + '.jpg'}
          alt=''
          width={200}
          height={200}
          className='object-cover mx-8'
        />

        {/* Size div */}
        <div
          className='absolute top-4 left-4 p-1 px-4 bg-white bg-opacity-70 rounded-3xl
       text-sm text-slate-600 font-semibold shadow-xl'
        >
          {product.size}
        </div>

        {/* Price div */}
        <div
          className='absolute top-40 left-40 p-1 bg-yellow-400 border-2 border-yellow-300
       w-auto text-center font-bold rounded-3xl shadow-md'
        >
          {printPrice(product.currentPrice)}
        </div>
      </div>

      {/* Price history chart div */}
      <div className='w-[15em]'>
        <PriceHistoryChart priceHistory={product.priceHistory} />
      </div>
    </div>
  );
}

export default WideProductCard;
