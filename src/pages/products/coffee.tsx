import { GetStaticProps } from "next";
import React, { useContext } from "react";
import { Product, ProductGridData } from "@/typings";
import ProductsGrid from "@/components/features/products/ProductGrid";
import {
  DBFetchByCategory,
  DBGetMostRecentDate,
} from "@/lib/db/cosmos";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
} from "@/lib/enums";
import {
  printProductCountSubTitle,
  sortProductsByUnitPrice,
} from "@/lib/utils";
import StandardPageLayout from "@/components/layout/StandardPageLayout";

interface Props {
  productGridDataAll: ProductGridData[];
  lastChecked: string;
}

const Category = ({ productGridDataAll, lastChecked }: Props) => {
  return (
    <StandardPageLayout lastUpdatedDate={lastChecked}>
      {/* Categorised Product Grids*/}
      {productGridDataAll.map((productGridData, index) => (
        <ProductsGrid
          key={index}
          titles={productGridData.titles}
          subTitle={productGridData.subTitle}
          products={productGridData.products}
          titleAsSearchLink={productGridData.titleAsSearchLink}
        />
      ))}
    </StandardPageLayout>
  );
};

import { buildSubCategoryGrids } from "@/lib/sub-categorisation";

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    "coffee",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  const productGridDataAll = buildSubCategoryGrids(
    products,
    [
      {
        titles: ["Sachet Coffee"],
        match: /sachet|sticks|pack/i,
        maxProductsToShow: 10,
      },
      {
        titles: ["Instant Coffee"],
        match: /instant|jarrah|freeze|original|decaf|classic|blend/i,
        maxProductsToShow: 10,
      },
      {
        titles: ["Grind Coffee", "Plunger Coffee", "Filter Coffee"],
        match: /ground|powder|grind|plunger/i,
        maxProductsToShow: 10,
      },
      {
        titles: ["Coffee Beans"],
        match: "beans",
        maxProductsToShow: 10,
      },
      {
        titles: ["Capsules", "Pods", "Dolce Gusto", "Nespresso"],
        match: /capsule|pods|gusto|nespresso/i,
        maxProductsToShow: 10,
      },
    ],
    { useLeftoverProducts: true, leftoverProductsTitle: "Other Coffee", leftoverMaxProductsToShow: 5 }
  );

  // Store date, to be displayed in static page title bar
  const lastChecked = await DBGetMostRecentDate();

  return {
    props: {
      productGridDataAll,
      lastChecked,
    },
  };
};

export default Category;
