'use client';
import { useEffect } from 'react';
import gsap from '@/lib/gsap';
import { CustomEase } from '@/lib/gsap';

function setCharStaggerText(container: HTMLElement, text: string) {
  const wrap = container.querySelector('.char-stagger-wrap');
  if (!wrap) { container.textContent = text; return; }
  wrap.innerHTML = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.style.cssText = `display:inline-block;position:relative;transition-delay:${i * 0.015}s;`;
    if (ch === ' ') span.style.whiteSpace = 'pre';
    span.textContent = ch;
    wrap.appendChild(span);
  });
}

export function useNavAnimation() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__debugHud?.log('useNavAnimation: fired');
    let openTl: gsap.core.Timeline | null = null;
    let closeTl: gsap.core.Timeline | null = null;

    let _toggleBtn: Element | null = null;
    let _toggleHandler: ((e: Event) => void) | null = null;
    let _keyHandler: ((e: KeyboardEvent) => void) | null = null;
    let _logoEl: Element | null = null;
    let _revealLetters: (() => void) | null = null;
    let _hideLetters: (() => void) | null = null;
    let _observer: MutationObserver | null = null;
    let _glowStyle: HTMLStyleElement | null = null;
    let _stopGlow: (() => void) | null = null;
    let _showNav: (() => void) | null = null;

    function run() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dlog = (msg: string) => (window as any).__debugHud?.log('nav> ' + msg);
      dlog('run start');
      if (!document.querySelector('[data-nav-toggle]')) { dlog('no toggle'); return; }

      const { ANIM: anim, shuffleArray } = window.animUtils;
      dlog('got animUtils');

      CustomEase.create('menuReveal', anim.ease.menuIn);
      CustomEase.create('menuHide', anim.ease.menuOut);
      CustomEase.create('linkReveal', anim.ease.reveal);
      dlog('easings created');

      const toggleBtn = document.querySelector('[data-nav-toggle]');
      const menu = document.querySelector('[data-nav-menu]');
      const navBarEl = document.querySelector<HTMLElement>('[data-nav-bar]');
      const navItems = gsap.utils.toArray('[data-nav-item]') as Element[];
      const navPaths = gsap.utils.toArray('[data-nav-path]') as Element[];
      const linkText = toggleBtn?.querySelector('.nav_main_link-text') as HTMLElement | null;
      const logoEl = document.querySelector('[data-nav-logo]');
      const logoLetters = gsap.utils.toArray('[data-nav-letter]') as Element[];
      dlog('selectors ok');

      // Resolve the charcoal theme's light text color for the mega menu
      const menuProbe = document.createElement('div');
      menuProbe.className = 'u-theme-charcoal';
      menuProbe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
      document.body.appendChild(menuProbe);
      const menuLightColor = getComputedStyle(menuProbe).getPropertyValue('--_theme---text').trim();
      document.body.removeChild(menuProbe);
      dlog('probe ok ' + menuLightColor.slice(0, 10));

      let navColorTween: gsap.core.Tween | null = null;
      let isOpen = false;
      const shuffledPaths = shuffleArray(navPaths);

      function openMenu() {
        if (isOpen) return;
        isOpen = true;
        _showNav?.();
        if (closeTl) closeTl.kill();
        if (linkText) setCharStaggerText(linkText, 'CLOSE');

        // Force nav to light color for dark mega menu
        if (navBarEl) {
          if (navColorTween) navColorTween.kill();
          navColorTween = gsap.to(navBarEl, { color: menuLightColor, duration: 0.3, ease: 'power1.inOut' });
        }

        openTl = gsap.timeline({
          paused: true,
          onStart: () => {
            menu?.classList.add('is-open');
            if (window.locomotiveScroll) {
              window.locomotiveScroll.stop();
            } else {
              document.body.style.overflow = 'hidden';
            }
          },
        });
        openTl.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: anim.duration.xl, ease: 'menuReveal' }, 0);
        openTl.fromTo(navItems, { opacity: 0, filter: `blur(${anim.blur.lg}px)`, y: anim.y.lg }, {
          opacity: 1, filter: 'blur(0px)', y: 0, duration: anim.duration.md, ease: 'linkReveal',
          stagger: { each: anim.stagger.item, from: 'start' },
        }, `-=${anim.duration.sm}`);
        openTl.fromTo(shuffledPaths, { opacity: 0 }, {
          opacity: 1, duration: anim.duration.xs, ease: anim.ease.out,
          stagger: { each: anim.stagger.path, from: 'random' },
        }, `-=${anim.duration.md}`);
        openTl.restart();
      }

      function closeMenu() {
        if (!isOpen) return;
        isOpen = false;
        if (openTl) openTl.kill();
        if (linkText) setCharStaggerText(linkText, 'MENU');
        closeTl = gsap.timeline({
          paused: true,
          onComplete: () => {
            menu?.classList.remove('is-open');
            if (window.locomotiveScroll) {
              window.locomotiveScroll.start();
            } else {
              document.body.style.overflow = '';
            }

            // Restore nav color to current section's theme
            if (navBarEl) {
              const currentThemeText = getComputedStyle(document.documentElement).getPropertyValue('--_theme---text').trim();
              if (navColorTween) navColorTween.kill();
              navColorTween = gsap.to(navBarEl, { color: currentThemeText, duration: 0.3, ease: 'power1.inOut' });
            }
          },
        });
        closeTl.to(shuffledPaths, {
          opacity: 0, duration: 0.5 * anim.duration.xs, ease: anim.ease.in,
          stagger: { each: 0.25 * anim.stagger.path, from: 'random' },
        });
        closeTl.to(navItems, {
          opacity: 0, filter: `blur(${anim.blur.md}px)`, y: -anim.y.sm,
          duration: anim.duration.sm, ease: anim.ease.in,
          stagger: { each: 0.33 * anim.stagger.item, from: 'end' },
        }, 0.05);
        closeTl.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: anim.duration.md, ease: 'menuHide' }, 0.1);
        closeTl.restart();
      }

      function toggleMenu(ev: Event) { ev.preventDefault(); isOpen ? closeMenu() : openMenu(); }

      if (toggleBtn && menu) {
        toggleBtn.addEventListener('click', toggleMenu);
        const keyHandler = (ev: KeyboardEvent) => { if (ev.key === 'Escape' && isOpen) closeMenu(); };
        document.addEventListener('keydown', keyHandler);
        menu.querySelectorAll('[data-nav-link]').forEach((el) => el.addEventListener('click', closeMenu));

        _toggleBtn = toggleBtn;
        _toggleHandler = toggleMenu;
        _keyHandler = keyHandler;
        dlog('click bound');
      }

      // Logo letter hover animations
      if (logoEl && logoLetters.length) {
        dlog('logo setup ' + logoLetters.length);
        gsap.set(logoLetters, { opacity: 0, filter: `blur(${anim.blur.md}px)` });
        let inTl: gsap.core.Timeline | null = null;
        let outTl: gsap.core.Timeline | null = null;

        function revealLetters() {
          if (outTl) { outTl.kill(); outTl = null; }
          inTl = gsap.timeline({ paused: true }).to(logoLetters, {
            opacity: 1, filter: 'blur(0px)', duration: anim.duration.sm, ease: anim.ease.out,
            stagger: { each: 0.035, from: 'start' },
          });
          inTl.restart();
        }
        function hideLetters() {
          if (inTl) { inTl.kill(); inTl = null; }
          outTl = gsap.timeline({ paused: true }).to(logoLetters, {
            opacity: 0, filter: `blur(${anim.blur.md}px)`, duration: anim.duration.xs, ease: anim.ease.in,
            stagger: { each: 0.025, from: 'end' },
          });
          outTl.restart();
        }
        logoEl.addEventListener('mouseenter', revealLetters);
        logoEl.addEventListener('mouseleave', hideLetters);

        _logoEl = logoEl;
        _revealLetters = revealLetters;
        _hideLetters = hideLetters;
      }

      dlog('pre-glow');
      // Nav path glow on mouse move (store ref for cleanup)
      _glowStyle = document.createElement('style');
      _glowStyle.textContent = `
        [data-nav-path][data-glow-active] {
          --glow-brightness: 1; --glow-sepia: 0; --glow-saturate: 1;
          filter: brightness(var(--glow-brightness)) sepia(var(--glow-sepia)) saturate(var(--glow-saturate));
        }
      `;
      document.head.appendChild(_glowStyle);

      const GLOW_RADIUS = 500, GLOW_PEAK = 2.2, GLOW_SEPIA = 0.12, GLOW_SAT = 1.35, SPEED_ON = 0.11, SPEED_OFF = 0.055;
      type GlowPath = { el: Element; cx: number; cy: number; brightness: number };
      let glowPaths: GlowPath[] = [];
      let mouse = { x: -9999, y: -9999 };
      let rafId: number | null = null;
      let glowActive = false;

      function recalcPositions() {
        glowPaths = navPaths.map((el) => {
          const r = (el as HTMLElement).getBoundingClientRect();
          return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2, brightness: 1 };
        });
      }

      function glowFrame() {
        const r2 = GLOW_RADIUS * GLOW_RADIUS;
        let dirty = false;
        for (const p of glowPaths) {
          const dx = mouse.x - p.cx, dy = mouse.y - p.cy, dist2 = dx * dx + dy * dy;
          const lum = dist2 < r2 ? Math.pow(1 - Math.sqrt(dist2) / GLOW_RADIUS, 2) : 0;
          const target = 1 + lum * (GLOW_PEAK - 1);
          p.brightness += (target - p.brightness) * (lum > 0.01 ? SPEED_ON : SPEED_OFF);
          const delta = Math.abs(p.brightness - 1);
          if (delta > 0.005) {
            dirty = true;
            p.el.hasAttribute('data-glow-active') || p.el.setAttribute('data-glow-active', '');
            const norm = delta / (GLOW_PEAK - 1);
            (p.el as HTMLElement).style.setProperty('--glow-brightness', p.brightness.toFixed(3));
            (p.el as HTMLElement).style.setProperty('--glow-sepia', (norm * GLOW_SEPIA).toFixed(3));
            (p.el as HTMLElement).style.setProperty('--glow-saturate', (1 + norm * (GLOW_SAT - 1)).toFixed(3));
          } else if (p.brightness !== 1) {
            p.brightness = 1;
            (p.el as HTMLElement).style.removeProperty('--glow-brightness');
            (p.el as HTMLElement).style.removeProperty('--glow-sepia');
            (p.el as HTMLElement).style.removeProperty('--glow-saturate');
            p.el.removeAttribute('data-glow-active');
          }
        }
        rafId = (glowActive || dirty) ? requestAnimationFrame(glowFrame) : null;
      }

      function onMouseMove(ev: MouseEvent) {
        mouse.x = ev.clientX; mouse.y = ev.clientY;
        if (!rafId) rafId = requestAnimationFrame(glowFrame);
      }
      function startGlow() {
        if (glowActive) return;
        glowActive = true; recalcPositions();
        document.addEventListener('mousemove', onMouseMove);
        window.addEventListener('resize', recalcPositions);
      }
      function stopGlow() {
        if (!glowActive) return;
        glowActive = false; mouse = { x: -9999, y: -9999 };
        document.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('resize', recalcPositions);
        if (!rafId) rafId = requestAnimationFrame(glowFrame);
      }

      _stopGlow = stopGlow;

      dlog('pre-observer');
      if (menu) {
        _observer = new MutationObserver((entries) => {
          for (const entry of entries) {
            if (entry.attributeName === 'class') {
              menu.classList.contains('is-open')
                ? requestAnimationFrame(() => requestAnimationFrame(startGlow))
                : stopGlow();
            }
          }
        });
        _observer.observe(menu, { attributes: true, attributeFilter: ['class'] });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).siteNav = { isOpen: () => isOpen, open: openMenu, close: closeMenu, toggle: toggleMenu };

      dlog('pre-scroll-hide');
      // ---- Scroll hide/show nav ----
      // Animate only .nav_main-contain (not the wrapper) so we never put a
      // transform on the fixed-positioned parent — that would break the mega
      // menu's own position:fixed.
      const navBar = document.querySelector<HTMLElement>('.nav_main-contain');
      if (navBar) {
        let lastScrollY = window.scrollY;
        let navHidden = false;

        _showNav = () => {
          if (navHidden) {
            gsap.to(navBar, { y: 0, duration: 0.3, ease: 'power2.out' });
            navHidden = false;
          }
          lastScrollY = window.scrollY;
        };

        const onScroll = () => {
          if (isOpen || window.scrollY < 100) {
            if (navHidden) {
              gsap.to(navBar, { y: 0, duration: 0.4, ease: 'power2.out' });
              navHidden = false;
            }
            lastScrollY = window.scrollY;
            return;
          }

          const delta = window.scrollY - lastScrollY;

          if (delta > 5 && !navHidden) {
            gsap.to(navBar, { y: '-100%', duration: 0.4, ease: 'power2.inOut' });
            navHidden = true;
          } else if (delta < -5 && navHidden) {
            gsap.to(navBar, { y: 0, duration: 0.4, ease: 'power2.out' });
            navHidden = false;
          }

          lastScrollY = window.scrollY;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        _scrollHandler = onScroll;
      }
    }

    let _scrollHandler: ((e: Event) => void) | null = null;

    const safeRun = () => {
      try {
        run();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__debugHud?.log('useNavAnimation: ok');
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).__debugHud?.log('useNavAnimation CRASH: ' + ((err as Error)?.message ?? err));
      }
    };

    if (window.animUtils) {
      safeRun();
    } else {
      window.addEventListener('animUtils:ready', safeRun, { once: true });
    }

    return () => {
      openTl?.kill();
      closeTl?.kill();
      if (_toggleBtn && _toggleHandler) _toggleBtn.removeEventListener('click', _toggleHandler);
      if (_keyHandler) document.removeEventListener('keydown', _keyHandler);
      if (_logoEl && _revealLetters) _logoEl.removeEventListener('mouseenter', _revealLetters);
      if (_logoEl && _hideLetters) _logoEl.removeEventListener('mouseleave', _hideLetters);
      if (_scrollHandler) window.removeEventListener('scroll', _scrollHandler);
      _observer?.disconnect();
      _stopGlow?.();
      _glowStyle?.remove();
    };
  }, []);
}
