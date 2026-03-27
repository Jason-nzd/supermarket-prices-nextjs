import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: false,
    ...sub,
  };
}

export const iceCream: CategoryDefinitions["ice-cream"] = {
  title: "Ice Cream",
  icon: "🍦",
  subcategories: [
    createSubCategory({
      titles: ["Ice Cream Multipacks"],
      regexMatch: /stick|pack|\dpk|\d.x.\d/,
      matchField: "both"
    }),
    createSubCategory({
      titles: ["Value 2L Tubs"],
      regexMatch: /^(?!.*(wahiki|crave)).*?frozen.dessert|marvel|wonder|moment|5l/,
      matchField: "both"
    }),

    createSubCategory({
      titles: ["Premium 2L Tubs"],
      regexMatch: /(?<!\d\.)2l\b/,
      matchField: "both",
    }),
    createSubCategory({
      titles: ["Premium Small Tubs"],
      regexMatch: /ice.?cream|frozen.dessert/,
    }),
    createSubCategory({
      titles: ["Gelato", "Sorbet", "Frozen Yoghurt"],
      regexMatch: /gelato|sorbet|frozen.yoghurt/,
      titleAsSearchLink: true,
      maxProductsToShow: 5
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 5,
  },
};
