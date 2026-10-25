import {
  AmbiguousDateError,
  convert,
  format,
  InvalidDateError,
  parse,
  type CalendarDate,
} from '@qen/core';
import { CALENDARS, LOCALES, hijriSettings, type Settings } from './settings';

/** The id of the tooltip's host element; one tooltip at a time. */
export const TOOLTIP_ID = 'qen-tooltip-host';

export type Readings =
  | { kind: 'date'; rows: { calendar: string; text: string }[] }
  | { kind: 'ambiguous'; candidates: { label: string; gregorian: string }[] }
  | { kind: 'none'; message: string };

/** What the selected text means, read with `parse()` (ADR-0014: ambiguous text is never guessed). */
export function readings(text: string, settings: Settings): Readings {
  const locale = LOCALES[settings.language];
  const hijri = hijriSettings(settings.hijri);
  const numerals = settings.geez ? ({ numerals: 'geez' } as const) : {};
  const show = (d: CalendarDate, pattern: string) =>
    format(d, pattern, { locale, hijri, ...numerals });
  try {
    const value = parse(text.trim(), { locales: Object.values(LOCALES), hijri });
    return {
      kind: 'date',
      rows: CALENDARS.map((c) => ({
        calendar: c.name,
        text: show(convert(value, c.id, { hijri }), 'EEEE, d MMMM y G'),
      })),
    };
  } catch (e) {
    if (e instanceof AmbiguousDateError) {
      return {
        kind: 'ambiguous',
        candidates: e.candidates.map((c) => ({
          label: show(c, 'd MMMM y G'),
          gregorian: show(convert(c, 'gregorian', { hijri }), 'd MMMM y G'),
        })),
      };
    }
    if (e instanceof InvalidDateError) return { kind: 'none', message: e.message };
    return { kind: 'none', message: 'Qen couldn’t read a date in the selected text.' };
  }
}

const CSS = `
:host { all: initial; }
.qen-tooltip {
  position: fixed; z-index: 2147483647; box-sizing: border-box;
  width: max-content; max-width: min(360px, calc(100vw - 16px));
  padding: 12px 16px; border: 1px solid hsl(212 33% 89%); border-radius: 8px;
  background: hsl(0 0% 100%); color: hsl(212 35% 12%);
  box-shadow: 0 5px 15px hsla(0, 0%, 0%, 0.2);
  font: 14px/1.5 system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans', 'Noto Sans Ethiopic', Nyala, 'Noto Sans Arabic', sans-serif;
}
.qen-tooltip:focus { outline: 2px solid hsl(217 85% 53%); outline-offset: 2px; }
.qen-tooltip__head { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-bottom: 4px; }
.qen-tooltip__title { font-weight: 600; font-size: 12px; color: hsl(209 20% 38%); }
.qen-tooltip__close { border: 0; background: none; color: inherit; font: inherit; font-size: 18px; line-height: 1; cursor: pointer; padding: 2px 6px; border-radius: 4px; }
.qen-tooltip__close:focus-visible { outline: 2px solid hsl(217 85% 53%); }
.qen-tooltip__dates { margin: 0; display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; }
.qen-tooltip__dates dt { color: hsl(209 20% 38%); }
.qen-tooltip__dates dd { margin: 0; font-weight: 600; }
.qen-tooltip__note { margin: 0; color: hsl(209 20% 38%); }
.qen-tooltip ul { margin: 4px 0 0; padding-inline-start: 18px; }
@media (prefers-color-scheme: dark) {
  .qen-tooltip { background: hsl(210 30% 20%); color: hsl(210 40% 98%); border-color: hsl(209 25% 29%); }
  .qen-tooltip__title, .qen-tooltip__dates dt, .qen-tooltip__note { color: hsl(210 31% 80%); }
}
`;

/** Constructable stylesheets are CSSOM, so a page's CSP can't block them (unlike <style>). */
function style(shadow: ShadowRoot, doc: Document) {
  const view = doc.defaultView;
  if (view && 'CSSStyleSheet' in view && 'adoptedStyleSheets' in shadow) {
    const sheet = new view.CSSStyleSheet();
    sheet.replaceSync(CSS);
    shadow.adoptedStyleSheets = [sheet];
  } else {
    const el = doc.createElement('style');
    el.textContent = CSS;
    shadow.append(el);
  }
}

function el<K extends keyof HTMLElementTagNameMap>(
  doc: Document,
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = doc.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * Shows the selected text's readings next to the selection, in a shadow root so the page's
 * styles neither leak in nor out. A non-modal dialog: it takes focus, and Escape, its button or
 * a click elsewhere closes it and returns focus.
 */
export function showTooltip(
  doc: Document,
  text: string,
  settings: Settings,
  rect: Pick<DOMRect, 'top' | 'left' | 'bottom' | 'right' | 'width' | 'height'>,
): void {
  doc.getElementById(TOOLTIP_ID)?.remove();
  const previous = doc.activeElement as HTMLElement | null;
  const locale = LOCALES[settings.language];

  const host = el(doc, 'div');
  host.id = TOOLTIP_ID;
  const shadow = host.attachShadow({ mode: 'open' });
  style(shadow, doc);

  const dialog = el(doc, 'div', 'qen-tooltip');
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-label', 'Qen: converted date');
  dialog.tabIndex = -1;

  const head = el(doc, 'div', 'qen-tooltip__head');
  const close = el(doc, 'button', 'qen-tooltip__close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  head.append(el(doc, 'span', 'qen-tooltip__title', 'Qen'), close);
  dialog.append(head);

  const r = readings(text, settings);
  if (r.kind === 'date') {
    const list = el(doc, 'dl', 'qen-tooltip__dates');
    list.lang = locale.code;
    list.dir = locale.direction;
    for (const row of r.rows) {
      const dt = el(doc, 'dt', undefined, row.calendar);
      dt.lang = 'en';
      list.append(dt, el(doc, 'dd', undefined, row.text));
    }
    dialog.append(list);
  } else if (r.kind === 'ambiguous') {
    dialog.append(el(doc, 'p', 'qen-tooltip__note', 'This could be any of:'));
    const list = el(doc, 'ul');
    list.lang = locale.code;
    list.dir = locale.direction;
    for (const c of r.candidates)
      list.append(el(doc, 'li', undefined, `${c.label} (${c.gregorian})`));
    dialog.append(list);
  } else {
    dialog.append(el(doc, 'p', 'qen-tooltip__note', r.message));
  }

  const dismiss = () => {
    host.remove();
    doc.removeEventListener('mousedown', onOutside, true);
    previous?.focus?.();
  };
  const onOutside = (event: MouseEvent) => {
    if (!event.composedPath().includes(host)) dismiss();
  };
  close.addEventListener('click', dismiss);
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      dismiss();
    }
  });
  doc.addEventListener('mousedown', onOutside, true);

  shadow.append(dialog);
  doc.body.append(host);

  // Below the selection, or above it when there is no room; kept inside the viewport.
  const view = doc.defaultView;
  const width = view?.innerWidth ?? 1024;
  const height = view?.innerHeight ?? 768;
  const box = dialog.getBoundingClientRect();
  const below = rect.bottom + 8;
  const top = below + box.height > height ? Math.max(8, rect.top - box.height - 8) : below;
  const left = Math.min(Math.max(8, rect.left), Math.max(8, width - box.width - 8));
  dialog.style.top = `${top}px`;
  dialog.style.left = `${left}px`;
  dialog.focus();
}
