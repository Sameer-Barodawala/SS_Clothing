const { validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');
const { HTTP_STATUS } = require('../config/constants');

/**
 * Middleware to validate request using express-validator
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg
    }));

    return errorResponse(
      res,
      'Validation failed',
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errorMessages
    );
  }

  next();
};

/**
 * Custom validator functions
 */
const validators = {
  // Email validator
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Phone validator (Indian format)
  isValidPhone: (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  },

  // Password strength validator
  isStrongPassword: (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  },

  // Pin code validator (Indian)
  isValidPinCode: (pinCode) => {
    const pinCodeRegex = /^[1-9][0-9]{5}$/;
    return pinCodeRegex.test(pinCode);
  },

  // URL validator
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  },

  // Price validator
  isValidPrice: (price) => {
    return !isNaN(price) && price >= 0;
  },

  // Quantity validator
  isValidQuantity: (quantity) => {
    return Number.isInteger(quantity) && quantity > 0;
  },

  // Date validator (future date)
  isFutureDate: (date) => {
    const inputDate = new Date(date);
    const today = new Date();
    return inputDate > today;
  },

  // Array validator
  isNonEmptyArray: (arr) => {
    return Array.isArray(arr) && arr.length > 0;
  },

  // Object ID validator (for MongoDB-style IDs)
  isValidObjectId: (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  // Slug validator
  isValidSlug: (slug) => {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
  },

  // Color hex code validator
  isValidHexColor: (color) => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  },

  // Credit card validator (basic Luhn algorithm)
  isValidCreditCard: (cardNumber) => {
    const sanitized = cardNumber.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(sanitized)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }
};

/**
 * Sanitize input data
 */
const sanitize = {
  // Remove HTML tags
  stripHtml: (str) => {
    return str.replace(/<[^>]*>/g, '');
  },

  // Trim whitespace
  trim: (str) => {
    return str.trim();
  },

  // Convert to lowercase
  toLowerCase: (str) => {
    return str.toLowerCase();
  },

  // Convert to uppercase
  toUpperCase: (str) => {
    return str.toUpperCase();
  },

  // Remove special characters
  alphanumeric: (str) => {
    return str.replace(/[^a-zA-Z0-9]/g, '');
  },

  // Escape special characters for SQL
  escape: (str) => {
    return str
      .replace(/'/g, "''")
      .replace(/\\/g, '\\\\')
      .replace(/\0/g, '\\0');
  }
};

/**
 * Request body sanitization middleware
 */
const sanitizeBody = (fields) => {
  return (req, res, next) => {
    fields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = sanitize.trim(req.body[field]);
        req.body[field] = sanitize.stripHtml(req.body[field]);
      }
    });
    next();
  };
};

module.exports = {
  validate,
  validators,
  sanitize,
  sanitizeBody
};