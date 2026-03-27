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
      regexMatch: /(?=.*\b(beef|meat|bbq|quarter)\b)(?=.*(patties|burger|griller|slider|smash))/,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Chicken Patties"],
      regexMatch: /(?=.*?chicken).*?(patties|burger|griller|slider)/i,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Pork Patties", "Lamb Patties"],
      regexMatch: /(?=.*?(pork|lamb)).*?(patties|burger|griller|slider)/i,
      maxProductsToShow: 5,
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
