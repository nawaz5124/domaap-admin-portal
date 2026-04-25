// ===================================================================
// QuickActions Component - Row 6: Action Buttons
// ===================================================================
// Location: src/components/dashboard/QuickActions.js
// ===================================================================
// Displays: 6 Quick Action buttons with hover effects
// Responsive: 6 cols → 3 cols → 2 cols
// ===================================================================

import { useDashboard } from './DashboardContext';

// ===================================================================
// QUICK ACTIONS CONFIGURATION
// ===================================================================
const getQuickActionsConfig = (alertCount = 0) => [
  {
    label: 'Add New Donor',
    icon: '➕',
    color: '#22c55e',
    bgColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    href: '/portal/donor/new',
  },
  {
    label: 'Send Email',
    icon: '✉️',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    href: '/portal/email',
  },
  {
    label: 'Generate Report',
    icon: '📋',
    color: '#f97316',
    bgColor: '#fff7ed',
    borderColor: '#fed7aa',
    href: '/portal/reports',
  },
  {
    label: 'Generate Receipts',
    icon: '🧾',
    color: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    href: '/portal/receipts',
  },
  {
    label: 'Gift Aid Claim',
    icon: '🎁',
    color: '#ca8a04',
    bgColor: '#fefce8',
    borderColor: '#fef08a',
    href: '/portal/gift-aid',
  },
  {
    label: `View Alerts (${alertCount})`,
    icon: '🔔',
    color: '#ef4444',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    href: '/portal/alerts',
  },
];

// ===================================================================
// LOADING SKELETON
// ===================================================================
function QuickActionsSkeleton() {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        width: '150px',
        height: '20px',
        backgroundColor: '#e5e7eb',
        borderRadius: '6px',
        marginBottom: '20px',
        animation: 'pulse 1.5s infinite',
      }} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gap: '12px',
      }} className="quick-actions-grid">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{
            height: '50px',
            backgroundColor: '#f3f4f6',
            borderRadius: '10px',
            animation: 'pulse 1.5s infinite',
          }} />
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 1024px) {
          .quick-actions-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

// ===================================================================
// SINGLE ACTION BUTTON
// ===================================================================
function ActionButton({ action }) {
  const handleMouseOver = (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  };
  
  const handleMouseOut = (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = 'none';
  };
  
  return (
    <button
      onClick={() => window.location.href = action.href}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      style={{
        backgroundColor: action.bgColor,
        border: `1px solid ${action.borderColor}`,
        borderRadius: '10px',
        padding: '14px 12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        color: action.color,
        fontWeight: '500',
        fontSize: '13px',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      <span>{action.icon}</span>
      <span>{action.label}</span>
    </button>
  );
}

// ===================================================================
// MAIN COMPONENT
// ===================================================================
export default function QuickActions() {
  const { alerts, loading, error } = useDashboard();
  
  // Don't render if error
  if (error) return null;
  
  // Loading state
  if (loading) {
    return <QuickActionsSkeleton />;
  }
  
  const alertCount = alerts?.length || 0;
  const quickActions = getQuickActionsConfig(alertCount);
  
  return (
    <>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a5f', margin: 0 }}>
            ⚡ Quick Actions
          </h3>

        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '12px',
        }} className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <ActionButton key={index} action={action} />
          ))}
        </div>
      </div>
      
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .quick-actions-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .quick-actions-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
}