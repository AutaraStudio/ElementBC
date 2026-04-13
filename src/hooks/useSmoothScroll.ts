'use client';
import { useEffect } from 'react';
import gsap from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import LocomotiveScroll from 'locomotive-scroll';

const DISABLE_LENIS = false;

const isTouchDevice = () =>
  'ontouchstart' in window || navigator.maxTouchPoints > 0;

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function useSmoothScroll() {
  useEffect(() => {
    if (DISABLE_LENIS) return;
    const isTouch = isTouchDevice();

    // ── TOUCH DEVICES: skip Locomotive entirely, use native scroll ──
    if (isTouch) {
      // Hide custom scrollbar
      const track = document.querySelector('[data-scroll-track]') as HTMLElement | null;
      if (track) track.style.display = 'none';

      // ScrollTrigger uses native scroll — no proxy needed
      ScrollTrigger.defaults({ scroller: window });
      ScrollTrigger.refresh();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)._lenisProxyReady = true;
      document.dispatchEvent(new CustomEvent('lenisReady'));

      return () => {
        ScrollTrigger.getAll().forEach(t => t.kill());
      };
    }

    // ── DESKTOP: Locomotive Scroll + Lenis + custom scrollbar ──
    const track = document.querySelector('[data-scroll-track]') as HTMLElement | null;
    const thumb = document.querySelector('[data-scroll-thumb]') as HTMLElement | null;
    if (!track || !thumb) return;

    let fadeTimer: ReturnType<typeof setTimeout> | null = null;
    let isDragging = false;
    let dragStartY = 0;
    let dragStartScroll = 0;

    function updateThumbHeight() {
      const viewH = window.innerHeight;
      const scrollH = document.documentElement.scrollHeight;
      const trackH = track!.clientHeight;
      const ratio = viewH / scrollH;
      thumb!.style.height = Math.max(32, ratio * trackH) + 'px';
    }

    function updateThumbPosition(scroll: number, limit: number) {
      const available = track!.clientHeight - thumb!.clientHeight;
      thumb!.style.top = (limit > 0 ? scroll / limit : 0) * available + 'px';
    }

    function onScrollActivity() {
      track!.classList.add('is-visible');
      if (fadeTimer) clearTimeout(fadeTimer);
      fadeTimer = setTimeout(() => { if (!isDragging) track!.classList.remove('is-visible'); }, 1200);
    }

    window.locomotiveScroll = new LocomotiveScroll({
      lenisOptions: {
        wrapper: window,
        content: document.documentElement,
        lerp: 0.12,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        syncTouch: false,
        syncTouchLerp: 0.06,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.8,
        autoResize: true,
      },
      triggerRootMargin: '-1px -1px -1px -1px',
      rafRootMargin: '100% 100% 100% 100%',
      autoStart: true,
      scrollCallback: (() => {
        let ticking = false;
        let state = { scroll: 0, limit: 0 };
        return ({ scroll, limit }: { scroll: number; limit: number }) => {
          state = { scroll, limit };
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
              updateThumbPosition(state.scroll, state.limit);
              onScrollActivity();
              ticking = false;
            });
          }
        };
      })(),
    });

    // GSAP ScrollTrigger proxy — desktop only
    (function applyProxy() {
      const lenis = window.locomotiveScroll?.lenisInstance;
      if (!lenis) { requestAnimationFrame(applyProxy); return; }

      let scrolling = false;
      let idleTimer: ReturnType<typeof setTimeout> | null = null;

      const onScrollUpdate = () => {
        ScrollTrigger.update();
        scrolling = true;
        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          scrolling = false;
          ScrollTrigger.update();
        }, 150);
      };

      const tickerCallback = () => {
        if (scrolling) ScrollTrigger.update();
      };
      gsap.ticker.add(tickerCallback);
      lenis.on('scroll', onScrollUpdate);

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value?: number) {
          if (arguments.length && value !== undefined) lenis.scrollTo(value, { immediate: true });
          return lenis.animatedScroll ?? window.scrollY;
        },
        getBoundingClientRect: () => ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }),
      });
      ScrollTrigger.addEventListener('refresh', () => {
        window.locomotiveScroll?.update?.();
      });
      ScrollTrigger.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)._lenisProxyReady = true;
      document.dispatchEvent(new CustomEvent('lenisReady'));
    }());

    // Click track to jump
    track.addEventListener('click', (e) => {
      if (e.target === thumb) return;
      const rect = track.getBoundingClientRect();
      const clickY = e.clientY - rect.top;
      const scrollable = track.clientHeight - thumb.clientHeight;
      const target = Math.min(1, Math.max(0, (clickY - thumb.clientHeight / 2) / scrollable)) *
        (document.documentElement.scrollHeight - window.innerHeight);
      window.locomotiveScroll.scrollTo(target, { immediate: false, duration: 0.6 });
    });

    // Drag thumb
    thumb.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDragging = true;
      dragStartY = e.clientY;
      dragStartScroll = window.scrollY || document.documentElement.scrollTop;
      track.classList.add('is-visible');
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const scrollable = track.clientHeight - thumb.clientHeight;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const target = Math.min(maxScroll, Math.max(0, dragStartScroll + (e.clientY - dragStartY) / scrollable * maxScroll));
      window.locomotiveScroll.scrollTo(target, { immediate: true });
    });
    document.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      document.body.style.userSelect = '';
      fadeTimer = setTimeout(() => track.classList.remove('is-visible'), 1200);
    });

    updateThumbHeight();
    updateThumbPosition(0, document.documentElement.scrollHeight - window.innerHeight);
    window.addEventListener('resize', updateThumbHeight);

    return () => {
      window.removeEventListener('resize', updateThumbHeight);
      window.locomotiveScroll?.destroy?.();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
}
