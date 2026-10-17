/**
 * Thrown when a date does not exist, such as Pagume 6 in a non-leap year or 31 April.
 * The offending values are available as fields.
 *
 * @example
 * ```ts
 * try {
 *   date('ethiopian', 2018, 13, 6);
 * } catch (e) {
 *   if (e instanceof InvalidDateError) console.log(e.message); // "Pagume 6 does not exist in 2018 EC"
 * }
 * ```
 */
export class InvalidDateError extends Error {
  /** Always `'InvalidDateError'`. */
  override readonly name = 'InvalidDateError';
  /** The calendar given (a string, since it may not be a known calendar). */
  readonly calendar: string;
  /** The year given. */
  readonly year: number;
  /** The month given. */
  readonly month: number;
  /** The day given. */
  readonly day: number;

  constructor(message: string, calendar: string, year: number, month: number, day: number) {
    super(message);
    this.calendar = calendar;
    this.year = year;
    this.month = month;
    this.day = day;
  }
}
