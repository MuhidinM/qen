import type { HijriSettings } from '@qen/core';
import { ethiopianHijriOverrides } from '@qen/core/overrides/ethiopia';
import type { HijriChoice } from './settings';

/** The `hijri` option for every @qen/core and @qen/react call on the site. */
export function hijriSettings(choice: HijriChoice): HijriSettings {
  if (choice === 'tabular') return { method: 'tabular' };
  if (choice === 'ethiopia') return { overrides: ethiopianHijriOverrides };
  return {};
}
