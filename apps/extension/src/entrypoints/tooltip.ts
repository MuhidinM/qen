import { loadSettings } from '@/lib/settings';
import { showTooltip } from '@/lib/tooltip';

/** Selected text past this length isn't a date; it is cut before parsing. */
const MAX_LENGTH = 200;

/** The selection's text and where it is, including text selected inside a form field. */
function selected(): { text: string; rect: DOMRect } | undefined {
  const field = document.activeElement;
  if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
    const text = field.value.slice(field.selectionStart ?? 0, field.selectionEnd ?? 0);
    if (text.trim()) return { text, rect: field.getBoundingClientRect() };
  }
  const selection = window.getSelection();
  const text = selection?.toString() ?? '';
  if (!selection?.rangeCount || !text.trim()) return undefined;
  return { text, rect: selection.getRangeAt(0).getBoundingClientRect() };
}

// Injected into the page on request (context menu or shortcut), never declared as a content script.
export default defineUnlistedScript(async () => {
  const selection = selected();
  if (!selection) return;
  showTooltip(document, selection.text.slice(0, MAX_LENGTH), await loadSettings(), selection.rect);
});
