'use client';

import { useState } from 'react';
import { addYears, age, diff, today, type CalendarDate, type CalendarId } from '@qen/core';
import { useMinuteClock } from '@/lib/clock';
import { plural, yearsMonthsDays } from '@/lib/count';
import { hijriSettings } from '@/lib/hijri';
import { CALENDARS, LOCALES } from '@/lib/locales';
import type { DateLanguage, HijriChoice } from '@/lib/settings';
import { CalendarDateInput } from './CalendarDateInput';
import { DateCards } from './DateCards';
import { DatePreferences, useDatePreferences } from './DatePreferences';

/**
 * Age and this year's birthday, counted in the birth date's calendar by @qen/core: a birthday
 * that doesn't exist this year (Pagume 6, a Hijri 30th) falls on the month's last day.
 * The birth date never goes into the URL.
 */
export function AgeCalculator({
  initialLanguage,
  initialGeez,
  hijriChoice,
}: {
  initialLanguage: DateLanguage;
  initialGeez: boolean;
  hijriChoice: HijriChoice;
}) {
  const hijri = hijriSettings(hijriChoice);
  const options = { hijri };
  const preferences = useDatePreferences(initialLanguage, initialGeez);
  const locale = LOCALES[preferences.language];
  const now = useMinuteClock();
  const [calendar, setCalendar] = useState<CalendarId>('gregorian');
  const [birth, setBirth] = useState<CalendarDate | null>(null);

  let result: { text: string; birthday: CalendarDate; until: number } | { error: string } | null =
    null;
  if (birth && now !== null) {
    const on = today(birth.calendar, { now: new Date(now), hijri });
    try {
      const birthday = addYears(birth, on.year - birth.year, options);
      result = {
        text: yearsMonthsDays(age(birth, on, options)),
        birthday,
        until: diff(on, birthday, 'days', options),
      };
    } catch (e) {
      if (!(e instanceof RangeError)) throw e;
      result = { error: 'That birth date is after today.' };
    }
  }
  const calendarName = CALENDARS.find((c) => c.id === birth?.calendar)?.name;

  return (
    <div className="age">
      <div className="converter__input">
        <CalendarDateInput
          label="Birth date"
          calendar={calendar}
          setCalendar={setCalendar}
          value={birth}
          onChange={setBirth}
          locale={locale}
          hijri={hijri}
          geez={preferences.geez}
        />
        <DatePreferences {...preferences} />
      </div>

      {result && 'error' in result && (
        <p role="alert" className="notice notice--error converter__result">
          {result.error}
        </p>
      )}
      {result && 'text' in result && (
        <section className="converter__result" aria-labelledby="result-title">
          <h2 id="result-title" className="visually-hidden">
            Result
          </h2>
          <div className="count">
            <p className="count__big">{result.text}</p>
            <p className="count__sub">
              Counted in the {calendarName} calendar, where the birth date is.
            </p>
          </div>

          <section className="birthday" aria-labelledby="birthday-title">
            <h3 id="birthday-title" className="converter__subtitle">
              Birthday this year
            </h3>
            <p className="count__sub">
              {result.until === 0
                ? 'It’s today. Happy birthday!'
                : result.until > 0
                  ? `In ${plural(result.until, 'day')}.`
                  : `${plural(-result.until, 'day')} ago.`}
            </p>
            <DateCards
              date={result.birthday}
              idPrefix="birthday"
              locale={locale}
              hijri={hijri}
              geez={preferences.geez}
            />
          </section>
        </section>
      )}
    </div>
  );
}
