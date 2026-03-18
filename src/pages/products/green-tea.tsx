import { GetStaticProps } from "next";
import React, { useContext } from "react";
import { Product, ProductGridData } from "@/typings";
import ProductsGrid from "@/components/features/products/ProductGrid";
import { DBFetchByCategory, DBGetMostRecentDate } from "@/lib/db/cosmos";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
} from "@/lib/enums";
import { printProductCountSubTitle } from "@/lib/utils";
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

import { separateProductsIntoSubCategories } from "@/lib/sub-categorisation";

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    "green-tea",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days,
  );

  // Try derive per unit price of each product
  products.forEach((product) => {
    // Treat teabag tea as per teabag
    if (!product.name.toLowerCase().includes("loose")) {
      // Try parse size to get quantity while excluding grams per teabag, e.g. 100 x 2g
      let size = product.size?.toLowerCase().split("x")[0];
      // Get just the quantity
      size = size ? size.match(/\d/g)?.join("") : "";

      // If size is still undefined, try parse from name
      if (size === undefined || size === "") {
        size = product.name
          .toLowerCase()
          .match(/\d*\spk|\d*\spack|\d*.*bags|\d*'s/g)
          ?.join("")
          .match(/\d/g)
          ?.join("");
      }

      // Parse to int and check is within valid range
      if (size !== undefined && parseInt(size) < 1100) {
        const quantity = parseInt(size);

        // Set per teabag unit price
        product.unitPriceNum =
          product.priceHistory[product.priceHistory.length - 1].price /
          quantity;
        product.unitPrice = product.unitPriceNum.toFixed(2) + "/bag";

        // Set size
        product.size = quantity + " Pack";
      }
      // If a unit price could not be derived,
      //  set unitPriceNum to 999 to force ordering to bottom
      else {
        product.unitPriceNum = 999;
        product.unitPrice = "";
      }
    }
  });

  const productGridDataAll = separateProductsIntoSubCategories(
    products,
    [
      {
        titles: ["Green Tea Bags"],
        // Match products that DON'T contain "loose" (negative lookahead)
        regexMatch: /^(?!.*loose).*/i,
        maxProductsToShow: 20,
      },
    ],
    {
      useLeftoverProducts: true,
      leftoverProductsTitle: "Loose Tea",
      leftoverMaxProductsToShow: 10,
    },
  );

  const lastChecked = await DBGetMostRecentDate();

  return {
    props: {
      productGridDataAll,
      lastChecked,
    },
  };
};

export default Category;
