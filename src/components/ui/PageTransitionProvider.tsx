'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';

type TransitionFn = (href: string, pageName?: string) => Promise<void>;

interface PageTransitionContextValue {
  /** Called by <TransitionLink>. */
  triggerTransition: (href: string, pageName?: string) => Promise<void>;
  /** Called by <PageTransitionOverlay> on mount to register its imperative fn. */
  registerTransition: (fn: TransitionFn | null) => void;
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  // Stored on a ref instead of useState so registering doesn't re-render
  // every consumer when the overlay mounts.
  const fnRef = useRef<TransitionFn | null>(null);

  const registerTransition = useCallback((fn: TransitionFn | null) => {
    fnRef.current = fn;
  }, []);

  const triggerTransition = useCallback(async (href: string, pageName?: string) => {
    const fn = fnRef.current;
    if (fn) {
      try {
        await fn(href, pageName);
        return;
      } catch (err) {
        // Hard fall-through to a normal navigation if the transition crashes
        // for any reason — never strand the user on the current page.
        console.error('[PageTransition] transition fn threw, falling back to hard navigation', err);
      }
    }
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  }, []);

  const value = useMemo<PageTransitionContextValue>(
    () => ({ triggerTransition, registerTransition }),
    [triggerTransition, registerTransition],
  );

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  );
}

export function usePageTransitionContext(): PageTransitionContextValue {
  const ctx = useContext(PageTransitionContext);
  if (!ctx) {
    // Allow components to be used outside the provider without crashing —
    // the trigger just falls through to a normal navigation.
    return {
      triggerTransition: async (href) => {
        if (typeof window !== 'undefined') window.location.href = href;
      },
      registerTransition: () => {},
    };
  }
  return ctx;
}
