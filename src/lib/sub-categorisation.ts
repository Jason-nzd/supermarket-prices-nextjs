import { Product, ProductGridData } from "@/typings";
import { printProductCountSubTitle, sortProductsByUnitPrice } from "./utils";

export interface CategoryRule {
  titles: string[];
  match: string | RegExp | ((product: Product) => boolean);
  matchField?: "name" | "size" | "both";
  createSearchLink?: boolean;
  createDeepLink?: string;
  trimColumns?: boolean;
  limit?: number;
}

export interface CategorizeOptions {
  useOther?: boolean;
  otherTitle?: string;
  otherLimit?: number;
  sort?: boolean;
  defaultLimit?: number;
}

/**
 * Categorizes a list of products into multiple bucketed grids based on rules.
 * Supports mutual exclusion (first match wins).
 */
export function buildSubCategoryGrids(
  products: Product[],
  rules: CategoryRule[],
  options: CategorizeOptions = {}
): ProductGridData[] {
  const {
    useOther = false,
    otherTitle = "Other",
    otherLimit = 10,
    sort = true,
    defaultLimit = 15,
  } = options;

  const results: { rule: CategoryRule; products: Product[]; dbCount: number }[] =
    rules.map((rule) => ({
      rule,
      products: [],
      dbCount: 0,
    }));

  const otherProducts: Product[] = [];
  let otherDbCount = 0;

  products.forEach((product) => {
    const name = product.name.toLowerCase();
    const size = (product.size || "").toLowerCase();

    let matched = false;
    for (const res of results) {
      const { rule } = res;
      let isMatch = false;

      if (typeof rule.match === "function") {
        isMatch = rule.match(product);
      } else {
        const regex =
          typeof rule.match === "string"
            ? new RegExp(rule.match, "i")
            : rule.match;
        const field = rule.matchField || "name";

        if (field === "name") isMatch = !!name.match(regex);
        else if (field === "size") isMatch = !!size.match(regex);
        else if (field === "both")
          isMatch = !!name.match(regex) || !!size.match(regex);
      }

      if (isMatch) {
        res.dbCount++;
        res.products.push(product);
        matched = true;
        break;
      }
    }

    if (!matched && useOther) {
      otherDbCount++;
      otherProducts.push(product);
    }
  });

  const productGrids: ProductGridData[] = results.map((res) => {
    let gridProducts = res.products;
    if (sort) gridProducts = sortProductsByUnitPrice(gridProducts);

    const limit = res.rule.limit || defaultLimit;
    const finalProducts = gridProducts.slice(0, limit);

    return {
      titles: res.rule.titles,
      subTitle: printProductCountSubTitle(finalProducts.length, res.dbCount),
      products: finalProducts,
      createSearchLink: res.rule.createSearchLink ?? true,
      createDeepLink: res.rule.createDeepLink || "",
      trimColumns: res.rule.trimColumns ?? false,
    };
  });

  if (useOther && otherProducts.length > 0) {
    let gridProducts = otherProducts;
    if (sort) gridProducts = sortProductsByUnitPrice(gridProducts);
    const finalProducts = gridProducts.slice(0, otherLimit);

    productGrids.push({
      titles: [otherTitle],
      subTitle: printProductCountSubTitle(finalProducts.length, otherDbCount),
      products: finalProducts,
      createSearchLink: false,
    });
  }

  return productGrids;
}
