JSON=null;
(function(B, A, D, I) {
  function E(r) {
    function q(f) {
      return 10 > f ? "0" + f : f;
    }
    function t(f) {
      f = "000" + f;
      return f.substr(f.length - 4);
    }
    function u(f) {
      f = "00000" + f;
      return f.substr(f.length - 6);
    }
    var h = r.getUTCFullYear();
    return (0 >= h ? "-" + u(-h) : 1e4 <= h ? "+" + u(h) : t(h)) + "-" + q(r.getUTCMonth() + 1) + "-" + q(r.getUTCDate()) + "T" + q(r.getUTCHours()) + ":" + q(r.getUTCMinutes()) + ":" + q(r.getUTCSeconds()) + "." + function(f) {
      f = "00" + f;
      return f.substr(f.length - 3);
    }(r.getUTCMilliseconds()) + "Z";
  }
  function F(r, q, t) {
    function u(c) {
      for (var l = {"\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, n = 0, p = c.length, k, a, m = ['"'], v = 0; n < p; ++n) {
        k = c.charAt(n);
        if (l[k]) {
          k = l[k];
        } else {
          if (a = k.charCodeAt(0), 92 === a || 34 === a || 31 > a || 126 < a && 160 > a || 173 === a || 1535 < a && 1541 > a || 6068 === a || 6069 === a || 8203 < a && 8208 > a || 8231 < a && 8240 > a || 8287 < a && 8304 > a || 65279 === a || 65519 < a && 65536 > a) {
            k = "000" + a.toString(16), k = "\\u" + k.substr(k.length - 4);
          }
        }
        m[++v] = k;
      }
      return m.join("") + '"';
    }
    function h(c, l, n, p, k) {
      function a(C) {
        return -1 / 0 < C && C < 1 / 0;
      }
      var m = p, v = -1, b = l[c];
      if (0 === b) {
        return "0";
      }
      if ("" === b) {
        return '""';
      }
      if (null == b) {
        return "null";
      }
      if (b && "object" === typeof b) {
        var d = b.constructor;
        if (d === D) {
          return a(+b) ? '"' + E(b) + '"' : "null";
        }
        if (d === String) {
          return u("" + b);
        }
        if (d === Number) {
          return a(+b) ? "" + b : "null";
        }
        if (d === Boolean) {
          return "" + b;
        }
      }
      n && n.constructor === B && (b = n.apply(l, [c, b]));
      switch(typeof b) {
        case "string":
          return u(b);
        case "number":
          return a(b) ? "" + b : "null";
        case "boolean":
          return "" + b;
        case "object":
          if (b) {
            if (-1 === g.indexOf(b)) {
              g.push(b);
              var z = g.length;
            } else {
              e = !0;
              break;
            }
            m += k;
            var x = [];
            if (b && b.constructor === A) {
              c = 0;
              for (d = b.length; c < d; ++c) {
                x[c] = h(c, b, n, m, k);
                if (e) {
                  return;
                }
                g.length = z;
              }
              return "[" + (0 === d ? "" : m ? "\n" + m + x.join(",\n" + m) + "\n" + p : x.join(",")) + "]";
            }
            if (n && n.constructor === A) {
              for (c = 0, d = n.length; c < d; ++c) {
                var y = n[c];
                if (y === "" + y) {
                  l = h(y, b, n, m, k);
                  if (e) {
                    return;
                  }
                  g.length = z;
                  l && (x[++v] = u(y) + (m ? ": " : ":") + l);
                }
              }
            } else {
              for (y in b) {
                l = h(y, b, n, m, k);
                if (e) {
                  return;
                }
                g.length = z;
                l && (x[++v] = u(y) + (m ? ": " : ":") + l);
              }
            }
            return "{" + (0 > v ? "" : m ? "\n" + m + x.join(",\n" + m) + "\n" + p : x.join(",")) + "}";
          }
        default:
          return "null";
      }
    }
    var f, w = "", g = [], e = !1;
    if (t === +t) {
      for (f = 0; f < t; ++f) {
        w += " ";
      }
    } else {
      t === "" + t && (w = t);
    }
    if (!q || q && q.constructor === B || q && q.constructor === A) {
      return h("_", {_:r}, q, "", w);
    }
  }
  function G(r, q) {
    function t(h, f, w) {
      var g = f[w], e;
      if (g && g.constructor === A) {
        var c = 0;
        for (e = g.length; c < e; ++c) {
          var l = t(h, g, c);
          void 0 !== l ? g[c] = l : delete g[c];
        }
      } else if (g && "object" === typeof g) {
        for (c in g) {
          l = t(h, g, c), void 0 !== l ? g[c] = l : delete g[c];
        }
      }
      return h.apply(f, [w, g]);
    }
    if (function(h) {
      function f(z) {
        return [!0, !0, !0, !0, !0, !0, !0, !0, !0, !0][z];
      }
      for (var w = {" ":!0, "\b":!0, "\t":!0, "\n":!0, "\r":!0, "\\":!0}, g = [], e = 0, c = 0, l = h.length, n = !1, p = !1, k, a, m, v, b, d; c < l; ++c) {
        if (v = m, m = a, a = h.charAt(c), !w[a] || p && "\\" === a) {
          if (32 > a.charCodeAt(0)) {
            return !1;
          }
          b = H[e];
          switch(e) {
            case 1:
            case 4:
            case 5:
            case 7:
            case 9:
            case 14:
              e = b[a] || 19;
              break;
            case 2:
            case 10:
            case 15:
            case 6:
              if (f(a) && (p || "\\" === v && "x" === m)) {
                return !1;
              }
              e = !p && b[a] || e;
              break;
            case 0:
            case 8:
            case 12:
            case 13:
              e = 19;
              if (b[a]) {
                e = b[a];
              } else if (f(a)) {
                e = b.h, k = !1, d = "0" === a ? 16 : 0;
              } else if ("-" === a) {
                e = b.h, k = !1, d = 32;
              } else {
                p = h.substr(c, 4);
                if ("true" === p || "null" === p) {
                  c += 3, e = b.g;
                }
                "false" === h.substr(c, 5) && (c += 4, e = b.g);
              }
              break;
            case 3:
            case 11:
            case 16:
              if (!k) {
                if (f(a)) {
                  d & 1 && (d |= 4);
                  d & 2 && (d |= 8);
                  if (d & 16) {
                    return !1;
                  }
                  d & 32 && (d -= "0" === a ? 16 : 32);
                  break;
                } else if ("." === a) {
                  if (d & 3) {
                    return !1;
                  }
                  d & 16 && (d -= 16);
                  d |= 1;
                  break;
                } else if ("e" === a || "E" === a) {
                  if (d & 16 && (d -= 16), 0 === (d & 2)) {
                    p = h.substr(c, 2);
                    p !== a + "+" && p !== a + "-" || ++c;
                    d |= 2;
                    break;
                  }
                }
              }
              e = (0 === d || 1 !== (d & 5) && 2 !== (d & 10)) && b[a] || 19;
          }
          switch(e) {
            case 4:
            case 12:
              g.push(n);
              n = 12 === e;
              break;
            case 17:
            case 18:
              e = 1 < g.length ? (n = g.pop()) ? 14 : 9 : 1;
              break;
            case 19:
              return !1;
          }
          p = !1;
        } else {
          if (p = "\\" === a, 3 === e || 16 === e || 11 === e) {
            k = !0;
          } else if ((2 === e || 15 === e || 10 === e || 6 === e) && 32 > a.charCodeAt(0)) {
            return !1;
          }
        }
      }
      return 1 === e || 3 === e && (0 === d || 1 !== (d & 5) && 2 !== (d & 10));
    }(r)) {
      var u = eval("(" + r + ")");
      return q && q.constructor === B ? t(q, {_:u}, "_") : u;
    }
  }
  var H = [{"{":4, "[":12, '"':2, g:1, h:3}, {}, {'"':1}, {}, {'"':6, "}":17}, {'"':6}, {'"':7}, {":":8}, {"{":4, "[":12, '"':10, g:9, h:11}, {",":5, "}":17}, {'"':9}, {",":5, "}":17}, {"{":4, "[":12, '"':15, "]":18, g:14, h:16}, {"{":4, "[":12, '"':15, g:14, h:16}, {",":13, "]":18}, {'"':14}, {",":13, "]":18}];
  JSON = JSON || {stringify:F, parse:G};
})(Function, Array, Date, isFinite);

;module.exports=JSON;
