'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import { useAnimUtils } from '@/hooks/useAnimUtils';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { usePreloader } from '@/hooks/usePreloader';
import { useNavAnimation } from '@/hooks/useNavAnimation';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useThemeScroller, reinitThemeScroller } from '@/hooks/useThemeScroller';

// ---------------------------------------------------------------------------
// List Hover
// ---------------------------------------------------------------------------
function initListHover() {
  if (!document.querySelector('[data-hover]')) return;

  const transforms: Record<string, string> = {
    top: 'translateY(-100%)',
    bottom: 'translateY(100%)',
    left: 'translateX(-100%)',
    right: 'translateX(100%)',
  };

  function getDirection(evt: MouseEvent, el: Element, axis: string): string {
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = evt.clientX - left;
    const y = evt.clientY - top;
    if (axis === 'y') return y < height / 2 ? 'top' : 'bottom';
    if (axis === 'x') return x < width / 2 ? 'left' : 'right';
    const distances: Record<string, number> = { top: y, right: width - x, bottom: height - y, left: x };
    return Object.entries(distances).reduce((a, b) => a[1] < b[1] ? a : b)[0];
  }

  document.querySelectorAll('[data-hover]').forEach((hoverGroup) => {
    const axis = hoverGroup.getAttribute('data-hover-axis') || 'all';
    hoverGroup.querySelectorAll('[data-hover-item]').forEach((item) => {
      if ((item as HTMLElement).dataset._hoverInit) return;
      (item as HTMLElement).dataset._hoverInit = 'true';
      const tile = item.querySelector('[data-hover-tile]') as HTMLElement | null;
      if (!tile) return;
      item.addEventListener('mouseenter', (evt) => {
        const dir = getDirection(evt as MouseEvent, item, axis);
        tile.style.transition = 'none';
        tile.style.transform = transforms[dir];
        void tile.offsetHeight; // force reflow
        tile.style.transition = '';
        tile.style.transform = 'translate(0%, 0%)';
        item.setAttribute('data-hover-status', `enter-${dir}`);
      });
      item.addEventListener('mouseleave', (evt) => {
        const dir = getDirection(evt as MouseEvent, item, axis);
        item.setAttribute('data-hover-status', `leave-${dir}`);
        tile.style.transform = transforms[dir];
      });
    });
  });
}

// ---------------------------------------------------------------------------
// Project Slider
// ---------------------------------------------------------------------------
let _sliderProgressTween: gsap.core.Tween | null = null;
let _sliderTransitionCtx: gsap.Context | null = null;

