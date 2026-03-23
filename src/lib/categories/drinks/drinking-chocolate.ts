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
      titles: ["Sachets"],
      regexMatch: /sticks|sachet|pack|each|\bx\b/i,
      matchField: "both",
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Powder",
    otherMaxProductsToShow: 15,
  },
};
