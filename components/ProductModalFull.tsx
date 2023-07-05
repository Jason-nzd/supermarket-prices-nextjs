import startCase from 'lodash/startCase';
import Link from 'next/link';
import React, { useContext } from 'react';
import { DatedPrice, Product } from '../typings';
import { utcDateToLongDate } from '../utilities/utilities';
import ImageWithFallback from './ImageWithFallback';
import PriceTag from './card/PriceTag';
import StoreIcon from './StoreIcon';
import { DarkModeContext } from 'pages/_app';
import dynamic from 'next/dynamic';

interface Props {
  product: Product;
}

// Lazy/Dynamic load in heavy chart.js from PriceHistoryChart
const DynamicChart = dynamic(() => import('./card/PriceHistoryChart'), {
  loading: () => <p>Loading...</p>,
});
interface ChartProps {
  priceHistory: DatedPrice[];
  lastChecked: Date;
}
function DynamicChartCall({ priceHistory, lastChecked }: ChartProps) {
  return <DynamicChart priceHistory={priceHistory} lastChecked={lastChecked} />;
}

function ProductModalFull({ product }: Props) {
  const hasPriceHistory = product.priceHistory.length > 1;

  // Additional price stats for full product page
  let lowestPrice = 9999;
  let highestPrice = 0;
  let summedPrices = 0;
  let avgPrice = 0;

  // Loop through priceHistory array and generate price stats
  product.priceHistory.forEach((datedPrice) => {
    if (datedPrice.price < lowestPrice) lowestPrice = datedPrice.price;
    if (datedPrice.price > highestPrice) highestPrice = datedPrice.price;
    summedPrices += datedPrice.price;
  });

  // Calculate average price and differences
  avgPrice = Math.round((summedPrices / product.priceHistory.length) * 100) / 100;
  //const avgPriceDiff = (product.currentPrice / avgPrice) * 100 - 100;

  const theme = useContext(DarkModeContext).darkMode ? 'dark' : 'light';

  return (
    <div
      className={
        (theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'bg-white') +
        ' flex flex-col absolute mx-auto rounded-3xl z-50 shadow-2xl overflow-y-scroll max-h-[90%]'
      }
    >
      <div className='flex flex-col w-[90%] md:w-full md:flex-row mx-auto'>
        {/* Image on left 2/3 */}
        <div className='relative max-w-[calc(70vh)]'>
          <div className='p-2 md:py-4 md:pl-4 w-fit h-fit'>
            <ImageWithFallback
              id={product.id}
              width={900}
              src={'product-images/' + product.id + '.webp'}
            />
            {/* Optional Size div overlaid on top of image */}
            {product.size && <div className='size-tag'>{product.size}</div>}
          </div>
        </div>

        {/* Title, price chart and other information on right 1/3 */}
        <div className='flex flex-col w-full md:w-1/3 md:min-w-[20rem] md:pr-8'>
          {/* Title */}
          <div
            className='w-full h-12 pt-3 px-3 rounded-t-2xl text-[#3C8DA3] text-lg
              text-center font-semibold'
          >
            {product.name}
          </div>

          {/* Price Chart */}
          <div className='w-full md:w-[20rem] md:mt-6 md:pr-4 mx-auto'>
            <DynamicChartCall
              priceHistory={product.priceHistory}
              lastChecked={product.lastChecked}
            />
          </div>

          <div className='flex'>
            {/* Price Tag */}
            <div className='mt-6 ml-4 w-1/3 mr-2'>
              <PriceTag product={product} />
            </div>

            {/* Price Stats */}
            <div className='mt-6 text-sm ml-auto '>
              <div className='flex'>
                <div className='pr-1 w-[6rem]'>Lowest Price:</div>
                <div>${lowestPrice}</div>
              </div>
              <div className='flex'>
                <div className='pr-1 w-[6rem]'>Highest Price:</div>
                <div>${highestPrice}</div>
              </div>
              <div className='flex'>
                <div className='pr-1 w-[6rem]'>Average Price:</div>
                <div>${avgPrice}</div>
              </div>
            </div>
          </div>

          {/* Categories */}
          {product.category != null && product.category!.length > 0 && (
            <div className='flex pr-3 items-center text-slate-400 text-sm mt-6 ml-4'>
              Categories:
              {product.category!.map((category, index) => {
                return (
                  <div className='px-1 hover:text-black' key={index}>
                    <Link href={'products/' + category}>{startCase(category.toLowerCase())}</Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* First Added */}
          <div className='text-slate-400 text-sm mt-2 ml-4 flex'>
            <div className='pr-2'>First added to KiwiPrice on</div>
            <div>{utcDateToLongDate(product.priceHistory[0].date)}</div>
          </div>

          {/* Last Updated */}
          <div className='text-slate-400 text-sm my-2 ml-4 flex'>
            <div className='pr-2'>Price current as of</div>
            <div>{utcDateToLongDate(product.lastChecked)}</div>
          </div>

          {/* Original Site Search Link */}
          <div
            className={
              (theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'text-slate-600') +
              ' text-sm my-2 ml-4'
            }
          >
            {product.sourceSite.includes('countdown.co.nz') && (
              <div className='external-link green-ring'>
                <a
                  target='_blank'
                  className='flex-col'
                  href={'https://www.countdown.co.nz/shop/searchproducts?search=' + product.name}
                  rel='noopener noreferrer'
                >
                  <div>'{product.name}'</div>
                  <div className='flex gap-x-1 items-center mx-auto'>
                    {boxArrow} countdown.co.nz
                  </div>
                </a>
              </div>
            )}
            {product.sourceSite.includes('thewarehouse.co.nz') && (
              <div className='external-link red-ring'>
                <a
                  target='_blank'
                  className='flex-col'
                  href={'https://www.thewarehouse.co.nz/search?q=' + product.name}
                  rel='noopener noreferrer'
                >
                  <div>'{product.name}'</div>
                  <div className='flex gap-x-1 items-center mx-auto'>
                    {boxArrow} thewarehouse.co.nz
                  </div>
                </a>
              </div>
            )}
            {product.sourceSite.includes('paknsave.co.nz') && (
              <div className='external-link yellow-ring'>
                <a
                  target='_blank'
                  className='flex-col'
                  href={'https://www.paknsave.co.nz/shop/Search?q=' + product.name}
                  rel='noopener noreferrer'
                >
                  <div>'{product.name}'</div>
                  <div className='flex gap-x-1 items-center mx-auto'>{boxArrow} paknsave.co.nz</div>
                </a>
              </div>
            )}
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

const boxArrow = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    fill='currentColor'
    className='bi bi-box-arrow-up-right'
    viewBox='0 0 16 16'
  >
    <path
      fill-rule='evenodd'
      d='M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z'
    />
    <path
      fill-rule='evenodd'
      d='M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z'
    />
  </svg>
);
