import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { convert, format, type Holiday } from '@qen/core';
import { en } from '@qen/core/locales/en';
import { DateCards } from '@/components/DateCards';
import {
  CATEGORY_TEXT,
  FIRST_YEAR,
  LAST_YEAR,
  PAGE_HIJRI,
  holidayId,
  occurrences,
  pad,
  pageYear,
} from '@/lib/holidays';
import { CALENDARS, LOCALES } from '@/lib/locales';
import { readPreferences } from '@/lib/preferences';

type Params = Promise<{ slug: string; year: string }>;

const hijri = PAGE_HIJRI;
const NAME_LANGUAGES = [
  ['am', 'Amharic'],
  ['om', 'Afaan Oromoo'],
  ['ti', 'Tigrinya'],
  ['ar', 'Arabic'],
  ['en', 'English'],
] as const;
const long = (d: Holiday['gregorian']) => format(d, 'EEEE, d MMMM y', { locale: en });
const iso = (d: Holiday['gregorian']) => `${pad(d.year, 4)}-${pad(d.month, 2)}-${pad(d.day, 2)}`;

/** The holiday and its dates, or a 404 for an unknown id or a year outside N-031's range. */
function load(slug: string, yearSegment: string) {
  const id = holidayId(slug);
  const year = pageYear(yearSegment);
  if (!id || year === null) notFound();
  const dates = occurrences(id, year);
  if (dates.length === 0) notFound();
  return { id, year, dates, name: en.holidays[id] };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug, year: y } = await params;
  const { id, year, dates, name } = load(slug, y);
  const first = dates[0] as Holiday;
  const others = CALENDARS.filter((c) => c.id !== 'gregorian')
    .map((c) =>
      format(convert(first.gregorian, c.id, { hijri }), 'd MMMM y G', { locale: en, hijri }),
    )
    .join(', ');
  return {
    title: `${name} ${year}: ${dates.map((d) => long(d.gregorian)).join(' and ')}`,
    description: `${name} ${year} falls on ${dates.map((d) => long(d.gregorian)).join(' and ')} (${others}), in the Gregorian, Ethiopian and Hijri calendars.`,
    alternates: { canonical: `/holidays/${id}/${year}` },
  };
}

/** How the date is set, from @qen/core's data; no claims beyond what the library models. */
function ruleText(h: Holiday): string {
  const calendar = CALENDARS.find((c) => c.id === h.calendar)?.name ?? h.calendar;
  const own = format(h.date, 'd MMMM y G', { locale: en, hijri });
  return h.rule === 'computed'
    ? `Calculated each year with Bahire Hasab, the Ethiopian Orthodox computus: ${own}.`
    : `Set by the ${calendar} calendar: ${own}.`;
}

export default async function HolidayPage({ params }: { params: Params }) {
  const { slug, year: y } = await params;
  const { id, year, dates, name } = load(slug, y);
  const prefs = await readPreferences();
  const locale = LOCALES[prefs.language];
  const nonce = (await headers()).get('x-nonce') ?? undefined;
  const first = dates[0] as Holiday;

  const event = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${name} ${year}`,
    startDate: iso(first.gregorian),
    endDate: iso(first.gregorian),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: 'Ethiopia' },
  };

  return (
    <article className="holiday">
      <script
        type="application/ld+json"
        nonce={nonce}
        // JSON-LD data block; `<` is escaped so the text can't close the script element.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(event).replace(/</g, '\\u003c') }}
      />
      <p className="holiday__breadcrumb">
        <Link href="/holidays">Holidays</Link> · <Link href={`/holidays/${year}`}>{year}</Link>
      </p>
      <h1>
        {name} {year}
      </h1>
      <p className="lead">
        {dates.length === 1
          ? `In ${year}, ${name} falls on ${long(first.gregorian)}.`
          : `In ${year}, ${name} falls twice: ${dates.map((d) => long(d.gregorian)).join(' and ')}.`}
      </p>

      {dates.map((h, i) => (
        <section
          key={iso(h.gregorian)}
          className="holiday__date"
          aria-label={dates.length > 1 ? `${long(h.gregorian)}` : undefined}
        >
          <DateCards
            date={h.gregorian}
            idPrefix={`date-${i}`}
            locale={locale}
            hijri={hijri}
            geez={prefs.geez}
          />
          <dl className="facts">
            <dt>Kind</dt>
            <dd>{h.categories.map((c) => CATEGORY_TEXT[c]).join(' · ')}</dd>
            <dt>Date rule</dt>
            <dd>{ruleText(h)}</dd>
            {h.status === 'confirmed' && (
              <>
                <dt>Status</dt>
                <dd>Confirmed. Source: {h.source}</dd>
              </>
            )}
            {h.status === 'expected' && (
              <>
                <dt>Status</dt>
                <dd>
                  Expected date, from the Umm al-Qura calendar. The official date follows the
                  moon-sighting announcement in Ethiopia.
                </dd>
              </>
            )}
            {h.approximate && (
              <>
                <dt>Note</dt>
                <dd>A traditional date, not an exact one.</dd>
              </>
            )}
          </dl>
        </section>
      ))}

      <section className="holiday__names" aria-labelledby="names-title">
        <h2 id="names-title">Names</h2>
        <ul>
          {NAME_LANGUAGES.map(([code, language]) => (
            <li key={code}>
              <span className="holiday__language">{language}</span>{' '}
              <span lang={code} dir={LOCALES[code].direction}>
                {LOCALES[code].holidays[id]}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <nav className="holiday__years" aria-label="Other years">
        {year > FIRST_YEAR && (
          <Link href={`/holidays/${id}/${year - 1}`}>
            {name} {year - 1}
          </Link>
        )}
        {year < LAST_YEAR && (
          <Link href={`/holidays/${id}/${year + 1}`}>
            {name} {year + 1}
          </Link>
        )}
        <Link href={`/countdown?holiday=${id}`}>Count down to the next {name}</Link>
      </nav>
    </article>
  );
}
