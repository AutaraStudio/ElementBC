'use client';

import Link from 'next/link';
import TransitionLink from '@/components/ui/TransitionLink';
import { usePathname } from 'next/navigation';
import type { SanityNavLink } from '@/lib/sanity/queries';
import FooterNavSvg from '@/components/ui/svgs/FooterNavSvg';
import CharStagger from '@/components/ui/CharStagger';
import StaggerLink from '@/components/ui/StaggerLink';

const fallbackNavLinks: SanityNavLink[] = [
  { label: 'Home', url: '/' },
  { label: 'Case Studies', url: '/case-studies' },
  { label: 'About & Team', url: '/about' },
  { label: 'Contact', url: '/contact' },
];

interface FooterProps {
  navLinks?: SanityNavLink[];
  legalLinks?: SanityNavLink[];
  builtByText?: string;
  builtByUrl?: string;
}

export default function Footer({ navLinks: sanityNavLinks, legalLinks, builtByText, builtByUrl }: FooterProps) {
  const pathname = usePathname();
  const footerNavLinks = sanityNavLinks ?? fallbackNavLinks;

  return (
    <section data-theme="charcoal" className="footer_main-wrap u-theme-charcoal">
      <div className="footer_bg-wrap u-position-absolute">
        <FooterNavSvg className="footer_bg-svg" />
      </div>

      <div className="footer_main-contain u-container">
        <div className="footer_main-layout u-grid-custom u-min-height-screen">
          <div className="footer_main-col u-column-span-5">
            <div className="footer_main_col-inner u-height-full u-flex-vertical-nowrap u-justify-content-end u-gap-6">

              <ul data-stagger-start="top 95%" data-stagger="" role="list" className="footer_main_nav-list u-flex-vertical-nowrap u-gap-4">
                {footerNavLinks.map(({ label, url }) => {
                  const isActive = url !== '#' && pathname === url;
                  return (
                    <li key={url + label} data-stagger-item="" className="footer_main_nav-item">
                      <TransitionLink
                        href={url}
                        aria-current={isActive ? 'page' : undefined}
                        className={`footer_main_nav-link w-inline-block${isActive ? ' w--current' : ''}`}
                      >
                        <div className="footer_main_nav-text u-text-style-h2 u-text-transform-uppercase">
                          <CharStagger>{label}</CharStagger>
                        </div>
                      </TransitionLink>
                    </li>
                  );
                })}
              </ul>

              <div className="footer_main_legal-wrap">
                <div data-stagger-start="top 95%" data-stagger="" className="footer_main_legal-inner u-flex-horizontal-nowrap u-alignment-start u-gap-3">
                  {legalLinks ? legalLinks.map(({ label, url }) => (
                    <StaggerLink key={url + label} href={url} className="footer_main_legal-link u-text-style-x-small u-text-transform-uppercase">{label}</StaggerLink>
                  )) : (
                    <>
                      <StaggerLink href="#" className="footer_main_legal-link u-text-style-x-small u-text-transform-uppercase">Privacy Policy</StaggerLink>
                      <StaggerLink href="#" className="footer_main_legal-link u-text-style-x-small u-text-transform-uppercase">Terms & Conditions</StaggerLink>
                    </>
                  )}
                  {(builtByText || builtByUrl) && (
                    <StaggerLink href={builtByUrl ?? '#'} className="footer_main_legal-link u-text-style-x-small u-text-transform-uppercase">{builtByText ?? 'Built by'}</StaggerLink>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div data-wf--spacer--variant="small" className="u-section-spacer is-small u-ignore-trim" />
    </section>
  );
}
