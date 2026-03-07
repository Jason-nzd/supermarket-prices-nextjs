import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import React from "react";
import { burgerIcon } from "./NavBar";
import SubCategoryList from "./DepartmentSection";
import {
  chilledCategory,
  drinksCategory,
  freshCategory,
  frozenCategory,
  meatCategory,
  pantryCategory,
  petsCategory,
  snacksCategory,
} from "../../pages/products/[category]";

// MobileBurgerMenu
// ----------------
// Represents a burger button that opens a more compact menu for mobile use

export default function MobileBurgerMenu() {
  return (
    <Popover className="text-md">
      {/* Burger Button */}
      <PopoverButton id="mobile-menu-button">{burgerIcon}</PopoverButton>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-50 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-50 opacity-0"
      >
        <PopoverPanel
          className="absolute z-50 top-11 left-5 bg-white/50 dark:bg-zinc-600/50 dark:text-zinc-200 backdrop-blur-xl p-2 px-3 grid grid-cols-2 md:grid-cols-3 gap-x-1 gap-y-2
           rounded-3xl shadow-2xl text-green-800 w-[calc(92vw)] max-w-180"
        >
          <SubCategoryList
            subCategoryTitle="Fresh Foods"
            subCategoryNames={freshCategory}
          />
          <SubCategoryList
            subCategoryTitle="Chilled"
            subCategoryNames={chilledCategory}
          />
          <SubCategoryList
            subCategoryTitle="Meat"
            subCategoryNames={meatCategory}
          />
          <SubCategoryList
            subCategoryTitle="Frozen"
            subCategoryNames={frozenCategory}
          />
          <SubCategoryList
            subCategoryTitle="Pantry"
            subCategoryNames={pantryCategory}
          />
          <SubCategoryList
            subCategoryTitle="Snacks"
            subCategoryNames={snacksCategory}
          />
          <SubCategoryList
            subCategoryTitle="Drinks"
            subCategoryNames={drinksCategory}
          />
          <SubCategoryList
            subCategoryTitle="Pets"
            subCategoryNames={petsCategory}
          />
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
