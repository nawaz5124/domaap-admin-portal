// ===================================================================
// 🔧 DOMAAP Admin Portal Logger - Centralised Logging Façade
// ===================================================================
// Location: src/utils/logger.js
// ===================================================================
// Wraps console methods with environment-aware behaviour:
//   - info/debug/warn: Dev-only (suppressed in production)
//   - error:           Always logs (fire alarm principle)
//
// Mirrors the donor-portal logger for platform consistency.
//
// Usage: import logger from '@/utils/logger';
//        logger.info('Dashboard data fetched');
//        logger.debug('API response:', data);
//        logger.error('API call failed:', err);
// ===================================================================

const isDev = process.env.NODE_ENV === "development";

const logger = {
  info:  (...args) => { if (isDev) console.log(...args); },
  debug: (...args) => { if (isDev) console.log(...args); },
  warn:  (...args) => { if (isDev) console.warn(...args); },
  error: (...args) => console.error(...args),
};

export default logger;
