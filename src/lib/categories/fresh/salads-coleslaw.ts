import { CategoryDefinitions } from "@/typings";

export const saladsColeslaw: CategoryDefinitions["salads-coleslaw"] = {
  title: "Salads & Coleslaw",
  icon: "🥗",
  subcategories: [
    {
      titles: ["Coleslaw"],
      regexMatch: /slaw/i,
      maxProductsToShow: 10,
    },
    {
      titles: ["Salads"],
      regexMatch: /salad|baby|mix/i,
      maxProductsToShow: 10,
    },
    {
      titles: ["Sprouts"],
      regexMatch: /sprout/i,
      maxProductsToShow: 5,
    },
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 10,
  },
};
