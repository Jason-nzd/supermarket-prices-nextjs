import { Product, ProductGridData, SubCategory } from "@/typings";
import { printProductCountSubTitle, sortProductsByUnitPrice } from "./utils";

/**
 * SUB-CATEGORISATION MODULE
 * =========================
 *
 * Data Flow:
 * 1. [category].tsx fetches products from DB
 * 2. [category].tsx reads category definition from /lib/categories/[group]/[category].ts
 * 3. [category].tsx passes SubCategory[] directly to buildSubCategoryGrids()
 * 4. buildSubCategoryGrids() sorts products into buckets based on regex matches
 * 5. Returns array of ProductGridData for ProductsGrid components
 *
 * Example:
 * - Category: "fruit"
 * - Subcategories: ["Apples", "Bananas", "Oranges", "Other Fruit"]
 * - Each product is tested against regex patterns in order
 * - First match wins (product goes into that bucket)
 * - Unmatched products go into "Other" bucket (if enabled)
 */

/**
 * Options for handling products that don't match any rule
 */
export interface CategorizeOptions {
  /** Include unmatched products in an "Other" bucket */
  useLeftoverProducts?: boolean;

  /** Title for the "Other" bucket (e.g., "Other Fruit") */
  leftoverProductsTitle?: string;

  /** Max products to show in the "Other" bucket */
  leftoverMaxProductsToShow?: number;
}

/**
 * Sorts products into subcategory grids based on regex matching rules
 *
 * @param products - Array of products from DB
 * @param subcategories - Subcategory definitions from /lib/categories/[group]/[category].ts
 * @param options - Options for leftover products
 * @returns Array of ProductGridData, one per subcategory
 */
export function separateProductsIntoSubCategories(
  products: Product[],
  subcategories: SubCategory[],
  options: CategorizeOptions = {}
): ProductGridData[] {
  const {
    useLeftoverProducts = false,
    leftoverProductsTitle = "Other",
    leftoverMaxProductsToShow = 10,
  } = options;

  // STEP 1: Create a bucket for each subcategory
  // Each bucket holds products that match that subcategory
  const buckets = subcategories.map((sub) => ({
    sub,
    products: [] as Product[],
    dbCount: 0, // Total count from DB (before limiting)
  }));

  const leftoverProducts: Product[] = [];
  let leftoverDbCount = 0;

  // STEP 2: Sort each product into the first matching bucket
  products.forEach((product) => {
    const name = product.name.toLowerCase();
    const size = (product.size || "").toLowerCase();

    let matched = false;

    // Test product against each subcategory in order
    for (const bucket of buckets) {
      const { sub } = bucket;

      // Test regex against the specified field(s)
      let isMatch = false;
      const field = sub.matchField || "name";

      if (field === "name") {
        isMatch = sub.regexMatch.test(name);
      } else if (field === "size") {
        isMatch = sub.regexMatch.test(size);
      } else if (field === "both") {
        isMatch = sub.regexMatch.test(name) || sub.regexMatch.test(size);
      }

      if (isMatch) {
        bucket.dbCount++;
        bucket.products.push(product);
        matched = true;
        break; // First match wins - stop testing
      }
    }

    // If no match and we want leftovers, add to leftover bucket
    if (!matched && useLeftoverProducts) {
      leftoverDbCount++;
      leftoverProducts.push(product);
    }
  });

  // STEP 3: Convert buckets to ProductGridData
  const productGrids: ProductGridData[] = buckets.map((bucket) => {
    // Sort products by unit price (cheapest first)
    const gridProducts = sortProductsByUnitPrice(bucket.products);

    // Limit to max products to show
    const limit = bucket.sub.maxProductsToShow || 15;
    const finalProducts = gridProducts.slice(0, limit);

    return {
      titles: bucket.sub.titles,
      subTitle: printProductCountSubTitle(finalProducts.length, bucket.dbCount),
      products: finalProducts,
      titleAsSearchLink: bucket.sub.titleAsSearchLink ?? true,
      createDeepLink: bucket.sub.createDeepLink || "",
      trimColumns: bucket.sub.trimColumns ?? false,
    };
  });

  // STEP 4: Add leftover "Other" bucket if enabled
  if (useLeftoverProducts && leftoverProducts.length > 0) {
    const gridProducts = sortProductsByUnitPrice(leftoverProducts);
    const finalProducts = gridProducts.slice(0, leftoverMaxProductsToShow);

    productGrids.push({
      titles: [leftoverProductsTitle],
      subTitle: printProductCountSubTitle(finalProducts.length, leftoverDbCount),
      products: finalProducts,
      titleAsSearchLink: false,
    });
  }

  return productGrids;
}
