JSON=null;
(function(D, C, E, F, G, H, I) {
  function J(p) {
    function m(g) {
      return 10 > g ? "0" + g : g;
    }
    function v(g) {
      g = "000" + g;
      return g.substr(g.length - 4);
    }
    function q(g) {
      g = "00000" + g;
      return g.substr(g.length - 6);
    }
    var u = p.getUTCFullYear();
    return (0 >= u ? "-" + q(-u) : 1e4 <= u ? "+" + q(u) : v(u)) + "-" + m(p.getUTCMonth() + 1) + "-" + m(p.getUTCDate()) + "T" + m(p.getUTCHours()) + ":" + m(p.getUTCMinutes()) + ":" + m(p.getUTCSeconds()) + "." + function(g) {
      g = "00" + g;
      return g.substr(g.length - 3);
    }(p.getUTCMilliseconds()) + "Z";
  }
  function K(p, m, v) {
    function q(l) {
      for (var n = {"\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, e = 0, d = l.length, c, b, x = ['"'], a = 0; e < d; ++e) {
        c = l.charAt(e);
        if (n[c]) {
          c = n[c];
        } else {
          if (b = c.charCodeAt(0), 92 === b || 34 === b || 31 > b || 126 < b && 160 > b || 173 === b || 1535 < b && 1541 > b || 6068 === b || 6069 === b || 8203 < b && 8208 > b || 8231 < b && 8240 > b || 8287 < b && 8304 > b || 65279 === b || 65519 < b && 65536 > b) {
            c = "0000" + b.toString(16), c = "\\u" + c.substr(c.length - 4);
          }
        }
        x[++a] = c;
      }
      return x.join("") + '"';
    }
    function u(l, n, e, d, c) {
      var b = d, x = -1, a = n[l];
      if (0 === a) {
        return "0";
      }
      if ("" === a) {
        return '""';
      }
      if (null == a) {
        return "null";
      }
      if (a && "object" === typeof a) {
        var r = a.constructor;
        if (r === H) {
          return g(+a) ? '"' + J(a) + '"' : "null";
        }
        if (r === E) {
          return q("" + a);
        }
        if (r === F) {
          return g(a) ? "" + a : "null";
        }
        if (r === G) {
          return "" + a;
        }
      }
      e && e.constructor === D && (a = e.apply(n, [l, a]));
      switch(typeof a) {
        case "string":
          return q(a);
        case "number":
          return g(a) ? "" + a : "null";
        case "boolean":
          return "" + a;
        case "object":
          if (a) {
            if (-1 === h.indexOf(a)) {
              h.push(a);
              var f = h.length;
            } else {
              t = !0;
              break;
            }
            b += c;
            var w = [];
            if (a && a.constructor === C) {
              l = 0;
              for (r = a.length; l < r; ++l) {
                w[l] = u(l, a, e, b, c);
                if (t) {
                  return;
                }
                h.length = f;
              }
              return "[" + (0 === r ? "" : b ? "\n" + b + w.join(",\n" + b) + "\n" + d : w.join(",")) + "]";
            }
            if (e && e.constructor === C) {
              for (l = 0, r = e.length; l < r; ++l) {
                var y = e[l];
                if (y === "" + y) {
                  n = u(y, a, e, b, c);
                  if (t) {
                    return;
                  }
                  h.length = f;
                  n && (w[++x] = q(y) + (b ? ": " : ":") + n);
                }
              }
            } else {
              for (y in a) {
                n = u(y, a, e, b, c);
                if (t) {
                  return;
                }
                h.length = f;
                n && (w[++x] = q(y) + (b ? ": " : ":") + n);
              }
            }
            return "{" + (0 > x ? "" : b ? "\n" + b + w.join(",\n" + b) + "\n" + d : w.join(",")) + "}";
          }
        default:
          return "null";
      }
    }
    var g = I, B, A = "", h = [], t = !1;
    if (v === +v) {
      for (B = 0; B < v; ++B) {
        A += " ";
      }
    } else {
      v === "" + v && (A = v);
    }
    if (!m || m && m.constructor === D || m && m.constructor === C) {
      return u("_", {_:p}, m, "", A);
    }
  }
  function L(p, m) {
    function v(t, l, n) {
      var e = l[n], d;
      if (e && e.constructor === C) {
        var c = 0;
        for (d = e.length; c < d; ++c) {
          var b = v(t, e, c);
          void 0 !== b ? e[c] = b : delete e[c];
        }
      } else if (e && "object" === typeof e) {
        for (c in e) {
          b = v(t, e, c), void 0 !== b ? e[c] = b : delete e[c];
        }
      }
      return t.apply(l, [n, e]);
    }
    var q = 0, u, g = [], B = -1;
    for (u = p.length; q < u; ++q) {
      var A = p.charAt(q), h = A.charCodeAt(0);
      if (173 === h || 1535 < h && 1541 > h || 1807 === h || 6068 === h || 6069 === h || 8203 < h && 8208 > h || 8231 < h && 8240 > h || 8287 < h && 8304 > h || 65279 === h || 65520 <= h && 65535 >= h) {
        A = "\\u" + ("0000" + h.toString(16)).slice(-4);
      }
      g[++B] = A;
    }
    p = g.join("");
    if (function(t) {
      function l(M) {
        return [!0, !0, !0, !0, !0, !0, !0, !0, !0, !0][M];
      }
      for (var n = {" ":!0, "\b":!0, "\t":!0, "\n":!0, "\r":!0, "\\":!0}, e = [], d = 0, c = 0, b = t.length, x = !1, a = !1, r, f, w, y, z, k; c < b; ++c) {
        if (y = w, w = f, f = t.charAt(c), !n[f] || a && "\\" === f) {
          if (32 > f.charCodeAt(0)) {
            return !1;
          }
          z = N[d];
          switch(d) {
            case 1:
            case 4:
            case 5:
            case 7:
            case 9:
            case 14:
              d = z[f] || 19;
              break;
            case 2:
            case 10:
            case 15:
            case 6:
              if (l(f) && (a || "\\" === y && "x" === w)) {
                return !1;
              }
              d = !a && z[f] || d;
              break;
            case 0:
            case 8:
            case 12:
            case 13:
              d = 19;
              if (z[f]) {
                d = z[f];
              } else if (l(f)) {
                d = z.h, r = !1, k = "0" === f ? 16 : 0;
              } else if ("-" === f) {
                d = z.h, r = !1, k = 32;
              } else {
                a = t.substr(c, 4);
                if ("true" === a || "null" === a) {
                  c += 3, d = z.g;
                }
                "false" === t.substr(c, 5) && (c += 4, d = z.g);
              }
              break;
            case 3:
            case 11:
            case 16:
              if (!r) {
                if (l(f)) {
                  k & 1 && (k |= 4);
                  k & 2 && (k |= 8);
                  if (k & 16) {
                    return !1;
                  }
                  k & 32 && (k -= "0" === f ? 16 : 32);
                  break;
                } else if ("." === f) {
                  if (k & 3) {
                    return !1;
                  }
                  k & 16 && (k -= 16);
                  k |= 1;
                  break;
                } else if ("e" === f || "E" === f) {
                  if (k & 16 && (k -= 16), 0 === (k & 2)) {
                    a = t.substr(c, 2);
                    a !== f + "+" && a !== f + "-" || ++c;
                    k |= 2;
                    break;
                  }
                }
              }
              d = (0 === k || 1 !== (k & 5) && 2 !== (k & 10)) && z[f] || 19;
          }
          switch(d) {
            case 4:
            case 12:
              e.push(x);
              x = 12 === d;
              break;
            case 17:
            case 18:
              d = 1 < e.length ? (x = e.pop()) ? 14 : 9 : 1;
              break;
            case 19:
              return !1;
          }
          a = !1;
        } else {
          if (a = "\\" === f, 3 === d || 16 === d || 11 === d) {
            r = !0;
          } else if ((2 === d || 15 === d || 10 === d || 6 === d) && 32 > f.charCodeAt(0)) {
            return !1;
          }
        }
      }
      return 1 === d || 3 === d && (0 === k || 1 !== (k & 5) && 2 !== (k & 10));
    }(p)) {
      return q = eval("(" + p + ")"), m && m.constructor === D ? v(m, {_:q}, "_") : q;
    }
  }
  var N = [{"{":4, "[":12, '"':2, g:1, h:3}, {}, {'"':1}, {}, {'"':6, "}":17}, {'"':6}, {'"':7}, {":":8}, {"{":4, "[":12, '"':10, g:9, h:11}, {",":5, "}":17}, {'"':9}, {",":5, "}":17}, {"{":4, "[":12, '"':15, "]":18, g:14, h:16}, {"{":4, "[":12, '"':15, g:14, h:16}, {",":13, "]":18}, {'"':14}, {",":13, "]":18}];
  JSON = JSON || {stringify:K, parse:L};
})(Function, Array, String, Number, Boolean, Date, isFinite);

;module.exports=JSON;
