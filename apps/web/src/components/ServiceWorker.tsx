'use client';

import { useEffect, useState } from 'react';

/**
 * Registers the service worker (public/sw.js) and, when a new version has installed, asks the
 * visitor to reload instead of swapping it in under them. Production builds only.
 */
export function ServiceWorker() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;
    let registration: ServiceWorkerRegistration | undefined;
    // A worker waiting behind an active one is a new version.
    const check = () => {
      if (registration?.waiting && navigator.serviceWorker.controller) {
        setWaiting(registration.waiting);
      }
    };
    const onUpdateFound = () => {
      registration?.installing?.addEventListener('statechange', check);
    };

    navigator.serviceWorker
      .register(`/sw.js?v=${process.env.NEXT_PUBLIC_QEN_BUILD}`)
      .then((r) => {
        registration = r;
        check();
        r.addEventListener('updatefound', onUpdateFound);
      })
      .catch(() => {
        // No worker (private mode, blocked): the site still works online.
      });
    return () => registration?.removeEventListener('updatefound', onUpdateFound);
  }, []);

  if (!waiting) return null;
  return (
    <div role="status" className="update-prompt">
      <p>A new version of Qen is ready.</p>
      <button
        type="button"
        className="button"
        onClick={() => {
          navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), {
            once: true,
          });
          waiting.postMessage({ type: 'SKIP_WAITING' });
        }}
      >
        Reload
      </button>
    </div>
  );
}
