import type { HijriOverride } from '../types.js';

const freeze = (o: HijriOverride): HijriOverride =>
  Object.freeze({ ...o, startsOn: Object.freeze({ ...o.startsOn }) });

/**
 * Hijri month starts as observed in Ethiopia, from dated public reports of the Eid
 * celebrations led by the Ethiopian Islamic Affairs Supreme Council (N-017). Eid al-Fitr
 * fixes the start of Shawwal; Eid al-Adha (10 Dhu al-Hijjah) fixes the start of Dhu
 * al-Hijjah nine days earlier. Opt in to mark these holidays `confirmed`:
 *
 * The sources are news reports of each celebration, not the Council's own announcement
 * texts, which were not found online. So far every month matches Umm al-Qura. New entries are
 * added as each Eid is announced (and later served from the hosted feed, M9).
 *
 * @example
 * ```ts
 * import { ethiopianHijriOverrides } from '@qen/core/overrides/ethiopia';
 * getHolidays(2026, { hijri: { overrides: ethiopianHijriOverrides } })
 *   .find((h) => h.id === 'eid-al-fitr')?.status; // 'confirmed'
 * ```
 */
export const ethiopianHijriOverrides: readonly HijriOverride[] = Object.freeze(
  [
    {
      hijriYear: 1445,
      hijriMonth: 10,
      startsOn: { year: 2024, month: 4, day: 10 },
      source:
        'Fana Broadcasting Corporate, 10 April 2024: "Ethiopian Muslims celebrated the 1445th Eid al-Fitr" (Wednesday 10 April), https://www.fanamc.com/english/?p=59147',
    },
    {
      hijriYear: 1446,
      hijriMonth: 10,
      startsOn: { year: 2025, month: 3, day: 30 },
      source:
        'Ethiopian News Agency via AllAfrica, 30 March 2025: Ethiopian Muslims celebrated the 1446th Eid al-Fitr, https://fr.allafrica.com/stories/202503300021.html',
    },
    {
      hijriYear: 1446,
      hijriMonth: 12,
      startsOn: { year: 2025, month: 5, day: 28 },
      source:
        'Ethiopian News Agency via AllAfrica, 6 June 2025: Ethiopian Muslims celebrate the 1446th Eid al-Adha (10 Dhu al-Hijjah = 6 June), https://fr.allafrica.com/stories/202506060331.html',
    },
    {
      hijriYear: 1447,
      hijriMonth: 10,
      startsOn: { year: 2026, month: 3, day: 20 },
      source:
        'Ethiopian News Agency via AllAfrica, 20 March 2026: "Ethiopian Muslims Celebrate 1447th Eid Al-Fitr", https://allafrica.com/stories/202603200042.html',
    },
    {
      hijriYear: 1447,
      hijriMonth: 12,
      startsOn: { year: 2026, month: 5, day: 18 },
      source:
        'Ethiopian News Agency via AllAfrica, 27 May 2026: Ethiopian Muslims celebrate the 1447th Eid al-Adha (10 Dhu al-Hijjah = 27 May), https://fr.allafrica.com/stories/202605270432.html',
    },
  ].map(freeze),
);
