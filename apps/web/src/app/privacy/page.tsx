import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'What the Qen website and browser extension store, and what they send: your settings stay in your browser, and nothing about you is sent to Qen.',
};

/** The privacy policy for the website and the browser extension (R-EXT-04); the stores link here. */
export default function PrivacyPage() {
  return (
    <article className="prose">
      <h1>Privacy</h1>
      <p className="lead">
        Qen has no accounts, no analytics, no ads and no tracking. Dates are worked out in your
        browser. Your settings stay in your browser, and nothing about you is sent to Qen.
      </p>
      <p>Last updated 25 October 2026.</p>

      <h2>The browser extension</h2>
      <ul>
        <li>
          <strong>Settings</strong> (language, Ge’ez numerals, calendars, Hijri dates) are saved
          with your browser’s extension storage. If you sign in to your browser, the browser syncs
          them between your devices through your browser account. Qen never receives them.
        </li>
        <li>
          <strong>Converting a selected date:</strong> the extension reads the page only when you
          ask, by choosing “Convert date with Qen” or pressing the shortcut. It then reads only the
          text you selected, converts it on your device and shows the result next to it. The text
          isn’t stored or sent anywhere.
        </li>
        <li>
          <strong>Google Calendar:</strong> on calendar.google.com the extension reads the dates of
          the days on screen and adds the Ethiopian and Hijri dates next to them. It doesn’t read
          your events, and nothing is sent anywhere.
        </li>
        <li>
          The extension makes no network requests and contains no remote code. It doesn’t collect,
          sell or share any data.
        </li>
      </ul>

      <h3>Why it asks for each permission</h3>
      <table>
        <thead>
          <tr>
            <th scope="col">Permission</th>
            <th scope="col">Used for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Storage</td>
            <td>Saving your settings.</td>
          </tr>
          <tr>
            <td>Active tab, scripting</td>
            <td>Showing a selected date converted, in the tab you’re using, only when you ask.</td>
          </tr>
          <tr>
            <td>Context menus</td>
            <td>The “Convert date with Qen” item when you right-click selected text.</td>
          </tr>
          <tr>
            <td>calendar.google.com</td>
            <td>Adding Ethiopian and Hijri dates to Google Calendar.</td>
          </tr>
        </tbody>
      </table>

      <h2>This website</h2>
      <ul>
        <li>
          <strong>Preferences</strong> (theme, language, numerals, calendar, holiday and Hijri
          choices) are saved in cookies on your device for a year, so pages show your choices. They
          are sent to this site only to render pages that way, and are never used to identify or
          track you.
        </li>
        <li>
          <strong>Offline use:</strong> the site saves pages you visit in your browser’s cache so
          they work without a connection.
        </li>
        <li>
          The age calculator keeps your birth date on the page: it isn’t put in the address or sent
          anywhere.
        </li>
        <li>
          The site is hosted on Vercel. Like any web host, Vercel processes the technical details of
          each request (such as your IP address) to deliver pages. Qen adds no analytics or tracking
          of its own.
        </li>
      </ul>

      <h2>Questions</h2>
      <p>
        Qen is open source, so you can check all of this in the code. Questions or concerns: open an
        issue at <a href="https://github.com/MuhidinM/qen/issues">github.com/MuhidinM/qen</a>.
      </p>
    </article>
  );
}
