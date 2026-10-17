import { date } from '@qen/core';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { DateRangePicker } from './DateRangePicker.js';

export const Ethiopian = () => (
  <DateRangePicker
    label="Trip"
    calendar="ethiopian"
    locale={en}
    defaultValue={{ start: date('ethiopian', 2019, 1, 13), end: date('ethiopian', 2019, 1, 17) }}
  />
);
export const HijriArabic = () => (
  <DateRangePicker label="Ramadan" calendar="hijri" locale={ar} numerals="arabic" />
);
