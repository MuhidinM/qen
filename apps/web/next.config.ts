import type { NextConfig } from 'next';

// R-WEB-08. The Content-Security-Policy is set per request in src/proxy.ts (it carries a nonce);
// these headers are the same for every response.
export const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
];

const config: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  env: {
    // Names this build for the service worker URL (/sw.js?v=…), so each deploy is a new
    // version that waits for the visitor to reload.
    NEXT_PUBLIC_QEN_BUILD: process.env.VERCEL_GIT_COMMIT_SHA ?? String(Date.now()),
  },
  async headers() {
    return [
      { source: '/(.*)', headers: securityHeaders },
      {
        // The worker is never cached by HTTP, so updates are seen, and runs under a strict
        // policy of its own (it is excluded from the page proxy).
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default config;
