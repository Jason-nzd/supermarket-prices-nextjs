import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 5,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const oilsVinegars: CategoryDefinitions["oils-vinegars"] = {
  title: "Oils & Vinegars",
  icon: "🫒",
  subcategories: [
    createSubCategory({
      titles: ["Vinegar"],
      regexMatch: /vinegar/i,
      maxProductsToShow: 10
    }),
    createSubCategory({
      titles: ["Olive Oil"],
      regexMatch: /olive/i,
    }),
    createSubCategory({
      titles: ["Canola Oil"],
      regexMatch: /canola/i,
    }),
    createSubCategory({
      titles: ["Rice Bran Oil"],
      regexMatch: /rice.bran/i,
    }),
    createSubCategory({
      titles: ["Sunflower Oil"],
      regexMatch: /sunflower/i,
    }),
    createSubCategory({
      titles: ["Soybean Oil"],
      regexMatch: /soybean/i,
    }),
    createSubCategory({
      titles: ["Ghee", "Shortening"],
      regexMatch: /ghee|shortening/i,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 5,
  },
};
