import { defineConfig } from 'vitest/config';

// Unit tests live next to the code; e2e/ holds Playwright tests, run with `test:e2e`.
export default defineConfig({
  test: { include: ['src/**/*.test.{ts,tsx}'] },
});
