// ===================================================================
// Dashboard Utilities - Reusable Helper Functions
// ===================================================================
// Location: src/components/dashboard/dashboardUtils.js
// ===================================================================
// These functions are used across all dashboard components
// ===================================================================

/**
 * Format number as British Pounds (£)
 * @param {number} value - The amount to format
 * @param {boolean} showDecimals - Whether to show decimal places (default: false)
 * @returns {string} Formatted currency string (e.g., "£1,234")
 */
export const formatCurrency = (value, showDecimals = false) => {
  if (value === null || value === undefined) return '£0';
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(value);
};

/**
 * Format number with thousand separators
 * @param {number} value - The number to format
 * @returns {string} Formatted number string (e.g., "1,234")
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-GB').format(value);
};

/**
 * Format percentage value
 * @param {number} value - The percentage value
 * @param {boolean} showSymbol - Whether to show % symbol (default: true)
 * @returns {string} Formatted percentage (e.g., "45%")
 */
export const formatPercentage = (value, showSymbol = true) => {
  if (value === null || value === undefined) return showSymbol ? '0%' : '0';
  const formatted = Math.round(value);
  return showSymbol ? `${formatted}%` : `${formatted}`;
};

/**
 * Format trend value - caps at 100+ for cleaner display
 * @param {number} trend - The trend percentage
 * @returns {string} Formatted trend (e.g., "45" or "100+")
 */
export const formatTrend = (trend) => {
  if (trend === null || trend === undefined) return '0';
  return trend > 100 ? '100+' : String(trend);
};

/**
 * Get current date formatted for display
 * @returns {string} Formatted date (e.g., "Wednesday, 28 January 2026")
 */
export const getCurrentDate = () => {
  const options = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  };
  return new Date().toLocaleDateString('en-GB', options);
};

/**
 * Get short date format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date (e.g., "28/01/2026")
 */
export const formatShortDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-GB');
};

/**
 * Get relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - Date to convert
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 7) {
    return formatShortDate(date);
  } else if (diffDays > 1) {
    return `${diffDays} days ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMins > 0) {
    return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

/**
 * Calculate percentage of a value relative to total
 * @param {number} value - The part value
 * @param {number} total - The total value
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Get maximum value from an array of objects
 * @param {Array} data - Array of objects
 * @param {string} key - Key to compare
 * @returns {number} Maximum value
 */
export const getMaxValue = (data, key = 'value') => {
  if (!data || data.length === 0) return 0;
  return Math.max(...data.map(item => item[key] || 0));
};

/**
 * Calculate bar height percentage for charts
 * @param {number} value - Current bar value
 * @param {number} maxValue - Maximum value in dataset
 * @param {number} maxHeight - Maximum height in pixels (default: 120)
 * @returns {number} Height in pixels
 */
export const calculateBarHeight = (value, maxValue, maxHeight = 120) => {
  if (!maxValue || maxValue === 0) return 4; // Minimum height
  const height = (value / maxValue) * maxHeight;
  return Math.max(height, 4); // Ensure minimum visibility
};

/**
 * Safe data access with fallback
 * @param {any} value - Value to check
 * @param {any} fallback - Fallback value (default: 0)
 * @returns {any} Value or fallback
 */
export const safeValue = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  return value;
};

/**
 * Check if data is empty or null
 * @param {any} data - Data to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (data) => {
  if (data === null || data === undefined) return true;
  if (Array.isArray(data)) return data.length === 0;
  if (typeof data === 'object') return Object.keys(data).length === 0;
  return false;
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 20)
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 20) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Generate unique key for list items
 * @param {string} prefix - Prefix for the key
 * @param {number} index - Index in the list
 * @returns {string} Unique key
 */
export const generateKey = (prefix, index) => {
  return `${prefix}-${index}-${Date.now()}`;
};

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms (default: 300)
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};