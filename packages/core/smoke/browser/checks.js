// The checks from smoke.mjs as a function, run by both the page and the service worker.
export function run(core, am, overrides) {
  const fail = (message) => {
    throw new Error(message);
  };
  if (core.date('ethiopian', 2019, 1, 17).day !== 17) fail('date() returned a wrong value');
  const meskerem1 = core.convert(core.date('ethiopian', 2019, 1, 1), 'gregorian');
  if (meskerem1.year !== 2026 || meskerem1.month !== 9 || meskerem1.day !== 11) {
    fail(`convert() returned ${JSON.stringify(meskerem1)}`);
  }
  try {
    core.date('ethiopian', 2018, 13, 6);
    fail('date() accepted Pagume 6, 2018 EC');
  } catch (e) {
    if (!(e instanceof core.InvalidDateError)) throw e;
  }
  const noon = core.toJSDate(core.date('ethiopian', 2019, 1, 1), { utc: true }).toISOString();
  if (noon !== '2026-09-11T12:00:00.000Z') fail(`toJSDate() returned ${noon}`);
  const meskel = core.format(core.date('ethiopian', 2019, 1, 17), 'd MMMM y', {
    locale: am,
    numerals: 'geez',
  });
  if (meskel !== '፲፯ መስከረም ፳፻፲፱') fail(`format() returned ${meskel}`);
  const holidays = core.getHolidays(2026).length;
  if (holidays !== 13) fail(`getHolidays(2026) returned ${holidays} holidays, not 13`);
  if (overrides.length < 5) fail('subpath @qen/core/overrides/ethiopia failed');
  return 'ok';
}
