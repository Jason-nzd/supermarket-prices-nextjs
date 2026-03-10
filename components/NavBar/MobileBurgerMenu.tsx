import { Dialog, DialogPanel } from "@headlessui/react";
import { burgerIcon } from "./NavBar";
import SubCategoryList from "./CategoryMenu/CategoryGroup";
import { DarkModeContext } from "../../pages/_app";
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
import { useContext, useState } from "react";

// MobileBurgerMenu
// ----------------
// Represents a burger button that opens a more compact menu for mobile use

export default function MobileBurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Burger Button */}
      <button
        id="mobile-menu-button"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {burgerIcon}
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogPanel
          className={
            (useContext(DarkModeContext).darkMode
              ? "bg-transparent text-zinc-200"
              : "bg-white/30 text-green-800") +
            " fixed z-50 top-12 left-1/2 -translate-x-1/2 p-3  " +
            "grid grid-cols-2 md:grid-cols-3 gap-x-1 gap-y-2 items-start " +
            "backdrop-blur-2xl rounded-3xl shadow-2xl  w-[calc(90vw)] max-w-180"
          }
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
        </DialogPanel>
      </Dialog>
    </>
  );
}
