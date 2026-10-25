import type { ComponentProps } from 'react';
import { CopyButton } from './CopyButton';

/**
 * A code block from the docs' Markdown or the API reference, with a copy button. A server
 * component: only the button hydrates, which matters on the API reference with ~100 blocks.
 */
export function CodeBlock(props: ComponentProps<'pre'>) {
  return (
    <div className="code-block">
      {/* A scrollable region keyboard users can focus to scroll long lines: tabindex plus a
          role and name, as axe's scrollable-region-focusable guidance asks. */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
      <pre tabIndex={0} role="region" aria-label="Code" {...props} />
      <CopyButton />
    </div>
  );
}
