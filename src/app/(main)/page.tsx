import type { Metadata } from 'next';
import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import HomeAboutWaveSvg from '@/components/ui/svgs/HomeAboutWaveSvg';
import CharStagger from '@/components/ui/CharStagger';
import { getHomePage, getProjectsPage, getSiteSettings, getPartnerCarousel } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/imageUrl';
import EyebrowSvg from '@/components/ui/svgs/EyebrowSvg';
import SectionDivider from '@/components/ui/SectionDivider';
import ScrollOrbit from '@/components/ui/ScrollOrbit';
import WhatWeDo from '@/components/sections/WhatWeDo';
import PartnerCarousel from '@/components/sections/PartnerCarousel';
export const revalidate = 60;


export async function generateMetadata(): Promise<Metadata> {
  const [homePage, settings] = await Promise.all([getHomePage(), getSiteSettings()]);
  const fallbackTitle = homePage?.heroHeading
    ? `${settings?.siteTitle ?? 'Element BC'} | ${homePage.heroHeading}`
    : settings?.siteTitle ?? 'Element BC';
  return {
    title: { absolute: homePage?.seoTitle ?? settings?.seoTitle ?? fallbackTitle },
    description: homePage?.seoDescription ?? settings?.seoDescription,
  };
}

const heroCSS = `
/* GSAP handles all transitions */
[data-hero-img] {
  will-change: transform, clip-path;
  transition: none;
}
/* Primary image — visible by default, slightly zoomed */
[data-hero-img="primary"] {
  transform: scale(1.1);
  transform-origin: center center;
}
/* Secondary image — hidden via clip-path, layers on top */
[data-hero-img="secondary"] {
  z-index: 2;
  transform-origin: center center;
  clip-path: inset(100% 0 0 0);
}
`;

const projectsArchiveCSS = `
.projects_archive_image-wrap .projects_archive-image {
  transform: scale(1);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}
.projects_archive_image-wrap:hover .projects_archive-image {
  transform: scale(1.05);
}
/* 4-column grid — each item spans 6 of the 24-column grid */
.projects_archive-item { grid-column: span 6; }
/* Portrait ratio for all items */
.projects_archive_image-wrap {
  aspect-ratio: 3 / 4;
}
`;

