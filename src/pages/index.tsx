import ProductsGrid from "@/components/features/products/ProductGrid";
import { Product } from "@/typings";
import { DBFetchAll, DBGetMostRecentDate } from "@/lib/db/cosmos";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
} from "@/lib/enums";
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
        <ProductsGrid products={countdownProducts} key="countdown" />
      )}
      {paknsaveProducts && (
        <ProductsGrid products={paknsaveProducts} key="paknsave" />
      )}
      {warehouseProducts && (
        <ProductsGrid products={warehouseProducts} key="warehouse" />
      )}
      {newworldProducts && (
        <ProductsGrid products={newworldProducts} key="newworld" />
      )}
    </StandardPageLayout>
  );
}

// Perform a DB lookup for each store, so all stores get some coverage on the home page
export async function getStaticProps() {
  const countdownProducts = sortByHotProducts(
    await DBFetchAll(
      200,
      Store.Countdown,
      PriceHistoryLimit.TwoOrMore,
      LastChecked.Within3Days,
      OrderByMode.Latest,
    ),
    10,
  );

  const paknsaveProducts = sortByHotProducts(
    await DBFetchAll(
      200,
      Store.Paknsave,
      PriceHistoryLimit.TwoOrMore,
      LastChecked.Within3Days,
      OrderByMode.Latest,
    ),
    10,
  );

  const warehouseProducts = sortByHotProducts(
    await DBFetchAll(
      200,
      Store.Warehouse,
      PriceHistoryLimit.TwoOrMore,
      LastChecked.Within3Days,
      OrderByMode.Latest,
    ),
    5,
  );

  const newworldProducts = sortByHotProducts(
    await DBFetchAll(
      200,
      Store.NewWorld,
      PriceHistoryLimit.TwoOrMore,
      LastChecked.Within3Days,
      OrderByMode.Latest,
    ),
    5,
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

/**
 * Category multipliers for hot score calculation.
 * Categories not listed here use a default multiplier of 1.
 */
const categoryHotScoreMultipliers: Record<string, number> = {
  beer: 0.3,
  wine: 0.3,
  "craft-beer": 0.3,
  seafood: 0.3,
  "dog-treats": 0.5,
  "cat-treats": 0.5,
  salmon: 0.5,
  "beef-lamb": 0.8,
  pork: 0.7,
  chicken: 0.7,
  "dog-food": 0.7,
  "cat-food": 0.7,
  sausages: 0.7,
  "patties-meatballs": 0.7,
  "ice-blocks": 0.7,
  milk: 1.4,
  chocolate: 1,
  fruit: 1.2,
};

/**
 * Sorts products by a hot score and limits the result.
 * Hot score is computed from price change magnitude, recency, and category.
 * @param products - Array of products to sort
 * @param limit - Maximum number of products to return
 * @returns Limited array of products sorted by hot score (descending)
 */
function sortByHotProducts(products: Product[], limit: number): Product[] {
  const priceChangeFactor = 0.5;
  const recentChangeFactor = 6;
  const categoryInfluenceFactor = 0.8;
  const priceReductionBonusFactor = 0.7;
  const maxDaysSinceChange = 7;

  const productsWithScore = products
    .filter((product) => {
      const mostRecent = product.priceHistory[product.priceHistory.length - 1];
      if (!mostRecent?.date) return false;
      const daysSinceChange =
        (Date.now() - new Date(mostRecent.date).getTime()) /
        (1000 * 60 * 60 * 24);
      return daysSinceChange <= maxDaysSinceChange;
    })
    .map((product) => {
      const priceHistory = product.priceHistory;
      const mostRecent = priceHistory[priceHistory.length - 1];
      const secondMostRecent = priceHistory[priceHistory.length - 2];

      let hotScore = 0;
      let priceChangeScore = 0;
      let recencyScore = 0;
      let priceChange = 0;

      if (mostRecent && secondMostRecent) {
        priceChange = mostRecent.price - secondMostRecent.price;
        const absPriceChange = Math.abs(priceChange) * priceChangeFactor;

        // Price reductions get a bonus multiplier
        if (priceChange < 0) {
          priceChangeScore = absPriceChange * priceReductionBonusFactor;
        } else {
          priceChangeScore = absPriceChange;
        }
        hotScore += priceChangeScore;
      }

      if (mostRecent?.date) {
        const daysSinceChange =
          (Date.now() - new Date(mostRecent.date).getTime()) /
          (1000 * 60 * 60 * 24);
        recencyScore = (1 / (daysSinceChange + 1)) * recentChangeFactor;
        hotScore += recencyScore;
      }

      const categoryMultiplier =
        categoryHotScoreMultipliers[product.category] ?? 1;
      // Use exponent to amplify deviation from 1:
      // <1 becomes smaller, >1 becomes larger
      const adjustedCategoryMultiplier = Math.pow(
        categoryMultiplier,
        categoryInfluenceFactor + 1,
      );
      const finalScore = hotScore * adjustedCategoryMultiplier;

      // const paddedName = product.name.padEnd(20).slice(0, 20);
      // console.log(
      //   `${paddedName} | price: ${priceChangeScore.toFixed(2)} | recency: ${recencyScore.toFixed(2)} | category: ${adjustedCategoryMultiplier.toFixed(2)} | bonus: ${priceChange < 0 ? priceReductionBonusFactor : 1} | final: ${finalScore.toFixed(2)}`,
      // );

      return { product, hotScore: finalScore };
    });

  return productsWithScore
    .sort((a, b) => b.hotScore - a.hotScore)
    .map(({ product }) => product)
    .slice(0, limit);
}
