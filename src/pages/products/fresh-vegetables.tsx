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
  printProductCountSubTitle,
  sortProductsByUnitPrice,
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
        limit: 10,
      },
      {
        titles: ["Broccoli", "Cauliflower", "Cabbage"],
        match: /broccoli|cauliflower|cabbage/i,
        limit: 10,
      },
      {
        titles: ["Carrots", "Yams"],
        match: /carrot|parsnip|beetroot|yam|daikon/i,
        limit: 10,
      },
      {
        titles: ["Lettuce", "Spinach", "Celery", "Sprouts"],
        match: /lettuce|spinach|celery|sprouts|choy|salad/i,
        limit: 10,
      },
      {
        titles: ["Mushrooms"],
        match: "mushroom",
        limit: 5,
      },
      {
        titles: ["Tomatoes", "Cucumber", "Capsicum"],
        match: /tomato|capsicum|cucumber/i,
        limit: 10,
      },
      {
        titles: ["Onions", "Shallots", "Leek"],
        match: /onion|shallot|leek/i,
        limit: 5,
      },
      {
        titles: ["Chili", "Garlic", "Ginger"],
        match: /chili|garlic|ginger/i,
        limit: 5,
      },
    ],
    { useOther: true, otherTitle: "Other Vegetables", otherLimit: 10 }
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
