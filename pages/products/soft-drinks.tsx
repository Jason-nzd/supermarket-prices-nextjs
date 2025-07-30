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
  // Fetch entire soft-drinks category from DB
  const products = await DBFetchByCategory(
    "soft-drinks",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  // Separate cans and large soft drinks
  let cans: Product[] = [];
  let large: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    const size = product.size?.toLowerCase() || "";

    if (name.match("can|pack|tray") || size.match("can|pack|tray"))
      cans.push(product);
    else large.push(product);
  });

  const canCount = cans.length;
  const largeCount = large.length;

  // Sort all by unit price and limit total number of products shown
  cans = sortProductsByUnitPrice(cans).slice(0, 20);
  large = sortProductsByUnitPrice(large).slice(0, 20);

  const canData: ProductGridData = {
    titles: ["Soft Drinks (Cans & Small Bottles)"],
    subTitle: printProductCountSubTitle(cans.length, canCount),
    products: cans,
    createSearchLink: false,
  };

  const largeData: ProductGridData = {
    titles: ["Soft Drinks (Large Bottles)"],
    subTitle: printProductCountSubTitle(large.length, largeCount),
    products: large,
    createSearchLink: false,
  };

  // Combine ProductGridData objects into array
  const productGridDataAll: ProductGridData[] = [canData, largeData];

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
