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
      <PopoverButton
        className="left-1 top-1 text-primary-colour hover-to-white cursor-pointer"
        id="mobile-menu-button"
      >
        {burgerIcon}
      </PopoverButton>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-50 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-50 opacity-0"
      >
        <PopoverPanel
          className="z-50 bg-zinc-100 p-3 grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4
           rounded-xl shadow-2xl text-slate-800 w-[95vw]"
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
