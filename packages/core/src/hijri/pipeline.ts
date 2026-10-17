import { hijri } from '../calendars/hijri.js';
import { hijriTabularFromJDN, hijriTabularToJDN } from '../calendars/hijri-tabular.js';
import { umalquraFromJDN, umalquraToJDN } from '../calendars/hijri-umalqura.js';
import { InvalidDateError } from '../errors.js';
import type { ConvertOptions, HijriMethod } from '../types.js';

type YMD = { year: number; month: number; day: number };

/** Base method implementations (ADR-0006). */
const METHODS: Readonly<
  Record<HijriMethod, { toJDN(y: number, m: number, d: number): number; fromJDN(jdn: number): YMD }>
> = {
  umalqura: { toJDN: umalquraToJDN, fromJDN: umalquraFromJDN },
  tabular: { toJDN: hijriTabularToJDN, fromJDN: hijriTabularFromJDN },
};

const METHOD_LABEL: Readonly<Record<HijriMethod, string>> = {
  umalqura: 'Umm al-Qura method',
  tabular: 'tabular method',
};

/** The resolved Hijri settings: Umm al-Qura and no offset by default (N-008). */
export interface Resolved {
  readonly method: HijriMethod;
  readonly offset: number;
}

export function resolve(options: ConvertOptions): Resolved {
  const method = options.hijri?.method ?? 'umalqura';
  const offset = options.hijri?.offset ?? 0;
  if (!Number.isInteger(offset) || Math.abs(offset) > 2) {
    throw new RangeError(`Hijri offset must be -2, -1, 0, 1 or 2, got ${offset}`);
  }
  return { method, offset };
}

const next = (year: number, month: number): [number, number] =>
  month === 12 ? [year + 1, 1] : [year, month + 1];

/** JDN of the 1st of a Hijri month after every step of the pipeline. */
function monthStart(year: number, month: number, s: Resolved): number {
  return METHODS[s.method].toJDN(year, month, 1) + s.offset;
}

/** Length of a Hijri month after every step of the pipeline. */
export function hijriMonthLength(year: number, month: number, s: Resolved): number {
  const [ny, nm] = next(year, month);
  return monthStart(ny, nm, s) - monthStart(year, month, s);
}

/**
 * JDN of a structurally valid Hijri date (see `date()`).
 *
 * @throws {@link InvalidDateError} for a 30th the month doesn't have.
 */
export function hijriToJDN(year: number, month: number, day: number, s: Resolved): number {
  if (day > hijriMonthLength(year, month, s)) {
    throw new InvalidDateError(
      `${hijri.monthNames[month - 1]} ${day} does not exist in ${year} AH (${METHOD_LABEL[s.method]})`,
      'hijri',
      year,
      month,
      day,
    );
  }
  return monthStart(year, month, s) + day - 1;
}

/** Hijri date of a JDN after every step of the pipeline. */
export function hijriFromJDN(jdn: number, s: Resolved): YMD {
  let { year, month } = METHODS[s.method].fromJDN(jdn - s.offset);
  // The base method's month is a first guess; step until the JDN falls inside the month.
  for (;;) {
    if (jdn < monthStart(year, month, s)) {
      [year, month] = month === 1 ? [year - 1, 12] : [year, month - 1];
    } else if (jdn >= monthStart(...next(year, month), s)) {
      [year, month] = next(year, month);
    } else {
      return { year, month, day: jdn - monthStart(year, month, s) + 1 };
    }
  }
}

/** Which step of the pipeline decided the date of a Hijri month. */
export function decidedBy(s: Resolved): 'method' | 'offset' {
  return s.offset !== 0 ? 'offset' : 'method';
}
