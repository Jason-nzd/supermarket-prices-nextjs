import Image from 'next/image';
import React from 'react';
import { Product } from '../typings';
import { printPrice } from '../utilities';
import PriceHistoryChart from './PriceHistoryChart';

interface Props {
  product: Product;
}

// Image are hosted on azure storage - combine this url with ID and .jpg to form the image url
const imageUrlBase = 'https://supermarketpricewatch.blob.core.windows.net/countdownimages/';

function ProductCard({ product }: Props) {
  return (
    <div className='w-auto max-w-[18em] h-auto shadow-lg p-2 m-2 rounded-3xl bg-white bg-opacity-30 backdrop-blur-lg'>
      <div className='bg-white px-4 rounded-2xl'>
        <Image src={imageUrlBase + product.id + '.jpg'} alt='' width={240} height={240} />
      </div>
      <div className='mt-2 p-2 min-h-[4em] bg-white bg-opacity-40 rounded-2xl flex items-center text-md font-semibold'>
        {product.name}
      </div>
      <div className='mt-2 pl-4 text-md bg-blue-100 rounded-xl bg-opacity-50'>{product.size}</div>

      <div className='flex'>
        <div className='text-2xl text-center pl-4'>{printPrice(product.currentPrice)}</div>
      </div>
      <PriceHistoryChart priceHistory={product.priceHistory} />
    </div>
  );
}

export default ProductCard;
