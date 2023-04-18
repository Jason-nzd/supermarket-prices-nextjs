import _ from 'lodash';
import Link from 'next/link';
import React from 'react';
import { Product } from '../typings';
import { utcDateToLongDate, utcDateToShortDate } from '../utilities/utilities';
import ImageWithFallback from './ImageWithFallback';
import PriceHistoryChart from './card/PriceHistoryChart';
import PriceHistoryTips from './card/PriceHistoryTips';
import PriceTag from './card/PriceTag';
import StoreIcon from './StoreIcon';

interface Props {
  product: Product;
}

function ProductModalFull({ product }: Props) {
  const hasPriceHistory = product.priceHistory.length > 1;

  return (
    <div
      className='flex flex-col w-fit max-w-[90%] h-fit bg-white absolute top-5 mx-auto
     rounded-3xl shadow-2xl z-50'
    >
      <div className='flex flex-row'>
        {/* Image on left 2/3 */}
        <div className='relative w-2/3'>
          <div className='py-4 pl-4 pr-2 w-fit h-fit max-w-[600px]'>
            <ImageWithFallback
              id={product.id}
              width={600}
              src={'product-images/' + product.id + '.webp'}
            />
            {/* Optional Size div overlaid on top of image */}
            {product.size && <div className='size-tag'>{product.size}</div>}
          </div>
        </div>

        {/* Title, price chart and other information on right 1/3 */}
        <div className='flex flex-col w-1/3 min-w-[20rem] h-full pr-8'>
          {/* Title */}
          <div
            className='w-full h-12 pt-3 px-3 rounded-t-2xl text-[#3C8DA3] text-md
              text-center font-semibold'
          >
            {product.name}
          </div>

          {/* Price Chart */}
          <div className='w-[20rem] mt-6 pr-4'>
            <PriceHistoryChart
              priceHistory={product.priceHistory}
              lastChecked={product.lastChecked}
            />
          </div>

          {/* Price Tag */}
          <div className='mt-6 ml-4'>
            <PriceTag product={product} />
          </div>

          {/* Price Highest/Lowest */}
          <div className='mt-6 ml-4 text-sm'>
            {product.priceHistory.length > 1 && (
              <PriceHistoryTips priceHistory={product.priceHistory} />
            )}
          </div>

          {/* Categories */}
          {product.category != null && product.category!.length > 0 && (
            <div className='flex pr-3 items-center text-slate-400 text-sm mt-6 ml-4'>
              Categories:
              {product.category!.map((category, index) => {
                return (
                  <div className='px-1 hover:text-black' key={index}>
                    <Link href={'products/' + category}>{_.startCase(_.toLower(category))}</Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Last Updated */}
          <div className='text-slate-400 text-sm mt-6 ml-4'>
            Price Last Updated: {utcDateToLongDate(product.lastChecked)}
          </div>

          {/* Price Last Changed */}
          {hasPriceHistory && (
            <div className='text-slate-400 text-sm mt-2 ml-4'>
              Price Last Changed: {utcDateToLongDate(product.lastUpdated)}
            </div>
          )}

          {/* First Added */}
          <div className='text-slate-400 text-sm mt-2 ml-4 mb-4'>
            First Added to KiwiPrice: {utcDateToLongDate(product.priceHistory[0].date)}
          </div>
        </div>
      </div>

      {/* Source Site Div */}
      <div className='text-sm text-center mt-1'>
        {product.sourceSite.includes('countdown.co.nz') && (
          <div className='flex items-center justify-center gap-x-2 p-2 rounded-b-3xl text-white bg-[#007837]'>
            <StoreIcon sourceSite={product.sourceSite} width={20} />
            Countdown
          </div>
        )}
        {product.sourceSite === 'thewarehouse.co.nz' && (
          <div className='flex items-center justify-center gap-x-2 p-2 rounded-b-3xl text-white bg-[#c00]'>
            <StoreIcon sourceSite={product.sourceSite} width={20} />
            The Warehouse
          </div>
        )}
        {product.sourceSite === 'paknsave.co.nz' && (
          <div className='flex items-center justify-center gap-x-2 p-2 rounded-b-3xl text-black bg-[#ffd600]'>
            <StoreIcon sourceSite={product.sourceSite} width={20} />
            PAK'nSAVE
          </div>
        )}
        {/* Display unknown and future source sites using this temporary purple div */}
        {!product.sourceSite.includes('countdown.co.nz') &&
          product.sourceSite !== 'thewarehouse.co.nz' &&
          product.sourceSite !== 'paknsave.co.nz' && (
            <div className='rounded-b-3xl text-white bg-[#7a1ba0]'>{product.sourceSite}</div>
          )}
      </div>
    </div>
  );
}

export default ProductModalFull;
