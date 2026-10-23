import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offline',
  robots: { index: false },
};

/** Shown by the service worker for pages it has not cached while there is no connection. */
export default function OfflinePage() {
  return (
    <>
      <h1>You’re offline</h1>
      <p className="lead">
        This page isn’t saved on your device yet. The converter and the calendar work without a
        connection.
      </p>
      <ul className="offline__links">
        <li>
          <Link href="/convert">Converter</Link>
        </li>
        <li>
          <Link href="/calendar">Calendar</Link>
        </li>
      </ul>
    </>
  );
}
