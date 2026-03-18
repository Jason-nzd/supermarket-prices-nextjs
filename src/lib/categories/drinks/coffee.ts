import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const coffee: CategoryDefinitions["coffee"] = {
  title: "Coffee",
  icon: "☕",
  subcategories: [

    createSubCategory({
      titles: ["Instant Coffee"],
      regexMatch: /^(?!.*(iced|capsule|pod|sachet)).*(instant|jarrah|freeze|decaf)/i,
    }),
    createSubCategory({
      titles: ["Sachet Coffee"],
      regexMatch: /sachet|sticks|pack|avalanche.coffee.mix|sugar.free.coffee.mix/i,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Grind Coffee", "Plunger Coffee", "Filter Coffee"],
      regexMatch: /ground|powder|grind|plunger/i,
    }),
    createSubCategory({
      titles: ["Coffee Beans"],
      regexMatch: /beans/i,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Coffee Capsules", "Coffee Pods", "Dolce Gusto", "Nespresso"],
      regexMatch: /capsule|pods|gusto|nespresso/i,
    }),

  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other Coffee",
    otherMaxProductsToShow: 5,
  },
};
