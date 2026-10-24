import type { MetadataRoute } from 'next';
import { holidaysIn, YEARS } from '@/lib/holidays';
import { SITE_URL } from '@/lib/site';

/** Every page search engines should know about, including each holiday page (R-WEB-05). */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/convert', '/calendar', '/countdown', '/age', '/holidays'];
  for (const year of YEARS) {
    pages.push(`/holidays/${year}`);
    for (const id of new Set(holidaysIn(year).map((h) => h.id)))
      pages.push(`/holidays/${id}/${year}`);
  }
  return pages.map((path) => ({ url: `${SITE_URL}${path === '/' ? '' : path}` }));
}
