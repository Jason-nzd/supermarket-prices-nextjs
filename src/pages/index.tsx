import ProductsGrid from "@/components/features/products/ProductGrid";
import { Product } from "@/typings";
import { DBFetchAll, DBGetMostRecentDate } from "@/lib/db/cosmos";
import { OrderByMode, PriceHistoryLimit, Store } from "@/lib/enums";
import StandardPageLayout from "@/components/layout/StandardPageLayout";

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
  return (
    <StandardPageLayout lastUpdatedDate={lastChecked}>
      {/* Page Title */}
      <div className="grid-title">{"Today's Trending Products"}</div>
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
    </StandardPageLayout>
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
