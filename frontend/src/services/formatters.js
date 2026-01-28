/**
 * Format a number as currency (Indian Rupees)
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency symbol (default: ₹)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = '₹') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currency}0.00`;
  }
  
  // Indian number format with commas
  const formatted = amount.toFixed(2);
  const [rupees, paise] = formatted.split('.');
  
  // Add commas in Indian style (last 3 digits, then every 2 digits)
  let lastThree = rupees.substring(rupees.length - 3);
  let otherNumbers = rupees.substring(0, rupees.length - 3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  const result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;
  
  return `${currency}${result}.${paise}`;
};

/**
 * Format a date string or Date object
 * @param {string|Date} date - The date to format
 * @param {string} format - The format type ('short', 'long', 'time')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
    time: { hour: '2-digit', minute: '2-digit', hour12: true },
    full: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    },
  };

  return dateObj.toLocaleDateString('en-IN', options[format] || options.short);
};

/**
 * Format a phone number (Indian format)
 * @param {string} phone - The phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  
  return phone;
};

/**
 * Format a large number with K, L (Lakh), Cr (Crore) suffixes
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + ' Cr';
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(2) + ' L';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate a string to a specified length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, length = 50) => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Format order status for display
 * @param {string} status - The order status
 * @returns {string} Formatted status
 */
export const formatOrderStatus = (status) => {
  if (!status) return '';
  return status
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Format file size in bytes to human readable format
 * @param {number} bytes - The size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format a discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @returns {string} Formatted discount percentage
 */
export const formatDiscount = (originalPrice, discountedPrice) => {
  if (!originalPrice || !discountedPrice || originalPrice <= discountedPrice) {
    return '';
  }
  
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return `${Math.round(discount)}% OFF`;
};