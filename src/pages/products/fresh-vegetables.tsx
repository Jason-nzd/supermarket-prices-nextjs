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
    "fresh-vegetables",
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
        titles: ["Potatoes", "Kumara"],
        match: /potato|kumara/i,
        maxProductsToShow: 10,
      },
      {
        titles: ["Broccoli", "Cauliflower", "Cabbage"],
        match: /broccoli|cauliflower|cabbage/i,
        maxProductsToShow: 10,
      },
      {
        titles: ["Carrots", "Yams"],
        match: /carrot|parsnip|beetroot|yam|daikon/i,
        maxProductsToShow: 10,
      },
      {
        titles: ["Lettuce", "Spinach", "Celery", "Sprouts"],
        match: /lettuce|spinach|celery|sprouts|choy|salad/i,
        maxProductsToShow: 10,
      },
      {
        titles: ["Mushrooms"],
        match: "mushroom",
        maxProductsToShow: 5,
      },
      {
        titles: ["Tomatoes", "Cucumber", "Capsicum"],
        match: /tomato|capsicum|cucumber/i,
        maxProductsToShow: 10,
      },
      {
        titles: ["Onions", "Shallots", "Leek"],
        match: /onion|shallot|leek/i,
        maxProductsToShow: 5,
      },
      {
        titles: ["Chili", "Garlic", "Ginger"],
        match: /chili|garlic|ginger/i,
        maxProductsToShow: 5,
      },
    ],
    { useLeftoverProducts: true, leftoverProductsTitle: "Other Vegetables", leftoverMaxProductsToShow: 10 }
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