function initProjectSlider() {
  const sliderEl = document.querySelector('[data-slider]') as HTMLElement | null;
  if (!sliderEl) return;

  // Dedup guard
  if (sliderEl.dataset._sliderInit) return;
  sliderEl.dataset._sliderInit = 'true';

  // Kill stale tweens from previous page
  if (_sliderProgressTween) { _sliderProgressTween.kill(); _sliderProgressTween = null; }
  if (_sliderTransitionCtx) { _sliderTransitionCtx.kill(); _sliderTransitionCtx = null; }

  const indicator = sliderEl.querySelector('[data-slider-indicator]');
  const indicatorTitle = sliderEl.querySelector('[data-slider-indicator-title]');
  const progressEl = sliderEl.querySelector('[data-slider-progress]');
  const prevBtn = sliderEl.querySelector('[data-slider-prev]');
  const nextBtn = sliderEl.querySelector('[data-slider-next]');
  const slidesContainer = sliderEl.querySelector('[data-slider-slides]');
  const template = sliderEl.querySelector('[data-slider-slide-template]') as HTMLElement | null;
  const items = Array.from(sliderEl.querySelectorAll('[data-slider-item]'));
  const assets = Array.from(sliderEl.querySelectorAll('[data-slider-asset]'));
  const count = items.length;
  if (!count) return;

  const titles = items.map((item) => {
    const data = item.querySelector('[data-slider-data]');
    return data?.querySelector('[data-slider-data-title]')?.textContent?.trim() || '';
  });

  const slideEls = items.map((item) => {
    const data = item.querySelector('[data-slider-data]');
    const headingEl = data?.querySelector('[data-slider-data-heading]');
    const headingText =
      headingEl?.getAttribute('data-slider-data-heading') || headingEl?.textContent?.trim() || '';
    const clone = template!.cloneNode(true) as HTMLElement;
    clone.removeAttribute('data-slider-slide-template');
    clone.setAttribute('data-slider-slide', '');
    clone.removeAttribute('aria-hidden');
    const slideHeading = clone.querySelector('[data-slider-slide-heading]');
    if (slideHeading) slideHeading.textContent = headingText;
    slidesContainer?.appendChild(clone);
    return clone;
  });

  let current = 1;
  let prev = 0;
  let isTransitioning = false;
  let touchStartX = 0;
  let touchStartY = 0;

  const pad = (n: number) => String(n).padStart(2, '0');

  function updateUI() {
    if (indicator) indicator.textContent = `${pad(current)} / ${pad(count)}`;
    if (indicatorTitle) indicatorTitle.textContent = titles[current - 1] || '';
  }

  function startProgress() {
    if (_sliderProgressTween) _sliderProgressTween.kill();
    gsap.set(progressEl, { scaleX: 0 });
    _sliderProgressTween = gsap.fromTo(
      progressEl,
      { scaleX: 0 },
      { scaleX: 1, duration: 8, ease: 'linear', onComplete: () => go(1) }
    );
  }

  function go(dir: number) {
    if (isTransitioning) return;
    isTransitioning = true;
    prev = current;
    current += dir;
    if (current < 1) current = count;
    if (current > count) current = 1;
    updateUI();

    if (_sliderTransitionCtx) _sliderTransitionCtx.kill();
    const fromIdx = prev - 1;
    const toIdx = current - 1;
    const dur = { duration: 1, ease: 'power3.inOut' };
    const durLong = { duration: 1.8, ease: 'power3.inOut' };

    startProgress();
    _sliderTransitionCtx = gsap.context(() => {
      gsap.fromTo(slideEls[fromIdx], { autoAlpha: 1 }, { autoAlpha: 0, ...dur });
      gsap.fromTo(slideEls[toIdx], { autoAlpha: 0 }, { autoAlpha: 1, delay: 0.5, ...dur });
      gsap.set(assets, { zIndex: 1 });
      gsap.fromTo(assets[fromIdx], { zIndex: 2, xPercent: 0 }, { xPercent: dir === -1 ? 50 : -50, pointerEvents: 'none', ...durLong });
      gsap.fromTo(
        assets[toIdx],
        { zIndex: 3, xPercent: dir === -1 ? -100 : 100 },
        { xPercent: 0, pointerEvents: 'all', ...durLong, onComplete: () => { isTransitioning = false; } }
      );
    });
  }

  sliderEl.addEventListener('touchstart', (evt) => {
    touchStartX = (evt as TouchEvent).touches[0].clientX;
    touchStartY = (evt as TouchEvent).touches[0].clientY;
  }, { passive: true });
  sliderEl.addEventListener('touchend', (evt) => {
    const dx = (evt as TouchEvent).changedTouches[0].clientX - touchStartX;
    const dy = Math.abs((evt as TouchEvent).changedTouches[0].clientY - touchStartY);
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) go(dx > 0 ? -1 : 1);
  }, { passive: true });

  prevBtn?.addEventListener('click', () => go(-1));
  nextBtn?.addEventListener('click', () => go(1));

  gsap.set(slideEls, { autoAlpha: 0 });
  gsap.set(assets, { zIndex: 1, xPercent: 0, pointerEvents: 'none' });
  gsap.set(slideEls[0], { autoAlpha: 1 });
  gsap.set(assets[0], { zIndex: 3, pointerEvents: 'all' });
  updateUI();
  startProgress();

  // Scroll fade — fade/blur/scale out UI overlay (matches home hero behaviour)
  const uiOverlay = sliderEl.querySelector('.projects_hero-ui') as HTMLElement | null;
  if (uiOverlay) {
    gsap.fromTo(uiOverlay, {
      opacity: 1,
      scale: 1,
    }, {
      opacity: 0,
      scale: 0.95,
      ease: 'none',
      scrollTrigger: {
        trigger: sliderEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }
}

// ---------------------------------------------------------------------------
// Carousel Manager
// ---------------------------------------------------------------------------
function initCarouselManager() {
  if (!document.querySelector('[data-marquee]')) return;

  document.querySelectorAll('[data-marquee]').forEach((el) => {
    if ((el as HTMLElement).dataset._marqueeInit) return;
    (el as HTMLElement).dataset._marqueeInit = 'true';

    const collection = el.querySelector('[data-marquee-collection]') as HTMLElement | null;
    const track = el.querySelector('[data-marquee-track]') as HTMLElement | null;
    if (!collection || !track) return;

    const direction = (el as HTMLElement).dataset.marqueeDirection || 'left';
    const speed = parseFloat((el as HTMLElement).dataset.marqueeSpeed || '') || 30;
    const scrollSpeed = parseFloat((el as HTMLElement).dataset.marqueeScrollSpeed || '') || 10;
    const duplicates = parseInt((el as HTMLElement).dataset.marqueeDuplicate || '') || 2;
    const dir = direction === 'right' ? 1 : -1;
    const scale = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
    const duration = speed * (collection.offsetWidth / window.innerWidth) * scale;

    track.style.marginLeft = -1 * scrollSpeed + '%';
    track.style.width = 2 * scrollSpeed + 100 + '%';

    const frag = document.createDocumentFragment();
    for (let i = 0; i < duplicates; i++) frag.appendChild(collection.cloneNode(true));
    track.appendChild(frag);

    const collections = el.querySelectorAll('[data-marquee-collection]');
    const tween = gsap.to(collections, { xPercent: -100, repeat: -1, duration, ease: 'linear' }).totalProgress(0.5);
    gsap.set(collections, { xPercent: dir === 1 ? 100 : -100 });
    tween.timeScale(dir);
    tween.play();
    el.setAttribute('data-marquee-status', 'normal');

    ScrollTrigger.create({
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const forward = self.direction === 1;
        tween.timeScale(forward ? -dir : dir);
        el.setAttribute('data-marquee-status', forward ? 'normal' : 'inverted');
      },
    });

    const fromX = dir === -1 ? scrollSpeed : -scrollSpeed;
    const toX = -fromX;
    gsap.timeline({ scrollTrigger: { trigger: el, start: '0% 100%', end: '100% 0%', scrub: 0 } })
      .fromTo(track, { x: `${fromX}vw` }, { x: `${toX}vw`, ease: 'none' });
  });
}

// ---------------------------------------------------------------------------
// Custom Cursor (singleton — init once only)
// ---------------------------------------------------------------------------
let _cursorInitialized = false;

function initCustomCursor() {
  if (_cursorInitialized) return;

  const wrap = document.querySelector('[data-cursor-marquee-status]') as Element | null;
  if (!wrap) return;

  _cursorInitialized = true;

  const targets = wrap.querySelectorAll('[data-cursor-marquee-text-target]');
  const trackEl = wrap.querySelector('.cursor-marquee_track') as HTMLElement | null;

  const moveX = gsap.quickTo(wrap as gsap.TweenTarget, 'x', { duration: 0.4, ease: 'power3' });
  const moveY = gsap.quickTo(wrap as gsap.TweenTarget, 'y', { duration: 0.4, ease: 'power3' });

  let hideTimer: ReturnType<typeof setTimeout> | null = null;
  let activeEl: Element | null = null;
  let cursorX = 0;
  let cursorY = 0;

  function deactivate() {
    (wrap as Element).setAttribute('data-cursor-marquee-status', 'not-active');
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { if (trackEl) trackEl.style.animationPlayState = 'paused'; }, 400);
    activeEl = null;
  }

  function activate(target: Element) {
    if (hideTimer) clearTimeout(hideTimer);
    const text = target.getAttribute('data-cursor-marquee-text') || '';
    targets.forEach((el) => { el.textContent = text; });
    if (trackEl) trackEl.style.animationPlayState = 'running';
    (wrap as Element).setAttribute('data-cursor-marquee-status', 'active');
    activeEl = target;
  }

  function updateCursor() {
    const el = document.elementFromPoint(cursorX, cursorY);
    if (el && el.closest('[data-cursor-marquee-hide]')) {
      if (activeEl) deactivate();
      return;
    }
    const target = el && el.closest('[data-cursor-marquee-text]');
    if (target !== activeEl) {
      if (activeEl) deactivate();
      if (target) activate(target);
    }
  }

  window.addEventListener('pointermove', (ev) => {
    cursorX = ev.clientX; cursorY = ev.clientY;
    moveX(cursorX); moveY(cursorY);
    updateCursor();
  }, { passive: true });

  window.addEventListener('scroll', () => { moveX(cursorX); moveY(cursorY); updateCursor(); }, { passive: true });

  setTimeout(() => { (wrap as Element).setAttribute('data-cursor-marquee-status', 'not-active'); }, 500);
}

