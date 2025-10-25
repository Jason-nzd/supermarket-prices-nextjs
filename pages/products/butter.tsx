import { GetStaticProps } from "next";
import { useContext } from "react";
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
  const products = await DBFetchByCategory(
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

  // Store found product counts
  const butterDBCount = butter.length;
  const spreadsDBCount = spreads.length;

  // Sort all by unit price and slice into a smaller array
  butter = sortProductsByUnitPrice(butter).slice(0, 15);
  spreads = sortProductsByUnitPrice(spreads).slice(0, 15);

  // Build ProductGridData objects
  const butterData: ProductGridData = {
    titles: ["Butter"],
    subTitle: printProductCountSubTitle(butter.length, butterDBCount),
    products: butter,
    createSearchLink: true,
  };

  const spreadsData: ProductGridData = {
    titles: ["Spreads"],
    subTitle: printProductCountSubTitle(spreads.length, spreadsDBCount),
    products: spreads,
    createSearchLink: false,
  };

  // Combine ProductGridData objects into array
  const productGridDataAll: ProductGridData[] = [butterData, spreadsData];

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
