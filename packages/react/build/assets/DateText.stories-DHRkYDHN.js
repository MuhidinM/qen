var V = Object.defineProperty;
var Z = (u, a, e) =>
  a in u ? V(u, a, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (u[a] = e);
var c = (u, a, e) => Z(u, typeof a != 'symbol' ? a + '' : a, e);
import { j as f } from './index-CeYE272f.js';
var M = class extends Error {
  constructor(a, e, r, t, i) {
    super(a);
    c(this, 'name', 'InvalidDateError');
    c(this, 'calendar');
    c(this, 'year');
    c(this, 'month');
    c(this, 'day');
    ((this.calendar = e), (this.year = r), (this.month = t), (this.day = i));
  }
};
function X(u) {
  return u % 4 === 3;
}
var uu = 1724221;
function au(u, a, e) {
  return uu + 365 * (u - 1) + Math.floor(u / 4) + 30 * (a - 1) + e - 1;
}
var eu = {
    id: 'ethiopian',
    name: 'Ethiopian',
    yearSuffix: ' EC',
    monthNames: [
      'Meskerem',
      'Tikimt',
      'Hidar',
      'Tahsas',
      'Tir',
      'Yekatit',
      'Megabit',
      'Miyazia',
      'Ginbot',
      'Sene',
      'Hamle',
      'Nehase',
      'Pagume',
    ],
    monthsInYear: () => 13,
    maxDay: (u, a) => (a < 13 ? 30 : X(u) ? 6 : 5),
  },
  ru = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function tu(u) {
  return (u % 4 === 0 && u % 100 !== 0) || u % 400 === 0;
}
function z(u, a, e) {
  const r = Math.floor((14 - a) / 12),
    t = u + 4800 - r,
    i = a + 12 * r - 3;
  return (
    e +
    Math.floor((153 * i + 2) / 5) +
    365 * t +
    Math.floor(t / 4) -
    Math.floor(t / 100) +
    Math.floor(t / 400) -
    32045
  );
}
function nu(u) {
  const a = u + 32044,
    e = Math.floor((4 * a + 3) / 146097),
    r = a - Math.floor((146097 * e) / 4),
    t = Math.floor((4 * r + 3) / 1461),
    i = r - Math.floor((1461 * t) / 4),
    h = Math.floor((5 * i + 2) / 153);
  return {
    year: 100 * e + t - 4800 + Math.floor(h / 10),
    month: h + 3 - 12 * Math.floor(h / 10),
    day: i - Math.floor((153 * h + 2) / 5) + 1,
  };
}
var iu = {
    id: 'gregorian',
    name: 'Gregorian',
    yearSuffix: '',
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthsInYear: () => 12,
    maxDay: (u, a) => (a === 2 && tu(u) ? 29 : (ru[a - 1] ?? 0)),
  },
  N = {
    id: 'hijri',
    name: 'Hijri',
    yearSuffix: ' AH',
    monthNames: [
      'Muharram',
      'Safar',
      'Rabi al-Awwal',
      'Rabi al-Thani',
      'Jumada al-Ula',
      'Jumada al-Akhirah',
      'Rajab',
      "Sha'ban",
      'Ramadan',
      'Shawwal',
      "Dhu al-Qa'dah",
      'Dhu al-Hijjah',
    ],
    monthsInYear: () => 12,
    maxDay: () => 30,
  },
  L = { gregorian: iu, ethiopian: eu, hijri: N };
function G(u) {
  return typeof u == 'string' && Object.hasOwn(L, u);
}
function U(u) {
  return L[u];
}
function ou(u, a, e, r) {
  if (!G(u)) return `Unknown calendar "${String(u)}": expected gregorian, ethiopian or hijri`;
  for (const [h, d] of [
    ['year', a],
    ['month', e],
    ['day', r],
  ])
    if (!Number.isInteger(d)) return `${h} must be an integer, got ${d}`;
  if (a < 1) return `Year ${a} is out of range: years start at 1`;
  const t = U(u),
    i = t.monthsInYear(a);
  if (e < 1 || e > i) return `Month ${e} does not exist in the ${t.name} calendar (months 1–${i})`;
  if (r < 1 || r > t.maxDay(a, e))
    return `${t.monthNames[e - 1]} ${r} does not exist in ${a}${t.yearSuffix}`;
}
function w(u, a, e, r) {
  const t = ou(u, a, e, r);
  if (t !== void 0) throw new M(t, u, a, e, r);
  return Object.freeze({ calendar: u, year: a, month: e, day: r });
}
var q = 1948440;
function su(u) {
  return (14 + 11 * u) % 30 < 11;
}
function hu(u, a) {
  return a % 2 === 1 || (a === 12 && su(u)) ? 30 : 29;
}
function b(u, a, e) {
  if (e > hu(u, a))
    throw new M(
      `${N.monthNames[a - 1]} ${e} does not exist in ${u} AH (tabular method)`,
      'hijri',
      u,
      a,
      e,
    );
  return e + Math.ceil(29.5 * (a - 1)) + 354 * (u - 1) + Math.floor((3 + 11 * u) / 30) + q - 1;
}
function P(u) {
  const a = Math.floor((30 * (u - q) + 10646) / 10631),
    e = b(a, 1, 1),
    r = Math.min(12, Math.ceil((u - 29 - e) / 29.5) + 1);
  return { year: a, month: r, day: u - b(a, r, 1) + 1 };
}
var y = 1300,
  _ = 1500,
  Q = 2408762,
  du =
    '5552ab9372b657636cb55aaa95649e95d2ba5b53aab4ba9652e2ad56db5a752f25e8ad16a56ab56b4da9b92b2564ba9b35a6d95d4da5d4aa955369752f46e96d46a953525d4bd9ba3b4b69b2aa554ada5d2da6d9eaae94d2ac564aea6d56ad55d4aa9352ba5b53a6b5ea9d52d29a554ad56daea6e4ed1da2aaa95a2da5b9bb27646c95552ab4dbaba5b4da9d52aa592d26d8ed2daad5aa5a4b4979372b6975d69d52c9592b25b4db9d55d2da5d4aa9554daad3aabd2bc4b89a9552d5adb6a6d4dc9d92aa69562ae56d36ab55aaa94d49d95d2ba5b55aad55a9a92e26e55dada6d46a5b27a4d4ad56db5a754f49e92d26a563566b5baab92b2568ba9b55aada5b4da9b52a9a536276575af26d46a95552ad4bd9ba574b69b52a9552da5d4daad96b2e95e2ac9692eaad56ad65d4a',
  k = (() => {
    const u = [Q];
    for (let a = 0; a <= _ - y; a++) {
      const e = parseInt(du.slice(a * 3, a * 3 + 3), 16);
      for (let r = 0; r < 12; r++) u.push((u.at(-1) ?? 0) + (e & (1 << r) ? 30 : 29));
    }
    return u;
  })(),
  g = (u) => k[u] ?? Number.NaN;
function lu(u) {
  return u >= y && u <= _;
}
function Au(u) {
  return u >= Q && u < g(k.length - 1);
}
function cu(u, a, e) {
  if (!lu(u)) return b(u, a, e);
  const r = (u - y) * 12 + a - 1;
  return g(r) + e - 1;
}
function mu(u) {
  if (!Au(u)) return P(u);
  let a = 0,
    e = k.length - 2;
  for (; a < e;) {
    const r = (a + e + 1) >> 1;
    g(r) <= u ? (a = r) : (e = r - 1);
  }
  return { year: y + Math.floor(a / 12), month: (a % 12) + 1, day: u - g(a) + 1 };
}
var fu = { umalqura: { toJDN: cu, fromJDN: mu }, tabular: { toJDN: b, fromJDN: P } },
  Du = { umalqura: 'Umm al-Qura method', tabular: 'tabular method' },
  p = (u, a) => `${u}-${a}`;
function bu(u) {
  var i, h, d;
  const a = ((i = u.hijri) == null ? void 0 : i.method) ?? 'umalqura',
    e = ((h = u.hijri) == null ? void 0 : h.offset) ?? 0;
  if (!Number.isInteger(e) || Math.abs(e) > 2)
    throw new RangeError(`Hijri offset must be -2, -1, 0, 1 or 2, got ${e}`);
  const r = new Map(),
    t = { method: a, offset: e, overrides: r };
  for (const n of ((d = u.hijri) == null ? void 0 : d.overrides) ?? []) {
    const o = `${n.hijriMonth}/${n.hijriYear}`;
    if (!Number.isInteger(n.hijriYear) || n.hijriYear < 1)
      throw new RangeError(`Hijri override: year ${n.hijriYear} is not a Hijri year`);
    if (!Number.isInteger(n.hijriMonth) || n.hijriMonth < 1 || n.hijriMonth > 12)
      throw new RangeError(
        `Hijri override: month ${n.hijriMonth} of ${n.hijriYear} is not a Hijri month (1–12)`,
      );
    if (typeof n.source != 'string' || n.source.trim() === '')
      throw new RangeError(`Hijri override for ${o} needs a source`);
    let s;
    try {
      const {
        year: l,
        month: A,
        day: D,
      } = w('gregorian', n.startsOn.year, n.startsOn.month, n.startsOn.day);
      s = z(l, A, D);
    } catch (l) {
      throw new RangeError(
        `Hijri override for ${o}: ${l instanceof Error ? l.message : String(l)}`,
        { cause: l },
      );
    }
    if (r.has(p(n.hijriYear, n.hijriMonth)))
      throw new RangeError(`Hijri override: two overrides for ${o}`);
    r.set(p(n.hijriYear, n.hijriMonth), { jdn: s, source: n.source });
  }
  for (const n of r.keys()) {
    const [o = 0, s = 0] = n.split('-').map(Number),
      [l, A] = s === 1 ? [o - 1, 12] : [o, s - 1];
    for (const [D, T] of [
      [l, A],
      [o, s],
    ]) {
      const F = W(D, T, t);
      if (F !== 29 && F !== 30)
        throw new RangeError(`Hijri override for ${s}/${o} would give ${T}/${D} ${F} days`);
    }
  }
  return t;
}
var gu = (u, a) => (a === 12 ? [u + 1, 1] : [u, a + 1]);
function j(u, a, e) {
  var r;
  return (
    ((r = e.overrides.get(p(u, a))) == null ? void 0 : r.jdn) ??
    fu[e.method].toJDN(u, a, 1) + e.offset
  );
}
function W(u, a, e) {
  const [r, t] = gu(u, a);
  return j(r, t, e) - j(u, a, e);
}
function wu(u, a, e, r) {
  if (e > W(u, a, r))
    throw new M(
      `${N.monthNames[a - 1]} ${e} does not exist in ${u} AH (${Du[r.method]})`,
      'hijri',
      u,
      a,
      e,
    );
  return j(u, a, r) + e - 1;
}
var yu = { gregorian: 1721426, ethiopian: 1724221, hijri: 1948440 };
function K(u, a = {}) {
  const { calendar: e, year: r, month: t, day: i } = w(u.calendar, u.year, u.month, u.day);
  switch (e) {
    case 'gregorian':
      return z(r, t, i);
    case 'ethiopian':
      return au(r, t, i);
    case 'hijri':
      return wu(r, t, i, bu(a));
  }
}
function Eu(u, a, e = {}) {
  if (!G(a))
    throw new RangeError(`Unknown calendar "${String(a)}": expected gregorian, ethiopian or hijri`);
  if (!Number.isInteger(u)) throw new RangeError(`Julian Day Number must be an integer, got ${u}`);
  if (u < yu[a]) throw new RangeError(`JDN ${u} is before year 1 of the ${U(a).name} calendar`);
  const { year: r, month: t, day: i } = nu(u);
  return Object.freeze({ calendar: a, year: r, month: t, day: i });
}
function Fu(u, a, e = {}) {
  return Eu(K(u, e), a, e);
}
var C = ['', '፩', '፪', '፫', '፬', '፭', '፮', '፯', '፰', '፱'],
  vu = ['', '፲', '፳', '፴', '፵', '፶', '፷', '፸', '፹', '፺'],
  pu = '፻',
  ju = '፼';
function Mu(u) {
  if (!Number.isSafeInteger(u) || u < 1)
    throw new RangeError(
      u === 0
        ? "Ge'ez numerals have no zero"
        : `Ge'ez numerals need a positive safe integer, got ${u}`,
    );
  if (u === 1) return C[1];
  const a = [];
  for (let r = u; r > 0; r = Math.floor(r / 100)) a.push(r % 100);
  let e = '';
  for (let r = a.length - 1; r >= 0; r--) {
    const t = a[r] ?? 0;
    (t === 0 ||
      (t === 1 && (r === a.length - 1 || r % 2 === 1)) ||
      (e += (vu[Math.floor(t / 10)] ?? '') + (C[t % 10] ?? '')),
      r % 2 === 1 && t !== 0 && (e += pu),
      r % 2 === 0 && r > 0 && (e += ju));
  }
  return e;
}
function Nu(u) {
  const a = [];
  let e = 0;
  for (; e < u.length;) {
    const r = u.charAt(e);
    if (r === "'") {
      if (u.charAt(e + 1) === "'") {
        (a.push({ literal: "'" }), (e += 2));
        continue;
      }
      let t = '';
      for (e++; ;) {
        if (e >= u.length) throw new RangeError('Unclosed quote in pattern');
        if (u.charAt(e) === "'") {
          if (u.charAt(e + 1) === "'") {
            ((t += "'"), (e += 2));
            continue;
          }
          e++;
          break;
        }
        t += u.charAt(e++);
      }
      a.push({ literal: t });
    } else if (/[A-Za-z]/.test(r)) {
      let t = e;
      for (; u.charAt(t) === r;) t++;
      (a.push({ token: u.slice(e, t) }), (e = t));
    } else (a.push({ literal: r }), e++);
  }
  return a;
}
var ku = '٠١٢٣٤٥٦٧٨٩';
function m(u, a, e) {
  if (e === 'geez') return Mu(u);
  const r = String(u).padStart(a, '0');
  return e === 'arabic' ? r.replace(/\d/g, (t) => ku.charAt(Number(t))) : r;
}
function Bu(u, a, e = {}) {
  const { locale: r, numerals: t = 'latin' } = e;
  if (!['latin', 'arabic', 'geez'].includes(t))
    throw new RangeError(`Unknown numerals "${String(t)}": expected latin, arabic or geez`);
  const i = K(u, e),
    h = (n) => {
      if (r === void 0)
        throw new RangeError(
          `Pattern token "${n}" needs a locale (import one from @qen/core/locales)`,
        );
      return r;
    },
    d = (n) => new RangeError(`Unknown pattern token "${n}"`);
  return Nu(a)
    .map((n) => {
      if ('literal' in n) return n.literal;
      const o = n.token,
        s = o.length;
      switch (o.charAt(0)) {
        case 'y':
          if (s === 1) return m(u.year, 0, t);
          if (s === 2) return m(u.year % 100, 2, t);
          if (s === 4) return m(u.year, 4, t);
          throw d(o);
        case 'M':
          if (s <= 2) return m(u.month, s, t);
          if (s === 3) return h(o).monthsShort[u.calendar][u.month - 1] ?? '';
          if (s === 4) return h(o).months[u.calendar][u.month - 1] ?? '';
          throw d(o);
        case 'd':
          if (s <= 2) return m(u.day, s, t);
          throw d(o);
        case 'E': {
          if (s > 4) throw d(o);
          const l = (i + 1) % 7,
            A = h(o);
          return (s === 4 ? A.weekdays : A.weekdaysShort)[l] ?? '';
        }
        case 'G': {
          if (s > 4) throw d(o);
          const l = h(o).eras[u.calendar];
          return s === 4 ? l.long : l.short;
        }
        default:
          throw d(o);
      }
    })
    .join('');
}
function B(u) {
  const a = (e) => {
    if (typeof e == 'object' && e !== null && !Object.isFrozen(e)) {
      Object.freeze(e);
      for (const r of Object.values(e)) a(r);
    }
  };
  return (a(u), u);
}
var $ = [
    'መስከረም',
    'ጥቅምት',
    'ኅዳር',
    'ታኅሣሥ',
    'ጥር',
    'የካቲት',
    'መጋቢት',
    'ሚያዝያ',
    'ግንቦት',
    'ሰኔ',
    'ሐምሌ',
    'ነሐሴ',
    'ጳጉሜ',
  ],
  R = [
    'ሙሀረም',
    'ሳፈር',
    'ረቢዑል አወል',
    'ረቢዑል አኺር',
    'ጀማደል አወል',
    'ጀማደል አኺር',
    'ረጀብ',
    'ሻእባን',
    'ረመዳን',
    'ሸዋል',
    'ዙልቂዳህ',
    'ዙልሂጃህ',
  ],
  Su = B({
    code: 'am',
    direction: 'ltr',
    months: {
      gregorian: [
        'ጃንዋሪ',
        'ፌብሩዋሪ',
        'ማርች',
        'ኤፕሪል',
        'ሜይ',
        'ጁን',
        'ጁላይ',
        'ኦገስት',
        'ሴፕቴምበር',
        'ኦክቶበር',
        'ኖቬምበር',
        'ዲሴምበር',
      ],
      ethiopian: $,
      hijri: R,
    },
    monthsShort: {
      gregorian: ['ጃን', 'ፌብ', 'ማርች', 'ኤፕሪ', 'ሜይ', 'ጁን', 'ጁላይ', 'ኦገስ', 'ሴፕቴ', 'ኦክቶ', 'ኖቬም', 'ዲሴም'],
      ethiopian: $,
      hijri: R,
    },
    weekdays: ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
    weekdaysShort: ['እሑድ', 'ሰኞ', 'ማክሰ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'],
    eras: {
      gregorian: { short: 'እ.ኤ.አ.', long: 'እንደ ኤውሮጳውያን አቆጣጠር' },
      ethiopian: { short: 'ዓ.ም.', long: 'ዓመተ ምሕረት' },
      hijri: { short: 'ዓ.ሂ.', long: 'ዓመተ ሂጅራ' },
    },
    periods: { morning: 'ጥዋት', afternoon: 'ከሰዓት', evening: 'በምሽት', night: 'በሌሊት' },
    holidays: {
      enkutatash: 'እንቁጣጣሽ',
      meskel: 'መስቀል',
      genna: 'ገና',
      timket: 'ጥምቀት',
      adwa: 'የዓድዋ ድል በዓል',
      'labour-day': 'ዓለም አቀፍ የሠራተኞች ቀን',
      'patriots-victory': 'የአርበኞች ቀን',
      'derg-downfall': 'ግንቦት 20',
      siklet: 'ስቅለት',
      fasika: 'ፋሲካ',
      'eid-al-fitr': 'ዒድ አል ፈጥር',
      'eid-al-adha': 'ዒድ አል አድሐ',
      mawlid: 'መውሊድ',
      'tsome-nenewe': 'ጾመ ነነዌ',
      'abiy-tsom': 'ዐቢይ ጾም',
      'debre-zeit': 'ደብረ ዘይት',
      hosanna: 'ሆሣዕና',
      'rekebe-kahnat': 'ርክበ ካህናት',
      erget: 'ዕርገት',
      peraklitos: 'ጰራቅሊጦስ',
      'tsome-hawariyat': 'ጾመ ሐዋርያት',
      'tsome-dihnet': 'ጾመ ድኅነት',
      'islamic-new-year': 'የሂጅራ አዲስ ዓመት',
      ashura: 'አሹራ',
      'isra-miraj': 'ኢስራእ ወል ሚዕራጅ',
      'ramadan-start': 'የረመዳን መጀመሪያ',
      'laylat-al-qadr': 'ለይለቱል ቀድር',
      arafah: 'የዐረፋ ቀን',
    },
    observances: {
      'abiy-tsom': 'ዐቢይ ጾም',
      'tsome-hawariyat': 'ጾመ ሐዋርያት',
      'tsome-filseta': 'ጾመ ፍልሰታ',
      'tsome-nebiyat': 'ጾመ ነቢያት',
      ramadan: 'ረመዳን',
    },
    reviewed: !1,
  }),
  H = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ],
  I = [
    'مسكريم',
    'تكمت',
    'هدار',
    'تهساس',
    'تر',
    'يكتت',
    'مجابيت',
    'ميازيا',
    'جنبت',
    'سين',
    'هامل',
    'نهاس',
    'باجمن',
  ],
  J = [
    'محرم',
    'صفر',
    'ربيع الأول',
    'ربيع الآخر',
    'جمادى الأولى',
    'جمادى الآخرة',
    'رجب',
    'شعبان',
    'رمضان',
    'شوال',
    'ذو القعدة',
    'ذو الحجة',
  ],
  x = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
  Tu = B({
    code: 'ar',
    direction: 'rtl',
    months: { gregorian: H, ethiopian: I, hijri: J },
    monthsShort: { gregorian: H, ethiopian: I, hijri: J },
    weekdays: x,
    weekdaysShort: x,
    eras: {
      gregorian: { short: 'م', long: 'ميلادي' },
      ethiopian: { short: 'إثيوبي', long: 'التقويم الإثيوبي' },
      hijri: { short: 'هـ', long: 'هجري' },
    },
    periods: { morning: 'صباحًا', afternoon: 'بعد الظهر', evening: 'مساءً', night: 'ليلًا' },
    holidays: {
      enkutatash: 'رأس السنة الإثيوبية',
      meskel: 'عيد الصليب',
      genna: 'عيد الميلاد الإثيوبي',
      timket: 'عيد الغطاس',
      adwa: 'يوم النصر في عدوة',
      'labour-day': 'عيد العمال',
      'patriots-victory': 'يوم انتصار الوطنيين',
      'derg-downfall': 'يوم سقوط الدرغ',
      siklet: 'الجمعة العظيمة',
      fasika: 'عيد الفصح',
      'eid-al-fitr': 'عيد الفطر',
      'eid-al-adha': 'عيد الأضحى',
      mawlid: 'المولد النبوي',
      'tsome-nenewe': 'صوم نينوى',
      'abiy-tsom': 'بداية الصوم الكبير',
      'debre-zeit': 'منتصف الصوم الكبير',
      hosanna: 'أحد الشعانين',
      'rekebe-kahnat': 'ركبي كاهنات',
      erget: 'عيد الصعود',
      peraklitos: 'عيد العنصرة',
      'tsome-hawariyat': 'بداية صوم الرسل',
      'tsome-dihnet': 'صوم الخلاص',
      'islamic-new-year': 'رأس السنة الهجرية',
      ashura: 'عاشوراء',
      'isra-miraj': 'الإسراء والمعراج',
      'ramadan-start': 'بداية رمضان',
      'laylat-al-qadr': 'ليلة القدر',
      arafah: 'يوم عرفة',
    },
    observances: {
      'abiy-tsom': 'الصوم الكبير',
      'tsome-hawariyat': 'صوم الرسل',
      'tsome-filseta': 'صوم السيدة العذراء',
      'tsome-nebiyat': 'صوم الأنبياء',
      ramadan: 'رمضان',
    },
    reviewed: !1,
  }),
  O = [
    'Meskerem',
    'Tikimt',
    'Hidar',
    'Tahsas',
    'Tir',
    'Yekatit',
    'Megabit',
    'Miyazia',
    'Ginbot',
    'Sene',
    'Hamle',
    'Nehase',
    'Pagume',
  ],
  Y = [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Ula',
    'Jumada al-Akhirah',
    'Rajab',
    "Sha'ban",
    'Ramadan',
    'Shawwal',
    "Dhu al-Qa'dah",
    'Dhu al-Hijjah',
  ],
  Cu = B({
    code: 'en',
    direction: 'ltr',
    months: {
      gregorian: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
      ethiopian: O,
      hijri: Y,
    },
    monthsShort: {
      gregorian: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      ethiopian: O,
      hijri: Y,
    },
    weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    eras: {
      gregorian: { short: 'AD', long: 'Anno Domini' },
      ethiopian: { short: 'EC', long: 'Ethiopian Calendar' },
      hijri: { short: 'AH', long: 'Anno Hegirae' },
    },
    periods: {
      morning: 'in the morning',
      afternoon: 'in the afternoon',
      evening: 'in the evening',
      night: 'at night',
    },
    holidays: {
      enkutatash: 'Enkutatash (Ethiopian New Year)',
      meskel: 'Meskel (Finding of the True Cross)',
      genna: 'Genna (Ethiopian Christmas)',
      timket: 'Timket (Epiphany)',
      adwa: 'Adwa Victory Day',
      'labour-day': 'International Labour Day',
      'patriots-victory': "Patriots' Victory Day",
      'derg-downfall': 'Downfall of the Derg',
      siklet: 'Siklet (Good Friday)',
      fasika: 'Fasika (Easter)',
      'eid-al-fitr': 'Eid al-Fitr',
      'eid-al-adha': 'Eid al-Adha',
      mawlid: 'Mawlid (Birth of the Prophet)',
      'tsome-nenewe': 'Tsome Nenewe (Fast of Nineveh)',
      'abiy-tsom': 'Abiy Tsom begins (Great Lent)',
      'debre-zeit': 'Debre Zeit (Mid-Lent)',
      hosanna: 'Hosanna (Palm Sunday)',
      'rekebe-kahnat': 'Rekebe Kahnat',
      erget: 'Erget (Ascension)',
      peraklitos: 'Peraklitos (Pentecost)',
      'tsome-hawariyat': "Tsome Hawariyat begins (Apostles' Fast)",
      'tsome-dihnet': 'Tsome Dihnet (Fast of Salvation)',
      'islamic-new-year': 'Islamic New Year',
      ashura: 'Ashura',
      'isra-miraj': "Isra and Mi'raj",
      'ramadan-start': 'Ramadan begins',
      'laylat-al-qadr': 'Laylat al-Qadr',
      arafah: 'Day of Arafah',
    },
    observances: {
      'abiy-tsom': 'Abiy Tsom (Great Lent)',
      'tsome-hawariyat': "Tsome Hawariyat (Apostles' Fast)",
      'tsome-filseta': 'Tsome Filseta (Fast of the Assumption)',
      'tsome-nebiyat': "Tsome Nebiyat (Prophets' Fast)",
      ramadan: 'Ramadan',
    },
    reviewed: !0,
  });
