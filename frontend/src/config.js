// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders'
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',

  // User
  USER_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAILS: (id) => `/products/${id}`,
  CATEGORIES: '/categories',

  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart',
  UPDATE_CART: (id) => `/cart/${id}`,
  REMOVE_FROM_CART: (id) => `/cart/${id}`,

  // Orders
  ORDERS: '/orders',
  ORDER_DETAILS: (id) => `/orders/${id}`,
  CREATE_ORDER: '/orders'
};

// Pagination
export const ITEMS_PER_PAGE = 12;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  COD: 'cod',
  WALLET: 'wallet'
};

export default {
  API_BASE_URL,
  ROUTES,
  API_ENDPOINTS,
  ITEMS_PER_PAGE,
  STORAGE_KEYS,
  ORDER_STATUS,
  PAYMENT_METHODS
};