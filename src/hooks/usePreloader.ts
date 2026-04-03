'use client';
import { useEffect } from 'react';
import gsap from '@/lib/gsap';
import { CustomEase } from '@/lib/gsap';

export function usePreloader() {
  useEffect(() => {
    function run() {
      if (!window.animUtils) return;

      CustomEase.create('cin', 'M0,0 C0.22,0.6 0.36,1 1,1');
      CustomEase.create('cinOut', 'M0,0 C0.64,0 0.78,0.4 1,1');
      CustomEase.create('reveal', 'M0,0 C0.62,0.05 0.01,0.99 1,1');

      const wrap = document.querySelector('[data-preloader-wrap]');
      const svgEl = document.querySelector('[data-preloader-svg]');
      const paths = gsap.utils.toArray('[data-preloader-path]') as Element[];
      const textEl = document.querySelector('[data-preloader-text]');
      const words = gsap.utils.toArray('[data-preloader-word]') as Element[];
      const endSvg = document.querySelector('[data-preloader-end-svg]');
      const endIcon = document.querySelector('[data-preloader-end-icon]');
      const endPaths = gsap.utils.toArray('[data-preloader-end-path]') as Element[];

      if (!paths.length) return;

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
        .timeline({ delay: 0.8 })
        .set(svgEl, { autoAlpha: 1 })
        .to(paths, { opacity: 1, filter: clear, duration: 0.8, stagger: 0.025, ease: 'cin' })
        .addLabel('textIn', '+=0.45')
        .set(textEl, { autoAlpha: 1 }, 'textIn')
        .to(words, { opacity: 1, filter: clear, duration: 0.85, stagger: 0.08, ease: 'cin' }, 'textIn')
        .addLabel('hold', '+=0.7')
        .to(words, { opacity: 0, filter: blur, duration: 0.55, stagger: { each: 0.03, from: 'end' }, ease: 'cinOut' }, 'hold')
        .to(paths, { opacity: 0, filter: blur, duration: 0.55, stagger: { each: 0.015, from: 'end' }, ease: 'cinOut' }, 'hold+=0.15')
        .set(endSvg, { autoAlpha: 1 }, '+=0.35')
        .to(endIcon, { opacity: 1, filter: clear, duration: 0.75, ease: 'cin' }, '+=0.3')
        .to(endPaths, { opacity: 1, filter: clear, duration: 0.65, stagger: 0.05, ease: 'cin' }, '-=0.35')
        .addLabel('endHold', '+=0.65')
        .to(endPaths, { opacity: 0, filter: blur, duration: 0.5, stagger: { each: 0.03, from: 'end' }, ease: 'cinOut' }, 'endHold')
        .to(endIcon, { opacity: 0, filter: blur, duration: 0.5, ease: 'cinOut' }, '-=0.25')
        .fromTo(
          wrap,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 1.1,
            ease: 'reveal',
            onComplete: () => {
              (wrap as HTMLElement).style.display = 'none';
              if (window.locomotiveScroll) {
                window.locomotiveScroll.start();
              } else {
                document.documentElement.style.overflow = '';
              }
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

    // No cleanup needed — preloader runs once on mount only
  }, []);
}
