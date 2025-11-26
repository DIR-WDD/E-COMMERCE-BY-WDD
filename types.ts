export enum UserType {
  GUEST = 'GUEST',
  B2C = 'B2C',
  B2B = 'B2B'
}

export enum ViewState {
  STOREFRONT = 'STOREFRONT',
  ADMIN = 'ADMIN',
  CART = 'CART'
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  b2bPrice: number; // Wholesale price
  stock: number;
  image: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Return Requested';
  date: string;
  type: 'B2B' | 'B2C';
}

export interface AnalyticsData {
  name: string;
  b2cSales: number;
  b2bSales: number;
}

export interface CMSDraft {
  id: string;
  page: string;
  author: string;
  status: 'Draft' | 'Staged' | 'Live';
  lastModified: string;
}