import { convert, date } from '@qen/core';
import { en } from '@qen/core/locales/en';
import { DateText } from '@qen/react';

// Placeholder until the landing page (#134); it proves the workspace packages render here.
const enkutatash = date('ethiopian', 2019, 1, 1);

export default function HomePage() {
  return (
    <section className="placeholder" aria-labelledby="title">
      <h1 id="title">Qen</h1>
      <p className="lead">
        Gregorian, Ethiopian and Hijri dates in one place. The full site is on its way.
      </p>
      <p>
        Ethiopian New Year, <DateText date={enkutatash} locale={en} />, falls on{' '}
        <DateText date={convert(enkutatash, 'gregorian')} locale={en} pattern="EEEE, d MMMM y" />.
      </p>
    </section>
  );
}
