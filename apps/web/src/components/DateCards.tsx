import { convert, format, type CalendarDate, type HijriSettings, type Locale } from '@qen/core';
import { DateText } from '@qen/react';
import { CALENDARS } from '@/lib/locales';

/** One day shown in all three calendars, each card a region named by its calendar. */
export function DateCards({
  date,
  idPrefix,
  locale,
  hijri,
  geez,
}: {
  date: CalendarDate;
  /** Keeps heading ids unique when a page shows several sets of cards. */
  idPrefix: string;
  locale: Locale;
  hijri: HijriSettings;
  geez: boolean;
}) {
  return (
    <div className="date-cards">
      {CALENDARS.map((c) => {
        const d = convert(date, c.id, { hijri });
        const headingId = `${idPrefix}-${c.id}`;
        return (
          <section key={c.id} className="date-card" aria-labelledby={headingId}>
            <h3 id={headingId} className="date-card__calendar">
              {c.name}
            </h3>
            {/* One direction for the whole date block, so Arabic lines up right to left. */}
            <div className="date-card__value" lang={locale.code} dir={locale.direction}>
              <p className="date-card__weekday">{format(d, 'EEEE', { locale, hijri })}</p>
              <p className="date-card__date">
                <DateText
                  date={d}
                  locale={locale}
                  pattern="d MMMM y G"
                  hijri={hijri}
                  {...(geez ? { numerals: 'geez' } : {})}
                />
              </p>
            </div>
          </section>
        );
      })}
    </div>
  );
}
