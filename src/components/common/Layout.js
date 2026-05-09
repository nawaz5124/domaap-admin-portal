// ===================================================================
// 📱 Responsive Layout Component with Auth Protection
// ===================================================================
// Location: src/components/common/Layout.js
// Description: Main layout wrapper with responsive sidebar
// Auth: Checks localStorage for user (set by login page)
// Updated: February 2026 - Added container boundary protection
// ===================================================================
// 🏗️ CONTAINER STRATEGY (3-Layer Boundary):
//   Layer 1: Outer wall (overflowX: hidden on root)
//   Layer 2: Main area (width-aware, no sideways spill)
//   Layer 3: Content box (maxWidth + padding + box-sizing)
//   
//   All admin pages are wrapped by this Layout via _app.js.
//   No page-level containers needed - consistency guaranteed.
//   Every page automatically gets the same boundaries.
// ===================================================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import logger from '@/utils/logger';
import { logout } from '@/services/api';

export default function Layout({ children, activeMenu }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();

  // ===================================================================
  // 🔐 Check Authentication on Mount
  // ===================================================================
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
        } else {
          logger.debug('🔐 No user found, redirecting to login...');
          router.push('/login');
        }
      } catch (error) {
        logger.error('Auth check failed', error.message);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // ===================================================================
  // 📱 Check for Mobile on Mount and Resize
  // ===================================================================
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ===================================================================
  // 🔒 Prevent Body Scroll When Sidebar Open (Mobile)
  // ===================================================================
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  // ===================================================================
  // ⌨️ Close Sidebar on Escape Key
  // ===================================================================
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [sidebarOpen]);

  // ===================================================================
  // 🚪 Logout Function
  // ===================================================================
  const handleLogout = async () => {
    logger.debug('🚪 Logging out...');
    await logout();
    // logout() handles: POST to /auth/admin-logout/, cookie cleanup,
    // localStorage cleanup, and full-page redirect to /portal/login.
  };

  const handleOverlayClick = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleNavigate = useCallback(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // ===================================================================
  // ⏳ Show Loading While Checking Auth
  // ===================================================================
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>{'\uD83D\uDC2A'}</div>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>Loading DOMAAP...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // ===================================================================
  // 🎨 Render Layout
  // ===================================================================
  return (
    <div style={{ 
      // ================================================
      // 🏠 LAYER 1: OUTER WALL
      // Nothing escapes sideways from the entire app
      // ================================================
      minHeight: '100vh', 
      backgroundColor: '#f3f4f6',
      overflowX: 'hidden',
      width: '100%',
    }}>
      {/* Mobile Header */}
      {isMobile && (
        <header 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            backgroundColor: '#1e3a5f',
            zIndex: 40,
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <button 
            onClick={toggleSidebar}
            aria-label="Toggle menu"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {sidebarOpen ? '\u2715' : '\u2630'}
          </button>
          
          <span style={{ color: '#d4943a', fontSize: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            {'\uD83D\uDC2A'} DOMAAP
          </span>
          
          <div style={{ width: '44px' }}></div>
        </header>
      )}

      {/* Sidebar Overlay */}
      <div 
        onClick={handleOverlayClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 45,
          opacity: isMobile && sidebarOpen ? 1 : 0,
          visibility: isMobile && sidebarOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          cursor: 'pointer'
        }}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Sidebar 
        activeMenu={activeMenu} 
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main 
        style={{
          // ================================================
          // 🔒 LAYER 2: MAIN AREA
          // Width-aware, accounts for sidebar, no spill
          // ================================================
          marginLeft: isMobile ? 0 : '260px',
          paddingTop: isMobile ? '60px' : 0,
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease',
          overflowX: 'hidden',
          width: isMobile ? '100%' : 'calc(100% - 260px)',
          boxSizing: 'border-box',
        }}
      >
        {/* ======================================== */}
        {/* 📦 LAYER 3: CONTENT CONTAINER           */}
        {/* Single source of truth for all pages    */}
        {/* No page-level containers needed         */}
        {/* maxWidth keeps content readable on 4K   */}
        {/* padding gives breathing room            */}
        {/* box-sizing includes padding in width    */}
        {/* ======================================== */}
        <div 
          style={{
            padding: isMobile ? '16px' : '24px',
            maxWidth: '1600px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            overflowX: 'hidden',
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
