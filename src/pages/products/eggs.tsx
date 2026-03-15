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
    "eggs",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days
  );

  // Try derive per unit price of each product
  products.forEach((product) => {
    // Try grab product size if any, else try extract from name
    let size = product.size?.toLowerCase().match(/\d/g)?.join("");
    if (size === undefined || size === "") {
      size = product.name
        .toLowerCase()
        .match(/\d*\spk|\d*\spack/g)
        ?.join("")
        .match(/\d/g)
        ?.join("");
    }

    // Parse to int and check is within valid range
    if (size !== undefined && parseInt(size) < 80) {
      // Get egg quantity
      const eggQuantity = parseInt(size);

      // Get pack price
      const packPrice =
        product.priceHistory[product.priceHistory.length - 1].price;

      // Divide per egg price
      const perEggPrice = parseFloat((packPrice / eggQuantity).toPrecision(2));
      product.unitPriceNum = perEggPrice;

      // Build unitPrice string
      product.unitPrice = perEggPrice + "/egg";

      // Set size tag
      product.size = eggQuantity + " Pack";
    }
    // If an egg unit price could not be parsed - blank it out
    else {
      product.unitPrice = "";
      product.unitPriceNum = 999; // set to 999 so it sorts to the bottom
    }
  });

  const productGridDataAll = buildSubCategoryGrids(
    products,
    [
      {
        titles: ["Size 7 Eggs"],
        match: /size 7/i,
        createSearchLink: false,
        limit: 15,
      },
      {
        titles: ["Size 8+ and Jumbo Eggs"],
        match: /size 8|size 9|size 10|jumbo/i,
        createSearchLink: false,
        limit: 15,
      },
    ],
    {
      useOther: true,
      otherTitle: "Size 5, 6 and Mixed Range Eggs",
      otherLimit: 15,
      sort: true, // will use unitPriceNum we just set
    }
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
