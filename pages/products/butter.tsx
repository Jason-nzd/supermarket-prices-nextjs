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
  sortProductsByUnitPrice,
  utcDateToMediumDate,
} from "../../utilities/utilities";
import { DarkModeContext } from "../_app";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer";

interface Props {
  butter: Product[];
  spreads: Product[];
  lastChecked: string;
}

const Category = ({ butter, spreads, lastChecked }: Props) => {
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
            titles={["Butter"]}
            products={butter}
            createSearchLink={false}
          />
          <ProductsGrid
            titles={["Spreads"]}
            products={spreads}
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
    "butter",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  let spreads: Product[] = [];
  let butter: Product[] = [];

  // Filter milk into sub categories based on product name keywords
  products.forEach((product) => {
    const name = product.name.toLowerCase();
    if (name.includes("spread")) spreads.push(product);
    else if (name.includes("butter")) butter.push(product);
    else spreads.push(product);
  });

  // Sort all by unit price
  butter = sortProductsByUnitPrice(butter).slice(0, 15);
  spreads = sortProductsByUnitPrice(spreads).slice(0, 15);

  // Store date, to be displayed in static page title bar
  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      butter,
      spreads,
      lastChecked,
    },
  };
};

export default Category;
