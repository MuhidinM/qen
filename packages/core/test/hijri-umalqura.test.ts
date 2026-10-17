import { describe, expect, it } from 'vitest';
import { convert, date, explainHijri, fromJDN, InvalidDateError, toJDN } from '../src/index.js';
import { gregorianToJDN as g } from '../src/calendars/gregorian.js';
import { UMALQURA_LAST_YEAR, UMALQURA_START_JDN } from '../src/calendars/umalqura-table.js';

const UQ = { hijri: { method: 'umalqura' } } as const;
const TAB = { hijri: { method: 'tabular' } } as const;
const UNIX_EPOCH_JDN = 2_440_588;
const TABLE_END = toJDN(date('hijri', UMALQURA_LAST_YEAR + 1, 1, 1), TAB); // 1 Muharram 1501

describe('Umm al-Qura is the default Hijri method (N-008)', () => {
  // Intl islamic-umalqura (ICU 77.1); van Gent agrees for 1420–1449 AH (N-027).
  it.each([
    [
      '30 Mar 2025 = 1 Shawwal 1446 (tabular: 30 Ramadan)',
      [2025, 3, 30],
      [1446, 10, 1],
      [1446, 9, 30],
    ],
    [
      '26 Jun 2025 = 1 Muharram 1447 (tabular: 29 Dhu al-Hijjah 1446)',
      [2025, 6, 26],
      [1447, 1, 1],
      [1446, 12, 29],
    ],
    [
      '16 Jun 2026 = 1 Muharram 1448 (tabular: 30 Dhu al-Hijjah 1447)',
      [2026, 6, 16],
      [1448, 1, 1],
      [1447, 12, 30],
    ],
    [
      '17 Oct 2026 = 6 Jumada al-Ula 1448 (tabular: 5th)',
      [2026, 10, 17],
      [1448, 5, 6],
      [1448, 5, 5],
    ],
    ['18 Feb 2026 = 1 Ramadan 1447 (both methods)', [2026, 2, 18], [1447, 9, 1], [1447, 9, 1]],
  ] as const)('%s', (_, [gy, gm, gd], [uy, um, ud], [ty, tm, td]) => {
    const greg = date('gregorian', gy, gm, gd);
    expect(convert(greg, 'hijri')).toEqual(date('hijri', uy, um, ud));
    expect(convert(greg, 'hijri', UQ)).toEqual(date('hijri', uy, um, ud));
    expect(convert(greg, 'hijri', TAB)).toEqual(date('hijri', ty, tm, td));
    expect(convert(date('hijri', uy, um, ud), 'gregorian')).toEqual(greg);
  });
});

describe('Umm al-Qura vs Intl islamic-umalqura', () => {
  it('agrees on every day from 1 Jan 1900 to the end of the table (16 Nov 2077)', () => {
    const f = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    expect(f.resolvedOptions().calendar, 'needs full ICU (N-007)').toBe('islamic-umalqura');
    const mismatches: string[] = [];
    for (let jdn = g(1900, 1, 1); jdn < TABLE_END; jdn++) {
      const parts = f.formatToParts(new Date((jdn - UNIX_EPOCH_JDN) * 86_400_000));
      const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
      const ours = fromJDN(jdn, 'hijri');
      if (ours.year !== get('year') || ours.month !== get('month') || ours.day !== get('day')) {
        mismatches.push(`JDN ${jdn}: ours ${ours.year}-${ours.month}-${ours.day}`);
      }
    }
    expect(mismatches.slice(0, 5)).toEqual([]);
  });
});

describe('Umm al-Qura round trip and range edges', () => {
  it('round-trips every day of the table and continues seamlessly into tabular on both sides', () => {
    let prev = fromJDN(UMALQURA_START_JDN - 400, 'hijri');
    const bad: string[] = [];
    for (let jdn = UMALQURA_START_JDN - 399; jdn < TABLE_END + 400; jdn++) {
      const d = fromJDN(jdn, 'hijri');
      if (toJDN(d) !== jdn) bad.push(`round trip ${jdn}`);
      const nextDay = d.year === prev.year && d.month === prev.month && d.day === prev.day + 1;
      const nextMonth = d.year === prev.year && d.month === prev.month + 1 && d.day === 1;
      const nextYear = d.year === prev.year + 1 && d.month === 1 && d.day === 1;
      if (!nextDay && !nextMonth && !nextYear)
        bad.push(`${JSON.stringify(prev)} → ${JSON.stringify(d)}`);
      prev = d;
    }
    expect(bad.slice(0, 5)).toEqual([]);
  });

  it('rejects a 30th that the Umm al-Qura month does not have (N-025)', () => {
    // Find the first 29-day month of 1447 AH from the table itself.
    const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].find(
      (m) =>
        toJDN(date('hijri', 1447, m, 1)) + 29 ===
        toJDN(date('hijri', m === 12 ? 1448 : 1447, m === 12 ? 1 : m + 1, 1)),
    );
    expect(month).toBeDefined();
    const thirtieth = date('hijri', 1447, month ?? 1, 30);
    expect(() => toJDN(thirtieth)).toThrow(InvalidDateError);
    expect(() => toJDN(thirtieth)).toThrow(/does not exist in 1447 AH \(Umm al-Qura method\)/);
  });
});

describe('explainHijri()', () => {
  it('reports the method that decided the date and whether it fell back to tabular', () => {
    expect(explainHijri(date('gregorian', 2026, 10, 17))).toEqual({
      date: date('hijri', 1448, 5, 6),
      method: 'umalqura',
      fallback: false,
    });
    expect(explainHijri(date('gregorian', 1850, 1, 1))).toMatchObject({
      method: 'tabular',
      fallback: true,
    });
    expect(explainHijri(date('gregorian', 2100, 1, 1))).toMatchObject({
      method: 'tabular',
      fallback: true,
    });
    expect(explainHijri(date('gregorian', 2026, 10, 17), TAB)).toEqual({
      date: date('hijri', 1448, 5, 5),
      method: 'tabular',
      fallback: false,
    });
  });

  it('accepts a Hijri date as input', () => {
    expect(explainHijri(date('hijri', 1250, 1, 1))).toMatchObject({
      method: 'tabular',
      fallback: true,
    });
    expect(explainHijri(date('hijri', 1447, 9, 1)).date).toEqual(date('hijri', 1447, 9, 1));
  });
});
