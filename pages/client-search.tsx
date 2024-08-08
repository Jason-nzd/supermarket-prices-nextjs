import { useContext, useEffect, useState } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar/NavBar";
import ProductsGrid from "../components/ProductsGrid";
import { Product } from "../typings";
import {
  LastChecked,
  PriceHistoryLimit,
  Store,
  sortProductsByUnitPrice,
  utcDateToMediumDate,
} from "../utilities/utilities";
import { DarkModeContext } from "./_app";
import { useRouter } from "next/router";
import startCase from "lodash/startCase";
import { DBFetchByNameAPI } from "utilities/clientside-api";

interface Props {
  lastChecked: string;
}

const maxProductsToSearch = 40;

const ClientSearch = ({ lastChecked }: Props) => {
  const router = useRouter();
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";
  const [products, setProducts] = useState<Product[]>([]);
  const [outOfStockProducts, setOutOfStockProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>();

  if (router.query.query !== searchTerm)
    setSearchTerm(router.query.query as string);

  useEffect(() => {
    (async () => {
      if (searchTerm) {
        // setIsLoading(true) will show loading spinner
        setIsLoading(true);

        // Fetch all products matching search that have been checked within 7 days
        const currentProducts = await DBFetchByNameAPI(
          searchTerm,
          maxProductsToSearch,
          Store.Any,
          PriceHistoryLimit.Any,
          LastChecked.Within7Days
        );

        // Clear out of stock products array every search
        setOutOfStockProducts([]);

        // If in-stock product search produced few results, supplement with out-of-stock search
        if (currentProducts.length < 20) {
          let oldProducts = await DBFetchByNameAPI(
            searchTerm,
            maxProductsToSearch,
            Store.Any,
            PriceHistoryLimit.Any,
            LastChecked.Any
          );

          // Filter to only show old products as a separate results section
          oldProducts = oldProducts.filter((potentialOldProduct) => {
            const daysSinceLastChecked =
              (Date.now() -
                new Date(potentialOldProduct.lastChecked).getTime()) /
              1000 /
              60 /
              60 /
              24;
            return daysSinceLastChecked > 7;
          });

          // Sort out of stock products by unit price, and set react state
          setOutOfStockProducts(sortProductsByUnitPrice(oldProducts));
        }

        // Sort in-stock products by unit price, and set react state
        setProducts(sortProductsByUnitPrice(currentProducts));

        // Disable loading spinner animation and reveal search results
        setIsLoading(false);
      }
    })();

    return () => {};
  }, [searchTerm]);

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className="content-body">
        {/* Central Aligned Div */}
        <div className="central-responsive-div min-h-[50rem]">
          {/* Page Title */}
          <div className="grid-title">
            {!isLoading && products.length >= 1 && (
              <div>
                <div className="grid-title">
                  {products.length}+ results found for '{startCase(searchTerm)}'
                </div>
                <div className="text-sm">Sorted by unit price</div>
              </div>
            )}
            {!isLoading && products.length < 1 && (
              <span>
                No in-stock results found for '{startCase(searchTerm)}.'
              </span>
            )}
            {isLoading && (
              <>
                <div className="">Searching for {startCase(searchTerm)}..</div>

                {/* Loading Spinner Icon */}
                <div className="w-fit mx-auto p-8">
                  <svg
                    aria-hidden="true"
                    className="w-12 h-12 text-center mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              </>
            )}
          </div>
          {products && <ProductsGrid products={products} />}
          {outOfStockProducts && (
            <div className="mt-8">
              <ProductsGrid
                products={outOfStockProducts}
                titles={["Products with old data or are out of stock"]}
                subTitle="Limited to 40 search results"
                createSearchLink={false}
              />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export async function getStaticProps() {
  const lastChecked = utcDateToMediumDate(new Date());
  return {
    props: {
      lastChecked,
    },
  };
}

export default ClientSearch;
