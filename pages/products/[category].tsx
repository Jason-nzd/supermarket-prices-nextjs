import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { ProductGridData } from "../../typings";
import ProductsGrid from "../../components/ProductsGrid";
import {
  DBFetchByCategory,
  DBGetMostRecentDate,
} from "../../utilities/cosmosdb";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  printProductCountSubTitle,
  sortProductsByUnitPrice,
} from "../../utilities/utilities";
import { DarkModeContext } from "../_app";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer";
import startCase from "lodash/startCase";

interface Props {
  productGridData: ProductGridData;
  lastChecked: string;
}

const Category = ({ productGridData, lastChecked }: Props) => {
  const router = useRouter();
  const { category } = router.query;
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className="content-body">
        {/* Central Aligned Div */}
        <div className="central-responsive-div min-h-[50rem]">
          {/* Filter Selection */}
          <div className="ml-20">{/* <ResultsFilterPanel /> */}</div>
          <ProductsGrid
            titles={productGridData.titles}
            subTitle={productGridData.subTitle}
            products={productGridData.products}
            createSearchLink={productGridData.createSearchLink}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

// Define all product categories into category groups
export const freshCategory = [
  "eggs",
  "fruit",
  "fresh-vegetables",
  "salads-coleslaw",
  "bread",
  "bread-rolls",
  "specialty-bread",
  "bakery-cakes",
  "bakery-desserts",
];
export const chilledCategory = [
  "milk",
  "long-life-milk",
  "cream",
  "yoghurt",
  "butter",
  "cheese",
  "salami",
  "other-deli-foods",
];
export const meatCategory = [
  "beef-lamb",
  "chicken",
  "ham",
  "bacon",
  "pork",
  "patties-meatballs",
  "sausages",
  "deli-meats",
  "meat-alternatives",
  "seafood",
  "salmon",
];
export const frozenCategory = [
  "ice-cream",
  "ice-blocks",
  "pastries-cheesecake",
  "frozen-chips",
  "frozen-vegetables",
  "frozen-fruit",
  "frozen-seafood",
  "pies-sausage-rolls",
  "pizza",
  "other-savouries",
];
export const pantryCategory = [
  "rice",
  "noodles",
  "pasta",
  "beans-spaghetti",
  "canned-fish",
  "canned-meat",
  "soup",
  "cereal",
  "spreads",
  "baking",
  "sauces",
  "oils-vinegars",
  "world-foods",
];
export const snacksCategory = [
  "chocolate",
  "boxed-chocolate",
  "chips",
  "crackers",
  "biscuits",
  "muesli-bars",
  "nuts-bulk-mix",
  "sweets-lollies",
  "other-snacks",
];
export const drinksCategory = [
  "black-tea",
  "green-tea",
  "herbal-tea",
  "drinking-chocolate",
  "coffee",
  "soft-drinks",
  "energy-drinks",
  "juice",
];
export const petsCategory = [
  "cat-food",
  "cat-treats",
  "dog-food",
  "dog-treats",
];

// Combine all category groups into one big array.
// Each category will be built into fully static export pages
let categoryNames = freshCategory.concat(
  chilledCategory,
  meatCategory,
  frozenCategory,
  pantryCategory,
  snacksCategory,
  drinksCategory,
  petsCategory
);

// Remove special sub-categories which have custom made pages instead of generated pages
categoryNames = categoryNames.filter((name) => {
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
// Takes an array of categories, and returns them in { path } format needed for static generation
export function getAllStaticPaths() {
  return categoryNames.map((name) => {
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
  const searchTerm = params?.category as string;

  let products = await DBFetchByCategory(
    searchTerm,
    500,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days
  );

  // Sort by unit price
  products = sortProductsByUnitPrice(products);

  // Store total product size
  const foundItemsCount = products.length;

  // Trim array size for first page
  const numProductsPerPage = 40;
  products = products.slice(0, numProductsPerPage);

  // Build ProductGridData object
  const productGridData: ProductGridData = {
    titles: [startCase(searchTerm)],
    subTitle: printProductCountSubTitle(products.length, foundItemsCount),
    products: products,
    createSearchLink: false,
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
