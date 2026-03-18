import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const fruit: CategoryDefinitions["fruit"] = {
  title: "Fruit",
  icon: "🍎",
  subcategories: [
    createSubCategory({
      titles: ["Apples"],
      regexMatch: /^(?!.*pineapple).*apple.*/i,
      titleAsSearchLink: false,
      createDeepLink: "/products/fruit/",
    }),
    createSubCategory({
      titles: ["Bananas"],
      regexMatch: /banana/i,
      titleAsSearchLink: false,
      createDeepLink: "/products/fruit/",
    }),
    createSubCategory({
      titles: ["Oranges", "Lemons", "Limes", "Tangerines", "Mandarins"],
      regexMatch: /^(?!.*(?:avocado|juice)).*(?:orange|mandarin|lemon|lime).*/i,
    }),
    createSubCategory({
      titles: ["Pears"],
      regexMatch: /pears/i,
    }),
    createSubCategory({
      titles: ["Kiwifruit", "Feijoa"],
      regexMatch: /feijoa|kiwifruit/i,
    }),
    createSubCategory({
      titles: ["Peaches", "Plums", "Nectarines"],
      regexMatch: /peach|nectarine|plums/i,
    }),
    createSubCategory({
      titles: ["Strawberries", "Blueberries", "Raspberries"],
      regexMatch: /berry|berries/i,
    }),
    createSubCategory({
      titles: ["Pineapple", "Mango", "Melon"],
      regexMatch: /pineapple|mango|melon/i,
    }),
    createSubCategory({
      titles: ["Grapes"],
      regexMatch: /grapes/i,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other Fruit",
    otherMaxProductsToShow: 10,
  },
};
