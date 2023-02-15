import React from 'react';
import { Product } from '../typings';
import { priceTrendingDown, printPrice } from '../utilities';

interface Props {
  product: Product;
}

function PriceTag({ product }: Props) {
  return (
    <div className='z-50 w-min'>
      {/* If trending down, display in green and with down icon */}
      {priceTrendingDown(product.priceHistory) && (
        <div className='flex bg-white rounded-3xl border-2 border-[#8DF500] shadow-lg px-2'>
          <div className='mt-[0.16rem] text-sm lg:text-md'>$</div>
          <div className='mb-1 font-bold text-md lg:text-xl tracking-tighter'>
            {printDollars(product.currentPrice)}
          </div>
          <div className='pl-[0.1rem] mt-[0.2rem] font-semibold text-xs lg:text-sm tracking-normal'>
            {printCents(product.currentPrice)}
          </div>
          <div className='pl-1 items-center'>{upIcon}</div>
        </div>
      )}

      {/* If trending up, display in red and with up icon */}
      {!priceTrendingDown(product.priceHistory) && (
        <div className='flex bg-white rounded-3xl border-2 border-[#DB260A] shadow-lg px-2'>
          <div className='mt-[0.16rem] text-sm lg:text-md'>$</div>
          <div className='mb-1 font-bold text-md lg:text-xl tracking-tighter'>
            {printDollars(product.currentPrice)}
          </div>
          <div className='pl-[0.1rem] mt-[0.2rem] font-semibold text-xs lg:text-sm tracking-normal'>
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
    viewBox='0 0 20 20'
    fill='#8DF500'
    className='w-6 h-6 xl:w-8 xl:h-8'
  >
    <path
      fillRule='evenodd'
      d='M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z'
      clipRule='evenodd'
    />
  </svg>
);

const downIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='#DB260A'
    className='w-6 h-6 xl:w-8 xl:h-8'
  >
    <path
      fillRule='evenodd'
      d='M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z'
      clipRule='evenodd'
    />
  </svg>
);

export default PriceTag;
