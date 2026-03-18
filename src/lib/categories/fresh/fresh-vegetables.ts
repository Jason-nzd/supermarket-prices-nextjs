import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const freshVegetables: CategoryDefinitions["fresh-vegetables"] = {
  title: "Fresh Vegetables",
  icon: "🥬",
  subcategories: [
    createSubCategory({
      titles: ["Potatoes", "Kumara"],
      regexMatch: /potato|kumara/i,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Broccoli", "Cauliflower", "Cabbage"],
      regexMatch: /broccoli|cauliflower|cabbage/i,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Carrots", "Yams"],
      regexMatch: /carrot|parsnip|beetroot|yam|daikon/i,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Lettuce", "Spinach", "Celery", "Sprouts"],
      regexMatch: /lettuce|spinach|celery|sprouts|choy|salad/i,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Mushrooms"],
      regexMatch: /mushroom/i,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Tomatoes", "Cucumber", "Capsicum"],
      regexMatch: /tomato|capsicum|cucumber/i,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Onions", "Shallots", "Leek"],
      regexMatch: /onion|shallot|leek/i,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Chili", "Garlic", "Ginger"],
      regexMatch: /chili|garlic|ginger/i,
      maxProductsToShow: 5,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other Vegetables",
    otherMaxProductsToShow: 10,
  },
};
