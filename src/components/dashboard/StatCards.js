// ===================================================================
// StatCards Component - Row 1: KPI Stat Cards
// ===================================================================
// Location: src/components/dashboard/StatCards.js
// ===================================================================
// Displays 4 KPI cards: Total Donors, This Month, Active DD, Gift Aid
// Responsive: 4 cols (desktop) → 2x2 (tablet) → 1 card container (mobile)
// ===================================================================

import { useStats } from './DashboardContext';
import { formatCurrency, formatNumber, formatTrend } from './dashboardUtils';
import { colors, shadows, radius, spacing } from './dashboardStyles';

// ===================================================================
// STAT CARD CONFIGURATION
// ===================================================================
const statCardsConfig = [
  {
    key: 'totalDonors',
    label: 'Total Donors',
    icon: '👥',
    iconBg: '#eff6ff',
    valueColor: '#1e3a5f',
    formatter: formatNumber,
    getTrend: (stat) => ({
      text: `${formatTrend(stat?.trend || 0)}% from last month`,
      direction: stat?.trendDirection,
    }),
  },
  {
    key: 'thisMonth',
    label: 'This Month',
    icon: '💷',
    iconBg: '#f0fdf4',
    valueColor: '#22c55e',
    formatter: formatCurrency,
    getTrend: (stat) => ({
      text: `${formatTrend(stat?.trend || 0)}% from last month`,
      direction: stat?.trendDirection,
    }),
  },
  {
    key: 'activeDd',
    label: 'Active DD',
    icon: '🔄',
    iconBg: '#eff6ff',
    valueColor: '#1e3a5f',
    formatter: formatNumber,
    getTrend: (stat) => ({
      text: stat?.cancelled > 0 
        ? `${stat.cancelled} cancelled this month`
        : 'No cancellations this month',
      direction: stat?.cancelled > 0 ? 'down' : 'up',
      prefix: stat?.cancelled > 0 ? '↓' : '✓',
    }),
  },
  {
    key: 'giftAidClaimable',
    label: 'Gift Aid Claimable',
    icon: '🎁',
    iconBg: '#fef3c7',
    valueColor: '#22c55e',
    formatter: formatCurrency,
    getTrend: (stat) => ({
      text: `${stat?.percentage || 0}% of donations`,
      direction: 'up',
      prefix: '',
    }),
  },
];

// ===================================================================
// LOADING SKELETON
// ===================================================================
function StatCardSkeleton() {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#e5e7eb',
          borderRadius: '8px',
          animation: 'pulse 1.5s infinite',
        }} />
        <div>
          <div style={{
            width: '80px',
            height: '28px',
            backgroundColor: '#e5e7eb',
            borderRadius: '6px',
            marginBottom: '8px',
            animation: 'pulse 1.5s infinite',
          }} />
          <div style={{
            width: '100px',
            height: '14px',
            backgroundColor: '#f3f4f6',
            borderRadius: '4px',
            animation: 'pulse 1.5s infinite',
          }} />
        </div>
      </div>
      <div style={{
        width: '140px',
        height: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '4px',
        marginTop: '8px',
        animation: 'pulse 1.5s infinite',
      }} />
    </div>
  );
}

// ===================================================================
// SINGLE STAT CARD (Desktop/Tablet - separate cards)
// ===================================================================
function StatCard({ config, stat }) {
  const value = stat?.value || 0;
  const trend = config.getTrend(stat);
  
  const trendColor = trend.direction === 'up' ? '#22c55e' : '#ef4444';
  const trendPrefix = trend.prefix !== undefined ? trend.prefix : (trend.direction === 'up' ? '↑' : '↓');
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <span style={{
          fontSize: '24px',
          backgroundColor: config.iconBg,
          padding: '8px',
          borderRadius: '8px',
        }}>
          {config.icon}
        </span>
        <div>
          <div style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: config.valueColor,
          }}>
            {config.formatter(value)}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {config.label}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: trendColor }}>
        {trendPrefix} {trend.text}
      </div>
    </div>
  );
}

// ===================================================================
// SINGLE STAT ROW (Mobile - compact row inside one card)
// ===================================================================
function StatRow({ config, stat, isLast }) {
  const value = stat?.value || 0;
  const trend = config.getTrend(stat);
  
  const trendColor = trend.direction === 'up' ? '#22c55e' : '#ef4444';
  const trendPrefix = trend.prefix !== undefined ? trend.prefix : (trend.direction === 'up' ? '↑' : '↓');
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: isLast ? '0' : '14px',
      marginBottom: isLast ? '0' : '14px',
      borderBottom: isLast ? 'none' : '1px solid #f3f4f6',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{
          fontSize: '20px',
          backgroundColor: config.iconBg,
          padding: '6px',
          borderRadius: '8px',
        }}>
          {config.icon}
        </span>
        <div>
          <div style={{ fontSize: '13px', color: '#6b7280' }}>
            {config.label}
          </div>
          <div style={{ fontSize: '11px', color: trendColor }}>
            {trendPrefix} {trend.text}
          </div>
        </div>
      </div>
      <span style={{
        fontSize: '22px',
        fontWeight: 'bold',
        color: config.valueColor,
      }}>
        {config.formatter(value)}
      </span>
    </div>
  );
}

// ===================================================================
// MAIN COMPONENT
// ===================================================================
export default function StatCards() {
  const { stats, loading, error } = useStats();
  
  // Don't render if error (main page handles error state)
  if (error) return null;
  
  // Loading state
  if (loading) {
    return (
      <>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '24px',
        }} className="stat-cards-grid">
          {[1, 2, 3, 4].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @media (max-width: 1024px) {
            .stat-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 640px) {
            .stat-cards-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </>
    );
  }
  
  return (
    <>
      {/* Desktop/Tablet: 4 separate cards in grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '24px',
      }} className="stat-cards-grid">
        {statCardsConfig.map((config) => (
          <StatCard 
            key={config.key}
            config={config}
            stat={stats?.[config.key]}
          />
        ))}
      </div>
      
      {/* Mobile: One clean container with all 4 stats as rows */}
      <div style={{
        display: 'none',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '24px',
      }} className="stat-cards-mobile">
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1e3a5f',
          margin: '0 0 16px 0',
        }}>
          📊 Key Stats
        </h3>
        {statCardsConfig.map((config, index) => (
          <StatRow
            key={config.key}
            config={config}
            stat={stats?.[config.key]}
            isLast={index === statCardsConfig.length - 1}
          />
        ))}
      </div>
      
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .stat-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .stat-cards-grid { display: none !important; }
          .stat-cards-mobile { display: block !important; }
        }
      `}</style>
    </>
  );
}