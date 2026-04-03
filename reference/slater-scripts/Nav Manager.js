! function () {
  "use strict";
  const { ANIM: e, afterPreloader: t, shuffleArray: a } = window
    .animUtils;
  gsap.registerPlugin(CustomEase), CustomEase.create("menuReveal", e.ease.menuIn), CustomEase
    .create("menuHide", e.ease.menuOut), CustomEase.create("linkReveal", e.ease.reveal);
  const n =
    document.querySelector("[data-nav-toggle]"),
    r = document.querySelector("[data-nav-menu]"),
    o = (document.querySelector(".nav_main-layout"), gsap.utils.toArray("[data-nav-item]")),
    s = gsap.utils.toArray("[data-nav-path]"),
    i = n?.querySelector(".nav_main_link-text"),
    l = document.querySelector("[data-nav-logo]"),
    u = gsap.utils.toArray("[data-nav-letter]");
  let c = !1,
    d = null,
    m = null;
  const g = a(s);

  function p() {
    c || (c = !0, m && m.kill(), i && (i.textContent = "CLOSE"), d =
      function () {
        const t = gsap.timeline({
          paused: !0,
          onStart: () => {
            r.classList.add(
              "is-open"), window.locomotiveScroll?.stop()
          }
        });
        return t.fromTo(
          r, { clipPath: "inset(0 0 100% 0)" }, {
            clipPath: "inset(0 0 0% 0)",
            duration: e
              .duration.xl,
            ease: "menuReveal"
          }, 0), t.fromTo(o, {
          opacity: 0,
          filter: `blur(${e.blur.lg}px)`,
          y: e.y.lg
        }, {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: e.duration.md,
          ease: "linkReveal",
          stagger: {
            each: e.stagger.item,
            from: "start"
          }
        }, `-=${e.duration.sm}`), t.fromTo(g, { opacity: 0 }, {
          opacity: 1,
          duration: e.duration.xs,
          ease: e.ease.out,
          stagger: {
            each: e.stagger.path,
            from: "random"
          }
        }, `-=${e.duration.md}`), t
      }(), d.restart())
  }

  function v() {
    c && (c = !1, d && d.kill(), i && (i.textContent = "MENU"), m = function () {
      const
        t = gsap.timeline({
          paused: !0,
          onComplete: () => {
            r.classList.remove("is-open"),
              window.locomotiveScroll?.start()
          }
        });
      return t.to(g, {
        opacity: 0,
        duration: .5 *
          e.duration.xs,
        ease: e.ease.in,
        stagger: {
          each: .25 * e.stagger.path,
          from: "random"
        }
      }), t.to(o, {
        opacity: 0,
        filter: `blur(${e.blur.md}px)`,
        y: -e.y
          .sm,
        duration: e.duration.sm,
        ease: e.ease.in,
        stagger: {
          each: .33 * e.stagger
            .item,
          from: "end"
        }
      }, .05), t.to(r, {
        clipPath: "inset(0 0 100% 0)",
        duration: e
          .duration.md,
        ease: "menuHide"
      }, .1), t
    }(), m.restart())
  }

  function y(e) { e.preventDefault(), c ? v() : p() }
  if (n && r && (n.addEventListener("click", y),
      document.addEventListener("keydown", e => { "Escape" === e.key && c && v() }), r
      .querySelectorAll("[data-nav-link]").forEach(e => { e.addEventListener("click", v) })), l && u
    .length) {
    gsap.set(u, { opacity: 0, filter: `blur(${e.blur.md}px)` });
    let R = null,
      N = null;

    function O() {
      N && (N.kill(), N = null), R = gsap.timeline({ paused: !0 }).to(u, {
        opacity: 1,
        filter: "blur(0px)",
        duration: e.duration.sm,
        ease: e.ease.out,
        stagger: {
          each: .035,
          from: "start"
        }
      }), R.restart()
    }

    function T() {
      R && (R.kill(), R = null), N = gsap.timeline({ paused: !0 }).to(u, {
        opacity: 0,
        filter: `blur(${e.blur.md}px)`,
        duration: e.duration.xs,
        ease: e.ease.in,
        stagger: { each: .025, from: "end" }
      }), N.restart()
    }
    l.addEventListener("mouseenter", O),
      l.addEventListener("mouseleave", T)
  }
  const f = document.createElement("style");
  f.textContent =
    "\n    [data-nav-path][data-glow-active] {\n      --glow-brightness: 1;\n      --glow-sepia: 0;\n      --glow-saturate: 1;\n      filter: brightness(var(--glow-brightness)) sepia(var(--glow-sepia)) saturate(var(--glow-saturate));\n    }\n  ",
    document.head.appendChild(f);
  const h = 500,
    b = 2.2,
    w = .12,
    x = 1.35,
    E = .11,
    A = .055;
  let L = [],
    k = { x: -9999, y: -9999 },
    q = null,
    C = !1;

  function P() {
    L = s.map(e => {
      const t = e.getBoundingClientRect();
      return {
        el: e,
        cx: t.left +
          t.width / 2,
        cy: t.top + t.height / 2,
        brightness: 1
      }
    })
  }

  function S() {
    const e = h,
      t = e * e;
    let a = !1;
    for (let n = 0; n < L.length; n++) {
      const r = L[n],
        o = k.x - r.cx,
        s = k.y - r.cy,
        i = o * o + s * s;
      let l = 0;
      if (i < t) {
        const t = 1 - Math.sqrt(i) / e;
        l = t * t
      }
      const u = 1 + l * (b - 1),
        c = l > .01 ? E : A;
      r.brightness += (u - r.brightness) * c;
      const d = Math.abs(r.brightness - 1);
      if (d >
        .005) {
        a = !0, r.el.hasAttribute("data-glow-active") || r.el.setAttribute(
          "data-glow-active", "");
        const e = d / (b - 1);
        r.el.style.setProperty("--glow-brightness", r.brightness.toFixed(3)), r.el.style
          .setProperty("--glow-sepia", (e * w).toFixed(3)), r.el.style.setProperty(
            "--glow-saturate", (1 + e * (x - 1)).toFixed(3))
      } else 1 !== r.brightness && (r
        .brightness = 1, r.el.style.removeProperty("--glow-brightness"), r.el.style
        .removeProperty("--glow-sepia"), r.el.style.removeProperty("--glow-saturate"), r.el
        .removeAttribute("data-glow-active"))
    }
    q = C || a ? requestAnimationFrame(S) : null
  }

  function F(e) { k.x = e.clientX, k.y = e.clientY, q || (q = requestAnimationFrame(S)) }

  function $() {
    C || (C = !0, P(), document.addEventListener("mousemove", F), window
      .addEventListener("resize", P))
  }

  function M() {
    C && (C = !1, k = { x: -9999, y: -9999 }, document.removeEventListener("mousemove",
      F), window.removeEventListener("resize", P), q || (q = requestAnimationFrame(S)))
  }
  if (
    r) {
    new MutationObserver(e => {
        for (const t of e) "class" === t.attributeName && (r.classList
          .contains("is-open") ? requestAnimationFrame(() => requestAnimationFrame($)) : M())
      })
      .observe(r, { attributes: !0, attributeFilter: ["class"] })
  }
  window.siteNav = {
    isOpen: () =>
      c,
    open: p,
    close: v,
    toggle: y
  }
}();
