import { describe, expect, it } from 'vitest';
import {
  AmbiguousDateError,
  date,
  format,
  InvalidDateError,
  parse,
  type CalendarDate,
} from '../src/index.js';
import { am } from '../src/locales/am.js';
import { ar } from '../src/locales/ar.js';
import { en } from '../src/locales/en.js';
import { om } from '../src/locales/om.js';
import { ti } from '../src/locales/ti.js';

const locales = [en, am];

describe('parse(): the PLAN.md §3.3 examples', () => {
  it.each([
    ['17/01/2019 EC', date('ethiopian', 2019, 1, 17)],
    ['Meskerem 17, 2019', date('ethiopian', 2019, 1, 17)],
    ['መስከረም 17 2019', date('ethiopian', 2019, 1, 17)],
    ['15 Ramadan 1447', date('hijri', 1447, 9, 15)],
  ])('%s', (input, expected) => {
    expect(parse(input, { locales })).toEqual(expected);
  });
});

describe('parse(): calendar detection', () => {
  it('uses era markers, with or without locales', () => {
    expect(parse('17/01/2019 E.C.')).toEqual(date('ethiopian', 2019, 1, 17));
    expect(parse('17.01.2019 ዓ.ም.')).toEqual(date('ethiopian', 2019, 1, 17));
    expect(parse('2026-10-17 AD')).toEqual(date('gregorian', 2026, 10, 17));
    expect(parse('1/9/1447 AH')).toEqual(date('hijri', 1447, 9, 1));
    expect(parse('1/9/1447 هـ')).toEqual(date('hijri', 1447, 9, 1));
    expect(parse('17/10/2026 G.C.')).toEqual(date('gregorian', 2026, 10, 17));
  });

  it('uses a month name that belongs to one calendar', () => {
    expect(parse('October 17, 2026', { locales })).toEqual(date('gregorian', 2026, 10, 17));
    expect(parse('17 Oct 2026', { locales })).toEqual(date('gregorian', 2026, 10, 17));
    expect(parse('Pagume 6, 2015', { locales })).toEqual(date('ethiopian', 2015, 13, 6));
    expect(parse('1 Dhu al-Hijjah 1446', { locales })).toEqual(date('hijri', 1446, 12, 1));
  });

  it('accepts CLDR spellings of Ethiopian months as aliases', () => {
    expect(parse('Tekemt 7, 2019', { locales: [en] })).toEqual(date('ethiopian', 2019, 2, 7));
    expect(parse('ጳጉሜን 5 2018', { locales: [am] })).toEqual(date('ethiopian', 2018, 13, 5));
  });

  it('lets options.calendar decide', () => {
    expect(parse('17/01/2019', { calendar: 'ethiopian' })).toEqual(date('ethiopian', 2019, 1, 17));
    expect(parse('2019-01-17', { calendar: 'gregorian' })).toEqual(date('gregorian', 2019, 1, 17));
  });

  it('never guesses: ambiguous input throws with candidates (N-011)', () => {
    let error: unknown;
    try {
      parse('17/01/2019');
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(AmbiguousDateError);
    const candidates = (error as AmbiguousDateError).candidates;
    expect(candidates).toContainEqual(date('gregorian', 2019, 1, 17));
    expect(candidates).toContainEqual(date('ethiopian', 2019, 1, 17));
    expect(candidates).toContainEqual(date('hijri', 2019, 1, 17));
  });

  it('throws when the marker and the month name disagree', () => {
    expect(() => parse('17 Ramadan 2019 EC', { locales })).toThrow(
      /month name says hijri, but other signals say ethiopian/,
    );
  });

  it('resolves names shared by two calendars with a marker (Oromo, Tigrinya)', () => {
    // In om, Fulbaana is both September and Meskerem.
    expect(() => parse('Fulbaana 17, 2019', { locales: [om] })).toThrow(AmbiguousDateError);
    expect(parse('Fulbaana 17, 2019 A.L.I.', { locales: [om] })).toEqual(
      date('ethiopian', 2019, 1, 17),
    );
    expect(parse('መስከረም 17 2019 ዓ.ም.', { locales: [ti] })).toEqual(date('ethiopian', 2019, 1, 17));
  });
});

describe('parse(): numerals and extra words', () => {
  it('reads Ge’ez numerals and Arabic-Indic digits', () => {
    expect(parse('መስከረም ፲፯ ፳፻፲፱', { locales })).toEqual(date('ethiopian', 2019, 1, 17));
    expect(parse('١ رمضان ١٤٤٧ هـ', { locales: [ar] })).toEqual(date('hijri', 1447, 9, 1));
  });

  it('ignores weekday names and the filler word ቀን', () => {
    expect(parse('እሑድ፣ መስከረም 17 ቀን 2019 ዓ.ም.', { locales })).toEqual(
      date('ethiopian', 2019, 1, 17),
    );
    expect(parse('Sunday, 17 Meskerem 2019 EC', { locales })).toEqual(
      date('ethiopian', 2019, 1, 17),
    );
  });

  it('round-trips with format() for every locale and many dates', () => {
    const all = [en, am, om, ti, ar];
    const dates: CalendarDate[] = [];
    for (let i = 0; i < 40; i++) {
      dates.push(date('ethiopian', 1990 + i, (i % 13) + 1, (i % 5) + 1));
      dates.push(date('gregorian', 2000 + i, (i % 12) + 1, (i % 28) + 1));
      dates.push(date('hijri', 1420 + i, (i % 12) + 1, (i % 29) + 1));
    }
    for (const locale of all) {
      for (const d of dates) {
        for (const pattern of ['EEEE, d MMMM y G', 'MMMM d, y G', 'dd/MM/yyyy G']) {
          const text = format(d, pattern, { locale });
          expect(parse(text, { locales: [locale] }), `${locale.code}: ${text}`).toEqual(d);
        }
        const geez = format(d, 'd MMMM y G', { locale, numerals: 'geez' });
        expect(parse(geez, { locales: [locale] }), `${locale.code}: ${geez}`).toEqual(d);
      }
    }
  });
});

describe('parse(): errors', () => {
  it('rejects text it cannot read', () => {
    expect(() => parse('')).toThrow(RangeError);
    expect(() => parse('tomorrow')).toThrow('Could not read a date from "tomorrow"');
    expect(() => parse('17 Smarch 2019', { locales })).toThrow(RangeError);
    expect(() => parse('17/01', { calendar: 'gregorian' })).toThrow(RangeError);
    expect(() => parse('1/2/3/4', { calendar: 'gregorian' })).toThrow(RangeError);
  });

  it('rejects two numbers that could both be the day', () => {
    expect(() => parse('Meskerem 17 12', { locales })).toThrow(RangeError);
  });

  it('still refuses to guess when only one calendar can read the numbers', () => {
    // Month 13 exists only in the Ethiopian calendar, but nothing in the text says so.
    let error: unknown;
    try {
      parse('5/13/2018');
    } catch (e) {
      error = e;
    }
    expect(error).toBeInstanceOf(AmbiguousDateError);
    expect((error as AmbiguousDateError).candidates).toEqual([date('ethiopian', 2018, 13, 5)]);
  });

  it('reports an invalid date when no calendar can read it', () => {
    expect(() => parse('30/13/2018')).toThrow(InvalidDateError);
  });

  it('rejects dates that do not exist', () => {
    expect(() => parse('Pagume 6, 2018', { locales })).toThrow(InvalidDateError);
    expect(() => parse('31/04/2026', { calendar: 'gregorian' })).toThrow(InvalidDateError);
  });
});
