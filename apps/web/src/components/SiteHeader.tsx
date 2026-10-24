import Link from 'next/link';
import type { Theme } from '@/lib/settings';
import { ThemeSelect } from './ThemeSelect';

/** Pages that exist; each new page's issue adds its entry. */
const nav = [
  { href: '/convert', label: 'Converter' },
  { href: '/calendar', label: 'Calendar' },
  { href: '/holidays', label: 'Holidays' },
  { href: '/countdown', label: 'Countdown' },
  { href: '/age', label: 'Age' },
];

export function SiteHeader({ theme }: { theme: Theme }) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          <span className="brand__name">Qen</span>
          <span className="brand__native" lang="am">
            ቀን
          </span>
        </Link>
        <nav aria-label="Main" className="site-nav">
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeSelect initial={theme} />
      </div>
    </header>
  );
}
