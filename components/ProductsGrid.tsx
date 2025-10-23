import { useMediaQuery } from "../hooks/useMediaQuery";
import { Product } from "../typings";
import ProductCard from "./card/ProductCard";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

interface Props {
  titles?: string[];
  subTitle?: string;
  products: Product[];
  trimColumns?: boolean;
  createSearchLink?: boolean;
  createDeepLink?: string;
}

function ProductsGrid({
  titles = [],
  subTitle = "",
  products,
  trimColumns = false,
  createSearchLink = true,
  createDeepLink = "",
}: Props) {
  let trimmedProducts: Product[] = [];

  // Call hooks unconditionally so their order is stable across renders
  const isMobile = useMediaQuery("600px");
  const isSmall = useMediaQuery("980px");
  const isMedium = useMediaQuery("1340px");
  const isLarge = useMediaQuery("2100px");

  if (trimColumns) {
    trimmedProducts = products;

    // For mobile viewports, trim products to 2 columns
    if (isMobile) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 2));
    }
    // For small viewports, trim products to 3 columns
    if (isSmall) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 3));
    }
    // For medium viewports, trim products to 4 columns
    if (isMedium) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 4));
    }
    // For large viewports, trim products to 5 columns
    if (isLarge) {
      trimmedProducts = products.slice(0, nextMultipleDown(products.length, 5));
    }
  }

  if (products.length > 0)
    return (
      <div>
        {/* Display grid title as-is if no createSearchLink option is set */}
        {!createSearchLink && createDeepLink.length == 0 && (
          <div className="grid-title">{titles[0]}</div>
        )}

        {/* Create search links for each word */}
        {createDeepLink.length == 0 &&
          createSearchLink &&
          titles.length >= 1 && (
            <div className="flex w-fit mx-auto grid-title">
              {titles.map((word) => {
                // Sanitize words to prevent XSS attacks
                const sanitizedWord = DOMPurify.sanitize(word);
                return (
                  <Link
                    href={`/client-search/?query=${sanitizedWord.toLowerCase()}`}
                    key={sanitizedWord}
                    className="hover-to-white mx-4"
                  >
                    {sanitizedWord}
                  </Link>
                );
              })}
            </div>
          )}

        {/* Create deep category links for each word */}
        {createDeepLink.length > 1 &&
          !createSearchLink &&
          titles.length >= 1 && (
            <div className="flex w-fit mx-auto grid-title">
              {titles.map((word) => {
                const sanitizedWord = DOMPurify.sanitize(word);
                return (
                  <Link
                    href={`${createDeepLink}${sanitizedWord.toLowerCase()}`}
                    key={sanitizedWord}
                    className="hover-to-white mx-4"
                  >
                    {sanitizedWord}
                  </Link>
                );
              })}
            </div>
          )}

        {/* Display sub-title only if it is non-blank */}
        {subTitle != "" && (
          <div className="mb-2 text-[#3C8DA3] text-center dark:text-zinc-300">
            {subTitle}
          </div>
        )}
        <div className="flex items-center">
          {/* Div for products grid */}
          <div
            className="grid w-full
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-4
            3xl:grid-cols-5"
          >
            {!trimColumns &&
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            {trimColumns &&
              trimmedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </div>
    );
  else return <div></div>;
}

export default ProductsGrid;

// Get the final multiplier that fits within the range of inputNum
// eg. inputNum = 45, multiplier = 6, returns 42 (7 multiples of 6)
function nextMultipleDown(inputNum: number, multiplier: number): number {
  let currentMultiple = multiplier;
  let lastMultiple = multiplier;
  while (true) {
    currentMultiple += multiplier;
    if (currentMultiple === inputNum) return inputNum;
    if (currentMultiple > inputNum) return lastMultiple;

    lastMultiple = currentMultiple;
  }
}
