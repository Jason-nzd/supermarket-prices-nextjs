export interface Product {
  id: string;
  name: string;
  currentPrice: number;
  priceHistory: DatedPrice[];
  size?: string;
  sourceSite: string;
}

export interface DatedPrice {
  date: string;
  price: number;
}
