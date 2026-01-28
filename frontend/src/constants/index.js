// API Endpoints
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
  ADMIN_ORDERS: '/admin/orders',
};

// Product Categories
export const CATEGORIES = {
  ALL: 'all',
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  BOOKS: 'books',
  HOME: 'home',
  SPORTS: 'sports',
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  COD: 'cod',
  WALLET: 'wallet',
};

// Pagination
export const ITEMS_PER_PAGE = 12;
export const PRODUCTS_PER_SCROLL = 8;

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  CART: 'cart_items',
  THEME: 'theme_mode',
};

// Theme Options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  VALIDATION_ERROR: 'Please check the form and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  LOGOUT: 'Logged out successfully.',
  PRODUCT_ADDED: 'Product added to cart!',
  ORDER_PLACED: 'Order placed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  PHONE_LENGTH: 10,
};

// Image Placeholder
export const PLACEHOLDER_IMAGE = '/placeholder-product.png';

// Currency
export const CURRENCY = '₹';
export const CURRENCY_CODE = 'INR';