import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const drinkingChocolate: CategoryDefinitions["drinking-chocolate"] = {
  title: "Drinking Chocolate",
  icon: "🍫",
  subcategories: [
    createSubCategory({
      titles: ["Drinking Chocolate"],
      regexMatch: /^(?!.*(?:sticks|sachet|bag|pack|each|\wx\w)).*/i,
      maxProductsToShow: 20,
    }),
    createSubCategory({
      titles: ["Sachets"],
      regexMatch: /sticks|sachet|bag|pack|each|\wx\w/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
  ],
};
