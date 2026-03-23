import { CategoryDefinitions } from "@/typings";

export const energyDrinks: CategoryDefinitions["energy-drinks"] = {
  title: "Energy Drinks",
  icon: "⚡",
  subcategories: [
    {
      titles: ["Energy Drink Packs"],
      regexMatch: /(pack|\bx.\d*m)/i,
      matchField: "both",
      titleAsSearchLink: false,
      maxProductsToShow: 5,
    },
    {
      titles: ["Gatorade", "Powerade", "Gforce", "e2"],
      regexMatch: /sports|gatorade|powerade|g.?force|e2/i,
      titleAsSearchLink: true,
      maxProductsToShow: 5,
    },
    {
      titles: ["V", "Red Bull", "Musashi", "Rockstar", "Monster"],
      regexMatch: /v\b|energy|musashi|rockstar|red.bull|monster/i,
      titleAsSearchLink: true,
      maxProductsToShow: 15,
    },
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 5,
  },
};
