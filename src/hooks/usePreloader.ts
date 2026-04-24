'use client';
import { useEffect } from 'react';
import gsap from '@/lib/gsap';
import { CustomEase } from '@/lib/gsap';

export function usePreloader(pathname: string) {
  useEffect(() => {
    // Always create custom eases — they're used by other animations too
    CustomEase.create('cin', 'M0,0 C0.22,0.6 0.36,1 1,1');
    CustomEase.create('cinOut', 'M0,0 C0.64,0 0.78,0.4 1,1');
    CustomEase.create('reveal', 'M0,0 C0.62,0.05 0.01,0.99 1,1');

    const shouldPlay = pathname === '/' && !sessionStorage.getItem('preloaderDone');

    if (!shouldPlay) {
      // Skip preloader — hide wraps immediately and fire the event
      const wrap = document.querySelector('[data-preloader-wrap]') as HTMLElement | null;
      const wrap2 = document.querySelector('[data-preloader2-wrap]') as HTMLElement | null;
      if (wrap) wrap.style.setProperty('display', 'none', 'important');
      if (wrap2) wrap2.style.setProperty('display', 'none', 'important');

      // Use rAF to ensure useScrollReveal's preloader:complete listener is registered first
      requestAnimationFrame(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)._preloaderComplete = true;
        window.dispatchEvent(new Event('preloader:complete'));
      });
      return;
    }

    function run() {
      if (!window.animUtils) return;

      const wrap = document.querySelector('[data-preloader-wrap]');
      const svgEl = document.querySelector('[data-preloader-svg]');
      const paths = gsap.utils.toArray('[data-preloader-path]') as Element[];
      const textEl = document.querySelector('[data-preloader-text]');
      const words = gsap.utils.toArray('[data-preloader-word]') as Element[];
      const endSvg = document.querySelector('[data-preloader-end-svg]');
      const endIcon = document.querySelector('[data-preloader-end-icon]');
      const endPaths = gsap.utils.toArray('[data-preloader-end-path]') as Element[];
      // glitch removed

      if (!paths.length) return;

      const roguePaths = gsap.utils.toArray('[data-preloader-rogue]') as Element[];
      const normalPaths = paths.filter((p) => !roguePaths.includes(p));

      const blur = 'blur(4px)';
      const clear = 'blur(0px)';

      gsap.set(paths, { opacity: 0, filter: blur });
      gsap.set(words, { opacity: 0, filter: blur });
      gsap.set(endIcon, { opacity: 0, filter: blur });
      gsap.set(endPaths, { opacity: 0, filter: blur });

      if (window.locomotiveScroll) {
        window.locomotiveScroll.stop();
      } else {
        document.documentElement.style.overflow = 'hidden';
      }

      gsap
        .timeline({ delay: 0.5 })
        .set(svgEl, { autoAlpha: 1 })
        // All paths fade in together
        .to(paths, { opacity: 1, filter: clear, duration: 0.6, stagger: 0.018, ease: 'cin' })
        // Shimmer/flicker on rogue paths — multiple stutters
        .to(roguePaths, { opacity: 0.3, duration: 0.1, ease: 'power2.in' })
        .to(roguePaths, { opacity: 0.8, duration: 0.08, ease: 'power1.out' })
        .to(roguePaths, { opacity: 0.15, duration: 0.07, ease: 'power2.in' })
        .to(roguePaths, { opacity: 0.9, duration: 0.1, ease: 'power1.out' })
        .to(roguePaths, { opacity: 0.4, duration: 0.06, ease: 'power2.in' })
        .to(roguePaths, { opacity: 1, duration: 0.2, ease: 'power1.out' })
        .addLabel('textIn', '+=0.15')
        .set(textEl, { autoAlpha: 1 }, 'textIn')
        .to(words, { opacity: 1, filter: clear, duration: 0.6, stagger: 0.06, ease: 'cin' }, 'textIn')
        .addLabel('hold', '+=0.4')
        .to(words, { opacity: 0, filter: blur, duration: 0.4, stagger: { each: 0.025, from: 'end' }, ease: 'cinOut' }, 'hold')
        .to(paths, { opacity: 0, filter: blur, duration: 0.4, stagger: { each: 0.01, from: 'end' }, ease: 'cinOut' }, 'hold+=0.1')
        .set(endSvg, { autoAlpha: 1 }, '+=0.2')
        .to(endIcon, { opacity: 1, filter: clear, duration: 0.5, ease: 'cin' }, '+=0.15')
        .to(endPaths, { opacity: 1, filter: clear, duration: 0.45, stagger: 0.035, ease: 'cin' }, '-=0.25')
        .addLabel('endHold', '+=0.4')
        .to(endPaths, { opacity: 0, filter: blur, duration: 0.35, stagger: { each: 0.025, from: 'end' }, ease: 'cinOut' }, 'endHold')
        .to(endIcon, { opacity: 0, filter: blur, duration: 0.35, ease: 'cinOut' }, '-=0.2')
        .fromTo(
          wrap,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 1.1,
            ease: 'reveal',
            onComplete: () => {
              (wrap as HTMLElement).style.setProperty('display', 'none', 'important');
              if (window.locomotiveScroll) {
                window.locomotiveScroll.start();
              } else {
                document.documentElement.style.overflow = '';
              }
              sessionStorage.setItem('preloaderDone', '1');
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (window as any)._preloaderComplete = true;
              window.dispatchEvent(new Event('preloader:complete'));
            },
          },
          '+=0.3'
        );
    }

    if (window.animUtils) {
      run();
    } else {
      window.addEventListener('animUtils:ready', run, { once: true });
    }

    // Safety net: if the preloader timeline never completes for any reason
    // (GSAP error, HMR glitch, mobile browser quirk), force-fire the event
    // anyway after 12 seconds so hero animations queued via afterPreloader()
    // don't get stuck forever.
    const failsafe = setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any)._preloaderComplete) return;
      const wrap = document.querySelector('[data-preloader-wrap]') as HTMLElement | null;
      if (wrap) wrap.style.setProperty('display', 'none', 'important');
      if (window.locomotiveScroll) window.locomotiveScroll.start();
      else document.documentElement.style.overflow = '';
      sessionStorage.setItem('preloaderDone', '1');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)._preloaderComplete = true;
      window.dispatchEvent(new Event('preloader:complete'));
    }, 12000);

    return () => { clearTimeout(failsafe); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
