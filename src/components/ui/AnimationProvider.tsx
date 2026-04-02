'use client';

import { useEffect } from 'react';
import gsap from '@/lib/gsap';
import { ScrollTrigger, CustomEase } from '@/lib/gsap';

// ---------------------------------------------------------------------------
// Shared Utilities — sets window.animUtils (must run before other scripts)
// ---------------------------------------------------------------------------
function initSharedUtilities() {
  const style = getComputedStyle(document.documentElement);
  const cssVar = (prop: string) => style.getPropertyValue(prop).trim();
  const cssNum = (prop: string) => parseFloat(cssVar(prop));

  const ANIM = {
    duration: {
      xs: cssNum('--anim-duration-xs'),
      sm: cssNum('--anim-duration-sm'),
      md: cssNum('--anim-duration-md'),
      lg: cssNum('--anim-duration-lg'),
      xl: cssNum('--anim-duration-xl'),
    },
    ease: {
      out: cssVar('--anim-ease-out'),
      in: cssVar('--anim-ease-in'),
      inOut: cssVar('--anim-ease-in-out'),
      sine: cssVar('--anim-ease-sine'),
      reveal: cssVar('--anim-ease-reveal'),
      menuIn: cssVar('--anim-ease-menu-in'),
      menuOut: cssVar('--anim-ease-menu-out'),
      wipe: cssVar('--anim-ease-wipe'),
    },
    blur: {
      sm: cssNum('--anim-blur-sm'),
      md: cssNum('--anim-blur-md'),
      lg: cssNum('--anim-blur-lg'),
    },
    y: {
      sm: cssNum('--anim-y-sm'),
      md: cssNum('--anim-y-md'),
      lg: cssNum('--anim-y-lg'),
    },
    stagger: {
      char: cssNum('--anim-stagger-char'),
      word: cssNum('--anim-stagger-word'),
      line: cssNum('--anim-stagger-line'),
      item: cssNum('--anim-stagger-item'),
      path: cssNum('--anim-stagger-path'),
    },
    scroll: {
      start: cssVar('--scroll-start'),
      startEarly: cssVar('--scroll-start-early'),
      end: cssVar('--scroll-end'),
    },
  };

  let preloaderDone = false;
  window.addEventListener('preloader:complete', () => { preloaderDone = true; });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).animUtils = {
    ANIM,
    cssVar,
    cssNum,
    afterPreloader(cb: () => void) {
      preloaderDone ? cb() : window.addEventListener('preloader:complete', cb, { once: true });
    },
    shuffleArray<T>(arr: T[]): T[] {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },
    debounce(fn: (...args: unknown[]) => void, wait: number) {
      let timer: ReturnType<typeof setTimeout>;
      return function (this: unknown, ...args: unknown[]) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
      };
    },
    readAttr(el: Element | null, attr: string): string | null {
      if (!el || !attr) return null;
      const val = el.getAttribute(attr);
      return val && val.trim() ? val.trim() : null;
    },
  };

  window.dispatchEvent(new Event('animUtils:ready'));
}

