import { GetStaticProps } from "next";
import React, { useContext } from "react";
import { Product } from "../../typings";
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
  apples: Product[];
  bananas: Product[];
  citrus: Product[];
  pears: Product[];
  kiwifruit: Product[];
  peaches: Product[];
  berries: Product[];
  pineapple: Product[];
  grapes: Product[];
  other: Product[];
  appleSubTitle: string;
  bananaSubTitle: string;
  citrusSubTitle: string;
  pearSubTitle: string;
  kiwifruitSubTitle: string;
  peachSubTitle: string;
  berrySubTitle: string;
  pineappleSubTitle: string;
  grapeSubTitle: string;
  otherSubTitle: string;
  lastChecked: string;
}

const Category = ({
  apples,
  bananas,
  citrus,
  pears,
  kiwifruit,
  peaches,
  berries,
  pineapple,
  grapes,
  other,
  appleSubTitle,
  bananaSubTitle,
  citrusSubTitle,
  pearSubTitle,
  kiwifruitSubTitle,
  peachSubTitle,
  berrySubTitle,
  pineappleSubTitle,
  grapeSubTitle,
  otherSubTitle,
  lastChecked,
}: Props) => {
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
            titles={["Apples"]}
            subTitle={appleSubTitle}
            products={apples}
            trimColumns={false}
            createSearchLink={false}
            createDeepLink="/products/fruit/"
          />
          <ProductsGrid
            titles={["Bananas"]}
            subTitle={bananaSubTitle}
            products={bananas}
            trimColumns={false}
            createSearchLink={false}
            createDeepLink="/products/fruit/"
          />
          <ProductsGrid
            titles={["Oranges", "Lemons", "Limes", "Tangerines", "Mandarins"]}
            subTitle={citrusSubTitle}
            products={citrus}
            trimColumns={false}
          />
          <ProductsGrid
            titles={["Pears"]}
            subTitle={pearSubTitle}
            products={pears}
            trimColumns={false}
          />
          <ProductsGrid
            titles={["Kiwifruit", "Feijoa"]}
            subTitle={kiwifruitSubTitle}
            products={kiwifruit}
            trimColumns={false}
          />
          <ProductsGrid
            titles={["Peaches", "Plums", "Nectarines"]}
            subTitle={peachSubTitle}
            products={peaches}
            trimColumns={false}
          />
          <ProductsGrid
            titles={["Strawberries", "Blueberries", "Raspberries"]}
            subTitle={berrySubTitle}
            products={berries}
            trimColumns={false}
          />
          <ProductsGrid
            titles={["Pineapple", "Mango", "Melon"]}
            subTitle={pineappleSubTitle}
            products={pineapple}
            trimColumns={false}
          />
          <ProductsGrid
            titles={["Grapes"]}
            subTitle={grapeSubTitle}
            products={grapes}
            trimColumns={false}
          />
          <ProductsGrid
            titles={["Other Fruit"]}
            subTitle={otherSubTitle}
            products={other}
            trimColumns={true}
            createSearchLink={false}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    "fruit",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days
  );

  let apples: Product[] = [];
  let bananas: Product[] = [];
  let citrus: Product[] = [];
  let pears: Product[] = [];
  let kiwifruit: Product[] = [];
  let peaches: Product[] = [];
  let berries: Product[] = [];
  let grapes: Product[] = [];
  let pineapple: Product[] = [];
  let other: Product[] = [];

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    if (name.includes("apple") && !name.includes("pineapple"))
      apples.push(product);
    else if (name.includes("banana")) bananas.push(product);
    else if (
      name.match("orange|mandarin|lemon|lime") &&
      !name.match("avocado|juice")
    )
      citrus.push(product);
    else if (name.match("pears")) pears.push(product);
    else if (name.match("feijoa|kiwifruit")) kiwifruit.push(product);
    else if (name.match("peach|nectarine|plums")) peaches.push(product);
    else if (name.match("berry|berries")) berries.push(product);
    else if (name.match("pineapple|mango|melon")) pineapple.push(product);
    else if (name.includes("grapes")) grapes.push(product);
    else other.push(product);
  });

  // Store all product counts for subTitle
  const appleCount = apples.length;
  const bananaCount = bananas.length;
  const citrusCount = citrus.length;
  const pearCount = pears.length;
  const kiwifruitCount = kiwifruit.length;
  const peachCount = peaches.length;
  const berryCount = berries.length;
  const pineappleCount = pineapple.length;
  const grapeCount = grapes.length;
  const otherCount = other.length;

  // Sort all by unit price
  apples = sortProductsByUnitPrice(apples).slice(0, 10);
  bananas = sortProductsByUnitPrice(bananas).slice(0, 10);
  citrus = sortProductsByUnitPrice(citrus).slice(0, 10);
  pears = sortProductsByUnitPrice(pears).slice(0, 10);
  kiwifruit = sortProductsByUnitPrice(kiwifruit).slice(0, 10);
  peaches = sortProductsByUnitPrice(peaches).slice(0, 10);
  pineapple = sortProductsByUnitPrice(pineapple).slice(0, 10);
  berries = sortProductsByUnitPrice(berries).slice(0, 10);
  grapes = sortProductsByUnitPrice(grapes).slice(0, 10);
  other = other.slice(0, 10);

  // Log product counts in grid subTitles
  const appleSubTitle = printProductCountSubTitle(apples.length, appleCount);
  const bananaSubTitle = printProductCountSubTitle(bananas.length, bananaCount);
  const citrusSubTitle = printProductCountSubTitle(citrus.length, citrusCount);
  const pearSubTitle = printProductCountSubTitle(pears.length, pearCount);
  const kiwifruitSubTitle = printProductCountSubTitle(
    kiwifruit.length,
    kiwifruitCount
  );
  const peachSubTitle = printProductCountSubTitle(peaches.length, peachCount);
  const berrySubTitle = printProductCountSubTitle(berries.length, berryCount);
  const pineappleSubTitle = printProductCountSubTitle(
    pineapple.length,
    pineappleCount
  );
  const grapeSubTitle = printProductCountSubTitle(grapes.length, grapeCount);
  const otherSubTitle = printProductCountSubTitle(other.length, otherCount);

  const lastChecked = await DBGetMostRecentDate();

  return {
    props: {
      apples,
      bananas,
      citrus,
      pears,
      kiwifruit,
      peaches,
      berries,
      pineapple,
      grapes,
      other,
      appleSubTitle,
      bananaSubTitle,
      citrusSubTitle,
      pearSubTitle,
      kiwifruitSubTitle,
      peachSubTitle,
      berrySubTitle,
      pineappleSubTitle,
      grapeSubTitle,
      otherSubTitle,
      lastChecked,
    },
  };
};

export default Category;
