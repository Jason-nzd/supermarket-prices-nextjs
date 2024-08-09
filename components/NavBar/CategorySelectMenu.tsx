import { Dialog, DialogPanel } from "@headlessui/react";
import React, { useContext, useState } from "react";
import SubCategoryList from "./SubCategoryList";
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

function CategorySelectMenu() {
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
            <SubCategoryList
              subCategoryTitle="Fresh Foods"
              subCategoryNames={freshCategory}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle="Chilled"
              subCategoryNames={chilledCategory}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle="Meat"
              subCategoryNames={meatCategory}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle="Frozen"
              subCategoryNames={frozenCategory}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle="Pantry"
              subCategoryNames={pantryCategory}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle="Snacks"
              subCategoryNames={snacksCategory}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle="Drinks"
              subCategoryNames={drinksCategory}
              centerTitle={true}
            />
            <SubCategoryList
              subCategoryTitle="Pets"
              subCategoryNames={petsCategory}
              centerTitle={true}
            />
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}

export default CategorySelectMenu;
