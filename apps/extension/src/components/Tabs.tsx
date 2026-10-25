import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';

/**
 * WAI-ARIA tabs: one tab stop, arrows (and Home/End) move between tabs and select them,
 * each panel labelled by its tab.
 */
export function Tabs<T extends string>({
  label,
  tabs,
  selected,
  onSelect,
  children,
}: {
  label: string;
  tabs: readonly { id: T; label: string }[];
  selected: T;
  onSelect: (id: T) => void;
  children: ReactNode;
}) {
  const base = useId();
  const list = useRef<HTMLDivElement>(null);
  const index = tabs.findIndex((t) => t.id === selected);

  const onKeyDown = (event: KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    };
    const target = moves[event.key];
    if (target === undefined) return;
    event.preventDefault();
    const next = tabs[(target + tabs.length) % tabs.length];
    if (!next) return;
    onSelect(next.id);
    list.current?.querySelector<HTMLElement>(`#${CSS.escape(`${base}-${next.id}-tab`)}`)?.focus();
  };

  return (
    <>
      <div ref={list} role="tablist" aria-label={label} className="tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            id={`${base}-${t.id}-tab`}
            type="button"
            role="tab"
            aria-selected={t.id === selected}
            aria-controls={`${base}-panel`}
            tabIndex={t.id === selected ? 0 : -1}
            className="tabs__tab"
            onClick={() => onSelect(t.id)}
            onKeyDown={onKeyDown}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        id={`${base}-panel`}
        role="tabpanel"
        aria-labelledby={`${base}-${selected}-tab`}
        className="tabs__panel"
      >
        {children}
      </div>
    </>
  );
}
