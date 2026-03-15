import { useState } from "react";
import { Product } from "@/typings";
import ImageWithFallback from "../ImageWithFallback";
import { Dialog, DialogPanel } from "@headlessui/react";
import ProductModalFull from "./ProductCardDetailed";
import PriceTag from "./PriceTag";
import dynamic from "next/dynamic";
import { productIsCurrent } from "@/lib/utils";
import CardFooter from "./CardFooter";

interface Props {
  product: Product;
}

// Lazy load in heavy chart.js from PriceHistoryChart
const DynamicChart = dynamic(() => import("./PriceHistoryChart"), {
  loading: () => <p>Loading...</p>,
});
interface ChartProps {
  product: Product;
  useLargeVersion: boolean;
}
function DynamicChartCall({ product }: ChartProps) {
  return <DynamicChart product={product} useLargeVersion={false} />;
}

function ProductCard({ product }: Props) {
  function handleClick() {
    setIsModalOpen(true);
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  // console.log(`!!!!! ${product.name}`);
  // product.priceHistory.map((dp) => {
  //   console.log(dp.date + " - " + dp.price);
  // });

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
              priority={true}
            />

            {/* Optional Size div overlaid on top of image */}
            {product.size && <div className="size-tag">{product.size}</div>}
          </div>
          <div className="w-3/6">
            {/* Price History Chart */}
            <div className="pl-2 pr-1 z-30 h-24 mb-4 mr-1">
              <DynamicChartCall product={product} useLargeVersion={false} />
            </div>

            <div className="flex flex-col items-center">
              {/* Price Tag */}
              <div className="mr-2 ml-auto">
                <PriceTag
                  priceHistory={product.priceHistory}
                  unitPrice={product.unitPrice}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Source Site Div */}
        <CardFooter product={product} />
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-none z-50"
          aria-hidden="true"
        />
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <DialogPanel>
            <ProductModalFull
              product={product}
              key={product.id}
              setIsModalOpen={setIsModalOpen}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default ProductCard;
