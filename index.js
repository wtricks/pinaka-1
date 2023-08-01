const Z = "1.0.0", Q = () => !1, V = Object.keys, ee = Object.values, H = Object.assign, w = Array.isArray, te = Object.freeze([]), E = Object.freeze({}), R = (e) => typeof e == "string", y = (e) => typeof e == "function", ne = (e, t) => e === t, F = (e) => e != null && typeof e == "object" && !w(e), J = (e) => {
  let t;
  for (t of e)
    t();
}, I = (e, t, n, l) => Object.defineProperty(e, t, {
  enumerable: !1,
  ...l && l,
  ...!l && { value: n, writable: !0 }
}), se = Promise.resolve(), D = {};
let B = {}, _ = {}, L = {}, p = !1, le = 3, A;
const re = A = (e) => {
  B[e.$] || (B[e.$] = !0, D[e.$] = e, p || (p = !0, se.then(ie)));
}, oe = (e) => {
  L[e.$] || (L[e.$] = !0, J(ee(e)));
}, ie = () => {
  let e, t, n, l = le;
  for (; l-- > 0; )
    for (e in D) {
      n = D[e];
      for (t in n)
        _[t] || (_[t] = !0, n[t]());
      delete D[e];
    }
  B = {}, _ = {}, p = !1;
}, Ae = (e) => {
  A = oe, e(), L = {}, A = re;
}, U = [];
let N = !1, C = {}, ce = 0, z = 0;
const Fe = (e, t = ne) => {
  const n = I({}, "$", ce++);
  return t = t || falsy, [() => (N && (C[n.$] = n), e), (s) => {
    const o = y(s) ? s(e) : s;
    t(e, o) || (A(n), e = o);
  }];
}, Pe = (e) => {
  U.push(e);
}, Te = (e, t) => {
  let n = t;
  return () => n = e(n);
}, b = (e, t, n) => {
  const l = [];
  N = !0;
  const r = (n || t)();
  if (N = !1, V(C).length > 0) {
    let s;
    for (s in C)
      C[s][z] = t, l.push([C[s], z++]);
    C = {}, e.push(() => {
      let o;
      for (o of l)
        delete o[0][o[1]];
    });
  }
  return r;
}, xe = (e) => {
  const t = N;
  N = !1;
  const n = e();
  return N = t, n;
}, je = () => {
  let e;
  return (t) => t === void 0 ? e : e = t;
}, fe = (e) => e !== "svg" ? document.createElement(e) : document.createElementNS("http://www.w3.org/2000/svg", e), K = (e, t, n) => {
  if (t in e)
    return e[t] = n;
  e.setAttribute(t, `${n}`);
}, ue = (e, t, n) => (e.addEventListener(t, n), () => e.removeEventListener(t, n)), P = (e = "") => document.createTextNode(e), O = (e, t) => {
  J(t[1]);
  let n;
  for (n of t[0]) {
    if (n.$d) {
      n.$d();
      continue;
    }
    e.removeChild(n);
  }
}, k = (e, t, n) => {
  let l, r = 0;
  for (n = n[0]; l = n[r++]; )
    l.$u ? t = l.$u(t) : (e.insertBefore(l, t.nextSibling), t = l);
  return t;
}, de = (e, t, n) => (F(t) ? "if" in t && I(t, "if", t.if) : (n == null && (n = t), t = E), { type: e, props: t, children: n }), ae = (e, t, n, l) => {
  var o;
  let r = [], s;
  for (s in n)
    s == "bind" ? he(t, n.key, l) : s == "ref" ? (o = n[s]) == null || o.call(n, t) : s == "class" ? $e(t, n.class, l) : s == "style" ? ye(t, n.style, l) : s.startsWith("on:") ? l.push(ue(t, s.slice(3), n[s])) : s == "use" ? r.push(w(n[s]) ? n[s] : [n[s]]) : y(n[s]) ? b(l, () => K(t, s, n[s])) : K(t, s, n[s]);
  e(t);
  for (s of r) {
    const c = s[0](t, (s[1] = y(s[1]) ? s[1] : falsy)(), ...s[2]);
    c.destroy !== void 0 && l.push(c.destroy), c.update !== void 0 && b(l, () => c.update(s[1]()), s[1]);
  }
}, he = (e, t, n) => {
  const l = y(t) ? t : () => t;
  let r = E;
  const s = (o = l()) => {
    let c;
    if (!F(o))
      throw new Error("Only 'object' can be bind with the elements.");
    for (c in o)
      K(e, c, o[c]), delete r[c];
    for (c in r)
      e.removeAttribute(c);
    r = o;
  };
  s(b(n, s));
}, $e = (e, t, n) => {
  b(n, () => {
    let l = y(t) ? t() : t, r = w(l) ? l : [];
    if (F(l)) {
      let s;
      for (s in l)
        r.push(s);
    }
    e.setAttribute("class", r.join(" "));
  });
}, ye = (e, t, n) => {
  let l = E, r = y(t) ? t : () => t;
  const s = (o = r()) => {
    if (R(o)) {
      e.setAttribute("style", o);
      return;
    }
    R(l) && (l = E);
    let c, u;
    const i = (f) => {
      for (c in f)
        delete l[c], u = isNaN(f[c]) ? f[c] : `${f[c]}px`, c[0] != "-" ? e.style[c] = u : e.style.setProperty(c, u);
    };
    if (w(o))
      for (c of o)
        i(c);
    else
      i(o);
    for (c in l)
      e.style[c] = "";
    l = o;
  };
  s(b(n, s, r));
}, ge = (e, t) => {
  let n = P(), l;
  return b(t, () => {
    n.nodeValue != (l = e()) && (n.data = l);
  }), n;
}, be = (e, t, n) => {
  const l = P();
  e.appendChild(l);
  const r = t.children, s = [[], []], o = [];
  let c = -1, u;
  (u = () => {
    let i = -1, f = 0, $, d;
    for (; f < r.length; ) {
      if ($ = r[f].props.if || truthy, d = o.length > f ? $() : b(o, u, $), o.length == f && o.push(truthy), d) {
        i = f;
        break;
      }
      f++;
    }
    for (f = o.length; f-- > 1 && i < f; )
      o.pop()();
    if (i != c && (c = i, O(e, s), s[0].length = s[1].length = 0, i != -1)) {
      if (S(e, r[i], s[1], (g) => {
        s[0].push(g);
      }), s[0].length == 0)
        throw new Error("Component <p:case> requires at least one child node.");
      k(e, l, s);
    }
  })(), n({
    $l() {
      let i = s[0].at(-1);
      return i ? i.$l ? i.$l() : i : l;
    },
    $d() {
      e.removeChild(l), O(e, s);
    },
    $u(i) {
      return e.insertBefore(l, i.nextSibling), k(e, l, s);
    }
  });
}, we = (e, t, n) => {
  var f, $;
  const l = P();
  e.appendChild(l);
  const r = [], s = t.children, o = ((f = t.props) == null ? void 0 : f.key) || ((d, g) => g), c = (($ = t.props) == null ? void 0 : $.list) || (() => te);
  let u = [];
  const i = (d = c()) => {
    if (!w(d))
      throw new Error("Component <p:each> requires list to be an array.");
    u = Ee(c, e, l, u, d, o, s);
  };
  i(b(r, i, c)), n({
    $l() {
      let d = u.at(-1);
      return d ? (d = d[0].at(-1)).$l ? d.$l() : d : l;
    },
    $d() {
      e.removeChild(l), r[0] && r[0]();
      let d;
      for (d of u)
        O(e, d);
    },
    $u(d) {
      e.insertBefore(l, d.nextSibling);
      let g;
      for (g of u)
        d = k(e, l, g);
      return d;
    }
  });
}, Ee = (e, t, n, l, r, s, o) => {
  const c = {}, u = {}, i = [];
  let f, $, d = 0, g = 0, T = 0, x = 0, m, h;
  for (const a of l) {
    if (c[a[2]])
      throw new Error("Duplicate keys found.");
    c[a[2]] = a;
  }
  for (const a in r)
    $ = s(r[a], a), f = i[a] = c[$] || [null, [], $, a], f[4] = a - f[3], f[3] = a, u[$] = !0;
  const j = (a) => {
    if (a[0] == null && (a[0] = [], S(
      t,
      o(() => e()[a[3]], () => a[3]),
      a[1],
      (Y) => a[0].push(Y)
    ), a[0].length == 0))
      throw new Error("Component <p:each> requires at least one children.");
    k(t, n, a), (n = a.at(-1)).$l && (n = n.$l());
  };
  for (; (m = l[d]) && (h = i[g]); )
    m == h ? ((n = m[0].at(-1)).$l && (n = n.$l()), T = x = 0, g++) : m[2] in u ? h[0] == null ? (j(h), T++, g++) : (h[4] < 0 ? h[4] >= x : h[4] >= T) && (j(h), g++) : (O(t, m), x++), d++;
  for (; m = l[d++]; )
    O(t, m);
  for (; h = i[g++]; )
    (h[0] == null || (h[4] < 0 ? h[4] >= x : h[4] >= T)) && j(h);
  return i;
}, me = (e, t, n, l) => {
  if (!(t.props.target instanceof Node))
    throw new Error("Target is not found in <p:portal>");
  const r = [[], []], s = t.props.target;
  S(s, t.children, r[1], (o) => {
    o.$l || s.appendChild(o), r[0].push(o);
  }), l.push(() => O(e, r));
};
let Ce = 0;
const X = (e, t, n) => {
  let l = {}, r;
  for (r in t)
    r == "bind" ? Oe(e, t, t.bind, n) : r == "use" ? l = t[r] : r.startsWith("on:") ? e["on" + r.slice(3)] = t[r] : Ne(e, r, t[r]);
  return l;
}, Ne = (e, t, n) => {
  delete e[t], I(e, t, null, {
    get() {
      return y(n) ? n() : n;
    }
  });
}, Oe = (e, t, n, l) => {
  const r = I({}, "$", `.${Ce++}.`);
  let s = E, o = y(n) ? n : () => n;
  const c = (u = o()) => {
    if (F(u))
      throw new Error("Only 'object' can be bind with the components.");
    let i;
    for (i in u) {
      if (i in s) {
        u[i] !== s[i] && (e[i] = u[i], A(r));
        continue;
      }
      I(e, i, null, {
        get() {
          return N && (C[r.$] = r), u[i];
        }
      }), delete s[i];
    }
    for (i in s)
      delete e[i], t[i] && (e[i] = t[i]);
    s = u;
  };
  c(b(l, c, o));
}, Se = (e, t, n, l) => {
  const r = [[], []];
  let s;
  if (y(t.children)) {
    const o = {}, c = X(o, t.props || E, r[1]);
    s = t.children(o, { use: c });
  } else
    s = t.children;
  S(e, s, l, n);
}, v = {
  each: we,
  case: be,
  portal: me,
  slot: Se,
  comment: (e, t, n) => {
    n(document.createComment(`${t.children}`));
  }
}, S = (e, t, n, l) => {
  if (R(t))
    l(P(t));
  else if (y(t))
    l(ge(t, n));
  else if (w(t)) {
    let r;
    for (r of t)
      S(e, r, n, l);
  } else if (y(t.type))
    M(e, t, l);
  else if (t.type.startsWith("p:")) {
    const r = t.type.slice(2);
    if (r in v)
      return v[r](e, t, l, n);
    t.type = Ie(r), M(e, t, l);
  } else {
    const r = fe(t.type);
    ae(l, r, t.props || E, n), t.children && S(r, t.children, n, (s) => {
      s.$d ? n.push(s.$d) : r.appendChild(s);
    });
  }
}, M = (e, t, n) => {
  const l = P();
  e.appendChild(l);
  const r = {}, s = [[], []], o = X(r, t.props || E, s[1]);
  let c = [];
  const u = t.type(r, { slots: t.children, use: o });
  if (u == null || w(u) && u.length == 0)
    throw new Error("Component must return at least one node.");
  if (S(e, u, s[1], (i) => {
    s[0].push(i);
  }), s[0].length == 0)
    throw new Error("Component requires at least one child node.");
  k(e, l, s);
  for (const i of U) {
    const f = { value: null };
    b(s[1], () => {
      var $;
      ($ = f.value) == null || $.call(f), f.value = i();
    }), c.push(f);
  }
  U.length = 0, n({
    $l() {
      let i = s[0].at(-1);
      return i.$l ? i.$l() : i;
    },
    $d() {
      var i;
      for (let f of c)
        (i = f.value) == null || i.call(f);
      O(e, s), e.removeChild(l);
    },
    $u(i) {
      return e.insertBefore(l, i.nextSibling), k(e, l, s);
    }
  });
}, q = {}, G = {}, W = {}, ke = { allowComment: !1, isCustomTag: Q }, He = (e, t, ...n) => [(R(e) ? W[e] : e) || truthy, t, n], De = (e) => q[e], Ie = (e) => G[e] || (() => {
  throw new Error(`Component '<p:${e}>' is not registered.`);
}), Re = (e, t, n) => {
  if (!(t instanceof Node))
    throw new Error("Target is not found.");
  let l = E;
  if (n && (F(n.initialProps) && (l = n.initialProps), y(n.errorHandler) && n.errorHandler, H(q, n.global), H(W, n.directive), H(ke, n.config), H(G, n.component), w(n.plugins))) {
    const s = {
      component(o, c) {
        G[o] = c;
      },
      directive(o, c) {
        W[o] = c;
      },
      global(o, c) {
        q[o] = c;
      },
      version: Z
    };
    for (const o of n.plugins)
      y(o) ? o(s) : w(o) && o[0](s, ...o[1]);
  }
  let r = Q;
  return M(t, de(e, l), (s) => r = s.$d), r;
};
export {
  Re as createApp,
  Pe as createEffect,
  Te as createMemo,
  je as createRef,
  Fe as createSignal,
  De as global,
  de as h,
  Ae as unbatch,
  xe as untrack,
  He as use,
  Z as version
};
//# sourceMappingURL=pinaka.js.map
