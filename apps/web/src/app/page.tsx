import Link from 'next/link';
import { TodayHero } from '@/components/TodayHero';
import { readPreferences } from '@/lib/preferences';

/** Each page's issue adds its `href` when the page ships. */
const tools: readonly { title: string; text: string; href?: string }[] = [
  {
    title: 'Converter',
    href: '/convert',
    text: 'Paste or pick a date in any calendar and see it in the other two.',
  },
  {
    title: 'Calendar',
    href: '/calendar',
    text: 'Month, year and agenda views with holidays from all three calendars.',
  },
  {
    title: 'Countdown and age',
    text: 'Days until any date or holiday, and your age from a birth date in any calendar.',
    href: '/countdown',
  },
  {
    title: 'Holidays',
    href: '/holidays',
    text: 'Ethiopian public, Orthodox and Islamic holidays, year by year.',
  },
  {
    title: 'Docs',
    href: '/docs',
    text: 'Use the same engine in your own app with @qen/core and @qen/react.',
  },
];

export default async function HomePage() {
  const prefs = await readPreferences();
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Today in three calendars</h1>
        <p className="lead">
          Gregorian, Ethiopian and Hijri dates in one place, each with its own day boundary, in your
          time zone.
        </p>
        <TodayHero
          initialLanguage={prefs.language}
          initialGeez={prefs.geez}
          hijriChoice={prefs.hijri}
        />
      </section>

      <section className="tools" aria-labelledby="tools-title">
        <h2 id="tools-title">What you can do</h2>
        <ul className="tools__list">
          {tools.map((t) => (
            <li key={t.title} className="tool">
              <h3 className="tool__title">
                {t.href ? <Link href={t.href}>{t.title}</Link> : t.title}
                {!t.href && <span className="badge">Coming soon</span>}
              </h3>
              <p className="tool__text">{t.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="developers" aria-labelledby="dev-title">
        <h2 id="dev-title">For developers</h2>
        <p>The same engine runs in browsers, Node, Deno and Bun, with zero dependencies.</p>
        <pre className="code">
          <code>npm install @qen/core @qen/react</code>
        </pre>
      </section>
    </>
  );
}
