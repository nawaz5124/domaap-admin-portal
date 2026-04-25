// ===================================================================
// Dashboard Styles - Shared Design System
// ===================================================================
// Location: src/components/dashboard/dashboardStyles.js
// ===================================================================
// Centralized styles for consistent look across all components
// ===================================================================

// ===================================================================
// COLORS
// ===================================================================
export const colors = {
  // Primary palette
  primary: '#1e3a5f',        // Dark blue (headers, titles)
  primaryLight: '#2d4a6f',   // Lighter blue
  
  // Status colors
  success: '#22c55e',        // Green (positive trends, success)
  successLight: '#f0fdf4',   // Light green background
  successBorder: '#bbf7d0',  // Green border
  
  warning: '#f97316',        // Orange (highlights, warnings)
  warningLight: '#fff7ed',   // Light orange background
  warningBorder: '#fed7aa',  // Orange border
  
  danger: '#ef4444',         // Red (errors, alerts)
  dangerLight: '#fef2f2',    // Light red background
  dangerBorder: '#fecaca',   // Red border
  
  info: '#3b82f6',           // Blue (links, info)
  infoLight: '#eff6ff',      // Light blue background
  infoBorder: '#bfdbfe',     // Blue border
  
  // Special colors
  purple: '#9333ea',         // Purple (premium donors)
  purpleLight: '#f3e8ff',    // Light purple background
  
  cyan: '#06b6d4',           // Cyan (line charts)
  cyanLight: '#ecfeff',      // Light cyan background
  
  pink: '#ec4899',           // Pink (DD bars)
  pinkLight: '#fdf2f8',      // Light pink background
  
  yellow: '#ca8a04',         // Yellow (gift aid)
  yellowLight: '#fefce8',    // Light yellow background
  yellowBorder: '#fef08a',   // Yellow border
  
  // Neutrals
  gray: '#6b7280',           // Gray (secondary text)
  grayLight: '#9ca3af',      // Light gray
  grayDark: '#374151',       // Dark gray (body text)
  
  // Backgrounds
  background: '#f9fafb',     // Page background
  card: '#ffffff',           // Card background
  cardHover: '#f8fafc',      // Card hover state
  
  // Borders
  border: '#e5e7eb',         // Default border
  borderLight: '#f3f4f6',    // Light border
};

// ===================================================================
// CHART COLORS (For consistent chart styling)
// ===================================================================
export const chartColors = {
  // Pie chart / Donor distribution
  dd: '#3b82f6',             // Blue - Direct Debit
  premium: '#22c55e',        // Green - Premium
  regular: '#f97316',        // Orange - Regular
  nonDonor: '#9ca3af',       // Gray - Non-donor
  
  // Bar charts
  barDefault: '#3b82f6',     // Blue - Default bar
  barHighlight: '#f97316',   // Orange - Highest value
  barCurrent: '#22c55e',     // Green - Current month
  barDD: '#ec4899',          // Pink - DD Amount bars
  
  // Line charts
  line: '#06b6d4',           // Cyan - Line color
  lineDot: '#06b6d4',        // Cyan - Dot color
  lineArea: '#fef9c3',       // Yellow - Area fill
  lineAreaBorder: '#facc15', // Yellow - Area border
};

// ===================================================================
// SHADOWS
// ===================================================================
export const shadows = {
  card: '0 2px 8px rgba(0,0,0,0.06)',
  cardHover: '0 4px 12px rgba(0,0,0,0.1)',
  button: '0 1px 3px rgba(0,0,0,0.1)',
  buttonHover: '0 4px 12px rgba(0,0,0,0.15)',
  dropdown: '0 4px 16px rgba(0,0,0,0.12)',
};

// ===================================================================
// BORDER RADIUS
// ===================================================================
export const radius = {
  small: '6px',
  medium: '10px',
  large: '12px',
  card: '16px',
  badge: '12px',
  button: '10px',
  full: '9999px',
};

// ===================================================================
// SPACING
// ===================================================================
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  
  // Grid gaps
  gridGap: '20px',
  gridGapMobile: '12px',
  
  // Card padding
  cardPadding: '24px',
  cardPaddingMobile: '16px',
  
  // Section margin
  sectionMargin: '24px',
  sectionMarginMobile: '16px',
};

