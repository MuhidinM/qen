'use client';

import { useState } from 'react';
import { COOKIES, DATE_LANGUAGES, savePreference, type DateLanguage } from '@/lib/settings';

/** The visitor's date language and Ge'ez numerals choice, remembered in cookies. */
export function useDatePreferences(initialLanguage: DateLanguage, initialGeez: boolean) {
  const [language, setLanguage] = useState(initialLanguage);
  const [geez, setGeez] = useState(initialGeez);
  return {
    language,
    geez,
    setLanguage(next: DateLanguage) {
      setLanguage(next);
      savePreference(COOKIES.language, next);
    },
    setGeez(next: boolean) {
      setGeez(next);
      savePreference(COOKIES.geez, next ? '1' : '0');
    },
  };
}

export function DatePreferences({
  language,
  geez,
  setLanguage,
  setGeez,
}: ReturnType<typeof useDatePreferences>) {
  return (
    <div className="date-preferences">
      <label className="field">
        <span className="field__label">Show dates in</span>
        <select value={language} onChange={(e) => setLanguage(e.target.value as DateLanguage)}>
          {DATE_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </label>
      <label className="checkbox">
        <input type="checkbox" checked={geez} onChange={(e) => setGeez(e.target.checked)} />
        Ge’ez numerals
      </label>
    </div>
  );
}
