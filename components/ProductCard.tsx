import Image from 'next/image';
import React from 'react';
import { Product } from '../typings';
import { printPrice } from '../utilities';
import PriceHistoryChart from './PriceHistoryChart';

interface Props {
  product: Product;
}

// Image are hosted on azure storage - combine this url with ID and .jpg to form the image url
//const imageUrlBase = 'https://supermarketpricewatch.blob.core.windows.net/countdownimages/';
const transparentImageUrlBase =
  'https://supermarketpricewatch.blob.core.windows.net/transparent-cd-images/';

function ProductCard({ product }: Props) {
  return (
    <div className='w-auto max-w-[20em] shadow-lg p-2 m-2 rounded-3xl bg-white bg-opacity-30 backdrop-blur-lg'>
      <div className='px-4 rounded-t-2xl bg-white dark:bg-transparent py-2'>
        <Image
          src={transparentImageUrlBase + product.id + '.jpg'}
          alt=''
          width={240}
          height={240}
        />
      </div>
      <div
        className='p-2 min-h-[4em] max-h-[4em] bg-green-200 flex items-center font-semibold text-xs 
      sm:text-sm md:text-md'
      >
        {product.name}
      </div>
      <div className='pl-4 min-h-[2em] text-md bg-green-200 bg-opacity-60'>{product.size}</div>

      <div className='flex bg-green-200 bg-opacity-80'>
        <div className='text-2xl text-center pl-4'>{printPrice(product.currentPrice)}</div>
      </div>
      <PriceHistoryChart priceHistory={product.priceHistory} />
    </div>
  );
}

export default ProductCard;
