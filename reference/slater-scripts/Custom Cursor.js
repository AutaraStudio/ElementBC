function initCursorMarqueeEffect() {
  const e = document.querySelector(
    "[data-cursor-marquee-status]");
  if (!e) return void console.warn(
    "🔴 Cursor Marquee: No element with [data-cursor-marquee-status] found");
  console.log("✅ Cursor Marquee: cursor element found", e);
  const t = e.querySelectorAll(
      "[data-cursor-marquee-text-target]"),
    o = e.querySelector(".cursor-marquee_track");
  if (t.length ? console.log("✅ Cursor Marquee: " +
      t.length + " text target(s) found") : console.warn(
      "🔴 Cursor Marquee: No elements with [data-cursor-marquee-text-target] found"), "undefined" ==
    typeof gsap) return void console.warn("🔴 Cursor Marquee: GSAP is not loaded");
  console.log("✅ Cursor Marquee: GSAP is loaded");
  const r = gsap.quickTo(e, "x", {
      duration: .4,
      ease: "power3"
    }),
    u = gsap.quickTo(e, "y", { duration: .4, ease: "power3" });
  let n = null,
    a = null,
    s = 0,
    i = 0;

  function c() {
    console.log("⏸️ Cursor Marquee: pausing"), e.setAttribute(
      "data-cursor-marquee-status", "not-active"), n && clearTimeout(n), n = setTimeout(
      function () { o && (o.style.animationPlayState = "paused") }, 400), a = null
  }

  function l() {
    const r = document.elementFromPoint(s, i);
    if (r && r.closest(
        "[data-cursor-marquee-hide]")) return console.log(
      "🙈 Cursor Marquee: hide trigger found, animating out"), void(a && c());
    const u = r && r
      .closest("[data-cursor-marquee-text]");
    u && u !== a && console.log("🎯 Cursor Marquee: hit target", u), u !== a && (a && c(), u &&
      function (r) {
        if (!r) return;
        n && clearTimeout(n);
        const u = r.getAttribute("data-cursor-marquee-text") || "";
        console.log("▶️ Cursor Marquee: playing for element, text:", u), t.forEach(function (
            e) { e.textContent = u }), o && (o.style.animationPlayState = "running"), e
          .setAttribute("data-cursor-marquee-status", "active"), a = r
      }(u))
  }
  window
    .addEventListener("pointermove", function (e) {
      s = e.clientX, i = e.clientY, r(s), u(i),
        l()
    }, { passive: !0 }), window.addEventListener("scroll", function () {
      r(s), u(i),
        l()
    }, { passive: !0 }), setTimeout(function () {
      e.setAttribute("data-cursor-marquee-status",
        "not-active")
    }, 500), console.log(
      "✅ Cursor Marquee: initialised successfully")
}
initCursorMarqueeEffect();
