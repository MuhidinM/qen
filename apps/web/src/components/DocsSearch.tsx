'use client';

import Link from 'next/link';
import { useId, useState } from 'react';

export interface SearchEntry {
  title: string;
  href: string;
  /** Where it comes from, e.g. "Guide" or "@qen/core function". */
  section: string;
  text: string;
}

/** Lowercase, without apostrophes or accents, so "geez" finds "Ge’ez". */
const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f'’]/g, '');

/** Search across the guides and every export; titles that match rank first. */
export function DocsSearch({ index }: { index: readonly SearchEntry[] }) {
  const [query, setQuery] = useState('');
  const inputId = useId();
  const q = normalize(query.trim());
  const results =
    q === ''
      ? []
      : index
          .map((e) => ({
            e,
            rank: normalize(e.title).startsWith(q)
              ? 0
              : normalize(e.title).includes(q)
                ? 1
                : normalize(e.text).includes(q)
                  ? 2
                  : 3,
          }))
          .filter((r) => r.rank < 3)
          .sort((a, b) => a.rank - b.rank || a.e.title.localeCompare(b.e.title))
          .slice(0, 8)
          .map((r) => r.e);

  return (
    <search className="docs-search">
      <label htmlFor={inputId} className="field__label">
        Search the docs
      </label>
      <input
        id={inputId}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
      />
      <p className="visually-hidden" role="status">
        {q === '' ? '' : `${results.length} ${results.length === 1 ? 'result' : 'results'}`}
      </p>
      {results.length > 0 && (
        <ul className="docs-search__results" aria-label="Search results">
          {results.map((r) => (
            <li key={r.href}>
              <Link href={r.href} onClick={() => setQuery('')}>
                <span className="docs-search__title">{r.title}</span>
                <span className="docs-search__section">{r.section}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {q !== '' && results.length === 0 && <p className="docs-search__empty">No matches.</p>}
    </search>
  );
}
