// Usage:
// <StaggerLink href="/about">About Us</StaggerLink>
// <StaggerLink href="https://example.com" external>External Site</StaggerLink>
// <StaggerLink href="/contact" className="my-custom-class">Contact</StaggerLink>

'use client';

import type { AnchorHTMLAttributes } from 'react';
import TransitionLink from '@/components/ui/TransitionLink';
import CharStagger from '@/components/ui/CharStagger';

interface StaggerLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  href: string;
  children: string;
  className?: string;
  external?: boolean;
}

export default function StaggerLink({ href, children, className, external, ...rest }: StaggerLinkProps) {
  const cls = `link-stagger${className ? ` ${className}` : ''}`;

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...rest}>
        <CharStagger>{children}</CharStagger>
      </a>
    );
  }

  return (
    <TransitionLink href={href} className={cls} {...rest}>
      <CharStagger>{children}</CharStagger>
    </TransitionLink>
  );
}
