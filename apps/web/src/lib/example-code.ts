/**
 * Turns a TSDoc `@example` into code the docs sandbox can run and show. Library exports are
 * provided by the sandbox, so examples don't need their imports. Each top-level statement
 * (with its indented continuation lines) is rewritten:
 *
 *   toGeezNumeral(2019); // '፳፻፲፱'        →  show(toGeezNumeral(2019)); // '፳፻፲፱'
 *   date('ethiopian', 2018, 13, 6); // throws …   →  shows the error instead of stopping
 *   <DateText date={d} />                  →  render(<DateText date={d} />);
 *
 * Declarations, imports and blocks run as written.
 */
const NOT_AN_EXPRESSION =
  /^(?:const|let|var|import|export|function|class|type|interface|if|for|while|try|catch|return|show|render)\b|^[}\])/]/;

/** Splits code into top-level statements: a line plus the indented or `.`-led lines after it. */
function statements(code: string): string[] {
  const chunks: string[] = [];
  for (const line of code.split('\n')) {
    const continues = /^\s+\S|^\s*\./.test(line) && chunks.length > 0;
    if (continues) chunks[chunks.length - 1] += `\n${line}`;
    else chunks.push(line);
  }
  return chunks;
}

export function runnableExample(example: string): string {
  return statements(example)
    .map((chunk) => {
      // The statement and its trailing comment, if any.
      const m = /^([\s\S]*?);?(\s*\/\/[^\n]*)?$/.exec(chunk);
      const body = (m?.[1] ?? chunk).trimEnd();
      const comment = m?.[2] ?? '';
      if (body === '' || NOT_AN_EXPRESSION.test(body.trimStart())) return chunk;
      if (body.startsWith('<')) return `render(${body});${comment}`;
      if (/^\s*\/\/\s*throws/.test(comment)) {
        return `try { ${body}; } catch (error) { show(\`throws \${error.name}: \${error.message}\`); }${comment}`;
      }
      return `show(${body});${comment}`;
    })
    .join('\n');
}
