// ===================================================================
// DataTables Component - Row 5: Recent Donations + Alerts
// ===================================================================
// Location: src/components/dashboard/DataTables.js
// ===================================================================
// Displays: Recent Donations Table, Alerts & Notifications Panel
// Responsive: 2 cols → 1 col stacked
// ===================================================================

import { useDashboard } from './DashboardContext';
import { formatCurrency } from './dashboardUtils';

// ===================================================================
// ALERT STYLES BY TYPE
// ===================================================================
const alertTypeStyles = {
  error: { bgColor: '#fef2f2', borderColor: '#fecaca' },
  warning: { bgColor: '#fffbeb', borderColor: '#fde68a' },
  success: { bgColor: '#f0fdf4', borderColor: '#bbf7d0' },
};

// ===================================================================
// LOADING SKELETON
// ===================================================================
function DataTablesSkeleton() {
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '24px',
      }} className="data-tables-grid">
        {[1, 2].map((i) => (
          <div key={i} style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: '180px',
              height: '20px',
              backgroundColor: '#e5e7eb',
              borderRadius: '6px',
              marginBottom: '20px',
              animation: 'pulse 1.5s infinite',
            }} />
            {[1, 2, 3, 4].map((j) => (
              <div key={j} style={{
                width: '100%',
                height: '44px',
                backgroundColor: '#f3f4f6',
                borderRadius: '6px',
                marginBottom: '8px',
                animation: 'pulse 1.5s infinite',
              }} />
            ))}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 1024px) {
          .data-tables-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

// ===================================================================
// RECENT DONATIONS TABLE
// ===================================================================
function RecentDonationsTable({ donations }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a5f', margin: 0 }}>
          📋 Recent Donations
        </h3>
        <a 
          href="/portal/donation-book" 
          style={{ color: '#3b82f6', fontSize: '13px', textDecoration: 'none' }}
        >
          View All →
        </a>
      </div>
      
      {(!donations || donations.length === 0) ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#9ca3af',
          backgroundColor: '#f9fafb',
          borderRadius: '10px',
        }}>
          No recent donations
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{
                textAlign: 'left',
                padding: '10px 8px',
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '600',
              }}>
                Date
              </th>
              <th style={{
                textAlign: 'left',
                padding: '10px 8px',
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '600',
              }}>
                Donor
              </th>
              <th style={{
                textAlign: 'left',
                padding: '10px 8px',
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '600',
              }}>
                Type
              </th>
              <th style={{
                textAlign: 'right',
                padding: '10px 8px',
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '600',
              }}>
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                <td style={{ padding: '12px 8px', fontSize: '13px', color: '#374151' }}>
                  {donation.date}
                </td>
                <td style={{ padding: '12px 8px', fontSize: '13px', color: '#374151' }}>
                  {donation.donor}
                </td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{
                    backgroundColor: `${donation.typeColor}20`,
                    color: donation.typeColor,
                    padding: '4px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                  }}>
                    {donation.type}
                  </span>
                </td>
                <td style={{
                  padding: '12px 8px',
                  fontSize: '13px',
                  color: '#374151',
                  textAlign: 'right',
                  fontWeight: '600',
                }}>
                  {formatCurrency(donation.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ===================================================================
// ALERTS PANEL
// ===================================================================
function AlertsPanel({ alerts }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#1e3a5f',
        marginBottom: '20px',
        margin: '0 0 20px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span>⚠️</span> Alerts & Notifications
      </h3>
      
      {(!alerts || alerts.length === 0) ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          color: '#9ca3af',
          backgroundColor: '#f9fafb',
          borderRadius: '10px',
        }}>
          ✓ No alerts at this time
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {alerts.map((alert, index) => {
            const style = alertTypeStyles[alert.type] || alertTypeStyles.success;
            
            return (
              <div
                key={index}
                style={{
                  backgroundColor: style.bgColor,
                  border: `1px solid ${style.borderColor}`,
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '18px' }}>{alert.icon}</span>
                <div>
                  <div style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                    {alert.message}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                    {alert.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===================================================================
// MAIN COMPONENT
// ===================================================================
export default function DataTables() {
  const { recentDonations, alerts, loading, error } = useDashboard();
  
  // Don't render if error
  if (error) return null;
  
  // Loading state
  if (loading) {
    return <DataTablesSkeleton />;
  }
  
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        marginBottom: '24px',
      }} className="data-tables-grid">
        <RecentDonationsTable donations={recentDonations} />
        <AlertsPanel alerts={alerts} />
      </div>
      
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .data-tables-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}