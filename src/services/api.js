// ===================================================================
// 🌐 API Client - Admin Portal (DOMAAP)
// ===================================================================
// Location: src/services/api.js
//
// PRODUCTION-READINESS PASS 2026-05-04:
// - API_BASE_URL now env-driven (NEXT_PUBLIC_API_BASE_URL)
// - Cookie clearing domains derived from API URL (no hardcoded ngrok)
// - All console.* migrated to logger utility
// ===================================================================

import logger from '@/utils/logger';

/**
 * API Base URL - sourced from env, falls back to local dev backend.
 * Set NEXT_PUBLIC_API_BASE_URL in .env.local (dev/stage) and Vercel (prod).
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Get cookie value by name
 */
function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

/**
 * Get ADMIN access token from cookie
 */
function getAccessToken() {
  return getCookie('admin_access_token');
}

/**
 * Build the list of cookie-clearing domain attributes.
 * Derives from API_BASE_URL so dev/stage/prod all self-adapt.
 *   '' → current host (no domain attribute set)
 *   '.host'  → e.g. .camelfoundation-domaap.ngrok.app
 *   '.parent' → e.g. .ngrok.app  (only when 3+ labels)
 */
function getCookieDomains() {
  const domains = [''];
  try {
    const { hostname } = new URL(API_BASE_URL);
    domains.push(`.${hostname}`);
    const parts = hostname.split('.');
    if (parts.length > 2) {
      domains.push(`.${parts.slice(-2).join('.')}`);
    }
  } catch {
    /* malformed URL — current-host clear is best we can do */
  }
  return domains;
}

/**
 * Clear admin portal cookies (for logout or fresh login)
 */
export function clearAdminCookies() {
  const cookieDomains = getCookieDomains();
  const cookieNames = ['admin_access_token', 'admin_refresh_token'];
  const paths = ['/portal', '/'];

  cookieNames.forEach((name) => {
    paths.forEach((path) => {
      cookieDomains.forEach((domain) => {
        const domainPart = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domainPart}`;
      });
    });
  });

  logger.debug('🧹 [ADMIN API] Cleared admin auth cookies');
}

/**
 * Make API request with authentication
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const accessToken = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    logger.debug(`🌐 [ADMIN API] Request: ${url}`);

    const response = await fetch(url, fetchOptions);

    logger.debug(`📡 [ADMIN API] Response: ${response.status}`);

    if (response.status === 401) {
      logger.warn('⚠️ [ADMIN API] Unauthorized - attempting token refresh...');

      const refreshed = await refreshAdminToken();

      if (refreshed) {
        const newAccessToken = getAccessToken();
        if (newAccessToken) {
          headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        const retryResponse = await fetch(url, { ...fetchOptions, headers });
        if (retryResponse.ok) {
          return await retryResponse.json();
        }
      }

      logger.error('❌ [ADMIN API] Token refresh failed - redirecting to login');
      if (typeof window !== 'undefined') {
        clearAdminCookies();
        localStorage.removeItem('user');
        window.location.href = '/portal/login';
      }
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.detail || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(`❌ [ADMIN API] Request failed: ${endpoint}`, error.message);
    throw error;
  }
}

/**
 * Refresh admin access token
 */
async function refreshAdminToken() {
  try {
    logger.debug('🔄 [ADMIN API] Refreshing admin token...');

    const response = await fetch(`${API_BASE_URL}/auth/admin-refresh/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      logger.debug('✅ [ADMIN API] Token refreshed successfully');
      return true;
    }

    logger.warn('❌ [ADMIN API] Token refresh returned:', response.status);
    return false;
  } catch (error) {
    logger.error('❌ [ADMIN API] Token refresh error:', error.message);
    return false;
  }
}

/**
 * Logout - clear cookies and redirect
 */
export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/admin-logout/`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (e) {
    logger.warn('Logout API call failed:', e.message);
  }

  clearAdminCookies();
  localStorage.removeItem('user');

  if (typeof window !== 'undefined') {
    window.location.href = '/portal/login';
  }
}

/** GET request helper */
export async function get(endpoint, params = {}) {
  const queryString = Object.keys(params).length
    ? '?' + new URLSearchParams(params).toString()
    : '';
  return apiRequest(`${endpoint}${queryString}`, { method: 'GET' });
}

/** POST request helper */
export async function post(endpoint, data = {}) {
  return apiRequest(endpoint, { method: 'POST', body: JSON.stringify(data) });
}

/** PUT request helper */
export async function put(endpoint, data = {}) {
  return apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(data) });
}

/** DELETE request helper */
export async function del(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

export default {
  get,
  post,
  put,
  del,
  apiRequest,
  logout,
  clearAdminCookies,
  API_BASE_URL,
};