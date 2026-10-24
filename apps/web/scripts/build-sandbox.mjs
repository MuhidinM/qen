// Builds the docs' live-example sandbox into public/sandbox/ (generated, not committed):
// index.html as is, sandbox.js bundled with esbuild, sandbox.css from @qen/react's styles.
// Runs before `next build`, `next dev` and the type check.
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const here = new URL('../', import.meta.url);
const out = new URL('public/sandbox/', here);
mkdirSync(out, { recursive: true });

await build({
  entryPoints: [new URL('sandbox/main.tsx', here).pathname.replace(/^\/(\w:)/, '$1')],
  outfile: new URL('sandbox.js', out).pathname.replace(/^\/(\w:)/, '$1'),
  bundle: true,
  minify: true,
  format: 'iife',
  target: 'es2022',
  jsx: 'automatic',
  define: { 'process.env.NODE_ENV': '"production"' },
  logLevel: 'warning',
});

copyFileSync(new URL('sandbox/index.html', here), new URL('index.html', out));

const require = createRequire(import.meta.url);
const tokensAndComponents = readFileSync(require.resolve('@qen/react/styles.css'), 'utf8');
const base = `
*, *::before, *::after { box-sizing: border-box; }
html { background: var(--qen-color-surface); }
body { margin: 0; padding: var(--qen-space-3); color: var(--qen-color-text); font-family: var(--qen-font-family); font-size: var(--qen-font-size-16); line-height: var(--qen-line-height-normal); }
.output { margin: 0 0 var(--qen-space-3); white-space: pre-wrap; overflow-wrap: anywhere; font-size: var(--qen-font-size-14); }
.output--error { color: var(--qen-color-danger-text); }
`;
writeFileSync(new URL('sandbox.css', out), tokensAndComponents + base);
console.log('sandbox built');
