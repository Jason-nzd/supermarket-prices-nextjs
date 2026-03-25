import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 5,
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
      regexMatch: /standard|original|blue|gate.milk|barista/i,
      maxProductsToShow: 10
    }),
    createSubCategory({
      titles: ["Trim Milk"],
      regexMatch: /trim|lite|light.blue|reduced|fat/i,
    }),
    createSubCategory({
      titles: ["A2 Milk", "Lactose Free Milk"],
      regexMatch: /a2|lacto/i,
    }),
    createSubCategory({
      titles: ["Flavoured Milk", "Chocolate Milk"],
      regexMatch: /chocolate|caramel|flavoured|calci-yum|banana/i,
    }),
    createSubCategory({
      titles: ["Other Milk"],
      regexMatch: /milk/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
  ],
};
