// ===================================================================
// 📐 useResponsive Hook - IMPROVED VERSION
// ===================================================================
// Location: src/hooks/useResponsive.js
// 
// Fixes:
//   - Uses matchMedia API (more stable than resize events)
//   - Proper debouncing to prevent flickering
//   - SSR-safe with mounted state
//   - Smooth transitions on orientation change
// 
// Breakpoints:
//   - Mobile:  < 640px
//   - Tablet:  640px - 1024px
//   - Desktop: 1024px - 1440px
//   - Large:   > 1440px
// ===================================================================

import { useState, useEffect, useCallback } from 'react';

// Breakpoint values (in pixels)
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
};

/**
 * Custom hook for responsive breakpoint detection
 * Uses matchMedia API for better performance and stability
 * 
 * @returns {Object} Responsive state object
 */
export function useResponsive() {
  // Initialize with safe defaults for SSR
  const [state, setState] = useState({
    screenWidth: 1200,
    screenHeight: 800,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLarge: false,
    breakpoint: 'desktop',
    mounted: false,
  });

  // Calculate breakpoint from width
  const getBreakpointState = useCallback((width, height) => {
    const isMobile = width < BREAKPOINTS.mobile;
    const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
    const isDesktop = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
    const isLarge = width >= BREAKPOINTS.desktop;

    let breakpoint = 'desktop';
    if (isMobile) breakpoint = 'mobile';
    else if (isTablet) breakpoint = 'tablet';
    else if (isLarge) breakpoint = 'large';

    return {
      screenWidth: width,
      screenHeight: height,
      isMobile,
      isTablet,
      isDesktop,
      isLarge,
      breakpoint,
      isMobileOrTablet: isMobile || isTablet,
      isDesktopOrLarge: isDesktop || isLarge,
      isTabletOrDesktop: isTablet || isDesktop,
      isLandscape: width > height,
      isPortrait: width <= height,
      mounted: true,
    };
  }, []);

  useEffect(() => {
    // Skip on server
    if (typeof window === 'undefined') return;

    // Debounce timer
    let debounceTimer = null;
    let rafId = null;

    // Update state with current dimensions
    const updateState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setState(getBreakpointState(width, height));
    };

    // Debounced resize handler (prevents flickering)
    const handleResize = () => {
      // Cancel any pending updates
      if (debounceTimer) clearTimeout(debounceTimer);
      if (rafId) cancelAnimationFrame(rafId);

      // Use requestAnimationFrame for smooth updates
      rafId = requestAnimationFrame(() => {
        // Additional debounce for orientation changes
        debounceTimer = setTimeout(() => {
          updateState();
        }, 100); // 100ms debounce
      });
    };

    // Initial update
    updateState();

    // Listen for resize
    window.addEventListener('resize', handleResize, { passive: true });

    // Also listen for orientation change (more reliable on mobile)
    window.addEventListener('orientationchange', () => {
      // Orientation change needs longer delay for dimensions to settle
      setTimeout(updateState, 200);
    }, { passive: true });

    // Cleanup
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', updateState);
    };
  }, [getBreakpointState]);

  return state;
}

/**
 * CSS class names for responsive visibility
 * Can be used with global CSS for additional control
 */
export const responsiveClasses = {
  mobileOnly: 'show-mobile-only',
  tabletOnly: 'show-tablet-only',
  desktopOnly: 'show-desktop-only',
  hideOnMobile: 'hide-on-mobile',
  hideOnTablet: 'hide-on-tablet',
  hideOnDesktop: 'hide-on-desktop',
};

/**
 * Get responsive value based on current breakpoint
 */
export function getResponsiveValue(values, breakpoint) {
  if (values[breakpoint] !== undefined) {
    return values[breakpoint];
  }
  
  const fallbackOrder = ['large', 'desktop', 'tablet', 'mobile'];
  const currentIndex = fallbackOrder.indexOf(breakpoint);
  
  for (let i = currentIndex; i < fallbackOrder.length; i++) {
    if (values[fallbackOrder[i]] !== undefined) {
      return values[fallbackOrder[i]];
    }
  }
  
  return Object.values(values)[0];
}

export default useResponsive;
