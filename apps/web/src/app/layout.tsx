import type { Metadata, Viewport } from 'next';
import { connection } from 'next/server';
import type { ReactNode } from 'react';
import '@qen/react/styles.css';
import './globals.css';

export const metadata: Metadata = {
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
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
