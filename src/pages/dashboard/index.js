// ===================================================================
// Dashboard Page - Modular Component Architecture
// ===================================================================
// Location: src/pages/dashboard/index.js
// ===================================================================
// API: GET /api/admin/dashboard/
// ===================================================================
// This page assembles all modular components.
// To add/remove rows, simply comment/uncomment the component imports.
// ===================================================================

import { DashboardProvider, useDashboard } from '../../components/dashboard/DashboardContext';
import { getCurrentDate } from '../../components/dashboard/dashboardUtils';

// ===================================================================
// MODULAR COMPONENTS - Comment/uncomment to show/hide rows
// ===================================================================
import StatCards from '../../components/dashboard/StatCards';               // Row 1
import AnalyticsSummary from '../../components/dashboard/AnalyticsSummary'; // Row 2
import TrendCharts from '../../components/dashboard/TrendCharts';           // Row 3 (NEW)
import DonationsTrend from '../../components/dashboard/DonationsTrend';     // Row 4 (NEW)
import DataTables from '../../components/dashboard/DataTables';             // Row 5
import QuickActions from '../../components/dashboard/QuickActions';         // Row 6

// ===================================================================
// DASHBOARD HEADER
// ===================================================================
function DashboardHeader() {
  const { refreshData, loading } = useDashboard();
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '28px',
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e3a5f',
        margin: 0,
      }}>
        📊 Dashboard
      </h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Refresh Button */}
        <button
          onClick={refreshData}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#e5e7eb' : '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: '#3b82f6',
            fontWeight: '500',
            transition: 'all 0.2s',
          }}
        >
          <span style={{
            display: 'inline-block',
            animation: loading ? 'spin 1s linear infinite' : 'none',
          }}>
            🔄
          </span>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
        
        {/* Date Display */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#6b7280',
          fontSize: '14px',
        }}>
          <span>📅</span>
          <span>{getCurrentDate()}</span>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// ===================================================================
// ERROR STATE
// ===================================================================
function ErrorState({ error, onRetry }) {
  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '12px',
      padding: '24px',
      margin: '20px 0',
      textAlign: 'center',
    }}>
      <span style={{ fontSize: '32px' }}>⚠️</span>
      <h3 style={{ color: '#dc2626', marginTop: '12px' }}>Failed to load dashboard</h3>
      <p style={{ color: '#6b7280', marginTop: '8px' }}>{error}</p>
      <button
        onClick={onRetry}
        style={{
          marginTop: '16px',
          padding: '10px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
        }}
      >
        Retry
      </button>
    </div>
  );
}

// ===================================================================
// DASHBOARD CONTENT
// ===================================================================
function DashboardContent() {
  const { error, refreshData } = useDashboard();
  
  // Error state
  if (error) {
    return <ErrorState error={error} onRetry={refreshData} />;
  }
  
  return (
    <>
      {/* ==================== ROW 1: STAT CARDS ==================== */}
      <StatCards />
      
      {/* ==================== ROW 2: ANALYTICS SUMMARY ==================== */}
      <AnalyticsSummary />
      
      {/* ==================== ROW 3: TREND CHARTS (NEW) ==================== */}
      {/* Comment out to hide: */}
      <TrendCharts />
      
      {/* ==================== ROW 4: DONATIONS TREND (NEW) ==================== */}
      {/* Comment out to hide: */}
      <DonationsTrend />
      
      {/* ==================== ROW 5: DATA TABLES ==================== */}
      <DataTables />
      
      {/* ==================== ROW 6: QUICK ACTIONS ==================== */}
      <QuickActions />
    </>
  );
}

// ===================================================================
// MAIN DASHBOARD PAGE
// ===================================================================
export default function Dashboard() {
  return (
    <DashboardProvider>
      <DashboardHeader />
      <DashboardContent />
    </DashboardProvider>
  );
}

// ===================================================================
// ROW ORDER REFERENCE (for easy reordering)
// ===================================================================
// Row 1: StatCards        - 4 KPI cards (grid-cols-4)
// Row 2: AnalyticsSummary - Summary + Pie + Bar (grid-cols-3)
// Row 3: TrendCharts      - DD/Donors/Premium charts (grid-cols-3) [NEW]
// Row 4: DonationsTrend   - Weekly trend line (full width) [NEW]
// Row 5: DataTables       - Donations table + Alerts (grid-cols-2)
// Row 6: QuickActions     - 6 action buttons (grid-cols-6)
// ===================================================================