import { describe, expect, it } from 'vitest';
import { convert, date, getHolidays, getObservances, type HijriOverride } from '../src/index.js';

const startOf = (y: number, m: number) => convert(date('hijri', y, m, 1), 'gregorian');
const confirm = (
  y: number,
  m: number,
  source = 'Ethiopian Islamic Affairs Supreme Council',
): HijriOverride => {
  const g = startOf(y, m);
  return {
    hijriYear: y,
    hijriMonth: m,
    startsOn: { year: g.year, month: g.month, day: g.day },
    source,
  };
};
const islamic = (overrides: HijriOverride[]) =>
  getHolidays(2026, { categories: ['islamic'], hijri: { overrides } });

describe('expected / confirmed status (R-HIJ-05)', () => {
  it('is expected without an override', () => {
    expect(islamic([]).every((h) => h.status === 'expected' && h.source === undefined)).toBe(true);
  });

  it('becomes confirmed, with the source, when an override fixes the holiday’s month', () => {
    const hs = islamic([confirm(1447, 10)]);
    expect(hs.find((h) => h.id === 'eid-al-fitr')).toMatchObject({
      status: 'confirmed',
      source: 'Ethiopian Islamic Affairs Supreme Council',
    });
    expect(hs.find((h) => h.id === 'eid-al-adha')?.status).toBe('expected');
  });

  it('confirms every holiday in an overridden month (Arafah and Eid al-Adha)', () => {
    const hs = islamic([confirm(1447, 12, 'Announcement')]);
    for (const id of ['arafah', 'eid-al-adha'] as const) {
      expect(hs.find((h) => h.id === id)).toMatchObject({
        status: 'confirmed',
        source: 'Announcement',
      });
    }
  });

  it('confirms Ramadan as an observance when Ramadan is overridden', () => {
    const range = [date('gregorian', 2026, 1, 1), date('gregorian', 2026, 12, 31)] as const;
    const plain = getObservances(...range, { categories: ['islamic'] })[0];
    expect(plain?.status).toBe('expected');
    const confirmed = getObservances(...range, {
      categories: ['islamic'],
      hijri: { overrides: [confirm(1447, 9, 'X')] },
    })[0];
    expect(confirmed).toMatchObject({ id: 'ramadan', status: 'confirmed', source: 'X' });
  });

  it('never gives non-Islamic holidays a status', () => {
    const all = getHolidays(2026, {
      categories: ['public', 'orthodox'],
      hijri: { overrides: [confirm(1447, 10)] },
    });
    expect(
      all.filter((h) => !h.categories.includes('islamic')).every((h) => h.status === undefined),
    ).toBe(true);
  });
});
