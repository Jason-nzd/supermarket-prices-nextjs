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
    <div className='flex text-slate-600'>
      <div>Low:</div>
      <div className='font-semibold mr-4'>{printPrice(Math.min(...priceDataOnly))}</div>
      <div>High:</div>
      <div className='font-semibold'>{printPrice(Math.max(...priceDataOnly))}</div>
    </div>
  );
}

export default PriceHistoryTips;
