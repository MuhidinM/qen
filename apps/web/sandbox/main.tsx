// The docs' live-example runner (#140). It runs in a sandboxed iframe (sandbox="allow-scripts",
// no allow-same-origin), so it has an opaque origin: no cookies, no storage, no access to the
// docs page. It is the only place on the site allowed to evaluate code ('unsafe-eval' in its
// own CSP, next.config.ts); the docs pages keep the strict nonce policy.
//
// Protocol: the page posts { type: 'ping' } (answered with 'ready') and
// { type: 'run', code, theme, globals? }; the sandbox answers
// { type: 'result', ok, error? } and { type: 'height', height }. With `globals`, the library
// exports, locales, overrides and React are in scope without imports (API reference examples).
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { transform } from 'sucrase';
import * as core from '@qen/core';
import * as qenReact from '@qen/react';
import { am } from '@qen/core/locales/am';
import { ar } from '@qen/core/locales/ar';
import { en } from '@qen/core/locales/en';
import { om } from '@qen/core/locales/om';
import { ti } from '@qen/core/locales/ti';
import { ethiopianHijriOverrides } from '@qen/core/overrides/ethiopia';

/** What `import` in an example can reach. */
const MODULES: Record<string, unknown> = {
  react: React,
  '@qen/core': core,
  '@qen/react': qenReact,
  '@qen/core/locales/am': { am },
  '@qen/core/locales/ar': { ar },
  '@qen/core/locales/en': { en },
  '@qen/core/locales/om': { om },
  '@qen/core/locales/ti': { ti },
  '@qen/core/overrides/ethiopia': { ethiopianHijriOverrides },
};

function load(name: string): unknown {
  if (!(name in MODULES))
    throw new Error(`Examples can import ${Object.keys(MODULES).join(', ')}; not ${name}.`);
  return MODULES[name];
}

/** Values the way the docs write them: { calendar: 'ethiopian', year: 2019, … }. */
function inspect(value: unknown): string {
  if (typeof value === 'string') return `'${value}'`;
  if (value === undefined) return 'undefined';
  if (value === null || typeof value !== 'object') return String(value);
  if (Array.isArray(value)) return `[${value.map(inspect).join(', ')}]`;
  const entries = Object.entries(value).map(([k, v]) => `${k}: ${inspect(v)}`);
  return entries.length === 0 ? '{}' : `{ ${entries.join(', ')} }`;
}

const root = createRoot(document.getElementById('root') as HTMLElement);

/** Everything an API-reference example may use without importing it. */
const GLOBALS: Record<string, unknown> = {
  ...core,
  ...qenReact,
  am,
  ar,
  en,
  om,
  ti,
  ethiopianHijriOverrides,
};

function post(message: object) {
  // The parent is the docs page on this site; nothing secret is sent.
  window.parent.postMessage(message, '*');
}

function run(code: string, globals: boolean) {
  const lines: string[] = [];
  let element: React.ReactNode = null;
  let ran = false;
  const paint = () =>
    root.render(
      <>
        {lines.length > 0 && (
          <pre className="output" aria-label="Output">
            {lines.join('\n')}
          </pre>
        )}
        {element}
      </>,
    );
  // show() and console.log() print; lines logged later (from event handlers) repaint.
  const show = (...values: unknown[]) => {
    lines.push(values.map(inspect).join(' '));
    if (ran) paint();
  };
  try {
    const compiled = transform(code, {
      transforms: ['typescript', 'jsx', 'imports'],
      production: true,
    }).code;
    const scope: Record<string, unknown> = {
      ...(globals ? GLOBALS : {}),
      require: load,
      show,
      render: (node: React.ReactNode) => {
        element = node;
      },
      console: { ...console, log: show },
      React,
    };
    // Evaluating the example is this sandbox's whole purpose (see the top of the file).
    new Function(...Object.keys(scope), compiled)(...Object.values(scope));
    ran = true;
    paint();
    post({ type: 'result', ok: true });
  } catch (e) {
    const message = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    root.render(
      <pre className="output output--error" role="alert">
        {message}
      </pre>,
    );
    post({ type: 'result', ok: false, error: message });
  }
}

window.addEventListener('message', (event) => {
  if (event.source !== window.parent) return;
  const data = event.data as { type?: string; code?: string; theme?: string; globals?: boolean };
  // The page asks after hydrating, in case our first 'ready' arrived before it listened.
  if (data.type === 'ping') return post({ type: 'ready' });
  if (data.type !== 'run' || typeof data.code !== 'string') return;
  if (data.theme === 'light' || data.theme === 'dark') {
    document.documentElement.setAttribute('data-theme', data.theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  run(data.code, data.globals === true);
});

new ResizeObserver(() =>
  post({ type: 'height', height: document.documentElement.scrollHeight }),
).observe(document.body);
post({ type: 'ready' });
