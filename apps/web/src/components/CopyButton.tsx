'use client';

import { useState } from 'react';

/** Copies the text of the code block it sits in (CodeBlock.tsx). */
export function CopyButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="code-block__copy"
      onClick={async (event) => {
        const pre = event.currentTarget.parentElement?.querySelector('pre');
        try {
          await navigator.clipboard.writeText(pre?.textContent ?? '');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // Clipboard blocked: the code stays selectable.
        }
      }}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
