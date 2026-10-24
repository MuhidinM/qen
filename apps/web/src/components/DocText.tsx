import Link from 'next/link';
import type { ReactNode } from 'react';
import { apiHref } from '@/lib/api';

/**
 * TSDoc prose as paragraphs: `code` spans and {@link Name} / {@link Name | label} links to
 * the export's reference entry. Nothing else of Markdown is used in the libraries' comments.
 */
export function DocText({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .filter((p) => p.trim() !== '')
        .map((paragraph, i) => (
          <p key={i}>{inline(paragraph.replace(/\s*\n\s*/g, ' '))}</p>
        ))}
    </>
  );
}

export function inline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /`([^`]+)`|\{@link\s+([\w.]+)(?:\s*\|\s*([^}]+))?\}/g;
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const index = m.index ?? 0;
    if (index > last) parts.push(text.slice(last, index));
    if (m[1] !== undefined) {
      parts.push(<code key={index}>{m[1]}</code>);
    } else {
      const name = m[2] ?? '';
      const href = apiHref(name);
      const label = <code>{m[3]?.trim() ?? name}</code>;
      parts.push(
        href ? (
          <Link key={index} href={href}>
            {label}
          </Link>
        ) : (
          <span key={index}>{label}</span>
        ),
      );
    }
    last = index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}
