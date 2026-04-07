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
      LastChecked.Within7Days,
      OrderByMode.Latest,
    ),
    10,
  );

  const paknsaveProducts = sortByHotProducts(
    await DBFetchAll(
      200,
      Store.Paknsave,
      PriceHistoryLimit.TwoOrMore,
      LastChecked.Within7Days,
      OrderByMode.Latest,
    ),
    10,
  );

  const warehouseProducts = sortByHotProducts(
    await DBFetchAll(
      200,
      Store.Warehouse,
      PriceHistoryLimit.TwoOrMore,
      LastChecked.Within7Days,
      OrderByMode.Latest,
    ),
    5,
  );

  const newworldProducts = sortByHotProducts(
    await DBFetchAll(
      200,
      Store.NewWorld,
      PriceHistoryLimit.TwoOrMore,
      LastChecked.Within7Days,
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
  beer: 0.5,
  wine: 0.5,
  "craft-beer": 0.5,
  seafood: 0.5,
  "dog-treats": 0.7,
  "cat-treats": 0.7,
  salmon: 0.5,
  "beef-lamb": 0.8,
  pork: 0.8,
  chicken: 0.8,
  ham: 0.8,
  "dog-food": 0.8,
  "cat-food": 0.8,
  sausages: 0.8,
  "patties-meatballs": 0.7,
  "ice-blocks": 0.7,
  milk: 1.4,
  chocolate: 0.8,
  fruit: 1.2,
  "fresh-vegetables": 1.1,
};

/**
 * Sorts products by a hot score and limits the result.
 * Hot score is computed from price change magnitude, recency, and category.
 * @param products - Array of products to sort
 * @param limit - Maximum number of products to return
 * @returns Limited array of products sorted by hot score (descending)
 */
function sortByHotProducts(products: Product[], limit: number): Product[] {
  const priceChangeFactor = 5;
  const recentChangeFactor = 3;
  const categoryInfluenceFactor = 1;
  const priceReductionBonusFactor = 2;

  const productsWithScore = products.filter((product) => {
    const mostRecent = product.priceHistory[product.priceHistory.length - 1];
    if (!mostRecent?.date) {
      console.log("filtered out product without recent date: " + product.name);
      return false;
    }
    return true;
  });

  // console.log(
  //   `sortByHotProducts: ${products.length} in, ${productsWithScore.length} after filter, limit=${limit}`,
  // );

  const scored = productsWithScore.map((product) => {
    const priceHistory = product.priceHistory;
    const mostRecent = priceHistory[priceHistory.length - 1];
    const secondMostRecent = priceHistory[priceHistory.length - 2];

    let hotScore = 0;
    let priceChangeScore = 0;
    let recencyScore = 0;
    let priceChange = 0;

    if (mostRecent && secondMostRecent) {
      priceChange =
        (mostRecent.price - secondMostRecent.price) / secondMostRecent.price;
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
      const daysSinceChange = Math.round(
        (Date.now() - new Date(mostRecent.date).getTime()) /
          (1000 * 60 * 60 * 24),
      );
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

    // const paddedName = product.name.padEnd(30).slice(0, 30);
    // console.log(
    //   `${paddedName} | price: ${priceChange.toFixed(1).padStart(4).padEnd(4)} % score: ${priceChangeScore.toFixed(1).padEnd(3)} | recency: ${recencyScore.toFixed(1)} | category: ${adjustedCategoryMultiplier.toFixed(1)} | bonus: ${priceChange < 0 ? priceReductionBonusFactor : 1} | final: ${finalScore.toFixed(2)}`,
    // );

    return { product, hotScore: finalScore };
  });

  return scored
    .sort((a, b) => b.hotScore - a.hotScore)
    .map(({ product }) => product)
    .slice(0, limit);
}
