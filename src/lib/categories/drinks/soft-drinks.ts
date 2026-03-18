import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const softDrinks: CategoryDefinitions["soft-drinks"] = {
  title: "Soft Drinks",
  icon: "🥤",
  subcategories: [
    createSubCategory({
      titles: ["Soft Drinks (Cans & Small Bottles)"],
      regexMatch: /can|pack|tray/i,
      titleAsSearchLink: false,
      maxProductsToShow: 20,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Soft Drinks (Large Bottles)",
    otherMaxProductsToShow: 20,
  },
};
