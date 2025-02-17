JSON=null;
(function(B, A, C, D) {
  function E(q) {
    function n(f) {
      return 10 > f ? "0" + f : f;
    }
    function r(f) {
      f = "000" + f;
      return f.substr(f.length - 4);
    }
    function t(f) {
      f = "00000" + f;
      return f.substr(f.length - 6);
    }
    var m = q.getUTCFullYear();
    return (0 >= m ? "-" + t(-m) : 1e4 <= m ? "+" + t(m) : r(m)) + "-" + n(q.getUTCMonth() + 1) + "-" + n(q.getUTCDate()) + "T" + n(q.getUTCHours()) + ":" + n(q.getUTCMinutes()) + ":" + n(q.getUTCSeconds()) + "." + function(f) {
      f = "00" + f;
      return f.substr(f.length - 3);
    }(q.getUTCMilliseconds()) + "Z";
  }
  function F(q, n, r) {
    function t(k) {
      for (var p = {"\b":"\\b", "\t":"\\t", "\n":"\\n", "\f":"\\f", "\r":"\\r", '"':'\\"', "\\":"\\\\"}, g = 0, u = k.length, b, c, v = ['"'], a = 0; g < u; ++g) {
        b = k.charAt(g);
        if (p[b]) {
          b = p[b];
        } else {
          if (c = b.charCodeAt(0), 92 === c || 34 === c || 31 > c || 126 < c && 160 > c || 173 === c || 1535 < c && 1541 > c || 6068 === c || 6069 === c || 8203 < c && 8208 > c || 8231 < c && 8240 > c || 8287 < c && 8304 > c || 65279 === c || 65519 < c && 65536 > c) {
            b = "000" + c.toString(16), b = "\\u" + b.substr(b.length - 4);
          }
        }
        v[++a] = b;
      }
      return v.join("") + '"';
    }
    function m(k, p, g, u, b) {
      var c = u, v = -1, a = p[k];
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
        var e = a.constructor;
        if (e === C) {
          return f(+a) ? '"' + E(a) + '"' : "null";
        }
        if (e === String) {
          return t("" + a);
        }
        if (e === Number) {
          return f(a) ? "" + a : "null";
        }
        if (e === Boolean) {
          return "" + a;
        }
      }
      g && g.constructor === B && (a = g.apply(p, [k, a]));
      switch(typeof a) {
        case "string":
          return t(a);
        case "number":
          return f(a) ? "" + a : "null";
        case "boolean":
          return "" + a;
        case "object":
          if (a) {
            if (-1 === d.indexOf(a)) {
              d.push(a);
              var z = d.length;
            } else {
              h = !0;
              break;
            }
            c += b;
            var x = [];
            if (a && a.constructor === A) {
              k = 0;
              for (e = a.length; k < e; ++k) {
                x[k] = m(k, a, g, c, b);
                if (h) {
                  return;
                }
                d.length = z;
              }
              return "[" + (0 === e ? "" : c ? "\n" + c + x.join(",\n" + c) + "\n" + u : x.join(",")) + "]";
            }
            if (g && g.constructor === A) {
              for (k = 0, e = g.length; k < e; ++k) {
                var y = g[k];
                if (y === "" + y) {
                  p = m(y, a, g, c, b);
                  if (h) {
                    return;
                  }
                  d.length = z;
                  p && (x[++v] = t(y) + (c ? ": " : ":") + p);
                }
              }
            } else {
              for (y in a) {
                p = m(y, a, g, c, b);
                if (h) {
                  return;
                }
                d.length = z;
                p && (x[++v] = t(y) + (c ? ": " : ":") + p);
              }
            }
            return "{" + (0 > v ? "" : c ? "\n" + c + x.join(",\n" + c) + "\n" + u : x.join(",")) + "}";
          }
        default:
          return "null";
      }
    }
    var f = D, w, l = "", d = [], h = !1;
    if (r === +r) {
      for (w = 0; w < r; ++w) {
        l += " ";
      }
    } else {
      r === "" + r && (l = r);
    }
    if (!n || n && n.constructor === B || n && n.constructor === A) {
      return m("_", {_:q}, n, "", l);
    }
  }
  function G(q, n) {
    function r(m, f, w) {
      var l = f[w], d;
      if (l && l.constructor === A) {
        var h = 0;
        for (d = l.length; h < d; ++h) {
          var k = r(m, l, h);
          void 0 !== k ? l[h] = k : delete l[h];
        }
      } else if (l && "object" === typeof l) {
        for (h in l) {
          k = r(m, l, h), void 0 !== k ? l[h] = k : delete l[h];
        }
      }
      return m.apply(f, [w, l]);
    }
    if (function(m) {
      function f(z) {
        return [!0, !0, !0, !0, !0, !0, !0, !0, !0, !0][z];
      }
      for (var w = {" ":!0, "\b":!0, "\t":!0, "\n":!0, "\r":!0, "\\":!0}, l = [], d = 0, h = 0, k = m.length, p = !1, g = !1, u, b, c, v, a, e; h < k; ++h) {
        if (v = c, c = b, b = m.charAt(h), !w[b] || g && "\\" === b) {
          if (32 > b.charCodeAt(0)) {
            return !1;
          }
          a = H[d];
          switch(d) {
            case 1:
            case 4:
            case 5:
            case 7:
            case 9:
            case 14:
              d = a[b] || 19;
              break;
            case 2:
            case 10:
            case 15:
            case 6:
              if (f(b) && (g || "\\" === v && "x" === c)) {
                return !1;
              }
              d = !g && a[b] || d;
              break;
            case 0:
            case 8:
            case 12:
            case 13:
              d = 19;
              if (a[b]) {
                d = a[b];
              } else if (f(b)) {
                d = a.h, u = !1, e = "0" === b ? 16 : 0;
              } else if ("-" === b) {
                d = a.h, u = !1, e = 32;
              } else {
                g = m.substr(h, 4);
                if ("true" === g || "null" === g) {
                  h += 3, d = a.g;
                }
                "false" === m.substr(h, 5) && (h += 4, d = a.g);
              }
              break;
            case 3:
            case 11:
            case 16:
              if (!u) {
                if (f(b)) {
                  e & 1 && (e |= 4);
                  e & 2 && (e |= 8);
                  if (e & 16) {
                    return !1;
                  }
                  e & 32 && (e -= "0" === b ? 16 : 32);
                  break;
                } else if ("." === b) {
                  if (e & 3) {
                    return !1;
                  }
                  e & 16 && (e -= 16);
                  e |= 1;
                  break;
                } else if ("e" === b || "E" === b) {
                  if (e & 16 && (e -= 16), 0 === (e & 2)) {
                    g = m.substr(h, 2);
                    g !== b + "+" && g !== b + "-" || ++h;
                    e |= 2;
                    break;
                  }
                }
              }
              d = (0 === e || 1 !== (e & 5) && 2 !== (e & 10)) && a[b] || 19;
          }
          switch(d) {
            case 4:
            case 12:
              l.push(p);
              p = 12 === d;
              break;
            case 17:
            case 18:
              d = 1 < l.length ? (p = l.pop()) ? 14 : 9 : 1;
              break;
            case 19:
              return !1;
          }
          g = !1;
        } else {
          if (g = "\\" === b, 3 === d || 16 === d || 11 === d) {
            u = !0;
          } else if ((2 === d || 15 === d || 10 === d || 6 === d) && 32 > b.charCodeAt(0)) {
            return !1;
          }
        }
      }
      return 1 === d || 3 === d && (0 === e || 1 !== (e & 5) && 2 !== (e & 10));
    }(q)) {
      var t = eval("(" + q + ")");
      return n && n.constructor === B ? r(n, {_:t}, "_") : t;
    }
  }
  var H = [{"{":4, "[":12, '"':2, g:1, h:3}, {}, {'"':1}, {}, {'"':6, "}":17}, {'"':6}, {'"':7}, {":":8}, {"{":4, "[":12, '"':10, g:9, h:11}, {",":5, "}":17}, {'"':9}, {",":5, "}":17}, {"{":4, "[":12, '"':15, "]":18, g:14, h:16}, {"{":4, "[":12, '"':15, g:14, h:16}, {",":13, "]":18}, {'"':14}, {",":13, "]":18}];
  JSON = JSON || {stringify:F, parse:G};
})(Function, Array, Date, isFinite);

;module.exports=JSON;
