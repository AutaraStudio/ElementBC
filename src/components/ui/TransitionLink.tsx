'use client';

import Link from 'next/link';
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { usePageTransitionContext } from './PageTransitionProvider';

type TransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  /**
   * Opt-in: when true, clicking this link plays the panel-wipe page
   * transition before the route changes. Default false during rollout.
   * Flip the default to true site-wide once QA has confirmed the behaviour
   * across every existing usage (PR review checklist: hash-only links,
   * external URLs, modified clicks, _blank).
   */
  transition?: boolean;
  /** Optional label rendered inside the panel during the wipe. */
  pageName?: string;
  external?: boolean;
};

const isExternalUrl = (href: string): boolean =>
  /^(https?:|mailto:|tel:)/i.test(href);

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, transition = false, pageName, external, onClick, target, download, ...rest }, ref) => {
    const { triggerTransition } = usePageTransitionContext();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      // Always let the consumer's onClick observe the click first.
      onClick?.(event);
      if (event.defaultPrevented) return;

      // Always fall through (browser default) for these cases:
      if (
        target === '_blank' ||
        download !== undefined ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0 ||
        external ||
        isExternalUrl(href)
      ) {
        return;
      }

      // In-page anchor: smooth-scroll via Lenis without firing the wipe.
      if (href.startsWith('#')) {
        event.preventDefault();
        if (typeof window === 'undefined') return;
        const targetEl = document.querySelector(href);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lenis = (window as any).__lenis as
          | { scrollTo?: (target: Element | number, options?: unknown) => void }
          | undefined;
        if (targetEl && lenis?.scrollTo) {
          lenis.scrollTo(targetEl);
        } else if (targetEl instanceof HTMLElement) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        try { window.history.pushState(null, '', href); } catch {}
        return;
      }

      // Opt-out — keep classic next/link behaviour for callers that
      // haven't been migrated yet.
      if (!transition) return;

      event.preventDefault();
      void triggerTransition(href, pageName);
    };

    return (
      <Link
        ref={ref}
        href={href}
        onClick={handleClick}
        target={target}
        download={download}
        {...rest}
      />
    );
  },
);

TransitionLink.displayName = 'TransitionLink';

export default TransitionLink;
