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
    "sausages",
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
        titles: ["Precooked Sausages"],
        match:
          /^(?!.*(chicken|pork|beef)).*(meat|pre.?cooked|hellers|beehive)/i,
        matchField: "both",
        titleAsSearchLink: true,
        maxProductsToShow: 10,
      },
      {
        titles: ["Beef Sausages"],
        match: /(beef)/i,
        matchField: "both",
        titleAsSearchLink: true,
        maxProductsToShow: 10,
      },
      {
        titles: ["Chicken Sausages"],
        match: /(chicken)/i,
        matchField: "both",
        titleAsSearchLink: true,
        maxProductsToShow: 5,
      },
      {
        titles: ["Pork Sausages"],
        match: /(pork|bacon)/i,
        matchField: "both",
        titleAsSearchLink: true,
        maxProductsToShow: 5,
      },
      {
        titles: ["Frankfurters"],
        match: /(frankfurter|franks)/i,
        matchField: "both",
        titleAsSearchLink: true,
        maxProductsToShow: 5,
      },
      {
        titles: ["Cheerios", "Saveloys", "Kransky", "Cocktail Sausages"],
        match: /(cheerio|saveloy|cocktail|kransky)/i,
        matchField: "both",
        titleAsSearchLink: true,
        maxProductsToShow: 5,
      },
      {
        titles: ["Lamb Sausages"],
        match: /(lamb)/i,
        matchField: "both",
        titleAsSearchLink: true,
        maxProductsToShow: 5,
      },
    ],
    {
      useLeftoverProducts: true,
      leftoverProductsTitle: "Other Sausages",
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
