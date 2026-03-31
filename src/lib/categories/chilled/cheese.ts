import { CategoryDefinitions } from "@/typings";

export const cheese: CategoryDefinitions["cheese"] = {
  title: "Cheese",
  icon: "🧀",
  subcategories: [
    {
      titles: ["Processed Cheese"],
      regexMatch: /processed|chesdale|anchor.cheese.slices|laughing.cow/i,
      maxProductsToShow: 5,
    },
    {
      titles: ["Sliced Cheese"],
      regexMatch: /slice/i,
      maxProductsToShow: 5,
    },
    {
      titles: ["Block Cheese", "Colby", "Edam", "Tasty", "Cheddar"],
      regexMatch: /^(?!.*(grated|cottage)).*1kg|block|800g|colby|edam|tasty|cheddar/i,
      maxProductsToShow: 5,
      matchField: "both"
    },
    {
      titles: ["Mozzarella", "Bocconcini", "Havarti", "Mild", "Ricotta", "Paneer"],
      regexMatch: /^(?!.*(grated|cottage)).*mozzarella|bocconcini|havarti|mild|ricotta|paneer/i,
      maxProductsToShow: 5,
    },
    {
      titles: ["Camembert", "Brie", "Parmesan", "Feta", "Haloumi", "Blue Cheese", "Gruyere", "Gouda"],
      regexMatch: /^(?!.*(grated)).*camembert|brie|parmesan|feta|hall?oumi|blue|gruyere|gouda/i,
      maxProductsToShow: 5,
    },
    {
      titles: ["Cottage Cheese"],
      regexMatch: /cottage/i,
      maxProductsToShow: 5,
    },
    {
      titles: ["Cream Cheese"],
      regexMatch: /cream.cheese/i,
      maxProductsToShow: 5,
    },
    {
      titles: ["Grated Cheese"],
      regexMatch: /grated/i,
      maxProductsToShow: 5,
    },
  ], otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 5,
  },
};
