'use client';

import { useEffect, useRef } from 'react';
import { ScrollTrigger } from '@/lib/gsap';

/* ══════════════════════════════════════════════════════════════════════
   Theme Scroller — nav-only sync

   Each section owns its theme via a u-theme-* class. This hook only
   syncs the nav bar colour to match whichever section is currently
   behind the nav (i.e. at the top of the viewport).

   Trigger geometry:
     start: 'top top'    → section top reaches viewport top
     end:   'bottom top'  → section bottom leaves viewport top
   This means exactly ONE section "owns" the nav at any scroll position.
   ══════════════════════════════════════════════════════════════════════ */

const NAV_COLORS: Record<string, string> = {
  buff:       '#272726',  // dark text on light background
  light:      '#272726',
  charcoal:   '#d6d4c5',  // light text on dark background
  dark:       '#d6d4c5',
  'img-bg':   '#d6d4c5',  // light text over hero image
  'dark-blue': '#d6d4c5',
};

const DEFAULT_COLOR = '#272726';

export function useThemeScroller() {
  const currentThemeRef = useRef<string | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-theme]');
    if (sections.length === 0) return;

    const navBar = document.querySelector<HTMLElement>('[data-nav-bar]');
    if (!navBar) return;

    // Ensure smooth nav colour transition
    navBar.style.transition = 'color 0.3s ease';

    function setNavColor(themeName: string) {
      if (themeName === currentThemeRef.current) return;
      currentThemeRef.current = themeName;
      navBar!.style.color = NAV_COLORS[themeName] || DEFAULT_COLOR;
    }

    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const theme = section.getAttribute('data-theme');
      if (!theme) return;

      triggers.push(
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',       // section top hits viewport top
          end: 'bottom top',      // section bottom leaves viewport top
          onEnter: () => setNavColor(theme),
          onEnterBack: () => setNavColor(theme),
        }),
      );
    });

    /* ── Initial nav colour — match whichever section is at the top ── */
    // On page load the viewport is at scroll 0, so the first section
    // with data-theme determines the nav colour.
    const firstTheme = sections[0]?.getAttribute('data-theme') || 'buff';
    navBar.style.color = NAV_COLORS[firstTheme] || DEFAULT_COLOR;
    currentThemeRef.current = firstTheme;

    return () => {
      triggers.forEach((st) => st.kill());
      navBar.style.removeProperty('color');
      navBar.style.removeProperty('transition');
    };
  }, []);
}

export function reinitThemeScroller() {}

export function forceTheme(themeName: string) {
  const navBar = document.querySelector<HTMLElement>('[data-nav-bar]');
  if (navBar) {
    navBar.style.color = NAV_COLORS[themeName] || DEFAULT_COLOR;
  }
}
