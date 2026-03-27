import { CategoryDefinitions } from "@/typings";

export const salmon: CategoryDefinitions["salmon"] = {
  title: "Salmon",
  icon: "🐟",
  subcategories:
    [
      {
        titles: ["Packaged Salmon"],
        regexMatch: /^(?!.*(fillet|steak|portion|cooking|piece|diced)).*?ocean.blue|regal.epicurean|pams|sliced|(regal|aoraki|mariner|clearly).*?smoked/i,
        titleAsSearchLink: false,
        maxProductsToShow: 20,
      },
      {
        titles: ["Fillets", "Pieces"],
        regexMatch: /fillet|steak|portion|cooking|piece|diced/i,
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
