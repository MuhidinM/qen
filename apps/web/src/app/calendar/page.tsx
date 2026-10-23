import type { Metadata } from 'next';
import { CalendarApp } from '@/components/CalendarApp';
import { readPreferences } from '@/lib/preferences';

export const metadata: Metadata = {
  title: 'Calendar',
  description:
    'Month, year and agenda views of the Ethiopian, Gregorian and Hijri calendars, with Ethiopian public, Orthodox and Islamic holidays.',
};

export default async function CalendarPage() {
  return (
    <>
      <h1>Calendar</h1>
      <p className="lead">
        Any month in the Ethiopian, Gregorian or Hijri calendar, with the other two calendars and
        the holidays in each day.
      </p>
      <CalendarApp preferences={await readPreferences()} />
    </>
  );
}
