import { GetStaticProps } from "next";
import React, { useContext } from "react";
import { Product, ProductGridData } from "../../typings";
import ProductsGrid from "../../components/ProductsGrid";
import { DBFetchByCategory } from "../../utilities/cosmosdb";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
  printProductCountSubTitle,
  sortProductsByUnitPrice,
  utcDateToMediumDate,
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
    "fresh-vegetables",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within3Days
  );

  let potatoes: Product[] = [];
  let broccoli: Product[] = [];
  let carrots: Product[] = [];
  let saladKits: Product[] = [];
  let mushrooms: Product[] = [];
  let tomatoes: Product[] = [];
  let chili: Product[] = [];
  let onions: Product[] = [];
  let other: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    if (name.match("potato|kumara")) potatoes.push(product);
    else if (name.match("broccoli|cauliflower|cabbage")) broccoli.push(product);
    else if (name.match("carrot|parsnip|beetroot|yam|daikon"))
      carrots.push(product);
    else if (name.match("lettuce|spinach|celery|sprouts|choy|salad"))
      saladKits.push(product);
    else if (name.match("mushroom")) mushrooms.push(product);
    else if (name.match("tomato|capsicum|cucumber")) tomatoes.push(product);
    else if (name.match("onion|shallot|leek")) onions.push(product);
    else if (name.match("chili|garlic|ginger")) chili.push(product);
    else other.push(product);
  });
  other = other.slice(0, 30);

  const potatoCount = potatoes.length;
  const broccoliCount = broccoli.length;
  const carrotCount = carrots.length;
  const saladKitCount = saladKits.length;
  const mushroomCount = mushrooms.length;
  const tomatoCount = tomatoes.length;
  const chiliCount = chili.length;
  const onionCount = onions.length;
  const otherCount = other.length;

  // Sort all by unit price
  potatoes = sortProductsByUnitPrice(potatoes).slice(0, 10);
  broccoli = sortProductsByUnitPrice(broccoli).slice(0, 10);
  carrots = sortProductsByUnitPrice(carrots).slice(0, 10);
  saladKits = sortProductsByUnitPrice(saladKits).slice(0, 10);
  mushrooms = sortProductsByUnitPrice(mushrooms).slice(0, 5);
  tomatoes = sortProductsByUnitPrice(tomatoes).slice(0, 10);
  onions = sortProductsByUnitPrice(onions).slice(0, 5);
  chili = sortProductsByUnitPrice(chili).slice(0, 5);
  other = other.slice(0, 15);

  const potatoData: ProductGridData = {
    titles: ["Potatoes", "Kumara"],
    subTitle: printProductCountSubTitle(potatoes.length, potatoCount),
    products: potatoes,
    createSearchLink: true,
  };
  const broccoliData: ProductGridData = {
    titles: ["Broccoli", "Cauliflower", "Cabbage"],
    subTitle: printProductCountSubTitle(broccoli.length, broccoliCount),
    products: broccoli,
    createSearchLink: true,
  };
  const carrotData: ProductGridData = {
    titles: ["Carrots", "Yams"],
    subTitle: printProductCountSubTitle(carrots.length, carrotCount),
    products: carrots,
    createSearchLink: true,
  };
  const saladKitData: ProductGridData = {
    titles: ["Lettuce", "Spinach", "Celery", "Sprouts"],
    subTitle: printProductCountSubTitle(saladKits.length, saladKitCount),
    products: saladKits,
    createSearchLink: true,
  };
  const mushroomData: ProductGridData = {
    titles: ["Mushrooms"],
    subTitle: printProductCountSubTitle(mushrooms.length, mushroomCount),
    products: mushrooms,
    createSearchLink: true,
  };
  const tomatoData: ProductGridData = {
    titles: ["Tomatoes", "Cucumber", "Capsicum"],
    subTitle: printProductCountSubTitle(tomatoes.length, tomatoCount),
    products: tomatoes,
    createSearchLink: true,
  };
  const onionData: ProductGridData = {
    titles: ["Onions", "Shallots", "Leek"],
    subTitle: printProductCountSubTitle(onions.length, onionCount),
    products: onions,
    createSearchLink: true,
  };
  const chiliData: ProductGridData = {
    titles: ["Chili", "Garlic", "Ginger"],
    subTitle: printProductCountSubTitle(chili.length, chiliCount),
    products: chili,
    createSearchLink: true,
  };
  const otherData: ProductGridData = {
    titles: ["Other Vegetables"],
    subTitle: printProductCountSubTitle(other.length, otherCount),
    products: other,
    createSearchLink: false,
  };

  // Combine ProductGridData objects into array
  const productGridDataAll: ProductGridData[] = [
    potatoData,
    broccoliData,
    carrotData,
    saladKitData,
    mushroomData,
    tomatoData,
    onionData,
    chiliData,
    otherData,
  ];

  // Store date, to be displayed in static page title bar
  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      productGridDataAll,
      lastChecked,
    },
  };
};

export default Category;
