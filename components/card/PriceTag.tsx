import React from 'react';
import { Product } from '../../typings';
import { PriceTrend, priceTrend } from '../../utilities/utilities';

interface Props {
  product: Product;
}

function PriceTag({ product }: Props) {
  let priceTagDivClass = 'flex items-center bg-white rounded-3xl border-2 shadow-lg px-2 ';
  let icon;
  switch (priceTrend(product.priceHistory)) {
    // If trending down, display in green and with down icon
    case PriceTrend.Decreased:
      priceTagDivClass += 'border-[#8DF500]';
      icon = downIcon;
      break;

    // If trending up, display in red and with up icon
    case PriceTrend.Increased:
      priceTagDivClass += 'border-[#DB260A]';
      icon = upIcon;
      break;

    // Otherwise display in black with no icon
    default:
    case PriceTrend.Same:
      priceTagDivClass += 'border-black';
      break;
  }

  return (
    <div className='z-50 w-min'>
      <div className={priceTagDivClass}>
        {/* Dollar Symbol */}
        <div className='mb-[0.07rem] text-sm lg:text-md'>$</div>

        {/* Dollars */}
        <div className='mb-0.5 font-bold text-md lg:text-xl tracking-tighter'>
          {printDollars(product.currentPrice)}
        </div>

        {/* Cents */}
        <div className='pl-[0.1rem]  font-semibold text-xs lg:text-sm tracking-normal'>
          {printCents(product.currentPrice)}
        </div>

        {/* Icon */}
        <div className='pl-1 items-center'>{icon}</div>
      </div>
    </div>
  );
}

function printDollars(price: number) {
  if (price === null) return 'XX';
  else if (price.toString().includes('.')) {
    return price.toString().split('.')[0];
  } else return price.toString();
}

function printCents(price: number) {
  if (price === null) return 'XX';
  else if (price.toString().includes('.')) {
    return '.' + price.toString().split('.')[1].padEnd(2, '0');
  } else return '';
}

const upIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    fill='#DB260A'
    width='4'
    height='4'
    className='w-4 h-4 xl:w-6 xl:h-6'
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
    fill='#8DF500'
    width='4'
    height='4'
    className='w-4 h-4 xl:w-6 xl:h-6'
  >
    <path
      fillRule='evenodd'
      d='M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-1.025.275l-4.287-2.475a.75.75 0 01.75-1.3l2.71 1.565a19.422 19.422 0 00-3.013-6.024L7.53 11.533a.75.75 0 01-1.06 0l-5.25-5.25a.75.75 0 010-1.06z'
      clipRule='evenodd'
    />
  </svg>
);

export default PriceTag;
