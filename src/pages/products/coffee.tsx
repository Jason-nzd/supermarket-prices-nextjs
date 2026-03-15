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
  printProductCountSubTitle,
  sortProductsByUnitPrice,
  Store,
} from "@/lib/utils";
import PageLayout from "@/components/layout/PageLayout";

interface Props {
  productGridDataAll: ProductGridData[];
  lastChecked: string;
}

const Category = ({ productGridDataAll, lastChecked }: Props) => {
  return (
    <PageLayout lastUpdatedDate={lastChecked}>
      {/* Categorised Product Grids*/}
      {productGridDataAll.map((productGridData, index) => (
        <ProductsGrid
          key={index}
          titles={productGridData.titles}
          subTitle={productGridData.subTitle}
          products={productGridData.products}
          createSearchLink={productGridData.createSearchLink}
        />
      ))}
    </PageLayout>
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
        limit: 10,
      },
      {
        titles: ["Instant Coffee"],
        match: /instant|jarrah|freeze|original|decaf|classic|blend/i,
        limit: 10,
      },
      {
        titles: ["Grind Coffee", "Plunger Coffee", "Filter Coffee"],
        match: /ground|powder|grind|plunger/i,
        limit: 10,
      },
      {
        titles: ["Coffee Beans"],
        match: "beans",
        limit: 10,
      },
      {
        titles: ["Capsules", "Pods", "Dolce Gusto", "Nespresso"],
        match: /capsule|pods|gusto|nespresso/i,
        limit: 10,
      },
    ],
    { useOther: true, otherTitle: "Other Coffee", otherLimit: 5 }
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
