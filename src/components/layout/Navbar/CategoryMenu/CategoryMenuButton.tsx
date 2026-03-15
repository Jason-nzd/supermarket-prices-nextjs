import { Dialog, DialogPanel } from "@headlessui/react";
import { useContext, useState } from "react";
import CategoryGroup from "@/components/layout/Navbar/CategoryMenu/CategoryGroup";
import { DarkModeContext } from "@/pages/_app";
import { titledCategoryGroups } from "@/lib/categories";

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
          className="fixed inset-0 z-50 w-fit max-w-[calc(90vw)] h-fit top-20 
          overflow-hidden shadow-2xl rounded-3xl left-1/2 -translate-x-1/2"
        >
          <DialogPanel
            className={
              (useContext(DarkModeContext).darkMode
                ? "bg-transparent text-zinc-200"
                : "bg-white/30") +
              " hidden lg:grid grid-rows-2 grid-flow-col xl:grid-rows-1 backdrop-blur-2xl " +
              " py-4 px-8 gap-x-1 gap-y-4 transition-all "
            }
          >
            {titledCategoryGroups.map((group) => (
              <CategoryGroup
                key={group.title}
                subCategoryTitle={group.title}
                subCategoryNames={group.categories}
              />
            ))}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
