// ===================================================================
// Dashboard Context - Shared State & API Management
// ===================================================================
// Location: src/components/dashboard/DashboardContext.js
// Updated:  1 Mar 2026 - Added 401 session redirect to login
// ===================================================================
// Provides centralized data fetching and state for all dashboard components
// ===================================================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import logger from '@/utils/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// ===================================================================
// CREATE CONTEXT
// ===================================================================
const DashboardContext = createContext(null);

// ===================================================================
// CONTEXT PROVIDER
// ===================================================================
export function DashboardProvider({ children }) {
  // -----------------------------------------------------------------
  // STATE
  // -----------------------------------------------------------------
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // -----------------------------------------------------------------
  // FETCH DASHBOARD DATA
  // -----------------------------------------------------------------
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Env-driven URL for cross-origin readiness;
      // credentials: 'include' ensures JWT cookies are sent in prod (admin.* -> api.*)
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // ============================================================
      // 401 = Session expired → redirect to login (same as other pages)
      // ============================================================
      if (response.status === 401) {
        window.location.href = '/portal/login';
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      logger.error('Failed to fetch dashboard data', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // -----------------------------------------------------------------
  // FETCH ON MOUNT
  // -----------------------------------------------------------------
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // -----------------------------------------------------------------
  // REFRESH DATA (Manual refresh)
  // -----------------------------------------------------------------
  const refreshData = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // -----------------------------------------------------------------
  // EXTRACT DATA SECTIONS (with safe defaults)
  // -----------------------------------------------------------------
  const stats = dashboardData?.stats || null;
  const donorSummary = dashboardData?.donorSummary || null;
  const charts = dashboardData?.charts || null;
  const recentDonations = dashboardData?.recentDonations || [];
  const alerts = dashboardData?.alerts || [];

  // -----------------------------------------------------------------
  // CONTEXT VALUE
  // -----------------------------------------------------------------
  const value = {
    // Full data
    dashboardData,
    
    // Individual sections (for modular components)
    stats,
    donorSummary,
    charts,
    recentDonations,
    alerts,
    
    // State
    loading,
    error,
    lastUpdated,
    
    // Actions
    refreshData,
    fetchDashboardData,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

// ===================================================================
// CUSTOM HOOK - useDashboard
// ===================================================================
export function useDashboard() {
  const context = useContext(DashboardContext);
  
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
}

// ===================================================================
// CUSTOM HOOKS - Individual Data Sections
// ===================================================================

/**
 * Hook for Stats Cards (Row 1)
 */
export function useStats() {
  const { stats, loading, error } = useDashboard();
  return { stats, loading, error };
}

/**
 * Hook for Donor Summary (Row 2 - Summary Card)
 */
export function useDonorSummary() {
  const { donorSummary, loading, error } = useDashboard();
  return { donorSummary, loading, error };
}

/**
 * Hook for Charts Data (Row 2, 3, 4)
 */
export function useCharts() {
  const { charts, loading, error } = useDashboard();
  return { charts, loading, error };
}

/**
 * Hook for Recent Donations (Row 5 - Table)
 */
export function useRecentDonations() {
  const { recentDonations, loading, error } = useDashboard();
  return { recentDonations, loading, error };
}

/**
 * Hook for Alerts (Row 5 - Alerts Panel)
 */
export function useAlerts() {
  const { alerts, loading, error } = useDashboard();
  return { alerts, loading, error };
}

// ===================================================================
// EXPORT DEFAULT
// ===================================================================
export default DashboardContext;