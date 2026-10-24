'use client';

import { useRef, useState, type ComponentProps } from 'react';

/** A code block from the docs' Markdown, with a copy button. */
export function CodeBlock(props: ComponentProps<'pre'>) {
  const pre = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  return (
    <div className="code-block">
      {/* A scrollable region keyboard users can focus to scroll long lines: tabindex plus a
          role and name, as axe's scrollable-region-focusable guidance asks. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <pre ref={pre} tabIndex={0} role="region" aria-label="Code" {...props} />
      <button
        type="button"
        className="code-block__copy"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(pre.current?.textContent ?? '');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            // Clipboard blocked: the code stays selectable.
          }
        }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
