import { describe, expect, it } from 'vitest';
import { gregorianToJDN as g } from '../src/calendars/gregorian.js';
import {
  UMALQURA_FIRST_YEAR,
  UMALQURA_LAST_YEAR,
  UMALQURA_MONTH_LENGTHS,
  UMALQURA_START_JDN,
} from '../src/calendars/umalqura-table.js';

/** JDN of the 1st of a month, decoded straight from the table. */
function monthStart(year: number, month: number): number {
  let jdn = UMALQURA_START_JDN;
  for (let y = UMALQURA_FIRST_YEAR; y <= year; y++) {
    const bits = parseInt(
      UMALQURA_MONTH_LENGTHS.slice(
        (y - UMALQURA_FIRST_YEAR) * 3,
        (y - UMALQURA_FIRST_YEAR) * 3 + 3,
      ),
      16,
    );
    for (let m = 1; m <= 12; m++) {
      if (y === year && m === month) return jdn;
      jdn += bits & (1 << (m - 1)) ? 30 : 29;
    }
  }
  return jdn; // 1 Muharram of year + 1 when month is 13
}

describe('Umm al-Qura table', () => {
  it('covers 1300–1500 AH with 12 month lengths per year', () => {
    expect(UMALQURA_FIRST_YEAR).toBe(1300);
    expect(UMALQURA_LAST_YEAR).toBe(1500);
    expect(UMALQURA_MONTH_LENGTHS).toMatch(/^[0-9a-f]+$/);
    expect(UMALQURA_MONTH_LENGTHS.length).toBe((1500 - 1300 + 1) * 3);
  });

  it('starts 1 Muharram 1300 AH on 12 November 1882', () => {
    expect(UMALQURA_START_JDN).toBe(g(1882, 11, 12));
  });

  it('gives every year 354 or 355 days', () => {
    for (let y = UMALQURA_FIRST_YEAR; y <= UMALQURA_LAST_YEAR; y++) {
      expect([354, 355], `${y} AH`).toContain(monthStart(y, 13) - monthStart(y, 1));
    }
  });

  // R. H. van Gent, "Western-Islamic Calendar Converter based on the Umm al-Qura Calendar",
  // Utrecht University, https://webspace.science.uu.nl/~gent0113/islam/ummalqura_converter.htm
  // (data file addfiles/islamcalendar_dat.js, read 2026-10-17). ICU and van Gent agree on
  // every month start 1420–1449 AH; outside that range they differ by a day in many months
  // (N-027), so samples come from the agreeing range plus the converter's stated endpoints.
  it.each([
    ['1 Muharram 1420', 1420, 1, g(1999, 4, 17)],
    ['1 Ramadan 1435', 1435, 9, g(2014, 6, 28)],
    ['1 Shawwal 1446', 1446, 10, g(2025, 3, 30)],
    ['1 Muharram 1447', 1447, 1, g(2025, 6, 26)],
    ['1 Ramadan 1447', 1447, 9, g(2026, 2, 18)],
    ['1 Shawwal 1447', 1447, 10, g(2026, 3, 20)],
    ['1 Muharram 1448', 1448, 1, g(2026, 6, 16)],
    ['1 Dhu al-Hijjah 1449', 1449, 12, g(2028, 4, 26)],
    ['1 Muharram 1356 (converter start, 14 March 1937)', 1356, 1, g(1937, 3, 14)],
    ['1 Muharram 1501 (day after converter end, 16 November 2077)', 1500, 13, g(2077, 11, 17)],
  ])('matches van Gent: %s', (_, year, month, jdn) => {
    expect(monthStart(year, month)).toBe(jdn);
  });
});
