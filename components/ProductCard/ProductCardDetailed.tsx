import startCase from "lodash/startCase";
import Link from "next/link";
import { useContext } from "react";
import { DatedPrice, Product } from "../../typings";
import {
  daysElapsedSinceDateFormatted,
  getStoreEnum,
  Store,
  utcDateToLongDate,
  utcDateToMonthYear,
} from "../../utilities/utilities";
import ImageWithFallback from "../ImageWithFallback";
import PriceTag from "./PriceTag";
import { DarkModeContext } from "../../pages/_app";
import dynamic from "next/dynamic";
import CardFooter from "./CardFooter";

interface Props {
  product: Product;
  setIsModalOpen: (isOpen: boolean) => void;
}

// Lazy/Dynamic load in heavy chart.js from PriceHistoryChart
const DynamicChart = dynamic(() => import("./PriceHistoryChart"), {
  loading: () => <p>Loading...</p>,
});
interface ChartProps {
  priceHistory: DatedPrice[];
  lastChecked: Date;
  useLargeVersion: boolean;
}
function DynamicChartCall({ priceHistory, lastChecked }: ChartProps) {
  return (
    <DynamicChart
      priceHistory={priceHistory}
      lastChecked={lastChecked}
      useLargeVersion={true}
    />
  );
}

