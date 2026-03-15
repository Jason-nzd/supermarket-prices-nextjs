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

import { buildSubCategoryGrids } from "@/lib/sub-categorisation";

interface Props {
  productGridDataAll: ProductGridData[];
  lastChecked: string;
}

const Category = ({ productGridDataAll, lastChecked }: Props) => {
  return (
    <PageLayout lastUpdatedDate={lastChecked}>
      {/* Categorised Product Grids*/}
      {productGridDataAll.map((grid, index) => (
        <ProductsGrid
          key={index}
          titles={grid.titles}
          subTitle={grid.subTitle}
          products={grid.products}
          trimColumns={grid.trimColumns}
          createSearchLink={grid.createSearchLink}
          createDeepLink={grid.createDeepLink}
        />
      ))}
    </PageLayout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    "fruit",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days
  );

  const productGridDataAll = buildSubCategoryGrids(
    products,
    [
      {
        titles: ["Apples"],
        match: (p) =>
          p.name.toLowerCase().includes("apple") &&
          !p.name.toLowerCase().includes("pineapple"),
        limit: 10,
        createSearchLink: false,
        createDeepLink: "/products/fruit/",
      },
      {
        titles: ["Bananas"],
        match: "banana",
        limit: 10,
        createSearchLink: false,
        createDeepLink: "/products/fruit/",
      },
      {
        titles: ["Oranges", "Lemons", "Limes", "Tangerines", "Mandarins"],
        match: (p) => {
          const name = p.name.toLowerCase();
          return (
            !!name.match(/orange|mandarin|lemon|lime/i) &&
            !name.match(/avocado|juice/i)
          );
        },
        limit: 10,
      },
      {
        titles: ["Pears"],
        match: "pears",
        limit: 10,
      },
      {
        titles: ["Kiwifruit", "Feijoa"],
        match: /feijoa|kiwifruit/i,
        limit: 10,
      },
      {
        titles: ["Peaches", "Plums", "Nectarines"],
        match: /peach|nectarine|plums/i,
        limit: 10,
      },
      {
        titles: ["Strawberries", "Blueberries", "Raspberries"],
        match: /berry|berries/i,
        limit: 10,
      },
      {
        titles: ["Pineapple", "Mango", "Melon"],
        match: /pineapple|mango|melon/i,
        limit: 10,
      },
      {
        titles: ["Grapes"],
        match: "grapes",
        limit: 10,
      },
    ],
    {
      useOther: true,
      otherTitle: "Other Fruit",
      otherLimit: 10,
      sort: true,
    }
  );

  // Mark "Other Fruit" to trim columns
  const otherGrid = productGridDataAll.find((g) => g.titles[0] === "Other Fruit");
  if (otherGrid) {
    otherGrid.trimColumns = true;
    otherGrid.createSearchLink = false;
  }

  const lastChecked = await DBGetMostRecentDate();

  return {
    props: {
      productGridDataAll,
      lastChecked,
    },
  };
};

export default Category;
