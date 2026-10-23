'use client';

import { format, today, toEthiopianTime, type CalendarId, type Locale } from '@qen/core';
import { DateText } from '@qen/react';
import { useMinuteClock } from '@/lib/clock';
import { hijriSettings } from '@/lib/hijri';
import { CALENDARS, LOCALES } from '@/lib/locales';
import type { DateLanguage, HijriChoice } from '@/lib/settings';
import { DatePreferences, useDatePreferences } from './DatePreferences';

const DAY_STARTS: Readonly<Record<CalendarId, string>> = {
  gregorian: 'The day starts at midnight.',
  ethiopian: 'The day starts at dawn, 06:00.',
  hijri: 'The day starts at sunset, about 18:00.',
};

export function TodayHero({
  initialLanguage,
  initialGeez,
  hijriChoice,
}: {
  initialLanguage: DateLanguage;
  initialGeez: boolean;
  hijriChoice: HijriChoice;
}) {
  const now = useMinuteClock();
  const hijri = hijriSettings(hijriChoice);
  const preferences = useDatePreferences(initialLanguage, initialGeez);
  const locale = LOCALES[preferences.language];
  const numerals = preferences.geez ? ({ numerals: 'geez' } as const) : {};

  return (
    <div className="today">
      <DatePreferences {...preferences} />

      <div className="date-cards" aria-busy={now === null}>
        {CALENDARS.map((c) => {
          const date = now === null ? null : today(c.id, { now: new Date(now), hijri });
          const headingId = `today-${c.id}`;
          return (
            <section key={c.id} className="date-card" aria-labelledby={headingId}>
              <h2 id={headingId} className="date-card__calendar">
                {c.name}
              </h2>
              {now === null || date === null ? (
                <p className="date-card__placeholder">Loading today…</p>
              ) : (
                // One direction for the whole date block, so Arabic lines up right to left.
                <div className="date-card__value" lang={locale.code} dir={locale.direction}>
                  <p className="date-card__weekday">{format(date, 'EEEE', { locale, hijri })}</p>
                  <p className="date-card__date">
                    <DateText
                      date={date}
                      locale={locale}
                      pattern="d MMMM y G"
                      hijri={hijri}
                      {...numerals}
                    />
                  </p>
                  {c.id === 'ethiopian' && <EthiopianClock now={now} locale={locale} />}
                </div>
              )}
              <p className="date-card__note">{DAY_STARTS[c.id]}</p>
            </section>
          );
        })}
      </div>
    </div>
  );
}

/** Ethiopian time, counted from 06:00 and 18:00 (ADR-0012). Digits stay Latin, as clocks show. */
function EthiopianClock({ now, locale }: { now: number; locale: Locale }) {
  const d = new Date(now);
  const t = toEthiopianTime({ hour: d.getHours(), minute: d.getMinutes() });
  return (
    <p className="date-card__time">
      <span className="visually-hidden" lang="en">
        Ethiopian time:{' '}
      </span>
      {t.hour}:{String(t.minute).padStart(2, '0')} {locale.periods[t.period]}
    </p>
  );
}
