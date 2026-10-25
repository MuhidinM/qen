import { useState } from 'react';
import { convert, getHolidaysInRange, type CalendarDate } from '@qen/core';
import { DatePicker, DateText } from '@qen/react';
import { CALENDARS, LOCALES, hijriSettings, type Settings } from '@/lib/settings';

const ALL_LOCALES = Object.values(LOCALES);

/**
 * A date in any calendar, typed, pasted or picked (`parse()` inside `<DatePicker>`, ADR-0014:
 * ambiguous text asks), shown in all three calendars with that day's holidays.
 */
export function ConvertPanel({ settings }: { settings: Settings }) {
  const locale = LOCALES[settings.language];
  const hijri = hijriSettings(settings.hijri);
  const numerals = settings.geez ? ({ numerals: 'geez' } as const) : {};
  const [calendar, setCalendar] = useState(settings.calendar);
  const [value, setValue] = useState<CalendarDate | null>(null);
  const holidays = value ? getHolidaysInRange(value, value, { hijri }) : [];

  return (
    <section aria-labelledby="convert-title">
      <h2 id="convert-title" className="visually-hidden">
        Convert a date
      </h2>
      <fieldset className="segmented">
        <legend className="field__label">Enter the date in</legend>
        {CALENDARS.map((c) => (
          <label key={c.id} className="segmented__option">
            <input
              type="radio"
              name="calendar"
              checked={calendar === c.id}
              onChange={() => {
                setCalendar(c.id);
                if (value) setValue(convert(value, c.id, { hijri }));
              }}
            />
            <span>{c.name}</span>
          </label>
        ))}
      </fieldset>
      <DatePicker
        label="Date"
        calendar={calendar}
        locale={locale}
        locales={ALL_LOCALES}
        value={value}
        onChange={setValue}
        hijri={hijri}
        {...numerals}
      />

      {value && (
        <section aria-labelledby="result-title" className="result">
          <h3 id="result-title" className="popup__heading">
            In all three calendars
          </h3>
          <dl className="date-list">
            {CALENDARS.map((c) => (
              <div key={c.id} className="date-list__row">
                <dt>{c.name}</dt>
                <dd lang={locale.code} dir={locale.direction}>
                  <span className="date-list__date">
                    <DateText
                      date={convert(value, c.id, { hijri })}
                      locale={locale}
                      pattern="EEEE, d MMMM y G"
                      hijri={hijri}
                      {...numerals}
                    />
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          {holidays.length > 0 && (
            <ul className="result__holidays" aria-label="Holidays on this day">
              {holidays.map((h) => (
                <li key={h.id}>
                  <span lang={locale.code} dir={locale.direction}>
                    {locale.holidays[h.id]}
                  </span>
                  {h.status === 'expected' && ' (expected date)'}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </section>
  );
}
