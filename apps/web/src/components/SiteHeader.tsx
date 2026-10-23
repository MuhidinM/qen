import Link from 'next/link';
import type { Theme } from '@/lib/settings';
import { ThemeSelect } from './ThemeSelect';

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
        <ThemeSelect initial={theme} />
      </div>
    </header>
  );
}
