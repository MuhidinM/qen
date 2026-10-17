import { describe, expect, it } from 'vitest';
import { fromGeezNumeral, toGeezNumeral } from '../src/index.js';

// Algorithm: W3C CSS Counter Styles Level 3, §7.2 "ethiopic-numeric" (read 2026-10-17):
// groups of two digits; odd-index groups get ፻, even-index groups (except 0) get ፼; a group's
// ፩ is dropped when the group is the most significant one or has an odd index; zero groups
// keep only their ፼. Worked examples marked (W) are from Wikipedia, "Geʽez script", Numerals.
describe('toGeezNumeral()', () => {
  it.each([
    [1, '፩'],
    [9, '፱'],
    [10, '፲'],
    [11, '፲፩'],
    [99, '፺፱'],
    [100, '፻'],
    [101, '፻፩'],
    [110, '፻፲'],
    [200, '፪፻'],
    [475, '፬፻፸፭'], // (W)
    [1000, '፲፻'],
    [1889, '፲፰፻፹፱'], // (W) Menelik II coin
    [2019, '፳፻፲፱'],
    [10_000, '፼'],
    [10_001, '፼፩'],
    [10_100, '፼፻'],
    [20_000, '፪፼'],
    [83_692, '፰፼፴፮፻፺፪'], // (W)
    [99_999, '፱፼፺፱፻፺፱'], // groups 9 | 99 | 99
    [1_000_000, '፻፼'],
    [1_010_000, '፻፩፼'], // even-index group of 1 that isn't the leading one keeps ፩
    [78_010_092, '፸፰፻፩፼፺፪'], // CSS spec input, output derived from the spec text
    [100_000_000, '፼፼'],
  ])('%i → %s', (n, geez) => {
    expect(toGeezNumeral(n)).toBe(geez);
    expect(fromGeezNumeral(geez)).toBe(n);
  });

  it('round-trips every number from 1 to 99,999', () => {
    const bad: number[] = [];
    const seen = new Set<string>();
    for (let n = 1; n <= 99_999; n++) {
      const g = toGeezNumeral(n);
      if (fromGeezNumeral(g) !== n) bad.push(n);
      seen.add(g);
    }
    expect(bad).toEqual([]);
    expect(seen.size).toBe(99_999); // every number has its own spelling
  });

  it('round-trips large numbers up to Number.MAX_SAFE_INTEGER', () => {
    for (const n of [123_456_789, 10_101_010_101, 9_007_199_254_740_991]) {
      expect(fromGeezNumeral(toGeezNumeral(n))).toBe(n);
    }
  });

  it('rejects 0, negatives, non-integers and unsafe integers (N-015)', () => {
    expect(() => toGeezNumeral(0)).toThrow("Ge'ez numerals have no zero");
    expect(() => toGeezNumeral(-5)).toThrow(RangeError);
    expect(() => toGeezNumeral(2.5)).toThrow(RangeError);
    expect(() => toGeezNumeral(Number.NaN)).toThrow(RangeError);
    expect(() => toGeezNumeral(2 ** 53)).toThrow(RangeError);
  });
});

describe('fromGeezNumeral()', () => {
  it('ignores surrounding whitespace', () => {
    expect(fromGeezNumeral(' ፳፻፲፱ ')).toBe(2019);
  });

  it('rejects empty strings and non-numeral characters', () => {
    expect(() => fromGeezNumeral('')).toThrow(RangeError);
    expect(() => fromGeezNumeral('፳፻a')).toThrow('Not a Ge\'ez numeral: "፳፻a"');
    expect(() => fromGeezNumeral('2019')).toThrow(RangeError);
  });
});
