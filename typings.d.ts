export interface Product {
  id: string;
  name: string;
  currentPrice: number;
  priceHistory: DatedPrice[];
  size?: string;
  sourceSite: string;
  category?: string[];
  lastUpdated: Date;
  unitPrice?: number;
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
