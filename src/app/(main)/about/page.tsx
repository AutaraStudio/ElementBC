import type { Metadata } from 'next';
import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import CharStagger from '@/components/ui/CharStagger';
import { getAboutPage, getPartnerCarousel } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/imageUrl';
import AboutHeroBackgroundSvg from '@/components/ui/svgs/AboutHeroBackgroundSvg';
import EyebrowSvg from '@/components/ui/svgs/EyebrowSvg';
import PartnerCarousel from '@/components/sections/PartnerCarousel';

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
      {aboutPage?.teamMembers && aboutPage.teamMembers.length > 0 && (
        <section data-theme="charcoal" className="about_team-wrap u-theme-charcoal">
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
          <div className="about_team-contain u-container">
            <div className="about_team-layout u-grid-custom u-gap-row-6">
              {aboutPage.teamMembers.map((member) => (
                <div key={member._key} data-stagger-item="" className="about_team-item u-column-span-3 u-flex-vertical-nowrap u-gap-4">
                  {member.photo && member.photo.asset?.url && (
                    <div className="about_team_image-wrap u-position-relative u-ratio-3-4">
                      <Image
                        fill
                        src={member.photo.asset.url}
                        alt={member.photo.alt ?? member.name ?? ''}
                        className="about_team-img u-cover-absolute"
                      />
                    </div>
                  )}
                  <div className="about_team_info-wrap u-flex-vertical-nowrap u-gap-2">
                    {member.name && (
                      <div className="about_team-name u-text-style-large u-weight-bold">{member.name}</div>
                    )}
                    {member.role && (
                      <div className="about_team-role u-text-style-small u-text-transform-uppercase">{member.role}</div>
                    )}
                    {member.bio && (
                      <p data-split="line" className="about_team-bio u-text-style-main">{member.bio}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        </section>
      )}

      {/* ============================================================
          PARTNER CAROUSEL SECTION
      ============================================================ */}
      <PartnerCarousel heading={partnerCarousel?.heading} />

    </>
  );
}
