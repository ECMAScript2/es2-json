JSON=null;
(function(Function, Array, String, Number, Boolean, Date){
function D(u, v, w) {
  function q(e) {
    return 10 > e ? "0" + e : e;
  }
  function x(e) {
    for (var l = {"\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, b = 0, c = e.length, g, d, k = ['"'], m = 0; b < c; ++b) {
      g = e.charAt(b);
      d = g.charCodeAt(0);
      if (l[g]) {
        g = l[g];
      } else if (92 === d || 34 === d || 31 > d || 126 < d && 160 > d || 173 === d || 1535 < d && 1541 > d || 6068 === d || 6069 === d || 8203 < d && 8208 > d || 8231 < d && 8240 > d || 8287 < d && 8304 > d || 65279 === d || 65519 < d && 65536 > d) {
        g = "\\u" + ("0000" + d.toString(16)).slice(-4);
      }
      k[++m] = g;
    }
    return k.join("") + '"';
  }
  function y(e, l, b, c, g) {
    var d, k = c, m = -1, a = l[e];
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
          return b = a.getUTCFullYear(), B(+a) ? (0 >= b || 1E4 <= b ? (c = "00000" + (0 > b ? -b : b), b = (0 > b ? "-" : "+") + c.substr(c.length - 6)) : (b = "000" + b, b = b.substr(b.length - 4)), b = '"' + b + "-" + q(a.getUTCMonth() + 1) + "-" + q(a.getUTCDate()) + "T" + q(a.getUTCHours()) + ":" + q(a.getUTCMinutes()) + ":" + q(a.getUTCSeconds()) + ".", a = a.getUTCMilliseconds(), a = "00" + a, a = b + a.substr(a.length - 3) + 'Z"') : a = "null", a;
        case String:
          return x("" + a);
        case Number:
          return B(a) ? "" + a : "null";
        case Boolean:
          return "" + a;
      }
    }
    "function" === typeof b && (a = b.apply(l, [e, a]));
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
          k += g;
          var t = [];
          if (a.pop === [].pop) {
            e = 0;
            for (d = a.length; e < d; ++e) {
              t[e] = y(e, a, b, k, g) || "null";
              if (r) {
                return;
              }
              p.length = z;
            }
            return 0 === d ? "[]" : k ? "[\n" + k + t.join(",\n" + k) + "\n" + c + "]" : "[" + t.join(",") + "]";
          }
          if (b && b.pop === [].pop) {
            for (e = 0, d = b.length; e < d; ++e) {
              var n = b[e];
              if ("string" === typeof n) {
                l = y(n, a, b, k, g);
                if (r) {
                  return;
                }
                p.length = z;
                l && (t[++m] = x(n) + (k ? ": " : ":") + l);
              }
            }
          } else {
            for (n in a) {
              l = y(n, a, b, k, g);
              if (r) {
                return;
              }
              p.length = z;
              l && (t[++m] = x(n) + (k ? ": " : ":") + l);
            }
          }
          return 0 > m ? "{}" : k ? "{\n" + k + t.join(",\n" + k) + "\n" + c + "}" : "{" + t.join(",") + "}";
        }
        r = !0;
    }
  }
  var B = isFinite, A, h = "", p = [], r = !1;
  if ("number" === typeof w) {
    for (A = 0; A < w; ++A) {
      h += " ";
    }
  } else {
    "string" === typeof w && (h = w);
  }
  if (!v || "function" === typeof v || v.pop === [].pop) {
    return y("_", {_:u}, v, "", h);
  }
}
;function E(u, v) {
  function w(p, r, e) {
    var l, b = r[e];
    if (b && "object" === typeof b) {
      for (l in b) {
        var c = w(p, b, l);
        void 0 !== c ? b[l] = c : delete b[l];
      }
    }
    return p.apply(r, [e, b]);
  }
  var q = 0, x, y = [], B = -1;
  for (x = u.length; q < x; ++q) {
    var A = u.charAt(q);
    var h = A.charCodeAt(0);
    if (173 === h || 1535 < h && 1541 > h || 1807 === h || 6068 === h || 6069 === h || 8203 < h && 8208 > h || 8231 < h && 8240 > h || 8287 < h && 8304 > h || 65279 === h || 65520 <= h && 65535 >= h) {
      A = "\\u" + ("0000" + h.toString(16)).slice(-4);
    }
    y[++B] = A;
  }
  u = y.join("");
  if (function(p) {
    function r(F) {
      return [!0, !0, !0, !0, !0, !0, !0, !0, !0, !0, !0][F];
    }
    for (var e = [{"{":4, "[":12, '"':2, g:1, h:3}, {}, {'"':1}, {}, {'"':6, "}":17}, {'"':6}, {'"':7}, {":":8}, {"{":4, "[":12, '"':10, g:9, h:11}, {",":5, "}":17}, {'"':9}, {",":5, "}":17}, {"{":4, "[":12, '"':15, "]":18, g:14, h:16}, {"{":4, "[":12, '"':15, g:14, h:16}, {",":13, "]":18}, {'"':14}, {",":13, "]":18}], l = {" ":!0, "\b":!0, "\t":!0, "\n":!0, "\r":!0, "\\":!0}, b = [], c = 0, g = 0, d = p.length, k = !1, m = !1, a, z, t, n, C, f; g < d; ++g) {
      if (t = z, z = a, a = p.charAt(g), !l[a] || m && "\\" === a) {
        if (32 > a.charCodeAt(0)) {
          return !1;
        }
        n = e[c];
        switch(c) {
          case 1:
          case 4:
          case 5:
          case 7:
          case 9:
          case 14:
            c = n[a] || 19;
            break;
          case 2:
          case 10:
          case 15:
          case 6:
            if (r(a) && (m || "\\" === t && "x" === z)) {
              return !1;
            }
            c = !m && n[a] || c;
            break;
          case 0:
          case 8:
          case 12:
          case 13:
            c = 19;
            if (n[a]) {
              c = n[a];
            } else if (r(a)) {
              c = n.h, C = !1, f = "0" === a ? 16 : 0;
            } else if ("-" === a) {
              c = n.h, C = !1, f = 32;
            } else {
              m = p.substr(g, 4);
              if ("true" === m || "null" === m) {
                g += 3, c = n.g;
              }
              "false" === p.substr(g, 5) && (g += 4, c = n.g);
            }
            break;
          case 3:
          case 11:
          case 16:
            if (!C) {
              if (r(a)) {
                f & 1 && (f |= 4);
                f & 2 && (f |= 8);
                if (f & 16) {
                  return !1;
                }
                f & 32 && (f -= "0" === a ? 16 : 32);
                break;
              } else if ("." === a) {
                if (f & 3) {
                  return !1;
                }
                f & 16 && (f -= 16);
                f |= 1;
                break;
              } else if ("e" === a || "E" === a) {
                if (f & 16 && (f -= 16), 0 === (f & 2)) {
                  m = p.substr(g, 2);
                  m !== a + "+" && m !== a + "-" || ++g;
                  f |= 2;
                  break;
                }
              }
            }
            c = 0 === f || 1 !== (f & 5) && 2 !== (f & 10) ? n[a] || 19 : 19;
        }
        switch(c) {
          case 4:
          case 12:
            b.push(k);
            k = 12 === c;
            break;
          case 17:
          case 18:
            c = 1 < b.length ? (k = b.pop()) ? 14 : 9 : 1;
            break;
          case 19:
            return !1;
        }
        m = !1;
      } else {
        m = "\\" === a;
        if (3 === c || 16 === c || 11 === c) {
          C = !0;
        }
        if ((2 === c || 15 === c || 10 === c || 6 === c) && 32 > a.charCodeAt(0)) {
          return !1;
        }
      }
    }
    return 1 === c || 3 === c && (0 === f || 1 !== (f & 5) && 2 !== (f & 10));
  }(u)) {
    return q = eval("(" + u + ")"), "function" === typeof v ? w(v, {_:q}, "_") : q;
  }
}
;JSON = JSON || {stringify:D, parse:E};

})(Function, Array, String, Number, Boolean, Date);
;module.exports=JSON;
