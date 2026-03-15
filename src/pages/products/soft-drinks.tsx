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
  // Fetch entire soft-drinks category from DB
  const products = await DBFetchByCategory(
    "soft-drinks",
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
        titles: ["Soft Drinks (Cans & Small Bottles)"],
        match: /can|pack|tray/i,
        matchField: "both",
        titleAsSearchLink: false,
        maxProductsToShow: 20,
      },
    ],
    {
      useLeftoverProducts: true,
      leftoverProductsTitle: "Soft Drinks (Large Bottles)",
      leftoverMaxProductsToShow: 20,
    }
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
