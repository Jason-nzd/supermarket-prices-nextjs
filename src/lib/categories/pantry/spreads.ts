import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const spreads: CategoryDefinitions["spreads"] = {
  title: "Spreads",
  icon: "🍯",
  subcategories: [
    createSubCategory({
      titles: ["Premium Nut Butters"],
      regexMatch: /(fogg|pic|mother|brothers|macro|ceres).*butter/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Value Nut Butters"],
      regexMatch: /butter/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Strawberry Jam", "Raspberry Jam", "Plum Jam", "Apricot Jam"],
      regexMatch: /jam|berry/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Honey"],
      regexMatch: /honey/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Vegemite", "Marmite"],
      regexMatch: /vegemite|marmite|yeast/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Hazelnut", "Nutella"],
      regexMatch: /hazelnut|nutella/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Marmalade"],
      regexMatch: /marmalade|lemon/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other Spreads",
    otherMaxProductsToShow: 10,
  },
};
