import type { NextConfig } from "next";

/* =====================================================
 * 🐪 DOMAAP Admin Portal Configuration
 * =====================================================
 * Base Path: /portal (for nginx path-based routing)
 * URL: https://camelfoundation-domaap.ngrok.app/portal/
 * 
 * Clean URL Structure:
 * - Frontend: /portal/*  (login, dashboard, donor-bank)
 * - API:      /api/*     (Django backend - direct calls)
 *
 * E4a HARDENING (2026-05-06):
 * - X-Frame-Options: DENY              → anti-clickjacking
 * - X-Content-Type-Options: nosniff    → anti MIME-sniffing
 * - Referrer-Policy: ...               → limit referrer leakage
 * - Permissions-Policy: ...            → disable unused browser APIs
 *
 * Deferred to post-launch ramp-up:
 * - Strict-Transport-Security (HSTS)   → irreversibility caveat
 * - Content-Security-Policy (CSP)      → needs traffic-monitored tuning
 * ===================================================== */

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()',
  },
];

const nextConfig: NextConfig = {
  basePath: '/portal',
  assetPrefix: '/portal',

  reactStrictMode: true,

  // Disable x-powered-by header for security
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;