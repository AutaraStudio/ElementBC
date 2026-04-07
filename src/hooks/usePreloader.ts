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
      if (wrap) wrap.style.display = 'none';
      if (wrap2) wrap2.style.display = 'none';

      // Use rAF to ensure useScrollReveal's preloader:complete listener is registered first
      requestAnimationFrame(() => {
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
      const roguePaths = gsap.utils.toArray('[data-preloader-rogue]') as Element[];

      if (!paths.length) return;

      const blur = 'blur(4px)';
      const clear = 'blur(0px)';
      const brandOrange = getComputedStyle(document.documentElement)
        .getPropertyValue('--_red---swatch--brand-500')
        .trim();
      const defaultPathColor = gsap.getProperty(paths[0], 'color') as string;

      gsap.set(paths, { opacity: 0, filter: blur });
      gsap.set(words, { opacity: 0, filter: blur });
      gsap.set(endIcon, { opacity: 0, filter: blur });
      gsap.set(endPaths, { opacity: 0, filter: blur });

      // Rogue paths: stay hidden during grid fade-in, revealed individually with text
      gsap.set(roguePaths, { opacity: 0, filter: 'blur(6px)' });

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
        // Rogue paths: staggered reveal in orange, blur pulls focus, colour drains to default
        // Each path is offset across the word-reveal window so they feel connected to the text rhythm
        .call(() => {
          // Hand-tuned offsets (seconds after textIn) — spread across the word reveal window
          const offsets = [0.08, 0.22, 0.38, 0.56];

          roguePaths.forEach((path, i) => {
            const t = offsets[i] ?? offsets[offsets.length - 1];

            // Set orange colour just before this path appears
            gsap.set(path, { color: brandOrange });

            // Fade in: opacity arrives first
            gsap.to(path, {
              opacity: 1,
              duration: 0.45,
              ease: 'sine.out',
              delay: t,
            });

            // Blur clears slightly after opacity — focus pulls into place
            gsap.to(path, {
              filter: clear,
              duration: 0.55,
              ease: 'power2.out',
              delay: t + 0.1,
            });

            // Colour drains from orange to default — slowest layer, soft ease
            gsap.to(path, {
              color: defaultPathColor,
              duration: 0.8,
              ease: 'sine.inOut',
              delay: t + 0.25,
            });
          });
        }, undefined, 'textIn')
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
              sessionStorage.setItem('preloaderDone', '1');
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
