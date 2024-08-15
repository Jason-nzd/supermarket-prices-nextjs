import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useContext, useState } from "react";
import DepartmentSection from "./DepartmentSection";
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

// CategoryMenu
// -------------
// Shows a vertical list of product category links, organized into departments

export default function CategoryMenu() {
  let [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="bg-green-300 rounded-3xl px-4 mx-4 py-1 
      hover:bg-green-100 hover:shadow-md transition-colors text-green-800"
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
                ? "bg-zinc-700 text-zinc-200"
                : "bg-white") +
              " hidden lg:block columns-4 xl:columns-7 " +
              " p-2 xl:p-4 px-4 xl:px-8 gap-x-5 xl:gap-x-12 gap-y-2 md:gap-y-2 transition-all "
            }
          >
            <DepartmentSection
              subCategoryTitle="Fresh Foods"
              subCategoryNames={freshCategory}
            />
            <DepartmentSection
              subCategoryTitle="Chilled"
              subCategoryNames={chilledCategory}
            />
            <DepartmentSection
              subCategoryTitle="Meat"
              subCategoryNames={meatCategory}
            />
            <DepartmentSection
              subCategoryTitle="Frozen"
              subCategoryNames={frozenCategory}
            />
            <DepartmentSection
              subCategoryTitle="Pantry"
              subCategoryNames={pantryCategory}
            />
            <DepartmentSection
              subCategoryTitle="Snacks"
              subCategoryNames={snacksCategory}
            />
            <DepartmentSection
              subCategoryTitle="Drinks"
              subCategoryNames={drinksCategory}
            />
            <DepartmentSection
              subCategoryTitle="Pets"
              subCategoryNames={petsCategory}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
