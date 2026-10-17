import { toJDN } from './convert.js';
import { date } from './date.js';
import { InvalidDateError } from './errors.js';
import { fromGeezNumeral } from './geez.js';
import type { Locale } from './locale.js';
import type { CalendarDate, CalendarId, ConvertOptions } from './types.js';

/**
 * Thrown by {@link parse} when the text could be a date in more than one calendar and
 * nothing (an era marker, a month name, or `options.calendar`) says which (N-011).
 *
 * @example
 * ```ts
 * try {
 *   parse('17/01/2019');
 * } catch (e) {
 *   if (e instanceof AmbiguousDateError) console.log(e.candidates); // Gregorian, Ethiopian, Hijri readings
 * }
 * ```
 */
export class AmbiguousDateError extends Error {
  /** Always `'AmbiguousDateError'`. */
  override readonly name = 'AmbiguousDateError';
  /** Every valid reading of the input, one per possible calendar. */
  readonly candidates: readonly CalendarDate[];

  constructor(message: string, candidates: readonly CalendarDate[]) {
    super(message);
    this.candidates = candidates;
  }
}

/**
 * Options for {@link parse}.
 *
 * @example
 * ```ts
 * import { am } from '@qen/core/locales/am';
 * import { en } from '@qen/core/locales/en';
 * const opts: ParseOptions = { locales: [en, am] };
 * ```
 */
export interface ParseOptions extends ConvertOptions {
  /** Read the text as a date in this calendar. */
  readonly calendar?: CalendarId;
  /** Locales whose month names, weekday names and era labels may appear in the text. */
  readonly locales?: readonly Locale[];
}

const CALENDARS: readonly CalendarId[] = ['gregorian', 'ethiopian', 'hijri'];

/** Era markers recognised without any locale. */
const MARKERS: readonly (readonly [string, CalendarId])[] = [
  ['EC', 'ethiopian'],
  ['E.C.', 'ethiopian'],
  ['E.C', 'ethiopian'],
  ['ዓ.ም.', 'ethiopian'],
  ['ዓ.ም', 'ethiopian'],
  ['AD', 'gregorian'],
  ['A.D.', 'gregorian'],
  ['CE', 'gregorian'],
  ['GC', 'gregorian'],
  ['G.C.', 'gregorian'],
  ['AH', 'hijri'],
  ['A.H.', 'hijri'],
  ['هـ', 'hijri'],
];

/** Other spellings of month names, by locale code (CLDR spellings that differ from ours). */
const ALIASES: Readonly<Record<string, readonly (readonly [string, CalendarId, number])[]>> = {
  en: [
    ['Tekemt', 'ethiopian', 2],
    ['Hedar', 'ethiopian', 3],
    ['Ter', 'ethiopian', 5],
    ['Miazia', 'ethiopian', 8],
    ['Genbot', 'ethiopian', 9],
    ['Nehasse', 'ethiopian', 12],
    ['Pagumen', 'ethiopian', 13],
  ],
  am: [['ጳጉሜን', 'ethiopian', 13]],
};

/** Words that may appear but carry no date information. */
const FILLERS = ['ቀን', 'of'];

type Phrase =
  | { readonly text: string; readonly kind: 'marker'; readonly calendar: CalendarId }
  | {
      readonly text: string;
      readonly kind: 'month';
      readonly calendar: CalendarId;
      readonly month: number;
    }
  | { readonly text: string; readonly kind: 'ignore' };

function phrasesFor(locales: readonly Locale[]): Phrase[] {
  const phrases: Phrase[] = MARKERS.map(([text, calendar]) => ({ text, kind: 'marker', calendar }));
  for (const text of FILLERS) phrases.push({ text, kind: 'ignore' });
  for (const l of locales) {
    for (const calendar of CALENDARS) {
      const era = l.eras[calendar];
      phrases.push({ text: era.short, kind: 'marker', calendar });
      phrases.push({ text: era.long, kind: 'marker', calendar });
      for (const names of [l.months[calendar], l.monthsShort[calendar]]) {
        names.forEach((text, i) => phrases.push({ text, kind: 'month', calendar, month: i + 1 }));
      }
    }
    for (const text of [...l.weekdays, ...l.weekdaysShort]) phrases.push({ text, kind: 'ignore' });
    for (const [text, calendar, month] of ALIASES[l.code] ?? []) {
      phrases.push({ text, kind: 'month', calendar, month });
    }
  }
  // Longest first, so "ዓመተ ምሕረት (ኢትዮጵያ)" wins over "ዓመተ ምሕረት" and "Mar" can't eat "March".
  return phrases.sort((a, b) => b.text.length - a.text.length);
}

const isLetter = (c: string | undefined) => c !== undefined && /[\p{L}\p{M}]/u.test(c);

/** Finds `phrase` in `text` as a whole word (not inside another word), case-insensitively. */
function findWord(text: string, phrase: string): number {
  const haystack = text.toLowerCase();
  const needle = phrase.toLowerCase();
  for (let i = haystack.indexOf(needle); i !== -1; i = haystack.indexOf(needle, i + 1)) {
    const before = text.charAt(i - 1);
    const after = text.charAt(i + needle.length);
    const wordStart = !isLetter(phrase.charAt(0)) || !isLetter(before || undefined);
    const wordEnd = !isLetter(phrase.charAt(phrase.length - 1)) || !isLetter(after || undefined);
    if (wordStart && wordEnd) return i;
  }
  return -1;
}

