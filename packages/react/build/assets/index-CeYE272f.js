var rE = Object.defineProperty;
var uE = (a, r, o) =>
  r in a ? rE(a, r, { enumerable: !0, configurable: !0, writable: !0, value: o }) : (a[r] = o);
var Rr = (a, r, o) => uE(a, typeof r != 'symbol' ? r + '' : r, o);
(function () {
  const r = document.createElement('link').relList;
  if (r && r.supports && r.supports('modulepreload')) return;
  for (const f of document.querySelectorAll('link[rel="modulepreload"]')) c(f);
  new MutationObserver((f) => {
    for (const y of f)
      if (y.type === 'childList')
        for (const d of y.addedNodes) d.tagName === 'LINK' && d.rel === 'modulepreload' && c(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function o(f) {
    const y = {};
    return (
      f.integrity && (y.integrity = f.integrity),
      f.referrerPolicy && (y.referrerPolicy = f.referrerPolicy),
      f.crossOrigin === 'use-credentials'
        ? (y.credentials = 'include')
        : f.crossOrigin === 'anonymous'
          ? (y.credentials = 'omit')
          : (y.credentials = 'same-origin'),
      y
    );
  }
  function c(f) {
    if (f.ep) return;
    f.ep = !0;
    const y = o(f);
    fetch(f.href, y);
  }
})();
var Mo =
  typeof globalThis < 'u'
    ? globalThis
    : typeof window < 'u'
      ? window
      : typeof global < 'u'
        ? global
        : typeof self < 'u'
          ? self
          : {};
function Qu(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, 'default') ? a.default : a;
}
var Lo = { exports: {} },
  kf,
  Vh;
function iE() {
  if (Vh) return kf;
  Vh = 1;
  var a = 1e3,
    r = a * 60,
    o = r * 60,
    c = o * 24,
    f = c * 7,
    y = c * 365.25;
  kf = function (E, g) {
    g = g || {};
    var A = typeof E;
    if (A === 'string' && E.length > 0) return d(E);
    if (A === 'number' && isFinite(E)) return g.long ? p(E) : m(E);
    throw new Error('val is not a non-empty string or a valid number. val=' + JSON.stringify(E));
  };
  function d(E) {
    if (((E = String(E)), !(E.length > 100))) {
      var g =
        /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          E,
        );
      if (g) {
        var A = parseFloat(g[1]),
          R = (g[2] || 'ms').toLowerCase();
        switch (R) {
          case 'years':
          case 'year':
          case 'yrs':
          case 'yr':
          case 'y':
            return A * y;
          case 'weeks':
          case 'week':
          case 'w':
            return A * f;
          case 'days':
          case 'day':
          case 'd':
            return A * c;
          case 'hours':
          case 'hour':
          case 'hrs':
          case 'hr':
          case 'h':
            return A * o;
          case 'minutes':
          case 'minute':
          case 'mins':
          case 'min':
          case 'm':
            return A * r;
          case 'seconds':
          case 'second':
          case 'secs':
          case 'sec':
          case 's':
            return A * a;
          case 'milliseconds':
          case 'millisecond':
          case 'msecs':
          case 'msec':
          case 'ms':
            return A;
          default:
            return;
        }
      }
    }
  }
  function m(E) {
    var g = Math.abs(E);
    return g >= c
      ? Math.round(E / c) + 'd'
      : g >= o
        ? Math.round(E / o) + 'h'
        : g >= r
          ? Math.round(E / r) + 'm'
          : g >= a
            ? Math.round(E / a) + 's'
            : E + 'ms';
  }
  function p(E) {
    var g = Math.abs(E);
    return g >= c
      ? v(E, g, c, 'day')
      : g >= o
        ? v(E, g, o, 'hour')
        : g >= r
          ? v(E, g, r, 'minute')
          : g >= a
            ? v(E, g, a, 'second')
            : E + ' ms';
  }
  function v(E, g, A, R) {
    var x = g >= A * 1.5;
    return Math.round(E / A) + ' ' + R + (x ? 's' : '');
  }
  return kf;
}
var Hf, Ih;
function oE() {
  if (Ih) return Hf;
  Ih = 1;
  function a(r) {
    ((c.debug = c),
      (c.default = c),
      (c.coerce = v),
      (c.disable = m),
      (c.enable = y),
      (c.enabled = p),
      (c.humanize = iE()),
      (c.destroy = E),
      Object.keys(r).forEach((g) => {
        c[g] = r[g];
      }),
      (c.names = []),
      (c.skips = []),
      (c.formatters = {}));
    function o(g) {
      let A = 0;
      for (let R = 0; R < g.length; R++) ((A = (A << 5) - A + g.charCodeAt(R)), (A |= 0));
      return c.colors[Math.abs(A) % c.colors.length];
    }
    c.selectColor = o;
    function c(g) {
      let A,
        R = null,
        x,
        S;
      function _(...k) {
        if (!_.enabled) return;
        const B = _,
          q = Number(new Date()),
          W = q - (A || q);
        ((B.diff = W),
          (B.prev = A),
          (B.curr = q),
          (A = q),
          (k[0] = c.coerce(k[0])),
          typeof k[0] != 'string' && k.unshift('%O'));
        let te = 0;
        ((k[0] = k[0].replace(/%([a-zA-Z%])/g, (Z, K) => {
          if (Z === '%%') return '%';
          te++;
          const ce = c.formatters[K];
          if (typeof ce == 'function') {
            const he = k[te];
            ((Z = ce.call(B, he)), k.splice(te, 1), te--);
          }
          return Z;
        })),
          c.formatArgs.call(B, k),
          (B.log || c.log).apply(B, k));
      }
      return (
        (_.namespace = g),
        (_.useColors = c.useColors()),
        (_.color = c.selectColor(g)),
        (_.extend = f),
        (_.destroy = c.destroy),
        Object.defineProperty(_, 'enabled', {
          enumerable: !0,
          configurable: !1,
          get: () =>
            R !== null ? R : (x !== c.namespaces && ((x = c.namespaces), (S = c.enabled(g))), S),
          set: (k) => {
            R = k;
          },
        }),
        typeof c.init == 'function' && c.init(_),
        _
      );
    }
    function f(g, A) {
      const R = c(this.namespace + (typeof A > 'u' ? ':' : A) + g);
      return ((R.log = this.log), R);
    }
    function y(g) {
      (c.save(g), (c.namespaces = g), (c.names = []), (c.skips = []));
      const A = (typeof g == 'string' ? g : '')
        .trim()
        .replace(/\s+/g, ',')
        .split(',')
        .filter(Boolean);
      for (const R of A) R[0] === '-' ? c.skips.push(R.slice(1)) : c.names.push(R);
    }
    function d(g, A) {
      let R = 0,
        x = 0,
        S = -1,
        _ = 0;
      for (; R < g.length;)
        if (x < A.length && (A[x] === g[R] || A[x] === '*'))
          A[x] === '*' ? ((S = x), (_ = R), x++) : (R++, x++);
        else if (S !== -1) ((x = S + 1), _++, (R = _));
        else return !1;
      for (; x < A.length && A[x] === '*';) x++;
      return x === A.length;
    }
    function m() {
      const g = [...c.names, ...c.skips.map((A) => '-' + A)].join(',');
      return (c.enable(''), g);
    }
    function p(g) {
      for (const A of c.skips) if (d(g, A)) return !1;
      for (const A of c.names) if (d(g, A)) return !0;
      return !1;
    }
    function v(g) {
      return g instanceof Error ? g.stack || g.message : g;
    }
    function E() {
      console.warn(
        'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.',
      );
    }
    return (c.enable(c.load()), c);
  }
  return ((Hf = a), Hf);
}
var Zh;
function cE() {
  return (
    Zh ||
      ((Zh = 1),
      (function (a, r) {
        var o = {};
        ((r.formatArgs = f),
          (r.save = y),
          (r.load = d),
          (r.useColors = c),
          (r.storage = m()),
          (r.destroy = (() => {
            let v = !1;
            return () => {
              v ||
                ((v = !0),
                console.warn(
                  'Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.',
                ));
            };
          })()),
          (r.colors = [
            '#0000CC',
            '#0000FF',
            '#0033CC',
            '#0033FF',
            '#0066CC',
            '#0066FF',
            '#0099CC',
            '#0099FF',
            '#00CC00',
            '#00CC33',
            '#00CC66',
            '#00CC99',
            '#00CCCC',
            '#00CCFF',
            '#3300CC',
            '#3300FF',
            '#3333CC',
            '#3333FF',
            '#3366CC',
            '#3366FF',
            '#3399CC',
            '#3399FF',
            '#33CC00',
            '#33CC33',
            '#33CC66',
            '#33CC99',
            '#33CCCC',
            '#33CCFF',
            '#6600CC',
            '#6600FF',
            '#6633CC',
            '#6633FF',
            '#66CC00',
            '#66CC33',
            '#9900CC',
            '#9900FF',
            '#9933CC',
            '#9933FF',
            '#99CC00',
            '#99CC33',
            '#CC0000',
            '#CC0033',
            '#CC0066',
            '#CC0099',
            '#CC00CC',
            '#CC00FF',
            '#CC3300',
            '#CC3333',
            '#CC3366',
            '#CC3399',
            '#CC33CC',
            '#CC33FF',
            '#CC6600',
            '#CC6633',
            '#CC9900',
            '#CC9933',
            '#CCCC00',
            '#CCCC33',
            '#FF0000',
            '#FF0033',
            '#FF0066',
            '#FF0099',
            '#FF00CC',
            '#FF00FF',
            '#FF3300',
            '#FF3333',
            '#FF3366',
            '#FF3399',
            '#FF33CC',
            '#FF33FF',
            '#FF6600',
            '#FF6633',
            '#FF9900',
            '#FF9933',
            '#FFCC00',
            '#FFCC33',
          ]));
        function c() {
          if (
            typeof window < 'u' &&
            window.process &&
            (window.process.type === 'renderer' || window.process.__nwjs)
          )
            return !0;
          if (
            typeof navigator < 'u' &&
            navigator.userAgent &&
            navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
          )
            return !1;
          let v;
          return (
            (typeof document < 'u' &&
              document.documentElement &&
              document.documentElement.style &&
              document.documentElement.style.WebkitAppearance) ||
            (typeof window < 'u' &&
              window.console &&
              (window.console.firebug || (window.console.exception && window.console.table))) ||
            (typeof navigator < 'u' &&
              navigator.userAgent &&
              (v = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) &&
              parseInt(v[1], 10) >= 31) ||
            (typeof navigator < 'u' &&
              navigator.userAgent &&
              navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))
          );
        }
        function f(v) {
          if (
            ((v[0] =
              (this.useColors ? '%c' : '') +
              this.namespace +
              (this.useColors ? ' %c' : ' ') +
              v[0] +
              (this.useColors ? '%c ' : ' ') +
              '+' +
              a.exports.humanize(this.diff)),
            !this.useColors)
          )
            return;
          const E = 'color: ' + this.color;
          v.splice(1, 0, E, 'color: inherit');
          let g = 0,
            A = 0;
          (v[0].replace(/%[a-zA-Z%]/g, (R) => {
            R !== '%%' && (g++, R === '%c' && (A = g));
          }),
            v.splice(A, 0, E));
        }
        r.log = console.debug || console.log || (() => {});
        function y(v) {
          try {
            v ? r.storage.setItem('debug', v) : r.storage.removeItem('debug');
          } catch {}
        }
        function d() {
          let v;
          try {
            v = r.storage.getItem('debug') || r.storage.getItem('DEBUG');
          } catch {}
          return (!v && typeof process < 'u' && 'env' in process && (v = o.DEBUG), v);
        }
        function m() {
          try {
            return localStorage;
          } catch {}
        }
        a.exports = oE()(r);
        const { formatters: p } = a.exports;
        p.j = function (v) {
          try {
            return JSON.stringify(v);
          } catch (E) {
            return '[UnexpectedJSONParseError]: ' + E.message;
          }
        };
      })(Lo, Lo.exports)),
    Lo.exports
  );
}
var sE = cE();
const fE = Qu(sE),
  Xn = fE('ladle'),
  dE = '%[a-f0-9]{2}',
  Xh = new RegExp(`(${dE})+`, 'gi'),
  yE = /^[a-f\d]{2}$/i;
function Qh(a, r) {
  if (a.codePointAt(r) !== 37 || r + 3 > a.length) return;
  const o = a.slice(r + 1, r + 3);
  if (yE.test(o)) return { byte: Number.parseInt(o, 16), next: r + 3 };
}
function pE(a) {
  return a <= 127
    ? 1
    : a >= 194 && a <= 223
      ? 2
      : a >= 224 && a <= 239
        ? 3
        : a >= 240 && a <= 244
          ? 4
          : 0;
}
function gE(a) {
  return a >= 128 && a <= 191;
}
function hE(a) {
  try {
    return decodeURIComponent(a);
  } catch {
    let r = '',
      o = 0;
    for (; o < a.length;) {
      if (a.codePointAt(o) !== 37) {
        ((r += a.charAt(o)), o++);
        continue;
      }
      const c = Qh(a, o);
      if (!c) {
        ((r += a.charAt(o)), o++);
        continue;
      }
      const f = pE(c.byte);
      if (f === 0) {
        ((r += a.slice(o, o + 3)), (o += 3));
        continue;
      }
      let y = c.next,
        d = !0;
      for (let m = 1; m < f; m++) {
        const p = Qh(a, y);
        if (!p || !gE(p.byte)) {
          d = !1;
          break;
        }
        y = p.next;
      }
      if (d) {
        const m = a.slice(o, y);
        try {
          ((r += decodeURIComponent(m)), (o = y));
          continue;
        } catch {}
      }
      ((r += a.slice(o, o + 3)), (o += 3));
    }
    return r;
  }
}
function mE(a) {
  const r = { '%FE%FF': '��', '%FF%FE': '��' };
  let o = Xh.exec(a);
  for (; o;) {
    try {
      r[o[0]] = decodeURIComponent(o[0]);
    } catch {
      const f = hE(o[0]);
      f !== o[0] && (r[o[0]] = f);
    }
    o = Xh.exec(a);
  }
  r['%C2'] = '�';
  const c = Object.keys(r);
  for (const f of c) a = a.replace(new RegExp(f, 'g'), r[f]);
  return a;
}
function vE(a) {
  if (typeof a != 'string')
    throw new TypeError(`Expected \`encodedURI\` to be of type \`string\`, got \`${typeof a}\``);
  try {
    return decodeURIComponent(a);
  } catch {
    return mE(a);
  }
}
function bE(a, r) {
  const o = {};
  if (Array.isArray(r))
    for (const c of r) {
      const f = Object.getOwnPropertyDescriptor(a, c);
      f != null && f.enumerable && Object.defineProperty(o, c, f);
    }
  else
    for (const c of Reflect.ownKeys(a)) {
      const f = Object.getOwnPropertyDescriptor(a, c);
      if (f.enumerable) {
        const y = a[c];
        r(c, y, a) && Object.defineProperty(o, c, f);
      }
    }
  return o;
}
function Zm(a, r) {
  if (!(typeof a == 'string' && typeof r == 'string'))
    throw new TypeError('Expected the arguments to be of type `string`');
  if (a === '' || r === '') return [];
  const o = a.indexOf(r);
  return o === -1 ? [] : [a.slice(0, o), a.slice(o + r.length)];
}
const EE = (a) => a == null,
  SE = (a) =>
    encodeURIComponent(a).replaceAll(
      /[!'()*]/g,
      (r) => `%${r.charCodeAt(0).toString(16).toUpperCase()}`,
    ),
  od = Symbol('encodeFragmentIdentifier');
function _E(a) {
  switch (a.arrayFormat) {
    case 'index':
      return (r) => (o, c) => {
        const f = o.length;
        return c === void 0 || (a.skipNull && c === null) || (a.skipEmptyString && c === '')
          ? o
          : c === null
            ? (o.push([gt(r, a), '[', f, ']'].join('')), o)
            : (o.push([gt(r, a), '[', gt(f, a), ']=', gt(c, a)].join('')), o);
      };
    case 'bracket':
      return (r) => (o, c) =>
        c === void 0 || (a.skipNull && c === null) || (a.skipEmptyString && c === '')
          ? o
          : c === null
            ? (o.push([gt(r, a), '[]'].join('')), o)
            : (o.push([gt(r, a), '[]=', gt(c, a)].join('')), o);
    case 'colon-list-separator':
      return (r) => (o, c) =>
        c === void 0 || (a.skipNull && c === null) || (a.skipEmptyString && c === '')
          ? o
          : c === null
            ? (o.push([gt(r, a), ':list='].join('')), o)
            : (o.push([gt(r, a), ':list=', gt(c, a)].join('')), o);
    case 'comma':
    case 'separator':
    case 'bracket-separator': {
      const r = a.arrayFormat === 'bracket-separator' ? '[]=' : '=';
      return (o) => (c, f) =>
        f === void 0 || (a.skipNull && f === null) || (a.skipEmptyString && f === '')
          ? c
          : ((f = f === null ? '' : f),
            c.length === 0 ? (c.push([gt(o, a), r, gt(f, a)].join('')), c) : (c.push(gt(f, a)), c));
    }
    default:
      return (r) => (o, c) =>
        c === void 0 || (a.skipNull && c === null) || (a.skipEmptyString && c === '')
          ? o
          : c === null
            ? (o.push(gt(r, a)), o)
            : (o.push([gt(r, a), '=', gt(c, a)].join('')), o);
  }
}
function TE(a) {
  let r;
  switch (a.arrayFormat) {
    case 'index':
      return (o, c, f) => {
        if (((r = /\[(\d*)]$/.exec(o)), (o = o.replace(/\[\d*]$/, '')), !r)) {
          f[o] = c;
          return;
        }
        (f[o] === void 0 && (f[o] = {}), (f[o][r[1]] = c));
      };
    case 'bracket':
      return (o, c, f) => {
        if (((r = /(\[])$/.exec(o)), (o = o.replace(/\[]$/, '')), !r)) {
          f[o] = c;
          return;
        }
        if (f[o] === void 0) {
          f[o] = [c];
          return;
        }
        if (!Array.isArray(f[o])) {
          f[o] = [f[o], c];
          return;
        }
        f[o].push(c);
      };
    case 'colon-list-separator':
      return (o, c, f) => {
        if (((r = /(:list)$/.exec(o)), (o = o.replace(/:list$/, '')), !r)) {
          f[o] = c;
          return;
        }
        if (f[o] === void 0) {
          f[o] = [c];
          return;
        }
        if (!Array.isArray(f[o])) {
          f[o] = [f[o], c];
          return;
        }
        f[o].push(c);
      };
    case 'comma':
    case 'separator':
      return (o, c, f) => {
        const d =
          typeof c == 'string' && c.includes(a.arrayFormatSeparator)
            ? c.split(a.arrayFormatSeparator).map((m) => Da(m, a))
            : c === null
              ? c
              : Da(c, a);
        f[o] = d;
      };
    case 'bracket-separator':
      return (o, c, f) => {
        const y = /(\[])$/.test(o);
        if (((o = o.replace(/\[]$/, '')), !y)) {
          f[o] = c && Da(c, a);
          return;
        }
        const d = c === null ? [] : Da(c, a).split(a.arrayFormatSeparator);
        if (f[o] === void 0) {
          f[o] = d;
          return;
        }
        Array.isArray(f[o]) || (f[o] = [f[o]]);
        for (const m of d) f[o].push(m);
      };
    default:
      return (o, c, f) => {
        if (f[o] === void 0) {
          f[o] = c;
          return;
        }
        if (Array.isArray(f[o])) {
          f[o].push(c);
          return;
        }
        f[o] = [f[o], c];
      };
  }
}
function Xm(a) {
  if (typeof a != 'string' || a.length !== 1)
    throw new TypeError('arrayFormatSeparator must be single character string');
}
function gt(a, r) {
  return r.encode ? (r.strict ? SE(a) : encodeURIComponent(a)) : a;
}
function Da(a, r) {
  return r.decode ? vE(a) : a;
}
function Qm(a) {
  return Array.isArray(a)
    ? a.sort()
    : typeof a == 'object'
      ? Qm(Object.keys(a))
          .sort((r, o) => Number(r) - Number(o))
          .map((r) => a[r])
      : a;
}
function $m(a) {
  const r = a.indexOf('#');
  return (r !== -1 && (a = a.slice(0, r)), a);
}
function OE(a) {
  let r = '';
  const o = a.indexOf('#');
  return (o !== -1 && (r = a.slice(o)), r);
}
function Km(a) {
  const r = a.indexOf('?');
  return r === -1 ? a : a.slice(0, r);
}
function $h(a, r, o) {
  return o === 'string' && typeof a == 'string'
    ? a
    : typeof o == 'function' && typeof a == 'string'
      ? o(a)
      : o === 'boolean' && a === null
        ? !0
        : o === 'boolean' &&
            a !== null &&
            (a.toLowerCase() === 'true' || a.toLowerCase() === 'false')
          ? a.toLowerCase() === 'true'
          : o === 'boolean' && a !== null && (a.toLowerCase() === '1' || a.toLowerCase() === '0')
            ? a.toLowerCase() === '1'
            : o === 'string[]' && r.arrayFormat !== 'none' && typeof a == 'string'
              ? [a]
              : o === 'number[]' &&
                  r.arrayFormat !== 'none' &&
                  !Number.isNaN(Number(a)) &&
                  typeof a == 'string' &&
                  a.trim() !== ''
                ? [Number(a)]
                : o === 'number' &&
                    !Number.isNaN(Number(a)) &&
                    typeof a == 'string' &&
                    a.trim() !== ''
                  ? Number(a)
                  : r.parseBooleans &&
                      a !== null &&
                      (a.toLowerCase() === 'true' || a.toLowerCase() === 'false')
                    ? a.toLowerCase() === 'true'
                    : r.parseNumbers &&
                        !Number.isNaN(Number(a)) &&
                        typeof a == 'string' &&
                        a.trim() !== ''
                      ? Number(a)
                      : a;
}
function Dd(a) {
  a = $m(a);
  const r = a.indexOf('?');
  return r === -1 ? '' : a.slice(r + 1);
}
function jd(a, r) {
  ((r = {
    decode: !0,
    sort: !0,
    arrayFormat: 'none',
    arrayFormatSeparator: ',',
    parseNumbers: !1,
    parseBooleans: !1,
    types: Object.create(null),
    ...r,
  }),
    Xm(r.arrayFormatSeparator));
  const o = TE(r),
    c = Object.create(null);
  if (typeof a != 'string' || ((a = a.trim().replace(/^[?#&]/, '')), !a) || /^&+$/.test(a))
    return c;
  let f = 0,
    y = a.indexOf('&');
  y === -1 && (y = a.length);
  for (let d = y; d <= a.length; d++) {
    if (d < a.length && a[d] !== '&') continue;
    if (d === f) {
      f = d + 1;
      continue;
    }
    const m = a.slice(f, d),
      p = r.decode ? m.replaceAll('+', ' ') : m;
    let [v, E] = Zm(p, '=');
    (v === void 0 && (v = p),
      (E =
        E === void 0
          ? null
          : ['comma', 'separator', 'bracket-separator'].includes(r.arrayFormat)
            ? E
            : Da(E, r)),
      o(Da(v, r), E, c),
      (f = d + 1));
  }
  for (const [d, m] of Object.entries(c))
    if (typeof m == 'object' && m !== null && r.types[d] !== 'string')
      for (const [p, v] of Object.entries(m)) {
        const E = r.types[d],
          g = typeof E == 'function' ? E : E ? E.replace('[]', '') : void 0;
        m[p] = $h(v, r, g);
      }
    else
      typeof m == 'object' && m !== null && r.types[d] === 'string'
        ? (c[d] = Object.values(m).join(r.arrayFormatSeparator))
        : (c[d] = $h(m, r, r.types[d]));
  return r.sort === !1
    ? c
    : (r.sort === !0 ? Object.keys(c).sort() : Object.keys(c).sort(r.sort)).reduce((d, m) => {
        const p = c[m];
        return ((d[m] = p && typeof p == 'object' && !Array.isArray(p) ? Qm(p) : p), d);
      }, Object.create(null));
}
function Jm(a, r) {
  if (!a) return '';
  ((r = { encode: !0, strict: !0, arrayFormat: 'none', arrayFormatSeparator: ',', ...r }),
    Xm(r.arrayFormatSeparator));
  const o = (d) => (r.skipNull && EE(a[d])) || (r.skipEmptyString && a[d] === ''),
    c = _E(r),
    f = {};
  for (const [d, m] of Object.entries(a)) o(d) || (f[d] = m);
  const y = Object.keys(f);
  return (
    r.sort !== !1 && y.sort(r.sort),
    y
      .map((d) => {
        let m = a[d];
        if ((r.replacer && ((m = r.replacer(d, m)), m === void 0)) || m === void 0) return '';
        if (m === null) return gt(d, r);
        if (Array.isArray(m)) {
          if (m.length === 0 && r.arrayFormat === 'bracket-separator') return gt(d, r) + '[]';
          let p = m;
          r.replacer &&
            (p = m.map((g, A) => r.replacer(`${d}[${A}]`, g)).filter((g) => g !== void 0));
          const v = p.reduce(c(d), []),
            E = ['comma', 'separator', 'bracket-separator'].includes(r.arrayFormat)
              ? r.arrayFormatSeparator
              : '&';
          return v.join(E);
        }
        return gt(d, r) + '=' + gt(m, r);
      })
      .filter((d) => d.length > 0)
      .join('&')
  );
}
function Pm(a, r) {
  r = { decode: !0, ...r };
  let [o, c] = Zm(a, '#');
  return (
    o === void 0 && (o = a),
    {
      url: Km(o ?? ''),
      query: jd(Dd(a), r),
      ...(r && r.parseFragmentIdentifier && c ? { fragmentIdentifier: Da(c, r) } : {}),
    }
  );
}
function Wm(a, r) {
  r = { encode: !0, strict: !0, [od]: !0, ...r };
  const o = Km($m(a.url)) || '',
    c = Dd(a.url),
    f = { ...jd(c, { sort: !1, ...r }), ...a.query };
  let y = Jm(f, r);
  y && (y = `?${y}`);
  let d = OE(a.url);
  if (typeof a.fragmentIdentifier == 'string' && ((d = `#${a.fragmentIdentifier}`), r[od])) {
    const m = new URL('https://query-string.invalid');
    ((m.hash = d), (d = m.hash));
  }
  return `${o}${y}${d}`;
}
function cd(a, r, o) {
  o = { parseFragmentIdentifier: !0, [od]: !1, ...o };
  const { url: c, query: f, fragmentIdentifier: y } = Pm(a, o);
  return Wm({ url: c, query: bE(f, r), fragmentIdentifier: y }, o);
}
function AE(a, r, o) {
  if (Array.isArray(r)) {
    const c = new Set(r);
    return cd(a, (f) => !c.has(f), o);
  }
  return cd(a, (c, f) => !r(c, f), o);
}
const Kn = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        exclude: AE,
        extract: Dd,
        parse: jd,
        parseUrl: Pm,
        pick: cd,
        stringify: Jm,
        stringifyUrl: Wm,
      },
      Symbol.toStringTag,
      { value: 'Module' },
    ),
  ),
  jr = '-',
  e0 = (a, r) => Kn.parse(a).story || r,
  xE = (a) => !!Kn.parse(a).story,
  t0 = (a) => (typeof a != 'string' ? '' : a.charAt(0).toUpperCase() + a.slice(1)),
  n0 = (a) =>
    a
      ? a
          .split(`${jr}${jr}`)
          .reverse()
          .map((r) => t0(r.replace(/-/g, ' ')))
          .join(' - ')
      : '',
  Ff = (a, r, o) => {
    const c = [],
      f = (d, m, p, v) => {
        const E = m.shift();
        let g = !!o,
          A = [];
        p[0] === E && ((A = [...p.slice(1)]), (g = !0));
        const R = d.findIndex((x) => x.subId === E);
        E &&
          (R === -1 &&
            d.push({
              id: `${v}${E}`,
              subId: E,
              name: t0(E.replace(/-/g, ' ')),
              isLinkable: m.length === 0,
              isExpanded: g,
              isFocused: !1,
              children: [],
            }),
          f(d[R > -1 ? R : d.length - 1].children, m, A, `${v}${E}--`));
      },
      y = r ? r.split(`${jr}${jr}`) : [];
    return (
      a.forEach((d) => {
        const m = d.split(`${jr}${jr}`);
        f(c, m, y, '');
      }),
      c
    );
  },
  CE = (a, r) => {
    const o = a.split('--'),
      c = r.split('--'),
      f = Math.min(o.length, c.length);
    for (let y = 0; y < f; y++)
      if (o[y] !== c[y])
        return !o[y + 1] && c[y + 1]
          ? 1
          : (o[y + 1] && !c[y + 1]) || [o[y], c[y]].sort()[0] === o[y]
            ? -1
            : 1;
    return 0;
  },
  l0 = (a, r) => {
    const o = a.sort(CE);
    let c = [...o];
    Array.isArray(r) ? (c = r) : (c = r(o));
    const f = new Set();
    return (
      c.forEach((y) => {
        const d = y.toLowerCase();
        if (d.includes('*')) {
          const m = d.split('*')[0];
          o.forEach((p) => {
            p.startsWith(m) && f.add(p);
          });
        } else {
          if (!o.includes(d))
            throw new Error(
              `Story "${y}" does not exist in your storybook. Please check your storyOrder config.`,
            );
          f.add(d);
        }
      }),
      [...f]
    );
  };
var Gu = { exports: {} };
Gu.exports;
var Kh;
function wE() {
  return (
    Kh ||
      ((Kh = 1),
      (function (a, r) {
        var o = 200,
          c = '__lodash_hash_undefined__',
          f = 800,
          y = 16,
          d = 9007199254740991,
          m = '[object Arguments]',
          p = '[object Array]',
          v = '[object AsyncFunction]',
          E = '[object Boolean]',
          g = '[object Date]',
          A = '[object Error]',
          R = '[object Function]',
          x = '[object GeneratorFunction]',
          S = '[object Map]',
          _ = '[object Number]',
          k = '[object Null]',
          B = '[object Object]',
          q = '[object Proxy]',
          W = '[object RegExp]',
          te = '[object Set]',
          ee = '[object String]',
          Z = '[object Undefined]',
          K = '[object WeakMap]',
          ce = '[object ArrayBuffer]',
          he = '[object DataView]',
          Ee = '[object Float32Array]',
          G = '[object Float64Array]',
          ae = '[object Int8Array]',
          ue = '[object Int16Array]',
          ie = '[object Int32Array]',
          I = '[object Uint8Array]',
          P = '[object Uint8ClampedArray]',
          J = '[object Uint16Array]',
          se = '[object Uint32Array]',
          le = /[\\^$.*+?()[\]{}|]/g,
          xe = /^\[object .+?Constructor\]$/,
          je = /^(?:0|[1-9]\d*)$/,
          be = {};
        ((be[Ee] = be[G] = be[ae] = be[ue] = be[ie] = be[I] = be[P] = be[J] = be[se] = !0),
          (be[m] =
            be[p] =
            be[ce] =
            be[E] =
            be[he] =
            be[g] =
            be[A] =
            be[R] =
            be[S] =
            be[_] =
            be[B] =
            be[W] =
            be[te] =
            be[ee] =
            be[K] =
              !1));
        var C = typeof Mo == 'object' && Mo && Mo.Object === Object && Mo,
          $ = typeof self == 'object' && self && self.Object === Object && self,
          re = C || $ || Function('return this')(),
          oe = r && !r.nodeType && r,
          Te = oe && !0 && a && !a.nodeType && a,
          Re = Te && Te.exports === oe,
          Le = Re && C.process,
          de = (function () {
            try {
              var T = Te && Te.require && Te.require('util').types;
              return T || (Le && Le.binding && Le.binding('util'));
            } catch {}
          })(),
          Se = de && de.isTypedArray;
        function Xt(T, N, F) {
          switch (F.length) {
            case 0:
              return T.call(N);
            case 1:
              return T.call(N, F[0]);
            case 2:
              return T.call(N, F[0], F[1]);
            case 3:
              return T.call(N, F[0], F[1], F[2]);
          }
          return T.apply(N, F);
        }
        function me(T, N) {
          for (var F = -1, ye = Array(T); ++F < T;) ye[F] = N(F);
          return ye;
        }
        function Qt(T) {
          return function (N) {
            return T(N);
          };
        }
        function Nt(T, N) {
          return T == null ? void 0 : T[N];
        }
        function lt(T, N) {
          return function (F) {
            return T(N(F));
          };
        }
        var Ke = Array.prototype,
          rn = Function.prototype,
          Mn = Object.prototype,
          un = re['__core-js_shared__'],
          Jn = rn.toString,
          $t = Mn.hasOwnProperty,
          Pn = (function () {
            var T = /[^.]+$/.exec((un && un.keys && un.keys.IE_PROTO) || '');
            return T ? 'Symbol(src)_1.' + T : '';
          })(),
          La = Mn.toString,
          za = Jn.call(Object),
          Vr = RegExp(
            '^' +
              Jn.call($t)
                .replace(le, '\\$&')
                .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') +
              '$',
          ),
          Pl = Re ? re.Buffer : void 0,
          Sn = re.Symbol,
          Ua = re.Uint8Array;
        Pl && Pl.allocUnsafe;
        var Ba = lt(Object.getPrototypeOf, Object),
          Ku = Object.create,
          Ju = Mn.propertyIsEnumerable,
          Ir = Ke.splice,
          _n = Sn ? Sn.toStringTag : void 0,
          gl = (function () {
            try {
              var T = Va(Object, 'defineProperty');
              return (T({}, '', {}), T);
            } catch {}
          })(),
          uc = Pl ? Pl.isBuffer : void 0,
          Pu = Math.max,
          Dt = Date.now,
          Wu = Va(re, 'Map'),
          hl = Va(Object, 'create'),
          ei = (function () {
            function T() {}
            return function (N) {
              if (!An(N)) return {};
              if (Ku) return Ku(N);
              T.prototype = N;
              var F = new T();
              return ((T.prototype = void 0), F);
            };
          })();
        function on(T) {
          var N = -1,
            F = T == null ? 0 : T.length;
          for (this.clear(); ++N < F;) {
            var ye = T[N];
            this.set(ye[0], ye[1]);
          }
        }
        function ic() {
          ((this.__data__ = hl ? hl(null) : {}), (this.size = 0));
        }
        function ti(T) {
          var N = this.has(T) && delete this.__data__[T];
          return ((this.size -= N ? 1 : 0), N);
        }
        function oc(T) {
          var N = this.__data__;
          if (hl) {
            var F = N[T];
            return F === c ? void 0 : F;
          }
          return $t.call(N, T) ? N[T] : void 0;
        }
        function cc(T) {
          var N = this.__data__;
          return hl ? N[T] !== void 0 : $t.call(N, T);
        }
        function Wl(T, N) {
          var F = this.__data__;
          return ((this.size += this.has(T) ? 0 : 1), (F[T] = hl && N === void 0 ? c : N), this);
        }
        ((on.prototype.clear = ic),
          (on.prototype.delete = ti),
          (on.prototype.get = oc),
          (on.prototype.has = cc),
          (on.prototype.set = Wl));
        function at(T) {
          var N = -1,
            F = T == null ? 0 : T.length;
          for (this.clear(); ++N < F;) {
            var ye = T[N];
            this.set(ye[0], ye[1]);
          }
        }
        function Ln() {
          ((this.__data__ = []), (this.size = 0));
        }
        function jt(T) {
          var N = this.__data__,
            F = ml(N, T);
          if (F < 0) return !1;
          var ye = N.length - 1;
          return (F == ye ? N.pop() : Ir.call(N, F, 1), --this.size, !0);
        }
        function sc(T) {
          var N = this.__data__,
            F = ml(N, T);
          return F < 0 ? void 0 : N[F][1];
        }
        function fc(T) {
          return ml(this.__data__, T) > -1;
        }
        function dc(T, N) {
          var F = this.__data__,
            ye = ml(F, T);
          return (ye < 0 ? (++this.size, F.push([T, N])) : (F[ye][1] = N), this);
        }
        ((at.prototype.clear = Ln),
          (at.prototype.delete = jt),
          (at.prototype.get = sc),
          (at.prototype.has = fc),
          (at.prototype.set = dc));
        function Tn(T) {
          var N = -1,
            F = T == null ? 0 : T.length;
          for (this.clear(); ++N < F;) {
            var ye = T[N];
            this.set(ye[0], ye[1]);
          }
        }
        function ka() {
          ((this.size = 0),
            (this.__data__ = { hash: new on(), map: new (Wu || at)(), string: new on() }));
        }
        function Ha(T) {
          var N = rt(this, T).delete(T);
          return ((this.size -= N ? 1 : 0), N);
        }
        function Wn(T) {
          return rt(this, T).get(T);
        }
        function Fa(T) {
          return rt(this, T).has(T);
        }
        function ea(T, N) {
          var F = rt(this, T),
            ye = F.size;
          return (F.set(T, N), (this.size += F.size == ye ? 0 : 1), this);
        }
        ((Tn.prototype.clear = ka),
          (Tn.prototype.delete = Ha),
          (Tn.prototype.get = Wn),
          (Tn.prototype.has = Fa),
          (Tn.prototype.set = ea));
        function el(T) {
          var N = (this.__data__ = new at(T));
          this.size = N.size;
        }
        function yc() {
          ((this.__data__ = new at()), (this.size = 0));
        }
        function ni(T) {
          var N = this.__data__,
            F = N.delete(T);
          return ((this.size = N.size), F);
        }
        function Zr(T) {
          return this.__data__.get(T);
        }
        function ta(T) {
          return this.__data__.has(T);
        }
        function pc(T, N) {
          var F = this.__data__;
          if (F instanceof at) {
            var ye = F.__data__;
            if (!Wu || ye.length < o - 1) return (ye.push([T, N]), (this.size = ++F.size), this);
            F = this.__data__ = new Tn(ye);
          }
          return (F.set(T, N), (this.size = F.size), this);
        }
        ((el.prototype.clear = yc),
          (el.prototype.delete = ni),
          (el.prototype.get = Zr),
          (el.prototype.has = ta),
          (el.prototype.set = pc));
        function li(T, N) {
          var F = ia(T),
            ye = !F && $r(T),
            Me = !F && !ye && Lt(T),
            Fe = !F && !ye && !Me && Jr(T),
            Ve = F || ye || Me || Fe,
            Ge = Ve ? me(T.length, String) : [],
            Je = Ge.length;
          for (var Gt in T)
            (Ve &&
              (Gt == 'length' ||
                (Me && (Gt == 'offset' || Gt == 'parent')) ||
                (Fe && (Gt == 'buffer' || Gt == 'byteLength' || Gt == 'byteOffset')) ||
                zn(Gt, Je))) ||
              Ge.push(Gt);
          return Ge;
        }
        function Ga(T, N, F) {
          ((F !== void 0 && !ua(T[N], F)) || (F === void 0 && !(N in T))) && na(T, N, F);
        }
        function ai(T, N, F) {
          var ye = T[N];
          (!($t.call(T, N) && ua(ye, F)) || (F === void 0 && !(N in T))) && na(T, N, F);
        }
        function ml(T, N) {
          for (var F = T.length; F--;) if (ua(T[F][0], N)) return F;
          return -1;
        }
        function na(T, N, F) {
          N == '__proto__' && gl
            ? gl(T, N, { configurable: !0, enumerable: !0, value: F, writable: !0 })
            : (T[N] = F);
        }
        var ri = El();
        function la(T) {
          return T == null ? (T === void 0 ? Z : k) : _n && _n in Object(T) ? ii(T) : He(T);
        }
        function cn(T) {
          return sn(T) && la(T) == m;
        }
        function ht(T) {
          if (!An(T) || ci(T)) return !1;
          var N = oa(T) ? Vr : xe;
          return N.test(Mt(T));
        }
        function wt(T) {
          return sn(T) && Kr(T.length) && !!be[la(T)];
        }
        function vl(T) {
          if (!An(T)) return vc(T);
          var N = Qr(T),
            F = [];
          for (var ye in T) (ye == 'constructor' && (N || !$t.call(T, ye))) || F.push(ye);
          return F;
        }
        function Xr(T, N, F, ye, Me) {
          T !== N &&
            ri(
              N,
              function (Fe, Ve) {
                if ((Me || (Me = new el()), An(Fe))) gc(T, N, Ve, F, Xr, ye, Me);
                else {
                  var Ge = ye ? ye(_l(T, Ve), Fe, Ve + '', T, N, Me) : void 0;
                  (Ge === void 0 && (Ge = Fe), Ga(T, Ve, Ge));
                }
              },
              di,
            );
        }
        function gc(T, N, F, ye, Me, Fe, Ve) {
          var Ge = _l(T, F),
            Je = _l(N, F),
            Gt = Ve.get(Je);
          if (Gt) {
            Ga(T, F, Gt);
            return;
          }
          var mt = Fe ? Fe(Ge, Je, F + '', T, N, Ve) : void 0,
            zt = mt === void 0;
          if (zt) {
            var ca = ia(Je),
              nl = !ca && Lt(Je),
              xn = !ca && !nl && Jr(Je);
            ((mt = Je),
              ca || nl || xn
                ? ia(Ge)
                  ? (mt = Ge)
                  : bc(Ge)
                    ? (mt = tl(Ge))
                    : nl
                      ? ((zt = !1), (mt = aa(Je)))
                      : xn
                        ? ((zt = !1), (mt = Ya(Je)))
                        : (mt = [])
                : fi(Je) || $r(Je)
                  ? ((mt = Ge), $r(Ge) ? (mt = Tl(Ge)) : (!An(Ge) || oa(Ge)) && (mt = oi(Je)))
                  : (zt = !1));
          }
          (zt && (Ve.set(Je, mt), Me(mt, Je, ye, Fe, Ve), Ve.delete(Je)), Ga(T, F, mt));
        }
        function hc(T, N) {
          return Ia(si(T, N, Xa), T + '');
        }
        var ui = gl
          ? function (T, N) {
              return gl(T, 'toString', {
                configurable: !0,
                enumerable: !1,
                value: pi(N),
                writable: !0,
              });
            }
          : Xa;
        function aa(T, N) {
          return T.slice();
        }
        function qa(T) {
          var N = new T.constructor(T.byteLength);
          return (new Ua(N).set(new Ua(T)), N);
        }
        function Ya(T, N) {
          var F = qa(T.buffer);
          return new T.constructor(F, T.byteOffset, T.length);
        }
        function tl(T, N) {
          var F = -1,
            ye = T.length;
          for (N || (N = Array(ye)); ++F < ye;) N[F] = T[F];
          return N;
        }
        function bl(T, N, F, ye) {
          var Me = !F;
          F || (F = {});
          for (var Fe = -1, Ve = N.length; ++Fe < Ve;) {
            var Ge = N[Fe],
              Je = void 0;
            (Je === void 0 && (Je = T[Ge]), Me ? na(F, Ge, Je) : ai(F, Ge, Je));
          }
          return F;
        }
        function ra(T) {
          return hc(function (N, F) {
            var ye = -1,
              Me = F.length,
              Fe = Me > 1 ? F[Me - 1] : void 0,
              Ve = Me > 2 ? F[2] : void 0;
            for (
              Fe = T.length > 3 && typeof Fe == 'function' ? (Me--, Fe) : void 0,
                Ve && Sl(F[0], F[1], Ve) && ((Fe = Me < 3 ? void 0 : Fe), (Me = 1)),
                N = Object(N);
              ++ye < Me;
            ) {
              var Ge = F[ye];
              Ge && T(N, Ge, ye, Fe);
            }
            return N;
          });
        }
        function El(T) {
          return function (N, F, ye) {
            for (var Me = -1, Fe = Object(N), Ve = ye(N), Ge = Ve.length; Ge--;) {
              var Je = Ve[++Me];
              if (F(Fe[Je], Je, Fe) === !1) break;
            }
            return N;
          };
        }
        function rt(T, N) {
          var F = T.__data__;
          return mc(N) ? F[typeof N == 'string' ? 'string' : 'hash'] : F.map;
        }
        function Va(T, N) {
          var F = Nt(T, N);
          return ht(F) ? F : void 0;
        }
        function ii(T) {
          var N = $t.call(T, _n),
            F = T[_n];
          try {
            T[_n] = void 0;
            var ye = !0;
          } catch {}
          var Me = La.call(T);
          return (ye && (N ? (T[_n] = F) : delete T[_n]), Me);
        }
        function oi(T) {
          return typeof T.constructor == 'function' && !Qr(T) ? ei(Ba(T)) : {};
        }
        function zn(T, N) {
          var F = typeof T;
          return (
            (N = N ?? d),
            !!N && (F == 'number' || (F != 'symbol' && je.test(T))) && T > -1 && T % 1 == 0 && T < N
          );
        }
        function Sl(T, N, F) {
          if (!An(F)) return !1;
          var ye = typeof N;
          return (ye == 'number' ? Za(F) && zn(N, F.length) : ye == 'string' && N in F)
            ? ua(F[N], T)
            : !1;
        }
        function mc(T) {
          var N = typeof T;
          return N == 'string' || N == 'number' || N == 'symbol' || N == 'boolean'
            ? T !== '__proto__'
            : T === null;
        }
        function ci(T) {
          return !!Pn && Pn in T;
        }
        function Qr(T) {
          var N = T && T.constructor,
            F = (typeof N == 'function' && N.prototype) || Mn;
          return T === F;
        }
        function vc(T) {
          var N = [];
          if (T != null) for (var F in Object(T)) N.push(F);
          return N;
        }
        function He(T) {
          return La.call(T);
        }
        function si(T, N, F) {
          return (
            (N = Pu(N === void 0 ? T.length - 1 : N, 0)),
            function () {
              for (
                var ye = arguments, Me = -1, Fe = Pu(ye.length - N, 0), Ve = Array(Fe);
                ++Me < Fe;
              )
                Ve[Me] = ye[N + Me];
              Me = -1;
              for (var Ge = Array(N + 1); ++Me < N;) Ge[Me] = ye[Me];
              return ((Ge[N] = F(Ve)), Xt(T, this, Ge));
            }
          );
        }
        function _l(T, N) {
          if (!(N === 'constructor' && typeof T[N] == 'function') && N != '__proto__') return T[N];
        }
        var Ia = On(ui);
        function On(T) {
          var N = 0,
            F = 0;
          return function () {
            var ye = Dt(),
              Me = y - (ye - F);
            if (((F = ye), Me > 0)) {
              if (++N >= f) return arguments[0];
            } else N = 0;
            return T.apply(void 0, arguments);
          };
        }
        function Mt(T) {
          if (T != null) {
            try {
              return Jn.call(T);
            } catch {}
            try {
              return T + '';
            } catch {}
          }
          return '';
        }
        function ua(T, N) {
          return T === N || (T !== T && N !== N);
        }
        var $r = cn(
            (function () {
              return arguments;
            })(),
          )
            ? cn
            : function (T) {
                return sn(T) && $t.call(T, 'callee') && !Ju.call(T, 'callee');
              },
          ia = Array.isArray;
        function Za(T) {
          return T != null && Kr(T.length) && !oa(T);
        }
        function bc(T) {
          return sn(T) && Za(T);
        }
        var Lt = uc || Ec;
        function oa(T) {
          if (!An(T)) return !1;
          var N = la(T);
          return N == R || N == x || N == v || N == q;
        }
        function Kr(T) {
          return typeof T == 'number' && T > -1 && T % 1 == 0 && T <= d;
        }
        function An(T) {
          var N = typeof T;
          return T != null && (N == 'object' || N == 'function');
        }
        function sn(T) {
          return T != null && typeof T == 'object';
        }
        function fi(T) {
          if (!sn(T) || la(T) != B) return !1;
          var N = Ba(T);
          if (N === null) return !0;
          var F = $t.call(N, 'constructor') && N.constructor;
          return typeof F == 'function' && F instanceof F && Jn.call(F) == za;
        }
        var Jr = Se ? Qt(Se) : wt;
        function Tl(T) {
          return bl(T, di(T));
        }
        function di(T) {
          return Za(T) ? li(T) : vl(T);
        }
        var yi = ra(function (T, N, F) {
          Xr(T, N, F);
        });
        function pi(T) {
          return function () {
            return T;
          };
        }
        function Xa(T) {
          return T;
        }
        function Ec() {
          return !1;
        }
        a.exports = yi;
      })(Gu, Gu.exports)),
    Gu.exports
  );
}
var RE = wE();
const NE = Qu(RE),
  DE = 'modulepreload',
  jE = function (a) {
    return '/' + a;
  },
  Jh = {},
  qr = function (r, o, c) {
    let f = Promise.resolve();
    if (o && o.length > 0) {
      let d = function (v) {
        return Promise.all(
          v.map((E) =>
            Promise.resolve(E).then(
              (g) => ({ status: 'fulfilled', value: g }),
              (g) => ({ status: 'rejected', reason: g }),
            ),
          ),
        );
      };
      document.getElementsByTagName('link');
      const m = document.querySelector('meta[property=csp-nonce]'),
        p = (m == null ? void 0 : m.nonce) || (m == null ? void 0 : m.getAttribute('nonce'));
      f = d(
        o.map((v) => {
          if (((v = jE(v)), v in Jh)) return;
          Jh[v] = !0;
          const E = v.endsWith('.css'),
            g = E ? '[rel="stylesheet"]' : '';
          if (document.querySelector(`link[href="${v}"]${g}`)) return;
          const A = document.createElement('link');
          if (
            ((A.rel = E ? 'stylesheet' : DE),
            E || (A.as = 'script'),
            (A.crossOrigin = ''),
            (A.href = v),
            p && A.setAttribute('nonce', p),
            document.head.appendChild(A),
            E)
          )
            return new Promise((R, x) => {
              (A.addEventListener('load', R),
                A.addEventListener('error', () => x(new Error(`Unable to preload CSS for ${v}`))));
            });
        }),
      );
    }
    function y(d) {
      const m = new Event('vite:preloadError', { cancelable: !0 });
      if (((m.payload = d), window.dispatchEvent(m), !m.defaultPrevented)) throw d;
    }
    return f.then((d) => {
      for (const m of d || []) m.status === 'rejected' && y(m.reason);
      return r().catch(y);
    });
  };
var Gf = { exports: {} },
  Oe = {};
/**
 * @license React
 * react.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ph;
function ME() {
  if (Ph) return Oe;
  Ph = 1;
  var a = Symbol.for('react.transitional.element'),
    r = Symbol.for('react.portal'),
    o = Symbol.for('react.fragment'),
    c = Symbol.for('react.strict_mode'),
    f = Symbol.for('react.profiler'),
    y = Symbol.for('react.consumer'),
    d = Symbol.for('react.context'),
    m = Symbol.for('react.forward_ref'),
    p = Symbol.for('react.suspense'),
    v = Symbol.for('react.memo'),
    E = Symbol.for('react.lazy'),
    g = Symbol.for('react.activity'),
    A = Symbol.for('react.view_transition'),
    R = Symbol.iterator;
  function x(C) {
    return C === null || typeof C != 'object'
      ? null
      : ((C = (R && C[R]) || C['@@iterator']), typeof C == 'function' ? C : null);
  }
  var S = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {},
    },
    _ = Object.assign,
    k = {};
  function B(C, $, re) {
    ((this.props = C), (this.context = $), (this.refs = k), (this.updater = re || S));
  }
  ((B.prototype.isReactComponent = {}),
    (B.prototype.setState = function (C, $) {
      if (typeof C != 'object' && typeof C != 'function' && C != null)
        throw Error(
          'takes an object of state variables to update or a function which returns an object of state variables.',
        );
      this.updater.enqueueSetState(this, C, $, 'setState');
    }),
    (B.prototype.forceUpdate = function (C) {
      this.updater.enqueueForceUpdate(this, C, 'forceUpdate');
    }));
  function q() {}
  q.prototype = B.prototype;
  function W(C, $, re) {
    ((this.props = C), (this.context = $), (this.refs = k), (this.updater = re || S));
  }
  var te = (W.prototype = new q());
  ((te.constructor = W), _(te, B.prototype), (te.isPureReactComponent = !0));
  var ee = Array.isArray;
  function Z() {}
  var K = { H: null, A: null, T: null, S: null },
    ce = Object.prototype.hasOwnProperty;
  function he(C, $, re) {
    var oe = re.ref;
    return { $$typeof: a, type: C, key: $, ref: oe !== void 0 ? oe : null, props: re };
  }
  function Ee(C, $) {
    return he(C.type, $, C.props);
  }
  function G(C) {
    return typeof C == 'object' && C !== null && C.$$typeof === a;
  }
  function ae(C) {
    var $ = { '=': '=0', ':': '=2' };
    return (
      '$' +
      C.replace(/[=:]/g, function (re) {
        return $[re];
      })
    );
  }
  var ue = /\/+/g;
  function ie(C, $) {
    return typeof C == 'object' && C !== null && C.key != null ? ae('' + C.key) : $.toString(36);
  }
  function I(C) {
    switch (C.status) {
      case 'fulfilled':
        return C.value;
      case 'rejected':
        throw C.reason;
      default:
        switch (
          (typeof C.status == 'string'
            ? C.then(Z, Z)
            : ((C.status = 'pending'),
              C.then(
                function ($) {
                  C.status === 'pending' && ((C.status = 'fulfilled'), (C.value = $));
                },
                function ($) {
                  C.status === 'pending' && ((C.status = 'rejected'), (C.reason = $));
                },
              )),
          C.status)
        ) {
          case 'fulfilled':
            return C.value;
          case 'rejected':
            throw C.reason;
        }
    }
    throw C;
  }
  function P(C, $, re, oe, Te) {
    var Re = typeof C;
    (Re === 'undefined' || Re === 'boolean') && (C = null);
    var Le = !1;
    if (C === null) Le = !0;
    else
      switch (Re) {
        case 'bigint':
        case 'string':
        case 'number':
          Le = !0;
          break;
        case 'object':
          switch (C.$$typeof) {
            case a:
            case r:
              Le = !0;
              break;
            case E:
              return ((Le = C._init), P(Le(C._payload), $, re, oe, Te));
          }
      }
    if (Le)
      return (
        (Te = Te(C)),
        (Le = oe === '' ? '.' + ie(C, 0) : oe),
        ee(Te)
          ? ((re = ''),
            Le != null && (re = Le.replace(ue, '$&/') + '/'),
            P(Te, $, re, '', function (Xt) {
              return Xt;
            }))
          : Te != null &&
            (G(Te) &&
              (Te = Ee(
                Te,
                re +
                  (Te.key == null || (C && C.key === Te.key)
                    ? ''
                    : ('' + Te.key).replace(ue, '$&/') + '/') +
                  Le,
              )),
            $.push(Te)),
        1
      );
    Le = 0;
    var de = oe === '' ? '.' : oe + ':';
    if (ee(C))
      for (var Se = 0; Se < C.length; Se++)
        ((oe = C[Se]), (Re = de + ie(oe, Se)), (Le += P(oe, $, re, Re, Te)));
    else if (((Se = x(C)), typeof Se == 'function'))
      for (C = Se.call(C), Se = 0; !(oe = C.next()).done;)
        ((oe = oe.value), (Re = de + ie(oe, Se++)), (Le += P(oe, $, re, Re, Te)));
    else if (Re === 'object') {
      if (typeof C.then == 'function') return P(I(C), $, re, oe, Te);
      throw (
        ($ = String(C)),
        Error(
          'Objects are not valid as a React child (found: ' +
            ($ === '[object Object]' ? 'object with keys {' + Object.keys(C).join(', ') + '}' : $) +
            '). If you meant to render a collection of children, use an array instead.',
        )
      );
    }
    return Le;
  }
  function J(C, $, re) {
    if (C == null) return C;
    var oe = [],
      Te = 0;
    return (
      P(C, oe, '', '', function (Re) {
        return $.call(re, Re, Te++);
      }),
      oe
    );
  }
  function se(C) {
    if (C._status === -1) {
      var $ = C._result,
        re = $();
      (re.then(
        function (oe) {
          (C._status === 0 || C._status === -1) &&
            ((C._status = 1),
            (C._result = oe),
            re.status === void 0 && ((re.status = 'fulfilled'), (re.value = oe)));
        },
        function (oe) {
          (C._status === 0 || C._status === -1) &&
            ((C._status = 2),
            (C._result = oe),
            re.status === void 0 && ((re.status = 'rejected'), (re.reason = oe)));
        },
      ),
        C._status === -1 && ((C._status = 0), (C._result = re)));
    }
    if (C._status === 1) return C._result.default;
    throw C._result;
  }
  var le =
    typeof reportError == 'function'
      ? reportError
      : function (C) {
          if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
            var $ = new window.ErrorEvent('error', {
              bubbles: !0,
              cancelable: !0,
              message:
                typeof C == 'object' && C !== null && typeof C.message == 'string'
                  ? String(C.message)
                  : String(C),
              error: C,
            });
            if (!window.dispatchEvent($)) return;
          } else if (typeof process == 'object' && typeof process.emit == 'function') {
            process.emit('uncaughtException', C);
            return;
          }
          console.error(C);
        };
  function xe(C) {
    var $ = K.T,
      re = {};
    ((re.types = $ !== null ? $.types : null), (K.T = re));
    try {
      var oe = C(),
        Te = K.S;
      (Te !== null && Te(re, oe),
        typeof oe == 'object' && oe !== null && typeof oe.then == 'function' && oe.then(Z, le));
    } catch (Re) {
      le(Re);
    } finally {
      ($ !== null && re.types !== null && ($.types = re.types), (K.T = $));
    }
  }
  function je(C) {
    var $ = K.T;
    if ($ !== null) {
      var re = $.types;
      re === null ? ($.types = [C]) : re.indexOf(C) === -1 && re.push(C);
    } else xe(je.bind(null, C));
  }
  var be = {
    map: J,
    forEach: function (C, $, re) {
      J(
        C,
        function () {
          $.apply(this, arguments);
        },
        re,
      );
    },
    count: function (C) {
      var $ = 0;
      return (
        J(C, function () {
          $++;
        }),
        $
      );
    },
    toArray: function (C) {
      return (
        J(C, function ($) {
          return $;
        }) || []
      );
    },
    only: function (C) {
      if (!G(C))
        throw Error('React.Children.only expected to receive a single React element child.');
      return C;
    },
  };
  return (
    (Oe.Activity = g),
    (Oe.Children = be),
    (Oe.Component = B),
    (Oe.Fragment = o),
    (Oe.Profiler = f),
    (Oe.PureComponent = W),
    (Oe.StrictMode = c),
    (Oe.Suspense = p),
    (Oe.ViewTransition = A),
    (Oe.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = K),
    (Oe.__COMPILER_RUNTIME = {
      __proto__: null,
      c: function (C) {
        return K.H.useMemoCache(C);
      },
    }),
    (Oe.addTransitionType = je),
    (Oe.cache = function (C) {
      return function () {
        return C.apply(null, arguments);
      };
    }),
    (Oe.cacheSignal = function () {
      return null;
    }),
    (Oe.cloneElement = function (C, $, re) {
      if (C == null) throw Error('The argument must be a React element, but you passed ' + C + '.');
      var oe = _({}, C.props),
        Te = C.key;
      if ($ != null)
        for (Re in ($.key !== void 0 && (Te = '' + $.key), $))
          !ce.call($, Re) ||
            Re === 'key' ||
            Re === '__self' ||
            Re === '__source' ||
            (Re === 'ref' && $.ref === void 0) ||
            (oe[Re] = $[Re]);
      var Re = arguments.length - 2;
      if (Re === 1) oe.children = re;
      else if (1 < Re) {
        for (var Le = Array(Re), de = 0; de < Re; de++) Le[de] = arguments[de + 2];
        oe.children = Le;
      }
      return he(C.type, Te, oe);
    }),
    (Oe.createContext = function (C) {
      return (
        (C = {
          $$typeof: d,
          _currentValue: C,
          _currentValue2: C,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
        }),
        (C.Provider = C),
        (C.Consumer = { $$typeof: y, _context: C }),
        C
      );
    }),
    (Oe.createElement = function (C, $, re) {
      var oe,
        Te = {},
        Re = null;
      if ($ != null)
        for (oe in ($.key !== void 0 && (Re = '' + $.key), $))
          ce.call($, oe) &&
            oe !== 'key' &&
            oe !== '__self' &&
            oe !== '__source' &&
            (Te[oe] = $[oe]);
      var Le = arguments.length - 2;
      if (Le === 1) Te.children = re;
      else if (1 < Le) {
        for (var de = Array(Le), Se = 0; Se < Le; Se++) de[Se] = arguments[Se + 2];
        Te.children = de;
      }
      if (C && C.defaultProps)
        for (oe in ((Le = C.defaultProps), Le)) Te[oe] === void 0 && (Te[oe] = Le[oe]);
      return he(C, Re, Te);
    }),
    (Oe.createRef = function () {
      return { current: null };
    }),
    (Oe.forwardRef = function (C) {
      return { $$typeof: m, render: C };
    }),
    (Oe.isValidElement = G),
    (Oe.lazy = function (C) {
      return { $$typeof: E, _payload: { _status: -1, _result: C }, _init: se };
    }),
    (Oe.memo = function (C, $) {
      return { $$typeof: v, type: C, compare: $ === void 0 ? null : $ };
    }),
    (Oe.startTransition = xe),
    (Oe.unstable_useCacheRefresh = function () {
      return K.H.useCacheRefresh();
    }),
    (Oe.use = function (C) {
      return K.H.use(C);
    }),
    (Oe.useActionState = function (C, $, re) {
      return K.H.useActionState(C, $, re);
    }),
    (Oe.useCallback = function (C, $) {
      return K.H.useCallback(C, $);
    }),
    (Oe.useContext = function (C) {
      return K.H.useContext(C);
    }),
    (Oe.useDebugValue = function () {}),
    (Oe.useDeferredValue = function (C, $) {
      return K.H.useDeferredValue(C, $);
    }),
    (Oe.useEffect = function (C, $) {
      return K.H.useEffect(C, $);
    }),
    (Oe.useEffectEvent = function (C) {
      return K.H.useEffectEvent(C);
    }),
    (Oe.useId = function () {
      return K.H.useId();
    }),
    (Oe.useImperativeHandle = function (C, $, re) {
      return K.H.useImperativeHandle(C, $, re);
    }),
    (Oe.useInsertionEffect = function (C, $) {
      return K.H.useInsertionEffect(C, $);
    }),
    (Oe.useLayoutEffect = function (C, $) {
      return K.H.useLayoutEffect(C, $);
    }),
    (Oe.useMemo = function (C, $) {
      return K.H.useMemo(C, $);
    }),
    (Oe.useOptimistic = function (C, $) {
      return K.H.useOptimistic(C, $);
    }),
    (Oe.useReducer = function (C, $, re) {
      return K.H.useReducer(C, $, re);
    }),
    (Oe.useRef = function (C) {
      return K.H.useRef(C);
    }),
    (Oe.useState = function (C) {
      return K.H.useState(C);
    }),
    (Oe.useSyncExternalStore = function (C, $, re) {
      return K.H.useSyncExternalStore(C, $, re);
    }),
    (Oe.useTransition = function () {
      return K.H.useTransition();
    }),
    (Oe.version = '19.3.1'),
    Oe
  );
}
var Wh;
function Md() {
  return (Wh || ((Wh = 1), (Gf.exports = ME())), Gf.exports);
}
var L = Md();
const X = Qu(L);
var qf = { exports: {} },
  ku = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var em;
function LE() {
  if (em) return ku;
  em = 1;
  var a = Symbol.for('react.transitional.element'),
    r = Symbol.for('react.fragment');
  function o(c, f, y) {
    var d = null;
    if ((y !== void 0 && (d = '' + y), f.key !== void 0 && (d = '' + f.key), 'key' in f)) {
      y = {};
      for (var m in f) m !== 'key' && (y[m] = f[m]);
    } else y = f;
    return ((f = y.ref), { $$typeof: a, type: c, key: d, ref: f !== void 0 ? f : null, props: y });
  }
  return ((ku.Fragment = r), (ku.jsx = o), (ku.jsxs = o), ku);
}
var tm;
function zE() {
  return (tm || ((tm = 1), (qf.exports = LE())), qf.exports);
}
var b = zE();
const a0 = L.createContext(void 0),
  nm = a0,
  sd = () => L.useContext(a0);
function fd() {
  return (
    (fd = Object.assign
      ? Object.assign.bind()
      : function (a) {
          for (var r = 1; r < arguments.length; r++) {
            var o = arguments[r];
            for (var c in o) ({}).hasOwnProperty.call(o, c) && (a[c] = o[c]);
          }
          return a;
        }),
    fd.apply(null, arguments)
  );
}
var r0 = ['shift', 'alt', 'meta', 'mod', 'ctrl'],
  UE = {
    esc: 'escape',
    return: 'enter',
    '.': 'period',
    ',': 'comma',
    '-': 'slash',
    ' ': 'space',
    '`': 'backquote',
    '#': 'backslash',
    '+': 'bracketright',
    ShiftLeft: 'shift',
    ShiftRight: 'shift',
    AltLeft: 'alt',
    AltRight: 'alt',
    MetaLeft: 'meta',
    MetaRight: 'meta',
    OSLeft: 'meta',
    OSRight: 'meta',
    ControlLeft: 'ctrl',
    ControlRight: 'ctrl',
  };
function $l(a) {
  return ((a && UE[a]) || a || '')
    .trim()
    .toLowerCase()
    .replace(/key|digit|numpad|arrow/, '');
}
function BE(a) {
  return r0.includes(a);
}
function Yf(a, r) {
  return (r === void 0 && (r = ','), a.split(r));
}
function Vf(a, r, o) {
  r === void 0 && (r = '+');
  var c = a
      .toLocaleLowerCase()
      .split(r)
      .map(function (d) {
        return $l(d);
      }),
    f = {
      alt: c.includes('alt'),
      ctrl: c.includes('ctrl') || c.includes('control'),
      shift: c.includes('shift'),
      meta: c.includes('meta'),
      mod: c.includes('mod'),
    },
    y = c.filter(function (d) {
      return !r0.includes(d);
    });
  return fd({}, f, { keys: y, description: o, hotkey: a });
}
(function () {
  (typeof document < 'u' &&
    (document.addEventListener('keydown', function (a) {
      a.key !== void 0 && u0([$l(a.key), $l(a.code)]);
    }),
    document.addEventListener('keyup', function (a) {
      a.key !== void 0 && i0([$l(a.key), $l(a.code)]);
    })),
    typeof window < 'u' &&
      window.addEventListener('blur', function () {
        Kl.clear();
      }));
})();
var Kl = new Set();
function Ld(a) {
  return Array.isArray(a);
}
function kE(a, r) {
  r === void 0 && (r = ',');
  var o = Ld(a) ? a : a.split(r);
  return o.every(function (c) {
    return Kl.has(c.trim().toLowerCase());
  });
}
function u0(a) {
  var r = Array.isArray(a) ? a : [a];
  (Kl.has('meta') &&
    Kl.forEach(function (o) {
      return !BE(o) && Kl.delete(o.toLowerCase());
    }),
    r.forEach(function (o) {
      return Kl.add(o.toLowerCase());
    }));
}
function i0(a) {
  var r = Array.isArray(a) ? a : [a];
  a === 'meta'
    ? Kl.clear()
    : r.forEach(function (o) {
        return Kl.delete(o.toLowerCase());
      });
}
function HE(a, r, o) {
  ((typeof o == 'function' && o(a, r)) || o === !0) && a.preventDefault();
}
function FE(a, r, o) {
  return typeof o == 'function' ? o(a, r) : o === !0 || o === void 0;
}
function GE(a) {
  return o0(a, ['input', 'textarea', 'select']);
}
function o0(a, r) {
  r === void 0 && (r = !1);
  var o = a.target,
    c = a.composed,
    f = null;
  return (
    qE(o) && c ? (f = a.composedPath()[0] && a.composedPath()[0].tagName) : (f = o && o.tagName),
    Ld(r)
      ? !!(
          f &&
          r &&
          r.some(function (y) {
            var d;
            return y.toLowerCase() === ((d = f) == null ? void 0 : d.toLowerCase());
          })
        )
      : !!(f && r && r)
  );
}
function qE(a) {
  return !!a.tagName && !a.tagName.startsWith('-') && a.tagName.includes('-');
}
function YE(a, r) {
  return a.length === 0 && r
    ? (console.warn(
        'A hotkey has the "scopes" option set, however no active scopes were found. If you want to use the global scopes feature, you need to wrap your app in a <HotkeysProvider>',
      ),
      !0)
    : r
      ? a.some(function (o) {
          return r.includes(o);
        }) || a.includes('*')
      : !0;
}
var VE = function (r, o, c) {
    c === void 0 && (c = !1);
    var f = o.alt,
      y = o.meta,
      d = o.mod,
      m = o.shift,
      p = o.ctrl,
      v = o.keys,
      E = r.key,
      g = r.code,
      A = r.ctrlKey,
      R = r.metaKey,
      x = r.shiftKey,
      S = r.altKey,
      _ = $l(g),
      k = E.toLowerCase();
    if (
      !(v != null && v.includes(_)) &&
      !(v != null && v.includes(k)) &&
      !['ctrl', 'control', 'unknown', 'meta', 'alt', 'shift', 'os'].includes(_)
    )
      return !1;
    if (!c) {
      if ((f === !S && k !== 'alt') || (m === !x && k !== 'shift')) return !1;
      if (d) {
        if (!R && !A) return !1;
      } else if (
        (y === !R && k !== 'meta' && k !== 'os') ||
        (p === !A && k !== 'ctrl' && k !== 'control')
      )
        return !1;
    }
    return v && v.length === 1 && (v.includes(k) || v.includes(_)) ? !0 : v ? kE(v) : !v;
  },
  IE = L.createContext(void 0),
  ZE = function () {
    return L.useContext(IE);
  };
function c0(a, r) {
  return a && r && typeof a == 'object' && typeof r == 'object'
    ? Object.keys(a).length === Object.keys(r).length &&
        Object.keys(a).reduce(function (o, c) {
          return o && c0(a[c], r[c]);
        }, !0)
    : a === r;
}
var XE = L.createContext({
    hotkeys: [],
    enabledScopes: [],
    toggleScope: function () {},
    enableScope: function () {},
    disableScope: function () {},
  }),
  QE = function () {
    return L.useContext(XE);
  };
function $E(a) {
  var r = L.useRef(void 0);
  return (c0(r.current, a) || (r.current = a), r.current);
}
var lm = function (r) {
    (r.stopPropagation(), r.preventDefault(), r.stopImmediatePropagation());
  },
  KE = typeof window < 'u' ? L.useLayoutEffect : L.useEffect;
function En(a, r, o, c) {
  var f = L.useState(null),
    y = f[0],
    d = f[1],
    m = L.useRef(!1),
    p = o instanceof Array ? (c instanceof Array ? void 0 : c) : o,
    v = Ld(a) ? a.join(p == null ? void 0 : p.splitKey) : a,
    E = o instanceof Array ? o : c instanceof Array ? c : void 0,
    g = L.useCallback(r, E ?? []),
    A = L.useRef(g);
  E ? (A.current = g) : (A.current = r);
  var R = $E(p),
    x = QE(),
    S = x.enabledScopes,
    _ = ZE();
  return (
    KE(
      function () {
        if (!((R == null ? void 0 : R.enabled) === !1 || !YE(S, R == null ? void 0 : R.scopes))) {
          var k = function (ee, Z) {
              var K;
              if (
                (Z === void 0 && (Z = !1),
                !(GE(ee) && !o0(ee, R == null ? void 0 : R.enableOnFormTags)))
              ) {
                if (y !== null) {
                  var ce = y.getRootNode();
                  if (
                    (ce instanceof Document || ce instanceof ShadowRoot) &&
                    ce.activeElement !== y &&
                    !y.contains(ce.activeElement)
                  ) {
                    lm(ee);
                    return;
                  }
                }
                ((K = ee.target) != null &&
                  K.isContentEditable &&
                  !(R != null && R.enableOnContentEditable)) ||
                  Yf(v, R == null ? void 0 : R.splitKey).forEach(function (he) {
                    var Ee,
                      G = Vf(he, R == null ? void 0 : R.combinationKey);
                    if (
                      VE(ee, G, R == null ? void 0 : R.ignoreModifiers) ||
                      ((Ee = G.keys) != null && Ee.includes('*'))
                    ) {
                      if (
                        (R != null && R.ignoreEventWhen != null && R.ignoreEventWhen(ee)) ||
                        (Z && m.current)
                      )
                        return;
                      if (
                        (HE(ee, G, R == null ? void 0 : R.preventDefault),
                        !FE(ee, G, R == null ? void 0 : R.enabled))
                      ) {
                        lm(ee);
                        return;
                      }
                      (A.current(ee, G), Z || (m.current = !0));
                    }
                  });
              }
            },
            B = function (ee) {
              ee.key !== void 0 &&
                (u0($l(ee.code)),
                (((R == null ? void 0 : R.keydown) === void 0 &&
                  (R == null ? void 0 : R.keyup) !== !0) ||
                  (R != null && R.keydown)) &&
                  k(ee));
            },
            q = function (ee) {
              ee.key !== void 0 &&
                (i0($l(ee.code)), (m.current = !1), R != null && R.keyup && k(ee, !0));
            },
            W = y || (p == null ? void 0 : p.document) || document;
          return (
            W.addEventListener('keyup', q, p == null ? void 0 : p.eventListenerOptions),
            W.addEventListener('keydown', B, p == null ? void 0 : p.eventListenerOptions),
            _ &&
              Yf(v, R == null ? void 0 : R.splitKey).forEach(function (te) {
                return _.addHotkey(
                  Vf(te, R == null ? void 0 : R.combinationKey, R == null ? void 0 : R.description),
                );
              }),
            function () {
              (W.removeEventListener('keyup', q, p == null ? void 0 : p.eventListenerOptions),
                W.removeEventListener('keydown', B, p == null ? void 0 : p.eventListenerOptions),
                _ &&
                  Yf(v, R == null ? void 0 : R.splitKey).forEach(function (te) {
                    return _.removeHotkey(
                      Vf(
                        te,
                        R == null ? void 0 : R.combinationKey,
                        R == null ? void 0 : R.description,
                      ),
                    );
                  }));
            }
          );
        }
      },
      [y, v, R, S],
    ),
    d
  );
}
const JE = () =>
    b.jsxs('svg', {
      width: 18,
      height: 18,
      viewBox: '0 0 24 24',
      strokeWidth: 2,
      stroke: 'currentColor',
      fill: 'none',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        b.jsx('path', { d: 'M0 0h24v24H0z', stroke: 'none' }),
        b.jsx('path', { d: 'M18 6L6 18M6 6l12 12' }),
      ],
    }),
  PE = () =>
    b.jsx('svg', {
      viewBox: '0 0 24 24',
      strokeWidth: 0.5,
      stroke: 'currentColor',
      fill: 'currentColor',
      width: 24,
      height: 24,
      children: b.jsx('path', {
        d: 'M22 14H9V5a4 4 0 00-8 0v3a1 1 0 002 0V5a2 2 0 014 0v10a8 8 0 0016 0 1 1 0 00-1-1zm-7 7a6.01 6.01 0 01-5.917-5h11.834A6.01 6.01 0 0115 21z',
      }),
    }),
  WE = () =>
    b.jsxs('svg', {
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      strokeWidth: 2,
      stroke: 'currentColor',
      fill: 'none',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        b.jsx('path', { d: 'M0 0h24v24H0z', stroke: 'none' }),
        b.jsx('path', { d: 'M16 4H9.5a3.5 3.5 0 000 7h.5M14 15V4M10 15V4M5 19h14M7 21l-2-2 2-2' }),
      ],
    }),
  eS = () => (
    L.useEffect(
      () => (
        document.documentElement.removeAttribute('data-storyloaded'),
        () => document.documentElement.setAttribute('data-storyloaded', '')
      ),
      [],
    ),
    b.jsx('div', {
      className: 'ladle-ring-wrapper',
      children: b.jsxs('div', {
        className: 'ladle-ring',
        children: [b.jsx('div', {}), b.jsx('div', {}), b.jsx('div', {}), b.jsx('div', {})],
      }),
    })
  ),
  tS = () =>
    b.jsxs('svg', {
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      strokeWidth: 2,
      stroke: 'currentColor',
      fill: 'none',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        b.jsx('path', { d: 'M0 0h24v24H0z', stroke: 'none' }),
        b.jsx('path', { d: 'M16 4h4v4M14 10l6-6M8 20H4v-4M4 20l6-6' }),
      ],
    }),
  nS = () =>
    b.jsxs('svg', {
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      strokeWidth: 2,
      stroke: 'currentColor',
      fill: 'none',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        b.jsx('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
        b.jsx('path', { d: 'M3 12h1m8 -9v1m8 8h1m-15.4 -6.4l.7 .7m12.1 -.7l-.7 .7' }),
        b.jsx('path', {
          d: 'M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3',
        }),
        b.jsx('line', { x1: 9.7, y1: 17, x2: 14.3, y2: 17 }),
      ],
    }),
  lS = () =>
    b.jsx('div', {
      style: { width: '10px', marginInlineEnd: '0.5em', flexShrink: 0 },
      children: b.jsx('svg', {
        fill: 'currentColor',
        viewBox: '0 0 768 1024',
        children: b.jsx('path', {
          d: 'M509 64l195 218v669q0 3-4 6t-9 3H77q-5 0-9-3t-4-6V73q0-3 4-6t9-3h432zm29-64H77Q45 0 22.5 21.5T0 73v878q0 30 22.5 51.5T77 1024h614q32 0 54.5-21.5T768 951V257zm-26 256V0h-64v256q0 26 19 45t45 19h253v-64H512z',
        }),
      }),
    }),
  aS = ({ rotate: a }) => {
    const r = '16px',
      o = '16px';
    return b.jsx('div', {
      'aria-hidden': !0,
      style: { width: r, height: o, marginInlineEnd: '0.1em' },
      children: a
        ? b.jsxs('svg', {
            style: { width: r, height: o },
            viewBox: '0 0 24 24',
            stroke: 'currentColor',
            fill: 'none',
            children: [
              b.jsx('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
              b.jsx('path', { d: 'M9 6l6 6l-6 6' }),
            ],
          })
        : b.jsxs('svg', {
            style: { width: r, height: o },
            viewBox: '0 0 24 24',
            stroke: 'currentColor',
            fill: 'none',
            children: [
              b.jsx('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
              b.jsx('path', { d: 'M6 9l6 6l6 -6' }),
            ],
          }),
    });
  },
  rS = () =>
    b.jsxs('svg', {
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      strokeWidth: 2,
      stroke: 'currentColor',
      fill: 'none',
      children: [
        b.jsx('path', { stroke: 'none', d: 'M0 0h24v24H0z', fill: 'none' }),
        b.jsx('circle', { cx: 14, cy: 6, r: 2 }),
        b.jsx('line', { x1: 4, y1: 6, x2: 12, y2: 6 }),
        b.jsx('line', { x1: 16, y1: 6, x2: 20, y2: 6 }),
        b.jsx('circle', { cx: 8, cy: 12, r: 2 }),
        b.jsx('line', { x1: 4, y1: 12, x2: 6, y2: 12 }),
        b.jsx('line', { x1: 10, y1: 12, x2: 20, y2: 12 }),
        b.jsx('circle', { cx: 17, cy: 18, r: 2 }),
        b.jsx('line', { x1: 4, y1: 18, x2: 15, y2: 18 }),
        b.jsx('line', { x1: 19, y1: 18, x2: 20, y2: 18 }),
      ],
    }),
  uS = () =>
    b.jsxs('svg', {
      width: 24,
      height: 24,
      viewBox: '0 0 24 24',
      strokeWidth: 2,
      stroke: 'currentColor',
      fill: 'none',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        b.jsx('path', { d: 'M0 0h24v24H0z', stroke: 'none' }),
        b.jsx('path', { d: 'm7 8-4 4 4 4M17 8l4 4-4 4M14 4l-4 16' }),
      ],
    }),
  iS = () =>
    b.jsxs('svg', {
      width: 24,
      height: 24,
      strokeWidth: 2,
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      fill: 'none',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        b.jsx('path', { d: 'M0 0h24v24H0z', stroke: 'none' }),
        b.jsx('circle', { cx: 12, cy: 12, r: 9 }),
        b.jsx('path', { d: 'm10 16.5 2-3 2 3m-2-3v-2l3-1m-6 0 3 1' }),
        b.jsx('circle', { cx: 12, cy: 7.5, r: 0.5, fill: 'currentColor' }),
      ],
    }),
  oS = () =>
    b.jsxs('svg', {
      width: 24,
      height: 24,
      strokeWidth: 2,
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      fill: 'none',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        b.jsx('path', { d: 'M0 0h24v24H0z', stroke: 'none' }),
        b.jsx('rect', { x: 13, y: 8, width: 8, height: 12, rx: 1 }),
        b.jsx('path', { d: 'M18 8V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h9M16 9h2' }),
      ],
    }),
  cS = () =>
    b.jsxs('svg', {
      width: 24,
      height: 24,
      strokeWidth: 2,
      viewBox: '0 0 24 24',
      stroke: 'currentColor',
      fill: 'none',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        b.jsx('path', { d: 'M0 0h24v24H0z', stroke: 'none' }),
        b.jsx('path', { d: 'M18 8a3 3 0 0 1 0 6M10 8v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-5' }),
        b.jsx('path', {
          d: 'M12 8h0l4.524-3.77A.9.9 0 0 1 18 4.922v12.156a.9.9 0 0 1-1.476.692L12 14H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h8',
        }),
      ],
    });
var If = { exports: {} },
  Ct = {};
/**
 * @license React
 * react-dom.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var am;
function sS() {
  if (am) return Ct;
  am = 1;
  var a = Md();
  function r(E) {
    var g = 'https://react.dev/errors/' + E;
    if (1 < arguments.length) {
      g += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var A = 2; A < arguments.length; A++) g += '&args[]=' + encodeURIComponent(arguments[A]);
    }
    return (
      'Minified React error #' +
      E +
      '; visit ' +
      g +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function o() {}
  var c = {
      d: {
        f: o,
        r: function () {
          throw Error(r(522));
        },
        D: o,
        C: o,
        L: o,
        m: o,
        X: o,
        S: o,
        M: o,
      },
      p: 0,
      findDOMNode: null,
    },
    f = Symbol.for('react.portal'),
    y = Symbol.for('react.recoverable'),
    d = Symbol.for('react.optimistic_key');
  function m(E, g, A) {
    var R = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return {
      $$typeof: f,
      key: R == null ? null : R === d ? d : '' + R,
      children: E,
      containerInfo: g,
      implementation: A,
    };
  }
  var p = a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
  function v(E, g) {
    if (E === 'font') return '';
    if (typeof g == 'string') return g === 'use-credentials' ? g : '';
  }
  return (
    (Ct.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = c),
    (Ct.browser = function (E) {
      return { $$typeof: y, _reason: E };
    }),
    (Ct.createPortal = function (E, g) {
      var A = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
      if (!g || (g.nodeType !== 1 && g.nodeType !== 9 && g.nodeType !== 11)) throw Error(r(299));
      return m(E, g, null, A);
    }),
    (Ct.flushSync = function (E) {
      var g = p.T,
        A = c.p;
      try {
        if (((p.T = null), (c.p = 2), E)) return E();
      } finally {
        ((p.T = g), (c.p = A), c.d.f());
      }
    }),
    (Ct.preconnect = function (E, g) {
      typeof E == 'string' &&
        (g
          ? ((g = g.crossOrigin),
            (g = typeof g == 'string' ? (g === 'use-credentials' ? g : '') : void 0))
          : (g = null),
        c.d.C(E, g));
    }),
    (Ct.prefetchDNS = function (E) {
      typeof E == 'string' && c.d.D(E);
    }),
    (Ct.preinit = function (E, g) {
      if (typeof E == 'string' && g && typeof g.as == 'string') {
        var A = g.as,
          R = v(A, g.crossOrigin),
          x = typeof g.integrity == 'string' ? g.integrity : void 0,
          S = typeof g.fetchPriority == 'string' ? g.fetchPriority : void 0;
        A === 'style'
          ? c.d.S(E, typeof g.precedence == 'string' ? g.precedence : void 0, {
              crossOrigin: R,
              integrity: x,
              fetchPriority: S,
            })
          : A === 'script' &&
            c.d.X(E, {
              crossOrigin: R,
              integrity: x,
              fetchPriority: S,
              nonce: typeof g.nonce == 'string' ? g.nonce : void 0,
            });
      }
    }),
    (Ct.preinitModule = function (E, g) {
      if (typeof E == 'string')
        if (typeof g == 'object' && g !== null) {
          if (g.as == null || g.as === 'script') {
            var A = v(g.as, g.crossOrigin);
            c.d.M(E, {
              crossOrigin: A,
              integrity: typeof g.integrity == 'string' ? g.integrity : void 0,
              nonce: typeof g.nonce == 'string' ? g.nonce : void 0,
              fetchPriority: typeof g.fetchPriority == 'string' ? g.fetchPriority : void 0,
            });
          }
        } else g == null && c.d.M(E);
    }),
    (Ct.preload = function (E, g) {
      if (typeof E == 'string' && typeof g == 'object' && g !== null && typeof g.as == 'string') {
        var A = g.as,
          R = v(A, g.crossOrigin);
        c.d.L(E, A, {
          crossOrigin: R,
          integrity: typeof g.integrity == 'string' ? g.integrity : void 0,
          nonce: typeof g.nonce == 'string' ? g.nonce : void 0,
          type: typeof g.type == 'string' ? g.type : void 0,
          fetchPriority: typeof g.fetchPriority == 'string' ? g.fetchPriority : void 0,
          referrerPolicy: typeof g.referrerPolicy == 'string' ? g.referrerPolicy : void 0,
          imageSrcSet: typeof g.imageSrcSet == 'string' ? g.imageSrcSet : void 0,
          imageSizes: typeof g.imageSizes == 'string' ? g.imageSizes : void 0,
          media: typeof g.media == 'string' ? g.media : void 0,
        });
      }
    }),
    (Ct.preloadModule = function (E, g) {
      if (typeof E == 'string')
        if (g) {
          var A = v(g.as, g.crossOrigin);
          c.d.m(E, {
            as: typeof g.as == 'string' && g.as !== 'script' ? g.as : void 0,
            crossOrigin: A,
            integrity: typeof g.integrity == 'string' ? g.integrity : void 0,
            nonce: typeof g.nonce == 'string' ? g.nonce : void 0,
            fetchPriority: typeof g.fetchPriority == 'string' ? g.fetchPriority : void 0,
          });
        } else c.d.m(E);
    }),
    (Ct.requestFormReset = function (E) {
      c.d.r(E);
    }),
    (Ct.unstable_batchedUpdates = function (E, g) {
      return E(g);
    }),
    (Ct.useFormState = function (E, g, A) {
      return p.H.useFormState(E, g, A);
    }),
    (Ct.useFormStatus = function () {
      return p.H.useHostTransitionStatus();
    }),
    (Ct.version = '19.3.1'),
    Ct
  );
}
var rm;
function s0() {
  if (rm) return If.exports;
  rm = 1;
  function a() {
    if (!(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    ))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (r) {
        console.error(r);
      }
  }
  return (a(), (If.exports = sS()), If.exports);
}
var f0 = s0();
const um = Qu(f0);
function dd() {
  return (
    ($n =
      Object.assign ||
      function (a) {
        for (let r = 1; r < arguments.length; r++) {
          const o = arguments[r];
          for (const c in o) Object.prototype.hasOwnProperty.call(o, c) && (a[c] = o[c]);
        }
        return a;
      }),
    $n.apply(this, arguments)
  );
}
function zd(a, r, o) {
  return (
    (o = {
      path: r,
      exports: {},
      require: function (c, f) {
        return fS(c, f ?? o.path);
      },
    }),
    a(o, o.exports),
    o.exports
  );
}
function fS() {
  throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}
let Lr;
typeof window < 'u' ? (Lr = window) : typeof self < 'u' ? (Lr = self) : (Lr = {});
Lr.setTimeout;
Lr.clearTimeout;
function $u() {}
const Hu = Lr.performance || {};
Hu.now || Hu.mozNow || Hu.msNow || Hu.oNow || Hu.webkitNow;
const dS = function (a, r) {
    let o;
    const c = toObject(a);
    let f;
    for (let y = 1; y < arguments.length; y++) {
      o = Object(arguments[y]);
      for (const d in o) hasOwnProperty.call(o, d) && (c[d] = o[d]);
      if (getOwnPropertySymbols) {
        f = getOwnPropertySymbols(o);
        for (let d = 0; d < f.length; d++) propIsEnumerable.call(o, f[d]) && (c[f[d]] = o[f[d]]);
      }
    }
    return c;
  },
  yS = y0() ? L.useLayoutEffect : L.useEffect,
  im = {};
let d0 = $u;
d0 = function (r) {
  im[r] || (im[r] = !0);
};
function pS(a, r) {
  if (a != null)
    if (hS(a)) a(r);
    else
      try {
        a.current = r;
      } catch {
        throw new Error('Cannot assign value "' + r + '" to ref "' + a + '"');
      }
}
function y0() {
  return !!(typeof window < 'u' && window.document && window.document.createElement);
}
function Wo(a) {
  return L.forwardRef(a);
}
function gS(a) {
  return y0() ? (a ? a.ownerDocument : document) : null;
}
function hS(a) {
  return !!(a && {}.toString.call(a) == '[object Function]');
}
function mS(a) {
  return typeof a == 'string';
}
let p0 = $u;
p0 = function (r) {
  const o = L.useRef(r);
  (L.useEffect(
    function () {
      return void (o.current = r);
    },
    [r],
  ),
    L.useEffect(function () {
      return d0(o.current);
    }, []));
};
function vS() {
  const a = L.useState(Object.create(null)),
    r = a[1];
  return L.useCallback(function () {
    r(Object.create(null));
  }, []);
}
function bS() {
  for (var a = arguments.length, r = new Array(a), o = 0; o < a; o++) r[o] = arguments[o];
  return L.useMemo(function () {
    return r.every(function (c) {
      return c == null;
    })
      ? null
      : function (c) {
          r.forEach(function (f) {
            pS(f, c);
          });
        };
  }, [].concat(r));
}
function ko(a, r) {
  return function (o) {
    if ((a && a(o), !o.defaultPrevented)) return r(o);
  };
}
const g0 = function (r) {
  const o = r.children,
    c = r.type,
    f = c === void 0 ? 'reach-portal' : c,
    y = L.useRef(null),
    d = L.useRef(null),
    m = vS();
  return (
    yS(
      function () {
        if (!y.current) return;
        const p = y.current.ownerDocument;
        return (
          (d.current = p == null ? void 0 : p.createElement(f)),
          p.body.appendChild(d.current),
          m(),
          function () {
            d.current &&
              d.current.ownerDocument &&
              d.current.ownerDocument.body.removeChild(d.current);
          }
        );
      },
      [f, m],
    ),
    d.current ? f0.createPortal(o, d.current) : L.createElement('span', { ref: y })
  );
};
g0.displayName = 'Portal';
function ES(a, r) {
  if (a == null) return {};
  const o = {},
    c = Object.keys(a);
  let f, y;
  for (y = 0; y < c.length; y++) ((f = c[y]), !(r.indexOf(f) >= 0) && (o[f] = a[f]));
  return o;
}
const SS = zd(function (a, r) {
    (function () {
      const o = typeof Symbol == 'function' && Symbol.for,
        c = o ? Symbol.for('react.element') : 60103,
        f = o ? Symbol.for('react.portal') : 60106,
        y = o ? Symbol.for('react.fragment') : 60107,
        d = o ? Symbol.for('react.strict_mode') : 60108,
        m = o ? Symbol.for('react.profiler') : 60114,
        p = o ? Symbol.for('react.provider') : 60109,
        v = o ? Symbol.for('react.context') : 60110,
        E = o ? Symbol.for('react.async_mode') : 60111,
        g = o ? Symbol.for('react.concurrent_mode') : 60111,
        A = o ? Symbol.for('react.forward_ref') : 60112,
        R = o ? Symbol.for('react.suspense') : 60113,
        x = o ? Symbol.for('react.suspense_list') : 60120,
        S = o ? Symbol.for('react.memo') : 60115,
        _ = o ? Symbol.for('react.lazy') : 60116,
        k = o ? Symbol.for('react.block') : 60121,
        B = o ? Symbol.for('react.fundamental') : 60117,
        q = o ? Symbol.for('react.responder') : 60118,
        W = o ? Symbol.for('react.scope') : 60119;
      function te(me) {
        return (
          typeof me == 'string' ||
          typeof me == 'function' ||
          me === y ||
          me === g ||
          me === m ||
          me === d ||
          me === R ||
          me === x ||
          (typeof me == 'object' &&
            me !== null &&
            (me.$$typeof === _ ||
              me.$$typeof === S ||
              me.$$typeof === p ||
              me.$$typeof === v ||
              me.$$typeof === A ||
              me.$$typeof === B ||
              me.$$typeof === q ||
              me.$$typeof === W ||
              me.$$typeof === k))
        );
      }
      function ee(me) {
        if (typeof me == 'object' && me !== null) {
          const lt = me.$$typeof;
          switch (lt) {
            case c:
              var Qt = me.type;
              switch (Qt) {
                case E:
                case g:
                case y:
                case m:
                case d:
                case R:
                  return Qt;
                default:
                  var Nt = Qt && Qt.$$typeof;
                  switch (Nt) {
                    case v:
                    case A:
                    case _:
                    case S:
                    case p:
                      return Nt;
                    default:
                      return lt;
                  }
              }
            case f:
              return lt;
          }
        }
      }
      const Z = E,
        K = g,
        ce = v,
        he = p,
        Ee = c,
        G = A,
        ae = y,
        ue = _,
        ie = S,
        I = f,
        P = m,
        J = d,
        se = R;
      let le = !1;
      function xe(me) {
        return (
          le ||
            ((le = !0),
            console.warn(
              'The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.',
            )),
          je(me) || ee(me) === E
        );
      }
      function je(me) {
        return ee(me) === g;
      }
      function be(me) {
        return ee(me) === v;
      }
      function C(me) {
        return ee(me) === p;
      }
      function $(me) {
        return typeof me == 'object' && me !== null && me.$$typeof === c;
      }
      function re(me) {
        return ee(me) === A;
      }
      function oe(me) {
        return ee(me) === y;
      }
      function Te(me) {
        return ee(me) === _;
      }
      function Re(me) {
        return ee(me) === S;
      }
      function Le(me) {
        return ee(me) === f;
      }
      function de(me) {
        return ee(me) === m;
      }
      function Se(me) {
        return ee(me) === d;
      }
      function Xt(me) {
        return ee(me) === R;
      }
      ((r.AsyncMode = Z),
        (r.ConcurrentMode = K),
        (r.ContextConsumer = ce),
        (r.ContextProvider = he),
        (r.Element = Ee),
        (r.ForwardRef = G),
        (r.Fragment = ae),
        (r.Lazy = ue),
        (r.Memo = ie),
        (r.Portal = I),
        (r.Profiler = P),
        (r.StrictMode = J),
        (r.Suspense = se),
        (r.isAsyncMode = xe),
        (r.isConcurrentMode = je),
        (r.isContextConsumer = be),
        (r.isContextProvider = C),
        (r.isElement = $),
        (r.isForwardRef = re),
        (r.isFragment = oe),
        (r.isLazy = Te),
        (r.isMemo = Re),
        (r.isPortal = Le),
        (r.isProfiler = de),
        (r.isStrictMode = Se),
        (r.isSuspense = Xt),
        (r.isValidElementType = te),
        (r.typeOf = ee));
    })();
  }),
  h0 = zd(function (a) {
    a.exports = SS;
  }),
  _S = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED',
  Na = _S;
let yd = function () {};
{
  var TS = Na,
    pd = {},
    OS = Function.call.bind(Object.prototype.hasOwnProperty);
  yd = function (a) {
    const r = 'Warning: ' + a;
    typeof console < 'u' && console.error(r);
    try {
      throw new Error(r);
    } catch {}
  };
}
function m0(a, r, o, c, f) {
  for (const d in a)
    if (OS(a, d)) {
      var y;
      try {
        if (typeof a[d] != 'function') {
          const m = Error(
            (c || 'React class') +
              ': ' +
              o +
              ' type `' +
              d +
              '` is invalid; it must be a function, usually from the `prop-types` package, but received `' +
              typeof a[d] +
              '`.',
          );
          throw ((m.name = 'Invariant Violation'), m);
        }
        y = a[d](r, d, c, o, null, TS);
      } catch (m) {
        y = m;
      }
      if (
        (y &&
          !(y instanceof Error) &&
          yd(
            (c || 'React class') +
              ': type specification of ' +
              o +
              ' `' +
              d +
              '` is invalid; the type checker function must return `null` or an `Error` but returned a ' +
              typeof y +
              '. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).',
          ),
        y instanceof Error && !(y.message in pd))
      ) {
        pd[y.message] = !0;
        const m = f ? f() : '';
        yd('Failed ' + o + ' type: ' + y.message + (m ?? ''));
      }
    }
}
m0.resetWarningCache = function () {
  pd = {};
};
const om = m0,
  AS = Function.call.bind(Object.prototype.hasOwnProperty);
let qu = function () {};
qu = function (a) {
  const r = 'Warning: ' + a;
  typeof console < 'u' && console.error(r);
  try {
    throw new Error(r);
  } catch {}
};
function zo() {
  return null;
}
const xS = function (a, r) {
    const o = typeof Symbol == 'function' && Symbol.iterator,
      c = '@@iterator';
    function f(G) {
      const ae = G && ((o && G[o]) || G[c]);
      if (typeof ae == 'function') return ae;
    }
    const y = '<<anonymous>>',
      d = {
        array: E('array'),
        bool: E('boolean'),
        func: E('function'),
        number: E('number'),
        object: E('object'),
        string: E('string'),
        symbol: E('symbol'),
        any: g(),
        arrayOf: A,
        element: R(),
        elementType: x(),
        instanceOf: S,
        node: q(),
        objectOf: k,
        oneOf: _,
        oneOfType: B,
        shape: W,
        exact: te,
      };
    function m(G, ae) {
      return G === ae ? G !== 0 || 1 / G === 1 / ae : G !== G && ae !== ae;
    }
    function p(G) {
      ((this.message = G), (this.stack = ''));
    }
    p.prototype = Error.prototype;
    function v(G) {
      function ae(ie, I, P, J, se, le, xe) {
        if (((J = J || y), (le = le || P), xe !== Na)) {
          const je = new Error(
            'Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types',
          );
          throw ((je.name = 'Invariant Violation'), je);
        }
        return I[P] == null
          ? ie
            ? I[P] === null
              ? new p(
                  'The ' +
                    se +
                    ' `' +
                    le +
                    '` is marked as required ' +
                    ('in `' + J + '`, but its value is `null`.'),
                )
              : new p(
                  'The ' +
                    se +
                    ' `' +
                    le +
                    '` is marked as required in ' +
                    ('`' + J + '`, but its value is `undefined`.'),
                )
            : null
          : G(I, P, J, se, le);
      }
      const ue = ae.bind(null, !1);
      return ((ue.isRequired = ae.bind(null, !0)), ue);
    }
    function E(G) {
      function ae(ue, ie, I, P, J, se) {
        const le = ue[ie];
        if (K(le) !== G) {
          const je = ce(le);
          return new p(
            'Invalid ' +
              P +
              ' `' +
              J +
              '` of type ' +
              ('`' + je + '` supplied to `' + I + '`, expected ') +
              ('`' + G + '`.'),
          );
        }
        return null;
      }
      return v(ae);
    }
    function g() {
      return v(zo);
    }
    function A(G) {
      function ae(ue, ie, I, P, J) {
        if (typeof G != 'function')
          return new p(
            'Property `' +
              J +
              '` of component `' +
              I +
              '` has invalid PropType notation inside arrayOf.',
          );
        const se = ue[ie];
        if (!Array.isArray(se)) {
          const le = K(se);
          return new p(
            'Invalid ' +
              P +
              ' `' +
              J +
              '` of type ' +
              ('`' + le + '` supplied to `' + I + '`, expected an array.'),
          );
        }
        for (let le = 0; le < se.length; le++) {
          const xe = G(se, le, I, P, J + '[' + le + ']', Na);
          if (xe instanceof Error) return xe;
        }
        return null;
      }
      return v(ae);
    }
    function R() {
      function G(ae, ue, ie, I, P) {
        const J = ae[ue];
        if (!a(J)) {
          const se = K(J);
          return new p(
            'Invalid ' +
              I +
              ' `' +
              P +
              '` of type ' +
              ('`' + se + '` supplied to `' + ie + '`, expected a single ReactElement.'),
          );
        }
        return null;
      }
      return v(G);
    }
    function x() {
      function G(ae, ue, ie, I, P) {
        const J = ae[ue];
        if (!h0.isValidElementType(J)) {
          const se = K(J);
          return new p(
            'Invalid ' +
              I +
              ' `' +
              P +
              '` of type ' +
              ('`' + se + '` supplied to `' + ie + '`, expected a single ReactElement type.'),
          );
        }
        return null;
      }
      return v(G);
    }
    function S(G) {
      function ae(ue, ie, I, P, J) {
        if (!(ue[ie] instanceof G)) {
          const se = G.name || y,
            le = Ee(ue[ie]);
          return new p(
            'Invalid ' +
              P +
              ' `' +
              J +
              '` of type ' +
              ('`' + le + '` supplied to `' + I + '`, expected ') +
              ('instance of `' + se + '`.'),
          );
        }
        return null;
      }
      return v(ae);
    }
    function _(G) {
      if (!Array.isArray(G))
        return (
          arguments.length > 1
            ? qu(
                'Invalid arguments supplied to oneOf, expected an array, got ' +
                  arguments.length +
                  ' arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z]).',
              )
            : qu('Invalid argument supplied to oneOf, expected an array.'),
          zo
        );
      function ae(ue, ie, I, P, J) {
        const se = ue[ie];
        for (let xe = 0; xe < G.length; xe++) if (m(se, G[xe])) return null;
        const le = JSON.stringify(G, function (je, be) {
          return ce(be) === 'symbol' ? String(be) : be;
        });
        return new p(
          'Invalid ' +
            P +
            ' `' +
            J +
            '` of value `' +
            String(se) +
            '` ' +
            ('supplied to `' + I + '`, expected one of ' + le + '.'),
        );
      }
      return v(ae);
    }
    function k(G) {
      function ae(ue, ie, I, P, J) {
        if (typeof G != 'function')
          return new p(
            'Property `' +
              J +
              '` of component `' +
              I +
              '` has invalid PropType notation inside objectOf.',
          );
        const se = ue[ie],
          le = K(se);
        if (le !== 'object')
          return new p(
            'Invalid ' +
              P +
              ' `' +
              J +
              '` of type ' +
              ('`' + le + '` supplied to `' + I + '`, expected an object.'),
          );
        for (const xe in se)
          if (AS(se, xe)) {
            const je = G(se, xe, I, P, J + '.' + xe, Na);
            if (je instanceof Error) return je;
          }
        return null;
      }
      return v(ae);
    }
    function B(G) {
      if (!Array.isArray(G))
        return (qu('Invalid argument supplied to oneOfType, expected an instance of array.'), zo);
      for (let ue = 0; ue < G.length; ue++) {
        const ie = G[ue];
        if (typeof ie != 'function')
          return (
            qu(
              'Invalid argument supplied to oneOfType. Expected an array of check functions, but received ' +
                he(ie) +
                ' at index ' +
                ue +
                '.',
            ),
            zo
          );
      }
      function ae(ue, ie, I, P, J) {
        for (let se = 0; se < G.length; se++) {
          const le = G[se];
          if (le(ue, ie, I, P, J, Na) == null) return null;
        }
        return new p('Invalid ' + P + ' `' + J + '` supplied to ' + ('`' + I + '`.'));
      }
      return v(ae);
    }
    function q() {
      function G(ae, ue, ie, I, P) {
        return ee(ae[ue])
          ? null
          : new p(
              'Invalid ' +
                I +
                ' `' +
                P +
                '` supplied to ' +
                ('`' + ie + '`, expected a ReactNode.'),
            );
      }
      return v(G);
    }
    function W(G) {
      function ae(ue, ie, I, P, J) {
        const se = ue[ie],
          le = K(se);
        if (le !== 'object')
          return new p(
            'Invalid ' +
              P +
              ' `' +
              J +
              '` of type `' +
              le +
              '` ' +
              ('supplied to `' + I + '`, expected `object`.'),
          );
        for (const xe in G) {
          const je = G[xe];
          if (!je) continue;
          const be = je(se, xe, I, P, J + '.' + xe, Na);
          if (be) return be;
        }
        return null;
      }
      return v(ae);
    }
    function te(G) {
      function ae(ue, ie, I, P, J) {
        const se = ue[ie],
          le = K(se);
        if (le !== 'object')
          return new p(
            'Invalid ' +
              P +
              ' `' +
              J +
              '` of type `' +
              le +
              '` ' +
              ('supplied to `' + I + '`, expected `object`.'),
          );
        const xe = dS({}, ue[ie], G);
        for (const je in xe) {
          const be = G[je];
          if (!be)
            return new p(
              'Invalid ' +
                P +
                ' `' +
                J +
                '` key `' +
                je +
                '` supplied to `' +
                I +
                '`.\nBad object: ' +
                JSON.stringify(ue[ie], null, '  ') +
                `
Valid keys: ` +
                JSON.stringify(Object.keys(G), null, '  '),
            );
          const C = be(se, je, I, P, J + '.' + je, Na);
          if (C) return C;
        }
        return null;
      }
      return v(ae);
    }
    function ee(G) {
      switch (typeof G) {
        case 'number':
        case 'string':
        case 'undefined':
          return !0;
        case 'boolean':
          return !G;
        case 'object':
          if (Array.isArray(G)) return G.every(ee);
          if (G === null || a(G)) return !0;
          var ae = f(G);
          if (ae) {
            const ue = ae.call(G);
            let ie;
            if (ae !== G.entries) {
              for (; !(ie = ue.next()).done;) if (!ee(ie.value)) return !1;
            } else
              for (; !(ie = ue.next()).done;) {
                const I = ie.value;
                if (I && !ee(I[1])) return !1;
              }
          } else return !1;
          return !0;
        default:
          return !1;
      }
    }
    function Z(G, ae) {
      return G === 'symbol'
        ? !0
        : ae
          ? ae['@@toStringTag'] === 'Symbol' ||
            (typeof Symbol == 'function' && ae instanceof Symbol)
          : !1;
    }
    function K(G) {
      const ae = typeof G;
      return Array.isArray(G) ? 'array' : G instanceof RegExp ? 'object' : Z(ae, G) ? 'symbol' : ae;
    }
    function ce(G) {
      if (typeof G > 'u' || G === null) return '' + G;
      const ae = K(G);
      if (ae === 'object') {
        if (G instanceof Date) return 'date';
        if (G instanceof RegExp) return 'regexp';
      }
      return ae;
    }
    function he(G) {
      const ae = ce(G);
      switch (ae) {
        case 'array':
        case 'object':
          return 'an ' + ae;
        case 'boolean':
        case 'date':
        case 'regexp':
          return 'a ' + ae;
        default:
          return ae;
      }
    }
    function Ee(G) {
      return !G.constructor || !G.constructor.name ? y : G.constructor.name;
    }
    return (
      (d.checkPropTypes = om),
      (d.resetWarningCache = om.resetWarningCache),
      (d.PropTypes = d),
      d
    );
  },
  Ye = zd(function (a) {
    {
      const r = h0;
      a.exports = xS(r.isElement);
    }
  }),
  gd = 'data-focus-lock',
  v0 = 'data-focus-lock-disabled',
  CS = 'data-no-focus-lock',
  wS = 'data-autofocus-inside';
function RS(a, r) {
  return (typeof a == 'function' ? a(r) : a && (a.current = r), a);
}
function NS(a, r) {
  var o = L.useState(function () {
    return {
      value: a,
      callback: r,
      facade: {
        get current() {
          return o.value;
        },
        set current(c) {
          const f = o.value;
          f !== c && ((o.value = c), o.callback(c, f));
        },
      },
    };
  })[0];
  return ((o.callback = r), o.facade);
}
function b0(a, r) {
  return NS(r, function (o) {
    return a.forEach(function (c) {
      return RS(c, o);
    });
  });
}
const Zf = {
  width: '1px',
  height: '0px',
  padding: 0,
  overflow: 'hidden',
  position: 'fixed',
  top: '1px',
  left: '1px',
};
Ye.node;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var Yo =
  function () {
    return (
      (Yo =
        Object.assign ||
        function (r) {
          for (var o, c = 1, f = arguments.length; c < f; c++) {
            o = arguments[c];
            for (const y in o) Object.prototype.hasOwnProperty.call(o, y) && (r[y] = o[y]);
          }
          return r;
        }),
      Yo.apply(this, arguments)
    );
  };
function DS(a, r) {
  const o = {};
  for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && r.indexOf(c) < 0 && (o[c] = a[c]);
  if (a != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var f = 0, c = Object.getOwnPropertySymbols(a); f < c.length; f++)
      r.indexOf(c[f]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(a, c[f]) &&
        (o[c[f]] = a[c[f]]);
  return o;
}
function E0(a) {
  return a;
}
function S0(a, r) {
  r === void 0 && (r = E0);
  let o = [],
    c = !1;
  return {
    read: function () {
      if (c)
        throw new Error(
          'Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.',
        );
      return o.length ? o[o.length - 1] : a;
    },
    useMedium: function (y) {
      const d = r(y, c);
      return (
        o.push(d),
        function () {
          o = o.filter(function (m) {
            return m !== d;
          });
        }
      );
    },
    assignSyncMedium: function (y) {
      for (c = !0; o.length;) {
        const d = o;
        ((o = []), d.forEach(y));
      }
      o = {
        push: function (d) {
          return y(d);
        },
        filter: function () {
          return o;
        },
      };
    },
    assignMedium: function (y) {
      c = !0;
      let d = [];
      if (o.length) {
        const v = o;
        ((o = []), v.forEach(y), (d = o));
      }
      const m = function () {
          const v = d;
          ((d = []), v.forEach(y));
        },
        p = function () {
          return Promise.resolve().then(m);
        };
      (p(),
        (o = {
          push: function (v) {
            (d.push(v), p());
          },
          filter: function (v) {
            return ((d = d.filter(v)), o);
          },
        }));
    },
  };
}
function Ud(a, r) {
  return (r === void 0 && (r = E0), S0(a, r));
}
function _0(a) {
  a === void 0 && (a = {});
  const r = S0(null);
  return ((r.options = Yo({ async: !0, ssr: !1 }, a)), r);
}
const T0 = function (a) {
  const r = a.sideCar,
    o = DS(a, ['sideCar']);
  if (!r) throw new Error('Sidecar: please provide `sideCar` property to import the right car');
  const c = r.read();
  if (!c) throw new Error('Sidecar medium not found');
  return L.createElement(c, Yo({}, o));
};
T0.isSideCarExport = !0;
function jS(a, r) {
  return (a.useMedium(r), T0);
}
const O0 = Ud({}, function (a) {
    const r = a.target,
      o = a.currentTarget;
    return { target: r, currentTarget: o };
  }),
  A0 = Ud(),
  MS = Ud(),
  LS = _0({ async: !0 }),
  zS = [],
  ec = L.forwardRef(function (r, o) {
    let c;
    const f = L.useState(),
      y = f[0],
      d = f[1],
      m = L.useRef(),
      p = L.useRef(!1),
      v = L.useRef(null),
      E = r.children,
      g = r.disabled,
      A = r.noFocusGuards,
      R = r.persistentFocus,
      x = r.crossFrame,
      S = r.autoFocus,
      _ = r.allowTextSelection,
      k = r.group,
      B = r.className,
      q = r.whiteList,
      W = r.shards,
      te = W === void 0 ? zS : W,
      ee = r.as,
      Z = ee === void 0 ? 'div' : ee,
      K = r.lockProps,
      ce = K === void 0 ? {} : K,
      he = r.sideCar,
      Ee = r.returnFocus,
      G = r.onActivation,
      ae = r.onDeactivation,
      ue = L.useState({}),
      ie = ue[0],
      I = L.useCallback(
        function () {
          ((v.current = v.current || (document && document.activeElement)),
            m.current && G && G(m.current),
            (p.current = !0));
        },
        [G],
      ),
      P = L.useCallback(
        function () {
          ((p.current = !1), ae && ae(m.current));
        },
        [ae],
      ),
      J = L.useCallback(
        function (re) {
          const oe = v.current;
          if (Ee && oe && oe.focus) {
            const Te = typeof Ee == 'object' ? Ee : void 0;
            ((v.current = null),
              re
                ? Promise.resolve().then(function () {
                    return oe.focus(Te);
                  })
                : oe.focus(Te));
          }
        },
        [Ee],
      ),
      se = L.useCallback(function (re) {
        p.current && O0.useMedium(re);
      }, []),
      le = A0.useMedium,
      xe = L.useCallback(function (re) {
        m.current !== re && ((m.current = re), d(re));
      }, []);
    (typeof _ < 'u' &&
      console.warn('React-Focus-Lock: allowTextSelection is deprecated and enabled by default'),
      L.useEffect(function () {
        m.current || console.error('FocusLock: could not obtain ref to internal node');
      }, []));
    const je = dd(((c = {}), (c[v0] = g && 'disabled'), (c[gd] = k), c), ce),
      be = A !== !0,
      C = be && A !== 'tail',
      $ = b0([o, xe]);
    return L.createElement(
      L.Fragment,
      null,
      be && [
        L.createElement('div', {
          key: 'guard-first',
          'data-focus-guard': !0,
          tabIndex: g ? -1 : 0,
          style: Zf,
        }),
        L.createElement('div', {
          key: 'guard-nearest',
          'data-focus-guard': !0,
          tabIndex: g ? -1 : 1,
          style: Zf,
        }),
      ],
      !g &&
        L.createElement(he, {
          id: ie,
          sideCar: LS,
          observed: y,
          disabled: g,
          persistentFocus: R,
          crossFrame: x,
          autoFocus: S,
          whiteList: q,
          shards: te,
          onActivation: I,
          onDeactivation: P,
          returnFocus: J,
        }),
      L.createElement(Z, dd({ ref: $ }, je, { className: B, onBlur: le, onFocus: se }), E),
      C && L.createElement('div', { 'data-focus-guard': !0, tabIndex: g ? -1 : 0, style: Zf }),
    );
  });
ec.propTypes = {
  children: Ye.node,
  disabled: Ye.bool,
  returnFocus: Ye.oneOfType([Ye.bool, Ye.object]),
  noFocusGuards: Ye.bool,
  allowTextSelection: Ye.bool,
  autoFocus: Ye.bool,
  persistentFocus: Ye.bool,
  crossFrame: Ye.bool,
  group: Ye.string,
  className: Ye.string,
  whiteList: Ye.func,
  shards: Ye.arrayOf(Ye.any),
  as: Ye.oneOfType([Ye.string, Ye.func, Ye.object]),
  lockProps: Ye.object,
  onActivation: Ye.func,
  onDeactivation: Ye.func,
  sideCar: Ye.any.isRequired,
};
ec.defaultProps = {
  children: void 0,
  disabled: !1,
  returnFocus: !1,
  noFocusGuards: !1,
  autoFocus: !0,
  persistentFocus: !1,
  crossFrame: !0,
  allowTextSelection: void 0,
  group: void 0,
  className: void 0,
  whiteList: void 0,
  shards: void 0,
  as: 'div',
  lockProps: {},
  onActivation: void 0,
  onDeactivation: void 0,
};
function hd(a, r) {
  return (
    (hd =
      Object.setPrototypeOf ||
      function (c, f) {
        return ((c.__proto__ = f), c);
      }),
    hd(a, r)
  );
}
function US(a, r) {
  ((a.prototype = Object.create(r.prototype)), (a.prototype.constructor = a), hd(a, r));
}
function BS(a, r, o) {
  return (
    r in a
      ? Object.defineProperty(a, r, { value: o, enumerable: !0, configurable: !0, writable: !0 })
      : (a[r] = o),
    a
  );
}
function kS(a, r) {
  {
    if (typeof a != 'function') throw new Error('Expected reducePropsToState to be a function.');
    if (typeof r != 'function')
      throw new Error('Expected handleStateChangeOnClient to be a function.');
  }
  function o(c) {
    return c.displayName || c.name || 'Component';
  }
  return function (f) {
    if (typeof f != 'function')
      throw new Error('Expected WrappedComponent to be a React component.');
    const y = [];
    let d;
    function m() {
      ((d = a(
        y.map(function (v) {
          return v.props;
        }),
      )),
        r(d));
    }
    const p = (function (v) {
      US(E, v);
      function E() {
        return v.apply(this, arguments) || this;
      }
      E.peek = function () {
        return d;
      };
      const g = E.prototype;
      return (
        (g.componentDidMount = function () {
          (y.push(this), m());
        }),
        (g.componentDidUpdate = function () {
          m();
        }),
        (g.componentWillUnmount = function () {
          const R = y.indexOf(this);
          (y.splice(R, 1), m());
        }),
        (g.render = function () {
          return L.createElement(f, this.props);
        }),
        E
      );
    })(L.PureComponent);
    return (BS(p, 'displayName', 'SideEffect(' + o(f) + ')'), p);
  };
}
const Jl = function (a) {
    const r = Array(a.length);
    for (let o = 0; o < a.length; ++o) r[o] = a[o];
    return r;
  },
  md = function (a) {
    return Array.isArray(a) ? a : [a];
  },
  HS = function (a) {
    const r = new Set(),
      o = a.length;
    for (let c = 0; c < o; c += 1)
      for (let f = c + 1; f < o; f += 1) {
        const y = a[c].compareDocumentPosition(a[f]);
        ((y & Node.DOCUMENT_POSITION_CONTAINED_BY) > 0 && r.add(f),
          (y & Node.DOCUMENT_POSITION_CONTAINS) > 0 && r.add(c));
      }
    return a.filter(function (c, f) {
      return !r.has(f);
    });
  };
var x0 = function (a) {
  return a.parentNode ? x0(a.parentNode) : a;
};
const Bd = function (a) {
    return md(a)
      .filter(Boolean)
      .reduce(function (o, c) {
        const f = c.getAttribute(gd);
        return (
          o.push.apply(
            o,
            f
              ? HS(
                  Jl(
                    x0(c).querySelectorAll('[' + gd + '="' + f + '"]:not([' + v0 + '="disabled"])'),
                  ),
                )
              : [c],
          ),
          o
        );
      }, []);
  },
  FS = function (a) {
    return !a || !a.getPropertyValue
      ? !1
      : a.getPropertyValue('display') === 'none' || a.getPropertyValue('visibility') === 'hidden';
  };
var C0 = function (a) {
  return (
    !a ||
    a === document ||
    (a && a.nodeType === Node.DOCUMENT_NODE) ||
    (!FS(window.getComputedStyle(a, null)) &&
      C0(
        a.parentNode && a.parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE
          ? a.parentNode.host
          : a.parentNode,
      ))
  );
};
const GS = function (a) {
    return !(
      (a.tagName === 'INPUT' || a.tagName === 'BUTTON') &&
      (a.type === 'hidden' || a.disabled)
    );
  },
  kd = function (a) {
    return !!(a && a.dataset && a.dataset.focusGuard);
  },
  Vo = function (a) {
    return !kd(a);
  },
  qS = function (a) {
    return !!a;
  },
  YS = function (a, r) {
    const o = a.tabIndex - r.tabIndex,
      c = a.index - r.index;
    if (o) {
      if (!a.tabIndex) return 1;
      if (!r.tabIndex) return -1;
    }
    return o || c;
  },
  w0 = function (a, r, o) {
    return Jl(a)
      .map(function (c, f) {
        return {
          node: c,
          index: f,
          tabIndex: o && c.tabIndex === -1 ? ((c.dataset || {}).focusGuard ? 0 : -1) : c.tabIndex,
        };
      })
      .filter(function (c) {
        return !r || c.tabIndex >= 0;
      })
      .sort(YS);
  },
  VS = [
    'button:enabled',
    'select:enabled',
    'textarea:enabled',
    'input:enabled',
    'a[href]',
    'area[href]',
    'summary',
    'iframe',
    'object',
    'embed',
    'audio[controls]',
    'video[controls]',
    '[tabindex]',
    '[contenteditable]',
    '[autofocus]',
  ],
  vd = VS.join(','),
  IS = vd + ', [data-focus-guard]',
  Hd = function (a, r) {
    return a.reduce(function (o, c) {
      return o.concat(
        Jl(c.querySelectorAll(r ? IS : vd)),
        c.parentNode
          ? Jl(c.parentNode.querySelectorAll(vd)).filter(function (f) {
              return f === c;
            })
          : [],
      );
    }, []);
  },
  ZS = function (a) {
    const r = a.querySelectorAll('[' + wS + ']');
    return Jl(r)
      .map(function (o) {
        return Hd([o]);
      })
      .reduce(function (o, c) {
        return o.concat(c);
      }, []);
  },
  Fd = function (a) {
    return Jl(a)
      .filter(function (r) {
        return C0(r);
      })
      .filter(function (r) {
        return GS(r);
      });
  },
  bd = function (a, r) {
    return w0(Fd(Hd(a, r)), !0, r);
  },
  cm = function (a) {
    return w0(Fd(Hd(a)), !1);
  },
  XS = function (a) {
    return Fd(ZS(a));
  };
var Ed = function (a, r) {
  return (r === void 0 && (r = []), r.push(a), a.parentNode && Ed(a.parentNode, r), r);
};
const Xf = function (a, r) {
    const o = Ed(a),
      c = Ed(r);
    for (let f = 0; f < o.length; f += 1) {
      const y = o[f];
      if (c.indexOf(y) >= 0) return y;
    }
    return !1;
  },
  R0 = function (a, r, o) {
    const c = md(a),
      f = md(r),
      y = c[0];
    let d = !1;
    return (
      f.filter(Boolean).forEach(function (m) {
        ((d = Xf(d || m, m) || d),
          o.filter(Boolean).forEach(function (p) {
            const v = Xf(y, p);
            v && (!d || v.contains(d) ? (d = v) : (d = Xf(v, d)));
          }));
      }),
      d
    );
  },
  QS = function (a) {
    return a.reduce(function (r, o) {
      return r.concat(XS(o));
    }, []);
  },
  $S = function (a) {
    const r = Bd(a).filter(Vo),
      o = R0(a, a, r),
      c = bd([o], !0),
      f = bd(r)
        .filter(function (y) {
          const d = y.node;
          return Vo(d);
        })
        .map(function (y) {
          return y.node;
        });
    return c.map(function (y) {
      const d = y.node,
        m = y.index;
      return { node: d, index: m, lockItem: f.indexOf(d) >= 0, guard: kd(d) };
    });
  },
  KS = function (a) {
    return a === document.activeElement;
  },
  JS = function (a) {
    return !!Jl(a.querySelectorAll('iframe')).some(function (r) {
      return KS(r);
    });
  },
  N0 = function (a) {
    const r = document && document.activeElement;
    return !r || (r.dataset && r.dataset.focusGuard)
      ? !1
      : Bd(a).reduce(function (o, c) {
          return o || c.contains(r) || JS(c);
        }, !1);
  },
  PS = function () {
    return (
      document &&
      Jl(document.querySelectorAll('[' + CS + ']')).some(function (a) {
        return a.contains(document.activeElement);
      })
    );
  },
  D0 = function (a) {
    return a.tagName === 'INPUT' && a.type === 'radio';
  },
  WS = function (a, r) {
    return (
      r
        .filter(D0)
        .filter(function (o) {
          return o.name === a.name;
        })
        .filter(function (o) {
          return o.checked;
        })[0] || a
    );
  },
  Gd = function (a, r) {
    return D0(a) && a.name ? WS(a, r) : a;
  },
  e_ = function (a) {
    const r = new Set();
    return (
      a.forEach(function (o) {
        return r.add(Gd(o, a));
      }),
      a.filter(function (o) {
        return r.has(o);
      })
    );
  },
  sm = function (a) {
    return a[0] && a.length > 1 ? Gd(a[0], a) : a[0];
  },
  fm = function (a, r) {
    return a.length > 1 ? a.indexOf(Gd(a[r], a)) : r;
  },
  j0 = 'NEW_FOCUS',
  t_ = function (a, r, o, c) {
    const f = a.length,
      y = a[0],
      d = a[f - 1],
      m = kd(o);
    if (a.indexOf(o) >= 0) return;
    const p = r.indexOf(o),
      v = c ? r.indexOf(c) : p,
      E = c ? a.indexOf(c) : -1,
      g = p - v,
      A = r.indexOf(y),
      R = r.indexOf(d),
      x = e_(r),
      S = x.indexOf(o) - (c ? x.indexOf(c) : p),
      _ = fm(a, 0),
      k = fm(a, f - 1);
    if (p === -1 || E === -1) return j0;
    if (!g && E >= 0) return E;
    if (p <= A && m && Math.abs(g) > 1) return k;
    if (p >= R && m && Math.abs(g) > 1) return _;
    if (g && Math.abs(S) > 1) return E;
    if (p <= A) return k;
    if (p > R) return _;
    if (g) return Math.abs(g) > 1 ? E : (f + E + g) % f;
  },
  n_ = function (a) {
    return function (r) {
      return r.autofocus || (r.dataset && !!r.dataset.autofocus) || a.indexOf(r) >= 0;
    };
  },
  l_ = function (a, r) {
    const o = new Map();
    return (
      r.forEach(function (c) {
        return o.set(c.node, c);
      }),
      a
        .map(function (c) {
          return o.get(c);
        })
        .filter(qS)
    );
  },
  a_ = function (a, r) {
    const o = document && document.activeElement,
      c = Bd(a).filter(Vo),
      f = R0(o || a, a, c),
      y = cm(c);
    let d = bd(c).filter(function (g) {
      const A = g.node;
      return Vo(A);
    });
    if (!d[0] && ((d = y), !d[0])) return;
    const m = cm([f]).map(function (g) {
        return g.node;
      }),
      p = l_(m, d),
      v = p.map(function (g) {
        return g.node;
      }),
      E = t_(v, m, o, r);
    if (E === j0) {
      const g = y
        .map(function (A) {
          return A.node;
        })
        .filter(n_(QS(c)));
      return { node: g && g.length ? sm(g) : sm(v) };
    }
    return E === void 0 ? E : p[E];
  },
  r_ = function (a) {
    (a.focus(), 'contentWindow' in a && a.contentWindow && a.contentWindow.focus());
  };
let Qf = 0,
  $f = !1;
const M0 = function (a, r) {
  const o = a_(a, r);
  if (!$f && o) {
    if (Qf > 2) {
      (console.error(
        'FocusLock: focus-fighting detected. Only one focus management system could be active. See https://github.com/theKashey/focus-lock/#focus-fighting',
      ),
        ($f = !0),
        setTimeout(function () {
          $f = !1;
        }, 1));
      return;
    }
    (Qf++, r_(o.node), Qf--);
  }
};
function L0(a) {
  const r = window,
    o = r.setImmediate;
  typeof o < 'u' ? o(a) : setTimeout(a, 1);
}
const u_ = function () {
    return document && document.activeElement === document.body;
  },
  i_ = function () {
    return u_() || PS();
  };
let zr = null,
  Mr = null,
  Ur = null,
  Xu = !1;
const o_ = function () {
    return !0;
  },
  c_ = function (r) {
    return (zr.whiteList || o_)(r);
  },
  s_ = function (r, o) {
    Ur = { observerNode: r, portaledElement: o };
  },
  f_ = function (r) {
    return Ur && Ur.portaledElement === r;
  };
function dm(a, r, o, c) {
  let f = null,
    y = a;
  do {
    const d = c[y];
    if (d.guard) d.node.dataset.focusAutoGuard && (f = d);
    else if (d.lockItem) {
      if (y !== a) return;
      f = null;
    } else break;
  } while ((y += o) !== r);
  f && (f.node.tabIndex = 0);
}
const d_ = function (r) {
    return r && 'current' in r ? r.current : r;
  },
  y_ = function (r) {
    return r ? !!Xu : Xu === 'meanwhile';
  },
  Io = function () {
    let r = !1;
    if (zr) {
      const o = zr,
        c = o.observed,
        f = o.persistentFocus,
        y = o.autoFocus,
        d = o.shards,
        m = o.crossFrame,
        p = c || (Ur && Ur.portaledElement),
        v = document && document.activeElement;
      if (p) {
        const E = [p].concat(d.map(d_).filter(Boolean));
        if (
          ((!v || c_(v)) &&
            (f || y_(m) || !i_() || (!Mr && y)) &&
            (p &&
              !(N0(E) || f_(v)) &&
              (document && !Mr && v && !y
                ? (v.blur && v.blur(), document.body.focus())
                : ((r = M0(E, Mr)), (Ur = {}))),
            (Xu = !1),
            (Mr = document && document.activeElement)),
          document)
        ) {
          const g = document && document.activeElement,
            A = $S(E),
            R = A.map(function (x) {
              return x.node;
            }).indexOf(g);
          R > -1 &&
            (A.filter(function (x) {
              const S = x.guard,
                _ = x.node;
              return S && _.dataset.focusAutoGuard;
            }).forEach(function (x) {
              return x.node.removeAttribute('tabIndex');
            }),
            dm(R, A.length, 1, A),
            dm(R, -1, -1, A));
        }
      }
    }
    return r;
  },
  z0 = function (r) {
    Io() && r && (r.stopPropagation(), r.preventDefault());
  },
  qd = function () {
    return L0(Io);
  },
  p_ = function (r) {
    const o = r.target,
      c = r.currentTarget;
    c.contains(o) || s_(c, o);
  },
  g_ = function () {
    return null;
  };
Ye.node.isRequired;
const U0 = function () {
    ((Xu = 'just'),
      setTimeout(function () {
        Xu = 'meanwhile';
      }, 0));
  },
  h_ = function () {
    (document.addEventListener('focusin', z0, !0),
      document.addEventListener('focusout', qd),
      window.addEventListener('blur', U0));
  },
  m_ = function () {
    (document.removeEventListener('focusin', z0, !0),
      document.removeEventListener('focusout', qd),
      window.removeEventListener('blur', U0));
  };
function v_(a) {
  return a.filter(function (r) {
    return !r.disabled;
  });
}
function b_(a) {
  const r = a.slice(-1)[0];
  r && !zr && h_();
  const o = zr,
    c = o && r && r.id === o.id;
  ((zr = r),
    o &&
      !c &&
      (o.onDeactivation(),
      a.filter(function (f) {
        return f.id === o.id;
      }).length || o.returnFocus(!r)),
    r
      ? ((Mr = null), (!c || o.observed !== r.observed) && r.onActivation(), Io(), L0(Io))
      : (m_(), (Mr = null)));
}
O0.assignSyncMedium(p_);
A0.assignMedium(qd);
MS.assignMedium(function (a) {
  return a({ moveFocusInside: M0, focusInside: N0 });
});
const E_ = kS(v_, b_)(g_),
  B0 = L.forwardRef(function (r, o) {
    return L.createElement(ec, dd({ sideCar: E_, ref: o }, r));
  }),
  k0 = ec.propTypes || {};
k0.sideCar;
const S_ = ES(k0, ['sideCar']);
B0.propTypes = S_;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var Br =
  function () {
    return (
      (Br =
        Object.assign ||
        function (r) {
          for (var o, c = 1, f = arguments.length; c < f; c++) {
            o = arguments[c];
            for (const y in o) Object.prototype.hasOwnProperty.call(o, y) && (r[y] = o[y]);
          }
          return r;
        }),
      Br.apply(this, arguments)
    );
  };
function __(a, r) {
  const o = {};
  for (var c in a) Object.prototype.hasOwnProperty.call(a, c) && r.indexOf(c) < 0 && (o[c] = a[c]);
  if (a != null && typeof Object.getOwnPropertySymbols == 'function')
    for (var f = 0, c = Object.getOwnPropertySymbols(a); f < c.length; f++)
      r.indexOf(c[f]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(a, c[f]) &&
        (o[c[f]] = a[c[f]]);
  return o;
}
const Ho = 'right-scroll-bar-position',
  Fo = 'width-before-scroll-bar',
  T_ = 'with-scroll-bars-hidden',
  O_ = '--removed-body-scroll-bar-size',
  H0 = _0(),
  Kf = function () {},
  tc = L.forwardRef(function (a, r) {
    const o = L.useRef(null),
      c = L.useState({ onScrollCapture: Kf, onWheelCapture: Kf, onTouchMoveCapture: Kf }),
      f = c[0],
      y = c[1],
      d = a.forwardProps,
      m = a.children,
      p = a.className,
      v = a.removeScrollBar,
      E = a.enabled,
      g = a.shards,
      A = a.sideCar,
      R = a.noIsolation,
      x = a.inert,
      S = a.allowPinchZoom,
      _ = a.as,
      k = _ === void 0 ? 'div' : _,
      B = __(a, [
        'forwardProps',
        'children',
        'className',
        'removeScrollBar',
        'enabled',
        'shards',
        'sideCar',
        'noIsolation',
        'inert',
        'allowPinchZoom',
        'as',
      ]),
      q = A,
      W = b0([o, r]),
      te = Br({}, B, f);
    return L.createElement(
      L.Fragment,
      null,
      E &&
        L.createElement(q, {
          sideCar: H0,
          removeScrollBar: v,
          shards: g,
          noIsolation: R,
          inert: x,
          setCallbacks: y,
          allowPinchZoom: !!S,
          lockRef: o,
        }),
      d
        ? L.cloneElement(L.Children.only(m), Br({}, te, { ref: W }))
        : L.createElement(k, Br({}, te, { className: p, ref: W }), m),
    );
  });
tc.defaultProps = { enabled: !0, removeScrollBar: !0, inert: !1 };
tc.classNames = { fullWidth: Fo, zeroRight: Ho };
const A_ = function () {
  if (typeof __webpack_nonce__ < 'u') return __webpack_nonce__;
};
function x_() {
  if (!document) return null;
  const a = document.createElement('style');
  a.type = 'text/css';
  const r = A_();
  return (r && a.setAttribute('nonce', r), a);
}
function C_(a, r) {
  a.styleSheet ? (a.styleSheet.cssText = r) : a.appendChild(document.createTextNode(r));
}
function w_(a) {
  (document.head || document.getElementsByTagName('head')[0]).appendChild(a);
}
const R_ = function () {
    let a = 0,
      r = null;
    return {
      add: function (o) {
        (a == 0 && (r = x_()) && (C_(r, o), w_(r)), a++);
      },
      remove: function () {
        (a--, !a && r && (r.parentNode && r.parentNode.removeChild(r), (r = null)));
      },
    };
  },
  N_ = function () {
    const a = R_();
    return function (r) {
      L.useEffect(function () {
        return (
          a.add(r),
          function () {
            a.remove();
          }
        );
      }, []);
    };
  },
  F0 = function () {
    const a = N_();
    return function (o) {
      const c = o.styles;
      return (a(c), null);
    };
  },
  D_ = { left: 0, top: 0, right: 0, gap: 0 },
  Jf = function (a) {
    return parseInt(a || '', 10) || 0;
  },
  j_ = function (a) {
    const r = window.getComputedStyle(document.body),
      o = r[a === 'padding' ? 'paddingLeft' : 'marginLeft'],
      c = r[a === 'padding' ? 'paddingTop' : 'marginTop'],
      f = r[a === 'padding' ? 'paddingRight' : 'marginRight'];
    return [Jf(o), Jf(c), Jf(f)];
  },
  ym = function (a) {
    if ((a === void 0 && (a = 'margin'), typeof window > 'u')) return D_;
    const r = j_(a),
      o = document.documentElement.clientWidth,
      c = window.innerWidth;
    return { left: r[0], top: r[1], right: r[2], gap: Math.max(0, c - o + r[2] - r[0]) };
  },
  M_ = F0(),
  L_ = function (a, r, o, c) {
    const f = a.left,
      y = a.top,
      d = a.right,
      m = a.gap;
    return (
      o === void 0 && (o = 'margin'),
      `
  .` +
        T_ +
        ` {
   overflow: hidden ` +
        c +
        `;
   padding-right: ` +
        m +
        'px ' +
        c +
        `;
  }
  body {
    overflow: hidden ` +
        c +
        `;
    ` +
        [
          r && 'position: relative ' + c + ';',
          o === 'margin' &&
            `
    padding-left: ` +
              f +
              `px;
    padding-top: ` +
              y +
              `px;
    padding-right: ` +
              d +
              `px;
    margin-left:0;
    margin-top:0;
    margin-right: ` +
              m +
              'px ' +
              c +
              `;
    `,
          o === 'padding' && 'padding-right: ' + m + 'px ' + c + ';',
        ]
          .filter(Boolean)
          .join('') +
        `
  }
  
  .` +
        Ho +
        ` {
    right: ` +
        m +
        'px ' +
        c +
        `;
  }
  
  .` +
        Fo +
        ` {
    margin-right: ` +
        m +
        'px ' +
        c +
        `;
  }
  
  .` +
        Ho +
        ' .' +
        Ho +
        ` {
    right: 0 ` +
        c +
        `;
  }
  
  .` +
        Fo +
        ' .' +
        Fo +
        ` {
    margin-right: 0 ` +
        c +
        `;
  }
  
  body {
    ` +
        O_ +
        ': ' +
        m +
        `px;
  }
`
    );
  },
  z_ = function (a) {
    const r = L.useState(ym(a.gapMode)),
      o = r[0],
      c = r[1];
    L.useEffect(
      function () {
        c(ym(a.gapMode));
      },
      [a.gapMode],
    );
    const f = a.noRelative,
      y = a.noImportant,
      d = a.gapMode,
      m = d === void 0 ? 'margin' : d;
    return L.createElement(M_, { styles: L_(o, !f, m, y ? '' : '!important') });
  },
  U_ = function (a) {
    const r = window.getComputedStyle(a);
    return r.overflowY !== 'hidden' && !(r.overflowY === r.overflowX && r.overflowY === 'visible');
  },
  B_ = function (a) {
    const r = window.getComputedStyle(a);
    return r.overflowX !== 'hidden' && !(r.overflowY === r.overflowX && r.overflowX === 'visible');
  },
  pm = function (a, r) {
    let o = r;
    do {
      if (G0(a, o)) {
        const f = q0(a, o),
          y = f[1],
          d = f[2];
        if (y > d) return !0;
      }
      o = o.parentNode;
    } while (o && o !== document.body);
    return !1;
  },
  k_ = function (a) {
    const r = a.scrollTop,
      o = a.scrollHeight,
      c = a.clientHeight;
    return [r, o, c];
  },
  H_ = function (a) {
    const r = a.scrollLeft,
      o = a.scrollWidth,
      c = a.clientWidth;
    return [r, o, c];
  };
var G0 = function (a, r) {
    return a === 'v' ? U_(r) : B_(r);
  },
  q0 = function (a, r) {
    return a === 'v' ? k_(r) : H_(r);
  };
const F_ = function (a, r, o, c, f) {
  const y = c;
  let d = o.target;
  const m = r.contains(d);
  let p = !1;
  const v = y > 0;
  let E = 0,
    g = 0;
  do {
    const A = q0(a, d),
      R = A[0],
      x = A[1],
      S = A[2],
      _ = x - S - R;
    ((R || _) && G0(a, d) && ((E += _), (g += R)), (d = d.parentNode));
  } while ((!m && d !== document.body) || (m && (r.contains(d) || r === d)));
  return (((v && E === 0) || (!v && g === 0)) && (p = !0), p);
};
let Sd = !1;
if (typeof window < 'u')
  try {
    const a = Object.defineProperty({}, 'passive', {
      get: function () {
        return ((Sd = !0), !0);
      },
    });
    (window.addEventListener('test', a, a), window.removeEventListener('test', a, a));
  } catch {
    Sd = !1;
  }
const Nr = Sd ? { passive: !1 } : !1,
  Uo = function (a) {
    return 'changedTouches' in a
      ? [a.changedTouches[0].clientX, a.changedTouches[0].clientY]
      : [0, 0];
  },
  gm = function (a) {
    return [a.deltaX, a.deltaY];
  },
  hm = function (a) {
    return a && 'current' in a ? a.current : a;
  },
  G_ = function (a, r) {
    return a[0] === r[0] && a[1] === r[1];
  },
  q_ = function (a) {
    return (
      `
  .block-interactivity-` +
      a +
      ` {pointer-events: none;}
  .allow-interactivity-` +
      a +
      ` {pointer-events: all;}
`
    );
  };
let Y_ = 0,
  Dr = [];
function V_(a) {
  const r = L.useRef([]),
    o = L.useRef([0, 0]),
    c = L.useRef(),
    f = L.useState(Y_++)[0],
    y = L.useState(function () {
      return F0();
    })[0],
    d = L.useRef(a);
  (L.useEffect(
    function () {
      d.current = a;
    },
    [a],
  ),
    L.useEffect(
      function () {
        if (a.inert) {
          document.body.classList.add('block-interactivity-' + f);
          const S = [a.lockRef.current].concat((a.shards || []).map(hm)).filter(Boolean);
          return (
            S.forEach(function (_) {
              return _.classList.add('allow-interactivity-' + f);
            }),
            function () {
              (document.body.classList.remove('block-interactivity-' + f),
                S.forEach(function (_) {
                  return _.classList.remove('allow-interactivity-' + f);
                }));
            }
          );
        }
      },
      [a.inert, a.lockRef.current, a.shards],
    ));
  const m = L.useCallback(function (S, _) {
      if ('touches' in S && S.touches.length === 2) return !d.current.allowPinchZoom;
      const k = Uo(S),
        B = o.current,
        q = 'deltaX' in S ? S.deltaX : B[0] - k[0],
        W = 'deltaY' in S ? S.deltaY : B[1] - k[1];
      let te;
      const ee = S.target,
        Z = Math.abs(q) > Math.abs(W) ? 'h' : 'v';
      let K = pm(Z, ee);
      if (!K) return !0;
      if ((K ? (te = Z) : ((te = Z === 'v' ? 'h' : 'v'), (K = pm(Z, ee))), !K)) return !1;
      if ((!c.current && 'changedTouches' in S && (q || W) && (c.current = te), !te)) return !0;
      const ce = c.current || te;
      return F_(ce, _, S, ce === 'h' ? q : W);
    }, []),
    p = L.useCallback(function (S) {
      const _ = S;
      if (!Dr.length || Dr[Dr.length - 1] !== y) return;
      const k = 'deltaY' in _ ? gm(_) : Uo(_),
        B = r.current.filter(function (q) {
          return q.name === _.type && q.target === _.target && G_(q.delta, k);
        })[0];
      if (B && B.should) {
        _.preventDefault();
        return;
      }
      if (!B) {
        const q = (d.current.shards || [])
          .map(hm)
          .filter(Boolean)
          .filter(function (te) {
            return te.contains(_.target);
          });
        (q.length > 0 ? m(_, q[0]) : !d.current.noIsolation) && _.preventDefault();
      }
    }, []),
    v = L.useCallback(function (S, _, k, B) {
      const q = { name: S, delta: _, target: k, should: B };
      (r.current.push(q),
        setTimeout(function () {
          r.current = r.current.filter(function (W) {
            return W !== q;
          });
        }, 1));
    }, []),
    E = L.useCallback(function (S) {
      ((o.current = Uo(S)), (c.current = void 0));
    }, []),
    g = L.useCallback(function (S) {
      v(S.type, gm(S), S.target, m(S, a.lockRef.current));
    }, []),
    A = L.useCallback(function (S) {
      v(S.type, Uo(S), S.target, m(S, a.lockRef.current));
    }, []);
  L.useEffect(function () {
    return (
      Dr.push(y),
      a.setCallbacks({ onScrollCapture: g, onWheelCapture: g, onTouchMoveCapture: A }),
      document.addEventListener('wheel', p, Nr),
      document.addEventListener('touchmove', p, Nr),
      document.addEventListener('touchstart', E, Nr),
      function () {
        ((Dr = Dr.filter(function (S) {
          return S !== y;
        })),
          document.removeEventListener('wheel', p, Nr),
          document.removeEventListener('touchmove', p, Nr),
          document.removeEventListener('touchstart', E, Nr));
      }
    );
  }, []);
  const R = a.removeScrollBar,
    x = a.inert;
  return L.createElement(
    L.Fragment,
    null,
    x ? L.createElement(y, { styles: q_(f) }) : null,
    R ? L.createElement(z_, { gapMode: 'margin' }) : null,
  );
}
const I_ = jS(H0, V_),
  Y0 = L.forwardRef(function (a, r) {
    return L.createElement(tc, Br({}, a, { ref: r, sideCar: I_ }));
  });
Y0.classNames = tc.classNames;
function $n() {
  return (
    ($n =
      Object.assign ||
      function (a) {
        for (let r = 1; r < arguments.length; r++) {
          const o = arguments[r];
          for (const c in o) Object.prototype.hasOwnProperty.call(o, c) && (a[c] = o[c]);
        }
        return a;
      }),
    $n.apply(this, arguments)
  );
}
function nc(a, r) {
  if (a == null) return {};
  const o = {},
    c = Object.keys(a);
  let f, y;
  for (y = 0; y < c.length; y++) ((f = c[y]), !(r.indexOf(f) >= 0) && (o[f] = a[f]));
  return o;
}
const V0 = {
    allowPinchZoom: Ye.bool,
    dangerouslyBypassFocusLock: Ye.bool,
    dangerouslyBypassScrollLock: Ye.bool,
    initialFocusRef: function () {
      return null;
    },
    onDismiss: Ye.func,
  },
  Hr = Wo(function (r, o) {
    const c = r.as,
      f = c === void 0 ? 'div' : c,
      y = r.isOpen,
      d = y === void 0 ? !0 : y,
      m = nc(r, ['as', 'isOpen']);
    return (
      p0('dialog'),
      L.useEffect(
        function () {
          d
            ? (window.__REACH_DISABLE_TOOLTIPS = !0)
            : window.requestAnimationFrame(function () {
                window.__REACH_DISABLE_TOOLTIPS = !1;
              });
        },
        [d],
      ),
      d
        ? L.createElement(
            g0,
            { 'data-reach-dialog-wrapper': '' },
            L.createElement(Z_, $n({ ref: o, as: f }, m)),
          )
        : null
    );
  });
((Hr.displayName = 'DialogOverlay'), (Hr.propTypes = $n({}, V0, { isOpen: Ye.bool })));
var Z_ = Wo(function (r, o) {
  const c = r.allowPinchZoom,
    f = r.as,
    y = f === void 0 ? 'div' : f,
    d = r.dangerouslyBypassFocusLock,
    m = d === void 0 ? !1 : d,
    p = r.dangerouslyBypassScrollLock,
    v = p === void 0 ? !1 : p,
    E = r.initialFocusRef,
    g = r.onClick,
    A = r.onDismiss,
    R = A === void 0 ? $u : A,
    x = r.onKeyDown,
    S = r.onMouseDown,
    _ = r.unstable_lockFocusAcrossFrames,
    k = _ === void 0 ? !0 : _,
    B = nc(r, [
      'allowPinchZoom',
      'as',
      'dangerouslyBypassFocusLock',
      'dangerouslyBypassScrollLock',
      'initialFocusRef',
      'onClick',
      'onDismiss',
      'onKeyDown',
      'onMouseDown',
      'unstable_lockFocusAcrossFrames',
    ]),
    q = L.useRef(null),
    W = L.useRef(null),
    te = bS(W, o),
    ee = L.useCallback(
      function () {
        E && E.current && E.current.focus();
      },
      [E],
    );
  function Z(he) {
    q.current === he.target && (he.stopPropagation(), R(he));
  }
  function K(he) {
    he.key === 'Escape' && (he.stopPropagation(), R(he));
  }
  function ce(he) {
    q.current = he.target;
  }
  return (
    L.useEffect(function () {
      return W.current ? X_(W.current) : void 0;
    }, []),
    L.createElement(
      B0,
      { autoFocus: !0, returnFocus: !0, onActivation: ee, disabled: m, crossFrame: k },
      L.createElement(
        Y0,
        { allowPinchZoom: c, enabled: !v },
        L.createElement(
          y,
          $n({}, B, {
            ref: te,
            'data-reach-dialog-overlay': '',
            onClick: ko(g, Z),
            onKeyDown: ko(x, K),
            onMouseDown: ko(S, ce),
          }),
        ),
      ),
    )
  );
});
((Hr.displayName = 'DialogOverlay'), (Hr.propTypes = $n({}, V0)));
const Zo = Wo(function (r, o) {
  const c = r.as,
    f = c === void 0 ? 'div' : c,
    y = r.onClick;
  r.onKeyDown;
  const d = nc(r, ['as', 'onClick', 'onKeyDown']);
  return L.createElement(
    f,
    $n({ 'aria-modal': 'true', role: 'dialog', tabIndex: -1 }, d, {
      ref: o,
      'data-reach-dialog-content': '',
      onClick: ko(y, function (m) {
        m.stopPropagation();
      }),
    }),
  );
});
((Zo.displayName = 'DialogContent'), (Zo.propTypes = { 'aria-label': Xo, 'aria-labelledby': Xo }));
const mm = Wo(function (r, o) {
  const c = r.allowPinchZoom,
    f = c === void 0 ? !1 : c,
    y = r.initialFocusRef,
    d = r.isOpen,
    m = r.onDismiss,
    p = m === void 0 ? $u : m,
    v = nc(r, ['allowPinchZoom', 'initialFocusRef', 'isOpen', 'onDismiss']);
  return L.createElement(
    Hr,
    { allowPinchZoom: f, initialFocusRef: y, isOpen: d, onDismiss: p },
    L.createElement(Zo, $n({ ref: o }, v)),
  );
});
((mm.displayName = 'Dialog'),
  (mm.propTypes = {
    isOpen: Ye.bool,
    onDismiss: Ye.func,
    'aria-label': Xo,
    'aria-labelledby': Xo,
  }));
function X_(a) {
  const r = [],
    o = [],
    c = gS(a);
  return a
    ? (Array.prototype.forEach.call(c.querySelectorAll('body > *'), function (f) {
        let y, d;
        const m = (y = a.parentNode) == null || (d = y.parentNode) == null ? void 0 : d.parentNode;
        if (f === m) return;
        const p = f.getAttribute('aria-hidden');
        (p !== null && p !== 'false') ||
          (r.push(p), o.push(f), f.setAttribute('aria-hidden', 'true'));
      }),
      function () {
        o.forEach(function (f, y) {
          const d = r[y];
          d === null ? f.removeAttribute('aria-hidden') : f.setAttribute('aria-hidden', d);
        });
      })
    : (console.warn(
        'A ref has not yet been attached to a dialog node when attempting to call `createAriaHider`.',
      ),
      $u);
}
function Xo(a, r, o, c, f) {
  const y = `
See https://www.w3.org/TR/wai-aria/#aria-label for details.`;
  return !a['aria-label'] && !a['aria-labelledby']
    ? new Error(
        'A <' + o + '> must have either an `aria-label` or `aria-labelledby` prop.\n      ' + y,
      )
    : a['aria-label'] && a['aria-labelledby']
      ? new Error(
          'You provided both `aria-label` and `aria-labelledby` props to a <' +
            o +
            ">. If the a label for this component is visible on the screen, that label's component should be given a unique ID prop, and that ID should be passed as the `aria-labelledby` prop into <" +
            o +
            '>. If the label cannot be determined programmatically from the content of the element, an alternative label should be provided as the `aria-label` prop, which will be used as an `aria-label` on the HTML tag.' +
            y,
        )
      : a[r] != null && !mS(a[r])
        ? new Error(
            'Invalid prop `' +
              r +
              '` supplied to `' +
              o +
              '`. Expected `string`, received `' +
              (Array.isArray(f) ? 'array' : typeof f) +
              '`.',
          )
        : null;
}
const Q_ = ({ children: a, onClick: r, style: o, ...c }) =>
    b.jsx('button', {
      className: 'ladle-button',
      onClick: r,
      style: o,
      'aria-label': c['aria-label'],
      type: 'button',
      children: a,
    }),
  kr = ({ children: a, href: r, style: o }) =>
    b.jsx('a', { className: 'ladle-link', href: r, style: o, children: a }),
  Ma = ({ children: a }) => b.jsx('code', { className: 'ladle-code', children: a }),
  Yr = ({ children: a, close: r, isOpen: o, label: c, maxWidth: f = '40em' }) =>
    b.jsx(Hr, {
      isOpen: o,
      onDismiss: () => r(),
      'data-testid': 'ladle-dialog-overlay',
      children: b.jsxs(Zo, {
        'aria-label': c || 'Modal',
        'data-testid': 'ladle-dialog',
        style: { maxWidth: f },
        children: [
          b.jsx('div', {
            style: { position: 'absolute', insetInlineEnd: '-6px', top: '0px' },
            children: b.jsx(Q_, {
              onClick: () => r(),
              'aria-label': 'Close modal',
              style: {
                height: '36px',
                width: '36px',
                borderColor: 'transparent',
                boxShadow: 'none',
              },
              children: b.jsx(JE, {}),
            }),
          }),
          b.jsx('div', { className: 'ladle-addon-modal-body', children: a }),
        ],
      }),
    });
var Ft;
(function (a) {
  ((a.Full = 'full'), (a.Preview = 'preview'));
})(Ft || (Ft = {}));
var st;
(function (a) {
  ((a.Light = 'light'), (a.Dark = 'dark'), (a.Auto = 'auto'));
})(st || (st = {}));
var Ae;
(function (a) {
  ((a.Boolean = 'boolean'),
    (a.String = 'string'),
    (a.Number = 'number'),
    (a.Complex = 'complex'),
    (a.Function = 'function'),
    (a.Radio = 'radio'),
    (a.InlineRadio = 'inline-radio'),
    (a.Select = 'select'),
    (a.MultiSelect = 'multi-select'),
    (a.Check = 'check'),
    (a.InlineCheck = 'inline-check'),
    (a.Action = 'action'),
    (a.Range = 'range'),
    (a.Background = 'background'));
})(Ae || (Ae = {}));
var De;
(function (a) {
  ((a.UpdateAll = 'update-all'),
    (a.UpdateMode = 'update-mode'),
    (a.UpdateAction = 'update-action'),
    (a.UpdateRtl = 'update-rtl'),
    (a.UpdateSource = 'update-source'),
    (a.UpdateStory = 'update-story'),
    (a.UpdateTheme = 'update-theme'),
    (a.UpdateWidth = 'update-width'),
    (a.UpdateControl = 'update-control'),
    (a.UpdateControlIntialized = 'update-control-initialized'),
    (a.UpdateHotkeys = 'update-hotkeys'));
})(De || (De = {}));
const vm = (a) => {
    switch (a) {
      case Ae.Boolean:
        return 'checkbox';
      case Ae.Number:
        return 'number';
      case Ae.Range:
        return 'range';
      default:
        return 'text';
    }
  },
  bm = (a, r) => {
    switch (r) {
      case Ae.Boolean:
        return a.checked;
      case Ae.Number:
      case Ae.Range:
        return parseFloat(a.value);
      default:
        return a.value;
    }
  },
  Qo = (a, r) =>
    r && r.some((c) => c === Number(a))
      ? Number(a)
      : a === 'true' || a === 'false'
        ? a !== 'false'
        : a,
  I0 = (a, r) => {
    const o = Kn.parse(a),
      c = {};
    return Object.keys(r).length === 0
      ? r
      : (Object.keys(o).forEach((f) => {
          if (f.startsWith('arg-') && r[f.split('-')[1]]) {
            const d = f.split('-')[1],
              m = o[f],
              p = r[d].type;
            if (p !== Ae.Action) {
              let v = m;
              switch (p) {
                case Ae.String:
                  v = decodeURI(m);
                  break;
                case Ae.Boolean:
                  v = m === 'true';
                  break;
                case Ae.Range:
                  v = parseFloat(m);
                  break;
                case Ae.Number:
                  v = parseInt(m, 10);
                  break;
                case Ae.Complex:
                  v = JSON.parse(decodeURI(m));
                  break;
                case Ae.Radio:
                case Ae.InlineRadio:
                case Ae.Select:
                case Ae.Background:
                  v = Qo(decodeURI(m), r[d].options);
                  break;
                case Ae.InlineCheck:
                case Ae.MultiSelect:
                case Ae.Check:
                  v = Qo(JSON.parse(decodeURI(m)), r[d].options);
                  break;
              }
              c[d] = {
                value: v,
                defaultValue: r[d].defaultValue,
                description: r[d].description,
                type: r[d].type,
              };
            }
          }
        }),
        c);
  },
  $_ = ({ controlKey: a, globalState: r, dispatch: o }) => {
    const c = r.control[a],
      f = r.control[a].name || a;
    if (r.control[a].type === Ae.Action)
      return b.jsxs('tr', {
        children: [b.jsx('td', { children: f }), b.jsx('td', { children: 'action' })],
      });
    if (r.control[a].type === Ae.Function)
      return b.jsxs('tr', {
        children: [b.jsx('td', { children: f }), b.jsx('td', { children: 'function' })],
      });
    if (
      r.control[a].type === Ae.Radio ||
      r.control[a].type === Ae.InlineRadio ||
      (r.control[a].type === Ae.Background && r.control[a].options.length < 5)
    )
      return b.jsxs('tr', {
        children: [
          b.jsx('td', { children: f }),
          b.jsx('td', {
            style: r.control[a].type === Ae.InlineRadio ? { display: 'flex' } : {},
            children: (r.control[a].options || []).map((y) => {
              const d = r.control[a].value,
                p = (r.control[a].labels || {})[y] || y,
                v = d === y || d === String(y);
              return b.jsxs(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    ...(r.control[a].type === Ae.InlineRadio ? { paddingRight: '0.5em' } : {}),
                  },
                  children: [
                    b.jsx('input', {
                      id: `${a}-${String(y)}`,
                      type: 'radio',
                      name: a,
                      value: String(y),
                      onChange: () => {
                        o({
                          type: De.UpdateControl,
                          value: {
                            ...r.control,
                            [a]: { ...r.control[a], value: Qo(String(y), r.control[a].options) },
                          },
                        });
                      },
                      checked: v,
                    }),
                    b.jsx('label', { htmlFor: `${a}-${String(y)}`, children: String(p) }),
                  ],
                },
                `${String(y)}-${a}`,
              );
            }),
          }),
        ],
      });
    if (
      r.control[a].type === Ae.Check ||
      r.control[a].type === Ae.InlineCheck ||
      r.control[a].type === Ae.MultiSelect
    )
      return b.jsxs('tr', {
        children: [
          b.jsx('td', { children: f }),
          b.jsx('td', {
            style: r.control[a].type === Ae.InlineCheck ? { display: 'flex' } : {},
            children: (r.control[a].options || []).map((y) => {
              const d = new Set(r.control[a].value),
                p = (r.control[a].labels || {})[y] || y;
              return b.jsxs(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    ...(r.control[a].type === Ae.InlineCheck ? { paddingRight: '0.5em' } : {}),
                  },
                  children: [
                    b.jsx('input', {
                      id: `${a}-${String(y)}`,
                      type: 'checkbox',
                      name: `${a}-${String(y)}`,
                      value: String(y),
                      checked: d.has(String(y)),
                      onChange: () => {
                        const v = String(y);
                        (d.has(v) ? d.delete(v) : d.add(v),
                          o({
                            type: De.UpdateControl,
                            value: {
                              ...r.control,
                              [a]: { ...r.control[a], value: d.size > 0 ? Array.from(d) : void 0 },
                            },
                          }));
                      },
                    }),
                    b.jsx('label', {
                      htmlFor: `${a}-${String(y)}`,
                      style: { marginLeft: '0.3em' },
                      children: String(p),
                    }),
                  ],
                },
                `${String(y)}-${a}`,
              );
            }),
          }),
        ],
      });
    if (r.control[a].type === Ae.Select || r.control[a].type === Ae.Background)
      return b.jsxs('tr', {
        children: [
          b.jsx('td', { children: b.jsx('label', { htmlFor: a, children: f }) }),
          b.jsx('td', {
            children: b.jsxs('select', {
              id: a,
              value: String(r.control[a].value),
              onChange: (y) => {
                const d = r.control[a].labels || {},
                  m = Object.keys(d).find((p) => d[p] === y.target.value) || y.target.value;
                o({
                  type: De.UpdateControl,
                  value: {
                    ...r.control,
                    [a]: { ...r.control[a], value: Qo(m, r.control[a].options) },
                  },
                });
              },
              children: [
                b.jsx('option', { value: 'undefined', disabled: !0, children: 'Choose option...' }),
                (r.control[a].options || []).map((y) => {
                  const m = (r.control[a].labels || {})[y] || y;
                  return b.jsx('option', { children: String(m) }, `${y}-${a}`);
                }),
              ],
            }),
          }),
        ],
      });
    if (r.control[a].type === Ae.Complex) {
      let y = '';
      try {
        y = JSON.stringify(r.control[a].value);
      } catch {
        y = 'Object/Array argument must be serializable.';
      }
      return b.jsxs('tr', {
        children: [
          b.jsx('td', { children: b.jsx('label', { htmlFor: a, children: f }) }),
          b.jsx('td', {
            children: b.jsx('textarea', {
              id: a,
              defaultValue: y,
              onChange: (d) => {
                let m = r.control[a].value;
                try {
                  m = JSON.parse(d.target.value);
                } catch {}
                o({
                  type: De.UpdateControl,
                  value: { ...r.control, [a]: { ...r.control[a], value: m } },
                });
              },
            }),
          }),
        ],
      });
    }
    if (c.type === Ae.Range) {
      const y = c.min ?? 0,
        d = c.max ?? 100;
      return b.jsxs('tr', {
        children: [
          b.jsx('td', { children: b.jsx('label', { htmlFor: a, children: f }) }),
          b.jsxs('td', {
            children: [
              y,
              b.jsx('input', {
                id: a,
                type: vm(c.type),
                value: c.value,
                min: c.min,
                max: c.max,
                step: c.step,
                onChange: (m) =>
                  o({
                    type: De.UpdateControl,
                    value: { ...r.control, [a]: { ...c, value: bm(m.target, c.type) } },
                  }),
              }),
              c.value,
              ' / ',
              d,
            ],
          }),
        ],
      });
    }
    return b.jsxs('tr', {
      children: [
        b.jsx('td', { children: b.jsx('label', { htmlFor: a, children: f }) }),
        b.jsx('td', {
          children: b.jsx('input', {
            id: a,
            type: vm(r.control[a].type),
            value: r.control[a].value,
            checked: r.control[a].type === Ae.Boolean && r.control[a].value === !0,
            onChange: (y) =>
              o({
                type: De.UpdateControl,
                value: {
                  ...r.control,
                  [a]: { ...r.control[a], value: bm(y.target, r.control[a].type) },
                },
              }),
          }),
        }),
      ],
    });
  },
  K_ = ({ globalState: a, dispatch: r }) => {
    const [o, c] = L.useState(!1);
    En(ge.hotkeys.control, () => c((d) => !d), { enabled: a.hotkeys && ge.addons.control.enabled });
    const f = 'Explore different versions of this story through controls.',
      y = Object.keys(a.control).filter(
        (d) => JSON.stringify(a.control[d].value) !== JSON.stringify(a.control[d].defaultValue),
      );
    return b.jsx('li', {
      children: b.jsxs('button', {
        'aria-label': f,
        title: f,
        onClick: () => c(!0),
        className: o ? 'ladle-active' : '',
        'data-testid': 'addon-control',
        type: 'button',
        children: [
          b.jsx(rS, {}),
          b.jsx('span', { className: 'ladle-addon-tooltip', children: f }),
          b.jsx('label', { children: 'Story Controls' }),
          y.length ? b.jsx('div', { className: 'ladle-badge', children: y.length }) : null,
          b.jsxs(Yr, {
            isOpen: o,
            close: () => c(!1),
            label: 'Toggle different controls to update the story.',
            children: [
              b.jsx('table', {
                className: 'ladle-controls-table',
                children: b.jsx('tbody', {
                  children: Object.keys(a.control)
                    .sort()
                    .map((d) => b.jsx($_, { globalState: a, dispatch: r, controlKey: d }, d)),
                }),
              }),
              b.jsx('button', {
                onClick: () => {
                  const d = {};
                  (Object.keys(a.control).forEach((m) => {
                    d[m] = { ...a.control[m], value: a.control[m].defaultValue };
                  }),
                    r({ type: De.UpdateControl, value: d }));
                },
                type: 'button',
                children: 'Reset to defaults',
              }),
            ],
          }),
        ],
      }),
    });
  },
  Em = [
    'select',
    'multi-select',
    'radio',
    'inline-radio',
    'background',
    'check',
    'inline-check',
    'range',
    'color',
    'date',
    'number',
    'text',
    'boolean',
  ],
  J_ = ({ component: a, args: r, argTypes: o }) => {
    const { globalState: c, dispatch: f } = sd(),
      y = (p) => (v) => {
        f({ type: De.UpdateAction, value: { name: p, event: v }, clear: !1 });
      };
    L.useEffect(() => {
      const p = {};
      let v = 0;
      if (
        (r &&
          Object.keys(r).forEach((E) => {
            const g = r[E];
            if (c.control[E])
              p[E] = {
                type: c.control[E].type,
                defaultValue: g,
                value: c.control[E].value,
                description: '',
              };
            else {
              let A = Ae.Complex;
              switch (typeof g) {
                case 'function':
                  A = Ae.Function;
                  break;
                case 'boolean':
                  A = Ae.Boolean;
                  break;
                case 'number':
                  A = Ae.Number;
                  break;
                case 'string':
                  A = Ae.String;
                  break;
              }
              p[E] = { type: A, defaultValue: g, value: g, description: '' };
            }
          }),
        o &&
          Object.keys(o).forEach((E) => {
            const g = o[E];
            if (g && g.action) {
              p[E] = { type: Ae.Action, defaultValue: y(E), value: y(E), description: '' };
              return;
            }
            if (!g.control || !g.control.type)
              throw new Error('argTypes should have control type specified');
            if (Em.indexOf(g.control.type) === -1)
              throw new Error(
                `only ${Em.join(', ')} argTypes are supported now. For strings, booleans and numbers use just args.`,
              );
            if (g.control.type === 'background' && (v++, v > 1))
              throw new Error(
                "There can be only single argType with the type background since it's used to change Ladle's background color.",
              );
            ((p[E] = {
              name: g.name,
              type: g.control.type,
              labels: g.control.labels,
              defaultValue: r[E] === void 0 ? g.defaultValue : r[E],
              options: g.options,
              value: r[E] === void 0 ? g.defaultValue : r[E],
              description: g.description || E,
              min: g.control.min,
              max: g.control.max,
              step: g.control.step,
            }),
              c.control[E] && (p[E].value = c.control[E].value));
          }),
        Object.keys(p).length)
      ) {
        const E = I0(location.search, p);
        (Object.keys(E).forEach((g) => {
          p[g].value = E[g].value;
        }),
          Object.keys(p).some((g) => !c.control[g] || p[g].value !== c.control[g].value) &&
            f({ type: De.UpdateControl, value: p }));
      } else c.controlInitialized || f({ type: De.UpdateControlIntialized, value: !0 });
    }, []);
    const d = (p, v) =>
        o && o[p] && o[p].mapping && Object.prototype.hasOwnProperty.call(o[p].mapping, v)
          ? o[p].mapping[v]
          : v,
      m = {};
    return (
      Object.keys(c.control).forEach((p) => {
        Array.isArray(c.control[p].value)
          ? (m[p] = c.control[p].value.map((v) => d(p, v)))
          : (m[p] = d(p, c.control[p].value));
      }),
      c.controlInitialized ? L.createElement(a, m) : null
    );
  },
  P_ = ({ children: a, msw: r }) => {
    const [o, c] = L.useState(!1);
    return (
      L.useEffect(
        () => (
          (async () => {
            if (r.length > 0) {
              const { setupWorker: y } = await qr(async () => {
                const { setupWorker: d } = await import('./empty-module-BIHI7g3E.js');
                return { setupWorker: d };
              }, []);
              window.__ladle_msw
                ? (window.__ladle_msw.use(...r), c(!0))
                : ((window.__ladle_msw = y()),
                  window.__ladle_msw.use(...r),
                  window.__ladle_msw
                    .start({ serviceWorker: { url: '/mockServiceWorker.js' } })
                    .then(() => {
                      c(!0);
                    }));
            }
          })(),
          () => {
            window.__ladle_msw && window.__ladle_msw.resetHandlers();
          }
        ),
        [r],
      ),
      r.length === 0 || o ? a : null
    );
  };
function lc(a, r) {
  let o = [],
    c = {},
    f = [];
  (a.default && a.default.msw && (f = a.default.msw), a[r] && a[r].msw && (f = a[r].msw));
  const y = {
    args: {
      ...rT,
      ...(a.default && a.default.args ? a.default.args : {}),
      ...(a[r].args ? a[r].args : {}),
    },
    argTypes: {
      ...uT,
      ...(a.default && a.default.argTypes ? a.default.argTypes : {}),
      ...(a[r].argTypes ? a[r].argTypes : {}),
    },
    component: a[r],
  };
  return (
    a[r] && Array.isArray(a[r].decorators) && (o = [...o, ...a[r].decorators]),
    a.default && Array.isArray(a.default.decorators) && (o = [...o, ...a.default.decorators]),
    (c = {
      ...(a.default && a.default.parameters ? a.default.parameters : {}),
      ...(a[r].parameters ? a[r].parameters : {}),
    }),
    function () {
      const { globalState: m } = sd(),
        p = L.useMemo(
          () =>
            function () {
              return b.jsx(P_, { msw: f, children: b.jsx(J_, { ...y }) });
            },
          [],
        );
      if (o.length === 0) return b.jsx(p, {});
      const v = (g) =>
          L.useRef(() => {
            const A = sd(),
              R = {};
            return (
              Object.keys(A.globalState.control).forEach(
                (x) => (R[x] = A.globalState.control[x].value),
              ),
              o[g](g === 0 ? p : v(g - 1), { ...A, parameters: c, argTypes: y.argTypes, args: R })
            );
          }).current,
        E = v(o.length - 1);
      return m.controlInitialized ? b.jsx(E, {}) : b.jsx(p, {});
    }
  );
}
const W_ = ({ children: a }) => a,
  eT = L.lazy(() =>
    qr(() => import('./DateText.stories-DHRkYDHN.js'), []).then((a) => ({
      default: lc(a, 'AmharicGeez'),
    })),
  ),
  tT = L.lazy(() =>
    qr(() => import('./DateText.stories-DHRkYDHN.js'), []).then((a) => ({
      default: lc(a, 'ArabicHijri'),
    })),
  ),
  nT = L.lazy(() =>
    qr(() => import('./DateText.stories-DHRkYDHN.js'), []).then((a) => ({
      default: lc(a, 'English'),
    })),
  ),
  lT = L.lazy(() =>
    qr(() => import('./DateText.stories-DHRkYDHN.js'), []).then((a) => ({
      default: lc(a, 'Numeric'),
    })),
  );
let Fr = {
    'date-text--amharic-geez': {
      component: eT,
      locStart: 11,
      locEnd: 11,
      entry: 'src/DateText.stories.tsx',
    },
    'date-text--arabic-hijri': {
      component: tT,
      locStart: 12,
      locEnd: 14,
      entry: 'src/DateText.stories.tsx',
    },
    'date-text--english': {
      component: nT,
      locStart: 10,
      locEnd: 10,
      entry: 'src/DateText.stories.tsx',
    },
    'date-text--numeric': {
      component: lT,
      locStart: 9,
      locEnd: 9,
      entry: 'src/DateText.stories.tsx',
    },
  },
  bn = {
    stories: 'src/**/*.stories.tsx',
    addons: {
      control: { enabled: !0, defaultState: {} },
      theme: { enabled: !0, defaultState: 'light' },
      mode: { enabled: !0, defaultState: 'full' },
      rtl: { enabled: !0, defaultState: !1 },
      source: {
        enabled: !0,
        defaultState: !1,
        themeDark: {
          plain: { color: '#d6deeb', backgroundColor: 'var(--ladle-bg-color-secondary)' },
          styles: [
            { types: ['changed'], style: { color: 'rgb(162, 191, 252)', fontStyle: 'italic' } },
            {
              types: ['deleted'],
              style: { color: 'rgba(239, 83, 80, 0.56)', fontStyle: 'italic' },
            },
            {
              types: ['inserted', 'attr-name'],
              style: { color: 'rgb(173, 219, 103)', fontStyle: 'italic' },
            },
            { types: ['comment'], style: { color: 'rgb(99, 119, 119)', fontStyle: 'italic' } },
            { types: ['string', 'url'], style: { color: 'rgb(173, 219, 103)' } },
            { types: ['variable'], style: { color: 'rgb(214, 222, 235)' } },
            { types: ['number'], style: { color: 'rgb(247, 140, 108)' } },
            {
              types: ['builtin', 'char', 'constant', 'function'],
              style: { color: 'rgb(130, 170, 255)' },
            },
            { types: ['punctuation'], style: { color: 'rgb(199, 146, 234)' } },
            {
              types: ['selector', 'doctype'],
              style: { color: 'rgb(199, 146, 234)', fontStyle: 'italic' },
            },
            { types: ['class-name'], style: { color: 'rgb(255, 203, 139)' } },
            { types: ['tag', 'operator', 'keyword'], style: { color: 'rgb(127, 219, 202)' } },
            { types: ['boolean'], style: { color: 'rgb(255, 88, 116)' } },
            { types: ['property'], style: { color: 'rgb(128, 203, 196)' } },
            { types: ['namespace'], style: { color: 'rgb(178, 204, 214)' } },
          ],
        },
        themeLight: {
          plain: { color: '#393A34', backgroundColor: 'var(--ladle-bg-color-secondary)' },
          styles: [
            {
              types: ['comment', 'prolog', 'doctype', 'cdata'],
              style: { color: '#999988', fontStyle: 'italic' },
            },
            { types: ['namespace'], style: { opacity: 0.7 } },
            { types: ['string', 'attr-value'], style: { color: '#e3116c' } },
            { types: ['punctuation', 'operator'], style: { color: '#393A34' } },
            {
              types: [
                'entity',
                'url',
                'symbol',
                'number',
                'boolean',
                'variable',
                'constant',
                'property',
                'regex',
                'inserted',
              ],
              style: { color: '#36acaa' },
            },
            { types: ['atrule', 'keyword', 'attr-name', 'selector'], style: { color: '#00a4db' } },
            { types: ['function', 'deleted', 'tag'], style: { color: '#d73a49' } },
            { types: ['function-variable'], style: { color: '#6f42c1' } },
            { types: ['tag', 'selector', 'keyword'], style: { color: '#00009f' } },
          ],
        },
      },
      a11y: { enabled: !1 },
      msw: { enabled: !1 },
      action: { enabled: !0, defaultState: [] },
      ladle: { enabled: !0 },
      width: {
        enabled: !0,
        options: { xsmall: 414, small: 640, medium: 768, large: 1024 },
        defaultState: 0,
      },
    },
    hotkeys: {
      search: ['/', 'meta+p'],
      nextStory: ['alt+arrowright'],
      previousStory: ['alt+arrowleft'],
      nextComponent: ['alt+arrowdown'],
      previousComponent: ['alt+arrowup'],
      control: ['c'],
      darkMode: ['d'],
      fullscreen: ['f'],
      width: ['w'],
      rtl: ['r'],
      source: ['s'],
      a11y: ['a'],
    },
    i18n: { buildTooltip: '💡 Tip: Run "ladle preview" to check that the build works!' },
    storyOrder: '(stories) => stories',
  };
const aT = ({ path: a }) =>
    L.createElement(
      'div',
      { style: { paddingTop: '2em' } },
      L.createElement('code', { className: 'ladle-code' }, a),
    ),
  rT = {},
  uT = {};
let Bo = {
    e552c4b3:
      "import%20%7B%20date%20%7D%20from%20'%40qen%2Fcore'%3B%0Aimport%20%7B%20am%20%7D%20from%20'%40qen%2Fcore%2Flocales%2Fam'%3B%0Aimport%20%7B%20ar%20%7D%20from%20'%40qen%2Fcore%2Flocales%2Far'%3B%0Aimport%20%7B%20en%20%7D%20from%20'%40qen%2Fcore%2Flocales%2Fen'%3B%0Aimport%20%7B%20DateText%20%7D%20from%20'.%2FDateText.js'%3B%0A%0Aconst%20meskel%20%3D%20date('ethiopian'%2C%202019%2C%201%2C%2017)%3B%0A%0Aexport%20const%20Numeric%20%3D%20()%20%3D%3E%20%3CDateText%20date%3D%7Bmeskel%7D%20%2F%3E%3B%0Aexport%20const%20English%20%3D%20()%20%3D%3E%20%3CDateText%20date%3D%7Bmeskel%7D%20locale%3D%7Ben%7D%20%2F%3E%3B%0Aexport%20const%20AmharicGeez%20%3D%20()%20%3D%3E%20%3CDateText%20date%3D%7Bmeskel%7D%20locale%3D%7Bam%7D%20numerals%3D%22geez%22%20%2F%3E%3B%0Aexport%20const%20ArabicHijri%20%3D%20()%20%3D%3E%20(%0A%20%20%3CDateText%20date%3D%7Bdate('hijri'%2C%201447%2C%209%2C%201)%7D%20locale%3D%7Bar%7D%20numerals%3D%22arabic%22%20%2F%3E%0A)%3B%0A",
  },
  iT = {
    'date-text--amharic-geez': Bo.e552c4b3,
    'date-text--arabic-hijri': Bo.e552c4b3,
    'date-text--english': Bo.e552c4b3,
    'date-text--numeric': Bo.e552c4b3,
  };
function Z0(a) {
  var r,
    o,
    c = '';
  if (typeof a == 'string' || typeof a == 'number') c += a;
  else if (typeof a == 'object')
    if (Array.isArray(a)) {
      var f = a.length;
      for (r = 0; r < f; r++) a[r] && (o = Z0(a[r])) && (c && (c += ' '), (c += o));
    } else for (o in a) a[o] && (c && (c += ' '), (c += o));
  return c;
}
function X0() {
  for (var a, r, o = 0, c = '', f = arguments.length; o < f; o++)
    (a = arguments[o]) && (r = Z0(a)) && (c && (c += ' '), (c += r));
  return c;
}
var oT = Object.create,
  ac = Object.defineProperty,
  cT = Object.defineProperties,
  sT = Object.getOwnPropertyDescriptor,
  fT = Object.getOwnPropertyDescriptors,
  Q0 = Object.getOwnPropertyNames,
  $o = Object.getOwnPropertySymbols,
  dT = Object.getPrototypeOf,
  Yd = Object.prototype.hasOwnProperty,
  $0 = Object.prototype.propertyIsEnumerable,
  Sm = (a, r, o) =>
    r in a ? ac(a, r, { enumerable: !0, configurable: !0, writable: !0, value: o }) : (a[r] = o),
  Qn = (a, r) => {
    for (var o in r || (r = {})) Yd.call(r, o) && Sm(a, o, r[o]);
    if ($o) for (var o of $o(r)) $0.call(r, o) && Sm(a, o, r[o]);
    return a;
  },
  rc = (a, r) => cT(a, fT(r)),
  K0 = (a, r) => {
    var o = {};
    for (var c in a) Yd.call(a, c) && r.indexOf(c) < 0 && (o[c] = a[c]);
    if (a != null && $o) for (var c of $o(a)) r.indexOf(c) < 0 && $0.call(a, c) && (o[c] = a[c]);
    return o;
  },
  yT = (a, r) =>
    function () {
      return (r || (0, a[Q0(a)[0]])((r = { exports: {} }).exports, r), r.exports);
    },
  pT = (a, r) => {
    for (var o in r) ac(a, o, { get: r[o], enumerable: !0 });
  },
  gT = (a, r, o, c) => {
    if ((r && typeof r == 'object') || typeof r == 'function')
      for (let f of Q0(r))
        !Yd.call(a, f) &&
          f !== o &&
          ac(a, f, { get: () => r[f], enumerable: !(c = sT(r, f)) || c.enumerable });
    return a;
  },
  hT = (a, r, o) => (
    (o = a != null ? oT(dT(a)) : {}),
    gT(!a || !a.__esModule ? ac(o, 'default', { value: a, enumerable: !0 }) : o, a)
  ),
  mT = yT({
    '../../node_modules/.pnpm/prismjs@1.29.0_patch_hash=vrxx3pzkik6jpmgpayxfjunetu/node_modules/prismjs/prism.js'(
      a,
      r,
    ) {
      var o = (function () {
        var c = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i,
          f = 0,
          y = {},
          d = {
            util: {
              encode: function x(S) {
                return S instanceof m
                  ? new m(S.type, x(S.content), S.alias)
                  : Array.isArray(S)
                    ? S.map(x)
                    : S.replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/\u00a0/g, ' ');
              },
              type: function (x) {
                return Object.prototype.toString.call(x).slice(8, -1);
              },
              objId: function (x) {
                return (x.__id || Object.defineProperty(x, '__id', { value: ++f }), x.__id);
              },
              clone: function x(S, _) {
                _ = _ || {};
                var k, B;
                switch (d.util.type(S)) {
                  case 'Object':
                    if (((B = d.util.objId(S)), _[B])) return _[B];
                    ((k = {}), (_[B] = k));
                    for (var q in S) S.hasOwnProperty(q) && (k[q] = x(S[q], _));
                    return k;
                  case 'Array':
                    return (
                      (B = d.util.objId(S)),
                      _[B]
                        ? _[B]
                        : ((k = []),
                          (_[B] = k),
                          S.forEach(function (W, te) {
                            k[te] = x(W, _);
                          }),
                          k)
                    );
                  default:
                    return S;
                }
              },
              getLanguage: function (x) {
                for (; x;) {
                  var S = c.exec(x.className);
                  if (S) return S[1].toLowerCase();
                  x = x.parentElement;
                }
                return 'none';
              },
              setLanguage: function (x, S) {
                ((x.className = x.className.replace(RegExp(c, 'gi'), '')),
                  x.classList.add('language-' + S));
              },
              isActive: function (x, S, _) {
                for (var k = 'no-' + S; x;) {
                  var B = x.classList;
                  if (B.contains(S)) return !0;
                  if (B.contains(k)) return !1;
                  x = x.parentElement;
                }
                return !!_;
              },
            },
            languages: {
              plain: y,
              plaintext: y,
              text: y,
              txt: y,
              extend: function (x, S) {
                var _ = d.util.clone(d.languages[x]);
                for (var k in S) _[k] = S[k];
                return _;
              },
              insertBefore: function (x, S, _, k) {
                k = k || d.languages;
                var B = k[x],
                  q = {};
                for (var W in B)
                  if (B.hasOwnProperty(W)) {
                    if (W == S) for (var te in _) _.hasOwnProperty(te) && (q[te] = _[te]);
                    _.hasOwnProperty(W) || (q[W] = B[W]);
                  }
                var ee = k[x];
                return (
                  (k[x] = q),
                  d.languages.DFS(d.languages, function (Z, K) {
                    K === ee && Z != x && (this[Z] = q);
                  }),
                  q
                );
              },
              DFS: function x(S, _, k, B) {
                B = B || {};
                var q = d.util.objId;
                for (var W in S)
                  if (S.hasOwnProperty(W)) {
                    _.call(S, W, S[W], k || W);
                    var te = S[W],
                      ee = d.util.type(te);
                    ee === 'Object' && !B[q(te)]
                      ? ((B[q(te)] = !0), x(te, _, null, B))
                      : ee === 'Array' && !B[q(te)] && ((B[q(te)] = !0), x(te, _, W, B));
                  }
              },
            },
            plugins: {},
            highlight: function (x, S, _) {
              var k = { code: x, grammar: S, language: _ };
              if ((d.hooks.run('before-tokenize', k), !k.grammar))
                throw new Error('The language "' + k.language + '" has no grammar.');
              return (
                (k.tokens = d.tokenize(k.code, k.grammar)),
                d.hooks.run('after-tokenize', k),
                m.stringify(d.util.encode(k.tokens), k.language)
              );
            },
            tokenize: function (x, S) {
              var _ = S.rest;
              if (_) {
                for (var k in _) S[k] = _[k];
                delete S.rest;
              }
              var B = new E();
              return (g(B, B.head, x), v(x, B, S, B.head, 0), R(B));
            },
            hooks: {
              all: {},
              add: function (x, S) {
                var _ = d.hooks.all;
                ((_[x] = _[x] || []), _[x].push(S));
              },
              run: function (x, S) {
                var _ = d.hooks.all[x];
                if (!(!_ || !_.length)) for (var k = 0, B; (B = _[k++]);) B(S);
              },
            },
            Token: m,
          };
        function m(x, S, _, k) {
          ((this.type = x),
            (this.content = S),
            (this.alias = _),
            (this.length = (k || '').length | 0));
        }
        m.stringify = function x(S, _) {
          if (typeof S == 'string') return S;
          if (Array.isArray(S)) {
            var k = '';
            return (
              S.forEach(function (ee) {
                k += x(ee, _);
              }),
              k
            );
          }
          var B = {
              type: S.type,
              content: x(S.content, _),
              tag: 'span',
              classes: ['token', S.type],
              attributes: {},
              language: _,
            },
            q = S.alias;
          (q && (Array.isArray(q) ? Array.prototype.push.apply(B.classes, q) : B.classes.push(q)),
            d.hooks.run('wrap', B));
          var W = '';
          for (var te in B.attributes)
            W += ' ' + te + '="' + (B.attributes[te] || '').replace(/"/g, '&quot;') + '"';
          return (
            '<' +
            B.tag +
            ' class="' +
            B.classes.join(' ') +
            '"' +
            W +
            '>' +
            B.content +
            '</' +
            B.tag +
            '>'
          );
        };
        function p(x, S, _, k) {
          x.lastIndex = S;
          var B = x.exec(_);
          if (B && k && B[1]) {
            var q = B[1].length;
            ((B.index += q), (B[0] = B[0].slice(q)));
          }
          return B;
        }
        function v(x, S, _, k, B, q) {
          for (var W in _)
            if (!(!_.hasOwnProperty(W) || !_[W])) {
              var te = _[W];
              te = Array.isArray(te) ? te : [te];
              for (var ee = 0; ee < te.length; ++ee) {
                if (q && q.cause == W + ',' + ee) return;
                var Z = te[ee],
                  K = Z.inside,
                  ce = !!Z.lookbehind,
                  he = !!Z.greedy,
                  Ee = Z.alias;
                if (he && !Z.pattern.global) {
                  var G = Z.pattern.toString().match(/[imsuy]*$/)[0];
                  Z.pattern = RegExp(Z.pattern.source, G + 'g');
                }
                for (
                  var ae = Z.pattern || Z, ue = k.next, ie = B;
                  ue !== S.tail && !(q && ie >= q.reach);
                  ie += ue.value.length, ue = ue.next
                ) {
                  var I = ue.value;
                  if (S.length > x.length) return;
                  if (!(I instanceof m)) {
                    var P = 1,
                      J;
                    if (he) {
                      if (((J = p(ae, ie, x, ce)), !J || J.index >= x.length)) break;
                      var je = J.index,
                        se = J.index + J[0].length,
                        le = ie;
                      for (le += ue.value.length; je >= le;)
                        ((ue = ue.next), (le += ue.value.length));
                      if (((le -= ue.value.length), (ie = le), ue.value instanceof m)) continue;
                      for (
                        var xe = ue;
                        xe !== S.tail && (le < se || typeof xe.value == 'string');
                        xe = xe.next
                      )
                        (P++, (le += xe.value.length));
                      (P--, (I = x.slice(ie, le)), (J.index -= ie));
                    } else if (((J = p(ae, 0, I, ce)), !J)) continue;
                    var je = J.index,
                      be = J[0],
                      C = I.slice(0, je),
                      $ = I.slice(je + be.length),
                      re = ie + I.length;
                    q && re > q.reach && (q.reach = re);
                    var oe = ue.prev;
                    (C && ((oe = g(S, oe, C)), (ie += C.length)), A(S, oe, P));
                    var Te = new m(W, K ? d.tokenize(be, K) : be, Ee, be);
                    if (((ue = g(S, oe, Te)), $ && g(S, ue, $), P > 1)) {
                      var Re = { cause: W + ',' + ee, reach: re };
                      (v(x, S, _, ue.prev, ie, Re),
                        q && Re.reach > q.reach && (q.reach = Re.reach));
                    }
                  }
                }
              }
            }
        }
        function E() {
          var x = { value: null, prev: null, next: null },
            S = { value: null, prev: x, next: null };
          ((x.next = S), (this.head = x), (this.tail = S), (this.length = 0));
        }
        function g(x, S, _) {
          var k = S.next,
            B = { value: _, prev: S, next: k };
          return ((S.next = B), (k.prev = B), x.length++, B);
        }
        function A(x, S, _) {
          for (var k = S.next, B = 0; B < _ && k !== x.tail; B++) k = k.next;
          ((S.next = k), (k.prev = S), (x.length -= B));
        }
        function R(x) {
          for (var S = [], _ = x.head.next; _ !== x.tail;) (S.push(_.value), (_ = _.next));
          return S;
        }
        return d;
      })();
      ((r.exports = o), (o.default = o));
    },
  }),
  Q = hT(mT());
((Q.languages.markup = {
  comment: { pattern: /<!--(?:(?!<!--)[\s\S])*?-->/, greedy: !0 },
  prolog: { pattern: /<\?[\s\S]+?\?>/, greedy: !0 },
  doctype: {
    pattern:
      /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: !0,
    inside: {
      'internal-subset': {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: !0,
        greedy: !0,
        inside: null,
      },
      string: { pattern: /"[^"]*"|'[^']*'/, greedy: !0 },
      punctuation: /^<!|>$|[[\]]/,
      'doctype-tag': /^DOCTYPE/i,
      name: /[^\s<>'"]+/,
    },
  },
  cdata: { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, greedy: !0 },
  tag: {
    pattern:
      /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: !0,
    inside: {
      tag: {
        pattern: /^<\/?[^\s>\/]+/,
        inside: { punctuation: /^<\/?/, namespace: /^[^\s>\/:]+:/ },
      },
      'special-attr': [],
      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          punctuation: [
            { pattern: /^=/, alias: 'attr-equals' },
            { pattern: /^(\s*)["']|["']$/, lookbehind: !0 },
          ],
        },
      },
      punctuation: /\/?>/,
      'attr-name': { pattern: /[^\s>\/]+/, inside: { namespace: /^[^\s>\/:]+:/ } },
    },
  },
  entity: [{ pattern: /&[\da-z]{1,8};/i, alias: 'named-entity' }, /&#x?[\da-f]{1,8};/i],
}),
  (Q.languages.markup.tag.inside['attr-value'].inside.entity = Q.languages.markup.entity),
  (Q.languages.markup.doctype.inside['internal-subset'].inside = Q.languages.markup),
  Q.hooks.add('wrap', function (a) {
    a.type === 'entity' && (a.attributes.title = a.content.replace(/&amp;/, '&'));
  }),
  Object.defineProperty(Q.languages.markup.tag, 'addInlined', {
    value: function (a, c) {
      var o = {},
        o =
          ((o['language-' + c] = {
            pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
            lookbehind: !0,
            inside: Q.languages[c],
          }),
          (o.cdata = /^<!\[CDATA\[|\]\]>$/i),
          { 'included-cdata': { pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i, inside: o } }),
        c = ((o['language-' + c] = { pattern: /[\s\S]+/, inside: Q.languages[c] }), {});
      ((c[a] = {
        pattern: RegExp(
          /(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(
            /__/g,
            function () {
              return a;
            },
          ),
          'i',
        ),
        lookbehind: !0,
        greedy: !0,
        inside: o,
      }),
        Q.languages.insertBefore('markup', 'cdata', c));
    },
  }),
  Object.defineProperty(Q.languages.markup.tag, 'addAttribute', {
    value: function (a, r) {
      Q.languages.markup.tag.inside['special-attr'].push({
        pattern: RegExp(
          /(^|["'\s])/.source +
            '(?:' +
            a +
            ')' +
            /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source,
          'i',
        ),
        lookbehind: !0,
        inside: {
          'attr-name': /^[^\s=]+/,
          'attr-value': {
            pattern: /=[\s\S]+/,
            inside: {
              value: {
                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                lookbehind: !0,
                alias: [r, 'language-' + r],
                inside: Q.languages[r],
              },
              punctuation: [{ pattern: /^=/, alias: 'attr-equals' }, /"|'/],
            },
          },
        },
      });
    },
  }),
  (Q.languages.html = Q.languages.markup),
  (Q.languages.mathml = Q.languages.markup),
  (Q.languages.svg = Q.languages.markup),
  (Q.languages.xml = Q.languages.extend('markup', {})),
  (Q.languages.ssml = Q.languages.xml),
  (Q.languages.atom = Q.languages.xml),
  (Q.languages.rss = Q.languages.xml),
  (function (a) {
    var r = { pattern: /\\[\\(){}[\]^$+*?|.]/, alias: 'escape' },
      o =
        /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|0[0-7]{0,2}|[123][0-7]{2}|c[a-zA-Z]|.)/,
      c = '(?:[^\\\\-]|' + o.source + ')',
      c = RegExp(c + '-' + c),
      f = { pattern: /(<|')[^<>']+(?=[>']$)/, lookbehind: !0, alias: 'variable' };
    a.languages.regex = {
      'char-class': {
        pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
        lookbehind: !0,
        inside: {
          'char-class-negation': { pattern: /(^\[)\^/, lookbehind: !0, alias: 'operator' },
          'char-class-punctuation': { pattern: /^\[|\]$/, alias: 'punctuation' },
          range: {
            pattern: c,
            inside: { escape: o, 'range-punctuation': { pattern: /-/, alias: 'operator' } },
          },
          'special-escape': r,
          'char-set': { pattern: /\\[wsd]|\\p\{[^{}]+\}/i, alias: 'class-name' },
          escape: o,
        },
      },
      'special-escape': r,
      'char-set': { pattern: /\.|\\[wsd]|\\p\{[^{}]+\}/i, alias: 'class-name' },
      backreference: [
        { pattern: /\\(?![123][0-7]{2})[1-9]/, alias: 'keyword' },
        { pattern: /\\k<[^<>']+>/, alias: 'keyword', inside: { 'group-name': f } },
      ],
      anchor: { pattern: /[$^]|\\[ABbGZz]/, alias: 'function' },
      escape: o,
      group: [
        {
          pattern: /\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,
          alias: 'punctuation',
          inside: { 'group-name': f },
        },
        { pattern: /\)/, alias: 'punctuation' },
      ],
      quantifier: { pattern: /(?:[+*?]|\{\d+(?:,\d*)?\})[?+]?/, alias: 'number' },
      alternation: { pattern: /\|/, alias: 'keyword' },
    };
  })(Q),
  (Q.languages.clike = {
    comment: [
      { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0, greedy: !0 },
      { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
    ],
    string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: !0 },
    'class-name': {
      pattern:
        /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
      lookbehind: !0,
      inside: { punctuation: /[.\\]/ },
    },
    keyword:
      /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
    boolean: /\b(?:false|true)\b/,
    function: /\b\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    punctuation: /[{}[\];(),.:]/,
  }),
  (Q.languages.javascript = Q.languages.extend('clike', {
    'class-name': [
      Q.languages.clike['class-name'],
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
        lookbehind: !0,
      },
    ],
    keyword: [
      { pattern: /((?:^|\})\s*)catch\b/, lookbehind: !0 },
      {
        pattern:
          /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
        lookbehind: !0,
      },
    ],
    function:
      /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    number: {
      pattern: RegExp(
        /(^|[^\w$])/.source +
          '(?:' +
          /NaN|Infinity/.source +
          '|' +
          /0[bB][01]+(?:_[01]+)*n?/.source +
          '|' +
          /0[oO][0-7]+(?:_[0-7]+)*n?/.source +
          '|' +
          /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source +
          '|' +
          /\d+(?:_\d+)*n/.source +
          '|' +
          /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/
            .source +
          ')' +
          /(?![\w$])/.source,
      ),
      lookbehind: !0,
    },
    operator:
      /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/,
  })),
  (Q.languages.javascript['class-name'][0].pattern =
    /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/),
  Q.languages.insertBefore('javascript', 'keyword', {
    regex: {
      pattern: RegExp(
        /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
          /\//.source +
          '(?:' +
          /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source +
          '|' +
          /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/
            .source +
          ')' +
          /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source,
      ),
      lookbehind: !0,
      greedy: !0,
      inside: {
        'regex-source': {
          pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
          lookbehind: !0,
          alias: 'language-regex',
          inside: Q.languages.regex,
        },
        'regex-delimiter': /^\/|\/$/,
        'regex-flags': /^[a-z]+$/,
      },
    },
    'function-variable': {
      pattern:
        /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
      alias: 'function',
    },
    parameter: [
      {
        pattern:
          /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
        lookbehind: !0,
        inside: Q.languages.javascript,
      },
      {
        pattern:
          /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
        lookbehind: !0,
        inside: Q.languages.javascript,
      },
      {
        pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
        lookbehind: !0,
        inside: Q.languages.javascript,
      },
      {
        pattern:
          /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
        lookbehind: !0,
        inside: Q.languages.javascript,
      },
    ],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
  }),
  Q.languages.insertBefore('javascript', 'string', {
    hashbang: { pattern: /^#!.*/, greedy: !0, alias: 'comment' },
    'template-string': {
      pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
      greedy: !0,
      inside: {
        'template-punctuation': { pattern: /^`|`$/, alias: 'string' },
        interpolation: {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
          lookbehind: !0,
          inside: {
            'interpolation-punctuation': { pattern: /^\$\{|\}$/, alias: 'punctuation' },
            rest: Q.languages.javascript,
          },
        },
        string: /[\s\S]+/,
      },
    },
    'string-property': {
      pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
      lookbehind: !0,
      greedy: !0,
      alias: 'property',
    },
  }),
  Q.languages.insertBefore('javascript', 'operator', {
    'literal-property': {
      pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
      lookbehind: !0,
      alias: 'property',
    },
  }),
  Q.languages.markup &&
    (Q.languages.markup.tag.addInlined('script', 'javascript'),
    Q.languages.markup.tag.addAttribute(
      /on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/
        .source,
      'javascript',
    )),
  (Q.languages.js = Q.languages.javascript),
  (Q.languages.actionscript = Q.languages.extend('javascript', {
    keyword:
      /\b(?:as|break|case|catch|class|const|default|delete|do|dynamic|each|else|extends|final|finally|for|function|get|if|implements|import|in|include|instanceof|interface|internal|is|namespace|native|new|null|override|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|use|var|void|while|with)\b/,
    operator: /\+\+|--|(?:[+\-*\/%^]|&&?|\|\|?|<<?|>>?>?|[!=]=?)=?|[~?@]/,
  })),
  (Q.languages.actionscript['class-name'].alias = 'function'),
  delete Q.languages.actionscript.parameter,
  delete Q.languages.actionscript['literal-property'],
  Q.languages.markup &&
    Q.languages.insertBefore('actionscript', 'string', {
      xml: {
        pattern: /(^|[^.])<\/?\w+(?:\s+[^\s>\/=]+=("|')(?:\\[\s\S]|(?!\2)[^\\])*\2)*\s*\/?>/,
        lookbehind: !0,
        inside: Q.languages.markup,
      },
    }),
  (function (a) {
    var r = /#(?!\{).+/,
      o = { pattern: /#\{[^}]+\}/, alias: 'variable' };
    ((a.languages.coffeescript = a.languages.extend('javascript', {
      comment: r,
      string: [
        { pattern: /'(?:\\[\s\S]|[^\\'])*'/, greedy: !0 },
        { pattern: /"(?:\\[\s\S]|[^\\"])*"/, greedy: !0, inside: { interpolation: o } },
      ],
      keyword:
        /\b(?:and|break|by|catch|class|continue|debugger|delete|do|each|else|extend|extends|false|finally|for|if|in|instanceof|is|isnt|let|loop|namespace|new|no|not|null|of|off|on|or|own|return|super|switch|then|this|throw|true|try|typeof|undefined|unless|until|when|while|window|with|yes|yield)\b/,
      'class-member': { pattern: /@(?!\d)\w+/, alias: 'variable' },
    })),
      a.languages.insertBefore('coffeescript', 'comment', {
        'multiline-comment': { pattern: /###[\s\S]+?###/, alias: 'comment' },
        'block-regex': {
          pattern: /\/{3}[\s\S]*?\/{3}/,
          alias: 'regex',
          inside: { comment: r, interpolation: o },
        },
      }),
      a.languages.insertBefore('coffeescript', 'string', {
        'inline-javascript': {
          pattern: /`(?:\\[\s\S]|[^\\`])*`/,
          inside: {
            delimiter: { pattern: /^`|`$/, alias: 'punctuation' },
            script: {
              pattern: /[\s\S]+/,
              alias: 'language-javascript',
              inside: a.languages.javascript,
            },
          },
        },
        'multiline-string': [
          { pattern: /'''[\s\S]*?'''/, greedy: !0, alias: 'string' },
          { pattern: /"""[\s\S]*?"""/, greedy: !0, alias: 'string', inside: { interpolation: o } },
        ],
      }),
      a.languages.insertBefore('coffeescript', 'keyword', { property: /(?!\d)\w+(?=\s*:(?!:))/ }),
      delete a.languages.coffeescript['template-string'],
      (a.languages.coffee = a.languages.coffeescript));
  })(Q),
  (function (a) {
    var r = (a.languages.javadoclike = {
      parameter: {
        pattern: /(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*@(?:arg|arguments|param)\s+)\w+/m,
        lookbehind: !0,
      },
      keyword: { pattern: /(^[\t ]*(?:\/{3}|\*|\/\*\*)\s*|\{)@[a-z][a-zA-Z-]+\b/m, lookbehind: !0 },
      punctuation: /[{}]/,
    });
    (Object.defineProperty(r, 'addSupport', {
      value: function (o, c) {
        (o = typeof o == 'string' ? [o] : o).forEach(function (f) {
          var y = function (g) {
              (g.inside || (g.inside = {}), (g.inside.rest = c));
            },
            d = 'doc-comment';
          if ((m = a.languages[f])) {
            var m,
              p = m[d];
            if (
              ((p =
                p ||
                (m = a.languages.insertBefore(f, 'comment', {
                  'doc-comment': {
                    pattern: /(^|[^\\])\/\*\*[^/][\s\S]*?(?:\*\/|$)/,
                    lookbehind: !0,
                    alias: 'comment',
                  },
                }))[d]) instanceof RegExp && (p = m[d] = { pattern: p }),
              Array.isArray(p))
            )
              for (var v = 0, E = p.length; v < E; v++)
                (p[v] instanceof RegExp && (p[v] = { pattern: p[v] }), y(p[v]));
            else y(p);
          }
        });
      },
    }),
      r.addSupport(['java', 'javascript', 'php'], r));
  })(Q),
  (function (a) {
    var r = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/,
      r =
        ((a.languages.css = {
          comment: /\/\*[\s\S]*?\*\//,
          atrule: {
            pattern: RegExp(
              '@[\\w-](?:' +
                /[^;{\s"']|\s+(?!\s)/.source +
                '|' +
                r.source +
                ')*?' +
                /(?:;|(?=\s*\{))/.source,
            ),
            inside: {
              rule: /^@[\w-]+/,
              'selector-function-argument': {
                pattern:
                  /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                lookbehind: !0,
                alias: 'selector',
              },
              keyword: { pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/, lookbehind: !0 },
            },
          },
          url: {
            pattern: RegExp(
              '\\burl\\((?:' + r.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)',
              'i',
            ),
            greedy: !0,
            inside: {
              function: /^url/i,
              punctuation: /^\(|\)$/,
              string: { pattern: RegExp('^' + r.source + '$'), alias: 'url' },
            },
          },
          selector: {
            pattern: RegExp(
              `(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + r.source + ')*(?=\\s*\\{)',
            ),
            lookbehind: !0,
          },
          string: { pattern: r, greedy: !0 },
          property: {
            pattern:
              /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
            lookbehind: !0,
          },
          important: /!important\b/i,
          function: { pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i, lookbehind: !0 },
          punctuation: /[(){};:,]/,
        }),
        (a.languages.css.atrule.inside.rest = a.languages.css),
        a.languages.markup);
    r && (r.tag.addInlined('style', 'css'), r.tag.addAttribute('style', 'css'));
  })(Q),
  (function (a) {
    var r = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      r =
        ((a.languages.css.selector = {
          pattern: a.languages.css.selector.pattern,
          lookbehind: !0,
          inside: (r = {
            'pseudo-element': /:(?:after|before|first-letter|first-line|selection)|::[-\w]+/,
            'pseudo-class': /:[-\w]+/,
            class: /\.[-\w]+/,
            id: /#[-\w]+/,
            attribute: {
              pattern: RegExp(`\\[(?:[^[\\]"']|` + r.source + ')*\\]'),
              greedy: !0,
              inside: {
                punctuation: /^\[|\]$/,
                'case-sensitivity': { pattern: /(\s)[si]$/i, lookbehind: !0, alias: 'keyword' },
                namespace: {
                  pattern: /^(\s*)(?:(?!\s)[-*\w\xA0-\uFFFF])*\|(?!=)/,
                  lookbehind: !0,
                  inside: { punctuation: /\|$/ },
                },
                'attr-name': { pattern: /^(\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+/, lookbehind: !0 },
                'attr-value': [
                  r,
                  { pattern: /(=\s*)(?:(?!\s)[-\w\xA0-\uFFFF])+(?=\s*$)/, lookbehind: !0 },
                ],
                operator: /[|~*^$]?=/,
              },
            },
            'n-th': [
              {
                pattern: /(\(\s*)[+-]?\d*[\dn](?:\s*[+-]\s*\d+)?(?=\s*\))/,
                lookbehind: !0,
                inside: { number: /[\dn]+/, operator: /[+-]/ },
              },
              { pattern: /(\(\s*)(?:even|odd)(?=\s*\))/i, lookbehind: !0 },
            ],
            combinator: />|\+|~|\|\|/,
            punctuation: /[(),]/,
          }),
        }),
        (a.languages.css.atrule.inside['selector-function-argument'].inside = r),
        a.languages.insertBefore('css', 'property', {
          variable: {
            pattern: /(^|[^-\w\xA0-\uFFFF])--(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*/i,
            lookbehind: !0,
          },
        }),
        { pattern: /(\b\d+)(?:%|[a-z]+(?![\w-]))/, lookbehind: !0 }),
      o = { pattern: /(^|[^\w.-])-?(?:\d+(?:\.\d+)?|\.\d+)/, lookbehind: !0 };
    a.languages.insertBefore('css', 'function', {
      operator: { pattern: /(\s)[+\-*\/](?=\s)/, lookbehind: !0 },
      hexcode: { pattern: /\B#[\da-f]{3,8}\b/i, alias: 'color' },
      color: [
        {
          pattern:
            /(^|[^\w-])(?:AliceBlue|AntiqueWhite|Aqua|Aquamarine|Azure|Beige|Bisque|Black|BlanchedAlmond|Blue|BlueViolet|Brown|BurlyWood|CadetBlue|Chartreuse|Chocolate|Coral|CornflowerBlue|Cornsilk|Crimson|Cyan|DarkBlue|DarkCyan|DarkGoldenRod|DarkGr[ae]y|DarkGreen|DarkKhaki|DarkMagenta|DarkOliveGreen|DarkOrange|DarkOrchid|DarkRed|DarkSalmon|DarkSeaGreen|DarkSlateBlue|DarkSlateGr[ae]y|DarkTurquoise|DarkViolet|DeepPink|DeepSkyBlue|DimGr[ae]y|DodgerBlue|FireBrick|FloralWhite|ForestGreen|Fuchsia|Gainsboro|GhostWhite|Gold|GoldenRod|Gr[ae]y|Green|GreenYellow|HoneyDew|HotPink|IndianRed|Indigo|Ivory|Khaki|Lavender|LavenderBlush|LawnGreen|LemonChiffon|LightBlue|LightCoral|LightCyan|LightGoldenRodYellow|LightGr[ae]y|LightGreen|LightPink|LightSalmon|LightSeaGreen|LightSkyBlue|LightSlateGr[ae]y|LightSteelBlue|LightYellow|Lime|LimeGreen|Linen|Magenta|Maroon|MediumAquaMarine|MediumBlue|MediumOrchid|MediumPurple|MediumSeaGreen|MediumSlateBlue|MediumSpringGreen|MediumTurquoise|MediumVioletRed|MidnightBlue|MintCream|MistyRose|Moccasin|NavajoWhite|Navy|OldLace|Olive|OliveDrab|Orange|OrangeRed|Orchid|PaleGoldenRod|PaleGreen|PaleTurquoise|PaleVioletRed|PapayaWhip|PeachPuff|Peru|Pink|Plum|PowderBlue|Purple|RebeccaPurple|Red|RosyBrown|RoyalBlue|SaddleBrown|Salmon|SandyBrown|SeaGreen|SeaShell|Sienna|Silver|SkyBlue|SlateBlue|SlateGr[ae]y|Snow|SpringGreen|SteelBlue|Tan|Teal|Thistle|Tomato|Transparent|Turquoise|Violet|Wheat|White|WhiteSmoke|Yellow|YellowGreen)(?![\w-])/i,
          lookbehind: !0,
        },
        {
          pattern:
            /\b(?:hsl|rgb)\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)\B|\b(?:hsl|rgb)a\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*(?:0|0?\.\d+|1)\s*\)\B/i,
          inside: { unit: r, number: o, function: /[\w-]+(?=\()/, punctuation: /[(),]/ },
        },
      ],
      entity: /\\[\da-f]{1,8}/i,
      unit: r,
      number: o,
    });
  })(Q),
  (function (a) {
    var r = /[*&][^\s[\]{},]+/,
      o = /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/,
      c = '(?:' + o.source + '(?:[ 	]+' + r.source + ')?|' + r.source + '(?:[ 	]+' + o.source + ')?)',
      f =
        /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(
          /<PLAIN>/g,
          function () {
            return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/
              .source;
          },
        ),
      y = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;
    function d(m, p) {
      p = (p || '').replace(/m/g, '') + 'm';
      var v =
        /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source
          .replace(/<<prop>>/g, function () {
            return c;
          })
          .replace(/<<value>>/g, function () {
            return m;
          });
      return RegExp(v, p);
    }
    ((a.languages.yaml = {
      scalar: {
        pattern: RegExp(
          /([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(
            /<<prop>>/g,
            function () {
              return c;
            },
          ),
        ),
        lookbehind: !0,
        alias: 'string',
      },
      comment: /#.*/,
      key: {
        pattern: RegExp(
          /((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source
            .replace(/<<prop>>/g, function () {
              return c;
            })
            .replace(/<<key>>/g, function () {
              return '(?:' + f + '|' + y + ')';
            }),
        ),
        lookbehind: !0,
        greedy: !0,
        alias: 'atrule',
      },
      directive: { pattern: /(^[ \t]*)%.+/m, lookbehind: !0, alias: 'important' },
      datetime: {
        pattern: d(
          /\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/
            .source,
        ),
        lookbehind: !0,
        alias: 'number',
      },
      boolean: { pattern: d(/false|true/.source, 'i'), lookbehind: !0, alias: 'important' },
      null: { pattern: d(/null|~/.source, 'i'), lookbehind: !0, alias: 'important' },
      string: { pattern: d(y), lookbehind: !0, greedy: !0 },
      number: {
        pattern: d(
          /[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source,
          'i',
        ),
        lookbehind: !0,
      },
      tag: o,
      important: r,
      punctuation: /---|[:[\]{}\-,|>?]|\.\.\./,
    }),
      (a.languages.yml = a.languages.yaml));
  })(Q),
  (function (a) {
    var r = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source;
    function o(v) {
      return (
        (v = v.replace(/<inner>/g, function () {
          return r;
        })),
        RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + '(?:' + v + ')')
      );
    }
    var c = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source,
      f = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(/__/g, function () {
        return c;
      }),
      y = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/.source,
      d =
        ((a.languages.markdown = a.languages.extend('markup', {})),
        a.languages.insertBefore('markdown', 'prolog', {
          'front-matter-block': {
            pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
            lookbehind: !0,
            greedy: !0,
            inside: {
              punctuation: /^---|---$/,
              'front-matter': {
                pattern: /\S+(?:\s+\S+)*/,
                alias: ['yaml', 'language-yaml'],
                inside: a.languages.yaml,
              },
            },
          },
          blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: 'punctuation' },
          table: {
            pattern: RegExp('^' + f + y + '(?:' + f + ')*', 'm'),
            inside: {
              'table-data-rows': {
                pattern: RegExp('^(' + f + y + ')(?:' + f + ')*$'),
                lookbehind: !0,
                inside: {
                  'table-data': { pattern: RegExp(c), inside: a.languages.markdown },
                  punctuation: /\|/,
                },
              },
              'table-line': {
                pattern: RegExp('^(' + f + ')' + y + '$'),
                lookbehind: !0,
                inside: { punctuation: /\||:?-{3,}:?/ },
              },
              'table-header-row': {
                pattern: RegExp('^' + f + '$'),
                inside: {
                  'table-header': {
                    pattern: RegExp(c),
                    alias: 'important',
                    inside: a.languages.markdown,
                  },
                  punctuation: /\|/,
                },
              },
            },
          },
          code: [
            {
              pattern:
                /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
              lookbehind: !0,
              alias: 'keyword',
            },
            {
              pattern: /^```[\s\S]*?^```$/m,
              greedy: !0,
              inside: {
                'code-block': {
                  pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
                  lookbehind: !0,
                },
                'code-language': { pattern: /^(```).+/, lookbehind: !0 },
                punctuation: /```/,
              },
            },
          ],
          title: [
            {
              pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
              alias: 'important',
              inside: { punctuation: /==+$|--+$/ },
            },
            {
              pattern: /(^\s*)#.+/m,
              lookbehind: !0,
              alias: 'important',
              inside: { punctuation: /^#+|#+$/ },
            },
          ],
          hr: {
            pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
            lookbehind: !0,
            alias: 'punctuation',
          },
          list: {
            pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
            lookbehind: !0,
            alias: 'punctuation',
          },
          'url-reference': {
            pattern:
              /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
            inside: {
              variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 },
              string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
              punctuation: /^[\[\]!:]|[<>]/,
            },
            alias: 'url',
          },
          bold: {
            pattern: o(
              /\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/
                .source,
            ),
            lookbehind: !0,
            greedy: !0,
            inside: {
              content: { pattern: /(^..)[\s\S]+(?=..$)/, lookbehind: !0, inside: {} },
              punctuation: /\*\*|__/,
            },
          },
          italic: {
            pattern: o(
              /\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/
                .source,
            ),
            lookbehind: !0,
            greedy: !0,
            inside: {
              content: { pattern: /(^.)[\s\S]+(?=.$)/, lookbehind: !0, inside: {} },
              punctuation: /[*_]/,
            },
          },
          strike: {
            pattern: o(/(~~?)(?:(?!~)<inner>)+\2/.source),
            lookbehind: !0,
            greedy: !0,
            inside: {
              content: { pattern: /(^~~?)[\s\S]+(?=\1$)/, lookbehind: !0, inside: {} },
              punctuation: /~~?/,
            },
          },
          'code-snippet': {
            pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
            lookbehind: !0,
            greedy: !0,
            alias: ['code', 'keyword'],
          },
          url: {
            pattern: o(
              /!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/
                .source,
            ),
            lookbehind: !0,
            greedy: !0,
            inside: {
              operator: /^!/,
              content: { pattern: /(^\[)[^\]]+(?=\])/, lookbehind: !0, inside: {} },
              variable: { pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/, lookbehind: !0 },
              url: { pattern: /(^\]\()[^\s)]+/, lookbehind: !0 },
              string: { pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/, lookbehind: !0 },
            },
          },
        }),
        ['url', 'bold', 'italic', 'strike'].forEach(function (v) {
          ['url', 'bold', 'italic', 'strike', 'code-snippet'].forEach(function (E) {
            v !== E && (a.languages.markdown[v].inside.content.inside[E] = a.languages.markdown[E]);
          });
        }),
        a.hooks.add('after-tokenize', function (v) {
          (v.language !== 'markdown' && v.language !== 'md') ||
            (function E(g) {
              if (g && typeof g != 'string')
                for (var A = 0, R = g.length; A < R; A++) {
                  var x,
                    S = g[A];
                  S.type !== 'code'
                    ? E(S.content)
                    : ((x = S.content[1]),
                      (S = S.content[3]),
                      x &&
                        S &&
                        x.type === 'code-language' &&
                        S.type === 'code-block' &&
                        typeof x.content == 'string' &&
                        ((x = x.content.replace(/\b#/g, 'sharp').replace(/\b\+\+/g, 'pp')),
                        (x = 'language-' + (x = (/[a-z][\w-]*/i.exec(x) || [''])[0].toLowerCase())),
                        S.alias
                          ? typeof S.alias == 'string'
                            ? (S.alias = [S.alias, x])
                            : S.alias.push(x)
                          : (S.alias = [x])));
                }
            })(v.tokens);
        }),
        a.hooks.add('wrap', function (v) {
          if (v.type === 'code-block') {
            for (var E = '', g = 0, A = v.classes.length; g < A; g++) {
              var R = v.classes[g],
                R = /language-(.+)/.exec(R);
              if (R) {
                E = R[1];
                break;
              }
            }
            var x,
              S = a.languages[E];
            S
              ? (v.content = a.highlight(
                  (function (_) {
                    return (
                      (_ = _.replace(d, '')),
                      (_ = _.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function (k, B) {
                        var q;
                        return (B = B.toLowerCase())[0] === '#'
                          ? ((q = B[1] === 'x' ? parseInt(B.slice(2), 16) : Number(B.slice(1))),
                            p(q))
                          : m[B] || k;
                      }))
                    );
                  })(v.content),
                  S,
                  E,
                ))
              : E &&
                E !== 'none' &&
                a.plugins.autoloader &&
                ((x = 'md-' + new Date().valueOf() + '-' + Math.floor(1e16 * Math.random())),
                (v.attributes.id = x),
                a.plugins.autoloader.loadLanguages(E, function () {
                  var _ = document.getElementById(x);
                  _ && (_.innerHTML = a.highlight(_.textContent, a.languages[E], E));
                }));
          }
        }),
        RegExp(a.languages.markup.tag.pattern.source, 'gi')),
      m = { amp: '&', lt: '<', gt: '>', quot: '"' },
      p = String.fromCodePoint || String.fromCharCode;
    a.languages.md = a.languages.markdown;
  })(Q),
  (Q.languages.graphql = {
    comment: /#.*/,
    description: {
      pattern: /(?:"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*")(?=\s*[a-z_])/i,
      greedy: !0,
      alias: 'string',
      inside: {
        'language-markdown': {
          pattern: /(^"(?:"")?)(?!\1)[\s\S]+(?=\1$)/,
          lookbehind: !0,
          inside: Q.languages.markdown,
        },
      },
    },
    string: { pattern: /"""(?:[^"]|(?!""")")*"""|"(?:\\.|[^\\"\r\n])*"/, greedy: !0 },
    number: /(?:\B-|\b)\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    boolean: /\b(?:false|true)\b/,
    variable: /\$[a-z_]\w*/i,
    directive: { pattern: /@[a-z_]\w*/i, alias: 'function' },
    'attr-name': {
      pattern: /\b[a-z_]\w*(?=\s*(?:\((?:[^()"]|"(?:\\.|[^\\"\r\n])*")*\))?:)/i,
      greedy: !0,
    },
    'atom-input': { pattern: /\b[A-Z]\w*Input\b/, alias: 'class-name' },
    scalar: /\b(?:Boolean|Float|ID|Int|String)\b/,
    constant: /\b[A-Z][A-Z_\d]*\b/,
    'class-name': {
      pattern: /(\b(?:enum|implements|interface|on|scalar|type|union)\s+|&\s*|:\s*|\[)[A-Z_]\w*/,
      lookbehind: !0,
    },
    fragment: {
      pattern: /(\bfragment\s+|\.{3}\s*(?!on\b))[a-zA-Z_]\w*/,
      lookbehind: !0,
      alias: 'function',
    },
    'definition-mutation': {
      pattern: /(\bmutation\s+)[a-zA-Z_]\w*/,
      lookbehind: !0,
      alias: 'function',
    },
    'definition-query': { pattern: /(\bquery\s+)[a-zA-Z_]\w*/, lookbehind: !0, alias: 'function' },
    keyword:
      /\b(?:directive|enum|extend|fragment|implements|input|interface|mutation|on|query|repeatable|scalar|schema|subscription|type|union)\b/,
    operator: /[!=|&]|\.{3}/,
    'property-query': /\w+(?=\s*\()/,
    object: /\w+(?=\s*\{)/,
    punctuation: /[!(){}\[\]:=,]/,
    property: /\w+/,
  }),
  Q.hooks.add('after-tokenize', function (a) {
    if (a.language === 'graphql')
      for (
        var r = a.tokens.filter(function (x) {
            return typeof x != 'string' && x.type !== 'comment' && x.type !== 'scalar';
          }),
          o = 0;
        o < r.length;
      ) {
        var c = r[o++];
        if (c.type === 'keyword' && c.content === 'mutation') {
          var f = [];
          if (g(['definition-mutation', 'punctuation']) && E(1).content === '(') {
            o += 2;
            var y = A(/^\($/, /^\)$/);
            if (y === -1) continue;
            for (; o < y; o++) {
              var d = E(0);
              d.type === 'variable' && (R(d, 'variable-input'), f.push(d.content));
            }
            o = y + 1;
          }
          if (
            g(['punctuation', 'property-query']) &&
            E(0).content === '{' &&
            (o++, R(E(0), 'property-mutation'), 0 < f.length)
          ) {
            var m = A(/^\{$/, /^\}$/);
            if (m !== -1)
              for (var p = o; p < m; p++) {
                var v = r[p];
                v.type === 'variable' && 0 <= f.indexOf(v.content) && R(v, 'variable-input');
              }
          }
        }
      }
    function E(x) {
      return r[o + x];
    }
    function g(x, S) {
      S = S || 0;
      for (var _ = 0; _ < x.length; _++) {
        var k = E(_ + S);
        if (!k || k.type !== x[_]) return;
      }
      return 1;
    }
    function A(x, S) {
      for (var _ = 1, k = o; k < r.length; k++) {
        var B = r[k],
          q = B.content;
        if (B.type === 'punctuation' && typeof q == 'string') {
          if (x.test(q)) _++;
          else if (S.test(q) && --_ === 0) return k;
        }
      }
      return -1;
    }
    function R(x, S) {
      var _ = x.alias;
      (_ ? Array.isArray(_) || (x.alias = _ = [_]) : (x.alias = _ = []), _.push(S));
    }
  }),
  (Q.languages.sql = {
    comment: { pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/, lookbehind: !0 },
    variable: [{ pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/, greedy: !0 }, /@[\w.$]+/],
    string: {
      pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
      greedy: !0,
      lookbehind: !0,
    },
    identifier: {
      pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
      greedy: !0,
      lookbehind: !0,
      inside: { punctuation: /^`|`$/ },
    },
    function:
      /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
    keyword:
      /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
    boolean: /\b(?:FALSE|NULL|TRUE)\b/i,
    number: /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
    operator:
      /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
    punctuation: /[;[\]()`,.]/,
  }),
  (function (a) {
    var r = a.languages.javascript['template-string'],
      o = r.pattern.source,
      c = r.inside.interpolation,
      f = c.inside['interpolation-punctuation'],
      y = c.pattern.source;
    function d(g, A) {
      if (a.languages[g])
        return {
          pattern: RegExp('((?:' + A + ')\\s*)' + o),
          lookbehind: !0,
          greedy: !0,
          inside: {
            'template-punctuation': { pattern: /^`|`$/, alias: 'string' },
            'embedded-code': { pattern: /[\s\S]+/, alias: g },
          },
        };
    }
    function m(g, A, R) {
      return (
        (g = { code: g, grammar: A, language: R }),
        a.hooks.run('before-tokenize', g),
        (g.tokens = a.tokenize(g.code, g.grammar)),
        a.hooks.run('after-tokenize', g),
        g.tokens
      );
    }
    function p(g, A, R) {
      var _ = a.tokenize(g, { interpolation: { pattern: RegExp(y), lookbehind: !0 } }),
        x = 0,
        S = {},
        _ = m(
          _.map(function (B) {
            if (typeof B == 'string') return B;
            for (
              var q, W, B = B.content;
              g.indexOf(((W = x++), (q = '___' + R.toUpperCase() + '_' + W + '___'))) !== -1;
            );
            return ((S[q] = B), q);
          }).join(''),
          A,
          R,
        ),
        k = Object.keys(S);
      return (
        (x = 0),
        (function B(q) {
          for (var W = 0; W < q.length; W++) {
            if (x >= k.length) return;
            var te,
              ee,
              Z,
              K,
              ce,
              he,
              Ee,
              G = q[W];
            typeof G == 'string' || typeof G.content == 'string'
              ? ((te = k[x]),
                (Ee = (he = typeof G == 'string' ? G : G.content).indexOf(te)) !== -1 &&
                  (++x,
                  (ee = he.substring(0, Ee)),
                  (ce = S[te]),
                  (Z = void 0),
                  ((K = {})['interpolation-punctuation'] = f),
                  (K = a.tokenize(ce, K)).length === 3 &&
                    ((Z = [1, 1]).push.apply(Z, m(K[1], a.languages.javascript, 'javascript')),
                    K.splice.apply(K, Z)),
                  (Z = new a.Token('interpolation', K, c.alias, ce)),
                  (K = he.substring(Ee + te.length)),
                  (ce = []),
                  ee && ce.push(ee),
                  ce.push(Z),
                  K && (B((he = [K])), ce.push.apply(ce, he)),
                  typeof G == 'string'
                    ? (q.splice.apply(q, [W, 1].concat(ce)), (W += ce.length - 1))
                    : (G.content = ce)))
              : ((Ee = G.content), Array.isArray(Ee) ? B(Ee) : B([Ee]));
          }
        })(_),
        new a.Token(R, _, 'language-' + R, g)
      );
    }
    a.languages.javascript['template-string'] = [
      d(
        'css',
        /\b(?:styled(?:\([^)]*\))?(?:\s*\.\s*\w+(?:\([^)]*\))*)*|css(?:\s*\.\s*(?:global|resolve))?|createGlobalStyle|keyframes)/
          .source,
      ),
      d('html', /\bhtml|\.\s*(?:inner|outer)HTML\s*\+?=/.source),
      d('svg', /\bsvg/.source),
      d('markdown', /\b(?:markdown|md)/.source),
      d('graphql', /\b(?:gql|graphql(?:\s*\.\s*experimental)?)/.source),
      d('sql', /\bsql/.source),
      r,
    ].filter(Boolean);
    var v = { javascript: !0, js: !0, typescript: !0, ts: !0, jsx: !0, tsx: !0 };
    function E(g) {
      return typeof g == 'string' ? g : Array.isArray(g) ? g.map(E).join('') : E(g.content);
    }
    a.hooks.add('after-tokenize', function (g) {
      g.language in v &&
        (function A(R) {
          for (var x = 0, S = R.length; x < S; x++) {
            var _,
              k,
              B,
              q = R[x];
            typeof q != 'string' &&
              ((_ = q.content),
              Array.isArray(_)
                ? q.type === 'template-string'
                  ? ((q = _[1]),
                    _.length === 3 &&
                      typeof q != 'string' &&
                      q.type === 'embedded-code' &&
                      ((k = E(q)),
                      (q = q.alias),
                      (q = Array.isArray(q) ? q[0] : q),
                      (B = a.languages[q])) &&
                      (_[1] = p(k, B, q)))
                  : A(_)
                : typeof _ != 'string' && A([_]));
          }
        })(g.tokens);
    });
  })(Q),
  (function (a) {
    ((a.languages.typescript = a.languages.extend('javascript', {
      'class-name': {
        pattern:
          /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
        lookbehind: !0,
        greedy: !0,
        inside: null,
      },
      builtin:
        /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/,
    })),
      a.languages.typescript.keyword.push(
        /\b(?:abstract|declare|is|keyof|readonly|require)\b/,
        /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
        /\btype\b(?=\s*(?:[\{*]|$))/,
      ),
      delete a.languages.typescript.parameter,
      delete a.languages.typescript['literal-property']);
    var r = a.languages.extend('typescript', {});
    (delete r['class-name'],
      (a.languages.typescript['class-name'].inside = r),
      a.languages.insertBefore('typescript', 'function', {
        decorator: {
          pattern: /@[$\w\xA0-\uFFFF]+/,
          inside: { at: { pattern: /^@/, alias: 'operator' }, function: /^[\s\S]+/ },
        },
        'generic-function': {
          pattern:
            /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
          greedy: !0,
          inside: {
            function: /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
            generic: { pattern: /<[\s\S]+/, alias: 'class-name', inside: r },
          },
        },
      }),
      (a.languages.ts = a.languages.typescript));
  })(Q),
  (function (a) {
    var r = a.languages.javascript,
      o = /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})+\}/.source,
      c = '(@(?:arg|argument|param|property)\\s+(?:' + o + '\\s+)?)';
    ((a.languages.jsdoc = a.languages.extend('javadoclike', {
      parameter: {
        pattern: RegExp(c + /(?:(?!\s)[$\w\xA0-\uFFFF.])+(?=\s|$)/.source),
        lookbehind: !0,
        inside: { punctuation: /\./ },
      },
    })),
      a.languages.insertBefore('jsdoc', 'keyword', {
        'optional-parameter': {
          pattern: RegExp(c + /\[(?:(?!\s)[$\w\xA0-\uFFFF.])+(?:=[^[\]]+)?\](?=\s|$)/.source),
          lookbehind: !0,
          inside: {
            parameter: {
              pattern: /(^\[)[$\w\xA0-\uFFFF\.]+/,
              lookbehind: !0,
              inside: { punctuation: /\./ },
            },
            code: {
              pattern: /(=)[\s\S]*(?=\]$)/,
              lookbehind: !0,
              inside: r,
              alias: 'language-javascript',
            },
            punctuation: /[=[\]]/,
          },
        },
        'class-name': [
          {
            pattern: RegExp(
              /(@(?:augments|class|extends|interface|memberof!?|template|this|typedef)\s+(?:<TYPE>\s+)?)[A-Z]\w*(?:\.[A-Z]\w*)*/.source.replace(
                /<TYPE>/g,
                function () {
                  return o;
                },
              ),
            ),
            lookbehind: !0,
            inside: { punctuation: /\./ },
          },
          {
            pattern: RegExp('(@[a-z]+\\s+)' + o),
            lookbehind: !0,
            inside: {
              string: r.string,
              number: r.number,
              boolean: r.boolean,
              keyword: a.languages.typescript.keyword,
              operator: /=>|\.\.\.|[&|?:*]/,
              punctuation: /[.,;=<>{}()[\]]/,
            },
          },
        ],
        example: {
          pattern: /(@example\s+(?!\s))(?:[^@\s]|\s+(?!\s))+?(?=\s*(?:\*\s*)?(?:@\w|\*\/))/,
          lookbehind: !0,
          inside: {
            code: {
              pattern: /^([\t ]*(?:\*\s*)?)\S.*$/m,
              lookbehind: !0,
              inside: r,
              alias: 'language-javascript',
            },
          },
        },
      }),
      a.languages.javadoclike.addSupport('javascript', a.languages.jsdoc));
  })(Q),
  (function (a) {
    ((a.languages.flow = a.languages.extend('javascript', {})),
      a.languages.insertBefore('flow', 'keyword', {
        type: [
          {
            pattern:
              /\b(?:[Bb]oolean|Function|[Nn]umber|[Ss]tring|[Ss]ymbol|any|mixed|null|void)\b/,
            alias: 'class-name',
          },
        ],
      }),
      (a.languages.flow['function-variable'].pattern =
        /(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=\s*(?:function\b|(?:\([^()]*\)(?:\s*:\s*\w+)?|(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/i),
      delete a.languages.flow.parameter,
      a.languages.insertBefore('flow', 'operator', {
        'flow-punctuation': { pattern: /\{\||\|\}/, alias: 'punctuation' },
      }),
      Array.isArray(a.languages.flow.keyword) ||
        (a.languages.flow.keyword = [a.languages.flow.keyword]),
      a.languages.flow.keyword.unshift(
        { pattern: /(^|[^$]\b)(?:Class|declare|opaque|type)\b(?!\$)/, lookbehind: !0 },
        {
          pattern:
            /(^|[^$]\B)\$(?:Diff|Enum|Exact|Keys|ObjMap|PropertyType|Record|Shape|Subtype|Supertype|await)\b(?!\$)/,
          lookbehind: !0,
        },
      ));
  })(Q),
  (Q.languages.n4js = Q.languages.extend('javascript', {
    keyword:
      /\b(?:Array|any|boolean|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|module|new|null|number|package|private|protected|public|return|set|static|string|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,
  })),
  Q.languages.insertBefore('n4js', 'constant', {
    annotation: { pattern: /@+\w+/, alias: 'operator' },
  }),
  (Q.languages.n4jsd = Q.languages.n4js),
  (function (a) {
    function r(d, m) {
      return RegExp(
        d.replace(/<ID>/g, function () {
          return /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/.source;
        }),
        m,
      );
    }
    (a.languages.insertBefore('javascript', 'function-variable', {
      'method-variable': {
        pattern: RegExp('(\\.\\s*)' + a.languages.javascript['function-variable'].pattern.source),
        lookbehind: !0,
        alias: ['function-variable', 'method', 'function', 'property-access'],
      },
    }),
      a.languages.insertBefore('javascript', 'function', {
        method: {
          pattern: RegExp('(\\.\\s*)' + a.languages.javascript.function.source),
          lookbehind: !0,
          alias: ['function', 'property-access'],
        },
      }),
      a.languages.insertBefore('javascript', 'constant', {
        'known-class-name': [
          {
            pattern:
              /\b(?:(?:Float(?:32|64)|(?:Int|Uint)(?:8|16|32)|Uint8Clamped)?Array|ArrayBuffer|BigInt|Boolean|DataView|Date|Error|Function|Intl|JSON|(?:Weak)?(?:Map|Set)|Math|Number|Object|Promise|Proxy|Reflect|RegExp|String|Symbol|WebAssembly)\b/,
            alias: 'class-name',
          },
          { pattern: /\b(?:[A-Z]\w*)Error\b/, alias: 'class-name' },
        ],
      }),
      a.languages.insertBefore('javascript', 'keyword', {
        imports: {
          pattern: r(
            /(\bimport\b\s*)(?:<ID>(?:\s*,\s*(?:\*\s*as\s+<ID>|\{[^{}]*\}))?|\*\s*as\s+<ID>|\{[^{}]*\})(?=\s*\bfrom\b)/
              .source,
          ),
          lookbehind: !0,
          inside: a.languages.javascript,
        },
        exports: {
          pattern: r(/(\bexport\b\s*)(?:\*(?:\s*as\s+<ID>)?(?=\s*\bfrom\b)|\{[^{}]*\})/.source),
          lookbehind: !0,
          inside: a.languages.javascript,
        },
      }),
      a.languages.javascript.keyword.unshift(
        { pattern: /\b(?:as|default|export|from|import)\b/, alias: 'module' },
        {
          pattern:
            /\b(?:await|break|catch|continue|do|else|finally|for|if|return|switch|throw|try|while|yield)\b/,
          alias: 'control-flow',
        },
        { pattern: /\bnull\b/, alias: ['null', 'nil'] },
        { pattern: /\bundefined\b/, alias: 'nil' },
      ),
      a.languages.insertBefore('javascript', 'operator', {
        spread: { pattern: /\.{3}/, alias: 'operator' },
        arrow: { pattern: /=>/, alias: 'operator' },
      }),
      a.languages.insertBefore('javascript', 'punctuation', {
        'property-access': { pattern: r(/(\.\s*)#?<ID>/.source), lookbehind: !0 },
        'maybe-class-name': {
          pattern: /(^|[^$\w\xA0-\uFFFF])[A-Z][$\w\xA0-\uFFFF]+/,
          lookbehind: !0,
        },
        dom: {
          pattern:
            /\b(?:document|(?:local|session)Storage|location|navigator|performance|window)\b/,
          alias: 'variable',
        },
        console: { pattern: /\bconsole(?=\s*\.)/, alias: 'class-name' },
      }));
    for (
      var o = ['function', 'function-variable', 'method', 'method-variable', 'property-access'],
        c = 0;
      c < o.length;
      c++
    ) {
      var y = o[c],
        f = a.languages.javascript[y],
        y =
          (f = a.util.type(f) === 'RegExp' ? (a.languages.javascript[y] = { pattern: f }) : f)
            .inside || {};
      (f.inside = y)['maybe-class-name'] = /^[A-Z][\s\S]*/;
    }
  })(Q),
  (function (a) {
    var r = a.util.clone(a.languages.javascript),
      o = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source,
      c = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source,
      f = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;
    function y(p, v) {
      return (
        (p = p
          .replace(/<S>/g, function () {
            return o;
          })
          .replace(/<BRACES>/g, function () {
            return c;
          })
          .replace(/<SPREAD>/g, function () {
            return f;
          })),
        RegExp(p, v)
      );
    }
    ((f = y(f).source),
      (a.languages.jsx = a.languages.extend('markup', r)),
      (a.languages.jsx.tag.pattern = y(
        /<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/
          .source,
      )),
      (a.languages.jsx.tag.inside.tag.pattern = /^<\/?[^\s>\/]*/),
      (a.languages.jsx.tag.inside['attr-value'].pattern =
        /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/),
      (a.languages.jsx.tag.inside.tag.inside['class-name'] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/),
      (a.languages.jsx.tag.inside.comment = r.comment),
      a.languages.insertBefore(
        'inside',
        'attr-name',
        { spread: { pattern: y(/<SPREAD>/.source), inside: a.languages.jsx } },
        a.languages.jsx.tag,
      ),
      a.languages.insertBefore(
        'inside',
        'special-attr',
        {
          script: {
            pattern: y(/=<BRACES>/.source),
            alias: 'language-javascript',
            inside: {
              'script-punctuation': { pattern: /^=(?=\{)/, alias: 'punctuation' },
              rest: a.languages.jsx,
            },
          },
        },
        a.languages.jsx.tag,
      ));
    function d(p) {
      for (var v = [], E = 0; E < p.length; E++) {
        var g = p[E],
          A = !1;
        (typeof g != 'string' &&
          (g.type === 'tag' && g.content[0] && g.content[0].type === 'tag'
            ? g.content[0].content[0].content === '</'
              ? 0 < v.length && v[v.length - 1].tagName === m(g.content[0].content[1]) && v.pop()
              : g.content[g.content.length - 1].content !== '/>' &&
                v.push({ tagName: m(g.content[0].content[1]), openedBraces: 0 })
            : 0 < v.length && g.type === 'punctuation' && g.content === '{'
              ? v[v.length - 1].openedBraces++
              : 0 < v.length &&
                  0 < v[v.length - 1].openedBraces &&
                  g.type === 'punctuation' &&
                  g.content === '}'
                ? v[v.length - 1].openedBraces--
                : (A = !0)),
          (A || typeof g == 'string') &&
            0 < v.length &&
            v[v.length - 1].openedBraces === 0 &&
            ((A = m(g)),
            E < p.length - 1 &&
              (typeof p[E + 1] == 'string' || p[E + 1].type === 'plain-text') &&
              ((A += m(p[E + 1])), p.splice(E + 1, 1)),
            0 < E &&
              (typeof p[E - 1] == 'string' || p[E - 1].type === 'plain-text') &&
              ((A = m(p[E - 1]) + A), p.splice(E - 1, 1), E--),
            (p[E] = new a.Token('plain-text', A, null, A))),
          g.content && typeof g.content != 'string' && d(g.content));
      }
    }
    var m = function (p) {
      return p
        ? typeof p == 'string'
          ? p
          : typeof p.content == 'string'
            ? p.content
            : p.content.map(m).join('')
        : '';
    };
    a.hooks.add('after-tokenize', function (p) {
      (p.language !== 'jsx' && p.language !== 'tsx') || d(p.tokens);
    });
  })(Q),
  (function (a) {
    var r = a.util.clone(a.languages.typescript),
      r =
        ((a.languages.tsx = a.languages.extend('jsx', r)),
        delete a.languages.tsx.parameter,
        delete a.languages.tsx['literal-property'],
        a.languages.tsx.tag);
    ((r.pattern = RegExp(
      /(^|[^\w$]|(?=<\/))/.source + '(?:' + r.pattern.source + ')',
      r.pattern.flags,
    )),
      (r.lookbehind = !0));
  })(Q),
  (Q.languages.swift = {
    comment: {
      pattern:
        /(^|[^\\:])(?:\/\/.*|\/\*(?:[^/*]|\/(?!\*)|\*(?!\/)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\*\/)/,
      lookbehind: !0,
      greedy: !0,
    },
    'string-literal': [
      {
        pattern: RegExp(
          /(^|[^"#])/.source +
            '(?:' +
            /"(?:\\(?:\((?:[^()]|\([^()]*\))*\)|\r\n|[^(])|[^\\\r\n"])*"/.source +
            '|' +
            /"""(?:\\(?:\((?:[^()]|\([^()]*\))*\)|[^(])|[^\\"]|"(?!""))*"""/.source +
            ')' +
            /(?!["#])/.source,
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          interpolation: {
            pattern: /(\\\()(?:[^()]|\([^()]*\))*(?=\))/,
            lookbehind: !0,
            inside: null,
          },
          'interpolation-punctuation': { pattern: /^\)|\\\($/, alias: 'punctuation' },
          punctuation: /\\(?=[\r\n])/,
          string: /[\s\S]+/,
        },
      },
      {
        pattern: RegExp(
          /(^|[^"#])(#+)/.source +
            '(?:' +
            /"(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|\r\n|[^#])|[^\\\r\n])*?"/.source +
            '|' +
            /"""(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|[^#])|[^\\])*?"""/.source +
            ')\\2',
        ),
        lookbehind: !0,
        greedy: !0,
        inside: {
          interpolation: {
            pattern: /(\\#+\()(?:[^()]|\([^()]*\))*(?=\))/,
            lookbehind: !0,
            inside: null,
          },
          'interpolation-punctuation': { pattern: /^\)|\\#+\($/, alias: 'punctuation' },
          string: /[\s\S]+/,
        },
      },
    ],
    directive: {
      pattern: RegExp(
        /#/.source +
          '(?:' +
          /(?:elseif|if)\b/.source +
          '(?:[ 	]*' +
          /(?:![ \t]*)?(?:\b\w+\b(?:[ \t]*\((?:[^()]|\([^()]*\))*\))?|\((?:[^()]|\([^()]*\))*\))(?:[ \t]*(?:&&|\|\|))?/
            .source +
          ')+|' +
          /(?:else|endif)\b/.source +
          ')',
      ),
      alias: 'property',
      inside: {
        'directive-name': /^#\w+/,
        boolean: /\b(?:false|true)\b/,
        number: /\b\d+(?:\.\d+)*\b/,
        operator: /!|&&|\|\||[<>]=?/,
        punctuation: /[(),]/,
      },
    },
    literal: {
      pattern:
        /#(?:colorLiteral|column|dsohandle|file(?:ID|Literal|Path)?|function|imageLiteral|line)\b/,
      alias: 'constant',
    },
    'other-directive': { pattern: /#\w+\b/, alias: 'property' },
    attribute: { pattern: /@\w+/, alias: 'atrule' },
    'function-definition': { pattern: /(\bfunc\s+)\w+/, lookbehind: !0, alias: 'function' },
    label: {
      pattern: /\b(break|continue)\s+\w+|\b[a-zA-Z_]\w*(?=\s*:\s*(?:for|repeat|while)\b)/,
      lookbehind: !0,
      alias: 'important',
    },
    keyword:
      /\b(?:Any|Protocol|Self|Type|actor|as|assignment|associatedtype|associativity|async|await|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic|else|enum|extension|fallthrough|fileprivate|final|for|func|get|guard|higherThan|if|import|in|indirect|infix|init|inout|internal|is|isolated|lazy|left|let|lowerThan|mutating|none|nonisolated|nonmutating|open|operator|optional|override|postfix|precedencegroup|prefix|private|protocol|public|repeat|required|rethrows|return|right|safe|self|set|some|static|struct|subscript|super|switch|throw|throws|try|typealias|unowned|unsafe|var|weak|where|while|willSet)\b/,
    boolean: /\b(?:false|true)\b/,
    nil: { pattern: /\bnil\b/, alias: 'constant' },
    'short-argument': /\$\d+\b/,
    omit: { pattern: /\b_\b/, alias: 'keyword' },
    number: /\b(?:[\d_]+(?:\.[\de_]+)?|0x[a-f0-9_]+(?:\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
    'class-name': /\b[A-Z](?:[A-Z_\d]*[a-z]\w*)?\b/,
    function: /\b[a-z_]\w*(?=\s*\()/i,
    constant: /\b(?:[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
    operator: /[-+*/%=!<>&|^~?]+|\.[.\-+*/%=!<>&|^~?]+/,
    punctuation: /[{}[\]();,.:\\]/,
  }),
  Q.languages.swift['string-literal'].forEach(function (a) {
    a.inside.interpolation.inside = Q.languages.swift;
  }),
  (function (a) {
    ((a.languages.kotlin = a.languages.extend('clike', {
      keyword: {
        pattern:
          /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while)\b/,
        lookbehind: !0,
      },
      function: [
        { pattern: /(?:`[^\r\n`]+`|\b\w+)(?=\s*\()/, greedy: !0 },
        { pattern: /(\.)(?:`[^\r\n`]+`|\w+)(?=\s*\{)/, lookbehind: !0, greedy: !0 },
      ],
      number:
        /\b(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
      operator:
        /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/,
    })),
      delete a.languages.kotlin['class-name']);
    var r = {
      'interpolation-punctuation': { pattern: /^\$\{?|\}$/, alias: 'punctuation' },
      expression: { pattern: /[\s\S]+/, inside: a.languages.kotlin },
    };
    (a.languages.insertBefore('kotlin', 'string', {
      'string-literal': [
        {
          pattern: /"""(?:[^$]|\$(?:(?!\{)|\{[^{}]*\}))*?"""/,
          alias: 'multiline',
          inside: {
            interpolation: { pattern: /\$(?:[a-z_]\w*|\{[^{}]*\})/i, inside: r },
            string: /[\s\S]+/,
          },
        },
        {
          pattern: /"(?:[^"\\\r\n$]|\\.|\$(?:(?!\{)|\{[^{}]*\}))*"/,
          alias: 'singleline',
          inside: {
            interpolation: {
              pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:[a-z_]\w*|\{[^{}]*\})/i,
              lookbehind: !0,
              inside: r,
            },
            string: /[\s\S]+/,
          },
        },
      ],
      char: { pattern: /'(?:[^'\\\r\n]|\\(?:.|u[a-fA-F0-9]{0,4}))'/, greedy: !0 },
    }),
      delete a.languages.kotlin.string,
      a.languages.insertBefore('kotlin', 'keyword', {
        annotation: { pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/, alias: 'builtin' },
      }),
      a.languages.insertBefore('kotlin', 'function', {
        label: { pattern: /\b\w+@|@\w+\b/, alias: 'symbol' },
      }),
      (a.languages.kt = a.languages.kotlin),
      (a.languages.kts = a.languages.kotlin));
  })(Q),
  (Q.languages.c = Q.languages.extend('clike', {
    comment: {
      pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
      greedy: !0,
    },
    string: { pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/, greedy: !0 },
    'class-name': {
      pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
      lookbehind: !0,
    },
    keyword:
      /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
    function: /\b[a-z_]\w*(?=\s*\()/i,
    number:
      /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
    operator: />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/,
  })),
  Q.languages.insertBefore('c', 'string', {
    char: { pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/, greedy: !0 },
  }),
  Q.languages.insertBefore('c', 'string', {
    macro: {
      pattern:
        /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
      lookbehind: !0,
      greedy: !0,
      alias: 'property',
      inside: {
        string: [{ pattern: /^(#\s*include\s*)<[^>]+>/, lookbehind: !0 }, Q.languages.c.string],
        char: Q.languages.c.char,
        comment: Q.languages.c.comment,
        'macro-name': [
          { pattern: /(^#\s*define\s+)\w+\b(?!\()/i, lookbehind: !0 },
          { pattern: /(^#\s*define\s+)\w+\b(?=\()/i, lookbehind: !0, alias: 'function' },
        ],
        directive: { pattern: /^(#\s*)[a-z]+/, lookbehind: !0, alias: 'keyword' },
        'directive-hash': /^#/,
        punctuation: /##|\\(?=[\r\n])/,
        expression: { pattern: /\S[\s\S]*/, inside: Q.languages.c },
      },
    },
  }),
  Q.languages.insertBefore('c', 'function', {
    constant:
      /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/,
  }),
  delete Q.languages.c.boolean,
  (Q.languages.objectivec = Q.languages.extend('c', {
    string: { pattern: /@?"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/, greedy: !0 },
    keyword:
      /\b(?:asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|in|inline|int|long|register|return|self|short|signed|sizeof|static|struct|super|switch|typedef|typeof|union|unsigned|void|volatile|while)\b|(?:@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
    operator: /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/,
  })),
  delete Q.languages.objectivec['class-name'],
  (Q.languages.objc = Q.languages.objectivec),
  (Q.languages.reason = Q.languages.extend('clike', {
    string: { pattern: /"(?:\\(?:\r\n|[\s\S])|[^\\\r\n"])*"/, greedy: !0 },
    'class-name': /\b[A-Z]\w*/,
    keyword:
      /\b(?:and|as|assert|begin|class|constraint|do|done|downto|else|end|exception|external|for|fun|function|functor|if|in|include|inherit|initializer|lazy|let|method|module|mutable|new|nonrec|object|of|open|or|private|rec|sig|struct|switch|then|to|try|type|val|virtual|when|while|with)\b/,
    operator:
      /\.{3}|:[:=]|\|>|->|=(?:==?|>)?|<=?|>=?|[|^?'#!~`]|[+\-*\/]\.?|\b(?:asr|land|lor|lsl|lsr|lxor|mod)\b/,
  })),
  Q.languages.insertBefore('reason', 'class-name', {
    char: { pattern: /'(?:\\x[\da-f]{2}|\\o[0-3][0-7][0-7]|\\\d{3}|\\.|[^'\\\r\n])'/, greedy: !0 },
    constructor: /\b[A-Z]\w*\b(?!\s*\.)/,
    label: { pattern: /\b[a-z]\w*(?=::)/, alias: 'symbol' },
  }),
  delete Q.languages.reason.function,
  (function (a) {
    for (var r = /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\//.source, o = 0; o < 2; o++)
      r = r.replace(/<self>/g, function () {
        return r;
      });
    ((r = r.replace(/<self>/g, function () {
      return /[^\s\S]/.source;
    })),
      (a.languages.rust = {
        comment: [
          { pattern: RegExp(/(^|[^\\])/.source + r), lookbehind: !0, greedy: !0 },
          { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
        ],
        string: { pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/, greedy: !0 },
        char: {
          pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
          greedy: !0,
        },
        attribute: {
          pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
          greedy: !0,
          alias: 'attr-name',
          inside: { string: null },
        },
        'closure-params': {
          pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
          lookbehind: !0,
          greedy: !0,
          inside: {
            'closure-punctuation': { pattern: /^\||\|$/, alias: 'punctuation' },
            rest: null,
          },
        },
        'lifetime-annotation': { pattern: /'\w+/, alias: 'symbol' },
        'fragment-specifier': { pattern: /(\$\w+:)[a-z]+/, lookbehind: !0, alias: 'punctuation' },
        variable: /\$\w+/,
        'function-definition': { pattern: /(\bfn\s+)\w+/, lookbehind: !0, alias: 'function' },
        'type-definition': {
          pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
          lookbehind: !0,
          alias: 'class-name',
        },
        'module-declaration': [
          { pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/, lookbehind: !0, alias: 'namespace' },
          {
            pattern:
              /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
            lookbehind: !0,
            alias: 'namespace',
            inside: { punctuation: /::/ },
          },
        ],
        keyword: [
          /\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,
          /\b(?:bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/,
        ],
        function: /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
        macro: { pattern: /\b\w+!/, alias: 'property' },
        constant: /\b[A-Z_][A-Z_\d]+\b/,
        'class-name': /\b[A-Z]\w*\b/,
        namespace: {
          pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
          inside: { punctuation: /::/ },
        },
        number:
          /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
        boolean: /\b(?:false|true)\b/,
        punctuation: /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
        operator: /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/,
      }),
      (a.languages.rust['closure-params'].inside.rest = a.languages.rust),
      (a.languages.rust.attribute.inside.string = a.languages.rust.string));
  })(Q),
  (Q.languages.go = Q.languages.extend('clike', {
    string: { pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/, lookbehind: !0, greedy: !0 },
    keyword:
      /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
    boolean: /\b(?:_|false|iota|nil|true)\b/,
    number: [
      /\b0(?:b[01_]+|o[0-7_]+)i?\b/i,
      /\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,
      /(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i,
    ],
    operator:
      /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
    builtin:
      /\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/,
  })),
  Q.languages.insertBefore('go', 'string', {
    char: { pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/, greedy: !0 },
  }),
  delete Q.languages.go['class-name'],
  (function (a) {
    var r =
        /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,
      o = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(/<keyword>/g, function () {
        return r.source;
      });
    ((a.languages.cpp = a.languages.extend('c', {
      'class-name': [
        {
          pattern: RegExp(
            /(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source.replace(
              /<keyword>/g,
              function () {
                return r.source;
              },
            ),
          ),
          lookbehind: !0,
        },
        /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
        /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
        /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/,
      ],
      keyword: r,
      number: {
        pattern:
          /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
        greedy: !0,
      },
      operator:
        />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
      boolean: /\b(?:false|true)\b/,
    })),
      a.languages.insertBefore('cpp', 'string', {
        module: {
          pattern: RegExp(
            /(\b(?:import|module)\s+)/.source +
              '(?:' +
              /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source +
              '|' +
              /<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(
                /<mod-name>/g,
                function () {
                  return o;
                },
              ) +
              ')',
          ),
          lookbehind: !0,
          greedy: !0,
          inside: { string: /^[<"][\s\S]+/, operator: /:/, punctuation: /\./ },
        },
        'raw-string': { pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/, alias: 'string', greedy: !0 },
      }),
      a.languages.insertBefore('cpp', 'keyword', {
        'generic-function': {
          pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
          inside: {
            function: /^\w+/,
            generic: { pattern: /<[\s\S]+/, alias: 'class-name', inside: a.languages.cpp },
          },
        },
      }),
      a.languages.insertBefore('cpp', 'operator', {
        'double-colon': { pattern: /::/, alias: 'punctuation' },
      }),
      a.languages.insertBefore('cpp', 'class-name', {
        'base-clause': {
          pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
          lookbehind: !0,
          greedy: !0,
          inside: a.languages.extend('cpp', {}),
        },
      }),
      a.languages.insertBefore(
        'inside',
        'double-colon',
        { 'class-name': /\b[a-z_]\w*\b(?!\s*::)/i },
        a.languages.cpp['base-clause'],
      ));
  })(Q),
  (Q.languages.python = {
    comment: { pattern: /(^|[^\\])#.*/, lookbehind: !0, greedy: !0 },
    'string-interpolation': {
      pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
      greedy: !0,
      inside: {
        interpolation: {
          pattern:
            /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
          lookbehind: !0,
          inside: {
            'format-spec': { pattern: /(:)[^:(){}]+(?=\}$)/, lookbehind: !0 },
            'conversion-option': { pattern: /![sra](?=[:}]$)/, alias: 'punctuation' },
            rest: null,
          },
        },
        string: /[\s\S]+/,
      },
    },
    'triple-quoted-string': {
      pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
      greedy: !0,
      alias: 'string',
    },
    string: { pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i, greedy: !0 },
    function: { pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g, lookbehind: !0 },
    'class-name': { pattern: /(\bclass\s+)\w+/i, lookbehind: !0 },
    decorator: {
      pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
      lookbehind: !0,
      alias: ['annotation', 'punctuation'],
      inside: { punctuation: /\./ },
    },
    keyword:
      /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
    builtin:
      /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
    boolean: /\b(?:False|None|True)\b/,
    number:
      /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
    operator: /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
    punctuation: /[{}[\];(),.:]/,
  }),
  (Q.languages.python['string-interpolation'].inside.interpolation.inside.rest =
    Q.languages.python),
  (Q.languages.py = Q.languages.python),
  (Q.languages.json = {
    property: { pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/, lookbehind: !0, greedy: !0 },
    string: { pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/, lookbehind: !0, greedy: !0 },
    comment: { pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/, greedy: !0 },
    number: /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
    punctuation: /[{}[\],]/,
    operator: /:/,
    boolean: /\b(?:false|true)\b/,
    null: { pattern: /\bnull\b/, alias: 'keyword' },
  }),
  (Q.languages.webmanifest = Q.languages.json));
var Yu = {};
pT(Yu, {
  dracula: () => bT,
  duotoneDark: () => ST,
  duotoneLight: () => TT,
  github: () => AT,
  gruvboxMaterialDark: () => eO,
  gruvboxMaterialLight: () => nO,
  jettwaveDark: () => ZT,
  jettwaveLight: () => QT,
  nightOwl: () => CT,
  nightOwlLight: () => RT,
  oceanicNext: () => DT,
  okaidia: () => MT,
  oneDark: () => KT,
  oneLight: () => PT,
  palenight: () => zT,
  shadesOfPurple: () => BT,
  synthwave84: () => HT,
  ultramin: () => GT,
  vsDark: () => J0,
  vsLight: () => VT,
});
var vT = {
    plain: { color: '#F8F8F2', backgroundColor: '#282A36' },
    styles: [
      { types: ['prolog', 'constant', 'builtin'], style: { color: 'rgb(189, 147, 249)' } },
      { types: ['inserted', 'function'], style: { color: 'rgb(80, 250, 123)' } },
      { types: ['deleted'], style: { color: 'rgb(255, 85, 85)' } },
      { types: ['changed'], style: { color: 'rgb(255, 184, 108)' } },
      { types: ['punctuation', 'symbol'], style: { color: 'rgb(248, 248, 242)' } },
      { types: ['string', 'char', 'tag', 'selector'], style: { color: 'rgb(255, 121, 198)' } },
      {
        types: ['keyword', 'variable'],
        style: { color: 'rgb(189, 147, 249)', fontStyle: 'italic' },
      },
      { types: ['comment'], style: { color: 'rgb(98, 114, 164)' } },
      { types: ['attr-name'], style: { color: 'rgb(241, 250, 140)' } },
    ],
  },
  bT = vT,
  ET = {
    plain: { backgroundColor: '#2a2734', color: '#9a86fd' },
    styles: [
      {
        types: ['comment', 'prolog', 'doctype', 'cdata', 'punctuation'],
        style: { color: '#6c6783' },
      },
      { types: ['namespace'], style: { opacity: 0.7 } },
      { types: ['tag', 'operator', 'number'], style: { color: '#e09142' } },
      { types: ['property', 'function'], style: { color: '#9a86fd' } },
      { types: ['tag-id', 'selector', 'atrule-id'], style: { color: '#eeebff' } },
      { types: ['attr-name'], style: { color: '#c4b9fe' } },
      {
        types: [
          'boolean',
          'string',
          'entity',
          'url',
          'attr-value',
          'keyword',
          'control',
          'directive',
          'unit',
          'statement',
          'regex',
          'atrule',
          'placeholder',
          'variable',
        ],
        style: { color: '#ffcc99' },
      },
      { types: ['deleted'], style: { textDecorationLine: 'line-through' } },
      { types: ['inserted'], style: { textDecorationLine: 'underline' } },
      { types: ['italic'], style: { fontStyle: 'italic' } },
      { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
      { types: ['important'], style: { color: '#c4b9fe' } },
    ],
  },
  ST = ET,
  _T = {
    plain: { backgroundColor: '#faf8f5', color: '#728fcb' },
    styles: [
      {
        types: ['comment', 'prolog', 'doctype', 'cdata', 'punctuation'],
        style: { color: '#b6ad9a' },
      },
      { types: ['namespace'], style: { opacity: 0.7 } },
      { types: ['tag', 'operator', 'number'], style: { color: '#063289' } },
      { types: ['property', 'function'], style: { color: '#b29762' } },
      { types: ['tag-id', 'selector', 'atrule-id'], style: { color: '#2d2006' } },
      { types: ['attr-name'], style: { color: '#896724' } },
      {
        types: [
          'boolean',
          'string',
          'entity',
          'url',
          'attr-value',
          'keyword',
          'control',
          'directive',
          'unit',
          'statement',
          'regex',
          'atrule',
        ],
        style: { color: '#728fcb' },
      },
      { types: ['placeholder', 'variable'], style: { color: '#93abdc' } },
      { types: ['deleted'], style: { textDecorationLine: 'line-through' } },
      { types: ['inserted'], style: { textDecorationLine: 'underline' } },
      { types: ['italic'], style: { fontStyle: 'italic' } },
      { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
      { types: ['important'], style: { color: '#896724' } },
    ],
  },
  TT = _T,
  OT = {
    plain: { color: '#393A34', backgroundColor: '#f6f8fa' },
    styles: [
      {
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: { color: '#999988', fontStyle: 'italic' },
      },
      { types: ['namespace'], style: { opacity: 0.7 } },
      { types: ['string', 'attr-value'], style: { color: '#e3116c' } },
      { types: ['punctuation', 'operator'], style: { color: '#393A34' } },
      {
        types: [
          'entity',
          'url',
          'symbol',
          'number',
          'boolean',
          'variable',
          'constant',
          'property',
          'regex',
          'inserted',
        ],
        style: { color: '#36acaa' },
      },
      { types: ['atrule', 'keyword', 'attr-name', 'selector'], style: { color: '#00a4db' } },
      { types: ['function', 'deleted', 'tag'], style: { color: '#d73a49' } },
      { types: ['function-variable'], style: { color: '#6f42c1' } },
      { types: ['tag', 'selector', 'keyword'], style: { color: '#00009f' } },
    ],
  },
  AT = OT,
  xT = {
    plain: { color: '#d6deeb', backgroundColor: '#011627' },
    styles: [
      { types: ['changed'], style: { color: 'rgb(162, 191, 252)', fontStyle: 'italic' } },
      { types: ['deleted'], style: { color: 'rgba(239, 83, 80, 0.56)', fontStyle: 'italic' } },
      {
        types: ['inserted', 'attr-name'],
        style: { color: 'rgb(173, 219, 103)', fontStyle: 'italic' },
      },
      { types: ['comment'], style: { color: 'rgb(99, 119, 119)', fontStyle: 'italic' } },
      { types: ['string', 'url'], style: { color: 'rgb(173, 219, 103)' } },
      { types: ['variable'], style: { color: 'rgb(214, 222, 235)' } },
      { types: ['number'], style: { color: 'rgb(247, 140, 108)' } },
      {
        types: ['builtin', 'char', 'constant', 'function'],
        style: { color: 'rgb(130, 170, 255)' },
      },
      { types: ['punctuation'], style: { color: 'rgb(199, 146, 234)' } },
      {
        types: ['selector', 'doctype'],
        style: { color: 'rgb(199, 146, 234)', fontStyle: 'italic' },
      },
      { types: ['class-name'], style: { color: 'rgb(255, 203, 139)' } },
      { types: ['tag', 'operator', 'keyword'], style: { color: 'rgb(127, 219, 202)' } },
      { types: ['boolean'], style: { color: 'rgb(255, 88, 116)' } },
      { types: ['property'], style: { color: 'rgb(128, 203, 196)' } },
      { types: ['namespace'], style: { color: 'rgb(178, 204, 214)' } },
    ],
  },
  CT = xT,
  wT = {
    plain: { color: '#403f53', backgroundColor: '#FBFBFB' },
    styles: [
      { types: ['changed'], style: { color: 'rgb(162, 191, 252)', fontStyle: 'italic' } },
      { types: ['deleted'], style: { color: 'rgba(239, 83, 80, 0.56)', fontStyle: 'italic' } },
      {
        types: ['inserted', 'attr-name'],
        style: { color: 'rgb(72, 118, 214)', fontStyle: 'italic' },
      },
      { types: ['comment'], style: { color: 'rgb(152, 159, 177)', fontStyle: 'italic' } },
      {
        types: ['string', 'builtin', 'char', 'constant', 'url'],
        style: { color: 'rgb(72, 118, 214)' },
      },
      { types: ['variable'], style: { color: 'rgb(201, 103, 101)' } },
      { types: ['number'], style: { color: 'rgb(170, 9, 130)' } },
      { types: ['punctuation'], style: { color: 'rgb(153, 76, 195)' } },
      {
        types: ['function', 'selector', 'doctype'],
        style: { color: 'rgb(153, 76, 195)', fontStyle: 'italic' },
      },
      { types: ['class-name'], style: { color: 'rgb(17, 17, 17)' } },
      { types: ['tag'], style: { color: 'rgb(153, 76, 195)' } },
      {
        types: ['operator', 'property', 'keyword', 'namespace'],
        style: { color: 'rgb(12, 150, 155)' },
      },
      { types: ['boolean'], style: { color: 'rgb(188, 84, 84)' } },
    ],
  },
  RT = wT,
  ln = {
    char: '#D8DEE9',
    comment: '#999999',
    keyword: '#c5a5c5',
    primitive: '#5a9bcf',
    string: '#8dc891',
    variable: '#d7deea',
    boolean: '#ff8b50',
    tag: '#fc929e',
    function: '#79b6f2',
    className: '#FAC863',
  },
  NT = {
    plain: { backgroundColor: '#282c34', color: '#ffffff' },
    styles: [
      { types: ['attr-name'], style: { color: ln.keyword } },
      { types: ['attr-value'], style: { color: ln.string } },
      {
        types: ['comment', 'block-comment', 'prolog', 'doctype', 'cdata', 'shebang'],
        style: { color: ln.comment },
      },
      {
        types: ['property', 'number', 'function-name', 'constant', 'symbol', 'deleted'],
        style: { color: ln.primitive },
      },
      { types: ['boolean'], style: { color: ln.boolean } },
      { types: ['tag'], style: { color: ln.tag } },
      { types: ['string'], style: { color: ln.string } },
      { types: ['punctuation'], style: { color: ln.string } },
      { types: ['selector', 'char', 'builtin', 'inserted'], style: { color: ln.char } },
      { types: ['function'], style: { color: ln.function } },
      { types: ['operator', 'entity', 'url', 'variable'], style: { color: ln.variable } },
      { types: ['keyword'], style: { color: ln.keyword } },
      { types: ['atrule', 'class-name'], style: { color: ln.className } },
      { types: ['important'], style: { fontWeight: '400' } },
      { types: ['bold'], style: { fontWeight: 'bold' } },
      { types: ['italic'], style: { fontStyle: 'italic' } },
      { types: ['namespace'], style: { opacity: 0.7 } },
    ],
  },
  DT = NT,
  jT = {
    plain: { color: '#f8f8f2', backgroundColor: '#272822' },
    styles: [
      { types: ['changed'], style: { color: 'rgb(162, 191, 252)', fontStyle: 'italic' } },
      { types: ['deleted'], style: { color: '#f92672', fontStyle: 'italic' } },
      { types: ['inserted'], style: { color: 'rgb(173, 219, 103)', fontStyle: 'italic' } },
      { types: ['comment'], style: { color: '#8292a2', fontStyle: 'italic' } },
      { types: ['string', 'url'], style: { color: '#a6e22e' } },
      { types: ['variable'], style: { color: '#f8f8f2' } },
      { types: ['number'], style: { color: '#ae81ff' } },
      {
        types: ['builtin', 'char', 'constant', 'function', 'class-name'],
        style: { color: '#e6db74' },
      },
      { types: ['punctuation'], style: { color: '#f8f8f2' } },
      { types: ['selector', 'doctype'], style: { color: '#a6e22e', fontStyle: 'italic' } },
      { types: ['tag', 'operator', 'keyword'], style: { color: '#66d9ef' } },
      { types: ['boolean'], style: { color: '#ae81ff' } },
      { types: ['namespace'], style: { color: 'rgb(178, 204, 214)', opacity: 0.7 } },
      { types: ['tag', 'property'], style: { color: '#f92672' } },
      { types: ['attr-name'], style: { color: '#a6e22e !important' } },
      { types: ['doctype'], style: { color: '#8292a2' } },
      { types: ['rule'], style: { color: '#e6db74' } },
    ],
  },
  MT = jT,
  LT = {
    plain: { color: '#bfc7d5', backgroundColor: '#292d3e' },
    styles: [
      { types: ['comment'], style: { color: 'rgb(105, 112, 152)', fontStyle: 'italic' } },
      { types: ['string', 'inserted'], style: { color: 'rgb(195, 232, 141)' } },
      { types: ['number'], style: { color: 'rgb(247, 140, 108)' } },
      {
        types: ['builtin', 'char', 'constant', 'function'],
        style: { color: 'rgb(130, 170, 255)' },
      },
      { types: ['punctuation', 'selector'], style: { color: 'rgb(199, 146, 234)' } },
      { types: ['variable'], style: { color: 'rgb(191, 199, 213)' } },
      { types: ['class-name', 'attr-name'], style: { color: 'rgb(255, 203, 107)' } },
      { types: ['tag', 'deleted'], style: { color: 'rgb(255, 85, 114)' } },
      { types: ['operator'], style: { color: 'rgb(137, 221, 255)' } },
      { types: ['boolean'], style: { color: 'rgb(255, 88, 116)' } },
      { types: ['keyword'], style: { fontStyle: 'italic' } },
      { types: ['doctype'], style: { color: 'rgb(199, 146, 234)', fontStyle: 'italic' } },
      { types: ['namespace'], style: { color: 'rgb(178, 204, 214)' } },
      { types: ['url'], style: { color: 'rgb(221, 221, 221)' } },
    ],
  },
  zT = LT,
  UT = {
    plain: { color: '#9EFEFF', backgroundColor: '#2D2A55' },
    styles: [
      { types: ['changed'], style: { color: 'rgb(255, 238, 128)' } },
      { types: ['deleted'], style: { color: 'rgba(239, 83, 80, 0.56)' } },
      { types: ['inserted'], style: { color: 'rgb(173, 219, 103)' } },
      { types: ['comment'], style: { color: 'rgb(179, 98, 255)', fontStyle: 'italic' } },
      { types: ['punctuation'], style: { color: 'rgb(255, 255, 255)' } },
      { types: ['constant'], style: { color: 'rgb(255, 98, 140)' } },
      { types: ['string', 'url'], style: { color: 'rgb(165, 255, 144)' } },
      { types: ['variable'], style: { color: 'rgb(255, 238, 128)' } },
      { types: ['number', 'boolean'], style: { color: 'rgb(255, 98, 140)' } },
      { types: ['attr-name'], style: { color: 'rgb(255, 180, 84)' } },
      {
        types: ['keyword', 'operator', 'property', 'namespace', 'tag', 'selector', 'doctype'],
        style: { color: 'rgb(255, 157, 0)' },
      },
      {
        types: ['builtin', 'char', 'constant', 'function', 'class-name'],
        style: { color: 'rgb(250, 208, 0)' },
      },
    ],
  },
  BT = UT,
  kT = {
    plain: {
      backgroundColor: 'linear-gradient(to bottom, #2a2139 75%, #34294f)',
      backgroundImage: '#34294f',
      color: '#f92aad',
      textShadow: '0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3',
    },
    styles: [
      {
        types: ['comment', 'block-comment', 'prolog', 'doctype', 'cdata'],
        style: { color: '#495495', fontStyle: 'italic' },
      },
      { types: ['punctuation'], style: { color: '#ccc' } },
      {
        types: ['tag', 'attr-name', 'namespace', 'number', 'unit', 'hexcode', 'deleted'],
        style: { color: '#e2777a' },
      },
      {
        types: ['property', 'selector'],
        style: {
          color: '#72f1b8',
          textShadow: '0 0 2px #100c0f, 0 0 10px #257c5575, 0 0 35px #21272475',
        },
      },
      { types: ['function-name'], style: { color: '#6196cc' } },
      {
        types: ['boolean', 'selector-id', 'function'],
        style: {
          color: '#fdfdfd',
          textShadow: '0 0 2px #001716, 0 0 3px #03edf975, 0 0 5px #03edf975, 0 0 8px #03edf975',
        },
      },
      {
        types: ['class-name', 'maybe-class-name', 'builtin'],
        style: {
          color: '#fff5f6',
          textShadow: '0 0 2px #000, 0 0 10px #fc1f2c75, 0 0 5px #fc1f2c75, 0 0 25px #fc1f2c75',
        },
      },
      {
        types: ['constant', 'symbol'],
        style: {
          color: '#f92aad',
          textShadow: '0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3',
        },
      },
      {
        types: ['important', 'atrule', 'keyword', 'selector-class'],
        style: {
          color: '#f4eee4',
          textShadow: '0 0 2px #393a33, 0 0 8px #f39f0575, 0 0 2px #f39f0575',
        },
      },
      { types: ['string', 'char', 'attr-value', 'regex', 'variable'], style: { color: '#f87c32' } },
      { types: ['parameter'], style: { fontStyle: 'italic' } },
      { types: ['entity', 'url'], style: { color: '#67cdcc' } },
      { types: ['operator'], style: { color: 'ffffffee' } },
      { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
      { types: ['italic'], style: { fontStyle: 'italic' } },
      { types: ['entity'], style: { cursor: 'help' } },
      { types: ['inserted'], style: { color: 'green' } },
    ],
  },
  HT = kT,
  FT = {
    plain: { color: '#282a2e', backgroundColor: '#ffffff' },
    styles: [
      { types: ['comment'], style: { color: 'rgb(197, 200, 198)' } },
      {
        types: ['string', 'number', 'builtin', 'variable'],
        style: { color: 'rgb(150, 152, 150)' },
      },
      {
        types: ['class-name', 'function', 'tag', 'attr-name'],
        style: { color: 'rgb(40, 42, 46)' },
      },
    ],
  },
  GT = FT,
  qT = {
    plain: { color: '#9CDCFE', backgroundColor: '#1E1E1E' },
    styles: [
      { types: ['prolog'], style: { color: 'rgb(0, 0, 128)' } },
      { types: ['comment'], style: { color: 'rgb(106, 153, 85)' } },
      {
        types: ['builtin', 'changed', 'keyword', 'interpolation-punctuation'],
        style: { color: 'rgb(86, 156, 214)' },
      },
      { types: ['number', 'inserted'], style: { color: 'rgb(181, 206, 168)' } },
      { types: ['constant'], style: { color: 'rgb(100, 102, 149)' } },
      { types: ['attr-name', 'variable'], style: { color: 'rgb(156, 220, 254)' } },
      {
        types: ['deleted', 'string', 'attr-value', 'template-punctuation'],
        style: { color: 'rgb(206, 145, 120)' },
      },
      { types: ['selector'], style: { color: 'rgb(215, 186, 125)' } },
      { types: ['tag'], style: { color: 'rgb(78, 201, 176)' } },
      { types: ['tag'], languages: ['markup'], style: { color: 'rgb(86, 156, 214)' } },
      { types: ['punctuation', 'operator'], style: { color: 'rgb(212, 212, 212)' } },
      { types: ['punctuation'], languages: ['markup'], style: { color: '#808080' } },
      { types: ['function'], style: { color: 'rgb(220, 220, 170)' } },
      { types: ['class-name'], style: { color: 'rgb(78, 201, 176)' } },
      { types: ['char'], style: { color: 'rgb(209, 105, 105)' } },
    ],
  },
  J0 = qT,
  YT = {
    plain: { color: '#000000', backgroundColor: '#ffffff' },
    styles: [
      { types: ['comment'], style: { color: 'rgb(0, 128, 0)' } },
      { types: ['builtin'], style: { color: 'rgb(0, 112, 193)' } },
      { types: ['number', 'variable', 'inserted'], style: { color: 'rgb(9, 134, 88)' } },
      { types: ['operator'], style: { color: 'rgb(0, 0, 0)' } },
      { types: ['constant', 'char'], style: { color: 'rgb(129, 31, 63)' } },
      { types: ['tag'], style: { color: 'rgb(128, 0, 0)' } },
      { types: ['attr-name'], style: { color: 'rgb(255, 0, 0)' } },
      { types: ['deleted', 'string'], style: { color: 'rgb(163, 21, 21)' } },
      { types: ['changed', 'punctuation'], style: { color: 'rgb(4, 81, 165)' } },
      { types: ['function', 'keyword'], style: { color: 'rgb(0, 0, 255)' } },
      { types: ['class-name'], style: { color: 'rgb(38, 127, 153)' } },
    ],
  },
  VT = YT,
  IT = {
    plain: { color: '#f8fafc', backgroundColor: '#011627' },
    styles: [
      { types: ['prolog'], style: { color: '#000080' } },
      { types: ['comment'], style: { color: '#6A9955' } },
      {
        types: ['builtin', 'changed', 'keyword', 'interpolation-punctuation'],
        style: { color: '#569CD6' },
      },
      { types: ['number', 'inserted'], style: { color: '#B5CEA8' } },
      { types: ['constant'], style: { color: '#f8fafc' } },
      { types: ['attr-name', 'variable'], style: { color: '#9CDCFE' } },
      {
        types: ['deleted', 'string', 'attr-value', 'template-punctuation'],
        style: { color: '#cbd5e1' },
      },
      { types: ['selector'], style: { color: '#D7BA7D' } },
      { types: ['tag'], style: { color: '#0ea5e9' } },
      { types: ['tag'], languages: ['markup'], style: { color: '#0ea5e9' } },
      { types: ['punctuation', 'operator'], style: { color: '#D4D4D4' } },
      { types: ['punctuation'], languages: ['markup'], style: { color: '#808080' } },
      { types: ['function'], style: { color: '#7dd3fc' } },
      { types: ['class-name'], style: { color: '#0ea5e9' } },
      { types: ['char'], style: { color: '#D16969' } },
    ],
  },
  ZT = IT,
  XT = {
    plain: { color: '#0f172a', backgroundColor: '#f1f5f9' },
    styles: [
      { types: ['prolog'], style: { color: '#000080' } },
      { types: ['comment'], style: { color: '#6A9955' } },
      {
        types: ['builtin', 'changed', 'keyword', 'interpolation-punctuation'],
        style: { color: '#0c4a6e' },
      },
      { types: ['number', 'inserted'], style: { color: '#B5CEA8' } },
      { types: ['constant'], style: { color: '#0f172a' } },
      { types: ['attr-name', 'variable'], style: { color: '#0c4a6e' } },
      {
        types: ['deleted', 'string', 'attr-value', 'template-punctuation'],
        style: { color: '#64748b' },
      },
      { types: ['selector'], style: { color: '#D7BA7D' } },
      { types: ['tag'], style: { color: '#0ea5e9' } },
      { types: ['tag'], languages: ['markup'], style: { color: '#0ea5e9' } },
      { types: ['punctuation', 'operator'], style: { color: '#475569' } },
      { types: ['punctuation'], languages: ['markup'], style: { color: '#808080' } },
      { types: ['function'], style: { color: '#0e7490' } },
      { types: ['class-name'], style: { color: '#0ea5e9' } },
      { types: ['char'], style: { color: '#D16969' } },
    ],
  },
  QT = XT,
  $T = {
    plain: {
      backgroundColor: 'hsl(220, 13%, 18%)',
      color: 'hsl(220, 14%, 71%)',
      textShadow: '0 1px rgba(0, 0, 0, 0.3)',
    },
    styles: [
      { types: ['comment', 'prolog', 'cdata'], style: { color: 'hsl(220, 10%, 40%)' } },
      { types: ['doctype', 'punctuation', 'entity'], style: { color: 'hsl(220, 14%, 71%)' } },
      {
        types: [
          'attr-name',
          'class-name',
          'maybe-class-name',
          'boolean',
          'constant',
          'number',
          'atrule',
        ],
        style: { color: 'hsl(29, 54%, 61%)' },
      },
      { types: ['keyword'], style: { color: 'hsl(286, 60%, 67%)' } },
      {
        types: ['property', 'tag', 'symbol', 'deleted', 'important'],
        style: { color: 'hsl(355, 65%, 65%)' },
      },
      {
        types: ['selector', 'string', 'char', 'builtin', 'inserted', 'regex', 'attr-value'],
        style: { color: 'hsl(95, 38%, 62%)' },
      },
      { types: ['variable', 'operator', 'function'], style: { color: 'hsl(207, 82%, 66%)' } },
      { types: ['url'], style: { color: 'hsl(187, 47%, 55%)' } },
      { types: ['deleted'], style: { textDecorationLine: 'line-through' } },
      { types: ['inserted'], style: { textDecorationLine: 'underline' } },
      { types: ['italic'], style: { fontStyle: 'italic' } },
      { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
      { types: ['important'], style: { color: 'hsl(220, 14%, 71%)' } },
    ],
  },
  KT = $T,
  JT = {
    plain: { backgroundColor: 'hsl(230, 1%, 98%)', color: 'hsl(230, 8%, 24%)' },
    styles: [
      { types: ['comment', 'prolog', 'cdata'], style: { color: 'hsl(230, 4%, 64%)' } },
      { types: ['doctype', 'punctuation', 'entity'], style: { color: 'hsl(230, 8%, 24%)' } },
      {
        types: ['attr-name', 'class-name', 'boolean', 'constant', 'number', 'atrule'],
        style: { color: 'hsl(35, 99%, 36%)' },
      },
      { types: ['keyword'], style: { color: 'hsl(301, 63%, 40%)' } },
      {
        types: ['property', 'tag', 'symbol', 'deleted', 'important'],
        style: { color: 'hsl(5, 74%, 59%)' },
      },
      {
        types: [
          'selector',
          'string',
          'char',
          'builtin',
          'inserted',
          'regex',
          'attr-value',
          'punctuation',
        ],
        style: { color: 'hsl(119, 34%, 47%)' },
      },
      { types: ['variable', 'operator', 'function'], style: { color: 'hsl(221, 87%, 60%)' } },
      { types: ['url'], style: { color: 'hsl(198, 99%, 37%)' } },
      { types: ['deleted'], style: { textDecorationLine: 'line-through' } },
      { types: ['inserted'], style: { textDecorationLine: 'underline' } },
      { types: ['italic'], style: { fontStyle: 'italic' } },
      { types: ['important', 'bold'], style: { fontWeight: 'bold' } },
      { types: ['important'], style: { color: 'hsl(230, 8%, 24%)' } },
    ],
  },
  PT = JT,
  WT = {
    plain: { color: '#ebdbb2', backgroundColor: '#292828' },
    styles: [
      {
        types: [
          'imports',
          'class-name',
          'maybe-class-name',
          'constant',
          'doctype',
          'builtin',
          'function',
        ],
        style: { color: '#d8a657' },
      },
      { types: ['property-access'], style: { color: '#7daea3' } },
      { types: ['tag'], style: { color: '#e78a4e' } },
      { types: ['attr-name', 'char', 'url', 'regex'], style: { color: '#a9b665' } },
      { types: ['attr-value', 'string'], style: { color: '#89b482' } },
      {
        types: ['comment', 'prolog', 'cdata', 'operator', 'inserted'],
        style: { color: '#a89984' },
      },
      {
        types: [
          'delimiter',
          'boolean',
          'keyword',
          'selector',
          'important',
          'atrule',
          'property',
          'variable',
          'deleted',
        ],
        style: { color: '#ea6962' },
      },
      { types: ['entity', 'number', 'symbol'], style: { color: '#d3869b' } },
    ],
  },
  eO = WT,
  tO = {
    plain: { color: '#654735', backgroundColor: '#f9f5d7' },
    styles: [
      {
        types: [
          'delimiter',
          'boolean',
          'keyword',
          'selector',
          'important',
          'atrule',
          'property',
          'variable',
          'deleted',
        ],
        style: { color: '#af2528' },
      },
      {
        types: ['imports', 'class-name', 'maybe-class-name', 'constant', 'doctype', 'builtin'],
        style: { color: '#b4730e' },
      },
      { types: ['string', 'attr-value'], style: { color: '#477a5b' } },
      { types: ['property-access'], style: { color: '#266b79' } },
      { types: ['function', 'attr-name', 'char', 'url'], style: { color: '#72761e' } },
      { types: ['tag'], style: { color: '#b94c07' } },
      {
        types: ['comment', 'prolog', 'cdata', 'operator', 'inserted'],
        style: { color: '#a89984' },
      },
      { types: ['entity', 'number', 'symbol'], style: { color: '#924f79' } },
    ],
  },
  nO = tO,
  lO = (a) =>
    L.useCallback(
      (r) => {
        var o = r,
          { className: c, style: f, line: y } = o,
          d = K0(o, ['className', 'style', 'line']);
        const m = rc(Qn({}, d), { className: X0('token-line', c) });
        return (
          typeof a == 'object' && 'plain' in a && (m.style = a.plain),
          typeof f == 'object' && (m.style = Qn(Qn({}, m.style || {}), f)),
          m
        );
      },
      [a],
    ),
  aO = (a) => {
    const r = L.useCallback(
      ({ types: o, empty: c }) => {
        if (a != null) {
          {
            if (o.length === 1 && o[0] === 'plain')
              return c != null ? { display: 'inline-block' } : void 0;
            if (o.length === 1 && c != null) return a[o[0]];
          }
          return Object.assign(c != null ? { display: 'inline-block' } : {}, ...o.map((f) => a[f]));
        }
      },
      [a],
    );
    return L.useCallback(
      (o) => {
        var c = o,
          { token: f, className: y, style: d } = c,
          m = K0(c, ['token', 'className', 'style']);
        const p = rc(Qn({}, m), {
          className: X0('token', ...f.types, y),
          children: f.content,
          style: r(f),
        });
        return (d != null && (p.style = Qn(Qn({}, p.style || {}), d)), p);
      },
      [r],
    );
  },
  rO = /\r\n|\r|\n/,
  _m = (a) => {
    a.length === 0
      ? a.push({
          types: ['plain'],
          content: `
`,
          empty: !0,
        })
      : a.length === 1 &&
        a[0].content === '' &&
        ((a[0].content = `
`),
        (a[0].empty = !0));
  },
  Tm = (a, r) => {
    const o = a.length;
    return o > 0 && a[o - 1] === r ? a : a.concat(r);
  },
  uO = (a) => {
    const r = [[]],
      o = [a],
      c = [0],
      f = [a.length];
    let y = 0,
      d = 0,
      m = [];
    const p = [m];
    for (; d > -1;) {
      for (; (y = c[d]++) < f[d];) {
        let v,
          E = r[d];
        const A = o[d][y];
        if (
          (typeof A == 'string'
            ? ((E = d > 0 ? E : ['plain']), (v = A))
            : ((E = Tm(E, A.type)), A.alias && (E = Tm(E, A.alias)), (v = A.content)),
          typeof v != 'string')
        ) {
          (d++, r.push(E), o.push(v), c.push(0), f.push(v.length));
          continue;
        }
        const R = v.split(rO),
          x = R.length;
        m.push({ types: E, content: R[0] });
        for (let S = 1; S < x; S++) (_m(m), p.push((m = [])), m.push({ types: E, content: R[S] }));
      }
      (d--, r.pop(), o.pop(), c.pop(), f.pop());
    }
    return (_m(m), p);
  },
  Om = uO,
  iO = ({ prism: a, code: r, grammar: o, language: c }) =>
    L.useMemo(() => {
      if (o == null) return Om([r]);
      const f = { code: r, grammar: o, language: c, tokens: [] };
      return (
        a.hooks.run('before-tokenize', f),
        (f.tokens = a.tokenize(r, o)),
        a.hooks.run('after-tokenize', f),
        Om(f.tokens)
      );
    }, [r, o, c, a]),
  oO = (a, r) => {
    const { plain: o } = a,
      c = a.styles.reduce((f, y) => {
        const { languages: d, style: m } = y;
        return (
          (d && !d.includes(r)) ||
            y.types.forEach((p) => {
              const v = Qn(Qn({}, f[p]), m);
              f[p] = v;
            }),
          f
        );
      }, {});
    return ((c.root = o), (c.plain = rc(Qn({}, o), { backgroundColor: void 0 })), c);
  },
  cO = oO,
  sO = ({ children: a, language: r, code: o, theme: c, prism: f }) => {
    const y = r.toLowerCase(),
      d = cO(c, y),
      m = lO(d),
      p = aO(d),
      v = f.languages[y],
      E = iO({ prism: f, language: y, code: o, grammar: v });
    return a({
      tokens: E,
      className: `prism-code language-${y}`,
      style: d != null ? d.root : {},
      getLineProps: m,
      getTokenProps: p,
    });
  },
  Am = (a) =>
    L.createElement(
      sO,
      rc(Qn({}, a), {
        prism: a.prism || Q,
        theme: a.theme || J0,
        code: a.code,
        language: a.language,
      }),
    );
/*! Bundled license information:

prismjs/prism.js:
  (**
   * Prism: Lightweight, robust, elegant syntax highlighting
   *
   * @license MIT <https://opensource.org/licenses/MIT>
   * @author Lea Verou <https://lea.verou.me>
   * @namespace
   * @public
   *)
*/ const P0 = {
  stories: 'src/**/*.stories.{js,jsx,ts,tsx,mdx}',
  defaultStory: '',
  storyOrder: (a) => a,
  viteConfig: void 0,
  appendToHead: '',
  disableHttp2: !1,
  noWatch: !1,
  port: 61e3,
  previewPort: 8080,
  hmrHost: void 0,
  hmrPort: void 0,
  outDir: 'build',
  base: void 0,
  expandStoryTree: !1,
  hotkeys: {
    search: ['/', 'meta+p'],
    nextStory: ['alt+arrowright'],
    previousStory: ['alt+arrowleft'],
    nextComponent: ['alt+arrowdown'],
    previousComponent: ['alt+arrowup'],
    control: ['c'],
    darkMode: ['d'],
    fullscreen: ['f'],
    width: ['w'],
    rtl: ['r'],
    source: ['s'],
    a11y: ['a'],
  },
  onDevServerStart: () => {},
  i18n: { buildTooltip: '💡 Tip: Run "ladle preview" to check that the build works!' },
  addons: {
    control: { enabled: !0, defaultState: {} },
    theme: { enabled: !0, defaultState: 'light' },
    mode: { enabled: !0, defaultState: 'full' },
    rtl: { enabled: !0, defaultState: !1 },
    source: {
      enabled: !0,
      defaultState: !1,
      themeDark: {
        ...Yu.nightOwl,
        plain: { ...Yu.nightOwl.plain, backgroundColor: 'var(--ladle-bg-color-secondary)' },
      },
      themeLight: {
        ...Yu.github,
        plain: { ...Yu.github.plain, backgroundColor: 'var(--ladle-bg-color-secondary)' },
      },
    },
    a11y: { enabled: !1 },
    msw: { enabled: !1 },
    action: { enabled: !0, defaultState: [] },
    ladle: { enabled: !0 },
    width: {
      enabled: !0,
      options: { xsmall: 414, small: 640, medium: 768, large: 1024 },
      defaultState: 0,
    },
  },
};
Object.keys(bn).length === 0
  ? Xn('No custom config found.')
  : (bn.storyOrder &&
      typeof bn.storyOrder == 'string' &&
      (bn.storyOrder = new Function('return ' + bn.storyOrder)()),
    Xn('Custom config found:'),
    Xn(bn));
var Vm, Im;
(Im = (Vm = bn == null ? void 0 : bn.addons) == null ? void 0 : Vm.width) != null &&
  Im.options &&
  (P0.addons.width.options = {});
const ge = NE(P0, bn);
ge.defaultStory === '' && (ge.defaultStory = l0(Object.keys(Fr), ge.storyOrder)[0]);
ge.hotkeys = { ...ge.hotkeys, ...bn.hotkeys };
Xn('Final config', ge);
const W0 = (a) => {
    switch (Kn.parse(a).theme) {
      case st.Light:
        return st.Light;
      case st.Dark:
        return st.Dark;
      case st.Auto:
        return st.Auto;
      default:
        return 'light';
    }
  },
  fO = ({ globalState: a, dispatch: r }) => {
    const o = 'Switch to dark theme.',
      c = 'Switch to light theme.',
      f = () => {
        const y = a.theme === st.Light ? st.Dark : st.Light;
        (document.documentElement.setAttribute('data-theme', y),
          r({ type: De.UpdateTheme, value: y }));
      };
    return (
      En(ge.hotkeys.darkMode, f, { enabled: a.hotkeys && ge.addons.mode.enabled }),
      b.jsx('li', {
        children: b.jsxs('button', {
          'aria-label': a.theme === st.Light ? o : c,
          title: a.theme === st.Light ? o : c,
          onClick: f,
          type: 'button',
          children: [
            b.jsx(nS, {}),
            b.jsx('span', {
              className: 'ladle-addon-tooltip',
              children: a.theme === st.Light ? o : c,
            }),
            b.jsxs('label', {
              children: ['Switch to', ' ', a.theme === st.Light ? st.Dark : st.Light, ' ', 'theme'],
            }),
          ],
        }),
      })
    );
  },
  ev = n0(e0(location.search, ge.defaultStory));
Xn(`Initial document.title: ${ev}`);
document.title = `${ev} | Ladle`;
const _d = W0(location.search);
Xn(`Initial theme state: ${_d}`);
_d === st.Auto
  ? window.matchMedia('(prefers-color-scheme: dark)').matches
    ? document.documentElement.setAttribute('data-theme', st.Dark)
    : document.documentElement.setAttribute('data-theme', st.Light)
  : document.documentElement.setAttribute('data-theme', _d);
var Pf = { exports: {} },
  Fu = {},
  Wf = { exports: {} },
  ed = {};
/**
 * @license React
 * scheduler.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var xm;
function dO() {
  return (
    xm ||
      ((xm = 1),
      (function (a) {
        function r(I, P) {
          var J = I.length;
          I.push(P);
          e: for (; 0 < J;) {
            var se = (J - 1) >>> 1,
              le = I[se];
            if (0 < f(le, P)) ((I[se] = P), (I[J] = le), (J = se));
            else break e;
          }
        }
        function o(I) {
          return I.length === 0 ? null : I[0];
        }
        function c(I) {
          if (I.length === 0) return null;
          var P = I[0],
            J = I.pop();
          if (J !== P) {
            I[0] = J;
            e: for (var se = 0, le = I.length, xe = le >>> 1; se < xe;) {
              var je = 2 * (se + 1) - 1,
                be = I[je],
                C = je + 1,
                $ = I[C];
              if (0 > f(be, J))
                C < le && 0 > f($, be)
                  ? ((I[se] = $), (I[C] = J), (se = C))
                  : ((I[se] = be), (I[je] = J), (se = je));
              else if (C < le && 0 > f($, J)) ((I[se] = $), (I[C] = J), (se = C));
              else break e;
            }
          }
          return P;
        }
        function f(I, P) {
          var J = I.sortIndex - P.sortIndex;
          return J !== 0 ? J : I.id - P.id;
        }
        if (
          ((a.unstable_now = void 0),
          typeof performance == 'object' && typeof performance.now == 'function')
        ) {
          var y = performance;
          a.unstable_now = function () {
            return y.now();
          };
        } else {
          var d = Date,
            m = d.now();
          a.unstable_now = function () {
            return d.now() - m;
          };
        }
        var p = [],
          v = [],
          E = 1,
          g = null,
          A = 3,
          R = !1,
          x = !1,
          S = !1,
          _ = !1,
          k = typeof setTimeout == 'function' ? setTimeout : null,
          B = typeof clearTimeout == 'function' ? clearTimeout : null,
          q = typeof setImmediate < 'u' ? setImmediate : null;
        function W(I) {
          for (var P = o(v); P !== null;) {
            if (P.callback === null) c(v);
            else if (P.startTime <= I) (c(v), (P.sortIndex = P.expirationTime), r(p, P));
            else break;
            P = o(v);
          }
        }
        function te(I) {
          if (((S = !1), W(I), !x))
            if (o(p) !== null) ((x = !0), ee || ((ee = !0), G()));
            else {
              var P = o(v);
              P !== null && ie(te, P.startTime - I);
            }
        }
        var ee = !1,
          Z = -1,
          K = 5,
          ce = -1;
        function he() {
          return _ ? !0 : !(a.unstable_now() - ce < K);
        }
        function Ee() {
          if (((_ = !1), ee)) {
            var I = a.unstable_now();
            ce = I;
            var P = !0;
            try {
              e: {
                ((x = !1), S && ((S = !1), B(Z), (Z = -1)), (R = !0));
                var J = A;
                try {
                  t: {
                    for (W(I), g = o(p); g !== null && !(g.expirationTime > I && he());) {
                      var se = g.callback;
                      if (typeof se == 'function') {
                        ((g.callback = null), (A = g.priorityLevel));
                        var le = se(g.expirationTime <= I);
                        if (((I = a.unstable_now()), typeof le == 'function')) {
                          ((g.callback = le), W(I), (P = !0));
                          break t;
                        }
                        (g === o(p) && c(p), W(I));
                      } else c(p);
                      g = o(p);
                    }
                    if (g !== null) P = !0;
                    else {
                      var xe = o(v);
                      (xe !== null && ie(te, xe.startTime - I), (P = !1));
                    }
                  }
                  break e;
                } finally {
                  ((g = null), (A = J), (R = !1));
                }
                P = void 0;
              }
            } finally {
              P ? G() : (ee = !1);
            }
          }
        }
        var G;
        if (typeof q == 'function')
          G = function () {
            q(Ee);
          };
        else if (typeof MessageChannel < 'u') {
          var ae = new MessageChannel(),
            ue = ae.port2;
          ((ae.port1.onmessage = Ee),
            (G = function () {
              ue.postMessage(null);
            }));
        } else
          G = function () {
            k(Ee, 0);
          };
        function ie(I, P) {
          Z = k(function () {
            I(a.unstable_now());
          }, P);
        }
        ((a.unstable_IdlePriority = 5),
          (a.unstable_ImmediatePriority = 1),
          (a.unstable_LowPriority = 4),
          (a.unstable_NormalPriority = 3),
          (a.unstable_Profiling = null),
          (a.unstable_UserBlockingPriority = 2),
          (a.unstable_cancelCallback = function (I) {
            I.callback = null;
          }),
          (a.unstable_forceFrameRate = function (I) {
            0 > I || 125 < I
              ? console.error(
                  'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
                )
              : (K = 0 < I ? Math.floor(1e3 / I) : 5);
          }),
          (a.unstable_getCurrentPriorityLevel = function () {
            return A;
          }),
          (a.unstable_next = function (I) {
            switch (A) {
              case 1:
              case 2:
              case 3:
                var P = 3;
                break;
              default:
                P = A;
            }
            var J = A;
            A = P;
            try {
              return I();
            } finally {
              A = J;
            }
          }),
          (a.unstable_requestPaint = function () {
            _ = !0;
          }),
          (a.unstable_runWithPriority = function (I, P) {
            switch (I) {
              case 1:
              case 2:
              case 3:
              case 4:
              case 5:
                break;
              default:
                I = 3;
            }
            var J = A;
            A = I;
            try {
              return P();
            } finally {
              A = J;
            }
          }),
          (a.unstable_scheduleCallback = function (I, P, J) {
            var se = a.unstable_now();
            switch (
              (typeof J == 'object' && J !== null
                ? ((J = J.delay), (J = typeof J == 'number' && 0 < J ? se + J : se))
                : (J = se),
              I)
            ) {
              case 1:
                var le = -1;
                break;
              case 2:
                le = 250;
                break;
              case 5:
                le = 1073741823;
                break;
              case 4:
                le = 1e4;
                break;
              default:
                le = 5e3;
            }
            return (
              (le = J + le),
              (I = {
                id: E++,
                callback: P,
                priorityLevel: I,
                startTime: J,
                expirationTime: le,
                sortIndex: -1,
              }),
              J > se
                ? ((I.sortIndex = J),
                  r(v, I),
                  o(p) === null && I === o(v) && (S ? (B(Z), (Z = -1)) : (S = !0), ie(te, J - se)))
                : ((I.sortIndex = le), r(p, I), x || R || ((x = !0), ee || ((ee = !0), G()))),
              I
            );
          }),
          (a.unstable_shouldYield = he),
          (a.unstable_wrapCallback = function (I) {
            var P = A;
            return function () {
              var J = A;
              A = P;
              try {
                return I.apply(this, arguments);
              } finally {
                A = J;
              }
            };
          }));
      })(ed)),
    ed
  );
}
var Cm;
function yO() {
  return (Cm || ((Cm = 1), (Wf.exports = dO())), Wf.exports);
}
/**
 * @license React
 * react-dom-client.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var wm;
function pO() {
  if (wm) return Fu;
  wm = 1;
  var a = yO(),
    r = Md(),
    o = s0();
  function c(e) {
    var t = 'https://react.dev/errors/' + e;
    if (1 < arguments.length) {
      t += '?args[]=' + encodeURIComponent(arguments[1]);
      for (var n = 2; n < arguments.length; n++) t += '&args[]=' + encodeURIComponent(arguments[n]);
    }
    return (
      'Minified React error #' +
      e +
      '; visit ' +
      t +
      ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
    );
  }
  function f(e) {
    return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11));
  }
  function y(e) {
    for (var t = e, n = t; n && !n.alternate;)
      ((t = n), (t.flags & 4098) !== 0 && (e = t.return), (n = t.return));
    for (; t.return;) t = t.return;
    return t.tag === 3 ? e : null;
  }
  function d(e) {
    if (e.tag === 13) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function m(e) {
    if (e.tag === 31) {
      var t = e.memoizedState;
      if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null))
        return t.dehydrated;
    }
    return null;
  }
  function p(e) {
    if (y(e) !== e) throw Error(c(188));
  }
  function v(e) {
    var t = e.alternate;
    if (!t) {
      if (((t = y(e)), t === null)) throw Error(c(188));
      return t !== e ? null : e;
    }
    for (var n = e, l = t; ;) {
      var u = n.return;
      if (u === null) break;
      var i = u.alternate;
      if (i === null) {
        if (((l = u.return), l !== null)) {
          n = l;
          continue;
        }
        break;
      }
      if (u.child === i.child) {
        for (i = u.child; i;) {
          if (i === n) return (p(u), e);
          if (i === l) return (p(u), t);
          i = i.sibling;
        }
        throw Error(c(188));
      }
      if (n.return !== l.return) ((n = u), (l = i));
      else {
        for (var s = !1, h = u.child; h;) {
          if (h === n) {
            ((s = !0), (n = u), (l = i));
            break;
          }
          if (h === l) {
            ((s = !0), (l = u), (n = i));
            break;
          }
          h = h.sibling;
        }
        if (!s) {
          for (h = i.child; h;) {
            if (h === n) {
              ((s = !0), (n = i), (l = u));
              break;
            }
            if (h === l) {
              ((s = !0), (l = i), (n = u));
              break;
            }
            h = h.sibling;
          }
          if (!s) throw Error(c(189));
        }
      }
      if (n.alternate !== l) throw Error(c(190));
    }
    if (n.tag !== 3) throw Error(c(188));
    return n.stateNode.current === n ? e : t;
  }
  function E(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e;
    for (e = e.child; e !== null;) {
      if (((t = E(e)), t !== null)) return t;
      e = e.sibling;
    }
    return null;
  }
  function g(e, t, n, l, u, i) {
    for (; e !== null;) {
      if (
        ((e.tag === 5 || e.tag === 27 || e.tag === 6) && n(e, l, u, i)) ||
        ((e.tag !== 22 || e.memoizedState === null) &&
          (t || (e.tag !== 5 && e.tag !== 27)) &&
          g(e.child, t, n, l, u, i))
      )
        return !0;
      e = e.sibling;
    }
    return !1;
  }
  function A(e) {
    for (e = e.return; e !== null;) {
      if (e.tag === 3 || e.tag === 5 || e.tag === 27) return e;
      e = e.return;
    }
    return null;
  }
  function R(e) {
    var t = !1;
    for (
      e = e.return;
      e !== null && (e.tag === 4 && (t = !0), !(e.tag === 3 || e.tag === 5 || e.tag === 27));
    )
      e = e.return;
    return t;
  }
  function x(e) {
    var t = [null, null],
      n = A(e);
    return (n === null || S(t, e, n.child, { foundSelf: !1 }), t);
  }
  function S(e, t, n, l) {
    for (; n !== null;) {
      if (n === t) l.foundSelf = !0;
      else if (n.tag === 5 || n.tag === 27 || n.tag === 6) {
        if (l.foundSelf) return ((e[1] = n), !0);
        e[0] = n;
      } else if ((n.tag !== 22 || n.memoizedState === null) && S(e, t, n.child, l)) return !0;
      n = n.sibling;
    }
    return !1;
  }
  function _(e) {
    switch (e.tag) {
      case 5:
      case 27:
      case 6:
        return e.stateNode;
      case 3:
        return e.stateNode.containerInfo;
      default:
        throw Error(c(559));
    }
  }
  var k = null,
    B = null;
  function q(e, t, n) {
    return e === n ? !0 : e === t ? ((k = e), !0) : !1;
  }
  function W(e, t, n) {
    return e === n ? ((B = e), !1) : e === t ? (B !== null && (k = e), !0) : !1;
  }
  function te(e) {
    if (e === null) return null;
    do e = e === null ? null : e.return;
    while (e && e.tag !== 5 && e.tag !== 27 && e.tag !== 3);
    return e || null;
  }
  function ee(e, t, n) {
    for (var l = 0, u = e; u; u = n(u)) l++;
    u = 0;
    for (var i = t; i; i = n(i)) u++;
    for (; 0 < l - u;) ((e = n(e)), l--);
    for (; 0 < u - l;) ((t = n(t)), u--);
    for (; l--;) {
      if (e === t || (t !== null && e === t.alternate)) return e;
      ((e = n(e)), (t = n(t)));
    }
    return null;
  }
  var Z = Object.assign,
    K = Symbol.for('react.element'),
    ce = Symbol.for('react.transitional.element'),
    he = Symbol.for('react.portal'),
    Ee = Symbol.for('react.fragment'),
    G = Symbol.for('react.strict_mode'),
    ae = Symbol.for('react.profiler'),
    ue = Symbol.for('react.consumer'),
    ie = Symbol.for('react.context'),
    I = Symbol.for('react.forward_ref'),
    P = Symbol.for('react.suspense'),
    J = Symbol.for('react.suspense_list'),
    se = Symbol.for('react.memo'),
    le = Symbol.for('react.lazy'),
    xe = Symbol.for('react.activity'),
    je = Symbol.for('react.legacy_hidden'),
    be = Symbol.for('react.memo_cache_sentinel'),
    C = Symbol.for('react.view_transition'),
    $ = Symbol.for('react.recoverable'),
    re = Symbol.iterator;
  function oe(e) {
    return e === null || typeof e != 'object'
      ? null
      : ((e = (re && e[re]) || e['@@iterator']), typeof e == 'function' ? e : null);
  }
  var Te = Symbol.for('react.client.reference');
  function Re(e) {
    if (e == null) return null;
    if (typeof e == 'function') return e.$$typeof === Te ? null : e.displayName || e.name || null;
    if (typeof e == 'string') return e;
    switch (e) {
      case Ee:
        return 'Fragment';
      case ae:
        return 'Profiler';
      case G:
        return 'StrictMode';
      case P:
        return 'Suspense';
      case J:
        return 'SuspenseList';
      case xe:
        return 'Activity';
      case C:
        return 'ViewTransition';
    }
    if (typeof e == 'object')
      switch (e.$$typeof) {
        case he:
          return 'Portal';
        case ie:
          return e.displayName || 'Context';
        case ue:
          return (e._context.displayName || 'Context') + '.Consumer';
        case I:
          var t = e.render;
          return (
            (e = e.displayName),
            e ||
              ((e = t.displayName || t.name || ''),
              (e = e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')),
            e
          );
        case se:
          return ((t = e.displayName || null), t !== null ? t : Re(e.type) || 'Memo');
        case le:
          ((t = e._payload), (e = e._init));
          try {
            return Re(e(t));
          } catch {}
      }
    return null;
  }
  var Le = Array.isArray,
    de = r.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    Se = o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
    Xt = { pending: !1, data: null, method: null, action: null },
    me = [],
    Qt = -1;
  function Nt(e) {
    return { current: e };
  }
  function lt(e) {
    0 > Qt || ((e.current = me[Qt]), (me[Qt] = null), Qt--);
  }
  function Ke(e, t) {
    (Qt++, (me[Qt] = e.current), (e.current = t));
  }
  var rn = Nt(null),
    Mn = Nt(null),
    un = Nt(null),
    Jn = Nt(null);
  function $t(e, t) {
    switch ((Ke(un, t), Ke(Mn, e), Ke(rn, null), t.nodeType)) {
      case 9:
      case 11:
        e = (e = t.documentElement) && (e = e.namespaceURI) ? Wg(e) : 0;
        break;
      default:
        if (((e = t.tagName), (t = t.namespaceURI))) ((t = Wg(t)), (e = eh(t, e)));
        else
          switch (e) {
            case 'svg':
              e = 1;
              break;
            case 'math':
              e = 2;
              break;
            default:
              e = 0;
          }
    }
    (lt(rn), Ke(rn, e));
  }
  function Pn() {
    (lt(rn), lt(Mn), lt(un));
  }
  function La(e) {
    var t = e.memoizedState;
    (t !== null && ((xr._currentValue = t.memoizedState), Ke(Jn, e)), (t = rn.current));
    var n = eh(t, e.type);
    t !== n && (Ke(Mn, e), Ke(rn, n));
  }
  function za(e) {
    (Mn.current === e && (lt(rn), lt(Mn)), Jn.current === e && (lt(Jn), (xr._currentValue = Xt)));
  }
  var Vr, Pl;
  function Sn(e) {
    if (Vr === void 0)
      try {
        throw Error();
      } catch (n) {
        var t = n.stack.trim().match(/\n( *(at )?)/);
        ((Vr = (t && t[1]) || ''),
          (Pl =
            -1 <
            n.stack.indexOf(`
    at`)
              ? ' (<anonymous>)'
              : -1 < n.stack.indexOf('@')
                ? '@unknown:0:0'
                : ''));
      }
    return (
      `
` +
      Vr +
      e +
      Pl
    );
  }
  var Ua = !1;
  function Ba(e, t) {
    if (!e || Ua) return '';
    Ua = !0;
    var n = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      var l = {
        DetermineComponentFrameRoot: function () {
          try {
            if (t) {
              var V = function () {
                throw Error();
              };
              if (
                (Object.defineProperty(V.prototype, 'props', {
                  set: function () {
                    throw Error();
                  },
                }),
                typeof Reflect == 'object' && Reflect.construct)
              ) {
                try {
                  Reflect.construct(V, []);
                } catch (ne) {
                  var D = ne;
                }
                Reflect.construct(e, [], V);
              } else {
                try {
                  V.call();
                } catch (ne) {
                  D = ne;
                }
                V = !1;
                try {
                  var U = Object.getOwnPropertyDescriptor(e.prototype, 'props');
                  (Object.defineProperty(e.prototype, 'props', {
                    configurable: !0,
                    set: function () {
                      throw Error();
                    },
                  }),
                    (V = !0),
                    new e());
                } finally {
                  V &&
                    (U !== void 0
                      ? Object.defineProperty(e.prototype, 'props', U)
                      : delete e.prototype.props);
                }
              }
            } else {
              try {
                throw Error();
              } catch (ne) {
                D = ne;
              }
              (V = e()) && typeof V.catch == 'function' && V.catch(function () {});
            }
          } catch (ne) {
            if (ne && D && typeof ne.stack == 'string') return [ne.stack, D.stack];
          }
          return [null, null];
        },
      };
      l.DetermineComponentFrameRoot.displayName = 'DetermineComponentFrameRoot';
      var u = Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot, 'name');
      u &&
        u.configurable &&
        Object.defineProperty(l.DetermineComponentFrameRoot, 'name', {
          value: 'DetermineComponentFrameRoot',
        });
      var i = l.DetermineComponentFrameRoot(),
        s = i[0],
        h = i[1];
      if (s && h) {
        var O = s.split(`
`),
          M = h.split(`
`);
        for (u = l = 0; l < O.length && !O[l].includes('DetermineComponentFrameRoot');) l++;
        for (; u < M.length && !M[u].includes('DetermineComponentFrameRoot');) u++;
        if (l === O.length || u === M.length)
          for (l = O.length - 1, u = M.length - 1; 1 <= l && 0 <= u && O[l] !== M[u];) u--;
        for (; 1 <= l && 0 <= u; l--, u--)
          if (O[l] !== M[u]) {
            if (l !== 1 || u !== 1)
              do
                if ((l--, u--, 0 > u || O[l] !== M[u])) {
                  var H =
                    `
` + O[l].replace(' at new ', ' at ');
                  return (
                    e.displayName &&
                      H.includes('<anonymous>') &&
                      (H = H.replace('<anonymous>', e.displayName)),
                    H
                  );
                }
              while (1 <= l && 0 <= u);
            break;
          }
      }
    } finally {
      ((Ua = !1), (Error.prepareStackTrace = n));
    }
    return (n = e ? e.displayName || e.name : '') ? Sn(n) : '';
  }
  function Ku(e, t) {
    switch (e.tag) {
      case 26:
      case 27:
      case 5:
        return Sn(e.type);
      case 16:
        return Sn('Lazy');
      case 13:
        return e.child !== t && t !== null ? Sn('Suspense Fallback') : Sn('Suspense');
      case 19:
        return Sn('SuspenseList');
      case 0:
      case 15:
        return Ba(e.type, !1);
      case 11:
        return Ba(e.type.render, !1);
      case 1:
        return Ba(e.type, !0);
      case 31:
        return Sn('Activity');
      case 30:
        return Sn('ViewTransition');
      default:
        return '';
    }
  }
  function Ju(e) {
    try {
      var t = '',
        n = null;
      do ((t += Ku(e, n)), (n = e), (e = e.return));
      while (e);
      return t;
    } catch (l) {
      return (
        `
Error generating stack: ` +
        l.message +
        `
` +
        l.stack
      );
    }
  }
  var Ir = Object.prototype.hasOwnProperty,
    _n = a.unstable_scheduleCallback,
    gl = a.unstable_cancelCallback,
    uc = a.unstable_shouldYield,
    Pu = a.unstable_requestPaint,
    Dt = a.unstable_now,
    Wu = a.unstable_getCurrentPriorityLevel,
    hl = a.unstable_ImmediatePriority,
    ei = a.unstable_UserBlockingPriority,
    on = a.unstable_NormalPriority,
    ic = a.unstable_LowPriority,
    ti = a.unstable_IdlePriority,
    oc = a.log,
    cc = a.unstable_setDisableYieldValue,
    Wl = null,
    at = null;
  function Ln(e) {
    if ((typeof oc == 'function' && cc(e), at && typeof at.setStrictMode == 'function'))
      try {
        at.setStrictMode(Wl, e);
      } catch {}
  }
  var jt = Math.clz32 ? Math.clz32 : dc,
    sc = Math.log,
    fc = Math.LN2;
  function dc(e) {
    return ((e >>>= 0), e === 0 ? 32 : (31 - ((sc(e) / fc) | 0)) | 0);
  }
  var Tn = 256,
    ka = 262144,
    Ha = 4194304;
  function Wn(e) {
    var t = e & 42;
    if (t !== 0) return t;
    switch (e & -e) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
        return 64;
      case 128:
        return 128;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
        return e & -e;
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return e & 3932160;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return e & 62914560;
      case 67108864:
        return 67108864;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 0;
      default:
        return e;
    }
  }
  function Fa(e, t, n) {
    var l = e.pendingLanes;
    if (l === 0) return 0;
    var u = 0,
      i = e.suspendedLanes,
      s = e.pingedLanes;
    e = e.warmLanes;
    var h = l & 134217727;
    return (
      h !== 0
        ? ((l = h & ~i),
          l !== 0
            ? (u = Wn(l))
            : ((s &= h), s !== 0 ? (u = Wn(s)) : n || ((n = h & ~e), n !== 0 && (u = Wn(n)))))
        : ((h = l & ~i),
          h !== 0
            ? (u = Wn(h))
            : s !== 0
              ? (u = Wn(s))
              : n || ((n = l & ~e), n !== 0 && (u = Wn(n)))),
      u === 0
        ? 0
        : t !== 0 &&
            t !== u &&
            (t & i) === 0 &&
            ((i = u & -u), (n = t & -t), i >= n || (i === 32 && (n & 4194048) !== 0))
          ? t
          : u
    );
  }
  function ea(e, t) {
    return (e.pendingLanes & ~(e.suspendedLanes & ~e.pingedLanes) & t) === 0;
  }
  function el(e, t) {
    (t & 8) !== 0 && (t |= t & 32);
    var n = e.entangledLanes;
    if (n !== 0)
      for (e = e.entanglements, n &= t; 0 < n;) {
        var l = 31 - jt(n),
          u = 1 << l;
        ((t |= e[l]), (n &= ~u));
      }
    return t;
  }
  function yc(e, t) {
    switch (e) {
      case 1:
      case 2:
      case 4:
      case 8:
      case 64:
        return t + 250;
      case 16:
      case 32:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return t + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        return -1;
      case 67108864:
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function ni() {
    var e = Ha;
    return ((Ha <<= 1), (Ha & 62914560) === 0 && (Ha = 4194304), e);
  }
  function Zr(e) {
    for (var t = [], n = 0; 31 > n; n++) t.push(e);
    return t;
  }
  function ta(e, t) {
    ((e.pendingLanes |= t),
      t !== 268435456 && ((e.suspendedLanes = 0), (e.pingedLanes = 0), (e.warmLanes = 0)));
  }
  function pc(e, t, n, l, u, i) {
    var s = e.pendingLanes;
    ((e.pendingLanes = n),
      (e.suspendedLanes = 0),
      (e.pingedLanes = 0),
      (e.warmLanes = 0),
      (e.expiredLanes &= n),
      (e.entangledLanes &= n),
      (e.errorRecoveryDisabledLanes &= n),
      (e.shellSuspendCounter = 0));
    var h = e.entanglements,
      O = e.expirationTimes,
      M = e.hiddenUpdates;
    for (n = s & ~n; 0 < n;) {
      var H = 31 - jt(n),
        V = 1 << H;
      ((h[H] = 0), (O[H] = -1));
      var D = M[H];
      if (D !== null)
        for (M[H] = null, H = 0; H < D.length; H++) {
          var U = D[H];
          U !== null && (U.lane &= -536870913);
        }
      n &= ~V;
    }
    (l !== 0 && li(e, l, 0),
      i !== 0 && u === 0 && e.tag !== 0 && (e.suspendedLanes |= i & ~(s & ~t)));
  }
  function li(e, t, n) {
    ((e.pendingLanes |= t), (e.suspendedLanes &= ~t));
    var l = 31 - jt(t);
    ((e.entangledLanes |= t),
      (e.entanglements[l] = e.entanglements[l] | 1073741824 | (n & 261930)));
  }
  function Ga(e, t) {
    var n = (e.entangledLanes |= t);
    for (e = e.entanglements; n;) {
      var l = 31 - jt(n),
        u = 1 << l;
      ((u & t) | (e[l] & t) && (e[l] |= t), (n &= ~u));
    }
  }
  function ai(e, t) {
    var n = t & -t;
    return ((n = (n & 42) !== 0 ? 1 : ml(n)), (n & (e.suspendedLanes | t)) !== 0 ? 0 : n);
  }
  function ml(e) {
    switch (e) {
      case 2:
        e = 1;
        break;
      case 8:
        e = 4;
        break;
      case 32:
        e = 16;
        break;
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
        e = 128;
        break;
      case 268435456:
        e = 134217728;
        break;
      default:
        e = 0;
    }
    return e;
  }
  function na(e) {
    return ((e &= -e), 2 < e ? (8 < e ? ((e & 134217727) !== 0 ? 32 : 268435456) : 8) : 2);
  }
  function ri() {
    var e = Se.p;
    return e !== 0 ? e : ((e = window.event), e === void 0 ? 32 : Bh(e.type));
  }
  function la(e, t) {
    var n = Se.p;
    try {
      return ((Se.p = e), t());
    } finally {
      Se.p = n;
    }
  }
  var cn = Math.random().toString(36).slice(2),
    ht = '__reactFiber$' + cn,
    wt = '__reactProps$' + cn,
    vl = '__reactContainer$' + cn,
    Xr = '__reactEvents$' + cn,
    gc = '__reactListeners$' + cn,
    hc = '__reactHandles$' + cn,
    ui = '__reactResources$' + cn,
    aa = '__reactMarker$' + cn,
    qa = '__reactLoad$' + cn;
  function Ya(e) {
    (delete e[ht], delete e[wt], delete e[gc], delete e[hc]);
  }
  function tl(e) {
    var t;
    if ((t = e[ht])) return t;
    for (var n = e.parentNode; n;) {
      if ((t = n[vl] || n[ht])) {
        if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
          for (e = mh(e); e !== null;) {
            if ((n = e[ht])) return n;
            e = mh(e);
          }
        return t;
      }
      ((e = n), (n = e.parentNode));
    }
    return null;
  }
  function bl(e) {
    if ((e = e[ht] || e[vl])) {
      var t = e.tag;
      if (t === 5 || t === 6 || t === 13 || t === 31 || t === 26 || t === 27 || t === 3) return e;
    }
    return null;
  }
  function ra(e) {
    var t = e.tag;
    if (t === 5 || t === 26 || t === 27 || t === 6) return e.stateNode;
    throw Error(c(33));
  }
  function El(e) {
    var t = e[ui];
    return (t || (t = e[ui] = { hoistableStyles: new Map(), hoistableScripts: new Map() }), t);
  }
  function rt(e) {
    e[aa] = !0;
  }
  function Va(e) {
    e[qa] = void 0;
  }
  var ii = new Set(),
    oi = {};
  function zn(e, t) {
    (Sl(e, t), Sl(e + 'Capture', t));
  }
  function Sl(e, t) {
    for (oi[e] = t, e = 0; e < t.length; e++) ii.add(t[e]);
  }
  var mc = RegExp(
      '^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$',
    ),
    ci = {},
    Qr = {};
  function vc(e) {
    return Ir.call(Qr, e)
      ? !0
      : Ir.call(ci, e)
        ? !1
        : mc.test(e)
          ? (Qr[e] = !0)
          : ((ci[e] = !0), !1);
  }
  var He = !1;
  function si() {
    var e = He;
    return ((He = !1), e);
  }
  function _l(e, t, n) {
    if (vc(t))
      if (n === null) e.removeAttribute(t);
      else {
        switch (typeof n) {
          case 'undefined':
          case 'function':
          case 'symbol':
            e.removeAttribute(t);
            return;
          case 'boolean':
            var l = t.toLowerCase().slice(0, 5);
            if (l !== 'data-' && l !== 'aria-') {
              e.removeAttribute(t);
              return;
            }
        }
        e.setAttribute(t, n);
      }
  }
  function Ia(e, t, n) {
    if (n === null) e.removeAttribute(t);
    else {
      switch (typeof n) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          e.removeAttribute(t);
          return;
      }
      e.setAttribute(t, n);
    }
  }
  function On(e, t, n, l) {
    if (l === null) e.removeAttribute(n);
    else {
      switch (typeof l) {
        case 'undefined':
        case 'function':
        case 'symbol':
        case 'boolean':
          e.removeAttribute(n);
          return;
      }
      e.setAttributeNS(t, n, l);
    }
  }
  function Mt(e) {
    switch (typeof e) {
      case 'bigint':
      case 'boolean':
      case 'number':
      case 'string':
      case 'undefined':
        return e;
      case 'object':
        return e;
      default:
        return '';
    }
  }
  function ua(e) {
    var t = e.type;
    return (e = e.nodeName) && e.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio');
  }
  function $r(e, t, n) {
    var l = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
    if (
      !e.hasOwnProperty(t) &&
      typeof l < 'u' &&
      typeof l.get == 'function' &&
      typeof l.set == 'function'
    ) {
      var u = l.get,
        i = l.set;
      return (
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function () {
            return u.call(this);
          },
          set: function (s) {
            ((n = '' + s), i.call(this, s));
          },
        }),
        Object.defineProperty(e, t, { enumerable: l.enumerable }),
        {
          getValue: function () {
            return n;
          },
          setValue: function (s) {
            n = '' + s;
          },
          stopTracking: function () {
            ((e._valueTracker = null), delete e[t]);
          },
        }
      );
    }
  }
  function ia(e) {
    if (!e._valueTracker) {
      var t = ua(e) ? 'checked' : 'value';
      e._valueTracker = $r(e, t, '' + e[t]);
    }
  }
  function Za(e) {
    if (!e) return !1;
    var t = e._valueTracker;
    if (!t) return !0;
    var n = t.getValue(),
      l = '';
    return (
      e && (l = ua(e) ? (e.checked ? 'true' : 'false') : e.value),
      (e = l),
      e !== n ? (t.setValue(e), !0) : !1
    );
  }
  var bc = /[\n"\\]/g;
  function Lt(e) {
    return e.replace(bc, function (t) {
      return '\\' + t.charCodeAt(0).toString(16) + ' ';
    });
  }
  function oa(e, t, n, l, u, i, s, h) {
    ((e.name = ''),
      s != null && typeof s != 'function' && typeof s != 'symbol' && typeof s != 'boolean'
        ? (e.type = s)
        : e.removeAttribute('type'),
      t != null
        ? s === 'number'
          ? ((t === 0 && e.value === '') || e.value != t) && (e.value = '' + Mt(t))
          : e.value !== '' + Mt(t) && (e.value = '' + Mt(t))
        : (s !== 'submit' && s !== 'reset') || e.removeAttribute('value'),
      t != null
        ? s === 'number' && e.value == t
          ? An(e, Mt(e.value))
          : An(e, Mt(t))
        : n != null
          ? An(e, Mt(n))
          : l != null && e.removeAttribute('value'),
      u == null && i != null && (e.defaultChecked = !!i),
      u != null && (e.checked = u && typeof u != 'function' && typeof u != 'symbol'),
      h != null && typeof h != 'function' && typeof h != 'symbol' && typeof h != 'boolean'
        ? (e.name = '' + Mt(h))
        : e.removeAttribute('name'));
  }
  function Kr(e, t, n, l, u, i, s, h) {
    if (
      (i != null &&
        typeof i != 'function' &&
        typeof i != 'symbol' &&
        typeof i != 'boolean' &&
        (e.type = i),
      t != null || n != null)
    ) {
      if (!((i !== 'submit' && i !== 'reset') || t != null)) {
        ia(e);
        return;
      }
      ((n = n != null ? '' + Mt(n) : ''),
        (t = t != null ? '' + Mt(t) : n),
        h || t === e.value || (e.value = t),
        (e.defaultValue = t));
    }
    ((l = l ?? u),
      (l = typeof l != 'function' && typeof l != 'symbol' && !!l),
      (e.checked = h ? e.checked : !!l),
      (e.defaultChecked = !!l),
      s != null &&
        typeof s != 'function' &&
        typeof s != 'symbol' &&
        typeof s != 'boolean' &&
        (e.name = s),
      ia(e));
  }
  function An(e, t) {
    e.defaultValue !== '' + t && (e.defaultValue = '' + t);
  }
  function sn(e, t, n, l) {
    if (((e = e.options), t)) {
      t = {};
      for (var u = 0; u < n.length; u++) t['$' + n[u]] = !0;
      for (n = 0; n < e.length; n++)
        ((u = t.hasOwnProperty('$' + e[n].value)),
          e[n].selected !== u && (e[n].selected = u),
          u && l && (e[n].defaultSelected = !0));
    } else {
      for (n = '' + Mt(n), t = null, u = 0; u < e.length; u++) {
        if (e[u].value === n) {
          ((e[u].selected = !0), l && (e[u].defaultSelected = !0));
          return;
        }
        t !== null || e[u].disabled || (t = e[u]);
      }
      t !== null && (t.selected = !0);
    }
  }
  function fi(e, t, n) {
    if (t != null && ((t = '' + Mt(t)), t !== e.value && (e.value = t), n == null)) {
      e.defaultValue !== t && (e.defaultValue = t);
      return;
    }
    e.defaultValue = n != null ? '' + Mt(n) : '';
  }
  function Jr(e, t, n, l) {
    if (t == null) {
      if (l != null) {
        if (n != null) throw Error(c(92));
        if (Le(l)) {
          if (1 < l.length) throw Error(c(93));
          l = l[0];
        }
        n = l;
      }
      (n == null && (n = ''), (t = n));
    }
    ((n = Mt(t)),
      (e.defaultValue = n),
      (l = e.textContent),
      l === n && l !== '' && l !== null && (e.value = l),
      ia(e));
  }
  function Tl(e, t) {
    if (t) {
      var n = e.firstChild;
      if (n && n === e.lastChild && n.nodeType === 3) {
        n.nodeValue = t;
        return;
      }
    }
    e.textContent = t;
  }
  var di = new Set(
    'animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp'.split(
      ' ',
    ),
  );
  function yi(e, t, n) {
    var l = t.indexOf('--') === 0;
    n == null || typeof n == 'boolean' || n === ''
      ? l
        ? e.setProperty(t, '')
        : t === 'float'
          ? (e.cssFloat = '')
          : (e[t] = '')
      : l
        ? e.setProperty(t, n)
        : typeof n != 'number' || n === 0 || di.has(t)
          ? t === 'float'
            ? (e.cssFloat = n)
            : (e[t] = ('' + n).trim())
          : (e[t] = n + 'px');
  }
  function pi(e, t, n) {
    if (t != null && typeof t != 'object') throw Error(c(62));
    if (((e = e.style), n != null)) {
      for (var l in n)
        !n.hasOwnProperty(l) ||
          (t != null && t.hasOwnProperty(l)) ||
          (l.indexOf('--') === 0
            ? e.setProperty(l, '')
            : l === 'float'
              ? (e.cssFloat = '')
              : (e[l] = ''),
          (He = !0));
      for (var u in t) ((l = t[u]), t.hasOwnProperty(u) && n[u] !== l && (yi(e, u, l), (He = !0)));
    } else for (var i in t) t.hasOwnProperty(i) && yi(e, i, t[i]);
  }
  function Xa(e) {
    if (e.indexOf('-') === -1) return !1;
    switch (e) {
      case 'annotation-xml':
      case 'color-profile':
      case 'font-face':
      case 'font-face-src':
      case 'font-face-uri':
      case 'font-face-format':
      case 'font-face-name':
      case 'missing-glyph':
        return !1;
      default:
        return !0;
    }
  }
  var Ec = new Map([
      ['acceptCharset', 'accept-charset'],
      ['htmlFor', 'for'],
      ['httpEquiv', 'http-equiv'],
      ['crossOrigin', 'crossorigin'],
      ['accentHeight', 'accent-height'],
      ['alignmentBaseline', 'alignment-baseline'],
      ['arabicForm', 'arabic-form'],
      ['baselineShift', 'baseline-shift'],
      ['capHeight', 'cap-height'],
      ['clipPath', 'clip-path'],
      ['clipRule', 'clip-rule'],
      ['colorInterpolation', 'color-interpolation'],
      ['colorInterpolationFilters', 'color-interpolation-filters'],
      ['colorProfile', 'color-profile'],
      ['colorRendering', 'color-rendering'],
      ['dominantBaseline', 'dominant-baseline'],
      ['enableBackground', 'enable-background'],
      ['fillOpacity', 'fill-opacity'],
      ['fillRule', 'fill-rule'],
      ['floodColor', 'flood-color'],
      ['floodOpacity', 'flood-opacity'],
      ['fontFamily', 'font-family'],
      ['fontSize', 'font-size'],
      ['fontSizeAdjust', 'font-size-adjust'],
      ['fontStretch', 'font-stretch'],
      ['fontStyle', 'font-style'],
      ['fontVariant', 'font-variant'],
      ['fontWeight', 'font-weight'],
      ['glyphName', 'glyph-name'],
      ['glyphOrientationHorizontal', 'glyph-orientation-horizontal'],
      ['glyphOrientationVertical', 'glyph-orientation-vertical'],
      ['horizAdvX', 'horiz-adv-x'],
      ['horizOriginX', 'horiz-origin-x'],
      ['imageRendering', 'image-rendering'],
      ['letterSpacing', 'letter-spacing'],
      ['lightingColor', 'lighting-color'],
      ['markerEnd', 'marker-end'],
      ['markerMid', 'marker-mid'],
      ['markerStart', 'marker-start'],
      ['maskType', 'mask-type'],
      ['overlinePosition', 'overline-position'],
      ['overlineThickness', 'overline-thickness'],
      ['paintOrder', 'paint-order'],
      ['panose-1', 'panose-1'],
      ['pointerEvents', 'pointer-events'],
      ['renderingIntent', 'rendering-intent'],
      ['shapeRendering', 'shape-rendering'],
      ['stopColor', 'stop-color'],
      ['stopOpacity', 'stop-opacity'],
      ['strikethroughPosition', 'strikethrough-position'],
      ['strikethroughThickness', 'strikethrough-thickness'],
      ['strokeDasharray', 'stroke-dasharray'],
      ['strokeDashoffset', 'stroke-dashoffset'],
      ['strokeLinecap', 'stroke-linecap'],
      ['strokeLinejoin', 'stroke-linejoin'],
      ['strokeMiterlimit', 'stroke-miterlimit'],
      ['strokeOpacity', 'stroke-opacity'],
      ['strokeWidth', 'stroke-width'],
      ['textAnchor', 'text-anchor'],
      ['textDecoration', 'text-decoration'],
      ['textRendering', 'text-rendering'],
      ['transformOrigin', 'transform-origin'],
      ['underlinePosition', 'underline-position'],
      ['underlineThickness', 'underline-thickness'],
      ['unicodeBidi', 'unicode-bidi'],
      ['unicodeRange', 'unicode-range'],
      ['unitsPerEm', 'units-per-em'],
      ['vAlphabetic', 'v-alphabetic'],
      ['vHanging', 'v-hanging'],
      ['vIdeographic', 'v-ideographic'],
      ['vMathematical', 'v-mathematical'],
      ['vectorEffect', 'vector-effect'],
      ['vertAdvY', 'vert-adv-y'],
      ['vertOriginX', 'vert-origin-x'],
      ['vertOriginY', 'vert-origin-y'],
      ['wordSpacing', 'word-spacing'],
      ['writingMode', 'writing-mode'],
      ['xmlnsXlink', 'xmlns:xlink'],
      ['xHeight', 'x-height'],
    ]),
    T =
      /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
  function N(e) {
    return T.test('' + e)
      ? "javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')"
      : e;
  }
  function F() {}
  var ye = null;
  function Me(e) {
    return (
      (e = e.target || e.srcElement || window),
      e.correspondingUseElement && (e = e.correspondingUseElement),
      e.nodeType === 3 ? e.parentNode : e
    );
  }
  var Fe = null,
    Ve = null;
  function Ge(e) {
    var t = bl(e);
    if (t && (e = t.stateNode)) {
      var n = e[wt] || null;
      e: switch (((e = t.stateNode), t.type)) {
        case 'input':
          if (
            (oa(
              e,
              n.value,
              n.defaultValue,
              n.defaultValue,
              n.checked,
              n.defaultChecked,
              n.type,
              n.name,
            ),
            (t = n.name),
            n.type === 'radio' && t != null)
          ) {
            for (n = e; n.parentNode;) n = n.parentNode;
            for (
              n = n.querySelectorAll('input[name="' + Lt('' + t) + '"][type="radio"]'), t = 0;
              t < n.length;
              t++
            ) {
              var l = n[t];
              if (l !== e && l.form === e.form) {
                var u = l[wt] || null;
                if (!u) throw Error(c(90));
                oa(
                  l,
                  u.value,
                  u.defaultValue,
                  u.defaultValue,
                  u.checked,
                  u.defaultChecked,
                  u.type,
                  u.name,
                );
              }
            }
            for (t = 0; t < n.length; t++) ((l = n[t]), l.form === e.form && Za(l));
          }
          break e;
        case 'textarea':
          fi(e, n.value, n.defaultValue);
          break e;
        case 'select':
          ((t = n.value), t != null && sn(e, !!n.multiple, t, !1));
      }
    }
  }
  var Je = !1;
  function Gt(e, t, n) {
    if (Je) return e(t, n);
    Je = !0;
    try {
      var l = e(t);
      return l;
    } finally {
      if (
        ((Je = !1),
        (Fe !== null || Ve !== null) &&
          (go(), Fe && ((t = Fe), (e = Ve), (Ve = Fe = null), Ge(t), e)))
      )
        for (t = 0; t < e.length; t++) Ge(e[t]);
    }
  }
  function mt(e, t) {
    var n = e.stateNode;
    if (n === null) return null;
    var l = n[wt] || null;
    if (l === null) return null;
    n = l[t];
    e: switch (t) {
      case 'onClick':
      case 'onClickCapture':
      case 'onDoubleClick':
      case 'onDoubleClickCapture':
      case 'onMouseDown':
      case 'onMouseDownCapture':
      case 'onMouseMove':
      case 'onMouseMoveCapture':
      case 'onMouseUp':
      case 'onMouseUpCapture':
      case 'onMouseEnter':
        ((l = !l.disabled) ||
          ((e = e.type),
          (l = !(e === 'button' || e === 'input' || e === 'select' || e === 'textarea'))),
          (e = !l));
        break e;
      default:
        e = !1;
    }
    if (e) return null;
    if (n && typeof n != 'function') throw Error(c(231, t, typeof n));
    return n;
  }
  var zt = !(
      typeof window > 'u' ||
      typeof window.document > 'u' ||
      typeof window.document.createElement > 'u'
    ),
    ca = !1;
  if (zt)
    try {
      var nl = {};
      (Object.defineProperty(nl, 'passive', {
        get: function () {
          ca = !0;
        },
      }),
        window.addEventListener('test', nl, nl),
        window.removeEventListener('test', nl, nl));
    } catch {
      ca = !1;
    }
  var xn = null,
    Sc = null,
    gi = null;
  function $d() {
    if (gi) return gi;
    var e,
      t = Sc,
      n = t.length,
      l,
      u = 'value' in xn ? xn.value : xn.textContent,
      i = u.length;
    for (e = 0; e < n && t[e] === u[e]; e++);
    var s = n - e;
    for (l = 1; l <= s && t[n - l] === u[i - l]; l++);
    return (gi = u.slice(e, 1 < l ? 1 - l : void 0));
  }
  function hi(e) {
    var t = e.keyCode;
    return (
      'charCode' in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
      e === 10 && (e = 13),
      32 <= e || e === 13 ? e : 0
    );
  }
  function mi() {
    return !0;
  }
  function Kd() {
    return !1;
  }
  function Ut(e) {
    function t(n, l, u, i, s) {
      ((this._reactName = n),
        (this._targetInst = u),
        (this.type = l),
        (this.nativeEvent = i),
        (this.target = s),
        (this.currentTarget = null));
      for (var h in e) e.hasOwnProperty(h) && ((n = e[h]), (this[h] = n ? n(i) : i[h]));
      return (
        (this.isDefaultPrevented = (
          i.defaultPrevented != null ? i.defaultPrevented : i.returnValue === !1
        )
          ? mi
          : Kd),
        (this.isPropagationStopped = Kd),
        this
      );
    }
    return (
      Z(t.prototype, {
        preventDefault: function () {
          this.defaultPrevented = !0;
          var n = this.nativeEvent;
          n &&
            (n.preventDefault
              ? n.preventDefault()
              : typeof n.returnValue != 'unknown' && (n.returnValue = !1),
            (this.isDefaultPrevented = mi));
        },
        stopPropagation: function () {
          var n = this.nativeEvent;
          n &&
            (n.stopPropagation
              ? n.stopPropagation()
              : typeof n.cancelBubble != 'unknown' && (n.cancelBubble = !0),
            (this.isPropagationStopped = mi));
        },
        persist: function () {},
        isPersistent: mi,
      }),
      t
    );
  }
  var Ol = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function (e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0,
    },
    vi = Ut(Ol),
    Pr = Z({}, Ol, { view: 0, detail: 0 }),
    Nv = Ut(Pr),
    _c,
    Tc,
    Wr,
    bi = Z({}, Pr, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Ac,
      button: 0,
      buttons: 0,
      relatedTarget: function (e) {
        return e.relatedTarget === void 0
          ? e.fromElement === e.srcElement
            ? e.toElement
            : e.fromElement
          : e.relatedTarget;
      },
      movementX: function (e) {
        return 'movementX' in e
          ? e.movementX
          : (e !== Wr &&
              (Wr && e.type === 'mousemove'
                ? ((_c = e.screenX - Wr.screenX), (Tc = e.screenY - Wr.screenY))
                : (Tc = _c = 0),
              (Wr = e)),
            _c);
      },
      movementY: function (e) {
        return 'movementY' in e ? e.movementY : Tc;
      },
    }),
    Jd = Ut(bi),
    Dv = Z({}, bi, { dataTransfer: 0 }),
    jv = Ut(Dv),
    Mv = Z({}, Pr, { relatedTarget: 0 }),
    Oc = Ut(Mv),
    Lv = Z({}, Ol, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
    zv = Ut(Lv),
    Uv = Z({}, Ol, {
      clipboardData: function (e) {
        return 'clipboardData' in e ? e.clipboardData : window.clipboardData;
      },
    }),
    Bv = Ut(Uv),
    kv = Z({}, Ol, { data: 0 }),
    Pd = Ut(kv),
    Hv = {
      Esc: 'Escape',
      Spacebar: ' ',
      Left: 'ArrowLeft',
      Up: 'ArrowUp',
      Right: 'ArrowRight',
      Down: 'ArrowDown',
      Del: 'Delete',
      Win: 'OS',
      Menu: 'ContextMenu',
      Apps: 'ContextMenu',
      Scroll: 'ScrollLock',
      MozPrintableKey: 'Unidentified',
    },
    Fv = {
      8: 'Backspace',
      9: 'Tab',
      12: 'Clear',
      13: 'Enter',
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      19: 'Pause',
      20: 'CapsLock',
      27: 'Escape',
      32: ' ',
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
      37: 'ArrowLeft',
      38: 'ArrowUp',
      39: 'ArrowRight',
      40: 'ArrowDown',
      45: 'Insert',
      46: 'Delete',
      112: 'F1',
      113: 'F2',
      114: 'F3',
      115: 'F4',
      116: 'F5',
      117: 'F6',
      118: 'F7',
      119: 'F8',
      120: 'F9',
      121: 'F10',
      122: 'F11',
      123: 'F12',
      144: 'NumLock',
      145: 'ScrollLock',
      224: 'Meta',
    },
    Gv = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' };
  function qv(e) {
    var t = this.nativeEvent;
    return t.getModifierState ? t.getModifierState(e) : (e = Gv[e]) ? !!t[e] : !1;
  }
  function Ac() {
    return qv;
  }
  var Yv = Z({}, Pr, {
      key: function (e) {
        if (e.key) {
          var t = Hv[e.key] || e.key;
          if (t !== 'Unidentified') return t;
        }
        return e.type === 'keypress'
          ? ((e = hi(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
          : e.type === 'keydown' || e.type === 'keyup'
            ? Fv[e.keyCode] || 'Unidentified'
            : '';
      },
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Ac,
      charCode: function (e) {
        return e.type === 'keypress' ? hi(e) : 0;
      },
      keyCode: function (e) {
        return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0;
      },
      which: function (e) {
        return e.type === 'keypress'
          ? hi(e)
          : e.type === 'keydown' || e.type === 'keyup'
            ? e.keyCode
            : 0;
      },
    }),
    Vv = Ut(Yv),
    Iv = Z({}, bi, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0,
    }),
    Wd = Ut(Iv),
    Zv = Z({}, Ol, { submitter: 0 }),
    Xv = Ut(Zv),
    Qv = Z({}, Pr, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Ac,
    }),
    $v = Ut(Qv),
    Kv = Z({}, Ol, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
    Jv = Ut(Kv),
    Pv = Z({}, bi, {
      deltaX: function (e) {
        return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0;
      },
      deltaY: function (e) {
        return 'deltaY' in e
          ? e.deltaY
          : 'wheelDeltaY' in e
            ? -e.wheelDeltaY
            : 'wheelDelta' in e
              ? -e.wheelDelta
              : 0;
      },
      deltaZ: 0,
      deltaMode: 0,
    }),
    Wv = Ut(Pv),
    eb = Z({}, Ol, { newState: 0, oldState: 0, source: 0 }),
    tb = Ut(eb),
    nb = [9, 13, 27, 32],
    xc = zt && 'CompositionEvent' in window,
    eu = null;
  zt && 'documentMode' in document && (eu = document.documentMode);
  var lb = zt && 'TextEvent' in window && !eu,
    ey = zt && (!xc || (eu && 8 < eu && 11 >= eu)),
    ty = ' ',
    ny = !1;
  function ly(e, t) {
    switch (e) {
      case 'keyup':
        return nb.indexOf(t.keyCode) !== -1;
      case 'keydown':
        return t.keyCode !== 229;
      case 'keypress':
      case 'mousedown':
      case 'focusout':
        return !0;
      default:
        return !1;
    }
  }
  function ay(e) {
    return ((e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null);
  }
  var Qa = !1;
  function ab(e, t) {
    switch (e) {
      case 'compositionend':
        return ay(t);
      case 'keypress':
        return t.which !== 32 ? null : ((ny = !0), ty);
      case 'textInput':
        return ((e = t.data), e === ty && ny ? null : e);
      default:
        return null;
    }
  }
  function rb(e, t) {
    if (Qa)
      return e === 'compositionend' || (!xc && ly(e, t))
        ? ((e = $d()), (gi = Sc = xn = null), (Qa = !1), e)
        : null;
    switch (e) {
      case 'paste':
        return null;
      case 'keypress':
        if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
          if (t.char && 1 < t.char.length) return t.char;
          if (t.which) return String.fromCharCode(t.which);
        }
        return null;
      case 'compositionend':
        return ey && t.locale !== 'ko' ? null : t.data;
      default:
        return null;
    }
  }
  var ub = {
    color: !0,
    date: !0,
    datetime: !0,
    'datetime-local': !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0,
  };
  function ry(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return t === 'input' ? !!ub[e.type] : t === 'textarea';
  }
  function uy(e, t, n, l) {
    (Fe ? (Ve ? Ve.push(l) : (Ve = [l])) : (Fe = l),
      (t = So(t, 'onChange')),
      0 < t.length &&
        ((n = new vi('onChange', 'change', null, n, l)), e.push({ event: n, listeners: t })));
  }
  var tu = null,
    nu = null;
  function ib(e) {
    Xg(e, 0);
  }
  function Ei(e) {
    var t = ra(e);
    if (Za(t)) return e;
  }
  function iy(e, t) {
    if (e === 'change') return t;
  }
  var oy = !1;
  if (zt) {
    var Cc;
    if (zt) {
      var wc = 'oninput' in document;
      if (!wc) {
        var cy = document.createElement('div');
        (cy.setAttribute('oninput', 'return;'), (wc = typeof cy.oninput == 'function'));
      }
      Cc = wc;
    } else Cc = !1;
    oy = Cc && (!document.documentMode || 9 < document.documentMode);
  }
  function sy() {
    tu && (tu.detachEvent('onpropertychange', fy), (nu = tu = null));
  }
  function fy(e) {
    if (e.propertyName === 'value' && Ei(nu)) {
      var t = [];
      (uy(t, nu, e, Me(e)), Gt(ib, t));
    }
  }
  function ob(e, t, n) {
    e === 'focusin'
      ? (sy(), (tu = t), (nu = n), tu.attachEvent('onpropertychange', fy))
      : e === 'focusout' && sy();
  }
  function cb(e) {
    if (e === 'selectionchange' || e === 'keyup' || e === 'keydown') return Ei(nu);
  }
  function sb(e, t) {
    if (e === 'click') return Ei(t);
  }
  function fb(e, t) {
    if (e === 'input' || e === 'change') return Ei(t);
  }
  function db(e, t) {
    return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t);
  }
  var Kt = typeof Object.is == 'function' ? Object.is : db;
  function lu(e, t) {
    if (Kt(e, t)) return !0;
    if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1;
    var n = Object.keys(e),
      l = Object.keys(t);
    if (n.length !== l.length) return !1;
    for (l = 0; l < n.length; l++) {
      var u = n[l];
      if (!Ir.call(t, u) || !Kt(e[u], t[u])) return !1;
    }
    return !0;
  }
  function Rc(e) {
    if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u')) return null;
    try {
      return e.activeElement || e.body;
    } catch {
      return e.body;
    }
  }
  function dy(e) {
    for (; e && e.firstChild;) e = e.firstChild;
    return e;
  }
  function yy(e, t) {
    var n = dy(e);
    e = 0;
    for (var l; n;) {
      if (n.nodeType === 3) {
        if (((l = e + n.textContent.length), e <= t && l >= t)) return { node: n, offset: t - e };
        e = l;
      }
      e: {
        for (; n;) {
          if (n.nextSibling) {
            n = n.nextSibling;
            break e;
          }
          n = n.parentNode;
        }
        n = void 0;
      }
      n = dy(n);
    }
  }
  function py(e, t) {
    return e && t
      ? e === t
        ? !0
        : e && e.nodeType === 3
          ? !1
          : t && t.nodeType === 3
            ? py(e, t.parentNode)
            : 'contains' in e
              ? e.contains(t)
              : e.compareDocumentPosition
                ? !!(e.compareDocumentPosition(t) & 16)
                : !1
      : !1;
  }
  function gy(e) {
    e =
      e != null && e.ownerDocument != null && e.ownerDocument.defaultView != null
        ? e.ownerDocument.defaultView
        : window;
    for (var t = Rc(e.document); t instanceof e.HTMLIFrameElement;) {
      try {
        var n = typeof t.contentWindow.location.href == 'string';
      } catch {
        n = !1;
      }
      if (n) e = t.contentWindow;
      else break;
      t = Rc(e.document);
    }
    return t;
  }
  function Nc(e) {
    var t = e && e.nodeName && e.nodeName.toLowerCase();
    return (
      t &&
      ((t === 'input' &&
        (e.type === 'text' ||
          e.type === 'search' ||
          e.type === 'tel' ||
          e.type === 'url' ||
          e.type === 'password')) ||
        t === 'textarea' ||
        e.contentEditable === 'true')
    );
  }
  var yb = zt && 'documentMode' in document && 11 >= document.documentMode,
    $a = null,
    Dc = null,
    au = null,
    jc = !1;
  function hy(e, t, n) {
    var l = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument;
    jc ||
      $a == null ||
      $a !== Rc(l) ||
      ((l = $a),
      'selectionStart' in l && Nc(l)
        ? (l = { start: l.selectionStart, end: l.selectionEnd })
        : ((l = ((l.ownerDocument && l.ownerDocument.defaultView) || window).getSelection()),
          (l = {
            anchorNode: l.anchorNode,
            anchorOffset: l.anchorOffset,
            focusNode: l.focusNode,
            focusOffset: l.focusOffset,
          })),
      (au && lu(au, l)) ||
        ((au = l),
        (l = So(Dc, 'onSelect')),
        0 < l.length &&
          ((t = new vi('onSelect', 'select', null, t, n)),
          e.push({ event: t, listeners: l }),
          (t.target = $a))));
  }
  function sa(e, t) {
    var n = {};
    return (
      (n[e.toLowerCase()] = t.toLowerCase()),
      (n['Webkit' + e] = 'webkit' + t),
      (n['Moz' + e] = 'moz' + t),
      n
    );
  }
  var Ka = {
      animationend: sa('Animation', 'AnimationEnd'),
      animationiteration: sa('Animation', 'AnimationIteration'),
      animationstart: sa('Animation', 'AnimationStart'),
      transitionrun: sa('Transition', 'TransitionRun'),
      transitionstart: sa('Transition', 'TransitionStart'),
      transitioncancel: sa('Transition', 'TransitionCancel'),
      transitionend: sa('Transition', 'TransitionEnd'),
    },
    Mc = {},
    my = {};
  zt &&
    ((my = document.createElement('div').style),
    'AnimationEvent' in window ||
      (delete Ka.animationend.animation,
      delete Ka.animationiteration.animation,
      delete Ka.animationstart.animation),
    'TransitionEvent' in window || delete Ka.transitionend.transition);
  function fa(e) {
    if (Mc[e]) return Mc[e];
    if (!Ka[e]) return e;
    var t = Ka[e],
      n;
    for (n in t) if (t.hasOwnProperty(n) && n in my) return (Mc[e] = t[n]);
    return e;
  }
  var vy = fa('animationend'),
    by = fa('animationiteration'),
    Ey = fa('animationstart'),
    pb = fa('transitionrun'),
    gb = fa('transitionstart'),
    hb = fa('transitioncancel'),
    Sy = fa('transitionend'),
    _y = new Map(),
    Lc =
      'abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error fullscreenChange fullscreenError gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
        ' ',
      );
  Lc.push('scrollEnd');
  function Cn(e, t) {
    (_y.set(e, t), zn(t, [e]));
  }
  var mb = 0;
  function ll(e, t) {
    if (e.name != null && e.name !== 'auto') return e.name;
    if (t.autoName !== null) return t.autoName;
    e = Dn.identifierPrefix;
    var n = mb++;
    return ((e = '_' + e + 't_' + n.toString(32) + '_'), (t.autoName = e));
  }
  function Ty(e) {
    if (e == null || typeof e == 'string') return e;
    var t = null,
      n = hr;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var u = e[n[l]];
        if (u != null) {
          if (u === 'none') return 'none';
          t = t == null ? u : t + (' ' + u);
        }
      }
    return t ?? e.default;
  }
  function al(e, t) {
    return (
      (e = Ty(e)),
      (t = Ty(t)),
      t == null ? (e === 'auto' ? null : e) : t === 'auto' ? null : t
    );
  }
  var Si =
      typeof reportError == 'function'
        ? reportError
        : function (e) {
            if (typeof window == 'object' && typeof window.ErrorEvent == 'function') {
              var t = new window.ErrorEvent('error', {
                bubbles: !0,
                cancelable: !0,
                message:
                  typeof e == 'object' && e !== null && typeof e.message == 'string'
                    ? String(e.message)
                    : String(e),
                error: e,
              });
              if (!window.dispatchEvent(t)) return;
            } else if (typeof process == 'object' && typeof process.emit == 'function') {
              process.emit('uncaughtException', e);
              return;
            }
            console.error(e);
          },
    fn = [],
    Ja = 0,
    zc = 0;
  function _i() {
    for (var e = Ja, t = (zc = Ja = 0); t < e;) {
      var n = fn[t];
      fn[t++] = null;
      var l = fn[t];
      fn[t++] = null;
      var u = fn[t];
      fn[t++] = null;
      var i = fn[t];
      if (((fn[t++] = null), l !== null && u !== null)) {
        var s = l.pending;
        (s === null ? (u.next = u) : ((u.next = s.next), (s.next = u)), (l.pending = u));
      }
      i !== 0 && Oy(n, u, i);
    }
  }
  function Ti(e, t, n, l) {
    ((fn[Ja++] = e),
      (fn[Ja++] = t),
      (fn[Ja++] = n),
      (fn[Ja++] = l),
      (zc |= l),
      (e.lanes |= l),
      (e = e.alternate),
      e !== null && (e.lanes |= l));
  }
  function Uc(e, t, n, l) {
    return (Ti(e, t, n, l), Oi(e));
  }
  function da(e, t) {
    return (Ti(e, null, null, t), Oi(e));
  }
  function Oy(e, t, n) {
    e.lanes |= n;
    var l = e.alternate;
    l !== null && (l.lanes |= n);
    for (var u = !1, i = e.return; i !== null;)
      ((i.childLanes |= n),
        (l = i.alternate),
        l !== null && (l.childLanes |= n),
        i.tag === 22 && ((e = i.stateNode), e === null || e._visibility & 1 || (u = !0)),
        (e = i),
        (i = i.return));
    return e.tag === 3
      ? ((i = e.stateNode),
        u &&
          t !== null &&
          ((u = 31 - jt(n)),
          (e = i.hiddenUpdates),
          (l = e[u]),
          l === null ? (e[u] = [t]) : l.push(t),
          (t.lane = n | 536870912)),
        i)
      : null;
  }
  function Oi(e) {
    if (50 < xu) throw ((xu = 0), (po = null), Error(c(185)));
    for (var t = e.return; t !== null;) ((e = t), (t = e.return));
    return e.tag === 3 ? e.stateNode : null;
  }
  var Pa = {};
  function vb(e, t, n, l) {
    ((this.tag = e),
      (this.key = n),
      (this.sibling =
        this.child =
        this.return =
        this.stateNode =
        this.type =
        this.elementType =
          null),
      (this.index = 0),
      (this.refCleanup = this.ref = null),
      (this.pendingProps = t),
      (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
      (this.mode = l),
      (this.subtreeFlags = this.flags = 0),
      (this.deletions = null),
      (this.childLanes = this.lanes = 0),
      (this.alternate = null));
  }
  function qt(e, t, n, l) {
    return new vb(e, t, n, l);
  }
  function Bc(e) {
    return ((e = e.prototype), !(!e || !e.isReactComponent));
  }
  function rl(e, t) {
    var n = e.alternate;
    return (
      n === null
        ? ((n = qt(e.tag, t, e.key, e.mode)),
          (n.elementType = e.elementType),
          (n.type = e.type),
          (n.stateNode = e.stateNode),
          (n.alternate = e),
          (e.alternate = n))
        : ((n.pendingProps = t),
          (n.type = e.type),
          (n.flags = 0),
          (n.subtreeFlags = 0),
          (n.deletions = null)),
      (n.flags = e.flags & 1206910976),
      (n.childLanes = e.childLanes),
      (n.lanes = e.lanes),
      (n.child = e.child),
      (n.memoizedProps = e.memoizedProps),
      (n.memoizedState = e.memoizedState),
      (n.updateQueue = e.updateQueue),
      (t = e.dependencies),
      (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
      (n.sibling = e.sibling),
      (n.index = e.index),
      (n.ref = e.ref),
      (n.refCleanup = e.refCleanup),
      n
    );
  }
  function Ay(e, t) {
    e.flags &= 1206910978;
    var n = e.alternate;
    return (
      n === null
        ? ((e.childLanes = 0),
          (e.lanes = t),
          (e.child = null),
          (e.subtreeFlags = 0),
          (e.memoizedProps = null),
          (e.memoizedState = null),
          (e.updateQueue = null),
          (e.dependencies = null),
          (e.stateNode = null))
        : ((e.childLanes = n.childLanes),
          (e.lanes = n.lanes),
          (e.child = n.child),
          (e.subtreeFlags = 0),
          (e.deletions = null),
          (e.memoizedProps = n.memoizedProps),
          (e.memoizedState = n.memoizedState),
          (e.updateQueue = n.updateQueue),
          (e.type = n.type),
          (t = n.dependencies),
          (e.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext })),
      e
    );
  }
  function Ai(e, t, n, l, u, i) {
    var s = 0;
    if (((l = e), typeof l == 'function')) Bc(l) && (s = 1);
    else if (typeof l == 'string')
      s = Z1(e, n, rn.current) ? 26 : e === 'html' || e === 'head' || e === 'body' ? 27 : 5;
    else
      e: switch (l) {
        case xe:
          return ((e = qt(31, n, t, u)), (e.elementType = xe), (e.lanes = i), e);
        case Ee:
          return ya(n.children, u, i, t);
        case G:
          ((s = 8), (u |= 24));
          break;
        case ae:
          return ((e = qt(12, n, t, u | 2)), (e.elementType = ae), (e.lanes = i), e);
        case P:
          return ((e = qt(13, n, t, u)), (e.elementType = P), (e.lanes = i), e);
        case J:
          return ((e = qt(19, n, t, u)), (e.elementType = J), (e.lanes = i), e);
        case je:
        case C:
          return (
            (e = u | 32),
            (e = qt(30, n, t, e)),
            (e.elementType = C),
            (e.lanes = i),
            (e.stateNode = { autoName: null, paired: null, clones: null, ref: null }),
            e
          );
        default:
          if (typeof l == 'object' && l !== null)
            switch (l.$$typeof) {
              case ie:
                s = 10;
                break e;
              case ue:
                s = 9;
                break e;
              case I:
                s = 11;
                break e;
              case se:
                s = 14;
                break e;
              case le:
                ((s = 16), (l = null));
                break e;
            }
          ((s = 29), (n = Error(c(130, e === null ? 'null' : typeof e, ''))), (l = null));
      }
    return ((t = qt(s, n, t, u)), (t.elementType = e), (t.type = l), (t.lanes = i), t);
  }
  function ya(e, t, n, l) {
    return ((e = qt(7, e, l, t)), (e.lanes = n), e);
  }
  function kc(e, t, n) {
    return ((e = qt(6, e, null, t)), (e.lanes = n), e);
  }
  function xy(e) {
    var t = qt(18, null, null, 0);
    return ((t.stateNode = e), t);
  }
  function Hc(e, t, n) {
    return (
      (t = qt(4, e.children !== null ? e.children : [], e.key, t)),
      (t.lanes = n),
      (t.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        implementation: e.implementation,
      }),
      t
    );
  }
  var Cy = new WeakMap();
  function dn(e, t) {
    if (typeof e == 'object' && e !== null) {
      var n = Cy.get(e);
      return n !== void 0 ? n : ((t = { value: e, source: t, stack: Ju(t) }), Cy.set(e, t), t);
    }
    return { value: e, source: t, stack: Ju(t) };
  }
  var Wa = [],
    er = 0,
    xi = null,
    ru = 0,
    yn = [],
    pn = 0,
    Al = null,
    Un = 1,
    Bn = '';
  function ul(e, t) {
    ((Wa[er++] = ru), (Wa[er++] = xi), (xi = e), (ru = t));
  }
  function wy(e, t, n) {
    ((yn[pn++] = Un), (yn[pn++] = Bn), (yn[pn++] = Al), (Al = e));
    var l = Un;
    e = Bn;
    var u = 32 - jt(l) - 1;
    ((l &= ~(1 << u)), (n += 1));
    var i = 32 - jt(t) + u;
    if (30 < i) {
      var s = u - (u % 5);
      ((i = (l & ((1 << s) - 1)).toString(32)),
        (l >>= s),
        (u -= s),
        (Un = (1 << (32 - jt(t) + u)) | (n << u) | l),
        (Bn = i + e));
    } else ((Un = (1 << i) | (n << u) | l), (Bn = e));
  }
  function Ci(e) {
    e.return !== null && (ul(e, 1), wy(e, 1, 0));
  }
  function Fc(e) {
    for (; e === xi;) ((xi = Wa[--er]), (Wa[er] = null), (ru = Wa[--er]), (Wa[er] = null));
    for (; e === Al;)
      ((Al = yn[--pn]),
        (yn[pn] = null),
        (Bn = yn[--pn]),
        (yn[pn] = null),
        (Un = yn[--pn]),
        (yn[pn] = null));
  }
  function Ry(e, t) {
    ((yn[pn++] = Un), (yn[pn++] = Bn), (yn[pn++] = Al), (Un = t.id), (Bn = t.overflow), (Al = e));
  }
  var bt = null,
    et = null,
    Ne = !1,
    xl = null,
    gn = !1,
    Gc = Error(c(519));
  function Cl(e) {
    var t = Error(
      c(418, 1 < arguments.length && arguments[1] !== void 0 && arguments[1] ? 'text' : 'HTML', ''),
    );
    throw (uu(dn(t, e)), Gc);
  }
  function Ny(e) {
    var t = e.stateNode,
      n = e.type,
      l = e.memoizedProps;
    switch (((t[ht] = e), (t[wt] = l), n)) {
      case 'dialog':
        (Ue('cancel', t), Ue('close', t));
        break;
      case 'iframe':
      case 'object':
      case 'embed':
        Ue('load', t);
        break;
      case 'video':
      case 'audio':
        for (n = 0; n < wu.length; n++) Ue(wu[n], t);
        break;
      case 'source':
        Ue('error', t);
        break;
      case 'img':
      case 'image':
      case 'link':
        (Ue('error', t), Ue('load', t));
        break;
      case 'details':
        Ue('toggle', t);
        break;
      case 'input':
        (Ue('invalid', t),
          Kr(t, l.value, l.defaultValue, l.checked, l.defaultChecked, l.type, l.name, !0));
        break;
      case 'select':
        Ue('invalid', t);
        break;
      case 'textarea':
        (Ue('invalid', t), Jr(t, l.value, l.defaultValue, l.children));
    }
    ((n = l.children),
      (typeof n != 'string' && typeof n != 'number' && typeof n != 'bigint') ||
      t.textContent === '' + n ||
      l.suppressHydrationWarning === !0 ||
      Jg(t.textContent, n)
        ? (l.popover != null && (Ue('beforetoggle', t), Ue('toggle', t)),
          l.onScroll != null && Ue('scroll', t),
          l.onScrollEnd != null && Ue('scrollend', t),
          l.onClick != null && (t.onclick = F),
          (t = !0))
        : (t = !1),
      t || Cl(e, !0));
  }
  function wi(e) {
    for (bt = e.return; bt;)
      switch (bt.tag) {
        case 5:
        case 31:
        case 13:
          gn = !1;
          return;
        case 27:
        case 3:
          gn = !0;
          return;
        default:
          bt = bt.return;
      }
  }
  function tr(e) {
    if (e !== bt) return !1;
    if (!Ne) return (wi(e), (Ne = !0), !1);
    var t = e.tag,
      n;
    if (
      ((n = t !== 3 && t !== 27) &&
        ((n = t === 5) &&
          ((n = e.type), (n = !(n !== 'form' && n !== 'button') || vf(e.type, e.memoizedProps))),
        (n = !n)),
      n && et && Cl(e),
      wi(e),
      t === 13)
    ) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(c(317));
      et = hh(e);
    } else if (t === 31) {
      if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(c(317));
      et = hh(e);
    } else
      t === 27
        ? ((t = et), Yl(e.type) ? ((e = Cf), (Cf = null), (et = e)) : (et = t))
        : (et = bt ? mn(e.stateNode.nextSibling) : null);
    return !0;
  }
  function pa() {
    ((et = bt = null), (Ne = !1));
  }
  function qc() {
    var e = xl;
    return (e !== null && (It === null ? (It = e) : It.push.apply(It, e), (xl = null)), e);
  }
  function uu(e) {
    xl === null ? (xl = [e]) : xl.push(e);
  }
  var Yc = Nt(null),
    ga = null,
    il = null;
  function wl(e, t, n) {
    (Ke(Yc, t._currentValue), (t._currentValue = n));
  }
  function ol(e) {
    ((e._currentValue = Yc.current), lt(Yc));
  }
  function Ri(e, t, n) {
    for (; e !== null;) {
      var l = e.alternate;
      if (
        ((e.childLanes & t) !== t
          ? ((e.childLanes |= t), l !== null && (l.childLanes |= t))
          : l !== null && (l.childLanes & t) !== t && (l.childLanes |= t),
        e === n)
      )
        break;
      e = e.return;
    }
  }
  function Vc(e, t, n, l) {
    var u = e.child;
    for (u !== null && (u.return = e); u !== null;) {
      var i = u.dependencies;
      if (i !== null) {
        var s = u.child;
        i = i.firstContext;
        e: for (; i !== null;) {
          var h = i;
          i = u;
          for (var O = 0; O < t.length; O++)
            if (h.context === t[O]) {
              ((i.lanes |= n),
                (h = i.alternate),
                h !== null && (h.lanes |= n),
                Ri(i.return, n, e),
                l || (s = null));
              break e;
            }
          i = h.next;
        }
      } else if (u.tag === 18) {
        if (((s = u.return), s === null)) throw Error(c(341));
        ((s.lanes |= n), (i = s.alternate), i !== null && (i.lanes |= n), Ri(s, n, e), (s = null));
      } else
        u.tag === 13 && u.memoizedState !== null && u.memoizedState.dehydrated === null
          ? ((u.lanes |= n),
            (s = u.alternate),
            s !== null && (s.lanes |= n),
            Ri(u.return, n, e),
            (s = u.child),
            (s = s !== null ? s.sibling : null))
          : (s = u.child);
      if (s !== null) s.return = u;
      else
        for (s = u; s !== null;) {
          if (s === e) {
            s = null;
            break;
          }
          if (((u = s.sibling), u !== null)) {
            ((u.return = s.return), (s = u));
            break;
          }
          s = s.return;
        }
      u = s;
    }
  }
  function ha(e, t, n, l) {
    e = null;
    for (var u = t, i = !1; u !== null;) {
      if (!i) {
        if ((u.flags & 524288) !== 0) i = !0;
        else if ((u.flags & 262144) !== 0) break;
      }
      if (u.tag === 10) {
        var s = u.alternate;
        if (s === null) throw Error(c(387));
        if (((s = s.memoizedProps), s !== null)) {
          var h = u.type;
          Kt(u.pendingProps.value, s.value) || (e !== null ? e.push(h) : (e = [h]));
        }
      } else if (u === Jn.current) {
        if (((s = u.alternate), s === null)) throw Error(c(387));
        s.memoizedState.memoizedState !== u.memoizedState.memoizedState &&
          (e !== null ? e.push(xr) : (e = [xr]));
      }
      u = u.return;
    }
    return (e !== null && Vc(t, e, n, l), (t.flags |= 262144), e !== null);
  }
  function Ni(e) {
    for (e = e.firstContext; e !== null;) {
      if (!Kt(e.context._currentValue, e.memoizedValue)) return !0;
      e = e.next;
    }
    return !1;
  }
  function ma(e) {
    ((ga = e), (il = null), (e = e.dependencies), e !== null && (e.firstContext = null));
  }
  function _t(e) {
    return Dy(ga, e);
  }
  function Di(e, t) {
    return (ga === null && ma(e), Dy(e, t));
  }
  function Dy(e, t) {
    var n = t._currentValue;
    if (((t = { context: t, memoizedValue: n, next: null }), il === null)) {
      if (e === null) throw Error(c(308));
      ((il = t), (e.dependencies = { lanes: 0, firstContext: t }), (e.flags |= 524288));
    } else il = il.next = t;
    return n;
  }
  var bb =
      typeof AbortController < 'u'
        ? AbortController
        : function () {
            var e = [],
              t = (this.signal = {
                aborted: !1,
                addEventListener: function (n, l) {
                  e.push(l);
                },
              });
            this.abort = function () {
              ((t.aborted = !0),
                e.forEach(function (n) {
                  return n();
                }));
            };
          },
    Eb = a.unstable_scheduleCallback,
    Sb = a.unstable_NormalPriority,
    ft = {
      $$typeof: ie,
      Consumer: null,
      Provider: null,
      _currentValue: null,
      _currentValue2: null,
      _threadCount: 0,
    };
  function Ic() {
    return { controller: new bb(), data: new Map(), refCount: 0 };
  }
  function iu(e) {
    (e.refCount--,
      e.refCount === 0 &&
        Eb(Sb, function () {
          e.controller.abort();
        }));
  }
  function jy(e, t) {
    if ((e.pendingLanes & 4194048) !== 0) {
      var n = e.transitionTypes;
      for (n === null && (n = e.transitionTypes = []), e = 0; e < t.length; e++) {
        var l = t[e];
        n.indexOf(l) === -1 && n.push(l);
      }
    }
  }
  var ou = null;
  function _b(e) {
    var t = e.transitionTypes;
    return ((e.transitionTypes = null), t);
  }
  var cu = null,
    Zc = 0,
    va = 0,
    nr = null;
  function Tb(e, t) {
    if (cu === null) {
      var n = (cu = []);
      ((Zc = 0),
        (va = cf()),
        (nr = {
          status: 'pending',
          value: void 0,
          then: function (l) {
            n.push(l);
          },
        }));
    }
    return (Zc++, t.then(My, My), t);
  }
  function My() {
    if (--Zc === 0 && ((ou = null), cu !== null)) {
      nr !== null && (nr.status = 'fulfilled');
      var e = cu;
      ((cu = null), (va = 0), (nr = null));
      for (var t = 0; t < e.length; t++) (0, e[t])();
    }
  }
  function Ob(e, t) {
    var n = [],
      l = {
        status: 'pending',
        value: null,
        reason: null,
        then: function (u) {
          n.push(u);
        },
      };
    return (
      e.then(
        function () {
          ((l.status = 'fulfilled'), (l.value = t));
          for (var u = 0; u < n.length; u++) (0, n[u])(t);
        },
        function (u) {
          for (l.status = 'rejected', l.reason = u, u = 0; u < n.length; u++) (0, n[u])(void 0);
        },
      ),
      l
    );
  }
  var Ly = de.S;
  de.S = function (e, t) {
    if (
      ((xg = Dt()),
      typeof t == 'object' && t !== null && typeof t.then == 'function' && Tb(e, t),
      ou !== null)
    )
      for (var n = Er; n !== null;) (jy(n, ou), (n = n.next));
    if (((n = e.types), n !== null)) {
      for (var l = Er; l !== null;) (jy(l, n), (l = l.next));
      if (va !== 0) {
        ((l = ou), l === null && (l = ou = []));
        for (var u = 0; u < n.length; u++) {
          var i = n[u];
          l.indexOf(i) === -1 && l.push(i);
        }
      }
    }
    Ly !== null && Ly(e, t);
  };
  var ba = Nt(null);
  function Xc() {
    var e = ba.current;
    return e !== null ? e : We.pooledCache;
  }
  function ji(e, t) {
    t === null ? Ke(ba, ba.current) : Ke(ba, t.pool);
  }
  function zy() {
    var e = Xc();
    return e === null ? null : { parent: ft._currentValue, pool: e };
  }
  var lr = Error(c(460)),
    Qc = Error(c(474)),
    Mi = Error(c(542)),
    Li = { then: function () {} };
  function Uy(e) {
    return ((e = e.status), e === 'fulfilled' || e === 'rejected');
  }
  function By(e, t, n) {
    switch (((n = e[n]), n === void 0 ? e.push(t) : n !== t && (t.then(F, F), (t = n)), t.status)) {
      case 'fulfilled':
        return t.value;
      case 'rejected':
        throw ((e = t.reason), Hy(e), e === void 0 && !('reason' in t) ? Error(c(600)) : e);
      default:
        if (typeof t.status == 'string') t.then(F, F);
        else {
          if (((e = We), e !== null && 100 < e.shellSuspendCounter)) throw Error(c(482));
          ((e = t),
            (e.status = 'pending'),
            e.then(
              function (l) {
                if (t.status === 'pending') {
                  var u = t;
                  ((u.status = 'fulfilled'), (u.value = l));
                }
              },
              function (l) {
                if (t.status === 'pending') {
                  var u = t;
                  ((u.status = 'rejected'), (u.reason = l));
                }
              },
            ));
        }
        switch (t.status) {
          case 'fulfilled':
            return t.value;
          case 'rejected':
            throw ((e = t.reason), Hy(e), e);
        }
        throw ((Sa = t), lr);
    }
  }
  function Ea(e) {
    try {
      var t = e._init;
      return t(e._payload);
    } catch (n) {
      throw n !== null && typeof n == 'object' && typeof n.then == 'function' ? ((Sa = n), lr) : n;
    }
  }
  var Sa = null;
  function ky() {
    if (Sa === null) throw Error(c(459));
    var e = Sa;
    return ((Sa = null), e);
  }
  function Hy(e) {
    if (e === lr || e === Mi) throw Error(c(483));
  }
  var ar = null,
    su = 0;
  function zi(e) {
    var t = su;
    return ((su += 1), ar === null && (ar = []), By(ar, e, t));
  }
  function Rl(e, t) {
    ((t = t.props.ref), (e.ref = t !== void 0 ? t : null));
  }
  function Ui(e, t) {
    throw t.$$typeof === K
      ? Error(c(525))
      : ((e = Object.prototype.toString.call(t)),
        Error(
          c(
            31,
            e === '[object Object]' ? 'object with keys {' + Object.keys(t).join(', ') + '}' : e,
          ),
        ));
  }
  function Fy(e) {
    function t(j, w) {
      if (e) {
        var z = j.deletions;
        z === null ? ((j.deletions = [w]), (j.flags |= 16)) : z.push(w);
      }
    }
    function n(j, w) {
      if (!e) return null;
      for (; w !== null;) (t(j, w), (w = w.sibling));
      return null;
    }
    function l(j) {
      for (var w = new Map(); j !== null;)
        (j.key === null ? w.set(j.index, j) : w.set(j.key, j), (j = j.sibling));
      return w;
    }
    function u(j, w) {
      return ((j = rl(j, w)), (j.index = 0), (j.sibling = null), j);
    }
    function i(j, w, z) {
      return (
        (j.index = z),
        e
          ? ((z = j.alternate),
            z !== null
              ? ((z = z.index), z < w ? ((j.flags |= 2), w) : z)
              : ((j.flags |= 134217730), w))
          : ((j.flags |= 1048576), w)
      );
    }
    function s(j) {
      return (e && j.alternate === null && (j.flags |= 134217730), j);
    }
    function h(j, w, z, Y) {
      return w === null || w.tag !== 6
        ? ((w = kc(z, j.mode, Y)), (w.return = j), w)
        : ((w = u(w, z)), (w.return = j), w);
    }
    function O(j, w, z, Y) {
      var fe = z.type;
      return fe === Ee
        ? ((j = H(j, w, z.props.children, Y, z.key)), Rl(j, z), j)
        : w !== null &&
            (w.elementType === fe ||
              (typeof fe == 'object' && fe !== null && fe.$$typeof === le && Ea(fe) === w.type))
          ? ((w = u(w, z.props)), Rl(w, z), (w.return = j), w)
          : ((w = Ai(z.type, z.key, z.props, null, j.mode, Y)), Rl(w, z), (w.return = j), w);
    }
    function M(j, w, z, Y) {
      return w === null ||
        w.tag !== 4 ||
        w.stateNode.containerInfo !== z.containerInfo ||
        w.stateNode.implementation !== z.implementation
        ? ((w = Hc(z, j.mode, Y)), (w.return = j), w)
        : ((w = u(w, z.children || [])), (w.return = j), w);
    }
    function H(j, w, z, Y, fe) {
      return w === null || w.tag !== 7
        ? ((w = ya(z, j.mode, Y, fe)), (w.return = j), w)
        : ((w = u(w, z)), (w.return = j), w);
    }
    function V(j, w, z) {
      if ((typeof w == 'string' && w !== '') || typeof w == 'number' || typeof w == 'bigint')
        return ((w = kc('' + w, j.mode, z)), (w.return = j), w);
      if (typeof w == 'object' && w !== null) {
        switch (w.$$typeof) {
          case ce:
            return ((z = Ai(w.type, w.key, w.props, null, j.mode, z)), Rl(z, w), (z.return = j), z);
          case he:
            return ((w = Hc(w, j.mode, z)), (w.return = j), w);
          case le:
            return ((w = Ea(w)), V(j, w, z));
        }
        if (Le(w) || oe(w)) return ((w = ya(w, j.mode, z, null)), (w.return = j), w);
        if (typeof w.then == 'function') return V(j, zi(w), z);
        if (w.$$typeof === ie) return V(j, Di(j, w), z);
        Ui(j, w);
      }
      return null;
    }
    function D(j, w, z, Y) {
      var fe = w !== null ? w.key : null;
      if ((typeof z == 'string' && z !== '') || typeof z == 'number' || typeof z == 'bigint')
        return fe !== null ? null : h(j, w, '' + z, Y);
      if (typeof z == 'object' && z !== null) {
        switch (z.$$typeof) {
          case ce:
            return z.key === fe ? O(j, w, z, Y) : null;
          case he:
            return z.key === fe ? M(j, w, z, Y) : null;
          case le:
            return ((z = Ea(z)), D(j, w, z, Y));
        }
        if (Le(z) || oe(z)) return fe !== null ? null : H(j, w, z, Y, null);
        if (typeof z.then == 'function') return D(j, w, zi(z), Y);
        if (z.$$typeof === ie) return D(j, w, Di(j, z), Y);
        Ui(j, z);
      }
      return null;
    }
    function U(j, w, z, Y, fe) {
      if ((typeof Y == 'string' && Y !== '') || typeof Y == 'number' || typeof Y == 'bigint')
        return ((j = j.get(z) || null), h(w, j, '' + Y, fe));
      if (typeof Y == 'object' && Y !== null) {
        switch (Y.$$typeof) {
          case ce:
            return ((j = j.get(Y.key === null ? z : Y.key) || null), O(w, j, Y, fe));
          case he:
            return ((j = j.get(Y.key === null ? z : Y.key) || null), M(w, j, Y, fe));
          case le:
            return ((Y = Ea(Y)), U(j, w, z, Y, fe));
        }
        if (Le(Y) || oe(Y)) return ((j = j.get(z) || null), H(w, j, Y, fe, null));
        if (typeof Y.then == 'function') return U(j, w, z, zi(Y), fe);
        if (Y.$$typeof === ie) return U(j, w, z, Di(w, Y), fe);
        Ui(w, Y);
      }
      return null;
    }
    function ne(j, w, z, Y) {
      for (
        var fe = null, ke = null, ve = w, _e = (w = 0), pt = null;
        ve !== null && _e < z.length;
        _e++
      ) {
        ve.index > _e ? ((pt = ve), (ve = null)) : (pt = ve.sibling);
        var qe = D(j, ve, z[_e], Y);
        if (qe === null) {
          ve === null && (ve = pt);
          break;
        }
        (e && ve && qe.alternate === null && t(j, ve),
          (w = i(qe, w, _e)),
          ke === null ? (fe = qe) : (ke.sibling = qe),
          (ke = qe),
          (ve = pt));
      }
      if (_e === z.length) return (n(j, ve), Ne && ul(j, _e), fe);
      if (ve === null) {
        for (; _e < z.length; _e++)
          ((ve = V(j, z[_e], Y)),
            ve !== null &&
              ((w = i(ve, w, _e)), ke === null ? (fe = ve) : (ke.sibling = ve), (ke = ve)));
        return (Ne && ul(j, _e), fe);
      }
      for (ve = l(ve); _e < z.length; _e++)
        ((pt = U(ve, j, _e, z[_e], Y)),
          pt !== null &&
            (e && ((qe = pt.alternate), qe !== null && ve.delete(qe.key === null ? _e : qe.key)),
            (w = i(pt, w, _e)),
            ke === null ? (fe = pt) : (ke.sibling = pt),
            (ke = pt)));
      return (
        e &&
          ve.forEach(function (Ql) {
            return t(j, Ql);
          }),
        Ne && ul(j, _e),
        fe
      );
    }
    function pe(j, w, z, Y) {
      if (z == null) throw Error(c(151));
      for (
        var fe = null, ke = null, ve = w, _e = (w = 0), pt = null, qe = z.next();
        ve !== null && !qe.done;
        _e++, qe = z.next()
      ) {
        ve.index > _e ? ((pt = ve), (ve = null)) : (pt = ve.sibling);
        var Ql = D(j, ve, qe.value, Y);
        if (Ql === null) {
          ve === null && (ve = pt);
          break;
        }
        (e && ve && Ql.alternate === null && t(j, ve),
          (w = i(Ql, w, _e)),
          ke === null ? (fe = Ql) : (ke.sibling = Ql),
          (ke = Ql),
          (ve = pt));
      }
      if (qe.done) return (n(j, ve), Ne && ul(j, _e), fe);
      if (ve === null) {
        for (; !qe.done; _e++, qe = z.next())
          ((qe = V(j, qe.value, Y)),
            qe !== null &&
              ((w = i(qe, w, _e)), ke === null ? (fe = qe) : (ke.sibling = qe), (ke = qe)));
        return (Ne && ul(j, _e), fe);
      }
      for (ve = l(ve); !qe.done; _e++, qe = z.next())
        ((qe = U(ve, j, _e, qe.value, Y)),
          qe !== null &&
            (e && ((pt = qe.alternate), pt !== null && ve.delete(pt.key === null ? _e : pt.key)),
            (w = i(qe, w, _e)),
            ke === null ? (fe = qe) : (ke.sibling = qe),
            (ke = qe)));
      return (
        e &&
          ve.forEach(function (aE) {
            return t(j, aE);
          }),
        Ne && ul(j, _e),
        fe
      );
    }
    function we(j, w, z, Y) {
      if (
        (typeof z == 'object' &&
          z !== null &&
          z.type === Ee &&
          z.key === null &&
          z.props.ref === void 0 &&
          (z = z.props.children),
        typeof z == 'object' && z !== null)
      ) {
        switch (z.$$typeof) {
          case ce:
            e: {
              for (var fe = z.key; w !== null;) {
                if (w.key === fe) {
                  if (((fe = z.type), fe === Ee)) {
                    if (w.tag === 7) {
                      (n(j, w.sibling),
                        (Y = u(w, z.props.children)),
                        Rl(Y, z),
                        (Y.return = j),
                        (j = Y));
                      break e;
                    }
                  } else if (
                    w.elementType === fe ||
                    (typeof fe == 'object' &&
                      fe !== null &&
                      fe.$$typeof === le &&
                      Ea(fe) === w.type)
                  ) {
                    (n(j, w.sibling), (Y = u(w, z.props)), Rl(Y, z), (Y.return = j), (j = Y));
                    break e;
                  }
                  n(j, w);
                  break;
                } else t(j, w);
                w = w.sibling;
              }
              z.type === Ee
                ? ((Y = ya(z.props.children, j.mode, Y, z.key)), Rl(Y, z), (Y.return = j), (j = Y))
                : ((Y = Ai(z.type, z.key, z.props, null, j.mode, Y)),
                  Rl(Y, z),
                  (Y.return = j),
                  (j = Y));
            }
            return s(j);
          case he:
            e: {
              for (fe = z.key; w !== null;) {
                if (w.key === fe)
                  if (
                    w.tag === 4 &&
                    w.stateNode.containerInfo === z.containerInfo &&
                    w.stateNode.implementation === z.implementation
                  ) {
                    (n(j, w.sibling), (Y = u(w, z.children || [])), (Y.return = j), (j = Y));
                    break e;
                  } else {
                    n(j, w);
                    break;
                  }
                else t(j, w);
                w = w.sibling;
              }
              ((Y = Hc(z, j.mode, Y)), (Y.return = j), (j = Y));
            }
            return s(j);
          case le:
            return ((z = Ea(z)), we(j, w, z, Y));
        }
        if (Le(z)) return ne(j, w, z, Y);
        if (oe(z)) {
          if (((fe = oe(z)), typeof fe != 'function')) throw Error(c(150));
          return ((z = fe.call(z)), pe(j, w, z, Y));
        }
        if (typeof z.then == 'function') return we(j, w, zi(z), Y);
        if (z.$$typeof === ie) return we(j, w, Di(j, z), Y);
        Ui(j, z);
      }
      return (typeof z == 'string' && z !== '') || typeof z == 'number' || typeof z == 'bigint'
        ? ((z = '' + z),
          w !== null && w.tag === 6
            ? (n(j, w.sibling), (Y = u(w, z)), (Y.return = j), (j = Y))
            : (n(j, w), (Y = kc(z, j.mode, Y)), (Y.return = j), (j = Y)),
          s(j))
        : n(j, w);
    }
    return function (j, w, z, Y) {
      try {
        su = 0;
        var fe = we(j, w, z, Y);
        return ((ar = null), fe);
      } catch (ve) {
        if (ve === lr || ve === Mi) throw ve;
        var ke = qt(29, ve, null, j.mode);
        return ((ke.lanes = Y), (ke.return = j), ke);
      } finally {
      }
    };
  }
  var _a = Fy(!0),
    Gy = Fy(!1),
    Nl = !1;
  function $c(e) {
    e.updateQueue = {
      baseState: e.memoizedState,
      firstBaseUpdate: null,
      lastBaseUpdate: null,
      shared: { pending: null, lanes: 0, hiddenCallbacks: null },
      callbacks: null,
    };
  }
  function Kc(e, t) {
    ((e = e.updateQueue),
      t.updateQueue === e &&
        (t.updateQueue = {
          baseState: e.baseState,
          firstBaseUpdate: e.firstBaseUpdate,
          lastBaseUpdate: e.lastBaseUpdate,
          shared: e.shared,
          callbacks: null,
        }));
  }
  function Dl(e) {
    return { lane: e, tag: 0, payload: null, callback: null, next: null };
  }
  function jl(e, t, n) {
    var l = e.updateQueue;
    if (l === null) return null;
    if (((l = l.shared), (Ie & 2) !== 0)) {
      var u = l.pending;
      return (
        u === null ? (t.next = t) : ((t.next = u.next), (u.next = t)),
        (l.pending = t),
        (t = Oi(e)),
        Oy(e, null, n),
        t
      );
    }
    return (Ti(e, l, t, n), Oi(e));
  }
  function fu(e, t, n) {
    if (((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194048) !== 0))) {
      var l = t.lanes;
      ((l &= e.pendingLanes), (n |= l), (t.lanes = n), Ga(e, n));
    }
  }
  function Jc(e, t) {
    var n = e.updateQueue,
      l = e.alternate;
    if (l !== null && ((l = l.updateQueue), n === l)) {
      var u = null,
        i = null;
      if (((n = n.firstBaseUpdate), n !== null)) {
        do {
          var s = { lane: n.lane, tag: n.tag, payload: n.payload, callback: null, next: null };
          (i === null ? (u = i = s) : (i = i.next = s), (n = n.next));
        } while (n !== null);
        i === null ? (u = i = t) : (i = i.next = t);
      } else u = i = t;
      ((n = {
        baseState: l.baseState,
        firstBaseUpdate: u,
        lastBaseUpdate: i,
        shared: l.shared,
        callbacks: l.callbacks,
      }),
        (e.updateQueue = n));
      return;
    }
    ((e = n.lastBaseUpdate),
      e === null ? (n.firstBaseUpdate = t) : (e.next = t),
      (n.lastBaseUpdate = t));
  }
  var Pc = !1;
  function du() {
    if (Pc) {
      var e = nr;
      if (e !== null) throw e;
    }
  }
  function yu(e, t, n, l) {
    Pc = !1;
    var u = e.updateQueue;
    Nl = !1;
    var i = u.firstBaseUpdate,
      s = u.lastBaseUpdate,
      h = u.shared.pending;
    if (h !== null) {
      u.shared.pending = null;
      var O = h,
        M = O.next;
      ((O.next = null), s === null ? (i = M) : (s.next = M), (s = O));
      var H = e.alternate;
      H !== null &&
        ((H = H.updateQueue),
        (h = H.lastBaseUpdate),
        h !== s && (h === null ? (H.firstBaseUpdate = M) : (h.next = M), (H.lastBaseUpdate = O)));
    }
    if (i !== null) {
      var V = u.baseState;
      ((s = 0), (H = M = O = null), (h = i));
      do {
        var D = h.lane & -536870913,
          U = D !== h.lane;
        if (U ? (Be & D) === D : (l & D) === D) {
          (D !== 0 && D === va && (Pc = !0),
            H !== null &&
              (H = H.next =
                { lane: 0, tag: h.tag, payload: h.payload, callback: null, next: null }));
          e: {
            var ne = e,
              pe = h;
            D = t;
            var we = n;
            switch (pe.tag) {
              case 1:
                if (((ne = pe.payload), typeof ne == 'function')) {
                  V = ne.call(we, V, D);
                  break e;
                }
                V = ne;
                break e;
              case 3:
                ne.flags = (ne.flags & -65537) | 128;
              case 0:
                if (
                  ((ne = pe.payload),
                  (D = typeof ne == 'function' ? ne.call(we, V, D) : ne),
                  D == null)
                )
                  break e;
                V = Z({}, V, D);
                break e;
              case 2:
                Nl = !0;
            }
          }
          ((D = h.callback),
            D !== null &&
              ((e.flags |= 64),
              U && (e.flags |= 8192),
              (U = u.callbacks),
              U === null ? (u.callbacks = [D]) : U.push(D)));
        } else
          ((U = { lane: D, tag: h.tag, payload: h.payload, callback: h.callback, next: null }),
            H === null ? ((M = H = U), (O = V)) : (H = H.next = U),
            (s |= D));
        if (((h = h.next), h === null)) {
          if (((h = u.shared.pending), h === null)) break;
          ((U = h),
            (h = U.next),
            (U.next = null),
            (u.lastBaseUpdate = U),
            (u.shared.pending = null));
        }
      } while (!0);
      (H === null && (O = V),
        (u.baseState = O),
        (u.firstBaseUpdate = M),
        (u.lastBaseUpdate = H),
        i === null && (u.shared.lanes = 0),
        (Hl |= s),
        (e.lanes = s),
        (e.memoizedState = V));
    }
  }
  function qy(e, t) {
    if (typeof e != 'function') throw Error(c(191, e));
    e.call(t);
  }
  function Yy(e, t) {
    var n = e.callbacks;
    if (n !== null) for (e.callbacks = null, e = 0; e < n.length; e++) qy(n[e], t);
  }
  var Ml = Nt(null),
    Bi = Nt(0);
  function Vy(e, t) {
    ((e = yl), Ke(Bi, e), Ke(Ml, t), (yl = e | t.baseLanes));
  }
  function Wc() {
    (Ke(Bi, yl), Ke(Ml, Ml.current));
  }
  function es() {
    ((yl = Bi.current), lt(Ml), lt(Bi));
  }
  var Tt = Nt(null),
    Rt = null;
  function Ll(e) {
    var t = e.alternate;
    (Ke(Ot, Ot.current & 1),
      Ke(Tt, e),
      Rt === null && (t === null || Ml.current !== null || t.memoizedState !== null) && (Rt = e));
  }
  function ts(e) {
    (Ke(Ot, Ot.current), Ke(Tt, e), Rt === null && (Rt = e));
  }
  function Iy(e) {
    e.tag === 22 ? (Ke(Ot, Ot.current), Ke(Tt, e), Rt === null && (Rt = e)) : zl();
  }
  function zl() {
    (Ke(Ot, Ot.current), Ke(Tt, Tt.current));
  }
  function Jt(e) {
    (lt(Tt), Rt === e && (Rt = null), lt(Ot));
  }
  var Ot = Nt(0);
  function pu(e, t) {
    (Ke(Tt, Tt.current), Ke(Ot, t));
  }
  function ns(e) {
    (lt(Ot), lt(Tt), Rt === e && (Rt = null));
  }
  function ki(e) {
    for (var t = e; t !== null;) {
      if (t.tag === 13) {
        var n = t.memoizedState;
        if (n !== null && ((n = n.dehydrated), n === null || Af(n) || xf(n))) return t;
      } else if (t.tag === 19 && t.memoizedProps.revealOrder !== 'independent') {
        if ((t.flags & 128) !== 0) return t;
      } else if (t.child !== null) {
        ((t.child.return = t), (t = t.child));
        continue;
      }
      if (t === e) break;
      for (; t.sibling === null;) {
        if (t.return === null || t.return === e) return null;
        t = t.return;
      }
      ((t.sibling.return = t.return), (t = t.sibling));
    }
    return null;
  }
  var cl = 0,
    Ce = null,
    Pe = null,
    dt = null,
    Hi = !1,
    rr = !1,
    Ta = !1,
    Fi = 0,
    gu = 0,
    ur = null,
    Ab = 0;
  function it() {
    throw Error(c(321));
  }
  function ls(e, t) {
    if (t === null) return !1;
    for (var n = 0; n < t.length && n < e.length; n++) if (!Kt(e[n], t[n])) return !1;
    return !0;
  }
  function as(e, t, n, l, u, i) {
    return (
      (cl = i),
      (Ce = t),
      (t.memoizedState = null),
      (t.updateQueue = null),
      (t.lanes = 0),
      (de.H = e === null || e.memoizedState === null ? wp : Rp),
      (Ta = !1),
      (i = n(l, u)),
      (Ta = !1),
      rr && (i = Xy(t, n, l, u)),
      Zy(e),
      i
    );
  }
  function Zy(e) {
    de.H = Xi;
    var t = Pe !== null && Pe.next !== null;
    if (((cl = 0), (dt = Pe = Ce = null), (Hi = !1), (gu = 0), (ur = null), t)) throw Error(c(300));
    e === null || yt || ((e = e.dependencies), e !== null && Ni(e) && (yt = !0));
  }
  function Xy(e, t, n, l) {
    Ce = e;
    var u = 0;
    do {
      if ((rr && (ur = null), (gu = 0), (rr = !1), 25 <= u)) throw Error(c(301));
      if (((u += 1), (dt = Pe = null), e.updateQueue != null)) {
        var i = e.updateQueue;
        ((i.lastEffect = null),
          (i.events = null),
          (i.stores = null),
          i.memoCache != null && (i.memoCache.index = 0));
      }
      ((de.H = Mb), (i = t(n, l)));
    } while (rr);
    return i;
  }
  function xb() {
    var e = de.H,
      t = e.useState()[0];
    return (
      (t = typeof t.then == 'function' ? hu(t) : t),
      (e = e.useState()[0]),
      (Pe !== null ? Pe.memoizedState : null) !== e && (Ce.flags |= 1024),
      t
    );
  }
  function rs() {
    var e = Fi !== 0;
    return ((Fi = 0), e);
  }
  function us(e, t, n) {
    ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~n));
  }
  function is(e) {
    if (Hi) {
      for (e = e.memoizedState; e !== null;) {
        var t = e.queue;
        (t !== null && (t.pending = null), (e = e.next));
      }
      Hi = !1;
    }
    ((cl = 0), (dt = Pe = Ce = null), (rr = !1), (gu = Fi = 0), (ur = null));
  }
  function Bt() {
    var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return (dt === null ? (Ce.memoizedState = dt = e) : (dt = dt.next = e), dt);
  }
  function ct() {
    if (Pe === null) {
      var e = Ce.alternate;
      e = e !== null ? e.memoizedState : null;
    } else e = Pe.next;
    var t = dt === null ? Ce.memoizedState : dt.next;
    if (t !== null) ((dt = t), (Pe = e));
    else {
      if (e === null) throw Ce.alternate === null ? Error(c(467)) : Error(c(310));
      ((Pe = e),
        (e = {
          memoizedState: Pe.memoizedState,
          baseState: Pe.baseState,
          baseQueue: Pe.baseQueue,
          queue: Pe.queue,
          next: null,
        }),
        dt === null ? (Ce.memoizedState = dt = e) : (dt = dt.next = e));
    }
    return dt;
  }
  function Gi() {
    return { lastEffect: null, events: null, stores: null, memoCache: null };
  }
  function hu(e) {
    var t = gu;
    return (
      (gu += 1),
      ur === null && (ur = []),
      (e = By(ur, e, t)),
      (t = Ce),
      (dt === null ? t.memoizedState : dt.next) === null &&
        ((t = t.alternate), (de.H = t === null || t.memoizedState === null ? wp : Rp)),
      e
    );
  }
  function qi(e) {
    if (e !== null && typeof e == 'object') {
      if (typeof e.then == 'function') return hu(e);
      if (e.$$typeof === $) return;
      if (e.$$typeof === ie) return _t(e);
    }
    throw Error(c(438, String(e)));
  }
  function os(e) {
    var t = null,
      n = Ce.updateQueue;
    if ((n !== null && (t = n.memoCache), t == null)) {
      var l = Ce.alternate;
      l !== null &&
        ((l = l.updateQueue),
        l !== null &&
          ((l = l.memoCache),
          l != null &&
            (t = {
              data: l.data.map(function (u) {
                return u.slice();
              }),
              index: 0,
            })));
    }
    if (
      (t == null && (t = { data: [], index: 0 }),
      n === null && ((n = Gi()), (Ce.updateQueue = n)),
      (n.memoCache = t),
      (n = t.data[t.index]),
      n === void 0)
    )
      for (n = t.data[t.index] = Array(e), l = 0; l < e; l++) n[l] = be;
    return (t.index++, n);
  }
  function sl(e, t) {
    return typeof t == 'function' ? t(e) : t;
  }
  function Yi(e) {
    var t = ct();
    return cs(t, Pe, e);
  }
  function cs(e, t, n) {
    var l = e.queue;
    if (l === null) throw Error(c(311));
    l.lastRenderedReducer = n;
    var u = e.baseQueue,
      i = l.pending;
    if (i !== null) {
      if (u !== null) {
        var s = u.next;
        ((u.next = i.next), (i.next = s));
      }
      ((t.baseQueue = u = i), (l.pending = null));
    }
    if (((i = e.baseState), u === null)) e.memoizedState = i;
    else {
      t = u.next;
      var h = (s = null),
        O = null,
        M = t,
        H = !1;
      do {
        var V = M.lane & -536870913;
        if (V !== M.lane ? (Be & V) === V : (cl & V) === V) {
          var D = M.revertLane;
          if (D === 0)
            (O !== null &&
              (O = O.next =
                {
                  lane: 0,
                  revertLane: 0,
                  gesture: null,
                  action: M.action,
                  hasEagerState: M.hasEagerState,
                  eagerState: M.eagerState,
                  next: null,
                }),
              V === va && (H = !0));
          else if ((cl & D) === D) {
            ((M = M.next), D === va && (H = !0));
            continue;
          } else
            ((V = {
              lane: 0,
              revertLane: M.revertLane,
              gesture: null,
              action: M.action,
              hasEagerState: M.hasEagerState,
              eagerState: M.eagerState,
              next: null,
            }),
              O === null ? ((h = O = V), (s = i)) : (O = O.next = V),
              (Ce.lanes |= D),
              (Hl |= D));
          ((V = M.action), Ta && n(i, V), (i = M.hasEagerState ? M.eagerState : n(i, V)));
        } else
          ((D = {
            lane: V,
            revertLane: M.revertLane,
            gesture: M.gesture,
            action: M.action,
            hasEagerState: M.hasEagerState,
            eagerState: M.eagerState,
            next: null,
          }),
            O === null ? ((h = O = D), (s = i)) : (O = O.next = D),
            (Ce.lanes |= V),
            (Hl |= V));
        M = M.next;
      } while (M !== null && M !== t);
      if (
        (O === null ? (s = i) : (O.next = h),
        !Kt(i, e.memoizedState) && ((yt = !0), H && ((n = nr), n !== null)))
      )
        throw n;
      ((e.memoizedState = i), (e.baseState = s), (e.baseQueue = O), (l.lastRenderedState = i));
    }
    return (u === null && (l.lanes = 0), [e.memoizedState, l.dispatch]);
  }
  function ss(e) {
    var t = ct(),
      n = t.queue;
    if (n === null) throw Error(c(311));
    n.lastRenderedReducer = e;
    var l = n.dispatch,
      u = n.pending,
      i = t.memoizedState;
    if (u !== null) {
      n.pending = null;
      var s = (u = u.next);
      do ((i = e(i, s.action)), (s = s.next));
      while (s !== u);
      (Kt(i, t.memoizedState) || (yt = !0),
        (t.memoizedState = i),
        t.baseQueue === null && (t.baseState = i),
        (n.lastRenderedState = i));
    }
    return [i, l];
  }
  function Qy(e, t, n) {
    var l = Ce,
      u = ct(),
      i = Ne;
    if (i) {
      if (n === void 0) throw Error(c(407));
      n = n();
    } else n = t();
    var s = !Kt((Pe || u).memoizedState, n);
    if (
      (s && ((u.memoizedState = n), (yt = !0)),
      (u = u.queue),
      ys(Jy.bind(null, l, u, e), [e]),
      (e = u.getSnapshot !== t || s || (dt !== null && (dt.memoizedState.tag & 1) !== 0)),
      ir(e ? 9 : 8, { destroy: void 0 }, Ky.bind(null, l, u, n, t), null),
      e)
    ) {
      if (((l.flags |= 2048), We === null)) throw Error(c(349));
      i || (cl & 127) !== 0 || $y(l, t, n);
    }
    return n;
  }
  function $y(e, t, n) {
    ((e.flags |= 16384),
      (e = { getSnapshot: t, value: n }),
      (t = Ce.updateQueue),
      t === null
        ? ((t = Gi()), (Ce.updateQueue = t), (t.stores = [e]))
        : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e)));
  }
  function Ky(e, t, n, l) {
    ((t.value = n), (t.getSnapshot = l), Py(t) && Wy(e));
  }
  function Jy(e, t, n) {
    return n(function () {
      Py(t) && Wy(e);
    });
  }
  function Py(e) {
    var t = e.getSnapshot;
    e = e.value;
    try {
      var n = t();
      return !Kt(e, n);
    } catch {
      return !0;
    }
  }
  function Wy(e) {
    var t = da(e, 2);
    t !== null && Zt(t, e, 2);
  }
  function fs(e) {
    var t = Bt();
    if (typeof e == 'function') {
      var n = e;
      if (((e = n()), Ta)) {
        Ln(!0);
        try {
          n();
        } finally {
          Ln(!1);
        }
      }
    }
    return (
      (t.memoizedState = t.baseState = e),
      (t.queue = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: sl,
        lastRenderedState: e,
      }),
      t
    );
  }
  function ep(e, t, n, l) {
    return ((e.baseState = n), cs(e, Pe, typeof l == 'function' ? l : sl));
  }
  function Cb(e, t, n, l, u) {
    if (Zi(e)) throw Error(c(485));
    if (((e = t.action), e !== null)) {
      var i = {
        payload: u,
        action: e,
        next: null,
        isTransition: !0,
        status: 'pending',
        value: null,
        reason: null,
        listeners: [],
        then: function (s) {
          i.listeners.push(s);
        },
      };
      (de.T !== null ? n(!0) : (i.isTransition = !1),
        l(i),
        (n = t.pending),
        n === null
          ? ((i.next = t.pending = i), tp(t, i))
          : ((i.next = n.next), (t.pending = n.next = i)));
    }
  }
  function tp(e, t) {
    var n = t.action,
      l = t.payload,
      u = e.state;
    if (t.isTransition) {
      var i = de.T,
        s = {};
      ((s.types = i !== null ? i.types : null), (de.T = s));
      try {
        var h = n(u, l),
          O = de.S;
        (O !== null && O(s, h), np(e, t, h));
      } catch (M) {
        ds(e, t, M);
      } finally {
        (i !== null && s.types !== null && (i.types = s.types), (de.T = i));
      }
    } else
      try {
        ((i = n(u, l)), np(e, t, i));
      } catch (M) {
        ds(e, t, M);
      }
  }
  function np(e, t, n) {
    n !== null && typeof n == 'object' && typeof n.then == 'function'
      ? n.then(
          function (l) {
            lp(e, t, l);
          },
          function (l) {
            return ds(e, t, l);
          },
        )
      : lp(e, t, n);
  }
  function lp(e, t, n) {
    ((t.status = 'fulfilled'),
      (t.value = n),
      ap(t),
      (e.state = n),
      (t = e.pending),
      t !== null &&
        ((n = t.next), n === t ? (e.pending = null) : ((n = n.next), (t.next = n), tp(e, n))));
  }
  function ds(e, t, n) {
    var l = e.pending;
    if (((e.pending = null), l !== null)) {
      l = l.next;
      do ((t.status = 'rejected'), (t.reason = n), ap(t), (t = t.next));
      while (t !== l);
    }
    e.action = null;
  }
  function ap(e) {
    e = e.listeners;
    for (var t = 0; t < e.length; t++) (0, e[t])();
  }
  function rp(e, t) {
    return t;
  }
  function up(e, t) {
    if (Ne) {
      var n = We.formState;
      if (n !== null) {
        e: {
          var l = Ce;
          if (Ne) {
            if (et) {
              t: {
                for (var u = et, i = gn; u.nodeType !== 8;) {
                  if (!i) {
                    u = null;
                    break t;
                  }
                  if (((u = mn(u.nextSibling)), u === null)) {
                    u = null;
                    break t;
                  }
                }
                ((i = u.data), (u = i === 'F!' || i === 'F' ? u : null));
              }
              if (u) {
                ((et = mn(u.nextSibling)), (l = u.data === 'F!'));
                break e;
              }
            }
            Cl(l);
          }
          l = !1;
        }
        l && (t = n[0]);
      }
    }
    return (
      (n = Bt()),
      (n.memoizedState = n.baseState = t),
      (l = {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: rp,
        lastRenderedState: t,
      }),
      (n.queue = l),
      (n = Ap.bind(null, Ce, l)),
      (l.dispatch = n),
      (l = fs(!1)),
      (i = vs.bind(null, Ce, !1, l.queue)),
      (l = Bt()),
      (u = { state: t, dispatch: null, action: e, pending: null }),
      (l.queue = u),
      (n = Cb.bind(null, Ce, u, i, n)),
      (u.dispatch = n),
      (l.memoizedState = e),
      [t, n, !1]
    );
  }
  function ip(e) {
    var t = ct();
    return op(t, Pe, e);
  }
  function op(e, t, n) {
    if (
      ((t = cs(e, t, rp)[0]),
      (e = Yi(sl)[0]),
      typeof t == 'object' && t !== null && typeof t.then == 'function')
    )
      try {
        var l = hu(t);
      } catch (s) {
        throw s === lr ? Mi : s;
      }
    else l = t;
    t = ct();
    var u = t.queue,
      i = u.dispatch;
    return (
      n !== t.memoizedState &&
        ((Ce.flags |= 2048), ir(9, { destroy: void 0 }, wb.bind(null, u, n), null)),
      [l, i, e]
    );
  }
  function wb(e, t) {
    e.action = t;
  }
  function cp(e) {
    var t = ct(),
      n = Pe;
    if (n !== null) return op(t, n, e);
    (ct(), (t = t.memoizedState), (n = ct()));
    var l = n.queue.dispatch;
    return ((n.memoizedState = e), [t, l, !1]);
  }
  function ir(e, t, n, l) {
    return (
      (e = { tag: e, create: n, deps: l, inst: t, next: null }),
      (t = Ce.updateQueue),
      t === null && ((t = Gi()), (Ce.updateQueue = t)),
      (n = t.lastEffect),
      n === null
        ? (t.lastEffect = e.next = e)
        : ((l = n.next), (n.next = e), (e.next = l), (t.lastEffect = e)),
      e
    );
  }
  function sp() {
    return ct().memoizedState;
  }
  function Vi(e, t, n, l) {
    var u = Bt();
    ((Ce.flags |= e),
      (u.memoizedState = ir(1 | t, { destroy: void 0 }, n, l === void 0 ? null : l)));
  }
  function Ii(e, t, n, l) {
    var u = ct();
    l = l === void 0 ? null : l;
    var i = u.memoizedState.inst;
    Pe !== null && l !== null && ls(l, Pe.memoizedState.deps)
      ? (u.memoizedState = ir(t, i, n, l))
      : ((Ce.flags |= e), (u.memoizedState = ir(1 | t, i, n, l)));
  }
  function fp(e, t) {
    Vi(8390656, 8, e, t);
  }
  function ys(e, t) {
    Ii(2048, 8, e, t);
  }
  function Rb(e) {
    Ce.flags |= 4;
    var t = Ce.updateQueue;
    if (t === null) ((t = Gi()), (Ce.updateQueue = t), (t.events = [e]));
    else {
      var n = t.events;
      n === null ? (t.events = [e]) : n.push(e);
    }
  }
  function dp(e) {
    var t = ct().memoizedState;
    return (
      Rb({ ref: t, nextImpl: e }),
      function () {
        if ((Ie & 2) !== 0) throw Error(c(440));
        return t.impl.apply(void 0, arguments);
      }
    );
  }
  function yp(e, t) {
    return Ii(4, 2, e, t);
  }
  function pp(e, t) {
    return Ii(4, 4, e, t);
  }
  function gp(e, t) {
    if (typeof t == 'function') {
      e = e();
      var n = t(e);
      return function () {
        typeof n == 'function' ? n() : t(null);
      };
    }
    if (t != null)
      return (
        (e = e()),
        (t.current = e),
        function () {
          t.current = null;
        }
      );
  }
  function hp(e, t, n) {
    ((n = n != null ? n.concat([e]) : null), Ii(4, 4, gp.bind(null, t, e), n));
  }
  function ps() {}
  function mp(e, t) {
    var n = ct();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    return t !== null && ls(t, l[1]) ? l[0] : ((n.memoizedState = [e, t]), e);
  }
  function vp(e, t) {
    var n = ct();
    t = t === void 0 ? null : t;
    var l = n.memoizedState;
    if (t !== null && ls(t, l[1])) return l[0];
    if (((l = e()), Ta)) {
      Ln(!0);
      try {
        e();
      } finally {
        Ln(!1);
      }
    }
    return ((n.memoizedState = [l, t]), l);
  }
  function gs(e, t, n) {
    return n === void 0 || ((cl & 1073741824) !== 0 && (Be & 261930) === 0)
      ? (e.memoizedState = t)
      : ((e.memoizedState = n), (e = wg()), (Ce.lanes |= e), (Hl |= e), n);
  }
  function bp(e, t, n, l) {
    return Kt(n, t)
      ? n
      : Ml.current !== null
        ? ((e = gs(e, n, l)), Kt(e, t) || (yt = !0), e)
        : (cl & 106) === 0 || ((cl & 1073741824) !== 0 && (Be & 261930) === 0)
          ? ((yt = !0), (e.memoizedState = n))
          : ((e = wg()), (Ce.lanes |= e), (Hl |= e), t);
  }
  function Ep(e, t, n, l, u) {
    var i = Se.p;
    Se.p = i !== 0 && 8 > i ? i : 8;
    var s = de.T,
      h = {};
    ((h.types = s !== null ? s.types : null), (de.T = h), vs(e, !1, t, n));
    try {
      var O = u(),
        M = de.S;
      if (
        (M !== null && M(h, O), O !== null && typeof O == 'object' && typeof O.then == 'function')
      ) {
        var H = Ob(O, l);
        mu(e, t, H, tn(e));
      } else mu(e, t, l, tn(e));
    } catch (V) {
      mu(e, t, { then: function () {}, status: 'rejected', reason: V }, tn());
    } finally {
      ((Se.p = i), s !== null && h.types !== null && (s.types = h.types), (de.T = s));
    }
  }
  function Nb() {}
  function hs(e, t, n, l) {
    if (e.tag !== 5) throw Error(c(476));
    var u = Sp(e).queue;
    Ep(
      e,
      u,
      t,
      Xt,
      n === null
        ? Nb
        : function () {
            return (_p(e), n(l));
          },
    );
  }
  function Sp(e) {
    var t = e.memoizedState;
    if (t !== null) return t;
    t = {
      memoizedState: Xt,
      baseState: Xt,
      baseQueue: null,
      queue: {
        pending: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: sl,
        lastRenderedState: Xt,
      },
      next: null,
    };
    var n = {};
    return (
      (t.next = {
        memoizedState: n,
        baseState: n,
        baseQueue: null,
        queue: {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: sl,
          lastRenderedState: n,
        },
        next: null,
      }),
      (e.memoizedState = t),
      (e = e.alternate),
      e !== null && (e.memoizedState = t),
      t
    );
  }
  function _p(e) {
    var t = Sp(e);
    (t.next === null && (t = e.alternate.memoizedState), mu(e, t.next.queue, {}, tn()));
  }
  function ms() {
    return _t(xr);
  }
  function Tp() {
    return ct().memoizedState;
  }
  function Op() {
    return ct().memoizedState;
  }
  function Db(e) {
    for (var t = e.return; t !== null;) {
      switch (t.tag) {
        case 24:
        case 3:
          var n = tn();
          e = Dl(n);
          var l = jl(t, e, n);
          (l !== null && (Zt(l, t, n), fu(l, t, n)), (t = { cache: Ic() }), (e.payload = t));
          return;
      }
      t = t.return;
    }
  }
  function jb(e, t, n) {
    var l = tn();
    ((n = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    }),
      Zi(e) ? xp(t, n) : ((n = Uc(e, t, n, l)), n !== null && (Zt(n, e, l), Cp(n, t, l))));
  }
  function Ap(e, t, n) {
    var l = tn();
    mu(e, t, n, l);
  }
  function mu(e, t, n, l) {
    var u = {
      lane: l,
      revertLane: 0,
      gesture: null,
      action: n,
      hasEagerState: !1,
      eagerState: null,
      next: null,
    };
    if (Zi(e)) xp(t, u);
    else {
      var i = e.alternate;
      if (
        e.lanes === 0 &&
        (i === null || i.lanes === 0) &&
        ((i = t.lastRenderedReducer), i !== null)
      )
        try {
          var s = t.lastRenderedState,
            h = i(s, n);
          if (((u.hasEagerState = !0), (u.eagerState = h), Kt(h, s)))
            return (Ti(e, t, u, 0), We === null && _i(), !1);
        } catch {
        } finally {
        }
      if (((n = Uc(e, t, u, l)), n !== null)) return (Zt(n, e, l), Cp(n, t, l), !0);
    }
    return !1;
  }
  function vs(e, t, n, l) {
    if (
      ((l = {
        lane: 2,
        revertLane: cf(),
        gesture: null,
        action: l,
        hasEagerState: !1,
        eagerState: null,
        next: null,
      }),
      Zi(e))
    ) {
      if (t) throw Error(c(479));
    } else ((t = Uc(e, n, l, 2)), t !== null && Zt(t, e, 2));
  }
  function Zi(e) {
    var t = e.alternate;
    return e === Ce || (t !== null && t === Ce);
  }
  function xp(e, t) {
    rr = Hi = !0;
    var n = e.pending;
    (n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t));
  }
  function Cp(e, t, n) {
    if ((n & 4194048) !== 0) {
      var l = t.lanes;
      ((l &= e.pendingLanes), (n |= l), (t.lanes = n), Ga(e, n));
    }
  }
  var Xi = {
      readContext: _t,
      use: qi,
      useCallback: it,
      useContext: it,
      useEffect: it,
      useImperativeHandle: it,
      useLayoutEffect: it,
      useInsertionEffect: it,
      useMemo: it,
      useReducer: it,
      useRef: it,
      useState: it,
      useDebugValue: it,
      useDeferredValue: it,
      useTransition: it,
      useSyncExternalStore: it,
      useId: it,
      useHostTransitionStatus: it,
      useFormState: it,
      useActionState: it,
      useOptimistic: it,
      useMemoCache: it,
      useCacheRefresh: it,
      useEffectEvent: it,
    },
    wp = {
      readContext: _t,
      use: qi,
      useCallback: function (e, t) {
        return ((Bt().memoizedState = [e, t === void 0 ? null : t]), e);
      },
      useContext: _t,
      useEffect: fp,
      useImperativeHandle: function (e, t, n) {
        ((n = n != null ? n.concat([e]) : null), Vi(4194308, 4, gp.bind(null, t, e), n));
      },
      useLayoutEffect: function (e, t) {
        return Vi(4194308, 4, e, t);
      },
      useInsertionEffect: function (e, t) {
        Vi(4, 2, e, t);
      },
      useMemo: function (e, t) {
        var n = Bt();
        t = t === void 0 ? null : t;
        var l = e();
        if (Ta) {
          Ln(!0);
          try {
            e();
          } finally {
            Ln(!1);
          }
        }
        return ((n.memoizedState = [l, t]), l);
      },
      useReducer: function (e, t, n) {
        var l = Bt();
        if (n !== void 0) {
          var u = n(t);
          if (Ta) {
            Ln(!0);
            try {
              n(t);
            } finally {
              Ln(!1);
            }
          }
        } else u = t;
        return (
          (l.memoizedState = l.baseState = u),
          (e = {
            pending: null,
            lanes: 0,
            dispatch: null,
            lastRenderedReducer: e,
            lastRenderedState: u,
          }),
          (l.queue = e),
          (e = e.dispatch = jb.bind(null, Ce, e)),
          [l.memoizedState, e]
        );
      },
      useRef: function (e) {
        var t = Bt();
        return ((e = { current: e }), (t.memoizedState = e));
      },
      useState: function (e) {
        e = fs(e);
        var t = e.queue,
          n = Ap.bind(null, Ce, t);
        return ((t.dispatch = n), [e.memoizedState, n]);
      },
      useDebugValue: ps,
      useDeferredValue: function (e, t) {
        var n = Bt();
        return gs(n, e, t);
      },
      useTransition: function () {
        var e = fs(!1);
        return ((e = Ep.bind(null, Ce, e.queue, !0, !1)), (Bt().memoizedState = e), [!1, e]);
      },
      useSyncExternalStore: function (e, t, n) {
        var l = Ce,
          u = Bt();
        if (Ne) {
          if (n === void 0) throw Error(c(407));
          n = n();
        } else {
          if (((n = t()), We === null)) throw Error(c(349));
          (Be & 127) !== 0 || $y(l, t, n);
        }
        u.memoizedState = n;
        var i = { value: n, getSnapshot: t };
        return (
          (u.queue = i),
          fp(Jy.bind(null, l, i, e), [e]),
          (l.flags |= 2048),
          ir(9, { destroy: void 0 }, Ky.bind(null, l, i, n, t), null),
          n
        );
      },
      useId: function () {
        var e = Bt(),
          t = We.identifierPrefix;
        if (Ne) {
          var n = Bn,
            l = Un;
          ((n = (l & ~(1 << (32 - jt(l) - 1))).toString(32) + n),
            (t = '_' + t + 'R_' + n),
            (n = Fi++),
            0 < n && (t += 'H' + n.toString(32)),
            (t += '_'));
        } else ((n = Ab++), (t = '_' + t + 'r_' + n.toString(32) + '_'));
        return (e.memoizedState = t);
      },
      useHostTransitionStatus: ms,
      useFormState: up,
      useActionState: up,
      useOptimistic: function (e) {
        var t = Bt();
        t.memoizedState = t.baseState = e;
        var n = {
          pending: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: null,
          lastRenderedState: null,
        };
        return ((t.queue = n), (t = vs.bind(null, Ce, !0, n)), (n.dispatch = t), [e, t]);
      },
      useMemoCache: os,
      useCacheRefresh: function () {
        return (Bt().memoizedState = Db.bind(null, Ce));
      },
      useEffectEvent: function (e) {
        var t = Bt(),
          n = { impl: e };
        return (
          (t.memoizedState = n),
          function () {
            if ((Ie & 2) !== 0) throw Error(c(440));
            return n.impl.apply(void 0, arguments);
          }
        );
      },
    },
    Rp = {
      readContext: _t,
      use: qi,
      useCallback: mp,
      useContext: _t,
      useEffect: ys,
      useImperativeHandle: hp,
      useInsertionEffect: yp,
      useLayoutEffect: pp,
      useMemo: vp,
      useReducer: Yi,
      useRef: sp,
      useState: function () {
        return Yi(sl);
      },
      useDebugValue: ps,
      useDeferredValue: function (e, t) {
        var n = ct();
        return bp(n, Pe.memoizedState, e, t);
      },
      useTransition: function () {
        var e = Yi(sl)[0],
          t = ct().memoizedState;
        return [typeof e == 'boolean' ? e : hu(e), t];
      },
      useSyncExternalStore: Qy,
      useId: Tp,
      useHostTransitionStatus: ms,
      useFormState: ip,
      useActionState: ip,
      useOptimistic: function (e, t) {
        var n = ct();
        return ep(n, Pe, e, t);
      },
      useMemoCache: os,
      useCacheRefresh: Op,
      useEffectEvent: dp,
    },
    Mb = {
      readContext: _t,
      use: qi,
      useCallback: mp,
      useContext: _t,
      useEffect: ys,
      useImperativeHandle: hp,
      useInsertionEffect: yp,
      useLayoutEffect: pp,
      useMemo: vp,
      useReducer: ss,
      useRef: sp,
      useState: function () {
        return ss(sl);
      },
      useDebugValue: ps,
      useDeferredValue: function (e, t) {
        var n = ct();
        return Pe === null ? gs(n, e, t) : bp(n, Pe.memoizedState, e, t);
      },
      useTransition: function () {
        var e = ss(sl)[0],
          t = ct().memoizedState;
        return [typeof e == 'boolean' ? e : hu(e), t];
      },
      useSyncExternalStore: Qy,
      useId: Tp,
      useHostTransitionStatus: ms,
      useFormState: cp,
      useActionState: cp,
      useOptimistic: function (e, t) {
        var n = ct();
        return Pe !== null ? ep(n, Pe, e, t) : ((n.baseState = e), [e, n.queue.dispatch]);
      },
      useMemoCache: os,
      useCacheRefresh: Op,
      useEffectEvent: dp,
    };
  function bs(e, t, n, l) {
    ((t = e.memoizedState),
      (n = n(l, t)),
      (n = n == null ? t : Z({}, t, n)),
      (e.memoizedState = n),
      e.lanes === 0 && (e.updateQueue.baseState = n));
  }
  var Es = {
    enqueueSetState: function (e, t, n) {
      e = e._reactInternals;
      var l = tn(),
        u = Dl(l);
      ((u.payload = t),
        n != null && (u.callback = n),
        (t = jl(e, u, l)),
        t !== null && (Zt(t, e, l), fu(t, e, l)));
    },
    enqueueReplaceState: function (e, t, n) {
      e = e._reactInternals;
      var l = tn(),
        u = Dl(l);
      ((u.tag = 1),
        (u.payload = t),
        n != null && (u.callback = n),
        (t = jl(e, u, l)),
        t !== null && (Zt(t, e, l), fu(t, e, l)));
    },
    enqueueForceUpdate: function (e, t) {
      e = e._reactInternals;
      var n = tn(),
        l = Dl(n);
      ((l.tag = 2),
        t != null && (l.callback = t),
        (t = jl(e, l, n)),
        t !== null && (Zt(t, e, n), fu(t, e, n)));
    },
  };
  function Np(e, t, n, l, u, i, s) {
    return (
      (e = e.stateNode),
      typeof e.shouldComponentUpdate == 'function'
        ? e.shouldComponentUpdate(l, i, s)
        : t.prototype && t.prototype.isPureReactComponent
          ? !lu(n, l) || !lu(u, i)
          : !0
    );
  }
  function Dp(e, t, n, l) {
    ((e = t.state),
      typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(n, l),
      typeof t.UNSAFE_componentWillReceiveProps == 'function' &&
        t.UNSAFE_componentWillReceiveProps(n, l),
      t.state !== e && Es.enqueueReplaceState(t, t.state, null));
  }
  function Oa(e, t) {
    var n = t;
    if ('ref' in t) {
      n = {};
      for (var l in t) l !== 'ref' && (n[l] = t[l]);
    }
    if ((e = e.defaultProps)) {
      n === t && (n = Z({}, n));
      for (var u in e) n[u] === void 0 && (n[u] = e[u]);
    }
    return n;
  }
  function jp(e) {
    Si(e);
  }
  function Mp(e) {
    console.error(e);
  }
  function Lp(e) {
    Si(e);
  }
  function Qi(e, t) {
    try {
      var n = e.onUncaughtError;
      n(t.value, { componentStack: t.stack });
    } catch (l) {
      setTimeout(function () {
        throw l;
      });
    }
  }
  function zp(e, t, n) {
    try {
      var l = e.onCaughtError;
      l(n.value, { componentStack: n.stack, errorBoundary: t.tag === 1 ? t.stateNode : null });
    } catch (u) {
      setTimeout(function () {
        throw u;
      });
    }
  }
  function Ss(e, t, n) {
    return (
      (n = Dl(n)),
      (n.tag = 3),
      (n.payload = { element: null }),
      (n.callback = function () {
        Qi(e, t);
      }),
      n
    );
  }
  function Up(e) {
    return ((e = Dl(e)), (e.tag = 3), e);
  }
  function Bp(e, t, n, l) {
    var u = n.type.getDerivedStateFromError;
    if (typeof u == 'function') {
      var i = l.value;
      ((e.payload = function () {
        return u(i);
      }),
        (e.callback = function () {
          zp(t, n, l);
        }));
    }
    var s = n.stateNode;
    s !== null &&
      typeof s.componentDidCatch == 'function' &&
      (e.callback = function () {
        (zp(t, n, l),
          typeof u != 'function' && (Fl === null ? (Fl = new Set([this])) : Fl.add(this)));
        var h = l.stack;
        this.componentDidCatch(l.value, { componentStack: h !== null ? h : '' });
      });
  }
  function Lb(e, t, n, l, u) {
    if (((n.flags |= 32768), l !== null && typeof l == 'object' && typeof l.then == 'function')) {
      if (((t = n.alternate), t !== null && ha(t, n, u, !0), (n = Tt.current), n !== null)) {
        switch (n.tag) {
          case 31:
          case 13:
          case 19:
            return (
              Rt === null ? ho() : n.alternate === null && ot === 0 && (ot = 3),
              (n.flags &= -257),
              (n.flags |= 65536),
              (n.lanes = u),
              l === Li
                ? (n.flags |= 16384)
                : ((t = n.updateQueue),
                  t === null ? (n.updateQueue = new Set([l])) : t.add(l),
                  rf(e, l, u)),
              !1
            );
          case 22:
            return (
              (n.flags |= 65536),
              l === Li
                ? (n.flags |= 16384)
                : ((t = n.updateQueue),
                  t === null
                    ? ((t = { transitions: null, markerInstances: null, retryQueue: new Set([l]) }),
                      (n.updateQueue = t))
                    : ((n = t.retryQueue), n === null ? (t.retryQueue = new Set([l])) : n.add(l)),
                  rf(e, l, u)),
              !1
            );
        }
        throw Error(c(435, n.tag));
      }
      return (rf(e, l, u), ho(), !1);
    }
    if (Ne)
      return (
        (t = Tt.current),
        t !== null
          ? ((t.flags & 65536) === 0 && (t.flags |= 256),
            (t.flags |= 65536),
            (t.lanes = u),
            l !== Gc && ((e = Error(c(422), { cause: l })), uu(dn(e, n))))
          : (l !== Gc && ((t = Error(c(423), { cause: l })), uu(dn(t, n))),
            (e = e.current.alternate),
            (e.flags |= 65536),
            (u &= -u),
            (e.lanes |= u),
            (l = dn(l, n)),
            (u = Ss(e.stateNode, l, u)),
            Jc(e, u),
            ot !== 4 && (ot = 2)),
        !1
      );
    var i = Error(c(520), { cause: l });
    if (((i = dn(i, n)), Au === null ? (Au = [i]) : Au.push(i), ot !== 4 && (ot = 2), t === null))
      return !0;
    ((l = dn(l, n)), (n = t));
    do {
      switch (n.tag) {
        case 3:
          return (
            (n.flags |= 65536),
            (e = u & -u),
            (n.lanes |= e),
            (e = Ss(n.stateNode, l, e)),
            Jc(n, e),
            !1
          );
        case 1:
          if (
            ((t = n.type),
            (i = n.stateNode),
            (n.flags & 128) === 0 &&
              (typeof t.getDerivedStateFromError == 'function' ||
                (i !== null &&
                  typeof i.componentDidCatch == 'function' &&
                  (Fl === null || !Fl.has(i)))))
          )
            return (
              (n.flags |= 65536),
              (u &= -u),
              (n.lanes |= u),
              (u = Up(u)),
              Bp(u, e, n, l),
              Jc(n, u),
              !1
            );
          break;
        case 22:
          if (n.memoizedState !== null) return ((n.flags |= 65536), !1);
      }
      n = n.return;
    } while (n !== null);
    return !1;
  }
  var _s = Error(c(461)),
    yt = !1;
  function vt(e, t, n, l) {
    t.child = e === null ? Gy(t, null, n, l) : _a(t, e.child, n, l);
  }
  function kp(e, t, n, l, u) {
    n = n.render;
    var i = t.ref;
    if ('ref' in l) {
      var s = {};
      for (var h in l) h !== 'ref' && (s[h] = l[h]);
    } else s = l;
    return (
      ma(t),
      (l = as(e, t, n, s, i, u)),
      (h = rs()),
      e !== null && !yt
        ? (us(e, t, u), fl(e, t, u))
        : (Ne && h && Ci(t), (t.flags |= 1), vt(e, t, l, u), t.child)
    );
  }
  function Hp(e, t, n, l, u) {
    if (e === null) {
      var i = n.type;
      return typeof i == 'function' && !Bc(i) && i.defaultProps === void 0 && n.compare === null
        ? ((t.tag = 15), (t.type = i), Fp(e, t, i, l, u))
        : ((e = Ai(n.type, null, l, t, t.mode, u)), (e.ref = t.ref), (e.return = t), (t.child = e));
    }
    if (((i = e.child), !Ns(e, u))) {
      var s = i.memoizedProps;
      if (((n = n.compare), (n = n !== null ? n : lu), n(s, l) && e.ref === t.ref))
        return fl(e, t, u);
    }
    return ((t.flags |= 1), (e = rl(i, l)), (e.ref = t.ref), (e.return = t), (t.child = e));
  }
  function Fp(e, t, n, l, u) {
    if (e !== null) {
      var i = e.memoizedProps;
      if (lu(i, l) && e.ref === t.ref)
        if (((yt = !1), (t.pendingProps = l = i), Ns(e, u))) (e.flags & 131072) !== 0 && (yt = !0);
        else return ((t.lanes = e.lanes), fl(e, t, u));
    }
    return Ts(e, t, n, l, u);
  }
  function Gp(e, t, n, l) {
    var u = l.children,
      i = e !== null ? e.memoizedState : null;
    if (
      (e === null &&
        t.stateNode === null &&
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      l.mode === 'hidden')
    ) {
      if ((t.flags & 128) !== 0) {
        if (((i = i !== null ? i.baseLanes | n : n), e !== null)) {
          for (l = t.child = e.child, u = 0; l !== null;)
            ((u = u | l.lanes | l.childLanes), (l = l.sibling));
          l = u & ~i;
        } else ((l = 0), (t.child = null));
        return qp(e, t, i, n, l);
      }
      if ((n & 536870912) !== 0)
        ((t.memoizedState = { baseLanes: 0, cachePool: null }),
          e !== null && ji(t, i !== null ? i.cachePool : null),
          i !== null ? Vy(t, i) : Wc(),
          Iy(t));
      else return ((l = t.lanes = 536870912), qp(e, t, i !== null ? i.baseLanes | n : n, n, l));
    } else
      i !== null
        ? (ji(t, i.cachePool), Vy(t, i), zl(), (t.memoizedState = null))
        : (e !== null && ji(t, null), Wc(), zl());
    return (vt(e, t, u, n), t.child);
  }
  function vu(e, t) {
    return (
      (e !== null && e.tag === 22) ||
        t.stateNode !== null ||
        (t.stateNode = {
          _visibility: 1,
          _pendingMarkers: null,
          _retryCache: null,
          _transitions: null,
        }),
      t.sibling
    );
  }
  function qp(e, t, n, l, u) {
    var i = Xc();
    return (
      (i = i === null ? null : { parent: ft._currentValue, pool: i }),
      (t.memoizedState = { baseLanes: n, cachePool: i }),
      e !== null && ji(t, null),
      Wc(),
      Iy(t),
      e !== null && ha(e, t, l, !0),
      (t.childLanes = u),
      null
    );
  }
  function $i(e, t) {
    return (
      (t = Ki({ mode: t.mode, children: t.children }, e.mode)),
      (t.ref = e.ref),
      (e.child = t),
      (t.return = e),
      t
    );
  }
  function Yp(e, t, n) {
    return (
      _a(t, e.child, null, n),
      (e = $i(t, t.pendingProps)),
      (e.flags |= 2),
      Jt(t),
      (t.memoizedState = null),
      e
    );
  }
  function zb(e, t, n) {
    var l = t.pendingProps,
      u = (t.flags & 128) !== 0;
    if (((t.flags &= -129), e === null)) {
      if (Ne) {
        if (l.mode === 'hidden')
          return (
            (e = $i(t, l)),
            (t.lanes = 536870912),
            (e.memoizedState = { baseLanes: 0, cachePool: null }),
            vu(null, e)
          );
        if (
          (ts(t),
          (e = et)
            ? ((e = gh(e, gn)),
              (e = e !== null && e.data === '&' ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: Al !== null ? { id: Un, overflow: Bn } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (n = xy(e)),
                (n.return = t),
                (t.child = n),
                (bt = t),
                (et = null)))
            : (e = null),
          e === null)
        )
          throw Cl(t);
        return ((t.lanes = 536870912), null);
      }
      return $i(t, l);
    }
    var i = e.memoizedState;
    if (i !== null) {
      var s = i.dehydrated;
      if ((ts(t), u))
        if (t.flags & 256) ((t.flags &= -257), (t = Yp(e, t, n)));
        else if (t.memoizedState !== null) ((t.child = e.child), (t.flags |= 128), (t = null));
        else throw Error(c(558));
      else if ((yt || ha(e, t, n, !1), (u = (n & e.childLanes) !== 0), yt || u)) {
        if (Ml.current === null) {
          if (((l = We), l !== null && ((s = ai(l, n)), s !== 0 && s !== i.retryLane)))
            throw ((i.retryLane = s), da(e, s), Zt(l, e, s), _s);
          ho();
        }
        t = Yp(e, t, n);
      } else
        ((e = i.treeContext),
          (et = mn(s.nextSibling)),
          (bt = t),
          (Ne = !0),
          (xl = null),
          (gn = !1),
          e !== null && Ry(t, e),
          (t = $i(t, l)),
          (t.flags |= 134221824));
      return t;
    }
    return (
      (e = rl(e.child, { mode: l.mode, children: l.children })),
      (e.ref = t.ref),
      (t.child = e),
      (e.return = t),
      e
    );
  }
  function or(e, t) {
    var n = t.ref;
    if (n === null) e !== null && e.ref !== null && (t.flags |= 4194816);
    else {
      if (typeof n != 'function' && typeof n != 'object') throw Error(c(284));
      (e === null || e.ref !== n) && (t.flags |= 4194816);
    }
  }
  function Ts(e, t, n, l, u) {
    return (
      ma(t),
      (n = as(e, t, n, l, void 0, u)),
      (l = rs()),
      e !== null && !yt
        ? (us(e, t, u), fl(e, t, u))
        : (Ne && l && Ci(t), (t.flags |= 1), vt(e, t, n, u), t.child)
    );
  }
  function Vp(e, t, n, l, u, i) {
    return (
      ma(t),
      (t.updateQueue = null),
      (n = Xy(t, l, n, u)),
      Zy(e),
      (l = rs()),
      e !== null && !yt
        ? (us(e, t, i), fl(e, t, i))
        : (Ne && l && Ci(t), (t.flags |= 1), vt(e, t, n, i), t.child)
    );
  }
  function Ip(e, t, n, l, u) {
    if ((ma(t), t.stateNode === null)) {
      var i = Pa,
        s = n.contextType;
      (typeof s == 'object' && s !== null && (i = _t(s)),
        (i = new n(l, i)),
        (t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null),
        (i.updater = Es),
        (t.stateNode = i),
        (i._reactInternals = t),
        (i = t.stateNode),
        (i.props = l),
        (i.state = t.memoizedState),
        (i.refs = {}),
        $c(t),
        (s = n.contextType),
        (i.context = typeof s == 'object' && s !== null ? _t(s) : Pa),
        (i.state = t.memoizedState),
        (s = n.getDerivedStateFromProps),
        typeof s == 'function' && (bs(t, n, s, l), (i.state = t.memoizedState)),
        typeof n.getDerivedStateFromProps == 'function' ||
          typeof i.getSnapshotBeforeUpdate == 'function' ||
          (typeof i.UNSAFE_componentWillMount != 'function' &&
            typeof i.componentWillMount != 'function') ||
          ((s = i.state),
          typeof i.componentWillMount == 'function' && i.componentWillMount(),
          typeof i.UNSAFE_componentWillMount == 'function' && i.UNSAFE_componentWillMount(),
          s !== i.state && Es.enqueueReplaceState(i, i.state, null),
          yu(t, l, i, u),
          du(),
          (i.state = t.memoizedState)),
        typeof i.componentDidMount == 'function' && (t.flags |= 4194308),
        (l = !0));
    } else if (e === null) {
      i = t.stateNode;
      var h = t.memoizedProps,
        O = Oa(n, h);
      i.props = O;
      var M = i.context,
        H = n.contextType;
      ((s = Pa), typeof H == 'object' && H !== null && (s = _t(H)));
      var V = n.getDerivedStateFromProps;
      ((H = typeof V == 'function' || typeof i.getSnapshotBeforeUpdate == 'function'),
        (h = t.pendingProps !== h),
        H ||
          (typeof i.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof i.componentWillReceiveProps != 'function') ||
          ((h || M !== s) && Dp(t, i, l, s)),
        (Nl = !1));
      var D = t.memoizedState;
      ((i.state = D),
        yu(t, l, i, u),
        du(),
        (M = t.memoizedState),
        h || D !== M || Nl
          ? (typeof V == 'function' && (bs(t, n, V, l), (M = t.memoizedState)),
            (O = Nl || Np(t, n, O, l, D, M, s))
              ? (H ||
                  (typeof i.UNSAFE_componentWillMount != 'function' &&
                    typeof i.componentWillMount != 'function') ||
                  (typeof i.componentWillMount == 'function' && i.componentWillMount(),
                  typeof i.UNSAFE_componentWillMount == 'function' &&
                    i.UNSAFE_componentWillMount()),
                typeof i.componentDidMount == 'function' && (t.flags |= 4194308))
              : (typeof i.componentDidMount == 'function' && (t.flags |= 4194308),
                (t.memoizedProps = l),
                (t.memoizedState = M)),
            (i.props = l),
            (i.state = M),
            (i.context = s),
            (l = O))
          : (typeof i.componentDidMount == 'function' && (t.flags |= 4194308), (l = !1)));
    } else {
      ((i = t.stateNode),
        Kc(e, t),
        (s = t.memoizedProps),
        (H = Oa(n, s)),
        (i.props = H),
        (V = t.pendingProps),
        (D = i.context),
        (M = n.contextType),
        (O = Pa),
        typeof M == 'object' && M !== null && (O = _t(M)),
        (h = n.getDerivedStateFromProps),
        (M = typeof h == 'function' || typeof i.getSnapshotBeforeUpdate == 'function') ||
          (typeof i.UNSAFE_componentWillReceiveProps != 'function' &&
            typeof i.componentWillReceiveProps != 'function') ||
          ((s !== V || D !== O) && Dp(t, i, l, O)),
        (Nl = !1),
        (D = t.memoizedState),
        (i.state = D),
        yu(t, l, i, u),
        du());
      var U = t.memoizedState;
      s !== V || D !== U || Nl || (e !== null && e.dependencies !== null && Ni(e.dependencies))
        ? (typeof h == 'function' && (bs(t, n, h, l), (U = t.memoizedState)),
          (H =
            Nl ||
            Np(t, n, H, l, D, U, O) ||
            (e !== null && e.dependencies !== null && Ni(e.dependencies)))
            ? (M ||
                (typeof i.UNSAFE_componentWillUpdate != 'function' &&
                  typeof i.componentWillUpdate != 'function') ||
                (typeof i.componentWillUpdate == 'function' && i.componentWillUpdate(l, U, O),
                typeof i.UNSAFE_componentWillUpdate == 'function' &&
                  i.UNSAFE_componentWillUpdate(l, U, O)),
              typeof i.componentDidUpdate == 'function' && (t.flags |= 4),
              typeof i.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
            : (typeof i.componentDidUpdate != 'function' ||
                (s === e.memoizedProps && D === e.memoizedState) ||
                (t.flags |= 4),
              typeof i.getSnapshotBeforeUpdate != 'function' ||
                (s === e.memoizedProps && D === e.memoizedState) ||
                (t.flags |= 1024),
              (t.memoizedProps = l),
              (t.memoizedState = U)),
          (i.props = l),
          (i.state = U),
          (i.context = O),
          (l = H))
        : (typeof i.componentDidUpdate != 'function' ||
            (s === e.memoizedProps && D === e.memoizedState) ||
            (t.flags |= 4),
          typeof i.getSnapshotBeforeUpdate != 'function' ||
            (s === e.memoizedProps && D === e.memoizedState) ||
            (t.flags |= 1024),
          (l = !1));
    }
    return (
      (i = l),
      or(e, t),
      (l = (t.flags & 128) !== 0),
      i || l
        ? ((i = t.stateNode),
          (n = l && typeof n.getDerivedStateFromError != 'function' ? null : i.render()),
          (t.flags |= 1),
          e !== null && l
            ? ((t.child = _a(t, e.child, null, u)), (t.child = _a(t, null, n, u)))
            : vt(e, t, n, u),
          (t.memoizedState = i.state),
          (e = t.child))
        : (e = fl(e, t, u)),
      e
    );
  }
  function Zp(e, t, n, l) {
    return (pa(), (t.flags |= 256), vt(e, t, n, l), t.child);
  }
  var Os = { dehydrated: null, treeContext: null, retryLane: 0, hydrationErrors: null };
  function As(e) {
    return { baseLanes: e, cachePool: zy() };
  }
  function xs(e, t, n) {
    return ((e = e !== null ? e.childLanes & ~n : 0), t && (e |= en), e);
  }
  function Xp(e, t, n) {
    var l = t.pendingProps,
      u = !1,
      i = (t.flags & 128) !== 0,
      s;
    if (
      ((s = i) || (s = e !== null && e.memoizedState === null ? !1 : (Ot.current & 2) !== 0),
      s && ((u = !0), (t.flags &= -129)),
      (s = (t.flags & 32) !== 0),
      (t.flags &= -33),
      e === null)
    ) {
      if (Ne) {
        if (
          (u ? Ll(t) : zl(),
          (e = et)
            ? ((e = gh(e, gn)),
              (e = e !== null && e.data !== '&' ? e : null),
              e !== null &&
                ((t.memoizedState = {
                  dehydrated: e,
                  treeContext: Al !== null ? { id: Un, overflow: Bn } : null,
                  retryLane: 536870912,
                  hydrationErrors: null,
                }),
                (n = xy(e)),
                (n.return = t),
                (t.child = n),
                (bt = t),
                (et = null)))
            : (e = null),
          e === null)
        )
          throw Cl(t);
        return (xf(e) ? (t.lanes = 32) : (t.lanes = 536870912), null);
      }
      return (
        (i = l.children),
        (l = l.fallback),
        u
          ? (zl(),
            (u = t.mode),
            (i = Ki({ mode: 'hidden', children: i }, u)),
            (l = ya(l, u, n, null)),
            (i.return = t),
            (l.return = t),
            (i.sibling = l),
            (t.child = i),
            (l = t.child),
            (l.memoizedState = As(n)),
            (l.childLanes = xs(e, s, n)),
            (t.memoizedState = Os),
            vu(null, l))
          : (Ll(t), Cs(t, i))
      );
    }
    var h = e.memoizedState;
    if (h !== null) {
      var O = h.dehydrated;
      if (O !== null) return Ub(e, t, i, s, l, O, h, n);
    }
    return u
      ? (zl(),
        (u = l.fallback),
        (i = t.mode),
        (h = e.child),
        (O = h.sibling),
        (l = rl(h, { mode: 'hidden', children: l.children })),
        (l.subtreeFlags = h.subtreeFlags & 1206910976),
        O !== null ? (u = rl(O, u)) : ((u = ya(u, i, n, null)), (u.flags |= 2)),
        (u.return = t),
        (l.return = t),
        (l.sibling = u),
        (t.child = l),
        vu(null, l),
        (l = t.child),
        (u = e.child.memoizedState),
        u === null
          ? (u = As(n))
          : ((i = u.cachePool),
            i !== null
              ? ((h = ft._currentValue), (i = i.parent !== h ? { parent: h, pool: h } : i))
              : (i = zy()),
            (u = { baseLanes: u.baseLanes | n, cachePool: i })),
        (l.memoizedState = u),
        (l.childLanes = xs(e, s, n)),
        (t.memoizedState = Os),
        vu(e.child, l))
      : (Ll(t),
        (n = e.child),
        (e = n.sibling),
        (n = rl(n, { mode: 'visible', children: l.children })),
        (n.return = t),
        (n.sibling = null),
        e !== null &&
          ((s = t.deletions), s === null ? ((t.deletions = [e]), (t.flags |= 16)) : s.push(e)),
        (t.child = n),
        (t.memoizedState = null),
        n);
  }
  function Cs(e, t) {
    return ((t = Ki({ mode: 'visible', children: t }, e.mode)), (t.return = e), (e.child = t));
  }
  function Ki(e, t) {
    return ((e = qt(22, e, null, t)), (e.lanes = 0), e);
  }
  function Ji(e, t, n) {
    return (
      _a(t, e.child, null, n),
      (e = Cs(t, t.pendingProps.children)),
      (e.flags |= 2),
      (t.memoizedState = null),
      e
    );
  }
  function Ub(e, t, n, l, u, i, s, h) {
    if (n)
      return t.flags & 256
        ? (Ll(t), (t.flags &= -257), Ji(e, t, h))
        : t.memoizedState !== null
          ? (zl(), (t.child = e.child), (t.flags |= 128), null)
          : (zl(),
            (i = u.fallback),
            (s = t.mode),
            (u = Ki({ mode: 'visible', children: u.children }, s)),
            (i = ya(i, s, h, null)),
            (i.flags |= 2),
            (u.return = t),
            (i.return = t),
            (u.sibling = i),
            (t.child = u),
            _a(t, e.child, null, h),
            (u = t.child),
            (u.memoizedState = As(h)),
            (u.childLanes = xs(e, l, h)),
            (t.memoizedState = Os),
            vu(null, u));
    if ((Ll(t), xf(i))) {
      if (((l = i.nextSibling && i.nextSibling.dataset), l)) var O = l.dgst;
      return (
        (l = O),
        l !== '' &&
          ((u = Error(c(419))),
          (u.stack = ''),
          (u.digest = l),
          uu({ value: u, source: null, stack: null })),
        Ji(e, t, h)
      );
    }
    if ((yt || ha(e, t, h, !1), (l = (h & e.childLanes) !== 0), yt || l)) {
      if (Ml.current !== null) return Ji(e, t, h);
      if (((l = We), l !== null && ((u = ai(l, h)), u !== 0 && u !== s.retryLane)))
        throw ((s.retryLane = u), da(e, u), Zt(l, e, u), _s);
      return (Af(i) || ho(), Ji(e, t, h));
    }
    return Af(i)
      ? ((t.flags |= 192), (t.child = e.child), null)
      : ((e = s.treeContext),
        (et = mn(i.nextSibling)),
        (bt = t),
        (Ne = !0),
        (xl = null),
        (gn = !1),
        e !== null && Ry(t, e),
        (t = Cs(t, u.children)),
        (t.flags |= 134221824),
        t);
  }
  function Qp(e, t, n) {
    e.lanes |= t;
    var l = e.alternate;
    (l !== null && (l.lanes |= t), Ri(e.return, t, n));
  }
  function $p(e) {
    for (var t = null; e !== null;) {
      var n = e.alternate;
      (n !== null && ki(n) === null && (t = e), (e = e.sibling));
    }
    return t;
  }
  function Pi(e, t, n, l, u, i) {
    var s = e.memoizedState;
    s === null
      ? (e.memoizedState = {
          isBackwards: t,
          rendering: null,
          renderingStartTime: 0,
          last: l,
          tail: n,
          tailMode: u,
          treeForkCount: i,
        })
      : ((s.isBackwards = t),
        (s.rendering = null),
        (s.renderingStartTime = 0),
        (s.last = l),
        (s.tail = n),
        (s.tailMode = u),
        (s.treeForkCount = i));
  }
  function ws(e) {
    var t = e.child;
    for (e.child = null; t !== null;) {
      var n = t.sibling;
      ((t.sibling = e.child), (e.child = t), (t = n));
    }
  }
  function Rs(e, t, n) {
    var l = t.pendingProps,
      u = l.revealOrder,
      i = l.tail;
    l = l.children;
    var s = Ot.current;
    if (t.flags & 128) return (pu(t, s), null);
    var h = (s & 2) !== 0;
    if (
      (h ? ((s = (s & 1) | 2), (t.flags |= 128)) : (s &= 1),
      pu(t, s),
      u === 'backwards' && e !== null ? (ws(e), vt(e, t, l, n), ws(e)) : vt(e, t, l, n),
      (l = Ne ? ru : 0),
      !h && e !== null && (e.flags & 128) !== 0)
    )
      e: for (e = t.child; e !== null;) {
        if (e.tag === 13) e.memoizedState !== null && Qp(e, n, t);
        else if (e.tag === 19) Qp(e, n, t);
        else if (e.child !== null) {
          ((e.child.return = e), (e = e.child));
          continue;
        }
        if (e === t) break e;
        for (; e.sibling === null;) {
          if (e.return === null || e.return === t) break e;
          e = e.return;
        }
        ((e.sibling.return = e.return), (e = e.sibling));
      }
    switch (u) {
      case 'backwards':
        ((n = $p(t.child)),
          n === null
            ? ((u = t.child), (t.child = null))
            : ((u = n.sibling), (n.sibling = null), ws(t)),
          Pi(t, !0, u, null, i, l));
        break;
      case 'unstable_legacy-backwards':
        for (n = null, u = t.child, t.child = null; u !== null;) {
          if (((e = u.alternate), e !== null && ki(e) === null)) {
            t.child = u;
            break;
          }
          ((e = u.sibling), (u.sibling = n), (n = u), (u = e));
        }
        Pi(t, !0, n, null, i, l);
        break;
      case 'together':
        Pi(t, !1, null, null, void 0, l);
        break;
      case 'independent':
        t.memoizedState = null;
        break;
      default:
        ((n = $p(t.child)),
          n === null ? ((u = t.child), (t.child = null)) : ((u = n.sibling), (n.sibling = null)),
          Pi(t, !1, u, n, i, l));
    }
    return t.child;
  }
  function Kp(e, t, n) {
    var l = t.pendingProps;
    return (wl(t, t.type, l.value), vt(e, t, l.children, n), t.child);
  }
  function fl(e, t, n) {
    if (
      (e !== null && (t.dependencies = e.dependencies), (Hl |= t.lanes), (n & t.childLanes) === 0)
    )
      if (e !== null) {
        if ((ha(e, t, n, !1), (n & t.childLanes) === 0)) return null;
      } else return null;
    if (e !== null && t.child !== e.child) throw Error(c(153));
    if (t.child !== null) {
      for (e = t.child, n = rl(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null;)
        ((e = e.sibling), (n = n.sibling = rl(e, e.pendingProps)), (n.return = t));
      n.sibling = null;
    }
    return t.child;
  }
  function Ns(e, t) {
    return (e.lanes & t) !== 0 ? !0 : ((e = e.dependencies), !!(e !== null && Ni(e)));
  }
  function Bb(e, t, n) {
    switch (t.tag) {
      case 3:
        ($t(t, t.stateNode.containerInfo), wl(t, ft, e.memoizedState.cache), pa());
        break;
      case 27:
      case 5:
        La(t);
        break;
      case 4:
        $t(t, t.stateNode.containerInfo);
        break;
      case 10:
        wl(t, t.type, t.memoizedProps.value);
        break;
      case 31:
        if (t.memoizedState !== null) return ((t.flags |= 128), ts(t), null);
        break;
      case 13:
        var l = t.memoizedState;
        if (l !== null) {
          if (l.dehydrated !== null) return (Ll(t), (t.flags |= 128), null);
          l = ha(e, t, n, !1);
          var u = t.child.childLanes;
          return l || (n & u) !== 0
            ? Xp(e, t, n)
            : (Ll(t), (e = fl(e, t, n)), e !== null ? e.sibling : null);
        }
        Ll(t);
        break;
      case 19:
        if (t.flags & 128) return Rs(e, t, n);
        if (
          ((u = (e.flags & 128) !== 0),
          (l = (n & t.childLanes) !== 0),
          l || (ha(e, t, n, !1), (l = (n & t.childLanes) !== 0)),
          u)
        ) {
          if (l) return Rs(e, t, n);
          t.flags |= 128;
        }
        if (
          ((u = t.memoizedState),
          u !== null && ((u.rendering = null), (u.tail = null), (u.lastEffect = null)),
          pu(t, Ot.current),
          l)
        )
          break;
        return null;
      case 22:
        return ((t.lanes = 0), Gp(e, t, n, t.pendingProps));
      case 24:
        wl(t, ft, e.memoizedState.cache);
    }
    return fl(e, t, n);
  }
  function Jp(e, t, n) {
    if (e !== null)
      if (e.memoizedProps !== t.pendingProps) yt = !0;
      else {
        if (!Ns(e, n) && (t.flags & 128) === 0) return ((yt = !1), Bb(e, t, n));
        yt = (e.flags & 131072) !== 0;
      }
    else ((yt = !1), Ne && (t.flags & 1048576) !== 0 && wy(t, ru, t.index));
    switch (((t.lanes = 0), t.tag)) {
      case 16:
        e: {
          var l = t.pendingProps;
          if (((e = Ea(t.elementType)), (t.type = e), typeof e == 'function'))
            Bc(e)
              ? ((l = Oa(e, l)), (t.tag = 1), (t = Ip(null, t, e, l, n)))
              : ((t.tag = 0), (t = Ts(null, t, e, l, n)));
          else {
            if (e != null) {
              var u = e.$$typeof;
              if (u === I) {
                ((t.tag = 11), (t = kp(null, t, e, l, n)));
                break e;
              } else if (u === se) {
                ((t.tag = 14), (t = Hp(null, t, e, l, n)));
                break e;
              } else if (u === ie) {
                ((t.tag = 10), (t.type = e), (t = Kp(null, t, n)));
                break e;
              }
            }
            throw ((t = Re(e) || e), Error(c(306, t, '')));
          }
        }
        return t;
      case 0:
        return Ts(e, t, t.type, t.pendingProps, n);
      case 1:
        return ((l = t.type), (u = Oa(l, t.pendingProps)), Ip(e, t, l, u, n));
      case 3:
        e: {
          if (($t(t, t.stateNode.containerInfo), e === null)) throw Error(c(387));
          l = t.pendingProps;
          var i = t.memoizedState;
          ((u = i.element), Kc(e, t), yu(t, l, null, n));
          var s = t.memoizedState;
          if (
            ((l = s.cache),
            wl(t, ft, l),
            l !== i.cache && Vc(t, [ft], n, !0),
            du(),
            (l = s.element),
            i.isDehydrated)
          )
            if (
              ((i = { element: l, isDehydrated: !1, cache: s.cache }),
              (t.updateQueue.baseState = i),
              (t.memoizedState = i),
              t.flags & 256)
            ) {
              t = Zp(e, t, l, n);
              break e;
            } else if (l !== u) {
              ((u = dn(Error(c(424)), t)), uu(u), (t = Zp(e, t, l, n)));
              break e;
            } else {
              switch (((e = t.stateNode.containerInfo), e.nodeType)) {
                case 9:
                  e = e.body;
                  break;
                default:
                  e = e.nodeName === 'HTML' ? e.ownerDocument.body : e;
              }
              for (
                et = mn(e.firstChild),
                  bt = t,
                  Ne = !0,
                  xl = null,
                  gn = !0,
                  n = Gy(t, null, l, n),
                  t.child = n;
                n;
              )
                ((n.flags = (n.flags & -3) | 134221824), (n = n.sibling));
            }
          else {
            if ((pa(), l === u)) {
              t = fl(e, t, n);
              break e;
            }
            vt(e, t, l, n);
          }
          t = t.child;
        }
        return t;
      case 26:
        return (
          or(e, t),
          e === null
            ? (n = _h(t.type, null, t.pendingProps, null))
              ? (t.memoizedState = n)
              : Ne || (t.stateNode = th(t.type, t.pendingProps, un.current, t))
            : (t.memoizedState = _h(t.type, e.memoizedProps, t.pendingProps, e.memoizedState)),
          null
        );
      case 27:
        return (
          La(t),
          e === null &&
            Ne &&
            ((l = t.stateNode = vh(t.type, t.pendingProps, un.current)),
            (bt = t),
            (gn = !0),
            (u = et),
            Yl(t.type) ? ((Cf = u), (et = mn(l.firstChild))) : (et = u)),
          vt(e, t, t.pendingProps.children, n),
          or(e, t),
          e === null && (t.flags |= 4194304),
          t.child
        );
      case 5:
        return (
          e === null &&
            Ne &&
            ((u = l = et) &&
              ((l = D1(l, t.type, t.pendingProps, gn)),
              l !== null
                ? ((t.stateNode = l), (bt = t), (et = mn(l.firstChild)), (gn = !1), (u = !0))
                : (u = !1)),
            u || Cl(t)),
          La(t),
          (u = t.type),
          (i = t.pendingProps),
          (s = e !== null ? e.memoizedProps : null),
          (l = i.children),
          vf(u, i) ? (l = null) : s !== null && vf(u, s) && (t.flags |= 32),
          t.memoizedState !== null && ((u = as(e, t, xb, null, null, n)), (xr._currentValue = u)),
          or(e, t),
          vt(e, t, l, n),
          t.child
        );
      case 6:
        return (
          e === null &&
            Ne &&
            ((e = n = et) &&
              ((n = j1(n, t.pendingProps, gn)),
              n !== null ? ((t.stateNode = n), (bt = t), (et = null), (e = !0)) : (e = !1)),
            e || Cl(t)),
          null
        );
      case 13:
        return Xp(e, t, n);
      case 4:
        return (
          $t(t, t.stateNode.containerInfo),
          (l = t.pendingProps),
          e === null ? (t.child = _a(t, null, l, n)) : vt(e, t, l, n),
          t.child
        );
      case 11:
        return kp(e, t, t.type, t.pendingProps, n);
      case 7:
        return ((l = t.pendingProps), or(e, t), vt(e, t, l, n), t.child);
      case 8:
        return (vt(e, t, t.pendingProps.children, n), t.child);
      case 12:
        return (vt(e, t, t.pendingProps.children, n), t.child);
      case 10:
        return Kp(e, t, n);
      case 9:
        return (
          (u = t.type._context),
          (l = t.pendingProps.children),
          ma(t),
          (u = _t(u)),
          (l = l(u)),
          (t.flags |= 1),
          vt(e, t, l, n),
          t.child
        );
      case 14:
        return Hp(e, t, t.type, t.pendingProps, n);
      case 15:
        return Fp(e, t, t.type, t.pendingProps, n);
      case 19:
        return Rs(e, t, n);
      case 31:
        return zb(e, t, n);
      case 22:
        return Gp(e, t, n, t.pendingProps);
      case 24:
        return (
          ma(t),
          (l = _t(ft)),
          e === null
            ? ((u = Xc()),
              u === null &&
                ((u = We),
                (i = Ic()),
                (u.pooledCache = i),
                i.refCount++,
                i !== null && (u.pooledCacheLanes |= n),
                (u = i)),
              (t.memoizedState = { parent: l, cache: u }),
              $c(t),
              wl(t, ft, u))
            : ((e.lanes & n) !== 0 && (Kc(e, t), yu(t, null, null, n), du()),
              (u = e.memoizedState),
              (i = t.memoizedState),
              u.parent !== l
                ? ((u = { parent: l, cache: l }),
                  (t.memoizedState = u),
                  t.lanes === 0 && (t.memoizedState = t.updateQueue.baseState = u),
                  wl(t, ft, l))
                : ((l = i.cache), wl(t, ft, l), l !== u.cache && Vc(t, [ft], n, !0))),
          vt(e, t, t.pendingProps.children, n),
          t.child
        );
      case 30:
        return (
          t.stateNode === null &&
            (t.stateNode = { autoName: null, paired: null, clones: null, ref: null }),
          (l = t.pendingProps),
          l.name != null && l.name !== 'auto'
            ? (t.flags |= e === null ? 18882560 : 18874368)
            : Ne && Ci(t),
          e !== null && e.memoizedProps.name !== l.name ? (t.flags |= 4194816) : or(e, t),
          vt(e, t, l.children, n),
          t.child
        );
      case 29:
        throw t.pendingProps;
    }
    throw Error(c(156, t.tag));
  }
  function dl(e) {
    e.flags |= 4;
  }
  function Ds(e, t, n, l, u) {
    var i;
    if (
      ((i = (e.mode & 32) !== 0) &&
        (i = n === null ? xh(t, l) : xh(t, l) && (l.src !== n.src || l.srcSet !== n.srcSet)),
      i)
    ) {
      if (((e.flags |= 16777216), (u & 335544128) === u))
        if (e.stateNode.complete) e.flags |= 8192;
        else if (jg()) e.flags |= 8192;
        else throw ((Sa = Li), Qc);
    } else e.flags &= -16777217;
  }
  function Pp(e, t) {
    if (t.type !== 'stylesheet' || (t.state.loading & 4) !== 0) e.flags &= -16777217;
    else if (((e.flags |= 16777216), !Ch(t)))
      if (jg()) e.flags |= 8192;
      else throw ((Sa = Li), Qc);
  }
  function Wi(e, t) {
    (t !== null && (e.flags |= 4),
      e.flags & 16384 && ((t = e.tag !== 22 ? ni() : 536870912), (e.lanes |= t), (yr |= t)));
  }
  function bu(e, t) {
    if (!Ne)
      switch (e.tailMode) {
        case 'visible':
          break;
        case 'collapsed':
          for (var n = e.tail, l = null; n !== null;)
            (n.alternate !== null && (l = n), (n = n.sibling));
          l === null
            ? t || e.tail === null
              ? (e.tail = null)
              : (e.tail.sibling = null)
            : (l.sibling = null);
          break;
        default:
          for (t = e.tail, n = null; t !== null;)
            (t.alternate !== null && (n = t), (t = t.sibling));
          n === null ? (e.tail = null) : (n.sibling = null);
      }
  }
  function tt(e) {
    var t = e.alternate !== null && e.alternate.child === e.child,
      n = 0,
      l = 0;
    if (t)
      for (var u = e.child; u !== null;)
        ((n |= u.lanes | u.childLanes),
          (l |= u.subtreeFlags & 1206910976),
          (l |= u.flags & 1206910976),
          (u.return = e),
          (u = u.sibling));
    else
      for (u = e.child; u !== null;)
        ((n |= u.lanes | u.childLanes),
          (l |= u.subtreeFlags),
          (l |= u.flags),
          (u.return = e),
          (u = u.sibling));
    return ((e.subtreeFlags |= l), (e.childLanes = n), t);
  }
  function kb(e, t, n) {
    var l = t.pendingProps;
    switch ((Fc(t), t.tag)) {
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return (tt(t), null);
      case 1:
        return (tt(t), null);
      case 3:
        return (
          (n = t.stateNode),
          (l = null),
          e !== null && (l = e.memoizedState.cache),
          t.memoizedState.cache !== l && (t.flags |= 2048),
          ol(ft),
          Pn(),
          n.pendingContext && ((n.context = n.pendingContext), (n.pendingContext = null)),
          (e === null || e.child === null) &&
            (tr(t)
              ? dl(t)
              : e === null ||
                (e.memoizedState.isDehydrated && (t.flags & 256) === 0) ||
                ((t.flags |= 1024), qc())),
          tt(t),
          null
        );
      case 26:
        var u = t.type,
          i = t.memoizedState;
        return (
          e === null
            ? (dl(t), i !== null ? (tt(t), Pp(t, i)) : (tt(t), Ds(t, u, null, l, n)))
            : i
              ? i !== e.memoizedState
                ? (dl(t), tt(t), Pp(t, i))
                : (tt(t), (t.flags &= -16777217))
              : ((e = e.memoizedProps), e !== l && dl(t), tt(t), Ds(t, u, e, l, n)),
          null
        );
      case 27:
        if ((za(t), (n = un.current), (u = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== l && dl(t);
        else {
          if (!l) {
            if (t.stateNode === null) throw Error(c(166));
            return (tt(t), (t.subtreeFlags &= -33554433), null);
          }
          ((e = rn.current), tr(t) ? Ny(t) : ((e = vh(u, l, n)), (t.stateNode = e), dl(t)));
        }
        return (tt(t), (t.subtreeFlags &= -33554433), null);
      case 5:
        if ((za(t), (u = t.type), e !== null && t.stateNode != null))
          e.memoizedProps !== l && dl(t);
        else {
          if (!l) {
            if (t.stateNode === null) throw Error(c(166));
            return (tt(t), (t.subtreeFlags &= -33554433), null);
          }
          if (((i = rn.current), tr(t))) Ny(t);
          else {
            var s = Nu(un.current);
            switch (i) {
              case 1:
                i = s.createElementNS('http://www.w3.org/2000/svg', u);
                break;
              case 2:
                i = s.createElementNS('http://www.w3.org/1998/Math/MathML', u);
                break;
              default:
                switch (u) {
                  case 'svg':
                    i = s.createElementNS('http://www.w3.org/2000/svg', u);
                    break;
                  case 'math':
                    i = s.createElementNS('http://www.w3.org/1998/Math/MathML', u);
                    break;
                  case 'script':
                    ((i = s.createElement('div')),
                      (i.innerHTML = '<script><\/script>'),
                      (i = i.removeChild(i.firstChild)));
                    break;
                  case 'select':
                    ((i =
                      typeof l.is == 'string'
                        ? s.createElement('select', { is: l.is })
                        : s.createElement('select')),
                      l.multiple ? (i.multiple = !0) : l.size && (i.size = l.size));
                    break;
                  default:
                    i =
                      typeof l.is == 'string'
                        ? s.createElement(u, { is: l.is })
                        : s.createElement(u);
                }
            }
            ((i[ht] = t), (i[wt] = l));
            e: for (s = t.child; s !== null;) {
              if (s.tag === 5 || s.tag === 6) i.appendChild(s.stateNode);
              else if (s.tag !== 4 && s.tag !== 27 && s.child !== null) {
                ((s.child.return = s), (s = s.child));
                continue;
              }
              if (s === t) break e;
              for (; s.sibling === null;) {
                if (s.return === null || s.return === t) break e;
                s = s.return;
              }
              ((s.sibling.return = s.return), (s = s.sibling));
            }
            t.stateNode = i;
            e: switch ((xt(i, u, l), u)) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                l = !!l.autoFocus;
                break e;
              case 'img':
                l = !0;
                break e;
              default:
                l = !1;
            }
            l && dl(t);
          }
        }
        return (
          tt(t),
          (t.subtreeFlags &= -33554433),
          Ds(t, t.type, e === null ? null : e.memoizedProps, t.pendingProps, n),
          null
        );
      case 6:
        if (e && t.stateNode != null) e.memoizedProps !== l && dl(t);
        else {
          if (typeof l != 'string' && t.stateNode === null) throw Error(c(166));
          if (((e = un.current), tr(t))) {
            if (((e = t.stateNode), (n = t.memoizedProps), (l = null), (u = bt), u !== null))
              switch (u.tag) {
                case 27:
                case 5:
                  l = u.memoizedProps;
              }
            ((e[ht] = t),
              (e = !!(
                e.nodeValue === n ||
                (l !== null && l.suppressHydrationWarning === !0) ||
                Jg(e.nodeValue, n)
              )),
              e || Cl(t, !0));
          } else ((e = Nu(e).createTextNode(l)), (e[ht] = t), (t.stateNode = e));
        }
        return (tt(t), null);
      case 31:
        if (((n = t.memoizedState), e === null || e.memoizedState !== null)) {
          if (((l = tr(t)), n !== null)) {
            if (e === null) {
              if (!l) throw Error(c(318));
              if (((e = t.memoizedState), (e = e !== null ? e.dehydrated : null), !e))
                throw Error(c(557));
              e[ht] = t;
            } else (pa(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (tt(t), (e = !1));
          } else
            ((n = qc()),
              e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = n),
              (e = !0));
          if (!e) return t.flags & 256 ? (Jt(t), t) : (Jt(t), null);
          if ((t.flags & 128) !== 0) throw Error(c(558));
        }
        return (tt(t), null);
      case 13:
        if (
          ((l = t.memoizedState),
          e === null || (e.memoizedState !== null && e.memoizedState.dehydrated !== null))
        ) {
          if (((u = tr(t)), l !== null && l.dehydrated !== null)) {
            if (e === null) {
              if (!u) throw Error(c(318));
              if (((u = t.memoizedState), (u = u !== null ? u.dehydrated : null), !u))
                throw Error(c(317));
              u[ht] = t;
            } else (pa(), (t.flags & 128) === 0 && (t.memoizedState = null), (t.flags |= 4));
            (tt(t), (u = !1));
          } else
            ((u = qc()),
              e !== null && e.memoizedState !== null && (e.memoizedState.hydrationErrors = u),
              (u = !0));
          if (!u) return t.flags & 256 ? (Jt(t), t) : (Jt(t), null);
        }
        return (
          Jt(t),
          (t.flags & 128) !== 0
            ? ((t.lanes = n), t)
            : ((n = l !== null),
              (e = e !== null && e.memoizedState !== null),
              n &&
                ((l = t.child),
                (u = null),
                l.alternate !== null &&
                  l.alternate.memoizedState !== null &&
                  l.alternate.memoizedState.cachePool !== null &&
                  (u = l.alternate.memoizedState.cachePool.pool),
                (i = null),
                l.memoizedState !== null &&
                  l.memoizedState.cachePool !== null &&
                  (i = l.memoizedState.cachePool.pool),
                i !== u && (l.flags |= 2048)),
              n !== e && n && (t.child.flags |= 8192),
              Wi(t, t.updateQueue),
              tt(t),
              null)
        );
      case 4:
        return (
          Pn(),
          e === null && yf(t.stateNode.containerInfo),
          (t.flags |= 67108864),
          tt(t),
          null
        );
      case 10:
        return (ol(t.type), tt(t), null);
      case 19:
        if ((ns(t), (l = t.memoizedState), l === null)) return (tt(t), null);
        if (((u = (t.flags & 128) !== 0), (i = l.rendering), i === null))
          if (u) bu(l, !1);
          else {
            if (ot !== 0 || (e !== null && (e.flags & 128) !== 0))
              for (e = t.child; e !== null;) {
                if (((i = ki(e)), i !== null)) {
                  for (
                    t.flags |= 128,
                      bu(l, !1),
                      e = i.updateQueue,
                      t.updateQueue = e,
                      Wi(t, e),
                      t.subtreeFlags = 0,
                      e = n,
                      n = t.child;
                    n !== null;
                  )
                    (Ay(n, e), (n = n.sibling));
                  return (pu(t, (Ot.current & 1) | 2), Ne && ul(t, l.treeForkCount), t.child);
                }
                e = e.sibling;
              }
            l.tail !== null &&
              Dt() > fo &&
              ((t.flags |= 128), (u = !0), bu(l, !1), (t.lanes = 4194304));
          }
        else {
          if (!u)
            if (((e = ki(i)), e !== null)) {
              if (
                ((t.flags |= 128),
                (u = !0),
                (e = e.updateQueue),
                (t.updateQueue = e),
                Wi(t, e),
                bu(l, !0),
                l.tail === null &&
                  l.tailMode !== 'collapsed' &&
                  l.tailMode !== 'visible' &&
                  !i.alternate &&
                  !Ne)
              )
                return (tt(t), null);
            } else
              2 * Dt() - l.renderingStartTime > fo &&
                n !== 536870912 &&
                ((t.flags |= 128), (u = !0), bu(l, !1), (t.lanes = 4194304));
          l.isBackwards
            ? ((i.sibling = t.child), (t.child = i))
            : ((e = l.last), e !== null ? (e.sibling = i) : (t.child = i), (l.last = i));
        }
        if (l.tail !== null) {
          e = l.tail;
          e: {
            for (n = e; n !== null;) {
              if (n.alternate !== null) {
                n = !1;
                break e;
              }
              n = n.sibling;
            }
            n = !0;
          }
          return (
            (l.rendering = e),
            (l.tail = e.sibling),
            (l.renderingStartTime = Dt()),
            (e.sibling = null),
            (i = Ot.current),
            (i = u ? (i & 1) | 2 : i & 1),
            l.tailMode === 'visible' || l.tailMode === 'collapsed' || !n || Ne
              ? pu(t, i)
              : ((n = i), Ke(Tt, t), Ke(Ot, n), Rt === null && (Rt = t)),
            Ne && ul(t, l.treeForkCount),
            e
          );
        }
        return (tt(t), null);
      case 22:
      case 23:
        return (
          Jt(t),
          es(),
          (l = t.memoizedState !== null),
          e !== null
            ? (e.memoizedState !== null) !== l && (t.flags |= 8192)
            : l && (t.flags |= 8192),
          l
            ? (n & 536870912) !== 0 &&
              (t.flags & 128) === 0 &&
              (tt(t), t.subtreeFlags & 6 && (t.flags |= 8192))
            : tt(t),
          (n = t.updateQueue),
          n !== null && Wi(t, n.retryQueue),
          (n = null),
          e !== null &&
            e.memoizedState !== null &&
            e.memoizedState.cachePool !== null &&
            (n = e.memoizedState.cachePool.pool),
          (l = null),
          t.memoizedState !== null &&
            t.memoizedState.cachePool !== null &&
            (l = t.memoizedState.cachePool.pool),
          l !== n && (t.flags |= 2048),
          e !== null && lt(ba),
          null
        );
      case 24:
        return (
          (n = null),
          e !== null && (n = e.memoizedState.cache),
          t.memoizedState.cache !== n && (t.flags |= 2048),
          ol(ft),
          tt(t),
          null
        );
      case 25:
        return null;
      case 30:
        return ((t.flags |= 33554432), tt(t), null);
    }
    throw Error(c(156, t.tag));
  }
  function Hb(e, t) {
    switch ((Fc(t), t.tag)) {
      case 1:
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 3:
        return (
          ol(ft),
          Pn(),
          (e = t.flags),
          (e & 65536) !== 0 && (e & 128) === 0 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 26:
      case 27:
      case 5:
        return (za(t), null);
      case 31:
        if (t.memoizedState !== null) {
          if ((Jt(t), t.alternate === null)) throw Error(c(340));
          pa();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 13:
        if ((Jt(t), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
          if (t.alternate === null) throw Error(c(340));
          pa();
        }
        return ((e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null);
      case 19:
        return (
          ns(t),
          (e = t.flags),
          e & 65536
            ? ((t.flags = (e & -65537) | 128),
              (e = t.memoizedState),
              e !== null && ((e.rendering = null), (e.tail = null)),
              (t.flags |= 4),
              t)
            : null
        );
      case 4:
        return (Pn(), null);
      case 10:
        return (ol(t.type), null);
      case 22:
      case 23:
        return (
          Jt(t),
          es(),
          e !== null && lt(ba),
          (e = t.flags),
          e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
        );
      case 24:
        return (ol(ft), null);
      case 25:
        return null;
      default:
        return null;
    }
  }
  function Wp(e, t) {
    switch ((Fc(t), t.tag)) {
      case 3:
        (ol(ft), Pn());
        break;
      case 26:
      case 27:
      case 5:
        za(t);
        break;
      case 4:
        Pn();
        break;
      case 31:
        t.memoizedState !== null && Jt(t);
        break;
      case 13:
        Jt(t);
        break;
      case 19:
        ns(t);
        break;
      case 10:
        ol(t.type);
        break;
      case 22:
      case 23:
        (Jt(t), es(), e !== null && lt(ba));
        break;
      case 24:
        ol(ft);
    }
  }
  function Eu(e, t) {
    try {
      var n = t.updateQueue,
        l = n !== null ? n.lastEffect : null;
      if (l !== null) {
        var u = l.next;
        n = u;
        do {
          if ((n.tag & e) === e) {
            l = void 0;
            var i = n.create,
              s = n.inst;
            ((l = i()), (s.destroy = l));
          }
          n = n.next;
        } while (n !== u);
      }
    } catch (h) {
      Qe(t, t.return, h);
    }
  }
  function Ul(e, t, n) {
    try {
      var l = t.updateQueue,
        u = l !== null ? l.lastEffect : null;
      if (u !== null) {
        var i = u.next;
        l = i;
        do {
          if ((l.tag & e) === e) {
            var s = l.inst,
              h = s.destroy;
            if (h !== void 0) {
              ((s.destroy = void 0), (u = t));
              var O = n,
                M = h;
              try {
                M();
              } catch (H) {
                Qe(u, O, H);
              }
            }
          }
          l = l.next;
        } while (l !== i);
      }
    } catch (H) {
      Qe(t, t.return, H);
    }
  }
  function eg(e) {
    var t = e.updateQueue;
    if (t !== null) {
      var n = e.stateNode;
      try {
        Yy(t, n);
      } catch (l) {
        Qe(e, e.return, l);
      }
    }
  }
  function tg(e, t, n) {
    ((n.props = Oa(e.type, e.memoizedProps)), (n.state = e.memoizedState));
    try {
      n.componentWillUnmount();
    } catch (l) {
      Qe(e, t, l);
    }
  }
  function kn(e, t) {
    try {
      var n = e.ref;
      if (n !== null) {
        switch (e.tag) {
          case 26:
          case 27:
          case 5:
            var l = e.stateNode;
            break;
          case 30:
            var u = e.stateNode,
              i = ll(e.memoizedProps, u);
            ((u.ref === null || u.ref.name !== i) && (u.ref = oh(i)), (l = u.ref));
            break;
          case 7:
            if (e.stateNode === null) {
              var s = new nn(e);
              (g(e.child, !1, R1, s, void 0, void 0), (e.stateNode = s));
            }
            l = e.stateNode;
            break;
          default:
            l = e.stateNode;
        }
        typeof n == 'function' ? (e.refCleanup = n(l)) : (n.current = l);
      }
    } catch (h) {
      Qe(e, t, h);
    }
  }
  function At(e, t) {
    var n = e.ref,
      l = e.refCleanup;
    if (n !== null)
      if (typeof l == 'function')
        try {
          l();
        } catch (u) {
          Qe(e, t, u);
        } finally {
          ((e.refCleanup = null), (e = e.alternate), e != null && (e.refCleanup = null));
        }
      else if (typeof n == 'function')
        try {
          n(null);
        } catch (u) {
          Qe(e, t, u);
        }
      else n.current = null;
  }
  function eo(e, t) {
    if ((e.tag === 5 || e.tag === 27 || e.tag === 6) && e.alternate === null && t !== null)
      for (var n = 0; n < t.length; n++) ph(e.stateNode, t[n]);
  }
  function ng(e) {
    for (var t = e.return; t !== null && (Ms(t) && ph(e.stateNode, t.stateNode), !js(t));)
      t = t.return;
  }
  function Su(e) {
    for (var t = e.return; t !== null && (Ms(t) && N1(e.stateNode, t.stateNode), !js(t));)
      t = t.return;
  }
  function js(e) {
    return e.tag === 5 || e.tag === 3 || e.tag === 27;
  }
  function Ms(e) {
    return e && e.tag === 7 && e.stateNode !== null;
  }
  function Ls(e) {
    var t = e.type,
      n = e.memoizedProps,
      l = e.stateNode;
    try {
      e: switch (t) {
        case 'button':
        case 'input':
        case 'select':
        case 'textarea':
          n.autoFocus && l.focus();
          break e;
        case 'img':
          n.src ? (l.src = n.src) : n.srcSet && (l.srcset = n.srcSet);
      }
    } catch (u) {
      Qe(e, e.return, u);
    }
  }
  function zs(e, t, n) {
    try {
      var l = e.stateNode;
      (f1(l, e.type, n, t), (l[wt] = t));
    } catch (u) {
      Qe(e, e.return, u);
    }
  }
  function lg(e) {
    return (
      e.tag === 5 || e.tag === 3 || e.tag === 26 || (e.tag === 27 && Yl(e.type)) || e.tag === 4
    );
  }
  function Us(e) {
    e: for (;;) {
      for (; e.sibling === null;) {
        if (e.return === null || lg(e.return)) return null;
        e = e.return;
      }
      for (
        e.sibling.return = e.return, e = e.sibling;
        e.tag !== 5 && e.tag !== 6 && e.tag !== 18;
      ) {
        if ((e.tag === 27 && Yl(e.type)) || e.flags & 2 || e.child === null || e.tag === 4)
          continue e;
        ((e.child.return = e), (e = e.child));
      }
      if (!(e.flags & 2)) return e.stateNode;
    }
  }
  function Bs(e, t, n, l) {
    var u = e.tag;
    if (u === 5 || u === 6)
      ((u = e.stateNode),
        t
          ? (n.nodeType === 9
              ? n.body
              : n.nodeName === 'HTML'
                ? n.ownerDocument.body
                : n
            ).insertBefore(u, t)
          : ((t = n.nodeType === 9 ? n.body : n.nodeName === 'HTML' ? n.ownerDocument.body : n),
            t.appendChild(u),
            (n = n._reactRootContainer),
            n != null || t.onclick !== null || (t.onclick = F)),
        eo(e, l),
        (He = !0));
    else if (
      u !== 4 &&
      (u === 27 && (eo(e, l), (l = null), Yl(e.type) && ((n = e.stateNode), (t = null))),
      (e = e.child),
      e !== null)
    )
      for (Bs(e, t, n, l), e = e.sibling; e !== null;) (Bs(e, t, n, l), (e = e.sibling));
  }
  function to(e, t, n, l) {
    var u = e.tag;
    if (u === 5 || u === 6)
      ((u = e.stateNode), t ? n.insertBefore(u, t) : n.appendChild(u), eo(e, l), (He = !0));
    else if (
      u !== 4 &&
      (u === 27 && (eo(e, l), (l = null), Yl(e.type) && (n = e.stateNode)),
      (e = e.child),
      e !== null)
    )
      for (to(e, t, n, l), e = e.sibling; e !== null;) (to(e, t, n, l), (e = e.sibling));
  }
  function ag(e) {
    var t = e.stateNode,
      n = e.memoizedProps;
    try {
      for (var l = e.type, u = t.attributes; u.length;) t.removeAttributeNode(u[0]);
      (xt(t, l, n), (t[ht] = e), (t[wt] = n));
    } catch (i) {
      Qe(e, e.return, i);
    }
  }
  var no = !1,
    Pt = null;
  function rg(e) {
    (e.tag === 30 || (e.subtreeFlags & 33554432) !== 0) && (no = !0);
  }
  var Hn = null;
  function ug() {
    var e = Hn;
    return ((Hn = null), e);
  }
  var Yt = 0;
  function cr(e, t, n, l, u) {
    return ((Yt = 0), ig(e.child, t, n, l, u));
  }
  function ig(e, t, n, l, u) {
    for (var i = !1; e !== null;) {
      if (e.tag === 5) {
        var s = e.stateNode;
        if (l !== null) {
          var h = Sf(s);
          (l.push(h), h.view && (i = !0));
        } else i || (Sf(s).view && (i = !0));
        ((no = !0), uh(s, Yt === 0 ? t : t + '_' + Yt, n), Yt++);
      } else
        (e.tag !== 22 || e.memoizedState === null) &&
          ((e.tag === 30 && u) || (ig(e.child, t, n, l, u) && (i = !0)));
      e = e.sibling;
    }
    return i;
  }
  function Fn(e, t) {
    for (; e !== null;)
      (e.tag === 5
        ? ih(e.stateNode, e.memoizedProps)
        : (e.tag !== 22 || e.memoizedState === null) && ((e.tag === 30 && t) || Fn(e.child, t)),
        (e = e.sibling));
  }
  function lo(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null;) {
        if (
          (e.tag !== 22 || e.memoizedState === null) &&
          (lo(e), e.tag === 30 && (e.flags & 18874368) !== 0 && e.stateNode.paired)
        ) {
          var t = e.memoizedProps;
          if (t.name == null || t.name === 'auto') throw Error(c(544));
          var n = t.name;
          ((t = al(t.default, t.share)),
            t !== 'none' && (cr(e, n, t, null, !1) || Fn(e.child, !1)));
        }
        e = e.sibling;
      }
  }
  function ks(e, t) {
    if (e.tag === 30) {
      var n = e.stateNode,
        l = e.memoizedProps,
        u = ll(l, n),
        i = al(l.default, n.paired ? l.share : l.enter);
      i !== 'none'
        ? cr(e, u, i, null, !1)
          ? (lo(e), n.paired || t || mr(e, l.onEnter))
          : Fn(e.child, !1)
        : lo(e);
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null;) (ks(e, t), (e = e.sibling));
    else lo(e);
  }
  function Hs(e) {
    if (Pt !== null && Pt.size !== 0) {
      var t = Pt;
      if ((e.subtreeFlags & 18874368) !== 0)
        for (e = e.child; e !== null;) {
          if (e.tag !== 22 || e.memoizedState === null) {
            if (e.tag === 30 && (e.flags & 18874368) !== 0) {
              var n = e.memoizedProps,
                l = n.name;
              if (l != null && l !== 'auto') {
                var u = t.get(l);
                if (u !== void 0) {
                  var i = al(n.default, n.share);
                  if (
                    (i !== 'none' &&
                      (cr(e, l, i, null, !1)
                        ? ((i = e.stateNode), (u.paired = i), (i.paired = u), mr(e, n.onShare))
                        : Fn(e.child, !1)),
                    t.delete(l),
                    t.size === 0)
                  )
                    break;
                }
              }
            }
            Hs(e);
          }
          e = e.sibling;
        }
    }
  }
  function Fs(e) {
    if (e.tag === 30) {
      var t = e.memoizedProps,
        n = ll(t, e.stateNode),
        l = Pt !== null ? Pt.get(n) : void 0,
        u = al(t.default, l !== void 0 ? t.share : t.exit);
      (u !== 'none' &&
        (cr(e, n, u, null, !1)
          ? l !== void 0
            ? ((u = e.stateNode), (l.paired = u), (u.paired = l), Pt.delete(n), mr(e, t.onShare))
            : mr(e, t.onExit)
          : Fn(e.child, !1)),
        Pt !== null && Hs(e));
    } else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null;) (Fs(e), (e = e.sibling));
    else Pt !== null && Hs(e);
  }
  function og(e) {
    for (e = e.child; e !== null;) {
      if (e.tag === 30) {
        var t = e.memoizedProps,
          n = ll(t, e.stateNode);
        ((t = al(t.default, t.update)),
          (e.flags &= -5),
          t !== 'none' && cr(e, n, t, (e.memoizedState = []), !1));
      } else (e.subtreeFlags & 33554432) !== 0 && og(e);
      e = e.sibling;
    }
  }
  function Gs(e) {
    if ((e.subtreeFlags & 18874368) !== 0)
      for (e = e.child; e !== null;) {
        if (e.tag !== 22 || e.memoizedState === null) {
          if (e.tag === 30 && (e.flags & 18874368) !== 0) {
            var t = e.stateNode;
            t.paired !== null && ((t.paired = null), Fn(e.child, !1));
          }
          Gs(e);
        }
        e = e.sibling;
      }
  }
  function ao(e) {
    if (e.tag === 30) ((e.stateNode.paired = null), Fn(e.child, !1), Gs(e));
    else if ((e.subtreeFlags & 33554432) !== 0)
      for (e = e.child; e !== null;) (ao(e), (e = e.sibling));
    else Gs(e);
  }
  function cg(e) {
    for (e = e.child; e !== null;)
      (e.tag === 30 ? Fn(e.child, !1) : (e.subtreeFlags & 33554432) !== 0 && cg(e),
        (e = e.sibling));
  }
  function qs(e, t, n, l, u, i, s) {
    for (var h = !1; t !== null;) {
      if (t.tag === 5) {
        var O = t.stateNode;
        if (i !== null && Yt < i.length) {
          var M = i[Yt],
            H = Sf(O);
          (M.view || H.view) && (h = !0);
          var V;
          if ((V = (e.flags & 4) === 0))
            if (H.clip) V = !0;
            else {
              V = M.rect;
              var D = H.rect;
              V = V.y !== D.y || V.x !== D.x || V.height !== D.height || V.width !== D.width;
            }
          (V && (e.flags |= 4),
            H.abs
              ? (H = !M.abs)
              : ((M = M.rect), (H = H.rect), (H = M.height !== H.height || M.width !== H.width)),
            H && (e.flags |= 32));
        } else e.flags |= 32;
        ((e.flags & 4) !== 0 && uh(O, Yt === 0 ? n : n + '_' + Yt, u),
          (h && (e.flags & 4) !== 0) ||
            (Hn === null && (Hn = []), Hn.push(O, Yt === 0 ? l : l + '_' + Yt, t.memoizedProps)),
          Yt++);
      } else
        (t.tag !== 22 || t.memoizedState === null) &&
          (t.tag === 30 && s
            ? (e.flags |= t.flags & 32)
            : qs(e, t.child, n, l, u, i, s) && (h = !0));
      t = t.sibling;
    }
    return h;
  }
  function sg(e, t) {
    for (e = e.child; e !== null;) {
      if (e.tag === 30) {
        var n = e.memoizedProps,
          l = e.stateNode,
          u = ll(n, l),
          i = al(n.default, n.update),
          s;
        ((s = e.memoizedState), (e.memoizedState = null), (l = e));
        var h = e.child;
        ((Yt = 0), (u = qs(l, h, u, u, i, s, !1)), (e.flags & 4) !== 0 && u && mr(e, n.onUpdate));
      } else (e.subtreeFlags & 33554432) !== 0 && sg(e);
      e = e.sibling;
    }
  }
  var Et = !1,
    Ze = !1,
    Gn = !1,
    Ys = !1,
    fg = typeof WeakSet == 'function' ? WeakSet : Set,
    St = null,
    qn = !1,
    _u = !1,
    ro = !1,
    Vs = !1;
  function Fb(e, t, n) {
    if (((e = e.containerInfo), (hf = Cr), (e = gy(e)), Nc(e))) {
      if ('selectionStart' in e) var l = { start: e.selectionStart, end: e.selectionEnd };
      else
        e: {
          l = ((l = e.ownerDocument) && l.defaultView) || window;
          var u = l.getSelection && l.getSelection();
          if (u && u.rangeCount !== 0) {
            l = u.anchorNode;
            var i = u.anchorOffset,
              s = u.focusNode;
            u = u.focusOffset;
            try {
              (l.nodeType, s.nodeType);
            } catch {
              l = null;
              break e;
            }
            var h = 0,
              O = -1,
              M = -1,
              H = 0,
              V = 0,
              D = e,
              U = null;
            t: for (;;) {
              for (
                var ne;
                D !== l || (i !== 0 && D.nodeType !== 3) || (O = h + i),
                  D !== s || (u !== 0 && D.nodeType !== 3) || (M = h + u),
                  D.nodeType === 3 && (h += D.nodeValue.length),
                  (ne = D.firstChild) !== null;
              )
                ((U = D), (D = ne));
              for (;;) {
                if (D === e) break t;
                if (
                  (U === l && ++H === i && (O = h),
                  U === s && ++V === u && (M = h),
                  (ne = D.nextSibling) !== null)
                )
                  break;
                ((D = U), (U = D.parentNode));
              }
              D = ne;
            }
            l = O === -1 || M === -1 ? null : { start: O, end: M };
          } else l = null;
        }
      l = l || { start: 0, end: 0 };
    } else l = null;
    for (
      mf = { focusedElem: e, selectionRange: l },
        Cr = !1,
        n = (n & 335544064) === n,
        St = t,
        t = n ? 9270 : 1024;
      St !== null;
    ) {
      if (((e = St), n && ((l = e.deletions), l !== null)))
        for (i = 0; i < l.length; i++) n && Fs(l[i]);
      if (e.alternate === null && (e.flags & 2) !== 0) (n && rg(e), uo(n));
      else {
        if (e.tag === 22) {
          if (((l = e.alternate), e.memoizedState !== null)) {
            (l !== null && l.memoizedState === null && n && Fs(l), uo(n));
            continue;
          } else if (l !== null && l.memoizedState !== null) {
            (n && rg(e), uo(n));
            continue;
          }
        }
        ((l = e.child),
          (e.subtreeFlags & t) !== 0 && l !== null
            ? ((l.return = e), (St = l))
            : (n && og(e), uo(n)));
      }
    }
    Pt = null;
  }
  function uo(e) {
    for (; St !== null;) {
      var t = St,
        n = e,
        l = t.alternate,
        u = t.flags;
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if ((u & 1024) !== 0 && l !== null) {
            ((n = void 0), (u = l.memoizedProps), (l = l.memoizedState));
            var i = t.stateNode;
            try {
              var s = Oa(t.type, u);
              ((n = i.getSnapshotBeforeUpdate(s, l)), (i.__reactInternalSnapshotBeforeUpdate = n));
            } catch (h) {
              Qe(t, t.return, h);
            }
          }
          break;
        case 3:
          if ((u & 1024) !== 0) {
            if (((l = t.stateNode.containerInfo), (n = l.nodeType), n === 9)) Of(l);
            else if (n === 1)
              switch (l.nodeName) {
                case 'HEAD':
                case 'HTML':
                case 'BODY':
                  Of(l);
                  break;
                default:
                  l.textContent = '';
              }
          }
          break;
        case 5:
        case 26:
        case 27:
        case 6:
        case 4:
        case 17:
          break;
        case 30:
          n &&
            l !== null &&
            ((n = ll(l.memoizedProps, l.stateNode)),
            (u = t.memoizedProps),
            (u = al(u.default, u.update)),
            u !== 'none' && cr(l, n, u, (l.memoizedState = []), !0));
          break;
        default:
          if ((u & 1024) !== 0) throw Error(c(163));
      }
      if (((l = t.sibling), l !== null)) {
        ((l.return = t.return), (St = l));
        break;
      }
      St = t.return;
    }
  }
  function dg(e, t, n) {
    var l = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 15:
        (Yn(e, n), l & 4 && Eu(5, n));
        break;
      case 1:
        if ((Yn(e, n), l & 4))
          if (((e = n.stateNode), t === null))
            try {
              e.componentDidMount();
            } catch (s) {
              Qe(n, n.return, s);
            }
          else {
            var u = Oa(n.type, t.memoizedProps);
            t = t.memoizedState;
            try {
              e.componentDidUpdate(u, t, e.__reactInternalSnapshotBeforeUpdate);
            } catch (s) {
              Qe(n, n.return, s);
            }
          }
        (l & 64 && eg(n), l & 512 && kn(n, n.return));
        break;
      case 3:
        if ((Yn(e, n), l & 64 && ((e = n.updateQueue), e !== null))) {
          if (((t = null), n.child !== null))
            switch (n.child.tag) {
              case 27:
              case 5:
                t = n.child.stateNode;
                break;
              case 1:
                t = n.child.stateNode;
            }
          try {
            Yy(e, t);
          } catch (s) {
            Qe(n, n.return, s);
          }
        }
        break;
      case 27:
        t === null && l & 4 && ag(n);
      case 26:
      case 5:
        (Yn(e, n), t === null && l & 4 && Ls(n), l & 512 && kn(n, n.return));
        break;
      case 12:
        Yn(e, n);
        break;
      case 31:
        (Yn(e, n), l & 4 && hg(e, n));
        break;
      case 13:
        (Yn(e, n),
          l & 4 && mg(e, n),
          l & 64 &&
            ((e = n.memoizedState),
            e !== null && ((e = e.dehydrated), e !== null && ((n = Pb.bind(null, n)), M1(e, n)))));
        break;
      case 22:
        if (((l = n.memoizedState !== null || Et), !l)) {
          var i = (t !== null && t.memoizedState !== null) || Ze;
          ((t = Et),
            (u = Ze),
            (Et = l),
            (Ze = i) && !u
              ? ((l = 2), (n.subtreeFlags & 8772) !== 0 && (l |= 1), Nn(e, n, l))
              : Yn(e, n),
            (Et = t),
            (Ze = u));
        }
        break;
      case 30:
        (Yn(e, n), l & 512 && kn(n, n.return));
        break;
      case 7:
        l & 512 && kn(n, n.return);
      default:
        Yn(e, n);
    }
  }
  function Is(e, t) {
    for (e = e.child; e !== null;) (yg(e, t), (e = e.sibling));
  }
  function yg(e, t) {
    switch (e.tag) {
      case 5:
      case 26:
        try {
          var n = e.stateNode;
          if (t) {
            var l = n.style;
            typeof l.setProperty == 'function'
              ? l.setProperty('display', 'none', 'important')
              : (l.display = 'none');
          } else {
            var u = e.stateNode,
              i = e.memoizedProps.style,
              s = i != null && i.hasOwnProperty('display') ? i.display : null;
            u.style.display = s == null || typeof s == 'boolean' ? '' : ('' + s).trim();
          }
        } catch (O) {
          Qe(e, e.return, O);
        }
        Zs(e, t);
        break;
      case 6:
        try {
          ((e.stateNode.nodeValue = t ? '' : e.memoizedProps), (He = !0));
        } catch (O) {
          Qe(e, e.return, O);
        }
        break;
      case 18:
        try {
          var h = e.stateNode;
          t ? rh(h, !0) : rh(e.stateNode, !1);
        } catch (O) {
          Qe(e, e.return, O);
        }
        break;
      case 22:
      case 23:
        e.memoizedState === null && Is(e, t);
        break;
      default:
        Is(e, t);
    }
  }
  function Zs(e, t) {
    if (e.subtreeFlags & 67108864)
      for (e = e.child; e !== null;) {
        e: {
          var n = e,
            l = t;
          switch (n.tag) {
            case 4:
              yg(n, l);
              break e;
            case 22:
              n.memoizedState === null && Zs(n, l);
              break e;
            default:
              Zs(n, l);
          }
        }
        e = e.sibling;
      }
  }
  function pg(e) {
    var t = e.alternate;
    (t !== null && ((e.alternate = null), pg(t)),
      (e.child = null),
      (e.deletions = null),
      (e.sibling = null),
      e.tag === 5 && ((t = e.stateNode), t !== null && Ya(t)),
      (e.stateNode = null),
      (e.return = null),
      (e.dependencies = null),
      (e.memoizedProps = null),
      (e.memoizedState = null),
      (e.pendingProps = null),
      (e.stateNode = null),
      (e.updateQueue = null));
  }
  var nt = null,
    Vt = !1;
  function wn(e, t, n) {
    for (n = n.child; n !== null;) (gg(e, t, n), (n = n.sibling));
  }
  function gg(e, t, n) {
    if (at && typeof at.onCommitFiberUnmount == 'function')
      try {
        at.onCommitFiberUnmount(Wl, n);
      } catch {}
    switch (n.tag) {
      case 26:
        (Ze || At(n, t),
          wn(e, t, n),
          n.memoizedState
            ? n.memoizedState.count--
            : n.stateNode && !Ze && ((n = n.stateNode), n.parentNode.removeChild(n)));
        break;
      case 27:
        (Ze || At(n, t), Su(n));
        var l = nt,
          u = Vt;
        (Yl(n.type) && ((nt = n.stateNode), (Vt = !1)),
          wn(e, t, n),
          bh(n.stateNode, n.type, n.memoizedProps),
          (nt = l),
          (Vt = u));
        break;
      case 5:
        (Ze || At(n, t), Su(n));
      case 6:
        if (
          (n.tag === 6 && Su(n),
          (l = nt),
          (u = Vt),
          (nt = null),
          wn(e, t, n),
          (nt = l),
          (Vt = u),
          nt !== null)
        )
          if (Vt)
            try {
              ((nt.nodeType === 9
                ? nt.body
                : nt.nodeName === 'HTML'
                  ? nt.ownerDocument.body
                  : nt
              ).removeChild(n.stateNode),
                (He = !0));
            } catch (i) {
              Qe(n, t, i);
            }
          else
            try {
              (nt.removeChild(n.stateNode), (He = !0));
            } catch (i) {
              Qe(n, t, i);
            }
        break;
      case 18:
        nt !== null &&
          (Vt
            ? ((e = nt),
              ah(
                e.nodeType === 9 ? e.body : e.nodeName === 'HTML' ? e.ownerDocument.body : e,
                n.stateNode,
              ),
              wr(e))
            : ah(nt, n.stateNode));
        break;
      case 4:
        ((l = nt),
          (u = Vt),
          (nt = n.stateNode.containerInfo),
          (Vt = !0),
          wn(e, t, n),
          (nt = l),
          (Vt = u));
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        (Ul(2, n, t), Ze || Ul(4, n, t), wn(e, t, n));
        break;
      case 1:
        (Ze ||
          (At(n, t), (l = n.stateNode), typeof l.componentWillUnmount == 'function' && tg(n, t, l)),
          wn(e, t, n));
        break;
      case 21:
        wn(e, t, n);
        break;
      case 22:
        ((Ze = (l = Ze) || n.memoizedState !== null), wn(e, t, n), (Ze = l));
        break;
      case 30:
        (At(n, t), wn(e, t, n));
        break;
      case 7:
        (Ze || At(n, t), wn(e, t, n));
        break;
      default:
        wn(e, t, n);
    }
  }
  function hg(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate), e !== null && ((e = e.memoizedState), e !== null))
    ) {
      e = e.dehydrated;
      try {
        wr(e);
      } catch (n) {
        Qe(t, t.return, n);
      }
    }
  }
  function mg(e, t) {
    if (
      t.memoizedState === null &&
      ((e = t.alternate),
      e !== null && ((e = e.memoizedState), e !== null && ((e = e.dehydrated), e !== null)))
    )
      try {
        wr(e);
      } catch (n) {
        Qe(t, t.return, n);
      }
  }
  function Gb(e) {
    switch (e.tag) {
      case 31:
      case 13:
      case 19:
        var t = e.stateNode;
        return (t === null && (t = e.stateNode = new fg()), t);
      case 22:
        return (
          (e = e.stateNode),
          (t = e._retryCache),
          t === null && (t = e._retryCache = new fg()),
          t
        );
      default:
        throw Error(c(435, e.tag));
    }
  }
  function io(e, t) {
    var n = Gb(e);
    t.forEach(function (l) {
      if (!n.has(l)) {
        n.add(l);
        var u = Wb.bind(null, e, l);
        l.then(u, u);
      }
    });
  }
  function kt(e, t, n) {
    var l = t.deletions;
    if (l !== null)
      for (var u = 0; u < l.length; u++) {
        var i = l[u],
          s = e,
          h = t,
          O = h;
        e: for (; O !== null;) {
          switch (O.tag) {
            case 27:
              if (Yl(O.type)) {
                ((nt = O.stateNode), (Vt = !1));
                break e;
              }
              break;
            case 5:
              ((nt = O.stateNode), (Vt = !1));
              break e;
            case 3:
            case 4:
              ((nt = O.stateNode.containerInfo), (Vt = !0));
              break e;
          }
          O = O.return;
        }
        if (nt === null) throw Error(c(160));
        (gg(s, h, i),
          (nt = null),
          (Vt = !1),
          (s = i.alternate),
          s !== null && (s.return = null),
          (i.return = null));
      }
    if (t.subtreeFlags & 13886) for (t = t.child; t !== null;) (vg(t, e, n), (t = t.sibling));
  }
  var Rn = null;
  function vg(e, t, n) {
    var l = e.alternate,
      u = e.flags;
    switch (e.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (u & 4 && ((l = e.updateQueue), (l = l !== null ? l.events : null), l !== null))
          for (var i = 0; i < l.length; i++) {
            var s = l[i];
            s.ref.impl = s.nextImpl;
          }
        (kt(t, e, n), Ht(e), u & 4 && (Ul(3, e, e.return), Eu(3, e), Ul(5, e, e.return)));
        break;
      case 1:
        (kt(t, e, n),
          Ht(e),
          u & 512 && (Ze || l === null || At(l, l.return)),
          u & 64 &&
            Et &&
            ((e = e.updateQueue),
            e !== null &&
              ((t = e.callbacks),
              t !== null &&
                ((n = e.shared.hiddenCallbacks),
                (e.shared.hiddenCallbacks = n === null ? t : n.concat(t))))));
        break;
      case 26:
        if (((i = Rn), kt(t, e, n), Ht(e), u & 512 && (Ze || l === null || At(l, l.return)), u & 4))
          if (((u = l !== null ? l.memoizedState : null), (n = e.memoizedState), l === null))
            if (n === null)
              if (e.stateNode === null)
                if (Et) e.stateNode = th(e.type, e.memoizedProps, t.containerInfo, e);
                else {
                  e: {
                    ((t = e.type), (n = e.memoizedProps), (u = i.ownerDocument || i));
                    t: switch (t) {
                      case 'title':
                        ((l = u.getElementsByTagName('title')[0]),
                          (!l ||
                            l[aa] ||
                            l[ht] ||
                            l.namespaceURI === 'http://www.w3.org/2000/svg' ||
                            l.hasAttribute('itemprop')) &&
                            ((l = u.createElement(t)),
                            u.head.insertBefore(l, u.querySelector('head > title'))),
                          xt(l, t, n),
                          (l[ht] = e),
                          rt(l),
                          (t = l));
                        break e;
                      case 'link':
                        if ((i = Ah('link', 'href', u).get(t + (n.href || '')))) {
                          for (s = 0; s < i.length; s++)
                            if (
                              ((l = i[s]),
                              l.getAttribute('href') ===
                                (n.href == null || n.href === '' ? null : n.href) &&
                                l.getAttribute('rel') === (n.rel == null ? null : n.rel) &&
                                l.getAttribute('title') === (n.title == null ? null : n.title) &&
                                l.getAttribute('crossorigin') ===
                                  (n.crossOrigin == null ? null : n.crossOrigin))
                            ) {
                              i.splice(s, 1);
                              break t;
                            }
                        }
                        ((l = u.createElement(t)), xt(l, t, n), u.head.appendChild(l));
                        break;
                      case 'meta':
                        if ((i = Ah('meta', 'content', u).get(t + (n.content || '')))) {
                          for (s = 0; s < i.length; s++)
                            if (
                              ((l = i[s]),
                              l.getAttribute('content') ===
                                (n.content == null ? null : '' + n.content) &&
                                l.getAttribute('name') === (n.name == null ? null : n.name) &&
                                l.getAttribute('property') ===
                                  (n.property == null ? null : n.property) &&
                                l.getAttribute('http-equiv') ===
                                  (n.httpEquiv == null ? null : n.httpEquiv) &&
                                l.getAttribute('charset') ===
                                  (n.charSet == null ? null : n.charSet))
                            ) {
                              i.splice(s, 1);
                              break t;
                            }
                        }
                        ((l = u.createElement(t)), xt(l, t, n), u.head.appendChild(l));
                        break;
                      default:
                        throw Error(c(468, t));
                    }
                    ((l[ht] = e), rt(l), (t = l));
                  }
                  e.stateNode = t;
                }
              else Et || Df(i, e.type, e.stateNode);
            else e.stateNode = Oh(i, n, e.memoizedProps);
          else
            u !== n
              ? (u === null
                  ? ((t = l.stateNode), t === null || Ze || t.parentNode.removeChild(t))
                  : u.count--,
                n === null ? Et || Df(i, e.type, e.stateNode) : Oh(i, n, e.memoizedProps))
              : n === null && e.stateNode !== null && zs(e, e.memoizedProps, l.memoizedProps);
        break;
      case 27:
        (kt(t, e, n),
          Ht(e),
          u & 512 && (Ze || l === null || At(l, l.return)),
          l !== null && u & 4 && zs(e, e.memoizedProps, l.memoizedProps));
        break;
      case 5:
        if (
          ((i = Gn),
          (Gn = !1),
          kt(t, e, n),
          (Gn = i),
          Ht(e),
          u & 512 && (Ze || l === null || At(l, l.return)),
          e.flags & 32)
        ) {
          t = e.stateNode;
          try {
            (Tl(t, ''), (He = !0));
          } catch (H) {
            Qe(e, e.return, H);
          }
        }
        (u & 4 &&
          e.stateNode != null &&
          ((t = e.memoizedProps), zs(e, t, l !== null ? l.memoizedProps : t)),
          u & 1024 && (Ys = !0));
        break;
      case 6:
        if ((kt(t, e, n), Ht(e), u & 4)) {
          if (e.stateNode === null) throw Error(c(162));
          ((t = e.memoizedProps), (n = e.stateNode));
          try {
            ((n.nodeValue = t), (He = !0));
          } catch (H) {
            Qe(e, e.return, H);
          }
        }
        break;
      case 3:
        if (
          ((He = !1),
          (To = null),
          (i = Rn),
          (Rn = Du(t.containerInfo)),
          kt(t, e, n),
          (Rn = i),
          Ht(e),
          u & 4 && l !== null && l.memoizedState.isDehydrated)
        )
          try {
            wr(t.containerInfo);
          } catch (H) {
            Qe(e, e.return, H);
          }
        (Ys && ((Ys = !1), bg(e)), (He = !1));
        break;
      case 4:
        ((u = Gn),
          (Gn = Et),
          (l = si()),
          (i = Rn),
          (Rn = Du(e.stateNode.containerInfo)),
          kt(t, e, n),
          Ht(e),
          (Rn = i),
          He && _u && (ro = !0),
          (He = l),
          (Gn = u));
        break;
      case 12:
        (kt(t, e, n), Ht(e));
        break;
      case 31:
        (kt(t, e, n),
          Ht(e),
          u & 4 && ((t = e.updateQueue), t !== null && ((e.updateQueue = null), io(e, t))));
        break;
      case 13:
        (kt(t, e, n),
          Ht(e),
          e.child.flags & 8192 &&
            (e.memoizedState !== null) != (l !== null && l.memoizedState !== null) &&
            (so = Dt()),
          u & 4 && ((t = e.updateQueue), t !== null && ((e.updateQueue = null), io(e, t))));
        break;
      case 22:
        ((i = e.memoizedState !== null), (s = l !== null && l.memoizedState !== null));
        var h = Et,
          O = Ze,
          M = Gn;
        ((Et = h || i),
          (Gn = M || i),
          (Ze = O || s),
          kt(t, e, n),
          (Ze = O),
          (Gn = M),
          (Et = h),
          Ht(e),
          u & 8192 &&
            ((t = e.stateNode),
            (t._visibility = i ? t._visibility & -2 : t._visibility | 1),
            !i ||
              l === null ||
              s ||
              Et ||
              Ze ||
              ((t = s || Ze),
              (n = Et),
              (l = Ze),
              (Et = i || Et),
              (Ze = t),
              Bl(e, 2),
              (Et = n),
              (Ze = l)),
            (!i && Gn) || Is(e, i)),
          u & 4 &&
            ((t = e.updateQueue),
            t !== null && ((n = t.retryQueue), n !== null && ((t.retryQueue = null), io(e, n)))));
        break;
      case 19:
        (kt(t, e, n),
          Ht(e),
          u & 4 && ((t = e.updateQueue), t !== null && ((e.updateQueue = null), io(e, t))));
        break;
      case 30:
        (u & 512 && (Ze || l === null || At(l, l.return)),
          (u = si()),
          (i = _u),
          (s = (n & 335544064) === n),
          (h = e.memoizedProps),
          (_u = s && al(h.default, h.update) !== 'none'),
          kt(t, e, n),
          Ht(e),
          s && l !== null && He && (e.flags |= 4),
          (_u = i),
          (He = u));
        break;
      case 21:
        break;
      case 7:
        (u & 512 && (Ze || l === null || At(l, l.return)),
          l && l.stateNode !== null && (l.stateNode._fragmentFiber = e));
      default:
        (kt(t, e, n), Ht(e));
    }
  }
  function Ht(e) {
    var t = e.flags;
    if (t & 2) {
      try {
        for (var n, l = e.return; l !== null;) {
          if (lg(l)) {
            n = l;
            break;
          }
          l = l.return;
        }
        l = null;
        for (var u = e.return; u !== null;) {
          if (Ms(u)) {
            var i = u.stateNode;
            l === null ? (l = [i]) : l.push(i);
          }
          if (js(u)) break;
          u = u.return;
        }
        var s = l;
        if (n == null) throw Error(c(160));
        switch (n.tag) {
          case 27:
            var h = n.stateNode,
              O = Us(e);
            to(e, O, h, s);
            break;
          case 5:
            var M = n.stateNode;
            n.flags & 32 && (Tl(M, ''), (n.flags &= -33));
            var H = Us(e);
            to(e, H, M, s);
            break;
          case 3:
          case 4:
            var V = n.stateNode.containerInfo,
              D = Us(e);
            Bs(e, D, V, s);
            break;
          default:
            throw Error(c(161));
        }
      } catch (U) {
        Qe(e, e.return, U);
      }
      e.flags &= -3;
    }
    t & 4096 && (e.flags &= -4097);
  }
  function bg(e) {
    if (e.subtreeFlags & 1024)
      for (e = e.child; e !== null;) {
        var t = e;
        (bg(t),
          t.tag === 5 && t.flags & 1024 && ((t = t.stateNode), (Cr = !0), t.reset(), (Cr = !1)),
          (e = e.sibling));
      }
  }
  function sr(e, t) {
    if (t.subtreeFlags & 9270) for (t = t.child; t !== null;) (Eg(t, e), (t = t.sibling));
    else sg(t);
  }
  function Eg(e, t) {
    var n = e.alternate;
    if (n === null) ks(e, !1);
    else
      switch (e.tag) {
        case 3:
          if (((Vs = qn = !1), ug(), sr(t, e), !qn && !ro)) {
            if (((e = Hn), e !== null))
              for (var l = 0; l < e.length; l += 3) {
                n = e[l];
                var u = e[l + 1];
                (ih(n, e[l + 2]),
                  (n = n.ownerDocument.documentElement),
                  n !== null &&
                    n.animate(
                      { opacity: [0, 0], pointerEvents: ['none', 'none'] },
                      {
                        duration: 0,
                        fill: 'forwards',
                        pseudoElement: '::view-transition-group(' + u + ')',
                      },
                    ));
              }
            ((e = t.containerInfo),
              (e = e.nodeType === 9 ? e.documentElement : e.ownerDocument.documentElement),
              e !== null &&
                e.style.viewTransitionName === '' &&
                ((e.style.viewTransitionName = 'none'),
                e.animate(
                  { opacity: [0, 0], pointerEvents: ['none', 'none'] },
                  { duration: 0, fill: 'forwards', pseudoElement: '::view-transition-group(root)' },
                ),
                e.animate(
                  { width: [0, 0], height: [0, 0] },
                  { duration: 0, fill: 'forwards', pseudoElement: '::view-transition' },
                )),
              (Vs = !0));
          }
          Hn = null;
          break;
        case 5:
          sr(t, e);
          break;
        case 4:
          ((l = qn), (qn = !1), sr(t, e), qn && (ro = !0), (qn = l));
          break;
        case 22:
          e.memoizedState === null && (n.memoizedState !== null ? ks(e, !1) : sr(t, e));
          break;
        case 30:
          ((l = qn), (u = ug()), (qn = !1), sr(t, e), qn && (e.flags |= 4));
          var i = e.memoizedProps,
            s = e.stateNode;
          ((t = ll(i, s)), (s = ll(n.memoizedProps, s)));
          var h = al(i.default, i.update);
          (h === 'none'
            ? (t = !1)
            : ((i = n.memoizedState),
              (n.memoizedState = null),
              (n = e.child),
              (Yt = 0),
              (t = qs(e, n, t, s, h, i, !0)),
              Yt !== (i === null ? 0 : i.length) && (e.flags |= 32)),
            (e.flags & 4) !== 0 && t
              ? (mr(e, e.memoizedProps.onUpdate), (Hn = u))
              : u !== null && (u.push.apply(u, Hn), (Hn = u)),
            (qn = (e.flags & 32) !== 0 ? !0 : l));
          break;
        default:
          sr(t, e);
      }
  }
  function Yn(e, t) {
    if (t.subtreeFlags & 8772)
      for (t = t.child; t !== null;) (dg(e, t.alternate, t), (t = t.sibling));
  }
  function Bl(e, t) {
    for (e = e.child; e !== null;) {
      var n = e,
        l = t;
      switch (n.tag) {
        case 0:
        case 11:
        case 14:
        case 15:
          (Ul(4, n, n.return), Bl(n, l));
          break;
        case 1:
          At(n, n.return);
          var u = n.stateNode;
          (typeof u.componentWillUnmount == 'function' && tg(n, n.return, u), Bl(n, l));
          break;
        case 27:
          (l & 2) !== 0 && bh(n.stateNode, n.type, n.memoizedProps);
        case 5:
          (At(n, n.return), (n.tag !== 5 && n.tag !== 27) || Su(n), Bl(n, l));
          break;
        case 6:
          Su(n);
          break;
        case 26:
          (At(n, n.return),
            (u = n.stateNode),
            n.memoizedState !== null || u === null || Ze || u.parentNode.removeChild(u),
            Bl(n, l));
          break;
        case 22:
          n.memoizedState === null && Bl(n, l);
          break;
        case 30:
          (At(n, n.return), Bl(n, l));
          break;
        case 7:
          At(n, n.return);
        default:
          Bl(n, l);
      }
      e = e.sibling;
    }
  }
  function Nn(e, t, n) {
    for (n = (t.subtreeFlags & 8772) !== 0 ? n : n & -2, t = t.child; t !== null;) {
      var l = t.alternate,
        u = e,
        i = t,
        s = i.flags,
        h = (n & 1) !== 0;
      switch (i.tag) {
        case 0:
        case 11:
        case 15:
          (Nn(u, i, n), Eu(4, i));
          break;
        case 1:
          if ((Nn(u, i, n), (l = i), (u = l.stateNode), typeof u.componentDidMount == 'function'))
            try {
              u.componentDidMount();
            } catch (H) {
              Qe(l, l.return, H);
            }
          if (((l = i), (u = l.updateQueue), u !== null)) {
            var O = l.stateNode;
            try {
              var M = u.shared.hiddenCallbacks;
              if (M !== null)
                for (u.shared.hiddenCallbacks = null, u = 0; u < M.length; u++) qy(M[u], O);
            } catch (H) {
              Qe(l, l.return, H);
            }
          }
          (h && s & 64 && eg(i), kn(i, i.return));
          break;
        case 27:
          (n & 2) !== 0 && ag(i);
        case 5:
          ((i.tag !== 5 && i.tag !== 27) || ng(i),
            Nn(u, i, n),
            h && l === null && s & 4 && Ls(i),
            kn(i, i.return));
          break;
        case 6:
          ng(i);
          break;
        case 26:
          ((O = i.stateNode),
            i.memoizedState !== null || O === null || Et || Df(Du(O.ownerDocument), i.type, O),
            Nn(u, i, n),
            h && l === null && s & 4 && Ls(i),
            kn(i, i.return));
          break;
        case 12:
          Nn(u, i, n);
          break;
        case 31:
          (Nn(u, i, n), h && s & 4 && hg(u, i));
          break;
        case 13:
          (Nn(u, i, n), h && s & 4 && mg(u, i));
          break;
        case 22:
          (i.memoizedState === null && Nn(u, i, n), kn(i, i.return));
          break;
        case 30:
          (Nn(u, i, n), kn(i, i.return));
          break;
        case 7:
          kn(i, i.return);
        default:
          Nn(u, i, n);
      }
      t = t.sibling;
    }
  }
  function Xs(e, t) {
    var n = null;
    (e !== null &&
      e.memoizedState !== null &&
      e.memoizedState.cachePool !== null &&
      (n = e.memoizedState.cachePool.pool),
      (e = null),
      t.memoizedState !== null &&
        t.memoizedState.cachePool !== null &&
        (e = t.memoizedState.cachePool.pool),
      e !== n && (e != null && e.refCount++, n != null && iu(n)));
  }
  function Qs(e, t) {
    ((e = null),
      t.alternate !== null && (e = t.alternate.memoizedState.cache),
      (t = t.memoizedState.cache),
      t !== e && (t.refCount++, e != null && iu(e)));
  }
  function hn(e, t, n, l) {
    var u = (n & 335544064) === n;
    if (t.subtreeFlags & (u ? 10262 : 10256))
      for (t = t.child; t !== null;) (Sg(e, t, n, l), (t = t.sibling));
    else u && cg(t);
  }
  function Sg(e, t, n, l) {
    var u = (n & 335544064) === n;
    u && t.alternate === null && t.return !== null && t.return.alternate !== null && ao(t);
    var i = t.flags;
    switch (t.tag) {
      case 0:
      case 11:
      case 15:
        (hn(e, t, n, l), i & 2048 && Eu(9, t));
        break;
      case 1:
        hn(e, t, n, l);
        break;
      case 3:
        (hn(e, t, n, l),
          u &&
            Vs &&
            ((e = e.containerInfo),
            (e = e.nodeType === 9 ? e.body : e.nodeName === 'HTML' ? e.ownerDocument.body : e),
            e.style.viewTransitionName === 'root' && (e.style.viewTransitionName = ''),
            (e = e.ownerDocument.documentElement),
            e !== null &&
              e.style.viewTransitionName === 'none' &&
              (e.style.viewTransitionName = '')),
          i & 2048 &&
            ((i = null),
            t.alternate !== null && (i = t.alternate.memoizedState.cache),
            (t = t.memoizedState.cache),
            t !== i && (t.refCount++, i != null && iu(i))));
        break;
      case 12:
        if (i & 2048) {
          (hn(e, t, n, l), (i = t.stateNode));
          try {
            var s = t.memoizedProps,
              h = s.id,
              O = s.onPostCommit;
            typeof O == 'function' &&
              O(h, t.alternate === null ? 'mount' : 'update', i.passiveEffectDuration, -0);
          } catch (M) {
            Qe(t, t.return, M);
          }
        } else hn(e, t, n, l);
        break;
      case 31:
        hn(e, t, n, l);
        break;
      case 13:
        hn(e, t, n, l);
        break;
      case 23:
        break;
      case 22:
        ((s = t.stateNode),
          (h = t.alternate),
          t.memoizedState !== null
            ? (u && h !== null && h.memoizedState === null && ao(h),
              s._visibility & 2 ? hn(e, t, n, l) : Tu(e, t))
            : (u && h !== null && h.memoizedState !== null && ao(t),
              s._visibility & 2
                ? hn(e, t, n, l)
                : ((s._visibility |= 2), fr(e, t, n, l, (t.subtreeFlags & 10256) !== 0 || !1))),
          i & 2048 && Xs(h, t));
        break;
      case 24:
        (hn(e, t, n, l), i & 2048 && Qs(t.alternate, t));
        break;
      case 30:
        (u && ((i = t.alternate), i !== null && (Fn(i.child, !0), Fn(t.child, !0))),
          hn(e, t, n, l));
        break;
      default:
        hn(e, t, n, l);
    }
  }
  function fr(e, t, n, l, u) {
    for (u = u && ((t.subtreeFlags & 10256) !== 0 || !1), t = t.child; t !== null;) {
      var i = e,
        s = t,
        h = n,
        O = l,
        M = s.flags;
      switch (s.tag) {
        case 0:
        case 11:
        case 15:
          (fr(i, s, h, O, u), Eu(8, s));
          break;
        case 23:
          break;
        case 22:
          var H = s.stateNode;
          (s.memoizedState !== null
            ? H._visibility & 2
              ? fr(i, s, h, O, u)
              : Tu(i, s)
            : ((H._visibility |= 2), fr(i, s, h, O, u)),
            u && M & 2048 && Xs(s.alternate, s));
          break;
        case 24:
          (fr(i, s, h, O, u), u && M & 2048 && Qs(s.alternate, s));
          break;
        default:
          fr(i, s, h, O, u);
      }
      t = t.sibling;
    }
  }
  function Tu(e, t) {
    if (t.subtreeFlags & 10256)
      for (t = t.child; t !== null;) {
        var n = e,
          l = t,
          u = l.flags;
        switch (l.tag) {
          case 22:
            (Tu(n, l), u & 2048 && Xs(l.alternate, l));
            break;
          case 24:
            (Tu(n, l), u & 2048 && Qs(l.alternate, l));
            break;
          default:
            Tu(n, l);
        }
        t = t.sibling;
      }
  }
  var Aa = 8192;
  function xa(e, t, n) {
    if (e.subtreeFlags & Aa) for (e = e.child; e !== null;) (_g(e, t, n), (e = e.sibling));
  }
  function _g(e, t, n) {
    switch (e.tag) {
      case 26:
        (xa(e, t, n),
          e.flags & Aa &&
            (e.memoizedState !== null
              ? X1(n, Rn, e.memoizedState, e.memoizedProps)
              : ((e = e.stateNode), (t & 335544128) === t && Rh(n, e))));
        break;
      case 5:
        (xa(e, t, n), e.flags & Aa && ((e = e.stateNode), (t & 335544128) === t && Rh(n, e)));
        break;
      case 3:
      case 4:
        var l = Rn;
        ((Rn = Du(e.stateNode.containerInfo)), xa(e, t, n), (Rn = l));
        break;
      case 22:
        e.memoizedState === null &&
          ((l = e.alternate),
          l !== null && l.memoizedState !== null
            ? ((l = Aa), (Aa = 16777216), xa(e, t, n), (Aa = l))
            : xa(e, t, n));
        break;
      case 30:
        if ((e.flags & Aa) !== 0 && ((l = e.memoizedProps.name), l != null && l !== 'auto')) {
          var u = e.stateNode;
          ((u.paired = null), Pt === null && (Pt = new Map()), Pt.set(l, u));
        }
        xa(e, t, n);
        break;
      default:
        xa(e, t, n);
    }
  }
  function Tg(e) {
    var t = e.alternate;
    if (t !== null && ((e = t.child), e !== null)) {
      t.child = null;
      do ((t = e.sibling), (e.sibling = null), (e = t));
      while (e !== null);
    }
  }
  function Ou(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          ((St = l), Ag(l, e));
        }
      Tg(e);
    }
    if (e.subtreeFlags & 10256) for (e = e.child; e !== null;) (Og(e), (e = e.sibling));
  }
  function Og(e) {
    switch (e.tag) {
      case 0:
      case 11:
      case 15:
        (Ou(e), e.flags & 2048 && Ul(9, e, e.return));
        break;
      case 3:
        Ou(e);
        break;
      case 12:
        Ou(e);
        break;
      case 22:
        var t = e.stateNode;
        e.memoizedState !== null && t._visibility & 2 && (e.return === null || e.return.tag !== 13)
          ? ((t._visibility &= -3), oo(e))
          : Ou(e);
        break;
      default:
        Ou(e);
    }
  }
  function oo(e) {
    var t = e.deletions;
    if ((e.flags & 16) !== 0) {
      if (t !== null)
        for (var n = 0; n < t.length; n++) {
          var l = t[n];
          ((St = l), Ag(l, e));
        }
      Tg(e);
    }
    for (e = e.child; e !== null;) {
      switch (((t = e), t.tag)) {
        case 0:
        case 11:
        case 15:
          (Ul(8, t, t.return), oo(t));
          break;
        case 22:
          ((n = t.stateNode), n._visibility & 2 && ((n._visibility &= -3), oo(t)));
          break;
        default:
          oo(t);
      }
      e = e.sibling;
    }
  }
  function Ag(e, t) {
    for (; St !== null;) {
      var n = St;
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          Ul(8, n, t);
          break;
        case 23:
        case 22:
          if (n.memoizedState !== null && n.memoizedState.cachePool !== null) {
            var l = n.memoizedState.cachePool.pool;
            l != null && l.refCount++;
          }
          break;
        case 24:
          iu(n.memoizedState.cache);
      }
      if (((l = n.child), l !== null)) ((l.return = n), (St = l));
      else
        e: for (n = e; St !== null;) {
          l = St;
          var u = l.sibling,
            i = l.return;
          if ((pg(l), l === n)) {
            St = null;
            break e;
          }
          if (u !== null) {
            ((u.return = i), (St = u));
            break e;
          }
          St = i;
        }
    }
  }
  var qb = {
      getCacheForType: function (e) {
        var t = _t(ft),
          n = t.data.get(e);
        return (n === void 0 && ((n = e()), t.data.set(e, n)), n);
      },
      cacheSignal: function () {
        return _t(ft).controller.signal;
      },
    },
    Yb = typeof WeakMap == 'function' ? WeakMap : Map,
    Ie = 0,
    We = null,
    ze = null,
    Be = 0,
    Xe = 0,
    Wt = null,
    kl = !1,
    dr = !1,
    $s = !1,
    yl = 0,
    ot = 0,
    Hl = 0,
    Ca = 0,
    co = 0,
    en = 0,
    yr = 0,
    Au = null,
    It = null,
    Ks = !1,
    so = 0,
    xg = 0,
    fo = 1 / 0,
    yo = null,
    Fl = null,
    ut = 0,
    Dn = null,
    wa = null,
    Vn = 0,
    Js = 0,
    Ps = null,
    Cg = null,
    pr = null,
    gr = null,
    hr = null,
    xu = 0,
    po = null;
  function tn() {
    return (Ie & 2) !== 0 && Be !== 0 ? Be & -Be : de.T !== null ? cf() : ri();
  }
  function wg() {
    if (en === 0)
      if ((Be & 536870912) === 0 || Ne) {
        var e = ka;
        ((ka <<= 1), (ka & 3932160) === 0 && (ka = 262144), (en = e));
      } else en = 536870912;
    return ((e = Tt.current), e !== null && (e.flags |= 32), en);
  }
  function mr(e, t) {
    if (t != null) {
      var n = e.stateNode,
        l = n.ref;
      (l === null && (l = n.ref = oh(ll(e.memoizedProps, n))),
        gr === null && (gr = []),
        gr.push(t.bind(null, l)));
    }
  }
  function Zt(e, t, n) {
    (((e === We && (Xe === 2 || Xe === 9)) || e.cancelPendingCommit !== null) &&
      (vr(e, 0), Gl(e, Be, en, !1)),
      ta(e, n),
      ((Ie & 2) === 0 || e !== We) &&
        (e === We && ((Ie & 2) === 0 && (Ca |= n), ot === 4 && Gl(e, Be, en, !1)), In(e)));
  }
  function Rg(e, t, n) {
    if ((Ie & 6) !== 0) throw Error(c(327));
    var l = (!n && (t & 127) === 0 && (t & e.expiredLanes) === 0) || ea(e, t),
      u = l ? Zb(e, t) : ef(e, t, !0),
      i = l;
    do {
      if (u === 0) {
        dr && !l && Gl(e, t, 0, !1);
        break;
      } else {
        if (((n = e.current.alternate), i && !Vb(n))) {
          ((u = ef(e, t, !1)), (i = !1));
          continue;
        }
        if (u === 2) {
          if (((i = t), e.errorRecoveryDisabledLanes & i)) var s = 0;
          else
            ((s = e.pendingLanes & -536870913), (s = s !== 0 ? s : s & 536870912 ? 536870912 : 0));
          if (s !== 0) {
            t = s;
            e: {
              var h = e;
              u = Au;
              var O = h.current.memoizedState.isDehydrated;
              if ((O && (vr(h, s).flags |= 256), (s = ef(h, s, !1)), s !== 2 && s !== 6)) {
                if ($s && !O) {
                  ((h.errorRecoveryDisabledLanes |= i), (Ca |= i), (u = 4));
                  break e;
                }
                ((i = It), (It = u), i !== null && (It === null ? (It = i) : It.push.apply(It, i)));
              }
              u = s;
            }
            if (((i = !1), u !== 2)) continue;
          }
        }
        if (u === 1) {
          (vr(e, 0), Gl(e, t, 0, !0));
          break;
        }
        e: {
          switch (((l = e), (i = u), i)) {
            case 0:
            case 1:
              throw Error(c(345));
            case 4:
              if ((t & 4194048) !== t && (t & 62914560) !== t) break;
            case 6:
              Gl(l, t, en, !kl);
              break e;
            case 2:
              It = null;
              break;
            case 3:
            case 5:
              break;
            default:
              throw Error(c(329));
          }
          if ((t & 62914560) === t && ((u = so + 300 - Dt()), 10 < u)) {
            if ((Gl(l, t, en, !kl), Fa(l, 0, !0) !== 0)) break e;
            ((Vn = t),
              (l.timeoutHandle = Ef(
                Ng.bind(null, l, n, It, yo, Ks, t, en, Ca, yr, kl, i, 'Throttled', -0, 0),
                u,
              )));
            break e;
          }
          Ng(l, n, It, yo, Ks, t, en, Ca, yr, kl, i, null, -0, 0);
        }
      }
      break;
    } while (!0);
    In(e);
  }
  function Ng(e, t, n, l, u, i, s, h, O, M, H, V, D, U) {
    e.timeoutHandle = -1;
    var ne = t.subtreeFlags,
      pe = (i & 335544064) === i;
    if (
      ((V = null),
      (pe || ne & 8192 || (ne & 16785408) === 16785408) &&
        ((V = {
          stylesheets: null,
          count: 0,
          imgCount: 0,
          imgBytes: 0,
          suspenseyImages: [],
          waitingForImages: !0,
          waitingForViewTransition: !1,
          unsuspend: F,
        }),
        (Pt = null),
        _g(t, i, V),
        pe &&
          ((ne = V),
          (pe = e.containerInfo),
          (pe = (pe.nodeType === 9 ? pe : pe.ownerDocument).__reactViewTransition),
          pe != null &&
            (ne.count++,
            (ne.waitingForViewTransition = !0),
            (ne = Lu.bind(ne)),
            pe.finished.then(ne, ne))),
        (ne = (i & 62914560) === i ? so - Dt() : (i & 4194048) === i ? xg - Dt() : 0),
        (ne = Q1(V, ne)),
        ne !== null))
    ) {
      ((Vn = i),
        (e.cancelPendingCommit = ne(kg.bind(null, e, t, i, n, l, u, s, h, O, M, H, V, null, D, U))),
        Gl(e, i, s, !M));
      return;
    }
    kg(e, t, i, n, l, u, s, h, O, M, H, V);
  }
  function Vb(e) {
    for (var t = e; ;) {
      var n = t.tag;
      if (
        (n === 0 || n === 11 || n === 15) &&
        t.flags & 16384 &&
        ((n = t.updateQueue), n !== null && ((n = n.stores), n !== null))
      )
        for (var l = 0; l < n.length; l++) {
          var u = n[l],
            i = u.getSnapshot;
          u = u.value;
          try {
            if (!Kt(i(), u)) return !1;
          } catch {
            return !1;
          }
        }
      if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) ((n.return = t), (t = n));
      else {
        if (t === e) break;
        for (; t.sibling === null;) {
          if (t.return === null || t.return === e) return !0;
          t = t.return;
        }
        ((t.sibling.return = t.return), (t = t.sibling));
      }
    }
    return !0;
  }
  function Gl(e, t, n, l) {
    ((t = el(e, t)),
      (t &= ~co),
      (t &= ~Ca),
      (e.suspendedLanes |= t),
      (e.pingedLanes &= ~t),
      l && (e.warmLanes |= t),
      (l = e.expirationTimes));
    for (var u = t; 0 < u;) {
      var i = 31 - jt(u),
        s = 1 << i;
      ((l[i] = -1), (u &= ~s));
    }
    n !== 0 && li(e, n, t);
  }
  function go() {
    return (Ie & 6) === 0 ? (Cu(0), !1) : !0;
  }
  function Ws() {
    if (ze !== null) {
      if (Xe === 0) var e = ze.return;
      else ((e = ze), (il = ga = null), is(e), (ar = null), (su = 0), (e = ze));
      for (; e !== null;) (Wp(e.alternate, e), (e = e.return));
      ze = null;
    }
  }
  function vr(e, t) {
    var n = e.timeoutHandle;
    return (
      n !== -1 && ((e.timeoutHandle = -1), p1(n)),
      (n = e.cancelPendingCommit),
      n !== null && ((e.cancelPendingCommit = null), n()),
      (Vn = 0),
      Ws(),
      (We = e),
      (ze = n = rl(e.current, null)),
      (Be = t),
      (Xe = 0),
      (Wt = null),
      (kl = !1),
      (dr = ea(e, t)),
      ($s = !1),
      (yr = en = co = Ca = Hl = ot = 0),
      (It = Au = null),
      (Ks = !1),
      (yl = el(e, t)),
      _i(),
      n
    );
  }
  function Dg(e, t) {
    ((Ce = null),
      (de.H = Xi),
      t === lr || t === Mi
        ? ((t = ky()), (Xe = 3))
        : t === Qc
          ? ((t = ky()), (Xe = 4))
          : (Xe =
              t === _s
                ? 8
                : t !== null && typeof t == 'object' && typeof t.then == 'function'
                  ? 6
                  : 1),
      (Wt = t),
      ze === null && ((ot = 1), Qi(e, dn(t, e.current))));
  }
  function jg() {
    var e = Tt.current;
    return e === null
      ? !0
      : (Be & 4194048) === Be
        ? Rt === null
        : (Be & 62914560) === Be || (Be & 536870912) !== 0
          ? e === Rt
          : !1;
  }
  function Mg() {
    var e = de.H;
    return ((de.H = Xi), e === null ? Xi : e);
  }
  function Lg() {
    var e = de.A;
    return ((de.A = qb), e);
  }
  function ho() {
    ((ot = 4),
      kl || ((Be & 4194048) !== Be && Tt.current !== null) || (dr = !0),
      ((Hl & 134217727) === 0 && (Ca & 134217727) === 0) || We === null || Gl(We, Be, en, !1));
  }
  function ef(e, t, n) {
    var l = Ie;
    Ie |= 2;
    var u = Mg(),
      i = Lg();
    ((We !== e || Be !== t) && ((yo = null), vr(e, t)), (t = !1));
    var s = ot;
    e: do
      try {
        if (Xe !== 0 && ze !== null) {
          var h = ze,
            O = Wt;
          switch (Xe) {
            case 8:
              (Ws(), (s = 6));
              break e;
            case 3:
            case 2:
            case 9:
            case 6:
              Tt.current === null && (t = !0);
              var M = Xe;
              if (((Xe = 0), (Wt = null), br(e, h, O, M), n && dr)) {
                s = 0;
                break e;
              }
              break;
            default:
              ((M = Xe), (Xe = 0), (Wt = null), br(e, h, O, M));
          }
        }
        (Ib(), (s = ot));
        break;
      } catch (H) {
        Dg(e, H);
      }
    while (!0);
    return (
      t && e.shellSuspendCounter++,
      (il = ga = null),
      (Ie = l),
      (de.H = u),
      (de.A = i),
      ze === null && ((We = null), (Be = 0), _i()),
      s
    );
  }
  function Ib() {
    for (; ze !== null;) zg(ze);
  }
  function Zb(e, t) {
    var n = Ie;
    Ie |= 2;
    var l = Mg(),
      u = Lg();
    We !== e || Be !== t ? ((yo = null), (fo = Dt() + 500), vr(e, t)) : (dr = ea(e, t));
    e: do
      try {
        if (Xe !== 0 && ze !== null) {
          t = ze;
          var i = Wt;
          t: switch (Xe) {
            case 1:
              ((Xe = 0), (Wt = null), br(e, t, i, 1));
              break;
            case 2:
            case 9:
              if (Uy(i)) {
                ((Xe = 0), (Wt = null), Ug(t));
                break;
              }
              ((t = function () {
                ((Xe !== 2 && Xe !== 9) || We !== e || (Xe = 7), In(e));
              }),
                i.then(t, t));
              break e;
            case 3:
              Xe = 7;
              break e;
            case 4:
              Xe = 5;
              break e;
            case 7:
              Uy(i) ? ((Xe = 0), (Wt = null), Ug(t)) : ((Xe = 0), (Wt = null), br(e, t, i, 7));
              break;
            case 5:
              var s = null;
              switch (ze.tag) {
                case 26:
                  s = ze.memoizedState;
                case 5:
                case 27:
                  var h = ze;
                  if (s ? Ch(s) : h.stateNode.complete) {
                    ((Xe = 0), (Wt = null));
                    var O = h.sibling;
                    if (O !== null) ze = O;
                    else {
                      var M = h.return;
                      M !== null ? ((ze = M), mo(M)) : (ze = null);
                    }
                    break t;
                  }
              }
              ((Xe = 0), (Wt = null), br(e, t, i, 5));
              break;
            case 6:
              ((Xe = 0), (Wt = null), br(e, t, i, 6));
              break;
            case 8:
              (Ws(), (ot = 6));
              break e;
            default:
              throw Error(c(462));
          }
        }
        Xb();
        break;
      } catch (H) {
        Dg(e, H);
      }
    while (!0);
    return (
      (il = ga = null),
      (de.H = l),
      (de.A = u),
      (Ie = n),
      ze !== null ? 0 : ((We = null), (Be = 0), _i(), ot)
    );
  }
  function Xb() {
    for (; ze !== null && !uc();) zg(ze);
  }
  function zg(e) {
    var t = Jp(e.alternate, e, yl);
    ((e.memoizedProps = e.pendingProps), t === null ? mo(e) : (ze = t));
  }
  function Ug(e) {
    var t = e,
      n = t.alternate;
    switch (t.tag) {
      case 15:
      case 0:
        t = Vp(n, t, t.pendingProps, t.type, void 0, Be);
        break;
      case 11:
        t = Vp(n, t, t.pendingProps, t.type.render, t.ref, Be);
        break;
      case 5:
        is(t);
        var l = t;
        l === bt &&
          (Ne
            ? (wi(l), l.tag === 5 && l.stateNode != null && (et = l.stateNode))
            : (wi(l), (Ne = !0)));
      default:
        (Wp(n, t), (t = ze = Ay(t, yl)), (t = Jp(n, t, yl)));
    }
    ((e.memoizedProps = e.pendingProps), t === null ? mo(e) : (ze = t));
  }
  function br(e, t, n, l) {
    ((il = ga = null), is(t), (ar = null), (su = 0));
    var u = t.return;
    try {
      if (Lb(e, u, t, n, Be)) {
        ((ot = 1), Qi(e, dn(n, e.current)), (ze = null));
        return;
      }
    } catch (i) {
      if (u !== null) throw ((ze = u), i);
      ((ot = 1), Qi(e, dn(n, e.current)), (ze = null));
      return;
    }
    t.flags & 32768
      ? (Ne || l === 1
          ? (e = !0)
          : dr || (Be & 536870912) !== 0
            ? (e = !1)
            : ((kl = e = !0),
              (l === 2 || l === 9 || l === 3 || l === 6) &&
                ((l = Tt.current), l !== null && l.tag === 13 && (l.flags |= 16384))),
        Bg(t, e))
      : mo(t);
  }
  function mo(e) {
    var t = e;
    do {
      if ((t.flags & 32768) !== 0) {
        Bg(t, kl);
        return;
      }
      e = t.return;
      var n = kb(t.alternate, t, yl);
      if (n !== null) {
        ze = n;
        return;
      }
      if (((t = t.sibling), t !== null)) {
        ze = t;
        return;
      }
      ze = t = e;
    } while (t !== null);
    ot === 0 && (ot = 5);
  }
  function Bg(e, t) {
    do {
      var n = Hb(e.alternate, e);
      if (n !== null) {
        ((n.flags &= 32767), (ze = n));
        return;
      }
      if (
        ((n = e.return),
        n !== null && ((n.flags |= 32768), (n.subtreeFlags = 0), (n.deletions = null)),
        !t && ((e = e.sibling), e !== null))
      ) {
        ze = e;
        return;
      }
      ze = e = n;
    } while (e !== null);
    ((ot = 6), (ze = null));
  }
  function kg(e, t, n, l, u, i, s, h, O, M, H, V) {
    e.cancelPendingCommit = null;
    do vo();
    while (ut !== 0);
    if ((Ie & 6) !== 0) throw Error(c(327));
    if (t !== null) {
      if (t === e.current) throw Error(c(177));
      (e === We && ((ze = We = null), (Be = 0)),
        (wa = t),
        (Dn = e),
        (Vn = n),
        (Ps = u),
        (Cg = l),
        Qb(e, t, n, s, h, O, V));
    }
  }
  function Qb(e, t, n, l, u, i, s) {
    var h = t.lanes | t.childLanes;
    if (
      ((Js = h),
      (h |= zc),
      pc(e, n, h, l, u, i),
      (gr = null),
      (n & 335544064) === n ? ((hr = _b(e)), (l = 10262)) : ((hr = null), (l = 10256)),
      (t.subtreeFlags & l) !== 0 || (t.flags & l) !== 0
        ? ((e.callbackNode = null),
          (e.callbackPriority = 0),
          e1(on, function () {
            return (af(), null);
          }))
        : ((e.callbackNode = null), (e.callbackPriority = 0)),
      (no = !1),
      (l = (t.flags & 13878) !== 0),
      (t.subtreeFlags & 13878) !== 0 || l)
    ) {
      ((l = de.T), (de.T = null), (u = Se.p), (Se.p = 2), (i = Ie), (Ie |= 4));
      try {
        Fb(e, t, n);
      } finally {
        ((Ie = i), (Se.p = u), (de.T = l));
      }
    }
    ((ut = 1), no ? (pr = E1(s, e.containerInfo, hr, tf, nf, Kb, lf, af, $b)) : (tf(), nf(), lf()));
  }
  function $b(e) {
    if (ut !== 0) {
      var t = Dn.onRecoverableError;
      t(e, { componentStack: null });
    }
  }
  function Kb() {
    ut === 3 && ((ut = 0), Eg(wa, Dn), (ut = 4));
  }
  function tf() {
    if (ut === 1) {
      ut = 0;
      var e = Dn,
        t = wa,
        n = Vn,
        l = (t.flags & 13878) !== 0;
      if ((t.subtreeFlags & 13878) !== 0 || l) {
        ((l = de.T), (de.T = null));
        var u = Se.p;
        Se.p = 2;
        var i = Ie;
        Ie |= 4;
        try {
          ((_u = ro = !1), vg(t, e, n), (n = mf));
          var s = gy(e.containerInfo),
            h = n.focusedElem,
            O = n.selectionRange;
          if (s !== h && h && h.ownerDocument && py(h.ownerDocument.documentElement, h)) {
            if (O !== null && Nc(h)) {
              var M = O.start,
                H = O.end;
              if ((H === void 0 && (H = M), 'selectionStart' in h))
                ((h.selectionStart = M), (h.selectionEnd = Math.min(H, h.value.length)));
              else {
                var V = h.ownerDocument || document,
                  D = (V && V.defaultView) || window;
                if (D.getSelection) {
                  var U = D.getSelection(),
                    ne = h.textContent.length,
                    pe = Math.min(O.start, ne),
                    we = O.end === void 0 ? pe : Math.min(O.end, ne);
                  !U.extend && pe > we && ((s = we), (we = pe), (pe = s));
                  var j = yy(h, pe),
                    w = yy(h, we);
                  if (
                    j &&
                    w &&
                    (U.rangeCount !== 1 ||
                      U.anchorNode !== j.node ||
                      U.anchorOffset !== j.offset ||
                      U.focusNode !== w.node ||
                      U.focusOffset !== w.offset)
                  ) {
                    var z = V.createRange();
                    (z.setStart(j.node, j.offset),
                      U.removeAllRanges(),
                      pe > we
                        ? (U.addRange(z), U.extend(w.node, w.offset))
                        : (z.setEnd(w.node, w.offset), U.addRange(z)));
                  }
                }
              }
            }
            for (V = [], U = h; (U = U.parentNode);)
              U.nodeType === 1 && V.push({ element: U, left: U.scrollLeft, top: U.scrollTop });
            for (typeof h.focus == 'function' && h.focus(), h = 0; h < V.length; h++) {
              var Y = V[h];
              ((Y.element.scrollLeft = Y.left), (Y.element.scrollTop = Y.top));
            }
          }
          ((Cr = !!hf), (mf = hf = null));
        } finally {
          ((Ie = i), (Se.p = u), (de.T = l));
        }
      }
      ((e.current = t), (ut = 2));
    }
  }
  function nf() {
    if (ut === 2) {
      ut = 0;
      var e = Dn,
        t = wa,
        n = (t.flags & 8772) !== 0;
      if ((t.subtreeFlags & 8772) !== 0 || n) {
        ((n = de.T), (de.T = null));
        var l = Se.p;
        Se.p = 2;
        var u = Ie;
        Ie |= 4;
        try {
          dg(e, t.alternate, t);
        } finally {
          ((Ie = u), (Se.p = l), (de.T = n));
        }
      }
      ut = 3;
    }
  }
  function lf() {
    if (ut === 4 || ut === 3) {
      ut = 0;
      var e = pr;
      ((pr = null), Pu());
      var t = Dn,
        n = wa,
        l = Vn,
        u = Cg,
        i = (l & 335544064) === l ? 10262 : 10256;
      if (
        ((n.subtreeFlags & i) !== 0 || (n.flags & i) !== 0
          ? (ut = 5)
          : ((ut = 0), (wa = Dn = null), Hg(t, t.pendingLanes)),
        (i = t.pendingLanes),
        i === 0 && (Fl = null),
        na(l),
        (n = n.stateNode),
        at && typeof at.onCommitFiberRoot == 'function')
      )
        try {
          at.onCommitFiberRoot(Wl, n, void 0, (n.current.flags & 128) === 128);
        } catch {}
      if (u !== null) {
        ((n = de.T), (i = Se.p), (Se.p = 2), (de.T = null));
        try {
          for (var s = t.onRecoverableError, h = 0; h < u.length; h++) {
            var O = u[h];
            s(O.value, { componentStack: O.stack });
          }
        } finally {
          ((de.T = n), (Se.p = i));
        }
      }
      if (
        ((u = gr),
        (s = hr),
        (hr = null),
        u !== null && ((gr = null), s === null && (s = []), e !== null))
      )
        for (O = 0; O < u.length; O++) ((n = (0, u[O])(s)), n !== void 0 && e.finished.finally(n));
      ((Vn & 3) !== 0 && vo(),
        In(t),
        (i = t.pendingLanes),
        (l & 261930) !== 0 && (i & 42) !== 0
          ? t === po
            ? xu++
            : ((xu = 0), (po = t))
          : ((xu = 0), (po = null)),
        Cu(0));
    }
  }
  function Hg(e, t) {
    (e.pooledCacheLanes &= t) === 0 &&
      ((t = e.pooledCache), t != null && ((e.pooledCache = null), iu(t)));
  }
  function vo() {
    return (pr !== null && (pr.skipTransition(), (pr = null)), tf(), nf(), lf(), af());
  }
  function af() {
    if (ut !== 5) return !1;
    var e = Dn,
      t = Js;
    Js = 0;
    var n = na(Vn),
      l = de.T,
      u = Se.p;
    try {
      ((Se.p = 32 > n ? 32 : n), (de.T = null), (n = Ps), (Ps = null));
      var i = Dn,
        s = Vn;
      if (((ut = 0), (wa = Dn = null), (Vn = 0), (Ie & 6) !== 0)) throw Error(c(331));
      var h = Ie;
      if (
        ((Ie |= 4),
        Og(i.current),
        Sg(i, i.current, s, n),
        (Ie = h),
        Cu(0, !1),
        at && typeof at.onPostCommitFiberRoot == 'function')
      )
        try {
          at.onPostCommitFiberRoot(Wl, i);
        } catch {}
      return !0;
    } finally {
      ((Se.p = u), (de.T = l), Hg(e, t));
    }
  }
  function Fg(e, t, n) {
    ((t = dn(n, t)),
      (t = Ss(e.stateNode, t, 2)),
      (e = jl(e, t, 2)),
      e !== null && (ta(e, 2), In(e)));
  }
  function Qe(e, t, n) {
    if (e.tag === 3) Fg(e, e, n);
    else
      for (; t !== null;) {
        if (t.tag === 3) {
          Fg(t, e, n);
          break;
        } else if (t.tag === 1) {
          var l = t.stateNode;
          if (
            typeof t.type.getDerivedStateFromError == 'function' ||
            (typeof l.componentDidCatch == 'function' && (Fl === null || !Fl.has(l)))
          ) {
            ((e = dn(n, e)),
              (n = Up(2)),
              (l = jl(t, n, 2)),
              l !== null && (Bp(n, l, t, e), ta(l, 2), In(l)));
            break;
          }
        }
        t = t.return;
      }
  }
  function rf(e, t, n) {
    var l = e.pingCache;
    if (l === null) {
      l = e.pingCache = new Yb();
      var u = new Set();
      l.set(t, u);
    } else ((u = l.get(t)), u === void 0 && ((u = new Set()), l.set(t, u)));
    u.has(n) || (($s = !0), u.add(n), (e = Jb.bind(null, e, t, n)), t.then(e, e));
  }
  function Jb(e, t, n) {
    var l = e.pingCache;
    (l !== null && l.delete(t),
      (e.pingedLanes |= e.suspendedLanes & n),
      (e.warmLanes &= ~n),
      We === e &&
        (Be & n) === n &&
        ((ot === 4 || (ot === 3 && (Be & 62914560) === Be && 300 > Dt() - so)) && (Ie & 2) === 0
          ? vr(e, 0)
          : (co |= n),
        yr === Be && (yr = 0)),
      In(e));
  }
  function Gg(e, t) {
    (t === 0 && (t = ni()), (e = da(e, t)), e !== null && (ta(e, t), In(e)));
  }
  function Pb(e) {
    var t = e.memoizedState,
      n = 0;
    (t !== null && (n = t.retryLane), Gg(e, n));
  }
  function Wb(e, t) {
    var n = 0;
    switch (e.tag) {
      case 31:
      case 13:
        var l = e.stateNode,
          u = e.memoizedState;
        u !== null && (n = u.retryLane);
        break;
      case 19:
        l = e.stateNode;
        break;
      case 22:
        l = e.stateNode._retryCache;
        break;
      default:
        throw Error(c(314));
    }
    (l !== null && l.delete(t), Gg(e, n));
  }
  function e1(e, t) {
    return _n(e, t);
  }
  var Er = null,
    Sr = null,
    uf = !1,
    bo = !1,
    of = !1,
    ql = 0;
  function In(e) {
    (e !== Sr && e.next === null && (Sr === null ? (Er = Sr = e) : (Sr = Sr.next = e)),
      (bo = !0),
      uf || ((uf = !0), n1()));
  }
  function Cu(e, t) {
    if (!of && bo) {
      of = !0;
      do
        for (var n = !1, l = Er; l !== null;) {
          if (e !== 0) {
            var u = l.pendingLanes;
            if (u === 0) var i = 0;
            else {
              var s = l.suspendedLanes,
                h = l.pingedLanes;
              ((i = (1 << (31 - jt(42 | e) + 1)) - 1),
                (i &= u & ~(s & ~h)),
                (i = i & 201326741 ? (i & 201326741) | 1 : i ? i | 2 : 0));
            }
            i !== 0 && ((n = !0), Ig(l, i));
          } else
            ((i = Be),
              (i = Fa(
                l,
                l === We ? i : 0,
                l.cancelPendingCommit !== null || l.timeoutHandle !== -1,
              )),
              (i & 3) === 0 || ea(l, i) || ((n = !0), Ig(l, i)));
          l = l.next;
        }
      while (n);
      of = !1;
    }
  }
  function t1() {
    qg();
  }
  function qg() {
    bo = uf = !1;
    var e = 0;
    ql !== 0 && y1() && (e = ql);
    for (var t = Dt(), n = null, l = Er; l !== null;) {
      var u = l.next,
        i = Yg(l, t);
      (i === 0
        ? ((l.next = null), n === null ? (Er = u) : (n.next = u), u === null && (Sr = n))
        : ((n = l), (e !== 0 || (i & 3) !== 0) && (bo = !0)),
        (l = u));
    }
    ((ut !== 0 && ut !== 5) || Cu(e), ql !== 0 && (ql = 0));
  }
  function Yg(e, t) {
    for (
      var n = e.suspendedLanes,
        l = e.pingedLanes,
        u = e.expirationTimes,
        i = e.pendingLanes & -62914561;
      0 < i;
    ) {
      var s = 31 - jt(i),
        h = 1 << s,
        O = u[s];
      (O === -1
        ? ((h & n) === 0 || (h & l) !== 0) && (u[s] = yc(h, t))
        : O <= t && (e.expiredLanes |= h),
        (i &= ~h));
    }
    if (
      ((t = We),
      (n = Be),
      (n = Fa(e, e === t ? n : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      (l = e.callbackNode),
      n === 0 || (e === t && (Xe === 2 || Xe === 9)) || e.cancelPendingCommit !== null)
    )
      return (l !== null && l !== null && gl(l), (e.callbackNode = null), (e.callbackPriority = 0));
    if ((n & 3) === 0 || ea(e, n)) {
      if (((t = n & -n), t === e.callbackPriority)) return t;
      switch ((l !== null && gl(l), na(n))) {
        case 2:
        case 8:
          n = ei;
          break;
        case 32:
          n = on;
          break;
        case 268435456:
          n = ti;
          break;
        default:
          n = on;
      }
      return (
        (l = Vg.bind(null, e)),
        (n = _n(n, l)),
        (e.callbackPriority = t),
        (e.callbackNode = n),
        t
      );
    }
    return (
      l !== null && l !== null && gl(l),
      (e.callbackPriority = 2),
      (e.callbackNode = null),
      2
    );
  }
  function Vg(e, t) {
    if (ut !== 0 && ut !== 5) return ((e.callbackNode = null), (e.callbackPriority = 0), null);
    var n = e.callbackNode;
    if (vo() && e.callbackNode !== n) return null;
    var l = Be;
    return (
      (l = Fa(e, e === We ? l : 0, e.cancelPendingCommit !== null || e.timeoutHandle !== -1)),
      l === 0
        ? null
        : (Rg(e, l, t),
          Yg(e, Dt()),
          e.callbackNode != null && e.callbackNode === n ? Vg.bind(null, e) : null)
    );
  }
  function Ig(e, t) {
    if (vo()) return null;
    Rg(e, t, !0);
  }
  function n1() {
    g1(function () {
      (Ie & 6) !== 0 ? _n(hl, t1) : qg();
    });
  }
  function cf() {
    if (ql === 0) {
      var e = va;
      (e === 0 && ((e = Tn), (Tn <<= 1), (Tn & 261888) === 0 && (Tn = 256)), (ql = e));
    }
    return ql;
  }
  function Zg(e) {
    return e == null || typeof e == 'symbol' || typeof e == 'boolean'
      ? null
      : typeof e == 'function'
        ? e
        : N(e);
  }
  function l1(e, t, n, l, u) {
    if (t === 'submit' && n && n.stateNode === u) {
      var i = Zg((u[wt] || null).action),
        s = l.submitter;
      s &&
        ((t = (t = s[wt] || null) ? Zg(t.formAction) : s.getAttribute('formAction')),
        t !== null && ((i = t), (s = null)));
      var h = new vi('action', 'action', null, l, u);
      e.push({
        event: h,
        listeners: [
          {
            instance: null,
            listener: function () {
              if (l.defaultPrevented) {
                if (ql !== 0) {
                  var O = new FormData(u, s);
                  hs(n, { pending: !0, data: O, method: u.method, action: i }, null, O);
                }
              } else
                typeof i == 'function' &&
                  (h.preventDefault(),
                  (O = new FormData(u, s)),
                  hs(n, { pending: !0, data: O, method: u.method, action: i }, i, O));
            },
            currentTarget: u,
          },
        ],
      });
    }
  }
  for (var sf = 0; sf < Lc.length; sf++) {
    var ff = Lc[sf],
      a1 = ff.toLowerCase(),
      r1 = ff[0].toUpperCase() + ff.slice(1);
    Cn(a1, 'on' + r1);
  }
  (Cn(vy, 'onAnimationEnd'),
    Cn(by, 'onAnimationIteration'),
    Cn(Ey, 'onAnimationStart'),
    Cn('dblclick', 'onDoubleClick'),
    Cn('focusin', 'onFocus'),
    Cn('focusout', 'onBlur'),
    Cn(pb, 'onTransitionRun'),
    Cn(gb, 'onTransitionStart'),
    Cn(hb, 'onTransitionCancel'),
    Cn(Sy, 'onTransitionEnd'),
    Sl('onMouseEnter', ['mouseout', 'mouseover']),
    Sl('onMouseLeave', ['mouseout', 'mouseover']),
    Sl('onPointerEnter', ['pointerout', 'pointerover']),
    Sl('onPointerLeave', ['pointerout', 'pointerover']),
    zn('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' ')),
    zn(
      'onSelect',
      'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(
        ' ',
      ),
    ),
    zn('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste']),
    zn('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' ')),
    zn(
      'onCompositionStart',
      'compositionstart focusout keydown keypress keyup mousedown'.split(' '),
    ),
    zn(
      'onCompositionUpdate',
      'compositionupdate focusout keydown keypress keyup mousedown'.split(' '),
    ));
  var wu =
      'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
        ' ',
      ),
    u1 = new Set(
      'beforetoggle cancel close invalid load scroll scrollend toggle'.split(' ').concat(wu),
    );
  function Xg(e, t) {
    t = (t & 4) !== 0;
    for (var n = 0; n < e.length; n++) {
      var l = e[n],
        u = l.event;
      l = l.listeners;
      e: {
        var i = void 0;
        if (t)
          for (var s = l.length - 1; 0 <= s; s--) {
            var h = l[s],
              O = h.instance,
              M = h.currentTarget;
            if (((h = h.listener), O !== i && u.isPropagationStopped())) break e;
            ((i = h), (u.currentTarget = M));
            try {
              i(u);
            } catch (H) {
              Si(H);
            }
            ((u.currentTarget = null), (i = O));
          }
        else
          for (s = 0; s < l.length; s++) {
            if (
              ((h = l[s]),
              (O = h.instance),
              (M = h.currentTarget),
              (h = h.listener),
              O !== i && u.isPropagationStopped())
            )
              break e;
            ((i = h), (u.currentTarget = M));
            try {
              i(u);
            } catch (H) {
              Si(H);
            }
            ((u.currentTarget = null), (i = O));
          }
      }
    }
  }
  function Ue(e, t) {
    var n = t[Xr];
    n === void 0 && (n = t[Xr] = new Set());
    var l = e + '__bubble';
    n.has(l) || (Qg(t, e, 2, !1), n.add(l));
  }
  function df(e, t, n) {
    var l = 0;
    (t && (l |= 4), Qg(n, e, l, t));
  }
  var Eo = '_reactListening' + Math.random().toString(36).slice(2);
  function yf(e) {
    if (!e[Eo]) {
      ((e[Eo] = !0),
        ii.forEach(function (n) {
          n !== 'selectionchange' && (u1.has(n) || df(n, !1, e), df(n, !0, e));
        }));
      var t = e.nodeType === 9 ? e : e.ownerDocument;
      t === null || t[Eo] || ((t[Eo] = !0), df('selectionchange', !1, t));
    }
  }
  function Qg(e, t, n, l) {
    switch (Bh(t)) {
      case 2:
        var u = P1;
        break;
      case 8:
        u = W1;
        break;
      default:
        u = Mf;
    }
    ((n = u.bind(null, t, n, e)),
      (u = void 0),
      !ca || (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') || (u = !0),
      l
        ? u !== void 0
          ? e.addEventListener(t, n, { capture: !0, passive: u })
          : e.addEventListener(t, n, !0)
        : u !== void 0
          ? e.addEventListener(t, n, { passive: u })
          : e.addEventListener(t, n, !1));
  }
  function pf(e, t, n, l, u) {
    var i = l;
    if ((t & 1) === 0 && (t & 2) === 0 && l !== null)
      e: for (;;) {
        if (l === null) return;
        var s = l.tag;
        if (s === 3 || s === 4) {
          var h = l.stateNode.containerInfo;
          if (h === u) break;
          if (s === 4)
            for (s = l.return; s !== null;) {
              var O = s.tag;
              if ((O === 3 || O === 4) && s.stateNode.containerInfo === u) return;
              s = s.return;
            }
          for (; h !== null;) {
            if (((s = tl(h)), s === null)) return;
            if (((O = s.tag), O === 5 || O === 6 || O === 26 || O === 27)) {
              l = i = s;
              continue e;
            }
            h = h.parentNode;
          }
        }
        l = l.return;
      }
    Gt(function () {
      var M = i,
        H = Me(n),
        V = [];
      e: {
        var D = _y.get(e);
        if (D !== void 0) {
          var U = vi,
            ne = e;
          switch (e) {
            case 'keypress':
              if (hi(n) === 0) break e;
            case 'keydown':
            case 'keyup':
              U = Vv;
              break;
            case 'focusin':
              ((ne = 'focus'), (U = Oc));
              break;
            case 'focusout':
              ((ne = 'blur'), (U = Oc));
              break;
            case 'beforeblur':
            case 'afterblur':
              U = Oc;
              break;
            case 'click':
              if (n.button === 2) break e;
            case 'auxclick':
            case 'dblclick':
            case 'mousedown':
            case 'mousemove':
            case 'mouseup':
            case 'mouseout':
            case 'mouseover':
            case 'contextmenu':
              U = Jd;
              break;
            case 'drag':
            case 'dragend':
            case 'dragenter':
            case 'dragexit':
            case 'dragleave':
            case 'dragover':
            case 'dragstart':
            case 'drop':
              U = jv;
              break;
            case 'touchcancel':
            case 'touchend':
            case 'touchmove':
            case 'touchstart':
              U = $v;
              break;
            case vy:
            case by:
            case Ey:
              U = zv;
              break;
            case Sy:
              U = Jv;
              break;
            case 'scroll':
            case 'scrollend':
              U = Nv;
              break;
            case 'wheel':
              U = Wv;
              break;
            case 'copy':
            case 'cut':
            case 'paste':
              U = Bv;
              break;
            case 'gotpointercapture':
            case 'lostpointercapture':
            case 'pointercancel':
            case 'pointerdown':
            case 'pointermove':
            case 'pointerout':
            case 'pointerover':
            case 'pointerup':
              U = Wd;
              break;
            case 'submit':
              U = Xv;
              break;
            case 'toggle':
            case 'beforetoggle':
              U = tb;
          }
          var pe = (t & 4) !== 0,
            we = !pe && (e === 'scroll' || e === 'scrollend'),
            j = pe ? (D !== null ? D + 'Capture' : null) : D;
          pe = [];
          for (var w = M, z; w !== null;) {
            var Y = w;
            if (
              ((z = Y.stateNode),
              (Y = Y.tag),
              (Y !== 5 && Y !== 26 && Y !== 27) ||
                z === null ||
                j === null ||
                ((Y = mt(w, j)), Y != null && pe.push(Ru(w, Y, z))),
              we)
            )
              break;
            w = w.return;
          }
          0 < pe.length && ((D = new U(D, ne, null, n, H)), V.push({ event: D, listeners: pe }));
        }
      }
      if ((t & 7) === 0) {
        e: {
          if (
            ((U = e === 'mouseover' || e === 'pointerover'),
            (D = e === 'mouseout' || e === 'pointerout'),
            U && n !== ye && (ne = n.relatedTarget || n.fromElement) && (tl(ne) || ne[vl]))
          )
            break e;
          (D || U) &&
            ((ne =
              H.window === H
                ? H
                : (U = H.ownerDocument)
                  ? U.defaultView || U.parentWindow
                  : window),
            D
              ? ((U = n.relatedTarget || n.toElement),
                (D = M),
                (U = U ? tl(U) : null),
                U !== null &&
                  ((we = y(U)), (pe = U.tag), U !== we || (pe !== 5 && pe !== 27 && pe !== 6)) &&
                  (U = null))
              : ((D = null), (U = M)),
            D !== U &&
              ((pe = Jd),
              (Y = 'onMouseLeave'),
              (j = 'onMouseEnter'),
              (w = 'mouse'),
              (e === 'pointerout' || e === 'pointerover') &&
                ((pe = Wd), (Y = 'onPointerLeave'), (j = 'onPointerEnter'), (w = 'pointer')),
              (we = D == null ? ne : ra(D)),
              (z = U == null ? ne : ra(U)),
              (ne = new pe(Y, w + 'leave', D, n, H)),
              (ne.target = we),
              (ne.relatedTarget = z),
              (Y = null),
              tl(H) === M &&
                ((pe = new pe(j, w + 'enter', U, n, H)),
                (pe.target = z),
                (pe.relatedTarget = we),
                (Y = pe)),
              (we = Y),
              (pe = D && U ? ee(D, U, i1) : null),
              D !== null && $g(V, ne, D, pe, !1),
              U !== null && we !== null && $g(V, we, U, pe, !0)));
        }
        e: {
          if (
            ((D = M ? ra(M) : window),
            (U = D.nodeName && D.nodeName.toLowerCase()),
            U === 'select' || (U === 'input' && D.type === 'file'))
          )
            var fe = iy;
          else if (ry(D))
            if (oy) fe = fb;
            else {
              fe = cb;
              var ke = ob;
            }
          else
            ((U = D.nodeName),
              !U || U.toLowerCase() !== 'input' || (D.type !== 'checkbox' && D.type !== 'radio')
                ? M && Xa(M.elementType) && (fe = iy)
                : (fe = sb));
          if (fe && (fe = fe(e, M))) {
            uy(V, fe, n, H);
            break e;
          }
          ke && ke(e, D, M);
        }
        switch (((ke = M ? ra(M) : window), e)) {
          case 'focusin':
            (ry(ke) || ke.contentEditable === 'true') && (($a = ke), (Dc = M), (au = null));
            break;
          case 'focusout':
            au = Dc = $a = null;
            break;
          case 'mousedown':
            jc = !0;
            break;
          case 'contextmenu':
          case 'mouseup':
          case 'dragend':
            ((jc = !1), hy(V, n, H));
            break;
          case 'selectionchange':
            if (yb) break;
          case 'keydown':
          case 'keyup':
            hy(V, n, H);
        }
        var ve;
        if (xc)
          e: {
            switch (e) {
              case 'compositionstart':
                var _e = 'onCompositionStart';
                break e;
              case 'compositionend':
                _e = 'onCompositionEnd';
                break e;
              case 'compositionupdate':
                _e = 'onCompositionUpdate';
                break e;
            }
            _e = void 0;
          }
        else
          Qa
            ? ly(e, n) && (_e = 'onCompositionEnd')
            : e === 'keydown' && n.keyCode === 229 && (_e = 'onCompositionStart');
        (_e &&
          (ey &&
            n.locale !== 'ko' &&
            (Qa || _e !== 'onCompositionStart'
              ? _e === 'onCompositionEnd' && Qa && (ve = $d())
              : ((xn = H), (Sc = 'value' in xn ? xn.value : xn.textContent), (Qa = !0))),
          (ke = So(M, _e)),
          0 < ke.length &&
            ((_e = new Pd(_e, e, null, n, H)),
            V.push({ event: _e, listeners: ke }),
            ve ? (_e.data = ve) : ((ve = ay(n)), ve !== null && (_e.data = ve)))),
          (ve = lb ? ab(e, n) : rb(e, n)) &&
            ((_e = So(M, 'onBeforeInput')),
            0 < _e.length &&
              ((ke = new Pd('onBeforeInput', 'beforeinput', null, n, H)),
              V.push({ event: ke, listeners: _e }),
              (ke.data = ve))),
          l1(V, e, M, n, H));
      }
      Xg(V, t);
    });
  }
  function Ru(e, t, n) {
    return { instance: e, listener: t, currentTarget: n };
  }
  function So(e, t) {
    for (var n = t + 'Capture', l = []; e !== null;) {
      var u = e,
        i = u.stateNode;
      if (
        ((u = u.tag),
        (u !== 5 && u !== 26 && u !== 27) ||
          i === null ||
          ((u = mt(e, n)),
          u != null && l.unshift(Ru(e, u, i)),
          (u = mt(e, t)),
          u != null && l.push(Ru(e, u, i))),
        e.tag === 3)
      )
        return l;
      e = e.return;
    }
    return [];
  }
  function i1(e) {
    if (e === null) return null;
    do e = e.return;
    while (e && e.tag !== 5 && e.tag !== 27);
    return e || null;
  }
  function $g(e, t, n, l, u) {
    for (var i = t._reactName, s = []; n !== null && n !== l;) {
      var h = n,
        O = h.alternate,
        M = h.stateNode;
      if (((h = h.tag), O !== null && O === l)) break;
      ((h !== 5 && h !== 26 && h !== 27) ||
        M === null ||
        ((O = M),
        u
          ? ((M = mt(n, i)), M != null && s.unshift(Ru(n, M, O)))
          : u || ((M = mt(n, i)), M != null && s.push(Ru(n, M, O)))),
        (n = n.return));
    }
    s.length !== 0 && e.push({ event: t, listeners: s });
  }
  var o1 = /\r\n?/g,
    c1 = /\u0000|\uFFFD/g;
  function Kg(e) {
    return (typeof e == 'string' ? e : '' + e)
      .replace(
        o1,
        `
`,
      )
      .replace(c1, '');
  }
  function Jg(e, t) {
    return ((t = Kg(t)), Kg(e) === t);
  }
  function $e(e, t, n, l, u, i) {
    switch (n) {
      case 'children':
        if (typeof l == 'string') t === 'body' || (t === 'textarea' && l === '') || Tl(e, l);
        else if (typeof l == 'number' || typeof l == 'bigint') t !== 'body' && Tl(e, '' + l);
        else return;
        break;
      case 'className':
        Ia(e, 'class', l);
        break;
      case 'tabIndex':
        Ia(e, 'tabindex', l);
        break;
      case 'dir':
      case 'role':
      case 'viewBox':
      case 'width':
      case 'height':
        Ia(e, n, l);
        break;
      case 'style':
        pi(e, l, i);
        return;
      case 'data':
        if (t !== 'object') {
          Ia(e, 'data', l);
          break;
        }
      case 'src':
      case 'href':
        if (l === '' && (t !== 'a' || n !== 'href')) {
          e.removeAttribute(n);
          break;
        }
        if (l == null || typeof l == 'function' || typeof l == 'symbol' || typeof l == 'boolean') {
          e.removeAttribute(n);
          break;
        }
        ((l = N(l)), e.setAttribute(n, l));
        break;
      case 'action':
      case 'formAction':
        if (typeof l == 'function') {
          e.setAttribute(
            n,
            "javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')",
          );
          break;
        } else
          typeof i == 'function' &&
            (n === 'formAction'
              ? (t !== 'input' && $e(e, t, 'name', u.name, u, null),
                $e(e, t, 'formEncType', u.formEncType, u, null),
                $e(e, t, 'formMethod', u.formMethod, u, null),
                $e(e, t, 'formTarget', u.formTarget, u, null))
              : ($e(e, t, 'encType', u.encType, u, null),
                $e(e, t, 'method', u.method, u, null),
                $e(e, t, 'target', u.target, u, null)));
        if (l == null || typeof l == 'symbol' || typeof l == 'boolean') {
          e.removeAttribute(n);
          break;
        }
        ((l = N(l)), e.setAttribute(n, l));
        break;
      case 'onClick':
        l != null && (e.onclick = F);
        return;
      case 'onScroll':
        l != null && Ue('scroll', e);
        return;
      case 'onScrollEnd':
        l != null && Ue('scrollend', e);
        return;
      case 'dangerouslySetInnerHTML':
        if (l != null) {
          if (typeof l != 'object' || !('__html' in l)) throw Error(c(61));
          if (((n = l.__html), n != null)) {
            if (u.children != null) throw Error(c(60));
            (i != null ? i.__html : void 0) !== n && (e.innerHTML = n);
          }
        }
        break;
      case 'multiple':
        e.multiple = l && typeof l != 'function' && typeof l != 'symbol';
        break;
      case 'muted':
        e.muted = l && typeof l != 'function' && typeof l != 'symbol';
        break;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'defaultValue':
      case 'defaultChecked':
      case 'innerHTML':
      case 'ref':
        break;
      case 'autoFocus':
        break;
      case 'xlinkHref':
        if (l == null || typeof l == 'function' || typeof l == 'boolean' || typeof l == 'symbol') {
          e.removeAttribute('xlink:href');
          break;
        }
        ((n = N(l)), e.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', n));
        break;
      case 'contentEditable':
      case 'spellCheck':
      case 'draggable':
      case 'value':
      case 'autoReverse':
      case 'externalResourcesRequired':
      case 'focusable':
      case 'preserveAlpha':
        l != null && typeof l != 'function' && typeof l != 'symbol'
          ? e.setAttribute(n, l)
          : e.removeAttribute(n);
        break;
      case 'inert':
      case 'allowFullScreen':
      case 'async':
      case 'autoPlay':
      case 'controls':
      case 'credentialless':
      case 'default':
      case 'defer':
      case 'disabled':
      case 'disablePictureInPicture':
      case 'disableRemotePlayback':
      case 'formNoValidate':
      case 'hidden':
      case 'loop':
      case 'noModule':
      case 'noValidate':
      case 'open':
      case 'playsInline':
      case 'readOnly':
      case 'required':
      case 'reversed':
      case 'scoped':
      case 'seamless':
      case 'itemScope':
        l && typeof l != 'function' && typeof l != 'symbol'
          ? e.setAttribute(n, '')
          : e.removeAttribute(n);
        break;
      case 'capture':
      case 'download':
        l === !0
          ? e.setAttribute(n, '')
          : l !== !1 && l != null && typeof l != 'function' && typeof l != 'symbol'
            ? e.setAttribute(n, l)
            : e.removeAttribute(n);
        break;
      case 'cols':
      case 'rows':
      case 'size':
      case 'span':
        l != null && typeof l != 'function' && typeof l != 'symbol' && !isNaN(l) && 1 <= l
          ? e.setAttribute(n, l)
          : e.removeAttribute(n);
        break;
      case 'rowSpan':
      case 'start':
        l == null || typeof l == 'function' || typeof l == 'symbol' || isNaN(l)
          ? e.removeAttribute(n)
          : e.setAttribute(n, l);
        break;
      case 'popover':
        (Ue('beforetoggle', e), Ue('toggle', e), _l(e, 'popover', l));
        break;
      case 'xlinkActuate':
        On(e, 'http://www.w3.org/1999/xlink', 'xlink:actuate', l);
        break;
      case 'xlinkArcrole':
        On(e, 'http://www.w3.org/1999/xlink', 'xlink:arcrole', l);
        break;
      case 'xlinkRole':
        On(e, 'http://www.w3.org/1999/xlink', 'xlink:role', l);
        break;
      case 'xlinkShow':
        On(e, 'http://www.w3.org/1999/xlink', 'xlink:show', l);
        break;
      case 'xlinkTitle':
        On(e, 'http://www.w3.org/1999/xlink', 'xlink:title', l);
        break;
      case 'xlinkType':
        On(e, 'http://www.w3.org/1999/xlink', 'xlink:type', l);
        break;
      case 'xmlBase':
        On(e, 'http://www.w3.org/XML/1998/namespace', 'xml:base', l);
        break;
      case 'xmlLang':
        On(e, 'http://www.w3.org/XML/1998/namespace', 'xml:lang', l);
        break;
      case 'xmlSpace':
        On(e, 'http://www.w3.org/XML/1998/namespace', 'xml:space', l);
        break;
      case 'is':
        _l(e, 'is', l);
        break;
      case 'innerText':
      case 'textContent':
        return;
      default:
        if (!(2 < n.length) || (n[0] !== 'o' && n[0] !== 'O') || (n[1] !== 'n' && n[1] !== 'N'))
          ((n = Ec.get(n) || n), _l(e, n, l));
        else return;
    }
    He = !0;
  }
  function gf(e, t, n, l, u, i) {
    switch (n) {
      case 'style':
        pi(e, l, i);
        return;
      case 'dangerouslySetInnerHTML':
        if (l != null) {
          if (typeof l != 'object' || !('__html' in l)) throw Error(c(61));
          if (((n = l.__html), n != null)) {
            if (u.children != null) throw Error(c(60));
            (i != null ? i.__html : void 0) !== n && (e.innerHTML = n);
          }
        }
        break;
      case 'children':
        if (typeof l == 'string') Tl(e, l);
        else if (typeof l == 'number' || typeof l == 'bigint') Tl(e, '' + l);
        else return;
        break;
      case 'onScroll':
        l != null && Ue('scroll', e);
        return;
      case 'onScrollEnd':
        l != null && Ue('scrollend', e);
        return;
      case 'onClick':
        l != null && (e.onclick = F);
        return;
      case 'suppressContentEditableWarning':
      case 'suppressHydrationWarning':
      case 'innerHTML':
      case 'ref':
        return;
      case 'innerText':
      case 'textContent':
        return;
      default:
        if (!oi.hasOwnProperty(n))
          e: {
            if (
              n[0] === 'o' &&
              n[1] === 'n' &&
              ((u = n.endsWith('Capture')),
              (i = n.slice(2, u ? n.length - 7 : void 0)),
              (t = e[wt] || null),
              (t = t != null ? t[n] : null),
              typeof t == 'function' && e.removeEventListener(i, t, u),
              typeof l == 'function')
            ) {
              (typeof t != 'function' &&
                t !== null &&
                (n in e ? (e[n] = null) : e.hasAttribute(n) && e.removeAttribute(n)),
                e.addEventListener(i, l, u));
              break e;
            }
            ((He = !0), n in e ? (e[n] = l) : l === !0 ? e.setAttribute(n, '') : _l(e, n, l));
          }
        return;
    }
    He = !0;
  }
  function xt(e, t, n) {
    switch (t) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'img':
        (Ue('error', e), Ue('load', e));
        var l = !1,
          u = !1,
          i;
        for (i in n)
          if (n.hasOwnProperty(i)) {
            var s = n[i];
            if (s != null)
              switch (i) {
                case 'src':
                  l = !0;
                  break;
                case 'srcSet':
                  u = !0;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  throw Error(c(137, t));
                default:
                  $e(e, t, i, s, n, null);
              }
          }
        (u && $e(e, t, 'srcSet', n.srcSet, n, null), l && $e(e, t, 'src', n.src, n, null));
        return;
      case 'input':
        Ue('invalid', e);
        var h = (i = s = u = null),
          O = null,
          M = null;
        for (l in n)
          if (n.hasOwnProperty(l)) {
            var H = n[l];
            if (H != null)
              switch (l) {
                case 'name':
                  u = H;
                  break;
                case 'type':
                  s = H;
                  break;
                case 'checked':
                  O = H;
                  break;
                case 'defaultChecked':
                  M = H;
                  break;
                case 'value':
                  i = H;
                  break;
                case 'defaultValue':
                  h = H;
                  break;
                case 'children':
                case 'dangerouslySetInnerHTML':
                  if (H != null) throw Error(c(137, t));
                  break;
                default:
                  $e(e, t, l, H, n, null);
              }
          }
        Kr(e, i, h, O, M, s, u, !1);
        return;
      case 'select':
        (Ue('invalid', e), (l = s = i = null));
        for (u in n)
          if (n.hasOwnProperty(u) && ((h = n[u]), h != null))
            switch (u) {
              case 'value':
                i = h;
                break;
              case 'defaultValue':
                s = h;
                break;
              case 'multiple':
                l = h;
              default:
                $e(e, t, u, h, n, null);
            }
        ((t = i),
          (n = s),
          (e.multiple = !!l),
          t != null ? sn(e, !!l, t, !1) : n != null && sn(e, !!l, n, !0));
        return;
      case 'textarea':
        (Ue('invalid', e), (i = u = l = null));
        for (s in n)
          if (n.hasOwnProperty(s) && ((h = n[s]), h != null))
            switch (s) {
              case 'value':
                l = h;
                break;
              case 'defaultValue':
                u = h;
                break;
              case 'children':
                i = h;
                break;
              case 'dangerouslySetInnerHTML':
                if (h != null) throw Error(c(91));
                break;
              default:
                $e(e, t, s, h, n, null);
            }
        Jr(e, l, u, i);
        return;
      case 'option':
        for (O in n)
          if (n.hasOwnProperty(O) && ((l = n[O]), l != null))
            switch (O) {
              case 'selected':
                e.selected = l && typeof l != 'function' && typeof l != 'symbol';
                break;
              default:
                $e(e, t, O, l, n, null);
            }
        return;
      case 'dialog':
        (Ue('beforetoggle', e), Ue('toggle', e), Ue('cancel', e), Ue('close', e));
        break;
      case 'iframe':
      case 'object':
        Ue('load', e);
        break;
      case 'video':
      case 'audio':
        for (l = 0; l < wu.length; l++) Ue(wu[l], e);
        break;
      case 'image':
        (Ue('error', e), Ue('load', e));
        break;
      case 'details':
        Ue('toggle', e);
        break;
      case 'embed':
      case 'source':
      case 'link':
        (Ue('error', e), Ue('load', e));
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (M in n)
          if (n.hasOwnProperty(M) && ((l = n[M]), l != null))
            switch (M) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                throw Error(c(137, t));
              default:
                $e(e, t, M, l, n, null);
            }
        return;
      default:
        if (Xa(t)) {
          for (H in n)
            n.hasOwnProperty(H) && ((l = n[H]), l !== void 0 && gf(e, t, H, l, n, void 0));
          return;
        }
    }
    for (h in n) n.hasOwnProperty(h) && ((l = n[h]), l != null && $e(e, t, h, l, n, null));
  }
  var s1 = {};
  function f1(e, t, n, l) {
    switch (t) {
      case 'div':
      case 'span':
      case 'svg':
      case 'path':
      case 'a':
      case 'g':
      case 'p':
      case 'li':
        break;
      case 'input':
        var u = null,
          i = null,
          s = null,
          h = null,
          O = null,
          M = null,
          H = null;
        for (U in n) {
          var V = n[U];
          if (n.hasOwnProperty(U) && V != null)
            switch (U) {
              case 'checked':
                break;
              case 'value':
                break;
              case 'defaultValue':
                O = V;
              default:
                l.hasOwnProperty(U) || $e(e, t, U, null, l, V);
            }
        }
        for (var D in l) {
          var U = l[D];
          if (((V = n[D]), l.hasOwnProperty(D) && (U != null || V != null)))
            switch (D) {
              case 'type':
                (U !== V && (He = !0), (i = U));
                break;
              case 'name':
                (U !== V && (He = !0), (u = U));
                break;
              case 'checked':
                (U !== V && (He = !0), (M = U));
                break;
              case 'defaultChecked':
                (U !== V && (He = !0), (H = U));
                break;
              case 'value':
                (U !== V && (He = !0), (s = U));
                break;
              case 'defaultValue':
                (U !== V && (He = !0), (h = U));
                break;
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (U != null) throw Error(c(137, t));
                break;
              default:
                U !== V && $e(e, t, D, U, l, V);
            }
        }
        oa(e, s, h, O, M, H, i, u);
        return;
      case 'select':
        U = s = h = D = null;
        for (i in n)
          if (((O = n[i]), n.hasOwnProperty(i) && O != null))
            switch (i) {
              case 'value':
                break;
              case 'multiple':
                U = O;
              default:
                l.hasOwnProperty(i) || $e(e, t, i, null, l, O);
            }
        for (u in l)
          if (((i = l[u]), (O = n[u]), l.hasOwnProperty(u) && (i != null || O != null)))
            switch (u) {
              case 'value':
                (i !== O && (He = !0), (D = i));
                break;
              case 'defaultValue':
                (i !== O && (He = !0), (h = i));
                break;
              case 'multiple':
                (i !== O && (He = !0), (s = i));
              default:
                i !== O && $e(e, t, u, i, l, O);
            }
        ((t = h),
          (n = s),
          (l = U),
          D != null
            ? sn(e, !!n, D, !1)
            : !!l != !!n && (t != null ? sn(e, !!n, t, !0) : sn(e, !!n, n ? [] : '', !1)));
        return;
      case 'textarea':
        U = D = null;
        for (h in n)
          if (((u = n[h]), n.hasOwnProperty(h) && u != null && !l.hasOwnProperty(h)))
            switch (h) {
              case 'value':
                break;
              case 'children':
                break;
              default:
                $e(e, t, h, null, l, u);
            }
        for (s in l)
          if (((u = l[s]), (i = n[s]), l.hasOwnProperty(s) && (u != null || i != null)))
            switch (s) {
              case 'value':
                (u !== i && (He = !0), (D = u));
                break;
              case 'defaultValue':
                (u !== i && (He = !0), (U = u));
                break;
              case 'children':
                break;
              case 'dangerouslySetInnerHTML':
                if (u != null) throw Error(c(91));
                break;
              default:
                u !== i && $e(e, t, s, u, l, i);
            }
        fi(e, D, U);
        return;
      case 'option':
        for (var ne in n)
          if (((D = n[ne]), n.hasOwnProperty(ne) && D != null && !l.hasOwnProperty(ne)))
            switch (ne) {
              case 'selected':
                e.selected = !1;
                break;
              default:
                $e(e, t, ne, null, l, D);
            }
        for (O in l)
          if (((D = l[O]), (U = n[O]), l.hasOwnProperty(O) && D !== U && (D != null || U != null)))
            switch (O) {
              case 'selected':
                (D !== U && (He = !0),
                  (e.selected = D && typeof D != 'function' && typeof D != 'symbol'));
                break;
              default:
                $e(e, t, O, D, l, U);
            }
        return;
      case 'img':
      case 'link':
      case 'area':
      case 'base':
      case 'br':
      case 'col':
      case 'embed':
      case 'hr':
      case 'keygen':
      case 'meta':
      case 'param':
      case 'source':
      case 'track':
      case 'wbr':
      case 'menuitem':
        for (var pe in n)
          ((D = n[pe]),
            n.hasOwnProperty(pe) && D != null && !l.hasOwnProperty(pe) && $e(e, t, pe, null, l, D));
        for (M in l)
          if (((D = l[M]), (U = n[M]), l.hasOwnProperty(M) && D !== U && (D != null || U != null)))
            switch (M) {
              case 'children':
              case 'dangerouslySetInnerHTML':
                if (D != null) throw Error(c(137, t));
                break;
              default:
                $e(e, t, M, D, l, U);
            }
        return;
      default:
        if (Xa(t)) {
          for (var we in n)
            ((D = n[we]),
              n.hasOwnProperty(we) &&
                D !== void 0 &&
                !l.hasOwnProperty(we) &&
                gf(e, t, we, void 0, l, D));
          for (H in l)
            ((D = l[H]),
              (U = n[H]),
              !l.hasOwnProperty(H) ||
                D === U ||
                (D === void 0 && U === void 0) ||
                gf(e, t, H, D, l, U));
          return;
        }
    }
    for (var j in n)
      ((D = n[j]),
        n.hasOwnProperty(j) && D != null && !l.hasOwnProperty(j) && $e(e, t, j, null, l, D));
    for (V in l)
      ((D = l[V]),
        (U = n[V]),
        !l.hasOwnProperty(V) || D === U || (D == null && U == null) || $e(e, t, V, D, l, U));
  }
  function Pg(e) {
    switch (e) {
      case 'css':
      case 'script':
      case 'font':
      case 'img':
      case 'image':
      case 'input':
      case 'link':
        return !0;
      default:
        return !1;
    }
  }
  function d1() {
    if (typeof performance.getEntriesByType == 'function') {
      for (
        var e = 0, t = 0, n = performance.getEntriesByType('resource'), l = 0;
        l < n.length;
        l++
      ) {
        var u = n[l],
          i = u.transferSize,
          s = u.initiatorType,
          h = u.duration;
        if (i && h && Pg(s)) {
          for (s = 0, h = u.responseEnd, l += 1; l < n.length; l++) {
            var O = n[l],
              M = O.startTime;
            if (M > h) break;
            var H = O.transferSize,
              V = O.initiatorType;
            H && Pg(V) && ((O = O.responseEnd), (s += H * (O < h ? 1 : (h - M) / (O - M))));
          }
          if ((--l, (t += (8 * (i + s)) / (u.duration / 1e3)), e++, 10 < e)) break;
        }
      }
      if (0 < e) return t / e / 1e6;
    }
    return navigator.connection && ((e = navigator.connection.downlink), typeof e == 'number')
      ? e
      : 5;
  }
  var hf = null,
    mf = null;
  function Nu(e) {
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  function Wg(e) {
    switch (e) {
      case 'http://www.w3.org/2000/svg':
        return 1;
      case 'http://www.w3.org/1998/Math/MathML':
        return 2;
      default:
        return 0;
    }
  }
  function eh(e, t) {
    if (e === 0)
      switch (t) {
        case 'svg':
          return 1;
        case 'math':
          return 2;
        default:
          return 0;
      }
    return e === 1 && t === 'foreignObject' ? 0 : e;
  }
  function th(e, t, n, l) {
    return ((n = Nu(n).createElement(e)), (n[ht] = l), (n[wt] = t), xt(n, e, t), rt(n), n);
  }
  function vf(e, t) {
    return (
      e === 'textarea' ||
      e === 'noscript' ||
      typeof t.children == 'string' ||
      typeof t.children == 'number' ||
      typeof t.children == 'bigint' ||
      (typeof t.dangerouslySetInnerHTML == 'object' &&
        t.dangerouslySetInnerHTML !== null &&
        t.dangerouslySetInnerHTML.__html != null)
    );
  }
  var bf = null;
  function y1() {
    var e = window.event;
    return e && e.type === 'popstate' ? (e === bf ? !1 : ((bf = e), !0)) : ((bf = null), !1);
  }
  var Ef = typeof setTimeout == 'function' ? setTimeout : void 0,
    p1 = typeof clearTimeout == 'function' ? clearTimeout : void 0,
    nh = typeof Promise == 'function' ? Promise : void 0,
    lh = typeof requestAnimationFrame == 'function' ? requestAnimationFrame : Ef,
    g1 =
      typeof queueMicrotask == 'function'
        ? queueMicrotask
        : typeof nh < 'u'
          ? function (e) {
              return nh.resolve(null).then(e).catch(h1);
            }
          : Ef;
  function h1(e) {
    setTimeout(function () {
      throw e;
    });
  }
  function Yl(e) {
    return e === 'head';
  }
  function ah(e, t) {
    var n = t,
      l = 0;
    do {
      var u = n.nextSibling;
      if ((e.removeChild(n), u && u.nodeType === 8))
        if (((n = u.data), n === '/$' || n === '/&')) {
          if (l === 0) {
            (e.removeChild(u), wr(t));
            return;
          }
          l--;
        } else if (n === '$' || n === '$?' || n === '$~' || n === '$!' || n === '&') l++;
        else if (n === 'html') wf(e.ownerDocument.documentElement);
        else if (n === 'head') {
          ((n = e.ownerDocument.head), wf(n));
          for (var i = n.firstChild; i;) {
            var s = i.nextSibling,
              h = i.nodeName;
            (i[aa] ||
              h === 'SCRIPT' ||
              h === 'STYLE' ||
              (h === 'LINK' && i.rel.toLowerCase() === 'stylesheet') ||
              n.removeChild(i),
              (i = s));
          }
        } else n === 'body' && wf(e.ownerDocument.body);
      n = u;
    } while (n);
    wr(t);
  }
  function rh(e, t) {
    var n = e;
    e = 0;
    do {
      var l = n.nextSibling;
      if (
        (n.nodeType === 1
          ? t
            ? ((n._stashedDisplay = n.style.display), (n.style.display = 'none'))
            : ((n.style.display = n._stashedDisplay || ''),
              n.getAttribute('style') === '' && n.removeAttribute('style'))
          : n.nodeType === 3 &&
            (t
              ? ((n._stashedText = n.nodeValue), (n.nodeValue = ''))
              : (n.nodeValue = n._stashedText || '')),
        l && l.nodeType === 8)
      )
        if (((n = l.data), n === '/$')) {
          if (e === 0) break;
          e--;
        } else (n !== '$' && n !== '$?' && n !== '$~' && n !== '$!') || e++;
      n = l;
    } while (n);
  }
  function uh(e, t, n) {
    if (
      ((t = CSS.escape(t) !== t ? 'r-' + btoa(t).replace(/=/g, '') : t),
      (e.style.viewTransitionName = t),
      n != null && (e.style.viewTransitionClass = n),
      (n = getComputedStyle(e)),
      n.display === 'inline')
    ) {
      if (((t = e.getClientRects()), t.length === 1)) var l = 1;
      else
        for (var u = (l = 0); u < t.length; u++) {
          var i = t[u];
          0 < i.width && 0 < i.height && l++;
        }
      l === 1 &&
        ((e = e.style),
        (e.display = t.length === 1 ? 'inline-block' : 'block'),
        (e.marginTop = '-' + n.paddingTop),
        (e.marginBottom = '-' + n.paddingBottom));
    }
  }
  function ih(e, t) {
    ((e = e.style), (t = t.style));
    var n =
      t != null
        ? t.hasOwnProperty('viewTransitionName')
          ? t.viewTransitionName
          : t.hasOwnProperty('view-transition-name')
            ? t['view-transition-name']
            : null
        : null;
    ((e.viewTransitionName = n == null || typeof n == 'boolean' ? '' : ('' + n).trim()),
      (n =
        t != null
          ? t.hasOwnProperty('viewTransitionClass')
            ? t.viewTransitionClass
            : t.hasOwnProperty('view-transition-class')
              ? t['view-transition-class']
              : null
          : null),
      (e.viewTransitionClass = n == null || typeof n == 'boolean' ? '' : ('' + n).trim()),
      e.display === 'inline-block' &&
        (t == null
          ? (e.display = e.margin = '')
          : ((n = t.display),
            (e.display = n == null || typeof n == 'boolean' ? '' : n),
            (n = t.margin),
            n != null
              ? (e.margin = n)
              : ((n = t.hasOwnProperty('marginTop') ? t.marginTop : t['margin-top']),
                (e.marginTop = n == null || typeof n == 'boolean' ? '' : n),
                (t = t.hasOwnProperty('marginBottom') ? t.marginBottom : t['margin-bottom']),
                (e.marginBottom = t == null || typeof t == 'boolean' ? '' : t)))));
  }
  function m1(e, t, n) {
    return (
      (n = n.ownerDocument.defaultView),
      {
        rect: e,
        abs: t.position === 'absolute' || t.position === 'fixed',
        clip:
          t.clipPath !== 'none' ||
          t.overflow !== 'visible' ||
          t.filter !== 'none' ||
          t.mask !== 'none' ||
          t.mask !== 'none' ||
          t.borderRadius !== '0px',
        view: 0 <= e.bottom && 0 <= e.right && e.top <= n.innerHeight && e.left <= n.innerWidth,
      }
    );
  }
  function Sf(e) {
    var t = e.getBoundingClientRect(),
      n = getComputedStyle(e);
    return m1(t, n, e);
  }
  function v1(e) {
    return e.documentElement.clientHeight;
  }
  function b1(e) {
    (this.addEventListener('load', e), this.addEventListener('error', e));
  }
  function E1(e, t, n, l, u, i, s, h, O) {
    var M = t.nodeType === 9 ? t : t.ownerDocument;
    try {
      var H = M.startViewTransition({
        update: function () {
          var D = M.defaultView,
            U = D.navigation && D.navigation.transition,
            ne = M.fonts.status;
          l();
          var pe = [];
          if (
            (ne === 'loaded' && (v1(M), M.fonts.status === 'loading' && pe.push(M.fonts.ready)),
            (ne = pe.length),
            e !== null)
          )
            for (var we = e.suspenseyImages, j = 0, w = 0; w < we.length; w++) {
              var z = we[w];
              if (!z.complete) {
                var Y = z.getBoundingClientRect();
                if (0 < Y.bottom && 0 < Y.right && Y.top < D.innerHeight && Y.left < D.innerWidth) {
                  if (((j += wh(z)), j > Oo)) {
                    pe.length = ne;
                    break;
                  }
                  ((z = new Promise(b1.bind(z))), pe.push(z));
                }
              }
            }
          if (0 < pe.length)
            return (
              (D = Promise.race([
                Promise.all(pe),
                new Promise(function (fe) {
                  return setTimeout(fe, 500);
                }),
              ]).then(u, u)),
              (U ? Promise.allSettled([U.finished, D]) : D).then(i, i)
            );
          if ((u(), U)) return U.finished.then(i, i);
          i();
        },
        types: n,
      });
      M.__reactViewTransition = H;
      var V = [];
      return (
        H.ready.then(
          function () {
            for (
              var D = M.documentElement.getAnimations({ subtree: !0 }), U = 0;
              U < D.length;
              U++
            ) {
              var ne = D[U],
                pe = ne.effect,
                we = pe.pseudoElement;
              if (we != null && we.startsWith('::view-transition')) {
                (V.push(ne), (ne = pe.getKeyframes()));
                for (var j = (we = void 0), w = !0, z = 0; z < ne.length; z++) {
                  var Y = ne[z],
                    fe = Y.width;
                  if (we === void 0) we = fe;
                  else if (we !== fe) {
                    w = !1;
                    break;
                  }
                  if (((fe = Y.height), j === void 0)) j = fe;
                  else if (j !== fe) {
                    w = !1;
                    break;
                  }
                  (delete Y.width, delete Y.height, Y.transform === 'none' && delete Y.transform);
                }
                w &&
                  we !== void 0 &&
                  j !== void 0 &&
                  (pe.setKeyframes(ne),
                  (w = getComputedStyle(pe.target, pe.pseudoElement)),
                  w.width !== we || w.height !== j) &&
                  ((w = ne[0]),
                  (w.width = we),
                  (w.height = j),
                  (w = ne[ne.length - 1]),
                  (w.width = we),
                  (w.height = j),
                  pe.setKeyframes(ne));
              }
            }
            s();
          },
          function (D) {
            M.__reactViewTransition === H && (M.__reactViewTransition = null);
            try {
              if (typeof D == 'object' && D !== null)
                switch (D.name) {
                  case 'InvalidStateError':
                    (D.message ===
                      'View transition was skipped because document visibility state is hidden.' ||
                      D.message ===
                        'Skipping view transition because document visibility state has become hidden.' ||
                      D.message === 'Skipping view transition because viewport size changed.' ||
                      D.message === 'Transition was aborted because of invalid state') &&
                      (D = null);
                }
              D !== null && O(D);
            } finally {
              (l(), u(), s());
            }
          },
        ),
        H.finished.finally(function () {
          for (var D = 0; D < V.length; D++) V[D].cancel();
          (M.__reactViewTransition === H && (M.__reactViewTransition = null), h());
        }),
        H
      );
    } catch {
      return (l(), u(), s(), null);
    }
  }
  function Ra(e, t) {
    ((this._scope = document.documentElement),
      (this._selector = '::view-transition-' + e + '(' + t + ')'));
  }
  ((Ra.prototype.animate = function (e, t) {
    return (
      (t = typeof t == 'number' ? { duration: t } : Z({}, t)),
      (t.pseudoElement = this._selector),
      this._scope.animate(e, t)
    );
  }),
    (Ra.prototype.getAnimations = function () {
      for (
        var e = this._scope,
          t = this._selector,
          n = e.getAnimations({ subtree: !0 }),
          l = [],
          u = 0;
        u < n.length;
        u++
      ) {
        var i = n[u].effect;
        i !== null && i.target === e && i.pseudoElement === t && l.push(n[u]);
      }
      return l;
    }),
    (Ra.prototype.getComputedStyle = function () {
      return getComputedStyle(this._scope, this._selector);
    }));
  function oh(e) {
    return {
      name: e,
      group: new Ra('group', e),
      imagePair: new Ra('image-pair', e),
      old: new Ra('old', e),
      new: new Ra('new', e),
    };
  }
  function nn(e) {
    ((this._fragmentFiber = e), (this._observers = this._eventListeners = null));
  }
  nn.prototype.addEventListener = function (e, t, n) {
    var l = null,
      u = null;
    if (!(
      n != null &&
      typeof n != 'boolean' &&
      ((l = n.signal || null), l !== null && l.aborted)
    )) {
      this._eventListeners === null && (this._eventListeners = []);
      var i = this._eventListeners;
      if (sh(i, e, t, n) === -1) {
        var s = this,
          h = t;
        (n != null &&
          typeof n != 'boolean' &&
          n.once === !0 &&
          (h = function (O) {
            (s.removeEventListener(e, t, n),
              typeof t == 'function' ? t.call(this, O) : t.handleEvent(O));
          }),
          l !== null &&
            ((u = s.removeEventListener.bind(s, e, t, n)),
            l.addEventListener('abort', u, { once: !0 }),
            (u = l.removeEventListener.bind(l, 'abort', u))),
          (l = _r(n)),
          i.push({ type: e, listener: t, optionsOrUseCapture: n, attachedListener: h, cleanup: u }),
          g(this._fragmentFiber.child, !1, S1, e, h, l));
      }
      this._eventListeners = i;
    }
  };
  function S1(e, t, n, l) {
    return (_(e).addEventListener(t, n, l), !1);
  }
  nn.prototype.removeEventListener = function (e, t, n) {
    var l = this._eventListeners;
    if (l !== null && ((t = sh(l, e, t, n)), t !== -1)) {
      var u = l[t];
      n = u.attachedListener;
      var i = u.cleanup;
      ((u = _r(u.optionsOrUseCapture)),
        g(this._fragmentFiber.child, !1, _1, e, n, u),
        l.splice(t, 1),
        i !== null && i());
    }
  };
  function _1(e, t, n, l) {
    return (_(e).removeEventListener(t, n, l), !1);
  }
  function _r(e) {
    return e != null && typeof e != 'boolean' && (e.once === !0 || e.signal instanceof AbortSignal)
      ? { capture: e.capture, passive: e.passive }
      : e;
  }
  function ch(e) {
    return e == null
      ? 'c=0'
      : typeof e == 'boolean'
        ? 'c=' + (e ? '1' : '0')
        : 'c=' + (e.capture ? '1' : '0');
  }
  function sh(e, t, n, l) {
    if (e.length === 0) return -1;
    l = ch(l);
    for (var u = 0; u < e.length; u++) {
      var i = e[u];
      if (i.type === t && i.listener === n && ch(i.optionsOrUseCapture) === l) return u;
    }
    return -1;
  }
  ((nn.prototype.dispatchEvent = function (e) {
    var t = A(this._fragmentFiber);
    if (t === null) return !0;
    t = _(t);
    var n = this._eventListeners;
    if ((n !== null && 0 < n.length) || !e.bubbles) {
      var l = t.nodeType === 9 ? t.createComment('') : document.createTextNode('');
      if (n)
        for (var u = 0; u < n.length; u++) {
          var i = n[u];
          l.addEventListener(i.type, i.attachedListener, _r(i.optionsOrUseCapture));
        }
      if ((t.appendChild(l), (e = l.dispatchEvent(e)), n))
        for (u = 0; u < n.length; u++)
          ((i = n[u]),
            l.removeEventListener(i.type, i.attachedListener, _r(i.optionsOrUseCapture)));
      return (t.removeChild(l), e);
    }
    return t.dispatchEvent(e);
  }),
    (nn.prototype.focus = function (e) {
      g(this._fragmentFiber.child, !0, fh, e, void 0, void 0);
    }));
  function fh(e, t) {
    return e.tag === 6 ? !1 : ((e = _(e)), L1(e, t));
  }
  nn.prototype.focusLast = function (e) {
    var t = [];
    g(this._fragmentFiber.child, !0, _f, t, void 0, void 0);
    for (var n = t.length - 1; 0 <= n && !fh(t[n], e); n--);
  };
  function _f(e, t) {
    return (t.push(e), !1);
  }
  nn.prototype.blur = function () {
    var e = A(this._fragmentFiber);
    e !== null &&
      ((e = _(e)),
      (e = Nu(e).activeElement),
      e !== null && g(this._fragmentFiber.child, !1, T1, e, void 0, void 0));
  };
  function T1(e, t) {
    return e.tag === 6 ? !1 : ((e = _(e)), e === t || e.contains(t) ? (t.blur(), !0) : !1);
  }
  nn.prototype.observeUsing = function (e) {
    (this._observers === null && (this._observers = new Set()),
      this._observers.add(e),
      g(this._fragmentFiber.child, !1, O1, e, void 0, void 0));
  };
  function O1(e, t) {
    return (e.tag === 6 || ((e = _(e)), t.observe(e)), !1);
  }
  nn.prototype.unobserveUsing = function (e) {
    var t = this._observers;
    if (t !== null && t.has(e)) {
      (t.delete(e), g(this._fragmentFiber.child, !1, A1, e, void 0, void 0));
      for (var n = (t = 0); n < jn.length; n++) {
        var l = jn[n];
        l.fragmentInstance === this && l.observer === e ? e.unobserve(l.instance) : (jn[t++] = l);
      }
      jn.length = t;
    }
  };
  function A1(e, t) {
    return (e.tag === 6 || ((e = _(e)), t.unobserve(e)), !1);
  }
  var jn = [],
    Tf = !1;
  function x1(e, t, n) {
    (jn.push({ fragmentInstance: e, observer: t, instance: n }),
      Tf ||
        ((Tf = !0),
        z1(function () {
          Tf = !1;
          var l = jn;
          jn = [];
          for (var u = 0; u < l.length; u++) {
            var i = l[u];
            i.observer.unobserve(i.instance);
          }
        })));
  }
  nn.prototype.getClientRects = function () {
    var e = [];
    return (g(this._fragmentFiber.child, !1, C1, e, void 0, void 0), e);
  };
  function C1(e, t) {
    if (e.tag === 6) {
      e = e.stateNode;
      var n = e.ownerDocument.createRange();
      (n.selectNodeContents(e), t.push.apply(t, n.getClientRects()));
    } else ((e = _(e)), t.push.apply(t, e.getClientRects()));
    return !1;
  }
  ((nn.prototype.getRootNode = function (e) {
    var t = A(this._fragmentFiber);
    return t === null ? this : _(t).getRootNode(e);
  }),
    (nn.prototype.compareDocumentPosition = function (e) {
      var t = A(this._fragmentFiber);
      if (t === null) return Node.DOCUMENT_POSITION_DISCONNECTED;
      var n = [];
      g(this._fragmentFiber.child, !1, _f, n, void 0, void 0);
      var l = _(t);
      if (n.length === 0) {
        if (((n = l), R(this._fragmentFiber))) {
          e: {
            for (t = this._fragmentFiber.return; t !== null;) {
              if (t.tag === 4) {
                t = t.stateNode.containerInfo;
                break e;
              }
              if (t.tag === 3 || t.tag === 5 || t.tag === 27) break;
              t = t.return;
            }
            t = null;
          }
          t != null && (n = t);
        }
        t = this._fragmentFiber;
        var u = (l = n.compareDocumentPosition(e));
        return (
          n === e
            ? (u = Node.DOCUMENT_POSITION_CONTAINS)
            : l & Node.DOCUMENT_POSITION_CONTAINED_BY &&
              ((n = x(t)[1]),
              n === null
                ? (u = Node.DOCUMENT_POSITION_PRECEDING)
                : ((e = _(n).compareDocumentPosition(e)),
                  (u =
                    e === 0 || e & Node.DOCUMENT_POSITION_FOLLOWING
                      ? Node.DOCUMENT_POSITION_FOLLOWING
                      : Node.DOCUMENT_POSITION_PRECEDING))),
          (u |= Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC)
        );
      }
      ((t = _(n[0])), (u = _(n[n.length - 1])));
      var i = R(this._fragmentFiber) ? t.parentElement : l;
      if (i == null) return Node.DOCUMENT_POSITION_DISCONNECTED;
      ((l = i.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_CONTAINED_BY),
        (i = i.compareDocumentPosition(u) & Node.DOCUMENT_POSITION_CONTAINED_BY));
      var s = t.compareDocumentPosition(e),
        h = u.compareDocumentPosition(e),
        O = s & Node.DOCUMENT_POSITION_CONTAINED_BY || h & Node.DOCUMENT_POSITION_CONTAINED_BY;
      return (
        (h =
          l && i && s & Node.DOCUMENT_POSITION_FOLLOWING && h & Node.DOCUMENT_POSITION_PRECEDING),
        (t =
          (l && t === e) || (i && u === e) || O || h
            ? Node.DOCUMENT_POSITION_CONTAINED_BY
            : (!l && t === e) || (!i && u === e)
              ? Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
              : s),
        t & Node.DOCUMENT_POSITION_DISCONNECTED ||
        t & Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC ||
        w1(t, this._fragmentFiber, n[0], n[n.length - 1], e)
          ? t
          : Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
      );
    }));
  function w1(e, t, n, l, u) {
    var i = tl(u);
    if (e & Node.DOCUMENT_POSITION_CONTAINED_BY) {
      if ((n = !!i))
        e: {
          for (; i !== null;) {
            if (i.tag === 7 && (i === t || i.alternate === t)) {
              n = !0;
              break e;
            }
            i = i.return;
          }
          n = !1;
        }
      return n;
    }
    if (e & Node.DOCUMENT_POSITION_CONTAINS) {
      if (i === null)
        return ((i = u.ownerDocument), u === i || u === i.documentElement || u === i.body);
      e: {
        for (i = t, t = A(t); i !== null;) {
          if (!((i.tag !== 5 && i.tag !== 3 && i.tag !== 27) || (i !== t && i.alternate !== t))) {
            i = !0;
            break e;
          }
          i = i.return;
        }
        i = !1;
      }
      return i;
    }
    return e & Node.DOCUMENT_POSITION_PRECEDING
      ? ((t = !!i) &&
          !(t = i === n) &&
          ((t = ee(n, i, te)),
          t === null ? (t = !1) : (g(t, !0, q, i, n), (i = k), (k = null), (t = i !== null))),
        t)
      : e & Node.DOCUMENT_POSITION_FOLLOWING
        ? ((t = !!i) &&
            !(t = i === l) &&
            ((t = ee(l, i, te)),
            t === null ? (t = !1) : (g(t, !0, W, i, l), (i = k), (B = k = null), (t = i !== null))),
          t)
        : !1;
  }
  function dh(e, t) {
    var n = e.ownerDocument.createRange();
    (n.selectNodeContents(e),
      (e = n.getBoundingClientRect()),
      window.scrollTo(
        window.scrollX + e.left,
        t ? window.scrollY + e.top : window.scrollY + e.bottom - window.innerHeight,
      ));
  }
  nn.prototype.scrollIntoView = function (e) {
    if (typeof e == 'object') throw Error(c(566));
    var t = [];
    g(this._fragmentFiber.child, !1, _f, t, void 0, void 0);
    var n = e !== !1;
    if (t.length === 0) {
      var l = x(this._fragmentFiber);
      if (((l = n ? l[1] || l[0] || A(this._fragmentFiber) : l[0] || l[1]), l === null)) return;
      if (l.tag === 6) {
        ((e = _(l)), dh(e, n));
        return;
      }
      if (((l = _(l)), l.nodeType !== 9)) {
        if (l.nodeType === 11) {
          ((n = 'host' in l ? l.host : null), n !== null && n.scrollIntoView(e));
          return;
        }
        l.scrollIntoView(e);
      }
    }
    for (l = n ? t.length - 1 : 0; l !== (n ? -1 : t.length);) {
      var u = t[l];
      (u.tag === 6 ? ((u = _(u)), dh(u, n)) : _(u).scrollIntoView(e), (l += n ? -1 : 1));
    }
  };
  function R1(e, t) {
    return ((e = _(e)), yh(e, t), !1);
  }
  function yh(e, t) {
    (e.reactFragments == null && (e.reactFragments = new Set()), e.reactFragments.add(t));
  }
  function ph(e, t) {
    var n = t._eventListeners;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var u = n[l];
        e.addEventListener(u.type, u.attachedListener, _r(u.optionsOrUseCapture));
      }
    e.nodeType !== 3 &&
      ((n = t._observers),
      n !== null &&
        n.forEach(function (i) {
          for (var s = 0, h = 0; h < jn.length; h++) {
            var O = jn[h];
            (O.fragmentInstance !== t || O.observer !== i || O.instance !== e) && (jn[s++] = O);
          }
          ((jn.length = s), i.observe(e));
        }),
      yh(e, t));
  }
  function N1(e, t) {
    var n = t._eventListeners;
    if (n !== null)
      for (var l = 0; l < n.length; l++) {
        var u = n[l];
        e.removeEventListener(u.type, u.attachedListener, _r(u.optionsOrUseCapture));
      }
    e.nodeType !== 3 &&
      ((n = t._observers),
      n !== null &&
        n.forEach(function (i) {
          typeof i.rootMargin == 'string' ? x1(t, i, e) : i.unobserve(e);
        }),
      e.reactFragments != null && e.reactFragments.delete(t));
  }
  function Of(e) {
    var t = e.firstChild;
    for (t && t.nodeType === 10 && (t = t.nextSibling); t;) {
      var n = t;
      switch (((t = t.nextSibling), n.nodeName)) {
        case 'HTML':
        case 'HEAD':
        case 'BODY':
          (Of(n), Ya(n));
          continue;
        case 'SCRIPT':
        case 'STYLE':
          continue;
        case 'LINK':
          if (n.rel.toLowerCase() === 'stylesheet') continue;
      }
      e.removeChild(n);
    }
  }
  function D1(e, t, n, l) {
    for (; e.nodeType === 1;) {
      var u = n;
      if (e.nodeName.toLowerCase() !== t.toLowerCase()) {
        if (!l && (e.nodeName !== 'INPUT' || e.type !== 'hidden')) break;
      } else if (l) {
        if (!e[aa])
          switch (t) {
            case 'meta':
              if (!e.hasAttribute('itemprop')) break;
              return e;
            case 'link':
              if (
                ((i = e.getAttribute('rel')),
                i === 'stylesheet' && e.hasAttribute('data-precedence'))
              )
                break;
              if (
                i !== u.rel ||
                e.getAttribute('href') !== (u.href == null || u.href === '' ? null : u.href) ||
                e.getAttribute('crossorigin') !== (u.crossOrigin == null ? null : u.crossOrigin) ||
                e.getAttribute('title') !== (u.title == null ? null : u.title)
              )
                break;
              return e;
            case 'style':
              if (e.hasAttribute('data-precedence')) break;
              return e;
            case 'script':
              if (
                ((i = e.getAttribute('src')),
                (i !== (u.src == null ? null : u.src) ||
                  e.getAttribute('type') !== (u.type == null ? null : u.type) ||
                  e.getAttribute('crossorigin') !==
                    (u.crossOrigin == null ? null : u.crossOrigin)) &&
                  i &&
                  e.hasAttribute('async') &&
                  !e.hasAttribute('itemprop'))
              )
                break;
              return e;
            default:
              return e;
          }
      } else if (t === 'input' && e.type === 'hidden') {
        var i = u.name == null ? null : '' + u.name;
        if (u.type === 'hidden' && e.getAttribute('name') === i) return e;
      } else return e;
      if (((e = mn(e.nextSibling)), e === null)) break;
    }
    return null;
  }
  function j1(e, t, n) {
    if (t === '') return null;
    for (; e.nodeType !== 3;)
      if (
        ((e.nodeType !== 1 || e.nodeName !== 'INPUT' || e.type !== 'hidden') && !n) ||
        ((e = mn(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function gh(e, t) {
    for (; e.nodeType !== 8;)
      if (
        ((e.nodeType !== 1 || e.nodeName !== 'INPUT' || e.type !== 'hidden') && !t) ||
        ((e = mn(e.nextSibling)), e === null)
      )
        return null;
    return e;
  }
  function Af(e) {
    return e.data === '$?' || e.data === '$~';
  }
  function xf(e) {
    return e.data === '$!' || (e.data === '$?' && e.ownerDocument.readyState !== 'loading');
  }
  function M1(e, t) {
    var n = e.ownerDocument;
    if (e.data === '$~') e._reactRetry = t;
    else if (e.data !== '$?' || n.readyState !== 'loading') t();
    else {
      var l = function () {
        (t(), n.removeEventListener('DOMContentLoaded', l));
      };
      (n.addEventListener('DOMContentLoaded', l), (e._reactRetry = l));
    }
  }
  function mn(e) {
    for (; e != null; e = e.nextSibling) {
      var t = e.nodeType;
      if (t === 1 || t === 3) break;
      if (t === 8) {
        if (
          ((t = e.data),
          t === '$' ||
            t === '$!' ||
            t === '$?' ||
            t === '$~' ||
            t === '&' ||
            t === 'F!' ||
            t === 'F')
        )
          break;
        if (t === '/$' || t === '/&') return null;
      }
    }
    return e;
  }
  var Cf = null;
  function hh(e) {
    e = e.nextSibling;
    for (var t = 0; e;) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === '/$' || n === '/&') {
          if (t === 0) return mn(e.nextSibling);
          t--;
        } else (n !== '$' && n !== '$!' && n !== '$?' && n !== '$~' && n !== '&') || t++;
      }
      e = e.nextSibling;
    }
    return null;
  }
  function mh(e) {
    e = e.previousSibling;
    for (var t = 0; e;) {
      if (e.nodeType === 8) {
        var n = e.data;
        if (n === '$' || n === '$!' || n === '$?' || n === '$~' || n === '&') {
          if (t === 0) return e;
          t--;
        } else (n !== '/$' && n !== '/&') || t++;
      }
      e = e.previousSibling;
    }
    return null;
  }
  function L1(e, t) {
    function n() {
      l = !0;
    }
    if (e.ownerDocument.activeElement === e) return !0;
    var l = !1;
    try {
      (e.ownerDocument.addEventListener('focus', n, !0),
        (e.focus || HTMLElement.prototype.focus).call(e, t));
    } finally {
      e.ownerDocument.removeEventListener('focus', n, !0);
    }
    return l;
  }
  function z1(e) {
    lh(function () {
      lh(function (t) {
        return e(t);
      });
    });
  }
  function vh(e, t, n) {
    switch (((t = Nu(n)), e)) {
      case 'html':
        if (((e = t.documentElement), !e)) throw Error(c(452));
        return e;
      case 'head':
        if (((e = t.head), !e)) throw Error(c(453));
        return e;
      case 'body':
        if (((e = t.body), !e)) throw Error(c(454));
        return e;
      default:
        throw Error(c(451));
    }
  }
  function bh(e, t, n) {
    for (var l in n) {
      var u = n[l];
      n.hasOwnProperty(l) && u != null && $e(e, t, l, null, s1, u);
    }
    (n.dangerouslySetInnerHTML != null && (e.textContent = ''),
      e.onclick === F && (e.onclick = null),
      Ya(e));
  }
  function wf(e) {
    for (var t = e.attributes; t.length;) e.removeAttributeNode(t[0]);
    Ya(e);
  }
  var vn = new Map(),
    Eh = new Set();
  function Du(e) {
    if (typeof e.getRootNode == 'function') {
      var t = e.getRootNode();
      if (t.nodeType === 9 || t.nodeType === 11) return t;
    }
    return e.nodeType === 9 ? e : e.ownerDocument;
  }
  var pl = Se.d;
  Se.d = { f: U1, r: B1, D: k1, C: H1, L: F1, m: G1, X: Y1, S: q1, M: V1 };
  function U1() {
    var e = pl.f(),
      t = go();
    return e || t;
  }
  function B1(e) {
    var t = bl(e);
    t !== null && t.tag === 5 && t.type === 'form' ? _p(t) : pl.r(e);
  }
  var Tr = typeof document > 'u' ? null : document;
  function Sh(e, t, n) {
    var l = Tr;
    if (l && typeof t == 'string' && t) {
      var u = Lt(t);
      ((u = 'link[rel="' + e + '"][href="' + u + '"]'),
        typeof n == 'string' && (u += '[crossorigin="' + n + '"]'),
        Eh.has(u) ||
          (Eh.add(u),
          (e = { rel: e, crossOrigin: n, href: t }),
          l.querySelector(u) === null &&
            ((t = l.createElement('link')), xt(t, 'link', e), rt(t), l.head.appendChild(t))));
    }
  }
  function k1(e) {
    (pl.D(e), Sh('dns-prefetch', e, null));
  }
  function H1(e, t) {
    (pl.C(e, t), Sh('preconnect', e, t));
  }
  function F1(e, t, n) {
    pl.L(e, t, n);
    var l = Tr;
    if (l && e && t) {
      var u = 'link[rel="preload"][as="' + Lt(t) + '"]';
      t === 'image' && n && n.imageSrcSet
        ? ((u += '[imagesrcset="' + Lt(n.imageSrcSet) + '"]'),
          typeof n.imageSizes == 'string' && (u += '[imagesizes="' + Lt(n.imageSizes) + '"]'))
        : (u += '[href="' + Lt(e) + '"]');
      var i = u;
      switch (t) {
        case 'style':
          i = Or(e);
          break;
        case 'script':
          i = Ar(e);
      }
      if (!(
        vn.has(i) ||
        ((e = Z(
          { rel: 'preload', href: t === 'image' && n && n.imageSrcSet ? void 0 : e, as: t },
          n,
        )),
        vn.set(i, e),
        l.querySelector(u) !== null ||
          (t === 'style' && l.querySelector(ju(i))) ||
          (t === 'script' && l.querySelector(Mu(i))))
      )) {
        var s = l.createElement('link');
        (xt(s, 'link', e),
          t === 'style' &&
            ((s[qa] = !0),
            (s.onload = s.onerror =
              function () {
                Va(s);
              })),
          rt(s),
          l.head.appendChild(s));
      }
    }
  }
  function G1(e, t) {
    pl.m(e, t);
    var n = Tr;
    if (n && e) {
      var l = t && typeof t.as == 'string' ? t.as : 'script',
        u = 'link[rel="modulepreload"][as="' + Lt(l) + '"][href="' + Lt(e) + '"]',
        i = u;
      switch (l) {
        case 'audioworklet':
        case 'paintworklet':
        case 'serviceworker':
        case 'sharedworker':
        case 'worker':
        case 'script':
          i = Ar(e);
      }
      if (
        !vn.has(i) &&
        ((e = Z({ rel: 'modulepreload', href: e }, t)), vn.set(i, e), n.querySelector(u) === null)
      ) {
        switch (l) {
          case 'audioworklet':
          case 'paintworklet':
          case 'serviceworker':
          case 'sharedworker':
          case 'worker':
          case 'script':
            if (n.querySelector(Mu(i))) return;
        }
        ((l = n.createElement('link')), xt(l, 'link', e), rt(l), n.head.appendChild(l));
      }
    }
  }
  function q1(e, t, n) {
    pl.S(e, t, n);
    var l = Tr;
    if (l && e) {
      var u = El(l).hoistableStyles,
        i = Or(e);
      t = t || 'default';
      var s = u.get(i);
      if (!s) {
        var h = { loading: 0, preload: null };
        if ((s = l.querySelector(ju(i)))) h.loading = 5;
        else {
          ((e = Z({ rel: 'stylesheet', href: e, 'data-precedence': t }, n)),
            (n = vn.get(i)) && Rf(e, n));
          var O = (s = l.createElement('link'));
          (rt(O),
            xt(O, 'link', e),
            (O._p = new Promise(function (M, H) {
              ((O.onload = M), (O.onerror = H));
            })),
            O.addEventListener('load', function () {
              h.loading |= 1;
            }),
            O.addEventListener('error', function () {
              h.loading |= 2;
            }),
            (h.loading |= 4),
            _o(s, t, l));
        }
        ((s = { type: 'stylesheet', instance: s, count: 1, state: h }), u.set(i, s));
      }
    }
  }
  function Y1(e, t) {
    pl.X(e, t);
    var n = Tr;
    if (n && e) {
      var l = El(n).hoistableScripts,
        u = Ar(e),
        i = l.get(u);
      i ||
        ((i = n.querySelector(Mu(u))),
        i ||
          ((e = Z({ src: e, async: !0 }, t)),
          (t = vn.get(u)) && Nf(e, t),
          (i = n.createElement('script')),
          rt(i),
          xt(i, 'link', e),
          n.head.appendChild(i)),
        (i = { type: 'script', instance: i, count: 1, state: null }),
        l.set(u, i));
    }
  }
  function V1(e, t) {
    pl.M(e, t);
    var n = Tr;
    if (n && e) {
      var l = El(n).hoistableScripts,
        u = Ar(e),
        i = l.get(u);
      i ||
        ((i = n.querySelector(Mu(u))),
        i ||
          ((e = Z({ src: e, async: !0, type: 'module' }, t)),
          (t = vn.get(u)) && Nf(e, t),
          (i = n.createElement('script')),
          rt(i),
          xt(i, 'link', e),
          n.head.appendChild(i)),
        (i = { type: 'script', instance: i, count: 1, state: null }),
        l.set(u, i));
    }
  }
  function _h(e, t, n, l) {
    var u = (u = un.current) ? Du(u) : null;
    if (!u) throw Error(c(446));
    switch (e) {
      case 'meta':
      case 'title':
        return null;
      case 'style':
        return typeof n.precedence == 'string' && typeof n.href == 'string'
          ? ((n = Or(n.href)),
            (t = El(u).hoistableStyles),
            (l = t.get(n)),
            l || ((l = { type: 'style', instance: null, count: 0, state: null }), t.set(n, l)),
            l)
          : { type: 'void', instance: null, count: 0, state: null };
      case 'link':
        if (
          n.rel === 'stylesheet' &&
          typeof n.href == 'string' &&
          typeof n.precedence == 'string'
        ) {
          e = Or(n.href);
          var i = El(u).hoistableStyles,
            s = i.get(e);
          if (
            (s ||
              ((u = u.ownerDocument || u),
              (s = {
                type: 'stylesheet',
                instance: null,
                count: 0,
                state: { loading: 0, preload: null },
              }),
              i.set(e, s),
              (i = u.querySelector(ju(e)))
                ? i._p || ((s.instance = i), (s.state.loading = 5))
                : ((i = vn.get(e)),
                  i ||
                    ((i = {
                      rel: 'preload',
                      as: 'style',
                      href: n.href,
                      crossOrigin: n.crossOrigin,
                      integrity: n.integrity,
                      media: n.media,
                      hrefLang: n.hrefLang,
                      referrerPolicy: n.referrerPolicy,
                    }),
                    vn.set(e, i)),
                  I1(u, e, i, s.state))),
            t && l === null)
          )
            throw Error(c(528, ''));
          return s;
        }
        if (t && l !== null) throw Error(c(529, ''));
        return null;
      case 'script':
        return (
          (t = n.async),
          (n = n.src),
          typeof n == 'string' && t && typeof t != 'function' && typeof t != 'symbol'
            ? ((n = Ar(n)),
              (t = El(u).hoistableScripts),
              (l = t.get(n)),
              l || ((l = { type: 'script', instance: null, count: 0, state: null }), t.set(n, l)),
              l)
            : { type: 'void', instance: null, count: 0, state: null }
        );
      default:
        throw Error(c(444, e));
    }
  }
  function Or(e) {
    return 'href="' + Lt(e) + '"';
  }
  function ju(e) {
    return 'link[rel="stylesheet"][' + e + ']';
  }
  function Th(e) {
    return Z({}, e, { 'data-precedence': e.precedence, precedence: null });
  }
  function I1(e, t, n, l) {
    if ((t = e.querySelector('link[rel="preload"][as="style"][' + t + ']'))) {
      if (t[qa] !== !0) {
        l.loading = 1;
        return;
      }
    } else
      ((t = e.createElement('link')),
        (t[qa] = !0),
        (t.onload = t.onerror = Va.bind(null, t)),
        xt(t, 'link', n),
        rt(t),
        e.head.appendChild(t));
    ((l.preload = t),
      t.addEventListener('load', function () {
        return (l.loading |= 1);
      }),
      t.addEventListener('error', function () {
        return (l.loading |= 2);
      }));
  }
  function Ar(e) {
    return '[src="' + Lt(e) + '"]';
  }
  function Mu(e) {
    return 'script[async]' + e;
  }
  function Oh(e, t, n) {
    if ((t.count++, t.instance === null))
      switch (t.type) {
        case 'style':
          var l = e.querySelector('style[data-href~="' + Lt(n.href) + '"]');
          if (l) return ((t.instance = l), rt(l), l);
          var u = Z({}, n, {
            'data-href': n.href,
            'data-precedence': n.precedence,
            href: null,
            precedence: null,
          });
          return (
            (l = (e.ownerDocument || e).createElement('style')),
            rt(l),
            xt(l, 'style', u),
            _o(l, n.precedence, e),
            (t.instance = l)
          );
        case 'stylesheet':
          u = Or(n.href);
          var i = e.querySelector(ju(u));
          if (i) return ((t.state.loading |= 4), (t.instance = i), rt(i), i);
          ((l = Th(n)),
            (u = vn.get(u)) && Rf(l, u),
            (i = (e.ownerDocument || e).createElement('link')),
            rt(i));
          var s = i;
          return (
            (s._p = new Promise(function (h, O) {
              ((s.onload = h), (s.onerror = O));
            })),
            xt(i, 'link', l),
            (t.state.loading |= 4),
            _o(i, n.precedence, e),
            (t.instance = i)
          );
        case 'script':
          return (
            (i = Ar(n.src)),
            (u = e.querySelector(Mu(i)))
              ? ((t.instance = u), rt(u), u)
              : ((l = n),
                (u = vn.get(i)) && ((l = Z({}, n)), Nf(l, u)),
                (e = e.ownerDocument || e),
                (u = e.createElement('script')),
                rt(u),
                xt(u, 'link', l),
                e.head.appendChild(u),
                (t.instance = u))
          );
        case 'void':
          return null;
        default:
          throw Error(c(443, t.type));
      }
    else
      t.type === 'stylesheet' &&
        (t.state.loading & 4) === 0 &&
        ((l = t.instance), (t.state.loading |= 4), _o(l, n.precedence, e));
    return t.instance;
  }
  function _o(e, t, n) {
    for (
      var l = n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),
        u = l.length ? l[l.length - 1] : null,
        i = u,
        s = 0;
      s < l.length;
      s++
    ) {
      var h = l[s];
      if (h.dataset.precedence === t) i = h;
      else if (i !== u) break;
    }
    i
      ? i.parentNode.insertBefore(e, i.nextSibling)
      : ((t = n.nodeType === 9 ? n.head : n), t.insertBefore(e, t.firstChild));
  }
  function Rf(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.title == null && (e.title = t.title));
  }
  function Nf(e, t) {
    (e.crossOrigin == null && (e.crossOrigin = t.crossOrigin),
      e.referrerPolicy == null && (e.referrerPolicy = t.referrerPolicy),
      e.integrity == null && (e.integrity = t.integrity));
  }
  var To = null;
  function Ah(e, t, n) {
    if (To === null) {
      var l = new Map(),
        u = (To = new Map());
      u.set(n, l);
    } else ((u = To), (l = u.get(n)), l || ((l = new Map()), u.set(n, l)));
    if (l.has(e)) return l;
    for (l.set(e, null), n = n.getElementsByTagName(e), u = 0; u < n.length; u++) {
      var i = n[u];
      if (
        !(i[aa] || i[ht] || (e === 'link' && i.getAttribute('rel') === 'stylesheet')) &&
        i.namespaceURI !== 'http://www.w3.org/2000/svg'
      ) {
        var s = i.getAttribute(t) || '';
        s = e + s;
        var h = l.get(s);
        h ? h.push(i) : l.set(s, [i]);
      }
    }
    return l;
  }
  function Df(e, t, n) {
    ((e = e.ownerDocument || e),
      e.head.insertBefore(n, t === 'title' ? e.querySelector('head > title') : null));
  }
  function Z1(e, t, n) {
    if (n === 1 || t.itemProp != null) return !1;
    switch (e) {
      case 'meta':
      case 'title':
        return !0;
      case 'style':
        if (typeof t.precedence != 'string' || typeof t.href != 'string' || t.href === '') break;
        return !0;
      case 'link':
        if (
          typeof t.rel != 'string' ||
          typeof t.href != 'string' ||
          t.href === '' ||
          t.onLoad ||
          t.onError
        )
          break;
        switch (t.rel) {
          case 'stylesheet':
            return ((e = t.disabled), typeof t.precedence == 'string' && e == null);
          default:
            return !0;
        }
      case 'script':
        if (
          t.async &&
          typeof t.async != 'function' &&
          typeof t.async != 'symbol' &&
          !t.onLoad &&
          !t.onError &&
          t.src &&
          typeof t.src == 'string'
        )
          return !0;
    }
    return !1;
  }
  function xh(e, t) {
    return e === 'img' && t.src != null && t.src !== '' && t.onLoad == null && t.loading !== 'lazy';
  }
  function Ch(e) {
    return !(e.type === 'stylesheet' && (e.state.loading & 3) === 0);
  }
  function wh(e) {
    return (
      (e.width || 100) *
      (e.height || 100) *
      (typeof devicePixelRatio == 'number' ? devicePixelRatio : 1) *
      0.25
    );
  }
  function Rh(e, t) {
    typeof t.decode == 'function' &&
      (e.imgCount++,
      t.complete || ((e.imgBytes += wh(t)), e.suspenseyImages.push(t)),
      (e = $1.bind(e)),
      t.decode().then(e, e));
  }
  function X1(e, t, n, l) {
    if (
      n.type === 'stylesheet' &&
      (typeof l.media != 'string' || matchMedia(l.media).matches !== !1) &&
      (n.state.loading & 4) === 0
    ) {
      if (n.instance === null) {
        var u = Or(l.href),
          i = t.querySelector(ju(u));
        if (i) {
          ((t = i._p),
            t !== null &&
              typeof t == 'object' &&
              typeof t.then == 'function' &&
              (e.count++, (e = Lu.bind(e)), t.then(e, e)),
            (n.state.loading |= 4),
            (n.instance = i),
            rt(i));
          return;
        }
        ((i = t.ownerDocument || t),
          (l = Th(l)),
          (u = vn.get(u)) && Rf(l, u),
          (i = i.createElement('link')),
          rt(i));
        var s = i;
        ((s._p = new Promise(function (h, O) {
          ((s.onload = h), (s.onerror = O));
        })),
          xt(i, 'link', l),
          (n.instance = i));
      }
      (e.stylesheets === null && (e.stylesheets = new Map()),
        e.stylesheets.set(n, t),
        (t = n.state.preload) &&
          (n.state.loading & 3) === 0 &&
          (e.count++,
          (n = Lu.bind(e)),
          t.addEventListener('load', n),
          t.addEventListener('error', n)));
    }
  }
  var Oo = 0;
  function Q1(e, t) {
    return (
      e.stylesheets && e.count === 0 && xo(e, e.stylesheets),
      0 < e.count || 0 < e.imgCount
        ? function (n) {
            var l = setTimeout(function () {
              if ((e.stylesheets && xo(e, e.stylesheets), e.unsuspend)) {
                var i = e.unsuspend;
                ((e.unsuspend = null), i());
              }
            }, 6e4 + t);
            0 < e.imgBytes && Oo === 0 && (Oo = 62500 * d1());
            var u = setTimeout(
              function () {
                if (
                  ((e.waitingForImages = !1),
                  e.count === 0 && (e.stylesheets && xo(e, e.stylesheets), e.unsuspend))
                ) {
                  var i = e.unsuspend;
                  ((e.unsuspend = null), i());
                }
              },
              (e.imgBytes > Oo ? 50 : 800) + t,
            );
            return (
              (e.unsuspend = n),
              function () {
                ((e.unsuspend = null), clearTimeout(l), clearTimeout(u));
              }
            );
          }
        : null
    );
  }
  function Nh(e) {
    if (e.count === 0 && (e.imgCount === 0 || !e.waitingForImages)) {
      if (e.stylesheets) xo(e, e.stylesheets);
      else if (e.unsuspend) {
        var t = e.unsuspend;
        ((e.unsuspend = null), t());
      }
    }
  }
  function Lu() {
    (this.count--, Nh(this));
  }
  function $1() {
    (this.imgCount--, Nh(this));
  }
  var Ao = null;
  function xo(e, t) {
    ((e.stylesheets = null),
      e.unsuspend !== null &&
        (e.count++, (Ao = new Map()), t.forEach(K1, e), (Ao = null), Lu.call(e)));
  }
  function K1(e, t) {
    if (!(t.state.loading & 4)) {
      var n = Ao.get(e);
      if (n) var l = n.get(null);
      else {
        ((n = new Map()), Ao.set(e, n));
        for (
          var u = e.querySelectorAll('link[data-precedence],style[data-precedence]'), i = 0;
          i < u.length;
          i++
        ) {
          var s = u[i];
          (s.nodeName === 'LINK' || s.getAttribute('media') !== 'not all') &&
            (n.set(s.dataset.precedence, s), (l = s));
        }
        l && n.set(null, l);
      }
      ((u = t.instance),
        (s = u.getAttribute('data-precedence')),
        (i = n.get(s) || l),
        i === l && n.set(null, u),
        n.set(s, u),
        this.count++,
        (l = Lu.bind(this)),
        u.addEventListener('load', l),
        u.addEventListener('error', l),
        i
          ? i.parentNode.insertBefore(u, i.nextSibling)
          : ((e = e.nodeType === 9 ? e.head : e), e.insertBefore(u, e.firstChild)),
        (t.state.loading |= 4));
    }
  }
  var xr = {
    $$typeof: ie,
    Provider: null,
    Consumer: null,
    _currentValue: Xt,
    _currentValue2: Xt,
    _threadCount: 0,
  };
  function J1(e, t, n, l, u, i, s, h, O) {
    ((this.tag = 1),
      (this.containerInfo = e),
      (this.pingCache = this.current = this.pendingChildren = null),
      (this.timeoutHandle = -1),
      (this.callbackNode =
        this.next =
        this.pendingContext =
        this.context =
        this.cancelPendingCommit =
          null),
      (this.callbackPriority = 0),
      (this.expirationTimes = Zr(-1)),
      (this.entangledLanes =
        this.shellSuspendCounter =
        this.errorRecoveryDisabledLanes =
        this.expiredLanes =
        this.warmLanes =
        this.pingedLanes =
        this.suspendedLanes =
        this.pendingLanes =
          0),
      (this.entanglements = Zr(0)),
      (this.hiddenUpdates = Zr(null)),
      (this.identifierPrefix = l),
      (this.onUncaughtError = u),
      (this.onCaughtError = i),
      (this.onRecoverableError = s),
      (this.pooledCache = null),
      (this.pooledCacheLanes = 0),
      (this.formState = O),
      (this.transitionTypes = null),
      (this.incompleteTransitions = new Map()));
  }
  function Dh(e, t, n, l, u, i, s, h, O, M, H, V) {
    return (
      (e = new J1(e, t, n, s, O, M, H, V, h)),
      (t = 1),
      i === !0 && (t |= 24),
      (i = qt(3, null, null, t)),
      (e.current = i),
      (i.stateNode = e),
      (t = Ic()),
      t.refCount++,
      (e.pooledCache = t),
      t.refCount++,
      (i.memoizedState = { element: l, isDehydrated: n, cache: t }),
      $c(i),
      e
    );
  }
  function jh(e) {
    return e ? ((e = Pa), e) : Pa;
  }
  function Mh(e, t, n, l, u, i) {
    ((u = jh(u)),
      l.context === null ? (l.context = u) : (l.pendingContext = u),
      (l = Dl(t)),
      (l.payload = { element: n }),
      (i = i === void 0 ? null : i),
      i !== null && (l.callback = i),
      (n = jl(e, l, t)),
      n !== null && (Zt(n, e, t), fu(n, e, t)));
  }
  function Lh(e, t) {
    if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
      var n = e.retryLane;
      e.retryLane = n !== 0 && n < t ? n : t;
    }
  }
  function jf(e, t) {
    (Lh(e, t), (e = e.alternate) && Lh(e, t));
  }
  function zh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = da(e, 67108864);
      (t !== null && Zt(t, e, 67108864), jf(e, 67108864));
    }
  }
  function Uh(e) {
    if (e.tag === 13 || e.tag === 31) {
      var t = tn();
      t = ml(t);
      var n = da(e, t);
      (n !== null && Zt(n, e, t), jf(e, t));
    }
  }
  var Cr = !0;
  function P1(e, t, n, l) {
    var u = de.T;
    de.T = null;
    var i = Se.p;
    try {
      ((Se.p = 2), Mf(e, t, n, l));
    } finally {
      ((Se.p = i), (de.T = u));
    }
  }
  function W1(e, t, n, l) {
    var u = de.T;
    de.T = null;
    var i = Se.p;
    try {
      ((Se.p = 8), Mf(e, t, n, l));
    } finally {
      ((Se.p = i), (de.T = u));
    }
  }
  function Mf(e, t, n, l) {
    if (Cr) {
      var u = Lf(l);
      if (u === null) (pf(e, t, l, Co, n), kh(e, l));
      else if (tE(u, e, t, n, l)) l.stopPropagation();
      else if ((kh(e, l), t & 4 && -1 < eE.indexOf(e))) {
        for (; u !== null;) {
          var i = bl(u);
          if (i !== null)
            switch (i.tag) {
              case 3:
                if (((i = i.stateNode), i.current.memoizedState.isDehydrated)) {
                  var s = Wn(i.pendingLanes);
                  if (s !== 0) {
                    var h = i;
                    for (h.pendingLanes |= 2, h.entangledLanes |= 2; s;) {
                      var O = 1 << (31 - jt(s));
                      ((h.entanglements[1] |= O), (s &= ~O));
                    }
                    (In(i), (Ie & 6) === 0 && ((fo = Dt() + 500), Cu(0)));
                  }
                }
                break;
              case 31:
              case 13:
                ((h = da(i, 2)), h !== null && Zt(h, i, 2), go(), jf(i, 2));
            }
          if (((i = Lf(l)), i === null && pf(e, t, l, Co, n), i === u)) break;
          u = i;
        }
        u !== null && l.stopPropagation();
      } else pf(e, t, l, null, n);
    }
  }
  function Lf(e) {
    return ((e = Me(e)), zf(e));
  }
  var Co = null;
  function zf(e) {
    if (((Co = null), (e = tl(e)), e !== null)) {
      var t = y(e);
      if (t === null) e = null;
      else {
        var n = t.tag;
        if (n === 13) {
          if (((e = d(t)), e !== null)) return e;
          e = null;
        } else if (n === 31) {
          if (((e = m(t)), e !== null)) return e;
          e = null;
        } else if (n === 3) {
          if (t.stateNode.current.memoizedState.isDehydrated)
            return t.tag === 3 ? t.stateNode.containerInfo : null;
          e = null;
        } else t !== e && (e = null);
      }
    }
    return ((Co = e), null);
  }
  function Bh(e) {
    switch (e) {
      case 'beforetoggle':
      case 'cancel':
      case 'click':
      case 'close':
      case 'contextmenu':
      case 'copy':
      case 'cut':
      case 'auxclick':
      case 'dblclick':
      case 'dragend':
      case 'dragstart':
      case 'drop':
      case 'focusin':
      case 'focusout':
      case 'input':
      case 'invalid':
      case 'keydown':
      case 'keypress':
      case 'keyup':
      case 'mousedown':
      case 'mouseup':
      case 'paste':
      case 'pause':
      case 'play':
      case 'pointercancel':
      case 'pointerdown':
      case 'pointerup':
      case 'ratechange':
      case 'reset':
      case 'seeked':
      case 'submit':
      case 'toggle':
      case 'touchcancel':
      case 'touchend':
      case 'touchstart':
      case 'volumechange':
      case 'change':
      case 'selectionchange':
      case 'textInput':
      case 'compositionstart':
      case 'compositionend':
      case 'compositionupdate':
      case 'beforeblur':
      case 'afterblur':
      case 'beforeinput':
      case 'blur':
      case 'fullscreenchange':
      case 'fullscreenerror':
      case 'focus':
      case 'hashchange':
      case 'popstate':
      case 'select':
      case 'selectstart':
        return 2;
      case 'drag':
      case 'dragenter':
      case 'dragexit':
      case 'dragleave':
      case 'dragover':
      case 'mousemove':
      case 'mouseout':
      case 'mouseover':
      case 'pointermove':
      case 'pointerout':
      case 'pointerover':
      case 'resize':
      case 'scroll':
      case 'touchmove':
      case 'wheel':
      case 'mouseenter':
      case 'mouseleave':
      case 'pointerenter':
      case 'pointerleave':
        return 8;
      case 'message':
        switch (Wu()) {
          case hl:
            return 2;
          case ei:
            return 8;
          case on:
          case ic:
            return 32;
          case ti:
            return 268435456;
          default:
            return 32;
        }
      default:
        return 32;
    }
  }
  var Uf = !1,
    Vl = null,
    Il = null,
    Zl = null,
    zu = new Map(),
    Uu = new Map(),
    Xl = [],
    eE =
      'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset'.split(
        ' ',
      );
  function kh(e, t) {
    switch (e) {
      case 'focusin':
      case 'focusout':
        Vl = null;
        break;
      case 'dragenter':
      case 'dragleave':
        Il = null;
        break;
      case 'mouseover':
      case 'mouseout':
        Zl = null;
        break;
      case 'pointerover':
      case 'pointerout':
        zu.delete(t.pointerId);
        break;
      case 'gotpointercapture':
      case 'lostpointercapture':
        Uu.delete(t.pointerId);
    }
  }
  function Bu(e, t, n, l, u, i) {
    return e === null || e.nativeEvent !== i
      ? ((e = {
          blockedOn: t,
          domEventName: n,
          eventSystemFlags: l,
          nativeEvent: i,
          targetContainers: [u],
        }),
        t !== null && ((t = bl(t)), t !== null && zh(t)),
        e)
      : ((e.eventSystemFlags |= l),
        (t = e.targetContainers),
        u !== null && t.indexOf(u) === -1 && t.push(u),
        e);
  }
  function tE(e, t, n, l, u) {
    switch (t) {
      case 'focusin':
        return ((Vl = Bu(Vl, e, t, n, l, u)), !0);
      case 'dragenter':
        return ((Il = Bu(Il, e, t, n, l, u)), !0);
      case 'mouseover':
        return ((Zl = Bu(Zl, e, t, n, l, u)), !0);
      case 'pointerover':
        var i = u.pointerId;
        return (zu.set(i, Bu(zu.get(i) || null, e, t, n, l, u)), !0);
      case 'gotpointercapture':
        return ((i = u.pointerId), Uu.set(i, Bu(Uu.get(i) || null, e, t, n, l, u)), !0);
    }
    return !1;
  }
  function Hh(e) {
    var t = tl(e.target);
    if (t !== null) {
      var n = y(t);
      if (n !== null) {
        if (((t = n.tag), t === 13)) {
          if (((t = d(n)), t !== null)) {
            ((e.blockedOn = t),
              la(e.priority, function () {
                Uh(n);
              }));
            return;
          }
        } else if (t === 31) {
          if (((t = m(n)), t !== null)) {
            ((e.blockedOn = t),
              la(e.priority, function () {
                Uh(n);
              }));
            return;
          }
        } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
          e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null;
          return;
        }
      }
    }
    e.blockedOn = null;
  }
  function wo(e) {
    if (e.blockedOn !== null) return !1;
    for (var t = e.targetContainers; 0 < t.length;) {
      var n = Lf(e.nativeEvent);
      if (n === null) {
        n = e.nativeEvent;
        var l = new n.constructor(n.type, n);
        ((ye = l), n.target.dispatchEvent(l), (ye = null));
      } else return ((t = bl(n)), t !== null && zh(t), (e.blockedOn = n), !1);
      t.shift();
    }
    return !0;
  }
  function Fh(e, t, n) {
    wo(e) && n.delete(t);
  }
  function nE() {
    ((Uf = !1),
      Vl !== null && wo(Vl) && (Vl = null),
      Il !== null && wo(Il) && (Il = null),
      Zl !== null && wo(Zl) && (Zl = null),
      zu.forEach(Fh),
      Uu.forEach(Fh));
  }
  function Ro(e, t) {
    e.blockedOn === t &&
      ((e.blockedOn = null),
      Uf || ((Uf = !0), a.unstable_scheduleCallback(a.unstable_NormalPriority, nE)));
  }
  var No = null;
  function Gh(e) {
    No !== e &&
      ((No = e),
      a.unstable_scheduleCallback(a.unstable_NormalPriority, function () {
        No === e && (No = null);
        for (var t = 0; t < e.length; t += 3) {
          var n = e[t],
            l = e[t + 1],
            u = e[t + 2];
          if (typeof l != 'function') {
            if (zf(l || n) === null) continue;
            break;
          }
          var i = bl(n);
          i !== null &&
            (e.splice(t, 3),
            (t -= 3),
            hs(i, { pending: !0, data: u, method: n.method, action: l }, l, u));
        }
      }));
  }
  function wr(e) {
    function t(O) {
      return Ro(O, e);
    }
    (Vl !== null && Ro(Vl, e),
      Il !== null && Ro(Il, e),
      Zl !== null && Ro(Zl, e),
      zu.forEach(t),
      Uu.forEach(t));
    for (var n = 0; n < Xl.length; n++) {
      var l = Xl[n];
      l.blockedOn === e && (l.blockedOn = null);
    }
    for (; 0 < Xl.length && ((n = Xl[0]), n.blockedOn === null);)
      (Hh(n), n.blockedOn === null && Xl.shift());
    if (((n = (e.ownerDocument || e).$$reactFormReplay), n != null))
      for (l = 0; l < n.length; l += 3) {
        var u = n[l],
          i = n[l + 1],
          s = u[wt] || null;
        if (typeof i == 'function') s || Gh(n);
        else if (s) {
          var h = null;
          if (i && i.hasAttribute('formAction')) {
            if (((u = i), (s = i[wt] || null))) h = s.formAction;
            else if (zf(u) !== null) continue;
          } else h = s.action;
          (typeof h == 'function' ? (n[l + 1] = h) : (n.splice(l, 3), (l -= 3)), Gh(n));
        }
      }
  }
  function qh() {
    function e(i) {
      i.canIntercept &&
        i.info === 'react-transition' &&
        i.intercept({
          handler: function () {
            return new Promise(function (s) {
              return (u = s);
            });
          },
          focusReset: 'manual',
          scroll: 'manual',
        });
    }
    function t() {
      (u !== null && (u(), (u = null)), l || setTimeout(n, 20));
    }
    function n() {
      if (!l && !navigation.transition) {
        var i = navigation.currentEntry;
        i &&
          i.url != null &&
          navigation.navigate(i.url, {
            state: i.getState(),
            info: 'react-transition',
            history: 'replace',
          });
      }
    }
    if (typeof navigation == 'object') {
      var l = !1,
        u = null;
      return (
        navigation.addEventListener('navigate', e),
        navigation.addEventListener('navigatesuccess', t),
        navigation.addEventListener('navigateerror', t),
        setTimeout(n, 100),
        function () {
          ((l = !0),
            navigation.removeEventListener('navigate', e),
            navigation.removeEventListener('navigatesuccess', t),
            navigation.removeEventListener('navigateerror', t),
            u !== null && (u(), (u = null)));
        }
      );
    }
  }
  function Bf(e) {
    this._internalRoot = e;
  }
  ((Do.prototype.render = Bf.prototype.render =
    function (e) {
      var t = this._internalRoot;
      if (t === null) throw Error(c(409));
      var n = t.current,
        l = tn();
      Mh(n, l, e, t, null, null);
    }),
    (Do.prototype.unmount = Bf.prototype.unmount =
      function () {
        var e = this._internalRoot;
        if (e !== null) {
          this._internalRoot = null;
          var t = e.containerInfo;
          (Mh(e.current, 2, null, e, null, null), go(), (t[vl] = null));
        }
      }));
  function Do(e) {
    this._internalRoot = e;
  }
  Do.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var t = ri();
      e = { blockedOn: null, target: e, priority: t };
      for (var n = 0; n < Xl.length && t !== 0 && t < Xl[n].priority; n++);
      (Xl.splice(n, 0, e), n === 0 && Hh(e));
    }
  };
  var Yh = r.version;
  if (Yh !== '19.3.1') throw Error(c(527, Yh, '19.3.1'));
  Se.findDOMNode = function (e) {
    var t = e._reactInternals;
    if (t === void 0)
      throw typeof e.render == 'function'
        ? Error(c(188))
        : ((e = Object.keys(e).join(',')), Error(c(268, e)));
    return ((e = v(t)), (e = e !== null ? E(e) : null), (e = e === null ? null : e.stateNode), e);
  };
  var lE = {
    bundleType: 0,
    version: '19.3.1',
    rendererPackageName: 'react-dom',
    currentDispatcherRef: de,
    reconcilerVersion: '19.3.1',
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
    var jo = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!jo.isDisabled && jo.supportsFiber)
      try {
        ((Wl = jo.inject(lE)), (at = jo));
      } catch {}
  }
  return (
    (Fu.createRoot = function (e, t) {
      if (!f(e)) throw Error(c(299));
      var n = !1,
        l = '',
        u = jp,
        i = Mp,
        s = Lp;
      return (
        t != null &&
          (t.unstable_strictMode === !0 && (n = !0),
          t.identifierPrefix !== void 0 && (l = t.identifierPrefix),
          t.onUncaughtError !== void 0 && (u = t.onUncaughtError),
          t.onCaughtError !== void 0 && (i = t.onCaughtError),
          t.onRecoverableError !== void 0 && (s = t.onRecoverableError)),
        (t = Dh(e, 1, !1, null, null, n, l, null, u, i, s, qh)),
        (e[vl] = t.current),
        yf(e),
        new Bf(t)
      );
    }),
    (Fu.hydrateRoot = function (e, t, n) {
      if (!f(e)) throw Error(c(299));
      var l = !1,
        u = '',
        i = jp,
        s = Mp,
        h = Lp,
        O = null;
      return (
        n != null &&
          (n.unstable_strictMode === !0 && (l = !0),
          n.identifierPrefix !== void 0 && (u = n.identifierPrefix),
          n.onUncaughtError !== void 0 && (i = n.onUncaughtError),
          n.onCaughtError !== void 0 && (s = n.onCaughtError),
          n.onRecoverableError !== void 0 && (h = n.onRecoverableError),
          n.formState !== void 0 && (O = n.formState)),
        (t = Dh(e, 1, !0, t, n ?? null, l, u, O, i, s, h, qh)),
        (t.context = jh(null)),
        (n = t.current),
        (l = tn()),
        (l = ml(l)),
        (u = Dl(l)),
        (u.callback = null),
        jl(n, u, l),
        (n = l),
        (t.current.lanes = n),
        ta(t, n),
        In(t),
        (e[vl] = t.current),
        yf(e),
        new Do(t)
      );
    }),
    (Fu.version = '19.3.1'),
    Fu
  );
}
var Rm;
function gO() {
  if (Rm) return Pf.exports;
  Rm = 1;
  function a() {
    if (!(
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' ||
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'
    ))
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a);
      } catch (r) {
        console.error(r);
      }
  }
  return (a(), (Pf.exports = pO()), Pf.exports);
}
var hO = gO();
const Td = {},
  tv = X.createContext(Td);
function mO(a) {
  const r = X.useContext(tv);
  return X.useMemo(
    function () {
      return typeof a == 'function' ? a(r) : { ...r, ...a };
    },
    [r, a],
  );
}
function vO(a) {
  let r;
  return (
    a.disableParentContext
      ? (r = typeof a.components == 'function' ? a.components(Td) : a.components || Td)
      : (r = mO(a.components)),
    X.createElement(tv.Provider, { value: r }, a.children)
  );
}
let nv, lv;
typeof document < 'u' && (nv = document);
typeof window < 'u' && (lv = window);
const av = X.createContext({ document: nv, window: lv }),
  bO = () => L.useContext(av),
  { Provider: EO, Consumer: JA } = av;
class SO extends L.Component {
  componentDidMount() {
    this.props.contentDidMount && this.props.contentDidMount();
  }
  componentDidUpdate() {
    this.props.contentDidUpdate && this.props.contentDidUpdate();
  }
  render() {
    return X.Children.only(this.props.children);
  }
}
class rv extends L.Component {
  constructor(o) {
    super(o);
    Rr(this, '_isMounted', !1);
    Rr(this, 'nodeRef', X.createRef());
    Rr(this, 'setRef', (o) => {
      this.nodeRef.current = o;
      const { forwardedRef: c } = this.props;
      typeof c == 'function' ? c(o) : c && (c.current = o);
    });
    Rr(this, 'handleLoad', () => {
      this.setState({ iframeLoaded: !0 });
    });
    this.state = { iframeLoaded: !1 };
  }
  componentDidMount() {
    var c;
    this._isMounted = !0;
    const o = this.getDoc();
    o && o.readyState === 'complete'
      ? this.forceUpdate()
      : (c = this.nodeRef.current) == null || c.addEventListener('load', this.handleLoad);
  }
  componentWillUnmount() {
    var o;
    ((this._isMounted = !1),
      (o = this.nodeRef.current) == null || o.removeEventListener('load', this.handleLoad));
  }
  getDoc() {
    return this.nodeRef.current ? this.nodeRef.current.contentDocument : null;
  }
  getMountTarget() {
    const o = this.getDoc();
    return this.props.mountTarget
      ? o == null
        ? void 0
        : o.querySelector(this.props.mountTarget)
      : o == null
        ? void 0
        : o.body.children[0];
  }
  renderFrameContents() {
    if (!this._isMounted) return null;
    const o = this.getDoc();
    if (!o) return null;
    const c = this.props.contentDidMount,
      f = this.props.contentDidUpdate,
      y = o.defaultView || o.parentView,
      d = b.jsx(SO, {
        contentDidMount: c,
        contentDidUpdate: f,
        children: b.jsx(EO, {
          value: { document: o, window: y },
          children: b.jsx('div', { className: 'frame-content', children: this.props.children }),
        }),
      }),
      m = this.getMountTarget();
    return [um.createPortal(this.props.head, this.getDoc().head), um.createPortal(d, m)];
  }
  render() {
    const o = { ...this.props, srcDoc: this.props.initialContent, children: void 0 };
    return (
      delete o.head,
      delete o.initialContent,
      delete o.mountTarget,
      delete o.contentDidMount,
      delete o.contentDidUpdate,
      delete o.forwardedRef,
      b.jsx('iframe', {
        ...o,
        ref: this.setRef,
        onLoad: this.handleLoad,
        children: this.state.iframeLoaded && this.renderFrameContents(),
      })
    );
  }
}
Rr(rv, 'defaultProps', {
  style: {},
  head: null,
  children: void 0,
  mountTarget: void 0,
  contentDidMount: () => {},
  contentDidUpdate: () => {},
  initialContent:
    '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>',
});
const _O = X.forwardRef((a, r) => b.jsx(rv, { ...a, forwardedRef: r })),
  TO = (a) => a.altKey || a.ctrlKey || a.shiftKey || a.metaKey,
  uv = (a) => {
    const r = a.target || {};
    return !!(
      !a.key ||
      r.isContentEditable ||
      (['INPUT', 'TEXTAREA'].includes(r.nodeName) && !TO(a))
    );
  },
  Nm = (a) => {
    if (uv(a)) return;
    const r = new KeyboardEvent('keydown', {
      key: a.key,
      code: a.code,
      keyCode: a.keyCode,
      altKey: a.altKey,
      ctrlKey: a.ctrlKey,
      shiftKey: a.shiftKey,
      metaKey: a.metaKey,
    });
    document.dispatchEvent(r);
  },
  Dm = (a) => {
    if (uv(a)) return;
    const r = new KeyboardEvent('keyup', {
      key: a.key,
      code: a.code,
      keyCode: a.keyCode,
      altKey: a.altKey,
      ctrlKey: a.ctrlKey,
      shiftKey: a.shiftKey,
      metaKey: a.metaKey,
    });
    document.dispatchEvent(r);
  },
  Od = 'data-debug-css';
function jm(a, r, o) {
  const c = r.head.querySelectorAll(`style[${Od}]`),
    f = r.createElement('style');
  return (
    f.setAttribute(Od, 'true'),
    f.appendChild(r.createTextNode(a)),
    o && c[o] ? (c[o].after(f), o + 1) : (r.head.appendChild(f), c.length)
  );
}
function Mm(a, r) {
  const o = a.head.querySelectorAll(`style[${Od}]`);
  r != null && o[r] && o[r].remove();
}
const OO = ({ active: a, children: r, rtl: o, width: c }) => {
  const { window: f, document: y } = bO(),
    d = () => {
      f &&
        (f.document.documentElement.setAttribute('dir', o ? 'rtl' : 'ltr'),
        [...document.head.children].forEach((m) => {
          if (
            m.tagName === 'STYLE' ||
            (m.tagName === 'LINK' &&
              (m.getAttribute('type') === 'text/css' || m.getAttribute('rel') === 'stylesheet'))
          ) {
            if (
              [...f.document.head.children].some((v) =>
                v.tagName === 'LINK'
                  ? v.getAttribute('href') === m.getAttribute('href')
                  : v.tagName === 'STYLE'
                    ? v.innerHTML === m.innerHTML
                    : !1,
              )
            )
              return;
            f.document.head.appendChild(m.cloneNode(!0));
          }
        }));
    };
  return (
    L.useEffect(() => {
      const m = window.CSSStyleSheet.prototype.insertRule,
        p = window.CSSStyleSheet.prototype.deleteRule;
      return (
        (window.CSSStyleSheet.prototype.insertRule = function (v, E) {
          const g = jm(v, document, E);
          return a && y ? jm(v, y, E) : g;
        }),
        (window.CSSStyleSheet.prototype.deleteRule = function (v) {
          (Mm(document, v), a && y && Mm(y, v));
        }),
        () => {
          ((window.CSSStyleSheet.prototype.insertRule = m),
            (window.CSSStyleSheet.prototype.deleteRule = p));
        }
      );
    }, []),
    L.useEffect(() => {
      if (a) {
        (d(),
          y == null || y.addEventListener('keydown', Nm),
          y == null || y.addEventListener('keyup', Dm));
        const m = new MutationObserver(() => d());
        return (
          document.documentElement.setAttribute('data-iframed', `${c}`),
          m.observe(document.head, { subtree: !0, characterData: !0, childList: !0 }),
          () => {
            (m && m.disconnect(),
              y == null || y.removeEventListener('keydown', Nm),
              y == null || y.removeEventListener('keyup', Dm));
          }
        );
      }
    }, [a, o, y]),
    r
  );
};
class AO extends L.Component {
  constructor(r) {
    (super(r), (this.state = { hasError: !1 }));
  }
  static getDerivedStateFromError() {
    return { hasError: !0 };
  }
  componentDidCatch() {}
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}
const xO = ({ activeStory: a }) =>
    b.jsxs('div', {
      className: 'ladle-error-content',
      children: [
        b.jsx('h1', { children: 'Story not found' }),
        b.jsxs('p', {
          children: [
            'The story id ',
            b.jsx(Ma, { children: a }),
            ' you are trying to open does not exist. Typo?',
          ],
        }),
        b.jsx('p', { children: b.jsx(kr, { href: '/', children: 'Back to home' }) }),
        b.jsx('p', {
          children: b.jsx(kr, { href: 'https://github.com/tajo/ladle', children: 'GitHub' }),
        }),
        b.jsx('p', { children: b.jsx(kr, { href: 'https://www.ladle.dev', children: 'Docs' }) }),
      ],
    }),
  CO = (a) => {
    const r = Kn.parse(a).source;
    return r === 'true' ? !0 : r === 'false' ? !1 : ge.addons.source.defaultState;
  },
  iv = ({ children: a, theme: r, language: o = 'tsx', locStart: c, locEnd: f, className: y }) => {
    const d = typeof c < 'u' && typeof f < 'u',
      m = /language-(\w+)/.exec(y || '');
    return m
      ? ((o = m[1]),
        b.jsx(Am, {
          code: a.trim(),
          language: o,
          theme: r === 'dark' ? ge.addons.source.themeDark : ge.addons.source.themeLight,
          children: ({ className: p, style: v, tokens: E, getTokenProps: g }) =>
            b.jsx('div', {
              className: p,
              style: { ...v, textAlign: 'left', margin: '0.5em 0 1em 0', padding: '1em' },
              children: E.map((A, R) =>
                b.jsx(
                  'div',
                  { children: A.map((x, S) => b.jsx('span', { ...g({ token: x }) }, S)) },
                  R,
                ),
              ),
            }),
        }))
      : d
        ? b.jsx(Am, {
            code: a.trim(),
            language: o,
            theme: r === 'dark' ? ge.addons.source.themeDark : ge.addons.source.themeLight,
            children: ({ className: p, style: v, tokens: E, getLineProps: g, getTokenProps: A }) =>
              b.jsx('pre', {
                className: p,
                style: {
                  ...v,
                  textAlign: 'left',
                  margin: '0.5em 0 1em 0',
                  padding: '1em 0',
                  overflow: 'auto',
                  maxHeight: '50vh',
                },
                children: E.map((R, x) =>
                  b.jsxs(
                    'div',
                    {
                      id: `ladle_loc_${x + 1}`,
                      ...g({ line: R, key: x }),
                      style: { display: 'table-row' },
                      children: [
                        b.jsx('span', {
                          className: 'ladle-addon-source-lineno',
                          style:
                            x + 1 >= c && x + 1 <= f
                              ? { backgroundColor: 'var(--ladle-color-accent)', color: '#FFF' }
                              : void 0,
                          children: x + 1,
                        }),
                        b.jsx('div', {
                          style: { display: 'table-cell', paddingLeft: '0.5em' },
                          children: R.map((S, _) =>
                            b.jsx('span', { ...A({ token: S, key: _ }) }, _),
                          ),
                        }),
                      ],
                    },
                    x,
                  ),
                ),
              }),
          })
        : b.jsx('code', { children: a });
  },
  wO = ({ globalState: a }) => {
    if (!Fr[a.story]) return b.jsx(b.Fragment, { children: 'There is no story loaded.' });
    const { entry: r, locStart: o, locEnd: c } = Fr[a.story];
    return (
      L.useEffect(() => {
        ((window.location.hash = ''), (window.location.hash = `ladle_loc_${o}`));
      }, [o]),
      b.jsxs(b.Fragment, {
        children: [
          b.jsx(aT, { path: r, locStart: o, locEnd: c }),
          b.jsx(iv, {
            theme: a.theme,
            language: 'tsx',
            locEnd: c,
            locStart: o,
            children: decodeURIComponent(iT[a.story]),
          }),
        ],
      })
    );
  },
  RO = ({ globalState: a, dispatch: r }) => {
    const o = 'Show the story source code.';
    return (
      En(
        ge.hotkeys.source,
        () => {
          r({ type: De.UpdateSource, value: !a.source });
        },
        { enabled: a.hotkeys && ge.addons.source.enabled },
      ),
      b.jsx('li', {
        children: b.jsxs('button', {
          'aria-label': o,
          'data-testid': 'addon-source',
          title: o,
          onClick: () => {
            r({ type: De.UpdateSource, value: !a.source });
          },
          className: a.source ? 'source-active' : '',
          type: 'button',
          children: [
            b.jsx(uS, {}),
            b.jsx('span', { className: 'ladle-addon-tooltip', children: o }),
            b.jsx('label', { children: 'Story Source Code' }),
            b.jsx(Yr, {
              isOpen: a.source,
              close: () => r({ type: De.UpdateSource, value: !1 }),
              label: 'Dialog with the story source code.',
              children: b.jsx(wO, { globalState: a }),
            }),
          ],
        }),
      })
    );
  },
  Zn = Date;
let Ad = null;
const Gr = class extends Zn {
  constructor(r, o, c, f, y, d, m) {
    super();
    let p;
    switch (arguments.length) {
      case 0:
        Ad !== null ? (p = new Zn(Ad.valueOf())) : (p = new Zn());
        break;
      case 1:
        p = new Zn(r);
        break;
      default:
        ((c = typeof c > 'u' ? 1 : c),
          (f = f || 0),
          (y = y || 0),
          (d = d || 0),
          (m = m || 0),
          (p = new Zn(r, o, c, f, y, d, m)));
        break;
    }
    return p;
  }
  static [Symbol.hasInstance](r) {
    return r instanceof Zn;
  }
};
Gr.UTC = Zn.UTC;
Gr.now = function () {
  return new Gr().valueOf();
};
Gr.parse = function (a) {
  return Zn.parse(a);
};
Gr.toString = function () {
  return Zn.toString();
};
function NO(a) {
  const r = new Date(a.valueOf());
  if (isNaN(r.getTime())) throw new TypeError('mockdate: The time set is an invalid date: ' + a);
  ((Date = Gr), (Ad = r.valueOf()));
}
function DO() {
  Date = Zn;
}
const jO = ({ children: a, active: r, width: o, story: c, mode: f }) =>
    (!r && o === 0) || f === Ft.Preview
      ? a
      : b.jsx(_O, {
          title: `Story ${c}`,
          initialContent:
            '<!DOCTYPE html><html><head><base target="_parent" /></head><body style="margin:0"><div id="root"></div></body></html>',
          mountTarget: '#root',
          className: 'ladle-iframe',
          style: { width: o || '100%' },
          children: a,
        }),
  Lm = ({ globalState: a, dispatch: r }) => {
    var v;
    const o = Fr[a.story],
      c = a.width,
      f = (v = o == null ? void 0 : o.meta) == null ? void 0 : v.meta,
      y = f ? f.hotkeys : !0,
      d = f ? f.mockDate : void 0,
      m = o && f ? f.iframed : !1;
    let p = o && f ? f.width : 0;
    return (
      Object.keys(ge.addons.width.options).forEach((E) => {
        E === p && (p = ge.addons.width.options[E]);
      }),
      L.useEffect(() => {
        d ? NO(d) : DO();
      }, [d]),
      L.useEffect(() => {
        typeof y < 'u' && y !== a.hotkeys && r({ type: De.UpdateHotkeys, value: y });
      }, [y]),
      L.useEffect(() => {
        if (p && p !== 0) {
          r({ type: De.UpdateWidth, value: p });
          return;
        }
        ge.addons.width.defaultState !== 0 &&
          r({ type: De.UpdateWidth, value: ge.addons.width.defaultState });
      }, [p, a.story]),
      L.useEffect(() => {
        a.mode !== Ft.Preview && (m || c)
          ? document.documentElement.setAttribute('data-iframed', `${c}`)
          : document.documentElement.removeAttribute('data-iframed');
      }, [m, a.story, a.mode, a.width]),
      a.story
        ? b.jsx(AO, {
            children: b.jsx(L.Suspense, {
              fallback: b.jsx(eS, {}),
              children: b.jsx(jO, {
                active: m,
                story: a.story,
                width: c,
                mode: a.mode,
                children: b.jsx(OO, {
                  active: (m || c > 0) && a.mode !== Ft.Preview,
                  rtl: a.rtl,
                  width: c,
                  children: b.jsx(vO, {
                    components: { code: (E) => b.jsx(iv, { ...E, theme: a.theme }) },
                    children: b.jsx(W_, {
                      config: ge,
                      globalState: a,
                      dispatch: r,
                      storyMeta: f,
                      children: o
                        ? L.createElement(o.component)
                        : b.jsx(xO, { activeStory: a.story }),
                    }),
                  }),
                }),
              }),
            }),
          })
        : null
    );
  },
  MO = () =>
    b.jsxs('div', {
      className: 'ladle-error-content',
      children: [
        b.jsx('h1', { children: 'No stories found' }),
        b.jsxs('p', {
          children: [
            'The configured glob pattern for stories is: ',
            b.jsx(Ma, { children: bn.stories }),
            '.',
          ],
        }),
        b.jsxs('p', {
          children: [
            'It can be changed through the',
            ' ',
            b.jsx(kr, {
              href: 'https://www.ladle.dev/docs/config#story-filenames',
              children: 'configuration file',
            }),
            ' ',
            'or CLI flag ',
            b.jsx(Ma, { children: '--stories=your-glob' }),
            '.',
          ],
        }),
        b.jsx('p', {
          children: b.jsx(kr, { href: 'https://github.com/tajo/ladle', children: 'GitHub' }),
        }),
        b.jsx('p', { children: b.jsx(kr, { href: 'https://www.ladle.dev', children: 'Docs' }) }),
      ],
    });
var td = { exports: {} };
/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/ var zm;
function LO() {
  return (
    zm ||
      ((zm = 1),
      (function (a) {
        (function () {
          var r = {}.hasOwnProperty;
          function o() {
            for (var y = '', d = 0; d < arguments.length; d++) {
              var m = arguments[d];
              m && (y = f(y, c(m)));
            }
            return y;
          }
          function c(y) {
            if (typeof y == 'string' || typeof y == 'number') return y;
            if (typeof y != 'object') return '';
            if (Array.isArray(y)) return o.apply(null, y);
            if (
              y.toString !== Object.prototype.toString &&
              !y.toString.toString().includes('[native code]')
            )
              return y.toString();
            var d = '';
            for (var m in y) r.call(y, m) && y[m] && (d = f(d, m));
            return d;
          }
          function f(y, d) {
            return d ? (y ? y + ' ' + d : y + d) : y;
          }
          a.exports ? ((o.default = o), (a.exports = o)) : (window.classNames = o);
        })();
      })(td)),
    td.exports
  );
}
var zO = LO();
const ov = Qu(zO);
function Ko() {
  return (
    (Ko = Object.assign
      ? Object.assign.bind()
      : function (a) {
          for (var r = 1; r < arguments.length; r++) {
            var o = arguments[r];
            for (var c in o) ({}).hasOwnProperty.call(o, c) && (a[c] = o[c]);
          }
          return a;
        }),
    Ko.apply(null, arguments)
  );
}
var ja;
(function (a) {
  ((a.Pop = 'POP'), (a.Push = 'PUSH'), (a.Replace = 'REPLACE'));
})(ja || (ja = {}));
var Um = function (a) {
    return a;
  },
  Bm = 'beforeunload',
  UO = 'popstate';
function BO(a) {
  a === void 0 && (a = {});
  var r = a,
    o = r.window,
    c = o === void 0 ? document.defaultView : o,
    f = c.history;
  function y() {
    var Z = c.location,
      K = Z.pathname,
      ce = Z.search,
      he = Z.hash,
      Ee = f.state || {};
    return [
      Ee.idx,
      Um({ pathname: K, search: ce, hash: he, state: Ee.usr || null, key: Ee.key || 'default' }),
    ];
  }
  var d = null;
  function m() {
    if (d) (R.call(d), (d = null));
    else {
      var Z = ja.Pop,
        K = y(),
        ce = K[0],
        he = K[1];
      if (R.length) {
        if (ce != null) {
          var Ee = E - ce;
          Ee &&
            ((d = {
              action: Z,
              location: he,
              retry: function () {
                te(Ee * -1);
              },
            }),
            te(Ee));
        }
      } else B(Z);
    }
  }
  c.addEventListener(UO, m);
  var p = ja.Pop,
    v = y(),
    E = v[0],
    g = v[1],
    A = Hm(),
    R = Hm();
  E == null && ((E = 0), f.replaceState(Ko({}, f.state, { idx: E }), ''));
  function x(Z) {
    return typeof Z == 'string' ? Z : HO(Z);
  }
  function S(Z, K) {
    return (
      K === void 0 && (K = null),
      Um(
        Ko({ pathname: g.pathname, hash: '', search: '' }, typeof Z == 'string' ? FO(Z) : Z, {
          state: K,
          key: kO(),
        }),
      )
    );
  }
  function _(Z, K) {
    return [{ usr: Z.state, key: Z.key, idx: K }, x(Z)];
  }
  function k(Z, K, ce) {
    return !R.length || (R.call({ action: Z, location: K, retry: ce }), !1);
  }
  function B(Z) {
    p = Z;
    var K = y();
    ((E = K[0]), (g = K[1]), A.call({ action: p, location: g }));
  }
  function q(Z, K) {
    var ce = ja.Push,
      he = S(Z, K);
    function Ee() {
      q(Z, K);
    }
    if (k(ce, he, Ee)) {
      var G = _(he, E + 1),
        ae = G[0],
        ue = G[1];
      try {
        f.pushState(ae, '', ue);
      } catch {
        c.location.assign(ue);
      }
      B(ce);
    }
  }
  function W(Z, K) {
    var ce = ja.Replace,
      he = S(Z, K);
    function Ee() {
      W(Z, K);
    }
    if (k(ce, he, Ee)) {
      var G = _(he, E),
        ae = G[0],
        ue = G[1];
      (f.replaceState(ae, '', ue), B(ce));
    }
  }
  function te(Z) {
    f.go(Z);
  }
  var ee = {
    get action() {
      return p;
    },
    get location() {
      return g;
    },
    createHref: x,
    push: q,
    replace: W,
    go: te,
    back: function () {
      te(-1);
    },
    forward: function () {
      te(1);
    },
    listen: function (K) {
      return A.push(K);
    },
    block: function (K) {
      var ce = R.push(K);
      return (
        R.length === 1 && c.addEventListener(Bm, km),
        function () {
          (ce(), R.length || c.removeEventListener(Bm, km));
        }
      );
    },
  };
  return ee;
}
function km(a) {
  (a.preventDefault(), (a.returnValue = ''));
}
function Hm() {
  var a = [];
  return {
    get length() {
      return a.length;
    },
    push: function (o) {
      return (
        a.push(o),
        function () {
          a = a.filter(function (c) {
            return c !== o;
          });
        }
      );
    },
    call: function (o) {
      a.forEach(function (c) {
        return c && c(o);
      });
    },
  };
}
function kO() {
  return Math.random().toString(36).substr(2, 8);
}
function HO(a) {
  var r = a.pathname,
    o = r === void 0 ? '/' : r,
    c = a.search,
    f = c === void 0 ? '' : c,
    y = a.hash,
    d = y === void 0 ? '' : y;
  return (
    f && f !== '?' && (o += f.charAt(0) === '?' ? f : '?' + f),
    d && d !== '#' && (o += d.charAt(0) === '#' ? d : '#' + d),
    o
  );
}
function FO(a) {
  var r = {};
  if (a) {
    var o = a.indexOf('#');
    o >= 0 && ((r.hash = a.substr(o)), (a = a.substr(0, o)));
    var c = a.indexOf('?');
    (c >= 0 && ((r.search = a.substr(c)), (a = a.substr(0, c))), a && (r.pathname = a));
  }
  return r;
}
const Vd = BO(),
  GO = () => {
    Vd.push(Iu({}));
  },
  cv = (a) => {
    Object.keys(a).forEach((r) => {
      const o = a[r],
        c = ge.addons[r] ? ge.addons[r].defaultState : '$$LADLE_unknown';
      o === c && delete a[r];
    });
  },
  nd = (a) => {
    if (!a.controlInitialized) return;
    const r = Kn.parse(location.search),
      o = {};
    Object.keys(r).forEach((f) => {
      f.startsWith('arg-') || (o[f] = r[f]);
    });
    const c = {
      ...o,
      mode: a.mode,
      rtl: a.rtl,
      source: a.source,
      story: a.story,
      theme: a.theme,
      width: a.width,
      control: a.control,
    };
    (cv(c), location.search !== Iu(c) && (Xn(`Updating URL to ${Iu(c)}`), Vd.push(Iu(c))));
  },
  Iu = (a) => {
    cv(a);
    const r = {};
    return (
      Object.keys(a).forEach((o) => {
        o === 'control'
          ? Object.keys(a[o]).forEach((c) => {
              const f = a[o][c];
              if (f.type === Ae.Action) return;
              let y = f.value,
                d = !1;
              y = encodeURI(typeof f.value == 'string' ? f.value : JSON.stringify(f.value));
              try {
                ((d = JSON.stringify(f.value) === JSON.stringify(f.defaultValue)),
                  !d &&
                    JSON.stringify(y) !== JSON.stringify(f.defaultValue) &&
                    (r[`arg-${c}`] = y));
              } catch {}
            })
          : (r[o] = a[o]);
      }),
      `?${Kn.stringify(r)}`
    );
  },
  sv = (a) =>
    a.isExpanded && a.children && a.children.length ? sv(a.children[a.children.length - 1]) : a.id,
  fv = (a, r, o) => {
    for (let c = 0; c < a.length; c++) {
      if (a[c].id === r) return o;
      if (a[c].isExpanded && a[c].children && a[c].children.length) {
        const f = fv(a[c].children, r, a[c].id);
        if (f) return f;
      }
    }
    return null;
  },
  dv = (a, r, o) => {
    for (let c = 0; c < a.length; c++) {
      if (a[c].id === r) return c === 0 ? o : sv(a[c - 1]);
      if (a[c].isExpanded && a[c].children && a[c].children.length) {
        const f = dv(a[c].children, r, a[c].id);
        if (f) return f;
      }
    }
    return null;
  },
  yv = (a, r) => {
    for (let o = 0; o < a.length; o++) {
      if (a[o].id === r) return a[o].children;
      const c = yv(a[o].children, r);
      if (c.length) return c;
    }
    return [];
  },
  pv = (a, r) => (a[0].isLinkable ? a[0] : pv(a[0].children)),
  gv = (a, r) => {
    for (let o = 0; o < a.length; o++) {
      if (a[o].id === r && a[o].isExpanded && a[o].children && a[o].children.length)
        return a[o].children[0].id;
      if (a[o].isExpanded && a[o].children && a[o].children.length) {
        const c = gv(a[o].children, r);
        if (c) return c;
      }
    }
    return null;
  },
  hv = (a, r, o) => {
    for (let c = 0; c < a.length; c++) {
      if (a[c].id === r)
        return a[c].isExpanded && a[c].children && a[c].children.length
          ? a[c].children[0].id
          : a[c + 1]
            ? a[c + 1].id
            : o;
      if (a[c].isExpanded && a[c].children && a[c].children.length) {
        const f = hv(a[c].children, r, a[c + 1] ? a[c + 1].id : o);
        if (f) return f;
      }
    }
    return null;
  },
  mv = (a) => {
    const r = a[a.length - 1];
    return r.isExpanded && r.children && r.children.length ? mv(r.children) : r.id;
  },
  Vu = (a, r) =>
    a.map((o, c) => {
      const f = { ...o };
      return (
        f.id === r.id && (f.isExpanded = !f.isExpanded),
        r.id === '+' && c === 0 && (f.isExpanded = !0),
        r.id === '-' && (f.isExpanded = !1),
        f.children &&
          f.children.length &&
          (f.children = Vu(f.children, f.id === r.id ? { id: f.isExpanded ? '+' : '-' } : r)),
        f
      );
    });
function qO(a, r) {
  let o;
  return function (...c) {
    (o !== void 0 && clearTimeout(o),
      (o = window.setTimeout(() => {
        (a.apply(this, c), (o = void 0));
      }, r)));
  };
}
const YO = ({
    stories: a,
    story: r,
    updateStory: o,
    allExpanded: c,
    searchRef: f,
    setTreeRootRef: y,
    hotkeys: d,
  }) => {
    const m = L.useRef({}),
      [p, v] = L.useState(Ff(a, r, c));
    L.useEffect(() => {
      v(Ff(a, r, c));
    }, [a.join(',')]);
    const [E, g] = L.useState(p.length ? p[0].id : null),
      A = (S) => {
        var _;
        (S && m && m.current[S] && ((_ = m.current[S]) == null || _.focus()),
          g(S || p[0].id),
          !S && f.current.focus());
      },
      R = (S) => {
        S && (o(S), v(Ff(a, S, c)), setTimeout(() => A(S), 1));
      };
    (En(
      ge.hotkeys.nextStory,
      () => {
        const S = a.findIndex((_) => _ === r);
        R(a[S + 1]);
      },
      { preventDefault: !0, enableOnFormTags: !0, enabled: d },
    ),
      En(
        ge.hotkeys.previousStory,
        () => {
          const S = a.findIndex((_) => _ === r);
          R(a[S - 1]);
        },
        { preventDefault: !0, enableOnFormTags: !0, enabled: d },
      ),
      En(
        ge.hotkeys.nextComponent,
        () => {
          const S = a.findIndex((B) => B === r),
            _ = a[S].split('--'),
            k = _[_.length - 2];
          for (let B = S + 1; B < a.length; B++) {
            const q = a[B].split('--');
            if (q[q.length - 2] !== k) {
              R(a[B]);
              return;
            }
          }
        },
        { preventDefault: !0, enableOnFormTags: !0, enabled: d },
      ),
      En(
        ge.hotkeys.previousComponent,
        () => {
          const S = a.findIndex((B) => B === r),
            _ = a[S].split('--'),
            k = _[_.length - 2];
          for (let B = S - 1; B >= 0; B--) {
            const q = a[B].split('--'),
              W = B > 0 ? a[B - 1].split('--') : ['', ''];
            if (q[q.length - 2] !== k && W[W.length - 2] !== q[q.length - 2]) {
              R(a[B]);
              return;
            }
          }
        },
        { preventDefault: !0, enableOnFormTags: !0, enabled: d },
      ));
    const x = (S, _) => {
      if (!(S.metaKey || S.ctrlKey || S.altKey))
        switch (S.key) {
          case 'ArrowRight':
            (S.preventDefault(), S.stopPropagation(), _.isExpanded ? A(gv(p, _.id)) : v(Vu(p, _)));
            break;
          case 'ArrowLeft':
            (S.preventDefault(),
              S.stopPropagation(),
              _.isExpanded ? v(Vu(p, _)) : A(fv(p, _.id, null)));
            break;
          case 'ArrowUp':
            (S.preventDefault(), S.stopPropagation(), A(dv(p, _.id, null)));
            break;
          case 'ArrowDown': {
            (S.preventDefault(), S.stopPropagation());
            const k = hv(p, _.id, null);
            k && A(k);
            break;
          }
          case ' ':
          case 'Enter':
            S.target.href || (S.preventDefault(), S.stopPropagation(), v(Vu(p, _)));
            break;
          case 'Home':
            (S.preventDefault(), S.stopPropagation(), p.length && A(p[0].id));
            break;
          case 'End':
            (S.preventDefault(), S.stopPropagation(), A(mv(p)));
            break;
        }
    };
    return b.jsx('ul', {
      role: 'tree',
      style: { marginInlineStart: '-6px' },
      ref: (S) => y(S),
      children: b.jsx(vv, {
        tree: p,
        fullTree: p,
        story: r,
        updateStory: o,
        onItemClick: (S) => {
          const _ = Vu(p, S),
            k = pv(yv(_, S.id), S.id);
          (k && r !== k.id && k.isExpanded && o(k.id), v(_));
        },
        selectedItemId: E,
        onKeyDownFn: x,
        treeItemRefs: m,
      }),
    });
  },
  vv = ({
    tree: a,
    fullTree: r,
    story: o,
    updateStory: c,
    onItemClick: f,
    onKeyDownFn: y,
    selectedItemId: d,
    treeItemRefs: m,
  }) =>
    b.jsx(L.Fragment, {
      children: a.map((p) =>
        b.jsxs(
          'li',
          {
            onDragStart: (v) => v.preventDefault(),
            onKeyDown: (v) => y(v, p),
            'aria-expanded': p.isExpanded,
            title: p.name,
            tabIndex: p.id === d && !p.isLinkable ? 0 : -1,
            ref: p.isLinkable ? void 0 : (v) => (m.current[p.id] = v),
            role: 'treeitem',
            className: ov({ 'ladle-linkable': p.isLinkable, 'ladle-active': p.id === o }),
            style: p.isLinkable ? {} : { marginTop: '0.5em' },
            children: [
              p.isLinkable
                ? b.jsxs('div', {
                    style: { display: 'flex' },
                    children: [
                      b.jsx(lS, {}),
                      b.jsx('a', {
                        tabIndex: p.id === d ? 0 : -1,
                        ref: (v) => (m.current[p.id] = v),
                        href: Iu({ story: p.id }),
                        onKeyDown: (v) => o !== p.id && y(v, p),
                        onClick: (v) => {
                          !v.ctrlKey && !v.metaKey && (v.preventDefault(), o !== p.id && c(p.id));
                        },
                        children: p.name,
                      }),
                    ],
                  })
                : b.jsxs('div', {
                    style: { display: 'flex', cursor: 'pointer' },
                    title: p.name,
                    onClick: () => f(p),
                    children: [
                      b.jsx(aS, { rotate: !p.isExpanded }),
                      b.jsx('div', {
                        style: {
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                        },
                        children: p.name,
                      }),
                    ],
                  }),
              Object.keys(p.children).length > 0 &&
                p.isExpanded &&
                b.jsx('ul', {
                  role: 'group',
                  children: b.jsx(vv, {
                    tree: p.children,
                    fullTree: r,
                    story: o,
                    updateStory: c,
                    selectedItemId: d,
                    onKeyDownFn: y,
                    onItemClick: f,
                    treeItemRefs: m,
                  }),
                }),
            ],
          },
          p.id,
        ),
      ),
    }),
  bv = 'cbc065',
  xd = `ladle-settings-${bv}`,
  Ev = { appId: bv },
  VO = (a) => {
    const r = localStorage.getItem(xd);
    let o = Ev;
    try {
      r && (o = JSON.parse(r));
    } catch {}
    localStorage.setItem(xd, JSON.stringify({ ...o, ...a }));
  },
  IO = () => {
    const a = localStorage.getItem(xd);
    let r = Ev;
    try {
      a && (r = JSON.parse(a));
    } catch {}
    return r;
  },
  ZO = 240,
  ld = 192,
  ad = 920,
  rd = qO(VO, 250),
  XO = ({ stories: a, story: r, updateStory: o, hotkeys: c, search: f, setSearch: y }) => {
    const [d, m] = L.useState(IO().sidebarWidth || ZO),
      [p, v] = L.useState(!1),
      E = L.useRef(null),
      g = L.useRef(null),
      A = L.useRef(null);
    (L.useEffect(() => {
      window.getComputedStyle(E.current.parentElement).getPropertyValue('flex-direction') ===
        'row-reverse' && document.documentElement.setAttribute('data-reversed', '');
    }, []),
      L.useEffect(() => {
        const _ = (B) => {
            p &&
              m((q) => {
                const W = document.documentElement.hasAttribute('data-reversed')
                  ? q + B.movementX
                  : q - B.movementX;
                return W < ld
                  ? (rd({ sidebarWidth: ld }), ld)
                  : W > ad
                    ? (rd({ sidebarWidth: ad }), ad)
                    : (rd({ sidebarWidth: W }), W);
              });
          },
          k = () => {
            p && ((document.body.style.cursor = 'auto'), v(!1));
          };
        return (
          window.addEventListener('mousemove', _),
          window.addEventListener('mouseup', k),
          () => {
            (window.removeEventListener('mousemove', _), window.removeEventListener('mouseup', k));
          }
        );
      }, [p, v, m, E.current]),
      En(
        ge.hotkeys.search,
        () => {
          var _;
          return (_ = g.current) == null ? void 0 : _.focus();
        },
        { preventDefault: !0, enabled: c },
      ));
    const R = f.toLocaleLowerCase().replace(new RegExp('\\s+', 'g'), '-'),
      x = a.filter((_) => _.includes(R)),
      S = (_) => {
        var k;
        _.key === 'ArrowDown' &&
          (k = A.current) != null &&
          k.firstChild &&
          A.current.firstChild.focus();
      };
    return b.jsxs(b.Fragment, {
      children: [
        b.jsx('div', {
          role: 'separator',
          'aria-orientation': 'vertical',
          ref: E,
          className: ov('ladle-resize-handle', { 'ladle-resize-active': p }),
          onDragStart: (_) => _.preventDefault(),
          onDragEnd: (_) => _.preventDefault(),
          onDrop: (_) => _.preventDefault(),
          onDragOver: (_) => _.preventDefault(),
          onDragEnter: (_) => _.preventDefault(),
          onDragLeave: (_) => _.preventDefault(),
          onMouseDown: (_) => {
            (_.preventDefault(), p || ((document.body.style.cursor = 'col-resize'), v(!0)));
          },
        }),
        b.jsxs('nav', {
          role: 'navigation',
          className: 'ladle-aside',
          style: { minWidth: `${d}px` },
          children: [
            b.jsx('input', {
              placeholder: 'Search',
              'aria-label': 'Search stories',
              value: f,
              ref: g,
              onKeyDown: S,
              onChange: (_) => y(_.target.value),
            }),
            b.jsx(YO, {
              searchRef: g,
              stories: x,
              story: r,
              hotkeys: c,
              updateStory: o,
              allExpanded: f !== '' || ge.expandStoryTree,
              setTreeRootRef: (_) => (A.current = _),
            }),
          ],
        }),
      ],
    });
  },
  QO = (a) => {
    switch (Kn.parse(a).mode) {
      case Ft.Full:
        return Ft.Full;
      case Ft.Preview:
        return Ft.Preview;
      default:
        return ge.addons.mode.defaultState;
    }
  },
  $O = ({ dispatch: a }) => {
    const r = `Open fullscreen mode. Can be toggled by pressing ${ge.hotkeys.fullscreen.join(' or ')}.`;
    return b.jsx('li', {
      children: b.jsxs('button', {
        'aria-label': r,
        title: r,
        onClick: () => a({ type: De.UpdateMode, value: Ft.Preview }),
        type: 'button',
        children: [
          b.jsx(tS, {}),
          b.jsx('span', { className: 'ladle-addon-tooltip', children: r }),
          b.jsx('label', { children: 'Open fullscreen mode' }),
        ],
      }),
    });
  };
var KO = Object.create,
  Id = Object.defineProperty,
  JO = Object.getOwnPropertyDescriptor,
  Sv = Object.getOwnPropertyNames,
  PO = Object.getPrototypeOf,
  WO = Object.prototype.hasOwnProperty,
  Zd = (a, r) =>
    function () {
      return (r || (0, a[Sv(a)[0]])((r = { exports: {} }).exports, r), r.exports);
    },
  eA = (a, r) => {
    for (var o in r) Id(a, o, { get: r[o], enumerable: !0 });
  },
  tA = (a, r, o, c) => {
    if ((r && typeof r == 'object') || typeof r == 'function')
      for (let f of Sv(r))
        !WO.call(a, f) &&
          f !== o &&
          Id(a, f, { get: () => r[f], enumerable: !(c = JO(r, f)) || c.enumerable });
    return a;
  },
  nA = (a, r, o) => (
    (o = a != null ? KO(PO(a)) : {}),
    tA(!a || !a.__esModule ? Id(o, 'default', { value: a, enumerable: !0 }) : o, a)
  ),
  lA = Zd({
    'node_modules/is-object/index.js'(a, r) {
      r.exports = function (c) {
        return typeof c == 'object' && c !== null;
      };
    },
  }),
  aA = Zd({
    'node_modules/is-window/index.js'(a, r) {
      r.exports = function (o) {
        if (o == null) return !1;
        var c = Object(o);
        return c === c.window;
      };
    },
  }),
  rA = Zd({
    'node_modules/is-dom/index.js'(a, r) {
      var o = lA(),
        c = aA();
      function f(y) {
        return !o(y) || !c(window) || typeof window.Node != 'function'
          ? !1
          : typeof y.nodeType == 'number' && typeof y.nodeName == 'string';
      }
      r.exports = f;
    },
  }),
  Jo = {};
eA(Jo, { chromeDark: () => _v, chromeLight: () => Tv });
var _v = {
    BASE_FONT_FAMILY: 'Menlo, monospace',
    BASE_FONT_SIZE: '11px',
    BASE_LINE_HEIGHT: 1.2,
    BASE_BACKGROUND_COLOR: 'rgb(36, 36, 36)',
    BASE_COLOR: 'rgb(213, 213, 213)',
    OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: 10,
    OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 5,
    OBJECT_NAME_COLOR: 'rgb(227, 110, 236)',
    OBJECT_VALUE_NULL_COLOR: 'rgb(127, 127, 127)',
    OBJECT_VALUE_UNDEFINED_COLOR: 'rgb(127, 127, 127)',
    OBJECT_VALUE_REGEXP_COLOR: 'rgb(233, 63, 59)',
    OBJECT_VALUE_STRING_COLOR: 'rgb(233, 63, 59)',
    OBJECT_VALUE_SYMBOL_COLOR: 'rgb(233, 63, 59)',
    OBJECT_VALUE_NUMBER_COLOR: 'hsl(252, 100%, 75%)',
    OBJECT_VALUE_BOOLEAN_COLOR: 'hsl(252, 100%, 75%)',
    OBJECT_VALUE_FUNCTION_PREFIX_COLOR: 'rgb(85, 106, 242)',
    HTML_TAG_COLOR: 'rgb(93, 176, 215)',
    HTML_TAGNAME_COLOR: 'rgb(93, 176, 215)',
    HTML_TAGNAME_TEXT_TRANSFORM: 'lowercase',
    HTML_ATTRIBUTE_NAME_COLOR: 'rgb(155, 187, 220)',
    HTML_ATTRIBUTE_VALUE_COLOR: 'rgb(242, 151, 102)',
    HTML_COMMENT_COLOR: 'rgb(137, 137, 137)',
    HTML_DOCTYPE_COLOR: 'rgb(192, 192, 192)',
    ARROW_COLOR: 'rgb(145, 145, 145)',
    ARROW_MARGIN_RIGHT: 3,
    ARROW_FONT_SIZE: 12,
    ARROW_ANIMATION_DURATION: '0',
    TREENODE_FONT_FAMILY: 'Menlo, monospace',
    TREENODE_FONT_SIZE: '11px',
    TREENODE_LINE_HEIGHT: 1.2,
    TREENODE_PADDING_LEFT: 12,
    TABLE_BORDER_COLOR: 'rgb(85, 85, 85)',
    TABLE_TH_BACKGROUND_COLOR: 'rgb(44, 44, 44)',
    TABLE_TH_HOVER_COLOR: 'rgb(48, 48, 48)',
    TABLE_SORT_ICON_COLOR: 'black',
    TABLE_DATA_BACKGROUND_IMAGE:
      'linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 50%, rgba(51, 139, 255, 0.0980392) 50%, rgba(51, 139, 255, 0.0980392))',
    TABLE_DATA_BACKGROUND_SIZE: '128px 32px',
  },
  Tv = {
    BASE_FONT_FAMILY: 'Menlo, monospace',
    BASE_FONT_SIZE: '11px',
    BASE_LINE_HEIGHT: 1.2,
    BASE_BACKGROUND_COLOR: 'white',
    BASE_COLOR: 'black',
    OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES: 10,
    OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES: 5,
    OBJECT_NAME_COLOR: 'rgb(136, 19, 145)',
    OBJECT_VALUE_NULL_COLOR: 'rgb(128, 128, 128)',
    OBJECT_VALUE_UNDEFINED_COLOR: 'rgb(128, 128, 128)',
    OBJECT_VALUE_REGEXP_COLOR: 'rgb(196, 26, 22)',
    OBJECT_VALUE_STRING_COLOR: 'rgb(196, 26, 22)',
    OBJECT_VALUE_SYMBOL_COLOR: 'rgb(196, 26, 22)',
    OBJECT_VALUE_NUMBER_COLOR: 'rgb(28, 0, 207)',
    OBJECT_VALUE_BOOLEAN_COLOR: 'rgb(28, 0, 207)',
    OBJECT_VALUE_FUNCTION_PREFIX_COLOR: 'rgb(13, 34, 170)',
    HTML_TAG_COLOR: 'rgb(168, 148, 166)',
    HTML_TAGNAME_COLOR: 'rgb(136, 18, 128)',
    HTML_TAGNAME_TEXT_TRANSFORM: 'lowercase',
    HTML_ATTRIBUTE_NAME_COLOR: 'rgb(153, 69, 0)',
    HTML_ATTRIBUTE_VALUE_COLOR: 'rgb(26, 26, 166)',
    HTML_COMMENT_COLOR: 'rgb(35, 110, 37)',
    HTML_DOCTYPE_COLOR: 'rgb(192, 192, 192)',
    ARROW_COLOR: '#6e6e6e',
    ARROW_MARGIN_RIGHT: 3,
    ARROW_FONT_SIZE: 12,
    ARROW_ANIMATION_DURATION: '0',
    TREENODE_FONT_FAMILY: 'Menlo, monospace',
    TREENODE_FONT_SIZE: '11px',
    TREENODE_LINE_HEIGHT: 1.2,
    TREENODE_PADDING_LEFT: 12,
    TABLE_BORDER_COLOR: '#aaa',
    TABLE_TH_BACKGROUND_COLOR: '#eee',
    TABLE_TH_HOVER_COLOR: 'hsla(0, 0%, 90%, 1)',
    TABLE_SORT_ICON_COLOR: '#6e6e6e',
    TABLE_DATA_BACKGROUND_IMAGE:
      'linear-gradient(to bottom, white, white 50%, rgb(234, 243, 255) 50%, rgb(234, 243, 255))',
    TABLE_DATA_BACKGROUND_SIZE: '128px 32px',
  },
  Ov = L.createContext([{}, () => {}]),
  ud = {
    WebkitTouchCallout: 'none',
    WebkitUserSelect: 'none',
    KhtmlUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    OUserSelect: 'none',
    userSelect: 'none',
  },
  Go = (a) => ({
    DOMNodePreview: {
      htmlOpenTag: {
        base: { color: a.HTML_TAG_COLOR },
        tagName: { color: a.HTML_TAGNAME_COLOR, textTransform: a.HTML_TAGNAME_TEXT_TRANSFORM },
        htmlAttributeName: { color: a.HTML_ATTRIBUTE_NAME_COLOR },
        htmlAttributeValue: { color: a.HTML_ATTRIBUTE_VALUE_COLOR },
      },
      htmlCloseTag: {
        base: { color: a.HTML_TAG_COLOR },
        offsetLeft: { marginLeft: -a.TREENODE_PADDING_LEFT },
        tagName: { color: a.HTML_TAGNAME_COLOR, textTransform: a.HTML_TAGNAME_TEXT_TRANSFORM },
      },
      htmlComment: { color: a.HTML_COMMENT_COLOR },
      htmlDoctype: { color: a.HTML_DOCTYPE_COLOR },
    },
    ObjectPreview: {
      objectDescription: { fontStyle: 'italic' },
      preview: { fontStyle: 'italic' },
      arrayMaxProperties: a.OBJECT_PREVIEW_ARRAY_MAX_PROPERTIES,
      objectMaxProperties: a.OBJECT_PREVIEW_OBJECT_MAX_PROPERTIES,
    },
    ObjectName: { base: { color: a.OBJECT_NAME_COLOR }, dimmed: { opacity: 0.6 } },
    ObjectValue: {
      objectValueNull: { color: a.OBJECT_VALUE_NULL_COLOR },
      objectValueUndefined: { color: a.OBJECT_VALUE_UNDEFINED_COLOR },
      objectValueRegExp: { color: a.OBJECT_VALUE_REGEXP_COLOR },
      objectValueString: { color: a.OBJECT_VALUE_STRING_COLOR },
      objectValueSymbol: { color: a.OBJECT_VALUE_SYMBOL_COLOR },
      objectValueNumber: { color: a.OBJECT_VALUE_NUMBER_COLOR },
      objectValueBoolean: { color: a.OBJECT_VALUE_BOOLEAN_COLOR },
      objectValueFunctionPrefix: {
        color: a.OBJECT_VALUE_FUNCTION_PREFIX_COLOR,
        fontStyle: 'italic',
      },
      objectValueFunctionName: { fontStyle: 'italic' },
    },
    TreeView: { treeViewOutline: { padding: 0, margin: 0, listStyleType: 'none' } },
    TreeNode: {
      treeNodeBase: {
        color: a.BASE_COLOR,
        backgroundColor: a.BASE_BACKGROUND_COLOR,
        lineHeight: a.TREENODE_LINE_HEIGHT,
        cursor: 'default',
        boxSizing: 'border-box',
        listStyle: 'none',
        fontFamily: a.TREENODE_FONT_FAMILY,
        fontSize: a.TREENODE_FONT_SIZE,
      },
      treeNodePreviewContainer: {},
      treeNodePlaceholder: {
        whiteSpace: 'pre',
        fontSize: a.ARROW_FONT_SIZE,
        marginRight: a.ARROW_MARGIN_RIGHT,
        ...ud,
      },
      treeNodeArrow: {
        base: {
          color: a.ARROW_COLOR,
          display: 'inline-block',
          fontSize: a.ARROW_FONT_SIZE,
          marginRight: a.ARROW_MARGIN_RIGHT,
          ...(parseFloat(a.ARROW_ANIMATION_DURATION) > 0
            ? { transition: `transform ${a.ARROW_ANIMATION_DURATION} ease 0s` }
            : {}),
          ...ud,
        },
        expanded: {
          WebkitTransform: 'rotateZ(90deg)',
          MozTransform: 'rotateZ(90deg)',
          transform: 'rotateZ(90deg)',
        },
        collapsed: {
          WebkitTransform: 'rotateZ(0deg)',
          MozTransform: 'rotateZ(0deg)',
          transform: 'rotateZ(0deg)',
        },
      },
      treeNodeChildNodesContainer: { margin: 0, paddingLeft: a.TREENODE_PADDING_LEFT },
    },
    TableInspector: {
      base: {
        color: a.BASE_COLOR,
        position: 'relative',
        border: `1px solid ${a.TABLE_BORDER_COLOR}`,
        fontFamily: a.BASE_FONT_FAMILY,
        fontSize: a.BASE_FONT_SIZE,
        lineHeight: '120%',
        boxSizing: 'border-box',
        cursor: 'default',
      },
    },
    TableInspectorHeaderContainer: {
      base: { top: 0, height: '17px', left: 0, right: 0, overflowX: 'hidden' },
      table: {
        tableLayout: 'fixed',
        borderSpacing: 0,
        borderCollapse: 'separate',
        height: '100%',
        width: '100%',
        margin: 0,
      },
    },
    TableInspectorDataContainer: {
      tr: { display: 'table-row' },
      td: {
        boxSizing: 'border-box',
        border: 'none',
        height: '16px',
        verticalAlign: 'top',
        padding: '1px 4px',
        WebkitUserSelect: 'text',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        lineHeight: '14px',
      },
      div: {
        position: 'static',
        top: '17px',
        bottom: 0,
        overflowY: 'overlay',
        transform: 'translateZ(0)',
        left: 0,
        right: 0,
        overflowX: 'hidden',
      },
      table: {
        positon: 'static',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        borderTop: '0 none transparent',
        margin: 0,
        backgroundImage: a.TABLE_DATA_BACKGROUND_IMAGE,
        backgroundSize: a.TABLE_DATA_BACKGROUND_SIZE,
        tableLayout: 'fixed',
        borderSpacing: 0,
        borderCollapse: 'separate',
        width: '100%',
        fontSize: a.BASE_FONT_SIZE,
        lineHeight: '120%',
      },
    },
    TableInspectorTH: {
      base: {
        position: 'relative',
        height: 'auto',
        textAlign: 'left',
        backgroundColor: a.TABLE_TH_BACKGROUND_COLOR,
        borderBottom: `1px solid ${a.TABLE_BORDER_COLOR}`,
        fontWeight: 'normal',
        verticalAlign: 'middle',
        padding: '0 4px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        lineHeight: '14px',
        ':hover': { backgroundColor: a.TABLE_TH_HOVER_COLOR },
      },
      div: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        fontSize: a.BASE_FONT_SIZE,
        lineHeight: '120%',
      },
    },
    TableInspectorLeftBorder: {
      none: { borderLeft: 'none' },
      solid: { borderLeft: `1px solid ${a.TABLE_BORDER_COLOR}` },
    },
    TableInspectorSortIcon: {
      display: 'block',
      marginRight: 3,
      width: 8,
      height: 7,
      marginTop: -7,
      color: a.TABLE_SORT_ICON_COLOR,
      fontSize: 12,
      ...ud,
    },
  }),
  Cd = 'chromeLight',
  Av = L.createContext(Go(Jo[Cd])),
  an = (a) => L.useContext(Av)[a],
  Xd =
    (a) =>
    ({ theme: o = Cd, ...c }) => {
      const f = L.useMemo(() => {
        switch (Object.prototype.toString.call(o)) {
          case '[object String]':
            return Go(Jo[o]);
          case '[object Object]':
            return Go(o);
          default:
            return Go(Jo[Cd]);
        }
      }, [o]);
      return X.createElement(Av.Provider, { value: f }, X.createElement(a, { ...c }));
    },
  uA = ({ expanded: a, styles: r }) =>
    X.createElement('span', { style: { ...r.base, ...(a ? r.expanded : r.collapsed) } }, '▶'),
  iA = L.memo((a) => {
    a = {
      expanded: !0,
      nodeRenderer: ({ name: E }) => X.createElement('span', null, E),
      onClick: () => {},
      shouldShowArrow: !1,
      shouldShowPlaceholder: !0,
      ...a,
    };
    const {
        expanded: r,
        onClick: o,
        children: c,
        nodeRenderer: f,
        title: y,
        shouldShowArrow: d,
        shouldShowPlaceholder: m,
      } = a,
      p = an('TreeNode'),
      v = f;
    return X.createElement(
      'li',
      { 'aria-expanded': r, role: 'treeitem', style: p.treeNodeBase, title: y },
      X.createElement(
        'div',
        { style: p.treeNodePreviewContainer, onClick: o },
        d || L.Children.count(c) > 0
          ? X.createElement(uA, { expanded: r, styles: p.treeNodeArrow })
          : m && X.createElement('span', { style: p.treeNodePlaceholder }, ' '),
        X.createElement(v, { ...a }),
      ),
      X.createElement(
        'ol',
        { role: 'group', style: p.treeNodeChildNodesContainer },
        r ? c : void 0,
      ),
    );
  }),
  Po = '$',
  Fm = '*';
function qo(a, r) {
  return !r(a).next().done;
}
var oA = (a) =>
    Array.from({ length: a }, (r, o) =>
      [Po].concat(Array.from({ length: o }, () => '*')).join('.'),
    ),
  cA = (a, r, o, c, f) => {
    const y = []
        .concat(oA(c))
        .concat(o)
        .filter((m) => typeof m == 'string'),
      d = [];
    return (
      y.forEach((m) => {
        const p = m.split('.'),
          v = (E, g, A) => {
            if (A === p.length) {
              d.push(g);
              return;
            }
            const R = p[A];
            if (A === 0) qo(E, r) && (R === Po || R === Fm) && v(E, Po, A + 1);
            else if (R === Fm)
              for (const { name: x, data: S } of r(E)) qo(S, r) && v(S, `${g}.${x}`, A + 1);
            else {
              const x = E[R];
              qo(x, r) && v(x, `${g}.${R}`, A + 1);
            }
          };
        v(a, '', 0);
      }),
      d.reduce((m, p) => ((m[p] = !0), m), { ...f })
    );
  },
  xv = L.memo((a) => {
    const { data: r, dataIterator: o, path: c, depth: f, nodeRenderer: y } = a,
      [d, m] = L.useContext(Ov),
      p = qo(r, o),
      v = !!d[c],
      E = L.useCallback(() => p && m((g) => ({ ...g, [c]: !v })), [p, m, c, v]);
    return X.createElement(
      iA,
      {
        expanded: v,
        onClick: E,
        shouldShowArrow: p,
        shouldShowPlaceholder: f > 0,
        nodeRenderer: y,
        ...a,
      },
      v
        ? [...o(r)].map(({ name: g, data: A, ...R }) =>
            X.createElement(xv, {
              name: g,
              data: A,
              depth: f + 1,
              path: `${c}.${g}`,
              key: g,
              dataIterator: o,
              nodeRenderer: y,
              ...R,
            }),
          )
        : null,
    );
  }),
  Cv = L.memo(
    ({ name: a, data: r, dataIterator: o, nodeRenderer: c, expandPaths: f, expandLevel: y }) => {
      const d = an('TreeView'),
        m = L.useState({}),
        [, p] = m;
      return (
        L.useLayoutEffect(() => p((v) => cA(r, o, f, y, v)), [r, o, f, y]),
        X.createElement(
          Ov.Provider,
          { value: m },
          X.createElement(
            'ol',
            { role: 'tree', style: d.treeViewOutline },
            X.createElement(xv, {
              name: a,
              data: r,
              dataIterator: o,
              depth: 0,
              path: Po,
              nodeRenderer: c,
            }),
          ),
        )
      );
    },
  ),
  Qd = ({ name: a, dimmed: r = !1, styles: o = {} }) => {
    const c = an('ObjectName'),
      f = { ...c.base, ...(r ? c.dimmed : {}), ...o };
    return X.createElement('span', { style: f }, a);
  },
  Zu = ({ object: a, styles: r }) => {
    const o = an('ObjectValue'),
      c = (f) => ({ ...o[f], ...r });
    switch (typeof a) {
      case 'bigint':
        return X.createElement('span', { style: c('objectValueNumber') }, String(a), 'n');
      case 'number':
        return X.createElement('span', { style: c('objectValueNumber') }, String(a));
      case 'string':
        return X.createElement('span', { style: c('objectValueString') }, '"', a, '"');
      case 'boolean':
        return X.createElement('span', { style: c('objectValueBoolean') }, String(a));
      case 'undefined':
        return X.createElement('span', { style: c('objectValueUndefined') }, 'undefined');
      case 'object':
        return a === null
          ? X.createElement('span', { style: c('objectValueNull') }, 'null')
          : a instanceof Date
            ? X.createElement('span', null, a.toString())
            : a instanceof RegExp
              ? X.createElement('span', { style: c('objectValueRegExp') }, a.toString())
              : Array.isArray(a)
                ? X.createElement('span', null, `Array(${a.length})`)
                : a.constructor
                  ? typeof a.constructor.isBuffer == 'function' && a.constructor.isBuffer(a)
                    ? X.createElement('span', null, `Buffer[${a.length}]`)
                    : X.createElement('span', null, a.constructor.name)
                  : X.createElement('span', null, 'Object');
      case 'function':
        return X.createElement(
          'span',
          null,
          X.createElement('span', { style: c('objectValueFunctionPrefix') }, 'ƒ '),
          X.createElement('span', { style: c('objectValueFunctionName') }, a.name, '()'),
        );
      case 'symbol':
        return X.createElement('span', { style: c('objectValueSymbol') }, a.toString());
      default:
        return X.createElement('span', null);
    }
  },
  wv = Object.prototype.hasOwnProperty,
  sA = Object.prototype.propertyIsEnumerable;
function wd(a, r) {
  const o = Object.getOwnPropertyDescriptor(a, r);
  if (o.get)
    try {
      return o.get();
    } catch {
      return o.get;
    }
  return a[r];
}
function Gm(a, r) {
  return a.length === 0 ? [] : a.slice(1).reduce((o, c) => o.concat([r, c]), [a[0]]);
}
var Rd = ({ data: a }) => {
    const r = an('ObjectPreview'),
      o = a;
    if (typeof o != 'object' || o === null || o instanceof Date || o instanceof RegExp)
      return X.createElement(Zu, { object: o });
    if (Array.isArray(o)) {
      const c = r.arrayMaxProperties,
        f = o.slice(0, c).map((d, m) => X.createElement(Zu, { key: m, object: d }));
      o.length > c && f.push(X.createElement('span', { key: 'ellipsis' }, '…'));
      const y = o.length;
      return X.createElement(
        X.Fragment,
        null,
        X.createElement('span', { style: r.objectDescription }, y === 0 ? '' : `(${y}) `),
        X.createElement('span', { style: r.preview }, '[', Gm(f, ', '), ']'),
      );
    } else {
      const c = r.objectMaxProperties,
        f = [];
      for (const d in o)
        if (wv.call(o, d)) {
          let m;
          f.length === c - 1 &&
            Object.keys(o).length > c &&
            (m = X.createElement('span', { key: 'ellipsis' }, '…'));
          const p = wd(o, d);
          if (
            (f.push(
              X.createElement(
                'span',
                { key: d },
                X.createElement(Qd, { name: d || '""' }),
                ': ',
                X.createElement(Zu, { object: p }),
                m,
              ),
            ),
            m)
          )
            break;
        }
      const y = o.constructor ? o.constructor.name : 'Object';
      return X.createElement(
        X.Fragment,
        null,
        X.createElement('span', { style: r.objectDescription }, y === 'Object' ? '' : `${y} `),
        X.createElement('span', { style: r.preview }, '{', Gm(f, ', '), '}'),
      );
    }
  },
  fA = ({ name: a, data: r }) =>
    typeof a == 'string'
      ? X.createElement(
          'span',
          null,
          X.createElement(Qd, { name: a }),
          X.createElement('span', null, ': '),
          X.createElement(Rd, { data: r }),
        )
      : X.createElement(Rd, { data: r }),
  dA = ({ name: a, data: r, isNonenumerable: o = !1 }) => {
    const c = r;
    return X.createElement(
      'span',
      null,
      typeof a == 'string'
        ? X.createElement(Qd, { name: a, dimmed: o })
        : X.createElement(Rd, { data: a }),
      X.createElement('span', null, ': '),
      X.createElement(Zu, { object: c }),
    );
  },
  yA = (a, r) =>
    function* (c) {
      if (!((typeof c == 'object' && c !== null) || typeof c == 'function')) return;
      const y = Array.isArray(c);
      if (!y && c[Symbol.iterator]) {
        let d = 0;
        for (const m of c) {
          if (Array.isArray(m) && m.length === 2) {
            const [p, v] = m;
            yield { name: p, data: v };
          } else yield { name: d.toString(), data: m };
          d++;
        }
      } else {
        const d = Object.getOwnPropertyNames(c);
        r === !0 && !y ? d.sort() : typeof r == 'function' && d.sort(r);
        for (const m of d)
          if (sA.call(c, m)) {
            const p = wd(c, m);
            yield { name: m || '""', data: p };
          } else if (a) {
            let p;
            try {
              p = wd(c, m);
            } catch {}
            p !== void 0 && (yield { name: m, data: p, isNonenumerable: !0 });
          }
        a &&
          c !== Object.prototype &&
          (yield { name: '__proto__', data: Object.getPrototypeOf(c), isNonenumerable: !0 });
      }
    },
  pA = ({ depth: a, name: r, data: o, isNonenumerable: c }) =>
    a === 0
      ? X.createElement(fA, { name: r, data: o })
      : X.createElement(dA, { name: r, data: o, isNonenumerable: c }),
  gA = ({ showNonenumerable: a = !1, sortObjectKeys: r, nodeRenderer: o, ...c }) => {
    const f = yA(a, r),
      y = o || pA;
    return X.createElement(Cv, { nodeRenderer: y, dataIterator: f, ...c });
  },
  hA = Xd(gA);
function mA(a) {
  if (typeof a == 'object') {
    let r = [];
    if (Array.isArray(a)) {
      const c = a.length;
      r = [...Array(c).keys()];
    } else a !== null && (r = Object.keys(a));
    const o = r.reduce((c, f) => {
      const y = a[f];
      return (
        typeof y == 'object' &&
          y !== null &&
          Object.keys(y).reduce((m, p) => (m.includes(p) || m.push(p), m), c),
        c
      );
    }, []);
    return { rowHeaders: r, colHeaders: o };
  }
}
var vA = ({ rows: a, columns: r, rowsData: o }) => {
    const c = an('TableInspectorDataContainer'),
      f = an('TableInspectorLeftBorder');
    return X.createElement(
      'div',
      { style: c.div },
      X.createElement(
        'table',
        { style: c.table },
        X.createElement('colgroup', null),
        X.createElement(
          'tbody',
          null,
          a.map((y, d) =>
            X.createElement(
              'tr',
              { key: y, style: c.tr },
              X.createElement('td', { style: { ...c.td, ...f.none } }, y),
              r.map((m) => {
                const p = o[d];
                return typeof p == 'object' && p !== null && wv.call(p, m)
                  ? X.createElement(
                      'td',
                      { key: m, style: { ...c.td, ...f.solid } },
                      X.createElement(Zu, { object: p[m] }),
                    )
                  : X.createElement('td', { key: m, style: { ...c.td, ...f.solid } });
              }),
            ),
          ),
        ),
      ),
    );
  },
  bA = (a) =>
    X.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          top: 1,
          right: 0,
          bottom: 1,
          display: 'flex',
          alignItems: 'center',
        },
      },
      a.children,
    ),
  EA = ({ sortAscending: a }) => {
    const r = an('TableInspectorSortIcon'),
      o = a ? '▲' : '▼';
    return X.createElement('div', { style: r }, o);
  },
  qm = ({
    sortAscending: a = !1,
    sorted: r = !1,
    onClick: o = void 0,
    borderStyle: c = {},
    children: f,
    ...y
  }) => {
    const d = an('TableInspectorTH'),
      [m, p] = L.useState(!1),
      v = L.useCallback(() => p(!0), []),
      E = L.useCallback(() => p(!1), []);
    return X.createElement(
      'th',
      {
        ...y,
        style: { ...d.base, ...c, ...(m ? d.base[':hover'] : {}) },
        onMouseEnter: v,
        onMouseLeave: E,
        onClick: o,
      },
      X.createElement('div', { style: d.div }, f),
      r && X.createElement(bA, null, X.createElement(EA, { sortAscending: a })),
    );
  },
  SA = ({
    indexColumnText: a = '(index)',
    columns: r = [],
    sorted: o,
    sortIndexColumn: c,
    sortColumn: f,
    sortAscending: y,
    onTHClick: d,
    onIndexTHClick: m,
  }) => {
    const p = an('TableInspectorHeaderContainer'),
      v = an('TableInspectorLeftBorder');
    return X.createElement(
      'div',
      { style: p.base },
      X.createElement(
        'table',
        { style: p.table },
        X.createElement(
          'tbody',
          null,
          X.createElement(
            'tr',
            null,
            X.createElement(
              qm,
              { borderStyle: v.none, sorted: o && c, sortAscending: y, onClick: m },
              a,
            ),
            r.map((E) =>
              X.createElement(
                qm,
                {
                  borderStyle: v.solid,
                  key: E,
                  sorted: o && f === E,
                  sortAscending: y,
                  onClick: d.bind(null, E),
                },
                E,
              ),
            ),
          ),
        ),
      ),
    );
  },
  _A = ({ data: a, columns: r }) => {
    const o = an('TableInspector'),
      [{ sorted: c, sortIndexColumn: f, sortColumn: y, sortAscending: d }, m] = L.useState({
        sorted: !1,
        sortIndexColumn: !1,
        sortColumn: void 0,
        sortAscending: !1,
      }),
      p = L.useCallback(() => {
        m(({ sortIndexColumn: x, sortAscending: S }) => ({
          sorted: !0,
          sortIndexColumn: !0,
          sortColumn: void 0,
          sortAscending: x ? !S : !0,
        }));
      }, []),
      v = L.useCallback((x) => {
        m(({ sortColumn: S, sortAscending: _ }) => ({
          sorted: !0,
          sortIndexColumn: !1,
          sortColumn: x,
          sortAscending: x === S ? !_ : !0,
        }));
      }, []);
    if (typeof a != 'object' || a === null) return X.createElement('div', null);
    let { rowHeaders: E, colHeaders: g } = mA(a);
    r !== void 0 && (g = r);
    let A = E.map((x) => a[x]),
      R;
    if (
      (y !== void 0
        ? (R = A.map((x, S) => (typeof x == 'object' && x !== null ? [x[y], S] : [void 0, S])))
        : f && (R = E.map((x, S) => [E[S], S])),
      R !== void 0)
    ) {
      const x = (_, k) => (B, q) => {
          const W = _(B),
            te = _(q),
            ee = typeof W,
            Z = typeof te,
            K = (he, Ee) => (he < Ee ? -1 : he > Ee ? 1 : 0);
          let ce;
          if (ee === Z) ce = K(W, te);
          else {
            const he = {
              string: 0,
              number: 1,
              object: 2,
              symbol: 3,
              boolean: 4,
              undefined: 5,
              function: 6,
            };
            ce = K(he[ee], he[Z]);
          }
          return (k || (ce = -ce), ce);
        },
        S = R.sort(x((_) => _[0], d)).map((_) => _[1]);
      ((E = S.map((_) => E[_])), (A = S.map((_) => A[_])));
    }
    return X.createElement(
      'div',
      { style: o.base },
      X.createElement(SA, {
        columns: g,
        sorted: c,
        sortIndexColumn: f,
        sortColumn: y,
        sortAscending: d,
        onTHClick: v,
        onIndexTHClick: p,
      }),
      X.createElement(vA, { rows: E, columns: g, rowsData: A }),
    );
  },
  TA = Xd(_A),
  OA = 80,
  Rv = (a) =>
    a.childNodes.length === 0 ||
    (a.childNodes.length === 1 &&
      a.childNodes[0].nodeType === Node.TEXT_NODE &&
      a.textContent.length < OA),
  AA = ({ tagName: a, attributes: r, styles: o }) =>
    X.createElement(
      'span',
      { style: o.base },
      '<',
      X.createElement('span', { style: o.tagName }, a),
      (() => {
        if (r) {
          const c = [];
          for (let f = 0; f < r.length; f++) {
            const y = r[f];
            c.push(
              X.createElement(
                'span',
                { key: f },
                ' ',
                X.createElement('span', { style: o.htmlAttributeName }, y.name),
                '="',
                X.createElement('span', { style: o.htmlAttributeValue }, y.value),
                '"',
              ),
            );
          }
          return c;
        }
      })(),
      '>',
    ),
  Ym = ({ tagName: a, isChildNode: r = !1, styles: o }) =>
    X.createElement(
      'span',
      { style: Object.assign({}, o.base, r && o.offsetLeft) },
      '</',
      X.createElement('span', { style: o.tagName }, a),
      '>',
    ),
  xA = {
    1: 'ELEMENT_NODE',
    3: 'TEXT_NODE',
    7: 'PROCESSING_INSTRUCTION_NODE',
    8: 'COMMENT_NODE',
    9: 'DOCUMENT_NODE',
    10: 'DOCUMENT_TYPE_NODE',
    11: 'DOCUMENT_FRAGMENT_NODE',
  },
  CA = ({ isCloseTag: a, data: r, expanded: o }) => {
    const c = an('DOMNodePreview');
    if (a)
      return X.createElement(Ym, { styles: c.htmlCloseTag, isChildNode: !0, tagName: r.tagName });
    switch (r.nodeType) {
      case Node.ELEMENT_NODE:
        return X.createElement(
          'span',
          null,
          X.createElement(AA, {
            tagName: r.tagName,
            attributes: r.attributes,
            styles: c.htmlOpenTag,
          }),
          Rv(r) ? r.textContent : !o && '…',
          !o && X.createElement(Ym, { tagName: r.tagName, styles: c.htmlCloseTag }),
        );
      case Node.TEXT_NODE:
        return X.createElement('span', null, r.textContent);
      case Node.CDATA_SECTION_NODE:
        return X.createElement('span', null, '<![CDATA[' + r.textContent + ']]>');
      case Node.COMMENT_NODE:
        return X.createElement('span', { style: c.htmlComment }, '<!--', r.textContent, '-->');
      case Node.PROCESSING_INSTRUCTION_NODE:
        return X.createElement('span', null, r.nodeName);
      case Node.DOCUMENT_TYPE_NODE:
        return X.createElement(
          'span',
          { style: c.htmlDoctype },
          '<!DOCTYPE ',
          r.name,
          r.publicId ? ` PUBLIC "${r.publicId}"` : '',
          !r.publicId && r.systemId ? ' SYSTEM' : '',
          r.systemId ? ` "${r.systemId}"` : '',
          '>',
        );
      case Node.DOCUMENT_NODE:
        return X.createElement('span', null, r.nodeName);
      case Node.DOCUMENT_FRAGMENT_NODE:
        return X.createElement('span', null, r.nodeName);
      default:
        return X.createElement('span', null, xA[r.nodeType]);
    }
  },
  wA = function* (a) {
    if (a && a.childNodes) {
      if (Rv(a)) return;
      for (let o = 0; o < a.childNodes.length; o++) {
        const c = a.childNodes[o];
        (c.nodeType === Node.TEXT_NODE && c.textContent.trim().length === 0) ||
          (yield { name: `${c.tagName}[${o}]`, data: c });
      }
      a.tagName && (yield { name: 'CLOSE_TAG', data: { tagName: a.tagName }, isCloseTag: !0 });
    }
  },
  RA = (a) => X.createElement(Cv, { nodeRenderer: CA, dataIterator: wA, ...a }),
  NA = Xd(RA),
  DA = nA(rA()),
  jA = ({ table: a = !1, data: r, ...o }) =>
    a
      ? X.createElement(TA, { data: r, ...o })
      : (0, DA.default)(r)
        ? X.createElement(NA, { data: r, ...o })
        : X.createElement(hA, { data: r, ...o });
const MA = ({ dispatch: a, globalState: r }) => {
    const [o, c] = L.useState(!1),
      f = 'Log of events triggered by user.';
    return b.jsx('li', {
      children: b.jsxs('button', {
        'aria-label': f,
        title: f,
        onClick: () => c(!0),
        className: o ? 'ladle-active' : '',
        'data-testid': 'addon-action',
        type: 'button',
        children: [
          b.jsx(cS, {}),
          b.jsx('span', { className: 'ladle-addon-tooltip', children: f }),
          b.jsx('label', { children: 'Actions' }),
          r.action.length
            ? b.jsx('div', { className: 'ladle-badge', children: r.action.length })
            : null,
          b.jsxs(Yr, {
            maxWidth: '60em',
            isOpen: o,
            close: () => c(!1),
            label: 'Dialog with a log of events triggered by user.',
            children: [
              r.action.map((y, d) =>
                b.jsx(
                  jA,
                  {
                    table: !1,
                    sortObjectKeys: !0,
                    theme: {
                      ...(r.theme === st.Light ? Tv : _v),
                      BASE_BACKGROUND_COLOR: 'var(--ladle-bg-color-secondary)',
                    },
                    showNonenumerable: !1,
                    name: y.name,
                    data: y.event,
                  },
                  d,
                ),
              ),
              b.jsx('button', {
                onClick: () => {
                  a({ type: De.UpdateAction, clear: !0, value: void 0 });
                },
                type: 'button',
                children: 'Clear actions',
              }),
            ],
          }),
        ],
      }),
    });
  },
  LA = (a) => {
    const r = Kn.parse(a).rtl;
    return r === 'true' ? !0 : r === 'false' ? !1 : ge.addons.rtl.defaultState;
  },
  zA = ({ dispatch: a, globalState: r }) => {
    const o = 'Switch text direction to right to left.',
      c = 'Switch text direction to left to right.';
    return (
      En(ge.hotkeys.rtl, () => a({ type: De.UpdateRtl, value: !r.rtl }), {
        enabled: r.hotkeys && ge.addons.rtl.enabled,
      }),
      b.jsx('li', {
        children: b.jsxs('button', {
          'aria-label': r.rtl ? c : o,
          title: r.rtl ? c : o,
          className: r.rtl ? 'ladle-active' : '',
          onClick: () => a({ type: De.UpdateRtl, value: !r.rtl }),
          type: 'button',
          children: [
            b.jsx(WE, {}),
            b.jsx('span', { className: 'ladle-addon-tooltip', children: r.rtl ? c : o }),
            b.jsx('label', { children: 'Right to left' }),
          ],
        }),
      })
    );
  },
  UA = {
    fullscreen: 'Toggle fullscreen mode',
    search: 'Focus search input in the sidebar',
    nextStory: 'Go to the next story',
    previousStory: 'Go to the previous story',
    nextComponent: 'Go to the next component',
    previousComponent: 'Go to the previous component',
    control: 'Toggle controls addon',
    darkMode: 'Toggle dark mode',
    width: 'Toggle width addon',
    rtl: 'Toggle right-to-left mode',
    a11y: 'Toggle accessibility addon',
    source: 'Toggle story source addon',
  },
  BA = ({ children: a }) => (
    navigator.platform.toLowerCase().includes('mac')
      ? (a = a.replace(/alt/g, '⌥ opt').replace(/meta/g, '⌘ cmd'))
      : navigator.platform.toLowerCase().includes('win') && (a = a.replace(/meta/g, '⊞ win')),
    (a = a.replace(/shift/g, '⇧ shift')),
    (a = a
      .replace(/arrowright/g, '→')
      .replace(/arrowleft/g, '←')
      .replace(/arrowup/g, '↑')
      .replace(/arrowdown/g, '↓')
      .replace(/\+/g, ' ＋ ')),
    b.jsx(Ma, { children: a })
  ),
  kA = ({ globalState: a }) => {
    const [r, o] = L.useState(!1),
      c = 'Get more information about Ladle.';
    return b.jsx('li', {
      children: b.jsxs('button', {
        'aria-label': c,
        title: c,
        onClick: () => o(!0),
        className: r ? 'ladle-active' : '',
        type: 'button',
        children: [
          b.jsx(PE, {}),
          b.jsx('span', { className: 'ladle-addon-tooltip', children: c }),
          b.jsx('label', { children: 'About Ladle' }),
          b.jsxs(Yr, {
            isOpen: r,
            close: () => o(!1),
            label: 'Dialog with information about Ladle.',
            children: [
              b.jsx('h3', { children: 'Hotkeys' }),
              a.hotkeys
                ? b.jsxs(b.Fragment, {
                    children: [
                      b.jsx('ul', {
                        style: { listStyle: 'none', marginLeft: 0, paddingLeft: 0 },
                        children: Object.keys(ge.hotkeys).map((f) =>
                          ge.hotkeys[f].length
                            ? b.jsxs(
                                'li',
                                {
                                  children: [
                                    b.jsx('span', {
                                      style: { display: 'inline-block', width: '200px' },
                                      children: ge.hotkeys[f].map((y, d) =>
                                        b.jsxs(
                                          'span',
                                          {
                                            children: [
                                              b.jsx(BA, { children: y }),
                                              ge.hotkeys[f].length > d + 1 ? ' or ' : '',
                                            ],
                                          },
                                          y,
                                        ),
                                      ),
                                    }),
                                    b.jsx('span', {
                                      style: { display: 'inline-block' },
                                      children: UA[f],
                                    }),
                                  ],
                                },
                                f,
                              )
                            : null,
                        ),
                      }),
                      b.jsxs('p', {
                        children: [
                          'Hotkeys can be disabled through',
                          ' ',
                          b.jsx(Ma, { children: 'Story.meta = { hotkeys: false }' }),
                          '.',
                        ],
                      }),
                    ],
                  })
                : b.jsxs('p', {
                    children: [
                      'Hotkeys are disabled for this story by',
                      ' ',
                      b.jsx(Ma, { children: 'meta.hotkeys = false' }),
                      '.',
                    ],
                  }),
              b.jsxs('p', {
                children: [
                  'Ladle is a modern and fast playground for React components powered by Vite. For more information visit',
                  ' ',
                  b.jsx('a', { href: 'https://www.ladle.dev/', children: 'ladle.dev' }),
                  ' or our',
                  ' ',
                  b.jsx('a', { href: 'https://discord.gg/H6FSHjyW7e', children: 'discord' }),
                  '.',
                ],
              }),
            ],
          }),
        ],
      }),
    });
  },
  HA = async (a, r, o) => {
    const c = await qr(() => import('./empty-module-BIHI7g3E.js'), []);
    try {
      const f = await c.default.run(document.getElementsByTagName('main'));
      (a(f.violations), r(!0));
    } catch {}
  },
  FA = ({ violation: a }) => {
    const [r, o] = L.useState(!1);
    return b.jsxs('li', {
      children: [
        a.help,
        ' (',
        a.nodes.length,
        ').',
        ' ',
        r
          ? b.jsxs(b.Fragment, {
              children: [
                b.jsxs('ul', {
                  children: [
                    b.jsxs('li', { children: ['ID: ', a.id] }),
                    b.jsxs('li', { children: ['Impact: ', a.impact] }),
                    b.jsxs('li', { children: ['Description: ', a.description] }),
                    b.jsx('li', {
                      children: b.jsx('a', { href: a.helpUrl, children: 'Documentation' }),
                    }),
                  ],
                }),
                b.jsx('p', { children: 'Violating nodes:' }),
                b.jsx('ul', {
                  children: a.nodes.map((c) =>
                    b.jsx('li', { children: b.jsx(Ma, { children: c.html }) }, c.html),
                  ),
                }),
                b.jsx('p', {
                  children: b.jsx('a', {
                    href: '#',
                    onClick: () => o(!1),
                    children: 'Hide details',
                  }),
                }),
              ],
            })
          : b.jsx('a', { href: '#', onClick: () => o(!0), children: 'Show details' }),
      ],
    });
  },
  GA = ({ reportFinished: a, violations: r }) =>
    a
      ? r.length === 0
        ? b.jsxs('p', {
            children: [
              'There are no ',
              b.jsx('a', { href: 'https://github.com/dequelabs/axe-core', children: 'axe' }),
              ' ',
              'accessibility violations. Good job!',
            ],
          })
        : b.jsxs(b.Fragment, {
            children: [
              b.jsxs('h3', {
                children: [
                  'There are ',
                  r.length,
                  ' ',
                  b.jsx('a', { href: 'https://github.com/dequelabs/axe-core', children: 'axe' }),
                  ' accessibility violations',
                ],
              }),
              b.jsx('ul', { children: r.map((o) => b.jsx(FA, { violation: o }, o.id)) }),
            ],
          })
      : b.jsx('p', { children: 'Report is loading...' }),
  qA = ({ globalState: a }) => {
    const [r, o] = L.useState(!1),
      [c, f] = L.useState(!1),
      [y, d] = L.useState([]);
    L.useEffect(() => {}, []);
    const m = 'Show accessibility report.',
      p = () => {
        (HA(d, f, null).catch(console.error), setTimeout(() => o(!r), 100));
      };
    return (
      En(ge.hotkeys.a11y, () => (r ? o(!1) : p()), {
        enabled: a.hotkeys && ge.addons.a11y.enabled,
      }),
      b.jsx('li', {
        children: b.jsxs('button', {
          'aria-label': m,
          'data-testid': 'addon-a11y',
          title: m,
          onClick: p,
          className: r ? 'a11y-active' : '',
          type: 'button',
          children: [
            b.jsx(iS, {}),
            b.jsx('span', { className: 'ladle-addon-tooltip', children: m }),
            b.jsx('label', { children: 'Accessibility report' }),
            y.length ? b.jsx('div', { className: 'ladle-badge', children: y.length }) : null,
            b.jsx(Yr, {
              isOpen: r,
              close: () => o(!1),
              label: 'Dialog with the story accessibility report.',
              children: b.jsx(GA, { reportFinished: c, violations: y }),
            }),
          ],
        }),
      })
    );
  },
  YA = (a) => {
    const r = Kn.parse(a).width;
    let o = 0;
    return (
      Object.keys(ge.addons.width.options).forEach((c) => {
        (c === r || parseInt(r, 10) === ge.addons.width.options[c]) &&
          (o = ge.addons.width.options[c]);
      }),
      o !== 0 ? o : ge.addons.width.defaultState
    );
  },
  VA = ({ globalState: a, dispatch: r }) => {
    const o = 'Change the story viewport.',
      [c, f] = L.useState(!1);
    En(ge.hotkeys.width, () => f((p) => !p), { enabled: a.hotkeys && ge.addons.width.enabled });
    const y = Fr[a.story];
    let d = y && y.meta ? y.meta.meta.width : 0,
      m = ge.addons.width.options;
    return (
      Object.keys(m).forEach((p) => {
        p === d && (d = m[p]);
      }),
      d && !Object.values(m).includes(d) && (m = { custom: d, ...m }),
      b.jsx('li', {
        children: b.jsxs('button', {
          'aria-label': o,
          'data-testid': 'addon-width',
          title: o,
          onClick: () => f(!0),
          className: c ? 'width-active' : '',
          type: 'button',
          children: [
            b.jsx(oS, {}),
            b.jsx('span', { className: 'ladle-addon-tooltip', children: o }),
            b.jsx('label', { children: 'Set story width' }),
            b.jsxs(Yr, {
              isOpen: c,
              close: () => f(!1),
              label: 'Dialog with the story width selector.',
              children: [
                b.jsx('p', { children: 'Select story width' }),
                b.jsxs('div', {
                  children: [
                    b.jsx('input', {
                      onChange: () => r({ type: De.UpdateWidth, value: 0 }),
                      type: 'radio',
                      id: 'width-unset',
                      name: 'width',
                      value: 0,
                      checked: a.width === 0,
                    }),
                    b.jsx('label', {
                      htmlFor: 'width-unset',
                      style: { paddingLeft: '8px' },
                      children: 'unset',
                    }),
                  ],
                }),
                Object.keys(m).map((p) =>
                  b.jsxs(
                    'div',
                    {
                      children: [
                        b.jsx('input', {
                          onChange: () => r({ type: De.UpdateWidth, value: m[p] }),
                          type: 'radio',
                          id: `width-${p}`,
                          name: 'width',
                          value: m[p],
                          checked: a.width === m[p],
                        }),
                        b.jsxs('label', {
                          htmlFor: `width-${p}`,
                          style: { paddingLeft: '8px' },
                          children: [m[p], 'px - ', p],
                        }),
                      ],
                    },
                    p,
                  ),
                ),
                b.jsx('p', {}),
              ],
            }),
          ],
        }),
      })
    );
  },
  IA = ({ globalState: a, dispatch: r }) =>
    Object.keys(ge.addons).every((o) => ge.addons[o].enabled === !1)
      ? null
      : b.jsx('header', {
          role: 'banner',
          className: 'ladle-addons',
          children: b.jsxs('ul', {
            children: [
              ge.addons.control.enabled &&
                Object.keys(a.control).length > 0 &&
                b.jsx(K_, { globalState: a, dispatch: r }),
              ge.addons.theme.enabled && b.jsx(fO, { globalState: a, dispatch: r }),
              ge.addons.mode.enabled && b.jsx($O, { globalState: a, dispatch: r }),
              ge.addons.width.enabled && b.jsx(VA, { globalState: a, dispatch: r }),
              ge.addons.rtl.enabled && b.jsx(zA, { globalState: a, dispatch: r }),
              ge.addons.source.enabled && b.jsx(RO, { globalState: a, dispatch: r }),
              ge.addons.a11y.enabled && b.jsx(qA, { globalState: a, dispatch: r }),
              ge.addons.ladle.enabled && b.jsx(kA, { globalState: a, dispatch: r }),
              ge.addons.control.enabled &&
                a.action.length > 0 &&
                b.jsx(MA, { globalState: a, dispatch: r }),
            ],
          }),
        }),
  ZA = (a, r) => {
    switch ((Xn('Action dispatched', r), r.type)) {
      case De.UpdateAll:
        return { ...a, ...r.value };
      case De.UpdateMode:
        return { ...a, mode: r.value };
      case De.UpdateAction: {
        const o = { ...a };
        return (r.clear && (o.action = []), r.value ? { ...a, action: [...o.action, r.value] } : o);
      }
      case De.UpdateRtl:
        return { ...a, rtl: r.value };
      case De.UpdateSource:
        return { ...a, source: r.value };
      case De.UpdateStory:
        return { ...a, story: r.value, control: {}, controlInitialized: !1, width: 0, action: [] };
      case De.UpdateTheme:
        return { ...a, theme: r.value };
      case De.UpdateWidth:
        return { ...a, width: r.value };
      case De.UpdateControl:
        return { ...a, control: r.value, controlInitialized: !0 };
      case De.UpdateControlIntialized:
        return { ...a, controlInitialized: r.value };
      case De.UpdateHotkeys:
        return { ...a, hotkeys: r.value };
      default:
        return a;
    }
  },
  Nd = l0(Object.keys(Fr), ge.storyOrder);
Xn('Stories found', Nd);
const id = (a, r) => ({
    theme: W0(a),
    mode: QO(a),
    story: e0(a, ge.defaultStory),
    rtl: LA(a),
    source: CO(a),
    width: YA(a),
    control: I0(a, r ? r.control : {}),
    action: [],
    controlInitialized: !1,
    hotkeys: !0,
  }),
  XA = () => {
    const a = id(location.search),
      [r, o] = L.useReducer(ZA, a),
      c = L.useRef({}),
      [f, y] = L.useState('');
    let d = '';
    (r.control &&
      Object.keys(r.control).forEach((p) => {
        r.control[p].type === 'background' && (d = r.control[p].value || '');
      }),
      En(
        ge.hotkeys.fullscreen,
        () => {
          o({ type: De.UpdateMode, value: r.mode === Ft.Full ? Ft.Preview : Ft.Full });
        },
        { preventDefault: !0, enabled: r.hotkeys && ge.addons.mode.enabled },
      ),
      L.useEffect(() => {
        document.getElementsByClassName('ladle-background')[0].style.background = d;
      }, [d]),
      L.useEffect(() => {
        c.current = r;
      }),
      L.useEffect(() => {
        window.ladleDispatch = o;
      }, []));
    const m = c.current;
    return (
      L.useEffect(() => {
        var p, v;
        (Xn('Global state update', r),
          xE(location.search) || nd(r),
          nd(r),
          r.story !== m.story && (document.title = `${n0(r.story)} | Ladle`),
          r.theme !== m.theme && document.documentElement.setAttribute('data-theme', r.theme),
          r.rtl !== m.rtl &&
            (r.rtl
              ? document.documentElement.setAttribute('dir', 'rtl')
              : document.documentElement.removeAttribute('dir')),
          r.mode !== m.mode &&
            (document.documentElement.setAttribute('data-mode', r.mode),
            r.mode === Ft.Preview
              ? (p = document.getElementById('ladle-root')) == null || p.removeAttribute('class')
              : (v = document.getElementById('ladle-root')) == null ||
                v.setAttribute('class', 'ladle-wrapper')));
      }, [r]),
      L.useEffect(() => {
        const p = Vd.listen(({ location: v, action: E }) => {
          if (E === ja.Pop) {
            const g = {};
            Object.keys(r.control).forEach((R) => {
              const x = id(v.search, r).control[R];
              g[R] = { ...r.control[R], value: x ? x.value : r.control[R].defaultValue };
            });
            const A = id(v.search, r);
            o({
              type: De.UpdateAll,
              value: { ...A, control: g, controlInitialized: r.story === A.story },
            });
          }
        });
        return () => p();
      }, [r]),
      r.mode === Ft.Preview
        ? b.jsx(nm.Provider, {
            value: { globalState: r, dispatch: o },
            children: b.jsx(Lm, { globalState: r, dispatch: o }),
          })
        : b.jsxs(nm.Provider, {
            value: { globalState: r, dispatch: o },
            children: [
              b.jsx('main', {
                className: 'ladle-main',
                children:
                  Nd.length > 0 ? b.jsx(Lm, { globalState: r, dispatch: o }) : b.jsx(MO, {}),
              }),
              b.jsx(XO, {
                search: f,
                setSearch: y,
                stories: Nd,
                hotkeys: r.hotkeys,
                story: r.story,
                updateStory: (p) => {
                  (GO(),
                    nd({ ...r, story: p, control: {} }),
                    o({ type: De.UpdateStory, value: p }));
                },
              }),
              b.jsx(IA, { globalState: r, dispatch: o }),
            ],
          })
    );
  },
  QA = document.getElementById('ladle-root'),
  $A = hO.createRoot(QA);
$A.render(b.jsx(XA, {}));
export { b as j };
