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
    "spreads",
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
        titles: ["Premium Nut Butters"],
        match: /(fogg|pic|mother|brothers|macro|ceres).*butter/i,
        createSearchLink: false,
        limit: 10,
      },
      {
        titles: ["Value Nut Butters"],
        match: "butter",
        createSearchLink: false,
        limit: 10,
      },
      {
        titles: ["Strawberry Jam", "Raspberry Jam", "Plum Jam", "Apricot Jam"],
        match: /jam|berry/i,
        createSearchLink: false,
        limit: 10,
      },
      {
        titles: ["Honey"],
        match: "honey",
        createSearchLink: false,
        limit: 10,
      },
      {
        titles: ["Vegemite", "Marmite"],
        match: /vegemite|marmite|yeast/i,
        createSearchLink: false,
        limit: 10,
      },
      {
        titles: ["Hazelnut", "Nutella"],
        match: /hazelnut|nutella/i,
        createSearchLink: false,
        limit: 10,
      },
      {
        titles: ["Marmalade"],
        match: /marmalade|lemon/i,
        createSearchLink: false,
        limit: 10,
      },
    ],
    { useOther: true, otherTitle: "Other Spreads", otherLimit: 10 }
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
