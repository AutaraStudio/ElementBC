'use client';
import { useEffect } from 'react';
import gsap from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';

export function useScrollReveal() {
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;
    let rafId: number | null = null;
    let glowMouseHandler: ((evt: MouseEvent) => void) | null = null;
    let glowResizeHandler: (() => void) | null = null;
    let glowScrollHandler: (() => void) | null = null;
    let resizeHandler: (() => void) | null = null;
    let styleEl: HTMLStyleElement | null = null;

    function run() {
      const animUtils = window.animUtils;
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

      // Inject style for svg glow baseline (store ref for cleanup)
      styleEl = document.createElement('style');
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
        if (window.locomotiveScroll?.lenisInstance) {
          window.locomotiveScroll.lenisInstance.on('scroll', updateGlowPositions);
        } else {
          // Fallback: use native scroll to keep glow positions fresh
          glowScrollHandler = updateGlowPositions;
          window.addEventListener('scroll', glowScrollHandler, { passive: true });
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
                const outer = document.createElement('span');
                outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
                const inner = document.createElement('span');
                inner.style.cssText = 'display:inline-block;';
                inner.textContent = ch;
                outer.appendChild(inner);
                wrapper.appendChild(outer);
              }
            });
            const sr = document.createElement('span');
            sr.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
            sr.textContent = text;
            el.appendChild(sr);
            el.appendChild(wrapper);
            targets = Array.from(wrapper.querySelectorAll('span > span'));
            break;
          }
          case 'line': {
            const text = el.textContent || '';
            const wordList = text.split(/\s+/).filter(Boolean);
            el.innerHTML = '';
            // Temporarily show element so offsetTop measurements are accurate
            (el as HTMLElement).style.visibility = 'visible';
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
            // Re-hide until animation plays
            (el as HTMLElement).style.visibility = 'hidden';
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
                const outer = document.createElement('span');
                outer.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
                const inner = document.createElement('span');
                inner.style.cssText = 'display:inline-block;';
                inner.textContent = part;
                outer.appendChild(inner);
                wrapper3.appendChild(outer);
              }
            });
            const sr3 = document.createElement('span');
            sr3.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
            sr3.textContent = text;
            el.appendChild(sr3);
            el.appendChild(wrapper3);
            targets = Array.from(wrapper3.querySelectorAll('span > span'));
            break;
          }
        }

        if (!targets.length) return null;
        gsap.set(targets, { yPercent: 10, opacity: 0, filter: blurPx(blurVal), rotation });
        (el as HTMLElement).style.visibility = 'visible';

        return {
          targets,
          animProps: {
            yPercent: 0, opacity: 1, filter: blurVal ? 'blur(0px)' : 'none', rotation: 0,
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

      // Resize — re-init split/stagger animations (store ref for cleanup)
      resizeHandler = () => {
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
          window.locomotiveScroll?.update?.();
          ScrollTrigger.refresh();
        }, 300);
      };
      window.addEventListener('resize', resizeHandler);

      // Run all inits
      initOverlayFadeouts();
      initSvgReveal();
      initInstantSvgStagger();
      initSplitWrappers();
      initSplitText();
      initStaggerReveal();

      // Set up glow if svg paths present (store handler refs for cleanup)
      glowPaths = gsap.utils.toArray('[data-svg-path]') as Element[];
      if (glowPaths.length) {
        glowActive = true;
        updateGlowPositions();
        glowMouseHandler = onMouseMove;
        glowResizeHandler = updateGlowPositions;
        document.addEventListener('mousemove', glowMouseHandler);
        waitForLenis();
        window.addEventListener('resize', glowResizeHandler);
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

      // Expose hero queue player for use by reinitPageAnimations on navigation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)._playHeroAnimations = () => {
        heroQueue.forEach((item) => {
          if (item.tl) item.tl.play();
          else if (item.targets) gsap.to(item.targets, item.animProps!);
        });
        heroQueue.length = 0;
      };

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

    window.addEventListener('preloader:complete', run, { once: true });

    return () => {
      window.removeEventListener('preloader:complete', run);
      clearTimeout(resizeTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (glowMouseHandler) document.removeEventListener('mousemove', glowMouseHandler);
      if (glowResizeHandler) window.removeEventListener('resize', glowResizeHandler);
      if (glowScrollHandler) window.removeEventListener('scroll', glowScrollHandler);
      if (resizeHandler) window.removeEventListener('resize', resizeHandler);
      if (styleEl) styleEl.remove();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
}
