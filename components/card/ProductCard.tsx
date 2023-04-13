import _ from 'lodash';
import Link from 'next/link';
import React from 'react';
import { Product } from '../../typings';
import { utcDateToShortDate } from '../../utilities/utilities';
import ImageWithFallback from '../ImageWithFallback';
import PriceHistoryChart from './PriceHistoryChart';
import PriceHistoryTips from './PriceHistoryTips';
import PriceTag from './PriceTag';
import { Popover } from '@headlessui/react';
import ProductModalFull from '../ProductModalFull';
import StoreIcon from '../StoreIcon';

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const showCategories = false;
  const hasPriceHistory = product.priceHistory.length > 1;

  function handleClick() {
    // Copy product id to clipboard when card is clicked
    navigator.clipboard.writeText(product.id);
  }

  return (
    <>
      {/* <Popover className=''>
       <Popover.Button> */}
      <div className='product-card' onClick={handleClick} key={product.id}>
        {/* Title Div */}
        <div
          className='w-full h-12 pt-2 px-3 rounded-t-2xl text-[#3C8DA3] text-md lg:text-sm
         text-center font-semibold leading-5 lg:leading-4 z-20 dark:bg-slate-800 dark:bg-opacity-70'
        >
          {product.name}
        </div>

        {/* Central Div containing image, chart, price info */}
        <div className='flex flex-auto w-full'>
          {/* Image Div */}
          <div className='relative w-full'>
            <div className='pl-2'>
              <ImageWithFallback
                id={product.id}
                width={200}
                src={'product-images/200/' + product.id + '.webp'}
              />
            </div>

            {/* Optional Size div overlaid on top of image */}
            {product.size && <div className='size-tag'>{product.size}</div>}
          </div>
          <div className='w-3/6'>
            {/* Price history chart Div */}
            <div className='pl-0 pr-0.5 z-50'>
              <PriceHistoryChart
                priceHistory={product.priceHistory}
                lastChecked={product.lastChecked}
              />
            </div>

            <div className='flex flex-col items-center'>
              {/* Price Tag Div */}
              <div className='m-1 mr-2 ml-auto pr-1'>
                <PriceTag product={product} />
              </div>

              {/* Price Tips Highest/Lowest Div */}
              {product.priceHistory.length > 1 && (
                <div className='my-1 ml-auto pr-4'>
                  <PriceHistoryTips priceHistory={product.priceHistory} />
                </div>
              )}
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

          {/* <div className='text-xs text-slate-400 p-2 mx-auto'>
            Last Updated {utcDateToShortDate(product.lastChecked, true)}
          </div> */}
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
        <div className='text-sm text-center mt-2'>
          {product.sourceSite.includes('countdown.co.nz') && (
            <div className='flex items-center justify-center gap-x-2 p-1 rounded-b-2xl text-white bg-[#007837]'>
              <StoreIcon sourceSite={product.sourceSite} width={20} />
              Countdown
            </div>
          )}
          {product.sourceSite === 'thewarehouse.co.nz' && (
            <div className='flex items-center justify-center gap-x-2 p-1 rounded-b-2xl text-white bg-[#c00]'>
              <StoreIcon sourceSite={product.sourceSite} width={20} />
              The Warehouse
            </div>
          )}
          {product.sourceSite === 'paknsave.co.nz' && (
            <div className='flex items-center justify-center gap-x-2 p-1 rounded-b-2xl text-black bg-[#ffd600]'>
              <StoreIcon sourceSite={product.sourceSite} width={20} />
              PAK'nSAVE
            </div>
          )}
          {!product.sourceSite.includes('countdown.co.nz') &&
            product.sourceSite !== 'thewarehouse.co.nz' &&
            product.sourceSite !== 'paknsave.co.nz' && <div>{product.sourceSite}</div>}
        </div>
      </div>
      {/* </Popover.Button>
      <Popover.Panel>
        <ProductModalFull product={product} key={product.id} />
      </Popover.Panel>
    </Popover> */}
    </>
  );
}

export default ProductCard;
