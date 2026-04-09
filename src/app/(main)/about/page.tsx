import type { Metadata } from 'next';
import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import CharStagger from '@/components/ui/CharStagger';
import { getAboutPage, getPartnerCarousel } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/imageUrl';
import AboutHeroBackgroundSvg from '@/components/ui/svgs/AboutHeroBackgroundSvg';
import EyebrowSvg from '@/components/ui/svgs/EyebrowSvg';
import PartnerCarousel from '@/components/sections/PartnerCarousel';
import SectionDivider from '@/components/ui/SectionDivider';
import CircleDiagram from '@/components/sections/CircleDiagram';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const aboutPage = await getAboutPage();
  return {
    title: aboutPage?.seoTitle ?? 'About | Element BC',
    description: aboutPage?.seoDescription,
  };
}

export default async function AboutPage() {
  const [aboutPage, partnerCarousel] = await Promise.all([
    getAboutPage(),
    getPartnerCarousel(),
  ]);
  return (
    <>

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section data-hero-wrap="" data-theme="charcoal" className="about_hero-wrap u-min-height-screen u-position-relative u-theme-charcoal">
        <div data-wf--spacer--variant="page-top" className="u-section-spacer is-page-top u-ignore-trim"></div>

        {/* Background SVG */}
        <div className="about_bg-wrap u-cover-absolute">
          <div className="about_bg-svg u-position-absolute">
            <AboutHeroBackgroundSvg className="global_svg" />
          </div>
        </div>

        {/* Hero content */}
        <div className="project_hero-contain u-container">
          <div className="project_hero-layout u-flex-vertical-nowrap u-alignment-center u-gap-7">

            {/* Eyebrow */}
            <div data-stagger="" className="project_hero-eyebrow u-flex-horizontal-nowrap u-gap-2">
              <EyebrowSvg className="global_eyebrow-svg" />
              <div data-anim-hero="" data-split="word" className="about_hero_eyebrowe-heading u-text-style-large u-text-transform-uppercase u-weight-bold">{aboutPage?.heroEyebrow ?? 'About Element bc'}</div>
            </div>

            {/* Heading */}
            <div className="about_hero_heading-wrap">
              <h3 data-split="word" data-anim-hero="" className="about_hero-heading u-max-width-30ch u-text-style-h2 u-text-transform-uppercase">{aboutPage?.heroHeading ?? 'Meticulously managing every detail, every time.'}</h3>
            </div>

          </div>
        </div>

        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          TEAM MEMBERS SECTION
      ============================================================ */}
      <section data-theme="buff" className="about_team-wrap u-position-relative u-theme-buff" style={{ position: 'relative', zIndex: 2, backgroundColor: 'var(--_theme---background)', color: 'var(--_theme---text)' }}>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="about_team-contain u-container">
          <div className="about_team-layout u-grid-custom u-gap-row-8">

            {/* Eyebrow + description column */}
            <div className="u-column-start-1 u-column-span-3 u-flex-vertical-nowrap u-justify-content-between u-padding-bottom-8">
              <div data-stagger="" className="u-flex-horizontal-nowrap u-gap-2 u-alignment-start">
                <EyebrowSvg className="global_eyebrow-svg" />
                <div data-stagger-item="" data-split="word" className="u-text-style-large u-text-transform-uppercase u-weight-bold">{aboutPage?.teamEyebrow ?? 'Founders Journey'}</div>
              </div>
              <p data-split="line" className="u-max-width-45ch u-text-style-main">
                {aboutPage?.teamDescription ?? 'Element was founded by Harry Powell and George Curtis, two industry professionals who saw a gap in building consultancy and built a business around a simple belief \u2014 that attention to detail changes everything.'}
              </p>
            </div>

            {/* Team member cards */}
            <div data-stagger="" className="u-column-start-5 u-column-span-8 u-grid-subgrid">
              {(aboutPage?.teamMembers ?? []).map((member) => (
                <div key={member._key} data-stagger-item="" className="u-column-span-4 u-flex-vertical-nowrap u-gap-4">
                  {member.photo && member.photo.asset?.url ? (
                    <div className="about_team_image-wrap u-position-relative u-ratio-4-5">
                      <Image
                        fill
                        src={member.photo.asset.url}
                        alt={member.photo.alt ?? member.name ?? ''}
                        className="about_team-img u-cover-absolute"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div data-theme="charcoal" className="u-ratio-4-5 u-theme-charcoal" style={{ backgroundColor: 'var(--_theme---background)' }}></div>
                  )}
                  <div className="u-flex-vertical-nowrap u-gap-2">
                    {member.name && (
                      <div className="u-text-style-large u-weight-bold">{member.name}</div>
                    )}
                    {member.role && (
                      <div className="u-text-style-small u-text-transform-uppercase u-weight-bold u-color-faded">{member.role}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          OUR APPROACH — CIRCLE DIAGRAM
      ============================================================ */}
      <CircleDiagram
        heading={aboutPage?.approachHeading ?? 'Our Approach.'}
        description={aboutPage?.approachDescription ?? 'From acquisition to disposal, we manage every detail — fully integrated across the entire property lifecycle.'}
        items={aboutPage?.approachItems ?? []}
        theme="buff"
      />

      <SectionDivider theme="buff" />

      {/* ============================================================
          PARTNER CAROUSEL SECTION
      ============================================================ */}
      <PartnerCarousel heading={partnerCarousel?.heading} />

    </>
  );
}
