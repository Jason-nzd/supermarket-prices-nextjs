import { titledCategories } from "@/lib/categories";
import CategoryLink from "@/components/layout/Navbar/CategoryMenu/CategoryLink";
import Link from "next/link";
import startCase from "lodash/startCase";
import { DarkModeContext } from "@/pages/_app";
import { useContext } from "react";

// CategoryGroup
// -------------------

interface Props {
  subCategoryTitle: string;
  subCategoryNames: string[];
}

export default function CategoryGroup({
  subCategoryTitle,
  subCategoryNames,
}: Props) {
  return (
    <div className="break-inside-avoid-column">
      <h2
        className={
          (useContext(DarkModeContext).darkMode
            ? "text-green-200/70"
            : "text-green-800/50") +
          " text-2xl text-center font-bold pb-2 text-nowrap "
        }
      >
        {subCategoryTitle}
      </h2>

      {/* Within each department are 4-20 CategoryLinks */}
      {subCategoryNames.map((categoryName) => {
        const href = "/products/" + categoryName;
        const categoryTitle = titledCategories[categoryName] || startCase(categoryName);
        return (
          <div className="flex items-center w-full max-w-40" key={categoryName}>
            {<CategoryLink category={categoryName} />}
            <Link
              className="p-0.5 pl-2 -ml-1 rounded-2xl w-full overflow-hidden active:bg-white active:shadow-sm
              font-semibold hover:bg-green-200 hover:text-black hover:shadow-md whitespace-nowrap"
              href={href}
            >
              {categoryTitle}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
