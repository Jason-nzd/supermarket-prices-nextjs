import React from 'react';
import { DatedPrice } from '../../typings';
import { printPrice } from '../../utilities/utilities';

interface Props {
  priceHistory: DatedPrice[];
}

function PriceHistoryTips({ priceHistory }: Props) {
  const priceDataOnly = priceHistory.map((datedPrice) => {
    return datedPrice.price;
  });

  return (
    <div className='text-xs text-slate-600 grid grid-cols-2 w-fit gap-x-1 ml-auto'>
      <div className='text-right'>High:</div>
      <div className='text-left font-semibold'>{printPrice(Math.max(...priceDataOnly))}</div>
      <div className='text-right'>Low:</div>
      <div className='text-left font-semibold'>{printPrice(Math.min(...priceDataOnly))}</div>
    </div>
  );
}

export default PriceHistoryTips;
