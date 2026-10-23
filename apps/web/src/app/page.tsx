import { cookies } from 'next/headers';
import { TodayHero } from '@/components/TodayHero';
import { COOKIES, parseGeez, parseLanguage } from '@/lib/settings';

const tools = [
  {
    title: 'Converter',
    text: 'Paste or pick a date in any calendar and see it in the other two.',
  },
  {
    title: 'Calendar',
    text: 'Month, year and agenda views with holidays from all three calendars.',
  },
  {
    title: 'Holidays',
    text: 'Ethiopian public, Orthodox and Islamic holidays, year by year.',
  },
  {
    title: 'Docs',
    text: 'Use the same engine in your own app with @qen/core and @qen/react.',
  },
];

export default async function HomePage() {
  const jar = await cookies();
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">Today in three calendars</h1>
        <p className="lead">
          Gregorian, Ethiopian and Hijri dates in one place, each with its own day boundary, in your
          time zone.
        </p>
        <TodayHero
          initialLanguage={parseLanguage(jar.get(COOKIES.language)?.value)}
          initialGeez={parseGeez(jar.get(COOKIES.geez)?.value)}
        />
      </section>

      <section className="tools" aria-labelledby="tools-title">
        <h2 id="tools-title">Coming to Qen</h2>
        <ul className="tools__list">
          {tools.map((t) => (
            <li key={t.title} className="tool">
              <h3 className="tool__title">{t.title}</h3>
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
