import type { Metadata } from 'next';
import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import { getAllProjects, getProjectsPage, getPartnerCarousel } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/imageUrl';
import EyebrowSvg from '@/components/ui/svgs/EyebrowSvg';
import SectionDivider from '@/components/ui/SectionDivider';
import PartnerCarousel from '@/components/sections/PartnerCarousel';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const projectsPage = await getProjectsPage();
  return {
    title: { absolute: projectsPage?.seoTitle ?? 'Case Studies | Element BC' },
    description: projectsPage?.seoDescription,
  };
}

const heroCSS = `
/* CMS list/items fill the section */
.projects_hero-list,
.projects_hero-items {
  height: 100%;
}
/* Each CMS item is a full-bleed image layer only */
.projects_hero-item {
  pointer-events: none;
}
/* Dark gradient over each image */
.projects_hero-asset::before {
  background: linear-gradient(180deg, transparent 0%, var(--_theme---image-overlay));
  content: "";
  inset: 0;
  opacity: .5;
  pointer-events: none;
  position: absolute;
  z-index: 5;
}
/* Image fill */
.projects_hero-image {
  object-position: center;
}
/* Hide the template — JS clones it, never displayed directly */
.projects_hero-ui [data-slider-slide-template] {
  display: none;
}
/* Heading — floats above the bottom bar, grows upward naturally */
.projects_hero-slide {
  bottom: 8rem;
  left: 0;
  right: 0;
  max-width: 68rem;
  z-index: 6;
  visibility: hidden;
}
@container (width < 40em) {
  .projects_hero-slide {
    bottom: 6rem;
    max-width: 100%;
  }
}
/* Bottom bar */
.projects_hero-bar {
  left: 0;
  right: 0;
  bottom: 4rem;
  z-index: 10;
  gap: var(--site--gutter, 1.5rem);
  pointer-events: none;
  align-items: center;
}
@container (width < 40em) {
  .projects_hero-bar {
    bottom: 2rem;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  /* Hide the progress track on mobile so the inline prev/next buttons get
     room to breathe — the page-counter (01 / 05) still gives the user an
     idea of position. */
  .projects_hero-bar > .projects_hero-progress {
    display: none;
  }
  /* Inline prev/next buttons live at the right edge of the bar. */
  .projects_hero-bar-nav {
    display: flex !important;
    gap: 0.5rem;
    flex-shrink: 0;
    margin-left: auto;
  }
  .projects_hero-bar-nav .projects_hero-button {
    height: 2.75rem;
    width: 2.75rem;
  }
}
/* The inline (in-bar) nav is hidden on desktop — the floating .projects_hero-nav
   above the bar handles desktop. */
.projects_hero-bar-nav {
  display: none;
}
/* Title label */
.projects_hero-title {
  flex-shrink: 0;
}
/* Progress track */
.projects_hero-progress {
  background: color-mix(in srgb, currentColor 20%, transparent);
  height: 1px;
  flex: 1;
  position: relative;
  pointer-events: none;
}
/* Progress fill */
.projects_hero-progress-bar {
  background: color-mix(in srgb, currentColor 80%, transparent);
  position: absolute;
  inset: 0;
  transform: scaleX(0);
  transform-origin: left center;
}
/* Counter */
.projects_hero-indicator {
  flex-shrink: 0;
  pointer-events: none;
}
/* Nav */
.projects_hero-nav {
  bottom: 10rem;
  right: 0;
  gap: 1rem;
  z-index: 10;
}
@container (width < 40em) {
  .projects_hero-nav {
    display: none;
  }
}
/* Buttons */
.projects_hero-button {
  -webkit-backdrop-filter: blur(2rem);
  backdrop-filter: blur(2rem);
  background: linear-gradient(180deg, rgba(255,255,255,.15), rgba(255,255,255,.2));
  border: none;
  color: currentColor;
  cursor: pointer;
  height: 5rem;
  width: 5rem;
  transition: background 0.2s ease;
}
.projects_hero-button:hover {
  background: linear-gradient(180deg, rgba(255,255,255,.25), rgba(255,255,255,.3));
}
.projects_hero-button[data-slider-prev] {
  transform: rotate(180deg);
}
.projects_hero-arrow {
  height: .9rem;
  width: 1.4rem;
}
`;


