import React from 'react';
import { DatedPrice } from '../typings';
import { printPrice } from '../utilities';

interface Props {
  datedPrice: DatedPrice;
}

function DatedPrice({ datedPrice }: Props) {
  return (
    <div className='flex border border-slate-200 rounded-xl px-3 py-1'>
      <div>{datedPrice.date.substring(4)}</div>
      <div className='pl-4'>{printPrice(datedPrice.price, false)}</div>
    </div>
  );
}

export default DatedPrice;
