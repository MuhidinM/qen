import { useLayoutEffect } from 'react';
import type { GlobalProvider } from '@ladle/react';
import '../src/tokens.css';
import '../src/styles.css';

/** Follows Ladle's light/dark switch through `data-theme`, like an app would. */
export const Provider: GlobalProvider = ({ children, globalState }) => {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (globalState.theme === 'auto') delete root.dataset.theme;
    else root.dataset.theme = globalState.theme;
    document.body.style.background = 'var(--qen-color-background)';
    document.body.style.color = 'var(--qen-color-text)';
    document.body.style.fontFamily = 'var(--qen-font-family)';
  }, [globalState.theme]);
  return children;
};
