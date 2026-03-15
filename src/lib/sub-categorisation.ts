import { Product, ProductGridData } from "@/typings";
import { printProductCountSubTitle, sortProductsByUnitPrice } from "./utils";

export interface SubCategoryRule {
  titles: string[];
  match: string | RegExp | ((product: Product) => boolean);
  matchField?: "name" | "size" | "both";
  titleAsSearchLink?: boolean;
  createDeepLink?: string;
  trimColumns?: boolean;
  maxProductsToShow?: number;
}

export interface CategorizeOptions {
  useLeftoverProducts?: boolean;
  leftoverProductsTitle?: string;
  leftoverMaxProductsToShow?: number;
  sort?: boolean;
  maxProductsToShow?: number;
}

/**
 * Categorizes a list of products into multiple bucketed grids based on rules.
 * Supports mutual exclusion (first match wins).
 */
export function buildSubCategoryGrids(
  products: Product[],
  rules: SubCategoryRule[],
  options: CategorizeOptions = {}
 ): ProductGridData[] {
  const {
    useLeftoverProducts = false,
    leftoverProductsTitle = "Other",
    leftoverMaxProductsToShow = 10,
    sort = true,
    maxProductsToShow = 15,
  } = options;

  const results: { rule: SubCategoryRule; products: Product[]; dbCount: number }[] =
    rules.map((rule) => ({
      rule,
      products: [],
      dbCount: 0,
    }));

  const leftoverProducts: Product[] = [];
  let leftoverDbCount = 0;

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

    if (!matched && useLeftoverProducts) {
      leftoverDbCount++;
      leftoverProducts.push(product);
    }
  });

  const productGrids: ProductGridData[] = results.map((res) => {
    let gridProducts = res.products;
    if (sort) gridProducts = sortProductsByUnitPrice(gridProducts);

    const limit = res.rule.maxProductsToShow || maxProductsToShow;
    const finalProducts = gridProducts.slice(0, limit);

    return {
      titles: res.rule.titles,
      subTitle: printProductCountSubTitle(finalProducts.length, res.dbCount),
      products: finalProducts,
      titleAsSearchLink: res.rule.titleAsSearchLink ?? true,
      createDeepLink: res.rule.createDeepLink || "",
      trimColumns: res.rule.trimColumns ?? false,
    };
  });

  if (useLeftoverProducts && leftoverProducts.length > 0) {
    let gridProducts = leftoverProducts;
    if (sort) gridProducts = sortProductsByUnitPrice(gridProducts);
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
