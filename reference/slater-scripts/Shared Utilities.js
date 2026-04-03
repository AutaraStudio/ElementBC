! function () {
  "use strict";
  const e = getComputedStyle(document.documentElement);

  function n(n) { return e.getPropertyValue(n).trim() }

  function t(e) { return parseFloat(n(e)) }
  const a = {
    duration: {
      xs: t("--anim-duration-xs"),
      sm: t("--anim-duration-sm"),
      md: t("--anim-duration-md"),
      lg: t("--anim-duration-lg"),
      xl: t("--anim-duration-xl")
    },
    ease: {
      out: n("--anim-ease-out"),
      in: n("--anim-ease-in"),
      inOut: n("--anim-ease-in-out"),
      sine: n("--anim-ease-sine"),
      reveal: n(
        "--anim-ease-reveal"),
      menuIn: n("--anim-ease-menu-in"),
      menuOut: n(
        "--anim-ease-menu-out"),
      wipe: n("--anim-ease-wipe")
    },
    blur: {
      sm: t("--anim-blur-sm"),
      md: t("--anim-blur-md"),
      lg: t("--anim-blur-lg")
    },
    y: {
      sm: t("--anim-y-sm"),
      md: t(
        "--anim-y-md"),
      lg: t("--anim-y-lg")
    },
    stagger: {
      char: t("--anim-stagger-char"),
      word: t("--anim-stagger-word"),
      line: t("--anim-stagger-line"),
      item: t(
        "--anim-stagger-item"),
      path: t("--anim-stagger-path")
    },
    scroll: {
      start: n(
        "--scroll-start"),
      startEarly: n("--scroll-start-early"),
      end: n("--scroll-end")
    }
  };
  let
    i = !1;
  window.addEventListener("preloader:complete", () => { i = !0 }), window.animUtils = {
    ANIM: a,
    cssVar: n,
    cssNum: t,
    afterPreloader: function (e) {
      i ? e() : window.addEventListener(
        "preloader:complete", e, { once: !0 })
    },
    shuffleArray: function (e) {
      const n = [...
        e
      ];
      for (let e = n.length - 1; e > 0; e--) {
        const t = Math.floor(Math.random() * (e +
          1));
        [n[e], n[t]] = [n[t], n[e]]
      }
      return n
    },
    debounce: function (e, n) {
      let
        t;
      return function (...a) {
        clearTimeout(t), t = setTimeout(() => e.apply(this, a),
          n)
      }
    },
    readAttr: function (e, n) {
      if (!e || !n) return null;
      const t = e
        .getAttribute(n);
      return t && t.trim() ? t.trim() : null
    }
  }, window.dispatchEvent(
    new Event("animUtils:ready"))
}();
