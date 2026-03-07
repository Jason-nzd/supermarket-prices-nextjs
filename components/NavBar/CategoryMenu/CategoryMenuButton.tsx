import { Dialog, DialogPanel } from "@headlessui/react";
import { useContext, useState } from "react";
import CategoryGroup from "./CategoryGroup";
import { DarkModeContext } from "../../../pages/_app";
import {
  chilledCategory,
  drinksCategory,
  freshCategory,
  frozenCategory,
  meatCategory,
  pantryCategory,
  petsCategory,
  snacksCategory,
} from "../../../pages/products/[category]";

// CategoryMenuButton
// ------------------
// Pops up a menu of CategoryGroups which contain individual CategoryLinks

export default function CategoryMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="bg-green-300 rounded-3xl px-4 mx-4 py-1 
      hover:bg-green-100 hover:shadow-md transition-colors text-green-800 cursor-pointer"
        onClick={() => {
          setIsOpen(true);
        }}
        id="category-menu-button"
      >
        More
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div
          className="fixed inset-0 z-50 mx-auto w-fit h-fit max-w-[95%] top-[7%] 
          overflow-hidden shadow-2xl rounded-3xl"
        >
          <DialogPanel
            className={
              (useContext(DarkModeContext).darkMode
                ? "bg-zinc-700/50 text-zinc-200"
                : "bg-white/50") +
              " hidden lg:block columns-4 xl:columns-7 backdrop-blur-2xl " +
              " p-2 xl:p-4 px-4 xl:px-8 gap-x-5 xl:gap-x-12 gap-y-2 md:gap-y-2 transition-all "
            }
          >
            <CategoryGroup
              subCategoryTitle="Fresh Foods"
              subCategoryNames={freshCategory}
            />
            <CategoryGroup
              subCategoryTitle="Chilled"
              subCategoryNames={chilledCategory}
            />
            <CategoryGroup
              subCategoryTitle="Meat"
              subCategoryNames={meatCategory}
            />
            <CategoryGroup
              subCategoryTitle="Frozen"
              subCategoryNames={frozenCategory}
            />
            <CategoryGroup
              subCategoryTitle="Pantry"
              subCategoryNames={pantryCategory}
            />
            <CategoryGroup
              subCategoryTitle="Snacks"
              subCategoryNames={snacksCategory}
            />
            <CategoryGroup
              subCategoryTitle="Drinks"
              subCategoryNames={drinksCategory}
            />
            <CategoryGroup
              subCategoryTitle="Pets"
              subCategoryNames={petsCategory}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
