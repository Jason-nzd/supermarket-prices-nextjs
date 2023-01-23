import Image from 'next/image';
import Link from 'next/link';
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
    <div>
      <button type='button' data-bs-toggle='modal' data-bs-target='#exampleModal'>
        ok
      </button>
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

      <div
        className='modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto'
        id='exampleModal'
        aria-labelledby='exampleModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog relative w-auto pointer-events-none'>
          <div className='modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current'>
            <div className='modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md'>
              <h5
                className='text-xl font-medium leading-normal text-gray-800'
                id='exampleModalLabel'
              >
                Modal title
              </h5>
              <button
                type='button'
                className='btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline'
                data-bs-dismiss='modal'
                aria-label='Close'
              ></button>
            </div>
            <div className='modal-body relative p-4'>Modal body text goes here.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
