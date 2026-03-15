import { Dialog, DialogPanel } from "@headlessui/react";
import { burgerIcon } from "@/components/layout/Navbar/Navbar";
import SubCategoryList from "@/components/layout/Navbar/CategoryMenu/CategoryGroup";
import { DarkModeContext } from "@/pages/_app";
import { titledCategoryGroups } from "@/lib/categories";
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
          {titledCategoryGroups.map((group) => (
            <SubCategoryList
              key={group.title}
              subCategoryTitle={group.title}
              subCategoryNames={group.categories}
            />
          ))}
        </DialogPanel>
      </Dialog>
    </>
  );
}