// ---------------------------------------------------------------------------
// Preloader Manager
// ---------------------------------------------------------------------------
function initPreloaderManager() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(window as any).animUtils) return;

  CustomEase.create('cin', 'M0,0 C0.22,0.6 0.36,1 1,1');
  CustomEase.create('cinOut', 'M0,0 C0.64,0 0.78,0.4 1,1');
  CustomEase.create('reveal', 'M0,0 C0.62,0.05 0.01,0.99 1,1');

  const wrap = document.querySelector('[data-preloader-wrap]');
  const svgEl = document.querySelector('[data-preloader-svg]');
  const paths = gsap.utils.toArray('[data-preloader-path]') as Element[];
  const textEl = document.querySelector('[data-preloader-text]');
  const words = gsap.utils.toArray('[data-preloader-word]') as Element[];
  const endSvg = document.querySelector('[data-preloader-end-svg]');
  const endIcon = document.querySelector('[data-preloader-end-icon]');
  const endPaths = gsap.utils.toArray('[data-preloader-end-path]') as Element[];

  if (!paths.length) return;

  const blur = 'blur(4px)';
  const clear = 'blur(0px)';

  gsap.set(paths, { opacity: 0, filter: blur });
  gsap.set(words, { opacity: 0, filter: blur });
  gsap.set(endIcon, { opacity: 0, filter: blur });
  gsap.set(endPaths, { opacity: 0, filter: blur });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((window as any).locomotiveScroll) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).locomotiveScroll.stop();
  } else {
    document.documentElement.style.overflow = 'hidden';
  }

  gsap
    .timeline({ delay: 0.8 })
    .set(svgEl, { autoAlpha: 1 })
    .to(paths, { opacity: 1, filter: clear, duration: 0.8, stagger: 0.025, ease: 'cin' })
    .addLabel('textIn', '+=0.45')
    .set(textEl, { autoAlpha: 1 }, 'textIn')
    .to(words, { opacity: 1, filter: clear, duration: 0.85, stagger: 0.08, ease: 'cin' }, 'textIn')
    .addLabel('hold', '+=0.7')
    .to(words, { opacity: 0, filter: blur, duration: 0.55, stagger: { each: 0.03, from: 'end' }, ease: 'cinOut' }, 'hold')
    .to(paths, { opacity: 0, filter: blur, duration: 0.55, stagger: { each: 0.015, from: 'end' }, ease: 'cinOut' }, 'hold+=0.15')
    .set(endSvg, { autoAlpha: 1 }, '+=0.35')
    .to(endIcon, { opacity: 1, filter: clear, duration: 0.75, ease: 'cin' }, '+=0.3')
    .to(endPaths, { opacity: 1, filter: clear, duration: 0.65, stagger: 0.05, ease: 'cin' }, '-=0.35')
    .addLabel('endHold', '+=0.65')
    .to(endPaths, { opacity: 0, filter: blur, duration: 0.5, stagger: { each: 0.03, from: 'end' }, ease: 'cinOut' }, 'endHold')
    .to(endIcon, { opacity: 0, filter: blur, duration: 0.5, ease: 'cinOut' }, '-=0.25')
    .fromTo(
      wrap,
      { clipPath: 'inset(0% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.1,
        ease: 'reveal',
        onComplete: () => {
          (wrap as HTMLElement).style.display = 'none';
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((window as any).locomotiveScroll) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).locomotiveScroll.start();
          } else {
            document.documentElement.style.overflow = '';
          }
          window.dispatchEvent(new Event('preloader:complete'));
        },
      },
      '+=0.3'
    );
}