function ProductModalFull({ product, setIsModalOpen }: Props) {
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

  // Calculate average price
  avgPrice =
    Math.round((summedPrices / product.priceHistory.length) * 100) / 100;

  // Create a cleaned product name used for searching on the original store website
  const cleanedSearchName = product.name
    .split(" ")
    .splice(0, 6) // Limit to 6 words
    .join(" ")
    .replace("%", "");

  // Get the search URL for the corresponding original website
  let originalProductURLBase = "";
  switch (getStoreEnum(product)) {
    case Store.Countdown:
      originalProductURLBase =
        "https://www.woolworths.co.nz/shop/searchproducts?search=";
      break;
    case Store.Paknsave:
      originalProductURLBase = "https://www.paknsave.co.nz/shop/Search?q=";
      break;
    case Store.Warehouse:
      originalProductURLBase = "https://www.thewarehouse.co.nz/search?q=";
      break;
    case Store.NewWorld:
      originalProductURLBase = "https://www.newworld.co.nz/shop/search?q=";
      break;
    default:
      break;
  }

  // Get the number of days since the last checked and last updated
  const daysSinceLastChecked = daysElapsedSinceDateFormatted(
    product.lastChecked,
  );
  const daysSinceLastUpdated = daysElapsedSinceDateFormatted(
    product.lastUpdated,
  );

  // Set dark mode theme from useContext
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  return (
    // Main modal div requires absolute and high z-index
    <div
      className={
        (theme === "dark"
          ? "bg-zinc-900/50 text-zinc-100 backdrop-blur-3xl"
          : "bg-zinc-50/50 text-green-800 backdrop-blur-lg") +
        " flex flex-col absolute mx-auto rounded-3xl z-50 shadow-2xl" +
        " overflow-y-scroll overflow-x-hidden max-h-[90vh] no-scrollbar"
      }
    >
      {/* Top Div - contains title and X close button*/}
      <div className="flex w-full bg-transparent backdrop-blur-sm px-1 min-h-10 items-center">
        {/* Title */}
        <div
          className="w-fit px-10 mx-auto rounded-full text-md text-center
             font-semibold cursor-default leading-tight"
        >
          {product.name}
        </div>

        {/* X Close Button */}
        <div
          onClick={closeModal}
          className="absolute top-1 right-1 mx-1 bg-transparent hover-light hover:bg-white/50
             rounded-full p-1 cursor-pointer"
        >
          {xIcon}
        </div>
      </div>

      {/* Central Content Div */}
      <div className="flex flex-col mx-auto px-2 w-[calc(90vw)] max-w-5xl">
        {/* Image and info upper div - max of 60% view height*/}
        <div className="block md:flex max-h-[calc(60vh)]">
          {/* Image with size tag - On left 2/3 for desktop, full width for mobile */}
          <div className="relative w-full md:w-2/3 m-1 mt-2 md:m-2">
            {/* Image div - has min-h for mobile spacing */}
            <div className="p-1 md:py-4 md:pl-4 h-max min-h-57.5">
              <ImageWithFallback
                id={product.id}
                src={"product-images/" + product.id + ".webp"}
              />
              {/* Size div overlaid on top of image */}
              {product.size && <div className="size-tag">{product.size}</div>}
            </div>
          </div>

          {/* Other information on right 1/3 for desktop, full width for mobile */}
          <div className="flex flex-col w-full md:w-1/2 md:min-w-[20rem] p-2 h-fit my-auto">
            {/* Div for price tag and stats sharing the same row */}
            <div className="flex w-full">
              {/* Price Tag */}
              <div className="w-1/2 mr-8">
                <PriceTag product={product} />
              </div>

              {/* Price Stats */}
              <div className="glass-capsule text-sm w-1/2">
                <div className="mx-auto leading-tight md:leading-normal">
                  <div className="flex">
                    <div className="text-right pr-1 min-w-12">Low</div>
                    <div>${lowestPrice}</div>
                  </div>
                  <div className="flex">
                    <div className="text-right pr-1 min-w-12">High</div>
                    <div>${highestPrice}</div>
                  </div>
                  <div className="flex">
                    <div className="text-right pr-1 min-w-12">Avg</div>
                    <div>${avgPrice}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Various advanced stats are hidden on mobile to save screen space */}
            <div className="hidden md:flex flex-col glass-capsule mt-4">
              {/* Last Checked */}
              <div className=" text-sm mt-2 mx-auto flex">
                <div>Price Last Checked </div>
                <div className="pl-1 font-semibold">{daysSinceLastChecked}</div>
              </div>

              {/* Last Updated */}
              <div className=" text-sm mt-2 mx-auto flex">
                <div>Price Last Changed</div>
                <div className="pl-1 font-semibold">{daysSinceLastUpdated}</div>
              </div>
              <div className=" text-sm mb-2 mx-auto flex">
                <div>on</div>
                <div className="pl-1 font-semibold">
                  {utcDateToLongDate(product.lastUpdated)}
                </div>
              </div>
            </div>

            {/* Original Site Search Link */}
            <a
              target="_blank"
              className="glass-capsule text-sm my-4 text-nowrap truncate py-2 hover-light"
              href={originalProductURLBase + cleanedSearchName}
              rel="noopener noreferrer"
            >
              {getStoreEnum(product) == Store.Countdown && (
                <div className="flex-col shadow-none">
                  <div>&apos;{cleanedSearchName}&apos;</div>
                  <div className="flex gap-x-1 items-center mx-auto w-fit">
                    {boxArrow} woolworths.co.nz
                  </div>
                </div>
              )}
              {getStoreEnum(product) == Store.Warehouse && (
                <div className="red-ring flex-col shadow-none">
                  <div>&apos;{cleanedSearchName}&apos;</div>
                  <div className="flex gap-x-1 items-center mx-auto w-fit">
                    {boxArrow} thewarehouse.co.nz
                  </div>
                </div>
              )}
              {getStoreEnum(product) == Store.Paknsave && (
                <div className="yellow-ring flex-col shadow-none">
                  <div>&apos;{cleanedSearchName}&apos;</div>
                  <div className="flex gap-x-1 items-center mx-auto w-fit">
                    {boxArrow} paknsave.co.nz
                  </div>
                </div>
              )}
              {getStoreEnum(product) == Store.NewWorld && (
                <div className="red-ring flex-col shadow-none">
                  <div>&apos;{cleanedSearchName}&apos;</div>
                  <div className="flex gap-x-1 items-center mx-auto w-fit">
                    {boxArrow} newworld.co.nz
                  </div>
                </div>
              )}
            </a>

            {/* First Added  - hidden on mobile*/}
            <div className="glass-capsule text-sm my-1 hidden md:flex">
              <div className="p-1">First added to KiwiPrice on</div>
              <div>{utcDateToMonthYear(product.priceHistory[0].date)}</div>
            </div>
          </div>
        </div>

        {/* Price Chart - full width, max-h-80 on mobile, or height 1/3 on desktop*/}
        <div className="flex w-full mx-auto h-full max-h-80 md:h-1/3 px-2 lg:mb-2">
          <DynamicChartCall
            priceHistory={product.priceHistory}
            lastChecked={product.lastChecked}
            useLargeVersion={true}
          />
        </div>
      </div>

      <CardFooter product={product} padding={2} />
    </div>
  );
}

export default ProductModalFull;

const boxArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    className="bi bi-box-arrow-up-right"
    viewBox="0 0 16 16"
  >
    <path
      fillRule="evenodd"
      d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"
    />
    <path
      fillRule="evenodd"
      d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"
    />
  </svg>
);

const xIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="currentColor"
    className="bi bi-x"
    viewBox="0 0 16 16"
  >
    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
  </svg>
);
