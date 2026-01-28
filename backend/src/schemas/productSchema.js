const { body: productBody, param: productParam, query: productQuery } = require('express-validator');

// Create product validation
const createProductSchema = [
  productBody('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters'),

  productBody('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),

  productBody('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  productBody('category_id')
    .notEmpty()
    .withMessage('Category is required')
    .isInt()
    .withMessage('Category ID must be a number'),

  productBody('stock_quantity')
    .notEmpty()
    .withMessage('Stock quantity is required')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),

  productBody('sku')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('SKU must not exceed 100 characters'),

  productBody('brand')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Brand must not exceed 100 characters'),

  productBody('sizes')
    .optional()
    .isArray()
    .withMessage('Sizes must be an array'),

  productBody('colors')
    .optional()
    .isArray()
    .withMessage('Colors must be an array'),

  productBody('discount_percentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  productBody('is_featured')
    .optional()
    .isBoolean()
    .withMessage('is_featured must be a boolean'),

  productBody('is_new_arrival')
    .optional()
    .isBoolean()
    .withMessage('is_new_arrival must be a boolean')
];

// Update product validation
const updateProductSchema = [
  productParam('id')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt()
    .withMessage('Product ID must be a number'),

  ...createProductSchema.map(validation => {
    // Make all fields optional for update
    if (validation.builder && validation.builder.fields) {
      const field = validation.builder.fields[0];
      return productBody(field).optional();
    }
    return validation;
  })
];

// Get products query validation
const getProductsQuerySchema = [
  productQuery('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  productQuery('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  productQuery('category')
    .optional()
    .trim(),

  productQuery('search')
    .optional()
    .trim(),

  productQuery('min_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),

  productQuery('max_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),

  productQuery('sort')
    .optional()
    .isIn(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'popular'])
    .withMessage('Invalid sort parameter'),

  productQuery('is_featured')
    .optional()
    .isBoolean()
    .withMessage('is_featured must be a boolean'),

  productQuery('is_new_arrival')
    .optional()
    .isBoolean()
    .withMessage('is_new_arrival must be a boolean')
];

// Product ID param validation
const productIdSchema = [
  productParam('id')
    .notEmpty()
    .withMessage('Product ID is required')
    .isInt()
    .withMessage('Product ID must be a number')
];

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductsQuerySchema,
  productIdSchema
};