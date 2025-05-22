// Product Types
export interface Product {
  id: string;
  url: string;
  title: string;
  currentPrice: number;
  priceChange: number | null;
  imageUrl: string | null;
  lastChecked: string;
  createdAt: string;
  highestPrice?: number;
  lowestPrice?: number;
}

export interface PriceHistory {
  id: string;
  productId: string;
  price: number;
  timestamp: string;
}

// API Response Types
export interface ProductResponse {
  product: Product;
  priceHistory: PriceHistory[];
}