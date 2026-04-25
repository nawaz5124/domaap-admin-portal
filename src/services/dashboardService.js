// ===================================================================
// Dashboard Service - Frontend API Service
// ===================================================================
// Location: src/services/dashboardService.js
// ===================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Get authorization headers
 * Add token if authentication is required
 */
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Uncomment when auth is implemented
  // const token = localStorage.getItem('adminToken');
  // if (token) {
  //   headers['Authorization'] = `Bearer ${token}`;
  // }
  
  return headers;
};

/**
 * Fetch all dashboard data in a single call
 * GET /api/admin/dashboard/
 */
export const fetchDashboardData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch dashboard stats only (for partial refresh)
 * GET /api/admin/dashboard/stats/
 */
export const fetchDashboardStats = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats/`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch donor summary (DD, Premium, Regular counts)
 * GET /api/admin/dashboard/donor-summary/
 */
export const fetchDonorSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/donor-summary/`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch chart data (pie chart + bar chart)
 * GET /api/admin/dashboard/charts/
 */
export const fetchChartData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/charts/`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch recent donations
 * GET /api/admin/dashboard/recent-donations/
 * @param {number} limit - Number of donations to fetch (default: 5, max: 20)
 */
export const fetchRecentDonations = async (limit = 5) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/recent-donations/?limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch alerts and notifications
 * GET /api/admin/dashboard/alerts/
 * @param {number} limit - Number of alerts to fetch (default: 5, max: 10)
 */
export const fetchAlerts = async (limit = 5) => {
  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/alerts/?limit=${limit}`, {
    method: 'GET',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// ===================================================================
// Default export with all methods
// ===================================================================
const dashboardService = {
  fetchDashboardData,
  fetchDashboardStats,
  fetchDonorSummary,
  fetchChartData,
  fetchRecentDonations,
  fetchAlerts,
};

export default dashboardService;