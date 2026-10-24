import type { Metadata } from 'next';
import { AgeCalculator } from '@/components/AgeCalculator';
import { readPreferences } from '@/lib/preferences';

export const metadata: Metadata = {
  title: 'Age calculator',
  description:
    'Your age from a birth date in the Gregorian, Ethiopian or Hijri calendar, and this year’s birthday in all three.',
};

export default async function AgePage() {
  const prefs = await readPreferences();
  return (
    <>
      <h1>Age calculator</h1>
      <p className="lead">
        Your age from a birth date in any calendar, and when this year’s birthday falls in all
        three. Your birth date stays on this page; it isn’t put in the address or sent anywhere.
      </p>
      <AgeCalculator
        initialLanguage={prefs.language}
        initialGeez={prefs.geez}
        hijriChoice={prefs.hijri}
      />
    </>
  );
}
