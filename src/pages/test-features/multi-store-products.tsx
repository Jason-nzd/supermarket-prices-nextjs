import { GetStaticProps } from "next";
import { Product } from "@/typings";
import { DBFetchByName, DBGetMostRecentDate } from "@/lib/db/cosmos";
import dynamic from "next/dynamic";
import PageLayout from "@/components/layout/PageLayout";

const MultiStorePriceHistoryChart = dynamic(
  () => import("@/components/features/charts/PriceChartMulti"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);

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
  return (
    <PageLayout lastUpdatedDate={lastChecked}>
      <div className="min-h-200">
        {/* Categorised Product Grids*/}
        <h1 className="grid-title">{countdownProduct?.name}</h1>
        <div className="flex mx-auto w-full max-w-7xl h-125">
          <MultiStorePriceHistoryChart
            countdownProduct={countdownProduct}
            paknsaveProduct={paknsaveProduct}
            warehouseProduct={warehouseProduct}
            newworldProduct={newworldProduct}
          />
        </div>
      </div>
    </PageLayout>
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
  });

  const lastChecked = await DBGetMostRecentDate();

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
