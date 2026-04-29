'use client';

import Link from 'next/link';
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { usePageTransitionContext } from './PageTransitionProvider';

type TransitionLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  /**
   * Default true: every internal link plays the panel wipe before the
   * route changes. Pass `transition={false}` to skip the wipe for a
   * specific call site. The Link's other safety branches (external URL,
   * hash anchors, `_blank`, modified clicks, download) bypass the wipe
   * automatically regardless of this flag.
   */
  transition?: boolean;
  /** Optional label rendered inside the panel during the wipe. */
  pageName?: string;
  external?: boolean;
};

const isExternalUrl = (href: string): boolean =>
  /^(https?:|mailto:|tel:)/i.test(href);

/**
 * Best-effort label for the panel when the caller hasn't passed an explicit
 * pageName. Maps the first path segment to a friendly title so every
 * TransitionLink shows a label, not just the mega-menu canaries.
 */
const PAGE_LABELS: Record<string, string> = {
  '': 'Home',
  about: 'About',
  contact: 'Contact',
  'case-studies': 'Case Studies',
  'privacy-policy': 'Privacy Policy',
  'terms-conditions': 'Terms & Conditions',
};

function defaultPageName(href: string): string | undefined {
  try {
    const path = href.split(/[?#]/)[0] ?? '';
    const segments = path.split('/').filter(Boolean);
    // /case-studies/<slug>  → use "Case Study" so we don't show raw slugs.
    if (segments[0] === 'case-studies' && segments.length > 1) return 'Case Study';
    const first = segments[0] ?? '';
    return PAGE_LABELS[first];
  } catch {
    return undefined;
  }
}

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ href, transition = true, pageName, external, onClick, target, download, ...rest }, ref) => {
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
      void triggerTransition(href, pageName ?? defaultPageName(href));
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
