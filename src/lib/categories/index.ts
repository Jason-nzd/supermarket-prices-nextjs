// Category definitions - one file per category
import { CategoryDefinitions } from "@/typings";
import startCase from "lodash/startCase";
import { fruit, createSubCategory } from "./fresh";
import { eggs } from "./fresh";
import { freshVegetables } from "./fresh";
import { saladsColeslaw } from "./fresh";
import { bread } from "./fresh";
import { breadRolls } from "./fresh";
import { specialtyBread } from "./fresh";
import { bakeryCakes } from "./fresh";
import { bakeryDesserts } from "./fresh";

import { milk } from "./chilled";
import { cream } from "./chilled";
import { yoghurt } from "./chilled";
import { butter } from "./chilled";
import { cheese } from "./chilled";
import { salami } from "./chilled";
import { dipsHummus } from "./chilled";
import { otherDeliFoods } from "./chilled";

import { beefLamb } from "./meat";
import { chicken } from "./meat";
import { ham } from "./meat";
import { bacon } from "./meat";
import { pork } from "./meat";
import { pattiesMeatballs } from "./meat";
import { sausages } from "./meat";
import { deliMeats } from "./meat";
import { meatAlternatives } from "./meat";
import { seafood } from "./meat";
import { salmon } from "./meat";

import { iceCream } from "./frozen";
import { iceBlocks } from "./frozen";
import { pastriesCheesecake } from "./frozen";
import { frozenChips } from "./frozen";
import { frozenVegetables } from "./frozen";
import { frozenFruit } from "./frozen";
import { frozenSeafood } from "./frozen";
import { piesSausageRolls } from "./frozen";
import { pizza } from "./frozen";
import { otherSavouries } from "./frozen";

import { rice } from "./pantry";
import { noodles } from "./pantry";
import { pasta } from "./pantry";
import { beansSpaghetti } from "./pantry";
import { cannedFish } from "./pantry";
import { cannedFruit } from "./pantry";
import { cannedMeat } from "./pantry";
import { soup } from "./pantry";
import { cereal } from "./pantry";
import { spreads } from "./pantry";
import { baking } from "./pantry";
import { sauces } from "./pantry";
import { oilsVinegars } from "./pantry";
import { worldFoods } from "./pantry";
import { herbsSpices } from "./pantry";

import { chocolate } from "./snacks";
import { boxedChocolate } from "./snacks";
import { chips } from "./snacks";
import { crackers } from "./snacks";
import { biscuits } from "./snacks";
import { muesliBars } from "./snacks";
import { nutsBulkMix } from "./snacks";
import { sweetsLollies } from "./snacks";
import { otherSnacks } from "./snacks";

import { longLifeMilk } from "./drinks";
import { blackTea } from "./drinks";
import { greenTea } from "./drinks";
import { herbalTea } from "./drinks";
import { drinkingChocolate } from "./drinks";
import { coffee } from "./drinks";
import { softDrinks } from "./drinks";
import { energyDrinks } from "./drinks";
import { juice } from "./drinks";
import { water } from "./drinks";

import { beer } from "./beer-wine";
import { craftBeer } from "./beer-wine";
import { wine } from "./beer-wine";

import { catFood } from "./pets";
import { catTreats } from "./pets";
import { dogFood } from "./pets";
import { dogTreats } from "./pets";

