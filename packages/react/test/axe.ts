import axe from 'axe-core';
import { expect } from 'vitest';

/** Runs axe-core on a rendered element and fails with readable violations (ADR-0015). */
export async function expectNoAxeViolations(element: Element): Promise<void> {
  const results = await axe.run(element, {
    // jsdom has no layout, so contrast is checked by token tests (#112) instead.
    rules: { 'color-contrast': { enabled: false } },
  });
  const problems = results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`,
  );
  expect(problems).toEqual([]);
}
