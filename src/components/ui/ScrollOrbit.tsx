'use client';

import { useEffect, useRef } from 'react';
import gsap from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';
import styles from './ScrollOrbit.module.css';
import type { OrbitStatItem } from '@/lib/sanity/queries';

/* ------------------------------------------------------------------ */
/*  Props                                                              */
/* ------------------------------------------------------------------ */
interface ScrollOrbitProps {
  stats: OrbitStatItem[];
  heading: string;
  subheading: string;
  theme?: string;
}

/* ------------------------------------------------------------------ */
/*  Glitch — canvas noise mask                                         */
/* ------------------------------------------------------------------ */
function makeNoise(d = 0.2): string {
  const c = document.createElement('canvas');
  c.width = c.height = 400;
  const ctx = c.getContext('2d')!;
  for (let y = 0; y < 400; y += 100)
    for (let x = 0; x < 400; x += 100)
      if (Math.random() > d) {
        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, 100, 100);
      }
  return c.toDataURL();
}

/* Vertical spacing between arms (rem) */
const ARM_SPACING_REM = 18;

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function ScrollOrbit({
  stats,
  heading,
  subheading,
  theme = 'charcoal',
}: ScrollOrbitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const vertLineRef = useRef<HTMLDivElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const armsRef = useRef<HTMLDivElement>(null);

  const contentCount = stats.length;

  /* Scroll budget as a multiplier — section height = budget × 100vh */
  const budgetMultiplier = Math.max(contentCount, 6) * 0.7;

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const vertLine = vertLineRef.current;
    const topLine = topLineRef.current;
    const armsWrap = armsRef.current;
    if (!section || !sticky || !vertLine || !topLine || !armsWrap) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preloaderDone = !!(window as any)._preloaderComplete;

    function setup() {
      if (!section || !sticky || !vertLine || !topLine || !armsWrap) return;
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        const N = contentCount;
        const rem = parseFloat(
          getComputedStyle(document.documentElement).fontSize
        );
        const armSpacing = ARM_SPACING_REM * rem;
        const totalTravel = (N - 1) * armSpacing;

        const armLines = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll('[data-orbit-line]')
        );
        const armDots = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll('[data-orbit-dot]')
        );
        const armContents = gsap.utils.toArray<HTMLElement>(
          section.querySelectorAll('[data-orbit-content]')
        );

        /* ── Initial hidden state ── */
        gsap.set(vertLine, { scaleY: 0, transformOrigin: 'center top' });
        gsap.set(topLine, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(armLines, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(armDots, { opacity: 0, scale: 1 });
        gsap.set(armContents, { opacity: 0.3 });
        gsap.set(armsWrap, { y: 0, force3D: true });

        /* ── Highlight — position proxy ── */
        const posProxy = { y: 0 };
        const INACTIVE_OPACITY = 0.3;

        function updateHighlight() {
          const curY = posProxy.y;
          armContents.forEach((el, i) => {
            const dist = Math.abs(i * armSpacing + curY);
            const norm = dist / armSpacing;

            let contentOpacity: number, dotScale: number;
            if (norm <= 0.4) {
              /* At center — full colour */
              contentOpacity = 1;
              dotScale = 22 / 8;
            } else if (norm <= 0.75) {
              /* Transition zone */
              const f = (norm - 0.4) / 0.35;
              contentOpacity = 1 - f * (1 - INACTIVE_OPACITY);
              dotScale = (22 - f * 14) / 8;
            } else {
              /* Inactive — dimmed but visible */
              contentOpacity = INACTIVE_OPACITY;
              dotScale = 1;
            }

            gsap.set(el, { opacity: contentOpacity });
            gsap.set(armDots[i], { scale: dotScale });
          });
        }

        /* ── Scrubbed timeline — NO PIN ──
           The section itself provides the scroll budget via its CSS height.
           The sticky viewport keeps the canvas in view.
        */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        /* ── DRAW IN ── */
        tl.to(
          topLine,
          { scaleX: 1, duration: 0.08, ease: 'none' },
          0.0
        );
        tl.to(
          vertLine,
          { scaleY: 1, duration: 0.08, ease: 'none' },
          0.01
        );
        tl.to(
          armLines,
          {
            scaleX: 1,
            duration: 0.08,
            ease: 'none',
            stagger: { each: 0.016, from: 'start' },
          },
          0.02
        );

        /* ── DOT + TEXT REVEAL ── */
        tl.to(
          armDots,
          { opacity: 1, duration: 0.025, ease: 'none', stagger: 0.002 },
          `>${-0.1}`
        );
        tl.to(
          armContents,
          {
            opacity: (i: number) => (i === 0 ? 1 : 0.3),
            duration: 0.025,
            stagger: 0.002,
          },
          '<0.01'
        );

        /* ── TRANSLATE — proxy + visual in parallel ── */
        tl.to(posProxy, {
          y: -totalTravel,
          ease: 'linear',
          duration: 0.65,
          immediateRender: false,
          onUpdate: updateHighlight,
        });
        tl.to(
          armsWrap,
          {
            y: -totalTravel,
            ease: 'linear',
            duration: 0.65,
            immediateRender: false,
          },
          '<'
        );

        /* ── DRAW OUT ── */
        tl.to([...armContents, ...armDots], {
          opacity: 0,
          duration: 0.04,
          stagger: 0.001,
        });
        tl.to(
          [...armLines].reverse(),
          {
            scaleX: 0,
            duration: 0.05,
            ease: 'none',
            stagger: { each: 0.008, from: 'start' },
          },
          '<0.02'
        );
        tl.to(
          vertLine,
          { scaleY: 0, duration: 0.08, ease: 'none' },
          '<0.02'
        );
        tl.to(
          topLine,
          { scaleX: 0, duration: 0.08, ease: 'none' },
          '<'
        );

        /* ── Glitch on vertical line ── */
        const lineNoise = () => {
          const u = makeNoise(gsap.utils.random(0.1, 0.35));
          vertLine.style.maskImage = vertLine.style.webkitMaskImage = `url(${u})`;
        };
        const lineClear = () => {
          vertLine.style.maskImage = vertLine.style.webkitMaskImage = 'none';
        };
        const glitchTl = gsap.timeline({ repeat: -1 });
        glitchTl
          .to(
            {},
            {
              delay: gsap.utils.random(3, 9),
              duration: gsap.utils.random(0.15, 0.4),
            }
          )
          .call(lineNoise)
          .to({}, { duration: gsap.utils.random(0.04, 0.15) })
          .call(lineNoise)
          .to({}, { duration: gsap.utils.random(0.06, 0.12) })
          .call(lineClear);

        ScrollTrigger.refresh();

        return () => {
          lineClear();
          glitchTl.kill();
          tl.kill();
          gsap.killTweensOf(armLines);
          gsap.killTweensOf(armDots);
          gsap.killTweensOf(armContents);
          gsap.killTweensOf(vertLine);
          gsap.killTweensOf(topLine);
          gsap.killTweensOf(armsWrap);
        };
      });

      return () => {
        mm.revert();
      };
    } // end setup()

    let cleanupFn: (() => void) | undefined;

    if (preloaderDone) {
      // Client-side navigation — defer slightly for Lenis proxy refresh
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
        cleanupFn = setup();
      }, 350);
      return () => {
        clearTimeout(timer);
        cleanupFn?.();
      };
    } else {
      const handler = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)._preloaderComplete = true;
        cleanupFn = setup();
      };
      window.addEventListener('preloader:complete', handler, { once: true });
      return () => {
        window.removeEventListener('preloader:complete', handler);
        cleanupFn?.();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme={theme}
      className={`${styles['scroll-orbit_wrap']} u-theme-${theme}`}
      style={{ height: `${budgetMultiplier * 100}vh` }}
    >
      {/* Heading — in normal flow, scrolls away naturally */}
      <div className={styles['scroll-orbit_heading-wrap']}>
        <div className={styles['scroll-orbit_heading-inner']}>
          <h2
            data-split="word"
            className={`${styles['scroll-orbit_heading']} u-text-style-h1 u-text-transform-uppercase`}
          >
            {heading}
          </h2>
        </div>
        <div className={styles['scroll-orbit_heading-inner']}>
          <p
            data-split="line"
            className={`${styles['scroll-orbit_subheading']} u-text-style-main`}
          >
            {subheading}
          </p>
        </div>
      </div>

      {/* Sticky viewport — stays in view while section scrolls */}
      <div ref={stickyRef} className={styles['scroll-orbit_sticky']}>
        <div className={styles['scroll-orbit_canvas']}>
          {/* Top horizontal line — draws in with the section */}
          <div
            ref={topLineRef}
            className={styles['scroll-orbit_top-line']}
          />

          {/* Vertical line */}
          <div
            ref={vertLineRef}
            className={styles['scroll-orbit_vert-line']}
          />

          {/* Arms — stacked vertically, translate up on scroll */}
          <div
            ref={armsRef}
            className={styles['scroll-orbit_arms-wrap']}
          >
            {stats.map((stat, i) => (
              <div
                key={`content-${i}`}
                className={styles['scroll-orbit_arm']}
                style={{ top: `${i * ARM_SPACING_REM}rem` }}
              >
                <div
                  data-orbit-line=""
                  className={styles['scroll-orbit_arm-line']}
                />
                <div
                  data-orbit-dot=""
                  className={styles['scroll-orbit_arm-dot']}
                />
                <div
                  data-orbit-content=""
                  className={styles['scroll-orbit_arm-content']}
                >
                  <p
                    className={`${styles['scroll-orbit_arm-value']} u-text-style-h2 u-text-transform-uppercase`}
                  >
                    {stat.statLabel}
                  </p>
                  <p
                    className={`${styles['scroll-orbit_arm-label']} u-text-style-main`}
                  >
                    {stat.statValue}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile stat list (visible only at ≤767px via CSS) */}
      <ul className={styles['scroll-orbit_mobile-list']}>
        {stats.map((stat, i) => (
          <li key={i} className={styles['scroll-orbit_mobile-item']}>
            <p
              className={`${styles['scroll-orbit_mobile-value']} u-text-style-h3 u-text-transform-uppercase`}
            >
              {stat.statLabel}
            </p>
            <p
              className={`${styles['scroll-orbit_mobile-label']} u-text-style-main`}
            >
              {stat.statValue}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
