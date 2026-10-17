import { toJDN } from './convert.js';
import { toGeezNumeral } from './geez.js';
import type { Locale } from './locale.js';
import type { CalendarDate, ConvertOptions } from './types.js';

/**
 * How numbers are written: `latin` (0–9), `arabic` (Arabic-Indic ٠–٩) or `geez` (Ge'ez
 * numerals, which have no zero and are never padded).
 *
 * @example
 * ```ts
 * const numerals: NumeralSystem = 'geez';
 * ```
 */
export type NumeralSystem = 'latin' | 'arabic' | 'geez';

/**
 * Options for {@link format}.
 *
 * @example
 * ```ts
 * import { am } from '@qen/core/locales/am';
 * const opts: FormatOptions = { locale: am, numerals: 'geez' };
 * ```
 */
export interface FormatOptions extends ConvertOptions {
  /** Needed for name tokens (MMM, MMMM, E…EEEE, G…GGGG). Import it from `@qen/core/locales/*`. */
  readonly locale?: Locale;
  /** How numbers are written; `'latin'` by default. */
  readonly numerals?: NumeralSystem;
}

type Part = { readonly literal: string } | { readonly token: string };

/** Splits an LDML-style pattern into tokens (runs of one ASCII letter) and literal text. */
function tokenize(pattern: string): Part[] {
  const parts: Part[] = [];
  let i = 0;
  while (i < pattern.length) {
    const c = pattern.charAt(i);
    if (c === "'") {
      if (pattern.charAt(i + 1) === "'") {
        parts.push({ literal: "'" });
        i += 2;
        continue;
      }
      let text = '';
      i++;
      for (;;) {
        if (i >= pattern.length) throw new RangeError('Unclosed quote in pattern');
        if (pattern.charAt(i) === "'") {
          if (pattern.charAt(i + 1) === "'") {
            text += "'";
            i += 2;
            continue;
          }
          i++;
          break;
        }
        text += pattern.charAt(i++);
      }
      parts.push({ literal: text });
    } else if (/[A-Za-z]/.test(c)) {
      let j = i;
      while (pattern.charAt(j) === c) j++;
      parts.push({ token: pattern.slice(i, j) });
      i = j;
    } else {
      parts.push({ literal: c });
      i++;
    }
  }
  return parts;
}

const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';

function writeNumber(value: number, width: number, numerals: NumeralSystem): string {
  if (numerals === 'geez') return toGeezNumeral(value);
  const padded = String(value).padStart(width, '0');
  return numerals === 'arabic'
    ? padded.replace(/\d/g, (d) => ARABIC_INDIC.charAt(Number(d)))
    : padded;
}

/**
 * Formats a date with an LDML-style pattern (ADR-0013):
 *
 * | Token | Meaning | Example (Meskerem 17, 2019 EC) |
 * | --- | --- | --- |
 * | `y`, `yy`, `yyyy` | year, last two digits, four digits | 2019, 19, 2019 |
 * | `M`, `MM` | month number | 1, 01 |
 * | `MMM`, `MMMM` | short / long month name | Meskerem |
 * | `d`, `dd` | day | 17 |
 * | `E`…`EEE`, `EEEE` | short / long weekday | Sun, Sunday |
 * | `G`…`GGG`, `GGGG` | short / long era | EC, Ethiopian Calendar |
 * | `'text'` | literal text; `''` is an apostrophe | |
 *
 * Name tokens need a `locale` (import one from `@qen/core/locales/*`). Other characters that
 * aren't ASCII letters are copied as they are.
 *
 * @throws `RangeError` for an unknown token, an unclosed quote, a name token without a
 * locale, or an unknown numeral system.
 * @throws {@link InvalidDateError} if the date does not exist.
 *
 * @example
 * ```ts
 * import { am } from '@qen/core/locales/am';
 * format(date('ethiopian', 2019, 1, 17), 'MMMM d y G', { locale: am });                    // 'መስከረም 17 2019 ዓ.ም.'
 * format(date('ethiopian', 2019, 1, 17), 'MMMM d y', { locale: am, numerals: 'geez' });    // 'መስከረም ፲፯ ፳፻፲፱'
 * format(date('ethiopian', 2019, 1, 17), 'dd/MM/yyyy');                                     // '17/01/2019'
 * ```
 */
export function format(d: CalendarDate, pattern: string, options: FormatOptions = {}): string {
  const { locale, numerals = 'latin' } = options;
  if (!['latin', 'arabic', 'geez'].includes(numerals)) {
    throw new RangeError(`Unknown numerals "${String(numerals)}": expected latin, arabic or geez`);
  }
  const jdn = toJDN(d, options); // validates, including a Hijri 30th under the method
  const names = (token: string): Locale => {
    if (locale === undefined) {
      throw new RangeError(
        `Pattern token "${token}" needs a locale (import one from @qen/core/locales)`,
      );
    }
    return locale;
  };
  const unknown = (token: string) => new RangeError(`Unknown pattern token "${token}"`);

  return tokenize(pattern)
    .map((part) => {
      if ('literal' in part) return part.literal;
      const t = part.token;
      const n = t.length;
      switch (t.charAt(0)) {
        case 'y':
          if (n === 1) return writeNumber(d.year, 0, numerals);
          if (n === 2) return writeNumber(d.year % 100, 2, numerals);
          if (n === 4) return writeNumber(d.year, 4, numerals);
          throw unknown(t);
        case 'M':
          if (n <= 2) return writeNumber(d.month, n, numerals);
          if (n === 3) return names(t).monthsShort[d.calendar][d.month - 1] ?? '';
          if (n === 4) return names(t).months[d.calendar][d.month - 1] ?? '';
          throw unknown(t);
        case 'd':
          if (n <= 2) return writeNumber(d.day, n, numerals);
          throw unknown(t);
        case 'E': {
          if (n > 4) throw unknown(t);
          const weekday = (jdn + 1) % 7; // 0 = Sunday
          const l = names(t);
          return (n === 4 ? l.weekdays : l.weekdaysShort)[weekday] ?? '';
        }
        case 'G': {
          if (n > 4) throw unknown(t);
          const era = names(t).eras[d.calendar];
          return n === 4 ? era.long : era.short;
        }
        default:
          throw unknown(t);
      }
    })
    .join('');
}
