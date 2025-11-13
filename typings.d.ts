export interface Product {
  id: string;
  name: string;
  currentPrice: number;
  priceHistory: DatedPrice[] | null;
  packedPriceHistoryDates?: string[] | Date[]; // optional pre-packed date strings for price history
  packedPriceHistoryPrices?: number[]; // optional pre-packed prices for price history
  size?: string;
  sourceSite: string;
  category?: string[];
  lastUpdated: string | Date;
  lastChecked: string | Date;
  unitPrice?: number | null;
  unitName?: string | null;
  originalUnitQuantity?: number | null;
}

export interface ProductGridData {
  titles: string[];
  subTitle: string;
  products: Product[];
  createSearchLink?: boolean;
}

export interface DatedPrice {
  date: string | Date;
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
