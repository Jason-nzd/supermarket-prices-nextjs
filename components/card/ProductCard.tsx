import React from 'react';
import { Product } from '../../typings';
import { utcDateToShortDate } from '../../utilities/utilities';
import ImageWithFallback from '../ImageWithFallback';
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

  const showCategories = false;
  const showLastUpdated = true;

  return (
    <div className='product-card' onClick={handleClick}>
      {/* Title Div */}
      <div
        className='w-full h-12 pt-2 px-3 rounded-t-2xl text-[#3C8DA3] text-sm text-center font-semibold
         leading-4 z-20 dark:bg-slate-800 dark:bg-opacity-70'
      >
        {product.name}
      </div>

      {/* Central Div containing image, chart, price info */}
      <div className='flex flex-auto w-full h-full'>
        {/* Image Div */}
        <div className='relative w-2/5'>
          <div className=''>
            <ImageWithFallback id={product.id} addClasses='pl-2' />
          </div>

          {/* Optional Size Div overlaid on top of image */}
          {product.size && (
            <div
              className='z-20 absolute top-[4rem] left-[1rem] p-0.5 md:p-1.5 px-3 
              bg-black bg-opacity-[30%] backdrop-blur-sm text-white text-xs md:text-sm font-semibold 
              ring-1 ring-white rounded-2xl shadow-md'
            >
              {product.size}
            </div>
          )}
        </div>
        <div className='w-3/5'>
          {/* Price history chart Div */}
          <div className='pl-0 pt-4 pr-0.5'>
            <PriceHistoryChart priceHistory={product.priceHistory} />
          </div>

          {/* Price Tag Div */}
          <div className='flex flex-row-reverse pr-4'>
            <PriceTag product={product} />
          </div>

          {/* Price Tips Highest/Lowest Div */}
          <div className='p-1 pt-2 mr-auto'>
            {product.priceHistory.length > 1 && (
              <PriceHistoryTips priceHistory={product.priceHistory} />
            )}
          </div>
        </div>
      </div>

      {showCategories && product.category != null && product.category!.length > 0 && (
        <div className='text-xs text-slate-400 p-0.5 text-center leading-3'>
          {product.category!.join(', ')}
          {/* {product.category} */}
        </div>
      )}

      {showLastUpdated && (
        <div className='text-xs text-slate-300 p-1.5 text-center leading-3'>
          Price last updated {utcDateToShortDate(product.lastUpdated)}
        </div>
      )}

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

export default ProductCard;
