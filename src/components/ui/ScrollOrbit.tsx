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
/*  Glitch — canvas noise mask (copied from reference)                 */
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
  const ringRef = useRef<SVGCircleElement>(null);
  const centerDotRef = useRef<HTMLDivElement>(null);
  const armsRef = useRef<HTMLDivElement>(null);

  const contentCount = stats.length;
  const totalArms = Math.max(contentCount * 2, 16);
  const mirrorCount = totalArms - contentCount;

  /* Scroll budget as a multiplier — section height = budget × 100vh */
  const budgetMultiplier = Math.max(contentCount, 6);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    const ring = ringRef.current;
    const centerDot = centerDotRef.current;
    const armsWrap = armsRef.current;
    if (!section || !sticky || !ring || !centerDot || !armsWrap) return;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const N = contentCount;

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
      const ringLen = ring.getTotalLength ? ring.getTotalLength() : 311;
      gsap.set(ring, { strokeDasharray: ringLen, strokeDashoffset: ringLen });
      gsap.set(armLines, { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(armDots, { opacity: 0 });
      gsap.set(armContents, { opacity: 0 });
      gsap.set(centerDot, { opacity: 0, scale: 0 });
      gsap.set(armsWrap, { rotation: 0, transformOrigin: '50% 50%', force3D: true });

      /* ── Rotation amount ── */
      const armSpacing = 360 / totalArms;
      const rotationDeg = -((N - 0.5) * armSpacing);

      /* ── Line draw order — top of screen first ── */
      const lineDrawOrder: number[] = Array.from(
        { length: totalArms },
        (_, i) => i
      ).sort((a, b) => {
        const angleA = ((a / totalArms) * 360 - 270 + 360) % 360;
        const angleB = ((b / totalArms) * 360 - 270 + 360) % 360;
        return angleA - angleB;
      });
      const orderedLines = lineDrawOrder.map((i) => armLines[i]);

      /* ── Highlight — rotation proxy ── */
      const initialAngles = armContents.map((_, i) => (i / totalArms) * 360);
      const rotProxy = { r: 0 };

      function updateHighlight() {
        const rot = rotProxy.r;
        const u = armContents.map((_, i) => {
          let angle = (initialAngles[i] + rot) % 360;
          if (angle > 180) angle -= 360;
          if (angle < -180) angle += 360;
          const abs = Math.abs(angle);

          let opacity: number, dotSize: number;
          if (abs <= 12) {
            opacity = 1;
            dotSize = 22;
          } else if (abs <= 40) {
            const f = (abs - 12) / 28;
            opacity = 1 - f * 0.85;
            dotSize = 22 - f * 14;
          } else {
            opacity = 0.15;
            dotSize = 8;
          }
          return { opacity, dotSize };
        });
        gsap.set(armContents, { opacity: (i: number) => u[i].opacity });
        gsap.set(armDots, {
          width: (i: number) => u[i].dotSize,
          height: (i: number) => u[i].dotSize,
        });
      }

      /* ── Scrubbed timeline — NO PIN ──
         The section itself provides the scroll budget via its CSS height.
         The sticky viewport keeps the canvas in view.
         trigger: section, start: top top, end: bottom bottom.
      */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });

      /* ── DRAW IN ── */
      tl.to(ring, { strokeDashoffset: 0, duration: 0.08, ease: 'none' }, 0.01);
      tl.to(centerDot, { opacity: 1, scale: 1, duration: 0.04, ease: 'none' }, 0.05);
      tl.to(orderedLines, {
        scaleX: 1, duration: 0.08, ease: 'none',
        stagger: { each: 0.016, from: 'start' },
      }, 0.0);

      /* ── TEXT REVEAL ── */
      tl.to(armDots, {
        opacity: 1, duration: 0.025, ease: 'none', stagger: 0.002,
      }, `>${-0.10}`);
      tl.to(armContents[0], { opacity: 1, duration: 0.02 }, '<0.01');
      if (armContents.length > 1) {
        tl.to(armContents.slice(1), {
          opacity: 0.15, duration: 0.02, stagger: 0.001,
        }, '<');
      }

      /* ── ROTATE — proxy + visual in parallel ── */
      tl.to(rotProxy, {
        r: rotationDeg, ease: 'linear', duration: 0.65,
        immediateRender: false, onUpdate: updateHighlight,
      });
      tl.to(armsWrap, {
        rotation: rotationDeg, ease: 'linear', duration: 0.65,
        immediateRender: false,
      }, '<');

      /* ── DRAW OUT ── */
      tl.to([...armContents, ...armDots], {
        opacity: 0, duration: 0.04, stagger: 0.001,
      });
      tl.to([...orderedLines].reverse(), {
        scaleX: 0, duration: 0.05, ease: 'none',
        stagger: { each: 0.008, from: 'start' },
      }, '<0.02');
      tl.to(centerDot, { opacity: 0, scale: 0, duration: 0.03 }, '<0.02');
      tl.to(ring, {
        strokeDashoffset: ringLen, duration: 0.08, ease: 'none',
      }, '<0.02');

      /* ── Glitch ── */
      const ringEl = ring as unknown as HTMLElement;
      const ringNoise = () => {
        const u = makeNoise(gsap.utils.random(0.1, 0.35));
        ringEl.style.maskImage = ringEl.style.webkitMaskImage = `url(${u})`;
      };
      const ringClear = () => {
        ringEl.style.maskImage = ringEl.style.webkitMaskImage = 'none';
      };
      const glitchTl = gsap.timeline({ repeat: -1 });
      glitchTl
        .to({}, { delay: gsap.utils.random(3, 9), duration: gsap.utils.random(0.15, 0.4) })
        .call(ringNoise)
        .to({}, { duration: gsap.utils.random(0.04, 0.15) })
        .call(ringNoise)
        .to({}, { duration: gsap.utils.random(0.06, 0.12) })
        .call(ringClear);

      ScrollTrigger.refresh();

      return () => {
        glitchTl.kill();
        tl.kill();
        gsap.killTweensOf(armLines);
        gsap.killTweensOf(armDots);
        gsap.killTweensOf(armContents);
        gsap.killTweensOf(ring);
        gsap.killTweensOf(centerDot);
        gsap.killTweensOf(armsWrap);
      };
    });

    return () => { mm.revert(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      data-theme={theme}
      className={styles['scroll-orbit_wrap']}
      style={{ height: `${budgetMultiplier * 100}vh` }}
    >
      {/* Heading — in normal flow, scrolls away naturally */}
      <div className={styles['scroll-orbit_heading-wrap']}>
        <div className={styles['scroll-orbit_heading-inner']}>
          <h2 className={styles['scroll-orbit_heading']}>{heading}</h2>
        </div>
        <div className={styles['scroll-orbit_heading-inner']}>
          <p className={styles['scroll-orbit_subheading']}>{subheading}</p>
        </div>
      </div>

      {/* Sticky viewport — stays in view while section scrolls */}
      <div ref={stickyRef} className={styles['scroll-orbit_sticky']}>

        {/* Canvas — circle, ring, arms */}
        <div className={styles['scroll-orbit_canvas']}>
          <div className={styles['scroll-orbit_circle-wrap']}>
            <svg
              className={styles['scroll-orbit_ring-svg']}
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                ref={ringRef}
                data-orbit-ring=""
                className={styles['scroll-orbit_ring']}
                cx="50" cy="50" r="49.5"
              />
            </svg>
            <div
              ref={centerDotRef}
              data-orbit-center=""
              className={styles['scroll-orbit_center-dot']}
            />
            <div
              ref={armsRef}
              data-orbit-arms=""
              className={styles['scroll-orbit_arms-wrap']}
            >
              {stats.map((stat, i) => {
                const angle = (i / totalArms) * 360;
                return (
                  <div
                    key={`content-${i}`}
                    className={styles['scroll-orbit_arm']}
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div data-orbit-line="" className={styles['scroll-orbit_arm-line']} />
                    <div data-orbit-dot="" className={styles['scroll-orbit_arm-dot']} />
                    <div data-orbit-content="" className={styles['scroll-orbit_arm-content']}>
                      <p className={`${styles['scroll-orbit_arm-value']} u-text-style-h2 u-text-transform-uppercase`}>
                        {stat.statLabel}
                      </p>
                      <p className={`${styles['scroll-orbit_arm-label']} u-text-style-large`}>
                        {stat.statValue}
                      </p>
                    </div>
                  </div>
                );
              })}
              {Array.from({ length: mirrorCount }, (_, j) => {
                const angle = ((contentCount + j) / totalArms) * 360;
                return (
                  <div
                    key={`mirror-${j}`}
                    className={styles['scroll-orbit_arm']}
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div data-orbit-line="" className={styles['scroll-orbit_arm-line']} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile stat list (visible only at ≤767px via CSS) */}
      <ul className={styles['scroll-orbit_mobile-list']}>
        {stats.map((stat, i) => (
          <li key={i} className={styles['scroll-orbit_mobile-item']}>
            <p className={styles['scroll-orbit_mobile-value']}>{stat.statLabel}</p>
            <p className={styles['scroll-orbit_mobile-label']}>{stat.statValue}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
