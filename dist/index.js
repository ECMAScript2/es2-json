JSON=null;
(function(Function, Array, String, Number, Boolean, Date){
function C(w, u, v) {
  function p(g) {
    return 10 > g ? "0" + g : g;
  }
  function x(g) {
    for (var d = {"\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, b = 0, e = g.length, h, c, f = ['"'], r = 0; b < e; ++b) {
      h = g.charAt(b);
      if (d[h]) {
        h = d[h];
      } else {
        if (c = h.charCodeAt(0), 92 === c || 34 === c || 31 > c || 126 < c && 160 > c || 173 === c || 1535 < c && 1541 > c || 6068 === c || 6069 === c || 8203 < c && 8208 > c || 8231 < c && 8240 > c || 8287 < c && 8304 > c || 65279 === c || 65519 < c && 65536 > c) {
          h = "0000" + c.toString(16), h = "\\u" + h.substr(h.length - 4);
        }
      }
      f[++r] = h;
    }
    return f.join("") + '"';
  }
  function y(g, d, b, e, h) {
    var c, f = e, r = -1, a = d[g];
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
          return b = a.getUTCFullYear(), B(+a) ? (0 >= b || 1E4 <= b ? (e = "00000" + (0 > b ? -b : b), b = (0 > b ? "-" : "+") + e.substr(e.length - 6)) : (b = "000" + b, b = b.substr(b.length - 4)), b = '"' + b + "-" + p(a.getUTCMonth() + 1) + "-" + p(a.getUTCDate()) + "T" + p(a.getUTCHours()) + ":" + p(a.getUTCMinutes()) + ":" + p(a.getUTCSeconds()) + ".", a = a.getUTCMilliseconds(), a = "00" + a, a = b + a.substr(a.length - 3) + 'Z"') : a = "null", a;
        case String:
          return x("" + a);
        case Number:
          return B(a) ? "" + a : "null";
        case Boolean:
          return "" + a;
      }
    }
    "function" === typeof b && (a = b.apply(d, [g, a]));
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
        if (-1 === n.indexOf(a)) {
          n.push(a);
          var z = n.length;
          f += h;
          var t = [];
          if (a.pop === [].pop) {
            g = 0;
            for (c = a.length; g < c; ++g) {
              t[g] = y(g, a, b, f, h) || "null";
              if (q) {
                return;
              }
              n.length = z;
            }
            return 0 === c ? "[]" : f ? "[\n" + f + t.join(",\n" + f) + "\n" + e + "]" : "[" + t.join(",") + "]";
          }
          if (b && b.pop === [].pop) {
            for (g = 0, c = b.length; g < c; ++g) {
              var m = b[g];
              if ("string" === typeof m) {
                d = y(m, a, b, f, h);
                if (q) {
                  return;
                }
                n.length = z;
                d && (t[++r] = x(m) + (f ? ": " : ":") + d);
              }
            }
          } else {
            for (m in a) {
              d = y(m, a, b, f, h);
              if (q) {
                return;
              }
              n.length = z;
              d && (t[++r] = x(m) + (f ? ": " : ":") + d);
            }
          }
          return 0 > r ? "{}" : f ? "{\n" + f + t.join(",\n" + f) + "\n" + e + "}" : "{" + t.join(",") + "}";
        }
        q = !0;
    }
  }
  var B = isFinite, A, l = "", n = [], q = !1;
  if ("number" === typeof v) {
    for (A = 0; A < v; ++A) {
      l += " ";
    }
  } else {
    "string" === typeof v && (l = v);
  }
  if (!u || "function" === typeof u || u.pop === [].pop) {
    return y("_", {_:w}, u, "", l);
  }
}
;var D = [{"{":4, "[":12, '"':2, g:1, h:3}, {}, {'"':1}, {}, {'"':6, "}":17}, {'"':6}, {'"':7}, {":":8}, {"{":4, "[":12, '"':10, g:9, h:11}, {",":5, "}":17}, {'"':9}, {",":5, "}":17}, {"{":4, "[":12, '"':15, "]":18, g:14, h:16}, {"{":4, "[":12, '"':15, g:14, h:16}, {",":13, "]":18}, {'"':14}, {",":13, "]":18}];
function E(w, u) {
  function v(n, q, g) {
    var d = q[g], b;
    if (d && d.constructor === Array) {
      var e = 0;
      for (b = d.length; e < b; ++e) {
        var h = v(n, d, e);
        void 0 !== h ? d[e] = h : delete d[e];
      }
    } else if (d && "object" === typeof d) {
      for (e in d) {
        h = v(n, d, e), void 0 !== h ? d[e] = h : delete d[e];
      }
    }
    return n.apply(q, [g, d]);
  }
  var p = 0, x, y = [], B = -1;
  for (x = w.length; p < x; ++p) {
    var A = w.charAt(p);
    var l = A.charCodeAt(0);
    if (173 === l || 1535 < l && 1541 > l || 1807 === l || 6068 === l || 6069 === l || 8203 < l && 8208 > l || 8231 < l && 8240 > l || 8287 < l && 8304 > l || 65279 === l || 65520 <= l && 65535 >= l) {
      A = "\\u" + ("0000" + l.toString(16)).slice(-4);
    }
    y[++B] = A;
  }
  w = y.join("");
  if (function(n) {
    function q(F) {
      return [!0, !0, !0, !0, !0, !0, !0, !0, !0, !0][F];
    }
    for (var g = {" ":!0, "\b":!0, "\t":!0, "\n":!0, "\r":!0, "\\":!0}, d = [], b = 0, e = 0, h = n.length, c = !1, f = !1, r, a, z, t, m, k; e < h; ++e) {
      if (t = z, z = a, a = n.charAt(e), !g[a] || f && "\\" === a) {
        if (32 > a.charCodeAt(0)) {
          return !1;
        }
        m = D[b];
        switch(b) {
          case 1:
          case 4:
          case 5:
          case 7:
          case 9:
          case 14:
            b = m[a] || 19;
            break;
          case 2:
          case 10:
          case 15:
          case 6:
            if (q(a) && (f || "\\" === t && "x" === z)) {
              return !1;
            }
            b = !f && m[a] || b;
            break;
          case 0:
          case 8:
          case 12:
          case 13:
            b = 19;
            if (m[a]) {
              b = m[a];
            } else if (q(a)) {
              b = m.h, r = !1, k = "0" === a ? 16 : 0;
            } else if ("-" === a) {
              b = m.h, r = !1, k = 32;
            } else {
              f = n.substr(e, 4);
              if ("true" === f || "null" === f) {
                e += 3, b = m.g;
              }
              "false" === n.substr(e, 5) && (e += 4, b = m.g);
            }
            break;
          case 3:
          case 11:
          case 16:
            if (!r) {
              if (q(a)) {
                k & 1 && (k |= 4);
                k & 2 && (k |= 8);
                if (k & 16) {
                  return !1;
                }
                k & 32 && (k -= "0" === a ? 16 : 32);
                break;
              } else if ("." === a) {
                if (k & 3) {
                  return !1;
                }
                k & 16 && (k -= 16);
                k |= 1;
                break;
              } else if ("e" === a || "E" === a) {
                if (k & 16 && (k -= 16), 0 === (k & 2)) {
                  f = n.substr(e, 2);
                  f !== a + "+" && f !== a + "-" || ++e;
                  k |= 2;
                  break;
                }
              }
            }
            b = (0 === k || 1 !== (k & 5) && 2 !== (k & 10)) && m[a] || 19;
        }
        switch(b) {
          case 4:
          case 12:
            d.push(c);
            c = 12 === b;
            break;
          case 17:
          case 18:
            b = 1 < d.length ? (c = d.pop()) ? 14 : 9 : 1;
            break;
          case 19:
            return !1;
        }
        f = !1;
      } else {
        if (f = "\\" === a, 3 === b || 16 === b || 11 === b) {
          r = !0;
        } else if ((2 === b || 15 === b || 10 === b || 6 === b) && 32 > a.charCodeAt(0)) {
          return !1;
        }
      }
    }
    return 1 === b || 3 === b && (0 === k || 1 !== (k & 5) && 2 !== (k & 10));
  }(w)) {
    return p = eval("(" + w + ")"), u && u.constructor === Function ? v(u, {_:p}, "_") : p;
  }
}
;JSON = JSON || {stringify:C, parse:E};

})(Function, Array, String, Number, Boolean, Date);
;module.exports=JSON;
