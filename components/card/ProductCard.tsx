import React, { useState } from 'react';
import { Product } from '../../typings';
import ImageWithFallback from '../ImageWithFallback';
import { Dialog } from '@headlessui/react';
import ProductModalFull from '../ProductModalFull';
import StoreIcon from '../StoreIcon';
import PriceHistoryChart from './PriceHistoryChart';
import PriceTag from './PriceTag';
import PriceHistoryTips from './PriceHistoryTips';

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const showCategories = false;
  const hasPriceHistory = product.priceHistory.length > 1;

  function handleClick() {
    // Copy product id to clipboard when card is clicked
    navigator.clipboard.writeText(product.id);
    setIsModalOpen(true);
  }

  let [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className='product-card' onClick={handleClick} key={product.id}>
        {/* Title Div */}
        <div
          className='w-full h-12 pt-2 px-3 rounded-t-2xl text-[#3C8DA3] text-md lg:text-sm
                text-center font-semibold leading-5 lg:leading-4 z-20 dark:text-zinc-300'
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
            <div className='pl-0 pr-0.5 z-30'>
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
              <div className='ml-auto mt-2 pr-4 text-sm md:text-xs min-h-[1rem] pl-1'>
                {product.priceHistory.length > 1 && (
                  <PriceHistoryTips priceHistory={product.priceHistory} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Source Site Div */}
        <div className='text-sm text-center mt-2'>
          {product.sourceSite.includes('countdown.co.nz') && (
            <div
              className='flex items-center justify-center gap-x-2 p-1 rounded-b-2xl text-white
              bg-[#007837] dark:bg-transparent dark:text-zinc-300 dark:ring-[#007837] dark:ring-2'
            >
              <StoreIcon sourceSite={product.sourceSite} width={20} />
              Countdown
            </div>
          )}
          {product.sourceSite === 'thewarehouse.co.nz' && (
            <div
              className='flex items-center justify-center gap-x-2 p-1 rounded-b-2xl text-white
              bg-[#c00] dark:bg-transparent dark:text-zinc-300 dark:ring-[#970d0d] dark:ring-2'
            >
              <StoreIcon sourceSite={product.sourceSite} width={20} />
              The Warehouse
            </div>
          )}
          {product.sourceSite === 'paknsave.co.nz' && (
            <div
              className='flex items-center justify-center gap-x-2 p-1 rounded-b-2xl text-black
              bg-[#ffd600] dark:bg-transparent dark:text-zinc-300 dark:ring-[#ac910c] dark:ring-2'
            >
              <StoreIcon sourceSite={product.sourceSite} width={20} />
              PAK'nSAVE
            </div>
          )}
          {!product.sourceSite.includes('countdown.co.nz') &&
            product.sourceSite !== 'thewarehouse.co.nz' &&
            product.sourceSite !== 'paknsave.co.nz' && <div>{product.sourceSite}</div>}
        </div>
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className='fixed mx-auto max-h-[80rem] max-w-[80rem] w-[90%] h-[95%] inset-0 top-[5%] z-40'>
          <Dialog.Panel className=''>
            <ProductModalFull product={product} key={product.id} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

export default ProductCard;
