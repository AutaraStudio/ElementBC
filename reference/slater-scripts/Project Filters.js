! function () {
  const t = ["11 / 18", "18 / 25", "4 / 11", "11 / 18", "11 / 25"],
    e = ["3 / 4", "3 / 4", "3 / 4", "3 / 4", "16 / 9"];

  function r(r) {
    const a = [...document.querySelectorAll(".projects_archive-item")],
      o = a.filter(t => "all" !== r && t.dataset.category !== r),
      c = a.filter(t => "all" === r || t.dataset.category === r);
    o.forEach(t => t.setAttribute("data-hiding", "")), setTimeout(() => {
      o.forEach(t => {
          t
            .removeAttribute("data-hiding"), t.style.display = "none"
        }), c.forEach(t => {
          t
            .style.display = "", t.setAttribute("data-showing", "")
        }), c.forEach((r, a) => {
          r
            .style.gridColumn = t[a % 5];
          const o = r.querySelector(
            ".projects_archive_image-wrap");
          o && (o.style.aspectRatio = e[a % 5])
        }), "undefined" != typeof ScrollTrigger &&
        ScrollTrigger.refresh(), requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            c
              .forEach(t => t.removeAttribute("data-showing"))
          })
        })
    }, 300)
  }
  document
    .querySelectorAll(".projects_archive-item").forEach(t => {
      const e = t.querySelector(
        "[data-project-category]");
      e && (t.dataset.category = e.textContent.trim())
    }), document.querySelector(
      ".projects_filter_btn-wrap").addEventListener("click", t => {
      const e = t.target.closest(
        "[data-filter]");
      if (!e) return;
      const a = e.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach(t => t.classList.remove("is-active")), e
        .classList.add("is-active"), r(a)
    }), document.querySelector('[data-filter="all"]')
    ?.classList.add("is-active")
}();
