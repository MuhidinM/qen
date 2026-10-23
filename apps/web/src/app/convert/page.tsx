import type { Metadata } from 'next';
import Link from 'next/link';
import type { CalendarId } from '@qen/core';
import { Converter } from '@/components/Converter';
import { fromDateLink, one } from '@/lib/links';
import { readPreferences } from '@/lib/preferences';

export const metadata: Metadata = {
  title: 'Date converter',
  description:
    'Convert any date between the Gregorian, Ethiopian and Hijri calendars. Type or paste a date, or pick one, and share the result.',
};

const examples = [
  { label: 'Ethiopian New Year 2019', calendar: 'ethiopian', date: '2019-01-01' },
  { label: 'Fasika 2026', calendar: 'gregorian', date: '2026-04-12' },
  { label: '1 Ramadan 1447', calendar: 'hijri', date: '1447-09-01' },
] as const;

export default async function ConvertPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const { value, error } = fromDateLink(one(params.calendar), one(params.date));
  const prefs = await readPreferences();
  const initialCalendar: CalendarId = value?.calendar ?? 'gregorian';

  return (
    <>
      <h1>Date converter</h1>
      <p className="lead">
        See any date in the Gregorian, Ethiopian and Hijri calendars, with the holidays that fall on
        it.
      </p>
      {error && (
        <p role="alert" className="notice notice--error">
          {error}
        </p>
      )}
      <Converter
        // A new link starts a fresh converter.
        key={`${one(params.calendar)}-${one(params.date)}`}
        initialCalendar={initialCalendar}
        initialValue={value}
        initialLanguage={prefs.language}
        initialGeez={prefs.geez}
        hijriChoice={prefs.hijri}
      />
      {!value && (
        <section className="examples" aria-labelledby="examples-title">
          <h2 id="examples-title">Try an example</h2>
          <ul>
            {examples.map((e) => (
              <li key={e.label}>
                <Link href={`/convert?calendar=${e.calendar}&date=${e.date}`}>{e.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
