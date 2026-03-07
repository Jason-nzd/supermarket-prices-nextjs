import CategoryLink from "./CategoryLink";
import Link from "next/link";
import startCase from "lodash/startCase";

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
    <div className="break-inside-avoid-column mb-2">
      <h2 className={"text-center text-md font-bold"}>{subCategoryTitle}</h2>

      {/* Within each department are 4-20 CategoryLinks */}
      {subCategoryNames.map((categoryName) => {
        const href = "/products/" + categoryName;
        return (
          <div className="flex items-center w-full" key={categoryName}>
            {<CategoryLink category={categoryName} />}
            <Link
              className="px-2 my-[0.1rem] rounded-2xl w-full overflow-hidden active:bg-white active:shadow-sm
              font-semibold hover:bg-green-200 hover:text-black hover:shadow-md whitespace-nowrap"
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
