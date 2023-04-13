import _ from 'lodash';
import Link from 'next/link';
import React from 'react';
import { Product } from '../typings';
import { utcDateToShortDate } from '../utilities/utilities';
import ImageWithFallback from './ImageWithFallback';
import PriceHistoryChart from './card/PriceHistoryChart';
import PriceHistoryTips from './card/PriceHistoryTips';
import PriceTag from './card/PriceTag';

interface Props {
  product: Product;
}

function ProductModalFull({ product }: Props) {
  const showCategories = true;
  const hasPriceHistory = product.priceHistory.length > 1;

  return (
    <div
      className='flex flex-col w-fit max-w-[90%] h-fit bg-white absolute top-5 mx-auto
     rounded-3xl shadow-2xl z-50'
    >
      {/* Title Div */}
      <div
        className='w-full h-12 pt-2 px-3 rounded-t-2xl text-[#3C8DA3] text-md
         text-center font-semibold leading-4 z-20 dark:bg-slate-800 dark:bg-opacity-70'
      >
        {product.name}
      </div>

      {/* Central Div containing image, chart, price info */}
      <div className='flex flex-row'>
        {/* Image Div */}
        <div className='relative w-1/2'>
          <div className='pl-12 scale-110'>
            <ImageWithFallback
              id={product.id}
              width={1000}
              src={'product-images/' + product.id + '.webp'}
            />
            {/* Optional Size div overlaid on top of image */}
            {product.size && <div className='size-tag'>{product.size}</div>}
          </div>
        </div>

        {/* Price history chart Div */}
        <div className='flex flex-col w-1/2'>
          <div className='pl-8'>
            <PriceHistoryChart
              priceHistory={product.priceHistory}
              lastChecked={product.lastChecked}
            />
          </div>

          <div className='w-1/6 bg-red-500'>
            <div className='flex flex-col'>
              {/* Price Tag Div */}
              <div className='m-1 mr-2 ml-auto pr-1'>
                <PriceTag product={product} />
              </div>

              {/* Price Tips Highest/Lowest Div */}
              {product.priceHistory.length > 1 && (
                <div className='mt-1 ml-auto pr-4'>
                  <PriceHistoryTips priceHistory={product.priceHistory} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='flex px-2 items-center'>
        {showCategories && product.category != null && product.category!.length > 0 && (
          <div className='flex pr-3 items-center'>
            {product.category!.map((category, index) => {
              return (
                <div className='text-xs text-slate-400 px-1 hover:text-black' key={index}>
                  <Link href={'products/' + category}>{_.startCase(_.toLower(category))}</Link>
                </div>
              );
            })}
          </div>
        )}

        <div className='text-xs text-slate-400 p-2 ml-auto'>
          Last Updated {utcDateToShortDate(product.lastChecked, true)}
        </div>
      </div>
      {/* {showLastUpdated && hasPriceHistory && (
        <div className='text-xs text-slate-300 p-1.5 text-center leading-3'>
          Price Last Changed {utcDateToShortDate(product.lastUpdated)}
        </div>
      )}

      {showLastUpdated && !hasPriceHistory && (
        <div className='text-xs text-slate-300 p-1.5 text-center leading-3'>
          First Added {utcDateToShortDate(product.lastUpdated)}
        </div>
      )} */}

      {/* Source Site Div */}
      <div className='text-sm text-center'>
        {product.sourceSite.includes('countdown.co.nz') && (
          <div className='p-1 rounded-b-2xl text-white bg-[#007837]'>Countdown</div>
        )}
        {product.sourceSite === 'thewarehouse.co.nz' && (
          <div className='p-1 rounded-b-2xl text-white bg-[#c00]'>The Warehouse</div>
        )}
        {product.sourceSite === 'paknsave.co.nz' && (
          <div className='p-1 rounded-b-2xl text-black bg-[#ffd600]'>PAK'nSAVE</div>
        )}
        {!product.sourceSite.includes('countdown.co.nz') &&
          product.sourceSite !== 'thewarehouse.co.nz' &&
          product.sourceSite !== 'paknsave.co.nz' && <div>{product.sourceSite}</div>}
      </div>
    </div>
  );
}

export default ProductModalFull;
