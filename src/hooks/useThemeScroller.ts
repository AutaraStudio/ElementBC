'use client';

import { useEffect, useRef } from 'react';
import gsap from '@/lib/gsap';
import { ScrollTrigger } from '@/lib/gsap';

// CSS custom properties to transition between themes
const THEME_VARS = [
  '--_theme---background',
  '--_theme---text',
  '--_theme---background-2',
  '--_theme---svg-accent',
  '--_theme---border',
  '--_theme---button-primary--text',
  '--_theme---button-primary--text-hover',
  '--_theme---button-primary--background',
  '--_theme---button-primary--background-hover',
  '--_theme---button-primary--border',
  '--_theme---button-primary--border-hover',
  '--_theme---button-secondary--text',
  '--_theme---button-secondary--text-hover',
  '--_theme---button-secondary--background',
  '--_theme---button-secondary--background-hover',
  '--_theme---button-secondary--border',
  '--_theme---button-secondary--border-hover',
  '--_theme---text-link--border',
  '--_theme---text-link--text',
  '--_theme---text-link--text-hover',
  '--_theme---nav--background',
  '--_theme---text-link--border-hover',
  '--_theme---image-reveal',
  '--_theme---accent-1',
  '--_theme---accent-2',
  '--_theme---selection--background',
  '--_theme---selection--text',
  '--_theme---nav-link--hover',
];

/**
 * Resolves the computed color values for a given theme by temporarily
 * applying the u-theme-X class to a hidden element.
 */
function resolveThemeColors(themeName: string): Record<string, string> {
  const probe = document.createElement('div');
  probe.className = `u-theme-${themeName}`;
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';
  document.body.appendChild(probe);

  const computed = getComputedStyle(probe);
  const colors: Record<string, string> = {};
  for (const v of THEME_VARS) {
    colors[v] = computed.getPropertyValue(v).trim();
  }

  document.body.removeChild(probe);
  return colors;
}

// Cache resolved theme colors
const themeCache: Record<string, Record<string, string>> = {};

function getThemeColors(themeName: string): Record<string, string> {
  if (!themeCache[themeName]) {
    themeCache[themeName] = resolveThemeColors(themeName);
  }
  return themeCache[themeName];
}

/**
 * Reads current computed values of theme vars from the root element.
 */
function getCurrentRootColors(): Record<string, string> {
  const computed = getComputedStyle(document.documentElement);
  const vals: Record<string, string> = {};
  for (const v of THEME_VARS) {
    vals[v] = computed.getPropertyValue(v).trim();
  }
  return vals;
}

export function useThemeScroller() {
  const currentThemeRef = useRef<string | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-theme]');
    if (sections.length === 0) return;

    const root = document.documentElement;

    function applyTheme(themeName: string) {
      if (themeName === currentThemeRef.current) return;
      currentThemeRef.current = themeName;

      const targetColors = getThemeColors(themeName);
      const startColors = getCurrentRootColors();

      // Kill any in-progress tween
      if (tweenRef.current) tweenRef.current.kill();

      // Build per-variable GSAP color interpolators
      const interpolators: Record<string, (t: number) => string> = {};
      for (const v of THEME_VARS) {
        const from = startColors[v] || 'transparent';
        const to = targetColors[v] || 'transparent';
        interpolators[v] = gsap.utils.interpolate(from, to) as (t: number) => string;
      }

      const proxy = { progress: 0 };

      tweenRef.current = gsap.to(proxy, {
        progress: 1,
        duration: 0.3,
        ease: 'power1.inOut',
        onUpdate() {
          const t = proxy.progress;
          for (const v of THEME_VARS) {
            root.style.setProperty(v, interpolators[v](t));
          }
        },
      });
    }

    // Use ScrollTrigger for each section
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const theme = section.getAttribute('data-theme');
      if (!theme) return;

      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 75%',
        end: 'bottom 25%',
        onEnter: () => applyTheme(theme),
        onEnterBack: () => applyTheme(theme),
      });

      triggers.push(st);
    });

    // Set initial theme immediately (no animation) from first section
    const firstSection = sections[0];
    const firstTheme = firstSection?.getAttribute('data-theme');
    if (firstTheme) {
      const colors = getThemeColors(firstTheme);
      for (const v of THEME_VARS) {
        root.style.setProperty(v, colors[v]);
      }
      currentThemeRef.current = firstTheme;
    }

    return () => {
      triggers.forEach((st) => st.kill());
      if (tweenRef.current) tweenRef.current.kill();
      for (const v of THEME_VARS) {
        root.style.removeProperty(v);
      }
    };
  }, []);
}

/**
 * Re-initialize theme scroller after client-side navigation.
 */
export function reinitThemeScroller() {
  Object.keys(themeCache).forEach((k) => delete themeCache[k]);
}
