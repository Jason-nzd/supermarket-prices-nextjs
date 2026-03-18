import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const milk: CategoryDefinitions["milk"] = {
  title: "Fresh Milk",
  icon: "🥛",
  subcategories: [
    createSubCategory({
      titles: ["Standard Milk"],
      regexMatch: /standard|original|blue|gate.milk/i,
    }),
    createSubCategory({
      titles: ["Trim Milk"],
      regexMatch: /trim|lite|light.blue|reduced|fat/i,
    }),
    createSubCategory({
      titles: ["Oat Milk", "Almond Milk", "Soy Milk"],
      regexMatch: /oat|almond|soy|lacto/i,
    }),
    createSubCategory({
      titles: ["Flavoured Milk", "Chocolate Milk"],
      regexMatch: /chocolate|caramel|flavoured|calci-yum/i,
    }),
    createSubCategory({
      titles: ["Other Milk"],
      regexMatch: /milk/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
  ],
};
