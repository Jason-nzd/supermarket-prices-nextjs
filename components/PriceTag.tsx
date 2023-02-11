import React from 'react';
import { Product } from '../typings';
import { priceTrendingDown, printPrice } from '../utilities';

interface Props {
  product: Product;
}

function PriceTag({ product }: Props) {
  return (
    <div className='z-50'>
      {/* If trending down, display in green and with down icon */}
      {priceTrendingDown(product.priceHistory) && (
        <div className='flex bg-white rounded-3xl border-2 border-[#8DF500] shadow-lg px-2'>
          <div className='mt-[0.16rem] text-md'>$</div>
          <div className='mb-1 font-bold text-xl tracking-tighter'>
            {printDollars(product.currentPrice)}
          </div>
          <div className='pl-[0.1rem] mt-[0.2rem] font-semibold text-sm tracking-normal'>
            {printCents(product.currentPrice)}
          </div>
          <div className='pl-1'>{upIcon}</div>
        </div>
      )}

      {/* If trending up, display in red and with up icon */}
      {!priceTrendingDown(product.priceHistory) && (
        <div className='flex bg-white rounded-3xl border-2 border-[#DB260A] shadow-lg px-2'>
          <div className='mt-[0.16rem] text-md'>$</div>
          <div className='mb-1 font-bold text-xl tracking-tighter'>
            {printDollars(product.currentPrice)}
          </div>
          <div className='pl-[0.1rem] mt-[0.2rem] font-semibold text-sm tracking-normal'>
            {printCents(product.currentPrice)}
          </div>
          <div className='pl-1'>{downIcon}</div>
        </div>
      )}
    </div>
  );
}

function printDollars(price: number) {
  return price.toString().split('.')[0];
}

function printCents(price: number) {
  if (price.toString().includes('.')) {
    return '.' + price.toString().split('.')[1].padEnd(2, '0');
  } else return '';
}

const upIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='2'
    stroke='#8DF500'
    className='w-8 h-8'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181'
    />
  </svg>
);

const downIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    viewBox='0 0 24 24'
    strokeWidth='2'
    stroke='#DB260A'
    className='w-8 h-8'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941'
    />
  </svg>
);

export default PriceTag;
