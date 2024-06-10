import { GetStaticProps } from "next";
import React, { useContext } from "react";
import { Product } from "../../typings";
import ProductsGrid from "../../components/ProductsGrid";
import { DBFetchByCategory } from "../../utilities/cosmosdb";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  utcDateToMediumDate,
} from "../../utilities/utilities";
import { DarkModeContext } from "../_app";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer";

interface Props {
  products: Product[];
  looseTea: Product[];
  lastChecked: string;
}

const Category = ({ products, looseTea, lastChecked }: Props) => {
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className="content-body">
        {/* Central Aligned Div */}
        <div className="central-responsive-div">
          {/* Categorised Product Grids*/}
          <ProductsGrid
            titles={["Black Tea"]}
            products={products}
            createSearchLink={false}
          />
          <ProductsGrid
            titles={["Black Tea - Loose"]}
            products={looseTea}
            createSearchLink={false}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  let products = await DBFetchByCategory(
    "black-tea",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  let looseTea: Product[] = [];

  // Try derive per unit price of each product
  products.forEach((product) => {
    // Treat loose tea as per gram
    if (product.name.toLowerCase().includes("loose")) looseTea.push(product);
    // Treat teabag tea as per teabag
    else {
      // Try grab product size if any, else try extract from name
      let size = product.size?.toLowerCase().match(/\d/g)?.join("");
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
        product.unitPrice = product.currentPrice / quantity;

        // Set size
        product.size = quantity + " Pack";
      }
      // If a unit price could not be derived,
      //  set unitPrice to 999 to force ordering to bottom
      else product.unitPrice = 999;

      // Set unit name
      product.unitName = "bag";
    }
  });

  // Sort by unit price
  products.sort((a, b) => {
    if (a.unitPrice! < b.unitPrice!) return -1;
    if (a.unitPrice! > b.unitPrice!) return 1;
    return 0;
  });
  looseTea.sort((a, b) => {
    if (a.unitPrice! < b.unitPrice!) return -1;
    if (a.unitPrice! > b.unitPrice!) return 1;
    return 0;
  });

  products = products.slice(0, 20);
  looseTea = looseTea.slice(0, 10);

  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      products,
      looseTea,
      lastChecked,
    },
  };
};

export default Category;