/** Arabic-Indic (U+0660–0669) and Extended Arabic-Indic (U+06F0–06F9) digits to 0–9. */
const latinDigits = (s: string) => s.replace(/[٠-٩۰-۹]/g, (c) => String(c.charCodeAt(0) & 0xf));

/**
 * Reads a date from text and detects its calendar (ADR-0014):
 *
 * 1. `options.calendar`, else an era marker (EC, ዓ.ም., AD, G.C., AH, هـ, or a locale's era
 *    label), else a month name that belongs to only one calendar.
 * 2. With a month name, the other two numbers are the day and the year (the year is the one
 *    above 31). Without one, numbers are day/month/year, or year-month-day when the first
 *    has four digits.
 * 3. If more than one calendar remains, it throws {@link AmbiguousDateError} rather than guess.
 *
 * Ge'ez numerals and Arabic-Indic digits are read as numbers; weekday names and ቀን are
 * ignored. Month names come only from the `locales` you pass.
 *
 * @throws {@link AmbiguousDateError} when the calendar can't be decided.
 * @throws {@link InvalidDateError} when the date doesn't exist.
 * @throws `RangeError` when the text can't be read as a date.
 *
 * @example
 * ```ts
 * import { am } from '@qen/core/locales/am';
 * import { en } from '@qen/core/locales/en';
 * parse('Meskerem 17, 2019', { locales: [en] }); // { calendar: 'ethiopian', year: 2019, month: 1, day: 17 }
 * parse('መስከረም ፲፯ ፳፻፲፱', { locales: [am] });    // same date, Ge'ez numerals
 * parse('17/01/2019 EC');                         // era marker, no locale needed
 * ```
 */
export function parse(input: string, options: ParseOptions = {}): CalendarDate {
  const unreadable = () => new RangeError(`Could not read a date from "${input}"`);
  let text = ` ${latinDigits(input)} `;

  // 1. Pull out known phrases: era markers, month names, words to ignore.
  const markerCalendars = new Set<CalendarId>();
  const monthOptions = new Map<CalendarId, number>();
  let sawMonth = false;
  // Phrases with the same text (a name shared by two calendars) are matched together.
  const groups = new Map<string, Phrase[]>();
  for (const p of phrasesFor(options.locales ?? [])) {
    const key = p.text.toLowerCase();
    if (key.trim() !== '') groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  for (const [key, group] of groups) {
    for (let at = findWord(text, key); at !== -1; at = findWord(text, key)) {
      text = `${text.slice(0, at)} ${text.slice(at + key.length)}`;
      for (const p of group) {
        if (p.kind === 'marker') markerCalendars.add(p.calendar);
        if (p.kind === 'month') {
          sawMonth = true;
          monthOptions.set(p.calendar, p.month);
        }
      }
    }
  }

  // 2. What's left must be numbers (Latin or Ge'ez) and separators.
  const numbers: number[] = [];
  for (const run of text.match(/[0-9]+|[፩-፼]+|\S/gu) ?? []) {
    if (/^[0-9]+$/.test(run)) numbers.push(Number(run));
    else if (/^[፩-፼]+$/u.test(run)) numbers.push(fromGeezNumeral(run));
    else if (isLetter(run)) throw unreadable();
  }

  let year: number;
  let month: number | undefined;
  let day: number;
  if (sawMonth) {
    const [a, b] = numbers;
    if (numbers.length !== 2 || a === undefined || b === undefined) throw unreadable();
    if (a > 31 === b > 31) {
      throw new RangeError(`"${input}": can't tell the day from the year (${a}, ${b})`);
    }
    [day, year] = a > 31 ? [b, a] : [a, b];
  } else {
    const [a, b, c] = numbers;
    if (numbers.length !== 3 || a === undefined || b === undefined || c === undefined) {
      throw unreadable();
    }
    [year, month, day] = String(a).length >= 4 ? [a, b, c] : [c, b, a];
  }

  // 3. Decide the calendar from the signals; never guess.
  let possible = [...CALENDARS];
  const narrow = (allowed: Iterable<CalendarId>, what: string) => {
    const set = new Set(allowed);
    const next = possible.filter((c) => set.has(c));
    if (next.length === 0) {
      throw new RangeError(
        `"${input}": ${what} says ${[...set].join(' or ')}, but other signals say ${possible.join(' or ')}`,
      );
    }
    possible = next;
  };
  if (options.calendar !== undefined) narrow([options.calendar], 'the calendar option');
  if (markerCalendars.size > 0) narrow(markerCalendars, 'the era marker');
  if (sawMonth) narrow(monthOptions.keys(), 'the month name');

  const reading = (calendar: CalendarId): CalendarDate => {
    const d = date(calendar, year, month ?? monthOptions.get(calendar) ?? 0, day);
    toJDN(d, options); // a Hijri 30th must exist under the method
    return d;
  };
  const [only] = possible;
  if (possible.length === 1 && only !== undefined) return reading(only);

  const candidates: CalendarDate[] = [];
  let firstError: unknown;
  for (const c of possible) {
    try {
      candidates.push(reading(c));
    } catch (e) {
      firstError ??= e;
    }
  }
  if (candidates.length === 0) {
    throw firstError instanceof InvalidDateError ? firstError : unreadable();
  }
  throw new AmbiguousDateError(
    `"${input}" could be a ${possible.join(', ')} date; pass options.calendar or add an era marker`,
    candidates,
  );
}