// ===================================================================
// TYPOGRAPHY
// ===================================================================
export const typography = {
  // Font sizes
  fontSize: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '24px',
    '4xl': '28px',
  },
  
  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  // Line heights
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },
};

// ===================================================================
// RESPONSIVE BREAKPOINTS
// ===================================================================
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

// ===================================================================
// MEDIA QUERIES (for use in JS/inline styles)
// ===================================================================
export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.tablet})`,
  tablet: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
};

// ===================================================================
// GRID CONFIGURATIONS (for each row)
// ===================================================================
export const gridConfig = {
  // Row 1: Stat Cards
  statCards: {
    desktop: 'repeat(4, 1fr)',
    tablet: 'repeat(2, 1fr)',
    mobile: '1fr',
  },
  
  // Row 2: Analytics Summary
  analyticsSummary: {
    desktop: 'repeat(3, 1fr)',
    tablet: '1fr',
    mobile: '1fr',
  },
  
  // Row 3: Trend Charts
  trendCharts: {
    desktop: 'repeat(3, 1fr)',
    tablet: '1fr',
    mobile: '1fr',
  },
  
  // Row 4: Donations Trend (full width)
  donationsTrend: {
    desktop: '1fr',
    tablet: '1fr',
    mobile: '1fr',
  },
  
  // Row 5: Data Tables
  dataTables: {
    desktop: 'repeat(2, 1fr)',
    tablet: '1fr',
    mobile: '1fr',
  },
  
  // Row 6: Quick Actions
  quickActions: {
    desktop: 'repeat(6, 1fr)',
    tablet: 'repeat(3, 1fr)',
    mobile: 'repeat(2, 1fr)',
  },
};

// ===================================================================
// COMMON COMPONENT STYLES
// ===================================================================
export const commonStyles = {
  // Card base style
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    boxShadow: shadows.card,
  },
  
  // Card title
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary,
    marginBottom: spacing.xl,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
  
  // Section row
  row: {
    display: 'grid',
    gap: spacing.gridGap,
    marginBottom: spacing.sectionMargin,
  },
  
  // Badge
  badge: {
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: radius.badge,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  
  // Button base
  button: {
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: radius.button,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  
  // Loading spinner
  spinner: {
    width: '48px',
    height: '48px',
    border: `4px solid ${colors.border}`,
    borderTopColor: colors.info,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  
  // Empty state
  emptyState: {
    padding: spacing.xl,
    textAlign: 'center',
    color: colors.grayLight,
    backgroundColor: colors.background,
    borderRadius: radius.medium,
  },
  
  // Error state
  errorState: {
    backgroundColor: colors.dangerLight,
    border: `1px solid ${colors.dangerBorder}`,
    borderRadius: radius.large,
    padding: spacing.xxl,
    textAlign: 'center',
  },
};

// ===================================================================
// ALERT TYPE STYLES
// ===================================================================
export const alertStyles = {
  error: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.dangerBorder,
  },
  warning: {
    backgroundColor: colors.warningLight,
    borderColor: colors.warningBorder,
  },
  success: {
    backgroundColor: colors.successLight,
    borderColor: colors.successBorder,
  },
  info: {
    backgroundColor: colors.infoLight,
    borderColor: colors.infoBorder,
  },
};

// ===================================================================
// DONATION TYPE COLORS
// ===================================================================
export const donationTypeColors = {
  dd: colors.info,
  zakat: colors.success,
  sadaqah: colors.warning,
  lillah: colors.purple,
  education: colors.info,
  regular: colors.gray,
};

// ===================================================================
// HELPER: Get responsive grid style
// ===================================================================
export const getResponsiveGrid = (config, currentWidth) => {
  if (currentWidth < parseInt(breakpoints.tablet)) {
    return config.mobile;
  } else if (currentWidth < parseInt(breakpoints.desktop)) {
    return config.tablet;
  }
  return config.desktop;
};

// ===================================================================
// HELPER: Get responsive padding
// ===================================================================
export const getResponsivePadding = (isMobile) => {
  return isMobile ? spacing.cardPaddingMobile : spacing.cardPadding;
};

// ===================================================================
// HELPER: Get responsive gap
// ===================================================================
export const getResponsiveGap = (isMobile) => {
  return isMobile ? spacing.gridGapMobile : spacing.gridGap;
};