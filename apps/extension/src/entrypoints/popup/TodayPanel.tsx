import { format, today, toEthiopianTime } from '@qen/core';
import { DateText } from '@qen/react';
import { useMinuteClock } from '@/lib/clock';
import { CALENDARS, LOCALES, hijriSettings, type Settings } from '@/lib/settings';
import { upcomingHolidays } from '@/lib/upcoming';

const daysAway = (days: number) =>
  days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;

/** Today in three calendars (each with its day boundary, ADR-0012) and the next holidays. */
export function TodayPanel({ settings }: { settings: Settings }) {
  const now = useMinuteClock();
  const locale = LOCALES[settings.language];
  const hijri = hijriSettings(settings.hijri);
  const numerals = settings.geez ? ({ numerals: 'geez' } as const) : {};
  const time = toEthiopianTime({ hour: now.getHours(), minute: now.getMinutes() });
  const upcoming = upcomingHolidays(today('gregorian', { now }), { count: 4, hijri });

  return (
    <>
      <section aria-labelledby="today-title">
        <h2 id="today-title" className="popup__heading">
          Today
        </h2>
        <dl className="date-list">
          {CALENDARS.map((c) => {
            const d = today(c.id, { now, hijri });
            return (
              <div key={c.id} className="date-list__row">
                <dt>{c.name}</dt>
                <dd lang={locale.code} dir={locale.direction}>
                  <span className="date-list__date">
                    <DateText
                      date={d}
                      locale={locale}
                      pattern="EEEE, d MMMM y G"
                      hijri={hijri}
                      {...numerals}
                    />
                  </span>
                  {c.id === 'ethiopian' && (
                    <span className="date-list__time">
                      {time.hour}:{String(time.minute).padStart(2, '0')}{' '}
                      {locale.periods[time.period]}
                      <span className="visually-hidden"> (Ethiopian time)</span>
                    </span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </section>

      <section aria-labelledby="upcoming-title">
        <h2 id="upcoming-title" className="popup__heading">
          Coming up
        </h2>
        <ul className="upcoming">
          {upcoming.map(({ holiday, days }) => (
            <li key={`${holiday.id}-${holiday.gregorian.month}-${holiday.gregorian.day}`}>
              <span className="upcoming__name" lang={locale.code} dir={locale.direction}>
                {locale.holidays[holiday.id]}
              </span>
              <span className="upcoming__when">
                {format(holiday.gregorian, 'd MMM', { locale: LOCALES.en })} · {daysAway(days)}
                {holiday.status === 'expected' && ' · expected'}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
