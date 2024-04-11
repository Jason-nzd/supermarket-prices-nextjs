import startCase from 'lodash/startCase';
import Link from 'next/link';
import React, { useContext } from 'react';
import { DatedPrice, Product } from '../typings';
import {
  daysElapsedSinceDateFormatted,
  utcDateToLongDate,
  utcDateToMonthYear,
} from '../utilities/utilities';
import ImageWithFallback from './ImageWithFallback';
import PriceTag from './card/PriceTag';
import StoreIcon from './StoreIcon';
import { DarkModeContext } from '../pages/_app';
import dynamic from 'next/dynamic';

interface Props {
  product: Product;
  setIsModalOpen: (isOpen: boolean) => void;
}

// Lazy/Dynamic load in heavy chart.js from PriceHistoryChart
const DynamicChart = dynamic(() => import('./card/PriceHistoryChart'), {
  loading: () => <p>Loading...</p>,
});
interface ChartProps {
  priceHistory: DatedPrice[];
  lastChecked: Date;
  useLargeVersion: boolean;
}
function DynamicChartCall({ priceHistory, lastChecked }: ChartProps) {
  return (
    <DynamicChart priceHistory={priceHistory} lastChecked={lastChecked} useLargeVersion={true} />
  );
}

function ProductModalFull({ product, setIsModalOpen }: Props) {
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

  // Create a cleaned product name used for searching on the original store website
  let cleanedSearchName = product.name.split(' ').splice(0, 4).join(' ').replace('%', '');

  // Get the number of days since the last checked and last updated
  const daysSinceLastChecked = daysElapsedSinceDateFormatted(product.lastChecked);
  const daysSinceLastUpdated = daysElapsedSinceDateFormatted(product.lastUpdated);

  // Set dark mode theme from useContext
  const theme = useContext(DarkModeContext).darkMode ? 'dark' : 'light';

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    // Main modal div requires absolute and high z-index
    <div
      className={
        (theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'bg-white') +
        ' flex flex-col absolute mx-auto rounded-3xl z-50 shadow-2xl h-full ' +
        '  overflow-y-scroll overflow-x-hidden max-h-[90vh] no-scrollbar'
      }
    >
      {/* Top Title Div */}
      <div className='flex w-full mt-1 lg:mt-2 px-3'>
        {/* Title */}
        <div className='w-full'>
          <div className='w-fit mx-auto text-[#3C8DA3] text-lg font-semibold mb-0 lg:mb-4'>
            {product.name}
          </div>
        </div>

        {/* X Close Button */}
        <div className='ml-auto'>
          <div
            onClick={closeModal}
            className='absolute right-2 m-1 text-green-400 bg-green-50 rounded-full p-2
           cursor-pointer hover:shadow-md hover:bg-white'
          >
            {xIcon}
          </div>
        </div>
      </div>

      {/* Central Content Div */}
      <div className='flex flex-col mx-auto w-[calc(90vw)] lg:w-[calc(60vw)] h-full'>
        {/* Image and info upper div */}
        <div className='block md:flex h-2/3'>
          {/* Image with size tag - On left 2/3 for desktop, full width for mobile */}
          <div className='relative w-full md:w-2/3 m-1 mt-2 md:m-2'>
            {/* Image div - has min-h for mobile spacing */}
            <div className='p-1 md:py-4 md:pl-4 min-h-[230px]'>
              <ImageWithFallback id={product.id} src={'product-images/' + product.id + '.webp'} />
              {/* Size div overlaid on top of image */}
              {product.size && <div className='size-tag'>{product.size}</div>}
            </div>
          </div>

          {/* Other information on right 1/3 for desktop, full width for mobile */}
          <div className='flex flex-col w-full md:w-1/2 md:min-w-[20rem] p-2 h-fit my-auto'>
            {/* Div for price tag and stats sharing the same row */}
            <div className='flex w-fit mx-auto'>
              {/* Price Tag */}
              <div className='mt-2 lg:mt-6 ml-4 w-fit mr-2'>
                <PriceTag product={product} />
              </div>

              {/* Price Stats */}
              <div
                className='h-16 md:h-20 w-30 mt-2 lg:mt-6 mr-4 text-sm gray-ring
                  flex flex-wrap py-1 items-center'
              >
                <div className='mx-auto leading-tight md:leading-normal'>
                  <div className='flex'>
                    <div className='text-right pr-1 min-w-[4rem]'>Lowest:</div>
                    <div>${lowestPrice}</div>
                  </div>
                  <div className='flex'>
                    <div className='text-right pr-1 min-w-[4rem]'>Highest:</div>
                    <div>${highestPrice}</div>
                  </div>
                  <div className='flex'>
                    <div className='text-right pr-1 min-w-[4rem]'>Average:</div>
                    <div>${avgPrice}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            {product.category != null && product.category!.length > 0 && (
              <div className='flex items-center text-slate-400 text-sm mt-5 mb-4 mx-auto'>
                Category:
                {product.category!.map((category, index) => {
                  return (
                    <div className='px-1' key={index}>
                      <Link href={'products/' + category} className='small-link'>
                        {startCase(category.toLowerCase())}
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Various advanced stats are hidden on mobile to save screen space */}
            <div className='hidden md:flex flex-col mx-auto'>
              {/* Last Checked */}
              <div className='text-slate-400 text-sm mt-2 mx-auto flex w-full'>
                <div>Price Last Checked </div>
                <div className='pl-1 font-semibold'>{daysSinceLastChecked}</div>
              </div>

              {/* Last Updated */}
              <div className='text-slate-400 text-sm mt-2 mx-auto flex w-full'>
                <div>Price Last Changed</div>
                <div className='pl-1 font-semibold'>{daysSinceLastUpdated}</div>
              </div>
              <div className='text-slate-400 text-sm mx-auto flex w-full'>
                <div>on</div>
                <div className='pl-1 font-semibold'>{utcDateToLongDate(product.lastUpdated)}</div>
              </div>
            </div>

            {/* Original Site Search Link */}
            <div
              className={
                (theme === 'dark' ? 'bg-zinc-800 text-zinc-300' : 'text-slate-600') +
                ' text-sm my-2 mx-auto w-fit mb-4 mt-2 md:mt-6 pl-2'
              }
            >
              {product.sourceSite.includes('countdown.co.nz') && (
                <div className='external-link green-ring px-4'>
                  <a
                    target='_blank'
                    className='flex-col'
                    href={
                      'https://www.countdown.co.nz/shop/searchproducts?search=' + cleanedSearchName
                    }
                    rel='noopener noreferrer'
                  >
                    <div>'{product.name}'</div>
                    <div className='flex gap-x-1 items-center mx-auto w-fit'>
                      {boxArrow} countdown.co.nz
                    </div>
                  </a>
                </div>
              )}
              {product.sourceSite.includes('thewarehouse.co.nz') && (
                <div className='external-link red-ring px-4'>
                  <a
                    target='_blank'
                    className='flex-col'
                    href={'https://www.thewarehouse.co.nz/search?q=' + cleanedSearchName}
                    rel='noopener noreferrer'
                  >
                    <div>'{product.name}'</div>
                    <div className='flex gap-x-1 items-center mx-auto w-fit'>
                      {boxArrow} thewarehouse.co.nz
                    </div>
                  </a>
                </div>
              )}
              {product.sourceSite.includes('paknsave.co.nz') && (
                <div className='external-link yellow-ring px-4'>
                  <a
                    target='_blank'
                    className='flex-col'
                    href={'https://www.paknsave.co.nz/shop/Search?q=' + cleanedSearchName}
                    rel='noopener noreferrer'
                  >
                    <div>'{product.name}'</div>
                    <div className='flex gap-x-1 items-center mx-auto w-fit'>
                      {boxArrow} paknsave.co.nz
                    </div>
                  </a>
                </div>
              )}
              {product.sourceSite.includes('newworld.co.nz') && (
                <div className='external-link red-ring px-4'>
                  <a
                    target='_blank'
                    className='flex-col'
                    href={'https://www.newworld.co.nz/shop/search?q=' + cleanedSearchName}
                    rel='noopener noreferrer'
                  >
                    <div>'{product.name}'</div>
                    <div className='flex gap-x-1 items-center mx-auto w-fit'>
                      {boxArrow} newworld.co.nz
                    </div>
                  </a>
                </div>
              )}
            </div>

            {/* First Added */}
            <div className='text-slate-400 text-sm mb-2 mt-auto mx-auto hidden md:flex'>
              <div className='pr-1'>First added to KiwiPrice on</div>
              <div>{utcDateToMonthYear(product.priceHistory[0].date)}</div>
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className='flex w-full mx-auto h-25 md:h-1/3 px-2 lg:mb-2'>
          <DynamicChartCall
            priceHistory={product.priceHistory}
            lastChecked={product.lastChecked}
            useLargeVersion={true}
          />
        </div>
      </div>

      {/* Bottom Source Site Div */}
      <div className='text-sm text-center mt-auto'>
        {product.sourceSite.includes('countdown.co.nz') && (
          <div className='flex items-center justify-center gap-x-2 p-2 rounded-b-3xl text-white bg-[#007837]'>
            <StoreIcon sourceSite={product.sourceSite} width={20} />
            Woolworths
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
        {product.sourceSite === 'newworld.co.nz' && (
          <div className='flex items-center justify-center gap-x-2 p-2 rounded-b-3xl text-white bg-[#e11a2c]'>
            <StoreIcon sourceSite={product.sourceSite} width={20} />
            PAK'nSAVE
          </div>
        )}
        {/* Display unknown and future source sites using this temporary purple div */}
        {!product.sourceSite.includes('countdown.co.nz') &&
          product.sourceSite !== 'thewarehouse.co.nz' &&
          product.sourceSite !== 'newworld.co.nz' &&
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
      fillRule='evenodd'
      d='M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z'
    />
    <path
      fillRule='evenodd'
      d='M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z'
    />
  </svg>
);

const xIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    fill='currentColor'
    className='bi bi-x'
    viewBox='0 0 16 16'
  >
    <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708' />
  </svg>
);
