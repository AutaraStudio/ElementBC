'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import gsap from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import { usePageTransitionContext } from './PageTransitionProvider';
import {
  beginTransition,
  endTransition,
} from '@/lib/transition/transitionState';

// Verbatim from the brief — pre-tuned, do not deviate
const LEAVE_PANEL_DURATION = 0.6;
const ENTER_PANEL_DURATION = 0.7;
const HOLD_AFTER_COMMIT    = 0.2;
const COMMIT_TIMEOUT       = 4;       // hard ceiling, secs
const PAGE_LIFT            = '-12vh';
const PAGE_RISE            = '12vh';
const EASE                 = 'cubic-bezier(0.65, 0, 0.35, 1)';

type LenisLike = {
  stop?: () => void;
  start?: () => void;
  scrollTo?: (target: number, options?: { immediate?: boolean; force?: boolean }) => void;
};

function getLenis(): LenisLike | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).__lenis ?? null;
}

function getMain(): HTMLElement | null {
  // The (main) layout wraps page content in <div className="page_main">.
  return (
    document.querySelector<HTMLElement>('.page_main') ??
    document.querySelector<HTMLElement>('main')
  );
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export default function PageTransitionOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLSpanElement>(null);

  const router = useRouter();
  const pathname = usePathname();

  // Mirror the live pathname into a ref so the imperative fn (which
  // closes over its initial value) can poll for the route swap.
  const pathnameRef = useRef(pathname);
  useEffect(() => { pathnameRef.current = pathname; }, [pathname]);

  const { registerTransition } = usePageTransitionContext();

  useEffect(() => {
    // Resolve the target pathname out of an href that may include a
    // search string or hash. We only care about pathname here.
    const toPathname = (href: string): string => {
      try {
        const url = new URL(href, window.location.origin);
        return url.pathname;
      } catch {
        return href.split(/[?#]/)[0] ?? href;
      }
    };

    const transition = async (href: string, pageName?: string) => {
      // prefers-reduced-motion → no panel, just route.
      if (prefersReducedMotion()) {
        router.push(href);
        return;
      }

      const overlay = overlayRef.current;
      const panel   = panelRef.current;
      const label   = labelRef.current;
      if (!overlay || !panel) {
        router.push(href);
        return;
      }

      const targetPathname = toPathname(href);
      // Same-page click: no transition needed.
      if (targetPathname === pathnameRef.current) {
        router.push(href);
        return;
      }

      const lenis = getLenis();
      const main = getMain();

      // ── LEAVE ──────────────────────────────────────────────────
      try { lenis?.stop?.(); } catch {}
      beginTransition();

      gsap.set(panel, {
        yPercent: 0,
        autoAlpha: 0,
        willChange: 'transform, opacity',
      });
      if (label) gsap.set(label, { autoAlpha: 0 });

      const leaveTl = gsap.timeline();
      leaveTl.to(panel, { autoAlpha: 1, duration: 0 }, 0);
      leaveTl.to(panel, {
        yPercent: -100,
        duration: LEAVE_PANEL_DURATION,
        ease: EASE,
      }, 0);
      if (main) {
        leaveTl.to(main, {
          y: PAGE_LIFT,
          duration: LEAVE_PANEL_DURATION,
          ease: EASE,
        }, 0);
      }
      if (label && pageName) {
        label.textContent = pageName;
        leaveTl.to(label, {
          autoAlpha: 1,
          duration: 0.3,
          ease: 'none',
        }, '<+=0.2');
      }
      await leaveTl;

      // ── ROUTE SWAP ─────────────────────────────────────────────
      router.push(href);

      // Wait for the live pathname ref to flip to the target.
      const start = performance.now();
      await new Promise<void>((resolve) => {
        const tick = () => {
          if (pathnameRef.current === targetPathname) { resolve(); return; }
          if ((performance.now() - start) / 1000 >= COMMIT_TIMEOUT) {
            // Hard ceiling — let the enter run regardless to free the lock.
            resolve();
            return;
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });

      // Two extra rAFs absorb first-paint flicker / async server boundaries.
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

      // Reset scroll. Do all four — not every browser respects every path.
      try { window.scrollTo(0, 0); } catch {}
      try { document.documentElement.scrollTop = 0; } catch {}
      try { document.body.scrollTop = 0; } catch {}
      try { lenis?.scrollTo?.(0, { immediate: true, force: true }); } catch {}

      // Hold a beat so the new page's first paint is settled before the
      // panel uncovers it.
      await new Promise<void>((resolve) => setTimeout(resolve, HOLD_AFTER_COMMIT * 1000));

      // ── ENTER ──────────────────────────────────────────────────
      const newMain = getMain();
      // Pre-position newMain so its enter looks like the panel is
      // pushing the page back down into place.
      if (newMain) gsap.set(newMain, { y: PAGE_RISE });

      const enterTl = gsap.timeline();
      enterTl.to(panel, {
        yPercent: -200,
        duration: ENTER_PANEL_DURATION,
        ease: EASE,
        immediateRender: false,
      }, 0);
      if (label && pageName) {
        enterTl.to(label, {
          autoAlpha: 0,
          duration: 0.3,
          ease: 'none',
        }, 0.1);
      }
      if (newMain) {
        enterTl.to(newMain, {
          y: 0,
          duration: ENTER_PANEL_DURATION,
          ease: EASE,
        }, 0);
      }

      // Refresh ScrollTrigger now that the new layout is committed, and
      // release the lock so reveal observers can start firing as the
      // panel uncovers them (they fire in parallel with the panel
      // sliding off, not after).
      try { ScrollTrigger.refresh(); } catch {}
      endTransition();

      await enterTl;

      // Reset bookkeeping.
      gsap.set(panel, { autoAlpha: 0, yPercent: 0, willChange: '' });
      if (label) gsap.set(label, { autoAlpha: 0 });
      if (newMain) gsap.set(newMain, { clearProps: 'transform' });
      try { lenis?.start?.(); } catch {}
    };

    registerTransition(transition);
    return () => { registerTransition(null); };
  }, [registerTransition, router]);

  return (
    <div ref={overlayRef} className="page-transition" aria-hidden="true">
      <div ref={panelRef} className="page-transition__panel">
        <span
          ref={labelRef}
          className="page-transition__label u-text-style-h2 u-text-transform-uppercase"
        />
      </div>
    </div>
  );
}
