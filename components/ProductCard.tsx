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
    <div className=''>
      <div className=''>
        <Image
          src={transparentImageUrlBase + product.id + '.jpg'}
          alt=''
          width={240}
          height={240}
        />
      </div>
      <div className=''>{product.name}</div>
      <div className=''>{product.size}</div>

      <div className=''>
        <div className=''>{printPrice(product.currentPrice)}</div>
      </div>
      <PriceHistoryChart priceHistory={product.priceHistory} />
    </div>
  );
}

export default ProductCard;
