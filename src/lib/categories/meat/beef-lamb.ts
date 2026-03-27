import { CategoryDefinitions, SubCategory } from "@/typings";

export function createSubCategory(sub: SubCategory): SubCategory {
  return {
    maxProductsToShow: 5,
    titleAsSearchLink: true,
    ...sub,
  };
}

export const beefLamb: CategoryDefinitions["beef-lamb"] = {
  title: "Beef & Lamb",
  icon: "🥩",
  subcategories: [
    createSubCategory({
      titles: ["Mince", "Diced", "Stir Fry"],
      regexMatch: /mince|diced|stir.fry/,
    }),
    createSubCategory({
      titles: ["Steak"],
      regexMatch: /^(?!.*(chop|roast|rump|shank|rib|brisket)).*?(steak|fillet|medallion|thick.cut|sirloin)/i,
    }),
    createSubCategory({
      titles: ["Roast", "Rump", "Shank"],
      regexMatch: /roast|rump|shank|shin|leg|flaps/i,
    }),
    createSubCategory({
      titles: ["Lamb Chops"],
      regexMatch: /chops/i,
    }),
    createSubCategory({
      titles: ["Ribs"],
      regexMatch: /rib/i,
    }),
    createSubCategory({
      titles: ["Brisket", "Povi Masima", "Silverside"],
      regexMatch: /brisket|masima|silverside/i,
    }),
    createSubCategory({
      titles: ["Kebabs", "Grill Sticks"],
      regexMatch: /kebab|stick|kofta/i,
    }),
    createSubCategory({
      titles: ["Schnitzel", "Scotch"],
      regexMatch: /schnitzel|scotch/i,
    }),
  ],
  otherSubcategory: {
    useOtherSubcategory: true,
    otherTitle: "Other",
    otherMaxProductsToShow: 70,
  },
};
