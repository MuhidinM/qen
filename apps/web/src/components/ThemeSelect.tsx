'use client';

import { useState } from 'react';
import { COOKIES, savePreference, type Theme } from '@/lib/settings';

/** Light, dark or follow the system; sets `data-theme` on `<html>` (design tokens, ADR-0015). */
export function ThemeSelect({ initial }: { initial: Theme }) {
  const [theme, setTheme] = useState(initial);

  function change(next: Theme) {
    setTheme(next);
    savePreference(COOKIES.theme, next);
    if (next === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', next);
  }

  return (
    <label className="field field--inline">
      <span className="field__label">Theme</span>
      <select value={theme} onChange={(e) => change(e.target.value as Theme)}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
