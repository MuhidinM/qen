/** "1 day", "76 days". */
export function plural(n: number, unit: string): string {
  return `${n} ${unit}${n === 1 ? '' : 's'}`;
}

/** "10 weeks and 6 days", "2 weeks", "1 week and 1 day". */
export function weeksAndDays(days: number): string {
  const weeks = Math.floor(days / 7);
  const rest = days % 7;
  return rest === 0 ? plural(weeks, 'week') : `${plural(weeks, 'week')} and ${plural(rest, 'day')}`;
}

/** "14 years, 7 months and 12 days", leaving out zero parts ("3 years and 2 days"). */
export function yearsMonthsDays(age: { years: number; months: number; days: number }): string {
  const parts = (
    [
      [age.years, 'year'],
      [age.months, 'month'],
      [age.days, 'day'],
    ] as const
  )
    .filter(([n]) => n !== 0)
    .map(([n, unit]) => plural(n, unit));
  const last = parts.pop();
  if (last === undefined) return '0 days';
  return parts.length === 0 ? last : `${parts.join(', ')} and ${last}`;
}
