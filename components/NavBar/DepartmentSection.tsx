import React, { useContext } from "react";
import CategoryLink from "./CategoryLink";
import Link from "next/link";
import startCase from "lodash/startCase";
import { DarkModeContext } from "../../pages/_app";

// DepartmentSection - child of CategoryMenu, parent of CategoryLink
// ------------------------------------------------------------------
// Within the CategoryMenu there are many departments such as
// Pantry, Chilled, etc.

interface Props {
  subCategoryTitle: string;
  centerTitle?: boolean;
  subCategoryNames: string[];
}

export default function DepartmentSection({
  subCategoryTitle,
  centerTitle = false,
  subCategoryNames,
}: Props) {
  // Set title css class based on dark mode
  let titleDivClass = centerTitle ? "text-center" : "";
  titleDivClass += useContext(DarkModeContext).darkMode
    ? " text-green-300"
    : " text-green-600";

  return (
    <div className="break-inside-avoid-column mb-2">
      <h2
        className={titleDivClass + " text-lg whitespace-nowrap font-bold ml-2"}
      >
        {subCategoryTitle}
      </h2>
      <hr className="mt-2 mb-1" />

      {/* Within each department are 4-20 CategoryLinks */}
      {subCategoryNames.map((categoryName) => {
        const href = "/products/" + categoryName;
        return (
          <div className="flex items-center w-full" key={categoryName}>
            {<CategoryLink category={categoryName} />}
            <Link
              className="p-0.5 px-2 my-[0.1rem] rounded-2xl w-full overflow-hidden
              font-semibold hover:bg-green-200 hover:text-black hover:shadow-sm whitespace-nowrap"
              href={href}
            >
              {startCase(categoryName)}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
