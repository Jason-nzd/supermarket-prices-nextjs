import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const butter: CategoryDefinitions["butter"] = {
  title: "Butter",
  icon: "🧈",
  subcategories: [
    createSubCategory({
      titles: ["Butter"],
      regexMatch: /butter/i,
      maxProductsToShow: 15,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Spreads",
    otherMaxProductsToShow: 15,
  },
};
