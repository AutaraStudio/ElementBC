! function () {
  "use strict";
  const t = {
    top: "translateY(-100%)",
    bottom: "translateY(100%)",
    left: "translateX(-100%)",
    right: "translateX(100%)"
  };

  function e(t, e, r) {
    const { left: n, top: o, width: a, height: s } = e.getBoundingClientRect(),
      i = t.clientX - n, l = t.clientY - o;
    if ("y" === r) return l < s / 2 ? "top" : "bottom";
    if (
      "x" === r) return i < a / 2 ? "left" : "right";
    const c = {
      top: l,
      right: a - i,
      bottom: s -
        l,
      left: i
    };
    return Object.entries(c).reduce((t, e) => t[1] < e[1] ? t : e)[0]
  }
  document
    .querySelectorAll("[data-hover]").forEach(function (r) {
      const n = r.getAttribute(
        "data-hover-axis") || "all";
      r.querySelectorAll("[data-hover-item]").forEach(r => {
        const o = r.querySelector(
          "[data-hover-tile]");
        o && (r.addEventListener("mouseenter", a => {
          const s = e(a, r, n);
          o.style.transition = "none", o.style.transform = t[s], o.offsetHeight, o.style
            .transition = "", o.style.transform = "translate(0%, 0%)", r.setAttribute(
              "data-hover-status", `enter-${s}`)
        }), r.addEventListener("mouseleave",
          a => {
            const s = e(a, r, n);
            r.setAttribute("data-hover-status", `leave-${s}`), o.style.transform = t[s]
          }))
      })
    })
}();
