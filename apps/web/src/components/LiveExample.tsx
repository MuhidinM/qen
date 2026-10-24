'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Status = 'running' | 'ok' | 'error';

/**
 * An editable code example. The code runs in the sandbox iframe (sandbox/main.tsx), never in
 * this page, so the docs keep the strict CSP. `show(value)` prints a value; `render(<X />)`
 * shows a component.
 */
export function LiveExample({
  title,
  code,
  globals = false,
}: {
  title: string;
  code: string;
  /** The library's exports are in scope without imports (API reference examples). */
  globals?: boolean;
}) {
  const original = code.trim();
  const [source, setSource] = useState(original);
  const [status, setStatus] = useState<Status>('running');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const editorId = useId();

  // Messages come from this example's own frame only.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return;
      const data = event.data as { type?: string; ok?: boolean; error?: string; height?: number };
      if (data.type === 'ready') setReady(true);
      // Set through the DOM, not a style attribute: the strict CSP blocks inline styles.
      if (data.type === 'height' && typeof data.height === 'number' && frame.current) {
        frame.current.style.height = `${data.height}px`;
      }
      if (data.type === 'result') {
        setStatus(data.ok ? 'ok' : 'error');
        setError(data.ok ? '' : (data.error ?? 'The example failed.'));
      }
    };
    window.addEventListener('message', onMessage);
    // A frame in the server HTML can load before hydration, so its 'ready' (and React's
    // onLoad) may be missed: ask again now that we listen. If it hasn't loaded yet, the
    // message is dropped and its own 'ready' arrives later.
    frame.current?.contentWindow?.postMessage({ type: 'ping' }, '*');
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Frames load lazily. Once the example is on screen, give its frame 10 s; a content blocker
  // or browser policy that blocks frames would otherwise leave it "running" forever.
  useEffect(() => {
    if (ready) return;
    const figure = frame.current?.closest('figure');
    if (!figure) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || timer) return;
      timer = setTimeout(() => {
        setStatus('error');
        setError(
          'the result frame did not load. Your browser or an extension may block embedded frames; the code above still shows how to use it.',
        );
      }, 10_000);
    });
    observer.observe(figure);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [ready]);

  // Run once the sandbox is ready, and again (debounced) after each edit.
  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => {
      setStatus('running');
      const theme = document.documentElement.getAttribute('data-theme') ?? 'system';
      // The sandbox has an opaque origin, so '*' is the only target that reaches it; the code
      // is the visitor's own and not secret.
      frame.current?.contentWindow?.postMessage({ type: 'run', code: source, theme, globals }, '*');
    }, 300);
    return () => clearTimeout(timer);
  }, [ready, source, globals]);

  return (
    <figure className="live-example" data-live-example data-status={status}>
      <figcaption className="live-example__title">{title}</figcaption>
      <label htmlFor={editorId} className="visually-hidden">
        Code for “{title}” (editable)
      </label>
      <textarea
        id={editorId}
        className="live-example__editor"
        value={source}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        rows={source.split('\n').length}
        onChange={(e) => setSource(e.target.value)}
      />
      <div className="live-example__bar">
        <span className="live-example__label">Result</span>
        {source !== original && (
          <button type="button" className="live-example__reset" onClick={() => setSource(original)}>
            Reset
          </button>
        )}
      </div>
      <iframe
        ref={frame}
        className="live-example__result"
        title={`Result of “${title}”`}
        src="/sandbox/index.html"
        sandbox="allow-scripts"
        loading="lazy"
        // `load` fires after the sandbox script ran, in case its 'ready' came before we listened.
        onLoad={() => setReady(true)}
      />
      <p className="live-example__status" role="status">
        {status === 'error' ? `This example has an error: ${error}` : ''}
      </p>
    </figure>
  );
}
