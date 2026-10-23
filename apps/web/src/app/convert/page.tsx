import type { Metadata } from 'next';
import Link from 'next/link';
import { date, InvalidDateError, type CalendarDate, type CalendarId } from '@qen/core';
import { Converter } from '@/components/Converter';
import { CALENDARS } from '@/lib/locales';
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

/** Reads `?calendar=…&date=YYYY-MM-DD`; a date that doesn't exist says why. */
function fromLink(
  calendar: string | undefined,
  iso: string | undefined,
): { value: CalendarDate | null; error: string | null } {
  if (calendar === undefined && iso === undefined) return { value: null, error: null };
  const match = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(iso ?? '');
  const id = CALENDARS.find((c) => c.id === calendar)?.id;
  if (!match || !id) return { value: null, error: 'This link has no date we can read.' };
  try {
    return { value: date(id, Number(match[1]), Number(match[2]), Number(match[3])), error: null };
  } catch (e) {
    if (e instanceof InvalidDateError) return { value: null, error: e.message };
    throw e;
  }
}

export default async function ConvertPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
  const { value, error } = fromLink(one(params.calendar), one(params.date));
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
