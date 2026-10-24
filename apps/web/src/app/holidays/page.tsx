import type { Metadata } from 'next';
import Link from 'next/link';
import { en } from '@qen/core/locales/en';
import { HOLIDAY_IDS, YEARS } from '@/lib/holidays';

export const metadata: Metadata = {
  title: 'Holidays',
  description:
    'Ethiopian public, Orthodox and Islamic holidays from 2020 to 2040, with their dates in the Gregorian, Ethiopian and Hijri calendars.',
  alternates: { canonical: '/holidays' },
};

export default async function HolidaysPage() {
  // The year whose pages the holiday links open; server time is close enough for a year.
  const thisYear = Math.min(
    Math.max(new Date().getUTCFullYear(), YEARS[0] ?? 0),
    YEARS.at(-1) ?? 0,
  );
  return (
    <>
      <h1>Holidays</h1>
      <p className="lead">
        Ethiopian public, Orthodox and Islamic holidays, with their dates in all three calendars.
      </p>

      <section aria-labelledby="years-title">
        <h2 id="years-title">By year</h2>
        <ul className="year-links">
          {YEARS.map((y) => (
            <li key={y}>
              <Link href={`/holidays/${y}`}>{y}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="list-title">
        <h2 id="list-title">In {thisYear}</h2>
        <ul className="holiday-links">
          {HOLIDAY_IDS.map((id) => (
            <li key={id}>
              <Link href={`/holidays/${id}/${thisYear}`}>{en.holidays[id]}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
