import { date } from '@qen/core';
import { am } from '@qen/core/locales/am';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { YearView } from './YearView.js';

const today = date('ethiopian', 2019, 2, 7);

export const Ethiopian = () => (
  <YearView calendar="ethiopian" locale={en} year={2019} today={today} holidays={['public']} />
);
export const AmharicGeez = () => (
  <YearView calendar="ethiopian" locale={am} numerals="geez" year={2019} today={today} />
);
export const HijriArabic = () => (
  <YearView calendar="hijri" locale={ar} numerals="arabic" year={1448} holidays={['islamic']} />
);
