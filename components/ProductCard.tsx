import Image from 'next/image';
import React from 'react';
import { Product } from '../typings';
import PriceHistoryChart from './PriceHistoryChart';

interface Props {
  product: Product;
}

// Image are hosted on azure storage - combine this url with ID and .jpg to form the image url
const imageUrlBase = 'https://supermarketpricewatch.blob.core.windows.net/countdownimages/';

function ProductCard({ product }: Props) {
  return (
    <div className='w-96 h-auto items-start shadow-lg p-4 m-4 rounded-xl bg-white'>
      <div className=''>
        <Image
          src={imageUrlBase + product.id + '.jpg'}
          alt=''
          width={200}
          height={200}
          //   placeholder='blur'
        />
        <h3 className='flex items-center text-xl pl-4'>{product.name}</h3>
        <div className='pl-4'>{product.size}</div>
      </div>
      <div className='flex'>
        <div className='text-2xl text-center pl-4'>${product.currentPrice}</div>
      </div>
      <PriceHistoryChart priceHistory={product.priceHistory} />
    </div>
  );
}

export default ProductCard;
