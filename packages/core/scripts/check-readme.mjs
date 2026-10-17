// Runs every ```ts block in README.md against the built package. A line ending in
// `// => value` becomes an assertion that the expression equals `value`.
//
//   node scripts/check-readme.mjs        (after `pnpm build`)
import { deepStrictEqual } from 'node:assert';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');
const blocks = [...readme.matchAll(/```ts\n([\s\S]*?)```/g)].map((m) => m[1]);
const dir = new URL('../.readme-check/', import.meta.url);
mkdirSync(dir, { recursive: true });

globalThis.__assertReadme = (actual, expected, line) => {
  try {
    deepStrictEqual(JSON.parse(JSON.stringify(actual)), expected);
  } catch {
    throw new Error(
      `README example is wrong:\n  ${line}\n  actual:   ${JSON.stringify(actual)}\n  expected: ${JSON.stringify(expected)}`,
    );
  }
};

let assertions = 0;
try {
  for (const [i, block] of blocks.entries()) {
    const code = block
      .split('\n')
      .map((line) => {
        const m = line.match(/^(.*?);\s*\/\/ => (.*)$/);
        if (!m) return line;
        if (/^[s.)]]/.test(line)) {
          throw new Error(`README example spans several lines; keep each "// =>" example on one line:
  ${line.trim()}`);
        }
        assertions++;
        return `globalThis.__assertReadme(${m[1]}, ${m[2]}, ${JSON.stringify(line.trim())});`;
      })
      .join('\n');
    // Imports of '@qen/core' resolve to this package's built files (package self-reference).
    const file = new URL(`block-${i + 1}.mjs`, dir);
    writeFileSync(file, code);
    await import(pathToFileURL(file.pathname.replace(/^\/([A-Za-z]:)/, '$1')).href);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log(`README: ${blocks.length} code blocks ran, ${assertions} examples checked.`);
