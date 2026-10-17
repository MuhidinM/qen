const ONES = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'];
const TENS = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'];
const HUNDRED = '፻';
const TEN_THOUSAND = '፼';

/**
 * Writes a positive integer in Ge'ez (Ethiopic) numerals, following the `ethiopic-numeric`
 * algorithm of W3C CSS Counter Styles Level 3: digits in pairs, with ፻ (100) and ፼ (10,000)
 * as separators. Ge'ez numerals have no zero.
 *
 * @throws `RangeError` for 0, negative numbers, non-integers and numbers above
 * `Number.MAX_SAFE_INTEGER`.
 *
 * @example
 * ```ts
 * toGeezNumeral(2019);   // '፳፻፲፱'
 * toGeezNumeral(10_000); // '፼'
 * ```
 */
export function toGeezNumeral(n: number): string {
  if (!Number.isSafeInteger(n) || n < 1) {
    throw new RangeError(
      n === 0
        ? "Ge'ez numerals have no zero"
        : `Ge'ez numerals need a positive safe integer, got ${n}`,
    );
  }
  if (n === 1) return ONES[1] ?? '';

  const groups: number[] = []; // two-digit groups, least significant first
  for (let rest = n; rest > 0; rest = Math.floor(rest / 100)) groups.push(rest % 100);

  let out = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const value = groups[i] ?? 0;
    const dropDigits = value === 0 || (value === 1 && (i === groups.length - 1 || i % 2 === 1));
    if (!dropDigits) out += (TENS[Math.floor(value / 10)] ?? '') + (ONES[value % 10] ?? '');
    if (i % 2 === 1 && value !== 0) out += HUNDRED;
    if (i % 2 === 0 && i > 0) out += TEN_THOUSAND;
  }
  return out;
}

/**
 * Reads a number written in Ge'ez (Ethiopic) numerals. Surrounding whitespace is ignored.
 *
 * @throws `RangeError` if the text is empty or contains anything other than Ge'ez numerals.
 *
 * @example
 * ```ts
 * fromGeezNumeral('፳፻፲፱'); // 2019
 * ```
 */
export function fromGeezNumeral(text: string): number {
  const s = text.trim();
  if (
    s === '' ||
    ![...s].every(
      (c) => ONES.includes(c) || TENS.includes(c) || c === HUNDRED || c === TEN_THOUSAND,
    )
  ) {
    throw new RangeError(`Not a Ge'ez numeral: "${text}"`);
  }
  let total = 0; // everything already multiplied by ፼
  let hundreds = 0; // the part of the current ፼-chunk that sits before ፻
  let group = 0; // the current two-digit group
  for (const c of s) {
    if (c === HUNDRED) {
      hundreds = (group || 1) * 100;
      group = 0;
    } else if (c === TEN_THOUSAND) {
      const chunk = hundreds + group;
      total = (total + (chunk === 0 && total === 0 ? 1 : chunk)) * 10_000;
      hundreds = 0;
      group = 0;
    } else {
      group += ONES.indexOf(c) > 0 ? ONES.indexOf(c) : TENS.indexOf(c) * 10;
    }
  }
  return total + hundreds + group;
}
