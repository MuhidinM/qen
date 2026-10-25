'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Status = 'idle' | 'running' | 'ok' | 'error';

/**
 * An editable code example. The code runs in the sandbox iframe (sandbox/main.tsx), never in
 * this page, so the docs keep the strict CSP. `show(value)` prints a value; `render(<X />)`
 * shows a component.
 *
 * The frame is only created when the example comes near the viewport. A sandboxed frame has an
 * opaque origin, so the browser can't share its cached bundle with other frames: creating all
 * of a page's frames up front made the API reference download and run the sandbox once per
 * frame on load (Lighthouse performance 0.81–0.88 there).
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
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const figure = useRef<HTMLElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const editorId = useId();

  // Create the frame once the example is within 200 px of the viewport.
  useEffect(() => {
    const element = figure.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        setStatus('running');
        observer.disconnect();
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Messages come from this example's own frame only.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!frame.current || event.source !== frame.current.contentWindow) return;
      const data = event.data as { type?: string; ok?: boolean; error?: string; height?: number };
      if (data.type === 'ready') setReady(true);
      // Set through the DOM, not a style attribute: the strict CSP blocks inline styles.
      if (data.type === 'height' && typeof data.height === 'number') {
        frame.current.style.height = `${data.height}px`;
      }
      if (data.type === 'result') {
        setStatus(data.ok ? 'ok' : 'error');
        setError(data.ok ? '' : (data.error ?? 'The example failed.'));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  // Give a created frame 10 s; a content blocker or browser policy that blocks frames would
  // otherwise leave the example "running" forever.
  useEffect(() => {
    if (!near || ready) return;
    const timer = setTimeout(() => {
      setStatus('error');
      setError(
        'the result frame did not load. Your browser or an extension may block embedded frames; the code above still shows how to use it.',
      );
    }, 10_000);
    return () => clearTimeout(timer);
  }, [near, ready]);

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
    <figure ref={figure} className="live-example" data-live-example data-status={status}>
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
      {near ? (
        <iframe
          ref={frame}
          className="live-example__result"
          title={`Result of “${title}”`}
          src="/sandbox/index.html"
          sandbox="allow-scripts"
          // Not onLoad: a blocked frame still fires `load` (for its error page). The sandbox's
          // own 'ready' message is the signal, and since the frame is created after hydration,
          // our listener is always in place for it.
        />
      ) : (
        <div className="live-example__result" aria-hidden="true" />
      )}
      <p className="live-example__status" role="status">
        {status === 'error' ? `This example has an error: ${error}` : ''}
      </p>
    </figure>
  );
}
