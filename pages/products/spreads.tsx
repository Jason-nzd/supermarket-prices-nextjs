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
  Store,
  printProductCountSubTitle,
  sortProductsByUnitPrice,
} from "../../utilities/utilities";
import { DarkModeContext } from "../_app";
import Footer from "../../components/Footer";
import NavBar from "components/NavBar/NavBar";
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
    "spreads",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  let valueButters: Product[] = [];
  let premiumButters: Product[] = [];
  let jams: Product[] = [];
  let honey: Product[] = [];
  let vegemite: Product[] = [];
  let hazelnut: Product[] = [];
  let marmalade: Product[] = [];
  let other: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    if (name.match(/(fogg|pic|mother|brothers|macro|ceres).*butter/g))
      premiumButters.push(product);
    else if (name.match("butter")) valueButters.push(product);
    else if (name.match("jam|berry")) jams.push(product);
    else if (name.includes("honey")) honey.push(product);
    else if (name.match("vegemite|marmite|yeast")) vegemite.push(product);
    else if (name.match("hazelnut|nutella")) hazelnut.push(product);
    else if (name.match("marmalade|lemon")) marmalade.push(product);
    else other.push(product);
  });

  const valueButtersCount = valueButters.length;
  const premiumButtersCount = premiumButters.length;
  const jamsCount = jams.length;
  const honeyCount = honey.length;
  const vegemiteCount = vegemite.length;
  const hazelnutCount = hazelnut.length;
  const marmaladeCount = marmalade.length;
  const otherCount = other.length;

  // Sort all by unit price
  valueButters = sortProductsByUnitPrice(valueButters).slice(0, 10);
  premiumButters = sortProductsByUnitPrice(premiumButters).slice(0, 10);
  jams = sortProductsByUnitPrice(jams).slice(0, 10);
  honey = sortProductsByUnitPrice(honey).slice(0, 10);
  vegemite = sortProductsByUnitPrice(vegemite).slice(0, 10);
  hazelnut = sortProductsByUnitPrice(hazelnut).slice(0, 10);
  marmalade = sortProductsByUnitPrice(marmalade).slice(0, 10);
  other = sortProductsByUnitPrice(other).slice(0, 10);

  const valueButterData: ProductGridData = {
    titles: ["Value Nut Butters"],
    subTitle: printProductCountSubTitle(valueButters.length, valueButtersCount),
    products: valueButters,
    createSearchLink: false,
  };
  const premiumButterData: ProductGridData = {
    titles: ["Premium Nut Butters"],
    subTitle: printProductCountSubTitle(
      premiumButters.length,
      premiumButtersCount
    ),
    products: premiumButters,
    createSearchLink: false,
  };
  const jamData: ProductGridData = {
    titles: ["Strawberry Jam", "Raspberry Jam", "Plum Jam", "Apricot Jam"],
    subTitle: printProductCountSubTitle(jams.length, jamsCount),
    products: jams,
    createSearchLink: false,
  };
  const honeyData: ProductGridData = {
    titles: ["Honey"],
    subTitle: printProductCountSubTitle(honey.length, honeyCount),
    products: honey,
    createSearchLink: false,
  };
  const vegemiteData: ProductGridData = {
    titles: ["Vegemite", "Marmite"],
    subTitle: printProductCountSubTitle(vegemite.length, vegemiteCount),
    products: vegemite,
    createSearchLink: false,
  };
  const hazelnutData: ProductGridData = {
    titles: ["Hazelnut", "Nutella"],
    subTitle: printProductCountSubTitle(hazelnut.length, hazelnutCount),
    products: hazelnut,
    createSearchLink: false,
  };
  const marmaladeData: ProductGridData = {
    titles: ["Marmalade"],
    subTitle: printProductCountSubTitle(marmalade.length, marmaladeCount),
    products: marmalade,
    createSearchLink: false,
  };
  const otherData: ProductGridData = {
    titles: ["Other Spreads"],
    subTitle: printProductCountSubTitle(other.length, otherCount),
    products: other,
    createSearchLink: false,
  };

  // Combine ProductGridData objects into array
  const productGridDataAll: ProductGridData[] = [
    valueButterData,
    premiumButterData,
    jamData,
    honeyData,
    vegemiteData,
    hazelnutData,
    marmaladeData,
    otherData,
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
