! function e() {
  if (!window.animUtils) return setTimeout(e, 50);
  gsap.registerPlugin(CustomEase), CustomEase.create("cin", "M0,0 C0.22,0.6 0.36,1 1,1"), CustomEase
    .create("cinOut", "M0,0 C0.64,0 0.78,0.4 1,1"), CustomEase.create("reveal",
      "M0,0 C0.62,0.05 0.01,0.99 1,1");
  const t = document.querySelector("[data-preloader-wrap]"),
    o = document.querySelector("[data-preloader-svg]"),
    a = gsap.utils.toArray("[data-preloader-path]"),
    r = document.querySelector("[data-preloader-text]"),
    i = gsap.utils.toArray("[data-preloader-word]"),
    l = document.querySelector("[data-preloader-end-svg]"),
    n = document.querySelector("[data-preloader-end-icon]"),
    d = gsap.utils.toArray("[data-preloader-end-path]");
  if (!a.length) return;
  const c =
    "blur(4px)",
    s = "blur(0px)";
  gsap.set(a, { opacity: 0, filter: c }), gsap.set(i, { opacity: 0, filter: c }), gsap.set(
      n, { opacity: 0, filter: c }), gsap.set(d, { opacity: 0, filter: c }), window
    .locomotiveScroll ?
    window.locomotiveScroll.stop() : document.documentElement.style.overflow = "hidden", gsap
    .timeline({ delay: .8 }).set(o, { autoAlpha: 1 }).to(a, {
      opacity: 1,
      filter: s,
      duration: .8,
      stagger: .025,
      ease: "cin"
    }).addLabel("textIn", "+=0.45").set(r, { autoAlpha: 1 }, "textIn")
    .to(i, { opacity: 1, filter: s, duration: .85, stagger: .08, ease: "cin" }, "textIn").addLabel(
      "hold", "+=0.7").to(i, {
      opacity: 0,
      filter: c,
      duration: .55,
      stagger: {
        each: .03,
        from: "end"
      },
      ease: "cinOut"
    }, "hold").to(a, {
      opacity: 0,
      filter: c,
      duration: .55,
      stagger: { each: .015, from: "end" },
      ease: "cinOut"
    }, "hold+=0.15").set(l, { autoAlpha: 1 },
      "+=0.35").to(n, { opacity: 1, filter: s, duration: .75, ease: "cin" }, "+=0.3").to(
      d, { opacity: 1, filter: s, duration: .65, stagger: .05, ease: "cin" }, "-=0.35").addLabel(
      "endHold", "+=0.65").to(d, {
      opacity: 0,
      filter: c,
      duration: .5,
      stagger: {
        each: .03,
        from: "end"
      },
      ease: "cinOut"
    }, "endHold").to(n, {
      opacity: 0,
      filter: c,
      duration: .5,
      ease: "cinOut"
    }, "-=0.25").fromTo(
      t, { clipPath: "inset(0% 0% 0% 0%)" }, {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1.1,
        ease: "reveal",
        onComplete: () => {
          t.style.display = "none", window.locomotiveScroll ?
            window.locomotiveScroll.start() : document.documentElement.style.overflow = "", window
            .dispatchEvent(new Event("preloader:complete"))
        }
      }, "+=0.3")
}();
