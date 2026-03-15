import { GetStaticPaths, GetStaticProps } from "next";
import React, { useContext } from "react";
import { Product } from "@/typings";
import ProductsGrid from "@/components/features/products/ProductGrid";
import {
  DBFetchByNameAndExcludeRegex,
  DBGetMostRecentDate,
} from "@/lib/db/cosmos";
import PageLayout from "@/components/layout/PageLayout";
import { useRouter } from "next/router";
import _ from "lodash";

interface Props {
  products: Product[];
  lastChecked: string;
}

const Fruit = ({ products, lastChecked }: Props) => {
  const router = useRouter();
  const { fruit } = router.query;
  const fruitTitle: string = fruit as string;

  return (
    <PageLayout lastUpdatedDate={lastChecked}>
      {/* Categorised Product Grids*/}
      <ProductsGrid
        titles={[_.startCase(fruitTitle)]}
        products={products}
      />
    </PageLayout>
  );
};

const fruitNames = ["apples", "bananas"];

// getAllStaticPaths()
// -------------------
// Takes an array of categories, and returns them in { path } format needed for static generation
export function getAllStaticPaths() {
  return fruitNames.map((name) => {
    return {
      params: {
        fruit: name,
      },
    };
  });
}

// Build static pages for all paths such /products/fruit/kiwifruit
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllStaticPaths(),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const searchTerm = params?.fruit as string;

  const products = await DBFetchByNameAndExcludeRegex(searchTerm, "", "fruit");

  // Store date, to be displayed in static page title bar
  const lastChecked = await DBGetMostRecentDate();

  return {
    props: {
      products,
      lastChecked,
    },
  };
};

export default Fruit;
