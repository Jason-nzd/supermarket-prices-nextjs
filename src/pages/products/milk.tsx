import { GetStaticProps } from "next";
import { ProductGridData } from "@/typings";
import ProductsGrid from "@/components/features/products/ProductGrid";
import {
  DBFetchByCategory,
  DBGetMostRecentDate,
} from "@/lib/db/cosmos";
import StandardPageLayout from "@/components/layout/StandardPageLayout";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
} from "@/lib/enums";

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
  // Fetch milk category from DB
  const allMilk = await DBFetchByCategory(
    "milk",
    2000,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days
  );

  allMilk.map((p) => {
    if (p.sourceSite == "countdown.co.nz") {
      console.log("countdown ", p.name)
    }
    if (p.sourceSite == "newworld.co.nz") {
      console.log("newworld ", p.name)
    }
  })

  const productGridDataAll = buildSubCategoryGrids(
    allMilk,
    [
      {
        titles: ["Standard Milk"],
        match: /standard|original|blue|gate.milk/i,
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
        titleAsSearchLink: false,
        maxProductsToShow: 10,
      },
    ],
    { sort: true, maxProductsToShow: 10 }
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
