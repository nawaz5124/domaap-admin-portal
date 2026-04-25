// ===================================================================
// 📱 Responsive Sidebar Component with User Profile
// ===================================================================
// Location: src/components/common/Sidebar.js
// Description: Navigation sidebar with mobile slide-in
// Features: User display, logout button, smooth transitions
// Updated: January 2026 - Smoother animations
// ===================================================================

import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar({ activeMenu, isOpen, isMobile, onNavigate, user, onLogout }) {
  const router = useRouter();

  // Menu items - Paths WITHOUT /admin (basePath handles it automatically)
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'donor-bank', label: 'Donor Bank', icon: '👥', path: '/donor-bank' },
    { id: 'donation-book', label: 'Donation Book', icon: '📖', path: '/donation-book' },
    { id: 'donor-profile', label: 'Donor Profile', icon: '👤', path: '/donor-profile' },
    { id: 'reports', label: 'Reports', icon: '📋', path: '/reports' },
    { id: 'email', label: 'Email', icon: '✉️', path: '/email' },
    { id: 'community', label: 'Community', icon: '🐪', path: '/community' },
    { id: 'events', label: 'Events', icon: '🗓️', path: '/events' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
  ];

  // Handle click for mobile close
  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Get user initials for avatar
  const getUserInitial = () => {
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    return '👤';
  };

  // Get display name
  const getDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    return user?.username || 'Admin User';
  };

  // Get role label
  const getRoleLabel = () => {
    if (user?.is_superuser) {
      return 'Super Admin';
    }
    if (user?.is_staff) {
      return 'Admin';
    }
    return 'User';
  };

  // Check if menu item is active (including sub-routes)
  const isActive = (itemId, itemPath) => {
    // Exact match for activeMenu prop
    if (activeMenu === itemId) return true;
    
    // Check current route for sub-pages
    if (itemPath !== '/dashboard' && router.pathname.startsWith(itemPath)) {
      return true;
    }
    
    return false;
  };

  return (
    <aside 
      style={{
        width: '260px',
        height: '100vh',
        backgroundColor: '#1e3a5f',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
        transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: isMobile && isOpen ? '4px 0 15px rgba(0,0,0,0.2)' : 'none'
      }}
    >
      {/* ============================================ */}
      {/* Logo - Clickable to go to Dashboard         */}
      {/* ============================================ */}
      <Link 
        href="/dashboard"
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          paddingBottom: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '20px',
          cursor: 'pointer',
          textDecoration: 'none'
        }}
      >
        <span style={{ fontSize: '28px' }}>🐪</span>
        <div>
          <span style={{ color: '#d4943a', fontWeight: 'bold', fontSize: '22px', display: 'block' }}>DOMAAP</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Admin Portal</span>
        </div>
      </Link>

      {/* ============================================ */}
      {/* Menu Items                                  */}
      {/* ============================================ */}
      <nav style={{ flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const active = isActive(item.id, item.path);
          
          return (
            <Link
              key={item.id}
              href={item.path}
              onClick={handleClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '6px',
                borderRadius: '10px',
                cursor: 'pointer',
                backgroundColor: active ? '#d4943a' : 'transparent',
                color: 'white',
                fontWeight: active ? '600' : '400',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                userSelect: 'none',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{ fontSize: '18px', width: '24px', textAlign: 'center' }}>{item.icon}</span>
              <span>{item.label}</span>
              
              {/* Active indicator dot */}
              {active && (
                <span style={{
                  position: 'absolute',
                  right: '12px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'white'
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ============================================= */}
      {/* User Profile Section at Bottom               */}
      {/* ============================================= */}
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: '12px',
          marginTop: '16px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        {/* User Avatar */}
        <div 
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4943a 0%, #b37a2e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            flexShrink: 0,
            boxShadow: '0 2px 8px rgba(212, 148, 58, 0.3)'
          }}
        >
          {getUserInitial()}
        </div>

        {/* User Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            color: 'white', 
            fontWeight: '600', 
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {getDisplayName()}
          </div>
          <div style={{ 
            color: user?.is_superuser ? '#fbbf24' : 'rgba(255,255,255,0.5)', 
            fontSize: '12px' 
          }}>
            {getRoleLabel()}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer',
            fontSize: '16px',
            background: 'none',
            border: 'none',
            padding: '8px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
          }}
          title="Logout"
          aria-label="Logout"
        >
          🚪
        </button>
      </div>
    </aside>
  );
}