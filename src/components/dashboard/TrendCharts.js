// ===================================================================
// TrendCharts Component - Row 3: NEW Trend Analytics
// ===================================================================
// Location: src/components/dashboard/TrendCharts.js
// ===================================================================
// Displays: DD Amount (pink bar), Donors Overview (yellow area), Premium (cyan line)
// Responsive: 3 cols → 1 col stacked
// ===================================================================

import { useDashboard } from './DashboardContext';
import { formatCurrency, getMaxValue } from './dashboardUtils';

// ===================================================================
// LOADING SKELETON
// ===================================================================
function TrendChartsSkeleton() {
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '24px',
      }} className="trend-charts-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              width: '150px',
              height: '16px',
              backgroundColor: '#e5e7eb',
              borderRadius: '4px',
              marginBottom: '8px',
              animation: 'pulse 1.5s infinite',
            }} />
            <div style={{
              width: '100px',
              height: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              marginBottom: '16px',
              animation: 'pulse 1.5s infinite',
            }} />
            <div style={{
              width: '100%',
              height: '100px',
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
          .trend-charts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}

// ===================================================================
// DD AMOUNT BAR CHART (Pink Bars)
// ===================================================================
function DDAmountChart({ data }) {
  const hasData = data && data.length > 0;
  const maxValue = hasData ? getMaxValue(data, 'value') : 0;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a5f', margin: 0 }}>
        📊 DD Amount vs Time
      </h3>
      <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', marginBottom: '16px' }}>
        Amount vs Calendar
      </p>
      
      {!hasData ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px', fontSize: '12px' }}>
          No DD data available
        </div>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-around',
          height: '100px',
          paddingTop: '12px',
        }}>
          {data.map((item, index) => {
            const height = maxValue > 0 ? (item.value / maxValue) * 80 : 4;
            
            return (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                maxWidth: '60px',
              }}>
                <div
                  style={{
                    width: '45px',
                    height: `${Math.max(height, 4)}px`,
                    backgroundColor: '#ec4899',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease',
                  }}
                  title={`${item.month}: ${formatCurrency(item.value)}`}
                />
                <span style={{ fontSize: '9px', color: '#6b7280', marginTop: '8px', textAlign: 'center' }}>
                  {item.month?.substring(0, 3)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===================================================================
// DONORS OVERVIEW AREA CHART (Yellow Area)
// ===================================================================
function DonorsOverviewChart({ data }) {
  const hasData = data && data.length > 0;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a5f', margin: 0 }}>
        👥 All Donors Overview
      </h3>
      <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', marginBottom: '16px' }}>
        Growth over Years
      </p>
      
      {!hasData ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px', fontSize: '12px' }}>
          No growth data available
        </div>
      ) : (
        <>
          <div style={{ height: '80px', position: 'relative' }}>
            <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="none">
              {(() => {
                const maxValue = getMaxValue(data, 'value');
                const points = data.map((item, index) => {
                  const x = (index / (data.length - 1)) * 200;
                  const y = maxValue > 0 ? 80 - (item.value / maxValue) * 70 : 70;
                  return { x, y };
                });
                
                const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                const areaPath = `${linePath} L 200 80 L 0 80 Z`;
                
                return (
                  <>
                    <path d={areaPath} fill="#fef9c3" stroke="#facc15" strokeWidth="2" />
                    {points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="4" fill="#facc15" />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '9px',
            color: '#6b7280',
            marginTop: '8px',
            paddingLeft: '8px',
            paddingRight: '8px',
          }}>
            {data.map((item, index) => (
              <span key={index}>{item.year}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ===================================================================
// PREMIUM CONTRIBUTIONS LINE CHART (Cyan Line)
// ===================================================================
function PremiumContributionsChart({ data }) {
  const hasData = data && data.length > 0;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <h3 style={{ fontSize: '13px', fontWeight: '600', color: '#1e3a5f', margin: 0 }}>
        🌙 Premium Contributions
      </h3>
      <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px', marginBottom: '16px' }}>
        Amount vs Calendar
      </p>
      
      {!hasData ? (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '24px', fontSize: '12px' }}>
          No premium data available
        </div>
      ) : (
        <>
          <div style={{ height: '80px', position: 'relative' }}>
            <svg width="100%" height="80" viewBox="0 0 220 80" preserveAspectRatio="none">
              {(() => {
                const maxValue = getMaxValue(data, 'value');
                const padding = 10;
                const points = data.map((item, index) => {
                  const x = padding + (index / (data.length - 1)) * (220 - padding * 2);
                  const y = maxValue > 0 
                    ? padding + (1 - item.value / maxValue) * (80 - padding * 2)
                    : 70;
                  return { x, y };
                });
                
                const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                
                return (
                  <>
                    <path 
                      d={linePath} 
                      fill="none" 
                      stroke="#06b6d4" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="5" fill="#06b6d4" />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '9px',
            color: '#6b7280',
            marginTop: '8px',
            paddingLeft: '8px',
            paddingRight: '8px',
          }}>
            {data.map((item, index) => (
              <span key={index}>{item.quarter}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ===================================================================
// MAIN COMPONENT
// ===================================================================
export default function TrendCharts() {
  const { charts, loading, error } = useDashboard();
  
  // Don't render if error
  if (error) return null;
  
  // Loading state
  if (loading) {
    return <TrendChartsSkeleton />;
  }
  
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '24px',
      }} className="trend-charts-grid">
        <DDAmountChart data={charts?.ddAmountByMonth} />
        <DonorsOverviewChart data={charts?.donorGrowthByYear} />
        <PremiumContributionsChart data={charts?.premiumByQuarter} />
      </div>
      
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .trend-charts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}