import { describe, expect, it } from 'vitest';
import { convert, date, ethiopianHijriOverrides, getHolidays } from '../src/index.js';

const withOverrides = { hijri: { overrides: ethiopianHijriOverrides } };

describe('ethiopianHijriOverrides (R-HIJ-06)', () => {
  it('has a dated public source for every entry', () => {
    expect(ethiopianHijriOverrides.length).toBeGreaterThanOrEqual(5);
    for (const o of ethiopianHijriOverrides) {
      expect(o.source, `${o.hijriMonth}/${o.hijriYear}`).toMatch(/https:\/\/\S+/);
      expect(o.source).toMatch(/\d{1,2} \w+ 20\d\d/);
    }
  });

  it('is accepted by the pipeline (no impossible month lengths)', () => {
    expect(() => convert(date('gregorian', 2026, 1, 1), 'hijri', withOverrides)).not.toThrow();
  });

  it.each([
    [2024, 'eid-al-fitr', [2024, 4, 10]],
    [2025, 'eid-al-fitr', [2025, 3, 30]],
    [2025, 'eid-al-adha', [2025, 6, 6]],
    [2026, 'eid-al-fitr', [2026, 3, 20]],
    [2026, 'eid-al-adha', [2026, 5, 27]],
  ] as const)('%i %s: confirmed on %j', (year, id, [y, m, d]) => {
    const h = getHolidays(year, withOverrides).find((x) => x.id === id);
    expect(h?.gregorian).toEqual(date('gregorian', y, m, d));
    expect(h?.status).toBe('confirmed');
    expect(h?.source).toMatch(/^(Fana|Ethiopian News Agency)/);
  });

  it('matches Umm al-Qura for every bundled month so far (the default dates do not change)', () => {
    for (const o of ethiopianHijriOverrides) {
      expect(convert(date('hijri', o.hijriYear, o.hijriMonth, 1), 'gregorian')).toEqual(
        date('gregorian', o.startsOn.year, o.startsOn.month, o.startsOn.day),
      );
    }
  });

  it('is frozen', () => {
    expect(Object.isFrozen(ethiopianHijriOverrides)).toBe(true);
    expect(Object.isFrozen(ethiopianHijriOverrides[0])).toBe(true);
  });
});
