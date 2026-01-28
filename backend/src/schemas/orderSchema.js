const { body, param, query } = require('express-validator');

// Create order validation
const createOrderSchema = [
  body('shipping_address')
    .notEmpty()
    .withMessage('Shipping address is required')
    .isLength({ max: 500 })
    .withMessage('Address must not exceed 500 characters'),

  body('shipping_city')
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 100 })
    .withMessage('City must not exceed 100 characters'),

  body('shipping_state')
    .notEmpty()
    .withMessage('State is required')
    .isLength({ max: 100 })
    .withMessage('State must not exceed 100 characters'),

  body('shipping_zip')
    .notEmpty()
    .withMessage('ZIP code is required')
    .matches(/^[1-9][0-9]{5}$/)
    .withMessage('Please provide a valid 6-digit Indian PIN code'),

  body('shipping_country')
    .notEmpty()
    .withMessage('Country is required')
    .isLength({ max: 100 })
    .withMessage('Country must not exceed 100 characters'),

  body('payment_method')
    .notEmpty()
    .withMessage('Payment method is required')
    .isIn(['credit_card', 'debit_card', 'paypal', 'cod', 'upi'])
    .withMessage('Invalid payment method'),

  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  body('items.*.product_id')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt()
    .withMessage('Product ID must be a number'),

  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),

  body('items.*.price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
];

// Update order status validation
const updateOrderStatusSchema = [
  param('id')
    .notEmpty()
    .withMessage('Order ID is required')
    .isInt()
    .withMessage('Order ID must be a number'),

  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid order status'),

  body('tracking_number')
    .optional()
    .isString()
    .withMessage('Tracking number must be a string')
];

// Get orders query validation
const getOrdersQuerySchema = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('status')
    .optional()
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid order status')
];

module.exports = {
  createOrderSchema,
  updateOrderStatusSchema,
  getOrdersQuerySchema
};