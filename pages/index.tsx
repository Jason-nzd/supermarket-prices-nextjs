import { useContext } from "react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar/NavBar";
import ProductsGrid from "../components/ProductsGrid";
import { Product } from "../typings";
import { DBFetchAll, DBGetMostRecentDate } from "../utilities/cosmosdb";
import { OrderByMode, PriceHistoryLimit, Store } from "../utilities/utilities";
import { DarkModeContext } from "./_app";

interface Props {
  countdownProducts: Product[];
  paknsaveProducts: Product[];
  warehouseProducts: Product[];
  newworldProducts: Product[];
  lastChecked: string;
}

// Products props will be populated at build time by getStaticProps()
export default function Home({
  countdownProducts,
  paknsaveProducts,
  warehouseProducts,
  newworldProducts,
  lastChecked,
}: Props) {
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className="content-body">
        {/* Central Aligned Div */}
        <div className="central-responsive-div">
          {/* Page Title */}
          <div className="grid-title">Today's Trending Products</div>
          {countdownProducts && (
            <ProductsGrid
              products={countdownProducts}
              key="countdown"
              trimColumns={true}
            />
          )}
          {paknsaveProducts && (
            <ProductsGrid
              products={paknsaveProducts}
              key="paknsave"
              trimColumns={true}
            />
          )}
          {warehouseProducts && (
            <ProductsGrid
              products={warehouseProducts}
              key="warehouse"
              trimColumns={true}
            />
          )}
          {newworldProducts && (
            <ProductsGrid
              products={newworldProducts}
              key="newworld"
              trimColumns={true}
            />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

// Perform a DB lookup for each store, so all stores get some coverage on the home page
export async function getStaticProps() {
  const countdownProducts = await DBFetchAll(
    10,
    Store.Countdown,
    PriceHistoryLimit.FourOrMore,
    OrderByMode.LatestPriceChange
  );

  const paknsaveProducts = await DBFetchAll(
    10,
    Store.Paknsave,
    PriceHistoryLimit.FourOrMore,
    OrderByMode.LatestPriceChange
  );

  const warehouseProducts = await DBFetchAll(
    5,
    Store.Warehouse,
    PriceHistoryLimit.FourOrMore,
    OrderByMode.LatestPriceChange
  );

  const newworldProducts = await DBFetchAll(
    5,
    Store.NewWorld,
    PriceHistoryLimit.TwoOrMore,
    OrderByMode.LatestPriceChange
  );

  const lastChecked = await DBGetMostRecentDate();

  return {
    props: {
      countdownProducts,
      paknsaveProducts,
      warehouseProducts,
      newworldProducts,
      lastChecked,
    },
  };
}
