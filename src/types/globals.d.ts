import type LocomotiveScroll from 'locomotive-scroll';

interface AnimUtils {
  ANIM: {
    duration: { xs: number; sm: number; md: number; lg: number; xl: number };
    ease: { out: string; in: string; inOut: string; sine: string; reveal: string; menuIn: string; menuOut: string; wipe: string };
    blur: { sm: number; md: number; lg: number };
    y: { sm: number; md: number; lg: number };
    stagger: { char: number; word: number; line: number; item: number; path: number };
    scroll: { start: string; startEarly: string; end: string };
  };
  cssVar: (prop: string) => string;
  cssNum: (prop: string) => number;
  afterPreloader: (cb: () => void) => void;
  shuffleArray: <T>(arr: T[]) => T[];
  debounce: (fn: (...args: unknown[]) => void, wait: number) => (...args: unknown[]) => void;
  readAttr: (el: Element | null, attr: string) => string | null;
}

declare global {
  interface Window {
    animUtils: AnimUtils;
    locomotiveScroll: InstanceType<typeof LocomotiveScroll> & {
      update?: () => void;
    };
  }
}

export {};
