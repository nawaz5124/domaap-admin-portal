// ===================================================================
// 🔐 Login Page - Admin Portal (DOMAAP)
// ===================================================================
// Location: src/pages/login/index.js
// 
// UPDATED 2026-01-31:
// - Calls /api/auth/clear-cookies/ BEFORE login
// - This clears HttpOnly cookies that JavaScript cannot clear
// - Ensures fresh login without stale token interference
// - Mobile responsive design
// ===================================================================



import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import logger from '@/utils/logger';

// API Base URL - sourced from env, falls back to local dev backend.
// Set NEXT_PUBLIC_API_BASE_URL in .env.local (dev) and Vercel (prod).
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export default function Login() {
  const router = useRouter();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Clear cookies on page load via backend
    clearCookiesOnLoad();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Clear HttpOnly cookies via backend endpoint
   * JavaScript cannot clear HttpOnly cookies, but server can!
   */
  const clearCookiesOnLoad = async () => {
    try {
      logger.debug('🧹 [LOGIN] Clearing stale cookies via backend...');
      await fetch(`${API_BASE_URL}/auth/clear-cookies/`, {
        method: 'POST',
        credentials: 'include',
      });
      logger.debug('✅ [LOGIN] Cookies cleared successfully');
    } catch (err) {
      // Non-critical - just log and continue
      logger.warn('⚠️ [LOGIN] Could not clear cookies:', err.message);
    }
    
    // Also clear localStorage
    localStorage.removeItem('user');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!identifier.trim()) {
      setError('Please enter your username or email');
      setIsLoading(false);
      return;
    }
    if (!password) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    try {
      // ✅ Clear cookies AGAIN before login (belt and suspenders)
      await fetch(`${API_BASE_URL}/auth/clear-cookies/`, {
        method: 'POST',
        credentials: 'include',
      });
      
      const isEmail = identifier.includes('@');
      
      const body = {
        password,
        ...(isEmail ? { email: identifier.trim() } : { username: identifier.trim() })
      };

      logger.debug('🔐 [LOGIN] Attempting admin login...', { 
        isEmail, 
        identifier: identifier.substring(0, 3) + '***' 
      });

      const response = await fetch(`${API_BASE_URL}/auth/admin-login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      logger.debug('📡 [LOGIN] Response status:', response.status);

      // Handle non-JSON responses
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        logger.error('❌ [LOGIN] Failed to parse response:', jsonError.message);
        setError('Server error. Please try again.');
        setIsLoading(false);
        return;
      }

      if (response.ok && data.success) {
        logger.debug('✅ [LOGIN] Login successful', { 
          username: data.user?.username, 
          role: data.user?.role 
        });
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        logger.debug('❌ [LOGIN] Login failed:', data.error || data.detail || 'Unknown error');
        setError(data.error || data.detail || 'Login failed. Please try again.');
      }
    } catch (err) {
      logger.error('❌ [LOGIN] Network error:', err.message);
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // MOBILE LAYOUT
  // ============================================
  if (isMobile) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        width: '100%',
        backgroundColor: '#1e3a5f',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '24px' }}>🐪</span>
            <span style={{ color: '#1e3a5f', fontWeight: 'bold', fontSize: '14px' }}>
              CAMEL FOUNDATION
            </span>
          </div>
        </div>

        {/* Branding */}
        <div style={{ 
          textAlign: 'center', 
          padding: '16px 24px',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
            Donor Management Application
          </h1>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#d4943a', margin: 0 }}>
            DOMAAP
          </h2>
        </div>

        {/* Login Form */}
        <div style={{
          flex: 1,
          backgroundColor: '#f3f4f6',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '32px 24px',
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '4px' }}>
                Welcome Back
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                Sign in to access the admin portal
              </p>
            </div>

            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>⚠️</span>
                <span style={{ color: '#dc2626', fontSize: '14px' }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Username or Email
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your username or email"
                  disabled={isLoading}
                  autoComplete="username"
                  autoCapitalize="none"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: isLoading ? '#f9fafb' : 'white'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  autoComplete="current-password"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: isLoading ? '#f9fafb' : 'white'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', fontSize: '14px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading}
                    style={{ width: '16px', height: '16px', marginRight: '8px' }}
                  />
                  <span style={{ color: '#4b5563' }}>Remember me</span>
                </label>
                <a href="#" style={{ color: '#1e3a5f', textDecoration: 'none', fontWeight: '500' }}>
                  Forgot?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  backgroundColor: isLoading ? '#9ca3af' : '#1e3a5f',
                  color: 'white',
                  padding: '14px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {isLoading ? (
                  <>
                    <span style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }} />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
              Need help? Contact{' '}
              <a href="mailto:support@camelfoundation.org.uk" style={{ color: '#1e3a5f', textDecoration: 'none' }}>
                support@camelfoundation.org.uk
              </a>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#9ca3af' }}>
            UK Registered Charity #1180968
          </div>
        </div>

        <style jsx global>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // ============================================
  // DESKTOP LAYOUT
  // ============================================
  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      {/* LEFT PANEL - Dark Blue with Branding */}
      <div 
        style={{
          width: '50%',
          minHeight: '100vh',
          backgroundColor: '#1e3a5f',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '48px 24px',
          color: 'white'
        }}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px 32px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span style={{ fontSize: '28px' }}>🐪</span>
          <span style={{ color: '#1e3a5f', fontWeight: 'bold', fontSize: '18px', letterSpacing: '0.5px' }}>
            CAMEL FOUNDATION
          </span>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>
            Donor Management Application
          </h1>
          <h2 style={{ fontSize: '64px', fontWeight: 'bold', color: '#d4943a', margin: 0 }}>
            DOMAAP
          </h2>
        </div>

        <div style={{ fontSize: '14px', color: '#9ca3af' }}>
          UK Registered Charity #1180968
        </div>
      </div>

      {/* RIGHT PANEL - Login Form */}
      <div 
        style={{
          width: '50%',
          minHeight: '100vh',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px'
        }}
      >
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            padding: '48px',
            width: '100%',
            maxWidth: '420px',
            border: '1px solid #e5e7eb'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px' }}>
              Welcome Back
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Sign in to access the admin portal
            </p>
          </div>

          {error && (
            <div 
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>⚠️</span>
              <span style={{ color: '#dc2626', fontSize: '14px' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Username or Email
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin@camelfoundation.org.uk"
                disabled={isLoading}
                autoComplete="username"
                autoCapitalize="none"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: isLoading ? '#f9fafb' : 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="············"
                disabled={isLoading}
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: isLoading ? '#f9fafb' : 'white'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', fontSize: '14px' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  style={{ width: '16px', height: '16px', marginRight: '8px', cursor: 'pointer' }}
                />
                <span style={{ color: '#4b5563' }}>Remember me</span>
              </label>
              <a href="#" style={{ color: '#1e3a5f', textDecoration: 'none', fontWeight: '500' }}>
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: isLoading ? '#9ca3af' : '#1e3a5f',
                color: 'white',
                padding: '14px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? (
                <>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>
            Need help? Contact{' '}
            <a href="mailto:support@camelfoundation.org.uk" style={{ color: '#4b5563', textDecoration: 'none' }}>
              support@camelfoundation.org.uk
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}