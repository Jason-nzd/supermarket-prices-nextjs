import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 5,
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
      titles: ["Oranges", "Tangerines", "Mandarins"],
      regexMatch: /^(?!.*(?:avocado|juice)).*(?:orange|mandarin|tangerine).*/i,
    }),
    createSubCategory({
      titles: ["Lemons", "Limes"],
      regexMatch: /^(?!.*(?:avocado|juice)).*(?:lemon|lime).*/i,
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
      titles: ["Apricots", "Peaches", "Plums", "Nectarines"],
      regexMatch: /apricot|peach|nectarine|plums/i,
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
      titles: ["Avocado"],
      regexMatch: /avocado/i,
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
