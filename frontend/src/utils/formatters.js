/**
 * Format a number as currency.
 * @param {number} amount
 * @param {string} symbol  Currency symbol, e.g. '$', '€', '£'
 */
export const formatCurrency = (amount, symbol = '$') =>
  `${symbol}${Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

/**
 * Format an ISO date string for display.
 * Handles both 'YYYY-MM-DD' and 'YYYY-MM-DDTHH:mm:ss' formats.
 * @param {string} dateStr
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  // Append time so it parses as local time, not UTC midnight
  const normalized = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
  return new Date(normalized).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
  });
};

/**
 * Extract 'YYYY-MM-DD' from an ISO datetime string for use in <input type="date">.
 * @param {string} dateStr
 */
export const toDateInputValue = (dateStr) => {
  if (!dateStr) return '';
  return dateStr.slice(0, 10);
};

/**
 * Convert a date input value ('YYYY-MM-DD') to the ISO format the API expects.
 * @param {string} dateInputValue
 */
export const toApiDate = (dateInputValue) => {
  if (!dateInputValue) return '';
  return `${dateInputValue}T00:00:00`;
};

/**
 * Get the start-of-month ISO string for a given month offset.
 * offset=0  → this month
 * offset=-1 → last month
 */
export const monthRange = (offset = 0) => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth() + offset, 1);
};
