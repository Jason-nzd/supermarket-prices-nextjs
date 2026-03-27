import { CategoryDefinitions } from "@/typings";

export const cream: CategoryDefinitions["cream"] = {
  title: "Cream",
  icon: "🧈",
  subcategories: [
    {
      titles: ["Fresh Cream"],
      regexMatch: /^(?!.*(custard|sour)).*cream/,
      maxProductsToShow: 10
    },
    {
      titles: ["Custard"],
      regexMatch: /custard/,
      maxProductsToShow: 10
    },
    {
      titles: ["Sour Cream"],
      regexMatch: /sour/,
      maxProductsToShow: 5
    },
    {
      titles: ["Creme Fraiche", "Mascarpone"],
      regexMatch: /cr.me.fra.che|masc.rpone/,
      maxProductsToShow: 5
    },
    {
      titles: ["Tiramisu", "Mousse"],
      regexMatch: /tiramisu|mousse/,
      maxProductsToShow: 5
    },
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 5,
  },
};
