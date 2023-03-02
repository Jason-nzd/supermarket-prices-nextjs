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
    <div className='text-xs text-slate-400 text-right pr-4'>
      <div>Highest: {printPrice(Math.max(...priceDataOnly))}</div>
      <div> Lowest: {printPrice(Math.min(...priceDataOnly))}</div>
    </div>
  );
}

export default PriceHistoryTips;
