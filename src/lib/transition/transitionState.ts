/**
 * Module-level pub/sub for the page-transition + preloader lock.
 *
 * Adds/removes the `is-page-transitioning` class on <html> so that any
 * IntersectionObserver / GSAP trigger registration can short-circuit
 * while the panel (or preloader) is still covering the page. Consumers
 * call `awaitTransitionEnd()` to defer their setup until the lock
 * lifts. No React state — readable from inside arbitrary useEffects.
 */

const FLAG_CLASS = 'is-page-transitioning';
const EVENT_NAME = 'pagetransition:end';

export function isTransitioning(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains(FLAG_CLASS);
}

export function beginTransition(): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.add(FLAG_CLASS);
}

export function endTransition(): void {
  if (typeof window === 'undefined') return;
  document.documentElement.classList.remove(FLAG_CLASS);
  window.dispatchEvent(new Event(EVENT_NAME));
}

/**
 * Resolves immediately if not transitioning, otherwise on the next
 * `pagetransition:end` event. Used by reveal observers so they don't
 * fire while the panel/preloader is still occluding the page.
 */
export function awaitTransitionEnd(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (!isTransitioning()) return Promise.resolve();
  return new Promise<void>((resolve) => {
    window.addEventListener(EVENT_NAME, () => resolve(), { once: true });
  });
}
