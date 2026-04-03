gsap.registerPlugin(ScrollTrigger),
  function () {
    const e = document.querySelector("[data-slider]");
    if (!e) return;
    const t = e
      .querySelector("[data-slider-indicator]"),
      r = e.querySelector("[data-slider-indicator-title]"),
      a = e.querySelector("[data-slider-progress]"),
      n = e.querySelector("[data-slider-prev]"),
      o = e.querySelector("[data-slider-next]"),
      s = e.querySelector("[data-slider-slides]"),
      l = e.querySelector("[data-slider-slide-template]"),
      i = Array.from(e.querySelectorAll("[data-slider-item]")),
      d = Array.from(e.querySelectorAll("[data-slider-asset]")),
      c = i.length;
    if (0 === c) return;
    const u = i.map(e => {
        const t = e.querySelector(
          "[data-slider-data]");
        return t?.querySelector("[data-slider-data-title]")?.textContent
          .trim() || ""
      }),
      p = i.map(e => {
        const t = e.querySelector("[data-slider-data]"),
          r = t?.querySelector("[data-slider-data-heading]"),
          a = r?.getAttribute("data-slider-data-heading") || r?.textContent.trim() || "",
          n = l.cloneNode(!0);
        n.removeAttribute("data-slider-slide-template"), n.setAttribute("data-slider-slide", ""),
          n.removeAttribute("aria-hidden");
        const o = n.querySelector(
          "[data-slider-slide-heading]");
        return o && (o.textContent = a), s.appendChild(n),
          n
      });
    let g = 1,
      h = 0,
      m = !1,
      y = 0,
      S = 0,
      x = null,
      f = null;
    const q = e => String(e).padStart(2, "0");

    function A() {
      t && (t.textContent = `${q(g)} / ${q(c)}`), r && (r.textContent = u[g - 1] ||
        "")
    }

    function v() {
      x && x.kill(), gsap.set(a, { scaleX: 0 }), x = gsap.fromTo(
        a, { scaleX: 0 }, { scaleX: 1, duration: 8, ease: "linear", onComplete: () => T(1) })
    }

    function T(e) {
      m || (m = !0, h = g, g += e, g < 1 && (g = c), g > c && (g = 1), A(), function (
        e) {
        f && f.kill();
        const t = h - 1,
          r = g - 1,
          a = { duration: 1, ease: "power3.inOut" },
          n = { duration: 1.8, ease: "power3.inOut" };
        v(), f = gsap.context(() => {
          gsap.fromTo(p[t], { autoAlpha: 1 }, {
            autoAlpha: 0,
            ...
            a
          }), gsap.fromTo(p[r], { autoAlpha: 0 }, {
            autoAlpha: 1,
            delay: .5,
            ...
            a
          }), gsap.set(d, { zIndex: 1 }), gsap.fromTo(d[t], {
            zIndex: 2,
            xPercent: 0
          }, { xPercent: -1 === e ? 50 : -50, pointerEvents: "none", ...n }), gsap.fromTo(
            d[r], {
              zIndex: 3,
              xPercent: -1 === e ? -100 : 100
            }, {
              xPercent: 0,
              pointerEvents: "all",
              ...n,
              onComplete: () => {
                m = !
                  1
              }
            })
        })
      }(e))
    }
    e.addEventListener("touchstart", e => {
        y = e.touches[0]
          .clientX, S = e.touches[0].clientY
      }, { passive: !0 }), e.addEventListener("touchend",
        e => {
          const t = e.changedTouches[0].clientX - y,
            r = Math.abs(e.changedTouches[0].clientY - S),
            a = Math.abs(t);
          a > 50 && a > r && T(t > 0 ? -1 : 1)
        }, { passive: !0 }), n && n.addEventListener("click",
        () => T(-1)), o && o.addEventListener("click", () => T(1)), gsap.set(p, { autoAlpha: 0 }),
      gsap.set(d, { zIndex: 1, xPercent: 0, pointerEvents: "none" }), gsap.set(p[
        0], { autoAlpha: 1 }), gsap.set(d[0], { zIndex: 3, pointerEvents: "all" }), A(), v(),
      function () {
        const t = e.querySelector("[data-slider-items]");
        t && gsap.fromTo(t, { yPercent: 0 }, {
          yPercent: 50,
          ease: "none",
          scrollTrigger: { trigger: e, scrub: !0, start: "top top", end: "bottom top" }
        })
      }()
  }();
