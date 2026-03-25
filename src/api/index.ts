import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
};

// Auth API (via Gateway)
export const authApi = {
  login: (username: string, password: string) => 
    api.post('/auth/login', { username, password }),
  register: (username: string, email: string, password: string) => 
    api.post('/auth/register', { username, email, password }),
  validate: (token: string) => 
    api.get('/auth/validate', { headers: { Authorization: `Bearer ${token}` } }),
};

// Products API
export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// Categories API
export const categoriesApi = {
  getAll: () => api.get('/categories'),
  create: (data: any) => api.post('/categories', data),
};

// Orders API
export const ordersApi = {
  getAll: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (data: any) => api.post('/orders', data),
  update: (id: number, data: any) => api.put(`/orders/${id}`, data),
  delete: (id: number) => api.delete(`/orders/${id}`),
};

// Cart API
export const cartApi = {
  getCart: (userId: number) => api.get(`/cart?user_id=${userId}`),
  addItem: (userId: number, productId: number, quantity: number = 1) => 
    api.post('/cart/items', { user_id: userId, product_id: productId, quantity }),
  updateItem: (itemId: number, quantity: number) => 
    api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: number) => api.delete(`/cart/items/${itemId}`),
  clear: (userId: number) => api.delete('/cart/clear', { data: { user_id: userId } }),
};

// Trocs API
export const trocsApi = {
  getAll: () => api.get('/trocs'),
  getById: (id: number) => api.get(`/trocs/${id}`),
  create: (data: any) => api.post('/trocs', data),
  update: (id: number, data: any) => api.put(`/trocs/${id}`, data),
  delete: (id: number) => api.delete(`/trocs/${id}`),
};

// Notifications API
export const notificationsApi = {
  getByUser: (userId: number) => api.get(`/notifications/${userId}`),
  markRead: (id: number) => api.put(`/notifications/${id}/read`),
  markAllRead: (userId: number) => api.put(`/notifications/read-all/${userId}`),
  deleteNotification: (id: number) => api.delete(`/notifications/${id}`),
};

export default api;