export default async function HomePage() {
  const [homePage, projectsPage, partnerCarousel] = await Promise.all([getHomePage(), getProjectsPage(), getPartnerCarousel()]);
  return (
    <>
      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <div id="top" data-hero-wrap="" data-theme="img-bg" data-progress-nav-anchor="" className="home_hero_featured-wrap u-theme-img-bg">
        <div data-hero-featured="list" role="list" className="home_hero_featured-list u-min-height-screen">
          <div data-hero-item="" role="listitem" className="home_hero_featured-item u-cover-absolute u-theme-charcoal">
            <div className="u-embed-css w-embed">
              <style dangerouslySetInnerHTML={{ __html: heroCSS }} />
            </div>
            <div data-overlay-dark="" className="home_hero_featured_img-wrap u-cover-absolute">
              {homePage?.heroProject?.featuredImage1 && (
                <Image
                  src={urlFor(homePage.heroProject.featuredImage1)!}
                  fill
                  priority
                  data-hero-img="primary"
                  alt={homePage.heroProject.featuredImage1.alt ?? homePage.heroProject.projectName ?? ''}
                  sizes="100vw"
                  className="home_hero_featured-img u-cover-absolute u-height-full"
                  style={{ objectFit: 'cover' }}
                />
              )}
              {homePage?.heroProject?.featuredImage2 && (
                <Image
                  src={urlFor(homePage.heroProject.featuredImage2)!}
                  fill
                  loading="eager"
                  data-hero-img="secondary"
                  alt={homePage.heroProject.featuredImage2.alt ?? homePage.heroProject.projectName ?? ''}
                  sizes="100vw"
                  className="home_hero_featured-img u-cover-absolute u-height-full"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </div>
            <div className="home_hero_featured-contain u-container u-height-full">
              <div className="home_hero_featured-layout u-height-full u-flex-vertical-nowrap">
                <div data-anim-hero="" data-stagger="" className="home_hero_featured-row u-flex-horizontal-nowrap u-justify-content-between" style={{ alignItems: 'baseline' }}>
                  <div data-stagger-item="" className="home_hero_featured-col">
                    <div className="home_hero-featured-text u-text-style-main u-text-transform-uppercase">Featured Project</div>
                  </div>
                  <div data-stagger-item="" className="home_hero_featured-col">
                    <TransitionLink
                      href={homePage?.heroProject?.slug ? `/case-studies/${homePage.heroProject.slug}` : '/case-studies'}
                      data-hero-trigger=""
                      className="link_underline-wrap link-stagger u-padding-bottom-1"
                    >
                      <div data-featured-text="" className="link_underline-text u-text-style-main u-text-transform-uppercase">{homePage?.heroViewProjectText ?? 'View Project'}</div>
                      <div className="link_underline-line"></div>
                    </TransitionLink>
                  </div>
                </div>
                <div className="home_hero_heading-wrap u-position-absolute">
                  <h1 data-split="char" data-anim-hero="" className="section_heading u-text-style-display">{homePage?.heroHeading ?? 'element'}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          ABOUT SECTION
      ============================================================ */}
      <section id="about" data-progress-nav-anchor="" data-theme="buff" className="home_about-wrap u-position-relative u-theme-buff">
        <div data-wf--spacer--variant="large" className="u-section-spacer is-large u-ignore-trim"></div>
        <div className="home_about-contain u-container">
          <div className="home_about-layout u-grid-custom u-gap-row-8">

            {/* Row 1 — Heading (columns 1–7) + Eyebrow + paragraph (columns 5–10) */}
            <div className="home_about-col u-column-start-1 u-column-span-7">
              <div data-split-wrapper="" className="home_about_heading-wrap">
                <h2 data-split="word" className="home_about_heading-heading u-max-width-14ch u-text-style-h1 u-text-transform-uppercase u-text-decoration-justify-last">{homePage?.aboutHeading ?? 'Difference in the Detail.'}</h2>
              </div>
            </div>

            <div className="home_about-col u-position-relative u-column-start-1 u-column-span-4">
              <div data-overlay-start="top center" data-overlay="" className="color_reveal-overlay u-cover-absolute u-pointer-off"></div>
              <div className="breathing-bars_wrap">
                <HomeAboutWaveSvg className="home_about_wave-svg" />
              </div>
            </div>

            {/* About paragraph — bottom right */}
            <div className="home_about-col u-column-start-8 u-column-span-5 u-flex-vertical-nowrap u-justify-content-end u-align-items-end">
              <p data-split="line" className="u-text-style-main u-max-width-40ch">{homePage?.aboutParagraph ?? 'Element is not your ordinary building consultancy. For us, precision is everything. We spot opportunities to save time and money, embrace the latest technologies, and oversee every project with absolute efficiency. We minimise risk, maximise profitability and build trust. We ensure every detail is managed.'}</p>
            </div>

          </div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          STATS SECTION
      ============================================================ */}
      <div id="stats" data-progress-nav-anchor="">
        <ScrollOrbit
          stats={homePage?.statsItems ?? []}
          heading={homePage?.statsHeading ?? 'Built on detail. Proven in results.'}
          subheading={homePage?.statsSubheading ?? 'From programme to budget, we manage every detail — and the results speak for themselves.'}
          theme="charcoal"
        />
      </div>

      <SectionDivider theme="buff" />

      {/* ============================================================
          SERVICES SECTION
      ============================================================ */}
      <WhatWeDo
        id="services"
        heading={homePage?.servicesHeading ?? 'Services Built on Precision.'}
        tagline={homePage?.servicesTagline ?? 'We tailor our approach to meet each client\'s specific needs, with expert, director-level involvement throughout.'}
        serviceGroups={homePage?.serviceGroups ?? []}
        theme="buff"
      />

      <SectionDivider theme="buff" />

      {/* ============================================================
          PROJECTS ARCHIVE SECTION
      ============================================================ */}
      <section id="case-studies" data-progress-nav-anchor="" data-theme="buff" className="projects_archive-wrap u-position-relative u-theme-buff">
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="u-embed-css w-embed">
          <style dangerouslySetInnerHTML={{ __html: projectsArchiveCSS }} />
        </div>
        <div data-cursor-marquee-hide="" className="projects_filter-contain u-container u-padding-block-6">
          <div className="projects_filter-layout u-grid-custom">
            <div className="projects_filter-col u-column-start-1 u-column-span-3">
              <div className="projects_filter_col-inner u-flex-horizontal-nowrap u-gap-2">
                <EyebrowSvg className="global_eyebrow-svg" />
                <div className="projects_filter-heading u-text-style-large u-text-transform-uppercase u-weight-bold">Case Studies</div>
              </div>
            </div>
            <div className="projects_filter-col u-column-start-6 u-column-span-7">
              <div className="projects_filter_col-inner u-flex-horizontal-nowrap u-gap-2 u-justify-content-end">
                <h2 data-split="word" className="projects_heading-heading u-max-width-14ch u-text-style-h2 u-text-transform-uppercase u-text-decoration-justify-last">{projectsPage?.pageHeading ?? 'Detail in every project.'}</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="projects_archive-contain u-container">
          <div className="projects_archive-collection">
            <div role="list" className="projects_archive-list u-grid-custom u-gap-row-6">
              {(homePage?.featuredProjects ?? []).map((project) => (
                <div key={project._id} role="listitem" className="projects_archive-item u-position-relative u-flex-vertical-nowrap u-gap-3">
                  <div data-cursor-marquee-text="View Case Study" className="projects_archive_image-wrap u-position-relative u-overflow-hidden">
                    <TransitionLink href={`/case-studies/${project.slug}`} className="projects_archive-link u-cover-absolute w-inline-block"></TransitionLink>
                    <div data-overlay-start="top center" data-overlay="" className="color_reveal-overlay u-cover-absolute u-pointer-off"></div>
                    {urlFor(project.featuredImage1) && (
                      <Image
                        src={urlFor(project.featuredImage1)!}
                        fill
                        loading="lazy"
                        alt={project.projectName}
                        className="projects_archive-image u-cover-absolute"
                      />
                    )}
                  </div>
                  <div className="projects_archive_info-wrap u-flex-horizontal-nowrap u-justify-content-between">
                    <div data-split="word" className="project_archive_info-title u-text-style-large">{project.projectName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="projects_archive-button-wrap">
            <div className="u-button-wrapper u-align-self-stretch">
              <div className="u-display-contents">
                <div data-wf--button-main--variant="secondary" className="button_main_wrap u-width-full" data-button=" " data-trigger="hover focus">
                  <div data-wf--clickable--variant="focus-ring-outside" className="clickable_wrap u-cover-absolute">
                    <TransitionLink aria-label="View All Case Studies" href="/case-studies" className="clickable_link w-inline-block"></TransitionLink>
                  </div>
                  <div className="button_main_element w-variant-e85564cd-af30-a478-692b-71732aefb3ab">
                    <div aria-hidden="true" className="button_main_text u-text-style-main u-text-transform-uppercase u-weight-bold"><CharStagger>View All Case Studies</CharStagger></div>
                    <div className="button_main_icon u-hide-if-empty"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          PARTNER CAROUSEL SECTION
      ============================================================ */}
      <PartnerCarousel
        id="bottom"
        theme="charcoal"
        heading={partnerCarousel?.heading ?? "Trusted by those who value detail."}
        partners={partnerCarousel?.partners}
      />

    </>
  );
}
