import React from 'react';
import { Product } from '../../typings';
import { getPriceAvgDifference } from '../../utilities/utilities';

interface Props {
  product: Product;
}

export default function PriceTag({ product }: Props) {
  let priceTagDivClass =
    'h-16 md:h-20 w-30 rounded-3xl border-2 shadow-md px-3 py-0.5 flex items-center hover-panel dark:bg-zinc-800 dark:text-zinc-300 ';
  let icon;

  // Convert product size in per/kg to per/100g if it will fit in a nicer range
  if (product.unitPrice) {
    if (
      product.originalUnitQuantity &&
      product.originalUnitQuantity < 500 &&
      product.originalUnitQuantity > 40 &&
      product.unitName === 'kg'
    ) {
      // Convert from per kg to per 100g
      product.unitName = '100g';
      product.unitPrice = product.unitPrice / 10;
    }
  }

  const priceDiff = getPriceAvgDifference(product.priceHistory);

  // If price difference from the average price is +/- 3%, print black border
  if (Math.abs(priceDiff) < 3) priceTagDivClass += 'border-black';
  // If price diff is +10%, print bold red border with up icon
  else if (priceDiff > 10) {
    priceTagDivClass += 'border-[#c91818]';
    icon = upIcon;
  }
  // If price diff is +3-10%, print mild red border with up icon
  else if (priceDiff > 3) {
    priceTagDivClass += 'border-[#b67f7f]';
    icon = upIcon;
  }
  // If price diff is +10%, print bold green border with up icon
  else if (priceDiff < 10) {
    priceTagDivClass += 'border-[#26df2f]';
    icon = downIcon;
  }
  // If price diff is +3-10%, print mild green border with up icon
  else if (priceDiff < 3) {
    priceTagDivClass += 'border-[#9fe4a2]';
    icon = downIcon;
  }

  return (
    <div className='z-50 min-w-[9rem]'>
      <div className={priceTagDivClass}>
        {/* Icon */}
        <div className='px-1'>
          <div className='pr-2 scale-[130%]'>{icon}</div>
          {priceDiff != 0 && <div className='text-sm font-semibold'>{Math.abs(priceDiff)}%</div>}
        </div>
        <div className='flex flex-col'>
          {/* Price */}
          <div className='flex' id='price'>
            {/* Dollar Symbol */}
            <div className='pt-[0.2rem] text-sm lg:text-md'>$</div>

            {/* Dollars */}
            <div className='font-bold text-xl lg:text-md lg:text-xl tracking-tighter'>
              {printDollars(product.currentPrice)}
            </div>

            {/* Cents */}
            <div className='pt-[0.2rem] pl-[0.1rem] font-semibold text-sm tracking-normal'>
              {printCents(product.currentPrice)}
            </div>
          </div>

          {/* Unit Price */}
          {product.unitPrice && product.unitName && product.unitPrice != 9999 && (
            <div className='flex text-md items-center'>
              <div className='text-xs'>$</div>
              <div className='font-semibold text-lg lg:text-md'>
                {/* Display unit price with 2 decimal points, such as $5.50,
                    unless it is a whole number such as $5 */}
                {product.unitPrice! == Number(product.unitPrice!.toFixed(0))
                  ? product.unitPrice!.toFixed(0)
                  : product.unitPrice!.toFixed(2)}
              </div>
              <div>{'/' + product.unitName || 'Unit'}</div>
            </div>
          )}
        </div>
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
