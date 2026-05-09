// ===================================================================
// 🎯 _app.js - Application Wrapper with Centralized Layout
// ===================================================================
// PURPOSE: Wraps all pages, provides global providers
// UPDATED: January 2026 - Centralized Layout to prevent sidebar dancing
// ===================================================================

import '@/styles/globals.css';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/common/Layout';
import { ComingSoonProvider } from '@/context/ComingSoonContext';
import logger from '@/utils/logger';



// ===================================================================
// 📋 CONFIGURATION
// ===================================================================

// Pages that should NOT use the admin Layout (public pages)
const publicPages = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/donate',
  '/thank-you',
  '/404',
  '/500',
];

// Map routes to activeMenu values for sidebar highlighting
const routeToMenu = {
  '/dashboard': 'dashboard',
  '/donor-bank': 'donor-bank',
  '/donation-book': 'donation-book',
  '/donor-profile': 'donor-profile',
  '/donor': 'donor-profile',
  '/reports': 'reports',
  '/email': 'email',
  '/community': 'community',
  '/events': 'events',
  '/settings': 'settings',
};

// ===================================================================
// 🔧 HELPER FUNCTIONS
// ===================================================================

/**
 * Check if the current page should skip the admin Layout
 */
function isPublicPage(pathname) {
  // Exact match
  if (publicPages.includes(pathname)) return true;
  
  // Check if starts with any public page path (for sub-routes)
  // Exclude root '/' from this check to avoid matching everything
  return publicPages.some(page => 
    page !== '/' && pathname.startsWith(page + '/')
  );
}

/**
 * Get the activeMenu value based on current route
 */
function getActiveMenu(pathname) {
  // Exact match first
  if (routeToMenu[pathname]) {
    return routeToMenu[pathname];
  }
  
  // Check for sub-routes (e.g., /donor-bank/123 → 'donor-bank')
  for (const [route, menu] of Object.entries(routeToMenu)) {
    if (pathname.startsWith(route + '/')) {
      return menu;
    }
  }
  
  // Default to dashboard
  return 'dashboard';
}

// ===================================================================
// 🚀 APP COMPONENT
// ===================================================================

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    logger.debug('🚀 Admin Portal Loaded - Bismillah');
  }, []);

  // Check if current page is public (no Layout needed)
  const isPublic = isPublicPage(router.pathname);

  // For public pages, render without Layout
  if (isPublic) {
    return (
      <>
        {/* TODO: Add AuthProvider here */}
        {/* TODO: Add NotificationProvider here */}
        <Component {...pageProps} />
      </>
    );
  }

  // For admin pages, wrap with Layout
  // Layout stays mounted, only Component changes → No more dancing! 🎉
  const activeMenu = getActiveMenu(router.pathname);

  return (
    <>
      {/* TODO: Add AuthProvider here */}
      {/* TODO: Add NotificationProvider here */}
      <ComingSoonProvider>
        <Layout activeMenu={activeMenu}>
          <Component {...pageProps} />
        </Layout>
      </ComingSoonProvider>
    </>
  );
}