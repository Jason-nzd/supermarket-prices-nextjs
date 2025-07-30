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
  sortProductsByUnitPrice,
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
  let products = await DBFetchByCategory(
    "coffee",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  let sachetCoffee: Product[] = [];
  let instantCoffee: Product[] = [];
  let groundCoffee: Product[] = [];
  let beansCoffee: Product[] = [];
  let capsuleCoffee: Product[] = [];
  let otherCoffee: Product[] = [];

  products.forEach((product) => {
    // Filter each product into respective categories
    if (product.name.toLowerCase().match("sachet|sticks"))
      sachetCoffee.push(product);
    else if (product.name.toLowerCase().match("instant|jarrah|freeze"))
      instantCoffee.push(product);
    else if (product.name.toLowerCase().match("ground|powder|grind|plunger"))
      groundCoffee.push(product);
    else if (product.name.toLowerCase().includes("beans"))
      beansCoffee.push(product);
    else if (product.name.toLowerCase().match("capsule|pods|gusto|nespresso"))
      capsuleCoffee.push(product);
    // For leftover products, filter further into instant and sachet coffee
    else if (product.name.toLowerCase().includes("pack"))
      sachetCoffee.push(product);
    else if (product.name.toLowerCase().match("original|decaf|classic|blend"))
      instantCoffee.push(product);
    // Put remaining leftovers into other category
    else otherCoffee.push(product);
  });

  const sachetCount = sachetCoffee.length;
  const instantCount = instantCoffee.length;
  const groundCount = groundCoffee.length;
  const beansCount = beansCoffee.length;
  const capsuleCount = capsuleCoffee.length;
  const otherCount = otherCoffee.length;

  // Sort all by unit price
  sachetCoffee = sortProductsByUnitPrice(sachetCoffee).slice(0, 10);
  instantCoffee = sortProductsByUnitPrice(instantCoffee).slice(0, 10);
  groundCoffee = sortProductsByUnitPrice(groundCoffee).slice(0, 10);
  beansCoffee = sortProductsByUnitPrice(beansCoffee).slice(0, 10);
  capsuleCoffee = sortProductsByUnitPrice(capsuleCoffee).slice(0, 10);
  otherCoffee = sortProductsByUnitPrice(otherCoffee).slice(0, 5);

  const sachetData: ProductGridData = {
    titles: ["Sachet Coffee"],
    subTitle: printProductCountSubTitle(sachetCoffee.length, sachetCount),
    products: sachetCoffee,
    createSearchLink: true,
  };
  const instantData: ProductGridData = {
    titles: ["Instant Coffee"],
    subTitle: printProductCountSubTitle(instantCoffee.length, instantCount),
    products: instantCoffee,
    createSearchLink: true,
  };
  const groundData: ProductGridData = {
    titles: ["Grind Coffee", "Plunger Coffee", "Filter Coffee"],
    subTitle: printProductCountSubTitle(groundCoffee.length, groundCount),
    products: groundCoffee,
    createSearchLink: true,
  };
  const beansData: ProductGridData = {
    titles: ["Coffee Beans"],
    subTitle: printProductCountSubTitle(beansCoffee.length, beansCount),
    products: beansCoffee,
    createSearchLink: true,
  };
  const capsuleData: ProductGridData = {
    titles: ["Capsules", "Pods", "Dolce Gusto", "Nespresso"],
    subTitle: printProductCountSubTitle(capsuleCoffee.length, capsuleCount),
    products: capsuleCoffee,
    createSearchLink: true,
  };
  const otherData: ProductGridData = {
    titles: ["Other Coffee"],
    subTitle: printProductCountSubTitle(otherCoffee.length, otherCount),
    products: otherCoffee,
    createSearchLink: false,
  };

  // Combine ProductGridData objects into array
  const productGridDataAll: ProductGridData[] = [
    sachetData,
    instantData,
    groundData,
    beansData,
    capsuleData,
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
