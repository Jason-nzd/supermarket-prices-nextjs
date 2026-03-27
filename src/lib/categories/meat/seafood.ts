import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 5,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const seafood: CategoryDefinitions["seafood"] = {
  title: "Fresh Seafood",
  icon: "🦐",
  subcategories: [
    createSubCategory({
      titles: ["Fillets"],
      regexMatch: /fillet|steak/,
      maxProductsToShow: 15
    }),
    createSubCategory({
      titles: ["Prawns", "Shrimp"],
      regexMatch: /prawn|shrimp/,
    }),
    createSubCategory({
      titles: ["Mussels", "Oysters", "Scallops"],
      regexMatch: /mussel|oyster|scallop/,
    }),
    createSubCategory({
      titles: ["Whole Fish"],
      regexMatch: /^(?!.*(prawn|shrimp|crab|squid)).*?whole/,
    }),
    createSubCategory({
      titles: ["Crab", "Squid", "Octopus"],
      regexMatch: /crab|squid|octopus/,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other Seafood",
    otherMaxProductsToShow: 5,
  },
};
