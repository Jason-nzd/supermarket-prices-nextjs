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
    "black-tea",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days
  );

  // Try derive per unit price of each product
  products.forEach((product) => {
    // Treat any products with names without bags, pk, pack as loose tea
    if (product.name.toLowerCase().match(/(bag|pk|pack|\d*'s)/g)) {
      // Try parse size to get quantity while excluding grams per teabag, e.g. 100 x 2g
      let size = product.size?.toLowerCase().split("x")[0];
      // Get just the quantity
      size = size ? size.match(/\d/g)?.join("") : "";

      if (size === undefined || size === "") {
        size = product.name
          .toLowerCase()
          .match(/\d*\spk|\d*\spack|\d*.*bags|\d*'s/g)
          ?.join("")
          .match(/\d/g)
          ?.join("");
      }

      // Parse to int and check is within valid range
      if (size !== undefined && parseInt(size) < 6000) {
        const quantity = parseInt(size);

        // Set per teabag unit price
        product.unitPriceNum = (product.currentPrice || 0) / quantity;
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

      // Set unit name
      product.unitName = "bag";
    }
  });

  const productGridDataAll = buildSubCategoryGrids(
    products,
    [
      {
        titles: ["Black Tea Bags"],
        match: /(bag|pk|pack|\d*'s)/i,
        limit: 20,
      },
    ],
    {
      useOther: true,
      otherTitle: "Loose Tea",
      otherLimit: 10,
      sort: true,
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
