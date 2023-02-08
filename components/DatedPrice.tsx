import React from 'react';
import { DatedPrice } from '../typings';
import { printPrice } from '../utilities';

interface Props {
  datedPrice: DatedPrice;
}

function DatedPrice({ datedPrice }: Props) {
  return (
    <div className='flex border border-slate-200 rounded-xl px-3 py-1 text-xs font-semibold'>
      <div className='flex-none'>
        <div>{datedPrice.date.substring(4, 10)}</div>
        <div className='font-light text-gray-400'>{datedPrice.date.substring(11)}</div>
      </div>
      <div className='text-sm pl-4'>{printPrice(datedPrice.price, false).padEnd(8)}</div>
    </div>
  );
}

export default DatedPrice;
