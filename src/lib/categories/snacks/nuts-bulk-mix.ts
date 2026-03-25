import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 5,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const nutsBulkMix: CategoryDefinitions["nuts-bulk-mix"] = {
  title: "Nuts & Bulk Mix",
  icon: "🥜",
  subcategories: [
    createSubCategory({
      titles: ["Peanuts"],
      regexMatch: /peanut/i,
    }),
    createSubCategory({
      titles: ["Cashews"],
      regexMatch: /cashew/i,
    }),
    createSubCategory({
      titles: ["Almonds", "Walnuts", "Pistachio", "Macadamia", "Mixed Nuts"],
      regexMatch: /almond|walnut|pistachio|macadamia|nuts/i,
    }),
    createSubCategory({
      titles: ["Snack Mix", "Trail Mix", "Scrummy", "Scroggin", "Bhujah Mix"],
      regexMatch: /trail|scrummy|scroggin|brazilian|bhujah|snack.mix|trio|vitality|superboost|medley|bar.mix|raw.power/i,
    }),
    createSubCategory({
      titles: ["Dried Fruit"],
      regexMatch: /berries|berry|mango|fruit|apricot|apple|ginger|papaya/i,
      titleAsSearchLink: false
    }),
    createSubCategory({
      titles: ["Banana Chips", "Rice Crackers", "Snippets"],
      regexMatch: /banana|chip|cracker|bbq|snippet/i,
    }),
    createSubCategory({
      titles: ["Lentils", "Couscous", "Quinoa"],
      regexMatch: /lentil|couscous|quinoa/i,

    }),
    createSubCategory({
      titles: ["Raisins", "Sultanas", "Dates", "Prunes"],
      regexMatch: /raisin|sultana|dates|prune/i,
    }),
    createSubCategory({
      titles: ["Seeds"],
      regexMatch: /seed/i,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 5,
  },
};
