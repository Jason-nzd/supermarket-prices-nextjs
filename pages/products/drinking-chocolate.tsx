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
  let products = await DBFetchByCategory(
    "drinking-chocolate",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  let bulkPowder: Product[] = [];
  let sachets: Product[] = [];

  // Split products into bulk powder and sachets
  products.forEach((product) => {
    if (product.name.toLowerCase().match(/(sticks|sachet|bag|pack)/g))
      sachets.push(product);
    else if (product.size?.toLocaleLowerCase().match(/(pack|each|\wx\w)/g))
      sachets.push(product);
    else bulkPowder.push(product);
  });

  // Sort by unit price
  bulkPowder.sort((a, b) => {
    if (a.unitPrice! < b.unitPrice!) return -1;
    if (a.unitPrice! > b.unitPrice!) return 1;
    return 0;
  });
  sachets.sort((a, b) => {
    if (a.unitPrice! < b.unitPrice!) return -1;
    if (a.unitPrice! > b.unitPrice!) return 1;
    return 0;
  });

  // Save number of found products
  const bulkPowderDBCount = bulkPowder.length;
  const sachetDBCount = sachets.length;

  // Limit number of products to display
  bulkPowder = bulkPowder.slice(0, 20);
  sachets = sachets.slice(0, 10);

  // Build ProductGridData objects
  const bulkPowderData: ProductGridData = {
    titles: ["Drinking Chocolate"],
    subTitle: printProductCountSubTitle(bulkPowder.length, bulkPowderDBCount),
    products: bulkPowder,
    createSearchLink: true,
  };

  const sachetData: ProductGridData = {
    titles: ["Sachets"],
    subTitle: printProductCountSubTitle(sachets.length, sachetDBCount),
    products: sachets,
    createSearchLink: false,
  };

  // Combine ProductGridData objects into array
  const productGridDataAll: ProductGridData[] = [bulkPowderData, sachetData];

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
