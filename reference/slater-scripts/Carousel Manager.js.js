! function () {
  "use strict";
  document.querySelectorAll("[data-marquee]").forEach(function (e) {
    const t = e.querySelector(
        "[data-marquee-collection]"),
      r = e.querySelector("[data-marquee-track]");
    if (!t || !r) return;
    const a = e.dataset
      .marqueeDirection || "left",
      o = parseFloat(e.dataset.marqueeSpeed) || 30,
      n = parseFloat(e.dataset.marqueeScrollSpeed) || 10,
      i = parseInt(e.dataset.marqueeDuplicate) || 2,
      c = "right" === a ? 1 : -1,
      l = window.innerWidth < 479 ? .25 : window.innerWidth < 991 ? .5 : 1,
      s = o * (t.offsetWidth / window.innerWidth) * l;
    r.style.marginLeft = -1 * n + "%", r.style.width = 2 * n + 100 + "%";
    const d = document
      .createDocumentFragment();
    for (let e = 0; e < i; e++) d.appendChild(t.cloneNode(!0));
    r.appendChild(d);
    const u = e.querySelectorAll("[data-marquee-collection]"),
      m = gsap.to(u, { xPercent: -100, repeat: -1, duration: s, ease: "linear" }).totalProgress(
        .5);
    gsap.set(u, { xPercent: 1 === c ? 100 : -100 }), m.timeScale(c), m.play(), e.setAttribute(
      "data-marquee-status", "normal"), ScrollTrigger.create({
      trigger: e,
      start: "top bottom",
      end: "bottom top",
      onUpdate: t => {
        const r = 1 === t.direction,
          a = r ? -c : c;
        m.timeScale(a), e.setAttribute("data-marquee-status", r ? "normal" :
          "inverted")
      }
    });
    const p = -1 === c ? n : -n,
      g = -p;
    gsap.timeline({ scrollTrigger: { trigger: e, start: "0% 100%", end: "100% 0%", scrub: 0 } })
      .fromTo(r, { x: `${p}vw` }, { x: `${g}vw`, ease: "none" })
  })
}();
