import React from 'react';
import { DatedPrice } from '../typings';

interface Props {
  priceHistory: DatedPrice[];
}

function PriceHistoryChart({ priceHistory }: Props) {
  let val: string = 'Price History ';

  //   if (priceHistory.length > 1) {
  //     priceHistory.map((datedPrice) => {
  //       val += '$' + datedPrice.price + ' > ';
  //       // val += datedPrice.date + ' ';
  //     });
  //   }

  for (let i = 0; i < priceHistory.length; i++) {
    val += '$' + priceHistory[i].price;
    if (i < priceHistory.length - 1) {
      // If the older price is higher than the new price, print upwards symbol
      if (priceHistory[i].price > priceHistory[i + 1].price) val += ' decreased to ';
      else val += ' increased to ';
    }
  }

  return (
    <div className='bg-blue-100 rounded-xl p-2 mt-4'>
      {val}
      <h5 className='text-sm font-light text-right'>Last Updated: {priceHistory[0].date}</h5>
    </div>
  );
}

export default PriceHistoryChart;