// Combined category definitions lookup
export const categoryDefinitions: CategoryDefinitions = {
  fruit,
  eggs,
  "fresh-vegetables": freshVegetables,
  "salads-coleslaw": saladsColeslaw,
  bread,
  "bread-rolls": breadRolls,
  "specialty-bread": specialtyBread,
  "bakery-cakes": bakeryCakes,
  "bakery-desserts": bakeryDesserts,
  milk,
  cream,
  yoghurt,
  butter,
  cheese,
  salami,
  "dips-hummus": dipsHummus,
  "other-deli-foods": otherDeliFoods,
  "beef-lamb": beefLamb,
  chicken,
  ham,
  bacon,
  pork,
  "patties-meatballs": pattiesMeatballs,
  sausages,
  "deli-meats": deliMeats,
  "meat-alternatives": meatAlternatives,
  seafood,
  salmon,
  "ice-cream": iceCream,
  "ice-blocks": iceBlocks,
  "pastries-cheesecake": pastriesCheesecake,
  "frozen-chips": frozenChips,
  "frozen-vegetables": frozenVegetables,
  "frozen-fruit": frozenFruit,
  "frozen-seafood": frozenSeafood,
  "pies-sausage-rolls": piesSausageRolls,
  pizza,
  "other-savouries": otherSavouries,
  rice,
  noodles,
  pasta,
  "beans-spaghetti": beansSpaghetti,
  "canned-fish": cannedFish,
  "canned-fruit": cannedFruit,
  "canned-meat": cannedMeat,
  soup,
  cereal,
  spreads,
  baking,
  sauces,
  "oils-vinegars": oilsVinegars,
  "world-foods": worldFoods,
  "herbs-spices": herbsSpices,
  chocolate,
  "boxed-chocolate": boxedChocolate,
  chips,
  crackers,
  biscuits,
  "muesli-bars": muesliBars,
  "nuts-bulk-mix": nutsBulkMix,
  "sweets-lollies": sweetsLollies,
  "other-snacks": otherSnacks,
  "long-life-milk": longLifeMilk,
  "black-tea": blackTea,
  "green-tea": greenTea,
  "herbal-tea": herbalTea,
  "drinking-chocolate": drinkingChocolate,
  coffee,
  "soft-drinks": softDrinks,
  "energy-drinks": energyDrinks,
  juice,
  water,
  beer,
  "craft-beer": craftBeer,
  wine,
  "cat-food": catFood,
  "cat-treats": catTreats,
  "dog-food": dogFood,
  "dog-treats": dogTreats,
};

// Re-export helper
export { createSubCategory };

// Category group arrays
export const freshCategoryGroup = [
  "eggs",
  "fruit",
  "fresh-vegetables",
  "salads-coleslaw",
  "bread",
  "bread-rolls",
  "specialty-bread",
  "bakery-cakes",
  "bakery-desserts",
];

export const chilledCategoryGroup = [
  "milk",
  "cream",
  "yoghurt",
  "butter",
  "cheese",
  "salami",
  "dips-hummus",
  "other-deli-foods",
];

export const meatCategoryGroup = [
  "beef-lamb",
  "chicken",
  "ham",
  "bacon",
  "pork",
  "patties-meatballs",
  "sausages",
  "deli-meats",
  "meat-alternatives",
  "seafood",
  "salmon",
];

export const frozenCategoryGroup = [
  "ice-cream",
  "ice-blocks",
  "pastries-cheesecake",
  "frozen-chips",
  "frozen-vegetables",
  "frozen-fruit",
  "frozen-seafood",
  "pies-sausage-rolls",
  "pizza",
  "other-savouries",
];

export const pantryCategoryGroup = [
  "rice",
  "noodles",
  "pasta",
  "beans-spaghetti",
  "canned-fish",
  "canned-fruit",
  "canned-meat",
  "soup",
  "cereal",
  "spreads",
  "baking",
  "sauces",
  "oils-vinegars",
  "world-foods",
  "herbs-spices",
];

export const snacksCategoryGroup = [
  "chocolate",
  "boxed-chocolate",
  "chips",
  "crackers",
  "biscuits",
  "muesli-bars",
  "nuts-bulk-mix",
  "sweets-lollies",
  "other-snacks",
];

export const drinksCategoryGroup = [
  "long-life-milk",
  "black-tea",
  "green-tea",
  "herbal-tea",
  "drinking-chocolate",
  "coffee",
  "soft-drinks",
  "energy-drinks",
  "juice",
  "water",
];

export const beerWineCategoryGroup = ["beer", "craft-beer", "wine"];

export const petsCategoryGroup = [
  "cat-food",
  "cat-treats",
  "dog-food",
  "dog-treats",
];

export const titledCategoryGroups = [
  { title: "Fresh Foods", categories: freshCategoryGroup },
  { title: "Chilled", categories: chilledCategoryGroup },
  { title: "Meat", categories: meatCategoryGroup },
  { title: "Frozen", categories: frozenCategoryGroup },
  { title: "Pantry", categories: pantryCategoryGroup },
  { title: "Snacks", categories: snacksCategoryGroup },
  { title: "Drinks", categories: drinksCategoryGroup },
  { title: "Beer & Wine", categories: beerWineCategoryGroup },
  { title: "Pets", categories: petsCategoryGroup },
];

// Helper function to get category display title
export function getCategoryTitle(categoryName: string): string {
  return categoryDefinitions[categoryName]?.title || startCase(categoryName);
}

// Combine all category groups into one big array.
export const allCategoryNames = freshCategoryGroup.concat(
  chilledCategoryGroup,
  meatCategoryGroup,
  frozenCategoryGroup,
  pantryCategoryGroup,
  snacksCategoryGroup,
  drinksCategoryGroup,
  beerWineCategoryGroup,
  petsCategoryGroup
);
