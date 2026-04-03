window.locomotiveScroll = new LocomotiveScroll({
    lenisOptions: {
      wrapper: window,
      content: document
        .documentElement,
      lerp: 0,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: !0,
      smoothTouch: !1,
      wheelMultiplier: .45,
      touchMultiplier: 2,
      normalizeWheel:
        !0,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    },
    triggerRootMargin: "-1px -1px -1px -1px",
    rafRootMargin: "100% 100% 100% 100%",
    autoStart: !0,
    scrollCallback: (() => {
      let t = !1,
        e = { scroll: 0, limit: 0 };
      return ({ scroll: i, limit: o }) => {
        e = {
          scroll: i,
          limit: o
        }, t || (t = !0, requestAnimationFrame(() => {
          updateThumbPosition(e
            .scroll, e.limit), onScrollActivity(), t = !1
        }))
      }
    })()
  }),
  function t() {
    if ("undefined" == typeof ScrollTrigger) return void console.warn(
      "[locomotive-scroll] ScrollTrigger not found — proxy not applied.");
    const e = window
      .locomotiveScroll?.lenisInstance;
    e ? (gsap.ticker.add(() => ScrollTrigger.update()), ScrollTrigger.scrollerProxy(document
        .documentElement, {
          scrollTop(t) {
            return arguments.length && e.scrollTo(t, {
              immediate: !
                0
            }), e.animatedScroll ?? window.scrollY
          },
          getBoundingClientRect: () =>
            ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight })
        }),
      ScrollTrigger.addEventListener("refresh", () => { window.locomotiveScroll?.update?.() }),
      ScrollTrigger.refresh(), window._lenisProxyReady = !0, document.dispatchEvent(
        new CustomEvent("lenisReady"))) : requestAnimationFrame(t)
  }();
const track = document.querySelector("[data-scroll-track]"),
  thumb = document.querySelector("[data-scroll-thumb]");
let fadeTimer = null,
  isDragging = !1,
  dragStartY = 0,
  dragStartScroll = 0;

function updateThumbHeight() {
  const t = window.innerHeight,
    e = document.documentElement.scrollHeight,
    i = track.clientHeight,
    o = t / e,
    n = Math.max(32, o * i);
  thumb.style.height = n + "px"
}

function updateThumbPosition(t, e) {
  const i = track.clientHeight - thumb.clientHeight,
    o = e > 0 ? t / e : 0;
  thumb.style.top = o * i + "px"
}

function onScrollActivity() {
  track.classList.add("is-visible"), clearTimeout(fadeTimer),
    fadeTimer = setTimeout(() => { isDragging || track.classList.remove("is-visible") },
      1200)
}
track.addEventListener("click", function (t) {
    if (t.target === thumb) return;
    const e =
      track.getBoundingClientRect(),
      i = t.clientY - e.top,
      o = track.clientHeight,
      n = thumb.clientHeight,
      r = o - n,
      l = Math.min(1, Math.max(0, (i - n / 2) / r)) * (document.documentElement.scrollHeight -
        window.innerHeight);
    window.locomotiveScroll.scrollTo(l, { immediate: !1, duration: .6 })
  }), thumb.addEventListener(
    "mousedown",
    function (t) {
      t.preventDefault(), isDragging = !0, dragStartY = t.clientY, dragStartScroll =
        window.scrollY || document.documentElement.scrollTop, track.classList.add("is-visible"),
        document.body.style.userSelect = "none"
    }), document.addEventListener("mousemove",
    function (t) {
      if (!isDragging) return;
      const e = track.clientHeight - thumb.clientHeight,
        i = t.clientY - dragStartY,
        o = document.documentElement.scrollHeight - window.innerHeight,
        n = i / e,
        r = Math.min(o, Math.max(0, dragStartScroll + n * o));
      window.locomotiveScroll.scrollTo(r, { immediate: !0 })
    }), document.addEventListener(
    "mouseup",
    function () {
      isDragging && (isDragging = !1, document.body.style.userSelect = "", fadeTimer =
        setTimeout(() => track.classList.remove("is-visible"), 1200))
    }), updateThumbHeight(),
  updateThumbPosition(0, document.documentElement.scrollHeight - window.innerHeight), window
  .addEventListener("resize", () => { updateThumbHeight() });
