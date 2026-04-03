'use client';
import { useEffect } from 'react';

export function useAnimUtils() {
  useEffect(() => {
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

    window.animUtils = {
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
  }, []);
}
