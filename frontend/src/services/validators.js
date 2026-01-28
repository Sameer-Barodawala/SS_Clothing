import { VALIDATION } from '../constants';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid and message
 */
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
    return {
      isValid: false,
      message: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
    };
  }

  if (password.length > VALIDATION.MAX_PASSWORD_LENGTH) {
    return {
      isValid: false,
      message: `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters`,
    };
  }

  return { isValid: true, message: 'Password is valid' };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid
 */
export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  const trimmedName = name.trim();
  return (
    trimmedName.length >= VALIDATION.MIN_NAME_LENGTH &&
    trimmedName.length <= VALIDATION.MAX_NAME_LENGTH
  );
};

/**
 * Validate phone number (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleaned = phone.replace(/\D/g, '');
  return phoneRegex.test(cleaned);
};

/**
 * Validate PIN code (Indian format)
 * @param {string} pincode - PIN code to validate
 * @returns {boolean} True if valid
 */
export const isValidPincode = (pincode) => {
  if (!pincode) return false;
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode.toString().trim());
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @returns {boolean} True if not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @returns {boolean} True if meets minimum
 */
export const minLength = (value, min) => {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length >= min;
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} max - Maximum length
 * @returns {boolean} True if within maximum
 */
export const maxLength = (value, max) => {
  if (!value || typeof value !== 'string') return false;
  return value.trim().length <= max;
};

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if within range
 */
export const isInRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) return false;
  return num >= min && num <= max;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate credit card number (basic Luhn algorithm)
 * @param {string} cardNumber - Card number to validate
 * @returns {boolean} True if valid
 */
export const isValidCardNumber = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') return false;
  
  const cleaned = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate CVV
 * @param {string} cvv - CVV to validate
 * @returns {boolean} True if valid
 */
export const isValidCVV = (cvv) => {
  if (!cvv) return false;
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv.toString().trim());
};

/**
 * Validate expiry date (MM/YY format)
 * @param {string} expiry - Expiry date to validate
 * @returns {boolean} True if valid and not expired
 */
export const isValidExpiryDate = (expiry) => {
  if (!expiry || typeof expiry !== 'string') return false;
  
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiry)) return false;

  const [month, year] = expiry.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expYear = parseInt(year, 10);
  const expMonth = parseInt(month, 10);

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;

  return true;
};

/**
 * Validate form data
 * @param {object} data - Form data to validate
 * @param {object} rules - Validation rules
 * @returns {object} Validation errors
 */
export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = data[field];

    if (fieldRules.required && !isRequired(value)) {
      errors[field] = `${field} is required`;
      return;
    }

    if (fieldRules.email && !isValidEmail(value)) {
      errors[field] = 'Invalid email address';
      return;
    }

    if (fieldRules.phone && !isValidPhone(value)) {
      errors[field] = 'Invalid phone number';
      return;
    }

    if (fieldRules.minLength && !minLength(value, fieldRules.minLength)) {
      errors[field] = `Minimum length is ${fieldRules.minLength}`;
      return;
    }

    if (fieldRules.maxLength && !maxLength(value, fieldRules.maxLength)) {
      errors[field] = `Maximum length is ${fieldRules.maxLength}`;
      return;
    }
  });

  return errors;
};