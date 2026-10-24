/**
 * The site's public address, for canonical links and the sitemap. On Vercel this is the
 * production domain (the custom domain once added, #141); elsewhere, localhost.
 */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';
