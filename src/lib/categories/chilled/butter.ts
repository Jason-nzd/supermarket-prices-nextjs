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
      regexMatch: /^(?!.*(spread)).*butter/i,
    }),
    createSubCategory({
      titles: ["Buttery Spreads"],
      regexMatch: /butter/i,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Olive Oil Spreads"],
      regexMatch: /olive|olivani/i,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Lite Spreads"],
      regexMatch: /light|lite|reduced/i,
      maxProductsToShow: 5,
    }),

  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other Spreads",
    otherMaxProductsToShow: 10,
  },
};
