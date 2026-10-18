import {
  convert,
  format,
  getHolidaysInRange,
  getObservances,
  toJDN,
  type CalendarDate,
  type CalendarId,
  type HijriSettings,
  type HolidayCategory,
  type Locale,
  type NumeralSystem,
} from '@qen/core';
import { CATEGORY_NAMES, CATEGORY_ORDER, isoDate } from './shared.js';

/**
 * UI strings for {@link AgendaView}, English by default.
 *
 * @example
 * ```ts
 * const labels: AgendaViewLabels = { list: 'Holidays' };
 * ```
 */
export interface AgendaViewLabels {
  /** Names the list. */
  readonly list?: string;
  readonly categories?: Readonly<Partial<Record<HolidayCategory, string>>>;
  readonly expected?: string;
  readonly approximate?: string;
  /** The empty state, given the formatted range ends. */
  readonly empty?: (from: string, to: string) => string;
}

/**
 * Props for {@link AgendaView}.
 *
 * @example
 * ```tsx
 * const props: AgendaViewProps = {
 *   calendar: 'ethiopian', locale: en,
 *   start: date('ethiopian', 2019, 3, 1), end: date('ethiopian', 2019, 4, 30),
 * };
 * ```
 */
export interface AgendaViewProps {
  /** The calendar dates are shown in. */
  readonly calendar: CalendarId;
  readonly locale: Locale;
  /** First day of the range (any calendar). */
  readonly start: CalendarDate;
  /** Last day of the range, included (any calendar). */
  readonly end: CalendarDate;
  /** Holiday categories to list; observances are filtered by the same categories. Default `['public']`. */
  readonly holidays?: readonly HolidayCategory[];
  /** Include multi-day observances (fasts, Ramadan). Default true. */
  readonly observances?: boolean;
  readonly numerals?: NumeralSystem;
  readonly hijri?: HijriSettings;
  readonly labels?: AgendaViewLabels;
}

interface Item {
  readonly key: string;
  readonly from: number;
  readonly start: CalendarDate;
  readonly end?: CalendarDate;
  readonly name: string;
  readonly categories: readonly HolidayCategory[];
  readonly notes: readonly string[];
}

/**
 * Holidays and observances in a range as a dated list, with the category and any
 * "expected" or "approximate" status in words. Shows a sentence when nothing falls in the range.
 *
 * @example
 * ```tsx
 * <AgendaView calendar="ethiopian" locale={am} start={from} end={to} holidays={['public', 'orthodox']} />
 * ```
 */
export function AgendaView(props: AgendaViewProps) {
  const { calendar, locale, start, end, holidays = ['public'], numerals, hijri, labels } = props;
  const options = hijri ? { hijri } : {};
  const formatOptions = { ...options, locale, ...(numerals ? { numerals } : {}) };
  const show = (d: CalendarDate, pattern: string) =>
    format(convert(d, calendar, options), pattern, formatOptions);
  const status = (expected: boolean, approximate: boolean) => [
    ...(expected ? [labels?.expected ?? 'expected'] : []),
    ...(approximate ? [labels?.approximate ?? 'approximate'] : []),
  ];

  const observances =
    props.observances === false
      ? []
      : getObservances(start, end, { ...options, categories: holidays }).map((o): Item => ({
          key: o.id,
          from: toJDN(o.startGregorian),
          start: o.start,
          end: o.end,
          name: locale.observances[o.id],
          categories: o.categories,
          notes: status(o.status === 'expected', false),
        }));
  const days = getHolidaysInRange(start, end, { ...options, categories: holidays }).map(
    (h): Item => ({
      key: `${h.id}-${h.gregorian.year}`,
      from: toJDN(h.gregorian),
      start: h.date,
      name: locale.holidays[h.id],
      categories: h.categories,
      notes: status(h.status === 'expected', h.approximate === true),
    }),
  );
  // Observances come first on a shared start day; sort is stable.
  const items = [...observances, ...days].sort((a, b) => a.from - b.from);

  if (items.length === 0) {
    const from = show(start, 'd MMMM y');
    const to = show(end, 'd MMMM y');
    return (
      <p className="qen-agenda__empty" lang={locale.code} dir={locale.direction}>
        {labels?.empty?.(from, to) ?? `No holidays between ${from} and ${to}.`}
      </p>
    );
  }

  return (
    <ul
      className="qen-agenda"
      aria-label={labels?.list ?? 'Holidays and observances'}
      lang={locale.code}
      dir={locale.direction}
    >
      {items.map((item) => {
        const category =
          CATEGORY_ORDER.find((c) => item.categories.includes(c) && holidays.includes(c)) ??
          item.categories[0] ??
          'other';
        return (
          <li key={item.key} className="qen-agenda__item">
            <span className="qen-agenda__when">
              <time dateTime={isoDate(item.start, options)}>
                {show(item.start, 'EEE d MMMM y')}
              </time>
              {item.end && (
                <>
                  {' – '}
                  <time dateTime={isoDate(item.end, options)}>
                    {show(item.end, 'EEE d MMMM y')}
                  </time>
                </>
              )}
            </span>
            <span className="qen-agenda__name">{item.name}</span>
            <span className="qen-agenda__tag" data-category={category}>
              {[labels?.categories?.[category] ?? CATEGORY_NAMES[category], ...item.notes].join(
                ' · ',
              )}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