export default async function ProjectsPage() {
  const [projects, projectsPage, partnerCarousel] = await Promise.all([
    getAllProjects(),
    getProjectsPage(),
    getPartnerCarousel(),
  ]);
  return (
    <>

      {/* ============================================================
          HERO SECTION — SLIDER
      ============================================================ */}
      <section
        data-animate-theme-to="dark"
        data-slider=""
        data-cursor-marquee-text="View Case Study"
        data-theme="img-bg" className="projects_hero-wrap u-pointer-off u-theme-img-bg"
      >
        <div className="u-embed-css w-embed">
          <style dangerouslySetInnerHTML={{ __html: heroCSS }} />
        </div>

        {/* Image items */}
        <div className="projects_hero-list">
          <div data-slider-items="" role="list" className="projects_hero-items u-position-relative u-width-full">
            {projects.slice(0, 5).map((project) => (
              <div key={project._id} data-slider-item="" role="listitem" className="projects_hero-item u-cover-absolute u-pointer-off u-position-absolute">
                <div data-overlay-dark="" data-slider-asset="" className="projects_hero-asset u-cover-absolute u-overflow-clip">
                  <TransitionLink href={`/case-studies/${project.slug}`} className="projects_hero-link u-cover-absolute u-zindex-1"></TransitionLink>
                  {urlFor(project.featuredImage1) && (
                    <Image
                      fill
                      src={urlFor(project.featuredImage1)!}
                      alt={project.projectName}
                      loading="lazy"
                      className="projects_hero-image u-cover-absolute u-object-fit-cover"
                    />
                  )}
                </div>
                <div aria-hidden="true" data-slider-data="" className="u-sr-only">
                  <span data-slider-data-heading={project.projectName}>{project.projectName}</span>
                  <span data-slider-data-title="">{project.category?.name ?? ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UI overlay */}
        <div className="projects_hero-ui u-cover-absolute u-pointer-off" style={{ zIndex: 5 }}>
          <div className="projects_hero_ui-contain u-container u-height-full">
            <div aria-hidden="true" data-slider-slide-template="" className="projects_hero-slide u-position-absolute u-flex-vertical-nowrap">
              <div data-slider-slide-heading="" className="projects_hero-heading u-max-width-18ch u-text-style-h2 u-text-transform-uppercase"></div>
            </div>
            <div data-slider-slides="" className="projects_hero-slides u-cover-absolute u-pointer-off"></div>
            <div data-slider-progress-track="" className="projects_hero-bar u-position-absolute u-flex-horizontal-nowrap">
              <div data-slider-indicator-title="" className="projects_hero-title u-text-style-main u-text-transform-uppercase"></div>
              <div data-slider-progress-track="" className="projects_hero-progress">
                <div data-slider-progress="" className="projects_hero-progress-bar"></div>
              </div>
              <div data-slider-indicator="" className="projects_hero-indicator u-text-style-main"></div>
              <div data-cursor-marquee-hide="" className="projects_hero-bar-nav u-flex-horizontal-nowrap u-pointer-on">
                <button data-slider-prev="" aria-label="Previous slide" className="projects_hero-button u-flex-horizontal-nowrap u-align-items-center u-justify-content-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 9" fill="none" width="100%" className="projects_hero-arrow">
                    <path d="M0 3.56641L10.7969 3.56641L8.00488 0.900391L7.94043 0.839844L8.00098 0.774414L8.65332 0.0673828L8.71484 0L8.78125 0.0625L12.9727 4.06348L13.04 4.12793L12.9727 4.19336L8.78125 8.19336L8.71484 8.25586L8.65332 8.18848L8.00098 7.48145L7.94043 7.41602L8.00488 7.35547L10.7969 4.69043L0 4.69043L0 3.56641Z" fill="currentColor" />
                  </svg>
                </button>
                <button data-slider-next="" aria-label="Next slide" className="projects_hero-button u-flex-horizontal-nowrap u-align-items-center u-justify-content-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 9" fill="none" width="100%" className="projects_hero-arrow">
                    <path d="M0 3.56641L10.7969 3.56641L8.00488 0.900391L7.94043 0.839844L8.00098 0.774414L8.65332 0.0673828L8.71484 0L8.78125 0.0625L12.9727 4.06348L13.04 4.12793L12.9727 4.19336L8.78125 8.19336L8.71484 8.25586L8.65332 8.18848L8.00098 7.48145L7.94043 7.41602L8.00488 7.35547L10.7969 4.69043L0 4.69043L0 3.56641Z" fill="currentColor" />
                  </svg>
                </button>
              </div>
            </div>
            <div data-cursor-marquee-hide="" className="projects_hero-nav u-position-absolute u-flex-horizontal-nowrap u-pointer-on">
              <button data-slider-prev="" className="projects_hero-button u-flex-horizontal-nowrap u-align-items-center u-justify-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 9" fill="none" width="100%" className="projects_hero-arrow">
                  <path d="M0 3.56641L10.7969 3.56641L8.00488 0.900391L7.94043 0.839844L8.00098 0.774414L8.65332 0.0673828L8.71484 0L8.78125 0.0625L12.9727 4.06348L13.04 4.12793L12.9727 4.19336L8.78125 8.19336L8.71484 8.25586L8.65332 8.18848L8.00098 7.48145L7.94043 7.41602L8.00488 7.35547L10.7969 4.69043L0 4.69043L0 3.56641Z" fill="currentColor" />
                </svg>
              </button>
              <button data-slider-next="" className="projects_hero-button u-flex-horizontal-nowrap u-align-items-center u-justify-content-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 9" fill="none" width="100%" className="projects_hero-arrow">
                  <path d="M0 3.56641L10.7969 3.56641L8.00488 0.900391L7.94043 0.839844L8.00098 0.774414L8.65332 0.0673828L8.71484 0L8.78125 0.0625L12.9727 4.06348L13.04 4.12793L12.9727 4.19336L8.78125 8.19336L8.71484 8.25586L8.65332 8.18848L8.00098 7.48145L7.94043 7.41602L8.00488 7.35547L10.7969 4.69043L0 4.69043L0 3.56641Z" fill="currentColor" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          ARCHIVE SECTION — GRID
      ============================================================ */}
      <section data-theme="buff" className="projects_archive-wrap u-position-relative u-theme-buff">
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>

        <div className="u-container">
          <div className="projects_archive-header u-grid-custom">
            <div className="projects_archive-header_eyebrow u-column-start-1 u-column-span-4">
              <div data-stagger="" className="u-flex-horizontal-nowrap u-gap-2">
                <EyebrowSvg className="global_eyebrow-svg" />
                <div data-stagger-item="" className="u-text-style-large u-text-transform-uppercase u-weight-bold">Case Studies</div>
              </div>
            </div>
            <div className="projects_archive-header_heading u-column-start-6 u-column-span-7">
              <h2 data-split="word" className="u-text-style-h2 u-text-transform-uppercase u-text-decoration-justify-last">{projectsPage?.pageHeading ?? 'Detail in every project.'}</h2>
            </div>
          </div>

          <div data-stagger="" className="u-grid-custom u-gap-row-6">
            {projects.map((project) => (
              <div key={project.slug} data-stagger-item="" className="u-column-span-3 u-position-relative u-flex-vertical-nowrap u-gap-3">
                <div data-cursor-marquee-text="View Case Study" className="project_related-image u-position-relative u-overflow-hidden u-ratio-4-5">
                  <TransitionLink href={`/case-studies/${project.slug}`} className="u-cover-absolute u-zindex-3"></TransitionLink>
                  {urlFor(project.featuredImage1) && (
                    <Image
                      fill
                      src={urlFor(project.featuredImage1)!}
                      alt={project.projectName}
                      loading="lazy"
                      className="u-cover-absolute"
                    />
                  )}
                  <div data-overlay-start="top center" data-overlay="" className="color_reveal-overlay u-cover-absolute u-pointer-off"></div>
                  <div className="project_image-marquee-overlay u-cover-absolute u-pointer-off"></div>
                </div>
                <div className="u-flex-vertical-nowrap u-gap-1">
                  <div className="u-text-style-main u-weight-bold u-text-transform-uppercase">{project.projectName}</div>
                  <div className="u-text-style-small u-color-faded u-text-transform-uppercase">{project.category?.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          DIVIDER
      ============================================================ */}
      <SectionDivider theme="buff" />

      {/* ============================================================
          PARTNER CAROUSEL
      ============================================================ */}
      <PartnerCarousel heading={partnerCarousel?.heading} partners={partnerCarousel?.partners} />

    </>
  );
}
