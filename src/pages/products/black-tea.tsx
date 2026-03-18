import { GetStaticProps } from "next";
import { ProductGridData } from "@/typings";
import ProductsGrid from "@/components/features/products/ProductGrid";
import { DBFetchByCategory, DBGetMostRecentDate } from "@/lib/db/cosmos";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
} from "@/lib/enums";
import StandardPageLayout from "@/components/layout/StandardPageLayout";

interface Props {
  productGridDataAll: ProductGridData[];
  lastChecked: string;
}

const Category = ({ productGridDataAll, lastChecked }: Props) => {
  return (
    <StandardPageLayout lastUpdatedDate={lastChecked}>
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
    "black-tea",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days,
  );

  const teaBagRegex = /(bag|pk|pack|\d*x|\d*'s)/g;

  // Try derive per unit price of each product
  products.forEach((product) => {
    // Treat any products with names without bags, pk, pack as loose tea
    if (product.name.toLowerCase().match(teaBagRegex)) {
      // Try parse size to get quantity while excluding grams per teabag, e.g. 100 x 2g
      let size = product.size?.toLowerCase().split("x")[0];

      // Get just the quantity number
      size = size ? size.match(/\d/g)?.join("") : "";

      // If size could not be derived, try parse name
      if (size === undefined || size === "") {
        size = product.name
          .toLowerCase()
          .match(teaBagRegex)
          ?.join("")
          .match(/\d/g)
          ?.join("");
      }

      // Parse to int and check is within valid range
      if (size !== undefined && parseInt(size) < 6000) {
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
        titles: ["Black Tea Bags"],
        regexMatch: teaBagRegex,
        matchField: "both",
        titleAsSearchLink: false,
        maxProductsToShow: 15,
      },
      {
        titles: ["Black Loose Tea"],
        regexMatch: /(loose|leaf tea)/i,
        matchField: "both",
        titleAsSearchLink: false,
        maxProductsToShow: 10,
      },
    ],
    {
      useLeftoverProducts: true,
      leftoverProductsTitle: "Other Black Tea",
      leftoverMaxProductsToShow: 10,
    },
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
