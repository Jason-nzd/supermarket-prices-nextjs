import React, { useState } from "react";
import { DatedPrice, Product } from "../../typings";
import ImageWithFallback from "../ImageWithFallback";
import { Dialog } from "@headlessui/react";
import ProductModalFull from "../ProductModalFull";
import StoreIcon from "../StoreIcon";
import PriceTag from "./PriceTag";
import dynamic from "next/dynamic";
import { productIsCurrent } from "utilities/utilities";

interface Props {
  product: Product;
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
      useLargeVersion={false}
    />
  );
}

function ProductCard({ product }: Props) {
  function handleClick() {
    setIsModalOpen(true);
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="product-card" onClick={handleClick} key={product.id}>
        {/* Title Div */}
        <div
          className="w-full h-12 pt-2 px-3 rounded-t-2xl text-[#3C8DA3] text-md lg:text-sm
                text-center font-semibold leading-5 lg:leading-4 z-20 dark:text-zinc-300"
        >
          {product.name}{" "}
          {!productIsCurrent(product) && "(Stale Data/Out of Stock)"}
        </div>

        {/* Central Div containing image, chart, price info */}
        <div className="flex flex-auto w-full">
          {/* Image Div */}
          <div className="relative w-full ml-2">
            <ImageWithFallback
              id={product.id}
              src={"product-images/200/" + product.id + ".webp"}
              desaturate={!productIsCurrent(product)}
            />

            {/* Optional Size div overlaid on top of image */}
            {product.size && <div className="size-tag">{product.size}</div>}
          </div>
          <div className="w-3/6">
            {/* Price History Chart */}
            <div className="pl-0 pr-1 z-30 h-24 mb-4 mr-1">
              <DynamicChartCall
                priceHistory={product.priceHistory}
                lastChecked={product.lastChecked}
                useLargeVersion={false}
              />
            </div>

            <div className="flex flex-col items-center">
              {/* Price Tag */}
              <div className="mr-2 ml-auto">
                <PriceTag product={product} />
              </div>
            </div>
          </div>
        </div>

        {/* Source Site Div */}
        <div className="text-sm text-center mt-2">
          {product.sourceSite.includes("countdown.co.nz") && (
            <div
              className="flex items-center justify-center gap-x-2 p-1 rounded-b-2xl text-white
              bg-[#007837] dark:bg-transparent dark:text-zinc-300 dark:ring-[#007837] dark:ring-2"
            >
              <StoreIcon sourceSite={product.sourceSite} width={20} />
              Woolworths
            </div>
          )}
          {product.sourceSite === "thewarehouse.co.nz" && (
            <div
              className="flex items-center justify-center gap-x-2 p-1 rounded-b-2xl text-white
              bg-[#c00] dark:bg-transparent dark:text-zinc-300 dark:ring-[#970d0d] dark:ring-2"
            >
              <StoreIcon sourceSite={product.sourceSite} width={20} />
              The Warehouse
            </div>
          )}
          {product.sourceSite === "paknsave.co.nz" && (
            <div
              className="flex items-center justify-center gap-x-2 p-1 rounded-b-2xl text-black
              bg-[#ffd600] dark:bg-transparent dark:text-zinc-300 dark:ring-[#ac910c] dark:ring-2"
            >
              <StoreIcon sourceSite={product.sourceSite} width={20} />
              {"PAK'nSAVE"}
            </div>
          )}
          {product.sourceSite === "newworld.co.nz" && (
            <div
              className="flex items-center justify-center gap-x-2 p-1 rounded-b-2xl text-white
              bg-[#e11a2c] dark:bg-transparent dark:text-zinc-300 dark:ring-[#ac910c] dark:ring-2"
            >
              <StoreIcon sourceSite={product.sourceSite} width={20} />
              New World
            </div>
          )}

          {/* If sourceSite is not known, display as unstyled */}
          {!product.sourceSite.includes("countdown.co.nz") &&
            product.sourceSite !== "thewarehouse.co.nz" &&
            product.sourceSite !== "newworld.co.nz" &&
            product.sourceSite !== "paknsave.co.nz" && (
              <div>{product.sourceSite}</div>
            )}
        </div>
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="fixed mx-auto max-h-[80rem] max-w-[80rem] w-[90%] h-[95%] inset-0 top-[5%] z-40">
          <Dialog.Panel className="">
            <ProductModalFull
              product={product}
              key={product.id}
              setIsModalOpen={setIsModalOpen}
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}

export default ProductCard;
