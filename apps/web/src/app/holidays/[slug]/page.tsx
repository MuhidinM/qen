import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { convert, format } from '@qen/core';
import { en } from '@qen/core/locales/en';
import {
  CATEGORY_TEXT,
  FIRST_YEAR,
  LAST_YEAR,
  PAGE_HIJRI,
  holidaysIn,
  pageYear,
} from '@/lib/holidays';

type Params = Promise<{ slug: string }>;

const hijri = PAGE_HIJRI;

/** `/holidays/2027`: every holiday of a Gregorian year (the segment must be a year in range). */
function load(slug: string) {
  const year = pageYear(slug);
  if (year === null) notFound();
  return year;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const year = load((await params).slug);
  return {
    title: `Holidays in ${year}`,
    description: `Ethiopian public, Orthodox and Islamic holidays in ${year}, with their dates in the Gregorian, Ethiopian and Hijri calendars.`,
    alternates: { canonical: `/holidays/${year}` },
  };
}

export default async function YearPage({ params }: { params: Params }) {
  const year = load((await params).slug);
  const holidays = holidaysIn(year);
  const date = (d: Parameters<typeof format>[0]) => format(d, 'd MMMM y G', { locale: en, hijri });

  return (
    <>
      <p className="holiday__breadcrumb">
        <Link href="/holidays">Holidays</Link>
      </p>
      <h1>Holidays in {year}</h1>
      <p className="lead">
        Ethiopian public, Orthodox and Islamic holidays and observances in {year}, in date order.
      </p>
      <div className="table-scroll">
        <table className="holiday-table">
          <thead>
            <tr>
              <th scope="col">Holiday</th>
              <th scope="col">Gregorian</th>
              <th scope="col">Ethiopian</th>
              <th scope="col">Hijri</th>
              <th scope="col">Kind</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h) => (
              <tr key={`${h.id}-${h.gregorian.month}-${h.gregorian.day}`}>
                <th scope="row">
                  <Link href={`/holidays/${h.id}/${year}`}>{en.holidays[h.id]}</Link>
                </th>
                <td>{format(h.gregorian, 'EEE, d MMMM y', { locale: en })}</td>
                <td>{date(convert(h.gregorian, 'ethiopian', { hijri }))}</td>
                <td>{date(convert(h.gregorian, 'hijri', { hijri }))}</td>
                <td>{h.categories.map((c) => CATEGORY_TEXT[c]).join(' · ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <nav className="holiday__years" aria-label="Other years">
        {year > FIRST_YEAR && <Link href={`/holidays/${year - 1}`}>Holidays in {year - 1}</Link>}
        {year < LAST_YEAR && <Link href={`/holidays/${year + 1}`}>Holidays in {year + 1}</Link>}
      </nav>
    </>
  );
}
