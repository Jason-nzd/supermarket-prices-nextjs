import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const pattiesMeatballs: CategoryDefinitions["patties-meatballs"] = {
  title: "Patties & Meatballs",
  icon: "🍖",
  subcategories: [
    createSubCategory({
      titles: ["Beef Patties"],
      regexMatch: /(?=.*\b(beef|meat|bbq|quarter)\b)(?=.*(patties|burger|grillers))/,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Chicken Patties"],
      regexMatch: /(?=.*\bchicken\b)(?=.*(patties|burger|grillers))/i,
      titleAsSearchLink: false,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Meatballs & Rissoles"],
      regexMatch: /(meatball|rissole)/i,
      titleAsSearchLink: false,
      maxProductsToShow: 5,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 10,
  },
};