// ---------------------------------------------------------------------------
// Scroll Reveal
// ---------------------------------------------------------------------------
function initScrollReveal() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animUtils = (window as any).animUtils;
  if (!animUtils) return;

  const { ANIM: t, afterPreloader: e, shuffleArray: a } = animUtils;

  function blurPx(px: number): string { return px ? `blur(${px}px)` : 'none'; }

  // Queue of hero animations played after preloader completes
  const heroQueue: Array<{ targets?: Element[]; animProps?: gsap.TweenVars; tl?: gsap.core.Timeline }> = [];

  // --- Overlay fade ---
  function initOverlayFadeouts(container?: Element | null) {
    (container || document).querySelectorAll('[data-overlay]').forEach((el) => {
      if ((el as HTMLElement).dataset._overlayInit) return;
      (el as HTMLElement).dataset._overlayInit = 'true';
      const start = el.getAttribute('data-overlay-start') || t.scroll.startEarly;
      const end = el.getAttribute('data-overlay-end') || t.scroll.end;
      const dur = parseFloat(el.getAttribute('data-overlay-duration') || '') || t.duration.lg;
      const ease = el.getAttribute('data-overlay-ease') || t.ease.sine;
      const scrub = 'true' === el.getAttribute('data-overlay-scrub');
      const delay = parseFloat(el.getAttribute('data-overlay-delay') || '') || 0;
      if (scrub) {
        gsap.to(el, { opacity: 0, ease: 'none', scrollTrigger: { trigger: el, start, end, scrub: 0.6 } });
      } else {
        gsap.to(el, { opacity: 0, duration: dur, delay, ease, scrollTrigger: { trigger: el, start, end, toggleActions: 'play none none none' } });
      }
    });
  }

  // --- SVG reveal (background fade + path stagger) ---
  function initSvgReveal(container?: Element | null) {
    (container || document).querySelectorAll('[data-svg-reveal]').forEach((el) => {
      if ((el as HTMLElement).dataset._svgRevealInit) return;
      (el as HTMLElement).dataset._svgRevealInit = 'true';
      const start = el.getAttribute('data-svg-start') || t.scroll.startEarly;
      const end = el.getAttribute('data-svg-end') || t.scroll.end;
      const bgDur = parseFloat(el.getAttribute('data-svg-bg-duration') || '') || t.duration.lg;
      const bgEase = el.getAttribute('data-svg-bg-ease') || t.ease.sine;
      const pathDur = parseFloat(el.getAttribute('data-svg-path-duration') || '') || t.duration.sm;
      const pathEase = el.getAttribute('data-svg-path-ease') || t.ease.out;
      const staggerEach = parseFloat(el.getAttribute('data-svg-stagger-each') || '') || t.stagger.path;
      const blur = parseFloat(el.getAttribute('data-svg-blur') || '') || t.blur.md;
      const from = el.getAttribute('data-svg-from') || 'random';
      const pathEls = gsap.utils.toArray(el.querySelectorAll('[data-svg-path]')) as Element[];
      if (!pathEls.length) return;
      const shuffled = a(pathEls);
      gsap.set(shuffled, { opacity: 0, filter: blurPx(blur) });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start, end, toggleActions: 'play none none none' },
      });
      const bg = getComputedStyle(el as HTMLElement).backgroundColor;
      tl.fromTo(el, { backgroundColor: bg }, { backgroundColor: 'transparent', duration: bgDur, ease: bgEase });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tl.to(shuffled, { opacity: 1, filter: 'blur(0px)', duration: pathDur, ease: pathEase, stagger: { each: staggerEach, from: from as any } }, `-=${bgDur}` as gsap.Position);
    });
  }

  // --- SVG stagger (instant / hero) ---
  function initInstantSvgStagger(container?: Element | null) {
    (container || document).querySelectorAll('[data-svg-stagger]').forEach((el) => {
      if ((el as HTMLElement).dataset._instantSvgInit) return;
      (el as HTMLElement).dataset._instantSvgInit = 'true';
      const start = el.getAttribute('data-svg-start') || t.scroll.startEarly;
      const pathDur = parseFloat(el.getAttribute('data-svg-path-duration') || '') || t.duration.sm;
      const pathEase = el.getAttribute('data-svg-path-ease') || t.ease.out;
      const staggerEach = parseFloat(el.getAttribute('data-svg-stagger-each') || '') || t.stagger.path;
      const blur = parseFloat(el.getAttribute('data-svg-blur') || '') || t.blur.md;
      const from = el.getAttribute('data-svg-from') || 'random';
      const isHero = el.hasAttribute('data-anim-hero');
      const delay = parseFloat(el.getAttribute('data-svg-delay') || '') || 0;
      const triggerSel = el.getAttribute('data-svg-trigger');
      const triggerEl = (triggerSel && document.querySelector(triggerSel)) || el;
      const pathEls = gsap.utils.toArray(el.querySelectorAll('[data-svg-path]')) as Element[];
      if (!pathEls.length) return;
      const shuffled = a(pathEls);
      gsap.set(shuffled, { opacity: 0, filter: blurPx(blur) });
      const animProps: gsap.TweenVars = {
        opacity: 1, filter: 'blur(0px)', duration: pathDur, ease: pathEase, delay,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stagger: { each: staggerEach, from: from as any },
      };
      if (isHero) {
        heroQueue.push({ targets: shuffled, animProps });
      } else {
        animProps.scrollTrigger = { trigger: triggerEl, start, toggleActions: 'play none none none' };
        gsap.to(shuffled, animProps);
      }
    });
  }

  // Inject style for svg glow baseline
  const styleEl = document.createElement('style');
  styleEl.textContent =
    '[data-svg-stagger] [data-svg-path]{opacity:0;}' +
    '[data-svg-path][data-glow-active]{--glow-brightness:1;filter:brightness(var(--glow-brightness)) !important;}';
  document.head.appendChild(styleEl);

  // --- Glow effect ---
  const GLOW_RADIUS = 300;
  const DIM_PEAK = 0.35;
  const BRIGHT_PEAK = 2.2;
  const LERP_NEAR = 0.14;
  const LERP_FAR = 0.055;
  let glowPaths: Element[] = [];
  let glowData: Array<{ el: Element; cx: number; cy: number; brightness: number; peak: number }> = [];
  let mouse = { x: -9999, y: -9999 };
  let rafId: number | null = null;
  let glowActive = false;

  function updateGlowPositions() {
    glowData = glowPaths.map((el) => {
      const rect = el.getBoundingClientRect();
      const lum = (() => {
        let fill = getComputedStyle(el as SVGElement).fill || '';
        if (!fill || fill === 'none') fill = el.getAttribute('fill') || '';
        const nums = fill.match(/\d+/g);
        if (!nums || nums.length < 3) return 0.5;
        const [r, g, b] = nums.map((v) => {
          const c = parseInt(v) / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      })();
      const peak = lum > 0.18 ? DIM_PEAK : BRIGHT_PEAK;
      return { el, cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2, brightness: 1, peak };
    });
  }

  function glowTick() {
    const r2 = GLOW_RADIUS * GLOW_RADIUS;
    let needsFrame = false;
    for (const d of glowData) {
      const dx = mouse.x - d.cx;
      const dy = mouse.y - d.cy;
      const dist2 = dx * dx + dy * dy;
      let influence = 0;
      if (dist2 < r2) {
        const ratio = 1 - Math.sqrt(dist2) / GLOW_RADIUS;
        influence = ratio * ratio;
      }
      const target = 1 - influence * (1 - d.peak);
      const lerp = influence > 0.01 ? LERP_NEAR : LERP_FAR;
      d.brightness += (target - d.brightness) * lerp;
      if (Math.abs(d.brightness - 1) > 0.005) {
        needsFrame = true;
        if (!d.el.hasAttribute('data-glow-active')) d.el.setAttribute('data-glow-active', '');
        (d.el as HTMLElement).style.setProperty('--glow-brightness', d.brightness.toFixed(3));
      } else if (d.brightness !== 1) {
        d.brightness = 1;
        (d.el as HTMLElement).style.removeProperty('--glow-brightness');
        d.el.removeAttribute('data-glow-active');
      }
    }
    rafId = glowActive || needsFrame ? requestAnimationFrame(glowTick) : null;
  }

  function onMouseMove(evt: MouseEvent) {
    mouse.x = evt.clientX;
    mouse.y = evt.clientY;
    if (!rafId) rafId = requestAnimationFrame(glowTick);
  }

  function waitForLenis() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).locomotiveScroll?.lenisInstance) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).locomotiveScroll.lenisInstance.on('scroll', updateGlowPositions);
    } else {
      setTimeout(waitForLenis, 100);
    }
  }

  // --- Text split helpers ---
  const textConfigs: Record<string, { stagger: number; duration: number; y: number; blur: number }> = {
    char: { stagger: t.stagger.char, duration: t.duration.sm, y: t.y.sm, blur: t.blur.sm },
    word: { stagger: t.stagger.word, duration: t.duration.md, y: t.y.md, blur: t.blur.sm },
    line: { stagger: t.stagger.line, duration: t.duration.lg, y: t.y.lg, blur: t.blur.md },
  };

  function splitElement(el: Element): { targets: Element[]; animProps: gsap.TweenVars } | null {
    if ((el as HTMLElement).dataset._originalText) {
      el.textContent = (el as HTMLElement).dataset._originalText!;
    } else {
      (el as HTMLElement).dataset._originalText = el.textContent || '';
    }
    const type = (el.getAttribute('data-split') || 'word').toLowerCase();
    const cfg = textConfigs[type] || textConfigs.word;
    const stagger = parseFloat(el.getAttribute('data-split-stagger') || '') || cfg.stagger;
    const duration = parseFloat(el.getAttribute('data-split-duration') || '') || cfg.duration;
    const ease = el.getAttribute('data-split-ease') || t.ease.out;
    const yVal = el.getAttribute('data-split-y') !== null ? parseFloat(el.getAttribute('data-split-y')!) : cfg.y;
    const blurVal = el.getAttribute('data-split-blur') !== null ? parseFloat(el.getAttribute('data-split-blur')!) : cfg.blur;
    const rotation = parseFloat(el.getAttribute('data-split-rotation') || '') || 0;
    const delay = parseFloat(el.getAttribute('data-split-delay') || '') || 0;

    let targets: Element[];

    switch (type) {
      case 'char': {
        const text = el.textContent || '';
        el.innerHTML = '';
        const wrapper = document.createElement('span');
        wrapper.style.cssText = 'display:inline;overflow:visible;';
        wrapper.setAttribute('aria-hidden', 'true');
        [...text].forEach((ch) => {
          if (ch === ' ') {
            wrapper.appendChild(document.createTextNode(' '));
          } else {
            const span = document.createElement('span');
            span.style.cssText = 'display:inline-block;';
            span.textContent = ch;
            wrapper.appendChild(span);
          }
        });
        const sr = document.createElement('span');
        sr.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
        sr.textContent = text;
        el.appendChild(sr);
        el.appendChild(wrapper);
        targets = Array.from(wrapper.querySelectorAll('span[style]'));
        break;
      }
      case 'line': {
        const text = el.textContent || '';
        const wordList = text.split(/\s+/).filter(Boolean);
        el.innerHTML = '';
        const wordSpans = wordList.map((w) => {
          const sp = document.createElement('span');
          sp.style.cssText = 'display:inline;white-space:pre;';
          sp.textContent = w + ' ';
          el.appendChild(sp);
          return sp;
        });
        const lines: string[][] = [];
        let currentLine: string[] = [];
        let lastTop: number | null = null;
        wordSpans.forEach((sp) => {
          const top = sp.offsetTop;
          if (lastTop !== null && top !== lastTop) { lines.push(currentLine); currentLine = []; }
          currentLine.push(sp.textContent || '');
          lastTop = top;
        });
        if (currentLine.length) lines.push(currentLine);
        el.innerHTML = '';
        const wrapper2 = document.createElement('span');
        wrapper2.style.cssText = 'display:inline;overflow:visible;';
        wrapper2.setAttribute('aria-hidden', 'true');
        const lineInners = lines.map((line) => {
          const outer = document.createElement('span');
          outer.style.cssText = 'display:block;overflow:hidden;';
          const inner = document.createElement('span');
          inner.style.cssText = 'display:block;';
          inner.textContent = line.join('').trimEnd();
          outer.appendChild(inner);
          wrapper2.appendChild(outer);
          return inner;
        });
        const sr2 = document.createElement('span');
        sr2.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
        sr2.textContent = text;
        el.appendChild(sr2);
        el.appendChild(wrapper2);
        targets = lineInners;
        break;
      }
      default: {
        const text = el.textContent || '';
        const parts = text.split(/(\s+)/);
        el.innerHTML = '';
        const wrapper3 = document.createElement('span');
        wrapper3.style.cssText = 'display:inline;overflow:visible;';
        wrapper3.setAttribute('aria-hidden', 'true');
        parts.forEach((part) => {
          if (/^\s+$/.test(part)) {
            wrapper3.appendChild(document.createTextNode(part));
          } else if (part) {
            const span = document.createElement('span');
            span.style.cssText = 'display:inline-block;';
            span.textContent = part;
            wrapper3.appendChild(span);
          }
        });
        const sr3 = document.createElement('span');
        sr3.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
        sr3.textContent = text;
        el.appendChild(sr3);
        el.appendChild(wrapper3);
        targets = Array.from(wrapper3.querySelectorAll('span[style]'));
        break;
      }
    }

    if (!targets.length) return null;
    gsap.set(targets, { opacity: 0, y: yVal, filter: blurPx(blurVal), rotation });
    (el as HTMLElement).style.visibility = 'visible';

    return {
      targets,
      animProps: {
        opacity: 1, y: 0, filter: blurVal ? 'blur(0px)' : 'none', rotation: 0,
        duration, ease, delay, stagger: { each: stagger, from: 'start' },
      },
    };
  }

  function initSplitText(container?: Element | null) {
    (container || document).querySelectorAll('[data-split]').forEach((el) => {
      if ((el as HTMLElement).dataset._splitInit) return;
      if (el.closest('[data-split-wrapper]')) return;
      (el as HTMLElement).dataset._splitInit = 'true';
      const result = splitElement(el);
      if (!result) return;
      const { targets, animProps } = result;
      const isHero = el.hasAttribute('data-anim-hero');
      const start = el.getAttribute('data-split-start') || t.scroll.start;
      const offset = parseFloat(el.getAttribute('data-split-offset') || '') || 0;
      const trigger = offset ? `top+=${offset} ${start.split(' ')[1] || '85%'}` : start;
      if (isHero) {
        heroQueue.push({ targets, animProps });
      } else {
        animProps.scrollTrigger = { trigger: el, start: trigger, toggleActions: 'play none none none' };
        gsap.to(targets, animProps);
      }
    });
  }

  function initSplitWrappers(container?: Element | null) {
    (container || document).querySelectorAll('[data-split-wrapper]').forEach((el) => {
      if ((el as HTMLElement).dataset._wrapperInit) return;
      (el as HTMLElement).dataset._wrapperInit = 'true';
      const pause = parseFloat(el.getAttribute('data-split-pause') || '') || 0.2;
      const start = el.getAttribute('data-split-start') || t.scroll.start;
      const isHero = el.hasAttribute('data-anim-hero');
      const isHeading = (child: Element) => /^H[1-6]$/.test(child.tagName) || !!child.closest('h1,h2,h3,h4,h5,h6');

      type SplitItem = { el: Element; targets: Element[]; animProps: gsap.TweenVars };
      const headings: SplitItem[] = [];
      const bodies: SplitItem[] = [];

      Array.from(el.querySelectorAll('[data-split]')).forEach((child) => {
        if ((child as HTMLElement).dataset._splitInit) return;
        (child as HTMLElement).dataset._splitInit = 'true';
        const result = splitElement(child);
        if (!result) return;
        (isHeading(child) ? headings : bodies).push({ el: child, ...result });
      });

      if (!headings.length && !bodies.length) return;

      const tl = gsap.timeline({
        paused: isHero,
        ...(!isHero && { scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' } }),
      });

      headings.forEach(({ targets, animProps }, idx) => {
        const { delay: _d, ...props } = animProps;
        tl.to(targets, props, idx === 0 ? 0 : `<+=${(props.stagger as gsap.StaggerVars)?.each || 0}`);
      });
      bodies.forEach(({ targets, animProps }, idx) => {
        const { delay: _d, ...props } = animProps;
        const pos = idx === 0 ? (headings.length ? `>+=${pause}` : 0) : `<+=${(props.stagger as gsap.StaggerVars)?.each || 0}`;
        tl.to(targets, props, pos);
      });

      if (isHero) heroQueue.push({ tl });
    });
  }

  function initStaggerReveal(container?: Element | null) {
    (container || document).querySelectorAll('[data-stagger]').forEach((el) => {
      if ((el as HTMLElement).dataset._staggerInit) return;
      (el as HTMLElement).dataset._staggerInit = 'true';
      const start = el.getAttribute('data-stagger-start') || t.scroll.start;
      const each = parseFloat(el.getAttribute('data-stagger-each') || '') || t.stagger.item;
      const pause = parseFloat(el.getAttribute('data-stagger-pause') || '') || 0.1;
      const duration = parseFloat(el.getAttribute('data-stagger-duration') || '') || t.duration.md;
      const ease = el.getAttribute('data-stagger-ease') || t.ease.out;
      const yVal = parseFloat(el.getAttribute('data-stagger-y') || '') || t.y.md;
      const blurVal = parseFloat(el.getAttribute('data-stagger-blur') || '') || 0;
      const isHero = el.hasAttribute('data-anim-hero');
      const items = Array.from(el.querySelectorAll('[data-stagger-item]')) as HTMLElement[];
      if (!items.length) return;

      items.forEach((item) => {
        const hds = item.querySelectorAll('[data-stagger-heading]');
        const bds = item.querySelectorAll('[data-stagger-body]');
        const targets = hds.length || bds.length ? [...hds, ...bds] : [item];
        gsap.set(targets, { opacity: 0, y: yVal, filter: blurPx(blurVal) });
        item.style.visibility = 'visible';
      });

      if (isHero) {
        const tl = gsap.timeline({ paused: true });
        items.forEach((item, idx) => {
          const hds = item.querySelectorAll('[data-stagger-heading]');
          const bds = item.querySelectorAll('[data-stagger-body]');
          const offset = idx * each;
          if (hds.length || bds.length) {
            if (hds.length) tl.to(hds, { opacity: 1, y: 0, filter: 'blur(0px)', duration, ease, stagger: 0.05 }, offset);
            if (bds.length) tl.to(bds, { opacity: 1, y: 0, filter: 'blur(0px)', duration, ease, stagger: 0.05 }, offset + pause);
          } else {
            tl.to(item, { opacity: 1, y: 0, filter: 'blur(0px)', duration, ease }, offset);
          }
        });
        heroQueue.push({ tl });
      } else {
        ScrollTrigger.batch(items, {
          start,
          once: true,
          onEnter: (batch) => {
            batch.forEach((item, idx) => {
              const hds = (item as Element).querySelectorAll('[data-stagger-heading]');
              const bds = (item as Element).querySelectorAll('[data-stagger-body]');
              if (hds.length || bds.length) {
                const tl2 = gsap.timeline({ delay: idx * each });
                if (hds.length) tl2.to(hds, { opacity: 1, y: 0, filter: blurVal ? 'blur(0px)' : 'none', duration, ease, stagger: 0.05 }, 0);
                if (bds.length) tl2.to(bds, { opacity: 1, y: 0, filter: blurVal ? 'blur(0px)' : 'none', duration, ease, stagger: 0.05 }, pause);
              } else {
                gsap.to(item, { opacity: 1, y: 0, filter: blurVal ? 'blur(0px)' : 'none', duration, ease, delay: idx * each });
              }
            });
          },
        });
      }
    });
  }

  // Resize — re-init split/stagger animations
  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.querySelectorAll('[data-split]').forEach((el) => { delete (el as HTMLElement).dataset._splitInit; });
      document.querySelectorAll('[data-split-wrapper]').forEach((el) => { delete (el as HTMLElement).dataset._wrapperInit; });
      document.querySelectorAll('[data-stagger]').forEach((el) => { delete (el as HTMLElement).dataset._staggerInit; });
      ScrollTrigger.getAll().forEach((st) => {
        const trigger = st.vars.trigger || st.trigger;
        if (
          trigger &&
          (trigger as Element).hasAttribute &&
          (
            (trigger as Element).hasAttribute('data-split') ||
            (trigger as Element).hasAttribute('data-split-wrapper') ||
            (trigger as Element).hasAttribute('data-stagger') ||
            (trigger as Element).hasAttribute('data-stagger-item')
          )
        ) st.kill();
      });
      initSplitWrappers(); initSplitText(); initStaggerReveal();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).locomotiveScroll?.update?.();
      ScrollTrigger.refresh();
    }, 300);
  });

  // Run all inits
  initOverlayFadeouts();
  initSvgReveal();
  initInstantSvgStagger();
  initSplitWrappers();
  initSplitText();
  initStaggerReveal();

  // Set up glow if svg paths present
  glowPaths = gsap.utils.toArray('[data-svg-path]') as Element[];
  if (glowPaths.length) {
    glowActive = true;
    updateGlowPositions();
    document.addEventListener('mousemove', onMouseMove);
    waitForLenis();
    window.addEventListener('resize', updateGlowPositions);
    if (!rafId) rafId = requestAnimationFrame(glowTick);
  }

  // Play hero animations after preloader completes
  e(() => {
    heroQueue.forEach((item) => {
      if (item.tl) item.tl.play();
      else if (item.targets) gsap.to(item.targets, item.animProps!);
    });
    heroQueue.length = 0;
  });

  // Expose to window for use by other scripts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).initOverlayFadeouts = initOverlayFadeouts;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).initSvgReveal = initSvgReveal;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).initInstantSvgStagger = initInstantSvgStagger;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).initSplitText = initSplitText;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).initSplitWrappers = initSplitWrappers;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).initStaggerReveal = initStaggerReveal;
}

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
function initProjectSlider() {
  const sliderEl = document.querySelector('[data-slider]');
  if (!sliderEl) return;

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
  let progressTween: gsap.core.Tween | null = null;
  let transitionCtx: gsap.Context | null = null;

  const pad = (n: number) => String(n).padStart(2, '0');

  function updateUI() {
    if (indicator) indicator.textContent = `${pad(current)} / ${pad(count)}`;
    if (indicatorTitle) indicatorTitle.textContent = titles[current - 1] || '';
  }

  function startProgress() {
    if (progressTween) progressTween.kill();
    gsap.set(progressEl, { scaleX: 0 });
    progressTween = gsap.fromTo(
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

    if (transitionCtx) transitionCtx.kill();
    const fromIdx = prev - 1;
    const toIdx = current - 1;
    const dur = { duration: 1, ease: 'power3.inOut' };
    const durLong = { duration: 1.8, ease: 'power3.inOut' };

    startProgress();
    transitionCtx = gsap.context(() => {
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

  // Parallax on scroll
  const itemsEl = sliderEl.querySelector('[data-slider-items]');
  if (itemsEl) {
    gsap.fromTo(itemsEl, { yPercent: 0 }, {
      yPercent: 50,
      ease: 'none',
      scrollTrigger: { trigger: sliderEl, scrub: true, start: 'top top', end: 'bottom top' },
    });
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function AnimationProvider() {
  useEffect(() => {
    initSharedUtilities();
    initPreloaderManager();
    initScrollReveal();
    initListHover();
    initProjectSlider();

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return null;
}
