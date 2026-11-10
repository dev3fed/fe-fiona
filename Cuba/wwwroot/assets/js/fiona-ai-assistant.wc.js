var Ga = Object.defineProperty;
var Qa = (e, t, n) => t in e ? Ga(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ie = (e, t, n) => Qa(e, typeof t != "symbol" ? t + "" : t, n);
/**
* @vue/shared v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function $t(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const _e = process.env.NODE_ENV !== "production" ? Object.freeze({}) : {}, an = process.env.NODE_ENV !== "production" ? Object.freeze([]) : [], Ne = () => {
}, tl = () => !1, ar = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // uppercase letter
(e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), Wn = (e) => e.startsWith("onUpdate:"), xe = Object.assign, si = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, ec = Object.prototype.hasOwnProperty, ae = (e, t) => ec.call(e, t), Z = Array.isArray, Pt = (e) => cr(e) === "[object Map]", gn = (e) => cr(e) === "[object Set]", Ti = (e) => cr(e) === "[object Date]", ee = (e) => typeof e == "function", ye = (e) => typeof e == "string", _t = (e) => typeof e == "symbol", pe = (e) => e !== null && typeof e == "object", li = (e) => (pe(e) || ee(e)) && ee(e.then) && ee(e.catch), nl = Object.prototype.toString, cr = (e) => nl.call(e), ai = (e) => cr(e).slice(8, -1), no = (e) => cr(e) === "[object Object]", ci = (e) => ye(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Vn = /* @__PURE__ */ $t(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
), tc = /* @__PURE__ */ $t(
  "bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo"
), ro = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, nc = /-\w/g, Pe = /* @__PURE__ */ ro((e) => e.replace(nc, (t) => t.slice(1).toUpperCase())), rc = /\B([A-Z])/g, tt = /* @__PURE__ */ ro(
  (e) => e.replace(rc, "-$1").toLowerCase()
), oo = /* @__PURE__ */ ro((e) => e.charAt(0).toUpperCase() + e.slice(1)), rn = /* @__PURE__ */ ro((e) => e ? `on${oo(e)}` : ""), Et = (e, t) => !Object.is(e, t), wn = (e, ...t) => {
  for (let n = 0; n < e.length; n++)
    e[n](...t);
}, Br = (e, t, n, r = !1) => {
  Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !1,
    writable: r,
    value: n
  });
}, ur = (e) => {
  const t = parseFloat(e);
  return isNaN(t) ? e : t;
}, Ii = (e) => {
  const t = ye(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
let ji;
const fr = () => ji || (ji = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
function ui(e) {
  if (Z(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const r = e[n], o = ye(r) ? lc(r) : ui(r);
      if (o)
        for (const i in o)
          t[i] = o[i];
    }
    return t;
  } else if (ye(e) || pe(e))
    return e;
}
const oc = /;(?![^(]*\))/g, ic = /:([^]+)/, sc = /"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;
function lc(e) {
  const t = {};
  return e.replace(sc, (n) => n.startsWith("/*") ? "" : n).split(oc).forEach((n) => {
    if (n) {
      const r = n.split(ic);
      r.length > 1 && (t[r[0].trim()] = r[1].trim());
    }
  }), t;
}
function Be(e) {
  let t = "";
  if (ye(e))
    t = e;
  else if (Z(e))
    for (let n = 0; n < e.length; n++) {
      const r = Be(e[n]);
      r && (t += r + " ");
    }
  else if (pe(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
const ac = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot", cc = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view", uc = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics", fc = /* @__PURE__ */ $t(ac), dc = /* @__PURE__ */ $t(cc), pc = /* @__PURE__ */ $t(uc), hc = "itemscope,allowfullscreen,disablepictureinpicture,disableremoteplayback,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly", gc = /* @__PURE__ */ $t(hc);
function rl(e) {
  return !!e || e === "";
}
function mc(e, t, n) {
  if (e.length !== t.length) return !1;
  let r = !0;
  for (let o = 0; r && o < e.length; o++)
    r = Ht(e[o], t[o], n);
  return r;
}
function Mi(e, t, n) {
  if (e.size !== t.size) return !1;
  const r = Array.from(t), o = new Uint8Array(r.length);
  for (const i of e) {
    let s = -1;
    for (let l = 0; l < r.length; l++)
      if (!o[l] && Ht(i, r[l], n)) {
        s = l;
        break;
      }
    if (s < 0) return !1;
    o[s] = 1;
  }
  return !0;
}
function _c(e, t, n) {
  let r = Pt(e), o = Pt(t);
  if (r || o || (r = gn(e), o = gn(t), r || o))
    return r && o ? Mi(e, t, n) : !1;
  const i = Object.keys(e).length, s = Object.keys(t).length;
  if (i !== s)
    return !1;
  for (const l in e) {
    const a = e.hasOwnProperty(l), c = t.hasOwnProperty(l);
    if (a && !c || !a && c || !Ht(e[l], t[l], n))
      return !1;
  }
  return String(e) === String(t);
}
function Vi(e, t, n, r) {
  n || (n = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Map()]);
  const [o, i] = n;
  if (o.has(e) || i.has(t))
    return o.get(e) === t && i.get(t) === e;
  o.set(e, t), i.set(t, e);
  const s = r(e, t, n);
  return o.delete(e), i.delete(t), s;
}
function Ht(e, t, n) {
  if (e === t) return !0;
  let r = Ti(e), o = Ti(t);
  return r || o ? r && o ? e.getTime() === t.getTime() : !1 : (r = _t(e), o = _t(t), r || o ? e === t : (r = Z(e), o = Z(t), r || o ? r && o ? Vi(e, t, n, mc) : !1 : (r = pe(e), o = pe(t), r || o ? !r || !o ? !1 : Vi(e, t, n, _c) : String(e) === String(t))));
}
function bc(e, t) {
  return e.findIndex((n) => Ht(n, t));
}
const ol = (e) => !!(e && e.__v_isRef === !0), re = (e) => ye(e) ? e : e == null ? "" : Z(e) || pe(e) && (e.toString === nl || !ee(e.toString)) ? ol(e) ? re(e.value) : JSON.stringify(e, il, 2) : String(e), il = (e, t) => ol(t) ? il(e, t.value) : Pt(t) ? {
  [`Map(${t.size})`]: [...t.entries()].reduce(
    (n, [r, o], i) => (n[bo(r, i) + " =>"] = o, n),
    {}
  )
} : gn(t) ? {
  [`Set(${t.size})`]: [...t.values()].map((n) => bo(n))
} : _t(t) ? bo(t) : pe(t) && !Z(t) && !no(t) ? String(t) : t, bo = (e, t = "") => {
  var n;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    _t(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e
  );
};
/**
* @vue/reactivity v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function it(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let Ae;
class vc {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t = !1) {
    this.detached = t, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !t && Ae && (Ae.active ? (this.parent = Ae, this.index = (Ae.scopes || (Ae.scopes = [])).push(
      this
    ) - 1) : (this._active = !1, this._warnOnRun = !1));
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = !0;
      let t, n;
      if (this.scopes) {
        const r = this.scopes.slice();
        for (t = 0, n = r.length; t < n; t++)
          r[t].pause();
      }
      for (t = 0, n = this.effects.length; t < n; t++)
        this.effects[t].pause();
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active && this._isPaused) {
      this._isPaused = !1;
      let t, n;
      if (this.scopes) {
        const o = this.scopes.slice();
        for (t = 0, n = o.length; t < n; t++)
          o[t].resume();
      }
      const r = this.effects.slice();
      for (t = 0, n = r.length; t < n; t++)
        r[t].resume();
    }
  }
  run(t) {
    if (this._active) {
      const n = Ae;
      try {
        return Ae = this, t();
      } finally {
        Ae = n;
      }
    } else process.env.NODE_ENV !== "production" && this._warnOnRun && it("cannot run an inactive effect scope.");
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    ++this._on === 1 && (this.prevScope = Ae, Ae = this);
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      if (Ae === this)
        Ae = this.prevScope;
      else {
        let t = Ae;
        for (; t; ) {
          if (t.prevScope === this) {
            t.prevScope = this.prevScope;
            break;
          }
          t = t.prevScope;
        }
      }
      this.prevScope = void 0;
    }
  }
  stop(t) {
    if (this._active) {
      this._active = !1;
      let n, r;
      for (n = 0, r = this.effects.length; n < r; n++)
        this.effects[n].stop();
      for (this.effects.length = 0, n = 0, r = this.cleanups.length; n < r; n++)
        this.cleanups[n]();
      if (this.cleanups.length = 0, this.scopes) {
        const o = this.scopes.slice();
        for (n = 0, r = o.length; n < r; n++)
          o[n].stop(!0);
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !t) {
        const o = this.parent.scopes.pop();
        o && o !== this && (this.parent.scopes[this.index] = o, o.index = this.index);
      }
      this.parent = void 0;
    }
  }
}
function sl() {
  return Ae;
}
function xc(e, t = !1) {
  Ae ? Ae.active ? Ae.cleanups.push(e) : e() : process.env.NODE_ENV !== "production" && !t && it(
    "onScopeDispose() is called when there is no active effect scope to be associated with."
  );
}
let ge;
const vo = /* @__PURE__ */ new WeakSet();
class ll {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, Ae && (Ae.active ? Ae.effects.push(this) : this.flags &= -2);
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, vo.has(this) && (vo.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || cl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Pi(this), ul(this);
    const t = ge, n = gt;
    ge = this, gt = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && ge !== this && it(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), fl(this), ge = t, gt = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        pi(t);
      this.deps = this.depsTail = void 0, Pi(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? vo.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    $o(this) && this.run();
  }
  get dirty() {
    return $o(this);
  }
}
let al = 0, Pn, Bn;
function cl(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = Bn, Bn = e;
    return;
  }
  e.next = Pn, Pn = e;
}
function fi() {
  al++;
}
function di() {
  if (--al > 0)
    return;
  if (Bn) {
    let t = Bn;
    for (Bn = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; Pn; ) {
    let t = Pn;
    for (Pn = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (r) {
          e || (e = r);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function ul(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function fl(e) {
  let t, n = e.depsTail, r = n;
  for (; r; ) {
    const o = r.prevDep;
    r.version === -1 ? (r === n && (n = o), pi(r), yc(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = o;
  }
  e.deps = t, e.depsTail = n;
}
function $o(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (dl(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function dl(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Hn) || (e.globalVersion = Hn, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !$o(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = ge, r = gt;
  ge = e, gt = !0;
  try {
    ul(e);
    const o = e.fn(e._value);
    (t.version === 0 || Et(o, e._value)) && (e.flags |= 128, e._value = o, t.version++);
  } catch (o) {
    throw t.version++, o;
  } finally {
    ge = n, gt = r, fl(e), e.flags &= -3;
  }
}
function pi(e, t = !1) {
  const { dep: n, prevSub: r, nextSub: o } = e;
  if (r && (r.nextSub = o, e.prevSub = void 0), o && (o.prevSub = r, e.nextSub = void 0), process.env.NODE_ENV !== "production" && n.subsHead === e && (n.subsHead = o), n.subs === e && (n.subs = r, !r && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      pi(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function yc(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
let gt = !0;
const pl = [];
function st() {
  pl.push(gt), gt = !1;
}
function lt() {
  const e = pl.pop();
  gt = e === void 0 ? !0 : e;
}
function Pi(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = ge;
    ge = void 0;
    try {
      t();
    } finally {
      ge = n;
    }
  }
}
let Hn = 0;
class wc {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class hi {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
    if (!ge || !gt || ge === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== ge)
      n = this.activeLink = new wc(ge, this), ge.deps ? (n.prevDep = ge.depsTail, ge.depsTail.nextDep = n, ge.depsTail = n) : ge.deps = ge.depsTail = n, hl(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const r = n.nextDep;
      r.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = r), n.prevDep = ge.depsTail, n.nextDep = void 0, ge.depsTail.nextDep = n, ge.depsTail = n, ge.deps === n && (ge.deps = r);
    }
    return process.env.NODE_ENV !== "production" && ge.onTrack && ge.onTrack(
      xe(
        {
          effect: ge
        },
        t
      )
    ), n;
  }
  trigger(t) {
    this.version++, Hn++, this.notify(t);
  }
  notify(t) {
    fi();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let n = this.subsHead; n; n = n.nextSub)
          n.sub.onTrigger && !(n.sub.flags & 8) && n.sub.onTrigger(
            xe(
              {
                effect: n.sub
              },
              t
            )
          );
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      di();
    }
  }
}
function hl(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let r = t.deps; r; r = r.nextDep)
        hl(r);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const zo = /* @__PURE__ */ new WeakMap(), un = /* @__PURE__ */ Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), Lo = /* @__PURE__ */ Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), qn = /* @__PURE__ */ Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function Te(e, t, n) {
  if (gt && ge) {
    let r = zo.get(e);
    r || zo.set(e, r = /* @__PURE__ */ new Map());
    let o = r.get(n);
    o || (r.set(n, o = new hi()), o.map = r, o.key = n), process.env.NODE_ENV !== "production" ? o.track({
      target: e,
      type: t,
      key: n
    }) : o.track();
  }
}
function kt(e, t, n, r, o, i) {
  const s = zo.get(e);
  if (!s) {
    Hn++;
    return;
  }
  const l = (a) => {
    a && (process.env.NODE_ENV !== "production" ? a.trigger({
      target: e,
      type: t,
      key: n,
      newValue: r,
      oldValue: o,
      oldTarget: i
    }) : a.trigger());
  };
  if (fi(), t === "clear")
    s.forEach(l);
  else {
    const a = Z(e), c = a && ci(n);
    if (a && n === "length") {
      const u = Number(r);
      s.forEach((f, p) => {
        (p === "length" || p === qn || !_t(p) && p >= u) && l(f);
      });
    } else
      switch ((n !== void 0 || s.has(void 0)) && l(s.get(n)), c && l(s.get(qn)), t) {
        case "add":
          a ? c && l(s.get("length")) : (l(s.get(un)), Pt(e) && l(s.get(Lo)));
          break;
        case "delete":
          a || (l(s.get(un)), Pt(e) && l(s.get(Lo)));
          break;
        case "set":
          Pt(e) && l(s.get(un));
          break;
      }
  }
  di();
}
function vn(e) {
  const t = /* @__PURE__ */ le(e);
  return t === e || (Te(t, "iterate", qn), /* @__PURE__ */ We(e)) ? t : /* @__PURE__ */ at(e) ? /* @__PURE__ */ Bt(e) ? t.map((n) => qt(ct(n))) : t.map(qt) : t.map(ct);
}
function io(e) {
  return Te(e = /* @__PURE__ */ le(e), "iterate", qn), e;
}
function xt(e, t) {
  return /* @__PURE__ */ at(e) ? qt(/* @__PURE__ */ Bt(e) ? ct(t) : t) : ct(t);
}
const Ec = {
  __proto__: null,
  [Symbol.iterator]() {
    return xo(this, Symbol.iterator, (e) => xt(this, e));
  },
  concat(...e) {
    return vn(this).concat(
      ...e.map((t) => Z(t) ? vn(t) : t)
    );
  },
  entries() {
    return xo(this, "entries", (e) => (e[1] = xt(this, e[1]), e));
  },
  every(e, t) {
    return St(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return St(
      this,
      "filter",
      e,
      t,
      (n) => n.map((r) => xt(this, r)),
      arguments
    );
  },
  find(e, t) {
    return St(
      this,
      "find",
      e,
      t,
      (n) => xt(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return St(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return St(
      this,
      "findLast",
      e,
      t,
      (n) => xt(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return St(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return St(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return yo(this, "includes", e);
  },
  indexOf(...e) {
    return yo(this, "indexOf", e);
  },
  join(e) {
    return vn(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return yo(this, "lastIndexOf", e);
  },
  map(e, t) {
    return St(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return Fn(this, "pop");
  },
  push(...e) {
    return Fn(this, "push", e);
  },
  reduce(e, ...t) {
    return $i(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return $i(this, "reduceRight", e, t);
  },
  shift() {
    return Fn(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return St(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return Fn(this, "splice", e);
  },
  toReversed() {
    return vn(this).toReversed();
  },
  toSorted(e) {
    return vn(this).toSorted(e);
  },
  toSpliced(...e) {
    return vn(this).toSpliced(...e);
  },
  unshift(...e) {
    return Fn(this, "unshift", e);
  },
  values() {
    return xo(this, "values", (e) => xt(this, e));
  }
};
function xo(e, t, n) {
  const r = io(e), o = r[t], i = o.call(r);
  if (r !== e && !/* @__PURE__ */ We(e)) {
    if (i[Symbol.toStringTag] === "Array Iterator") {
      const s = Object.create(Object.getPrototypeOf(i));
      return s.next = () => Bi(i.next(), n), o !== gl[t] && Object.defineProperties(s, {
        return: {
          get() {
            const l = i.return;
            return typeof l == "function" ? l.bind(i) : l;
          }
        },
        throw: {
          get() {
            const l = i.throw;
            return typeof l == "function" ? l.bind(i) : l;
          }
        }
      }), s;
    }
    i._next = i.next, i.next = () => Bi(i._next(), n);
  }
  return i;
}
function Bi(e, t) {
  return e.done || (e.value = t(e.value)), e;
}
const gl = Array.prototype;
function St(e, t, n, r, o, i) {
  const s = io(e), l = s !== e && !/* @__PURE__ */ We(e), a = s[t];
  if (a !== gl[t]) {
    const f = a.apply(e, i);
    return l ? ct(f) : f;
  }
  let c = n;
  s !== e && (l ? c = function(f, p) {
    return n.call(this, xt(e, f), p, e);
  } : n.length > 2 && (c = function(f, p) {
    return n.call(this, f, p, e);
  }));
  const u = a.call(s, c, r);
  return l && o ? o(u) : u;
}
function $i(e, t, n, r) {
  const o = io(e), i = o !== e && !/* @__PURE__ */ We(e);
  let s = n, l = !1;
  o !== e && (i ? (l = r.length === 0, s = function(c, u, f) {
    return l && (l = !1, c = xt(e, c)), n.call(this, c, xt(e, u), f, e);
  }) : n.length > 3 && (s = function(c, u, f) {
    return n.call(this, c, u, f, e);
  }));
  const a = o[t](s, ...r);
  return l ? xt(e, a) : a;
}
function yo(e, t, n) {
  const r = /* @__PURE__ */ le(e);
  Te(r, "iterate", qn);
  const o = r[t](...n);
  return (o === -1 || o === !1) && /* @__PURE__ */ $r(n[0]) ? (n[0] = /* @__PURE__ */ le(n[0]), r[t](...n)) : o;
}
function Fn(e, t, n = []) {
  st(), fi();
  const r = (/* @__PURE__ */ le(e))[t].apply(e, n);
  return di(), lt(), r;
}
const kc = /* @__PURE__ */ $t("__proto__,__v_isRef,__isVue"), ml = /* @__PURE__ */ new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_t)
);
function Cc(e) {
  _t(e) || (e = String(e));
  const t = /* @__PURE__ */ le(this);
  return Te(t, "has", e), t.hasOwnProperty(e);
}
class _l {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, r) {
    if (n === "__v_skip") return t.__v_skip;
    const o = this._isReadonly, i = this._isShallow;
    if (n === "__v_isReactive")
      return !o;
    if (n === "__v_isReadonly")
      return o;
    if (n === "__v_isShallow")
      return i;
    if (n === "__v_raw")
      return r === (o ? i ? El : wl : i ? yl : xl).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(r) ? t : void 0;
    const s = Z(t);
    if (!o) {
      let a;
      if (s && (a = Ec[n]))
        return a;
      if (n === "hasOwnProperty")
        return Cc;
    }
    const l = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ Re(t) ? t : r
    );
    if ((_t(n) ? ml.has(n) : kc(n)) || (o || Te(t, "get", n), i))
      return l;
    if (/* @__PURE__ */ Re(l)) {
      const a = s && ci(n) ? l : l.value;
      return o && pe(a) ? /* @__PURE__ */ Uo(a) : a;
    }
    return pe(l) ? o ? /* @__PURE__ */ Uo(l) : /* @__PURE__ */ Kn(l) : l;
  }
}
class bl extends _l {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, r, o) {
    let i = t[n];
    const s = Z(t) && ci(n);
    if (!this._isShallow) {
      const c = /* @__PURE__ */ at(i);
      if (!/* @__PURE__ */ We(r) && !/* @__PURE__ */ at(r) && (i = /* @__PURE__ */ le(i), r = /* @__PURE__ */ le(r)), !s && /* @__PURE__ */ Re(i) && !/* @__PURE__ */ Re(r))
        return c ? (process.env.NODE_ENV !== "production" && it(
          `Set operation on key "${String(n)}" failed: target is readonly.`,
          t[n]
        ), !0) : (i.value = r, !0);
    }
    const l = s ? Number(n) < t.length : ae(t, n), a = Reflect.set(
      t,
      n,
      r,
      /* @__PURE__ */ Re(t) ? t : o
    );
    return t === /* @__PURE__ */ le(o) && a && (l ? Et(r, i) && kt(t, "set", n, r, i) : kt(t, "add", n, r)), a;
  }
  deleteProperty(t, n) {
    const r = ae(t, n), o = t[n], i = Reflect.deleteProperty(t, n);
    return i && r && kt(t, "delete", n, void 0, o), i;
  }
  has(t, n) {
    const r = Reflect.has(t, n);
    return (!_t(n) || !ml.has(n)) && Te(t, "has", n), r;
  }
  ownKeys(t) {
    return Te(
      t,
      "iterate",
      Z(t) ? "length" : un
    ), Reflect.ownKeys(t);
  }
}
class vl extends _l {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return process.env.NODE_ENV !== "production" && it(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, n) {
    return process.env.NODE_ENV !== "production" && it(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const Dc = /* @__PURE__ */ new bl(), Rc = /* @__PURE__ */ new vl(), Ac = /* @__PURE__ */ new bl(!0), Nc = /* @__PURE__ */ new vl(!0), Jo = (e) => e, xr = (e) => Reflect.getPrototypeOf(e);
function Fc(e, t, n) {
  return function(...r) {
    const o = this.__v_raw, i = /* @__PURE__ */ le(o), s = Pt(i), l = e === "entries" || e === Symbol.iterator && s, a = e === "keys" && s, c = o[e](...r), u = n ? Jo : t ? qt : ct;
    return !t && Te(
      i,
      "iterate",
      a ? Lo : un
    ), xe(
      // inheriting all iterator properties
      Object.create(c),
      {
        // iterator protocol
        next() {
          const { value: f, done: p } = c.next();
          return p ? { value: f, done: p } : {
            value: l ? [u(f[0]), u(f[1])] : u(f),
            done: p
          };
        }
      }
    );
  };
}
function yr(e) {
  return function(...t) {
    if (process.env.NODE_ENV !== "production") {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      it(
        `${oo(e)} operation ${n}failed: target is readonly.`,
        /* @__PURE__ */ le(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Sc(e, t) {
  const n = {
    get(o) {
      const i = this.__v_raw, s = /* @__PURE__ */ le(i), l = /* @__PURE__ */ le(o);
      e || (Et(o, l) && Te(s, "get", o), Te(s, "get", l));
      const { has: a } = xr(s), c = t ? Jo : e ? qt : ct;
      if (a.call(s, o))
        return c(i.get(o));
      if (a.call(s, l))
        return c(i.get(l));
      i !== s && i.get(o);
    },
    get size() {
      const o = this.__v_raw;
      return !e && Te(/* @__PURE__ */ le(o), "iterate", un), o.size;
    },
    has(o) {
      const i = this.__v_raw, s = /* @__PURE__ */ le(i), l = /* @__PURE__ */ le(o);
      return e || (Et(o, l) && Te(s, "has", o), Te(s, "has", l)), o === l ? i.has(o) : i.has(o) || i.has(l);
    },
    forEach(o, i) {
      const s = this, l = s.__v_raw, a = /* @__PURE__ */ le(l), c = t ? Jo : e ? qt : ct;
      return !e && Te(a, "iterate", un), l.forEach((u, f) => o.call(i, c(u), c(f), s));
    }
  };
  return xe(
    n,
    e ? {
      add: yr("add"),
      set: yr("set"),
      delete: yr("delete"),
      clear: yr("clear")
    } : {
      add(o) {
        const i = /* @__PURE__ */ le(this), s = xr(i), l = /* @__PURE__ */ le(o), a = !t && !/* @__PURE__ */ We(o) && !/* @__PURE__ */ at(o) ? l : o;
        return s.has.call(i, a) || Et(o, a) && s.has.call(i, o) || Et(l, a) && s.has.call(i, l) || (i.add(a), kt(i, "add", a, a)), this;
      },
      set(o, i) {
        !t && !/* @__PURE__ */ We(i) && !/* @__PURE__ */ at(i) && (i = /* @__PURE__ */ le(i));
        const s = /* @__PURE__ */ le(this), { has: l, get: a } = xr(s);
        let c = l.call(s, o);
        c ? process.env.NODE_ENV !== "production" && zi(s, l, o) : (o = /* @__PURE__ */ le(o), c = l.call(s, o));
        const u = a.call(s, o);
        return s.set(o, i), c ? Et(i, u) && kt(s, "set", o, i, u) : kt(s, "add", o, i), this;
      },
      delete(o) {
        const i = /* @__PURE__ */ le(this), { has: s, get: l } = xr(i);
        let a = s.call(i, o);
        a ? process.env.NODE_ENV !== "production" && zi(i, s, o) : (o = /* @__PURE__ */ le(o), a = s.call(i, o));
        const c = l ? l.call(i, o) : void 0, u = i.delete(o);
        return a && kt(i, "delete", o, void 0, c), u;
      },
      clear() {
        const o = /* @__PURE__ */ le(this), i = o.size !== 0, s = process.env.NODE_ENV !== "production" ? Pt(o) ? new Map(o) : new Set(o) : void 0, l = o.clear();
        return i && kt(
          o,
          "clear",
          void 0,
          void 0,
          s
        ), l;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((o) => {
    n[o] = Fc(o, e, t);
  }), n;
}
function so(e, t) {
  const n = Sc(e, t);
  return (r, o, i) => o === "__v_isReactive" ? !e : o === "__v_isReadonly" ? e : o === "__v_isShallow" ? t : o === "__v_raw" ? r : Reflect.get(
    ae(n, o) && o in r ? n : r,
    o,
    i
  );
}
const Oc = {
  get: /* @__PURE__ */ so(!1, !1)
}, Tc = {
  get: /* @__PURE__ */ so(!1, !0)
}, Ic = {
  get: /* @__PURE__ */ so(!0, !1)
}, jc = {
  get: /* @__PURE__ */ so(!0, !0)
};
function zi(e, t, n) {
  const r = /* @__PURE__ */ le(n);
  if (r !== n && t.call(e, r)) {
    const o = ai(e);
    it(
      `Reactive ${o} contains both the raw and reactive versions of the same object${o === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
const xl = /* @__PURE__ */ new WeakMap(), yl = /* @__PURE__ */ new WeakMap(), wl = /* @__PURE__ */ new WeakMap(), El = /* @__PURE__ */ new WeakMap();
function Mc(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
// @__NO_SIDE_EFFECTS__
function Kn(e) {
  return /* @__PURE__ */ at(e) ? e : lo(
    e,
    !1,
    Dc,
    Oc,
    xl
  );
}
// @__NO_SIDE_EFFECTS__
function Vc(e) {
  return lo(
    e,
    !1,
    Ac,
    Tc,
    yl
  );
}
// @__NO_SIDE_EFFECTS__
function Uo(e) {
  return lo(
    e,
    !0,
    Rc,
    Ic,
    wl
  );
}
// @__NO_SIDE_EFFECTS__
function Je(e) {
  return lo(
    e,
    !0,
    Nc,
    jc,
    El
  );
}
function lo(e, t, n, r, o) {
  if (!pe(e))
    return process.env.NODE_ENV !== "production" && it(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = o.get(e);
  if (i)
    return i;
  const s = Mc(ai(e));
  if (s === 0)
    return e;
  const l = new Proxy(
    e,
    s === 2 ? r : n
  );
  return o.set(e, l), l;
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
  return /* @__PURE__ */ at(e) ? /* @__PURE__ */ Bt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function at(e) {
  return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function We(e) {
  return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function $r(e) {
  return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function le(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ le(t) : e;
}
function Pc(e) {
  return !ae(e, "__v_skip") && Object.isExtensible(e) && Br(e, "__v_skip", !0), e;
}
const ct = (e) => pe(e) ? /* @__PURE__ */ Kn(e) : e, qt = (e) => pe(e) ? /* @__PURE__ */ Uo(e) : e;
// @__NO_SIDE_EFFECTS__
function Re(e) {
  return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function me(e) {
  return kl(e, !1);
}
// @__NO_SIDE_EFFECTS__
function mt(e) {
  return kl(e, !0);
}
function kl(e, t) {
  return /* @__PURE__ */ Re(e) ? e : new Bc(e, t);
}
class Bc {
  constructor(t, n) {
    this.dep = new hi(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = n ? t : /* @__PURE__ */ le(t), this._value = n ? t : ct(t), this.__v_isShallow = n;
  }
  get value() {
    return process.env.NODE_ENV !== "production" ? this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }) : this.dep.track(), this._value;
  }
  set value(t) {
    const n = this._rawValue, r = this.__v_isShallow || /* @__PURE__ */ We(t) || /* @__PURE__ */ at(t);
    t = r ? t : /* @__PURE__ */ le(t), Et(t, n) && (this._rawValue = t, this._value = r ? t : ct(t), process.env.NODE_ENV !== "production" ? this.dep.trigger({
      target: this,
      type: "set",
      key: "value",
      newValue: t,
      oldValue: n
    }) : this.dep.trigger());
  }
}
function G(e) {
  return /* @__PURE__ */ Re(e) ? e.value : e;
}
function Ve(e) {
  return ee(e) ? e() : G(e);
}
const $c = {
  get: (e, t, n) => t === "__v_raw" ? e : G(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
    const o = e[t];
    return /* @__PURE__ */ Re(o) && !/* @__PURE__ */ Re(n) ? (o.value = n, !0) : Reflect.set(e, t, n, r);
  }
};
function Cl(e) {
  return /* @__PURE__ */ Bt(e) ? e : new Proxy(e, $c);
}
class zc {
  constructor(t, n, r) {
    this.fn = t, this.setter = n, this._value = void 0, this.dep = new hi(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = Hn - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !n, this.isSSR = r;
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags |= 16, !(this.flags & 8) && // avoid infinite self recursion
    ge !== this)
      return cl(this, !0), !0;
    process.env.NODE_ENV;
  }
  get value() {
    const t = process.env.NODE_ENV !== "production" ? this.dep.track({
      target: this,
      type: "get",
      key: "value"
    }) : this.dep.track();
    return dl(this), t && (t.version = this.dep.version), this._value;
  }
  set value(t) {
    this.setter ? this.setter(t) : process.env.NODE_ENV !== "production" && it("Write operation failed: computed value is readonly");
  }
}
// @__NO_SIDE_EFFECTS__
function Lc(e, t, n = !1) {
  let r, o;
  ee(e) ? r = e : (r = e.get, o = e.set);
  const i = new zc(r, o, n);
  return process.env.NODE_ENV, i;
}
const wr = {}, zr = /* @__PURE__ */ new WeakMap();
let on;
function Jc(e, t = !1, n = on) {
  if (n) {
    let r = zr.get(n);
    r || zr.set(n, r = []), r.push(e);
  } else process.env.NODE_ENV !== "production" && !t && it(
    "onWatcherCleanup() was called when there was no active watcher to associate with."
  );
}
function Uc(e, t, n = _e) {
  const { immediate: r, deep: o, once: i, scheduler: s, augmentJob: l, call: a } = n, c = (b) => {
    (n.onWarn || it)(
      "Invalid watch source: ",
      b,
      "A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types."
    );
  }, u = (b) => o ? b : /* @__PURE__ */ We(b) || o === !1 || o === 0 ? jt(b, 1) : jt(b);
  let f, p, d, g, _ = !1, E = !1;
  if (/* @__PURE__ */ Re(e) ? (p = () => e.value, _ = /* @__PURE__ */ We(e)) : /* @__PURE__ */ Bt(e) ? (p = () => u(e), _ = !0) : Z(e) ? (E = !0, _ = e.some((b) => /* @__PURE__ */ Bt(b) || /* @__PURE__ */ We(b)), p = () => e.map((b) => {
    if (/* @__PURE__ */ Re(b))
      return b.value;
    if (/* @__PURE__ */ Bt(b))
      return u(b);
    if (ee(b))
      return a ? a(b, 2) : b();
    process.env.NODE_ENV !== "production" && c(b);
  })) : ee(e) ? t ? p = a ? () => a(e, 2) : e : p = () => {
    if (d) {
      st();
      try {
        d();
      } finally {
        lt();
      }
    }
    const b = on;
    on = f;
    try {
      return a ? a(e, 3, [g]) : e(g);
    } finally {
      on = b;
    }
  } : (p = Ne, process.env.NODE_ENV !== "production" && c(e)), t && o) {
    const b = p, N = o === !0 ? 1 / 0 : o;
    p = () => jt(b(), N);
  }
  const T = sl(), A = () => {
    f.stop(), T && T.active && si(T.effects, f);
  };
  if (i && t) {
    const b = t;
    t = (...N) => {
      try {
        return b(...N);
      } finally {
        A();
      }
    };
  }
  let w = E ? new Array(e.length).fill(wr) : wr;
  const C = (b) => {
    if (!(!(f.flags & 1) || !f.dirty && !b))
      if (t) {
        const N = f.run();
        if (b || o || _ || (E ? N.some((L, Q) => Et(L, w[Q])) : Et(N, w))) {
          const L = on;
          st();
          try {
            d && d(), on = f;
            const Q = [
              N,
              // pass undefined as the old value when it's changed for the first time
              w === wr ? void 0 : E && w[0] === wr ? [] : w,
              g
            ];
            w = N, a ? a(t, 3, Q) : (
              // @ts-expect-error
              t(...Q)
            );
          } finally {
            on = L, lt();
          }
        }
      } else
        f.run();
  };
  return l && l(C), f = new ll(p), f.scheduler = s ? () => s(C, !1) : C, g = (b) => Jc(b, !1, f), d = f.onStop = () => {
    const b = zr.get(f);
    if (b) {
      if (a)
        a(b, 4);
      else
        for (const N of b) N();
      zr.delete(f);
    }
  }, process.env.NODE_ENV !== "production" && (f.onTrack = n.onTrack, f.onTrigger = n.onTrigger), t ? r ? C(!0) : w = f.run() : s ? s(C.bind(null, !0), !0) : f.run(), A.pause = f.pause.bind(f), A.resume = f.resume.bind(f), A.stop = A, A;
}
function jt(e, t = 1 / 0, n) {
  if (t <= 0 || !pe(e) || e.__v_skip || (n = n || /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t))
    return e;
  if (n.set(e, t), t--, /* @__PURE__ */ Re(e))
    jt(e.value, t, n);
  else if (Z(e))
    for (let r = 0; r < e.length; r++)
      jt(e[r], t, n);
  else if (gn(e) || Pt(e))
    e.forEach((r) => {
      jt(r, t, n);
    });
  else if (no(e)) {
    for (const r in e)
      jt(e[r], t, n);
    for (const r of Object.getOwnPropertySymbols(e))
      Object.prototype.propertyIsEnumerable.call(e, r) && jt(e[r], t, n);
  }
  return e;
}
/**
* @vue/runtime-core v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
const fn = [];
function Or(e) {
  fn.push(e);
}
function Tr() {
  fn.pop();
}
let wo = !1;
function P(e, ...t) {
  if (wo) return;
  wo = !0, st();
  const n = fn.length ? fn[fn.length - 1].component : null, r = n && n.appContext.config.warnHandler, o = Wc();
  if (r)
    An(
      r,
      n,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        e + t.map((i) => {
          var s, l;
          return (l = (s = i.toString) == null ? void 0 : s.call(i)) != null ? l : JSON.stringify(i);
        }).join(""),
        n && n.proxy,
        o.map(
          ({ vnode: i }) => `at <${mr(n, i.type)}>`
        ).join(`
`),
        o
      ]
    );
  else {
    const i = [`[Vue warn]: ${e}`, ...t];
    o.length && i.push(`
`, ...Hc(o)), console.warn(...i);
  }
  lt(), wo = !1;
}
function Wc() {
  let e = fn[fn.length - 1];
  if (!e)
    return [];
  const t = [];
  for (; e; ) {
    const n = t[0];
    n && n.vnode === e ? n.recurseCount++ : t.push({
      vnode: e,
      recurseCount: 0
    });
    const r = e.component && e.component.parent;
    e = r && r.vnode;
  }
  return t;
}
function Hc(e) {
  const t = [];
  return e.forEach((n, r) => {
    t.push(...r === 0 ? [] : [`
`], ...qc(n));
  }), t;
}
function qc({ vnode: e, recurseCount: t }) {
  const n = t > 0 ? `... (${t} recursive calls)` : "", r = e.component ? e.component.parent == null : !1, o = ` at <${mr(
    e.component,
    e.type,
    r
  )}`, i = ">" + n;
  return e.props ? [o, ...Kc(e.props), i] : [o + i];
}
function Kc(e) {
  const t = [], n = Object.keys(e);
  return n.slice(0, 3).forEach((r) => {
    t.push(...Dl(r, e[r]));
  }), n.length > 3 && t.push(" ..."), t;
}
function Dl(e, t, n) {
  return ye(t) ? (t = JSON.stringify(t), n ? t : [`${e}=${t}`]) : typeof t == "number" || typeof t == "boolean" || t == null ? n ? t : [`${e}=${t}`] : /* @__PURE__ */ Re(t) ? (t = Dl(e, /* @__PURE__ */ le(t.value), !0), n ? t : [`${e}=Ref<`, t, ">"]) : ee(t) ? [`${e}=fn${t.name ? `<${t.name}>` : ""}`] : (t = /* @__PURE__ */ le(t), n ? t : [`${e}=`, t]);
}
const gi = {
  sp: "serverPrefetch hook",
  bc: "beforeCreate hook",
  c: "created hook",
  bm: "beforeMount hook",
  m: "mounted hook",
  bu: "beforeUpdate hook",
  u: "updated",
  bum: "beforeUnmount hook",
  um: "unmounted hook",
  a: "activated hook",
  da: "deactivated hook",
  ec: "errorCaptured hook",
  rtc: "renderTracked hook",
  rtg: "renderTriggered hook",
  0: "setup function",
  1: "render function",
  2: "watcher getter",
  3: "watcher callback",
  4: "watcher cleanup function",
  5: "native event handler",
  6: "component event handler",
  7: "vnode hook",
  8: "directive hook",
  9: "transition hook",
  10: "app errorHandler",
  11: "app warnHandler",
  12: "ref function",
  13: "async component loader",
  14: "scheduler flush",
  15: "component update",
  16: "app unmount cleanup function"
};
function An(e, t, n, r) {
  try {
    return r ? e(...r) : e();
  } catch (o) {
    dr(o, t, n);
  }
}
function bt(e, t, n, r) {
  if (ee(e)) {
    const o = An(e, t, n, r);
    return o && li(o) && o.catch((i) => {
      dr(i, t, n, void 0, !0);
    }), o;
  }
  if (Z(e)) {
    const o = [];
    for (let i = 0; i < e.length; i++)
      o.push(bt(e[i], t, n, r));
    return o;
  } else process.env.NODE_ENV !== "production" && P(
    `Invalid value type passed to callWithAsyncErrorHandling(): ${typeof e}`
  );
}
function dr(e, t, n, r = !0, o = !1) {
  const i = t ? t.vnode : null, { errorHandler: s, throwUnhandledErrorInProduction: l } = t && t.appContext.config || _e;
  if (t) {
    let a = t.parent;
    const c = t.proxy, u = process.env.NODE_ENV !== "production" ? gi[n] : `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; a; ) {
      const f = a.ec;
      if (f && !a.isUnmounted && // Async failures may outlive stopped scopes whose unmount effects
      // are deferred or discarded by Suspense.
      (!o || a.scope.active)) {
        for (let p = 0; p < f.length; p++)
          if (f[p](e, c, u) === !1)
            return;
      }
      a = a.parent;
    }
    if (s) {
      st(), An(s, null, 10, [
        e,
        c,
        u
      ]), lt();
      return;
    }
  }
  Zc(e, n, i, r, l);
}
function Zc(e, t, n, r = !0, o = !1) {
  if (process.env.NODE_ENV !== "production") {
    const i = gi[t];
    if (n && Or(n), P(`Unhandled error${i ? ` during execution of ${i}` : ""}`), n && Tr(), r)
      throw e;
    console.error(e);
  } else {
    if (o)
      throw e;
    console.error(e);
  }
}
const Le = [];
let dt = -1;
const yt = [];
let Ut = null, En = 0;
const Rl = /* @__PURE__ */ Promise.resolve();
let Lr = null;
const Xc = 100;
function Mt(e) {
  const t = Lr || Rl;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function Yc(e) {
  let t = dt + 1, n = Le.length;
  for (; t < n; ) {
    const r = t + n >>> 1, o = Le[r], i = Xn(o);
    i < e || i === e && o.flags & 2 ? t = r + 1 : n = r;
  }
  return t;
}
function Zn(e) {
  if (!(e.flags & 1)) {
    const t = Xn(e), n = Le[Le.length - 1];
    !n || // fast path when the job id is larger than the tail
    !(e.flags & 2) && t >= Xn(n) ? Le.push(e) : Le.splice(Yc(t), 0, e), e.flags |= 1, Al();
  }
}
function Al() {
  Lr || (Lr = Rl.then(Sl));
}
function Wo(e) {
  if (!Z(e))
    Ut && e.id === -1 ? Ut.splice(En + 1, 0, e) : e.flags & 1 || (yt.push(e), e.flags |= 1);
  else
    for (let t = 0; t < e.length; t++)
      yt.push(e[t]);
  Al();
}
function Nl(e, t, n, r = dt + 1) {
  for (process.env.NODE_ENV !== "production" && (n = n || /* @__PURE__ */ new Map()); r < Le.length; r++) {
    const o = Le[r];
    if (o && o.flags & 2) {
      if (e && o.id !== e.uid || t !== void 0 && !(o.id >= t) || process.env.NODE_ENV !== "production" && mi(n, o))
        continue;
      Le.splice(r, 1), r = e ? r - 1 : dt, o.flags & 4 && (o.flags &= -2), o(), o.flags & 4 || (o.flags &= -2);
    }
  }
}
function Fl(e, t, n = 0) {
  if (yt.length) {
    let r = yt, o = 0;
    if (t) {
      r = [];
      for (let s = 0; s < yt.length; s++) {
        const l = yt[s];
        (l.i !== void 0 ? !l.i || l.i.uid < n : t.has(l)) ? yt[o++] = l : r.push(l);
      }
    }
    const i = [...new Set(r)].sort((s, l) => Xn(s) - Xn(l));
    if (yt.length = o, Ut) {
      for (let s = 0; s < i.length; s++)
        Ut.push(i[s]);
      return;
    }
    for (Ut = i, process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map()), En = 0; En < Ut.length; En++) {
      const s = Ut[En];
      process.env.NODE_ENV !== "production" && mi(e, s) || (s.flags & 4 && (s.flags &= -2), s.flags & 8 || s(), s.flags &= -2);
    }
    Ut = null, En = 0;
  }
}
let Eo = !1;
function Gc(e, t) {
  if (Eo) {
    e();
    return;
  }
  const n = t === void 0 ? void 0 : new Set(yt);
  e(), Eo = !0;
  try {
    Nl(void 0, t), Fl(void 0, n, t);
  } finally {
    Eo = !1;
  }
}
const Xn = (e) => e.id == null ? e.flags & 2 ? -1 : 1 / 0 : e.id;
function Sl(e) {
  process.env.NODE_ENV !== "production" && (e = e || /* @__PURE__ */ new Map());
  const t = process.env.NODE_ENV !== "production" ? (n) => mi(e, n) : Ne;
  try {
    for (dt = 0; dt < Le.length; dt++) {
      const n = Le[dt];
      if (n && !(n.flags & 8)) {
        if (process.env.NODE_ENV !== "production" && t(n))
          continue;
        n.flags & 4 && (n.flags &= -2), An(
          n,
          n.i,
          n.i ? 15 : 14
        ), n.flags & 4 || (n.flags &= -2);
      }
    }
  } finally {
    for (; dt < Le.length; dt++) {
      const n = Le[dt];
      n && (n.flags &= -2);
    }
    dt = -1, Le.length = 0, Fl(e), Lr = null, (Le.length || yt.length) && Sl(e);
  }
}
function mi(e, t) {
  const n = e.get(t) || 0;
  if (n > Xc) {
    const r = t.i, o = r && ha(r.type);
    return dr(
      `Maximum recursive updates exceeded${o ? ` in component <${o}>` : ""}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`,
      null,
      10
    ), !0;
  }
  return e.set(t, n + 1), !1;
}
let nt = !1;
const Li = (e) => {
  try {
    return nt;
  } finally {
    nt = e;
  }
}, sn = /* @__PURE__ */ new Map();
process.env.NODE_ENV !== "production" && (fr().__VUE_HMR_RUNTIME__ = {
  createRecord: ko(Ol),
  rerender: ko(tu),
  reload: ko(nu)
});
const mn = /* @__PURE__ */ new Map();
function Qc(e) {
  const t = e.type.__hmrId;
  let n = mn.get(t);
  n || (Ol(t, e.type), n = mn.get(t)), n.instances.add(e);
}
function eu(e) {
  mn.get(e.type.__hmrId).instances.delete(e);
}
function Ol(e, t) {
  return mn.has(e) ? !1 : (mn.set(e, {
    initialDef: Jr(t),
    instances: /* @__PURE__ */ new Set()
  }), !0);
}
function Jr(e) {
  return ga(e) ? e.__vccOpts : e;
}
function tu(e, t) {
  const n = mn.get(e);
  n && (n.initialDef.render = t, [...n.instances].forEach((r) => {
    t && (r.render = t, Jr(r.type).render = t), r.renderCache = [], nt = !0, r.job.flags & 8 || r.update(), nt = !1;
  }));
}
function nu(e, t) {
  const n = mn.get(e);
  if (!n) return;
  t = Jr(t), Ji(n.initialDef, t);
  const r = [...n.instances];
  for (let o = 0; o < r.length; o++) {
    const i = r[o], s = Jr(i.type);
    let l = sn.get(s);
    if (l || (s !== n.initialDef && Ji(s, t), sn.set(s, l = /* @__PURE__ */ new Set())), l.add(i), i.appContext.propsCache.delete(i.type), i.appContext.emitsCache.delete(i.type), i.appContext.optionsCache.delete(i.type), i.ceReload)
      l.add(i), i.ceReload(t.styles), l.delete(i);
    else if (i.parent) {
      const a = () => {
        if (!i.scope.active) return;
        const c = i.asyncDep && !i.asyncResolved ? i : wi(i.parent);
        if (c) {
          c.asyncDep.catch(Ne).then(() => {
            i.scope.active && (c.asyncResolved || !c.scope.active) && Zn(a);
          });
          return;
        }
        l = sn.get(s), l || sn.set(s, l = /* @__PURE__ */ new Set()), l.add(i), nt = !0;
        try {
          i.parent.update();
        } finally {
          nt = !1, l.delete(i), Wo(() => sn.clear());
        }
      };
      Zn(a);
    } else i.appContext.reload ? i.appContext.reload() : typeof window < "u" ? window.location.reload() : console.warn(
      "[HMR] Root or manually mounted instance modified. Full reload required."
    );
    i.root.ce && i !== i.root && i.root.ce._removeChildStyle(s);
  }
  Wo(() => {
    sn.clear();
  });
}
function Ji(e, t) {
  xe(e, t);
  for (const n in e)
    n !== "__file" && !(n in t) && delete e[n];
}
function ko(e) {
  return (t, n) => {
    try {
      return e(t, n);
    } catch (r) {
      console.error(r), console.warn(
        "[HMR] Something went wrong during Vue component hot-reload. Full reload required."
      );
    }
  };
}
let ht, In = [], Ho = !1;
function pr(e, ...t) {
  ht ? ht.emit(e, ...t) : Ho || In.push({ event: e, args: t });
}
function _i(e, t) {
  var n, r;
  ht = e, ht ? (ht.enabled = !0, In.forEach(({ event: o, args: i }) => ht.emit(o, ...i)), In = []) : /* handle late devtools injection - only do this if we are in an actual */ /* browser environment to avoid the timer handle stalling test runner exit */ /* (#4815) */ typeof window < "u" && // some envs mock window but not fully
  window.HTMLElement && // also exclude jsdom
  // eslint-disable-next-line no-restricted-syntax
  !((r = (n = window.navigator) == null ? void 0 : n.userAgent) != null && r.includes("jsdom")) ? ((t.__VUE_DEVTOOLS_HOOK_REPLAY__ = t.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((i) => {
    _i(i, t);
  }), setTimeout(() => {
    ht || (t.__VUE_DEVTOOLS_HOOK_REPLAY__ = null, Ho = !0, In = []);
  }, 3e3)) : (Ho = !0, In = []);
}
function ru(e, t) {
  pr("app:init", e, t, {
    Fragment: Ee,
    Text: hr,
    Comment: Xe,
    Static: Mr
  });
}
function ou(e) {
  pr("app:unmount", e);
}
const iu = /* @__PURE__ */ bi(
  "component:added"
  /* COMPONENT_ADDED */
), Tl = /* @__PURE__ */ bi(
  "component:updated"
  /* COMPONENT_UPDATED */
), su = /* @__PURE__ */ bi(
  "component:removed"
  /* COMPONENT_REMOVED */
), lu = (e) => {
  ht && typeof ht.cleanupBuffer == "function" && // remove the component if it wasn't buffered
  !ht.cleanupBuffer(e) && su(e);
};
// @__NO_SIDE_EFFECTS__
function bi(e) {
  return (t) => {
    pr(
      e,
      t.appContext.app,
      t.uid,
      t.parent ? t.parent.uid : void 0,
      t
    );
  };
}
const au = /* @__PURE__ */ Il(
  "perf:start"
  /* PERFORMANCE_START */
), cu = /* @__PURE__ */ Il(
  "perf:end"
  /* PERFORMANCE_END */
);
function Il(e) {
  return (t, n, r) => {
    pr(e, t.appContext.app, t.uid, t, n, r);
  };
}
function uu(e, t, n) {
  pr(
    "component:emit",
    e.appContext.app,
    e,
    t,
    n
  );
}
let Ue = null, jl = null;
function Ur(e) {
  const t = Ue;
  return Ue = e, jl = e && e.type.__scopeId || null, t;
}
function fu(e, t = Ue, n) {
  if (!t || e._n)
    return e;
  const r = (...o) => {
    r._d && is(-1);
    const i = Ur(t), s = pn.length;
    let l;
    try {
      l = e(...o);
    } finally {
      for (let a = pn.length; a > s; a--) ia();
      Ur(i), r._d && is(1);
    }
    return process.env.NODE_ENV !== "production" && Tl(t), l;
  };
  return r._n = !0, r._c = !0, r._d = !0, r;
}
function Ml(e) {
  tc(e) && P("Do not use built-in directive ids as custom directive id: " + e);
}
function Ui(e, t) {
  if (Ue === null)
    return process.env.NODE_ENV !== "production" && P("withDirectives can only be used inside render functions."), e;
  const n = go(Ue), r = e.dirs || (e.dirs = []);
  for (let o = 0; o < t.length; o++) {
    let [i, s, l, a = _e] = t[o];
    i && (ee(i) && (i = {
      mounted: i,
      updated: i
    }), i.deep && jt(s), r.push({
      dir: i,
      instance: n,
      value: s,
      oldValue: void 0,
      arg: l,
      modifiers: a
    }));
  }
  return e;
}
function Qt(e, t, n, r) {
  let o = e;
  if (r === "beforeMount")
    e._mount = e;
  else if (r === "beforeUpdate") {
    const l = t && t._mount;
    l && (l._latest = e, e._mount = l);
  } else if (r === "mounted") {
    const l = e._latest;
    e._mount = e._latest = void 0, l && (o = l, l._mount = void 0);
  }
  const i = o.dirs, s = t && t.dirs;
  for (let l = 0; l < i.length; l++) {
    let a = i[l];
    s ? a.oldValue = s[l].value : r === "mounted" && a.oldValue !== void 0 && (a = xe({}, a, { oldValue: void 0 }));
    let c = a.dir[r];
    c && (st(), bt(c, n, 8, [
      e.el,
      a,
      o,
      t
    ]), lt());
  }
}
function du(e, t) {
  if (process.env.NODE_ENV !== "production" && (!Oe || Oe.isMounted) && P("provide() can only be used inside setup()."), Oe) {
    let n = Oe.provides;
    const r = Oe.parent && Oe.parent.provides;
    r === n && (n = Oe.provides = Object.create(r)), n[e] = t;
  }
}
function Ir(e, t, n = !1) {
  const r = ho();
  if (r || kn) {
    let o = kn ? kn._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
    if (o && e in o)
      return o[e];
    if (arguments.length > 1)
      return n && ee(t) ? t.call(r && r.proxy) : t;
    process.env.NODE_ENV !== "production" && P(`injection "${String(e)}" not found.`);
  } else process.env.NODE_ENV !== "production" && P("inject() can only be used inside setup() or functional components.");
}
const pu = /* @__PURE__ */ Symbol.for("v-scx"), hu = () => {
  {
    const e = Ir(pu);
    return e || process.env.NODE_ENV !== "production" && P(
      "Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build."
    ), e;
  }
};
function $n(e, t, n) {
  return process.env.NODE_ENV !== "production" && !ee(t) && P(
    "`watch(fn, options?)` signature has been moved to a separate API. Use `watchEffect(fn, options?)` instead. `watch` now only supports `watch(source, cb, options?) signature."
  ), Vl(e, t, n);
}
function Vl(e, t, n = _e) {
  const { immediate: r, deep: o, flush: i, once: s } = n;
  process.env.NODE_ENV !== "production" && !t && (r !== void 0 && P(
    'watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.'
  ), o !== void 0 && P(
    'watch() "deep" option is only respected when using the watch(source, callback, options?) signature.'
  ), s !== void 0 && P(
    'watch() "once" option is only respected when using the watch(source, callback, options?) signature.'
  ));
  const l = xe({}, n);
  process.env.NODE_ENV !== "production" && (l.onWarn = P);
  const a = t && r || !t && i !== "post";
  let c;
  if (er) {
    if (i === "sync") {
      const d = hu();
      c = d.__watcherHandles || (d.__watcherHandles = []);
    } else if (!a) {
      const d = () => {
      };
      return d.stop = Ne, d.resume = Ne, d.pause = Ne, d;
    }
  }
  const u = Oe;
  l.call = (d, g, _) => bt(d, u, g, _);
  let f = !1;
  i === "post" ? l.scheduler = (d) => {
    d.i = u, ze(d, u && u.suspense);
  } : i !== "sync" && (f = !0, l.scheduler = (d, g) => {
    g ? d() : Zn(d);
  }), l.augmentJob = (d) => {
    t && (d.flags |= 4), f && (d.flags |= 2, u && (d.id = u.uid, d.i = u));
  };
  const p = Uc(e, t, l);
  return er && (c ? c.push(p) : a && p()), p;
}
function gu(e, t, n) {
  const r = this.proxy, o = ye(e) ? e.includes(".") ? Pl(r, e) : () => r[e] : e.bind(r, r);
  let i;
  ee(t) ? i = t : (i = t.handler, n = t);
  const s = gr(this), l = Vl(o, i.bind(r), n);
  return s(), l;
}
function Pl(e, t) {
  const n = t.split(".");
  return () => {
    let r = e;
    for (let o = 0; o < n.length && r; o++)
      r = r[n[o]];
    return r;
  };
}
const mu = /* @__PURE__ */ Symbol("_vte"), ao = (e) => e.__isTeleport, Co = /* @__PURE__ */ Symbol("_leaveCb");
function _u(e) {
  let t = e[0];
  if (e.length > 1) {
    let n = !1;
    for (const r of e)
      if (r.type !== Xe) {
        if (process.env.NODE_ENV !== "production" && n) {
          P(
            "<transition> can only be used on a single element or component. Use <transition-group> for lists."
          );
          break;
        }
        if (t = r, n = !0, process.env.NODE_ENV === "production") break;
      }
  }
  return t;
}
function Bl(e) {
  if (!co(e))
    return ao(e.type) && e.children ? _u(e.children) : e;
  if (e.component)
    return e.component.subTree;
  const { shapeFlag: t, children: n } = e;
  if (n) {
    if (t & 16)
      return n[0];
    if (t & 32 && ee(n.default))
      return n.default();
  }
}
function zn(e, t) {
  if (e.shapeFlag & 6 && e.component) {
    e.transition = t;
    const n = e.component.subTree;
    zn(
      ao(n.type) && Bl(n) || n,
      t
    );
  } else if (e.shapeFlag & 128) {
    const n = e.suspense;
    if (n) {
      const r = n.isHydrating ? n.pendingBranch : n.activeBranch;
      r && zn(r, t.clone(r));
    } else
      e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback);
  } else if (e.transition = t, e.type === Ee && Z(e.children)) {
    const n = Nn(e.children, !1);
    n && zn(n, t);
  }
}
function qo(e) {
  if (e.component)
    return qo(e.component.subTree);
  if (e.type === Ee) {
    const t = Z(e.children) && Nn(e.children, !1);
    return t ? qo(t) : void 0;
  }
  if (e.type !== Xe)
    return e;
}
// @__NO_SIDE_EFFECTS__
function $l(e, t) {
  return ee(e) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    xe({ name: e.name }, t, { setup: e })
  ) : e;
}
function zl(e) {
  e.ids = [e.ids[0] + e.ids[2]++ + "-", 0, 0];
}
const Wi = /* @__PURE__ */ new WeakSet();
function Hi(e, t) {
  let n;
  return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
const Wr = /* @__PURE__ */ new WeakMap();
function Ln(e, t, n, r, o = !1) {
  if (Z(e)) {
    e.forEach(
      (_, E) => Ln(
        _,
        t && (Z(t) ? t[E] : t),
        n,
        r,
        o
      )
    );
    return;
  }
  if (Jn(r) && !o) {
    r.shapeFlag & 512 && r.type.__asyncResolved && r.component.subTree.component && Ln(e, t, n, r.component.subTree);
    return;
  }
  const i = r.shapeFlag & 4 ? go(r.component) : r.el, s = o ? null : i, { i: l, r: a } = e;
  if (process.env.NODE_ENV !== "production" && !l) {
    P(
      "Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function."
    );
    return;
  }
  const c = t && t.r, u = l.refs === _e ? l.refs = {} : l.refs, f = l.setupState, p = /* @__PURE__ */ le(f), d = f === _e ? tl : (_) => process.env.NODE_ENV !== "production" && (ae(p, _) && !/* @__PURE__ */ Re(p[_]) && P(
    `Template ref "${_}" used on a non-ref value. It will not work in the production build.`
  ), Wi.has(p[_])) || Hi(u, _) ? !1 : ae(p, _), g = (_, E) => !(process.env.NODE_ENV !== "production" && Wi.has(_) || E && Hi(u, E));
  if (c != null && c !== a) {
    if (qi(t), ye(c))
      u[c] = null, d(c) && (f[c] = null);
    else if (/* @__PURE__ */ Re(c)) {
      const _ = t;
      g(c, _.k) && (c.value = null), _.k && (u[_.k] = null);
    }
  }
  if (ee(a))
    An(a, l, 12, [s, u]);
  else {
    const _ = ye(a), E = /* @__PURE__ */ Re(a);
    if (_ || E) {
      const T = () => {
        if (e.f) {
          const A = _ ? d(a) ? f[a] : u[a] : g(a) || !e.k ? a.value : u[e.k];
          if (o)
            Z(A) && si(A, i);
          else if (Z(A))
            A.includes(i) || A.push(i);
          else if (_)
            u[a] = [i], d(a) && (f[a] = u[a]);
          else {
            const w = [i];
            g(a, e.k) && (a.value = w), e.k && (u[e.k] = w);
          }
        } else _ ? (u[a] = s, d(a) && (f[a] = s)) : E ? (g(a, e.k) && (a.value = s), e.k && (u[e.k] = s)) : process.env.NODE_ENV !== "production" && P("Invalid template ref type:", a, `(${typeof a})`);
      };
      if (s) {
        const A = () => {
          T(), Wr.delete(e);
        };
        A.id = -1, Wr.set(e, A), ze(A, n);
      } else
        qi(e), T();
    } else process.env.NODE_ENV !== "production" && P("Invalid template ref type:", a, `(${typeof a})`);
  }
}
function qi(e) {
  const t = Wr.get(e);
  t && (t.flags |= 8, Wr.delete(e));
}
fr().requestIdleCallback;
fr().cancelIdleCallback;
const Jn = (e) => !!e.type.__asyncLoader, co = (e) => e.type.__isKeepAlive;
function bu(e, t) {
  Ll(e, "a", t);
}
function vu(e, t) {
  Ll(e, "da", t);
}
function Ll(e, t, n = Oe) {
  const r = e.__wdc || (e.__wdc = () => {
    let o = n;
    for (; o; ) {
      if (o.isDeactivated)
        return;
      o = o.parent;
    }
    return e();
  });
  if (Yn(t, r, n), n) {
    let o = n.parent;
    for (; o && o.parent; )
      co(o.parent.vnode) && xu(r, t, n, o), o = o.parent;
  }
}
function xu(e, t, n, r) {
  const o = Yn(
    t,
    e,
    r,
    !0
    /* prepend */
  ), i = Yn(
    "um",
    () => si(r[t], o),
    n
  );
  i.flags = 16;
}
function Yn(e, t, n = Oe, r = !1) {
  if (n) {
    const o = n[e] || (n[e] = []), i = t.__weh || (t.__weh = (...s) => {
      st();
      const l = gr(n), a = bt(t, n, e, s);
      return l(), lt(), a;
    });
    return r ? o.unshift(i) : o.push(i), i;
  } else if (process.env.NODE_ENV !== "production") {
    const o = rn(gi[e].replace(/ hook$/, ""));
    P(
      `${o} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`
    );
  }
}
const zt = (e) => (t, n = Oe) => {
  (!er || e === "sp") && Yn(e, (...r) => t(...r), n);
}, yu = zt("bm"), uo = zt("m"), wu = zt(
  "bu"
), Eu = zt("u"), ku = zt(
  "bum"
), Cu = zt("um"), Du = zt(
  "sp"
), Ru = zt("rtg"), Au = zt("rtc");
function Nu(e, t = Oe) {
  Yn("ec", e, t);
}
const Fu = /* @__PURE__ */ Symbol.for("v-ndc");
function ot(e, t, n, r) {
  let o;
  const i = n, s = Z(e);
  if (s || ye(e)) {
    const l = s && /* @__PURE__ */ Bt(e);
    let a = !1, c = !1;
    l && (a = !/* @__PURE__ */ We(e), c = /* @__PURE__ */ at(e), e = io(e)), o = new Array(e.length);
    for (let u = 0, f = e.length; u < f; u++)
      o[u] = t(
        a ? c ? qt(ct(e[u])) : ct(e[u]) : e[u],
        u,
        void 0,
        i
      );
  } else if (typeof e == "number")
    if (!Number.isInteger(e) || e < 0)
      process.env.NODE_ENV !== "production" && P(
        `The v-for range expects a positive integer value but got ${e}.`
      ), o = [];
    else {
      o = new Array(e);
      for (let l = 0; l < e; l++)
        o[l] = t(l + 1, l, void 0, i);
    }
  else if (pe(e))
    if (e[Symbol.iterator])
      o = Array.from(
        e,
        (l, a) => t(l, a, void 0, i)
      );
    else {
      const l = Object.keys(e);
      o = new Array(l.length);
      for (let a = 0, c = l.length; a < c; a++) {
        const u = l[a];
        o[a] = t(e[u], u, a, i);
      }
    }
  else
    o = [];
  return o;
}
const Ko = (e) => e ? da(e) ? go(e) : Ko(e.parent) : null, Su = (e) => {
  let t = !1;
  for (; ; ) {
    if (e.patchFlag > 0 && e.patchFlag & 2048) {
      const o = Nn(e.children);
      if (!o)
        return;
      e = o, t = !0;
      continue;
    }
    const n = e.component;
    if (n && n.subTree) {
      e = n.subTree;
      continue;
    }
    const r = e.suspense;
    if (r && r.activeBranch) {
      e = r.activeBranch;
      continue;
    }
    return t ? e.el : void 0;
  }
}, Ou = (e) => {
  const t = e.subTree && Su(e.subTree);
  return t === void 0 ? e.vnode.el : t;
}, dn = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ xe(/* @__PURE__ */ Object.create(null), {
    $: (e) => e,
    $el: (e) => process.env.NODE_ENV !== "production" ? Ou(e) : e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => process.env.NODE_ENV !== "production" ? /* @__PURE__ */ Je(e.props) : e.props,
    $attrs: (e) => process.env.NODE_ENV !== "production" ? /* @__PURE__ */ Je(e.attrs) : e.attrs,
    $slots: (e) => process.env.NODE_ENV !== "production" ? /* @__PURE__ */ Je(e.slots) : e.slots,
    $refs: (e) => process.env.NODE_ENV !== "production" ? /* @__PURE__ */ Je(e.refs) : e.refs,
    $parent: (e) => Ko(e.parent),
    $root: (e) => Ko(e.root),
    $host: (e) => e.ce,
    $emit: (e) => e.emit,
    $options: (e) => Wl(e),
    $forceUpdate: (e) => e.f || (e.f = () => {
      Zn(e.update);
    }),
    $nextTick: (e) => e.n || (e.n = Mt.bind(e.proxy)),
    $watch: (e) => gu.bind(e)
  })
), vi = (e) => e === "_" || e === "$", Do = (e, t) => e !== _e && !e.__isScriptSetup && ae(e, t), Jl = {
  get({ _: e }, t) {
    if (t === "__v_skip")
      return !0;
    const { ctx: n, setupState: r, data: o, props: i, accessCache: s, type: l, appContext: a } = e;
    if (process.env.NODE_ENV !== "production" && t === "__isVue")
      return !0;
    if (t[0] !== "$") {
      const p = s[t];
      if (p !== void 0)
        switch (p) {
          case 1:
            return r[t];
          case 2:
            return o[t];
          case 4:
            return n[t];
          case 3:
            return i[t];
        }
      else {
        if (Do(r, t))
          return s[t] = 1, r[t];
        if (o !== _e && ae(o, t))
          return s[t] = 2, o[t];
        if (ae(i, t))
          return s[t] = 3, i[t];
        if (n !== _e && ae(n, t))
          return s[t] = 4, n[t];
        Zo && (s[t] = 0);
      }
    }
    const c = dn[t];
    let u, f;
    if (c)
      return t === "$attrs" ? (Te(e.attrs, "get", ""), process.env.NODE_ENV !== "production" && qr()) : process.env.NODE_ENV !== "production" && t === "$slots" && Te(e, "get", t), c(e);
    if (
      // css module (injected by vue-loader)
      (u = l.__cssModules) && (u = u[t])
    )
      return u;
    if (n !== _e && ae(n, t))
      return s[t] = 4, n[t];
    if (
      // global properties
      f = a.config.globalProperties, ae(f, t)
    )
      return f[t];
    process.env.NODE_ENV !== "production" && Ue && (!ye(t) || // #1091 avoid internal isRef/isVNode checks on component instance leading
    // to infinite warning loop
    t.indexOf("__v") !== 0) && (o !== _e && vi(t[0]) && ae(o, t) ? P(
      `Property ${JSON.stringify(
        t
      )} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`
    ) : e === Ue && P(
      `Property ${JSON.stringify(t)} was accessed during render but is not defined on instance.`
    ));
  },
  set({ _: e }, t, n) {
    const { data: r, setupState: o, ctx: i } = e;
    return Do(o, t) ? (o[t] = n, !0) : process.env.NODE_ENV !== "production" && o.__isScriptSetup && ae(o, t) ? (P(`Cannot mutate <script setup> binding "${t}" from Options API.`), !1) : r !== _e && ae(r, t) ? (r[t] = n, !0) : ae(e.props, t) ? (process.env.NODE_ENV !== "production" && P(`Attempting to mutate prop "${t}". Props are readonly.`), !1) : t[0] === "$" && t.slice(1) in e ? (process.env.NODE_ENV !== "production" && P(
      `Attempting to mutate public property "${t}". Properties starting with $ are reserved and readonly.`
    ), !1) : (process.env.NODE_ENV !== "production" && t in e.appContext.config.globalProperties ? Object.defineProperty(i, t, {
      enumerable: !0,
      configurable: !0,
      value: n
    }) : i[t] = n, !0);
  },
  has({
    _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: o, props: i, type: s }
  }, l) {
    let a;
    return !!(n[l] || e !== _e && l[0] !== "$" && ae(e, l) || Do(t, l) || ae(i, l) || ae(r, l) || ae(dn, l) || ae(o.config.globalProperties, l) || (a = s.__cssModules) && a[l]);
  },
  defineProperty(e, t, n) {
    return n.get != null ? e._.accessCache[t] = 0 : ae(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
  }
};
process.env.NODE_ENV !== "production" && (Jl.ownKeys = (e) => (P(
  "Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead."
), Reflect.ownKeys(e)));
function Tu(e) {
  const t = {};
  return Object.defineProperty(t, "_", {
    configurable: !0,
    enumerable: !1,
    get: () => e
  }), Object.keys(dn).forEach((n) => {
    Object.defineProperty(t, n, {
      configurable: !0,
      enumerable: !1,
      get: () => dn[n](e),
      // intercepted by the proxy so no need for implementation,
      // but needed to prevent set errors
      set: Ne
    });
  }), t;
}
function Iu(e) {
  const {
    ctx: t,
    propsOptions: [n]
  } = e;
  n && Object.keys(n).forEach((r) => {
    Object.defineProperty(t, r, {
      enumerable: !0,
      configurable: !0,
      get: () => e.props[r],
      set: Ne
    });
  });
}
function ju(e) {
  const { ctx: t, setupState: n } = e;
  Object.keys(/* @__PURE__ */ le(n)).forEach((r) => {
    if (!n.__isScriptSetup) {
      if (vi(r[0])) {
        P(
          `setup() return property ${JSON.stringify(
            r
          )} should not start with "$" or "_" which are reserved prefixes for Vue internals.`
        );
        return;
      }
      Object.defineProperty(t, r, {
        enumerable: !0,
        configurable: !0,
        get: () => n[r],
        set: Ne
      });
    }
  });
}
function Ki(e) {
  return Z(e) ? e.reduce(
    (t, n) => (t[n] = null, t),
    {}
  ) : e;
}
function Mu() {
  const e = /* @__PURE__ */ Object.create(null);
  return (t, n) => {
    e[n] ? P(`${t} property "${n}" is already defined in ${e[n]}.`) : e[n] = t;
  };
}
let Zo = !0;
function Vu(e) {
  const t = Wl(e), n = e.proxy, r = e.ctx;
  Zo = !1, t.beforeCreate && Zi(t.beforeCreate, e, "bc");
  const {
    // state
    data: o,
    computed: i,
    methods: s,
    watch: l,
    provide: a,
    inject: c,
    // lifecycle
    created: u,
    beforeMount: f,
    mounted: p,
    beforeUpdate: d,
    updated: g,
    activated: _,
    deactivated: E,
    beforeDestroy: T,
    beforeUnmount: A,
    destroyed: w,
    unmounted: C,
    render: b,
    renderTracked: N,
    renderTriggered: L,
    errorCaptured: Q,
    serverPrefetch: j,
    // public API
    expose: H,
    inheritAttrs: v,
    // assets
    components: x,
    directives: q,
    filters: te
  } = t, J = process.env.NODE_ENV !== "production" ? Mu() : null;
  if (process.env.NODE_ENV !== "production") {
    const [ie] = e.propsOptions;
    if (ie)
      for (const oe in ie)
        J("Props", oe);
  }
  if (c && Pu(c, r, J), s)
    for (const ie in s) {
      const oe = s[ie];
      ee(oe) ? (process.env.NODE_ENV !== "production" ? Object.defineProperty(r, ie, {
        value: oe.bind(n),
        configurable: !0,
        enumerable: !0,
        writable: !0
      }) : r[ie] = oe.bind(n), process.env.NODE_ENV !== "production" && J("Methods", ie)) : process.env.NODE_ENV !== "production" && P(
        `Method "${ie}" has type "${typeof oe}" in the component definition. Did you reference the function correctly?`
      );
    }
  if (o) {
    process.env.NODE_ENV !== "production" && !ee(o) && P(
      "The data option must be a function. Plain object usage is no longer supported."
    );
    const ie = o.call(n, n);
    if (process.env.NODE_ENV !== "production" && li(ie) && P(
      "data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>."
    ), !pe(ie))
      process.env.NODE_ENV !== "production" && P("data() should return an object.");
    else if (e.data = /* @__PURE__ */ Kn(ie), process.env.NODE_ENV !== "production")
      for (const oe in ie)
        J("Data", oe), vi(oe[0]) || Object.defineProperty(r, oe, {
          configurable: !0,
          enumerable: !0,
          get: () => ie[oe],
          set: Ne
        });
  }
  if (Zo = !0, i)
    for (const ie in i) {
      const oe = i[ie], ke = ee(oe) ? oe.bind(n, n) : ee(oe.get) ? oe.get.bind(n, n) : Ne;
      process.env.NODE_ENV !== "production" && ke === Ne && P(`Computed property "${ie}" has no getter.`);
      const se = !ee(oe) && ee(oe.set) ? oe.set.bind(n) : process.env.NODE_ENV !== "production" ? () => {
        P(
          `Write operation failed: computed property "${ie}" is readonly.`
        );
      } : Ne, Ye = qe({
        get: ke,
        set: se
      });
      Object.defineProperty(r, ie, {
        enumerable: !0,
        configurable: !0,
        get: () => Ye.value,
        set: (Ge) => Ye.value = Ge
      }), process.env.NODE_ENV !== "production" && J("Computed", ie);
    }
  if (l)
    for (const ie in l)
      Ul(l[ie], r, n, ie);
  if (a) {
    const ie = ee(a) ? a.call(n) : a;
    Reflect.ownKeys(ie).forEach((oe) => {
      du(oe, ie[oe]);
    });
  }
  u && Zi(u, e, "c");
  function ce(ie, oe) {
    Z(oe) ? oe.forEach((ke) => ie(ke.bind(n))) : oe && ie(oe.bind(n));
  }
  if (ce(yu, f), ce(uo, p), ce(wu, d), ce(Eu, g), ce(bu, _), ce(vu, E), ce(Nu, Q), ce(Au, N), ce(Ru, L), ce(ku, A), ce(Cu, C), ce(Du, j), Z(H))
    if (H.length) {
      const ie = e.exposed || (e.exposed = {});
      H.forEach((oe) => {
        Object.defineProperty(ie, oe, {
          get: () => n[oe],
          set: (ke) => n[oe] = ke,
          enumerable: !0
        });
      });
    } else e.exposed || (e.exposed = {});
  b && e.render === Ne && (e.render = b), v != null && (e.inheritAttrs = v), x && (e.components = x), q && (e.directives = q), j && zl(e);
}
function Pu(e, t, n = Ne) {
  Z(e) && (e = Xo(e));
  for (const r in e) {
    const o = e[r];
    let i;
    pe(o) ? "default" in o ? i = Ir(
      o.from || r,
      o.default,
      !0
    ) : i = Ir(o.from || r) : i = Ir(o), /* @__PURE__ */ Re(i) ? Object.defineProperty(t, r, {
      enumerable: !0,
      configurable: !0,
      get: () => i.value,
      set: (s) => i.value = s
    }) : t[r] = i, process.env.NODE_ENV !== "production" && n("Inject", r);
  }
}
function Zi(e, t, n) {
  bt(
    Z(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy),
    t,
    n
  );
}
function Ul(e, t, n, r) {
  let o = r.includes(".") ? Pl(n, r) : () => n[r];
  if (ye(e)) {
    const i = t[e];
    ee(i) ? $n(o, i) : process.env.NODE_ENV !== "production" && P(`Invalid watch handler specified by key "${e}"`, i);
  } else if (ee(e))
    $n(o, e.bind(n));
  else if (pe(e))
    if (Z(e))
      e.forEach((i) => Ul(i, t, n, r));
    else {
      const i = ee(e.handler) ? e.handler.bind(n) : t[e.handler];
      ee(i) ? $n(o, i, e) : process.env.NODE_ENV !== "production" && P(`Invalid watch handler specified by key "${e.handler}"`, i);
    }
  else process.env.NODE_ENV !== "production" && P(`Invalid watch option: "${r}"`, e);
}
function Wl(e) {
  const t = e.type, { mixins: n, extends: r } = t, {
    mixins: o,
    optionsCache: i,
    config: { optionMergeStrategies: s }
  } = e.appContext, l = i.get(t);
  let a;
  return l ? a = l : !o.length && !n && !r ? a = t : (a = {}, o.length && o.forEach(
    (c) => Hr(a, c, s, !0)
  ), Hr(a, t, s)), pe(t) && i.set(t, a), a;
}
function Hr(e, t, n, r = !1) {
  const { mixins: o, extends: i } = t;
  i && Hr(e, i, n, !0), o && o.forEach(
    (s) => Hr(e, s, n, !0)
  );
  for (const s in t)
    if (r && s === "expose")
      process.env.NODE_ENV !== "production" && P(
        '"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.'
      );
    else {
      const l = Bu[s] || n && n[s];
      e[s] = l ? l(e[s], t[s]) : t[s];
    }
  return e;
}
const Bu = {
  data: Xi,
  props: Yi,
  emits: Yi,
  // objects
  methods: jn,
  computed: jn,
  // lifecycle
  beforeCreate: $e,
  created: $e,
  beforeMount: $e,
  mounted: $e,
  beforeUpdate: $e,
  updated: $e,
  beforeDestroy: $e,
  beforeUnmount: $e,
  destroyed: $e,
  unmounted: $e,
  activated: $e,
  deactivated: $e,
  errorCaptured: $e,
  serverPrefetch: $e,
  // assets
  components: jn,
  directives: jn,
  // watch
  watch: zu,
  // provide / inject
  provide: Xi,
  inject: $u
};
function Xi(e, t) {
  return t ? e ? function() {
    return xe(
      ee(e) ? e.call(this, this) : e,
      ee(t) ? t.call(this, this) : t
    );
  } : t : e;
}
function $u(e, t) {
  return jn(Xo(e), Xo(t));
}
function Xo(e) {
  if (Z(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++)
      t[e[n]] = e[n];
    return t;
  }
  return e;
}
function $e(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function jn(e, t) {
  return e ? xe(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function Yi(e, t) {
  return e ? Z(e) && Z(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : xe(
    /* @__PURE__ */ Object.create(null),
    Ki(e),
    Ki(t ?? {})
  ) : t;
}
function zu(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = xe(/* @__PURE__ */ Object.create(null), e);
  for (const r in t)
    n[r] = $e(e[r], t[r]);
  return n;
}
function Hl() {
  return {
    app: null,
    config: {
      isNativeTag: tl,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let Lu = 0;
function Ju(e, t) {
  return function(r, o = null) {
    ee(r) || (r = xe({}, r)), o != null && !pe(o) && (process.env.NODE_ENV !== "production" && P("root props passed to app.mount() must be an object."), o = null);
    const i = Hl(), s = /* @__PURE__ */ new WeakSet(), l = [];
    let a = !1;
    const c = i.app = {
      _uid: Lu++,
      _component: r,
      _props: o,
      _container: null,
      _context: i,
      _instance: null,
      version: cs,
      get config() {
        return i.config;
      },
      set config(u) {
        process.env.NODE_ENV !== "production" && P(
          "app.config cannot be replaced. Modify individual options instead."
        );
      },
      use(u, ...f) {
        return s.has(u) ? process.env.NODE_ENV !== "production" && P("Plugin has already been applied to target app.") : u && ee(u.install) ? (s.add(u), u.install(c, ...f)) : ee(u) ? (s.add(u), u(c, ...f)) : process.env.NODE_ENV !== "production" && P(
          'A plugin must either be a function or an object with an "install" function.'
        ), c;
      },
      mixin(u) {
        return i.mixins.includes(u) ? process.env.NODE_ENV !== "production" && P(
          "Mixin has already been applied to target app" + (u.name ? `: ${u.name}` : "")
        ) : i.mixins.push(u), c;
      },
      component(u, f) {
        return process.env.NODE_ENV !== "production" && ei(u, i.config), f ? (process.env.NODE_ENV !== "production" && i.components[u] && P(`Component "${u}" has already been registered in target app.`), i.components[u] = f, c) : i.components[u];
      },
      directive(u, f) {
        return process.env.NODE_ENV !== "production" && Ml(u), f ? (process.env.NODE_ENV !== "production" && i.directives[u] && P(`Directive "${u}" has already been registered in target app.`), i.directives[u] = f, c) : i.directives[u];
      },
      mount(u, f, p) {
        if (a)
          process.env.NODE_ENV !== "production" && P(
            "App has already been mounted.\nIf you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. `const createMyApp = () => createApp(App)`"
          );
        else {
          process.env.NODE_ENV !== "production" && u.__vue_app__ && P(
            "There is already an app instance mounted on the host container.\n If you want to mount another app on the same host container, you need to unmount the previous app by calling `app.unmount()` first."
          );
          const d = c._ceVNode || Rt(r, o);
          return d.appContext = i, p === !0 ? p = "svg" : p === !1 && (p = void 0), process.env.NODE_ENV !== "production" && (i.reload = () => {
            const g = Kt(d);
            g.el = null, e(g, u, p);
          }), e(d, u, p), a = !0, c._container = u, u.__vue_app__ = c, process.env.NODE_ENV !== "production" && (c._instance = d.component, ru(c, cs)), go(d.component);
        }
      },
      onUnmount(u) {
        process.env.NODE_ENV !== "production" && typeof u != "function" && P(
          `Expected function as first argument to app.onUnmount(), but got ${typeof u}`
        ), l.push(u);
      },
      unmount() {
        a ? (bt(
          l,
          c._instance,
          16
        ), e(null, c._container), process.env.NODE_ENV !== "production" && (c._instance = null, ou(c)), delete c._container.__vue_app__) : process.env.NODE_ENV !== "production" && P("Cannot unmount an app that is not mounted.");
      },
      provide(u, f) {
        return process.env.NODE_ENV !== "production" && u in i.provides && (ae(i.provides, u) ? P(
          `App already provides property with key "${String(u)}". It will be overwritten with the new value.`
        ) : P(
          `App already provides property with key "${String(u)}" inherited from its parent element. It will be overwritten with the new value.`
        )), i.provides[u] = f, c;
      },
      runWithContext(u) {
        const f = kn;
        kn = c;
        try {
          return u();
        } finally {
          kn = f;
        }
      }
    };
    return c;
  };
}
let kn = null;
const Uu = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${Pe(t)}Modifiers`] || e[`${tt(t)}Modifiers`];
function Wu(e, t, ...n) {
  if (e.isUnmounted) return;
  const r = e.vnode.props || _e;
  if (process.env.NODE_ENV !== "production") {
    const {
      emitsOptions: u,
      propsOptions: [f]
    } = e;
    if (u)
      if (!(t in u))
        (!f || !(rn(Pe(t)) in f)) && P(
          `Component emitted event "${t}" but it is neither declared in the emits option nor as an "${rn(Pe(t))}" prop.`
        );
      else {
        const p = u[t];
        ee(p) && (p(...n) || P(
          `Invalid event arguments: event validation failed for event "${t}".`
        ));
      }
  }
  let o = n;
  const i = t.startsWith("update:"), s = i && Uu(r, t.slice(7));
  if (s && (s.trim && (o = n.map((u) => ye(u) ? u.trim() : u)), s.number && (o = o.map(ur))), process.env.NODE_ENV !== "production" && uu(e, t, o), process.env.NODE_ENV !== "production") {
    const u = t.toLowerCase();
    u !== t && r[rn(u)] && P(
      `Event "${u}" is emitted in component ${mr(
        e,
        e.type
      )} but the handler is registered for "${t}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${tt(
        t
      )}" instead of "${t}".`
    );
  }
  let l, a = r[l = rn(t)] || // also try camelCase event handler (#2249)
  r[l = rn(Pe(t))];
  !a && i && (a = r[l = rn(tt(t))]), a && bt(
    a,
    e,
    6,
    o
  );
  const c = r[l + "Once"];
  if (c) {
    if (!e.emitted)
      e.emitted = {};
    else if (e.emitted[l])
      return;
    e.emitted[l] = !0, bt(
      c,
      e,
      6,
      o
    );
  }
}
const Hu = /* @__PURE__ */ new WeakMap();
function ql(e, t, n = !1) {
  const r = n ? Hu : t.emitsCache, o = r.get(e);
  if (o !== void 0)
    return o;
  const i = e.emits;
  let s = {}, l = !1;
  if (!ee(e)) {
    const a = (c) => {
      const u = ql(c, t, !0);
      u && (l = !0, xe(s, u));
    };
    !n && t.mixins.length && t.mixins.forEach(a), e.extends && a(e.extends), e.mixins && e.mixins.forEach(a);
  }
  return !i && !l ? (pe(e) && r.set(e, null), null) : (Z(i) ? i.forEach((a) => s[a] = null) : xe(s, i), pe(e) && r.set(e, s), s);
}
function fo(e, t) {
  return !e || !ar(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), ae(e, t[0].toLowerCase() + t.slice(1)) || ae(e, tt(t)) || ae(e, t));
}
let Yo = !1;
function qr() {
  Yo = !0;
}
function Gi(e) {
  const {
    type: t,
    vnode: n,
    proxy: r,
    withProxy: o,
    propsOptions: [i],
    slots: s,
    attrs: l,
    emit: a,
    render: c,
    renderCache: u,
    props: f,
    data: p,
    setupState: d,
    ctx: g,
    inheritAttrs: _
  } = e, E = Ur(e);
  let T, A;
  process.env.NODE_ENV !== "production" && (Yo = !1);
  try {
    if (n.shapeFlag & 4) {
      const b = o || r, N = process.env.NODE_ENV !== "production" && d.__isScriptSetup ? new Proxy(b, {
        get(L, Q, j) {
          return P(
            `Property '${String(
              Q
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          ), Reflect.get(L, Q, j);
        }
      }) : b;
      T = pt(
        c.call(
          N,
          b,
          u,
          process.env.NODE_ENV !== "production" ? /* @__PURE__ */ Je(f) : f,
          d,
          p,
          g
        )
      ), A = l;
    } else {
      const b = t;
      process.env.NODE_ENV !== "production" && l === f && qr(), T = pt(
        b.length > 1 ? b(
          process.env.NODE_ENV !== "production" ? /* @__PURE__ */ Je(f) : f,
          process.env.NODE_ENV !== "production" ? {
            get attrs() {
              return qr(), /* @__PURE__ */ Je(l);
            },
            slots: s,
            emit: a
          } : { attrs: l, slots: s, emit: a }
        ) : b(
          process.env.NODE_ENV !== "production" ? /* @__PURE__ */ Je(f) : f,
          null
        )
      ), A = t.props ? l : qu(l);
    }
  } catch (b) {
    pn.length = 0, dr(b, e, 1), T = Rt(Xe);
  }
  let w = T, C;
  if (process.env.NODE_ENV !== "production" && T.patchFlag > 0 && T.patchFlag & 2048 && ([w, C] = Kl(T)), A && _ !== !1) {
    const b = Object.keys(A), { shapeFlag: N } = w;
    if (b.length) {
      if (N & 7)
        i && b.some(Wn) && (A = Ku(
          A,
          i
        )), w = Kt(w, A, !1, !0);
      else if (process.env.NODE_ENV !== "production" && !Yo && w.type !== Xe) {
        const L = Object.keys(l), Q = [], j = [];
        for (let H = 0, v = L.length; H < v; H++) {
          const x = L[H];
          ar(x) ? Wn(x) || Q.push(x[2].toLowerCase() + x.slice(3)) : j.push(x);
        }
        j.length && P(
          `Extraneous non-props attributes (${j.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`
        ), Q.length && P(
          `Extraneous non-emits event listeners (${Q.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`
        );
      }
    }
  }
  if (n.dirs && (process.env.NODE_ENV !== "production" && !Qi(w) && P(
    "Runtime directive used on component with non-element root node. The directives will not function as intended."
  ), w = Kt(w, null, !1, !0), w.dirs = w.dirs ? w.dirs.concat(n.dirs) : n.dirs), n.transition) {
    const b = ao(w.type) && Bl(w) || w;
    process.env.NODE_ENV !== "production" && !Qi(b) && P(
      "Component inside <Transition> renders non-element root node that cannot be animated."
    ), zn(b, n.transition);
  }
  return process.env.NODE_ENV !== "production" && C ? C(w) : T = w, Ur(E), T;
}
const Kl = (e) => {
  const t = e.children, n = e.dynamicChildren, r = Nn(t, !1);
  if (r) {
    if (process.env.NODE_ENV !== "production" && r.patchFlag > 0 && r.patchFlag & 2048)
      return Kl(r);
  } else return [e, void 0];
  const o = t.indexOf(r), i = n ? n.indexOf(r) : -1, s = (l) => {
    t[o] = l, n && (i > -1 ? n[i] = l : l.patchFlag > 0 && (e.dynamicChildren = [...n, l]));
  };
  return [pt(r), s];
};
function Nn(e, t = !0) {
  let n;
  for (let r = 0; r < e.length; r++) {
    const o = e[r];
    if (po(o)) {
      if (o.type !== Xe || o.children === "v-if") {
        if (n)
          return;
        if (n = o, process.env.NODE_ENV !== "production" && t && n.patchFlag > 0 && n.patchFlag & 2048)
          return Nn(n.children);
      }
    } else
      return;
  }
  return n;
}
const qu = (e) => {
  let t;
  for (const n in e)
    (n === "class" || n === "style" || ar(n)) && ((t || (t = {}))[n] = e[n]);
  return t;
}, Ku = (e, t) => {
  const n = {};
  for (const r in e)
    (!Wn(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
  return n;
}, Qi = (e) => e.shapeFlag & 7 || e.type === Xe;
function Zu(e, t, n) {
  const { props: r, children: o, component: i } = e, { props: s, children: l, patchFlag: a } = t, c = i.emitsOptions;
  if (process.env.NODE_ENV !== "production" && (o || l) && nt || t.dirs || t.transition)
    return !0;
  if (n && a >= 0) {
    if (a & 1024)
      return !0;
    if (a & 16)
      return r ? es(r, s, c) : !!s;
    if (a & 8) {
      const u = t.dynamicProps;
      for (let f = 0; f < u.length; f++) {
        const p = u[f];
        if (Zl(s, r, p) && !fo(c, p))
          return !0;
      }
    }
  } else
    return (o || l) && (!l || !l.$stable) ? !0 : r === s ? !1 : r ? s ? es(r, s, c) : !0 : !!s;
  return !1;
}
function es(e, t, n) {
  const r = Object.keys(t);
  if (r.length !== Object.keys(e).length)
    return !0;
  for (let o = 0; o < r.length; o++) {
    const i = r[o];
    if (!ae(e, i) || Zl(t, e, i) && !fo(n, i))
      return !0;
  }
  return !1;
}
function Zl(e, t, n) {
  const r = e[n], o = t[n];
  return n === "style" && pe(r) && pe(o) ? !Ht(r, o) : r !== o;
}
function Xu({ vnode: e, parent: t, suspense: n }, r) {
  for (; t; ) {
    const o = t.subTree;
    if (o.suspense && o.suspense.activeBranch === e && (o.suspense.vnode.el = o.el = r, e = o), o === e)
      (e = t.vnode).el = r, t = t.parent;
    else
      break;
  }
  n && n.activeBranch === e && (n.vnode.el = r);
}
const Xl = {}, Yl = () => Object.create(Xl), Gl = (e) => Object.getPrototypeOf(e) === Xl;
function Yu(e, t, n, r = !1) {
  const o = {}, i = Yl();
  e.propsDefaults = /* @__PURE__ */ Object.create(null), Ql(e, t, o, i);
  for (const s in e.propsOptions[0])
    s in o || (o[s] = void 0);
  process.env.NODE_ENV !== "production" && ta(t || {}, o, e), n ? e.props = r ? o : /* @__PURE__ */ Vc(o) : e.type.props ? e.props = o : e.props = i, e.attrs = i;
}
function Gu(e) {
  for (; e; ) {
    if (e.type.__hmrId) return !0;
    e = e.parent;
  }
}
function Qu(e, t, n, r) {
  const {
    props: o,
    attrs: i,
    vnode: { patchFlag: s }
  } = e, l = /* @__PURE__ */ le(o), [a] = e.propsOptions;
  let c = !1;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    !(process.env.NODE_ENV !== "production" && Gu(e)) && (r || s > 0) && !(s & 16)
  ) {
    if (s & 8) {
      const u = e.vnode.dynamicProps;
      for (let f = 0; f < u.length; f++) {
        let p = u[f];
        if (fo(e.emitsOptions, p))
          continue;
        const d = t[p];
        if (a)
          if (ae(i, p))
            d !== i[p] && (i[p] = d, c = !0);
          else {
            const g = Pe(p);
            o[g] = Go(
              a,
              l,
              g,
              d,
              e,
              !1
            );
          }
        else
          d !== i[p] && (i[p] = d, c = !0);
      }
    }
  } else {
    Ql(e, t, o, i) && (c = !0);
    let u;
    for (const f in l)
      (!t || // for camelCase
      !ae(t, f) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((u = tt(f)) === f || !ae(t, u))) && (a ? n && // for camelCase
      (n[f] !== void 0 || // for kebab-case
      n[u] !== void 0) && (o[f] = Go(
        a,
        l,
        f,
        void 0,
        e,
        !0
      )) : delete o[f]);
    if (i !== l)
      for (const f in i)
        (!t || !ae(t, f)) && (delete i[f], c = !0);
  }
  c && kt(e.attrs, "set", ""), process.env.NODE_ENV !== "production" && ta(t || {}, o, e);
}
function Ql(e, t, n, r) {
  const [o, i] = e.propsOptions;
  let s = !1, l;
  if (t)
    for (let a in t) {
      if (Vn(a))
        continue;
      const c = t[a];
      let u;
      o && ae(o, u = Pe(a)) ? !i || !i.includes(u) ? n[u] = c : (l || (l = {}))[u] = c : fo(e.emitsOptions, a) || (!(a in r) || c !== r[a]) && (r[a] = c, s = !0);
    }
  if (i) {
    const a = /* @__PURE__ */ le(n), c = l || _e;
    for (let u = 0; u < i.length; u++) {
      const f = i[u];
      n[f] = Go(
        o,
        a,
        f,
        c[f],
        e,
        !ae(c, f)
      );
    }
  }
  return s;
}
function Go(e, t, n, r, o, i) {
  const s = e[n];
  if (s != null) {
    const l = ae(s, "default");
    if (l && r === void 0) {
      const a = s.default;
      if (s.type !== Function && !s.skipFactory && ee(a)) {
        const { propsDefaults: c } = o;
        if (n in c)
          r = c[n];
        else {
          const u = gr(o);
          r = c[n] = a.call(
            null,
            t
          ), u();
        }
      } else
        r = a;
      o.ce && o.ce._setProp(n, r);
    }
    s[
      0
      /* shouldCast */
    ] && (i && !l ? r = !1 : s[
      1
      /* shouldCastTrue */
    ] && (r === "" || r === tt(n)) && (r = !0));
  }
  return r;
}
const ef = /* @__PURE__ */ new WeakMap();
function ea(e, t, n = !1) {
  const r = n ? ef : t.propsCache, o = r.get(e);
  if (o)
    return o;
  const i = e.props, s = {}, l = [];
  let a = !1;
  if (!ee(e)) {
    const u = (f) => {
      a = !0;
      const [p, d] = ea(f, t, !0);
      xe(s, p), d && l.push(...d);
    };
    !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!i && !a)
    return pe(e) && r.set(e, an), an;
  if (Z(i))
    for (let u = 0; u < i.length; u++) {
      process.env.NODE_ENV !== "production" && !ye(i[u]) && P("props must be strings when using array syntax.", i[u]);
      const f = Pe(i[u]);
      ts(f) && (s[f] = _e);
    }
  else if (i) {
    process.env.NODE_ENV !== "production" && !pe(i) && P("invalid props options", i);
    for (const u in i) {
      const f = Pe(u);
      if (ts(f)) {
        const p = i[u], d = s[f] = Z(p) || ee(p) ? { type: p } : xe({}, p), g = d.type;
        let _ = !1, E = !0;
        if (Z(g))
          for (let T = 0; T < g.length; ++T) {
            const A = g[T], w = ee(A) && A.name;
            if (w === "Boolean") {
              _ = !0;
              break;
            } else w === "String" && (E = !1);
          }
        else
          _ = ee(g) && g.name === "Boolean";
        d[
          0
          /* shouldCast */
        ] = _, d[
          1
          /* shouldCastTrue */
        ] = E, (_ || ae(d, "default")) && l.push(f);
      }
    }
  }
  const c = [s, l];
  return pe(e) && r.set(e, c), c;
}
function ts(e) {
  return e[0] !== "$" && !Vn(e) ? !0 : (process.env.NODE_ENV !== "production" && P(`Invalid prop name: "${e}" is a reserved property.`), !1);
}
function tf(e) {
  return e === null ? "null" : typeof e == "function" ? e.name || "" : typeof e == "object" && e.constructor && e.constructor.name || "";
}
function ta(e, t, n) {
  const r = /* @__PURE__ */ le(t), o = n.propsOptions[0], i = Object.keys(e).map((s) => Pe(s));
  for (const s in o) {
    let l = o[s];
    l != null && nf(
      s,
      r[s],
      l,
      process.env.NODE_ENV !== "production" ? /* @__PURE__ */ Je(r) : r,
      !i.includes(s)
    );
  }
}
function nf(e, t, n, r, o) {
  const { type: i, required: s, validator: l, skipCheck: a } = n;
  if (s && o) {
    P('Missing required prop: "' + e + '"');
    return;
  }
  if (!(t == null && !s)) {
    if (i != null && i !== !0 && !a) {
      let c = !1;
      const u = Z(i) ? i : [i], f = [];
      for (let p = 0; p < u.length && !c; p++) {
        const { valid: d, expectedType: g } = of(t, u[p]);
        f.push(g || ""), c = d;
      }
      if (!c) {
        P(sf(e, t, f));
        return;
      }
    }
    l && !l(t, r) && P('Invalid prop: custom validator check failed for prop "' + e + '".');
  }
}
const rf = /* @__PURE__ */ $t(
  "String,Number,Boolean,Function,Symbol,BigInt"
);
function of(e, t) {
  let n;
  const r = tf(t);
  if (r === "null")
    n = e === null;
  else if (rf(r)) {
    const o = typeof e;
    n = o === r.toLowerCase(), !n && o === "object" && (n = e instanceof t);
  } else r === "Object" ? n = pe(e) : r === "Array" ? n = Z(e) : n = e instanceof t;
  return {
    valid: n,
    expectedType: r
  };
}
function sf(e, t, n) {
  if (n.length === 0)
    return `Prop type [] for prop "${e}" won't match anything. Did you mean to use type Array instead?`;
  let r = `Invalid prop: type check failed for prop "${e}". Expected ${n.map(oo).join(" | ")}`;
  const o = n[0], i = ai(t), s = ns(t, o), l = ns(t, i);
  return n.length === 1 && rs(o) && lf(o, i) && (r += ` with value ${s}`), r += `, got ${i} `, rs(i) && (r += `with value ${l}.`), r;
}
function ns(e, t) {
  return _t(e) ? e.toString() : t === "String" ? `"${e}"` : t === "Number" ? `${Number(e)}` : `${e}`;
}
function rs(e) {
  return ["string", "number", "boolean"].some((n) => e.toLowerCase() === n);
}
function lf(...e) {
  return e.every((t) => {
    const n = t.toLowerCase();
    return n !== "boolean" && n !== "symbol";
  });
}
const xi = (e) => e === "_" || e === "_ctx" || e === "$stable", yi = (e) => Z(e) ? e.map(pt) : [pt(e)], af = (e, t, n) => {
  if (t._n)
    return t;
  const r = fu((...o) => (process.env.NODE_ENV !== "production" && Oe && !(n === null && Ue) && !(n && n.root !== Oe.root) && P(
    `Slot "${e}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`
  ), yi(t(...o))), n);
  return r._c = !1, r;
}, na = (e, t, n) => {
  const r = e._ctx;
  for (const o in e) {
    if (xi(o)) continue;
    const i = e[o];
    if (ee(i))
      t[o] = af(o, i, r);
    else if (i != null) {
      process.env.NODE_ENV !== "production" && P(
        `Non-function value encountered for slot "${o}". Prefer function slots for better performance.`
      );
      const s = yi(i);
      t[o] = () => s;
    }
  }
}, ra = (e, t) => {
  process.env.NODE_ENV !== "production" && !co(e.vnode) && P(
    "Non-function value encountered for default slot. Prefer function slots for better performance."
  );
  const n = yi(t);
  e.slots.default = () => n;
}, Qo = (e, t, n) => {
  for (const r in t)
    (n || !xi(r)) && (e[r] = t[r]);
}, cf = (e, t, n) => {
  const r = e.slots = Yl();
  if (e.vnode.shapeFlag & 32) {
    const o = t._;
    o ? (Qo(r, t, n), n && Br(r, "_", o, !0)) : na(t, r);
  } else t && ra(e, t);
}, uf = (e, t, n) => {
  const { vnode: r, slots: o } = e;
  let i = !0, s = _e;
  if (r.shapeFlag & 32) {
    const l = t._;
    l ? process.env.NODE_ENV !== "production" && nt ? (Qo(o, t, n), kt(e, "set", "$slots")) : n && l === 1 ? i = !1 : Qo(o, t, n) : (i = !t.$stable, na(t, o)), s = t;
  } else t && (ra(e, t), s = { default: 1 });
  if (i)
    for (const l in o)
      !xi(l) && s[l] == null && delete o[l];
};
let Sn, Tt;
function xn(e, t) {
  e.appContext.config.performance && Kr() && Tt.mark(`vue-${t}-${e.uid}`), process.env.NODE_ENV !== "production" && au(e, t, Kr() ? Tt.now() : Date.now());
}
function yn(e, t) {
  if (e.appContext.config.performance && Kr()) {
    const n = `vue-${t}-${e.uid}`, r = n + ":end", o = `<${mr(e, e.type)}> ${t}`;
    Tt.mark(r), Tt.measure(o, n, r), Tt.clearMeasures(o), Tt.clearMarks(n), Tt.clearMarks(r);
  }
  process.env.NODE_ENV !== "production" && cu(e, t, Kr() ? Tt.now() : Date.now());
}
function Kr() {
  return Sn !== void 0 || (typeof window < "u" && window.performance ? (Sn = !0, Tt = window.performance) : Sn = !1), Sn;
}
function ff() {
  const e = [];
  if (process.env.NODE_ENV !== "production" && e.length) {
    const t = e.length > 1;
    console.warn(
      `Feature flag${t ? "s" : ""} ${e.join(", ")} ${t ? "are" : "is"} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`
    );
  }
}
const ze = _f;
function df(e) {
  return pf(e);
}
function pf(e, t) {
  ff();
  const n = fr();
  n.__VUE__ = !0, process.env.NODE_ENV !== "production" && _i(n.__VUE_DEVTOOLS_GLOBAL_HOOK__, n);
  const {
    insert: r,
    remove: o,
    patchProp: i,
    createElement: s,
    createText: l,
    createComment: a,
    setText: c,
    setElementText: u,
    parentNode: f,
    nextSibling: p,
    setScopeId: d = Ne,
    insertStaticContent: g
  } = e, _ = (h, m, y, I = null, D = null, S = null, $ = void 0, M = null, V = process.env.NODE_ENV !== "production" && nt ? !1 : !!m.dynamicChildren) => {
    if (h === m)
      return;
    h && !On(h, m) && (I = bn(h), ut(h, D, S, !0), h = null), m.patchFlag === -2 && (V = !1, m.dynamicChildren = null), m.dynamicChildren && h && h.dynamicChildren && h.dynamicChildren.hasOnce && (m.dynamicChildren === an && (m.dynamicChildren = []), m.dynamicChildren.hasOnce = !0);
    const { type: O, ref: X, shapeFlag: B } = m;
    switch (O) {
      case hr:
        E(h, m, y, I);
        break;
      case Xe:
        T(h, m, y, I);
        break;
      case Mr:
        h == null ? A(m, y, I, $) : process.env.NODE_ENV !== "production" && w(h, m, y, $);
        break;
      case Ee:
        q(
          h,
          m,
          y,
          I,
          D,
          S,
          $,
          M,
          V
        );
        break;
      default:
        B & 1 ? N(
          h,
          m,
          y,
          I,
          D,
          S,
          $,
          M,
          V
        ) : B & 6 ? te(
          h,
          m,
          y,
          I,
          D,
          S,
          $,
          M,
          V
        ) : B & 64 || B & 128 ? O.process(
          h,
          m,
          y,
          I,
          D,
          S,
          $,
          M,
          V,
          Lt
        ) : process.env.NODE_ENV !== "production" && P("Invalid VNode type:", O, `(${typeof O})`);
    }
    X != null && D ? Ln(X, h && h.ref, S, m || h, !m) : X == null && h && h.ref != null && Ln(h.ref, null, S, h, !0);
  }, E = (h, m, y, I) => {
    if (h == null)
      r(
        m.el = l(m.children),
        y,
        I
      );
    else {
      const D = m.el = h.el;
      m.children !== h.children && c(D, m.children);
    }
  }, T = (h, m, y, I) => {
    h == null ? r(
      m.el = a(m.children || ""),
      y,
      I
    ) : m.el = h.el;
  }, A = (h, m, y, I) => {
    [h.el, h.anchor] = g(
      h.children,
      m,
      y,
      I,
      h.el,
      h.anchor
    );
  }, w = (h, m, y, I) => {
    if (m.children !== h.children) {
      const D = p(h.anchor);
      b(h), [m.el, m.anchor] = g(
        m.children,
        y,
        D,
        I
      );
    } else
      m.el = h.el, m.anchor = h.anchor;
  }, C = ({ el: h, anchor: m }, y, I) => {
    let D;
    for (; h && h !== m; )
      D = p(h), r(h, y, I), h = D;
    r(m, y, I);
  }, b = ({ el: h, anchor: m }) => {
    let y;
    for (; h && h !== m; )
      y = p(h), o(h), h = y;
    o(m);
  }, N = (h, m, y, I, D, S, $, M, V) => {
    if (m.type === "svg" ? $ = "svg" : m.type === "math" && ($ = "mathml"), h == null)
      L(
        m,
        y,
        I,
        D,
        S,
        $,
        M,
        V
      );
    else {
      const O = h.el && h.el._isVueCE ? h.el : null;
      try {
        O && O._beginPatch(), H(
          h,
          m,
          D,
          S,
          $,
          M,
          V
        );
      } finally {
        O && O._endPatch();
      }
    }
  }, L = (h, m, y, I, D, S, $, M) => {
    let V, O;
    const { props: X, shapeFlag: B, transition: Y, dirs: ne } = h;
    if (V = h.el = s(
      h.type,
      S,
      X && X.is,
      X
    ), B & 8 ? u(V, h.children) : B & 16 && j(
      h.children,
      V,
      null,
      I,
      D,
      Ro(h, S),
      $,
      M
    ), ne && Qt(h, null, I, "created"), Q(V, h, h.scopeId, $, I), X) {
      for (const he in X)
        he !== "value" && !Vn(he) && i(V, he, null, X[he], S, I);
      "value" in X && i(V, "value", null, X.value, S), (O = X.onVnodeBeforeMount) && vt(O, I, h);
    }
    process.env.NODE_ENV !== "production" && (Br(V, "__vnode", h, !0), Br(V, "__vueParentComponent", I, !0)), ne && Qt(h, null, I, "beforeMount");
    const ue = hf(D, Y);
    if (ue ? Y.beforeEnter(V) : Y && !Y.persisted && (V[mf] = !0), r(V, m, y), (O = X && X.onVnodeMounted) || ue || ne) {
      const he = process.env.NODE_ENV !== "production" && nt;
      ze(() => {
        let fe;
        process.env.NODE_ENV !== "production" && (fe = Li(he));
        try {
          O && vt(O, I, h), ue && Y.enter(V), ne && Qt(h, null, I, "mounted");
        } finally {
          process.env.NODE_ENV !== "production" && Li(fe);
        }
      }, D);
    }
  }, Q = (h, m, y, I, D) => {
    if (y && d(h, y), I)
      for (let S = 0; S < I.length; S++)
        d(h, I[S]);
    if (D) {
      let S = D.subTree;
      if (process.env.NODE_ENV !== "production" && S.patchFlag > 0 && S.patchFlag & 2048 && (S = Nn(S.children) || S), m === S || oa(S.type) && (S.ssContent === m || S.ssFallback === m)) {
        const $ = D.vnode;
        Q(
          h,
          $,
          $.scopeId,
          $.slotScopeIds,
          D.parent
        );
      }
    }
  }, j = (h, m, y, I, D, S, $, M, V = 0) => {
    for (let O = V; O < h.length; O++) {
      const X = h[O] = M ? It(h[O]) : pt(h[O]);
      _(
        null,
        X,
        m,
        y,
        I,
        D,
        S,
        $,
        M
      );
    }
  }, H = (h, m, y, I, D, S, $) => {
    const M = m.el = h.el;
    process.env.NODE_ENV !== "production" && (M.__vnode = m);
    let { patchFlag: V, dynamicChildren: O, dirs: X } = m;
    V |= h.patchFlag & 16;
    const B = h.props || _e, Y = m.props || _e;
    let ne;
    if (y && en(y, !1), (ne = Y.onVnodeBeforeUpdate) && vt(ne, y, m, h), X && Qt(m, h, y, "beforeUpdate"), y && en(y, !0), // HMR updated, force full diff
    (process.env.NODE_ENV !== "production" && nt || // #6385 the old vnode may be a user-wrapped non-isomorphic block
    // Force full diff when block metadata is unstable.
    O && (!h.dynamicChildren || h.dynamicChildren.length !== O.length)) && (V = 0, $ = !1, O = null), (B.innerHTML && Y.innerHTML == null || B.textContent && Y.textContent == null) && u(M, ""), O ? (v(
      h.dynamicChildren,
      O,
      M,
      y,
      I,
      Ro(m, D),
      S
    ), process.env.NODE_ENV !== "production" && jr(h, m)) : $ || ke(
      h,
      m,
      M,
      null,
      y,
      I,
      Ro(m, D),
      S,
      !1
    ), V > 0) {
      if (V & 16)
        x(M, B, Y, y, D);
      else if (V & 2 && B.class !== Y.class && i(M, "class", null, Y.class, D), V & 4 && i(M, "style", B.style, Y.style, D), V & 8) {
        const ue = m.dynamicProps;
        for (let he = 0; he < ue.length; he++) {
          const fe = ue[he], Ce = B[fe], Fe = Y[fe];
          (Fe !== Ce || fe === "value") && i(M, fe, Ce, Fe, D, y);
        }
      }
      V & 1 && h.children !== m.children && u(M, m.children);
    } else !$ && O == null && x(M, B, Y, y, D);
    ((ne = Y.onVnodeUpdated) || X) && ze(() => {
      ne && vt(ne, y, m, h), X && Qt(m, h, y, "updated");
    }, I);
  }, v = (h, m, y, I, D, S, $) => {
    for (let M = 0; M < m.length; M++) {
      const V = h[M], O = m[M], X = V.el || Un(V), B = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        X && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (V.type === Ee || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !On(V, O) || // - In the case of a component, it could contain anything.
        V.shapeFlag & 198) ? f(X) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          y
        )
      );
      _(
        V,
        O,
        B,
        null,
        I,
        D,
        S,
        $,
        !0
      );
    }
  }, x = (h, m, y, I, D) => {
    if (m !== y) {
      if (m !== _e)
        for (const S in m)
          !Vn(S) && !(S in y) && i(
            h,
            S,
            m[S],
            null,
            D,
            I
          );
      for (const S in y) {
        if (Vn(S)) continue;
        const $ = y[S], M = m[S];
        $ !== M && S !== "value" && i(h, S, M, $, D, I);
      }
      "value" in y && i(h, "value", m.value, y.value, D);
    }
  }, q = (h, m, y, I, D, S, $, M, V) => {
    const O = m.el = h ? h.el : l(""), X = m.anchor = h ? h.anchor : l("");
    let { patchFlag: B, dynamicChildren: Y, slotScopeIds: ne } = m;
    process.env.NODE_ENV !== "production" && // #5523 dev root fragment may inherit directives
    (nt || B & 2048) && (B = 0, V = !1, Y = null), ne && (M = M ? M.concat(ne) : ne), h == null ? (r(O, y, I), r(X, y, I), j(
      // #10007
      // such fragment like `<></>` will be compiled into
      // a fragment which doesn't have a children.
      // In this case fallback to an empty array
      m.children || [],
      y,
      X,
      D,
      S,
      $,
      M,
      V
    )) : B > 0 && B & 64 && Y && // #2715 the previous fragment could've been a BAILed one as a result
    // of renderSlot() with no valid children
    h.dynamicChildren && h.dynamicChildren.length === Y.length ? (v(
      h.dynamicChildren,
      Y,
      y,
      D,
      S,
      $,
      M
    ), process.env.NODE_ENV !== "production" ? jr(h, m) : (
      // #2080 if the stable fragment has a key, it's a <template v-for> that may
      //  get moved around. Make sure all root level vnodes inherit el.
      // #2134 or if it's a component root, it may also get moved around
      // as the component is being moved.
      (m.key != null || D && m === D.subTree) && jr(
        h,
        m,
        !0
        /* shallow */
      )
    )) : ke(
      h,
      m,
      y,
      X,
      D,
      S,
      $,
      M,
      V
    );
  }, te = (h, m, y, I, D, S, $, M, V) => {
    m.slotScopeIds = M, h == null ? m.shapeFlag & 512 ? D.ctx.activate(
      m,
      y,
      I,
      $,
      V
    ) : J(
      m,
      y,
      I,
      D,
      S,
      $,
      V
    ) : ce(h, m, V);
  }, J = (h, m, y, I, D, S, $) => {
    const M = h.component = Cf(
      h,
      I,
      D
    );
    if (process.env.NODE_ENV !== "production" && M.type.__hmrId && Qc(M), process.env.NODE_ENV !== "production" && (Or(h), xn(M, "mount")), co(h) && (M.ctx.renderer = Lt), process.env.NODE_ENV !== "production" && xn(M, "init"), Rf(M, !1, $), process.env.NODE_ENV !== "production" && yn(M, "init"), process.env.NODE_ENV !== "production" && nt && (h.el = null), M.asyncDep) {
      if (D && D.registerDep(
        M,
        ie,
        $,
        S
      ), !h.el) {
        const V = M.subTree = Rt(Xe);
        T(null, V, m, y), h.placeholder = V.el;
      }
    } else
      ie(
        M,
        h,
        m,
        y,
        D,
        S,
        $
      );
    process.env.NODE_ENV !== "production" && (Tr(), yn(M, "mount"));
  }, ce = (h, m, y) => {
    const I = m.component = h.component;
    if (Zu(h, m, y))
      if (I.asyncDep && !I.asyncResolved) {
        process.env.NODE_ENV !== "production" && Or(m), m.el = h.el, m.placeholder = h.placeholder, oe(I, m, y), process.env.NODE_ENV !== "production" && Tr();
        return;
      } else
        I.next = m, I.update();
    else
      m.el = h.el, m.placeholder = h.placeholder, I.vnode = m;
  }, ie = (h, m, y, I, D, S, $) => {
    const M = () => {
      if (h.isMounted) {
        let { next: B, bu: Y, u: ne, parent: ue, vnode: he } = h;
        {
          const Qe = wi(h);
          if (Qe) {
            B && (B.el = he.el, oe(h, B, $)), Qe.asyncDep.then(() => {
              const et = () => {
                h.job.flags & 8 || (D && D.pendingBranch ? ze(et, D) : O());
              };
              et.flags = 48, ze(et, D);
            });
            return;
          }
        }
        let fe = B, Ce;
        process.env.NODE_ENV !== "production" && Or(B || h.vnode), en(h, !1), B ? (B.el = he.el, oe(h, B, $)) : B = he, Y && wn(Y), (Ce = B.props && B.props.onVnodeBeforeUpdate) && vt(Ce, ue, B, he), en(h, !0), process.env.NODE_ENV !== "production" && xn(h, "render");
        const Fe = Gi(h);
        process.env.NODE_ENV !== "production" && yn(h, "render");
        const He = h.subTree;
        h.subTree = Fe, process.env.NODE_ENV !== "production" && xn(h, "patch"), _(
          He,
          Fe,
          // parent may have changed if it's in a teleport. a root that is a
          // pending async component only has its placeholder comment
          f(
            He.el || Un(He)
          ),
          // anchor may have changed if it's in a fragment
          bn(He),
          h,
          D,
          S
        ), process.env.NODE_ENV !== "production" && yn(h, "patch"), B.el = Fe.el, fe === null && Xu(h, Fe.el), ne && ze(ne, D), (Ce = B.props && B.props.onVnodeUpdated) && ze(
          () => vt(Ce, ue, B, he),
          D
        ), process.env.NODE_ENV !== "production" && Tl(h), process.env.NODE_ENV !== "production" && Tr();
      } else {
        let B;
        const { el: Y, props: ne } = m, { bm: ue, m: he, parent: fe, root: Ce, type: Fe } = h, He = Jn(m);
        en(h, !1), ue && wn(ue), !He && (B = ne && ne.onVnodeBeforeMount) && vt(B, fe, m), en(h, !0);
        {
          Ce.ce && Ce.ce._hasShadowRoot() && Ce.ce._injectChildStyle(
            Fe,
            h.parent ? h.parent.type : void 0
          ), process.env.NODE_ENV !== "production" && xn(h, "render");
          const Qe = h.subTree = Gi(h);
          process.env.NODE_ENV !== "production" && yn(h, "render"), process.env.NODE_ENV !== "production" && xn(h, "patch"), _(
            null,
            Qe,
            y,
            I,
            h,
            D,
            S
          ), process.env.NODE_ENV !== "production" && yn(h, "patch"), m.el = Qe.el;
        }
        if (he && ze(he, D), !He && (B = ne && ne.onVnodeMounted)) {
          const Qe = m;
          ze(
            () => vt(B, fe, Qe),
            D
          );
        }
        (m.shapeFlag & 256 || fe && Jn(fe.vnode) && fe.vnode.shapeFlag & 256) && h.a && ze(h.a, D), h.isMounted = !0, process.env.NODE_ENV !== "production" && iu(h), m = y = I = null;
      }
    };
    h.scope.on();
    const V = h.effect = new ll(M);
    h.scope.off();
    const O = h.update = V.run.bind(V), X = h.job = V.runIfDirty.bind(V);
    X.i = h, X.id = h.uid, V.scheduler = () => Zn(X), en(h, !0), process.env.NODE_ENV !== "production" && (V.onTrack = h.rtc ? (B) => wn(h.rtc, B) : void 0, V.onTrigger = h.rtg ? (B) => wn(h.rtg, B) : void 0), O();
  }, oe = (h, m, y) => {
    m.component = h;
    const I = h.vnode.props;
    h.vnode = m, h.next = null, Qu(h, m.props, I, y), uf(h, m.children, y), st(), Nl(h), lt();
  }, ke = (h, m, y, I, D, S, $, M, V = !1) => {
    const O = h && h.children, X = h ? h.shapeFlag : 0, B = m.children, { patchFlag: Y, shapeFlag: ne } = m;
    if (Y > 0) {
      if (Y & 128) {
        Ye(
          O,
          B,
          y,
          I,
          D,
          S,
          $,
          M,
          V
        );
        return;
      } else if (Y & 256) {
        se(
          O,
          B,
          y,
          I,
          D,
          S,
          $,
          M,
          V
        );
        return;
      }
    }
    ne & 8 ? (X & 16 && Xt(O, D, S), B !== O && u(y, B)) : X & 16 ? ne & 16 ? Ye(
      O,
      B,
      y,
      I,
      D,
      S,
      $,
      M,
      V
    ) : Xt(O, D, S, !0) : (X & 8 && u(y, ""), ne & 16 && j(
      B,
      y,
      I,
      D,
      S,
      $,
      M,
      V
    ));
  }, se = (h, m, y, I, D, S, $, M, V) => {
    h = h || an, m = m || an;
    const O = h.length, X = m.length, B = Math.min(O, X);
    let Y;
    for (Y = 0; Y < B; Y++) {
      const ne = m[Y] = V ? It(m[Y]) : pt(m[Y]);
      _(
        h[Y],
        ne,
        y,
        null,
        D,
        S,
        $,
        M,
        V
      );
    }
    O > X ? Xt(
      h,
      D,
      S,
      !0,
      !1,
      B
    ) : j(
      m,
      y,
      I,
      D,
      S,
      $,
      M,
      V,
      B
    );
  }, Ye = (h, m, y, I, D, S, $, M, V) => {
    let O = 0;
    const X = m.length;
    let B = h.length - 1, Y = X - 1;
    for (; O <= B && O <= Y; ) {
      const ne = h[O], ue = m[O] = V ? It(m[O]) : pt(m[O]);
      if (On(ne, ue))
        _(
          ne,
          ue,
          y,
          null,
          D,
          S,
          $,
          M,
          V
        );
      else
        break;
      O++;
    }
    for (; O <= B && O <= Y; ) {
      const ne = h[B], ue = m[Y] = V ? It(m[Y]) : pt(m[Y]);
      if (On(ne, ue))
        _(
          ne,
          ue,
          y,
          null,
          D,
          S,
          $,
          M,
          V
        );
      else
        break;
      B--, Y--;
    }
    if (O > B) {
      if (O <= Y) {
        const ne = Y + 1, ue = ne < X ? m[ne].el : I;
        for (; O <= Y; )
          _(
            null,
            m[O] = V ? It(m[O]) : pt(m[O]),
            y,
            ue,
            D,
            S,
            $,
            M,
            V
          ), O++;
      }
    } else if (O > Y)
      for (; O <= B; )
        ut(h[O], D, S, !0), O++;
    else {
      const ne = O, ue = O, he = /* @__PURE__ */ new Map();
      for (O = ue; O <= Y; O++) {
        const Se = m[O] = V ? It(m[O]) : pt(m[O]);
        Se.key != null && (process.env.NODE_ENV !== "production" && he.has(Se.key) && P(
          "Duplicate keys found during update:",
          JSON.stringify(Se.key),
          "Make sure keys are unique."
        ), he.set(Se.key, O));
      }
      let fe, Ce = 0;
      const Fe = Y - ue + 1;
      let He = !1, Qe = 0;
      const et = new Array(Fe);
      for (O = 0; O < Fe; O++) et[O] = 0;
      for (O = ne; O <= B; O++) {
        const Se = h[O];
        if (Ce >= Fe) {
          ut(Se, D, S, !0);
          continue;
        }
        let Me;
        if (Se.key != null)
          Me = he.get(Se.key);
        else
          for (fe = ue; fe <= Y; fe++)
            if (et[fe - ue] === 0 && On(Se, m[fe])) {
              Me = fe;
              break;
            }
        Me === void 0 ? ut(Se, D, S, !0) : (et[Me - ue] = O + 1, Me >= Qe ? Qe = Me : He = !0, _(
          Se,
          m[Me],
          y,
          null,
          D,
          S,
          $,
          M,
          V
        ), Ce++);
      }
      const vr = He ? gf(et) : an;
      for (fe = vr.length - 1, O = Fe - 1; O >= 0; O--) {
        const Se = ue + O, Me = m[Se], z = m[Se + 1], F = Se + 1 < X ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          z.el || Un(z)
        ) : I;
        et[O] === 0 ? _(
          null,
          Me,
          y,
          F,
          D,
          S,
          $,
          M,
          V
        ) : He && (fe < 0 || O !== vr[fe] ? Ge(Me, y, F, 2) : fe--);
      }
    }
  }, Ge = (h, m, y, I, D = null) => {
    const { el: S, type: $, transition: M, children: V, shapeFlag: O } = h;
    if (O & 6) {
      Ge(h.component.subTree, m, y, I);
      return;
    }
    if (O & 128) {
      h.suspense.move(m, y, I);
      return;
    }
    if (O & 64) {
      $.move(h, m, y, Lt);
      return;
    }
    if ($ === Ee) {
      r(S, m, y);
      for (let B = 0; B < V.length; B++)
        Ge(V[B], m, y, I);
      r(h.anchor, m, y);
      return;
    }
    if ($ === Mr) {
      C(h, m, y);
      return;
    }
    if (I !== 2 && O & 1 && M)
      if (I === 0)
        M.persisted && !S[Co] ? r(S, m, y) : (M.beforeEnter(S), r(S, m, y), ze(() => M.enter(S), D));
      else {
        const { leave: B, delayLeave: Y, afterLeave: ne } = M, ue = () => {
          h.ctx.isUnmounted ? o(S) : r(S, m, y);
        }, he = () => {
          const fe = S._isLeaving || !!S[Co];
          S._isLeaving && S[Co](
            !0
            /* cancelled */
          ), M.persisted && !fe ? ue() : B(S, () => {
            ue(), ne && ne();
          });
        };
        Y ? Y(S, ue, he) : he();
      }
    else
      r(S, m, y);
  }, ut = (h, m, y, I = !1, D = !1) => {
    const {
      type: S,
      props: $,
      ref: M,
      children: V,
      dynamicChildren: O,
      shapeFlag: X,
      patchFlag: B,
      dirs: Y,
      cacheIndex: ne,
      memo: ue
    } = h;
    if ((B === -2 || O && O.hasOnce) && (D = !1), M != null && (st(), Ln(M, null, y, h, !0), lt()), ne != null && (!h.ctx || h.ctx === m) && (m.renderCache[ne] = void 0), X & 256 && m.ctx.deactivate(h))
      return;
    const he = X & 1 && Y, fe = !Jn(h);
    let Ce;
    if (fe && (Ce = $ && $.onVnodeBeforeUnmount) && vt(Ce, m, h), X & 6)
      _r(h.component, y, I);
    else {
      if (X & 128) {
        h.suspense.unmount(y, I);
        return;
      }
      he && Qt(h, null, m, "beforeUnmount"), X & 64 ? h.type.remove(
        h,
        m,
        y,
        Lt,
        I
      ) : O && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !O.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (S !== Ee || B > 0 && B & 64) ? Xt(
        O,
        m,
        y,
        !1,
        !0
      ) : (S === Ee && B & 384 || !D && X & 16) && Xt(V, m, y), I && Ft(h);
    }
    const Fe = ue != null && ne == null;
    (fe && (Ce = $ && $.onVnodeUnmounted) || he || Fe) && ze(() => {
      Ce && vt(Ce, m, h), he && Qt(h, null, m, "unmounted"), Fe && (h.el = null);
    }, y);
  }, Ft = (h) => {
    const { type: m, el: y, anchor: I, transition: D } = h, S = m === Ee;
    if (S && !D) {
      _n(y, I);
      return;
    }
    if (m === Mr) {
      b(h), D && !D.persisted && D.afterLeave && D.afterLeave();
      return;
    }
    const $ = S ? qo(h) : h, M = () => {
      S ? f(y) && _n(y, I) : o(y), D && !D.persisted && D.afterLeave && D.afterLeave();
    };
    if ($ && $.shapeFlag & 1 && D && !D.persisted) {
      const { leave: V, delayLeave: O } = D, X = $.el, B = () => V(X, M);
      O ? O(X, M, B) : B();
    } else
      M();
  }, _n = (h, m) => {
    let y;
    for (; h !== m; )
      y = p(h), o(h), h = y;
    o(m);
  }, _r = (h, m, y) => {
    process.env.NODE_ENV !== "production" && h.type.__hmrId && eu(h);
    const { bum: I, scope: D, job: S, subTree: $, um: M, m: V, a: O } = h;
    os(V), os(O), I && wn(I), D.stop(), S ? (S.flags |= 8, ut($, h, m, y)) : $ && ($.transition = h.vnode.transition, ut($, h, m, y)), M && ze(M, m);
    const X = () => {
      h.isUnmounted = !0;
    };
    X.flags = 16, ze(X, m), process.env.NODE_ENV !== "production" && lu(h);
  }, Xt = (h, m, y, I = !1, D = !1, S = 0) => {
    for (let $ = S; $ < h.length; $++)
      ut(h[$], m, y, I, D);
  }, bn = (h) => {
    if (h.shapeFlag & 6)
      return bn(h.component.subTree);
    if (h.shapeFlag & 128)
      return h.suspense.next();
    const m = p(h.anchor || h.el), y = m && m[mu];
    return y ? p(y) : m;
  }, br = (h, m, y) => {
    const I = h && m._vnode ? void 0 : h && h.component ? h.component.uid : kf();
    Gc(() => {
      h == null ? m._vnode && ut(m._vnode, null, null, !0) : _(
        m._vnode || null,
        h,
        m,
        null,
        null,
        null,
        y
      ), m._vnode = h;
    }, I);
  }, Lt = {
    p: _,
    um: ut,
    m: Ge,
    r: Ft,
    mt: J,
    mc: j,
    pc: ke,
    pbc: v,
    n: bn,
    o: e
  };
  return {
    render: br,
    hydrate: void 0,
    createApp: Ju(br)
  };
}
function Ro({ type: e, props: t }, n) {
  return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function en({ effect: e, job: t }, n) {
  n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function hf(e, t) {
  return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function jr(e, t, n = !1) {
  const r = e.children, o = t.children;
  if (Z(r) && Z(o))
    for (let i = 0; i < r.length; i++) {
      const s = r[i];
      let l = o[i];
      l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && (l = o[i] = It(o[i]), l.el = s.el), !n && l.patchFlag !== -2 && jr(s, l)), l.type === hr && (l.patchFlag === -1 && (l = o[i] = It(l)), l.el = s.el), l.type === Xe && !l.el && (l.el = s.el), process.env.NODE_ENV !== "production" && l.el && (l.el.__vnode = l);
    }
}
function gf(e) {
  const t = e.slice(), n = [0];
  let r, o, i, s, l;
  const a = e.length;
  for (r = 0; r < a; r++) {
    const c = e[r];
    if (c !== 0) {
      if (o = n[n.length - 1], e[o] < c) {
        t[r] = o, n.push(r);
        continue;
      }
      for (i = 0, s = n.length - 1; i < s; )
        l = i + s >> 1, e[n[l]] < c ? i = l + 1 : s = l;
      c < e[n[i]] && (i > 0 && (t[r] = n[i - 1]), n[i] = r);
    }
  }
  for (i = n.length, s = n[i - 1]; i-- > 0; )
    n[i] = s, s = t[s];
  return n;
}
function wi(e) {
  const t = e.subTree.component;
  if (t)
    return t.asyncDep && !t.asyncResolved ? t : wi(t);
}
function os(e) {
  if (e)
    for (let t = 0; t < e.length; t++)
      e[t].flags |= 8;
}
function Un(e) {
  if (e.placeholder)
    return e.placeholder;
  const t = e.component;
  if (t)
    return Un(t.subTree);
  const n = e.suspense;
  return n && n.activeBranch ? Un(n.activeBranch) : null;
}
const oa = (e) => e.__isSuspense, mf = /* @__PURE__ */ Symbol("_deferredEnter");
function _f(e, t) {
  t && t.pendingBranch ? Z(e) ? t.effects.push(...e) : t.effects.push(e) : Wo(e);
}
const Ee = /* @__PURE__ */ Symbol.for("v-fgt"), hr = /* @__PURE__ */ Symbol.for("v-txt"), Xe = /* @__PURE__ */ Symbol.for("v-cmt"), Mr = /* @__PURE__ */ Symbol.for("v-stc"), pn = [];
let rt = null;
function U(e = !1) {
  pn.push(rt = e ? null : []);
}
function ia() {
  pn.pop(), rt = pn[pn.length - 1] || null;
}
let Gn = 1;
function is(e, t = !1) {
  Gn += e, e < 0 && rt && t && (rt.hasOnce = !0);
}
function sa(e) {
  return e.dynamicChildren = Gn > 0 ? rt || an : null, ia(), Gn > 0 && rt && rt.push(e), e;
}
function W(e, t, n, r, o, i) {
  return sa(
    k(
      e,
      t,
      n,
      r,
      o,
      i,
      !0
    )
  );
}
function bf(e, t, n, r, o) {
  return sa(
    Rt(
      e,
      t,
      n,
      r,
      o,
      !0
    )
  );
}
function po(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function On(e, t) {
  if (process.env.NODE_ENV !== "production" && t.shapeFlag & 6 && e.component) {
    const n = sn.get(t.type);
    if (n && n.has(e.component))
      return e.shapeFlag &= -257, t.shapeFlag &= -513, !1;
  }
  return e.type === t.type && e.key === t.key;
}
const vf = (...e) => aa(
  ...e
), la = ({ key: e }) => e ?? null, Vr = ({
  ref: e,
  ref_key: t,
  ref_for: n
}) => (typeof e == "number" && (e = "" + e), e != null ? ye(e) || /* @__PURE__ */ Re(e) || ee(e) ? { i: Ue, r: e, k: t, f: !!n } : e : null);
function k(e, t = null, n = null, r = 0, o = null, i = e === Ee ? 0 : 1, s = !1, l = !1) {
  const a = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && la(t),
    ref: t && Vr(t),
    scopeId: jl,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: r,
    dynamicProps: o,
    dynamicChildren: null,
    appContext: null,
    ctx: Ue
  };
  if (l ? (Zr(a, n), i & 128 && e.normalize(a)) : n && (a.shapeFlag |= ye(n) ? 8 : 16), process.env.NODE_ENV !== "production" && a.key !== a.key && P("VNode created with invalid key (NaN). VNode type:", a.type), process.env.NODE_ENV !== "production" && t && a.shapeFlag & 1) {
    const c = t.innerHTML != null ? "innerHTML" : t.textContent != null ? "textContent" : null;
    c && xf(a.children) && P(
      `The \`${c}\` prop on <${a.type}> will override its children. Remove either the \`${c}\` prop or the children.`
    );
  }
  return Gn > 0 && // avoid a block node from tracking itself
  !s && // has current parent block
  rt && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (a.patchFlag > 0 || i & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  a.patchFlag !== 32 && rt.push(a), a;
}
function xf(e) {
  return ye(e) ? e !== "" : Z(e) ? e.length > 0 : !1;
}
const Rt = process.env.NODE_ENV !== "production" ? vf : aa;
function aa(e, t = null, n = null, r = 0, o = null, i = !1) {
  if ((!e || e === Fu) && (process.env.NODE_ENV !== "production" && !e && P(`Invalid vnode type when creating vnode: ${e}.`), e = Xe), po(e)) {
    const l = Kt(
      e,
      t,
      !0
      /* mergeRef: true */
    );
    return n && Zr(l, n), Gn > 0 && !i && rt && (l.shapeFlag & 6 ? rt[rt.indexOf(e)] = l : rt.push(l)), l.patchFlag = -2, l;
  }
  if (ga(e) && (e = e.__vccOpts), t) {
    t = yf(t);
    let { class: l, style: a } = t;
    l && !ye(l) && (t.class = Be(l)), pe(a) && (/* @__PURE__ */ $r(a) && !Z(a) && (a = xe({}, a)), t.style = ui(a));
  }
  const s = ye(e) ? 1 : oa(e) ? 128 : ao(e) ? 64 : pe(e) ? 4 : ee(e) ? 2 : 0;
  return process.env.NODE_ENV !== "production" && s & 4 && /* @__PURE__ */ $r(e) && (e = /* @__PURE__ */ le(e), P(
    "Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with `markRaw` or using `shallowRef` instead of `ref`.",
    `
Component that was made reactive: `,
    e
  )), k(
    e,
    t,
    n,
    r,
    o,
    s,
    i,
    !0
  );
}
function yf(e) {
  return e ? /* @__PURE__ */ $r(e) ? xe({}, e) : Gl(e) ? xe({}, e[ti] || e) : e : null;
}
function Kt(e, t, n = !1, r = !1) {
  const { props: o, ref: i, patchFlag: s, children: l, transition: a } = e, c = t ? wf(o || {}, t) : o, u = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: c,
    key: c && la(c),
    ref: t && t.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      n && i ? Z(i) ? i.concat(Vr(t)) : [i, Vr(t)] : Vr(t)
    ) : i,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: process.env.NODE_ENV !== "production" && s === -1 && Z(l) ? l.map(ca) : l,
    target: e.target,
    targetStart: e.targetStart,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: t && e.type !== Ee ? s === -1 ? 16 : s | 16 : s,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: a,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Kt(e.ssContent),
    ssFallback: e.ssFallback && Kt(e.ssFallback),
    placeholder: e.placeholder,
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
    cacheIndex: e.cacheIndex
  };
  return a && r && zn(
    u,
    a.clone(u)
  ), u;
}
function ca(e) {
  const t = Kt(e);
  return Z(e.children) && (t.children = e.children.map(ca)), t;
}
function ua(e = " ", t = 0) {
  return Rt(hr, null, e, t);
}
function de(e = "", t = !1) {
  return t ? (U(), bf(Xe, null, e)) : Rt(Xe, null, e);
}
function pt(e) {
  return e == null || typeof e == "boolean" ? Rt(Xe) : Z(e) ? Rt(
    Ee,
    null,
    // #3666, avoid reference pollution when reusing vnode
    e.slice()
  ) : po(e) ? It(e) : Rt(hr, null, String(e));
}
function It(e) {
  return e.el === null && e.patchFlag !== -1 || e.memo ? e : Kt(e);
}
function Zr(e, t) {
  let n = 0;
  const { shapeFlag: r } = e;
  if (t == null)
    t = null;
  else if (Z(t))
    n = 16;
  else if (typeof t == "object")
    if (r & 65) {
      const o = t.default;
      o && (o._c && (o._d = !1), Zr(e, o()), o._c && (o._d = !0));
      return;
    } else {
      n = 32;
      const o = t._;
      !o && !Gl(t) ? t._ctx = Ue : o === 3 && Ue && (Ue.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
    }
  else if (ee(t)) {
    if (r & 65) {
      Zr(e, { default: t });
      return;
    }
    t = { default: t, _ctx: Ue }, n = 32;
  } else
    t = String(t), r & 64 ? (n = 16, t = [ua(t)]) : n = 8;
  e.children = t, e.shapeFlag |= n;
}
function wf(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    for (const o in r)
      if (o === "class")
        t.class !== r.class && (t.class = Be([t.class, r.class]));
      else if (o === "style")
        t.style = ui([t.style, r.style]);
      else if (ar(o)) {
        const i = t[o], s = r[o];
        s && i !== s && !(Z(i) && i.includes(s)) ? t[o] = i ? [].concat(i, s) : s : s == null && i == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !Wn(o) && (t[o] = s);
      } else o !== "" && (t[o] = r[o]);
  }
  return t;
}
function vt(e, t, n, r = null) {
  bt(e, t, 7, [
    n,
    r
  ]);
}
const Ef = /* @__PURE__ */ Hl();
let fa = 0;
function kf() {
  return fa;
}
function Cf(e, t, n) {
  const r = e.type, o = (t ? t.appContext : e.appContext) || Ef, i = {
    uid: fa++,
    vnode: e,
    type: r,
    parent: t,
    appContext: o,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new vc(
      !0
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: t ? t.provides : Object.create(o.provides),
    ids: t ? t.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: ea(r, o),
    emitsOptions: ql(r, o),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: _e,
    // inheritAttrs
    inheritAttrs: r.inheritAttrs,
    // state
    ctx: _e,
    data: _e,
    props: _e,
    attrs: _e,
    slots: _e,
    refs: _e,
    setupState: _e,
    setupContext: null,
    // suspense related
    suspense: n,
    suspenseId: n ? n.pendingId : 0,
    asyncDep: null,
    asyncResolved: !1,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: !1,
    isUnmounted: !1,
    isDeactivated: !1,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  return process.env.NODE_ENV !== "production" ? i.ctx = Tu(i) : i.ctx = { _: i }, i.root = t ? t.root : i, i.emit = Wu.bind(null, i), e.ce && e.ce(i), i;
}
let Oe = null;
const ho = () => Oe || Ue;
let Xr, Qn;
{
  const e = fr(), t = (n, r) => {
    let o;
    return (o = e[n]) || (o = e[n] = []), o.push(r), (i) => {
      o.length > 1 ? o.forEach((s) => s(i)) : o[0](i);
    };
  };
  Xr = t(
    "__VUE_INSTANCE_SETTERS__",
    (n) => Oe = n
  ), Qn = t(
    "__VUE_SSR_SETTERS__",
    (n) => er = n
  );
}
const gr = (e) => {
  const t = Oe;
  return Xr(e), e.scope.on(), () => {
    e.scope.off(), Xr(t);
  };
}, ss = () => {
  Oe && Oe.scope.off(), Xr(null);
}, Df = /* @__PURE__ */ $t("slot,component");
function ei(e, { isNativeTag: t }) {
  (Df(e) || t(e)) && P(
    "Do not use built-in or reserved HTML elements as component id: " + e
  );
}
function da(e) {
  return e.vnode.shapeFlag & 4;
}
let er = !1;
function Rf(e, t = !1, n = !1) {
  t && Qn(t);
  const { props: r, children: o } = e.vnode, i = da(e);
  Yu(e, r, i, t), cf(e, o, n || t);
  const s = i ? Af(e, t) : void 0;
  return t && Qn(!1), s;
}
function Af(e, t) {
  const n = e.type;
  if (process.env.NODE_ENV !== "production") {
    if (n.name && ei(n.name, e.appContext.config), n.components) {
      const o = Object.keys(n.components);
      for (let i = 0; i < o.length; i++)
        ei(o[i], e.appContext.config);
    }
    if (n.directives) {
      const o = Object.keys(n.directives);
      for (let i = 0; i < o.length; i++)
        Ml(o[i]);
    }
    n.compilerOptions && Nf() && P(
      '"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.'
    );
  }
  e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, Jl), process.env.NODE_ENV !== "production" && Iu(e);
  const { setup: r } = n;
  if (r) {
    st();
    const o = e.setupContext = r.length > 1 ? Sf(e) : null, i = gr(e), s = An(
      r,
      e,
      0,
      [
        process.env.NODE_ENV !== "production" ? /* @__PURE__ */ Je(e.props) : e.props,
        o
      ]
    ), l = li(s);
    if (lt(), i(), (l || e.sp) && !Jn(e) && zl(e), l) {
      if (s.then(ss, ss), t)
        return s.then((a) => {
          Qn(!0);
          try {
            ls(e, a, t);
          } finally {
            Qn(!1);
          }
        }).catch((a) => {
          dr(a, e, 0, void 0, !0), e.ssrRender = (c, u) => u("<!---->");
        });
      if (e.asyncDep = s, process.env.NODE_ENV !== "production" && !e.suspense) {
        const a = mr(e, n);
        P(
          `Component <${a}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`
        );
      }
    } else
      ls(e, s, t);
  } else
    pa(e, t);
}
function ls(e, t, n) {
  ee(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : pe(t) ? (process.env.NODE_ENV !== "production" && po(t) && P(
    "setup() should not return VNodes directly - return a render function instead."
  ), process.env.NODE_ENV !== "production" && (e.devtoolsRawSetupState = t), e.setupState = Cl(t), process.env.NODE_ENV !== "production" && ju(e)) : process.env.NODE_ENV !== "production" && t !== void 0 && P(
    `setup() should return an object. Received: ${t === null ? "null" : typeof t}`
  ), pa(e, n);
}
const Nf = () => !0;
function pa(e, t, n) {
  const r = e.type;
  e.render || (e.render = r.render || Ne);
  {
    const o = gr(e);
    st();
    try {
      Vu(e);
    } finally {
      lt(), o();
    }
  }
  process.env.NODE_ENV !== "production" && !r.render && e.render === Ne && !t && (r.template ? P(
    'Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".'
  ) : P("Component is missing template or render function: ", r));
}
const ti = /* @__PURE__ */ Symbol(), as = process.env.NODE_ENV !== "production" ? {
  get(e, t) {
    return qr(), Te(e, "get", ""), t === ti ? e : e[t];
  },
  set() {
    return P("setupContext.attrs is readonly."), !1;
  },
  deleteProperty() {
    return P("setupContext.attrs is readonly."), !1;
  }
} : {
  get(e, t) {
    return Te(e, "get", ""), t === ti ? e : e[t];
  }
};
function Ff(e) {
  return new Proxy(e.slots, {
    get(t, n) {
      return Te(e, "get", "$slots"), t[n];
    }
  });
}
function Sf(e) {
  const t = (n) => {
    if (process.env.NODE_ENV !== "production" && (e.exposed && P("expose() should be called only once per setup()."), n != null)) {
      let r = typeof n;
      r === "object" && (Z(n) ? r = "array" : /* @__PURE__ */ Re(n) && (r = "ref")), r !== "object" && P(
        `expose() should be passed a plain object, received ${r}.`
      );
    }
    e.exposed = n || {};
  };
  if (process.env.NODE_ENV !== "production") {
    let n, r;
    return Object.freeze({
      get attrs() {
        return n || (n = new Proxy(e.attrs, as));
      },
      get slots() {
        return r || (r = Ff(e));
      },
      get emit() {
        return (o, ...i) => e.emit(o, ...i);
      },
      expose: t
    });
  } else
    return {
      attrs: new Proxy(e.attrs, as),
      slots: e.slots,
      emit: e.emit,
      expose: t
    };
}
function go(e) {
  return e.exposed ? e.exposeProxy || (e.exposeProxy = new Proxy(Cl(Pc(e.exposed)), {
    get(t, n) {
      if (n in t)
        return t[n];
      if (n in dn)
        return dn[n](e);
    },
    has(t, n) {
      return n in t || n in dn;
    }
  })) : e.proxy;
}
const Of = /(?:^|[-_])\w/g, Tf = (e) => e.replace(Of, (t) => t.toUpperCase()).replace(/[-_]/g, "");
function ha(e, t = !0) {
  return ee(e) ? e.displayName || e.name : e.name || t && e.__name;
}
function mr(e, t, n = !1) {
  let r = ha(t);
  if (!r && t.__file) {
    const o = t.__file.match(/([^/\\]+)\.\w+$/);
    o && (r = o[1]);
  }
  if (!r && e) {
    const o = (i) => {
      for (const s in i)
        if (i[s] === t)
          return s;
    };
    r = o(e.components) || e.parent && o(
      e.parent.type.components
    ) || o(e.appContext.components);
  }
  return r ? Tf(r) : n ? "App" : "Anonymous";
}
function ga(e) {
  return ee(e) && "__vccOpts" in e;
}
const qe = (e, t) => {
  const n = /* @__PURE__ */ Lc(e, t, er);
  if (process.env.NODE_ENV !== "production") {
    const r = ho();
    r && r.appContext.config.warnRecursiveComputed && (n._warnRecursive = !0);
  }
  return n;
};
function If() {
  if (process.env.NODE_ENV === "production" || typeof window > "u")
    return;
  const e = { style: "color:#3ba776" }, t = { style: "color:#1677ff" }, n = { style: "color:#f5222d" }, r = { style: "color:#eb2f96" }, o = {
    __vue_custom_formatter: !0,
    header(f) {
      if (!pe(f))
        return null;
      if (f.__isVue)
        return ["div", e, "VueInstance"];
      if (/* @__PURE__ */ Re(f)) {
        st();
        const p = f.value;
        return lt(), [
          "div",
          {},
          ["span", e, u(f)],
          "<",
          l(p),
          ">"
        ];
      } else {
        if (/* @__PURE__ */ Bt(f))
          return [
            "div",
            {},
            ["span", e, /* @__PURE__ */ We(f) ? "ShallowReactive" : "Reactive"],
            "<",
            l(f),
            `>${/* @__PURE__ */ at(f) ? " (readonly)" : ""}`
          ];
        if (/* @__PURE__ */ at(f))
          return [
            "div",
            {},
            ["span", e, /* @__PURE__ */ We(f) ? "ShallowReadonly" : "Readonly"],
            "<",
            l(f),
            ">"
          ];
      }
      return null;
    },
    hasBody(f) {
      return f && f.__isVue;
    },
    body(f) {
      if (f && f.__isVue)
        return [
          "div",
          {},
          ...i(f.$)
        ];
    }
  };
  function i(f) {
    const p = [];
    f.type.props && f.props && p.push(s("props", /* @__PURE__ */ le(f.props))), f.setupState !== _e && p.push(s("setup", f.setupState)), f.data !== _e && p.push(s("data", /* @__PURE__ */ le(f.data)));
    const d = a(f, "computed");
    d && p.push(s("computed", d));
    const g = a(f, "inject");
    return g && p.push(s("injected", g)), p.push([
      "div",
      {},
      [
        "span",
        {
          style: r.style + ";opacity:0.66"
        },
        "$ (internal): "
      ],
      ["object", { object: f }]
    ]), p;
  }
  function s(f, p) {
    return p = xe({}, p), Object.keys(p).length ? [
      "div",
      { style: "line-height:1.25em;margin-bottom:0.6em" },
      [
        "div",
        {
          style: "color:#476582"
        },
        f
      ],
      [
        "div",
        {
          style: "padding-left:1.25em"
        },
        ...Object.keys(p).map((d) => [
          "div",
          {},
          ["span", r, d + ": "],
          l(p[d], !1)
        ])
      ]
    ] : ["span", {}];
  }
  function l(f, p = !0) {
    return typeof f == "number" ? ["span", t, f] : typeof f == "string" ? ["span", n, JSON.stringify(f)] : typeof f == "boolean" ? ["span", r, f] : pe(f) ? ["object", { object: p ? /* @__PURE__ */ le(f) : f }] : ["span", n, String(f)];
  }
  function a(f, p) {
    const d = f.type;
    if (ee(d))
      return;
    const g = {};
    for (const _ in f.ctx)
      c(d, _, p) && (g[_] = f.ctx[_]);
    return g;
  }
  function c(f, p, d) {
    const g = f[d];
    if (Z(g) && g.includes(p) || pe(g) && p in g || f.extends && c(f.extends, p, d) || f.mixins && f.mixins.some((_) => c(_, p, d)))
      return !0;
  }
  function u(f) {
    return /* @__PURE__ */ We(f) ? "ShallowRef" : f.effect ? "ComputedRef" : "Ref";
  }
  window.devtoolsFormatters ? window.devtoolsFormatters.push(o) : window.devtoolsFormatters = [o];
}
const cs = "3.5.45", Ze = process.env.NODE_ENV !== "production" ? P : Ne;
process.env.NODE_ENV;
process.env.NODE_ENV;
/**
* @vue/runtime-dom v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let ni;
const us = typeof window < "u" && window.trustedTypes;
if (us)
  try {
    ni = /* @__PURE__ */ us.createPolicy("vue", {
      createHTML: (e) => e
    });
  } catch (e) {
    process.env.NODE_ENV !== "production" && Ze(`Error creating trusted types policy: ${e}`);
  }
const ma = ni ? (e) => ni.createHTML(e) : (e) => e, jf = "http://www.w3.org/2000/svg", Mf = "http://www.w3.org/1998/Math/MathML", Ot = typeof document < "u" ? document : null, fs = Ot && /* @__PURE__ */ Ot.createElement("template"), Vf = {
  insert: (e, t, n) => {
    t.insertBefore(e, n || null);
  },
  remove: (e) => {
    const t = e.parentNode;
    t && t.removeChild(e);
  },
  createElement: (e, t, n, r) => {
    const o = t === "svg" ? Ot.createElementNS(jf, e) : t === "mathml" ? Ot.createElementNS(Mf, e) : n ? Ot.createElement(e, { is: n }) : Ot.createElement(e);
    return e === "select" && r && r.multiple != null && o.setAttribute("multiple", r.multiple), o;
  },
  createText: (e) => Ot.createTextNode(e),
  createComment: (e) => Ot.createComment(e),
  setText: (e, t) => {
    e.nodeValue = t;
  },
  setElementText: (e, t) => {
    e.textContent = t;
  },
  parentNode: (e) => e.parentNode,
  nextSibling: (e) => e.nextSibling,
  querySelector: (e) => Ot.querySelector(e),
  setScopeId(e, t) {
    e.setAttribute(t, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(e, t, n, r, o, i) {
    const s = n ? n.previousSibling : t.lastChild;
    if (o && (o === i || o.nextSibling))
      for (; t.insertBefore(o.cloneNode(!0), n), !(o === i || !(o = o.nextSibling)); )
        ;
    else {
      fs.innerHTML = ma(
        r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e
      );
      const l = fs.content;
      if (r === "svg" || r === "mathml") {
        const a = l.firstChild;
        for (; a.firstChild; )
          l.appendChild(a.firstChild);
        l.removeChild(a);
      }
      t.insertBefore(l, n);
    }
    return [
      // first
      s ? s.nextSibling : t.firstChild,
      // last
      n ? n.previousSibling : t.lastChild
    ];
  }
}, Pf = /* @__PURE__ */ Symbol("_vtc");
function Bf(e, t, n) {
  const r = e[Pf];
  r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
const ds = /* @__PURE__ */ Symbol("_vod"), $f = /* @__PURE__ */ Symbol("_vsh"), zf = /* @__PURE__ */ Symbol(process.env.NODE_ENV !== "production" ? "CSS_VAR_TEXT" : ""), Lf = /(?:^|;)\s*display\s*:/;
function Jf(e, t, n) {
  const r = e.style, o = ye(n);
  let i = !1;
  if (n && !o) {
    if (t)
      if (ye(t))
        for (const s of t.split(";")) {
          const l = s.slice(0, s.indexOf(":")).trim();
          n[l] == null && Mn(r, l, "");
        }
      else
        for (const s in t)
          n[s] == null && Mn(r, s, "");
    for (const s in n) {
      s === "display" && (i = !0);
      const l = n[s];
      l != null ? Hf(
        e,
        s,
        !ye(t) && t ? t[s] : void 0,
        l
      ) || Mn(r, s, l) : Mn(r, s, "");
    }
  } else if (o) {
    if (t !== n) {
      const s = r[zf];
      s && (n += ";" + s), r.cssText = n, i = Lf.test(n);
    }
  } else t && e.removeAttribute("style");
  ds in e && ((!o || t !== n) && (e[ds] = i ? r.display : ""), e[$f] && (r.display = "none"));
}
const Uf = /[^\\];\s*$/, Er = /\s*!important$/;
function Mn(e, t, n) {
  if (Z(n))
    n.forEach((r) => Mn(e, t, r));
  else if (n == null && (n = ""), process.env.NODE_ENV !== "production" && Uf.test(n) && Ze(
    `Unexpected semicolon at the end of '${t}' style value: '${n}'`
  ), t.startsWith("--"))
    Er.test(n) ? e.setProperty(t, n.replace(Er, ""), "important") : e.setProperty(t, n);
  else {
    const r = Wf(e, t);
    Er.test(n) ? e.setProperty(
      tt(r),
      n.replace(Er, ""),
      "important"
    ) : e[r] = n;
  }
}
const ps = ["Webkit", "Moz", "ms"], Ao = {};
function Wf(e, t) {
  const n = Ao[t];
  if (n)
    return n;
  let r = Pe(t);
  if (r !== "filter" && r in e)
    return Ao[t] = r;
  r = oo(r);
  for (let o = 0; o < ps.length; o++) {
    const i = ps[o] + r;
    if (i in e)
      return Ao[t] = i;
  }
  return t;
}
function Hf(e, t, n, r) {
  return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && ye(r) && n === r;
}
const hs = "http://www.w3.org/1999/xlink";
function gs(e, t, n, r, o, i = gc(t)) {
  r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(hs, t.slice(6, t.length)) : e.setAttributeNS(hs, t, n) : n == null || i && !rl(n) ? e.removeAttribute(t) : e.setAttribute(
    t,
    i ? "" : _t(n) ? String(n) : n
  );
}
function ms(e, t, n, r, o) {
  if (t === "innerHTML" || t === "textContent") {
    n != null && (e[t] = t === "innerHTML" ? ma(n) : n);
    return;
  }
  const i = e.tagName;
  if (t === "value" && i !== "PROGRESS" && // custom elements may use _value internally
  !i.includes("-")) {
    const l = i === "OPTION" ? e.getAttribute("value") || "" : e.value, a = n == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      e.type === "checkbox" ? "on" : ""
    ) : String(n);
    (l !== a || !("_value" in e)) && (e.value = a), n == null && e.removeAttribute(t), e._value = n;
    return;
  }
  let s = !1;
  if (n === "" || n == null) {
    const l = typeof e[t];
    l === "boolean" ? n = rl(n) : n == null && l === "string" ? (n = "", s = !0) : l === "number" && (n = 0, s = !0);
  }
  try {
    e[t] = n;
  } catch (l) {
    process.env.NODE_ENV !== "production" && !s && Ze(
      `Failed setting prop "${t}" on <${i.toLowerCase()}>: value ${n} is invalid.`,
      l
    );
  }
  s && e.removeAttribute(o || t);
}
function ln(e, t, n, r) {
  e.addEventListener(t, n, r);
}
function qf(e, t, n, r) {
  e.removeEventListener(t, n, r);
}
const _s = /* @__PURE__ */ Symbol("_vei");
function Kf(e, t, n, r, o = null) {
  const i = e[_s] || (e[_s] = {}), s = i[t];
  if (r && s)
    s.value = process.env.NODE_ENV !== "production" ? bs(r, t) : r;
  else {
    const [l, a] = Yf(t);
    if (r) {
      const c = i[t] = ed(
        process.env.NODE_ENV !== "production" ? bs(r, t) : r,
        o
      );
      ln(e, l, c, a);
    } else s && (qf(e, l, s, a), i[t] = void 0);
  }
}
const Zf = /(Once|Passive|Capture)$/, Xf = /^on:?(?:Once|Passive|Capture)$/;
function Yf(e) {
  let t, n;
  for (; (n = e.match(Zf)) && !Xf.test(e); )
    t || (t = {}), e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
  return [e[2] === ":" ? e.slice(3) : tt(e.slice(2)), t];
}
let No = 0;
const Gf = /* @__PURE__ */ Promise.resolve(), Qf = () => No || (Gf.then(() => No = 0), No = Date.now());
function ed(e, t) {
  const n = (r) => {
    if (!r._vts)
      r._vts = Date.now();
    else if (r._vts <= n.attached)
      return;
    const o = n.value;
    if (Z(o)) {
      const i = r.stopImmediatePropagation;
      r.stopImmediatePropagation = () => {
        i.call(r), r._stopped = !0;
      };
      const s = o.slice(), l = [r];
      for (let a = 0; a < s.length && !r._stopped; a++) {
        const c = s[a];
        c && bt(
          c,
          t,
          5,
          l
        );
      }
    } else
      bt(
        o,
        t,
        5,
        [r]
      );
  };
  return n.value = e, n.attached = Qf(), n;
}
function bs(e, t) {
  return ee(e) || Z(e) ? e : (Ze(
    `Wrong type passed as event handler to ${t} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof e}.`
  ), Ne);
}
const vs = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && // lowercase letter
e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, td = (e, t, n, r, o, i) => {
  const s = o === "svg";
  t === "class" ? Bf(e, r, s) : t === "style" ? Jf(e, n, r) : ar(t) ? Wn(t) || Kf(e, t, n, r, i) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : nd(e, t, r, s)) ? (ms(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && gs(e, t, r, s, i, t !== "value")) : /* #11081 force set props for possible async custom element */ e._isVueCE && // #12408 check if it's declared prop or it's async custom element
  (rd(e, t) || // @ts-expect-error _def is private
  e._def.__asyncLoader && (/[A-Z]/.test(t) || !ye(r))) ? ms(e, Pe(t), r, i, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), gs(e, t, r, s));
};
function nd(e, t, n, r) {
  if (r)
    return !!(t === "innerHTML" || t === "textContent" || t in e && vs(t) && ee(n));
  if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA")
    return !1;
  if (t === "width" || t === "height") {
    const o = e.tagName;
    if (o === "IMG" || o === "VIDEO" || o === "CANVAS" || o === "SOURCE")
      return !1;
  }
  return vs(t) && ye(n) ? !1 : t in e;
}
function rd(e, t) {
  const n = (
    // @ts-expect-error _def is private
    e._def.props
  );
  if (!n)
    return !1;
  const r = Pe(t);
  return Array.isArray(n) ? n.some((o) => Pe(o) === r) : Object.keys(n).some((o) => Pe(o) === r);
}
const xs = {};
// @__NO_SIDE_EFFECTS__
function od(e, t, n) {
  let r = /* @__PURE__ */ $l(e, t);
  no(r) && (r = xe({}, r, t));
  class o extends Ei {
    constructor(s) {
      super(r, s, n);
    }
  }
  return o.def = r, o;
}
const id = typeof HTMLElement < "u" ? HTMLElement : class {
};
class Ei extends id {
  constructor(t, n = {}, r = ks) {
    super(), this._def = t, this._props = n, this._createApp = r, this._isVueCE = !0, this._instance = null, this._app = null, this._nonce = this._def.nonce, this._connected = !1, this._resolved = !1, this._patching = !1, this._dirty = !1, this._numberProps = null, this._styleChildren = /* @__PURE__ */ new WeakSet(), this._styleAnchors = /* @__PURE__ */ new WeakMap(), this._ob = null, this.shadowRoot && r !== ks ? this._root = this.shadowRoot : (process.env.NODE_ENV !== "production" && this.shadowRoot && Ze(
      "Custom element has pre-rendered declarative shadow root but is not defined as hydratable. Use `defineSSRCustomElement`."
    ), t.shadowRoot !== !1 ? (this.attachShadow(
      xe({}, t.shadowRootOptions, {
        mode: "open"
      })
    ), this._root = this.shadowRoot) : this._root = this);
  }
  connectedCallback() {
    if (!this.isConnected) return;
    !this.shadowRoot && !this._resolved && this._parseSlots(), this._connected = !0;
    let t = this;
    for (; t = t && // #12479 should check assignedSlot first to get correct parent
    (t.assignedSlot || t.parentNode || t.host); )
      if (t instanceof Ei) {
        this._parent = t;
        break;
      }
    this._instance || (this._resolved ? this._mount(this._def) : t && t._pendingResolve ? this._pendingResolve = t._pendingResolve.then(() => {
      if (this._pendingResolve = void 0, this.isConnected)
        return this._resolveDef();
    }) : this._resolveDef());
  }
  _setParent(t = this._parent) {
    t && (this._instance.parent = t._instance, this._inheritParentContext(t));
  }
  _inheritParentContext(t = this._parent) {
    t && this._app && Object.setPrototypeOf(
      this._app._context.provides,
      t._instance.provides
    );
  }
  disconnectedCallback() {
    this._connected = !1, Mt(() => {
      this._connected || (this._ob && (this._ob.disconnect(), this._ob = null), this._app && this._app.unmount(), this._instance && (this._instance.ce = void 0), this._app = this._instance = null, this._teleportTargets && (this._teleportTargets.clear(), this._teleportTargets = void 0));
    });
  }
  _processMutations(t) {
    for (const n of t)
      this._setAttr(n.attributeName);
  }
  /**
   * resolve inner component definition (handle possible async component)
   */
  _resolveDef() {
    if (this._pendingResolve)
      return this._pendingResolve;
    for (let r = 0; r < this.attributes.length; r++)
      this._setAttr(this.attributes[r].name);
    this._ob = new MutationObserver(this._processMutations.bind(this)), this._ob.observe(this, { attributes: !0 });
    const t = (r, o = !1) => {
      this._resolved = !0, this._pendingResolve = void 0;
      const { props: i, styles: s } = r;
      let l;
      if (i && !Z(i))
        for (const a in i) {
          const c = i[a];
          (c === Number || c && c.type === Number) && (a in this._props && (this._props[a] = Ii(this._props[a])), (l || (l = /* @__PURE__ */ Object.create(null)))[Pe(a)] = !0);
        }
      this._numberProps = l, this._resolveProps(r), this.shadowRoot ? this._applyStyles(s) : process.env.NODE_ENV !== "production" && s && Ze(
        "Custom element style injection is not supported when using shadowRoot: false"
      ), this._connected && this._mount(r);
    }, n = this._def.__asyncLoader;
    if (n)
      return this._pendingResolve = n().then((r) => {
        r.configureApp = this._def.configureApp, t(this._def = r, !0);
      }), this._pendingResolve;
    t(this._def);
  }
  _mount(t) {
    process.env.NODE_ENV !== "production" && !t.name && (t.name = "VueElement"), this._app = this._createApp(t), this._inheritParentContext(), t.configureApp && t.configureApp(this._app), this._app._ceVNode = this._createVNode(), this._app.mount(this._root);
    const n = this._instance && this._instance.exposed;
    if (n)
      for (const r in n)
        ae(this, r) ? process.env.NODE_ENV !== "production" && Ze(`Exposed property "${r}" already exists on custom element.`) : Object.defineProperty(this, r, {
          // unwrap ref to be consistent with public instance behavior
          get: () => G(n[r])
        });
  }
  _resolveProps(t) {
    const { props: n } = t, r = Z(n) ? n : Object.keys(n || {});
    for (const o of Object.keys(this))
      o[0] !== "_" && r.includes(o) && this._setProp(o, this[o]);
    for (const o of r.map(Pe))
      process.env.NODE_ENV !== "production" && o in Object.getPrototypeOf(this) && Ze(
        `Custom element prop "${o}" conflicts with an existing property on the element and will overwrite it.`
      ), Object.defineProperty(this, o, {
        get() {
          return this._getProp(o);
        },
        set(i) {
          this._setProp(o, i, !0, !this._patching);
        }
      });
  }
  _setAttr(t) {
    if (t.startsWith("data-v-")) return;
    const n = this.hasAttribute(t);
    let r = n ? this.getAttribute(t) : xs;
    const o = Pe(t);
    n && this._numberProps && this._numberProps[o] && (r = Ii(r)), this._setProp(o, r, !1, !0);
  }
  /**
   * @internal
   */
  _getProp(t) {
    return this._props[t];
  }
  /**
   * @internal
   */
  _setProp(t, n, r = !0, o = !1) {
    if (n !== this._props[t] && (this._dirty = !0, n === xs ? delete this._props[t] : (this._props[t] = n, t === "key" && this._app && (this._app._ceVNode.key = n)), o && this._instance && this._update(), r)) {
      const i = this._ob;
      i && (this._processMutations(i.takeRecords()), i.disconnect()), n === !0 ? this.setAttribute(tt(t), "") : typeof n == "string" || typeof n == "number" ? this.setAttribute(tt(t), n + "") : n || this.removeAttribute(tt(t)), i && i.observe(this, { attributes: !0 });
    }
  }
  _update() {
    const t = this._createVNode();
    this._app && (t.appContext = this._app._context), pd(t, this._root);
  }
  _createVNode() {
    const t = {};
    this.shadowRoot || (t.onVnodeMounted = t.onVnodeUpdated = this._renderSlots.bind(this));
    const n = Rt(this._def, xe(t, this._props));
    return this._instance || (n.ce = (r) => {
      this._instance = r, r.ce = this, r.isCE = !0, process.env.NODE_ENV !== "production" && (r.ceReload = (i) => {
        this._styles && (this._styles.forEach((s) => this._root.removeChild(s)), this._styles.length = 0), this._styleAnchors.delete(this._def), this._applyStyles(i), this._instance = null, this._update();
      });
      const o = (i, s) => {
        this.dispatchEvent(
          new CustomEvent(
            i,
            no(s[0]) ? xe({ detail: s }, s[0]) : { detail: s }
          )
        );
      };
      r.emit = (i, ...s) => {
        o(i, s), tt(i) !== i && o(tt(i), s);
      }, this._setParent();
    }), n;
  }
  _applyStyles(t, n, r) {
    if (!t) return;
    if (n) {
      if (n === this._def || this._styleChildren.has(n))
        return;
      this._styleChildren.add(n);
    }
    const o = this._nonce, i = this.shadowRoot, s = r ? this._getStyleAnchor(r) || this._getStyleAnchor(this._def) : this._getRootStyleInsertionAnchor(i);
    let l = null;
    for (let a = t.length - 1; a >= 0; a--) {
      const c = document.createElement("style");
      if (o && c.setAttribute("nonce", o), c.textContent = t[a], i.insertBefore(c, l || s), l = c, a === 0 && (r || this._styleAnchors.set(this._def, c), n && this._styleAnchors.set(n, c)), process.env.NODE_ENV !== "production")
        if (n) {
          if (n.__hmrId) {
            this._childStyles || (this._childStyles = /* @__PURE__ */ new Map());
            let u = this._childStyles.get(n.__hmrId);
            u || this._childStyles.set(n.__hmrId, u = []), u.push(c);
          }
        } else
          (this._styles || (this._styles = [])).push(c);
    }
  }
  _getStyleAnchor(t) {
    if (!t)
      return null;
    const n = this._styleAnchors.get(t);
    return n && n.parentNode === this.shadowRoot ? n : (n && this._styleAnchors.delete(t), null);
  }
  _getRootStyleInsertionAnchor(t) {
    for (let n = 0; n < t.childNodes.length; n++) {
      const r = t.childNodes[n];
      if (!(r instanceof HTMLStyleElement))
        return r;
    }
    return null;
  }
  /**
   * Only called when shadowRoot is false
   */
  _parseSlots() {
    const t = this._slots = {};
    let n;
    for (; n = this.firstChild; ) {
      const r = n.nodeType === 1 && n.getAttribute("slot") || "default";
      (t[r] || (t[r] = [])).push(n), this.removeChild(n);
    }
  }
  /**
   * Only called when shadowRoot is false
   */
  _renderSlots() {
    const t = this._getSlots(), n = this._instance.type.__scopeId;
    for (let r = 0; r < t.length; r++) {
      const o = t[r], i = o.getAttribute("name") || "default", s = this._slots[i], l = o.parentNode;
      if (s)
        for (const a of s) {
          if (n && a.nodeType === 1) {
            const c = n + "-s", u = document.createTreeWalker(a, 1);
            a.setAttribute(c, "");
            let f;
            for (; f = u.nextNode(); )
              f.setAttribute(c, "");
          }
          l.insertBefore(a, o);
        }
      else
        for (; o.firstChild; ) l.insertBefore(o.firstChild, o);
      l.removeChild(o);
    }
  }
  /**
   * @internal
   */
  _getSlots() {
    const t = [this];
    this._teleportTargets && t.push(...this._teleportTargets);
    const n = /* @__PURE__ */ new Set();
    for (const r of t) {
      const o = r.querySelectorAll("slot");
      for (let i = 0; i < o.length; i++)
        n.add(o[i]);
    }
    return Array.from(n);
  }
  /**
   * @internal
   */
  _injectChildStyle(t, n) {
    this._applyStyles(t.styles, t, n);
  }
  /**
   * @internal
   */
  _beginPatch() {
    this._patching = !0, this._dirty = !1;
  }
  /**
   * @internal
   */
  _endPatch() {
    this._patching = !1, this._dirty && this._instance && this._update();
  }
  /**
   * @internal
   */
  _hasShadowRoot() {
    return this._def.shadowRoot !== !1;
  }
  /**
   * @internal
   */
  _removeChildStyle(t) {
    if (process.env.NODE_ENV !== "production" && (this._styleChildren.delete(t), this._styleAnchors.delete(t), this._childStyles && t.__hmrId)) {
      const n = this._childStyles.get(t.__hmrId);
      n && (n.forEach((r) => this._root.removeChild(r)), n.length = 0);
    }
  }
}
const Yr = (e) => {
  const t = e.props["onUpdate:modelValue"] || !1;
  return Z(t) ? (n) => wn(t, n) : t;
};
function sd(e) {
  e.target.composing = !0;
}
function ys(e) {
  const t = e.target;
  t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
const cn = /* @__PURE__ */ Symbol("_assign"), kr = /* @__PURE__ */ Symbol("_initialValue");
function Fo(e, t, n) {
  return t && (e = e.trim()), n && (e = ur(e)), e;
}
const ld = {
  created(e, { modifiers: { lazy: t, trim: n, number: r } }, o) {
    e.parentNode && (e.type === "text" ? e[kr] = e.defaultValue.replace(/[\r\n]/g, "") : e.type === "textarea" && (e[kr] = e.defaultValue.replace(/\r\n?/g, `
`))), e[cn] = Yr(o);
    const i = r || o.props && o.props.type === "number";
    ln(e, t ? "change" : "input", (s) => {
      s.target.composing || e[cn](Fo(e.value, n, i));
    }), (n || i) && ln(e, "change", () => {
      e.value = Fo(e.value, n, i);
    }), t || (ln(e, "compositionstart", sd), ln(e, "compositionend", ys), ln(e, "change", ys));
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(e, { value: t, modifiers: { trim: n, number: r } }) {
    const o = t ?? "", i = e[kr];
    delete e[kr], i !== void 0 && (e.type === "text" || e.type === "textarea") && e.value !== i ? e[cn](Fo(e.value, n, r)) : e.value = o;
  },
  beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: o, number: i } }, s) {
    if (e[cn] = Yr(s), e.composing) return;
    const l = (i || e.type === "number") && !/^0\d/.test(e.value) ? ur(e.value) : e.value, a = t ?? "";
    if (l === a)
      return;
    const c = e.getRootNode();
    (c instanceof Document || c instanceof ShadowRoot) && c.activeElement === e && e.type !== "range" && (r && t === n || o && e.value.trim() === a) || (e.value = a);
  }
}, ad = {
  // <select multiple> value need to be deep traversed
  deep: !0,
  created(e, { value: t, modifiers: { number: n } }, r) {
    e._modelValue = t, ln(e, "change", () => {
      const o = Array.prototype.filter.call(e.options, (a) => a.selected).map(
        (a) => n ? ur(Gr(a)) : Gr(a)
      ), i = e.multiple, s = i ? gn(e._modelValue) ? new Set(o) : o : o[0], l = e._pendingValue = [
        i,
        i ? Z(s) ? o.slice() : o : s
      ];
      try {
        e[cn](s);
      } finally {
        Mt(() => {
          e._pendingValue === l && (e._pendingValue = void 0);
        });
      }
    }), e[cn] = Yr(r);
  },
  // set value in mounted & updated because <select> relies on its children
  // <option>s.
  mounted(e, { value: t, modifiers: { number: n } }) {
    ws(e, t, n);
  },
  beforeUpdate(e, { value: t }, n) {
    e._modelValue = t, e[cn] = Yr(n);
  },
  updated(e, { value: t, modifiers: { number: n } }) {
    const r = e._pendingValue;
    e._pendingValue = void 0, (!r || r[0] !== e.multiple || !cd(t, r[1], r[0])) && ws(e, t, n);
  }
};
function cd(e, t, n) {
  if (!n || Z(e)) return Ht(e, t);
  if (gn(e)) {
    if (e.size !== t.length) return !1;
    for (const r of t)
      if (!e.has(r)) return !1;
    return !0;
  }
  return !1;
}
function ws(e, t, n = !1) {
  const r = e.multiple, o = Z(t);
  if (r && !o && !gn(t)) {
    process.env.NODE_ENV !== "production" && Ze(
      `<select multiple v-model> expects an Array or Set value for its binding, but got ${Object.prototype.toString.call(t).slice(8, -1)}.`
    );
    return;
  }
  for (let i = 0, s = e.options.length; i < s; i++) {
    const l = e.options[i], a = Gr(l);
    if (r)
      if (o) {
        const c = typeof a;
        c === "string" || c === "number" ? l.selected = t.some((u) => String(u) === String(a)) : l.selected = bc(t, a) > -1;
      } else
        l.selected = t.has(a) || n && typeof a == "string" && t.has(ur(a));
    else if (Ht(Gr(l), t)) {
      e.selectedIndex !== i && (e.selectedIndex = i);
      return;
    }
  }
  !r && e.selectedIndex !== -1 && (e.selectedIndex = -1);
}
function Gr(e) {
  return "_value" in e ? e._value : e.value;
}
const ud = ["ctrl", "shift", "alt", "meta"], fd = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => ud.some((n) => e[`${n}Key`] && !t.includes(n))
}, Cr = (e, t) => {
  if (!e) return e;
  const n = e._withMods || (e._withMods = {}), r = t.join(".");
  return n[r] || (n[r] = (o, ...i) => {
    for (let s = 0; s < t.length; s++) {
      const l = fd[t[s]];
      if (l && l(o, t)) return;
    }
    return e(o, ...i);
  });
}, dd = /* @__PURE__ */ xe({ patchProp: td }, Vf);
let Es;
function _a() {
  return Es || (Es = df(dd));
}
const pd = (...e) => {
  _a().render(...e);
}, ks = (...e) => {
  const t = _a().createApp(...e);
  process.env.NODE_ENV !== "production" && (gd(t), md(t));
  const { mount: n } = t;
  return t.mount = (r) => {
    const o = _d(r);
    if (!o) return;
    const i = t._component;
    !ee(i) && !i.render && !i.template && (i.template = o.innerHTML), o.nodeType === 1 && (o.textContent = "");
    const s = n(o, !1, hd(o));
    return o instanceof Element && (o.removeAttribute("v-cloak"), o.setAttribute("data-v-app", "")), s;
  }, t;
};
function hd(e) {
  if (e instanceof SVGElement)
    return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement)
    return "mathml";
}
function gd(e) {
  Object.defineProperty(e.config, "isNativeTag", {
    value: (t) => fc(t) || dc(t) || pc(t),
    writable: !1
  });
}
function md(e) {
  {
    const t = e.config.isCustomElement;
    Object.defineProperty(e.config, "isCustomElement", {
      get() {
        return t;
      },
      set() {
        Ze(
          "The `isCustomElement` config option is deprecated. Use `compilerOptions.isCustomElement` instead."
        );
      }
    });
    const n = e.config.compilerOptions, r = 'The `compilerOptions` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, `compilerOptions` must be passed to `@vue/compiler-dom` in the build setup instead.\n- For vue-loader: pass it via vue-loader\'s `compilerOptions` loader option.\n- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader\n- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc';
    Object.defineProperty(e.config, "compilerOptions", {
      get() {
        return Ze(r), n;
      },
      set() {
        Ze(r);
      }
    });
  }
}
function _d(e) {
  if (ye(e)) {
    const t = document.querySelector(e);
    return process.env.NODE_ENV !== "production" && !t && Ze(
      `Failed to mount app: mount target selector "${e}" returned null.`
    ), t;
  }
  return process.env.NODE_ENV !== "production" && window.ShadowRoot && e instanceof window.ShadowRoot && e.mode === "closed" && Ze(
    'mounting on a ShadowRoot with `{mode: "closed"}` may lead to unpredictable bugs'
  ), e;
}
/**
* vue v3.5.45
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function bd() {
  If();
}
process.env.NODE_ENV !== "production" && bd();
function ba(e, t) {
  return sl() ? (xc(e, t), !0) : !1;
}
const ki = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const vd = (e) => e != null, xd = Object.prototype.toString, yd = (e) => xd.call(e) === "[object Object]", wt = () => {
};
function va(e, t) {
  function n(...r) {
    return new Promise((o, i) => {
      Promise.resolve(e(() => t.apply(this, r), {
        fn: t,
        thisArg: this,
        args: r
      })).then(o).catch(i);
    });
  }
  return "cancel" in e && Object.assign(n, {
    cancel: e.cancel,
    flush: e.flush,
    isPending: e.isPending
  }), n;
}
function wd(e, t = {}) {
  let n, r, o = wt, i = wt;
  const s = /* @__PURE__ */ mt(!1), l = (u) => {
    clearTimeout(u), o(), o = wt;
  };
  let a;
  return Object.assign((u) => {
    const f = Ve(e), p = Ve(t.maxWait);
    return n && l(n), f <= 0 || p !== void 0 && p <= 0 ? (r && (l(r), r = void 0), s.value = !1, Promise.resolve(u())) : (s.value = !0, new Promise((d, g) => {
      o = t.rejectOnCancel ? g : d, i = d, a = u, p && !r && (r = setTimeout(() => {
        n && l(n), r = void 0, s.value = !1, d(a());
      }, p)), n = setTimeout(() => {
        r && l(r), r = void 0, s.value = !1, d(u());
      }, f);
    }));
  }, {
    cancel: () => {
      n && (l(n), n = void 0), r && (l(r), r = void 0), s.value = !1, i = wt;
    },
    flush: () => {
      if (s.value) {
        n && (clearTimeout(n), n = void 0), r && (clearTimeout(r), r = void 0), s.value = !1;
        const u = i;
        o = wt, i = wt, u(a());
      }
    },
    isPending: /* @__PURE__ */ Je(s)
  });
}
function Ed(...e) {
  let t = 0, n, r = !0, o = wt, i, s, l, a, c;
  !/* @__PURE__ */ Re(e[0]) && typeof e[0] == "object" ? { delay: s, trailing: l = !0, leading: a = !0, rejectOnCancel: c = !1 } = e[0] : [s, l = !0, a = !0, c = !1] = e;
  const u = () => {
    n && (clearTimeout(n), n = void 0, o(), o = wt);
  };
  return (p) => {
    const d = Ve(s), g = Date.now() - t, _ = () => i = p();
    return u(), d <= 0 ? (t = Date.now(), _()) : (g > d ? (t = Date.now(), (a || !r) && _()) : l && (i = new Promise((E, T) => {
      o = c ? T : E, n = setTimeout(() => {
        t = Date.now(), r = !0, E(_()), u();
      }, Math.max(0, d - g));
    })), !a && !n && (n = setTimeout(() => r = !0, d)), r = !1, i);
  };
}
function kd(e) {
  let t;
  function n() {
    return t || (t = e()), t;
  }
  return n.reset = async () => {
    const r = t;
    t = void 0, r && await r;
  }, n;
}
function Pr(e) {
  return Array.isArray(e) ? e : [e];
}
function Cd(e) {
  return ho();
}
function Dd(e, t = 200, n = {}) {
  return va(wd(t, n), e);
}
// @__NO_SIDE_EFFECTS__
function Rd(e, t = 200, n = !0, r = !0, o = !1) {
  return va(Ed(t, n, r, o), e);
}
function Ad(e, t = !0, n) {
  Cd() ? uo(e, n) : t ? e() : Mt(e);
}
function Nd(e, t, n = {}) {
  const { immediate: r = !0, immediateCallback: o = !1 } = n, i = /* @__PURE__ */ mt(!1);
  let s;
  function l() {
    s && (clearTimeout(s), s = void 0);
  }
  function a() {
    i.value = !1, l();
  }
  function c(...u) {
    o && e(), l(), i.value = !0, s = setTimeout(() => {
      i.value = !1, s = void 0, e(...u);
    }, Ve(t));
  }
  return r && (i.value = !0, ki && c()), ba(a), {
    isPending: /* @__PURE__ */ Je(i),
    start: c,
    stop: a
  };
}
function Fd(e, t, n) {
  return $n(e, t, {
    ...n,
    immediate: !0
  });
}
const Ci = ki ? window : void 0, xa = ki ? window.navigator : void 0;
function Di(e) {
  var t;
  const n = Ve(e);
  return (t = n == null ? void 0 : n.$el) !== null && t !== void 0 ? t : n;
}
function Qr(...e) {
  const t = (r, o, i, s) => (r.addEventListener(o, i, s), () => r.removeEventListener(o, i, s)), n = qe(() => {
    const r = Pr(Ve(e[0])).filter((o) => o != null);
    return r.every((o) => typeof o != "string") ? r : void 0;
  });
  return Fd(() => {
    var r, o;
    return [
      (r = (o = n.value) === null || o === void 0 ? void 0 : o.map((i) => Di(i))) !== null && r !== void 0 ? r : [Ci].filter((i) => i != null),
      Pr(Ve(n.value ? e[1] : e[0])),
      Pr(G(n.value ? e[2] : e[1])),
      Ve(n.value ? e[3] : e[2])
    ];
  }, ([r, o, i, s], l, a) => {
    if (!(r != null && r.length) || !(o != null && o.length) || !(i != null && i.length)) return;
    const c = yd(s) ? { ...s } : s, u = r.flatMap((f) => o.flatMap((p) => i.map((d) => t(f, p, d, c))));
    a(() => {
      u.forEach((f) => f());
    });
  }, { flush: "post" });
}
// @__NO_SIDE_EFFECTS__
function Sd() {
  const e = /* @__PURE__ */ mt(!1), t = ho();
  return t && uo(() => {
    e.value = !0;
  }, t), e;
}
// @__NO_SIDE_EFFECTS__
function Ri(e) {
  const t = /* @__PURE__ */ Sd();
  return qe(() => (t.value, !!e()));
}
function Od(e, t, n = {}) {
  const { window: r = Ci, ...o } = n;
  let i;
  const s = /* @__PURE__ */ Ri(() => r && "MutationObserver" in r), l = () => {
    i && (i.disconnect(), i = void 0);
  }, a = qe(() => {
    const p = Ve(e), d = Pr(p).map(Di).filter(vd);
    return new Set(d);
  }), c = $n(a, (p) => {
    l(), s.value && p.size && (i = new MutationObserver(t), p.forEach((d) => i.observe(d, o)));
  }, {
    immediate: !0,
    flush: "post"
  }), u = () => i == null ? void 0 : i.takeRecords(), f = () => {
    c(), l();
  };
  return ba(f), {
    isSupported: s,
    stop: f,
    takeRecords: u
  };
}
// @__NO_SIDE_EFFECTS__
function Cs(e, t = {}) {
  const { controls: n = !1, navigator: r = xa } = t, o = /* @__PURE__ */ Ri(() => r && "permissions" in r), i = /* @__PURE__ */ mt(), s = typeof e == "string" ? { name: e } : e, l = /* @__PURE__ */ mt(), a = () => {
    var u, f;
    l.value = (u = (f = i.value) === null || f === void 0 ? void 0 : f.state) !== null && u !== void 0 ? u : "prompt";
  };
  Qr(i, "change", a, { passive: !0 });
  const c = kd(async () => {
    if (o.value) {
      if (!i.value) try {
        i.value = await r.permissions.query(s);
      } catch {
        i.value = void 0;
      } finally {
        a();
      }
      if (n) return /* @__PURE__ */ le(i.value);
    }
  });
  return c(), n ? {
    state: l,
    isSupported: o,
    query: c
  } : l;
}
// @__NO_SIDE_EFFECTS__
function Td(e = {}) {
  const { navigator: t = xa, read: n = !1, source: r, copiedDuring: o = 1500, legacy: i = !1 } = e, s = /* @__PURE__ */ Ri(() => t && "clipboard" in t), l = /* @__PURE__ */ Cs("clipboard-read"), a = /* @__PURE__ */ Cs("clipboard-write"), c = qe(() => s.value || i), u = /* @__PURE__ */ mt(""), f = /* @__PURE__ */ mt(!1), p = /* @__PURE__ */ mt(!1), d = Nd(() => f.value = !1, o, { immediate: !1 });
  let g = 0;
  async function _() {
    let b = !(s.value && C(l.value));
    if (!b) try {
      u.value = await t.clipboard.readText();
    } catch {
      b = !0;
    }
    b && (u.value = w());
  }
  c.value && n && Qr(["copy", "cut"], _, { passive: !0 });
  async function E(b) {
    const N = b ?? Ve(r);
    if (c.value && N != null) {
      p.value = !0;
      let L = !(s.value && C(a.value));
      if (!L) try {
        const Q = T(N);
        await t.clipboard.write([Q]);
      } catch {
        L = !0;
      }
      if (L)
        if (typeof N == "string")
          u.value = N, A(N);
        else {
          const Q = ++g, j = await N();
          j != null && Q === g && (u.value = j, A(j));
        }
      f.value = !0, d.start(), p.value = !1;
    }
  }
  function T(b) {
    return typeof b == "string" ? (u.value = b, new ClipboardItem({ "text/plain": b })) : new ClipboardItem({ "text/plain": b().then((N = "") => (u.value = N, new Blob([N], { type: "text/plain" }))) });
  }
  function A(b) {
    const N = document.createElement("textarea");
    N.value = b, N.style.position = "absolute", N.style.opacity = "0", N.setAttribute("readonly", ""), document.body.appendChild(N), N.select(), document.execCommand("copy"), N.remove();
  }
  function w() {
    var b, N, L;
    return (b = (N = document) === null || N === void 0 || (L = N.getSelection) === null || L === void 0 || (L = L.call(N)) === null || L === void 0 ? void 0 : L.toString()) !== null && b !== void 0 ? b : "";
  }
  function C(b) {
    return b === "granted" || b === "prompt";
  }
  return {
    copyPending: /* @__PURE__ */ Je(p),
    isSupported: c,
    text: /* @__PURE__ */ Je(u),
    copied: /* @__PURE__ */ Je(f),
    copy: E
  };
}
const Ds = 1;
function Id(e, t = {}) {
  const { throttle: n = 0, idle: r = 200, onStop: o = wt, onScroll: i = wt, offset: s = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }, observe: l = { mutation: !1 }, eventListenerOptions: a = {
    capture: !1,
    passive: !0
  }, behavior: c = "auto", window: u = Ci, onError: f = (j) => {
    console.error(j);
  } } = t, p = typeof l == "boolean" ? { mutation: l } : l, d = /* @__PURE__ */ mt(0), g = /* @__PURE__ */ mt(0), _ = qe({
    get() {
      return d.value;
    },
    set(j) {
      T(j, void 0);
    }
  }), E = qe({
    get() {
      return g.value;
    },
    set(j) {
      T(void 0, j);
    }
  });
  function T(j, H) {
    var v, x, q, te;
    if (!u) return;
    const J = Ve(e);
    if (!J) return;
    (v = J instanceof Document ? u.document.body : J) === null || v === void 0 || v.scrollTo({
      top: (x = Ve(H)) !== null && x !== void 0 ? x : E.value,
      left: (q = Ve(j)) !== null && q !== void 0 ? q : _.value,
      behavior: Ve(c)
    });
    const ce = (J == null || (te = J.document) === null || te === void 0 ? void 0 : te.documentElement) || (J == null ? void 0 : J.documentElement) || J;
    _ != null && (d.value = ce.scrollLeft), E != null && (g.value = ce.scrollTop);
  }
  const A = /* @__PURE__ */ mt(!1), w = /* @__PURE__ */ Kn({
    left: !0,
    right: !1,
    top: !0,
    bottom: !1
  }), C = /* @__PURE__ */ Kn({
    left: !1,
    right: !1,
    top: !1,
    bottom: !1
  }), b = (j) => {
    A.value && (A.value = !1, C.left = !1, C.right = !1, C.top = !1, C.bottom = !1, o(j));
  }, N = Dd(b, n + r), L = (j) => {
    var H;
    if (!u) return;
    const v = (j == null || (H = j.document) === null || H === void 0 ? void 0 : H.documentElement) || (j == null ? void 0 : j.documentElement) || Di(j), { display: x, flexDirection: q, direction: te } = u.getComputedStyle(v), J = te === "rtl" ? -1 : 1, ce = v.scrollLeft;
    C.left = ce < d.value, C.right = ce > d.value;
    const ie = Math.abs(ce * J) <= (s.left || 0), oe = Math.abs(ce * J) + v.clientWidth >= v.scrollWidth - (s.right || 0) - Ds;
    x === "flex" && q === "row-reverse" ? (w.left = oe, w.right = ie) : (w.left = ie, w.right = oe), d.value = ce;
    let ke = v.scrollTop;
    j === u.document && !ke && (ke = u.document.body.scrollTop), C.top = ke < g.value, C.bottom = ke > g.value;
    const se = Math.abs(ke) <= (s.top || 0), Ye = Math.abs(ke) + v.clientHeight >= v.scrollHeight - (s.bottom || 0) - Ds;
    x === "flex" && q === "column-reverse" ? (w.top = Ye, w.bottom = se) : (w.top = se, w.bottom = Ye), g.value = ke;
  }, Q = (j) => {
    var H;
    if (!u) return;
    const v = (H = j.target.documentElement) !== null && H !== void 0 ? H : j.target;
    L(v), A.value = !0, N(j), i(j);
  };
  return Qr(e, "scroll", n ? /* @__PURE__ */ Rd(Q, n, !0, !1) : Q, a), Ad(() => {
    try {
      const j = Ve(e);
      if (!j) return;
      L(j);
    } catch (j) {
      f(j);
    }
  }), p != null && p.mutation && e != null && e !== u && e !== document && Od(e, () => {
    const j = Ve(e);
    j && L(j);
  }, {
    attributes: !0,
    childList: !0,
    subtree: !0
  }), Qr(e, "scrollend", b, a), {
    x: _,
    y: E,
    isScrolling: A,
    arrivedState: w,
    directions: C,
    measure() {
      const j = Ve(e);
      u && j && L(j);
    }
  };
}
class So extends Error {
  constructor(t, n) {
    super(t), this.name = "ParseError", this.type = n.type, this.field = n.field, this.value = n.value, this.line = n.line;
  }
}
const Dr = 10, Rr = 13, tn = 32, Rs = 6;
function jd(e) {
  if (typeof e == "function")
    throw new TypeError("`config` must be an object, got a function instead. Did you mean `createParser({onEvent: fn})`?");
  const { maxBufferSize: t, onComment: n, onError: r, onEvent: o, onId: i, onRetry: s } = e, l = [];
  let a = 0, c = "", u, f = "", p = 0, d, g = !1, _ = !1, E = !1;
  function T(v) {
    if (g)
      throw new Error("Cannot feed parser: it was terminated after exceeding the configured max buffer size. Call `reset()` to resume parsing.");
    if (c !== void 0) {
      if (v = c + v, v === "" || v === "ï" || v === "ï»") {
        c = v;
        return;
      }
      c = void 0, v = v.replace(/^(?:\uFEFF|\xEF\xBB\xBF)/, "");
    }
    if ((_ || E) && (v = A(v), !v))
      return;
    if (!l.length) {
      const q = N(v);
      q !== "" && w(q), b();
      return;
    }
    if (v.indexOf(`
`) === -1 && v.indexOf("\r") === -1) {
      if (a < Rs) {
        const q = l.join("") + v.slice(0, Rs - a);
        if (!C(q)) {
          l.length = 0, a = 0, _ = !0;
          return;
        }
      }
      l.push(v), a += v.length, b();
      return;
    }
    l.push(v);
    const x = l.join("");
    l.length = 0, a = 0, w(N(x)), b();
  }
  function A(v) {
    if (v.length === 0)
      return v;
    if (E)
      return E = !1, v.charCodeAt(0) === Dr ? v.slice(1) : v;
    const x = v.indexOf("\r"), q = v.indexOf(`
`), te = x === -1 ? q : q === -1 || x < q ? x : q;
    return te === -1 ? "" : te === v.length - 1 && v.charCodeAt(te) === Rr ? (_ = !1, E = !0, "") : (_ = !1, v.slice(te + (v.charCodeAt(te) === Rr && v.charCodeAt(te + 1) === Dr ? 2 : 1)));
  }
  function w(v) {
    if (v) {
      if (v.charCodeAt(v.length - 1) === Rr) {
        if (L(v, 0, v.length - 1), b())
          return;
        E = !0;
        return;
      }
      if (C(v)) {
        l.push(v), a = v.length;
        return;
      }
      _ = !0;
    }
  }
  function C(v) {
    const x = v.charCodeAt(0);
    return x === 58 && !!n || x === 100 && Ar(v, "data") || x === 101 && Ar(v, "event") || x === 105 && Ar(v, "id") || x === 114 && Ar(v, "retry");
  }
  function b() {
    return g ? !0 : t === void 0 || a + f.length <= t ? !1 : (g = !0, l.length = 0, a = 0, u = void 0, f = "", p = 0, d = void 0, _ = !1, E = !1, r == null || r(new So(`Buffered data exceeded max buffer size of ${t} characters`, {
      type: "max-buffer-size-exceeded"
    })), !0);
  }
  function N(v) {
    let x = 0;
    if (v.indexOf("\r") === -1) {
      let J = v.indexOf(`
`, x);
      for (; J !== -1; ) {
        if (x === J) {
          u !== void 0 && (i == null || i(u)), p > 0 && (o == null || o({ id: u, event: d, data: f })), u = void 0, f = "", p = 0, d = void 0, x = J + 1, J = v.indexOf(`
`, x);
          continue;
        }
        const ce = v.charCodeAt(x);
        if (As(v, x, ce)) {
          const ie = v.charCodeAt(x + 5) === tn ? x + 6 : x + 5, oe = v.slice(ie, J);
          if (p === 0 && v.charCodeAt(J + 1) === Dr) {
            u !== void 0 && (i == null || i(u)), o == null || o({ id: u, event: d, data: oe }), u = void 0, f = "", d = void 0, x = J + 2, J = v.indexOf(`
`, x);
            continue;
          }
          f = p === 0 ? oe : `${f}
${oe}`, p++;
        } else Ns(v, x, ce) ? d = v.slice(v.charCodeAt(x + 6) === tn ? x + 7 : x + 6, J) || void 0 : L(v, x, J);
        if (b())
          return "";
        x = J + 1, J = v.indexOf(`
`, x);
      }
      return v.slice(x);
    }
    let q = v.indexOf("\r", x), te = v.indexOf(`
`, x);
    for (; x < v.length; ) {
      let J = -1;
      if (q !== -1 && te !== -1 ? J = q < te ? q : te : q !== -1 ? q === v.length - 1 ? J = -1 : J = q : te !== -1 && (J = te), J === -1)
        break;
      if (L(v, x, J), b())
        return "";
      x = J + 1, v.charCodeAt(x - 1) === Rr && v.charCodeAt(x) === Dr && x++, q !== -1 && q < x && (q = v.indexOf("\r", x)), te !== -1 && te < x && (te = v.indexOf(`
`, x));
    }
    return v.slice(x);
  }
  function L(v, x, q) {
    if (x === q) {
      j();
      return;
    }
    const te = v.charCodeAt(x);
    if (As(v, x, te)) {
      const se = v.charCodeAt(x + 5) === tn ? x + 6 : x + 5, Ye = v.slice(se, q);
      f = p === 0 ? Ye : `${f}
${Ye}`, p++;
      return;
    }
    if (Ns(v, x, te)) {
      d = v.slice(v.charCodeAt(x + 6) === tn ? x + 7 : x + 6, q) || void 0;
      return;
    }
    if (te === 105 && v.charCodeAt(x + 1) === 100 && v.charCodeAt(x + 2) === 58) {
      const se = v.slice(v.charCodeAt(x + 3) === tn ? x + 4 : x + 3, q);
      se.includes("\0") || (u = se);
      return;
    }
    if (te === 58) {
      if (n) {
        const se = v.slice(x, q);
        n(se.slice(v.charCodeAt(x + 1) === tn ? 2 : 1));
      }
      return;
    }
    const J = v.slice(x, q), ce = J.indexOf(":");
    if (ce === -1) {
      Q(J, "", J);
      return;
    }
    const ie = J.slice(0, ce), oe = J.charCodeAt(ce + 1) === tn ? 2 : 1, ke = J.slice(ce + oe);
    Q(ie, ke, J);
  }
  function Q(v, x, q) {
    switch (v) {
      case "event":
        d = x || void 0;
        break;
      case "data":
        f = p === 0 ? x : `${f}
${x}`, p++;
        break;
      case "id":
        x.includes("\0") || (u = x);
        break;
      case "retry":
        /^\d+$/.test(x) ? s == null || s(parseInt(x, 10)) : r == null || r(new So(`Invalid \`retry\` value: "${x}"`, {
          type: "invalid-retry",
          value: x,
          line: q
        }));
        break;
      default:
        r == null || r(new So(`Unknown field "${v.length > 20 ? `${v.slice(0, 20)}…` : v}"`, { type: "unknown-field", field: v, value: x, line: q }));
        break;
    }
  }
  function j() {
    u !== void 0 && (i == null || i(u)), p > 0 && (o == null || o({
      id: u,
      event: d,
      data: f
    })), u = void 0, f = "", p = 0, d = void 0;
  }
  function H(v = {}) {
    if (v.consume && l.length > 0) {
      const x = l.join("");
      L(x, 0, x.length);
    }
    c = "", u = void 0, f = "", p = 0, d = void 0, l.length = 0, a = 0, g = !1, _ = !1, E = !1;
  }
  return { feed: T, reset: H };
}
function As(e, t, n) {
  return n === 100 && e.charCodeAt(t + 1) === 97 && e.charCodeAt(t + 2) === 116 && e.charCodeAt(t + 3) === 97 && e.charCodeAt(t + 4) === 58;
}
function Ns(e, t, n) {
  return n === 101 && e.charCodeAt(t + 1) === 118 && e.charCodeAt(t + 2) === 101 && e.charCodeAt(t + 3) === 110 && e.charCodeAt(t + 4) === 116 && e.charCodeAt(t + 5) === 58;
}
function Ar(e, t) {
  let n = 1;
  for (; n < e.length && n < t.length; ) {
    if (e.charCodeAt(n) !== t.charCodeAt(n))
      return !1;
    n++;
  }
  return e.length <= t.length || e.charCodeAt(t.length) === 58;
}
function Md(e) {
  const t = /* @__PURE__ */ me(!1), n = /* @__PURE__ */ me(""), r = /* @__PURE__ */ me([]);
  let o = null;
  function i() {
    o && (o.abort(), o = null), t.value = !1;
  }
  function s() {
    const a = typeof e.token == "function" ? e.token() : e.token;
    return a && a.trim().length > 0 ? { Authorization: `Bearer ${a.trim()}` } : {};
  }
  async function l(a) {
    var p, d, g;
    i(), t.value = !0, n.value = "", r.value = [];
    const c = new AbortController();
    o = c;
    let u = "", f = null;
    try {
      const _ = `${e.baseUrl.replace(/\/$/, "")}/api/agent/chat/stream`, E = await fetch(_, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
          ...s()
        },
        body: JSON.stringify(a),
        signal: c.signal
      });
      if (!E.ok)
        throw new Error(`Streaming failed with status: ${E.status}`);
      if (!E.body)
        throw new Error("Response body is null");
      const T = E.body.getReader(), A = new TextDecoder(), w = () => {
        T.cancel(new DOMException("The operation was aborted.", "AbortError")).catch(() => {
        });
      };
      c.signal.addEventListener("abort", w);
      const C = jd({
        onEvent(N) {
          var L, Q, j;
          if (N.data)
            try {
              const H = JSON.parse(N.data);
              switch (N.event || H.type) {
                case "thought_delta":
                case "thought": {
                  const x = H.thought ?? H.text ?? "";
                  n.value += x, (L = e.onThoughtDelta) == null || L.call(e, x);
                  break;
                }
                case "text_delta":
                case "text": {
                  const x = H.text ?? H.delta ?? "";
                  u += x, (Q = e.onTextDelta) == null || Q.call(e, x);
                  break;
                }
                case "activity":
                case "tool_call_start":
                case "tool_call_result": {
                  const x = H.activity || H;
                  if (x && x.id) {
                    const q = r.value.findIndex((J) => J.id === x.id), te = {
                      id: x.id,
                      category: x.category || "tool",
                      status: x.status || "running",
                      label: x.label || x.summary || x.id,
                      summary: x.summary || null,
                      durationMs: x.durationMs ?? null,
                      arguments: x.arguments ?? null,
                      result: x.result ?? null
                    };
                    q >= 0 ? r.value[q] = { ...r.value[q], ...te } : r.value.push(te), (j = e.onActivity) == null || j.call(e, te);
                  }
                  break;
                }
                case "run_finished": {
                  H.result ? f = H.result : f = {
                    conversationId: H.conversationId || a.conversationId || "",
                    messageId: H.messageId || `msg-${Date.now()}`,
                    markdown: u,
                    modelMetadata: H.modelMetadata
                  };
                  break;
                }
                case "run_error": {
                  const x = H.message || "Unknown streaming agent error";
                  throw new Error(x);
                }
              }
            } catch (H) {
              if (!(H instanceof SyntaxError))
                throw H;
            }
        }
      });
      for (; ; ) {
        if (c.signal.aborted)
          throw new DOMException("The operation was aborted.", "AbortError");
        const { done: N, value: L } = await T.read();
        if (c.signal.aborted)
          throw new DOMException("The operation was aborted.", "AbortError");
        if (N) break;
        C.feed(A.decode(L, { stream: !0 }));
      }
      const b = f ?? {
        conversationId: a.conversationId || "",
        messageId: `msg-${Date.now()}`,
        markdown: u
      };
      return (p = e.onFinished) == null || p.call(e, b), b;
    } catch (_) {
      if (_ instanceof DOMException && _.name === "AbortError" || c.signal.aborted) {
        const T = new Error("Stream cancelled by user");
        throw (d = e.onError) == null || d.call(e, T), T;
      }
      const E = _ instanceof Error ? _ : new Error(String(_));
      throw (g = e.onError) == null || g.call(e, E), E;
    } finally {
      t.value = !1, o === c && (o = null);
    }
  }
  return {
    isStreaming: t,
    currentThought: n,
    currentActivities: r,
    sendStreamingMessage: l,
    abortStream: i
  };
}
function Vd(e) {
  const t = /* @__PURE__ */ me([]), n = /* @__PURE__ */ me(null), r = /* @__PURE__ */ me([]), o = /* @__PURE__ */ me(!1), i = /* @__PURE__ */ me(null);
  function s() {
    const p = typeof e.token == "function" ? e.token() : e.token;
    return p && p.trim().length > 0 ? { Authorization: `Bearer ${p.trim()}` } : {};
  }
  async function l() {
    o.value = !0, i.value = null;
    try {
      const p = `${e.baseUrl.replace(/\/$/, "")}/api/agent/conversations`, d = await fetch(p, {
        headers: {
          Accept: "application/json",
          ...s()
        }
      });
      if (!d.ok)
        throw new Error(`Failed to load conversations: ${d.status}`);
      const g = await d.json();
      return t.value = g.items || [], t.value;
    } catch (p) {
      const d = p instanceof Error ? p.message : String(p);
      return i.value = d, [];
    } finally {
      o.value = !1;
    }
  }
  async function a(p) {
    o.value = !0, i.value = null;
    try {
      const d = `${e.baseUrl.replace(/\/$/, "")}/api/agent/conversations/${encodeURIComponent(p)}`, g = await fetch(d, {
        headers: {
          Accept: "application/json",
          ...s()
        }
      });
      if (!g.ok)
        throw new Error(`Failed to load conversation detail: ${g.status}`);
      const _ = await g.json();
      return r.value = _.messages || [], r.value;
    } catch (d) {
      const g = d instanceof Error ? d.message : String(d);
      return i.value = g, [];
    } finally {
      o.value = !1;
    }
  }
  function c(p) {
    return n.value = p, a(p);
  }
  function u() {
    n.value = null, r.value = [];
  }
  async function f(p) {
    try {
      const d = `${e.baseUrl.replace(/\/$/, "")}/api/agent/conversations/${encodeURIComponent(p)}`;
      return (await fetch(d, {
        method: "DELETE",
        headers: s()
      })).ok ? (t.value = t.value.filter((_) => _.id !== p), n.value === p && u(), !0) : !1;
    } catch {
      return !1;
    }
  }
  return {
    conversations: t,
    activeConversationId: n,
    activeMessages: r,
    isLoading: o,
    errorMessage: i,
    loadConversations: l,
    loadConversationDetail: a,
    selectConversation: c,
    createNewConversation: u,
    deleteConversation: f
  };
}
function Pd(e) {
  const t = /* @__PURE__ */ me(!1), n = /* @__PURE__ */ me(null), r = /* @__PURE__ */ me(-1), o = /* @__PURE__ */ me(""), i = /* @__PURE__ */ me([]), s = /* @__PURE__ */ me(0), l = /* @__PURE__ */ me(!1);
  function a() {
    const _ = typeof e.token == "function" ? e.token() : e.token;
    return _ && _.trim().length > 0 ? { Authorization: `Bearer ${_.trim()}` } : {};
  }
  function c() {
    const _ = typeof e.draftRasciId == "function" ? e.draftRasciId() : e.draftRasciId;
    return (_ == null ? void 0 : _.trim()) || "master";
  }
  async function u(_, E) {
    l.value = !0;
    try {
      const T = e.baseUrl.replace(/\/+$/, ""), A = new URLSearchParams({
        type: _,
        mode: "mention",
        query: E,
        draftRasciId: c(),
        limit: "20"
      }), w = await fetch(`${T}/api/agent/entities/search?${A.toString()}`, {
        headers: {
          Accept: "application/json",
          ...a()
        }
      });
      if (w.ok) {
        const C = await w.json();
        i.value = (C.items || []).filter((b) => b.selectable !== !1), s.value = 0;
      } else
        i.value = [];
    } catch (T) {
      console.warn("[useMentions] Failed to search entities:", T), i.value = [];
    } finally {
      l.value = !1;
    }
  }
  async function f(_, E) {
    const T = _.slice(0, E), A = /(?:^|\s)([@#])([^\s]*)$/.exec(T);
    if (!A) {
      p();
      return;
    }
    const w = A[1], C = A[2];
    n.value = w, o.value = C, r.value = T.lastIndexOf(w), t.value = !0, await u(w === "@" ? "position" : "process", C);
  }
  function p() {
    t.value = !1, n.value = null, r.value = -1, o.value = "", i.value = [], s.value = 0;
  }
  function d(_, E, T, A) {
    const C = _.slice(0, E).lastIndexOf(T);
    if (C < 0)
      return { newText: _, newCursor: E };
    const b = _.slice(0, C), N = _.slice(E), L = A.label || A.positionCode || A.index || "Item", j = `${T}[${L}] `, H = b + j + N, v = b.length + j.length;
    return p(), { newText: H, newCursor: v };
  }
  function g(_) {
    return !t.value || i.value.length === 0 ? t.value && _.key === "Escape" ? (p(), _.preventDefault(), !0) : !1 : _.key === "ArrowDown" ? (s.value = (s.value + 1) % i.value.length, _.preventDefault(), !0) : _.key === "ArrowUp" ? (s.value = (s.value - 1 + i.value.length) % i.value.length, _.preventDefault(), !0) : _.key === "Escape" ? (p(), _.preventDefault(), !0) : !1;
  }
  return {
    isOpen: t,
    triggerChar: n,
    query: o,
    items: i,
    selectedIndex: s,
    isLoading: l,
    handleInputChange: f,
    closeMentions: p,
    applyMentionSelection: d,
    handleKeydown: g
  };
}
function Bd() {
  const e = /* @__PURE__ */ me(null), t = /* @__PURE__ */ me(!1), n = /* @__PURE__ */ me("scope_review");
  function r(a) {
    e.value = { ...a }, n.value = a.stage || "scope_review", t.value = !0;
  }
  function o() {
    t.value = !1;
  }
  function i(a) {
    n.value = a;
  }
  function s(a, c) {
    var f;
    if (!((f = e.value) != null && f.scopeGroups)) return;
    const u = e.value.scopeGroups.find((p) => p.id === a);
    u && (u.decision = c);
  }
  function l(a) {
    var f;
    const c = ((f = e.value) == null ? void 0 : f.jobTitle) || "Jabatan Terkait", u = n.value === "scope_review" ? "Cakupan (Scope)" : n.value === "grouping_review" ? "Pengelompokan (Grouping)" : "Pratinjau Uraian Jabatan (Preview)";
    return `Revisi untuk Uraian Jabatan ${c} (Tahap ${u}):

"${a.trim()}"`;
  }
  return {
    activeArtifact: e,
    isDrawerOpen: t,
    activeStage: n,
    openArtifact: r,
    closeArtifact: o,
    setStage: i,
    updateScopeDecision: s,
    buildRevisionPrompt: l
  };
}
const Fs = {};
function $d(e) {
  let t = Fs[e];
  if (t)
    return t;
  t = Fs[e] = [];
  for (let n = 0; n < 128; n++) {
    const r = String.fromCharCode(n);
    t.push(r);
  }
  for (let n = 0; n < e.length; n++) {
    const r = e.charCodeAt(n);
    t[r] = "%" + ("0" + r.toString(16).toUpperCase()).slice(-2);
  }
  return t;
}
function Dn(e, t) {
  typeof t != "string" && (t = Dn.defaultChars);
  const n = $d(t);
  return e.replace(/(%[a-f0-9]{2})+/gi, function(r) {
    let o = "";
    for (let i = 0, s = r.length; i < s; i += 3) {
      const l = parseInt(r.slice(i + 1, i + 3), 16);
      if (l < 128) {
        o += n[l];
        continue;
      }
      if ((l & 224) === 192 && i + 3 < s) {
        const a = parseInt(r.slice(i + 4, i + 6), 16);
        if ((a & 192) === 128) {
          const c = l << 6 & 1984 | a & 63;
          c < 128 ? o += "��" : o += String.fromCharCode(c), i += 3;
          continue;
        }
      }
      if ((l & 240) === 224 && i + 6 < s) {
        const a = parseInt(r.slice(i + 4, i + 6), 16), c = parseInt(r.slice(i + 7, i + 9), 16);
        if ((a & 192) === 128 && (c & 192) === 128) {
          const u = l << 12 & 61440 | a << 6 & 4032 | c & 63;
          u < 2048 || u >= 55296 && u <= 57343 ? o += "���" : o += String.fromCharCode(u), i += 6;
          continue;
        }
      }
      if ((l & 248) === 240 && i + 9 < s) {
        const a = parseInt(r.slice(i + 4, i + 6), 16), c = parseInt(r.slice(i + 7, i + 9), 16), u = parseInt(r.slice(i + 10, i + 12), 16);
        if ((a & 192) === 128 && (c & 192) === 128 && (u & 192) === 128) {
          let f = l << 18 & 1835008 | a << 12 & 258048 | c << 6 & 4032 | u & 63;
          f < 65536 || f > 1114111 ? o += "����" : (f -= 65536, o += String.fromCharCode(55296 + (f >> 10), 56320 + (f & 1023))), i += 9;
          continue;
        }
      }
      o += "�";
    }
    return o;
  });
}
Dn.defaultChars = ";/?:@&=+$,#";
Dn.componentChars = "";
const Ss = {};
function zd(e) {
  let t = Ss[e];
  if (t)
    return t;
  t = Ss[e] = [];
  for (let n = 0; n < 128; n++) {
    const r = String.fromCharCode(n);
    /^[0-9a-z]$/i.test(r) ? t.push(r) : t.push("%" + ("0" + n.toString(16).toUpperCase()).slice(-2));
  }
  for (let n = 0; n < e.length; n++)
    t[e.charCodeAt(n)] = e[n];
  return t;
}
function Vt(e, t, n) {
  typeof t != "string" && (n = t, t = Vt.defaultChars), typeof n > "u" && (n = !0);
  const r = zd(t);
  let o = "";
  for (let i = 0, s = e.length; i < s; i++) {
    const l = e.charCodeAt(i);
    if (n && l === 37 && i + 2 < s && /^[0-9a-f]{2}$/i.test(e.slice(i + 1, i + 3))) {
      o += e.slice(i, i + 3), i += 2;
      continue;
    }
    if (l < 128) {
      o += r[l];
      continue;
    }
    if (l >= 55296 && l <= 57343) {
      if (l >= 55296 && l <= 56319 && i + 1 < s) {
        const a = e.charCodeAt(i + 1);
        if (a >= 56320 && a <= 57343) {
          o += encodeURIComponent(e[i] + e[i + 1]), i++;
          continue;
        }
      }
      o += "%EF%BF%BD";
      continue;
    }
    o += encodeURIComponent(e[i]);
  }
  return o;
}
Vt.defaultChars = ";/?:@&=+$,-_.!~*'()#";
Vt.componentChars = "-_.!~*'()";
function ri(e) {
  let t = "";
  return t += e.protocol || "", t += e.slashes ? "//" : "", t += e.auth ? e.auth + "@" : "", e.hostname && e.hostname.indexOf(":") !== -1 ? t += "[" + e.hostname + "]" : t += e.hostname || "", t += e.port ? ":" + e.port : "", t += e.pathname || "", t += e.search || "", t += e.hash || "", t;
}
function eo() {
  this.protocol = null, this.slashes = null, this.auth = null, this.port = null, this.hostname = null, this.hash = null, this.search = null, this.pathname = null;
}
const Ld = /^([a-z0-9.+-]+:)/i, Jd = /:[0-9]*$/, Ud = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, Wd = ["<", ">", '"', "`", " ", "\r", `
`, "	"], Hd = ["{", "}", "|", "\\", "^", "`"].concat(Wd), qd = ["'"].concat(Hd), Os = ["%", "/", "?", ";", "#"].concat(qd), Ts = ["/", "?", "#"], Kd = 255, Is = /^[+a-z0-9A-Z_-]{0,63}$/, Zd = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, js = {
  javascript: !0,
  "javascript:": !0
}, Ms = {
  http: !0,
  https: !0,
  ftp: !0,
  gopher: !0,
  file: !0,
  "http:": !0,
  "https:": !0,
  "ftp:": !0,
  "gopher:": !0,
  "file:": !0
};
function oi(e, t) {
  if (e && e instanceof eo) return e;
  const n = new eo();
  return n.parse(e, t), n;
}
eo.prototype.parse = function(e, t) {
  let n, r, o, i = e;
  if (i = i.trim(), !t && e.split("#").length === 1) {
    const c = Ud.exec(i);
    if (c)
      return this.pathname = c[1], c[2] && (this.search = c[2]), this;
  }
  let s = Ld.exec(i);
  if (s && (s = s[0], n = s.toLowerCase(), this.protocol = s, i = i.substr(s.length)), (t || s || i.match(/^\/\/[^@\/]+@[^@\/]+/)) && (o = i.substr(0, 2) === "//", o && !(s && js[s]) && (i = i.substr(2), this.slashes = !0)), !js[s] && (o || s && !Ms[s])) {
    let c = -1;
    for (let g = 0; g < Ts.length; g++)
      r = i.indexOf(Ts[g]), r !== -1 && (c === -1 || r < c) && (c = r);
    let u, f;
    c === -1 ? f = i.lastIndexOf("@") : f = i.lastIndexOf("@", c), f !== -1 && (u = i.slice(0, f), i = i.slice(f + 1), this.auth = u), c = -1;
    for (let g = 0; g < Os.length; g++)
      r = i.indexOf(Os[g]), r !== -1 && (c === -1 || r < c) && (c = r);
    c === -1 && (c = i.length), i[c - 1] === ":" && c--;
    const p = i.slice(0, c);
    i = i.slice(c), this.parseHost(p), this.hostname = this.hostname || "";
    const d = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
    if (!d) {
      const g = this.hostname.split(/\./);
      for (let _ = 0, E = g.length; _ < E; _++) {
        const T = g[_];
        if (T && !T.match(Is)) {
          let A = "";
          for (let w = 0, C = T.length; w < C; w++)
            T.charCodeAt(w) > 127 ? A += "x" : A += T[w];
          if (!A.match(Is)) {
            const w = g.slice(0, _), C = g.slice(_ + 1), b = T.match(Zd);
            b && (w.push(b[1]), C.unshift(b[2])), C.length && (i = C.join(".") + i), this.hostname = w.join(".");
            break;
          }
        }
      }
    }
    this.hostname.length > Kd && (this.hostname = ""), d && (this.hostname = this.hostname.substr(1, this.hostname.length - 2));
  }
  const l = i.indexOf("#");
  l !== -1 && (this.hash = i.substr(l), i = i.slice(0, l));
  const a = i.indexOf("?");
  return a !== -1 && (this.search = i.substr(a), i = i.slice(0, a)), i && (this.pathname = i), Ms[n] && this.hostname && !this.pathname && (this.pathname = ""), this;
};
eo.prototype.parseHost = function(e) {
  let t = Jd.exec(e);
  t && (t = t[0], t !== ":" && (this.port = t.substr(1)), e = e.substr(0, e.length - t.length)), e && (this.hostname = e);
};
const Xd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  decode: Dn,
  encode: Vt,
  format: ri,
  parse: oi
}, Symbol.toStringTag, { value: "Module" })), ya = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, wa = /[\0-\x1F\x7F-\x9F]/, Yd = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/, Ai = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/, Ea = /[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/, ka = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/, Gd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Any: ya,
  Cc: wa,
  Cf: Yd,
  P: Ai,
  S: Ea,
  Z: ka
}, Symbol.toStringTag, { value: "Module" })), Qd = [
  8364,
  0,
  8218,
  402,
  8222,
  8230,
  8224,
  8225,
  710,
  8240,
  352,
  8249,
  338,
  0,
  381,
  0,
  0,
  8216,
  8217,
  8220,
  8221,
  8226,
  8211,
  8212,
  732,
  8482,
  353,
  8250,
  339,
  0,
  382,
  376
];
function ep(e) {
  return e === 0 || e >= 55296 && e <= 57343 || e > 1114111;
}
function tp(e) {
  return ep(e) ? 65533 : e >= 128 && e <= 159 && Qd[e - 128] || e;
}
function np(e) {
  return e - 1 >>> 0 < 127 || e - 160 >>> 0 < 55136 ? String.fromCharCode(e) : String.fromCodePoint(tp(e));
}
const ft = /* @__PURE__ */ (() => {
  const e = new Uint8Array(127);
  let t = 0;
  for (let n = 33; n <= 126; n++)
    n !== 34 && n !== 36 && n !== 92 && (e[n] = t++);
  return e;
})();
function rp(e, t, n, r, o, i) {
  const l = e.length, a = i * 90;
  let c = 0;
  const u = () => {
    const j = ft[e.charCodeAt(c++)];
    return j < i ? j : j * 91 - a + ft[e.charCodeAt(c++)];
  }, f = n - r, p = n + o, d = new Int32Array(p);
  d.fill(-1, r, i), d.fill(-1, i + f, p);
  const g = new Int32Array(p), _ = new Int32Array(p);
  function E(j, H) {
    let v = 0, x = H;
    const q = H + j;
    for (; x < q; ) {
      const te = ft[e.charCodeAt(c++)];
      if (te < 89)
        v += te, d[x++] = v;
      else if (te === 89) {
        let J = ft[e.charCodeAt(c++)] + 2;
        for (; J--; )
          d[x++] = ++v;
      } else {
        const J = ft[e.charCodeAt(c++)];
        v += 89 + // eslint-disable-next-line unicorn/prefer-minimal-ternary -- branches read a different number of side-effecting input bytes
        (J < 90 ? J * 91 + ft[e.charCodeAt(c++)] : ft[e.charCodeAt(c++)] * 8281 + ft[e.charCodeAt(c++)] * 91 + ft[e.charCodeAt(c++)]), d[x++] = v;
      }
    }
  }
  E(r, 0), E(f, i);
  const T = new Int32Array(o * 2);
  let A = 0, w = 0;
  function C(j, H) {
    for (let v = 0; v < j; v++) {
      const x = H + v, q = u(), te = u();
      T[w * 2] = q, T[w * 2 + 1] = te, w += 1, g[x] = A;
      const J = (d[q] < 0 ? _[q] : 1) + (d[te] < 0 ? _[te] : 1);
      _[x] = J, A += J;
    }
  }
  C(o - i + r, i + f), C(i - r, r);
  const b = new Uint16Array(A);
  let N = 0;
  for (let j = 0; j < w; j++)
    for (let H = 0; H < 2; H++) {
      const v = T[j * 2 + H], x = d[v];
      if (x < 0) {
        let q = g[v];
        const te = q + _[v];
        for (; q < te; )
          b[N++] = b[q++];
      } else
        b[N++] = x;
    }
  const L = new Uint16Array(t);
  let Q = 0;
  for (; c < l; ) {
    let j = ft[e.charCodeAt(c++)];
    j >= i && (j = j * 91 - a + ft[e.charCodeAt(c++)]);
    const H = d[j];
    if (H < 0) {
      let v = g[j];
      const x = v + _[j];
      for (; v < x; )
        L[Q++] = b[v++];
    } else
      L[Q++] = H;
  }
  return L;
}
const op = /* @__PURE__ */ rp("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P", 13494, 2713, 49, 25, 61);
var je;
(function(e) {
  e[e.VALUE_LENGTH = 49152] = "VALUE_LENGTH", e[e.FLAG13 = 8192] = "FLAG13", e[e.BRANCH_LENGTH = 8064] = "BRANCH_LENGTH", e[e.JUMP_TABLE = 127] = "JUMP_TABLE", e[e.VALUE_MASK = 8191] = "VALUE_MASK";
})(je || (je = {}));
var Ke;
(function(e) {
  e[e.AMP = 38] = "AMP", e[e.NUM = 35] = "NUM", e[e.SEMI = 59] = "SEMI", e[e.EQUALS = 61] = "EQUALS", e[e.ZERO = 48] = "ZERO", e[e.NINE = 57] = "NINE", e[e.LOWER_A = 97] = "LOWER_A", e[e.LOWER_X = 120] = "LOWER_X";
})(Ke || (Ke = {}));
const to = 32, Ca = 21, ip = 2097151, ii = 2047;
let Da = 0;
function sp(e) {
  const t = e >>> Ca;
  return t === ii ? Da : t;
}
function lp(e) {
  return e - Ke.ZERO >>> 0 <= 9;
}
function ap(e) {
  return (e | to) - Ke.LOWER_A >>> 0 <= 5;
}
function cp(e) {
  return (e | to) - Ke.LOWER_A >>> 0 <= 25;
}
var Vs;
(function(e) {
  e[e.EntityStart = 0] = "EntityStart", e[e.NumericStart = 1] = "NumericStart", e[e.NumericDecimal = 2] = "NumericDecimal", e[e.NumericHex = 3] = "NumericHex", e[e.NamedEntity = 4] = "NamedEntity";
})(Vs || (Vs = {}));
var Ps;
(function(e) {
  e[e.Legacy = 0] = "Legacy", e[e.Strict = 1] = "Strict", e[e.Attribute = 2] = "Attribute";
})(Ps || (Ps = {}));
function up(e, t, n, r) {
  const o = (t & je.BRANCH_LENGTH) >> 7, i = t & je.JUMP_TABLE;
  if (i) {
    if (o === 0)
      return r === i ? n : -1;
    const a = r - i;
    if (a >>> 0 >= o)
      return -1;
    const c = e[n + a];
    return c === 0 ? -1 : n + o + c - 1 & 65535;
  }
  if (o === 0)
    return -1;
  const s = o + 1 >> 1, l = n + s + o;
  for (let a = 0; a < o; a++) {
    const u = e[n + (a >> 1)] >> ((a & 1) << 3) & 255;
    if (u === r) {
      const f = n + s + a;
      return l + e[f] & 65535;
    }
    if (u > r)
      return -1;
  }
  return -1;
}
function Bs(e, t, n) {
  return n === 1 ? String.fromCharCode(e[t] & je.VALUE_MASK) : n === 2 ? String.fromCharCode(e[t + 1]) : String.fromCharCode(e[t + 1], e[t + 2]);
}
function fp(e, t, n) {
  let r = t + 1, o = 0, i = r;
  if (r < n && (e.charCodeAt(r) | to) === Ke.LOWER_X)
    for (r += 1, i = r; r < n; ) {
      const l = e.charCodeAt(r);
      if (lp(l))
        o = o * 16 + (l - Ke.ZERO);
      else if (ap(l))
        o = o * 16 + ((l | to) - Ke.LOWER_A + 10);
      else
        break;
      r += 1;
    }
  else
    for (; r < n; ) {
      const l = e.charCodeAt(r) - Ke.ZERO;
      if (l >>> 0 > 9)
        break;
      o = o * 10 + l, r += 1;
    }
  if (r === i)
    return 0;
  r < n && e.charCodeAt(r) === Ke.SEMI && (r += 1), o > 1114111 && (o = 1114112);
  let s = r - t;
  return s >= ii && (Da = s, s = ii), s << Ca | o;
}
function dp(e, t, n) {
  const r = op;
  let o = e.indexOf("&");
  if (o < 0)
    return e;
  const i = e.length;
  let s = 0, l = "";
  const a = r[0], c = a & je.JUMP_TABLE, u = (a & je.BRANCH_LENGTH) >> 7;
  do {
    const f = o + 1, p = e.charCodeAt(f);
    let d, g;
    if (p === Ke.NUM) {
      const _ = fp(e, f, i);
      d = sp(_), d > 0 && e.charCodeAt(f + d - 1) !== Ke.SEMI && (d = 0), g = d === 0 ? "" : np(_ & ip);
    } else if (cp(p)) {
      d = 0, g = "";
      const _ = p - c;
      let E;
      if (_ >>> 0 < u) {
        const b = r[1 + _];
        E = b === 0 ? -1 : u + b & 65535;
      } else
        E = -1;
      let T = 0, A = 0, w = E < 0 ? 0 : r[E], C = f + 1;
      e: for (; C < i; ) {
        for (
          ;
          // Value-less, non-run node with a nonzero jump offset.
          !(w & (je.VALUE_LENGTH | je.FLAG13)) && w & je.JUMP_TABLE;
        ) {
          const Q = w & je.JUMP_TABLE, j = (w & je.BRANCH_LENGTH) >> 7;
          if (j === 0) {
            if (e.charCodeAt(C) !== Q)
              break e;
            E += 1;
          } else {
            const H = e.charCodeAt(C) - Q;
            if (H >>> 0 >= j)
              break e;
            const v = r[E + 1 + H];
            if (v === 0)
              break e;
            E = E + j + v & 65535;
          }
          if (w = r[E], C += 1, C >= i)
            break e;
        }
        if ((w & (je.VALUE_LENGTH | je.FLAG13)) === je.FLAG13) {
          const Q = (w & je.BRANCH_LENGTH) >> 7;
          if (e.charCodeAt(C) !== (w & je.JUMP_TABLE))
            break;
          C += 1;
          const j = Q - 1;
          let H = E + 1, v = 0;
          for (; v + 1 < j; v += 2) {
            const x = r[H];
            if (e.charCodeAt(C) !== (x & 255) || (C += 1, e.charCodeAt(C) !== (x >> 8 & 255)))
              break e;
            C += 1, H += 1;
          }
          if (v < j) {
            if (e.charCodeAt(C) !== (r[H] & 255))
              break;
            C += 1;
          }
          E += 1 + (Q >> 1), w = r[E];
          continue;
        }
        const b = w >>> 14, N = e.charCodeAt(C);
        if (b !== 0) {
          if (N === Ke.SEMI) {
            d = C - f + 1, g = b === 1 ? String.fromCharCode(w & je.VALUE_MASK) : Bs(r, E, b);
            break;
          }
          if (b === 1)
            break;
        }
        const L = up(r, w, E + (b || 1), N);
        if (L < 0)
          break;
        E = L, w = r[E], C += 1;
      }
      g === "" && d > 0 && (g = Bs(r, T, A));
    } else
      d = 0, g = "";
    d === 0 || n ? o = f : (s < o && (l += e.slice(s, o)), l += g, o = s = f + d), e.charCodeAt(o) !== Ke.AMP && (o = e.indexOf("&", o));
  } while (o >= 0);
  return l + e.slice(s);
}
function Ra(e) {
  return dp(e, !0, !1);
}
var pp = class {
  constructor(e = {}) {
    Ie(this, "src_Any", ya.source);
    Ie(this, "src_Cc", wa.source);
    Ie(this, "src_Z", ka.source);
    Ie(this, "src_P", Ai.source);
    Ie(this, "src_ZPCc", [
      this.src_Z,
      this.src_P,
      this.src_Cc
    ].join("|"));
    Ie(this, "src_ZCc", [this.src_Z, this.src_Cc].join("|"));
    Ie(this, "cache", {});
    Ie(this, "opts", {
      maxLength: 1e4,
      urlAuth: !1,
      schema_names: []
    });
    this.opts = {
      ...this.opts,
      ...e
    };
  }
  set(e = {}) {
    return this.opts = {
      ...this.opts,
      ...e
    }, this.cache = {}, this;
  }
  escapeRE(e) {
    return e.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
  }
  nestedPairRE(e, t, n = 4) {
    const r = this.escapeRE(e), o = this.escapeRE(t), i = `(?:(?!${this.src_ZCc}|${r}|${o}).)`;
    let s = `${r}${i}{0,1000}${o}`;
    for (let l = 2; l <= n; l++) s = `${r}(?:${i}|${s}){0,1000}${o}`;
    return s;
  }
  get_text_separators() {
    var e;
    return (e = this.cache).text_separators ?? (e.text_separators = /[><\uff5c]/);
  }
  get_pseudo_letter() {
    var e;
    return (e = this.cache).src_pseudo_letter ?? (e.src_pseudo_letter = new RegExp(`(?:(?!${this.get_text_separators().source}|${this.src_ZPCc})${this.src_Any})`));
  }
  get_ipv4_addr() {
    var e;
    return (e = this.cache).src_ip4 ?? (e.src_ip4 = /* @__PURE__ */ new RegExp("(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])[.]){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])"));
  }
  get_ipv6_addr() {
    var n;
    const e = "[0-9A-Fa-f]{1,4}", t = `(?:(?:${e}:${e})|${this.get_ipv4_addr().source})`;
    return (n = this.cache).src_ip6_addr ?? (n.src_ip6_addr = new RegExp(`(?:(?:${e}:){6}${t}|::(?:${e}:){5}${t}|(?:${e})?::(?:${e}:){4}${t}|(?:(?:${e}:){0,1}${e})?::(?:${e}:){3}${t}|(?:(?:${e}:){0,2}${e})?::(?:${e}:){2}${t}|(?:(?:${e}:){0,3}${e})?::${e}:${t}|(?:(?:${e}:){0,4}${e})?::${t}|(?:(?:${e}:){0,5}${e})?::${e}|(?:(?:${e}:){0,6}${e})?::)`));
  }
  get_ipv6_url_host() {
    var e;
    return (e = this.cache).src_ip6_host ?? (e.src_ip6_host = new RegExp(`\\[${this.get_ipv6_addr().source}\\]`));
  }
  get_ipv6_mail_host() {
    var e;
    return (e = this.cache).src_ipv6_mail_host ?? (e.src_ipv6_mail_host = new RegExp(`\\[IPv6:${this.get_ipv6_addr().source}\\]`));
  }
  get_auth() {
    var e;
    return (e = this.cache).src_auth ?? (e.src_auth = new RegExp(`(?:(?:(?!${this.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`));
  }
  get_port() {
    var e;
    return (e = this.cache).src_port ?? (e.src_port = /* @__PURE__ */ new RegExp("(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?"));
  }
  get_host_terminator() {
    var e;
    return (e = this.cache).src_host_terminator ?? (e.src_host_terminator = new RegExp(`(?=$|${this.get_text_separators().source}|${this.src_ZPCc})(?!${this.opts["---"] ? "-(?!--)|" : "-|"}_|:\\d|\\.-|\\.(?!$|${this.src_ZPCc}))`));
  }
  get_path_terminator() {
    var e;
    return (e = this.cache).src_path_terminator ?? (e.src_path_terminator = new RegExp(`${this.src_ZPCc}|${this.get_text_separators().source}`));
  }
  get_path() {
    var e;
    return (e = this.cache).src_path ?? (e.src_path = new RegExp(`(?:[/?#](?:${this.nestedPairRE("[", "]")}|${this.nestedPairRE("(", ")")}|${this.nestedPairRE("{", "}")}|\\"(?:(?!${this.src_ZCc}|["]).){1,100}\\"|\\'(?:(?!${this.src_ZCc}|[']).){1,100}\\'|\\'(?=${this.get_pseudo_letter().source}|[-])|\\.{2,20}[:]?[a-zA-Z0-9%/&]|\\.(?!${this.src_ZCc}|[.]|$)|` + (this.opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-{0,19})|" : "\\-{1,20}|") + `,(?!${this.src_ZCc}|$)|;(?!${this.src_ZCc}|$)|\\!{1,20}(?!${this.src_ZCc}|[!]|$)|\\?(?!${this.src_ZCc}|[?]|$)|` + this.get_path_extra().source + `[\\\\/:%@#&=_~*]|(?!${this.get_path_terminator().source}).){1,${this.opts.maxLength}}|\\/)?`));
  }
  get_mail_name() {
    var e;
    return (e = this.cache).src_mail_name ?? (e.src_mail_name = /* @__PURE__ */ new RegExp("[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9](?:[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9]|[.](?=[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9])){0,63}"));
  }
  get_xn() {
    var e;
    return (e = this.cache).src_xn ?? (e.src_xn = /* @__PURE__ */ new RegExp("xn--[a-z0-9\\-]{1,59}"));
  }
  get_tld() {
    if (this.cache.tld) return this.cache.tld;
    const e = [...new Set(this.opts.tlds || [])].sort().reverse().join("|");
    return this.cache.tld = new RegExp(`${e || "$#none#$"}|${this.get_xn().source}`), this.cache.tld;
  }
  get_domain_root() {
    var e;
    return (e = this.cache).src_domain_root ?? (e.src_domain_root = new RegExp("(?:" + this.get_xn().source + `|${this.get_pseudo_letter().source}{1,63})`));
  }
  get_domain() {
    var e;
    return (e = this.cache).src_domain ?? (e.src_domain = new RegExp("(?:" + this.get_xn().source + `|(?:${this.get_pseudo_letter().source})|(?:${this.get_pseudo_letter().source}(?:-|${this.get_pseudo_letter().source}){0,61}${this.get_pseudo_letter().source}))`));
  }
  get_url_host_port() {
    var e;
    return (e = this.cache).url_host_port ?? (e.url_host_port = new RegExp("(?:" + this.get_ipv6_url_host().source + `|(?:(?:(?:${this.get_domain().source})\\.){0,10}${this.get_domain().source}))` + this.get_port().source + this.get_host_terminator().source));
  }
  get_fuzzy_url_host_port() {
    var e;
    return (e = this.cache).fuzzy_url_host_port ?? (e.fuzzy_url_host_port = new RegExp("(?:" + (this.opts.fuzzyIP ? this.get_ipv4_addr().source + "|" : "") + `(?:(?:(?:${this.get_domain().source})\\.){1,10}(?:${this.get_tld().source})))` + this.get_host_terminator().source));
  }
  get_mail_host() {
    var e;
    return (e = this.cache).src_mail_host ?? (e.src_mail_host = new RegExp("(?:" + this.get_ipv6_mail_host().source + `|(?:(?:(?:${this.get_domain().source})\\.){0,4}${this.get_domain().source}))` + this.get_host_terminator().source));
  }
  get_fuzzy_mail_host() {
    var e;
    return (e = this.cache).src_fuzzy_mail_host ?? (e.src_fuzzy_mail_host = new RegExp("(?:" + this.get_ipv6_mail_host().source + `|(?:(?:(?:${this.get_domain().source})[.]){1,4}${this.get_domain_root().source}))` + this.get_host_terminator().source));
  }
  get_path_extra() {
    var e;
    return (e = this.cache).src_path_extra ?? (e.src_path_extra = /* @__PURE__ */ new RegExp(""));
  }
  get_fuzzy_mail_host_search() {
    var e;
    return (e = this.cache).mail_fuzzy_host_search ?? (e.mail_fuzzy_host_search = new RegExp(`@${this.get_fuzzy_mail_host().source}`, "ig"));
  }
  get_fuzzy_link_search() {
    var e;
    return (e = this.cache).link_fuzzy_search ?? (e.link_fuzzy_search = new RegExp(`(^|(?![.:/\\-_@])(?:[$+<=>^\`|｜]|${this.src_ZPCc}))(?:(?![$+<=>^\`|｜])${this.get_fuzzy_url_host_port().source}${this.get_path().source})`, "ig"));
  }
  get_http_validator() {
    var e;
    return (e = this.cache).http_validator ?? (e.http_validator = new RegExp("\\/\\/" + (this.opts.urlAuth ? this.get_auth().source : "") + this.get_url_host_port().source + this.get_path().source, "iy"));
  }
  get_relative_proto_validator() {
    var e;
    return (e = this.cache).relative_proto_validator ?? (e.relative_proto_validator = new RegExp((this.opts.urlAuth ? this.get_auth().source : "") + `(?:localhost|${this.get_ipv6_url_host().source}|(?:(?:${this.get_domain().source})[.]){1,10}${this.get_domain_root().source})` + this.get_port().source + this.get_host_terminator().source + this.get_path().source, "iy"));
  }
  get_mail_name_validator() {
    var e;
    return (e = this.cache).mail_name_validator ?? (e.mail_name_validator = new RegExp(`(?:^|${this.get_text_separators().source}|"|\\(|${this.src_ZCc})(${this.get_mail_name().source})$`));
  }
  get_mailto_validator() {
    var e;
    return (e = this.cache).mailto_validator ?? (e.mailto_validator = new RegExp(`${this.get_mail_name().source}@${this.get_mail_host().source}`, "iy"));
  }
  get_schema_names() {
    var e;
    return (e = this.cache).schema_names ?? (e.schema_names = new RegExp((this.opts.schema_names || []).map((t) => this.escapeRE(t)).join("|")));
  }
  get_schema_search() {
    var e;
    return (e = this.cache).schema_search ?? (e.schema_search = new RegExp(`(^|(?!_)(?:[><｜]|${this.src_ZPCc}))(${this.get_schema_names().source})`, "ig"));
  }
  get_schema_at_start() {
    var e;
    return (e = this.cache).schema_at_start ?? (e.schema_at_start = new RegExp(`^${this.get_schema_search().source}`, "i"));
  }
}, Oo = {
  validate: (e, t, n) => {
    const r = n.re.get_http_validator();
    r.lastIndex = t;
    const o = r.exec(e);
    return o ? o[0].length : 0;
  },
  normalize: (e, t) => t.normalize(e)
}, hp = {
  "http:": Oo,
  "https:": Oo,
  "ftp:": Oo,
  "//": {
    validate: function(e, t, n) {
      const r = n.re.get_relative_proto_validator();
      r.lastIndex = t;
      const o = r.exec(e);
      return o ? t >= 3 && e[t - 3] === ":" || t >= 3 && e[t - 3] === "/" ? 0 : o[0].length : 0;
    },
    normalize: (e, t) => t.normalize(e)
  },
  "mailto:": {
    validate: function(e, t, n) {
      const r = n.re.get_mailto_validator();
      r.lastIndex = t;
      const o = r.exec(e);
      return o ? o[0].length : 0;
    },
    normalize: (e, t) => t.normalize(e)
  }
}, gp = "a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw", mp = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф";
function _p() {
  const e = mp.split("|");
  return gp.split("|").forEach((t) => {
    const n = t.indexOf(":"), r = t.slice(0, n);
    for (const o of t.slice(n + 1)) e.push(r + o);
  }), e;
}
var bp = {
  fuzzyLink: !1,
  fuzzyEmail: !0,
  fuzzyIP: !1,
  "---": !1,
  tlds: _p(),
  urlAuth: !1,
  maxLength: 1e4
}, $s = class {
  constructor(e, t, n, r) {
    /** Prefix (protocol) for matched string. Empty for fuzzy links. */
    Ie(this, "schema");
    /** First position of matched string. */
    Ie(this, "index");
    /** Next position after matched string. */
    Ie(this, "lastIndex");
    /** Matched string. */
    Ie(this, "raw");
    /** Normalized text of matched string. */
    Ie(this, "text");
    /** Normalized URL of matched string. */
    Ie(this, "url");
    const o = e.slice(n, r);
    this.schema = t.toLowerCase(), this.index = n, this.lastIndex = r, this.raw = o, this.text = o, this.url = o;
  }
}, vp = class {
  /**
  * Creates new linkifier instance.
  *
  * By default understands:
  *
  * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
  * - "fuzzy" emails (foo@bar.com).
  *
  * See {@link LinkifyConstructorOptions} for available options.
  *
  * @param options Recognition options.
  *
  * @example
  * ```javascript
  * import { LinkifyIt } from 'linkify-it'
  *
  * const linkify = new LinkifyIt({ fuzzyLink: true })
  *
  * linkify
  *   .tlds(require('tlds'))       // Reload with full TLD list
  *   .tlds('onion', true)         // Add unofficial `.onion` domain
  *   .add('ftp:', null)           // Disable `ftp:` protocol
  *   .set({ fuzzyIP: true })      // Enable IPs in fuzzy links
  *
  * console.log(linkify.test('Site github.com!')) // true
  * console.log(linkify.match('Site github.com!'))
  * ```
  */
  constructor(e = {}) {
    Ie(this, "__opts__");
    Ie(this, "__schemas__");
    Ie(this, "re");
    const { rebuilder: t, ...n } = e;
    this.__opts__ = {
      ...bp,
      ...n
    }, this.__schemas__ = { ...hp }, this.re = t || new pp(), this.re.set({
      ...this.__opts__,
      schema_names: Object.keys(this.__schemas__)
    });
  }
  /**
  * Add new rule definition.
  *
  * `schema` is a link prefix (usually, protocol name with `:` at the end,
  * `skype:` for example). `linkify-it` makes sure that prefix is not
  * preceded with alphanumeric char and symbols. Only whitespaces and
  * punctuation allowed.
  *
  * `definition` is a rule to check tail after link prefix. To disable an
  * existing rule, pass `null`.
  *
  * @param schema Rule name (fixed pattern prefix).
  * @param definition Schema definition, or `null` to disable the rule.
  *
  * See [twitter mentions example](https://github.com/markdown-it/linkify-it/blob/master/examples/twitter.mjs).
  */
  add(e, t = null) {
    if (!t) delete this.__schemas__[e];
    else {
      const n = {
        normalize: (r, o) => o.normalize(r),
        ...t
      };
      this.__schemas__[e] = n;
    }
    return this.re.set({
      ...this.__opts__,
      schema_names: Object.keys(this.__schemas__)
    }), this;
  }
  /**
  * Set recognition options for links without schema.
  *
  * @param options Recognition options.
  */
  set(e = {}) {
    return this.__opts__ = {
      ...this.__opts__,
      ...e
    }, this.re.set({
      ...this.__opts__,
      schema_names: Object.keys(this.__schemas__)
    }), this;
  }
  /**
  * Searches linkifiable pattern and returns `true` on success or `false` on fail.
  *
  * @param text Text to scan.
  */
  test(e) {
    if (!e.length) return !1;
    let t, n;
    for (n = this.re.get_schema_search(), n.lastIndex = 0; (t = n.exec(e)) !== null; ) if (this.testSchemaAt(e, t[2], n.lastIndex)) return !0;
    if (this.__opts__.fuzzyLink && this.__schemas__["http:"] && (n = this.re.get_fuzzy_link_search(), n.lastIndex = 0, n.exec(e) !== null))
      return !0;
    if (this.__opts__.fuzzyEmail && this.__schemas__["mailto:"] && e.indexOf("@") >= 0) {
      const r = this.re.get_fuzzy_mail_host_search(), o = this.re.get_mail_name_validator();
      for (r.lastIndex = 0; (t = r.exec(e)) !== null; ) {
        const i = e.slice(Math.max(0, t.index - 65), t.index);
        if (o.test(i)) return !0;
      }
    }
    return !1;
  }
  /**
  * Similar to {@link LinkifyIt.test} but checks only specific protocol tail exactly
  * at given position. Returns length of found pattern (0 on fail).
  *
  * @param text Text to scan.
  * @param schema Rule (schema) name.
  * @param pos Text offset to check from.
  */
  testSchemaAt(e, t, n) {
    return this.__schemas__[t.toLowerCase()] ? this.__schemas__[t.toLowerCase()].validate(e.slice(0, n + this.__opts__.maxLength), n, this) : 0;
  }
  /**
  * Returns array of found link descriptions or `null` on fail. We strongly
  * recommend to use {@link LinkifyIt.test} first, for best speed.
  *
  * @param text Text to scan.
  */
  match(e) {
    const t = [], n = this.re.get_schema_search();
    let r, o, i, s, l, a, c = !1, u = !1, f = !1, p = 0;
    if (!e.length) return null;
    for (n.lastIndex = 0, this.__opts__.fuzzyLink && this.__schemas__["http:"] && (r = this.re.get_fuzzy_link_search(), r.lastIndex = 0), this.__opts__.fuzzyEmail && this.__schemas__["mailto:"] && (o = this.re.get_fuzzy_mail_host_search(), o.lastIndex = 0, i = this.re.get_mail_name_validator()); ; ) {
      const d = Math.max(p - 1, 0);
      if (o && i && !f && (!l || l.index < p))
        for (o.lastIndex < d && (o.lastIndex = d); ; ) {
          const A = o.exec(e);
          if (!A) {
            f = !0, l = void 0;
            break;
          }
          const w = i.exec(e.slice(Math.max(0, A.index - 65), A.index));
          if (w) {
            if (l = {
              schema: "mailto:",
              index: A.index - w[1].length,
              lastIndex: A.index + A[0].length
            }, l.index >= p) break;
            o.lastIndex < d && (o.lastIndex = d);
          }
        }
      if (r && !u && (!s || s.index < p))
        for (r.lastIndex < d && (r.lastIndex = d); ; ) {
          const A = r.exec(e);
          if (!A) {
            u = !0, s = void 0;
            break;
          }
          if (s = {
            schema: "",
            index: A.index + A[1].length,
            lastIndex: A.index + A[0].length
          }, s.index >= p) break;
          r.lastIndex < d && (r.lastIndex = d);
        }
      let g = l;
      (!g || s && (s.index < g.index || s.index === g.index && s.lastIndex > g.lastIndex)) && (g = s);
      let _;
      if (!c) for (; ; ) {
        if (!a) {
          n.lastIndex < d && (n.lastIndex = d);
          const C = n.exec(e);
          if (!C) {
            c = !0;
            break;
          }
          a = {
            schema: C[2],
            index: C.index + C[1].length,
            lastIndex: C.index + C[0].length
          };
        }
        if (a.index < p) {
          a = void 0;
          continue;
        }
        if (g && a.index > g.index) break;
        const A = a;
        a = void 0;
        const w = this.testSchemaAt(e, A.schema, A.lastIndex);
        if (w) {
          _ = {
            schema: A.schema,
            index: A.index,
            lastIndex: A.lastIndex + w
          };
          break;
        }
      }
      let E = _;
      if ((!E || l && (l.index < E.index || l.index === E.index && l.lastIndex > E.lastIndex)) && (E = l), (!E || s && (s.index < E.index || s.index === E.index && s.lastIndex > E.lastIndex)) && (E = s), !E) break;
      E === l ? l = void 0 : E === s && (s = void 0);
      const T = new $s(e, E.schema, E.index, E.lastIndex);
      T.schema ? this.__schemas__[T.schema].normalize(T, this) : this.normalize(T), t.push(T), p = E.lastIndex;
    }
    return t.length ? t : null;
  }
  /**
  * Returns fully-formed (not fuzzy) link if it starts at the beginning
  * of the string, and null otherwise.
  *
  * @param text Text to scan.
  */
  matchAtStart(e) {
    if (!e.length) return null;
    const t = this.re.get_schema_at_start().exec(e);
    if (!t) return null;
    const n = this.testSchemaAt(e, t[2], t[0].length);
    if (!n) return null;
    const r = new $s(e, t[2], t.index + t[1].length, t.index + t[0].length + n);
    return this.__schemas__[r.schema].normalize(r, this), r;
  }
  /**
  * Load (or merge) new TLDs list. Those are used for fuzzy links (without
  * prefix) to avoid false positives. By default this algorithm is used:
  *
  * - hostname with any 2-letter root zones are ok.
  * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
  *   are ok.
  * - encoded (`xn--...`) root zones are ok.
  *
  * If list is replaced, then exact match for 2-chars root zones will be checked.
  *
  * @param list List of TLDs.
  * @param keepOld Merge with current list if `true` (`false` by default).
  */
  tlds(e, t = !1) {
    return e = Array.isArray(e) ? e : [e], t ? this.__opts__.tlds = this.__opts__.tlds.concat(e) : this.__opts__.tlds = e, this.re.set({
      ...this.__opts__,
      schema_names: Object.keys(this.__schemas__)
    }), this;
  }
  /**
  * Default normalizer (if schema does not define its own).
  *
  * @param match Match to normalize.
  */
  normalize(e) {
    e.schema || (e.url = `http://${e.url}`), e.schema === "mailto:" && !/^mailto:/i.test(e.url) && (e.url = `mailto:${e.url}`);
  }
};
const Cn = 2147483647, Ct = 36, Ni = 1, tr = 26, xp = 38, yp = 700, Aa = 72, Na = 128, Fa = "-", wp = /^xn--/, Ep = /[^\0-\x7F]/, kp = /[\x2E\u3002\uFF0E\uFF61]/g, Cp = {
  overflow: "Overflow: input needs wider integers to process",
  "not-basic": "Illegal input >= 0x80 (not a basic code point)",
  "invalid-input": "Invalid input"
}, To = Ct - Ni, Dt = Math.floor, Io = String.fromCharCode;
function Wt(e) {
  throw new RangeError(Cp[e]);
}
function Dp(e, t) {
  const n = [];
  let r = e.length;
  for (; r--; )
    n[r] = t(e[r]);
  return n;
}
function Sa(e, t) {
  const n = e.split("@");
  let r = "";
  n.length > 1 && (r = n[0] + "@", e = n[1]), e = e.replace(kp, ".");
  const o = e.split("."), i = Dp(o, t).join(".");
  return r + i;
}
function Oa(e) {
  const t = [];
  let n = 0;
  const r = e.length;
  for (; n < r; ) {
    const o = e.charCodeAt(n++);
    if (o >= 55296 && o <= 56319 && n < r) {
      const i = e.charCodeAt(n++);
      (i & 64512) == 56320 ? t.push(((o & 1023) << 10) + (i & 1023) + 65536) : (t.push(o), n--);
    } else
      t.push(o);
  }
  return t;
}
const Rp = (e) => String.fromCodePoint(...e), Ap = function(e) {
  return e >= 48 && e < 58 ? 26 + (e - 48) : e >= 65 && e < 91 ? e - 65 : e >= 97 && e < 123 ? e - 97 : Ct;
}, zs = function(e, t) {
  return e + 22 + 75 * (e < 26) - ((t != 0) << 5);
}, Ta = function(e, t, n) {
  let r = 0;
  for (e = n ? Dt(e / yp) : e >> 1, e += Dt(e / t); e > To * tr >> 1; r += Ct)
    e = Dt(e / To);
  return Dt(r + (To + 1) * e / (e + xp));
}, Ia = function(e) {
  const t = [], n = e.length;
  let r = 0, o = Na, i = Aa, s = e.lastIndexOf(Fa);
  s < 0 && (s = 0);
  for (let l = 0; l < s; ++l)
    e.charCodeAt(l) >= 128 && Wt("not-basic"), t.push(e.charCodeAt(l));
  for (let l = s > 0 ? s + 1 : 0; l < n; ) {
    const a = r;
    for (let u = 1, f = Ct; ; f += Ct) {
      l >= n && Wt("invalid-input");
      const p = Ap(e.charCodeAt(l++));
      p >= Ct && Wt("invalid-input"), p > Dt((Cn - r) / u) && Wt("overflow"), r += p * u;
      const d = f <= i ? Ni : f >= i + tr ? tr : f - i;
      if (p < d)
        break;
      const g = Ct - d;
      u > Dt(Cn / g) && Wt("overflow"), u *= g;
    }
    const c = t.length + 1;
    i = Ta(r - a, c, a == 0), Dt(r / c) > Cn - o && Wt("overflow"), o += Dt(r / c), r %= c, t.splice(r++, 0, o);
  }
  return String.fromCodePoint(...t);
}, ja = function(e) {
  const t = [];
  e = Oa(e);
  const n = e.length;
  let r = Na, o = 0, i = Aa;
  for (const a of e)
    a < 128 && t.push(Io(a));
  const s = t.length;
  let l = s;
  for (s && t.push(Fa); l < n; ) {
    let a = Cn;
    for (const u of e)
      u >= r && u < a && (a = u);
    const c = l + 1;
    a - r > Dt((Cn - o) / c) && Wt("overflow"), o += (a - r) * c, r = a;
    for (const u of e)
      if (u < r && ++o > Cn && Wt("overflow"), u === r) {
        let f = o;
        for (let p = Ct; ; p += Ct) {
          const d = p <= i ? Ni : p >= i + tr ? tr : p - i;
          if (f < d)
            break;
          const g = f - d, _ = Ct - d;
          t.push(
            Io(zs(d + g % _, 0))
          ), f = Dt(g / _);
        }
        t.push(Io(zs(f, 0))), i = Ta(o, c, l === s), o = 0, ++l;
      }
    ++o, ++r;
  }
  return t.join("");
}, Np = function(e) {
  return Sa(e, function(t) {
    return wp.test(t) ? Ia(t.slice(4).toLowerCase()) : t;
  });
}, Fp = function(e) {
  return Sa(e, function(t) {
    return Ep.test(t) ? "xn--" + ja(t) : t;
  });
}, Ls = {
  /**
   * A string representing the current Punycode.js version number.
   * @memberOf punycode
   * @type String
   */
  version: "2.3.1",
  /**
   * An object of methods to convert from JavaScript's internal character
   * representation (UCS-2) to Unicode code points, and back.
   * @see <https://mathiasbynens.be/notes/javascript-encoding>
   * @memberOf punycode
   * @type Object
   */
  ucs2: {
    decode: Oa,
    encode: Rp
  },
  decode: Ia,
  encode: ja,
  toASCII: Fp,
  toUnicode: Np
};
/*! markdown-it 15.0.3 https://github.com/markdown-it/markdown-it @license MIT */
var Js = Object.defineProperty, Ma = (e, t) => {
  let n = {};
  for (var r in e) Js(n, r, {
    get: e[r],
    enumerable: !0
  });
  return Js(n, Symbol.toStringTag, { value: "Module" }), n;
}, Sp = /* @__PURE__ */ Ma({
  arrayReplaceAt: () => Op,
  asciiTrim: () => _o,
  callable: () => Va,
  escapeHtml: () => Zt,
  escapeRE: () => Lp,
  fromCodePoint: () => nr,
  isMdAsciiPunct: () => ir,
  isPunctChar: () => Ba,
  isPunctCharCode: () => or,
  isSpace: () => we,
  isValidEntityCode: () => Fi,
  isWhiteSpace: () => rr,
  lib: () => Jp,
  normalizeReference: () => mo,
  unescapeAll: () => Rn,
  unescapeMd: () => Mp
});
function Va(e) {
  const t = function(...n) {
    return Reflect.construct(e, n, new.target && new.target !== t ? new.target : e);
  };
  return Object.defineProperty(t, "name", { value: e.name }), Object.setPrototypeOf(t, e), t.prototype = e.prototype, t;
}
function Op(e, t, n) {
  return [].concat(e.slice(0, t), n, e.slice(t + 1));
}
function Fi(e) {
  return !(e >= 55296 && e <= 57343 || e >= 64976 && e <= 65007 || (e & 65535) === 65535 || (e & 65535) === 65534 || e >= 0 && e <= 8 || e === 11 || e >= 14 && e <= 31 || e >= 127 && e <= 159 || e > 1114111);
}
function nr(e) {
  if (e > 65535) {
    e -= 65536;
    const t = 55296 + (e >> 10), n = 56320 + (e & 1023);
    return String.fromCharCode(t, n);
  }
  return String.fromCharCode(e);
}
var Pa = /\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g, Tp = new RegExp(`${Pa.source}|${/&([a-z#][a-z0-9]{1,31});/gi.source}`, "gi"), Ip = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
function jp(e, t) {
  if (t.charCodeAt(0) === 35 && Ip.test(t)) {
    const r = t[1].toLowerCase() === "x" ? parseInt(t.slice(2), 16) : parseInt(t.slice(1), 10);
    return Fi(r) ? nr(r) : e;
  }
  const n = Ra(e);
  return n !== e ? n : e;
}
function Mp(e) {
  return e.indexOf("\\") < 0 ? e : e.replace(Pa, "$1");
}
function Rn(e) {
  return e.indexOf("\\") < 0 && e.indexOf("&") < 0 ? e : e.replace(Tp, function(t, n, r) {
    return n || jp(t, r);
  });
}
var Vp = /[&<>"]/, Pp = /[&<>"]/g, Bp = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;"
};
function $p(e) {
  return Bp[e];
}
function Zt(e) {
  return Vp.test(e) ? e.replace(Pp, $p) : e;
}
var zp = /[.?*+^$[\]\\(){}|-]/g;
function Lp(e) {
  return e.replace(zp, "\\$&");
}
function we(e) {
  switch (e) {
    case 9:
    case 32:
      return !0;
  }
  return !1;
}
function rr(e) {
  if (e >= 8192 && e <= 8202) return !0;
  switch (e) {
    case 9:
    case 10:
    case 11:
    case 12:
    case 13:
    case 32:
    case 160:
    case 5760:
    case 8239:
    case 8287:
    case 12288:
      return !0;
  }
  return !1;
}
function Ba(e) {
  return Ai.test(e) || Ea.test(e);
}
function or(e) {
  return Ba(nr(e));
}
function ir(e) {
  switch (e) {
    case 33:
    case 34:
    case 35:
    case 36:
    case 37:
    case 38:
    case 39:
    case 40:
    case 41:
    case 42:
    case 43:
    case 44:
    case 45:
    case 46:
    case 47:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 124:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
function mo(e) {
  return e = e.trim().replace(/\s+/g, " "), e.toLowerCase().toUpperCase();
}
function Us(e) {
  return e === 32 || e === 9 || e === 10 || e === 13;
}
function _o(e) {
  let t = 0;
  for (; t < e.length && Us(e.charCodeAt(t)); t++) ;
  let n = e.length - 1;
  for (; n >= t && Us(e.charCodeAt(n)); n--) ;
  return e.slice(t, n + 1);
}
var Jp = {
  mdurl: Xd,
  ucmicro: Gd
};
function Up(e, t, n) {
  let r, o, i, s;
  const l = e.posMax, a = e.pos;
  for (e.pos = t + 1, r = 1; e.pos < l; ) {
    if (i = e.src.charCodeAt(e.pos), i === 93 && (r--, r === 0)) {
      o = !0;
      break;
    }
    if (s = e.pos, e.md.inline.skipToken(e), i === 91) {
      if (s === e.pos - 1) r++;
      else if (n)
        return e.pos = a, -1;
    }
  }
  let c = -1;
  return o && (c = e.pos), e.pos = a, c;
}
function Wp(e, t, n) {
  let r, o = t;
  const i = {
    ok: !1,
    pos: 0,
    str: ""
  };
  if (e.charCodeAt(o) === 60) {
    for (o++; o < n; ) {
      if (r = e.charCodeAt(o), r === 10 || r === 60) return i;
      if (r === 62)
        return i.pos = o + 1, i.str = Rn(e.slice(t + 1, o)), i.ok = !0, i;
      if (r === 92 && o + 1 < n) {
        o += 2;
        continue;
      }
      o++;
    }
    return i;
  }
  let s = 0;
  for (; o < n && (r = e.charCodeAt(o), !(r === 32 || r < 32 || r === 127)); ) {
    if (r === 92 && o + 1 < n) {
      if (e.charCodeAt(o + 1) === 32) {
        o++;
        continue;
      }
      o += 2;
      continue;
    }
    if (r === 40 && (s++, s > 32))
      return i;
    if (r === 41) {
      if (s === 0) break;
      s--;
    }
    o++;
  }
  return t === o || s !== 0 || (i.str = Rn(e.slice(t, o)), i.pos = o, i.ok = !0), i;
}
function Hp(e, t, n, r) {
  let o, i = t;
  const s = {
    ok: !1,
    can_continue: !1,
    pos: 0,
    str: "",
    marker: 0
  };
  if (r)
    s.str = r.str, s.marker = r.marker;
  else {
    if (i >= n) return s;
    let l = e.charCodeAt(i);
    if (l !== 34 && l !== 39 && l !== 40) return s;
    t++, i++, l === 40 && (l = 41), s.marker = l;
  }
  for (; i < n; ) {
    if (o = e.charCodeAt(i), o === s.marker)
      return s.pos = i + 1, s.str += Rn(e.slice(t, i)), s.ok = !0, s;
    if (o === 40 && s.marker === 41) return s;
    o === 92 && i + 1 < n && i++, i++;
  }
  return s.can_continue = !0, s.str += Rn(e.slice(t, i)), s;
}
var qp = /* @__PURE__ */ Ma({
  parseLinkDestination: () => Wp,
  parseLinkLabel: () => Up,
  parseLinkTitle: () => Hp
});
function sr(e) {
  "@babel/helpers - typeof";
  return sr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, sr(e);
}
function Kp(e, t) {
  if (sr(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (sr(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Zp(e) {
  var t = Kp(e, "string");
  return sr(t) == "symbol" ? t : t + "";
}
function K(e, t, n) {
  return (t = Zp(t)) in e ? Object.defineProperty(e, t, {
    value: n,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[t] = n, e;
}
var hn = class {
  constructor(e, t, n) {
    K(
      this,
      /**
      * Source map info. Format: `[ line_begin, line_end ]`
      */
      "map",
      null
    ), K(
      this,
      /**
      * nesting level, the same as `state.level`
      */
      "level",
      0
    ), K(
      this,
      /**
      * An array of child nodes (inline and img tokens)
      */
      "children",
      null
    ), K(
      this,
      /**
      * In a case of self-closing tag (code, html, fence, etc.),
      * it has contents of this tag.
      */
      "content",
      ""
    ), K(
      this,
      /**
      * '*' or '_' for emphasis, fence string for fence, etc.
      */
      "markup",
      ""
    ), K(
      this,
      /**
      * Additional information:
      *
      * - Info string for "fence" tokens
      * - The value "auto" for autolink "link_open" and "link_close" tokens
      * - The string value of the item marker for ordered-list "list_item_open" tokens
      */
      "info",
      ""
    ), K(
      this,
      /**
      * True for block-level tokens, false for inline tokens.
      * Used in renderer to calculate line breaks
      */
      "block",
      !1
    ), K(
      this,
      /**
      * If it's true, ignore this element when rendering. Used for tight lists
      * to hide paragraphs.
      */
      "hidden",
      !1
    ), this.type = e, this.tag = t, this.attrs = null, this.nesting = n, this.meta = null;
  }
  /**
  * Search attribute index by name.
  */
  attrIndex(e) {
    if (!this.attrs) return -1;
    const t = this.attrs;
    for (let n = 0, r = t.length; n < r; n++) if (t[n][0] === e) return n;
    return -1;
  }
  /**
  * Add `[ name, value ]` attribute to list. Init attrs if necessary
  */
  attrPush(e) {
    this.attrs ? this.attrs.push(e) : this.attrs = [e];
  }
  /**
  * Set `name` attribute to `value`. Override old value if exists.
  */
  attrSet(e, t) {
    const n = this.attrIndex(e), r = [e, t];
    n < 0 ? this.attrPush(r) : this.attrs[n] = r;
  }
  /**
  * Get the value of attribute `name`, or null if it does not exist.
  */
  attrGet(e) {
    const t = this.attrIndex(e);
    let n = null;
    return t >= 0 && (n = this.attrs[t][1]), n;
  }
  /**
  * Join value to existing attribute via space. Or create new attribute if not
  * exists. Useful to operate with token classes.
  */
  attrJoin(e, t) {
    const n = this.attrIndex(e);
    n < 0 ? this.attrPush([e, t]) : this.attrs[n][1] = `${this.attrs[n][1]} ${t}`;
  }
}, lr = class {
  constructor() {
    K(
      this,
      /** @internal */
      "__rules__",
      []
    ), K(
      this,
      /** @internal */
      "__cache__",
      null
    );
  }
  /** @internal */
  __find__(e) {
    for (let t = 0; t < this.__rules__.length; t++) if (this.__rules__[t].name === e) return t;
    return -1;
  }
  /** @internal */
  __compile__() {
    const e = /* @__PURE__ */ new Set();
    this.__rules__.forEach((t) => {
      t.enabled && t.alt.forEach((n) => {
        n && e.add(n);
      });
    }), this.__cache__ = /* @__PURE__ */ Object.create(null), this.__cache__[""] = [], this.__rules__.forEach((t) => {
      t.enabled && this.__cache__[""].push(t.fn);
    }), e.forEach((t) => {
      this.__cache__[t] = [], this.__rules__.forEach((n) => {
        n.enabled && n.alt.indexOf(t) >= 0 && this.__cache__[t].push(n.fn);
      });
    });
  }
  /**
  * Replace rule by name with new function & options. Throws error if name not
  * found.
  *
  * @example Replace existing typographer replacement rule with new one
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * const md = new MarkdownIt()
  *
  * md.core.ruler.at('replacements', function replace(state) {
  *   //...
  * });
  * ```
  */
  at(e, t, n = {}) {
    const r = this.__find__(e);
    if (r === -1) throw new Error(`Parser rule not found: ${e}`);
    this.__rules__[r].fn = t, this.__rules__[r].alt = n.alt || [], this.__cache__ = null;
  }
  /**
  * Add new rule to chain before one with given name. See also
  * {@link Ruler.after}, {@link Ruler.push}.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * const md = new MarkdownIt()
  *
  * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
  *   //...
  * });
  * ```
  */
  before(e, t, n, r = {}) {
    const o = this.__find__(e);
    if (o === -1) throw new Error(`Parser rule not found: ${e}`);
    this.__rules__.splice(o, 0, {
      name: t,
      enabled: !0,
      fn: n,
      alt: r.alt || []
    }), this.__cache__ = null;
  }
  /**
  * Add new rule to chain after one with given name. See also
  * {@link Ruler.before}, {@link Ruler.push}.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * const md = new MarkdownIt()
  *
  * md.inline.ruler.after('text', 'my_rule', function replace(state) {
  *   //...
  * });
  * ```
  */
  after(e, t, n, r = {}) {
    const o = this.__find__(e);
    if (o === -1) throw new Error(`Parser rule not found: ${e}`);
    this.__rules__.splice(o + 1, 0, {
      name: t,
      enabled: !0,
      fn: n,
      alt: r.alt || []
    }), this.__cache__ = null;
  }
  /**
  * Push new rule to the end of chain. See also
  * {@link Ruler.before}, {@link Ruler.after}.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * const md = new MarkdownIt()
  *
  * md.core.ruler.push('my_rule', function replace(state) {
  *   //...
  * });
  * ```
  */
  push(e, t, n = {}) {
    this.__rules__.push({
      name: e,
      enabled: !0,
      fn: t,
      alt: n.alt || []
    }), this.__cache__ = null;
  }
  /**
  * Enable rules with given names. If any rule name not found - throw Error.
  * Errors can be disabled by second param.
  *
  * See also {@link Ruler.disable}, {@link Ruler.enableOnly}.
  *
  * Returns list of found rule names (if no exception happened).
  */
  enable(e, t = !1) {
    Array.isArray(e) || (e = [e]);
    const n = [];
    return e.forEach((r) => {
      const o = this.__find__(r);
      if (o < 0) {
        if (t) return;
        throw new Error(`Rules manager: invalid rule name ${r}`);
      }
      this.__rules__[o].enabled = !0, n.push(r);
    }), this.__cache__ = null, n;
  }
  /**
  * Enable rules with given names, and disable everything else. If any rule name
  * not found - throw Error. Errors can be disabled by second param.
  *
  * See also {@link Ruler.disable}, {@link Ruler.enable}.
  */
  enableOnly(e, t = !1) {
    Array.isArray(e) || (e = [e]), this.__rules__.forEach((n) => {
      n.enabled = !1;
    }), this.enable(e, t);
  }
  /**
  * Disable rules with given names. If any rule name not found - throw Error.
  * Errors can be disabled by second param.
  *
  * See also {@link Ruler.enable}, {@link Ruler.enableOnly}.
  *
  * Returns list of found rule names (if no exception happened).
  */
  disable(e, t = !1) {
    Array.isArray(e) || (e = [e]);
    const n = [];
    return e.forEach((r) => {
      const o = this.__find__(r);
      if (o < 0) {
        if (t) return;
        throw new Error(`Rules manager: invalid rule name ${r}`);
      }
      this.__rules__[o].enabled = !1, n.push(r);
    }), this.__cache__ = null, n;
  }
  /**
  * Return array of active functions (rules) for given chain name. It analyzes
  * rules configuration, compiles caches if not exists and returns result.
  *
  * Default chain name is `''` (empty string). It can't be skipped. That's
  * done intentionally, to keep signature monomorphic for high speed.
  */
  getRules(e) {
    return this.__cache__ || this.__compile__(), this.__cache__[e] || [];
  }
}, At = {};
At.code_inline = function(e, t, n, r, o) {
  const i = e[t];
  return `<code${o.renderAttrs(i)}>${Zt(i.content)}</code>`;
};
At.code_block = function(e, t, n, r, o) {
  const i = e[t];
  return `<pre${o.renderAttrs(i)}><code>${Zt(e[t].content)}</code></pre>
`;
};
At.fence = function(e, t, n, r, o) {
  const i = e[t], s = i.info ? Rn(i.info).trim() : "";
  let l = "", a = "";
  if (s) {
    const u = s.split(/(\s+)/g);
    l = u[0], a = u.slice(2).join("");
  }
  let c;
  if (n.highlight ? c = n.highlight(i.content, l, a) || Zt(i.content) : c = Zt(i.content), c.indexOf("<pre") === 0) return c + `
`;
  if (s) {
    const u = i.attrIndex("class"), f = i.attrs ? i.attrs.slice() : [];
    u < 0 ? f.push(["class", `${n.langPrefix}${l}`]) : (f[u] = [f[u][0], f[u][1]], f[u][1] += ` ${n.langPrefix}${l}`);
    const p = { attrs: f };
    return `<pre><code${o.renderAttrs(p)}>${c}</code></pre>
`;
  }
  return `<pre><code${o.renderAttrs(i)}>${c}</code></pre>
`;
};
At.image = function(e, t, n, r, o) {
  const i = e[t];
  return i.attrs[i.attrIndex("alt")][1] = o.renderInlineAsText(i.children, n, r), o.renderToken(e, t, n);
};
At.hardbreak = function(e, t, n) {
  return n.xhtmlOut ? `<br />
` : `<br>
`;
};
At.softbreak = function(e, t, n) {
  return n.breaks ? n.xhtmlOut ? `<br />
` : `<br>
` : `
`;
};
At.text = function(e, t) {
  return Zt(e[t].content);
};
At.html_block = function(e, t) {
  return e[t].content;
};
At.html_inline = function(e, t) {
  return e[t].content;
};
var $a = class {
  constructor() {
    K(
      this,
      /**
      * Contains render rules for tokens. Can be updated and extended.
      *
      * See [source code](https://github.com/markdown-it/markdown-it/blob/master/src/renderer.ts)
      * for more details and examples.
      *
      * @example Custom render rules
      * ```javascript
      * import MarkdownIt from 'markdown-it'
      * const md = new MarkdownIt()
      *
      * md.renderer.rules.strong_open  = function () { return '<b>'; };
      * md.renderer.rules.strong_close = function () { return '</b>'; };
      *
      * const result = md.renderInline(...);
      * ```
      *
      * @example Each rule is called as independent static function with fixed signature
      * ```javascript
      * function my_token_render(tokens, idx, options, env, renderer) {
      *   // ...
      *   return renderedHTML;
      * }
      * ```
      */
      "rules",
      Object.assign({}, At)
    );
  }
  /**
  * Render token attributes to string.
  */
  renderAttrs(e) {
    let t, n, r;
    if (!e.attrs) return "";
    for (r = "", t = 0, n = e.attrs.length; t < n; t++) r += ` ${Zt(e.attrs[t][0])}="${Zt(String(e.attrs[t][1]))}"`;
    return r;
  }
  /**
  * Default token renderer. Can be overriden by custom function
  * in {@link Renderer.rules}.
  */
  renderToken(e, t, n) {
    const r = e[t];
    let o = "";
    if (r.hidden) return "";
    let i = t - 1;
    for (; i >= 0 && e[i].hidden && e[i].nesting === 0; ) i--;
    r.block && r.nesting !== -1 && i >= 0 && e[i].hidden && e[i].nesting === -1 && (o += `
`), o += (r.nesting === -1 ? "</" : "<") + r.tag, o += this.renderAttrs(r), r.nesting === 0 && n.xhtmlOut && (o += " /");
    let s = !1;
    if (r.block && (s = !0, r.nesting === 1)) {
      let l = t + 1;
      for (; l < e.length && e[l].hidden && e[l].nesting === 0; ) l++;
      if (l < e.length) {
        const a = e[l];
        (a.type === "inline" || a.hidden || a.nesting === -1 && a.tag === r.tag) && (s = !1);
      }
    }
    return o += s ? `>
` : ">", o;
  }
  /**
  * The same as {@link Renderer.render}, but for single token of `inline` type.
  */
  renderInline(e, t, n) {
    let r = "";
    const o = this.rules;
    for (let i = 0, s = e.length; i < s; i++) {
      const l = e[i].type;
      typeof o[l] < "u" ? r += o[l](e, i, t, n, this) : r += this.renderToken(e, i, t);
    }
    return r;
  }
  /**
  * Special kludge for image `alt` attributes to conform CommonMark spec.
  * Don't try to use it! Spec requires to show `alt` content with stripped markup,
  * instead of simple escaping.
  */
  renderInlineAsText(e, t, n) {
    let r = "";
    for (let o = 0, i = e.length; o < i; o++) switch (e[o].type) {
      case "text":
      case "code_inline":
        r += e[o].content;
        break;
      case "image":
        r += this.renderInlineAsText(e[o].children, t, n);
        break;
      case "html_inline":
      case "html_block":
        r += e[o].content;
        break;
      case "softbreak":
      case "hardbreak":
        r += `
`;
    }
    return r;
  }
  /**
  * Takes token stream and generates HTML. Probably, you will never need to call
  * this method directly.
  */
  render(e, t, n) {
    let r = "";
    const o = this.rules;
    for (let i = 0, s = e.length; i < s; i++) {
      const l = e[i].type;
      l === "inline" ? r += this.renderInline(e[i].children, t, n) : typeof o[l] < "u" ? r += o[l](e, i, t, n, this) : r += this.renderToken(e, i, t);
    }
    return r;
  }
}, za = class {
  constructor(e, t, n) {
    K(this, "tokens", []), K(this, "inlineMode", !1), K(this, "Token", hn), this.src = e, this.env = n, this.md = t;
  }
}, Xp = /\r\n?/g, Yp = /\0/g;
function Gp(e) {
  let t;
  t = e.src.replace(Xp, `
`), t = t.replace(Yp, "�"), e.src = t;
}
function Qp(e) {
  let t;
  e.inlineMode ? (t = new e.Token("inline", "", 0), t.content = e.src, t.map = [0, 1], t.children = [], e.tokens.push(t)) : e.md.block.parse(e.src, e.md, e.env, e.tokens);
}
function eh(e) {
  const t = e.tokens;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    t[r].type !== "reference_definition" && (r !== n && (t[n] = t[r]), n++);
  t.length !== n && (t.length = n);
}
function th(e) {
  const t = e.tokens;
  for (let n = 0, r = t.length; n < r; n++) {
    const o = t[n];
    o.type === "inline" && e.md.inline.parse(o.content, e.md, e.env, o.children);
  }
}
function nh(e) {
  return /^<a[>\s]/i.test(e);
}
function rh(e) {
  return /^<\/a\s*>/i.test(e);
}
function oh(e) {
  const t = e.tokens;
  if (e.md.options.linkify)
    for (let n = 0, r = t.length; n < r; n++) {
      if (t[n].type !== "inline" || !e.md.linkify.test(t[n].content)) continue;
      const o = t[n].children, i = [];
      let s = 0;
      for (let l = o.length - 1; l >= 0; l--) {
        const a = o[l];
        if (a.type === "link_close") {
          for (l--; o[l].level !== a.level && o[l].type !== "link_open"; ) l--;
          continue;
        }
        if (a.type === "html_inline" && (nh(a.content) && s > 0 && s--, rh(a.content) && s++), !(s > 0) && a.type === "text" && e.md.linkify.test(a.content)) {
          const c = a.content;
          let u = e.md.linkify.match(c);
          const f = [];
          let p = a.level, d = 0;
          u.length > 0 && u[0].index === 0 && l > 0 && o[l - 1].type === "text_special" && (u = u.slice(1));
          for (let g = 0; g < u.length; g++) {
            const _ = u[g].url, E = e.md.normalizeLink(_);
            if (!e.md.validateLink(E)) continue;
            let T = u[g].text;
            u[g].schema ? u[g].schema === "mailto:" && !/^mailto:/i.test(T) ? T = e.md.normalizeLinkText(`mailto:${T}`).replace(/^mailto:/, "") : T = e.md.normalizeLinkText(T) : T = e.md.normalizeLinkText(`http://${T}`).replace(/^http:\/\//, "");
            const A = u[g].index;
            if (A > d) {
              const N = new e.Token("text", "", 0);
              N.content = c.slice(d, A), N.level = p, f.push(N);
            }
            const w = new e.Token("link_open", "a", 1);
            w.attrs = [["href", E]], w.level = p++, w.markup = "linkify", w.info = "auto", f.push(w);
            const C = new e.Token("text", "", 0);
            C.content = T, C.level = p, f.push(C);
            const b = new e.Token("link_close", "a", -1);
            b.level = --p, b.markup = "linkify", b.info = "auto", f.push(b), d = u[g].lastIndex;
          }
          if (d < c.length) {
            const g = new e.Token("text", "", 0);
            g.content = c.slice(d), g.level = p, f.push(g);
          }
          i.push({
            index: l,
            nodes: f
          });
        }
      }
      if (i.length > 0) {
        let l = o.length;
        for (const f of i) l += f.nodes.length - 1;
        const a = new Array(l);
        let c = 0, u = 0;
        i.reverse();
        for (let f = 0; f < o.length; f++) {
          const p = i[c];
          if ((p == null ? void 0 : p.index) === f) {
            for (const d of p.nodes) a[u++] = d;
            c++;
          } else a[u++] = o[f];
        }
        t[n].children = a;
      }
    }
}
var La = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/, ih = /\((c|tm|r)\)/i, sh = /\((c|tm|r)\)/gi, lh = {
  c: "©",
  r: "®",
  tm: "™"
};
function ah(e, t) {
  return lh[t.toLowerCase()];
}
function ch(e) {
  let t = 0;
  for (let n = e.length - 1; n >= 0; n--) {
    const r = e[n];
    r.type === "text" && !t && (r.content = r.content.replace(sh, ah)), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
  }
}
function uh(e) {
  let t = 0;
  for (let n = e.length - 1; n >= 0; n--) {
    const r = e[n];
    r.type === "text" && !t && La.test(r.content) && (r.content = r.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/gm, "$1—").replace(/(^|\s)--(?=\s|$)/gm, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm, "$1–")), r.type === "link_open" && r.info === "auto" && t--, r.type === "link_close" && r.info === "auto" && t++;
  }
}
function fh(e) {
  let t;
  if (e.md.options.typographer)
    for (t = e.tokens.length - 1; t >= 0; t--)
      e.tokens[t].type === "inline" && (ih.test(e.tokens[t].content) && ch(e.tokens[t].children), La.test(e.tokens[t].content) && uh(e.tokens[t].children));
}
var dh = /['"]/, Ws = /['"]/g, Hs = "’", ph = 1e3;
function qs(e, t, n) {
  for (; e.length > n; ) {
    const r = e.pop();
    r.isSingleQuote ? t.single = r.prevSameQuoteIdx : t.double = r.prevSameQuoteIdx;
  }
}
function Nr(e, t, n, r) {
  e[t] || (e[t] = []), e[t].push({
    pos: n,
    ch: r
  });
}
function hh(e, t) {
  let n = "", r = 0;
  t.sort((o, i) => o.pos - i.pos);
  for (let o = 0; o < t.length; o++) {
    const i = t[o];
    n += e.slice(r, i.pos) + i.ch, r = i.pos + 1;
  }
  return n + e.slice(r);
}
function gh(e, t) {
  let n;
  const r = [], o = {
    single: -1,
    double: -1
  }, i = {};
  for (let s = 0; s < e.length; s++) {
    const l = e[s], a = e[s].level;
    for (n = r.length - 1; n >= 0 && !(r[n].level <= a); n--) ;
    if (qs(r, o, n + 1), l.type !== "text") continue;
    const c = l.content;
    let u = 0;
    const f = c.length;
    e: for (; u < f; ) {
      Ws.lastIndex = u;
      const p = Ws.exec(c);
      if (!p) break;
      let d = !0, g = !0;
      u = p.index + 1;
      const _ = p[0] === "'";
      let E = 32;
      if (p.index - 1 >= 0) E = c.charCodeAt(p.index - 1);
      else for (n = s - 1; n >= 0 && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n--)
        if (e[n].content) {
          E = e[n].content.charCodeAt(e[n].content.length - 1);
          break;
        }
      let T = 32;
      if (u < f) T = c.charCodeAt(u);
      else for (n = s + 1; n < e.length && !(e[n].type === "softbreak" || e[n].type === "hardbreak"); n++)
        if (e[n].content) {
          T = e[n].content.charCodeAt(0);
          break;
        }
      const A = ir(E) || or(E), w = ir(T) || or(T), C = rr(E), b = rr(T);
      if (b ? d = !1 : w && (C || A || (d = !1)), C ? g = !1 : A && (b || w || (g = !1)), T === 34 && p[0] === '"' && E >= 48 && E <= 57 && (g = d = !1), d && g && (d = A, g = w), !d && !g) {
        _ && Nr(i, s, p.index, Hs);
        continue;
      }
      if (g && (n = _ ? o.single : o.double, n >= 0 && r[n].level === a)) {
        const N = r[n];
        let L, Q;
        _ ? (L = t.md.options.quotes[2], Q = t.md.options.quotes[3]) : (L = t.md.options.quotes[0], Q = t.md.options.quotes[1]), Nr(i, s, p.index, Q), Nr(i, N.tokenIdx, N.contentPos, L), qs(r, o, n);
        continue e;
      }
      if (d) {
        if (r.length >= ph) return;
        r.push({
          tokenIdx: s,
          contentPos: p.index,
          isSingleQuote: _,
          level: a,
          prevSameQuoteIdx: _ ? o.single : o.double
        }), _ ? o.single = r.length - 1 : o.double = r.length - 1;
      } else g && _ && Nr(i, s, p.index, Hs);
    }
  }
  Object.keys(i).forEach(function(s) {
    const l = Number(s);
    e[l].content = hh(e[l].content, i[s]);
  });
}
function mh(e) {
  if (e.md.options.typographer)
    for (let t = e.tokens.length - 1; t >= 0; t--)
      e.tokens[t].type !== "inline" || !dh.test(e.tokens[t].content) || gh(e.tokens[t].children, e);
}
function _h(e) {
  let t, n;
  const r = e.length;
  for (t = 0; t < r; t++) e[t].type === "text_special" && (e[t].type = "text");
  for (t = n = 0; t < r; t++) e[t].type === "text" && t + 1 < r && e[t + 1].type === "text" ? e[t + 1].content = e[t].content + e[t + 1].content : (t !== n && (e[n] = e[t]), n++);
  t !== n && (e.length = n);
}
function bh(e) {
  let t, n;
  const r = e.tokens, o = r.length;
  for (let i = 0; i < o; i++) {
    if (r[i].type !== "inline") continue;
    const s = r[i].children, l = s.length;
    for (t = 0; t < l; t++)
      s[t].type === "text_special" && (s[t].type = "text"), s[t].children && _h(s[t].children);
    for (t = n = 0; t < l; t++) s[t].type === "text" && t + 1 < l && s[t + 1].type === "text" ? s[t + 1].content = s[t].content + s[t + 1].content : (t !== n && (s[n] = s[t]), n++);
    t !== n && (s.length = n);
  }
}
var jo = [
  ["normalize", Gp],
  ["block", Qp],
  ["strip_references", eh],
  ["inline", th],
  ["linkify", oh],
  ["replacements", fh],
  ["smartquotes", mh],
  ["text_join", bh]
], Ja = class {
  constructor() {
    K(
      this,
      /**
      * {@link Ruler} instance. Keep configuration of core rules.
      */
      "ruler",
      new lr()
    ), K(this, "State", za);
    for (let e = 0; e < jo.length; e++) this.ruler.push(jo[e][0], jo[e][1]);
  }
  /**
  * Executes core chain rules.
  */
  process(e) {
    const t = this.ruler.getRules("");
    for (let n = 0, r = t.length; n < r; n++) t[n](e);
  }
}, Ua = class {
  constructor(e, t, n, r) {
    K(this, "bMarks", []), K(this, "eMarks", []), K(this, "tShift", []), K(this, "sCount", []), K(this, "bsCount", []), K(this, "blkIndent", 0), K(this, "line", 0), K(this, "lineMax", 0), K(this, "tight", !1), K(this, "listIndent", -1), K(this, "parentType", "root"), K(this, "level", 0), K(this, "Token", hn), this.src = e, this.md = t, this.env = n, this.tokens = r;
    const o = this.src;
    for (let i = 0, s = 0, l = 0, a = 0, c = o.length, u = !1; s < c; s++) {
      const f = o.charCodeAt(s);
      if (!u)
        if (we(f)) {
          l++, f === 9 ? a += 4 - a % 4 : a++;
          continue;
        } else u = !0;
      (f === 10 || s === c - 1) && (f !== 10 && s++, this.bMarks.push(i), this.eMarks.push(s), this.tShift.push(l), this.sCount.push(a), this.bsCount.push(0), u = !1, l = 0, a = 0, i = s + 1);
    }
    this.bMarks.push(o.length), this.eMarks.push(o.length), this.tShift.push(0), this.sCount.push(0), this.bsCount.push(0), this.lineMax = this.bMarks.length - 1;
  }
  push(e, t, n) {
    const r = new hn(e, t, n);
    return r.block = !0, n < 0 && this.level--, r.level = this.level, n > 0 && this.level++, this.tokens.push(r), r;
  }
  isEmpty(e) {
    return this.bMarks[e] + this.tShift[e] >= this.eMarks[e];
  }
  skipEmptyLines(e) {
    for (let t = this.lineMax; e < t && !(this.bMarks[e] + this.tShift[e] < this.eMarks[e]); e++) ;
    return e;
  }
  skipSpaces(e) {
    for (let t = this.src.length; e < t && we(this.src.charCodeAt(e)); e++) ;
    return e;
  }
  skipSpacesBack(e, t) {
    if (e <= t) return e;
    for (; e > t; ) if (!we(this.src.charCodeAt(--e))) return e + 1;
    return e;
  }
  skipChars(e, t) {
    for (let n = this.src.length; e < n && this.src.charCodeAt(e) === t; e++) ;
    return e;
  }
  skipCharsBack(e, t, n) {
    if (e <= n) return e;
    for (; e > n; ) if (t !== this.src.charCodeAt(--e)) return e + 1;
    return e;
  }
  getLines(e, t, n, r) {
    if (e >= t) return "";
    const o = new Array(t - e);
    for (let i = 0, s = e; s < t; s++, i++) {
      let l = 0;
      const a = this.bMarks[s];
      let c = a, u;
      for (s + 1 < t || r ? u = this.eMarks[s] + 1 : u = this.eMarks[s]; c < u && l < n; ) {
        const f = this.src.charCodeAt(c);
        if (we(f))
          f === 9 ? l += 4 - (l + this.bsCount[s]) % 4 : l++;
        else if (c - a < this.tShift[s]) l++;
        else break;
        c++;
      }
      l > n ? o[i] = new Array(l - n + 1).join(" ") + this.src.slice(c, u) : o[i] = this.src.slice(c, u);
    }
    return o.join("");
  }
}, vh = 65536;
function Mo(e, t) {
  const n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
  return e.src.slice(n, r);
}
function Ks(e) {
  const t = [], n = e.length;
  let r = 0, o = e.charCodeAt(r), i = !1, s = 0, l = "";
  for (; r < n; )
    o === 124 && (i ? (l += e.substring(s, r - 1), s = r) : (t.push(l + e.substring(s, r)), l = "", s = r + 1)), i = o === 92, r++, o = e.charCodeAt(r);
  return t.push(l + e.substring(s)), t;
}
function xh(e, t, n, r) {
  if (t + 2 > n) return !1;
  let o = t + 1;
  if (e.sCount[o] < e.blkIndent || e.sCount[o] - e.blkIndent >= 4) return !1;
  let i = e.bMarks[o] + e.tShift[o];
  if (i >= e.eMarks[o]) return !1;
  const s = e.src.charCodeAt(i++);
  if (s !== 124 && s !== 45 && s !== 58 || i >= e.eMarks[o]) return !1;
  const l = e.src.charCodeAt(i++);
  if (l !== 124 && l !== 45 && l !== 58 && !we(l) || s === 45 && we(l)) return !1;
  for (; i < e.eMarks[o]; ) {
    const C = e.src.charCodeAt(i);
    if (C !== 124 && C !== 45 && C !== 58 && !we(C)) return !1;
    i++;
  }
  let a = Mo(e, t + 1), c = a.split("|");
  const u = [];
  for (let C = 0; C < c.length; C++) {
    const b = c[C].trim();
    if (!b) {
      if (C === 0 || C === c.length - 1) continue;
      return !1;
    }
    if (!/^:?-+:?$/.test(b)) return !1;
    b.charCodeAt(b.length - 1) === 58 ? u.push(b.charCodeAt(0) === 58 ? "center" : "right") : b.charCodeAt(0) === 58 ? u.push("left") : u.push("");
  }
  if (a = Mo(e, t).trim(), a.indexOf("|") === -1 || e.sCount[t] - e.blkIndent >= 4) return !1;
  c = Ks(a), c.length && c[0] === "" && c.shift(), c.length && c[c.length - 1] === "" && c.pop();
  const f = c.length;
  if (f === 0 || f !== u.length) return !1;
  if (r) return !0;
  const p = e.parentType;
  e.parentType = "table";
  const d = e.md.block.ruler.getRules("blockquote"), g = e.push("table_open", "table", 1), _ = [t, 0];
  g.map = _;
  const E = e.push("thead_open", "thead", 1);
  E.map = [t, t + 1];
  const T = e.push("tr_open", "tr", 1);
  T.map = [t, t + 1];
  for (let C = 0; C < c.length; C++) {
    const b = e.push("th_open", "th", 1);
    u[C] && (b.attrs = [["style", `text-align:${u[C]}`]]);
    const N = e.push("inline", "", 0);
    N.content = c[C].trim(), N.children = [], e.push("th_close", "th", -1);
  }
  e.push("tr_close", "tr", -1), e.push("thead_close", "thead", -1);
  let A, w = 0;
  for (o = t + 2; o < n && !(e.sCount[o] < e.blkIndent); o++) {
    let C = !1;
    for (let N = 0, L = d.length; N < L; N++) if (d[N](e, o, n, !0)) {
      C = !0;
      break;
    }
    if (C || (a = Mo(e, o).trim(), !a) || e.sCount[o] - e.blkIndent >= 4 || (c = Ks(a), c.length && c[0] === "" && c.shift(), c.length && c[c.length - 1] === "" && c.pop(), w += f - c.length, w > vh)) break;
    if (o === t + 2) {
      const N = e.push("tbody_open", "tbody", 1);
      N.map = A = [t + 2, 0];
    }
    const b = e.push("tr_open", "tr", 1);
    b.map = [o, o + 1];
    for (let N = 0; N < f; N++) {
      const L = e.push("td_open", "td", 1);
      u[N] && (L.attrs = [["style", `text-align:${u[N]}`]]);
      const Q = e.push("inline", "", 0);
      Q.content = c[N] ? c[N].trim() : "", Q.children = [], e.push("td_close", "td", -1);
    }
    e.push("tr_close", "tr", -1);
  }
  return A && (e.push("tbody_close", "tbody", -1), A[1] = o), e.push("table_close", "table", -1), _[1] = o, e.parentType = p, e.line = o, !0;
}
function yh(e, t, n) {
  if (e.sCount[t] - e.blkIndent < 4) return !1;
  let r = t + 1, o = r;
  for (; r < n; ) {
    if (e.isEmpty(r)) {
      r++;
      continue;
    }
    if (e.sCount[r] - e.blkIndent >= 4) {
      r++, o = r;
      continue;
    }
    break;
  }
  e.line = o;
  const i = e.push("code_block", "code", 0);
  return i.content = e.getLines(t, o, 4 + e.blkIndent, !1) + `
`, i.map = [t, e.line], !0;
}
function wh(e, t, n, r) {
  let o = e.bMarks[t] + e.tShift[t], i = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || o + 3 > i) return !1;
  const s = e.src.charCodeAt(o);
  if (s !== 126 && s !== 96) return !1;
  let l = o;
  o = e.skipChars(o, s);
  let a = o - l;
  if (a < 3) return !1;
  const c = e.src.slice(l, o), u = e.src.slice(o, i);
  if (s === 96 && u.indexOf(String.fromCharCode(s)) >= 0)
    return !1;
  if (r) return !0;
  let f = t, p = !1;
  for (; f++, !(f >= n || (o = l = e.bMarks[f] + e.tShift[f], i = e.eMarks[f], o < i && e.sCount[f] < e.blkIndent)); )
    if (e.src.charCodeAt(o) === s && !(e.sCount[f] - e.blkIndent >= 4) && (o = e.skipChars(o, s), !(o - l < a) && (o = e.skipSpaces(o), !(o < i)))) {
      p = !0;
      break;
    }
  a = e.sCount[t], e.line = f + (p ? 1 : 0);
  const d = e.push("fence", "code", 0);
  return d.info = u, d.content = e.getLines(t + 1, f, a, !0), d.markup = c, d.map = [t, e.line], !0;
}
function Eh(e, t, n, r) {
  let o = e.bMarks[t] + e.tShift[t], i = e.eMarks[t];
  const s = e.lineMax;
  if (e.sCount[t] - e.blkIndent >= 4 || e.src.charCodeAt(o) !== 62) return !1;
  if (r) return !0;
  const l = [], a = [], c = [], u = [], f = e.md.block.ruler.getRules("blockquote"), p = e.parentType;
  e.parentType = "blockquote";
  let d = !1, g;
  for (g = t; g < n; g++) {
    const w = e.sCount[g] < e.blkIndent;
    if (o = e.bMarks[g] + e.tShift[g], i = e.eMarks[g], o >= i) break;
    if (e.src.charCodeAt(o++) === 62 && !w) {
      let b = e.sCount[g] + 1, N, L;
      e.src.charCodeAt(o) === 32 ? (o++, b++, L = !1, N = !0) : e.src.charCodeAt(o) === 9 ? (N = !0, (e.bsCount[g] + b) % 4 === 3 ? (o++, b++, L = !1) : L = !0) : N = !1;
      let Q = b;
      for (l.push(e.bMarks[g]), e.bMarks[g] = o; o < i; ) {
        const j = e.src.charCodeAt(o);
        if (we(j))
          j === 9 ? Q += 4 - (Q + e.bsCount[g] + (L ? 1 : 0)) % 4 : Q++;
        else break;
        o++;
      }
      d = o >= i, a.push(e.bsCount[g]), e.bsCount[g] = e.sCount[g] + 1 + (N ? 1 : 0), c.push(e.sCount[g]), e.sCount[g] = Q - b, u.push(e.tShift[g]), e.tShift[g] = o - e.bMarks[g];
      continue;
    }
    if (d) break;
    let C = !1;
    for (let b = 0, N = f.length; b < N; b++) if (f[b](e, g, n, !0)) {
      C = !0;
      break;
    }
    if (C) {
      e.lineMax = g, e.blkIndent !== 0 && (l.push(e.bMarks[g]), a.push(e.bsCount[g]), u.push(e.tShift[g]), c.push(e.sCount[g]), e.sCount[g] -= e.blkIndent);
      break;
    }
    l.push(e.bMarks[g]), a.push(e.bsCount[g]), u.push(e.tShift[g]), c.push(e.sCount[g]), e.sCount[g] = -1;
  }
  const _ = e.blkIndent;
  e.blkIndent = 0;
  const E = e.push("blockquote_open", "blockquote", 1);
  E.markup = ">";
  const T = [t, 0];
  E.map = T, e.md.block.tokenize(e, t, g);
  const A = e.push("blockquote_close", "blockquote", -1);
  A.markup = ">", e.lineMax = s, e.parentType = p, T[1] = e.line;
  for (let w = 0; w < u.length; w++)
    e.bMarks[w + t] = l[w], e.tShift[w + t] = u[w], e.sCount[w + t] = c[w], e.bsCount[w + t] = a[w];
  return e.blkIndent = _, !0;
}
function kh(e, t, n, r) {
  const o = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4) return !1;
  let i = e.bMarks[t] + e.tShift[t];
  const s = e.src.charCodeAt(i++);
  if (s !== 42 && s !== 45 && s !== 95) return !1;
  let l = 1;
  for (; i < o; ) {
    const c = e.src.charCodeAt(i++);
    if (c !== s && !we(c)) return !1;
    c === s && l++;
  }
  if (l < 3) return !1;
  if (r) return !0;
  e.line = t + 1;
  const a = e.push("hr", "hr", 0);
  return a.map = [t, e.line], a.markup = Array(l + 1).join(String.fromCharCode(s)), !0;
}
function Zs(e, t) {
  const n = e.eMarks[t];
  let r = e.bMarks[t] + e.tShift[t];
  const o = e.src.charCodeAt(r++);
  return o !== 42 && o !== 45 && o !== 43 || r < n && !we(e.src.charCodeAt(r)) ? -1 : r;
}
function Xs(e, t) {
  const n = e.bMarks[t] + e.tShift[t], r = e.eMarks[t];
  let o = n;
  if (o + 1 >= r) return -1;
  let i = e.src.charCodeAt(o++);
  if (i < 48 || i > 57) return -1;
  for (; ; ) {
    if (o >= r) return -1;
    if (i = e.src.charCodeAt(o++), i >= 48 && i <= 57) {
      if (o - n >= 10) return -1;
      continue;
    }
    if (i === 41 || i === 46) break;
    return -1;
  }
  return o < r && (i = e.src.charCodeAt(o), !we(i)) ? -1 : o;
}
function Ch(e, t) {
  const n = e.level + 2;
  for (let r = t + 2, o = e.tokens.length - 2; r < o; r++) e.tokens[r].level === n && e.tokens[r].type === "paragraph_open" && (e.tokens[r + 2].hidden = !0, e.tokens[r].hidden = !0, r += 2);
}
function Dh(e, t, n, r) {
  let o, i, s, l, a = t, c = !0;
  if (e.sCount[a] - e.blkIndent >= 4 || e.listIndent >= 0 && e.sCount[a] - e.listIndent >= 4 && e.sCount[a] < e.blkIndent) return !1;
  let u = !1;
  r && e.parentType === "paragraph" && e.sCount[a] >= e.blkIndent && (u = !0);
  let f, p, d;
  if ((d = Xs(e, a)) >= 0) {
    if (f = !0, s = e.bMarks[a] + e.tShift[a], p = Number(e.src.slice(s, d - 1)), u && p !== 1) return !1;
  } else if ((d = Zs(e, a)) >= 0) f = !1;
  else return !1;
  if (u && e.skipSpaces(d) >= e.eMarks[a])
    return !1;
  if (r) return !0;
  const g = e.src.charCodeAt(d - 1), _ = e.tokens.length;
  f ? (l = e.push("ordered_list_open", "ol", 1), p !== 1 && (l.attrs = [["start", p]])) : l = e.push("bullet_list_open", "ul", 1);
  const E = [a, 0];
  l.map = E, l.markup = String.fromCharCode(g);
  let T = !1;
  const A = e.md.block.ruler.getRules("list"), w = e.parentType;
  for (e.parentType = "list"; a < n; ) {
    i = d, o = e.eMarks[a];
    const C = e.sCount[a] + d - (e.bMarks[a] + e.tShift[a]);
    let b = C;
    for (; i < o; ) {
      const J = e.src.charCodeAt(i);
      if (J === 9) b += 4 - (b + e.bsCount[a]) % 4;
      else if (J === 32) b++;
      else break;
      i++;
    }
    const N = i;
    let L;
    N >= o ? L = 1 : L = b - C, L > 4 && (L = 1);
    const Q = C + L;
    l = e.push("list_item_open", "li", 1), l.markup = String.fromCharCode(g);
    const j = [a, 0];
    l.map = j, f && (l.info = e.src.slice(s, d - 1));
    const H = e.tight, v = e.tShift[a], x = e.sCount[a], q = e.listIndent;
    if (e.listIndent = e.blkIndent, e.blkIndent = Q, e.tight = !0, e.tShift[a] = N - e.bMarks[a], e.sCount[a] = b, N >= o && e.isEmpty(a + 1) ? e.line = Math.min(e.line + 2, n) : e.md.block.tokenize(e, a, n), (!e.tight || T) && (c = !1), T = e.line - a > 1 && e.isEmpty(e.line - 1), e.blkIndent = e.listIndent, e.listIndent = q, e.tShift[a] = v, e.sCount[a] = x, e.tight = H, l = e.push("list_item_close", "li", -1), l.markup = String.fromCharCode(g), a = e.line, j[1] = a, a >= n || e.sCount[a] < e.blkIndent || e.sCount[a] - e.blkIndent >= 4) break;
    let te = !1;
    for (let J = 0, ce = A.length; J < ce; J++) if (A[J](e, a, n, !0)) {
      te = !0;
      break;
    }
    if (te) break;
    if (f) {
      if (d = Xs(e, a), d < 0) break;
      s = e.bMarks[a] + e.tShift[a];
    } else if (d = Zs(e, a), d < 0) break;
    if (g !== e.src.charCodeAt(d - 1)) break;
  }
  return f ? l = e.push("ordered_list_close", "ol", -1) : l = e.push("bullet_list_close", "ul", -1), l.markup = String.fromCharCode(g), E[1] = a, e.line = a, e.parentType = w, c && Ch(e, _), !0;
}
var Vo = 999;
function Rh(e) {
  let t = e.length;
  for (let n = 0; n < e.length - 1; n++) {
    const r = e.charCodeAt(n);
    if (r < 55296 || r > 56319) continue;
    const o = e.charCodeAt(n + 1);
    o >= 56320 && o <= 57343 && (t--, n++);
  }
  return t;
}
function Tn(e, t) {
  return Math.min(e.eMarks[t] + 1, e.src.length);
}
function Fr(e, t) {
  const n = e.lineMax;
  if (t >= n || e.isEmpty(t)) return -1;
  let r = !1;
  if (e.sCount[t] - e.blkIndent > 3 && (r = !0), e.sCount[t] < 0 && (r = !0), !r) {
    const o = e.md.block.ruler.getRules("reference"), i = e.parentType;
    e.parentType = "reference";
    let s = !1;
    for (let l = 0, a = o.length; l < a; l++) if (o[l](e, t, n, !0)) {
      s = !0;
      break;
    }
    if (e.parentType = i, s) return -1;
  }
  return e.bMarks[t] + e.tShift[t];
}
function Ah(e, t, n, r) {
  const o = e.src;
  let i = e.bMarks[t] + e.tShift[t], s = t + 1;
  if (e.sCount[t] - e.blkIndent >= 4 || o.charCodeAt(i) !== 91) return !1;
  let l = Tn(e, t), a = "", c = -1, u = ++i;
  for (; i < l; ) {
    if (a.length + i - u > Vo * 2) return !1;
    let N = o.charCodeAt(i);
    if (N === 91) return !1;
    if (N === 93) {
      c = i;
      break;
    }
    if (N === 92 && (N = o.charCodeAt(++i)), N === 10 && i < l) {
      const L = Fr(e, s);
      if (L < 0) return !1;
      a += o.slice(u, l), i = u = L, l = Tn(e, s++);
      continue;
    }
    i++;
  }
  if (c < 0 || o.charCodeAt(c + 1) !== 58 || (a += o.slice(u, c), a.length > Vo && Rh(a) > Vo)) return !1;
  for (i = c + 2; i < l; ) {
    const N = o.charCodeAt(i);
    if (N === 10) {
      const L = Fr(e, s);
      if (L < 0) break;
      i = L, l = Tn(e, s++);
    } else if (we(N)) i++;
    else break;
  }
  const f = e.md.helpers.parseLinkDestination(o, i, l);
  if (!f.ok) return !1;
  const p = e.md.normalizeLink(f.str);
  if (!e.md.validateLink(p)) return !1;
  i = f.pos;
  const d = i, g = l, _ = s;
  for (; i < l; ) {
    const N = o.charCodeAt(i);
    if (N === 10) {
      const L = Fr(e, s);
      if (L < 0) break;
      i = L, l = Tn(e, s++);
    } else if (we(N)) i++;
    else break;
  }
  const E = i;
  let T = e.md.helpers.parseLinkTitle(o, i, l);
  for (; T.can_continue; ) {
    const N = Fr(e, s);
    if (N < 0) break;
    i = N, l = Tn(e, s++), T = e.md.helpers.parseLinkTitle(o, i, l, T);
  }
  let A;
  for (E !== d && T.ok ? (A = T.str, i = T.pos) : (A = "", i = d, l = g, s = _); i < l && we(o.charCodeAt(i)); )
    i++;
  if (i < l && o.charCodeAt(i) !== 10 && A)
    for (A = "", i = d, l = g, s = _; i < l && we(o.charCodeAt(i)); )
      i++;
  if (i < l && o.charCodeAt(i) !== 10) return !1;
  const w = mo(a);
  if (!w) return !1;
  if (r) return !0;
  typeof e.env.references > "u" && (e.env.references = {}), typeof e.env.references[w] > "u" && (e.env.references[w] = {
    title: A,
    href: p
  });
  const C = e.push("reference_definition", "", 0);
  C.map = [t, s], C.hidden = !0;
  const b = /* @__PURE__ */ Object.create(null);
  return b.label = w, C.meta = b, e.line = s, !0;
}
var Nh = [
  "address",
  "article",
  "aside",
  "base",
  "basefont",
  "blockquote",
  "body",
  "caption",
  "center",
  "col",
  "colgroup",
  "dd",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "frame",
  "frameset",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "head",
  "header",
  "hr",
  "html",
  "iframe",
  "legend",
  "li",
  "link",
  "main",
  "menu",
  "menuitem",
  "nav",
  "noframes",
  "ol",
  "optgroup",
  "option",
  "p",
  "param",
  "search",
  "section",
  "summary",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "title",
  "tr",
  "track",
  "ul"
], Fh = `<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^"'=<>\`\\x00-\\x20]+|'[^']*'|"[^"]*"))?)*\\s*\\/?>`, Sh = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>", Wa = new RegExp(`^(?:${Fh}|${Sh})`), nn = [
  [
    /^<(script|pre|style|textarea)(?=(\s|>|$))/i,
    /<\/(script|pre|style|textarea)>/i,
    !0
  ],
  [
    /^<!--/,
    /-->/,
    !0
  ],
  [
    /^<\?/,
    /\?>/,
    !0
  ],
  [
    /^<![A-Za-z]/,
    />/,
    !0
  ],
  [
    /^<!\[CDATA\[/,
    /\]\]>/,
    !0
  ],
  [
    new RegExp(`^</?(${Nh.join("|")})(?=(\\s|/?>|$))`, "i"),
    /^$/,
    !0
  ],
  [
    new RegExp(`${Wa.source}\\s*$`),
    /^$/,
    !1
  ]
];
function Oh(e, t, n, r) {
  let o = e.bMarks[t] + e.tShift[t], i = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4 || !e.md.options.html || e.src.charCodeAt(o) !== 60) return !1;
  let s = e.src.slice(o, i), l = 0;
  for (; l < nn.length && !nn[l][0].test(s); l++) ;
  if (l === nn.length) return !1;
  if (r) return nn[l][2];
  let a = t + 1;
  const c = nn[l][1].test("");
  if (!nn[l][1].test(s)) {
    for (; a < n && !(e.sCount[a] < e.blkIndent && (c || !e.isEmpty(a))); a++)
      if (o = e.bMarks[a] + e.tShift[a], i = e.eMarks[a], s = e.src.slice(o, i), nn[l][1].test(s)) {
        s.length !== 0 && a++;
        break;
      }
  }
  e.line = a;
  const u = e.push("html_block", "", 0);
  return u.map = [t, a], u.content = e.getLines(t, a, e.blkIndent, !0), !0;
}
function Th(e, t, n, r) {
  let o = e.bMarks[t] + e.tShift[t], i = e.eMarks[t];
  if (e.sCount[t] - e.blkIndent >= 4) return !1;
  let s = e.src.charCodeAt(o);
  if (s !== 35 || o >= i) return !1;
  let l = 1;
  for (s = e.src.charCodeAt(++o); s === 35 && o < i && l <= 6; )
    l++, s = e.src.charCodeAt(++o);
  if (l > 6 || o < i && !we(s)) return !1;
  if (r) return !0;
  i = e.skipSpacesBack(i, o);
  const a = e.skipCharsBack(i, 35, o);
  a > o && we(e.src.charCodeAt(a - 1)) && (i = a), e.line = t + 1;
  const c = e.push("heading_open", `h${l}`, 1);
  c.markup = "########".slice(0, l), c.map = [t, e.line];
  const u = e.push("inline", "", 0);
  u.content = _o(e.src.slice(o, i)), u.map = [t, e.line], u.children = [];
  const f = e.push("heading_close", `h${l}`, -1);
  return f.markup = "########".slice(0, l), !0;
}
function Ih(e, t, n) {
  const r = e.md.block.ruler.getRules("paragraph");
  if (e.sCount[t] - e.blkIndent >= 4) return !1;
  const o = e.parentType;
  e.parentType = "paragraph";
  let i = 0, s, l = t + 1;
  for (; l < n && !e.isEmpty(l); l++) {
    if (e.sCount[l] - e.blkIndent > 3) continue;
    if (e.sCount[l] >= e.blkIndent) {
      let d = e.bMarks[l] + e.tShift[l];
      const g = e.eMarks[l];
      if (d < g && (s = e.src.charCodeAt(d), (s === 45 || s === 61) && (d = e.skipChars(d, s), d = e.skipSpaces(d), d >= g))) {
        i = s === 61 ? 1 : 2;
        break;
      }
    }
    if (e.sCount[l] < 0) continue;
    let p = !1;
    for (let d = 0, g = r.length; d < g; d++) if (r[d](e, l, n, !0)) {
      p = !0;
      break;
    }
    if (p) break;
  }
  if (!i)
    return e.parentType = o, !1;
  const a = _o(e.getLines(t, l, e.blkIndent, !1));
  e.line = l + 1;
  const c = e.push("heading_open", `h${i}`, 1);
  c.markup = String.fromCharCode(s), c.map = [t, e.line];
  const u = e.push("inline", "", 0);
  u.content = a, u.map = [t, e.line - 1], u.children = [];
  const f = e.push("heading_close", `h${i}`, -1);
  return f.markup = String.fromCharCode(s), e.parentType = o, !0;
}
function jh(e, t, n) {
  const r = e.md.block.ruler.getRules("paragraph"), o = e.parentType;
  let i = t + 1;
  for (e.parentType = "paragraph"; i < n && !e.isEmpty(i); i++) {
    if (e.sCount[i] - e.blkIndent > 3 || e.sCount[i] < 0) continue;
    let c = !1;
    for (let u = 0, f = r.length; u < f; u++) if (r[u](e, i, n, !0)) {
      c = !0;
      break;
    }
    if (c) break;
  }
  const s = _o(e.getLines(t, i, e.blkIndent, !1));
  e.line = i;
  const l = e.push("paragraph_open", "p", 1);
  l.map = [t, e.line];
  const a = e.push("inline", "", 0);
  return a.content = s, a.map = [t, e.line], a.children = [], e.push("paragraph_close", "p", -1), e.parentType = o, !0;
}
var Sr = [
  [
    "table",
    xh,
    ["paragraph", "reference"]
  ],
  ["code", yh],
  [
    "fence",
    wh,
    [
      "paragraph",
      "reference",
      "blockquote",
      "list"
    ]
  ],
  [
    "blockquote",
    Eh,
    [
      "paragraph",
      "reference",
      "blockquote",
      "list"
    ]
  ],
  [
    "hr",
    kh,
    [
      "paragraph",
      "reference",
      "blockquote",
      "list"
    ]
  ],
  [
    "list",
    Dh,
    [
      "paragraph",
      "reference",
      "blockquote"
    ]
  ],
  ["reference", Ah],
  [
    "html_block",
    Oh,
    [
      "paragraph",
      "reference",
      "blockquote"
    ]
  ],
  [
    "heading",
    Th,
    [
      "paragraph",
      "reference",
      "blockquote"
    ]
  ],
  ["lheading", Ih],
  ["paragraph", jh]
], Ha = class {
  constructor() {
    K(
      this,
      /**
      * {@link Ruler} instance. Keep configuration of block rules.
      */
      "ruler",
      new lr()
    ), K(this, "State", Ua);
    for (let e = 0; e < Sr.length; e++) this.ruler.push(Sr[e][0], Sr[e][1], { alt: (Sr[e][2] || []).slice() });
  }
  tokenize(e, t, n) {
    const r = this.ruler.getRules(""), o = r.length, i = e.md.options.maxNesting;
    let s = t, l = !1;
    for (; s < n && (e.line = s = e.skipEmptyLines(s), !(s >= n || e.sCount[s] < e.blkIndent)); ) {
      if (e.level >= i) {
        e.line = n;
        break;
      }
      const a = e.line;
      let c = !1;
      for (let u = 0; u < o; u++)
        if (c = r[u](e, s, n, !1), c) {
          if (a >= e.line) throw new Error("block rule didn't increment state.line");
          break;
        }
      if (!c) throw new Error("none of the block rules matched");
      e.tight = !l, e.isEmpty(e.line - 1) && (l = !0), s = e.line, s < n && e.isEmpty(s) && (l = !0, s++, e.line = s);
    }
  }
  /**
  * Process input string and push block tokens into `outTokens`
  */
  parse(e, t, n, r) {
    if (!e) return;
    const o = new this.State(e, t, n, r);
    this.tokenize(o, o.line, o.lineMax);
  }
}, qa = class {
  constructor(e, t, n, r) {
    K(this, "pos", 0), K(this, "level", 0), K(this, "pending", ""), K(this, "pendingLevel", 0), K(this, "cache", {}), K(this, "backticks", {}), K(this, "backticksScanned", !1), K(this, "skipHtmlSpecial", !1), K(this, "linkLevel", 0), K(this, "delimiters", []), K(this, "_prev_delimiters", []), K(this, "Token", hn), this.src = e, this.env = n, this.md = t, this.tokens = r, this.tokens_meta = Array(r.length), this.posMax = this.src.length;
  }
  pushPending() {
    const e = new hn("text", "", 0);
    return e.content = this.pending, e.level = this.pendingLevel, this.tokens.push(e), this.pending = "", e;
  }
  push(e, t, n) {
    this.pending && this.pushPending();
    const r = new hn(e, t, n);
    let o;
    return n < 0 && (this.level--, this.delimiters = this._prev_delimiters.pop()), r.level = this.level, n > 0 && (this.level++, this._prev_delimiters.push(this.delimiters), this.delimiters = [], o = { delimiters: this.delimiters }), this.pendingLevel = this.level, this.tokens.push(r), this.tokens_meta.push(o), r;
  }
  scanDelims(e, t) {
    const n = this.posMax, r = this.src.charCodeAt(e);
    let o;
    if (e === 0) o = 32;
    else if (e === 1)
      o = this.src.charCodeAt(0), (o & 63488) === 55296 && (o = 65533);
    else if (o = this.src.charCodeAt(e - 1), (o & 64512) === 56320) {
      const g = this.src.charCodeAt(e - 2);
      o = (g & 64512) === 55296 ? 65536 + (g - 55296 << 10) + (o - 56320) : 65533;
    } else (o & 64512) === 55296 && (o = 65533);
    let i = e;
    for (; i < n && this.src.charCodeAt(i) === r; ) i++;
    const s = i - e;
    let l = i < n ? this.src.charCodeAt(i) : 32;
    if ((l & 64512) === 55296) {
      const g = this.src.charCodeAt(i + 1);
      l = (g & 64512) === 56320 ? 65536 + (l - 55296 << 10) + (g - 56320) : 65533;
    } else (l & 64512) === 56320 && (l = 65533);
    const a = ir(o) || or(o), c = ir(l) || or(l), u = rr(o), f = rr(l), p = !f && (!c || u || a), d = !u && (!a || f || c);
    return {
      can_open: p && (t || !d || a),
      can_close: d && (t || !p || c),
      length: s
    };
  }
};
function Mh(e) {
  switch (e) {
    case 10:
    case 33:
    case 35:
    case 36:
    case 37:
    case 38:
    case 42:
    case 43:
    case 45:
    case 58:
    case 60:
    case 61:
    case 62:
    case 64:
    case 91:
    case 92:
    case 93:
    case 94:
    case 95:
    case 96:
    case 123:
    case 125:
    case 126:
      return !0;
    default:
      return !1;
  }
}
function Vh(e, t) {
  let n = e.pos;
  for (; n < e.posMax && !Mh(e.src.charCodeAt(n)); ) n++;
  return n === e.pos ? !1 : (t || (e.pending += e.src.slice(e.pos, n)), e.pos = n, !0);
}
function Ph(e) {
  return e >= 65 && e <= 90 || e >= 97 && e <= 122;
}
function Bh(e) {
  return e >= 65 && e <= 90 || e >= 97 && e <= 122 || e >= 48 && e <= 57 || e === 43 || e === 45 || e === 46;
}
function $h(e, t) {
  if (!e.md.options.linkify || e.linkLevel > 0) return !1;
  const n = e.pos, r = e.posMax;
  if (n + 3 > r || e.src.charCodeAt(n) !== 58 || e.src.charCodeAt(n + 1) !== 47 || e.src.charCodeAt(n + 2) !== 47) return !1;
  const o = n - Math.min(10, e.pending.length, n);
  let i = n;
  for (; i > o && Bh(e.src.charCodeAt(i - 1)); ) i--;
  if (i === n || !Ph(e.src.charCodeAt(i))) return !1;
  const s = n - i, l = e.md.linkify.matchAtStart(e.src.slice(i));
  if (!l) return !1;
  let a = l.url;
  if (a.length <= s) return !1;
  let c = a.length;
  for (; c > 0 && a.charCodeAt(c - 1) === 42; ) c--;
  c !== a.length && (a = a.slice(0, c));
  const u = e.md.normalizeLink(a);
  if (!e.md.validateLink(u)) return !1;
  if (!t) {
    e.pending = e.pending.slice(0, -s);
    const f = e.push("link_open", "a", 1);
    f.attrs = [["href", u]], f.markup = "linkify", f.info = "auto";
    const p = e.push("text", "", 0);
    p.content = e.md.normalizeLinkText(a);
    const d = e.push("link_close", "a", -1);
    d.markup = "linkify", d.info = "auto";
  }
  return e.pos += a.length - s, !0;
}
function zh(e, t) {
  let n = e.pos;
  if (e.src.charCodeAt(n) !== 10) return !1;
  const r = e.pending.length - 1, o = e.posMax;
  if (!t)
    if (r >= 0 && e.pending.charCodeAt(r) === 32)
      if (r >= 1 && e.pending.charCodeAt(r - 1) === 32) {
        let i = r - 1;
        for (; i >= 1 && e.pending.charCodeAt(i - 1) === 32; ) i--;
        e.pending = e.pending.slice(0, i), e.push("hardbreak", "br", 0);
      } else
        e.pending = e.pending.slice(0, -1), e.push("softbreak", "br", 0);
    else e.push("softbreak", "br", 0);
  for (n++; n < o && we(e.src.charCodeAt(n)); ) n++;
  return e.pos = n, !0;
}
var Si = [];
for (let e = 0; e < 256; e++) Si.push(0);
"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e) {
  Si[e.charCodeAt(0)] = 1;
});
function Lh(e, t) {
  let n = e.pos;
  const r = e.posMax;
  if (e.src.charCodeAt(n) !== 92 || (n++, n >= r)) return !1;
  let o = e.src.charCodeAt(n);
  if (o === 10) {
    for (t || e.push("hardbreak", "br", 0), n++; n < r && (o = e.src.charCodeAt(n), !!we(o)); )
      n++;
    return e.pos = n, !0;
  }
  if (o === 32) {
    if (!t) {
      const l = e.push("text_special", "", 0);
      l.content = "\\", l.markup = "\\", l.info = "escape";
    }
    return e.pos = n, !0;
  }
  let i = e.src[n];
  if (o >= 55296 && o <= 56319 && n + 1 < r) {
    const l = e.src.charCodeAt(n + 1);
    l >= 56320 && l <= 57343 && (i += e.src[n + 1], n++);
  }
  const s = "\\" + i;
  if (!t) {
    const l = e.push("text_special", "", 0);
    o < 256 && Si[o] !== 0 ? l.content = i : l.content = s, l.markup = s, l.info = "escape";
  }
  return e.pos = n + 1, !0;
}
function Jh(e) {
  const t = {};
  let n = 0;
  for (; (n = e.indexOf("`", n)) !== -1; ) {
    const r = n;
    for (; e.charCodeAt(++n) === 96; ) ;
    t[n - r] = r;
  }
  return t;
}
function Uh(e, t) {
  var n;
  const r = e.pos;
  if (e.src.charCodeAt(r) !== 96) return !1;
  const o = e.posMax;
  let i = r + 1;
  for (; i < o && e.src.charCodeAt(i) === 96; ) i++;
  const s = e.src.slice(r, i), l = s.length;
  if (e.backticksScanned || (e.backticks = Jh(e.src), e.backticksScanned = !0), ((n = e.backticks[l]) !== null && n !== void 0 ? n : -1) >= i) {
    let a = i, c;
    for (; (c = e.src.indexOf("`", a)) !== -1 && c < o; ) {
      for (a = c + 1; e.src.charCodeAt(a) === 96; ) a++;
      if (a > o) break;
      if (a - c === l) {
        if (!t) {
          const u = e.push("code_inline", "code", 0);
          u.markup = s;
          let f = e.src.slice(i, c).replace(/\n/g, " ");
          f.startsWith(" ") && f.endsWith(" ") && /[^ ]/.test(f) && (f = f.slice(1, -1)), u.content = f;
        }
        return e.pos = a, !0;
      }
    }
  }
  return t || (e.pending += s), e.pos = i, !0;
}
function Wh(e, t) {
  const n = e.pos, r = e.src.charCodeAt(n);
  if (t || r !== 126) return !1;
  const o = e.scanDelims(e.pos, !0);
  let i = o.length;
  const s = String.fromCharCode(r);
  if (i < 2) return !1;
  let l;
  i % 2 && (l = e.push("text", "", 0), l.content = s, i--);
  for (let a = 0; a < i; a += 2)
    l = e.push("text", "", 0), l.content = s + s, e.delimiters.push({
      marker: r,
      length: 0,
      token: e.tokens.length - 1,
      end: -1,
      open: o.can_open,
      close: o.can_close
    });
  return e.pos += o.length, !0;
}
function Ys(e, t) {
  let n;
  const r = [], o = t.length;
  for (let i = 0; i < o; i++) {
    const s = t[i];
    if (s.marker !== 126 || s.end === -1) continue;
    const l = t[s.end];
    n = e.tokens[s.token], n.type = "s_open", n.tag = "s", n.nesting = 1, n.markup = "~~", n.content = "", n = e.tokens[l.token], n.type = "s_close", n.tag = "s", n.nesting = -1, n.markup = "~~", n.content = "", e.tokens[l.token - 1].type === "text" && e.tokens[l.token - 1].content === "~" && r.push(l.token - 1);
  }
  for (; r.length; ) {
    const i = r.pop();
    let s = i + 1;
    for (; s < e.tokens.length && e.tokens[s].type === "s_close"; ) s++;
    s--, i !== s && (n = e.tokens[s], e.tokens[s] = e.tokens[i], e.tokens[i] = n);
  }
}
function Hh(e) {
  const t = e.tokens_meta, n = e.tokens_meta.length;
  Ys(e, e.delimiters);
  for (let o = 0; o < n; o++) {
    var r;
    const i = (r = t[o]) === null || r === void 0 ? void 0 : r.delimiters;
    i && Ys(e, i);
  }
}
var Ka = {
  tokenize: Wh,
  postProcess: Hh
};
function qh(e, t) {
  const n = e.pos, r = e.src.charCodeAt(n);
  if (t || r !== 95 && r !== 42) return !1;
  const o = e.scanDelims(e.pos, r === 42);
  for (let i = 0; i < o.length; i++) {
    const s = e.push("text", "", 0);
    s.content = String.fromCharCode(r), e.delimiters.push({
      marker: r,
      length: o.length,
      token: e.tokens.length - 1,
      end: -1,
      open: o.can_open,
      close: o.can_close
    });
  }
  return e.pos += o.length, !0;
}
function Gs(e, t) {
  const n = t.length;
  for (let r = n - 1; r >= 0; r--) {
    const o = t[r];
    if (o.marker !== 95 && o.marker !== 42 || o.end === -1) continue;
    const i = t[o.end], s = r > 0 && t[r - 1].end === o.end + 1 && t[r - 1].marker === o.marker && t[r - 1].token === o.token - 1 && t[o.end + 1].token === i.token + 1, l = String.fromCharCode(o.marker), a = e.tokens[o.token];
    a.type = s ? "strong_open" : "em_open", a.tag = s ? "strong" : "em", a.nesting = 1, a.markup = s ? l + l : l, a.content = "";
    const c = e.tokens[i.token];
    c.type = s ? "strong_close" : "em_close", c.tag = s ? "strong" : "em", c.nesting = -1, c.markup = s ? l + l : l, c.content = "", s && (e.tokens[t[r - 1].token].content = "", e.tokens[t[o.end + 1].token].content = "", r--);
  }
}
function Kh(e) {
  const t = e.tokens_meta, n = e.tokens_meta.length;
  Gs(e, e.delimiters);
  for (let o = 0; o < n; o++) {
    var r;
    const i = (r = t[o]) === null || r === void 0 ? void 0 : r.delimiters;
    i && Gs(e, i);
  }
}
var Za = {
  tokenize: qh,
  postProcess: Kh
};
function Zh(e, t) {
  let n, r, o, i, s = "", l = "", a = e.pos, c = !0;
  if (e.src.charCodeAt(e.pos) !== 91) return !1;
  const u = e.pos, f = e.posMax, p = e.pos + 1, d = e.md.helpers.parseLinkLabel(e, e.pos, !0);
  if (d < 0) return !1;
  let g = d + 1;
  if (g < f && e.src.charCodeAt(g) === 40) {
    for (c = !1, g++; g < f && (n = e.src.charCodeAt(g), !(!we(n) && n !== 10)); g++)
      ;
    if (g >= f) return !1;
    if (a = g, o = e.md.helpers.parseLinkDestination(e.src, g, e.posMax), o.ok) {
      for (s = e.md.normalizeLink(o.str), e.md.validateLink(s) ? g = o.pos : s = "", a = g; g < f && (n = e.src.charCodeAt(g), !(!we(n) && n !== 10)); g++)
        ;
      if (o = e.md.helpers.parseLinkTitle(e.src, g, e.posMax), g < f && a !== g && o.ok)
        for (l = o.str, g = o.pos; g < f && (n = e.src.charCodeAt(g), !(!we(n) && n !== 10)); g++)
          ;
    }
    (g >= f || e.src.charCodeAt(g) !== 41) && (c = !0), g++;
  }
  if (c) {
    if (typeof e.env.references > "u") return !1;
    if (g < f && e.src.charCodeAt(g) === 91 ? (a = g + 1, g = e.md.helpers.parseLinkLabel(e, g), g >= 0 ? r = e.src.slice(a, g++) : g = d + 1) : g = d + 1, r || (r = e.src.slice(p, d)), r = mo(r), i = e.env.references[r], !i)
      return e.pos = u, !1;
    s = i.href, l = i.title;
  }
  if (!t) {
    e.pos = p, e.posMax = d;
    const _ = e.push("link_open", "a", 1), E = [["href", s]];
    if (_.attrs = E, l && E.push(["title", l]), r) {
      const T = /* @__PURE__ */ Object.create(null);
      T.label = r, _.meta = T;
    }
    e.linkLevel++, e.md.inline.tokenize(e), e.linkLevel--, e.push("link_close", "a", -1);
  }
  return e.pos = g, e.posMax = f, !0;
}
function Xh(e, t) {
  let n, r, o, i, s, l, a, c, u = "";
  const f = e.pos, p = e.posMax;
  if (e.src.charCodeAt(e.pos) !== 33 || e.src.charCodeAt(e.pos + 1) !== 91) return !1;
  const d = e.pos + 2, g = e.md.helpers.parseLinkLabel(e, e.pos + 1, !1);
  if (g < 0) return !1;
  if (i = g + 1, i < p && e.src.charCodeAt(i) === 40) {
    for (i++; i < p && (n = e.src.charCodeAt(i), !(!we(n) && n !== 10)); i++)
      ;
    if (i >= p) return !1;
    for (c = i, l = e.md.helpers.parseLinkDestination(e.src, i, e.posMax), l.ok && (u = e.md.normalizeLink(l.str), e.md.validateLink(u) ? i = l.pos : u = ""), c = i; i < p && (n = e.src.charCodeAt(i), !(!we(n) && n !== 10)); i++)
      ;
    if (l = e.md.helpers.parseLinkTitle(e.src, i, e.posMax), i < p && c !== i && l.ok)
      for (a = l.str, i = l.pos; i < p && (n = e.src.charCodeAt(i), !(!we(n) && n !== 10)); i++)
        ;
    else a = "";
    if (i >= p || e.src.charCodeAt(i) !== 41)
      return e.pos = f, !1;
    i++;
  } else {
    if (typeof e.env.references > "u") return !1;
    if (i < p && e.src.charCodeAt(i) === 91 ? (c = i + 1, i = e.md.helpers.parseLinkLabel(e, i), i >= 0 ? o = e.src.slice(c, i++) : i = g + 1) : i = g + 1, o || (o = e.src.slice(d, g)), o = mo(o), s = e.env.references[o], !s)
      return e.pos = f, !1;
    u = s.href, a = s.title;
  }
  if (!t) {
    r = e.src.slice(d, g);
    const _ = [];
    e.md.inline.parse(r, e.md, e.env, _);
    const E = e.push("image", "img", 0), T = [["src", u], ["alt", ""]];
    if (E.attrs = T, E.children = _, E.content = r, a && T.push(["title", a]), o) {
      const A = /* @__PURE__ */ Object.create(null);
      A.label = o, E.meta = A;
    }
  }
  return e.pos = i, e.posMax = p, !0;
}
var Yh = /^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/, Gh = /^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;
function Qh(e, t) {
  let n = e.pos;
  if (e.src.charCodeAt(n) !== 60) return !1;
  const r = e.pos, o = e.posMax;
  for (; ; ) {
    if (++n >= o) return !1;
    const s = e.src.charCodeAt(n);
    if (s === 60) return !1;
    if (s === 62) break;
  }
  const i = e.src.slice(r + 1, n);
  if (Gh.test(i)) {
    const s = e.md.normalizeLink(i);
    if (!e.md.validateLink(s)) return !1;
    if (!t) {
      const l = e.push("link_open", "a", 1);
      l.attrs = [["href", s]], l.markup = "autolink", l.info = "auto";
      const a = e.push("text", "", 0);
      a.content = e.md.normalizeLinkText(i);
      const c = e.push("link_close", "a", -1);
      c.markup = "autolink", c.info = "auto";
    }
    return e.pos += i.length + 2, !0;
  }
  if (Yh.test(i)) {
    const s = e.md.normalizeLink(`mailto:${i}`);
    if (!e.md.validateLink(s)) return !1;
    if (!t) {
      const l = e.push("link_open", "a", 1);
      l.attrs = [["href", s]], l.markup = "autolink", l.info = "auto";
      const a = e.push("text", "", 0);
      a.content = e.md.normalizeLinkText(i);
      const c = e.push("link_close", "a", -1);
      c.markup = "autolink", c.info = "auto";
    }
    return e.pos += i.length + 2, !0;
  }
  return !1;
}
function eg(e) {
  return /^<a[>\s]/i.test(e);
}
function tg(e) {
  return /^<\/a\s*>/i.test(e);
}
function Xa(e) {
  const t = e | 32;
  return t >= 97 && t <= 122;
}
function ng(e, t) {
  const n = e.src;
  let r, o;
  if (n.startsWith("<!--", t)) {
    if (n.startsWith(">", t + 4)) return t + 5;
    if (n.startsWith("->", t + 4)) return t + 6;
    r = t + 4, o = "-->";
  } else if (n.startsWith("<![CDATA[", t))
    r = t + 9, o = "]]>";
  else if (n.charCodeAt(t + 1) === 63)
    r = t + 2, o = "?>";
  else if (Xa(n.charCodeAt(t + 2)))
    r = t + 3, o = ">";
  else return -1;
  if (e.skipHtmlSpecial) return -1;
  const i = n.indexOf(o, r);
  return i < 0 ? (e.skipHtmlSpecial = !0, -1) : i + o.length;
}
function rg(e, t) {
  if (!e.md.options.html) return !1;
  const n = e.posMax, r = e.pos;
  if (e.src.charCodeAt(r) !== 60 || r + 2 >= n) return !1;
  let o;
  const i = e.src.charCodeAt(r + 1);
  if (i === 33 || i === 63) o = ng(e, r);
  else if (i === 47 || Xa(i)) {
    const s = e.src.slice(r).match(Wa);
    o = s ? r + s[0].length : -1;
  } else return !1;
  if (o < 0) return !1;
  if (!t) {
    const s = e.push("html_inline", "", 0);
    s.content = e.src.slice(r, o), eg(s.content) && e.linkLevel++, tg(s.content) && e.linkLevel--;
  }
  return e.pos = o, !0;
}
var og = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i, ig = /^&([a-z][a-z0-9]{1,31});/i;
function sg(e, t) {
  const n = e.pos, r = e.posMax;
  if (e.src.charCodeAt(n) !== 38 || n + 1 >= r) return !1;
  if (e.src.charCodeAt(n + 1) === 35) {
    const o = e.src.slice(n).match(og);
    if (o) {
      if (!t) {
        const i = o[1][0].toLowerCase() === "x" ? parseInt(o[1].slice(1), 16) : parseInt(o[1], 10), s = e.push("text_special", "", 0);
        s.content = Fi(i) ? nr(i) : nr(65533), s.markup = o[0], s.info = "entity";
      }
      return e.pos += o[0].length, !0;
    }
  } else {
    const o = e.src.slice(n).match(ig);
    if (o) {
      const i = Ra(o[0]);
      if (i !== o[0]) {
        if (!t) {
          const s = e.push("text_special", "", 0);
          s.content = i, s.markup = o[0], s.info = "entity";
        }
        return e.pos += o[0].length, !0;
      }
    }
  }
  return !1;
}
function Qs(e) {
  const t = {}, n = e.length;
  if (!n) return;
  let r = 0, o = -2;
  const i = [];
  for (let s = 0; s < n; s++) {
    const l = e[s];
    if (i.push(0), (e[r].marker !== l.marker || o !== l.token - 1) && (r = s), o = l.token, l.length = l.length || 0, !l.close) continue;
    t.hasOwnProperty(l.marker) || (t[l.marker] = [
      -1,
      -1,
      -1,
      -1,
      -1,
      -1
    ]);
    const a = t[l.marker][(l.open ? 3 : 0) + l.length % 3];
    let c = r - i[r] - 1, u = c;
    for (; c > a; c -= i[c] + 1) {
      const f = e[c];
      if (f.marker === l.marker && f.open && f.end < 0) {
        let p = !1;
        if ((f.close || l.open) && (f.length + l.length) % 3 === 0 && (f.length % 3 !== 0 || l.length % 3 !== 0) && (p = !0), !p) {
          const d = c > 0 && !e[c - 1].open ? i[c - 1] + 1 : 0;
          i[s] = s - c + d, i[c] = d, l.open = !1, f.end = s, f.close = !1, u = -1, o = -2;
          break;
        }
      }
    }
    u !== -1 && (t[l.marker][(l.open ? 3 : 0) + (l.length || 0) % 3] = u);
  }
}
function lg(e) {
  const t = e.tokens_meta, n = e.tokens_meta.length;
  Qs(e.delimiters);
  for (let o = 0; o < n; o++) {
    var r;
    const i = (r = t[o]) === null || r === void 0 ? void 0 : r.delimiters;
    i && Qs(i);
  }
}
function ag(e) {
  let t, n, r = 0;
  const o = e.tokens, i = e.tokens.length;
  for (t = n = 0; t < i; t++)
    o[t].nesting < 0 && r--, o[t].level = r, o[t].nesting > 0 && r++, o[t].type === "text" && t + 1 < i && o[t + 1].type === "text" ? o[t + 1].content = o[t].content + o[t + 1].content : (t !== n && (o[n] = o[t]), n++);
  t !== n && (o.length = n);
}
var Po = [
  ["text", Vh],
  ["linkify", $h],
  ["newline", zh],
  ["escape", Lh],
  ["backticks", Uh],
  ["strikethrough", Ka.tokenize],
  ["emphasis", Za.tokenize],
  ["link", Zh],
  ["image", Xh],
  ["autolink", Qh],
  ["html_inline", rg],
  ["entity", sg]
], Bo = [
  ["balance_pairs", lg],
  ["strikethrough", Ka.postProcess],
  ["emphasis", Za.postProcess],
  ["fragments_join", ag]
], Ya = class {
  constructor() {
    K(
      this,
      /**
      * {@link Ruler} instance. Keep configuration of inline rules.
      */
      "ruler",
      new lr()
    ), K(
      this,
      /**
      * {@link Ruler} instance. Second ruler used for post-processing
      * (e.g. in emphasis-like rules).
      */
      "ruler2",
      new lr()
    ), K(this, "State", qa);
    for (let e = 0; e < Po.length; e++) this.ruler.push(Po[e][0], Po[e][1]);
    for (let e = 0; e < Bo.length; e++) this.ruler2.push(Bo[e][0], Bo[e][1]);
  }
  skipToken(e) {
    const t = e.pos, n = this.ruler.getRules(""), r = n.length, o = e.md.options.maxNesting, i = e.cache;
    if (typeof i[t] < "u") {
      e.pos = i[t];
      return;
    }
    let s = !1;
    if (e.level < o) {
      for (let l = 0; l < r; l++)
        if (e.level++, s = n[l](e, !0), e.level--, s) {
          if (t >= e.pos) throw new Error("inline rule didn't increment state.pos");
          break;
        }
    } else e.pos = e.posMax;
    s || e.pos++, i[t] = e.pos;
  }
  tokenize(e) {
    const t = this.ruler.getRules(""), n = t.length, r = e.posMax, o = e.md.options.maxNesting;
    for (; e.pos < r; ) {
      const i = e.pos;
      let s = !1;
      if (e.level < o) {
        for (let l = 0; l < n; l++)
          if (s = t[l](e, !1), s) {
            if (i >= e.pos) throw new Error("inline rule didn't increment state.pos");
            break;
          }
      }
      if (s) {
        if (e.pos >= r) break;
        continue;
      }
      e.pending += e.src[e.pos++];
    }
    e.pending && e.pushPending();
  }
  /**
  * Process input string and push inline tokens into `outTokens`
  */
  parse(e, t, n, r) {
    const o = new this.State(e, t, n, r);
    this.tokenize(o);
    const i = this.ruler2.getRules(""), s = i.length;
    for (let l = 0; l < s; l++) i[l](o);
  }
}, cg = {
  default: {
    options: {
      html: !1,
      xhtmlOut: !1,
      breaks: !1,
      langPrefix: "language-",
      linkify: !1,
      typographer: !1,
      quotes: "“”‘’",
      highlight: null,
      maxNesting: 100
    },
    components: {
      core: {},
      block: {},
      inline: {}
    }
  },
  zero: {
    options: {
      html: !1,
      xhtmlOut: !1,
      breaks: !1,
      langPrefix: "language-",
      linkify: !1,
      typographer: !1,
      quotes: "“”‘’",
      highlight: null,
      maxNesting: 20
    },
    components: {
      core: { rules: [
        "normalize",
        "block",
        "strip_references",
        "inline",
        "text_join"
      ] },
      block: { rules: ["paragraph"] },
      inline: {
        rules: ["text"],
        rules2: ["balance_pairs", "fragments_join"]
      }
    }
  },
  commonmark: {
    options: {
      html: !0,
      xhtmlOut: !0,
      breaks: !1,
      langPrefix: "language-",
      linkify: !1,
      typographer: !1,
      quotes: "“”‘’",
      highlight: null,
      maxNesting: 20
    },
    components: {
      core: { rules: [
        "normalize",
        "block",
        "strip_references",
        "inline",
        "text_join"
      ] },
      block: { rules: [
        "blockquote",
        "code",
        "fence",
        "heading",
        "hr",
        "html_block",
        "lheading",
        "list",
        "reference",
        "paragraph"
      ] },
      inline: {
        rules: [
          "autolink",
          "backticks",
          "emphasis",
          "entity",
          "escape",
          "html_inline",
          "image",
          "link",
          "newline",
          "text"
        ],
        rules2: [
          "balance_pairs",
          "emphasis",
          "fragments_join"
        ]
      }
    }
  }
}, ug = /^(vbscript|javascript|file|data):/, fg = /^data:image\/(gif|png|jpeg|webp);/, el = [
  "http:",
  "https:",
  "mailto:"
], Nt = class {
  /**
  * Link validation function. CommonMark allows too much in links. By default
  * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
  * except some embedded image types.
  *
  * You can change this behaviour:
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * const md = new MarkdownIt()
  *
  * // enable everything
  * md.validateLink = function () { return true; }
  * ```
  */
  validateLink(e) {
    const t = e.trim().toLowerCase();
    return ug.test(t) ? fg.test(t) : !0;
  }
  /**
  * Function used to encode link url to a machine-readable format,
  * which includes url-encoding, punycode, etc.
  */
  normalizeLink(e) {
    const t = oi(e, !0);
    if (t.hostname && (!t.protocol || el.indexOf(t.protocol) >= 0))
      try {
        t.hostname = Ls.toASCII(t.hostname);
      } catch {
      }
    return t.auth && (t.auth = Vt(t.auth)), t.hostname && (t.hostname = Vt(t.hostname)), t.pathname && (t.pathname = Vt(t.pathname)), t.search && (t.search = Vt(t.search)), t.hash && (t.hash = Vt(t.hash)), ri(t);
  }
  /**
  * Function used to decode link url to a human-readable format`
  */
  normalizeLinkText(e) {
    const t = oi(e, !0);
    if (t.hostname && (!t.protocol || el.indexOf(t.protocol) >= 0))
      try {
        t.hostname = Ls.toUnicode(t.hostname);
      } catch {
      }
    return Dn(ri(t), Dn.defaultChars + "%");
  }
  constructor(...e) {
    K(
      this,
      /**
      * Instance of {@link ParserInline}. You may need it to add new rules when
      * writing plugins. For simple rules control use {@link MarkdownIt.disable}
      * and {@link MarkdownIt.enable}.
      */
      "inline",
      new Ya()
    ), K(
      this,
      /**
      * Instance of {@link ParserBlock}. You may need it to add new rules when
      * writing plugins. For simple rules control use {@link MarkdownIt.disable}
      * and {@link MarkdownIt.enable}.
      */
      "block",
      new Ha()
    ), K(
      this,
      /**
      * Instance of {@link ParserCore} chain executor. You may need it to add new
      * rules when writing plugins. For simple rules control use
      * {@link MarkdownIt.disable} and {@link MarkdownIt.enable}.
      */
      "core",
      new Ja()
    ), K(
      this,
      /**
      * Instance of {@link Renderer}. Use it to modify output look. Or to add rendering
      * rules for new token types, generated by plugins.
      *
      * See {@link Renderer} docs and
      * [source code](https://github.com/markdown-it/markdown-it/blob/master/src/renderer.ts).
      *
      * @example
      * ```javascript
      * import MarkdownIt from 'markdown-it'
      * const md = new MarkdownIt()
      *
      * function myToken(tokens, idx, options, env, self) {
      *   //...
      *   return result;
      * };
      *
      * md.renderer.rules['my_token'] = myToken
      * ```
      */
      "renderer",
      new $a()
    ), K(
      this,
      /**
      * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
      * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/src/rules_core/linkify.ts)
      * rule.
      */
      "linkify",
      new vp()
    ), K(
      this,
      /**
      * Assorted utility functions, useful to write plugins. See details
      * [here](https://github.com/markdown-it/markdown-it/blob/master/src/common/utils.ts).
      */
      "utils",
      Sp
    ), K(
      this,
      /**
      * Link components parser functions, useful to write plugins. See details
      * [here](https://github.com/markdown-it/markdown-it/blob/master/src/helpers).
      */
      "helpers",
      Object.assign({}, qp)
    );
    const [t, n] = e;
    typeof t == "string" ? (this.configure(t), n && this.set(n)) : (this.configure("default"), this.set(t || {}));
  }
  /**
  * Set parser options (in the same format as in constructor). Probably, you
  * will never need it, but you can change options after constructor call.
  *
  * __Note:__ To achieve the best possible performance, don't modify a
  * `markdown-it` instance options on the fly. If you need multiple configurations
  * it's best to create multiple instances and initialize each with separate
  * config.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  *
  * const md = new MarkdownIt()
  *   .set({ html: true, breaks: true })
  *   .set({ typographer: true })
  * ```
  */
  set(e) {
    return Object.assign(this.options, e), this;
  }
  /**
  * Batch load of all options and compenent settings. This is internal method,
  * and you probably will not need it. But if you will - see available presets
  * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/src/presets)
  *
  * We strongly recommend to use presets instead of direct config loads. That
  * will give better compatibility with next versions.
  */
  configure(e) {
    let t;
    if (typeof e == "string") {
      const o = e;
      if (t = cg[o], !t) throw new Error(`Wrong 'markdown-it' preset "${o}", check name`);
    } else t = e;
    if (!t) throw new Error("Wrong `markdown-it` preset, can't be empty");
    t.options && (this.options = { ...t.options });
    const n = t.components;
    if (n) {
      var r;
      [
        "core",
        "block",
        "inline"
      ].forEach((i) => {
        var s;
        const l = (s = n[i]) === null || s === void 0 ? void 0 : s.rules;
        l && this[i].ruler.enableOnly(l);
      });
      const o = (r = n.inline) === null || r === void 0 ? void 0 : r.rules2;
      o && this.inline.ruler2.enableOnly(o);
    }
    return this;
  }
  /**
  * Enable list or rules. It will automatically find appropriate components,
  * containing rules with given names. If rule not found, and `ignoreInvalid`
  * not set - throws exception.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  *
  * const md = new MarkdownIt()
  *   .enable(['sub', 'sup'])
  *   .disable('smartquotes')
  * ```
  */
  enable(e, t = !1) {
    let n = [];
    Array.isArray(e) || (e = [e]), [
      "core",
      "block",
      "inline"
    ].forEach((o) => {
      n = n.concat(this[o].ruler.enable(e, !0));
    }), n = n.concat(this.inline.ruler2.enable(e, !0));
    const r = e.filter((o) => n.indexOf(o) < 0);
    if (r.length && !t) throw new Error(`MarkdownIt. Failed to enable unknown rule(s): ${r}`);
    return this;
  }
  /**
  * The same as {@link MarkdownIt.enable}, but turn specified rules off.
  */
  disable(e, t = !1) {
    let n = [];
    Array.isArray(e) || (e = [e]), [
      "core",
      "block",
      "inline"
    ].forEach((o) => {
      n = n.concat(this[o].ruler.disable(e, !0));
    }), n = n.concat(this.inline.ruler2.disable(e, !0));
    const r = e.filter((o) => n.indexOf(o) < 0);
    if (r.length && !t) throw new Error(`MarkdownIt. Failed to disable unknown rule(s): ${r}`);
    return this;
  }
  /**
  * Load specified plugin with given params into current parser instance.
  * It's just a sugar to call `plugin(md, params)` with curring.
  *
  * @example
  * ```javascript
  * import MarkdownIt from 'markdown-it'
  * import iterator from 'markdown-it-for-inline'
  *
  * const md = new MarkdownIt()
  *   .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
  *     tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar')
  *   })
  * ```
  */
  use(e, ...t) {
    return e.apply(e, [this, ...t]), this;
  }
  /**
  * Parse input string and return list of block tokens (special token type
  * "inline" will contain list of inline tokens). You should not call this
  * method directly, until you write custom renderer (for example, to produce
  * AST).
  *
  * `env` is used to pass data between "distributed" rules and return additional
  * metadata like reference info, needed for the renderer. It also can be used to
  * inject data in specific cases. Usually, you will be ok to pass `{}`,
  * and then pass updated object to renderer.
  */
  parse(e, t) {
    if (typeof e != "string") throw new Error("Input data should be a String");
    const n = new this.core.State(e, this, t);
    return this.core.process(n), n.tokens;
  }
  /**
  * Render markdown string into html. It does all magic for you :).
  *
  * `env` can be used to inject additional metadata (`{}` by default).
  * But you will not need it with high probability. See also comment
  * in {@link MarkdownIt.parse}.
  */
  render(e, t = {}) {
    return this.renderer.render(this.parse(e, t), this.options, t);
  }
  /**
  * The same as {@link MarkdownIt.parse} but skip all block rules. It returns
  * the block tokens list with the single `inline` element, containing parsed
  * inline tokens in `children` property. Also updates `env` object.
  */
  parseInline(e, t) {
    const n = new this.core.State(e, this, t);
    return n.inlineMode = !0, this.core.process(n), n.tokens;
  }
  /**
  * Similar to {@link MarkdownIt.render} but for single paragraph content.
  * Result will NOT be wrapped into `<p>` tags.
  */
  renderInline(e, t = {}) {
    return this.renderer.render(this.parseInline(e, t), this.options, t);
  }
};
K(Nt, "Token", hn);
K(Nt, "Ruler", lr);
K(Nt, "Renderer", $a);
K(Nt, "ParserCore", Ja);
K(Nt, "StateCore", za);
K(Nt, "ParserBlock", Ha);
K(Nt, "StateBlock", Ua);
K(Nt, "ParserInline", Ya);
K(Nt, "StateInline", qa);
var dg = Va(Nt);
const Oi = new dg({
  html: !1,
  // Disallow raw HTML for XSS safety
  linkify: !0,
  breaks: !0,
  typographer: !0
}), pg = Oi.renderer.rules.link_open || function(e, t, n, r, o) {
  return o.renderToken(e, t, n);
};
Oi.renderer.rules.link_open = function(e, t, n, r, o) {
  const i = e[t];
  return i.attrSet("target", "_blank"), i.attrSet("rel", "noopener noreferrer"), pg(e, t, n, r, o);
};
function hg(e) {
  if (!e || typeof e != "string") return "";
  try {
    return Oi.render(e);
  } catch (t) {
    return console.error("[Markdown Render Error]", t), e;
  }
}
const gg = {
  key: 1,
  class: "fiona-panel",
  role: "complementary",
  "aria-label": "Fiona AI Assistant"
}, mg = { class: "panel-header" }, _g = { class: "header-info" }, bg = { class: "header-titles" }, vg = { class: "model-picker-bar" }, xg = ["disabled"], yg = {
  key: 0,
  value: ""
}, wg = ["value", "disabled"], Eg = {
  key: 0,
  class: "model-badge"
}, kg = { class: "sidebar-header" }, Cg = { class: "sidebar-header-actions" }, Dg = {
  key: 0,
  class: "sidebar-loading"
}, Rg = {
  key: 1,
  class: "sidebar-empty"
}, Ag = {
  key: 2,
  class: "conversations-list"
}, Ng = ["onClick"], Fg = { class: "conv-title" }, Sg = { class: "conv-date" }, Og = { class: "drawer-header" }, Tg = { class: "drawer-title-group" }, Ig = { class: "drawer-eyebrow" }, jg = { class: "stage-tabs-nav" }, Mg = {
  key: 0,
  class: "stage-body scope-view"
}, Vg = { class: "scope-metrics" }, Pg = { class: "metric-card" }, Bg = { class: "metric-num" }, $g = { class: "metric-card" }, zg = { class: "metric-num" }, Lg = {
  key: 0,
  class: "metric-card is-alert"
}, Jg = { class: "metric-num" }, Ug = { class: "scope-groups-list" }, Wg = { class: "scope-group-header" }, Hg = { class: "category-pill" }, qg = {
  key: 0,
  class: "scope-summary"
}, Kg = {
  key: 1,
  class: "clarification-box"
}, Zg = { class: "clar-content" }, Xg = { class: "clar-actions" }, Yg = ["onClick"], Gg = ["onClick"], Qg = {
  key: 1,
  class: "stage-body grouping-view"
}, em = { class: "grouping-list" }, tm = {
  key: 0,
  class: "grouping-desc"
}, nm = {
  key: 1,
  class: "kpi-tag"
}, rm = {
  key: 2,
  class: "stage-body preview-view"
}, om = {
  key: 0,
  class: "jd-document"
}, im = { class: "jd-header" }, sm = { key: 0 }, lm = { class: "jd-section" }, am = { class: "jd-section" }, cm = { class: "accountability-list" }, um = { key: 0 }, fm = {
  key: 1,
  class: "acc-kpi"
}, dm = {
  key: 0,
  class: "jd-section"
}, pm = {
  key: 1,
  class: "jd-section"
}, hm = {
  key: 1,
  class: "stage-empty"
}, gm = {
  key: 0,
  class: "empty-state"
}, mm = { class: "suggestion-chips" }, _m = { class: "message-bubble" }, bm = ["open"], vm = { class: "thinking-summary" }, xm = {
  key: 0,
  class: "pulse-dot"
}, ym = { class: "thinking-content" }, wm = ["open"], Em = { class: "activities-summary" }, km = { class: "activity-list" }, Cm = { class: "act-icon" }, Dm = { class: "act-body" }, Rm = { key: 0 }, Am = {
  key: 0,
  class: "act-duration"
}, Nm = ["innerHTML"], Fm = {
  key: 2,
  class: "fiona-artifact-card"
}, Sm = { class: "card-top" }, Om = { class: "card-job-title" }, Tm = {
  key: 0,
  class: "card-summary"
}, Im = { class: "card-footer" }, jm = {
  key: 0,
  class: "card-rev"
}, Mm = ["onClick"], Vm = {
  key: 3,
  class: "citations-container"
}, Pm = { class: "citations-list" }, Bm = ["title"], $m = { class: "bubble-footer" }, zm = ["onClick"], Lm = { class: "message-time" }, Jm = {
  key: 1,
  class: "streaming-indicator"
}, Um = { class: "composer-area" }, Wm = {
  key: 0,
  class: "mentions-dropdown",
  role: "listbox"
}, Hm = { class: "mentions-header" }, qm = {
  key: 0,
  class: "spinner-small"
}, Km = {
  key: 0,
  class: "mentions-empty"
}, Zm = {
  key: 1,
  class: "mentions-list"
}, Xm = ["onMousedown"], Ym = { class: "mention-badge" }, Gm = { class: "mention-info" }, Qm = { class: "mention-label" }, e0 = {
  key: 0,
  class: "mention-sub"
}, t0 = ["disabled"], n0 = ["disabled"], r0 = /* @__PURE__ */ $l({
  __name: "FionaAiAssistant.ce",
  props: {
    apiUrl: { default: "http://localhost:5095", type: String },
    authToken: { default: "", type: String },
    theme: { default: "light", type: String },
    initialOpen: { type: Boolean, default: !1 },
    pageContextJson: { default: "{}", type: String }
  },
  emits: ["fiona:open", "fiona:close", "fiona:navigate", "fiona:jd-applied"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = /* @__PURE__ */ me(n.initialOpen), i = /* @__PURE__ */ me(!1), s = /* @__PURE__ */ me(!1), l = /* @__PURE__ */ me(""), a = /* @__PURE__ */ me([]), c = /* @__PURE__ */ me([]), u = /* @__PURE__ */ me(""), f = /* @__PURE__ */ me(!1), p = /* @__PURE__ */ me(null), d = /* @__PURE__ */ me(null), g = /* @__PURE__ */ me(null), _ = /* @__PURE__ */ me(null), { y: E } = Id(_, { behavior: "smooth" }), { copy: T } = /* @__PURE__ */ Td(), A = qe(() => {
      try {
        return JSON.parse(n.pageContextJson || "{}");
      } catch {
        return {};
      }
    }), w = qe(() => {
      var z;
      return ((z = A.value) == null ? void 0 : z.draftRasciId) || "master";
    }), {
      conversations: C,
      activeConversationId: b,
      isLoading: N,
      loadConversations: L,
      selectConversation: Q,
      createNewConversation: j
    } = Vd({
      baseUrl: n.apiUrl,
      token: () => n.authToken
    }), {
      isOpen: H,
      triggerChar: v,
      query: x,
      items: q,
      selectedIndex: te,
      isLoading: J,
      handleInputChange: ce,
      applyMentionSelection: ie,
      handleKeydown: oe,
      closeMentions: ke
    } = Pd({
      baseUrl: n.apiUrl,
      token: () => n.authToken,
      draftRasciId: () => w.value
    }), {
      activeArtifact: se,
      isDrawerOpen: Ye,
      activeStage: Ge,
      openArtifact: ut,
      closeArtifact: Ft,
      setStage: _n,
      updateScopeDecision: _r,
      buildRevisionPrompt: Xt
    } = Bd(), bn = qe(() => {
      var z;
      return (((z = se.value) == null ? void 0 : z.scopeGroups) || []).filter((F) => F.category === "main").length;
    }), br = qe(() => {
      var z;
      return (((z = se.value) == null ? void 0 : z.scopeGroups) || []).filter((F) => F.category === "generic").length;
    }), Lt = qe(() => {
      var z;
      return (((z = se.value) == null ? void 0 : z.scopeGroups) || []).filter((F) => F.category === "clarification").length;
    }), {
      isStreaming: Yt,
      currentThought: h,
      sendStreamingMessage: m,
      abortStream: y
    } = Md({
      baseUrl: n.apiUrl,
      token: () => n.authToken,
      onThoughtDelta: (z) => {
        d.value && (d.value.thought = (d.value.thought || "") + z), Me();
      },
      onTextDelta: (z) => {
        d.value && (d.value.markdown = (d.value.markdown || "") + z), Me();
      },
      onActivity: (z) => {
        if (d.value) {
          const F = d.value.activities || [], be = F.findIndex((De) => De.id === z.id);
          be >= 0 ? F[be] = { ...F[be], ...z } : F.push(z), d.value.activities = [...F];
        }
        Me();
      },
      onFinished: (z) => {
        d.value && (d.value.markdown = z.markdown || d.value.markdown, d.value.artifact = z.artifact || d.value.artifact, z.citations && (d.value.citations = z.citations)), z.conversationId && (b.value = z.conversationId), p.value = null, d.value = null, s.value = !1;
      },
      onError: (z) => {
        console.error("[Fiona Stream Error]", z), d.value && !d.value.markdown && (d.value.markdown = "⚠️ Fiona mengalami kendala saat memproses permintaan."), p.value = null, d.value = null, s.value = !1;
      }
    }), I = qe(() => {
      var z;
      return ((z = A.value) == null ? void 0 : z.sourceLabel) || "Asisten Matriks RASCI";
    }), D = qe(() => {
      var z;
      return (z = c.value.find((F) => F.key === u.value)) == null ? void 0 : z.capabilities;
    });
    function S() {
      o.value = !o.value, o.value ? (r("fiona:open"), c.value.length === 0 && Ce()) : r("fiona:close");
    }
    function $() {
      i.value = !i.value, i.value && C.value.length === 0 && L();
    }
    async function M(z) {
      i.value = !1;
      const F = await Q(z);
      a.value = F.map((be) => ({
        ...be,
        thought: void 0,
        activities: [],
        artifact: be.artifact || null
      })), await Mt(), Me();
    }
    function V(z) {
      ut(z);
    }
    function O(z) {
      switch (z) {
        case "scope_review":
          return "Cakupan (Scope)";
        case "grouping_review":
          return "Pengelompokan (Grouping)";
        case "preview":
          return "Pratinjau JD (Preview)";
        default:
          return "Uraian Jabatan";
      }
    }
    function X(z) {
      switch (z) {
        case "ready":
          return "Siap Ditinjau";
        case "revised":
          return "Telah Direvisi";
        case "stale":
          return "Perlu Update";
        case "approved":
          return "Disetujui";
        default:
          return "Draf";
      }
    }
    function B() {
      if (!se.value) return;
      const z = se.value.preview;
      if (z) {
        const F = `URAIAN JABATAN: ${z.jobTitle}
Tujuan Jabatan:
${z.jobPurpose}

Akuntabilitas Utama:
${z.accountabilities.map((be, De) => `${De + 1}. ${be.title}
${be.activities.map((R) => `  - ${R}`).join(`
`)}`).join(`
`)}`;
        T(F);
      } else
        T(JSON.stringify(se.value, null, 2));
    }
    function Y() {
      if (!se.value) return;
      const z = prompt("Masukkan catatan revisi yang Anda inginkan:");
      if (z && z.trim()) {
        const F = Xt(z);
        l.value = F, Ft(), Mt(() => {
          var be;
          (be = g.value) == null || be.focus();
        });
      }
    }
    function ne() {
      se.value && (se.value.status = "approved", r("fiona:jd-applied", {
        artifactId: se.value.artifactId,
        jobTitle: se.value.jobTitle,
        revision: se.value.revision
      }), Ft());
    }
    function ue(z) {
      const F = z.target, be = F.selectionStart || F.value.length;
      ce(F.value, be);
    }
    function he(z) {
      if (H.value) {
        if (z.key === "Enter" && q.value.length > 0) {
          const be = q.value[te.value];
          if (be) {
            z.preventDefault(), fe(be);
            return;
          }
        }
        if (oe(z)) return;
      }
      z.key === "Enter" && !z.shiftKey && (z.preventDefault(), Se());
    }
    function fe(z) {
      var R;
      if (!v.value) return;
      const F = ((R = g.value) == null ? void 0 : R.selectionStart) || l.value.length, { newText: be, newCursor: De } = ie(
        l.value,
        F,
        v.value,
        z
      );
      l.value = be, Mt(() => {
        g.value && (g.value.focus(), g.value.setSelectionRange(De, De));
      });
    }
    async function Ce() {
      var z, F;
      f.value = !0;
      try {
        const be = n.apiUrl.replace(/\/+$/, ""), De = await fetch(`${be}/api/agent/models`, {
          headers: n.authToken ? { Authorization: `Bearer ${n.authToken}` } : {}
        });
        if (De && De.ok) {
          const R = await De.json();
          c.value = R.models || [], u.value = R.defaultModelKey || ((F = (z = R.models) == null ? void 0 : z[0]) == null ? void 0 : F.key) || "";
        }
      } catch (be) {
        console.error("[Fiona AI WC] Failed to load models:", be);
      } finally {
        f.value = !1;
      }
    }
    function Fe(z) {
      T(z);
    }
    function He(z) {
      try {
        return new Date(z).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } catch {
        return "";
      }
    }
    function Qe() {
      j(), a.value = [], l.value = "", i.value = !1, ke();
    }
    function et(z) {
      l.value = z, Se();
    }
    function vr() {
      y(), p.value = null, d.value = null, s.value = !1;
    }
    async function Se() {
      const z = l.value.trim();
      if (!z || s.value) return;
      const F = {
        id: `msg_${Date.now()}`,
        role: "user",
        markdown: z,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      a.value.push(F), l.value = "", s.value = !0, ke();
      const be = `asst_${Date.now()}`, De = {
        id: be,
        role: "assistant",
        markdown: "",
        thought: "",
        activities: [],
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      a.value.push(De), p.value = be, d.value = De, await Mt(), Me();
      try {
        await m({
          message: z,
          conversationId: b.value || null,
          modelKey: u.value || null,
          context: A.value
        });
      } catch (R) {
        if (R instanceof Error && R.message.includes("Stream cancelled by user"))
          return;
        console.warn("[Fiona AI WC] Streaming failed, trying non-streaming chat fallback:", R);
        try {
          const ve = n.apiUrl.replace(/\/+$/, ""), Jt = await fetch(`${ve}/api/agent/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...n.authToken ? { Authorization: `Bearer ${n.authToken}` } : {}
            },
            body: JSON.stringify({
              message: z,
              conversationId: b.value || null,
              modelKey: u.value || null,
              context: A.value
            })
          });
          if (Jt && Jt.ok) {
            const Gt = await Jt.json();
            De.markdown = Gt.markdown || "Tidak ada tanggapan.", De.artifact = Gt.artifact || null, De.citations = Gt.citations, Gt.conversationId && (b.value = Gt.conversationId);
          } else
            De.markdown = "⚠️ Fiona mengalami kendala saat memproses permintaan Anda.";
        } catch {
          De.markdown = "⚠️ Gagal terhubung ke layanan Fiona AI.";
        }
      } finally {
        s.value = !1, p.value = null, d.value = null, await Mt(), Me();
      }
    }
    function Me() {
      _.value && (E.value = _.value.scrollHeight);
    }
    return uo(() => {
      o.value && Ce();
    }), (z, F) => {
      var be, De;
      return U(), W("div", {
        class: Be(["fiona-wc-host", { "is-dark": e.theme === "dark" }])
      }, [
        o.value ? de("", !0) : (U(), W("button", {
          key: 0,
          type: "button",
          class: "fiona-launcher",
          "aria-label": "Open Fiona AI Assistant",
          title: "Ask Fiona",
          onClick: S
        }, [...F[14] || (F[14] = [
          k("svg", {
            class: "launcher-icon",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2"
          }, [
            k("path", { d: "M12 2a10 10 0 1 0 10 10H12V2z" }),
            k("path", {
              d: "M12 2a10 10 0 0 1 10 10h-10V2z",
              opacity: "0.5"
            }),
            k("circle", {
              cx: "12",
              cy: "12",
              r: "3"
            })
          ], -1),
          k("span", null, "Ask Fiona", -1)
        ])])),
        o.value ? (U(), W("aside", gg, [
          k("header", mg, [
            k("div", _g, [
              k("button", {
                type: "button",
                class: "icon-button",
                title: "Riwayat Percakapan",
                "aria-label": "Riwayat Percakapan",
                onClick: $
              }, " ☰ "),
              k("div", bg, [
                F[15] || (F[15] = k("strong", null, "Fiona AI", -1)),
                k("small", null, re(I.value), 1)
              ])
            ]),
            k("div", { class: "header-actions" }, [
              k("button", {
                type: "button",
                class: "icon-button",
                title: "Obrolan Baru",
                "aria-label": "Obrolan Baru",
                onClick: Qe
              }, " ＋ "),
              k("button", {
                type: "button",
                class: "icon-button",
                title: "Tutup",
                "aria-label": "Tutup",
                onClick: S
              }, " × ")
            ])
          ]),
          k("div", vg, [
            F[16] || (F[16] = k("label", { for: "fionaModelSelect" }, "Model", -1)),
            Ui(k("select", {
              id: "fionaModelSelect",
              "onUpdate:modelValue": F[0] || (F[0] = (R) => u.value = R),
              disabled: f.value || s.value
            }, [
              f.value ? (U(), W("option", yg, "Memuat model…")) : de("", !0),
              (U(!0), W(Ee, null, ot(c.value, (R) => (U(), W("option", {
                key: R.key,
                value: R.key,
                disabled: !R.enabled
              }, re(R.displayName) + " " + re(R.enabled ? "" : "(Tidak Tersedia)"), 9, wg))), 128))
            ], 8, xg), [
              [ad, u.value]
            ]),
            D.value ? (U(), W("span", Eg, re(D.value.reasoning ? "🧠 Reasoning" : "⚡ Fast"), 1)) : de("", !0)
          ]),
          i.value ? (U(), W("div", {
            key: 0,
            class: "sidebar-backdrop",
            onClick: F[3] || (F[3] = (R) => i.value = !1)
          }, [
            k("div", {
              class: "conversations-sidebar",
              onClick: F[2] || (F[2] = Cr(() => {
              }, ["stop"]))
            }, [
              k("div", kg, [
                F[17] || (F[17] = k("h4", null, "Riwayat Obrolan", -1)),
                k("div", Cg, [
                  k("button", {
                    type: "button",
                    class: "icon-button",
                    title: "Obrolan Baru",
                    onClick: Qe
                  }, "＋"),
                  k("button", {
                    type: "button",
                    class: "icon-button",
                    title: "Tutup",
                    onClick: F[1] || (F[1] = (R) => i.value = !1)
                  }, "×")
                ])
              ]),
              G(N) ? (U(), W("div", Dg, "Memuat obrolan…")) : G(C).length === 0 ? (U(), W("div", Rg, "Belum ada riwayat percakapan.")) : (U(), W("ul", Ag, [
                (U(!0), W(Ee, null, ot(G(C), (R) => (U(), W("li", {
                  key: R.id,
                  class: Be(["conversation-item", { "is-active": G(b) === R.id }]),
                  onClick: (ve) => M(R.id)
                }, [
                  k("span", Fg, re(R.title || "Percakapan Tanpa Judul"), 1),
                  k("span", Sg, re(He(R.updatedAt)), 1)
                ], 10, Ng))), 128))
              ]))
            ])
          ])) : de("", !0),
          G(Ye) && G(se) ? (U(), W("div", {
            key: 1,
            class: "artifact-drawer-backdrop",
            onClick: F[9] || (F[9] = //@ts-ignore
            (...R) => G(Ft) && G(Ft)(...R))
          }, [
            k("div", {
              class: "artifact-drawer",
              onClick: F[8] || (F[8] = Cr(() => {
              }, ["stop"]))
            }, [
              k("header", Og, [
                k("div", Tg, [
                  k("span", Ig, re(G(se).artifactId) + " · Rev #" + re(G(se).revision), 1),
                  k("h3", null, re(G(se).jobTitle), 1)
                ]),
                k("button", {
                  type: "button",
                  class: "icon-button",
                  title: "Tutup",
                  onClick: F[4] || (F[4] = //@ts-ignore
                  (...R) => G(Ft) && G(Ft)(...R))
                }, "×")
              ]),
              k("nav", jg, [
                k("button", {
                  type: "button",
                  class: Be(["stage-tab-btn", { "is-active": G(Ge) === "scope_review" }]),
                  onClick: F[5] || (F[5] = (R) => G(_n)("scope_review"))
                }, " 1. Cakupan (Scope) ", 2),
                k("button", {
                  type: "button",
                  class: Be(["stage-tab-btn", { "is-active": G(Ge) === "grouping_review" }]),
                  onClick: F[6] || (F[6] = (R) => G(_n)("grouping_review"))
                }, " 2. Pengelompokan ", 2),
                k("button", {
                  type: "button",
                  class: Be(["stage-tab-btn", { "is-active": G(Ge) === "preview" }]),
                  onClick: F[7] || (F[7] = (R) => G(_n)("preview"))
                }, " 3. Pratinjau JD ", 2)
              ]),
              G(Ge) === "scope_review" ? (U(), W("div", Mg, [
                k("div", Vg, [
                  k("div", Pg, [
                    k("span", Bg, re(bn.value), 1),
                    F[18] || (F[18] = k("span", { class: "metric-lbl" }, "Aktivitas Utama", -1))
                  ]),
                  k("div", $g, [
                    k("span", zg, re(br.value), 1),
                    F[19] || (F[19] = k("span", { class: "metric-lbl" }, "Generik", -1))
                  ]),
                  Lt.value > 0 ? (U(), W("div", Lg, [
                    k("span", Jg, re(Lt.value), 1),
                    F[20] || (F[20] = k("span", { class: "metric-lbl" }, "Butuh Klarifikasi", -1))
                  ])) : de("", !0)
                ]),
                k("div", Ug, [
                  (U(!0), W(Ee, null, ot(G(se).scopeGroups || [], (R) => (U(), W("div", {
                    key: R.id,
                    class: Be(["scope-group-card", `category-${R.category}`])
                  }, [
                    k("div", Wg, [
                      k("strong", null, re(R.name), 1),
                      k("span", Hg, re(R.category), 1)
                    ]),
                    R.summary ? (U(), W("p", qg, re(R.summary), 1)) : de("", !0),
                    R.question ? (U(), W("div", Kg, [
                      F[22] || (F[22] = k("span", { class: "clar-icon" }, "❓", -1)),
                      k("div", Zg, [
                        F[21] || (F[21] = k("strong", null, "Pertanyaan Batasan:", -1)),
                        k("p", null, re(R.question), 1),
                        k("div", Xg, [
                          k("button", {
                            type: "button",
                            class: Be(["btn-clar-decision approve", { "is-active": R.decision === "approved" }]),
                            onClick: (ve) => G(_r)(R.id, "approved")
                          }, " ✓ Masukkan ke Cakupan ", 10, Yg),
                          k("button", {
                            type: "button",
                            class: Be(["btn-clar-decision exclude", { "is-active": R.decision === "excluded" }]),
                            onClick: (ve) => G(_r)(R.id, "excluded")
                          }, " ✗ Keluarkan dari Cakupan ", 10, Gg)
                        ])
                      ])
                    ])) : de("", !0)
                  ], 2))), 128))
                ])
              ])) : de("", !0),
              G(Ge) === "grouping_review" ? (U(), W("div", Qg, [
                F[24] || (F[24] = k("p", { class: "stage-intro" }, "Aktivitas hasil peninjauan cakupan dikelompokkan ke dalam Akuntabilitas Utama berikut:", -1)),
                k("div", em, [
                  (U(!0), W(Ee, null, ot(G(se).groupingItems || [], (R) => (U(), W("div", {
                    key: R.id,
                    class: "grouping-card"
                  }, [
                    k("h4", null, re(R.title), 1),
                    R.summary ? (U(), W("p", tm, re(R.summary), 1)) : de("", !0),
                    R.outputKpi ? (U(), W("div", nm, [
                      F[23] || (F[23] = k("strong", null, "Indikator Output (KPI):", -1)),
                      ua(" " + re(R.outputKpi), 1)
                    ])) : de("", !0)
                  ]))), 128))
                ])
              ])) : de("", !0),
              G(Ge) === "preview" ? (U(), W("div", rm, [
                G(se).preview ? (U(), W("article", om, [
                  k("div", im, [
                    F[25] || (F[25] = k("h2", null, "URAIAN JABATAN", -1)),
                    k("h3", null, re(G(se).preview.jobTitle), 1),
                    G(se).preview.unitOrg ? (U(), W("small", sm, re(G(se).preview.unitOrg), 1)) : de("", !0)
                  ]),
                  k("section", lm, [
                    F[26] || (F[26] = k("h4", null, "I. TUJUAN JABATAN", -1)),
                    k("p", null, re(G(se).preview.jobPurpose), 1)
                  ]),
                  k("section", am, [
                    F[27] || (F[27] = k("h4", null, "II. AKUNTABILITAS UTAMA", -1)),
                    k("ol", cm, [
                      (U(!0), W(Ee, null, ot(G(se).preview.accountabilities, (R, ve) => (U(), W("li", { key: ve }, [
                        k("strong", null, re(R.title), 1),
                        R.activities && R.activities.length ? (U(), W("ul", um, [
                          (U(!0), W(Ee, null, ot(R.activities, (Jt, Gt) => (U(), W("li", { key: Gt }, re(Jt), 1))), 128))
                        ])) : de("", !0),
                        R.kpi ? (U(), W("p", fm, [
                          k("em", null, "KPI: " + re(R.kpi), 1)
                        ])) : de("", !0)
                      ]))), 128))
                    ])
                  ]),
                  (be = G(se).preview.authorities) != null && be.length ? (U(), W("section", dm, [
                    F[28] || (F[28] = k("h4", null, "III. WEWENANG", -1)),
                    k("ul", null, [
                      (U(!0), W(Ee, null, ot(G(se).preview.authorities, (R, ve) => (U(), W("li", { key: ve }, re(R), 1))), 128))
                    ])
                  ])) : de("", !0),
                  (De = G(se).preview.qualifications) != null && De.length ? (U(), W("section", pm, [
                    F[29] || (F[29] = k("h4", null, "IV. SPESIFIKASI JABATAN", -1)),
                    k("ul", null, [
                      (U(!0), W(Ee, null, ot(G(se).preview.qualifications, (R, ve) => (U(), W("li", { key: ve }, re(R), 1))), 128))
                    ])
                  ])) : de("", !0)
                ])) : (U(), W("div", hm, "Pratinjau dokumen belum tersedia untuk revisi ini."))
              ])) : de("", !0),
              k("footer", { class: "drawer-footer" }, [
                k("div", { class: "drawer-footer-left" }, [
                  k("button", {
                    type: "button",
                    class: "btn-footer-action",
                    title: "Salin isi dokumen",
                    onClick: B
                  }, " 📋 Salin "),
                  k("button", {
                    type: "button",
                    class: "btn-footer-action",
                    title: "Minta revisi AI",
                    onClick: Y
                  }, " 🔄 Minta Revisi ")
                ]),
                k("div", { class: "drawer-footer-right" }, [
                  k("button", {
                    type: "button",
                    class: "btn-primary",
                    onClick: ne
                  }, " ✅ Terapkan ke Sistem ")
                ])
              ])
            ])
          ])) : de("", !0),
          k("div", {
            class: "messages-container",
            ref_key: "messagesContainer",
            ref: _
          }, [
            a.value.length === 0 ? (U(), W("div", gm, [
              F[30] || (F[30] = k("span", { class: "empty-eyebrow" }, "FIONA AI · ASSISTANT", -1)),
              F[31] || (F[31] = k("h2", null, "Apa yang ingin Anda ketahui?", -1)),
              F[32] || (F[32] = k("p", null, "Ajukan pertanyaan untuk meninjau peran, tanggung jawab, dan matriks proses bisnis.", -1)),
              k("div", mm, [
                k("button", {
                  type: "button",
                  class: "suggestion-chip",
                  onClick: F[10] || (F[10] = (R) => et("Siapa yang bertanggung jawab untuk proses bisnis ini?"))
                }, " Siapa yang bertanggung jawab? "),
                k("button", {
                  type: "button",
                  class: "suggestion-chip",
                  onClick: F[11] || (F[11] = (R) => et("Tampilkan peran RASCI untuk unit yang dipilih."))
                }, " Tampilkan peran RASCI unit ini "),
                k("button", {
                  type: "button",
                  class: "suggestion-chip",
                  onClick: F[12] || (F[12] = (R) => et("Ringkas temuan penting dari RASCI matrix ini."))
                }, " Ringkas temuan penting ")
              ])
            ])) : de("", !0),
            (U(!0), W(Ee, null, ot(a.value, (R) => (U(), W("div", {
              key: R.id,
              class: Be(["message-row", `is-${R.role}`])
            }, [
              k("div", _m, [
                R.thought ? (U(), W("details", {
                  key: 0,
                  class: "thinking-accordion",
                  open: G(Yt) && p.value === R.id
                }, [
                  k("summary", vm, [
                    G(Yt) && p.value === R.id ? (U(), W("span", xm)) : de("", !0),
                    F[33] || (F[33] = k("span", null, "Proses Berpikir", -1))
                  ]),
                  k("div", ym, re(R.thought), 1)
                ], 8, bm)) : de("", !0),
                R.activities && R.activities.length > 0 ? (U(), W("details", {
                  key: 1,
                  class: "activities-accordion",
                  open: G(Yt) && p.value === R.id
                }, [
                  k("summary", Em, [
                    k("span", null, "⚙️ " + re(R.activities.length) + " Aktivitas Alat", 1)
                  ]),
                  k("ul", km, [
                    (U(!0), W(Ee, null, ot(R.activities, (ve) => (U(), W("li", {
                      key: ve.id,
                      class: Be(["activity-item", `status-${ve.status}`])
                    }, [
                      k("span", Cm, re(ve.status === "completed" ? "✓" : ve.status === "failed" ? "✗" : "⏳"), 1),
                      k("div", Dm, [
                        k("strong", null, re(ve.label), 1),
                        ve.summary ? (U(), W("p", Rm, re(ve.summary), 1)) : de("", !0)
                      ]),
                      ve.durationMs ? (U(), W("span", Am, re(ve.durationMs) + "ms", 1)) : de("", !0)
                    ], 2))), 128))
                  ])
                ], 8, wm)) : de("", !0),
                k("div", {
                  class: "message-markdown",
                  innerHTML: G(hg)(R.markdown)
                }, null, 8, Nm),
                R.artifact ? (U(), W("div", Fm, [
                  k("div", Sm, [
                    k("span", {
                      class: Be(["stage-pill", `stage-${R.artifact.stage}`])
                    }, re(O(R.artifact.stage)), 3),
                    k("span", {
                      class: Be(["status-badge", `status-${R.artifact.status}`])
                    }, re(X(R.artifact.status)), 3)
                  ]),
                  k("strong", Om, re(R.artifact.jobTitle || "Uraian Jabatan"), 1),
                  R.artifact.summary ? (U(), W("p", Tm, re(R.artifact.summary), 1)) : de("", !0),
                  k("div", Im, [
                    R.artifact.revision ? (U(), W("span", jm, "Rev #" + re(R.artifact.revision), 1)) : de("", !0),
                    k("button", {
                      type: "button",
                      class: "btn-open-artifact",
                      onClick: (ve) => V(R.artifact)
                    }, " 📄 Buka Dokumen ", 8, Mm)
                  ])
                ])) : de("", !0),
                R.citations && R.citations.length > 0 ? (U(), W("div", Vm, [
                  F[34] || (F[34] = k("span", { class: "citations-label" }, "Referensi:", -1)),
                  k("div", Pm, [
                    (U(!0), W(Ee, null, ot(R.citations, (ve, Jt) => (U(), W("span", {
                      key: Jt,
                      class: "citation-badge",
                      title: `${ve.sourceType}: ${ve.title}`
                    }, " 📄 " + re(ve.title), 9, Bm))), 128))
                  ])
                ])) : de("", !0),
                k("div", $m, [
                  R.role === "assistant" && R.markdown ? (U(), W("button", {
                    key: 0,
                    type: "button",
                    class: "copy-button",
                    title: "Salin Tanggapan",
                    onClick: (ve) => Fe(R.markdown)
                  }, " 📋 Salin ", 8, zm)) : de("", !0),
                  k("span", Lm, re(He(R.createdAt)), 1)
                ])
              ])
            ], 2))), 128)),
            G(Yt) && !d.value ? (U(), W("div", Jm, [
              F[35] || (F[35] = k("span", { class: "spinner" }, null, -1)),
              k("span", null, re(G(h) ? "Sedang menalar…" : "Fiona sedang berpikir…"), 1)
            ])) : de("", !0)
          ], 512),
          k("footer", Um, [
            G(H) ? (U(), W("div", Wm, [
              k("div", Hm, [
                k("span", null, re(G(v) === "@" ? "Pilih Jabatan (@)" : "Pilih Proses Bisnis (#)"), 1),
                G(J) ? (U(), W("span", qm)) : de("", !0)
              ]),
              G(q).length === 0 && !G(J) ? (U(), W("div", Km, ' Tidak ditemukan hasil untuk "' + re(G(x)) + '" ', 1)) : (U(), W("ul", Zm, [
                (U(!0), W(Ee, null, ot(G(q), (R, ve) => (U(), W("li", {
                  key: R.id,
                  class: Be(["mention-item", { "is-selected": G(te) === ve }]),
                  onMousedown: Cr((Jt) => fe(R), ["prevent"])
                }, [
                  k("span", Ym, re(G(v) === "@" ? "👤" : "📑"), 1),
                  k("div", Gm, [
                    k("strong", Qm, re(R.label), 1),
                    R.positionCode || R.index || R.unitName ? (U(), W("small", e0, re(R.positionCode || R.index) + " " + re(R.unitName ? "· " + R.unitName : ""), 1)) : de("", !0)
                  ])
                ], 42, Xm))), 128))
              ]))
            ])) : de("", !0),
            F[36] || (F[36] = k("div", { class: "composer-toolbar" }, [
              k("span", { class: "toolbar-hint" }, "Ketik @ untuk Jabatan, # untuk Proses Bisnis")
            ], -1)),
            k("form", {
              class: "composer-form",
              onSubmit: Cr(Se, ["prevent"])
            }, [
              Ui(k("textarea", {
                ref_key: "textareaRef",
                ref: g,
                "onUpdate:modelValue": F[13] || (F[13] = (R) => l.value = R),
                class: "composer-input",
                placeholder: "Tanyakan seputar matriks RASCI ini… (@ untuk Jabatan, # untuk Proses Bisnis)",
                rows: "1",
                disabled: s.value && !G(Yt),
                onInput: ue,
                onKeydown: he
              }, null, 40, t0), [
                [ld, l.value]
              ]),
              G(Yt) ? (U(), W("button", {
                key: 0,
                type: "button",
                class: "stop-button",
                "aria-label": "Hentikan respons",
                title: "Hentikan respons",
                onClick: vr
              }, " ⏹ Berhenti ")) : (U(), W("button", {
                key: 1,
                type: "submit",
                class: "send-button",
                disabled: !l.value.trim() || s.value,
                "aria-label": "Kirim"
              }, " ➤ ", 8, n0))
            ], 32),
            F[37] || (F[37] = k("small", { class: "disclaimer" }, " Fiona dapat membuat kekeliruan. Harap periksa kembali tindakan yang mengubah data. ", -1))
          ])
        ])) : de("", !0)
      ], 2);
    };
  }
}), o0 = ":host{all:initial;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;color:#1e293b;box-sizing:border-box}*,*:before,*:after{box-sizing:inherit}.fiona-wc-host{position:relative;z-index:9999}.fiona-launcher{position:fixed;bottom:24px;right:24px;display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:linear-gradient(135deg,#1d4ed8,#2563eb);color:#fff;border:none;border-radius:9999px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 4px 14px #2563eb59;transition:transform .15s ease,box-shadow .15s ease}.fiona-launcher:hover{transform:translateY(-2px);box-shadow:0 6px 20px #2563eb73}.launcher-icon{width:18px;height:18px}.fiona-panel{position:fixed;bottom:24px;right:24px;width:440px;max-width:calc(100vw - 32px);height:620px;max-height:calc(100vh - 48px);background:#fff;border-radius:16px;box-shadow:0 12px 36px #0000002e;display:flex;flex-direction:column;overflow:hidden;border:1px solid #e2e8f0}.panel-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#f8fafc;border-bottom:1px solid #e2e8f0}.header-info{display:flex;align-items:center;gap:10px}.header-titles{display:flex;flex-direction:column}.header-titles strong{font-size:15px;color:#0f172a}.header-titles small{font-size:11px;color:#64748b}.header-actions{display:flex;align-items:center;gap:6px}.icon-button{background:none;border:none;font-size:16px;color:#64748b;cursor:pointer;padding:4px 8px;border-radius:6px;transition:background .12s}.icon-button:hover{background:#e2e8f0;color:#0f172a}.model-picker-bar{display:flex;align-items:center;gap:8px;padding:6px 16px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;font-size:12px}.model-picker-bar label{font-weight:600;color:#475569}.model-picker-bar select{flex:1;font-size:12px;padding:3px 6px;border:1px solid #cbd5e1;border-radius:4px;background:#fff;color:#1e293b}.model-badge{padding:2px 6px;background:#e0f2fe;color:#0369a1;border-radius:4px;font-size:10px;font-weight:600}.sidebar-backdrop,.artifact-drawer-backdrop{position:absolute;top:0;left:0;right:0;bottom:0;background:#0f172a66;z-index:100;display:flex}.conversations-sidebar{width:280px;height:100%;background:#fff;box-shadow:4px 0 16px #0000001a;display:flex;flex-direction:column;padding:16px;animation:slideIn .2s ease-out}@keyframes slideIn{0%{transform:translate(-100%)}to{transform:translate(0)}}.sidebar-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;border-bottom:1px solid #e2e8f0;padding-bottom:8px}.sidebar-header h4{margin:0;font-size:14px;color:#0f172a}.conversations-list{list-style:none;margin:0;padding:0;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:6px}.conversation-item{padding:8px 10px;border-radius:8px;border:1px solid transparent;cursor:pointer;display:flex;flex-direction:column;gap:2px;transition:all .12s}.conversation-item:hover{background:#f1f5f9}.conversation-item.is-active{background:#eff6ff;border-color:#bfdbfe}.conv-title{font-size:12px;font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.conv-date{font-size:10px;color:#64748b}.sidebar-empty,.sidebar-loading{font-size:12px;color:#64748b;text-align:center;margin-top:24px}.artifact-drawer{position:absolute;top:12px;left:12px;right:12px;bottom:12px;background:#fff;border-radius:12px;box-shadow:0 16px 36px #00000040;display:flex;flex-direction:column;overflow:hidden;animation:drawerPop .2s ease-out}@keyframes drawerPop{0%{transform:scale(.96);opacity:0}to{transform:scale(1);opacity:1}}.drawer-header{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f8fafc;border-bottom:1px solid #e2e8f0}.drawer-title-group{display:flex;flex-direction:column}.drawer-eyebrow{font-size:10px;color:#64748b;font-family:monospace}.drawer-title-group h3{margin:2px 0 0;font-size:14px;color:#0f172a}.stage-tabs-nav{display:flex;background:#f1f5f9;border-bottom:1px solid #e2e8f0;padding:4px 6px;gap:4px}.stage-tab-btn{flex:1;padding:6px 8px;border-radius:6px;font-size:11px;font-weight:500;border:1px solid transparent;background:transparent;color:#475569;cursor:pointer;transition:all .12s;white-space:nowrap}.stage-tab-btn:hover{background:#e2e8f0}.stage-tab-btn.is-active{background:#fff;border-color:#cbd5e1;color:#1d4ed8;font-weight:600;box-shadow:0 1px 3px #0000000d}.stage-body{flex:1;overflow-y:auto;padding:14px}.stage-intro{font-size:12px;color:#475569;margin:0 0 12px}.stage-empty{text-align:center;font-size:12px;color:#64748b;margin-top:24px}.scope-metrics{display:flex;gap:8px;margin-bottom:12px}.metric-card{flex:1;padding:8px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;text-align:center}.metric-card.is-alert{background:#fef2f2;border-color:#fecaca}.metric-num{display:block;font-size:16px;font-weight:700;color:#0f172a}.is-alert .metric-num{color:#dc2626}.metric-lbl{font-size:10px;color:#64748b}.is-alert .metric-lbl{color:#991b1b}.scope-groups-list{display:flex;flex-direction:column;gap:8px}.scope-group-card{padding:10px;border-radius:8px;border:1px solid #e2e8f0;background:#fff}.scope-group-card.category-clarification{border-color:#fed7aa;background:#fffbeb}.scope-group-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.scope-group-header strong{font-size:12px;color:#0f172a}.category-pill{font-size:9px;padding:2px 6px;border-radius:4px;background:#e2e8f0;color:#475569;text-transform:uppercase;font-weight:600}.category-clarification .category-pill{background:#fef3c7;color:#92400e}.scope-summary{font-size:11px;color:#475569;margin:0}.clarification-box{margin-top:8px;padding:8px;background:#fff;border:1px solid #fde68a;border-radius:6px;display:flex;gap:8px}.clar-icon{font-size:14px}.clar-content{flex:1}.clar-content strong{font-size:11px;color:#92400e}.clar-content p{font-size:11px;color:#1e293b;margin:2px 0 6px}.clar-actions{display:flex;gap:6px}.btn-clar-decision{padding:4px 8px;font-size:10px;font-weight:600;border-radius:4px;cursor:pointer;border:1px solid transparent;transition:all .1s}.btn-clar-decision.approve{background:#f0fdf4;border-color:#bbf7d0;color:#15803d}.btn-clar-decision.approve.is-active{background:#15803d;color:#fff}.btn-clar-decision.exclude{background:#fef2f2;border-color:#fecaca;color:#b91c1c}.btn-clar-decision.exclude.is-active{background:#b91c1c;color:#fff}.grouping-list{display:flex;flex-direction:column;gap:8px}.grouping-card{padding:10px;border-radius:8px;border:1px solid #e2e8f0;background:#fff}.grouping-card h4{margin:0 0 4px;font-size:12px;color:#0f172a}.grouping-desc{font-size:11px;color:#475569;margin:0 0 6px}.kpi-tag{font-size:10px;background:#f1f5f9;padding:4px 6px;border-radius:4px;color:#334155}.jd-document{background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:14px}.jd-header{border-bottom:2px solid #0f172a;padding-bottom:8px;margin-bottom:12px}.jd-header h2{margin:0;font-size:15px;color:#0f172a}.jd-header h3{margin:4px 0 0;font-size:13px;color:#2563eb}.jd-section{margin-bottom:12px}.jd-section h4{margin:0 0 4px;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:.05em}.jd-section p{font-size:12px;color:#1e293b;margin:0;line-height:1.4}.accountability-list,.jd-section ul{margin:4px 0 0;padding-left:18px;font-size:12px}.acc-kpi{font-size:10px;color:#64748b;margin-top:2px}.drawer-footer{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:#f8fafc;border-top:1px solid #e2e8f0}.drawer-footer-left{display:flex;gap:6px}.btn-footer-action{background:#fff;border:1px solid #cbd5e1;border-radius:6px;padding:5px 8px;font-size:11px;color:#334155;cursor:pointer}.btn-footer-action:hover{background:#f1f5f9}.fiona-artifact-card{margin-top:8px;padding:10px 12px;border-radius:8px;background:#fff;border:1px solid #cbd5e1;box-shadow:0 2px 6px #0000000d}.card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:4px}.stage-pill{font-size:10px;font-weight:700;color:#1d4ed8;background:#eff6ff;padding:2px 6px;border-radius:4px}.status-badge{font-size:9px;font-weight:600;padding:2px 6px;border-radius:4px;text-transform:uppercase}.status-ready{background:#dcfce7;color:#15803d}.status-revised{background:#e0f2fe;color:#0369a1}.status-stale{background:#fef3c7;color:#b45309}.status-approved{background:#dcfce7;color:#15803d}.card-job-title{display:block;font-size:13px;color:#0f172a;margin-bottom:2px}.card-summary{font-size:11px;color:#64748b;margin:0 0 8px}.card-footer{display:flex;justify-content:space-between;align-items:center}.card-rev{font-size:10px;color:#94a3b8;font-family:monospace}.btn-open-artifact{background:#2563eb;color:#fff;border:none;border-radius:6px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer;transition:background .12s}.btn-open-artifact:hover{background:#1d4ed8}.messages-container{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px}.empty-state{text-align:center;margin:auto 0;padding:12px}.empty-eyebrow{display:inline-block;font-size:10px;letter-spacing:.08em;font-weight:700;color:#2563eb;margin-bottom:6px}.empty-state h2{margin:0 0 6px;font-size:16px;font-weight:700;color:#0f172a}.empty-state p{margin:0 0 16px;font-size:13px;color:#64748b;line-height:1.4}.suggestion-chips{display:flex;flex-direction:column;gap:8px}.suggestion-chip{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:8px 12px;font-size:12px;color:#334155;cursor:pointer;text-align:left;transition:all .12s}.suggestion-chip:hover{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8}.message-row{display:flex;width:100%}.message-row.is-user{justify-content:flex-end}.message-row.is-assistant{justify-content:flex-start}.message-bubble{max-width:86%;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.45}.is-user .message-bubble{background:#2563eb;color:#fff;border-bottom-right-radius:2px}.is-assistant .message-bubble{background:#f1f5f9;color:#1e293b;border-bottom-left-radius:2px}.thinking-accordion{background:#e2e8f0;border-radius:8px;padding:6px 10px;margin-bottom:8px;font-size:11px}.thinking-summary{font-weight:600;cursor:pointer;color:#475569;display:flex;align-items:center;gap:6px;-webkit-user-select:none;user-select:none}.pulse-dot{width:6px;height:6px;background:#2563eb;border-radius:50%;animation:pulse 1s infinite alternate}@keyframes pulse{0%{opacity:.3;transform:scale(.8)}to{opacity:1;transform:scale(1.2)}}.thinking-content{margin-top:6px;color:#334155;white-space:pre-wrap;font-family:monospace;font-size:10.5px;max-height:120px;overflow-y:auto}.activities-accordion{background:#e0f2fe;border-radius:8px;padding:6px 10px;margin-bottom:8px;font-size:11px}.activities-summary{font-weight:600;cursor:pointer;color:#0369a1;-webkit-user-select:none;user-select:none}.activity-list{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:4px}.activity-item{display:flex;align-items:baseline;gap:6px;padding:4px 6px;border-radius:4px;background:#fff;font-size:11px}.activity-item.status-completed{color:#15803d}.activity-item.status-failed{color:#b91c1c}.act-body{flex:1}.act-body p{margin:2px 0 0;font-size:10px;color:#64748b}.act-duration{font-size:9px;color:#94a3b8}.citations-container{margin-top:8px;padding-top:6px;border-top:1px dashed #cbd5e1;font-size:11px}.citations-label{font-weight:600;color:#475569}.citations-list{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px}.citation-badge{background:#fff;border:1px solid #cbd5e1;border-radius:4px;padding:2px 6px;font-size:10px;color:#334155}.bubble-footer{display:flex;justify-content:space-between;align-items:center;margin-top:6px;font-size:10px}.copy-button{background:none;border:none;font-size:10px;color:#64748b;cursor:pointer;padding:2px 4px;border-radius:4px;transition:all .12s}.copy-button:hover{background:#e2e8f0;color:#0f172a}.message-time{font-size:10px;opacity:.7}.message-markdown p{margin:0 0 6px}.message-markdown p:last-child{margin-bottom:0}.streaming-indicator{display:flex;align-items:center;gap:8px;padding:8px 12px;font-size:12px;color:#64748b;font-style:italic}.spinner{width:12px;height:12px;border:2px solid #cbd5e1;border-top-color:#2563eb;border-radius:50%;animation:spin .8s linear infinite}.spinner-small{width:10px;height:10px;border:1.5px solid #cbd5e1;border-top-color:#2563eb;border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}.mentions-dropdown{position:absolute;bottom:100%;left:16px;right:16px;background:#fff;border-radius:8px;border:1px solid #cbd5e1;box-shadow:0 6px 20px #00000026;max-height:180px;overflow-y:auto;z-index:50;margin-bottom:6px}.mentions-header{display:flex;align-items:center;justify-content:space-between;padding:6px 10px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:11px;font-weight:600;color:#475569}.mentions-list{list-style:none;margin:0;padding:4px 0}.mention-item{display:flex;align-items:center;gap:8px;padding:6px 10px;cursor:pointer;transition:background .1s}.mention-item:hover,.mention-item.is-selected{background:#eff6ff}.mention-badge{font-size:13px}.mention-info{display:flex;flex-direction:column}.mention-label{font-size:12px;color:#0f172a}.mention-sub{font-size:10px;color:#64748b}.mentions-empty{padding:10px;font-size:11px;color:#64748b;text-align:center}.composer-area{position:relative;padding:8px 16px 12px;background:#fff;border-top:1px solid #e2e8f0}.composer-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px}.toolbar-hint{font-size:10px;color:#94a3b8}.composer-form{display:flex;gap:8px;align-items:flex-end}.composer-input{flex:1;padding:8px 12px;border:1px solid #cbd5e1;border-radius:8px;font-size:13px;line-height:1.4;resize:none;font-family:inherit;outline:none;max-height:100px}.composer-input:focus{border-color:#2563eb;box-shadow:0 0 0 2px #2563eb26}.send-button{background:#2563eb;color:#fff;border:none;border-radius:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;transition:background .12s}.send-button:hover:not(:disabled){background:#1d4ed8}.send-button:disabled{background:#cbd5e1;cursor:not-allowed}.stop-button{background:#ef4444;color:#fff;border:none;border-radius:8px;padding:0 10px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:12px;font-weight:600;transition:background .12s;white-space:nowrap}.stop-button:hover{background:#dc2626}.btn-primary{background:#2563eb;color:#fff;border:none;border-radius:6px;padding:6px 12px;font-size:11px;font-weight:600;cursor:pointer;transition:background .12s}.btn-primary:hover{background:#1d4ed8}.disclaimer{display:block;font-size:10px;color:#94a3b8;margin-top:6px;text-align:center}", i0 = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [r, o] of t)
    n[r] = o;
  return n;
}, s0 = /* @__PURE__ */ i0(r0, [["styles", [o0]]]), l0 = /* @__PURE__ */ od(s0);
function a0(e = "fiona-ai-assistant") {
  typeof window < "u" && !customElements.get(e) && customElements.define(e, l0);
}
a0();
export {
  l0 as FionaAiAssistant,
  a0 as registerCustomElement
};
