module.exports = {
  // User Roles
  USER_ROLES: {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
  },

  // Order Status
  ORDER_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded'
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },

  // Payment Methods
  PAYMENT_METHODS: {
    CREDIT_CARD: 'credit_card',
    DEBIT_CARD: 'debit_card',
    PAYPAL: 'paypal',
    CASH_ON_DELIVERY: 'cod',
    UPI: 'upi'
  },

  // Product Status
  PRODUCT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    OUT_OF_STOCK: 'out_of_stock',
    DISCONTINUED: 'discontinued'
  },

  // File Upload
  UPLOAD: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
    MAX_FILES: 5
  },

  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100
  },

  // JWT
  JWT: {
    ACCESS_TOKEN_EXPIRY: '24h',
    REFRESH_TOKEN_EXPIRY: '7d'
  },

  // Email Templates
  EMAIL_TYPES: {
    WELCOME: 'welcome',
    ORDER_CONFIRMATION: 'order_confirmation',
    ORDER_SHIPPED: 'order_shipped',
    ORDER_DELIVERED: 'order_delivered',
    PASSWORD_RESET: 'password_reset',
    ACCOUNT_VERIFICATION: 'account_verification'
  },

  // Price ranges for filters
  PRICE_RANGES: [
    { min: 0, max: 500, label: 'Under ₹500' },
    { min: 500, max: 1000, label: '₹500 - ₹1000' },
    { min: 1000, max: 2000, label: '₹1000 - ₹2000' },
    { min: 2000, max: 5000, label: '₹2000 - ₹5000' },
    { min: 5000, max: null, label: 'Over ₹5000' }
  ],

  // Discount Types
  DISCOUNT_TYPES: {
    PERCENTAGE: 'percentage',
    FIXED: 'fixed',
    BUY_X_GET_Y: 'buy_x_get_y'
  },

  // Shipping Methods
  SHIPPING_METHODS: {
    STANDARD: { name: 'Standard', days: '5-7', cost: 50 },
    EXPRESS: { name: 'Express', days: '2-3', cost: 150 },
    OVERNIGHT: { name: 'Overnight', days: '1', cost: 300 }
  },

  // Error Messages
  ERROR_MESSAGES: {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_EXISTS: 'User already exists',
    PRODUCT_NOT_FOUND: 'Product not found',
    OUT_OF_STOCK: 'Product out of stock',
    INSUFFICIENT_STOCK: 'Insufficient stock available'
  },

  // Success Messages
  SUCCESS_MESSAGES: {
    USER_CREATED: 'User created successfully',
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    PRODUCT_CREATED: 'Product created successfully',
    PRODUCT_UPDATED: 'Product updated successfully',
    PRODUCT_DELETED: 'Product deleted successfully',
    ORDER_PLACED: 'Order placed successfully',
    ORDER_UPDATED: 'Order updated successfully',
    PASSWORD_RESET: 'Password reset successful',
    CART_UPDATED: 'Cart updated successfully'
  },

  // Product Sizes
  SIZES: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],

  // Product Colors (common ones)
  COLORS: [
    'Black', 'White', 'Red', 'Blue', 'Green', 
    'Yellow', 'Pink', 'Purple', 'Orange', 'Brown', 
    'Gray', 'Navy', 'Beige', 'Maroon'
  ],

  // Categories (default)
  CATEGORIES: [
    'Men', 'Women', 'Kids', 'Accessories', 
    'Shoes', 'Bags', 'T-Shirts', 'Shirts', 
    'Pants', 'Tops', 'Dresses', 'Jackets'
  ],

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500
  },

  // Rate Limiting
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  },

  // Session
  SESSION: {
    SECRET: process.env.SESSION_SECRET || 'your-session-secret',
    MAX_AGE: 24 * 60 * 60 * 1000 // 24 hours
  },

  // CORS
  CORS_ORIGINS: [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL
  ].filter(Boolean)
};