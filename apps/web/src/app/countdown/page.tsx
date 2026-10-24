import type { Metadata } from 'next';
import type { HolidayId } from '@qen/core';
import { en } from '@qen/core/locales/en';
import { Countdown } from '@/components/Countdown';
import { fromDateLink, one } from '@/lib/links';
import { readPreferences } from '@/lib/preferences';

export const metadata: Metadata = {
  title: 'Countdown',
  description:
    'Days until any date in the Gregorian, Ethiopian or Hijri calendar, or until the next Ethiopian or Islamic holiday.',
};

/** Every holiday id @qen/core knows (the English locale names them all). */
const HOLIDAY_IDS = Object.keys(en.holidays) as HolidayId[];

export default async function CountdownPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const holidayParam = one(params.holiday);
  const holiday = HOLIDAY_IDS.find((id) => id === holidayParam) ?? null;
  const { value, error } = fromDateLink(one(params.calendar), one(params.date));
  const prefs = await readPreferences();

  return (
    <>
      <h1>Countdown</h1>
      <p className="lead">How many days until a date in any calendar, or until the next holiday.</p>
      {(error || (holidayParam && !holiday)) && (
        <p role="alert" className="notice notice--error">
          {error ?? 'This link names a holiday we don’t know.'}
        </p>
      )}
      <Countdown
        key={`${holidayParam}-${one(params.calendar)}-${one(params.date)}`}
        initialMode={holidayParam !== undefined ? 'holiday' : 'date'}
        initialCalendar={value?.calendar ?? 'ethiopian'}
        initialValue={value}
        initialHoliday={holiday}
        initialLanguage={prefs.language}
        initialGeez={prefs.geez}
        hijriChoice={prefs.hijri}
      />
    </>
  );
}