const v = (u, a) => String(u).padStart(a, '0');
function E({ date: u, locale: a, pattern: e, numerals: r, hijri: t, className: i }) {
  const h = { ...(t ? { hijri: t } : {}) },
    d = Fu(u, 'gregorian', h),
    n = Bu(u, e ?? (a ? 'd MMMM y G' : 'd/M/y'), {
      ...h,
      ...(a ? { locale: a } : {}),
      ...(r ? { numerals: r } : {}),
    });
  return f.jsx('time', {
    dateTime: `${v(d.year, 4)}-${v(d.month, 2)}-${v(d.day, 2)}`,
    lang: a == null ? void 0 : a.code,
    dir: (a == null ? void 0 : a.direction) === 'rtl' ? 'rtl' : void 0,
    className: i ? `qen-date-text ${i}` : 'qen-date-text',
    children: n,
  });
}
const S = w('ethiopian', 2019, 1, 17),
  Hu = () => f.jsx(E, { date: S }),
  Iu = () => f.jsx(E, { date: S, locale: Cu }),
  Ju = () => f.jsx(E, { date: S, locale: Su, numerals: 'geez' }),
  xu = () => f.jsx(E, { date: w('hijri', 1447, 9, 1), locale: Tu, numerals: 'arabic' });
typeof window < 'u' &&
  window.document &&
  window.document.createElement &&
  document.documentElement.setAttribute('data-storyloaded', '');
export { Ju as AmharicGeez, xu as ArabicHijri, Iu as English, Hu as Numeric };
