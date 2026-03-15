export interface Product {
  id: string;                 // id - should be unique
  name: string;               // product name
  priceHistory: DatedPrice[]; // array of prices + dates 
  size?: string;              // size - is not always available
  sourceSite: string;         // countdown.co.nz, paknsave.co.nz, etc.
  category: string;           // a single category that best fits the product
  lastChecked: string;        // "yyyy-mm-dd" for when the product info was last checked
  unitPrice: any;             // string such as 400/kg
  unitPriceNum?: number;      // optional number for sorting by unit price
  unitName?: string;
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