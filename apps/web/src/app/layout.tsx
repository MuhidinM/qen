import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import type { ReactNode } from 'react';
import '@qen/react/styles.css';
import './globals.css';
import { SiteFooter } from '@/components/SiteFooter';
import { ServiceWorker } from '@/components/ServiceWorker';
import { SiteHeader } from '@/components/SiteHeader';
import { COOKIES, parseTheme } from '@/lib/settings';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Qen · Gregorian, Ethiopian and Hijri dates', template: '%s · Qen' },
  description:
    'Convert and explore dates in the Gregorian, Ethiopian and Hijri calendars, with holidays and moon-sighting adjustments.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#141e2b' },
  ],
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Render per request so Next.js can put the CSP nonce from src/proxy.ts on its scripts
  // (ADR-0016 amendment, 2026-10-23).
  await connection();
  // The theme comes from a cookie, so the server sends the right colours: no flash, no script.
  const theme = parseTheme((await cookies()).get(COOKIES.theme)?.value);
  return (
    <html lang="en" {...(theme === 'system' ? {} : { 'data-theme': theme })}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader theme={theme} />
        <main id="main">{children}</main>
        <SiteFooter />
        <ServiceWorker />
      </body>
    </html>
  );
}
