import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 10,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const sausages: CategoryDefinitions["sausages"] = {
  title: "Sausages",
  icon: "🌭",
  subcategories: [
    createSubCategory({
      titles: ["Precooked Sausages"],
      regexMatch: /^(?!.*(chicken|pork|beef)).*(meat|pre.?cooked|hellers|beehive)/i,
      titleAsSearchLink: true,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Beef Sausages"],
      regexMatch: /(beef)/i,
      titleAsSearchLink: true,
      maxProductsToShow: 10,
    }),
    createSubCategory({
      titles: ["Chicken Sausages"],
      regexMatch: /(chicken)/i,
      titleAsSearchLink: true,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Pork Sausages"],
      regexMatch: /(pork|bacon)/i,
      titleAsSearchLink: true,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Frankfurters"],
      regexMatch: /(frankfurter|franks)/i,
      titleAsSearchLink: true,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Cheerios", "Saveloys", "Kransky", "Cocktail Sausages"],
      regexMatch: /(cheerio|saveloy|cocktail|kransky)/i,
      titleAsSearchLink: true,
      maxProductsToShow: 5,
    }),
    createSubCategory({
      titles: ["Lamb Sausages"],
      regexMatch: /(lamb)/i,
      titleAsSearchLink: true,
      maxProductsToShow: 5,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other Sausages",
    otherMaxProductsToShow: 10,
  },
};
