import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const softDrinks: CategoryDefinitions["soft-drinks"] = {
  title: "Soft Drinks",
  icon: "🥤",
  subcategories: [
    createSubCategory({
      titles: ["Cans & Small Bottles"],
      regexMatch: /can|pack|tray/i,
      titleAsSearchLink: false,
    }),
    createSubCategory({
      titles: ["Pepsi", "Coca-Cola", "Schweppes", "Sprite", "L&P", "Mountain Dew"],
      regexMatch: /pepsi|coca|schweppes|sprite|l.?p|fanta|dew|lift|7*up|sparkling duet|just juice/i,
      titleAsSearchLink: true,
    }),
    createSubCategory({
      titles: ["Ginger Beer", "Bundaberg"],
      regexMatch: /ginger|bundaberg/i,
      titleAsSearchLink: false,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Value Brand Bottles"],
      regexMatch: /value|ninety nine|gold rush|woolworths|nice 99|nice soda|pams/i,
      titleAsSearchLink: false,
      maxProductsToShow: 5,
    }),
  ],
};
