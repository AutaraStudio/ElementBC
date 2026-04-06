import Link from 'next/link';
import type { ComponentProps } from 'react';

type TransitionLinkProps = ComponentProps<typeof Link>;

export default function TransitionLink(props: TransitionLinkProps) {
  return <Link {...props} />;
}
