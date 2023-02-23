import React from 'react';
import { DatedPrice } from '../typings';
import { printPrice } from '../utilities';

interface Props {
  datedPrice: DatedPrice;
}

function DatedPrice({ datedPrice }: Props) {
  return (
    <div className='text-center border border-slate-200 rounded-md py-1 px-1 text-xs leading-3'>
      {/* <div className='flex-none'> */}
      <div className='font-light'>{datedPrice.date.substring(4, 10)}</div>
      {/* <div className='font-light text-gray-400'>{datedPrice.date.substring(11)}</div>
      </div> */}
      <div className='p-0.5'>{printPrice(datedPrice.price).padEnd(8)}</div>
    </div>
  );
}

export default DatedPrice;
