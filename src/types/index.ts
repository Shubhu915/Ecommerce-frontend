export type Role = "user" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  isVerified: boolean;
  avatar?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: string;
  images: { url: string; alt?: string }[];
  stock: number;
  ratings: number;
  numReviews: number;
  aiMetadata?: Record<string, any>;
}

export interface SearchResponse {
  count: number;
  aiParsed: boolean;
  appliedFilters: {
    color?: string;
    maxPrice?: number;
    category?: string;
    [key: string]: any;
  };
  data: Product[];
}

export interface OrderItem {
  product: string;
  qty: number;
  name: string;
  price: number;
  image: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned";
  createdAt: string;
}

export interface AdminStats {
  totalRevenue: number;
  activeOrders: number;
  lowStockAlerts: number;
}

export interface ApiError {
  success: boolean;
  statusCode: number;
  message: string;
  errors?: { field: string; message: string }[];
  stack?: string;
}
