import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Product } from '../typings';
import { priceTrendingDown, printPrice, transparentImageUrlBase } from '../utilities';
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
        <div className='z-20 absolute top-20 left-40 w-auto text-center font-bold'>
          {/* If trending down, display in green and with down icon */}
          {priceTrendingDown(product.priceHistory) && (
            <div className='bg-green-600 flex rounded-3xl shadow-lg p-1 border-2 border-white z-30'>
              <div>{printPrice(product.currentPrice)}</div>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181'
                />
              </svg>
            </div>
          )}

          {/* If trending up, display in red and with up icon */}
          {!priceTrendingDown(product.priceHistory) && (
            <div className='bg-red-600 flex rounded-3xl shadow-lg p-1 border-2 border-white z-30'>
              <div>{printPrice(product.currentPrice)}</div>
              <div>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941'
                  />
                </svg>
              </div>
            </div>
          )}
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
