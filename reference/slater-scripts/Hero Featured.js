! function e() {
  if (!window.animUtils) return setTimeout(e, 50);
  const t = document.querySelector(
    "[data-hero-wrap]");
  if (!t) return;
  const r = t.querySelectorAll("[data-hero-item]");
  r.length && r.forEach(e => {
    const t = e.querySelector("[data-hero-img='primary']"),
      r = e.querySelector("[data-hero-img='secondary']"),
      a = e.querySelector("[data-hero-trigger]");
    if (!t || !r || !a) return;
    gsap.set(t, { scale: 1.1 }), gsap.set(r, {
      clipPath: "inset(100% 0 0 0)",
      scale: 1.05
    });
    const o = gsap.timeline({ paused: !0 });
    o.to(r, { clipPath: "inset(0% 0 0 0)", scale: 1, duration: .875, ease: "power4.inOut" }, 0)
      .to(t, { scale: 1, duration: .875, ease: "power4.inOut" }, 0), a.addEventListener(
        "mouseenter", () => o.timeScale(1).play()), a.addEventListener("mouseleave", () => o
        .timeScale(1.25).reverse())
  })
}();
