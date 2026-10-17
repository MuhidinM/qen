import { describe, expect, it } from 'vitest';
import { date, format, InvalidDateError } from '../src/index.js';
import { am } from '../src/locales/am.js';
import { ar } from '../src/locales/ar.js';
import { en } from '../src/locales/en.js';
import { om } from '../src/locales/om.js';

const meskel = date('ethiopian', 2019, 1, 17); // Sunday 27 September 2026
const ramadan1 = date('hijri', 1447, 9, 1); // Wednesday 18 February 2026

describe('format(): numeric tokens (no locale needed)', () => {
  it.each([
    ['d/M/y', '17/1/2019'],
    ['dd/MM/yyyy', '17/01/2019'],
    ['yy', '19'],
    ['yyyy-MM-dd', '2019-01-17'],
  ])('%s → %s', (pattern, expected) => {
    expect(format(meskel, pattern)).toBe(expected);
  });

  it('pads years to four digits with yyyy', () => {
    expect(format(date('gregorian', 33, 4, 3), 'yyyy')).toBe('0033');
    expect(format(date('gregorian', 33, 4, 3), 'y')).toBe('33');
  });
});

describe('format(): names from a locale', () => {
  it('English', () => {
    expect(format(meskel, 'MMMM d, y', { locale: en })).toBe('Meskerem 17, 2019');
    expect(format(meskel, 'EEEE, d MMMM y G', { locale: en })).toBe('Sunday, 17 Meskerem 2019 EC');
    expect(format(meskel, 'EEE d MMM y GGGG', { locale: en })).toBe(
      'Sun 17 Meskerem 2019 Ethiopian Calendar',
    );
    expect(format(date('gregorian', 2026, 10, 17), 'MMM d', { locale: en })).toBe('Oct 17');
    expect(format(ramadan1, 'd MMMM y G', { locale: en })).toBe('1 Ramadan 1447 AH');
  });

  it('Amharic', () => {
    expect(format(meskel, 'EEEE፣ MMMM d ቀን y G', { locale: am })).toBe(
      'እሑድ፣ መስከረም 17 ቀን 2019 ዓ.ም.',
    );
  });

  it('Afaan Oromo', () => {
    expect(format(meskel, 'EEEE, MMMM d, y', { locale: om })).toBe('Dilbata, Fulbaana 17, 2019');
  });

  it('Arabic with Arabic-Indic digits', () => {
    expect(format(ramadan1, 'EEEE d MMMM y G', { locale: ar, numerals: 'arabic' })).toBe(
      'الأربعاء ١ رمضان ١٤٤٧ هـ',
    );
    expect(format(ramadan1, 'dd/MM/yyyy', { numerals: 'arabic' })).toBe('٠١/٠٩/١٤٤٧');
  });

  it('weekday follows the Hijri method', () => {
    // 6 Jumada al-Ula 1448: Saturday (Umm al-Qura), Sunday (tabular)
    const d = date('hijri', 1448, 5, 6);
    expect(format(d, 'EEEE', { locale: en })).toBe('Saturday');
    expect(format(d, 'EEEE', { locale: en, hijri: { method: 'tabular' } })).toBe('Sunday');
  });
});

describe('format(): Ge’ez numerals', () => {
  it('writes each number in Ge’ez, without padding', () => {
    expect(format(meskel, 'MMMM d y G', { locale: am, numerals: 'geez' })).toBe(
      'መስከረም ፲፯ ፳፻፲፱ ዓ.ም.',
    );
    expect(format(meskel, 'dd/MM/yyyy', { numerals: 'geez' })).toBe('፲፯/፩/፳፻፲፱');
  });

  it('rejects yy when the two-digit year is 00 (Ge’ez has no zero)', () => {
    expect(() => format(date('gregorian', 2000, 1, 1), 'yy', { numerals: 'geez' })).toThrow(
      RangeError,
    );
  });
});

describe('format(): literals and errors', () => {
  it("quotes literal text with '…' and writes '' as an apostrophe", () => {
    expect(format(meskel, "'Day' d 'of' M", {})).toBe('Day 17 of 1');
    expect(format(meskel, "d''M")).toBe("17'1");
    expect(format(meskel, "'It''s' y")).toBe("It's 2019");
  });

  it('passes through punctuation and non-Latin text', () => {
    expect(format(meskel, 'd.M.y — ቀን')).toBe('17.1.2019 — ቀን');
  });

  it('throws for unknown tokens and lengths', () => {
    expect(() => format(meskel, 'Q')).toThrow('Unknown pattern token "Q"');
    expect(() => format(meskel, 'MMMMM')).toThrow('Unknown pattern token "MMMMM"');
    expect(() => format(meskel, 'ddd')).toThrow(RangeError);
    for (const t of ['yyy', 'yyyyy', 'EEEEE', 'GGGGG']) {
      expect(() => format(meskel, t, { locale: en }), t).toThrow(`Unknown pattern token "${t}"`);
    }
    expect(() => format(meskel, "'unclosed")).toThrow('Unclosed quote in pattern');
  });

  it('needs a locale for name tokens', () => {
    expect(() => format(meskel, 'MMMM')).toThrow('Pattern token "MMMM" needs a locale');
    expect(() => format(meskel, 'EEE')).toThrow(RangeError);
    expect(() => format(meskel, 'G')).toThrow(RangeError);
  });

  it('validates the date', () => {
    expect(() => format({ calendar: 'ethiopian', year: 2018, month: 13, day: 6 }, 'd')).toThrow(
      InvalidDateError,
    );
  });

  it('rejects an unknown numeral system', () => {
    // @ts-expect-error: not a numeral system
    expect(() => format(meskel, 'd', { numerals: 'roman' })).toThrow('Unknown numerals "roman"');
  });
});
