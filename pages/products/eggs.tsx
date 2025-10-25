import { GetStaticProps } from "next";
import React, { useContext } from "react";
import { Product, ProductGridData } from "../../typings";
import ProductsGrid from "../../components/ProductsGrid";
import {
  DBFetchByCategory,
  DBGetMostRecentDate,
} from "../../utilities/cosmosdb";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  printProductCountSubTitle,
  Store,
} from "../../utilities/utilities";
import { DarkModeContext } from "../_app";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer";

interface Props {
  productGridDataAll: ProductGridData[];
  lastChecked: string;
}

const Category = ({ productGridDataAll, lastChecked }: Props) => {
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className="content-body">
        {/* Central Aligned Div */}
        <div className="central-responsive-div">
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
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    "eggs",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  // Sub-categories for each egg size
  let mixedGrade: Product[] = [];
  let size7: Product[] = [];
  let size8plus: Product[] = [];

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
      const quantity = parseInt(size);

      // Set per egg unit price
      product.unitPrice = product.currentPrice / quantity;

      // Set size
      product.size = quantity + " Pack";
    }
    // If a unit price could not be derived,
    //  set unitPrice to 999 to force ordering to bottom
    else product.unitPrice = 999;

    // Set unit name
    product.unitName = "egg";
  });

  // Sort by unit price
  products.sort((a, b) => {
    if (a.unitPrice! < b.unitPrice!) return -1;
    if (a.unitPrice! > b.unitPrice!) return 1;
    return 0;
  });

  // Loop through all products and split by category
  products.forEach((product) => {
    // Clear any unitPrices of 999 that were needed for sorting
    if (product.unitPrice === 999) product.unitPrice = null;

    // Split each product into egg sizes
    if (product.name.toLowerCase().includes("size 6")) mixedGrade.push(product);
    else if (product.name.toLowerCase().includes("size 7")) size7.push(product);
    else if (
      product.name.toLowerCase().includes("size 8") ||
      product.name.toLowerCase().includes("size 9") ||
      product.name.toLowerCase().includes("size 10") ||
      product.name.toLowerCase().includes("jumbo")
    )
      size8plus.push(product);
    else mixedGrade.push(product);
  });

  const mixedGradeCount = mixedGrade.length;
  const size7Count = size7.length;
  const size8plusCount = size8plus.length;

  mixedGrade = mixedGrade.slice(0, 15);
  size7 = size7.slice(0, 15);
  size8plus = size8plus.slice(0, 15);

  const mixedGradeData: ProductGridData = {
    titles: ["Size 5, 6 and Mixed Range Eggs"],
    subTitle: printProductCountSubTitle(mixedGrade.length, mixedGradeCount),
    products: mixedGrade,
    createSearchLink: false,
  };
  const size7Data: ProductGridData = {
    titles: ["Size 7 Eggs"],
    subTitle: printProductCountSubTitle(size7.length, size7Count),
    products: size7,
    createSearchLink: false,
  };
  const size8plusData: ProductGridData = {
    titles: ["Size 8+ and Jumbo Eggs"],
    subTitle: printProductCountSubTitle(size8plus.length, size8plusCount),
    products: size8plus,
    createSearchLink: false,
  };

  // Combine ProductGridData objects into array
  const productGridDataAll: ProductGridData[] = [
    mixedGradeData,
    size7Data,
    size8plusData,
  ];

  const lastChecked = await DBGetMostRecentDate();

  return {
    props: {
      productGridDataAll,
      lastChecked,
    },
  };
};

export default Category;
