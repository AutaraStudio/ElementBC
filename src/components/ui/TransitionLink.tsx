'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps, MouseEvent } from 'react';

type TransitionLinkProps = ComponentProps<typeof Link>;

export default function TransitionLink({ href, onClick, ...props }: TransitionLinkProps) {
  const pathname = usePathname();
  const url = typeof href === 'string' ? href : href.pathname ?? '';

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Call any existing onClick handler
    onClick?.(e);
    if (e.defaultPrevented) return;

    // Let browser handle modifier-key clicks (new tab, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    // Skip for same page, hash links, or external URLs
    if (url === pathname || url.startsWith('#') || url.startsWith('http')) return;

    // Skip if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    e.preventDefault();
    window.dispatchEvent(new CustomEvent('page:leave', { detail: { url } }));
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
