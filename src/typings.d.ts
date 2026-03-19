export interface Product {
  id: string;                 // id - should be unique
  name: string;               // product name
  priceHistory: DatedPrice[]; // array of prices + dates
  size: string;               // size - empty string if not available
  sourceSite: string;         // countdown.co.nz, paknsave.co.nz, etc.
  category: string;           // a single category that best fits the product
  lastChecked: string;        // "yyyy-mm-dd" for when the product info was last checked
  unitPrice: string;          // string such as 400/kg (empty string if not available)
}

export interface ProductGridData {
  titles: string[];
  subTitle: string;
  products: Product[];
  titleAsSearchLink?: boolean;
  createDeepLink?: string;
  trimColumns?: boolean;
}

export interface DatedPrice { // top start of the index = oldest, the end = latest
  date: string;               // "yyyy-mm-dd"
  price: number;
}

export interface User {
  name: string;
  darkMode: boolean;
  isWidePage: boolean;
  productColumns: number;
  loggedIn: boolean;
  isAdmin: boolean;
}

export interface CategoryDefinition {
  title: string;
  icon?: string;
  subcategories?: SubCategory[];
  otherSubcategory?: OtherSubcategory;
}

export interface SubCategory {
  titles: string[];
  regexMatch: RegExp;
  maxProductsToShow?: number;
  titleAsSearchLink?: boolean;
  createDeepLink?: string;
  matchField?: "name" | "size" | "both";
  trimColumns?: boolean;
}

export function createSubCategory(sub: SubCategory): SubCategory;

export interface OtherSubcategory {
  useOtherSubcategory: boolean;
  otherTitle: string;
  otherMaxProductsToShow: number;
}

export type CategoryDefinitions = Record<string, CategoryDefinition>;