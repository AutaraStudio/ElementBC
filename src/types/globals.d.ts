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
      stop?: () => void;
      start?: () => void;
    };
    _playHeroAnimations?: () => void;
    _lenisProxyReady?: boolean;
    siteNav?: {
      isOpen: () => boolean;
      open: () => void;
      close: () => void;
      toggle: (ev: Event) => void;
    };
    initOverlayFadeouts?: (container?: Element | null) => void;
    initSvgReveal?: (container?: Element | null) => void;
    initInstantSvgStagger?: (container?: Element | null) => void;
    initSplitText?: (container?: Element | null) => void;
    initSplitWrappers?: (container?: Element | null) => void;
    initStaggerReveal?: (container?: Element | null) => void;
  }
}

export {};
