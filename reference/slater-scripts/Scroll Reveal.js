! function () {
  "use strict";
  if ("undefined" == typeof gsap || "undefined" == typeof ScrollTrigger)
    return void console.warn("[scroll-reveal] GSAP or ScrollTrigger not found.");
  gsap.registerPlugin(ScrollTrigger);
  const { ANIM: t, afterPreloader: e, shuffleArray: a } = window
    .animUtils, r = /^H[1-6]$/;

  function s(t) { return t ? `blur(${t}px)` : "none" }
  const n = [];

  function o(e) {
    (e || document).querySelectorAll("[data-overlay]").forEach(e => {
      if (e.dataset._overlayInit)
        return;
      e.dataset._overlayInit = "true";
      const a = e.getAttribute("data-overlay-start") || t
        .scroll.startEarly,
        r = e.getAttribute("data-overlay-end") || t.scroll.end,
        s = parseFloat(e.getAttribute("data-overlay-duration")) || t.duration.lg,
        n = e.getAttribute("data-overlay-ease") || t.ease.sine,
        o = "true" === e.getAttribute("data-overlay-scrub"),
        l = parseFloat(e.getAttribute("data-overlay-delay")) || 0,
        i = { trigger: e, start: a, end: r };
      o ? (i.scrub = .6, gsap.to(e, { opacity: 0, ease: "none", scrollTrigger: i })) : (i
        .toggleActions = "play none none none", gsap.to(e, {
          opacity: 0,
          duration: s,
          delay: l,
          ease: n,
          scrollTrigger: i
        }))
    })
  }

  function l(e) {
    (e || document).querySelectorAll("[data-svg-reveal]").forEach(e => {
      if (e.dataset
        ._svgRevealInit) return;
      e.dataset._svgRevealInit = "true";
      const r = e.getAttribute("data-svg-start") || t.scroll
        .startEarly,
        n = e.getAttribute("data-svg-end") || t.scroll.end,
        o = parseFloat(e.getAttribute("data-svg-bg-duration")) || t.duration.lg,
        l = e.getAttribute("data-svg-bg-ease") || t.ease.sine,
        i = parseFloat(e.getAttribute("data-svg-path-duration")) || t.duration.sm,
        g = e.getAttribute("data-svg-path-ease") || t.ease.out,
        d = parseFloat(e.getAttribute("data-svg-stagger-each")) || t.stagger.path,
        u = parseFloat(e.getAttribute("data-svg-blur")) || t.blur.md,
        c = e.getAttribute("data-svg-from") || "random",
        p = gsap.utils.toArray(e.querySelectorAll("[data-svg-path]"));
      if (!p.length)
        return;
      const h = a(p);
      gsap.set(h, { opacity: 0, filter: s(u) });
      const y = gsap
        .timeline({
          scrollTrigger: {
            trigger: e,
            start: r,
            end: n,
            toggleActions: "play none none none"
          }
        }),
        b = getComputedStyle(e).backgroundColor;
      y.fromTo(e, { backgroundColor: b }, {
        backgroundColor: "transparent",
        duration: o,
        ease: l
      }), y.to(h, {
        opacity: 1,
        filter: "blur(0px)",
        duration: i,
        ease: g,
        stagger: { each: d, from: c }
      }, `-=${o}`)
    })
  }

  function i(e) {
    (e || document).querySelectorAll("[data-svg-stagger]").forEach(e => {
      if (e.dataset
        ._instantSvgInit) return;
      e.dataset._instantSvgInit = "true";
      const r = e.getAttribute("data-svg-start") || t.scroll
        .startEarly,
        o = parseFloat(e.getAttribute("data-svg-path-duration")) || t.duration.sm,
        l = e.getAttribute("data-svg-path-ease") || t.ease.out,
        i = parseFloat(e.getAttribute("data-svg-stagger-each")) || t.stagger.path,
        g = parseFloat(e.getAttribute("data-svg-blur")) || t.blur.md,
        d = e.getAttribute("data-svg-from") || "random",
        u = e.hasAttribute("data-anim-hero"),
        c = parseFloat(e.getAttribute("data-svg-delay")) || 0,
        p = e.getAttribute("data-svg-trigger"),
        h = p && document.querySelector(p) || e,
        y = gsap.utils.toArray(e.querySelectorAll("[data-svg-path]"));
      if (!y.length)
        return;
      const b = a(y);
      gsap.set(b, { opacity: 0, filter: s(g) });
      const f = {
        opacity: 1,
        filter: "blur(0px)",
        duration: o,
        ease: l,
        delay: c,
        stagger: { each: i, from: d }
      };
      u ? n.push({ targets: b, animProps: f }) : (f.scrollTrigger = {
        trigger: h,
        start: r,
        toggleActions: "play none none none"
      }, gsap.to(b, f))
    })
  }
  const g = document
    .createElement("style");
  g.textContent =
    "[data-svg-stagger] [data-svg-path]{opacity:0;}[data-svg-path][data-glow-active]{--glow-brightness:1;filter:brightness(var(--glow-brightness)) !important;}",
    document.head.appendChild(g);
  const d = 300,
    u = .35,
    c = 2.2,
    p = .14,
    h = .055;
  let y = [],
    b = [],
    f = { x: -9999, y: -9999 },
    m = null,
    A = !1;

  function v() {
    b = y.map(t => {
      const e = t.getBoundingClientRect(),
        a = function (t) {
          let e = getComputedStyle(t).fill || "";
          e && "none" !== e || (e = t.getAttribute("fill") || "");
          const a = e.match(
            /\d+/g);
          if (!a || a.length < 3) return .5;
          const [r, s, n] = a.map(t => {
            const e =
              parseInt(t) / 255;
            return e <= .03928 ? e / 12.92 : Math.pow((e + .055) /
              1.055, 2.4)
          });
          return .2126 * r + .7152 * s + .0722 * n
        }(t),
        r = a > .18 ? u : c;
      return {
        el: t,
        cx: e.left + e.width / 2,
        cy: e.top + e.height / 2,
        brightness: 1,
        peak: r
      }
    })
  }

  function w() {
    const t = d,
      e = t * t;
    let a = !1;
    for (let r = 0; r < b.length; r++) {
      const s = b[r],
        n = f.x - s.cx,
        o = f.y - s.cy,
        l = n * n + o * o;
      let i = 0;
      if (l < e) {
        const e = 1 - Math.sqrt(l) / t;
        i = e * e
      }
      const g = 1 - i * (1 - s.peak),
        d = i > .01 ? p : h;
      s.brightness += (g - s.brightness) * d;
      Math.abs(s.brightness - 1) > .005 ? (a = !0, s.el.hasAttribute("data-glow-active") || s.el
        .setAttribute("data-glow-active", ""), s.el.style.setProperty("--glow-brightness", s
          .brightness.toFixed(3))) : 1 !== s.brightness && (s.brightness = 1, s.el.style
        .removeProperty("--glow-brightness"), s.el.removeAttribute("data-glow-active"))
    }
    m = A ||
      a ? requestAnimationFrame(w) : null
  }

  function x(t) { f.x = t.clientX, f.y = t.clientY, m || (m = requestAnimationFrame(w)) }

  function S() {
    window.locomotiveScroll?.lenisInstance ? window.locomotiveScroll.lenisInstance.on(
      "scroll", v) : setTimeout(S, 100)
  }
  const E = {
    char: {
      stagger: t.stagger.char,
      duration: t
        .duration.sm,
      y: t.y.sm,
      blur: t.blur.sm
    },
    word: {
      stagger: t.stagger.word,
      duration: t
        .duration.md,
      y: t.y.md,
      blur: t.blur.sm
    },
    line: {
      stagger: t.stagger.line,
      duration: t
        .duration.lg,
      y: t.y.lg,
      blur: t.blur.md
    }
  };

  function T(e) {
    e.dataset._originalText ? e.textContent = e.dataset._originalText : e.dataset
      ._originalText = e.textContent;
    const a = (e.getAttribute("data-split") || "word")
      .toLowerCase(),
      r = E[a] || E.word,
      n = parseFloat(e.getAttribute("data-split-stagger")) || r.stagger,
      o = parseFloat(e.getAttribute("data-split-duration")) || r.duration,
      l = e.getAttribute("data-split-ease") || t.ease.out,
      i = null !== e.getAttribute("data-split-y") ? parseFloat(e.getAttribute("data-split-y")) : r
      .y,
      g = null !== e.getAttribute("data-split-blur") ? parseFloat(e.getAttribute(
        "data-split-blur")) : r.blur,
      d = parseFloat(e.getAttribute("data-split-rotation")) || 0,
      u = parseFloat(e.getAttribute("data-split-delay")) || 0;
    let c;
    switch (a) {
    case "char":
      c = function (t) {
        const e = t.textContent;
        t.innerHTML = "";
        const a = document.createElement("span");
        a.style.cssText = "display:inline;overflow:visible;", a.setAttribute("aria-hidden",
          "true"), [...e].forEach(t => {
          if (" " === t) a.appendChild(document.createTextNode(
            " "));
          else {
            const e = document.createElement("span");
            e.style.cssText = "display:inline-block;", e.textContent = t, a.appendChild(
              e)
          }
        });
        const r = document.createElement("span");
        return r.style.cssText =
          "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);", r
          .textContent = e, t.appendChild(r), t.appendChild(a), a.querySelectorAll(
            "span[style]")
      }(e);
      break;
    case "line":
      c = function (t) {
        const e = t.textContent,
          a = e.split(/\s+/).filter(Boolean);
        t.innerHTML = "";
        const r = a.map(e => {
            const a = document.createElement(
              "span");
            return a.style.cssText = "display:inline;white-space:pre;", a.textContent =
              e + " ", t.appendChild(a), a
          }),
          s = [];
        let n = [],
          o = null;
        r.forEach(t => {
            const e = t.offsetTop;
            null !== o && e !== o && (s.push(n), n = []), n.push(t.textContent), o = e
          }), n
          .length && s.push(n), t.innerHTML = "";
        const l = document.createElement("span");
        l.style.cssText = "display:inline;overflow:visible;", l.setAttribute("aria-hidden",
          "true");
        const i = s.map(t => {
            const e = document.createElement("span");
            e.style.cssText = "display:block;overflow:hidden;";
            const a = document
              .createElement("span");
            return a.style.cssText = "display:block;", a.textContent =
              t.join("").trimEnd(), e.appendChild(a), l.appendChild(e), a
          }),
          g = document.createElement("span");
        return g.style.cssText =
          "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);", g
          .textContent = e, t.appendChild(g), t.appendChild(l), i
      }(e);
      break;
    default:
      c = function (t) {
        const e = t.textContent,
          a = e.split(/(\s+)/);
        t.innerHTML = "";
        const r = document.createElement("span");
        r.style.cssText = "display:inline;overflow:visible;", r.setAttribute("aria-hidden",
          "true"), a.forEach(t => {
          if (/^\s+$/.test(t)) r.appendChild(document.createTextNode(
            t));
          else if (t) {
            const e = document.createElement("span");
            e.style.cssText = "display:inline-block;", e.textContent = t, r.appendChild(
              e)
          }
        });
        const s = document.createElement("span");
        return s.style.cssText =
          "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);", s
          .textContent = e, t.appendChild(s), t.appendChild(r), r.querySelectorAll(
            "span[style]")
      }(e)
    }
    return c && c.length ? (gsap.set(c, {
      opacity: 0,
      y: i,
      filter: s(
        g),
      rotation: d
    }), e.style.visibility = "visible", {
      targets: c,
      animProps: {
        opacity: 1,
        y: 0,
        filter: g ? "blur(0px)" : "none",
        rotation: 0,
        duration: o,
        ease: l,
        delay: u,
        stagger: { each: n, from: "start" }
      }
    }) : null
  }

  function C(e) {
    (e || document).querySelectorAll("[data-split]").forEach(e => {
      if (e.dataset._splitInit)
        return;
      if (e.closest("[data-split-wrapper]")) return;
      e.dataset._splitInit = "true";
      const a = T(e);
      if (!a) return;
      const {
        targets: r,
        animProps: s
      } = a, o = e.hasAttribute("data-anim-hero"), l = e.getAttribute(
        "data-split-start") || t.scroll.start, i = parseFloat(e.getAttribute(
        "data-split-offset")) || 0, g = i ? `top+=${i} ${l.split(" ")[1]||"85%"}` : l;
      o ? n.push({ targets: r, animProps: s }) : (s.scrollTrigger = {
        trigger: e,
        start: g,
        toggleActions: "play none none none"
      }, gsap.to(r, s))
    })
  }

  function F(e) {
    (e || document).querySelectorAll("[data-split-wrapper]").forEach(e => {
      if (e.dataset
        ._wrapperInit) return;
      e.dataset._wrapperInit = "true";
      const a = parseFloat(e.getAttribute(
          "data-split-pause")) || .2,
        s = e.getAttribute("data-split-start") || t.scroll.start,
        o = e.hasAttribute("data-anim-hero"),
        l = Array.from(e.querySelectorAll("[data-split]")),
        i = [],
        g = [];
      if (l.forEach(t => {
          if (t.dataset._splitInit) return;
          t.dataset._splitInit = "true";
          const e = T(t);
          if (!e) return;
          const a = {
            el: t,
            ...e
          };
          ! function (t) {
            return r.test(t.tagName) || !!t.closest(
              "h1,h2,h3,h4,h5,h6")
          }(t) ? g.push(a): i.push(a)
        }), !i.length && !g.length)
        return;
      const d = gsap.timeline({
        paused: o,
        ...!o && {
          scrollTrigger: {
            trigger: e,
            start: s,
            toggleActions: "play none none none"
          }
        }
      });
      i.forEach((t, e) => {
        const { targets: a, animProps: r } = t, { delay: s, ...n } = r;
        d.to(a, n, 0 === e ? 0 : `<+=${n.stagger.each||0}`)
      }), g.forEach((t,
        e) => {
        const { targets: r, animProps: s } = t, { delay: n, ...o } = s, l = 0 === e ?
          i.length ? `>+=${a}` : 0 : `<+=${o.stagger.each||0}`;
        d.to(r, o, l)
      }), o && n.push({ tl: d })
    })
  }

  function q(e) {
    (e || document).querySelectorAll("[data-stagger]").forEach(e => {
      if (e.dataset._staggerInit)
        return;
      e.dataset._staggerInit = "true";
      const a = e.getAttribute("data-stagger-start") || t
        .scroll.start,
        r = parseFloat(e.getAttribute("data-stagger-each")) || t.stagger.item,
        o = parseFloat(e.getAttribute("data-stagger-pause")) || .1,
        l = parseFloat(e.getAttribute("data-stagger-duration")) || t.duration.md,
        i = e.getAttribute("data-stagger-ease") || t.ease.out,
        g = parseFloat(e.getAttribute("data-stagger-y")) || t.y.md,
        d = parseFloat(e.getAttribute("data-stagger-blur")) || 0,
        u = e.hasAttribute("data-anim-hero"),
        c = Array.from(e.querySelectorAll("[data-stagger-item]"));
      if (!c.length) return;
      c.forEach(t => {
        const e = t.querySelectorAll("[data-stagger-heading]"),
          a = t.querySelectorAll("[data-stagger-body]"),
          r = e.length || a.length ? [...e, ...a] : [t];
        gsap.set(r, { opacity: 0, y: g, filter: s(d) }), t.style.visibility = "visible"
      });
      if (
        u) {
        const t = gsap.timeline({ paused: !0 });
        c.forEach((e, a) => {
          const s = e.querySelectorAll("[data-stagger-heading]"),
            n = e.querySelectorAll("[data-stagger-body]"),
            g = a * r;
          s.length || n.length ? (s.length && t.to(s, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: l,
              ease: i,
              stagger: .05
            }, g), n.length && t
            .to(n, {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: l,
              ease: i,
              stagger: .05
            }, g + o)) : t.to(e, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: l,
            ease: i
          }, g)
        }), n.push({ tl: t })
      } else ScrollTrigger.batch(
        c, {
          start: a,
          once: !0,
          onEnter: t => {
            t.forEach((t, e) => ((t, e = 0) => {
              const
                a = t.querySelectorAll("[data-stagger-heading]"),
                r = t.querySelectorAll("[data-stagger-body]");
              if (a.length || r
                .length) {
                const t = gsap.timeline({ delay: e });
                a.length && t.to(a, {
                    opacity: 1,
                    y: 0,
                    filter: s(d) ? "blur(0px)" : "none",
                    duration: l,
                    ease: i,
                    stagger: .05
                  }, 0), r.length && t
                  .to(r, {
                    opacity: 1,
                    y: 0,
                    filter: s(d) ? "blur(0px)" : "none",
                    duration: l,
                    ease: i,
                    stagger: .05
                  }, o)
              } else gsap.to(
                t, {
                  opacity: 1,
                  y: 0,
                  filter: s(d) ? "blur(0px)" : "none",
                  duration: l,
                  ease: i,
                  delay: e
                })
            })(t, e * r))
          }
        })
    })
  }
  let I;
  window.addEventListener("resize", () => {
      clearTimeout(I), I = setTimeout(() => {
        document
          .querySelectorAll("[data-split]").forEach(t => { delete t.dataset._splitInit }),
          document.querySelectorAll("[data-split-wrapper]").forEach(t => {
            delete t.dataset
              ._wrapperInit
          }), document.querySelectorAll("[data-stagger]").forEach(
            t => { delete t.dataset._staggerInit }), ScrollTrigger.getAll().forEach(t => {
            const
              e = t.vars.trigger || t.trigger;
            e && e.hasAttribute && (e.hasAttribute("data-split") || e.hasAttribute(
              "data-split-wrapper") || e.hasAttribute("data-stagger") || e.hasAttribute(
              "data-stagger-item")) && t.kill()
          }), F(), C(), q(), window.locomotiveScroll
          ?.update?.(), ScrollTrigger.refresh()
      }, 300)
    }), o(), l(), i(), F(), C(), q(), y = gsap
    .utils.toArray("[data-svg-path]"), y.length && (A || (A = !0, v(), document.addEventListener(
      "mousemove", x), S(), window.addEventListener("resize", v), m || (m =
      requestAnimationFrame(w)))), e(function () {
      n.forEach(t => {
        t.tl ? t.tl.play() : gsap.to(t
          .targets, t.animProps)
      }), n.length = 0
    }), window.initOverlayFadeouts = o, window
    .initSvgReveal = l, window.initInstantSvgStagger = i, window.initSplitText = C, window
    .initSplitWrappers = F, window.initStaggerReveal = q
}();
