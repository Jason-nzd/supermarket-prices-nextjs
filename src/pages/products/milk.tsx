import { GetStaticProps } from "next";
import { useContext } from "react";
import { Product, ProductGridData } from "@/typings";
import ProductsGrid from "@/components/features/products/ProductGrid";
import {
  DBFetchByCategory,
  DBGetMostRecentDate,
} from "@/lib/db/cosmos";
import { DarkModeContext } from "@/pages/_app";
import PageLayout from "@/components/layout/PageLayout";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  printProductCountSubTitle,
  sortProductsByUnitPrice,
} from "@/lib/utils";

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
  // Fetch milk from DB
  const allMilk = await DBFetchByCategory(
    "milk",
    600,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days
  );

  // Filter out powder and proceed to categorize
  const products = allMilk.filter(
    (product) => !product.name.toLowerCase().includes("powder")
  );

  const productGridDataAll = buildSubCategoryGrids(
    products,
    [
      {
        titles: ["Standard Milk"],
        match: /standard|original|blue|gate.milk.2l/i,
      },
      {
        titles: ["Trim Milk"],
        match: /trim|lite|light.blue|reduced|fat/i,
      },
      {
        titles: ["Oat Milk", "Almond Milk", "Soy Milk"],
        match: /oat|almond|soy|lacto/i,
      },
      {
        titles: ["Flavoured Milk", "Chocolate Milk"],
        match: /chocolate|caramel|flavoured|calci-yum/i,
      },
      {
        titles: ["Other Milk"],
        match: /milk/i,
        createSearchLink: false,
      },
    ],
    { sort: true, defaultLimit: 15 }
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
