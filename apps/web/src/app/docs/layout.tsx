import Link from 'next/link';
import type { ReactNode } from 'react';
import { DocsSearch, type SearchEntry } from '@/components/DocsSearch';
import { API, API_PACKAGES } from '@/lib/api';
import { DOCS_PAGES } from '@/lib/docs';

/** The guides, then every export with the first sentence of its summary. */
const SEARCH_INDEX: SearchEntry[] = [
  ...DOCS_PAGES.map((p) => ({ title: p.title, href: p.href, section: 'Guide', text: '' })),
  ...API_PACKAGES.flatMap((pkg) =>
    API[pkg].items.map((item) => ({
      title: item.name,
      href: `/docs/api/${pkg}#${item.name}`,
      section: `${API[pkg].name} ${item.kind}`,
      text: item.summary.split(/(?<=\.)\s/)[0] ?? '',
    })),
  ),
];

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="docs">
      <div className="docs__side">
        <DocsSearch index={SEARCH_INDEX} />
        <nav className="docs__nav" aria-label="Docs">
          <ul>
            {DOCS_PAGES.map((p) => (
              <li key={p.href}>
                <Link href={p.href}>{p.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <article className="docs__content prose">{children}</article>
    </div>
  );
}
