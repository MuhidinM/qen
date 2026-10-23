import type { MetadataRoute } from 'next';

/** Install metadata (R-WEB-03). Colours are the design tokens' light background and accent. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Qen · Gregorian, Ethiopian and Hijri dates',
    short_name: 'Qen',
    description:
      'Convert and explore dates in the Gregorian, Ethiopian and Hijri calendars, with holidays.',
    id: '/',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1754cf',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Converter', url: '/convert' },
      { name: 'Calendar', url: '/calendar' },
    ],
  };
}
