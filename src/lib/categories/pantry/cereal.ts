import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 5,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const cereal: CategoryDefinitions["cereal"] = {
  title: "Cereal",
  icon: "🥣",
  subcategories: [
    createSubCategory({
      titles: ["Oats"],
      regexMatch: /oats|oat.sachets|porridge/i,
    }),
    createSubCategory({
      titles: ["Weetbix", "Wheat Biscuits"],
      regexMatch: /weet|wheat/i,
    }),
    createSubCategory({
      titles: ["Muesli", "Sultana Bran"],
      regexMatch: /^(?!.*(vogel|protein|delish)).*(muesli|sultana)/i,
    }),
    createSubCategory({
      titles: ["Granola", "Clusters"],
      regexMatch: /cluster|muesli|sultana|granola|ganola|blue.frog|pure.delish/i,
    }),
    createSubCategory({
      titles: ["Corn Flakes"],
      regexMatch: /^(?!.*(hubbard|kellogg|special.k|rice)).*corn|just.right|flakes|great.start/i,
    }),
    createSubCategory({
      titles: ["Premium Corn Flakes"],
      regexMatch: /light.*?right|special.k|corn|vogel/i,
      titleAsSearchLink: false,
    }),
    createSubCategory({
      titles: ["Rice Puffs"],
      regexMatch: /rice|ricies|lcm|thank.goodness/i,
    }),
    createSubCategory({
      titles: ["Cocoa Puffs", "Milo", "Coco Pops", "Nesquik"],
      regexMatch: /^(?!.*(liquid)).*(coco|milo|nesquik|choc)/i,
    }),
    createSubCategory({
      titles: ["Multi-Grain", "NutriGrain", "Trix", "Chex", "Loops"],
      regexMatch: /grain|trix|chex|honey|loops/i,
    }),
    createSubCategory({
      titles: ["Bran"],
      regexMatch: /bran|husk/i,
    }),
    createSubCategory({
      titles: ["Up & Go", "Liquid Breakfast"],
      regexMatch: /up...go|liquid/i,
    }),
  ],
  // otherSubcategory: {
  //   useOtherSubcategory: true,
  //   otherTitle: "Other Cereal",
  //   otherMaxProductsToShow: 5,
  // },
};
