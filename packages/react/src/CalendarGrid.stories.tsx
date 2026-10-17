import { date, dayOfWeek, type CalendarDate } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { useState } from 'react';
import { CalendarGrid } from './CalendarGrid.js';

const today = date('ethiopian', 2019, 2, 7);

export const Ethiopian = () => {
  const [value, setValue] = useState<CalendarDate>(date('ethiopian', 2019, 2, 10));
  return (
    <CalendarGrid
      calendar="ethiopian"
      locale={en}
      value={value}
      onChange={setValue}
      today={today}
    />
  );
};
export const AmharicGeez = () => (
  <CalendarGrid calendar="ethiopian" locale={am} numerals="geez" today={today} />
);
export const Pagume = () => (
  <CalendarGrid calendar="ethiopian" locale={en} defaultMonth={{ year: 2018, month: 13 }} />
);
export const HijriArabic = () => (
  <CalendarGrid
    calendar="hijri"
    locale={ar}
    numerals="arabic"
    defaultMonth={{ year: 1447, month: 9 }}
    defaultValue={date('hijri', 1447, 9, 10)}
  />
);
export const GregorianMondayFirst = () => (
  <CalendarGrid calendar="gregorian" locale={en} weekStartsOn={1} />
);
export const DisabledWeekends = () => (
  <CalendarGrid
    calendar="ethiopian"
    locale={en}
    today={today}
    isDateDisabled={(d) => dayOfWeek(d) === 0 || dayOfWeek(d) === 6}
  />
);
