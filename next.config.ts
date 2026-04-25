import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* =====================================================
   * 🐪 DOMAAP Admin Portal Configuration
   * =====================================================
   * Base Path: /portal (for nginx path-based routing)
   * URL: https://camelfoundation-domaap.ngrok.app/portal/
   * 
   * Clean URL Structure:
   * - Frontend: /portal/*  (login, dashboard, donor-bank)
   * - API:      /api/*     (Django backend - direct calls)
   * ===================================================== */
  
  basePath: '/portal',
  assetPrefix: '/portal',
  
  reactStrictMode: true,
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig;