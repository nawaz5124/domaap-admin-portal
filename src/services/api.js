// ===================================================================
// 🌐 API Client - Admin Portal (DOMAAP)
// ===================================================================
// Location: src/services/api.js
// 
// FIXED 2026-01-31:
// - Use 'admin_access_token' cookie (separate from website)
// - No conflicts with donation flow cookies
// ===================================================================

/**
 * API Base URL - Direct to Django backend via ngrok
 */
const API_BASE_URL = 'https://camelfoundation-domaap.ngrok.app/api';

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
 * ✅ Uses 'admin_access_token' (different from website's 'access_token')
 */
function getAccessToken() {
  return getCookie('admin_access_token');
}

/**
 * Clear admin portal cookies (for logout or fresh login)
 */
export function clearAdminCookies() {
  const cookieDomains = [
    '',
    '.ngrok.app',
    '.camelfoundation-domaap.ngrok.app',
  ];
  
  const cookieNames = ['admin_access_token', 'admin_refresh_token'];
  const paths = ['/portal', '/'];
  
  cookieNames.forEach(name => {
    paths.forEach(path => {
      cookieDomains.forEach(domain => {
        const domainPart = domain ? `; domain=${domain}` : '';
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domainPart}`;
      });
    });
  });
  
  console.log('🧹 [ADMIN API] Cleared admin auth cookies');
}

/**
 * Make API request with authentication
 * @param {string} endpoint - API endpoint (e.g., '/admin/donors/stats/')
 * @param {object} options - Fetch options
 * @returns {Promise} - Response data
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const accessToken = getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // ✅ Attach admin access token if available
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  
  const fetchOptions = {
    ...options,
    headers,
    credentials: 'include',
  };
  
  try {
    console.log(`🌐 [ADMIN API] Request: ${url}`);
    
    const response = await fetch(url, fetchOptions);
    
    console.log(`📡 [ADMIN API] Response: ${response.status}`);
    
    if (response.status === 401) {
      console.warn('⚠️ [ADMIN API] Unauthorized - attempting token refresh...');
      
      // Try to refresh token
      const refreshed = await refreshAdminToken();
      
      if (refreshed) {
        // Retry the original request
        const newAccessToken = getAccessToken();
        if (newAccessToken) {
          headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        const retryResponse = await fetch(url, { ...fetchOptions, headers });
        
        if (retryResponse.ok) {
          return await retryResponse.json();
        }
      }
      
      // Refresh failed, redirect to login
      console.error('❌ [ADMIN API] Token refresh failed - redirecting to login');
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
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(`❌ [ADMIN API] Request Failed: ${endpoint}`, error);
    throw error;
  }
}

/**
 * Refresh admin access token
 */
async function refreshAdminToken() {
  try {
    console.log('🔄 [ADMIN API] Refreshing admin token...');
    
    const response = await fetch(`${API_BASE_URL}/auth/admin-refresh/`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('✅ [ADMIN API] Token refreshed successfully');
      return true;
    }
    
    console.warn('❌ [ADMIN API] Token refresh returned:', response.status);
    return false;
    
  } catch (error) {
    console.error('❌ [ADMIN API] Token refresh error:', error);
    return false;
  }
}

/**
 * Logout - clear cookies and redirect
 */
export async function logout() {
  try {
    // Call backend logout
    await fetch(`${API_BASE_URL}/auth/admin-logout/`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (e) {
    console.warn('Logout API call failed:', e);
  }
  
  // Clear local data
  clearAdminCookies();
  localStorage.removeItem('user');
  
  // Redirect to login
  if (typeof window !== 'undefined') {
    window.location.href = '/portal/login';
  }
}

/**
 * GET request helper
 */
export async function get(endpoint, params = {}) {
  const queryString = Object.keys(params).length 
    ? '?' + new URLSearchParams(params).toString()
    : '';
  
  return apiRequest(`${endpoint}${queryString}`, {
    method: 'GET',
  });
}

/**
 * POST request helper
 */
export async function post(endpoint, data = {}) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request helper
 */
export async function put(endpoint, data = {}) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request helper
 */
export async function del(endpoint) {
  return apiRequest(endpoint, {
    method: 'DELETE',
  });
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