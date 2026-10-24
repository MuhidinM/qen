import Link from 'next/link';
import type { ReactNode } from 'react';
import { DOCS_PAGES } from '@/lib/docs';

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="docs">
      <nav className="docs__nav" aria-label="Docs">
        <ul>
          {DOCS_PAGES.map((p) => (
            <li key={p.href}>
              <Link href={p.href}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <article className="docs__content prose">{children}</article>
    </div>
  );
}
