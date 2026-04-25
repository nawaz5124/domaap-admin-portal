// ===================================================================
// DonationsTrend Component - Row 4: Full Width Weekly Trend
// ===================================================================
// Location: src/components/dashboard/DonationsTrend.js
// ===================================================================
// Displays: Donations Over Time - Weekly totals as cyan line chart
// Full width - responsive
// ===================================================================

import { useDashboard } from './DashboardContext';
import { formatCurrency, getMaxValue } from './dashboardUtils';

// ===================================================================
// LOADING SKELETON
// ===================================================================
function DonationsTrendSkeleton() {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: '24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{
            width: '180px',
            height: '18px',
            backgroundColor: '#e5e7eb',
            borderRadius: '4px',
            marginBottom: '8px',
            animation: 'pulse 1.5s infinite',
          }} />
          <div style={{
            width: '140px',
            height: '12px',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            animation: 'pulse 1.5s infinite',
          }} />
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{
            width: '80px',
            height: '40px',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            animation: 'pulse 1.5s infinite',
          }} />
          <div style={{
            width: '80px',
            height: '40px',
            backgroundColor: '#f3f4f6',
            borderRadius: '6px',
            animation: 'pulse 1.5s infinite',
          }} />
        </div>
      </div>
      <div style={{
        width: '100%',
        height: '100px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        animation: 'pulse 1.5s infinite',
      }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// ===================================================================
// MAIN COMPONENT
// ===================================================================
export default function DonationsTrend() {
  const { charts, loading, error } = useDashboard();
  
  // Don't render if error
  if (error) return null;
  
  // Loading state
  if (loading) {
    return <DonationsTrendSkeleton />;
  }
  
  const data = charts?.weeklyDonations || [];
  const hasData = data && data.length > 0;
  
  // Calculate totals
  const totalValue = hasData ? data.reduce((sum, item) => sum + (item.value || 0), 0) : 0;
  const avgValue = hasData ? totalValue / data.length : 0;
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      marginBottom: '24px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e3a5f',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            📈 Donations Over Time
          </h3>
          <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
            Amount per Year/Month/Week
          </p>
        </div>
        
        {/* Summary Stats */}
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#22c55e' }}>
              {formatCurrency(totalValue)}
            </div>
            <div style={{ fontSize: '10px', color: '#6b7280' }}>Total (4 weeks)</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>
              {formatCurrency(avgValue)}
            </div>
            <div style={{ fontSize: '10px', color: '#6b7280' }}>Avg/Week</div>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      {!hasData ? (
        <div style={{
          textAlign: 'center',
          color: '#9ca3af',
          padding: '32px',
          fontSize: '13px',
        }}>
          No weekly donation data available
        </div>
      ) : (
        <>
          <div style={{ height: '100px', position: 'relative', marginBottom: '12px' }}>
            <svg 
              width="100%" 
              height="100" 
              viewBox="0 0 800 100" 
              preserveAspectRatio="none"
              style={{ overflow: 'visible' }}
            >
              {(() => {
                const maxValue = getMaxValue(data, 'value');
                const padding = 20;
                const chartWidth = 800 - padding * 2;
                const chartHeight = 80;
                
                const points = data.map((item, index) => {
                  const x = padding + (index / (data.length - 1)) * chartWidth;
                  const y = maxValue > 0 
                    ? 10 + (1 - item.value / maxValue) * chartHeight
                    : 80;
                  return { x, y, value: item.value };
                });
                
                const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                
                return (
                  <>
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
                      <line
                        key={i}
                        x1={padding}
                        y1={10 + ratio * chartHeight}
                        x2={800 - padding}
                        y2={10 + ratio * chartHeight}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    ))}
                    
                    {/* Line */}
                    <path 
                      d={linePath} 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    
                    {/* Data points */}
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="8" fill="#06b6d4" fillOpacity="0.2" />
                        <circle cx={p.x} cy={p.y} r="5" fill="#06b6d4" />
                        <title>{`${data[i].week}: ${formatCurrency(p.value)}`}</title>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          
          {/* Labels */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            color: '#6b7280',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}>
            {data.map((item, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '500' }}>{item.week}</div>
                <div style={{ fontSize: '9px', color: '#9ca3af' }}>
                  {item.startDate} - {item.endDate}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}