export interface Product {
  id: string;
  name: string;
  currentPrice: number;
  priceHistory: DatedPrice[];
  size?: string;
  sourceSite: string;
  category?: string[];
  lastUpdated: Date;
  lastChecked: Date;
  unitPrice?: number | null;
  unitName?: string | null;
  originalUnitQuantity?: number | null;
}

export interface ProductGridData {
  titles: string[];
  subTitle: string;
  products: Product[];
  createSearchLink?: boolean = false;
}

export interface DatedPrice {
  date: Date;
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
