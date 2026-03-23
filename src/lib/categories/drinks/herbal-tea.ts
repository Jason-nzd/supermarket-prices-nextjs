import { CategoryDefinitions } from "@/typings";

export const herbalTea: CategoryDefinitions["herbal-tea"] = {
  title: "Herbal Tea",
  icon: "🌿",
  subcategories: [
    {
      titles: ["Herbal Teabags"],
      regexMatch: /(bags|\bx\b\d*g)/i,
      matchField: "both",
      titleAsSearchLink: false,
      maxProductsToShow: 15,
    },
    {
      titles: ["Sachets"],
      regexMatch: /sachet/i,
      matchField: "both",
      titleAsSearchLink: false,
      maxProductsToShow: 5,
    },
    {
      titles: ["Loose Leaf"],
      regexMatch: /loose|leaf/i,
      titleAsSearchLink: false,
      maxProductsToShow: 5,
    },
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 5,
  },
};
