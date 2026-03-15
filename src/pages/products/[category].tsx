import { GetStaticPaths, GetStaticProps } from "next";
import { ProductGridData } from "@/typings";
import ProductsGrid from "@/components/features/products/ProductGrid";
import {
  DBFetchByCategory,
  DBGetMostRecentDate,
} from "@/lib/db/cosmos";
import {
  printProductCountSubTitle,
  sortProductsByUnitPrice,
} from "@/lib/utils";
import { LastChecked, OrderByMode, PriceHistoryLimit, Store } from "@/lib/enums";
import StandardPageLayout from "@/components/layout/StandardPageLayout";
import startCase from "lodash/startCase";

interface Props {
  productGridData: ProductGridData;
  lastChecked: string;
}

const Category = ({ productGridData, lastChecked }: Props) => {
  return (
    <StandardPageLayout lastUpdatedDate={lastChecked}>
      <div className="min-h-[50rem]">
        <ProductsGrid
          titles={productGridData.titles}
          subTitle={productGridData.subTitle}
          products={productGridData.products}
          titleAsSearchLink={productGridData.titleAsSearchLink}
        />
      </div>
    </StandardPageLayout>
  );
};

import { allCategoryNames, titledCategories } from "@/lib/categories";

// Combine all category groups into one big array.
// Each category will be built into fully static export pages
let categoriesToGenerate = allCategoryNames;

// Remove special sub-categories which have custom made pages instead of generated pages
categoriesToGenerate = categoriesToGenerate.filter((name) => {
  return ![
    "eggs",
    "fruit",
    "milk",
    "fresh-vegetables",
    "spreads",
    "soft-drinks",
    "black-tea",
    "butter",
    "green-tea",
    "coffee",
    "drinking-chocolate",
  ].includes(name);
});

// getAllStaticPaths()
// -------------------
// Takes an array of categories, returns them in { path } format for static generation
export function getAllStaticPaths() {
  return categoriesToGenerate.map((name) => {
    return {
      params: {
        category: name,
      },
    };
  });
}

// Build static pages for all paths such /products/cheese
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllStaticPaths(),
    fallback: false,
  };
};

// Gets products from DB based on search term
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;

  let products = await DBFetchByCategory(
    category,
    500,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days,
  );

  // Sort by unit price
  products = sortProductsByUnitPrice(products);

  // Store total product size
  const foundItemsCount = products.length;

  // Trim array size for first page
  const numProductsPerPage = 30;
  products = products.slice(0, numProductsPerPage);

  // Get nice title for category
  const categoryTitle = titledCategories[category] || startCase(category);

  // Build ProductGridData object
  const productGridData: ProductGridData = {
    titles: [categoryTitle],
    subTitle: printProductCountSubTitle(products.length, foundItemsCount),
    products: products,
    titleAsSearchLink: false,
  };

  const lastChecked = await DBGetMostRecentDate();

  return {
    props: {
      productGridData,
      lastChecked,
    },
  };
};

export default Category;
