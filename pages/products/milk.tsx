import { GetStaticProps } from "next";
import React, { useContext } from "react";
import { Product, ProductGridData } from "../../typings";
import ProductsGrid from "../../components/ProductsGrid";
import {
  DBFetchByCategory,
  DBGetMostRecentDate,
} from "../../utilities/cosmosdb";
import { DarkModeContext } from "../_app";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  printProductCountSubTitle,
  sortProductsByUnitPrice,
} from "../../utilities/utilities";

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
  // Fetch milk from DB
  let allMilk = await DBFetchByCategory(
    "milk",
    600,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days
  );

  // Create sub categories of milk
  let standardMilk: Product[] = [];
  let trimMilk: Product[] = [];
  let oatMilk: Product[] = [];
  let flavouredMilk: Product[] = [];
  let otherMilk: Product[] = [];

  // Filter milk into sub categories based on product name keywords
  allMilk.forEach((product) => {
    const name = product.name.toLowerCase();
    if (!name.includes("powder")) {
      if (name.match("oat|almond|soy|lacto")) oatMilk.push(product);
      else if (name.match("trim|lite|light.blue|reduced|fat"))
        trimMilk.push(product);
      else if (name.match("standard|original|blue|gate.milk.2l"))
        standardMilk.push(product);
      else if (name.match("chocolate|caramel|flavoured|calci-yum"))
        flavouredMilk.push(product);
      else if (name.match("milk")) otherMilk.push(product);
    }
  });

  const standardDBCount = standardMilk.length;
  const trimMilkDBCount = trimMilk.length;
  const oatMilkDBCount = oatMilk.length;
  const flavouredMilkDBCount = flavouredMilk.length;
  const otherMilkDBCount = otherMilk.length;

  // Sort all by unit price
  standardMilk = sortProductsByUnitPrice(standardMilk).slice(0, 15);
  trimMilk = sortProductsByUnitPrice(trimMilk).slice(0, 15);
  oatMilk = sortProductsByUnitPrice(oatMilk).slice(0, 15);
  flavouredMilk = sortProductsByUnitPrice(flavouredMilk).slice(0, 15);
  otherMilk = sortProductsByUnitPrice(otherMilk).slice(0, 15);

  const standardMilkData: ProductGridData = {
    titles: ["Standard Milk"],
    subTitle: printProductCountSubTitle(standardMilk.length, standardDBCount),
    products: standardMilk,
    createSearchLink: true,
  };
  const trimMilkData: ProductGridData = {
    titles: ["Trim Milk"],
    subTitle: printProductCountSubTitle(trimMilk.length, trimMilkDBCount),
    products: trimMilk,
    createSearchLink: true,
  };
  const oatMilkData: ProductGridData = {
    titles: ["Oat Milk", "Almond Milk", "Soy Milk"],
    subTitle: printProductCountSubTitle(oatMilk.length, oatMilkDBCount),
    products: oatMilk,
    createSearchLink: true,
  };
  const flavouredMilkData: ProductGridData = {
    titles: ["Flavoured Milk", "Chocolate Milk"],
    subTitle: printProductCountSubTitle(
      flavouredMilk.length,
      flavouredMilkDBCount
    ),
    products: flavouredMilk,
    createSearchLink: true,
  };
  const otherMilkData: ProductGridData = {
    titles: ["Other Milk"],
    subTitle: printProductCountSubTitle(otherMilk.length, otherMilkDBCount),
    products: otherMilk,
    createSearchLink: false,
  };

  // Combine ProductGridData objects into array
  const productGridDataAll: ProductGridData[] = [
    standardMilkData,
    trimMilkData,
    oatMilkData,
    flavouredMilkData,
    otherMilkData,
  ];

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
