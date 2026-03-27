import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 5,
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
      matchField: "both",
      maxProductsToShow: 10
    }),
    createSubCategory({
      titles: ["Value 2L Tubs"],
      regexMatch: /^(?!.*(wahiki|crave)).*?frozen.dessert|marvel|wonder|moment|5l/,
      matchField: "both",
      maxProductsToShow: 10
    }),

    createSubCategory({
      titles: ["Premium 2L Tubs"],
      regexMatch: /(?<!\d\.)2l\b/,
      matchField: "both",
      maxProductsToShow: 10
    }),
    createSubCategory({
      titles: ["Premium Small Tubs"],
      regexMatch: /ice.?cream|frozen.dessert/,
      maxProductsToShow: 5
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
