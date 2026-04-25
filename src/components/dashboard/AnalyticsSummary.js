// ===================================================================
// AnalyticsSummary Component - Row 2: Summary + Charts
// ===================================================================
// Location: src/components/dashboard/AnalyticsSummary.js
// ===================================================================
// Displays: Donor Bank Summary, Pie Chart (2x2 legend), Monthly Bar Chart
// Responsive: 3 cols → 1 col stacked
// ===================================================================

import { useDashboard } from './DashboardContext';
import { formatCurrency, formatNumber, getMaxValue } from './dashboardUtils';

// ===================================================================
// LOADING SKELETON
// ===================================================================
function AnalyticsSkeleton() {
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1.5fr',
        gap: '20px',
        marginBottom: '24px',
      }} className="analytics-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
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
              width: '100%',
              height: '120px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              animation: 'pulse 1.5s infinite',
            }} />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (max-width: 1024px) {
          .analytics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

// ===================================================================
// DONOR BANK SUMMARY
// ===================================================================
function DonorBankSummary({ donorSummary }) {
  const summaryItems = [
    { key: 'directDebitors', label: 'Direct Debitors:', icon: '⭐', iconBg: '#fef3c7', valueColor: '#3b82f6' },
    { key: 'premiumDonors', label: 'Premium Donors:', icon: '🌙', iconBg: '#f3e8ff', valueColor: '#9333ea' },
    { key: 'regularDonors', label: 'Regular Donors:', icon: '👤', iconBg: '#f0fdf4', valueColor: '#22c55e' },
  ];

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
      }}>
        📋 Donor Bank Summary
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {summaryItems.map((item) => (
          <div key={item.key} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '16px',
                backgroundColor: item.iconBg,
                padding: '6px',
                borderRadius: '6px',
              }}>
                {item.icon}
              </span>
              <span style={{ fontSize: '14px', color: '#374151' }}>{item.label}</span>
            </div>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: item.valueColor,
            }}>
              {donorSummary?.[item.key] || 0}
            </span>
          </div>
        ))}
        
        {/* Total Row */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '14px', marginTop: '4px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                fontSize: '14px',
                backgroundColor: '#1e3a5f',
                color: 'white',
                padding: '6px',
                borderRadius: '6px',
              }}>
                👥
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a5f' }}>
                All Donors:
              </span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a5f' }}>
              {donorSummary?.total || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// PIE CHART WITH FOOTER LEGEND
// ===================================================================
function DonorDistributionPie({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a5f', margin: '0 0 20px 0' }}>
          🥧 Donor Distribution
        </h3>
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>
          No data available
        </div>
      </div>
    );
  }

  // Calculate pie slices
  let cumulativePercent = 0;
  const slices = data.map((item) => {
    const percent = item.value / 100;
    const startAngle = cumulativePercent * 360;
    cumulativePercent += percent;
    const endAngle = cumulativePercent * 360;
    
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    
    const x1 = 60 + 50 * Math.cos(startRad);
    const y1 = 60 + 50 * Math.sin(startRad);
    const x2 = 60 + 50 * Math.cos(endRad);
    const y2 = 60 + 50 * Math.sin(endRad);
    
    const largeArc = percent > 0.5 ? 1 : 0;
    
    return {
      ...item,
      path: `M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`
    };
  });

  const regularPercent = data.find(d => d.label === 'Regular')?.value || 0;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a5f', margin: '0 0 16px 0' }}>
        🥧 Donor Distribution
      </h3>
      
      {/* Pie Chart - centered and larger */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      }}>
        <svg width="160" height="160" viewBox="0 0 120 120">
          {slices.map((slice, index) => (
            <path key={index} d={slice.path} fill={slice.color} />
          ))}
          <circle cx="60" cy="60" r="25" fill="white" />
          <text x="60" y="65" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#f97316">
            {regularPercent}%
          </text>
        </svg>
      </div>
      
      {/* Footer Legend - 2x2 grid at bottom */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '6px 12px',
        backgroundColor: '#f9fafb',
        padding: '10px 12px',
        borderRadius: '8px',
        marginTop: '12px',
      }}>
        {data.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: '#374151',
          }}>
            <div style={{
              width: '10px',
              height: '10px',
              backgroundColor: item.color,
              borderRadius: '2px',
              flexShrink: 0,
            }} />
            <span>{item.label} ({item.value}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================================================================
// MONTHLY DONATIONS BAR CHART
// ===================================================================
function MonthlyDonationsBar({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a5f', margin: '0 0 20px 0' }}>
          📊 Monthly Donations (12 Months)
        </h3>
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>
          No data available
        </div>
      </div>
    );
  }

  const maxValue = getMaxValue(data, 'value');
  const lastIndex = data.length - 1;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e3a5f', margin: '0 0 20px 0' }}>
        📊 Monthly Donations (12 Months)
      </h3>
      
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        height: '140px',
        paddingTop: '10px',
      }}>
        {data.map((item, index) => {
          const height = maxValue > 0 ? (item.value / maxValue) * 120 : 0;
          const isCurrentMonth = index === lastIndex;
          const isHighest = item.value === maxValue && maxValue > 0;
          
          let barColor = '#3b82f6';
          if (isCurrentMonth) barColor = '#22c55e';
          else if (isHighest) barColor = '#f97316';
          
          return (
            <div key={index} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
            }}>
              <div 
                style={{
                  width: '100%',
                  maxWidth: '28px',
                  height: `${Math.max(height, 4)}px`,
                  backgroundColor: barColor,
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 0.3s',
                  minHeight: '4px',
                }}
                title={`${item.month}: ${formatCurrency(item.value)}`}
              />
              <span style={{ fontSize: '9px', color: '#6b7280', marginTop: '6px' }}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================================================================
// MAIN COMPONENT
// ===================================================================
export default function AnalyticsSummary() {
  const { donorSummary, charts, loading, error } = useDashboard();
  
  // Don't render if error
  if (error) return null;
  
  // Loading state
  if (loading) {
    return <AnalyticsSkeleton />;
  }
  
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1.5fr',
        gap: '20px',
        marginBottom: '24px',
      }} className="analytics-grid">
        <DonorBankSummary donorSummary={donorSummary} />
        <DonorDistributionPie data={charts?.donorDistribution} />
        <MonthlyDonationsBar data={charts?.monthlyDonations} />
      </div>
      
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .analytics-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}