// Fails if any exported function, class, interface, type alias or variable lacks an
// @example in its TSDoc (CLAUDE.md: every public function gets one). Reads TypeDoc's JSON.
//
//   node scripts/check-examples.mjs docs-api/api.json
import { readFileSync } from 'node:fs';

const KINDS = { 32: 'variable', 64: 'function', 128: 'class', 256: 'interface', 2097152: 'type' };
const project = JSON.parse(readFileSync(process.argv[2] ?? 'docs-api/api.json', 'utf8'));

const hasExample = (comment) => (comment?.blockTags ?? []).some((t) => t.tag === '@example');

const missing = [];
const visit = (node, path) => {
  for (const child of node.children ?? []) {
    const kind = KINDS[child.kind];
    const name = `${path}${child.name}`;
    if (kind) {
      const comments = [child.comment, ...(child.signatures ?? []).map((s) => s.comment)];
      if (!comments.some(hasExample)) missing.push(`${kind} ${name}`);
    } else {
      visit(child, `${name}.`); // modules (entry points)
    }
  }
};
visit(project, '');

if (missing.length > 0) {
  console.error(`Missing @example on ${missing.length} export(s):\n  ${missing.join('\n  ')}`);
  process.exit(1);
}
console.log('Every export has an @example.');
