import { GetStaticPaths, GetStaticProps } from "next";
import { ProductGridData } from "@/typings";
import ProductsGrid from "@/components/features/products/ProductGrid";
import { DBFetchByCategory, DBGetMostRecentDate } from "@/lib/db/cosmos";
import {
  printProductCountSubTitle,
  sortProductsByUnitPrice,
} from "@/lib/utils";
import {
  LastChecked,
  OrderByMode,
  PriceHistoryLimit,
  Store,
} from "@/lib/enums";
import StandardPageLayout from "@/components/layout/StandardPageLayout";
import { allCategoryNames } from "@/lib/categories";
import { separateProductsIntoSubCategories } from "@/lib/sub-categorisation";
import { categoryDefinitions, getCategoryTitle } from "@/lib/categories/index";

interface Props {
  subCategoryProductGrids?: ProductGridData[];
  productGridData?: ProductGridData;
  lastChecked: string;
}

// Default products per page for pages without sub categories
const numProductsPerPage = 20;

const Category = ({
  subCategoryProductGrids,
  productGridData,
  lastChecked,
}: Props) => {
  // Use subcategory grids if available
  if (subCategoryProductGrids) {
    return (
      <StandardPageLayout lastUpdatedDate={lastChecked}>
        {/* Map through each sub category and create it's own ProductsGrid */}
        {subCategoryProductGrids.map((grid, index) => (
          <ProductsGrid
            key={index}
            titles={grid.titles}
            subTitle={grid.subTitle}
            products={grid.products}
            trimColumns={grid.trimColumns}
            titleAsSearchLink={grid.titleAsSearchLink}
            createDeepLink={grid.createDeepLink}
          />
        ))}
      </StandardPageLayout>
    );
  }

  // Fallback to single grid
  return (
    <StandardPageLayout lastUpdatedDate={lastChecked}>
      <div className="min-h-200">
        <ProductsGrid
          titles={productGridData!.titles}
          subTitle={productGridData!.subTitle}
          products={productGridData!.products}
          titleAsSearchLink={productGridData!.titleAsSearchLink}
        />
      </div>
    </StandardPageLayout>
  );
};

// Combine all category groups into one big array.
// Each category will be built into fully static export pages
let categoriesToGenerate = allCategoryNames;

// Remove special sub-categories which have custom made pages instead of generated pages
categoriesToGenerate = categoriesToGenerate.filter((name) => {
  return !["eggs", "black-tea", "green-tea"].includes(name);
});

// getAllStaticPaths()
// -------------------
// Takes an array of categories, returns them in { path } format for static generation
export function getAllStaticPaths() {
  return categoriesToGenerate.map((name) => {
    return {
      params: {
        category: name,
      },
    };
  });
}

// Build static pages for all paths such as /products/cheese
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: getAllStaticPaths(),
    fallback: false,
  };
};

// Gets products from DB based on search term
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params?.category as string;

  let products = await DBFetchByCategory(
    category,
    500,
    Store.Any,
    PriceHistoryLimit.Any,
    OrderByMode.None,
    LastChecked.Within7Days,
  );

  // Sort by unit price
  products = sortProductsByUnitPrice(products);

  // Store total product size
  const foundItemsCount = products.length;

  // Get display title for main category
  const categoryTitle = getCategoryTitle(category);

  // Check if we have subcategory definitions for this category
  const CategoryDefinition = categoryDefinitions[category];

  if (CategoryDefinition?.subcategories) {
    const subCategoryProductGrids = separateProductsIntoSubCategories(
      products,
      CategoryDefinition.subcategories,
      // Use other (leftover products) if defined
      CategoryDefinition.otherSubcategory
        ? {
            useLeftoverProducts:
              CategoryDefinition.otherSubcategory.useOtherSubcategory,
            leftoverProductsTitle:
              CategoryDefinition.otherSubcategory.otherTitle,
            leftoverMaxProductsToShow:
              CategoryDefinition.otherSubcategory.otherMaxProductsToShow,
          }
        : {},
    );

    // Mark "Other" grids to trim columns and disable titleAsSearchLink
    const otherGrid = subCategoryProductGrids.find(
      (g) => g.titles[0] === CategoryDefinition.otherSubcategory?.otherTitle,
    );
    if (otherGrid) {
      otherGrid.trimColumns = true;
      otherGrid.titleAsSearchLink = false;
    }

    const lastChecked = await DBGetMostRecentDate();

    return {
      props: {
        subCategoryProductGrids,
        lastChecked,
      },
    };
  }

  // Build ProductGridData object for categories without subcategory definitions
  products = products.slice(0, numProductsPerPage);
  const productGridData: ProductGridData = {
    titles: [categoryTitle],
    subTitle: printProductCountSubTitle(products.length, foundItemsCount),
    products: products,
    titleAsSearchLink: false,
  };

  const lastChecked = await DBGetMostRecentDate();

  return {
    props: {
      productGridData,
      lastChecked,
    },
  };
};

export default Category;