// ---------------------------------------------------------------------------
// Hero Scroll Fade — sticky hero fades/blurs/scales on scroll
// ---------------------------------------------------------------------------
function initHeroScrollFade() {
  const wrap = document.querySelector('[data-hero-wrap]') as HTMLElement | null;
  if (!wrap) return;

  const content = wrap.querySelector('.home_hero_featured-contain') as HTMLElement | null;
  const heading = wrap.querySelector('.home_hero_heading-wrap') as HTMLElement | null;
  const row = wrap.querySelector('.home_hero_featured-row') as HTMLElement | null;

  if (!content) return;

  const targets = [content];

  gsap.fromTo(targets, {
    opacity: 1,
    scale: 1,
  }, {
    opacity: 0,
    scale: 0.95,
    ease: 'none',
    scrollTrigger: {
      trigger: wrap,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

// ---------------------------------------------------------------------------
// Hero Image Hover (View Project trigger)
// ---------------------------------------------------------------------------
function initHeroImageHover() {
  const trigger = document.querySelector('[data-hero-trigger]') as HTMLElement | null;
  if (!trigger) return;

  // Prevent duplicate listeners from strict mode / HMR
  if (trigger.dataset._heroHoverInit) return;
  trigger.dataset._heroHoverInit = 'true';

  const wrap = trigger.closest('[data-hero-item]') || trigger.closest('[data-hero-wrap]');
  if (!wrap) return;

  const primary = wrap.querySelector('[data-hero-img="primary"]') as HTMLElement | null;
  const secondary = wrap.querySelector('[data-hero-img="secondary"]') as HTMLElement | null;
  if (!primary || !secondary) return;

  const duration = 1;
  const ease = 'power3.inOut';

  // Proxy object — GSAP tweens a number, we build the clip-path string manually
  const clip = { top: 100 };

  function applyClip() {
    secondary!.style.clipPath = `inset(${clip.top}% 0% 0% 0%)`;
  }

  let hoverTl: gsap.core.Tween | null = null;
  let scaleTl: gsap.core.Tween | null = null;

  trigger.addEventListener('mouseenter', () => {
    if (hoverTl) hoverTl.kill();
    if (scaleTl) scaleTl.kill();
    hoverTl = gsap.to(clip, { top: 0, duration, ease, onUpdate: applyClip });
    scaleTl = gsap.to(primary, { scale: 1, duration, ease });
  });

  trigger.addEventListener('mouseleave', () => {
    if (hoverTl) hoverTl.kill();
    if (scaleTl) scaleTl.kill();
    hoverTl = gsap.to(clip, { top: 100, duration, ease, onUpdate: applyClip });
    scaleTl = gsap.to(primary, { scale: 1.1, duration, ease });
  });

  // Set initial state
  applyClip();
  gsap.set(primary, { scale: 1.1 });
}

// ---------------------------------------------------------------------------
// Cleanup + Re-init page animations after client-side navigation
// ---------------------------------------------------------------------------
function cleanupPageAnimations() {
  const pageMain = document.querySelector('.page_main');
  if (!pageMain) return;

  // Kill ScrollTriggers whose trigger is inside page_main
  ScrollTrigger.getAll().forEach((st) => {
    const trigger = st.vars.trigger || st.trigger;
    if (trigger && pageMain.contains(trigger as Element)) {
      st.kill();
    }
  });

  // Kill all GSAP tweens targeting elements inside page_main
  gsap.killTweensOf(pageMain.querySelectorAll('*'));

  // Clear init flags so scroll-reveal functions re-process new page elements
  // dataset._overlayInit → HTML attr data--overlay-init etc.
  pageMain.querySelectorAll('[data-overlay]').forEach((el) => delete (el as HTMLElement).dataset._overlayInit);
  pageMain.querySelectorAll('[data-stagger]').forEach((el) => delete (el as HTMLElement).dataset._staggerInit);
  pageMain.querySelectorAll('[data-svg-stagger]').forEach((el) => delete (el as HTMLElement).dataset._instantSvgInit);
  pageMain.querySelectorAll('[data-svg-reveal]').forEach((el) => delete (el as HTMLElement).dataset._svgRevealInit);
  pageMain.querySelectorAll('[data-split]').forEach((el) => {
    delete (el as HTMLElement).dataset._splitInit;
    // Restore original text if SplitText modified it
    if ((el as HTMLElement).dataset._originalText) {
      el.textContent = (el as HTMLElement).dataset._originalText!;
      delete (el as HTMLElement).dataset._originalText;
    }
  });
  pageMain.querySelectorAll('[data-split-wrapper]').forEach((el) => delete (el as HTMLElement).dataset._wrapperInit);
  pageMain.querySelectorAll('[data-reveal-children]').forEach((el) => delete (el as HTMLElement).dataset._revealChildrenInit);

  // Also reset visibility on stagger items (they start hidden)
  pageMain.querySelectorAll('[data-stagger-item]').forEach((el) => {
    (el as HTMLElement).style.visibility = '';
  });

  // Kill stale slider tweens
  if (_sliderProgressTween) { _sliderProgressTween.kill(); _sliderProgressTween = null; }
  if (_sliderTransitionCtx) { _sliderTransitionCtx.kill(); _sliderTransitionCtx = null; }
}

function reinitPageAnimations() {
  // Clean up old page's animations first
  cleanupPageAnimations();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;

  // Call the scroll-reveal init functions exposed on window
  if (typeof w.initOverlayFadeouts === 'function') (w.initOverlayFadeouts as () => void)();
  if (typeof w.initSvgReveal === 'function') (w.initSvgReveal as () => void)();
  if (typeof w.initInstantSvgStagger === 'function') (w.initInstantSvgStagger as () => void)();
  if (typeof w.initSplitWrappers === 'function') (w.initSplitWrappers as () => void)();
  if (typeof w.initSplitText === 'function') (w.initSplitText as () => void)();
  if (typeof w.initStaggerReveal === 'function') (w.initStaggerReveal as () => void)();

  // Marquee reveal — add class when in view so CSS fades all overlays
  document.querySelectorAll('[data-marquee-reveal]').forEach((el) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => el.classList.add('marquee-revealed'),
    });
  });

  // Re-init theme scroller for new page
  reinitThemeScroller();

  // Re-init component-level animations
  initListHover();
  initCarouselManager();
  initProjectSlider();
  initHeroImageHover();
  initHeroScrollFade();

  // Play hero animations for the new page (preloader already done)
  if (typeof w._playHeroAnimations === 'function') w._playHeroAnimations();

  // Refresh LocomotiveScroll + ScrollTrigger for new page height
  window.locomotiveScroll?.update?.();
  ScrollTrigger.refresh();

  // Second pass after images may have loaded
  setTimeout(() => {
    window.locomotiveScroll?.update?.();
    ScrollTrigger.refresh();
  }, 500);
}

// ---------------------------------------------------------------------------
// Orchestrator
// ---------------------------------------------------------------------------
export default function AnimationProvider() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useAnimUtils();
  useSmoothScroll();
  usePreloader(pathname);
  useNavAnimation();
  useScrollReveal();
  useThemeScroller();

  // Initial mount — one-time inits
  useEffect(() => {
    try { initListHover(); } catch (e) { console.error('[Anim] initListHover failed:', e); }
    try { initCarouselManager(); } catch (e) { console.error('[Anim] initCarouselManager failed:', e); }
    try { initCustomCursor(); } catch (e) { console.error('[Anim] initCustomCursor failed:', e); }
    try { initProjectSlider(); } catch (e) { console.error('[Anim] initProjectSlider failed:', e); }
    try { initHeroImageHover(); } catch (e) { console.error('[Anim] initHeroImageHover failed:', e); }
    try { initHeroScrollFade(); } catch (e) { console.error('[Anim] initHeroScrollFade failed:', e); }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Re-init on client-side navigation (skip first render — handled above)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Scroll to top on route change — works with Lenis smooth scroll
    if (window.locomotiveScroll) {
      window.locomotiveScroll.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }

    // Wait for React to commit new DOM before reinitializing
    const timer = setTimeout(() => {
      reinitPageAnimations();
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
