import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/CodeBlock';
import { LiveExample } from '@/components/LiveExample';

/** Components available in every docs page (required by @next/mdx). */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components, pre: CodeBlock, LiveExample };
}
