import React from 'react';
import { Product } from '../typings';
import ImageWithFallback from './ImageWithFallback';
import PriceHistoryChart from './PriceHistoryChart';
import PriceHistoryTips from './PriceHistoryTips';
import PriceTag from './PriceTag';

interface Props {
  product: Product;
}

function handleClick() {
  console.log('ok');
}

function ProductCard({ product }: Props) {
  const linkHref = '/product/' + [product.id];

  return (
    <div
      className='bg-stone-50 max-w-[22em] grid m-0.5 lg:m-1 p-0 rounded-3xl shadow-lg
      hover:scale-[102%] hover:shadow-2xl duration-300 ease-in-out cursor-pointer hover:bg-opacity-90
      dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700 dark:ring-2 dark:m-1.5'
      onClick={handleClick}
    >
      {/* Title div */}
      <div
        className='w-full pt-2 px-3 rounded-3xl text-[#3C8DA3] text-sm text-center font-semibold
         leading-4 z-20 dark:bg-slate-800 dark:bg-opacity-70'
      >
        {product.name}
      </div>

      <div className='flex flex-auto w-auto h-auto'>
        {/* Image Div */}
        <div className='relative'>
          <div className='p-2 pr-0 object-cover'>
            <ImageWithFallback id={product.id} width={180} />
          </div>
          {/* Optional Size Div overlaid on top of image */}
          {product.size && (
            <div
              className='z-20 absolute top-[4rem] left-[1rem] p-1.5 px-3 
              bg-black bg-opacity-20 backdrop-blur-sm text-white text-sm font-semibold 
              ring-1 ring-white rounded-3xl shadow-md'
            >
              {product.size}
            </div>
          )}
        </div>
        <div className='w-3/4 lg:w-1/2'>
          {/* Price history chart Div */}
          <div className='pl-0 pt-4 pr-0.5'>
            <PriceHistoryChart priceHistory={product.priceHistory} />
          </div>

          {/* Price Div */}
          <div className='flex flex-row-reverse pr-4'>
            <PriceTag product={product} />
          </div>

          <div className='p-1 pt-2'>
            {product.priceHistory.length > 1 && (
              <PriceHistoryTips priceHistory={product.priceHistory} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
