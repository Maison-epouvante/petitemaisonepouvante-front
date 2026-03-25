export interface User {
  id: number;
  username: string;
  email: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  userId: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: Category | string;
  imageUrl?: string;
  exclusive?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: string;
  shipping_address?: string;
  items?: OrderItem[];
  created_at?: string;
  updated_at?: string;
}

export interface Troc {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  type: 'troc' | 'don' | 'echange';
  status: string;
  product_id?: number; // Pour les dons
  product_id_offered?: number; // Pour les trocs
  product_id_wanted?: number; // Pour les trocs
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  cartItemId?: number;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  order_id?: number;
  order_data?: any;
  is_read: boolean;
  created_at: string;
  updated_at?: string;
}
