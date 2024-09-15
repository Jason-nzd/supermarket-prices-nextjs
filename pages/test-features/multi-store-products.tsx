import { GetStaticProps } from "next";
import React, { useContext } from "react";
import { Product } from "../../typings";
import { DBFetchByName } from "../../utilities/cosmosdb";
import { utcDateToMediumDate } from "../../utilities/utilities";
import { DarkModeContext } from "../_app";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer";
import MultiStorePriceHistoryChart from "components/card/MultiStorePriceHistoryChart";

interface Props {
  countdownProduct: Product | null;
  paknsaveProduct: Product | null;
  warehouseProduct: Product | null;
  newworldProduct: Product | null;
  lastChecked: string;
}

const Category = ({
  countdownProduct,
  paknsaveProduct,
  warehouseProduct,
  newworldProduct,
  lastChecked,
}: Props) => {
  const theme = useContext(DarkModeContext).darkMode ? "dark" : "light";

  return (
    <main className={theme}>
      <NavBar lastUpdatedDate={lastChecked} />
      {/* Background Div */}
      <div className="content-body">
        {/* Central Aligned Div */}
        <div className="central-responsive-div min-h-[50rem]">
          {/* Categorised Product Grids*/}
          <h1 className="grid-title">{countdownProduct?.name}</h1>
          <div className="flex mx-auto w-full max-w-[80rem] h-[500px]">
            <MultiStorePriceHistoryChart
              countdownProduct={countdownProduct}
              paknsaveProduct={paknsaveProduct}
              warehouseProduct={warehouseProduct}
              newworldProduct={newworldProduct}
            />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByName("almond gold");

  let countdownProduct: Product | null = null;
  let paknsaveProduct: Product | null = null;
  let warehouseProduct: Product | null = null;
  let newworldProduct: Product | null = null;

  products.forEach((product) => {
    const sizeIsValid = product.size?.toLowerCase().includes("250g");

    if (sizeIsValid && product.sourceSite === "countdown.co.nz")
      countdownProduct = product;
    if (sizeIsValid && product.sourceSite === "paknsave.co.nz")
      paknsaveProduct = product;
    if (sizeIsValid && product.sourceSite === "thewarehouse.co.nz")
      warehouseProduct = product;
    if (sizeIsValid && product.sourceSite === "newworld.co.nz")
      newworldProduct = product;

    // console.log(product.sourceSite + ' - ' + product.size + ' - ' + product.name);
  });

  const lastChecked = utcDateToMediumDate(new Date());

  return {
    props: {
      countdownProduct,
      paknsaveProduct,
      warehouseProduct,
      newworldProduct,
      lastChecked,
    },
  };
};

export default Category;
