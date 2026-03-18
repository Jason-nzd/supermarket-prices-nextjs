import { GetStaticProps } from "next";
import { ProductGridData } from "@/typings";
import ProductsGrid from "@/components/features/products/ProductGrid";
import { DBFetchByCategory, DBGetMostRecentDate } from "@/lib/db/cosmos";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
} from "@/lib/enums";
import StandardPageLayout from "@/components/layout/StandardPageLayout";

interface Props {
  productGridDataAll: ProductGridData[];
  lastChecked: string;
}

const Category = ({ productGridDataAll, lastChecked }: Props) => {
  return (
    <StandardPageLayout lastUpdatedDate={lastChecked}>
      {productGridDataAll.map((productGridData, index) => (
        <ProductsGrid
          key={index}
          titles={productGridData.titles}
          subTitle={productGridData.subTitle}
          products={productGridData.products}
          titleAsSearchLink={productGridData.titleAsSearchLink}
        />
      ))}
    </StandardPageLayout>
  );
};

import { buildSubCategoryGrids } from "@/lib/sub-categorisation";

export const getStaticProps: GetStaticProps = async () => {
  const products = await DBFetchByCategory(
    "patties-meatballs",
    300,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days,
  );

  const productGridDataAll = buildSubCategoryGrids(
    products,
    [
      {
        titles: ["Beef Patties"],
        match:
          /(?=.*\b(beef|meat|bbq|quarter)\b)(?=.*(patties|burger|grillers))/,
        matchField: "both",
        titleAsSearchLink: false,
        maxProductsToShow: 10,
      },
      {
        titles: ["Chicken Patties"],
        match: /(?=.*\bchicken\b)(?=.*(patties|burger|grillers))/i,
        matchField: "both",
        titleAsSearchLink: false,
        maxProductsToShow: 10,
      },
      {
        titles: ["Meatballs & Rissoles"],
        match: /(meatball|rissole)/i,
        matchField: "both",
        titleAsSearchLink: false,
        maxProductsToShow: 5,
      },
    ],
    {
      useLeftoverProducts: true,
      leftoverProductsTitle: "Other",
      leftoverMaxProductsToShow: 10,
      sort: true,
    },
  );

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
