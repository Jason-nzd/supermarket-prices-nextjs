import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 5,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const longLifeMilk: CategoryDefinitions["long-life-milk"] = {
  title: "Long Life & Plant Milk",
  icon: "🥛",
  subcategories: [
    createSubCategory({
      titles: ["Long Life Milk"],
      regexMatch: /^(?!.*(?:oat|soy|almond|coconut|plant)).*(?:uht).*/i,
    }),
    createSubCategory({
      titles: ["Oat Milk"],
      regexMatch: /oat/i,
    }),
    createSubCategory({
      titles: ["Soy Milk"],
      regexMatch: /soy/i,
    }),
    createSubCategory({
      titles: ["Almond Milk"],
      regexMatch: /almond/i,
    }),
    createSubCategory({
      titles: ["Milk Powder"],
      regexMatch: /powder/i,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 5,
  },
};