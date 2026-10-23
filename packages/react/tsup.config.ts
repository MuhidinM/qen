import { readFileSync, writeFileSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm', 'cjs'],
  // tsup's dts step injects `baseUrl`, which TypeScript 6 flags as deprecated.
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: 'es2022',
  external: ['react', 'react-dom', '@qen/core'],
  onSuccess: async () => {
    // The components use hooks, so React Server Components frameworks (Next.js App Router)
    // must treat the bundle as client code. Added here because tree-shaking drops a `banner`
    // directive; kept on line 1 so the source maps stay aligned.
    for (const file of ['dist/index.js', 'dist/index.cjs']) {
      writeFileSync(file, `'use client';${readFileSync(file, 'utf8')}`);
    }
    // One stylesheet for consumers: the generated tokens, then the component styles.
    const css = [readFileSync('src/tokens.css', 'utf8'), readFileSync('src/styles.css', 'utf8')];
    writeFileSync('dist/styles.css', css.join('\n'));
  },
});
