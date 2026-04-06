'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from '@/lib/gsap';

export function usePageTransition() {
  const router = useRouter();
  const isTransitioning = useRef(false);

  useEffect(() => {
    function onPageLeave(e: Event) {
      const { url } = (e as CustomEvent).detail;
      if (isTransitioning.current) return;
      isTransitioning.current = true;

      const pageMain = document.querySelector('.page_main') as HTMLElement | null;
      const perspective = document.querySelector('.page-transition_perspective') as HTMLElement | null;
      if (!pageMain || !perspective) {
        // Fallback: normal navigation
        router.push(url);
        isTransitioning.current = false;
        return;
      }

      // Stop LocomotiveScroll during transition
      window.locomotiveScroll?.stop?.();

      // 1. Capture current scroll position and page content
      const scrollY = window.scrollY || 0;

      // 2. Clone current page_main + footer into a leaving overlay
      const clone = document.createElement('div');
      clone.className = 'page-transition_leaving';
      clone.innerHTML = pageMain.innerHTML;

      // Also clone the footer (it's a sibling after page_main in page_wrap)
      const footer = pageMain.nextElementSibling;
      if (footer && footer.tagName === 'SECTION') {
        clone.appendChild(footer.cloneNode(true));
      }

      // Position clone at the scroll offset to freeze the visual
      clone.style.top = `${-scrollY}px`;

      // Compute background color from theme
      const bg = getComputedStyle(pageMain).backgroundColor || getComputedStyle(document.body).backgroundColor;
      clone.style.backgroundColor = bg;

      // 3. Insert clone into perspective container
      perspective.appendChild(clone);

      // 4. Scroll to top immediately (for the new page)
      window.scrollTo(0, 0);

      // 5. Hide the real page_main so it doesn't flash during React swap
      gsap.set(pageMain, { autoAlpha: 0 });

      // 6. Navigate — React will swap {children} inside page_main
      router.push(url);

      // 7. Wait for React to commit the new DOM, then animate
      // Double rAF ensures the browser has painted the new content
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const duration = 1.2;
          const ease = 'power3.inOut';

          // Prepare new page_main for entry
          gsap.set(pageMain, {
            autoAlpha: 1,
            xPercent: 100,
            z: -200,
            clipPath: 'rect(2% 98% 98% 2% round 1.5em)',
            transformOrigin: 'center center',
          });

          // Also hide footer during transition (it's outside page_main)
          const realFooter = pageMain.nextElementSibling as HTMLElement | null;
          if (realFooter && realFooter.tagName === 'SECTION') {
            gsap.set(realFooter, { autoAlpha: 0 });
          }

          const tl = gsap.timeline({
            onComplete: () => {
              // Cleanup
              clone.remove();
              gsap.set(pageMain, { clearProps: 'all' });
              gsap.set(perspective, { clearProps: 'all' });
              if (realFooter && realFooter.tagName === 'SECTION') {
                gsap.set(realFooter, { clearProps: 'all' });
              }

              // Restart smooth scroll
              window.locomotiveScroll?.start?.();
              window.locomotiveScroll?.update?.();

              isTransitioning.current = false;
              window.dispatchEvent(new Event('page:enter-complete'));
            },
          });

          // Leave animation — old page pushes back + slides left
          tl.to(clone, {
            z: -800,
            duration: duration * 0.75,
            ease,
            clipPath: 'rect(2% 98% 98% 2% round 1.5em)',
          }, 0);

          tl.to(clone, {
            xPercent: -120,
            duration,
            ease,
            overwrite: 'auto',
          }, 0.15);

          // Enter animation — new page slides in from right
          tl.to(pageMain, {
            xPercent: 0,
            duration,
            ease,
            overwrite: 'auto',
          }, 0.15);

          tl.to(pageMain, {
            z: 0,
            duration: duration * 0.75,
            ease,
            clipPath: 'rect(0% 100% 100% 0% round 0em)',
            overwrite: 'auto',
          }, duration * 0.4);

          // Fade footer back in near the end
          if (realFooter && realFooter.tagName === 'SECTION') {
            tl.to(realFooter, { autoAlpha: 1, duration: 0.3 }, `-=${0.3}`);
          }
        });
      });
    }

    window.addEventListener('page:leave', onPageLeave);
    return () => window.removeEventListener('page:leave', onPageLeave);
  }, [router]);
}
