import { PortableText, type PortableTextComponents } from '@portabletext/react';
import AboutHeroBackgroundSvg from '@/components/ui/svgs/AboutHeroBackgroundSvg';
import EyebrowSvg from '@/components/ui/svgs/EyebrowSvg';
import type { SanityLegalPage } from '@/lib/sanity/queries';

const portableComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="legal_paragraph u-text-style-main u-margin-bottom-4">{children}</p>,
    h2: ({ children }) => <h2 className="legal_heading u-text-style-h4 u-text-transform-uppercase u-margin-top-8 u-margin-bottom-3">{children}</h2>,
    h3: ({ children }) => <h3 className="legal_subheading u-text-style-h5 u-text-transform-uppercase u-margin-top-6 u-margin-bottom-2">{children}</h3>,
  },
  list: {
    bullet: ({ children }) => <ul className="legal_list u-text-style-main u-margin-bottom-4">{children}</ul>,
    number: ({ children }) => <ol className="legal_list u-text-style-main u-margin-bottom-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="legal_list-item">{children}</li>,
    number: ({ children }) => <li className="legal_list-item">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="u-weight-bold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="u-text-decoration-underline"
      >
        {children}
      </a>
    ),
  },
};

interface LegalPageProps {
  data: SanityLegalPage | null;
  fallbackEyebrow: string;
  fallbackHeading: string;
  fallbackBody: SanityLegalPage['body'];
}

export default function LegalPage({ data, fallbackEyebrow, fallbackHeading, fallbackBody }: LegalPageProps) {
  const heroEyebrow = data?.heroEyebrow ?? fallbackEyebrow;
  const heroHeading = data?.heroHeading ?? fallbackHeading;
  const body = (data?.body && data.body.length > 0 ? data.body : fallbackBody) ?? [];
  const lastUpdated = data?.lastUpdated;

  const formattedDate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <>
      {/* ============================================================
          HERO SECTION (mirrors contact page hero, buff theme)
      ============================================================ */}
      <section data-hero-wrap="" data-theme="buff" className="contact_hero-wrap u-theme-buff">
        <div data-wf--spacer--variant="page-top" className="u-section-spacer is-page-top u-ignore-trim"></div>

        <div className="about_bg-wrap u-cover-absolute">
          <div className="about_bg-svg u-position-absolute">
            <AboutHeroBackgroundSvg className="global_svg" />
          </div>
        </div>

        <div className="project_hero-contain u-container">
          <div className="project_hero-layout u-flex-vertical-nowrap u-alignment-center u-gap-7">
            <div data-stagger="" className="project_hero-eyebrow u-flex-horizontal-nowrap u-gap-2">
              <EyebrowSvg className="global_eyebrow-svg" />
              <div data-anim-hero="" data-split="word" className="contact_hero_eyebrow-heading u-text-style-large u-text-transform-uppercase u-weight-bold">{heroEyebrow}</div>
            </div>

            <div className="about_hero_heading-wrap">
              <h1 data-split="word" data-anim-hero="" className="about_hero-heading u-max-width-30ch u-text-style-h2 u-text-transform-uppercase">{heroHeading}</h1>
            </div>
          </div>
        </div>

        <div data-wf--spacer--variant="large" className="u-section-spacer is-large u-ignore-trim"></div>
      </section>

      {/* ============================================================
          BODY SECTION
      ============================================================ */}
      <section data-theme="buff" className="legal_body-wrap u-theme-buff">
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="legal_body-contain u-container">
          <div className="legal_body-layout u-max-width-80ch u-margin-x-auto">
            {formattedDate && (
              <p className="legal_last-updated u-text-style-small u-text-transform-uppercase u-color-faded u-margin-bottom-6">
                Last updated: {formattedDate}
              </p>
            )}
            <div className="legal_body-content">
              <PortableText value={body as never} components={portableComponents} />
            </div>
          </div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>
    </>
  );
}
