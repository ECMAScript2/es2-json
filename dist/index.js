JSON=null;
(function(Function, Array, String, Number, Boolean, Date){
function D(v, w, u) {
  function q(g) {
    return 10 > g ? "0" + g : g;
  }
  function x(g) {
    for (var f = {"\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, c = 0, b = g.length, d, e, l = ['"'], m = 0; c < b; ++c) {
      d = g.charAt(c);
      if (f[d]) {
        d = f[d];
      } else {
        if (e = d.charCodeAt(0), 92 === e || 34 === e || 31 > e || 126 < e && 160 > e || 173 === e || 1535 < e && 1541 > e || 6068 === e || 6069 === e || 8203 < e && 8208 > e || 8231 < e && 8240 > e || 8287 < e && 8304 > e || 65279 === e || 65519 < e && 65536 > e) {
          d = "0000" + e.toString(16), d = "\\u" + d.substr(d.length - 4);
        }
      }
      l[++m] = d;
    }
    return l.join("") + '"';
  }
  function y(g, f, c, b, d) {
    var e, l = b, m = -1, a = f[g];
    if (0 === a) {
      return "0";
    }
    if ("" === a) {
      return '""';
    }
    if (null == a) {
      return "null";
    }
    if ("object" === typeof a) {
      switch(a.constructor) {
        case Date:
          return c = a.getUTCFullYear(), B(+a) ? (0 >= c || 1E4 <= c ? (b = "00000" + (0 > c ? -c : c), c = (0 > c ? "-" : "+") + b.substr(b.length - 6)) : (c = "000" + c, c = c.substr(c.length - 4)), c = '"' + c + "-" + q(a.getUTCMonth() + 1) + "-" + q(a.getUTCDate()) + "T" + q(a.getUTCHours()) + ":" + q(a.getUTCMinutes()) + ":" + q(a.getUTCSeconds()) + ".", a = a.getUTCMilliseconds(), a = "00" + a, a = c + a.substr(a.length - 3) + 'Z"') : a = "null", a;
        case String:
          return x("" + a);
        case Number:
          return B(a) ? "" + a : "null";
        case Boolean:
          return "" + a;
      }
    }
    "function" === typeof c && (a = c.apply(f, [g, a]));
    switch(typeof a) {
      case "string":
        return x(a);
      case "number":
        return B(a) ? "" + a : "null";
      case "boolean":
        return "" + a;
      case "object":
        if (!a) {
          return "null";
        }
        if (-1 === p.indexOf(a)) {
          p.push(a);
          var z = p.length;
          l += d;
          var t = [];
          if (a.pop === [].pop) {
            g = 0;
            for (e = a.length; g < e; ++g) {
              t[g] = y(g, a, c, l, d) || "null";
              if (r) {
                return;
              }
              p.length = z;
            }
            return 0 === e ? "[]" : l ? "[\n" + l + t.join(",\n" + l) + "\n" + b + "]" : "[" + t.join(",") + "]";
          }
          if (c && c.pop === [].pop) {
            for (g = 0, e = c.length; g < e; ++g) {
              var n = c[g];
              if ("string" === typeof n) {
                f = y(n, a, c, l, d);
                if (r) {
                  return;
                }
                p.length = z;
                f && (t[++m] = x(n) + (l ? ": " : ":") + f);
              }
            }
          } else {
            for (n in a) {
              f = y(n, a, c, l, d);
              if (r) {
                return;
              }
              p.length = z;
              f && (t[++m] = x(n) + (l ? ": " : ":") + f);
            }
          }
          return 0 > m ? "{}" : l ? "{\n" + l + t.join(",\n" + l) + "\n" + b + "}" : "{" + t.join(",") + "}";
        }
        r = !0;
    }
  }
  var B = isFinite, A, k = "", p = [], r = !1;
  if ("number" === typeof u) {
    for (A = 0; A < u; ++A) {
      k += " ";
    }
  } else {
    "string" === typeof u && (k = u);
  }
  if (!w || "function" === typeof w || w.pop === [].pop) {
    return y("_", {_:v}, w, "", k);
  }
}
;function E(v, w) {
  function u(p, r, g) {
    var f = r[g], c;
    if (f && f.constructor === Array) {
      var b = 0;
      for (c = f.length; b < c; ++b) {
        var d = u(p, f, b);
        void 0 !== d ? f[b] = d : delete f[b];
      }
    } else if (f && "object" === typeof f) {
      for (b in f) {
        d = u(p, f, b), void 0 !== d ? f[b] = d : delete f[b];
      }
    }
    return p.apply(r, [g, f]);
  }
  var q = 0, x, y = [], B = -1;
  for (x = v.length; q < x; ++q) {
    var A = v.charAt(q);
    var k = A.charCodeAt(0);
    if (173 === k || 1535 < k && 1541 > k || 1807 === k || 6068 === k || 6069 === k || 8203 < k && 8208 > k || 8231 < k && 8240 > k || 8287 < k && 8304 > k || 65279 === k || 65520 <= k && 65535 >= k) {
      A = "\\u" + ("0000" + k.toString(16)).slice(-4);
    }
    y[++B] = A;
  }
  v = y.join("");
  if (function(p) {
    function r(F) {
      return [!0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0][F];
    }
    for (var g = [{"{":4, "[":12, '"':2, g:1, h:3}, {}, {'"':1}, {}, {'"':6, "}":17}, {'"':6}, {'"':7}, {":":8}, {"{":4, "[":12, '"':10, g:9, h:11}, {",":5, "}":17}, {'"':9}, {",":5, "}":17}, {"{":4, "[":12, '"':15, "]":18, g:14, h:16}, {"{":4, "[":12, '"':15, g:14, h:16}, {",":13, "]":18}, {'"':14}, {",":13, "]":18}], f = {" ":!0, "\b":!0, "\t":!0, "\n":!0, "\r":!0, "\\":!0}, c = [], b = 0, d = 0, e = p.length, l = !1, m = !1, a, z, t, n, C, h; d < e; ++d) {
      if (t = z, z = a, a = p.charAt(d), !f[a] || m && "\\" === a) {
        if (32 > a.charCodeAt(0)) {
          return !1;
        }
        n = g[b];
        switch(b) {
          case 1:
          case 4:
          case 5:
          case 7:
          case 9:
          case 14:
            b = n[a] || 19;
            break;
          case 2:
          case 10:
          case 15:
          case 6:
            if (r(a) && (m || "\\" === t && "x" === z)) {
              return !1;
            }
            b = !m && n[a] || b;
            break;
          case 0:
          case 8:
          case 12:
          case 13:
            b = 19;
            if (n[a]) {
              b = n[a];
            } else if (r(a)) {
              b = n.h, C = !1, h = "0" === a ? 16 : 0;
            } else if ("-" === a) {
              b = n.h, C = !1, h = 32;
            } else {
              m = p.substr(d, 4);
              if ("true" === m || "null" === m) {
                d += 3, b = n.g;
              }
              "false" === p.substr(d, 5) && (d += 4, b = n.g);
            }
            break;
          case 3:
          case 11:
          case 16:
            if (!C) {
              if (r(a)) {
                h & 1 && (h |= 4);
                h & 2 && (h |= 8);
                if (h & 16) {
                  return !1;
                }
                h & 32 && (h -= "0" === a ? 16 : 32);
                break;
              } else if ("." === a) {
                if (h & 3) {
                  return !1;
                }
                h & 16 && (h -= 16);
                h |= 1;
                break;
              } else if ("e" === a || "E" === a) {
                if (h & 16 && (h -= 16), 0 === (h & 2)) {
                  m = p.substr(d, 2);
                  m !== a + "+" && m !== a + "-" || ++d;
                  h |= 2;
                  break;
                }
              }
            }
            b = 0 === h || 1 !== (h & 5) && 2 !== (h & 10) ? n[a] || 19 : 19;
        }
        switch(b) {
          case 4:
          case 12:
            c.push(l);
            l = 12 === b;
            break;
          case 17:
          case 18:
            b = 1 < c.length ? (l = c.pop()) ? 14 : 9 : 1;
            break;
          case 19:
            return !1;
        }
        m = !1;
      } else {
        m = "\\" === a;
        if (3 === b || 16 === b || 11 === b) {
          C = !0;
        }
        if ((2 === b || 15 === b || 10 === b || 6 === b) && 32 > a.charCodeAt(0)) {
          return !1;
        }
      }
    }
    return 1 === b || 3 === b && (0 === h || 1 !== (h & 5) && 2 !== (h & 10));
  }(v)) {
    return q = eval("(" + v + ")"), "function" === typeof w ? u(w, {_:q}, "_") : q;
  }
}
;JSON = JSON || {stringify:D, parse:E};

})(Function, Array, String, Number, Boolean, Date);
;module.exports=JSON;
