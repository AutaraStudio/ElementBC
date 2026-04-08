import type { Metadata } from 'next';
import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import { getAllProjects, getAllProjectCategories, getProjectsPage } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/imageUrl';

const EyebrowSvg = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 61 42" fill="none" className={className}>
    <path d="M25.3848 0.64093V4.85967C25.3848 5.21835 25.0933 5.5087 24.7331 5.5087H0.652998C-0.0716348 5.5087 -0.256013 6.51215 0.421455 6.76408L12.4015 11.2774C12.4744 11.3073 12.5516 11.3201 12.633 11.3201H24.7374C25.0976 11.3201 25.3891 11.6105 25.3891 11.9692V17.1316H0.652998C-0.0716348 17.1316 -0.256013 18.1308 0.421455 18.387L12.4015 22.9003C12.4744 22.9302 12.5516 22.943 12.633 22.943H24.7374C25.0976 22.943 25.3891 23.2334 25.3891 23.5921V28.7545H0.652998C-0.0716348 28.7545 -0.256013 29.7579 0.421455 30.0141L31.7736 41.8206C31.8465 41.8505 31.9237 41.8633 32.0052 41.8633H59.5412C59.9014 41.8633 60.193 41.5729 60.193 41.2143V36.5045C60.193 36.2355 60.0214 35.9921 59.7685 35.8981L48.0972 31.5043C47.4197 31.2481 47.6041 30.2447 48.3287 30.2447H59.5369C59.8971 30.2447 60.1887 29.9543 60.1887 29.5957V24.8859C60.1887 24.6169 60.0172 24.3735 59.7642 24.2795L48.0929 19.8857C47.4154 19.6295 47.5998 18.6261 48.3244 18.6261H59.5326C59.8928 18.6261 60.1844 18.3357 60.1844 17.977V13.263C60.1844 12.994 60.0129 12.7506 59.7599 12.6566L26.2638 0.0431294C25.8394 -0.11913 25.3806 0.196854 25.3806 0.649472" fill="currentColor" />
  </svg>
);

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const projectsPage = await getProjectsPage();
  return {
    title: projectsPage?.seoTitle ?? 'Projects',
    description: projectsPage?.seoDescription,
  };
}

const heroCSS = `
/* Section */
.projects_hero-wrap {
  height: 100svh;
  max-height: 90rem;
  touch-action: pan-y;
  container-type: inline-size;
}
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
    gap: 1rem;
  }
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

const archiveCSS = `
.projects_archive_image-wrap .projects_archive-image {
  transform: scale(1);
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  will-change: transform;
}
.projects_archive_image-wrap:hover .projects_archive-image {
  transform: scale(1.05);
}
/* Looping column pattern */
.projects_archive-item:nth-child(5n + 1) { grid-column: 11 / 18; }
.projects_archive-item:nth-child(5n + 2) { grid-column: 18 / 25; }
.projects_archive-item:nth-child(5n + 3) { grid-column: 4 / 11;  }
.projects_archive-item:nth-child(5n + 4) { grid-column: 11 / 18; }
.projects_archive-item:nth-child(5n + 5) { grid-column: 11 / 25; }
/* Portrait ratio for all items */
.projects_archive_image-wrap {
  aspect-ratio: 3 / 4;
}
/* Landscape ratio for the wide item */
.projects_archive-item:nth-child(5n + 5) .projects_archive_image-wrap {
  aspect-ratio: 16 / 9;
}
.projects_archive-item {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.projects_archive-item[data-hiding] {
  opacity: 0;
  transform: scale(0.97);
  pointer-events: none;
}
.projects_archive-item[data-showing] {
  opacity: 0;
  transform: scale(0.97);
}
/* Active filter button state */
[data-filter].is-active .button_main_element {
  background-color: var(--_theme---button-primary--background);
  color: var(--_theme---button-primary--text);
  border-color: var(--_theme---button-primary--background);
}
`;

export default async function ProjectsPage() {
  const [projects, categories, projectsPage] = await Promise.all([
    getAllProjects(),
    getAllProjectCategories(),
    getProjectsPage(),
  ]);
  return (
    <>

      {/* ============================================================
          HERO SECTION — SLIDER
      ============================================================ */}
      <section
        data-animate-theme-to="dark"
        data-slider=""
        data-cursor-marquee-text="View Project"
        data-theme="charcoal" className="projects_hero-wrap u-position-relative u-overflow-clip u-pointer-off"
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
                  <TransitionLink href={`/projects/${project.slug}`} className="projects_hero-link u-cover-absolute u-zindex-1"></TransitionLink>
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
        <div className="projects_hero-ui u-cover-absolute u-pointer-off">
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
          ARCHIVE SECTION — FILTER + GRID
      ============================================================ */}
      <section data-animate-theme-to="buff" className="projects_archive-wrap u-position-relative u-min-height-screen">
        <div className="u-embed-css w-embed">
          <style dangerouslySetInnerHTML={{ __html: archiveCSS }} />
        </div>

        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>

        {/* Filter bar */}
        <div data-cursor-marquee-hide="" className="projects_filter-contain u-container u-padding-block-4 u-position-sticky">
          <div className="projects_filter-layout u-grid-custom">
            <div className="projects_filter-col u-column-start-1 u-column-span-3">
              <div className="projects_filter_col-inner u-flex-horizontal-nowrap u-gap-2">
                <EyebrowSvg className="global_eyebrow-svg" />
                <div className="projects_filter-heading u-text-style-large u-text-transform-uppercase u-weight-bold">Projects</div>
              </div>
            </div>
            <div className="projects_filter-col u-column-start-6 u-column-span-7">
              <div className="projects_filter_col-inner u-flex-horizontal-nowrap u-justify-content-between">
                <div className="projects_filter_btn-wrap u-flex-horizontal-nowrap u-gap-1">

                  {/* All Filters button */}
                  <div data-wf--button-main--variant="primary" data-filter="all" className="button_main_wrap" data-button=" " data-trigger="hover focus">
                    <div data-wf--clickable--variant="focus-ring-outside" className="clickable_wrap u-cover-absolute">
                      <button type="button" aria-label="All Filters" className="clickable_btn"></button>
                    </div>
                    <div className="button_main_element">
                      <div aria-hidden="true" className="button_main_text u-text-style-main u-text-transform-uppercase u-weight-bold">All Filters</div>
                      <div className="button_main_icon u-hide-if-empty"></div>
                    </div>
                  </div>

                  {/* Category filter buttons */}
                  <div className="projects_filter_btn-collection">
                    <div role="list" className="projects_filter_btn-list u-flex-horizontal-nowrap u-gap-1">
                      {categories.map((cat) => (
                        <div key={cat.slug} role="listitem" className="projects_filter_btn-item">
                          <div data-wf--button-main--variant="secondary" data-filter={cat.slug} className="button_main_wrap" data-button=" " data-trigger="hover focus">
                            <div data-wf--clickable--variant="focus-ring-outside" className="clickable_wrap u-cover-absolute">
                              <button type="button" aria-label={cat.name} className="clickable_btn"></button>
                            </div>
                            <div className="button_main_element w-variant-e85564cd-af30-a478-692b-71732aefb3ab">
                              <div aria-hidden="true" className="button_main_text u-text-style-main u-text-transform-uppercase u-weight-bold">{cat.name}</div>
                              <div className="button_main_icon u-hide-if-empty"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Archive grid */}
        <div className="projects_archive-contain u-container u-margin-top-5 u-pointer-off">
          <div className="projects_archive-collection">
            <div role="list" className="projects_archive-list u-grid-custom u-gap-row-6">
              {projects.map((project) => (
                <div
                  key={project.slug}
                  data-category={project.category?.slug ?? ''}
                  role="listitem"
                  className="projects_archive-item u-position-relative u-flex-vertical-nowrap u-gap-3"
                >
                  <div data-cursor-marquee-text="View Project" className="projects_archive_image-wrap u-position-relative u-overflow-hidden u-pointer-on">
                    <TransitionLink href={`/projects/${project.slug}`} className="projects_archive-link u-cover-absolute u-zindex-3"></TransitionLink>
                    <div data-overlay-start="top center" data-overlay="" className="color_reveal-overlay u-cover-absolute u-pointer-off"></div>
                    {urlFor(project.featuredImage1) && (
                      <Image
                        fill
                        src={urlFor(project.featuredImage1)!}
                        alt={project.projectName}
                        loading="lazy"
                        className="projects_archive-image u-cover-absolute"
                      />
                    )}
                  </div>
                  <div className="projects_archive_info-wrap u-flex-horizontal-nowrap u-justify-content-between">
                    <div data-split="word" className="project_archive_info-title u-text-style-large">{project.projectName}</div>
                    <div className="project_hidden-ref u-display-none">
                      <div role="list">
                        <div role="listitem">
                          <div data-project-category="" className="project_archive_info-hidden u-display-none">{project.category?.slug ?? ''}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          PARTNER CAROUSEL SECTION
      ============================================================ */}
      <section data-marquee-duplicate="3" data-marquee="" data-marquee-direction="left" data-marquee-speed="90" data-marquee-scroll-speed="20" className="partner_carousel-wrap">
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="partner_carousel-contain">
          <div className="partner_carousel_heading-contain u-container u-margin-bottom-8">
            <div data-split-wrapper="" className="partner_carousel_heading-wrap u-flex-horizontal-nowrap u-justify-content-between u-align-items-end">
              <div className="partner_carousel_heading-inner">
                <h2 data-split-text="word" className="partner_carousel-heading u-max-width-17ch u-text-style-h2 u-text-transform-uppercase u-text-decoration-justify-last">Trusted by those who value detail.</h2>
              </div>
            </div>
          </div>
          <div data-marquee-mask="" className="partner_carousel-track-mask u-width-full u-overflow-hidden">
            <div data-marquee-track="" className="partner_carousel-track">
              <div data-marquee-collection="" className="partner_carousel-collection">

                {/* Hart Dixon */}
                <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                  <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                    <svg id="Group_5 hartdixon-header-logo" data-name="Group 5" xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 249 44.459" fill="none" className="partner_carousel-logo">
                      <defs>
                        <clipPath id="clip-path">
                          <rect id="Rectangle_2" data-name="Rectangle 2" width="249" height="44.459" fill="currentColor" />
                        </clipPath>
                      </defs>
                      <g id="Group_1" className="logo-svg" data-name="Group 1" transform="translate(0 0)" clipPath="url(#clip-path)">
                        <path id="Path_1" data-name="Path 1" d="M0,39.91V.376H3.92A4.274,4.274,0,0,1,8.194,4.65V15.567A12.759,12.759,0,0,1,18,11.423q11.532,0,11.533,12V44.184h-3.92a4.274,4.274,0,0,1-4.274-4.274V23.421q0-5.38-5.349-5.38a12.075,12.075,0,0,0-7.792,3.185V44.184H4.274A4.274,4.274,0,0,1,0,39.91" transform="translate(0 -0.081)" fill="currentColor" />
                        <path id="Path_2" data-name="Path 2" d="M40.954,37.113c0-6.452,4.7-9.973,14.1-9.973a35.992,35.992,0,0,1,6.617.618V25.316q0-4.361-6.277-4.36a44.916,44.916,0,0,0-6.874.567,4.274,4.274,0,0,1-4.938-4.217v-1.3a51.415,51.415,0,0,1,11.812-1.546q14.471,0,14.47,10.7V47.224H66.873a4.274,4.274,0,0,1-3.022-1.252L62.2,44.317a16.455,16.455,0,0,1-9.337,3.2c-7.936,0-11.9-3.665-11.9-10.4m14.1-4.407c-3.937,0-5.906,1.634-5.906,4.314,0,2.886,1.649,4.624,4.948,4.624a12.641,12.641,0,0,0,7.575-2.535V33.325a33.7,33.7,0,0,0-6.617-.619" transform="translate(-8.838 -3.121)" fill="currentColor" />
                        <path id="Path_3" data-name="Path 8" d="M90.187,18.861,90,18.09a4.275,4.275,0,0,0-4.15-3.252H82.858V47.3h7.185V32.165c.076-6.4,5.073-10.835,11.5-10.835V14.837a17.979,17.979,0,0,0-11.36,4.024" transform="translate(-17.881 -3.202)" fill="currentColor" />
                        <path id="Path_4" data-name="Path 9" d="M125.3,39.365q-3.927,0-3.927-4.545V19.886h1.692a4.274,4.274,0,0,0,4.274-4.274V13.393h-5.918l-.039-5.257H116.2a2.061,2.061,0,0,0-2.061,2.062v3.195H110.07l-.047,6.493h4.112V37.108c0,5.834,2.721,9.045,8.163,9.045h1.557a6.751,6.751,0,0,0,6.493-6.788Z" transform="translate(-23.743 -1.756)" fill="currentColor" />
                        <path id="Path_5" data-name="Path 3" d="M169.14,42.53a57.461,57.461,0,0,1-14.563,1.948c-10.493,0-15.739-5.922-15.739-17.177,0-10.389,5.133-15.878,15.4-15.878a16.274,16.274,0,0,1,6.71,1.546V.375h3.92a4.274,4.274,0,0,1,4.274,4.274Zm-8.194-22.635a11.352,11.352,0,0,0-6.369-1.67c-5.092,0-7.637,3.149-7.637,8.859,0,6.782,2.648,10.468,7.946,10.468a20.026,20.026,0,0,0,6.06-.9Z" transform="translate(-29.961 -0.081)" fill="currentColor" />
                        <path id="Path_6" data-name="Path 4" d="M190.689,14.832V47.3h-8.194V23.026A8.194,8.194,0,0,1,190.689,14.832Z" transform="translate(-39.382 -3.201)" fill="currentColor" />
                        <path id="Path_6b" data-name="Path 10" d="M190.69,4.1a4.1,4.1,0,1,1-4.1-4.1,4.1,4.1,0,0,1,4.1,4.1" transform="translate(-39.382 0)" fill="currentColor" />
                        <path id="Path_7" data-name="Path 5" d="M208.414,31.071,196.262,14.838H201.1a8.546,8.546,0,0,1,6.848,3.432l5.012,6.71,7.575-10.142h9.122L217.535,31.071,229.656,47.3h-4.838a8.546,8.546,0,0,1-6.848-3.432l-5.012-6.71L205.384,47.3h-9.122Z" transform="translate(-42.353 -3.202)" fill="currentColor" />
                        <path id="Path_8" data-name="Path 6" d="M235.525,30.99c0-10.884,5.359-16.528,16.079-16.528s16.078,5.644,16.078,16.528c0,10.864-5.359,16.59-16.078,16.59-10.678,0-16.037-5.726-16.079-16.59M251.6,41.334c5.256,0,7.884-3.686,7.884-10.468,0-6.616-2.628-10.22-7.884-10.22s-7.884,3.6-7.884,10.22c0,6.782,2.628,10.468,7.884,10.468" transform="translate(-50.826 -3.121)" fill="currentColor" />
                        <path id="Path_9" data-name="Path 7" d="M279.866,42.95V14.758h2.883a4.273,4.273,0,0,1,4.179,3.378l.3,1.088a14.52,14.52,0,0,1,10.637-4.762q11.533,0,11.533,12V47.224h-3.92A4.274,4.274,0,0,1,301.2,42.95V26.461q0-5.38-5.349-5.38a12.075,12.075,0,0,0-7.792,3.185V47.224h-3.92a4.274,4.274,0,0,1-4.274-4.274" transform="translate(-60.394 -3.121)" fill="currentColor" />
                      </g>
                    </svg>
                  </div>
                  <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Hart Dixon</div>
                </div>

                {/* Homie */}
                <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                  <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                    <svg width="100%" viewBox="0 0 120 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner_carousel-logo">
                      <path d="M113.752 23.8715C109.977 23.8715 106.84 21.3983 106.84 17.1096C106.84 13.0841 110.032 10.2688 113.668 10.2688C117.055 10.2688 119.359 12.7157 119.359 15.2416C119.359 15.7941 119.192 15.9519 118.776 16.0835L109.893 18.583C110.643 20.609 112.419 22.0824 114.668 22.0824C116.333 22.0824 117.666 21.372 118.637 20.4774C118.97 20.2143 119.137 20.0828 119.359 20.0828C119.664 20.0828 119.914 20.3459 119.914 20.6616C119.914 20.8195 119.831 21.0299 119.636 21.3194C118.637 22.6875 116.167 23.8715 113.752 23.8715ZM109.449 16.1624C109.449 16.5308 109.477 16.8991 109.532 17.2412L115.945 15.3731C116.444 15.2416 116.583 15.11 116.583 14.6364C116.583 13.3998 115.278 11.7948 113.308 11.7948C111.115 11.7948 109.449 13.5577 109.449 16.1624Z" fill="currentColor" />
                      <path d="M99.9193 23.6049C99.4589 23.6049 99.2694 23.315 99.2694 23.0779C99.2694 22.0767 100.975 22.8408 100.975 20.7067V14.3043C100.975 12.6971 99.0527 13.5929 99.0527 12.5654C99.0527 12.1438 99.5402 11.8277 100.948 11.169C102.329 10.5103 102.627 10.4313 102.844 10.4313C103.277 10.4313 103.412 10.8001 103.412 11.3798V20.7067C103.412 22.8408 105.173 22.0767 105.173 23.0779C105.173 23.315 104.983 23.6049 104.577 23.6049C103.981 23.6049 103.169 23.5258 102.194 23.5258C101.246 23.5258 100.488 23.6049 99.9193 23.6049ZM100 6.24205C100 5.24086 101.029 4.13428 102.383 4.13428C103.196 4.13428 103.9 4.63487 103.9 5.47798C103.9 6.47918 102.79 7.58576 101.436 7.58576C100.705 7.58576 100 7.11151 100 6.24205Z" fill="currentColor" />
                      <path d="M92.678 23.6049C92.2095 23.6049 91.8788 23.3716 91.8788 23.0604C91.8788 22.1269 93.7529 22.7492 93.7529 21.1415C93.7529 20.934 93.7254 20.6229 93.6702 20.3635L92.9812 16.0071C92.7883 14.7106 92.4576 12.5064 90.3078 12.5064C88.6817 12.5064 87.1934 13.6474 87.1934 16.1627V20.7525C87.1934 22.8529 89.0124 22.1009 89.0124 23.0863C89.0124 23.3197 88.792 23.6049 88.3785 23.6049C87.7722 23.6049 86.9729 23.5271 85.9532 23.5271C84.9886 23.5271 84.2444 23.6049 83.6381 23.6049C83.1971 23.6049 82.9766 23.3197 82.9766 23.0863C82.9766 22.1009 84.7129 22.8529 84.7129 20.7525V16.0071C84.7129 14.529 84.3547 12.5064 82.1773 12.5064C80.5237 12.5064 78.7322 13.7252 78.7322 16.3702V20.7525C78.7322 22.8529 80.5237 22.1009 80.5237 23.0863C80.5237 23.3197 80.3308 23.6049 79.9173 23.6049C79.311 23.6049 78.5117 23.5271 77.492 23.5271C76.5274 23.5271 75.7832 23.6049 75.1769 23.6049C74.7359 23.6049 74.5154 23.3197 74.5154 23.0863C74.5154 22.1009 76.2517 22.8529 76.2517 20.7525V14.4512C76.2517 12.8694 74.2949 13.7511 74.2949 12.7398C74.2949 12.3249 74.791 12.0137 76.1966 11.3654C77.6298 10.7172 77.9054 10.6394 78.1534 10.6394C78.622 10.6394 78.7322 11.0283 78.7322 11.5729V13.0769C79.6142 11.7285 81.0473 10.5356 83.1144 10.5356C85.1539 10.5356 86.2288 11.7025 86.7525 13.1028C87.5517 11.6766 88.8746 10.5356 91.0244 10.5356C94.1939 10.5356 95.0759 13.2325 95.4341 15.6959L96.1783 20.4932C96.5641 22.9307 98.2178 22.075 98.2178 23.1122C98.2178 23.4494 97.8595 23.6049 97.4461 23.6049C96.6744 23.6049 96.1507 23.5271 95.0483 23.5271C93.8632 23.5271 93.4498 23.6049 92.678 23.6049Z" fill="currentColor" />
                      <path d="M65.0662 23.8715C60.9975 23.8715 58.1602 21.1823 58.1602 17.266C58.1602 13.193 61.2117 10.2688 65.4677 10.2688C69.5631 10.2688 72.347 13.0102 72.347 16.9005C72.347 20.9734 69.2687 23.8715 65.0662 23.8715ZM60.7298 16.4305C60.7298 19.4852 62.7374 22.4355 65.7086 22.4355C68.1177 22.4355 69.7773 20.6079 69.7773 17.7098C69.7773 14.6551 67.7697 11.7048 64.7985 11.7048C62.3359 11.7048 60.7298 13.5846 60.7298 16.4305Z" fill="currentColor" />
                      <path d="M50.4916 23.6049C49.9965 23.6049 49.804 23.3655 49.804 23.0729C49.804 22.0356 51.6194 22.7006 51.6194 20.9186V15.28C51.6194 14.881 51.4819 14.6948 50.8767 14.6948H41.8268C41.1942 14.6948 41.0566 14.881 41.0566 15.28V20.9186C41.0566 22.7006 42.8721 22.0356 42.8721 23.0729C42.8721 23.3655 42.6796 23.6049 42.1844 23.6049C41.5793 23.6049 40.699 23.5251 39.6537 23.5251C38.6085 23.5251 37.7832 23.6049 37.1506 23.6049C36.6829 23.6049 36.4629 23.3655 36.4629 23.0729C36.4629 22.0356 38.3059 22.7006 38.3059 20.9186V7.38063C38.3059 5.59862 36.4629 6.23695 36.4629 5.19967C36.4629 4.9337 36.6829 4.66772 37.1781 4.66772C37.8108 4.66772 38.6085 4.74752 39.6537 4.74752C40.699 4.74752 41.5793 4.66772 42.1844 4.66772C42.6796 4.66772 42.8721 4.9337 42.8721 5.19967C42.8721 6.23695 41.0566 5.59862 41.0566 7.38063V12.6735C41.0566 13.099 41.1942 13.2586 41.8268 13.2586H50.8767C51.4819 13.2586 51.6194 13.099 51.6194 12.6735V7.38063C51.6194 5.59862 49.804 6.23695 49.804 5.19967C49.804 4.9337 49.9965 4.66772 50.4916 4.66772C51.0968 4.66772 51.9495 4.74752 52.9948 4.74752C54.0401 4.74752 54.8928 4.66772 55.5255 4.66772C56.0206 4.66772 56.2132 4.9337 56.2132 5.19967C56.2132 6.23695 54.3702 5.59862 54.3702 7.38063V20.9186C54.3702 22.7006 56.2132 22.0356 56.2132 23.0729C56.2132 23.3655 56.0206 23.6049 55.5255 23.6049C54.8928 23.6049 54.0401 23.5251 52.9948 23.5251C51.9495 23.5251 51.0968 23.6049 50.4916 23.6049Z" fill="currentColor" />
                      <path d="M28.7618 22.9664V5.14018C28.7618 4.94259 28.6588 4.75808 28.4873 4.64848L22.9404 1.10279C22.7334 0.970455 22.4637 0.970455 22.2567 1.10279L16.7097 4.64848C16.5383 4.75808 16.4353 4.94259 16.4353 5.14018V11.7384C16.4353 12.8263 15.5155 13.7082 14.3809 13.7082C13.2463 13.7082 12.3265 12.8263 12.3265 11.7384V5.04094C12.3265 4.84335 12.2235 4.65884 12.052 4.54924L6.50511 1.00355C6.29809 0.871214 6.02838 0.871214 5.82136 1.00355L0.274449 4.54924C0.102988 4.65884 0 4.84335 0 5.04094V22.9664C0 23.2927 0.275938 23.5573 0.616324 23.5573H11.7101C12.0505 23.5573 12.3265 23.2927 12.3265 22.9664V17.6478C12.3265 16.5599 13.2463 15.678 14.3809 15.678C15.5155 15.678 16.4353 16.5599 16.4353 17.6478V22.9664C16.4353 23.2927 16.7112 23.5573 17.0516 23.5573H28.1454C28.4858 23.5573 28.7618 23.2927 28.7618 22.9664Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Homie</div>
                </div>

                {/* Piercy & Company */}
                <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                  <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                    <svg width="100%" viewBox="0 0 180 24" xmlns="http://www.w3.org/2000/svg" fill="none" className="partner_carousel-logo">
                      <g id="Symbols" stroke="currentColor" strokeWidth="1" fill="currentColor" fillRule="evenodd">
                        <g id="TABLET-LAND-HEADER" transform="translate(-422 -28)" fill="currentColor">
                          <g id="LOGO" transform="translate(422 28)">
                            <path d="M108.556 17.781c1.11 0 2.008-.238 2.008-1.954V8.613c0-1.587-1.242-1.664-2.008-1.717v-.45l4.069-.634v3.196h.053c.344-.897 1.453-3.196 3.752-3.196 1.823 0 3.065.713 3.065 3.223h.053c.422-1.188 1.637-3.223 3.752-3.223 2.405 0 3.064.739 3.064 3.223v6.792c0 1.716.926 1.954 2.009 1.954v.45h-6.077v-.45c1.11 0 2.007-.238 2.007-1.954v-5.444c0-2.034-.237-3.303-1.69-3.303-1.428 0-3.118 2.325-3.118 5.496v3.251c0 1.716.899 1.954 2.007 1.954v.45h-6.077v-.45c1.11 0 2.009-.238 2.009-1.954v-5.444c0-2.272-.026-3.303-1.559-3.303-1.48 0-3.25 2.564-3.25 5.496v3.251c0 1.716.899 1.954 2.007 1.954v.45h-6.076v-.45z" id="Fill-1" />
                            <path d="M135.017 17.517c2.272 0 2.853-3.144 2.853-5.363 0-2.326-.422-5.364-2.853-5.364-2.088 0-2.722 3.091-2.722 5.364 0 2.51.713 5.363 2.722 5.363zm-6.79 5.839c1.109 0 2.008-.264 2.008-1.955V8.612c0-1.585-1.242-1.663-2.008-1.717v-.45l4.068-.633v1.955h.054c.237-.714 1.532-1.955 3.012-1.955 3.672 0 4.86 3.118 4.86 6.342 0 3.302-1.188 6.34-4.86 6.34-1.639 0-2.642-1.294-3.012-2.034h-.054v4.941c0 1.69.898 1.955 2.008 1.955v.45h-6.076v-.45z" id="Fill-3" />
                            <path d="M148.505 12.365c-1.242.026-4.624.263-4.624 2.721 0 1.375.898 2.3 1.797 2.3 1.717 0 2.827-1.666 2.827-3.463v-1.558zm3.91 5.891c-.316.08-.977.239-1.928.239-1.533 0-1.982-.794-1.982-1.928h-.053c-.818 1.187-1.955 1.928-3.752 1.928-1.822 0-3.17-1.268-3.17-2.986 0-3.832 4.967-3.832 6.975-4.017v-1.004c0-1.848-.026-3.804-2.246-3.804-1.638 0-1.849.687-1.849 1.532 0 1.084-.793 1.374-1.242 1.374-.713 0-1.269-.475-1.269-1.188 0-1.718 2.564-2.59 4.387-2.59 3.62 0 4.28 1.744 4.28 4.2v6.555c0 .924.317 1.24 1.136 1.24.238 0 .476-.053.714-.106v.555z" id="Fill-5" />
                            <path d="M153.284 17.781c1.11 0 2.008-.238 2.008-1.954V8.613c0-1.587-1.242-1.664-2.008-1.717v-.45l4.069-.634V9.3h.053c.37-.977 1.559-3.487 4.175-3.487 2.801 0 3.065 1.533 3.065 3.99v6.025c0 1.716.898 1.954 2.008 1.954v.45h-6.078v-.45c1.11 0 2.01-.238 2.01-1.954v-5.444c0-2.272-.027-3.303-1.771-3.303-1.56 0-3.462 2.986-3.462 5.496v3.251c0 1.716.899 1.954 2.008 1.954v.45h-6.077v-.45z" id="Fill-7" />
                            <path d="M173.553 18.865c-1.374 3.567-2.298 4.94-4.65 4.94-1.348 0-2.721-.317-2.721-1.69 0-.66.474-1.19 1.24-1.19 1.693 0 .74 1.903 2.194 1.903.713 0 1.4-1.058 1.982-2.563l.845-2.034-3.989-9.195c-.845-1.956-1.269-2.51-2.8-2.51v-.45h5.891v.45c-.898 0-1.4.158-1.4.712 0 .397.158.952.475 1.665l2.854 6.58 2.22-5.787c.396-1.058.765-1.981.765-2.3 0-.659-.422-.87-1.452-.87v-.45H180v.45c-1.348 0-1.981.819-2.536 2.245l-3.911 10.094z" id="Fill-9" />
                            <path d="M4.658 3.805c0-2.062.13-2.169 2.248-2.169 2.354 0 3.784.927 3.784 3.546 0 3.017-1.855 3.518-4.605 3.518H4.658V3.805zm1.427 5.927c2.886 0 7.09 0 7.09-4.55 0-3.997-2.802-4.576-6.27-4.576H0v.528c1.456 0 2.301.182 2.301 2.167v12.227c0 1.98-.845 2.167-2.3 2.167v.53h6.958v-.53c-1.428 0-2.301-.186-2.301-2.167V9.732h1.427z" id="Fill-11" />
                            <path d="M15.608 1.85c0-.847.663-1.51 1.505-1.51.85 0 1.507.663 1.507 1.51 0 .846-.657 1.504-1.507 1.504a1.488 1.488 0 01-1.505-1.505" id="Fill-13" />
                            <path d="M14.15 17.775c1.11 0 2.01-.237 2.01-1.96v-7.22c0-1.587-1.216-1.67-2.01-1.718v-.453l4.076-.634v10.024c0 1.724.898 1.961 2.01 1.961v.45H14.15v-.45z" id="Fill-15" />
                            <path d="M22.781 9.89c0-.98.82-3.227 2.831-3.227 2.037 0 2.512 1.824 2.512 3.226h-5.343zm7.697.292c0-3.07-2.141-4.393-4.522-4.393-3.806 0-5.37 2.145-5.37 6.008 0 4.443 2.303 6.693 6.403 6.693 1.613 0 2.514-.24 3.15-.477v-.848c-.532.265-1.245.344-1.854.344-4.418 0-5.504-4.523-5.504-6.746h7.697v-.581z" id="Fill-17" />
                            <path d="M31.789 17.775c1.11 0 2.011-.237 2.011-1.96v-7.22c0-1.587-1.218-1.67-2.011-1.718v-.453l4.072-.634v2.827h.054c.5-1.318 1.429-2.827 3.437-2.827.584 0 1.323.423 1.323 1.218 0 .767-.553 1.24-1.267 1.24-.796 0-1.14-.63-1.509-.63-.476 0-2.038 1.057-2.038 4.203v3.993c0 1.724.901 1.961 2.012 1.961v.45h-6.084v-.45z" id="Fill-19" />
                            <path d="M50.518 18.065c-.716.265-1.588.425-2.834.425-4.654 0-6.717-2.622-6.717-6.722 0-3.52 1.64-5.978 5.714-5.978 1.797 0 4.155.529 4.155 2.459 0 .769-.557 1.243-1.245 1.243-1.004 0-1.218-.818-1.427-1.693-.133-.581-.61-1.135-1.827-1.135-1.797 0-3.177 1.322-3.177 4.257 0 3.362 2.196 6.588 5.874 6.588.503 0 1.006-.107 1.484-.21v.766z" id="Fill-21" />
                            <path d="M59.145 18.858c-1.375 3.573-2.3 4.947-4.655 4.947-1.35 0-2.726-.317-2.726-1.692 0-.663.475-1.188 1.244-1.188 1.694 0 .74 1.902 2.197 1.902.714 0 1.4-1.059 1.98-2.57l.85-2.032-3.994-9.207c-.847-1.959-1.271-2.515-2.806-2.515v-.449h5.9v.45c-.898 0-1.401.16-1.401.714 0 .398.156.951.477 1.665l2.856 6.588 2.222-5.791c.396-1.062.767-1.984.767-2.3 0-.665-.423-.877-1.455-.877v-.449h5v.45c-1.35 0-1.986.82-2.54 2.247l-3.916 10.107z" id="Fill-23" />
                            <path d="M96.339 17.802c-1.297.476-2.776.715-4.735.715-5.292 0-7.832-4.021-7.832-9.657 0-4.895 1.588-8.493 7.25-8.493 2.116 0 3.915.425 5.079.742l.238 4.154h-.66c-.343-1.484-1.404-3.865-4.684-3.865-4.26 0-4.604 4.526-4.604 7.25 0 3.41.74 8.677 6.536 8.677 1.772 0 2.724-.396 3.412-.66v1.137z" id="Fill-25" />
                            <path d="M102.486 17.643c-2.645 0-3.176-3.281-3.176-5.475 0-2.197.53-5.477 3.176-5.477s3.174 3.28 3.174 5.477c0 2.194-.528 5.475-3.174 5.475m0-11.828c-3.385 0-5.528 2.385-5.528 6.353s2.143 6.349 5.528 6.349c3.386 0 5.528-2.38 5.528-6.35 0-3.967-2.142-6.352-5.528-6.352" id="Fill-27" />
                            <path d="M83.072 6.447V5.78h-3.104l-.199.044-.066.166c-1.324 3.367-2.524 5.935-3.668 7.83l-5.3-5.277 1.226-.804c2.927-2.009 2.722-3.88 2.714-3.925.002-1.08-.359-2.014-1.048-2.704C72.914.395 71.887 0 70.737 0c-2.28 0-3.935 1.605-3.935 3.814 0 1.14.456 2.184 1.362 3.111l1.519 1.515-1.362.895c-1.369.885-1.743 1.3-2.047 1.635l-.117.13c-.776.796-1.251 1.954-1.308 3.175-.053 1.038.362 2.065 1.16 2.89.973 1.007 2.439 1.608 3.916 1.608h.076c1.793-.024 3.643-.05 6.154-3.892l3.81 3.793.471-.471-3.915-3.899c1.166-1.905 2.384-4.482 3.719-7.857h2.832zM70.165 8.92l5.508 5.482c-2.354 3.657-3.97 3.68-5.686 3.704-1.282.049-2.624-.496-3.499-1.403-.668-.69-1.016-1.542-.974-2.396.05-1.06.459-2.06 1.128-2.75l.132-.145c.275-.302.62-.68 1.913-1.518l1.478-.974zm.572-8.253c.97 0 1.828.324 2.417.913.56.563.855 1.338.855 2.27 0 .015.105 1.602-2.418 3.337l-1.337.878-1.617-1.608c-.776-.798-1.17-1.687-1.17-2.642 0-1.824 1.375-3.148 3.27-3.148z" id="Fill-29" />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                  <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Piercy &amp; company</div>
                </div>

                {/* Partners Capital */}
                <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                  <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                    <svg xmlns="http://www.w3.org/2000/svg" id="header-logo" viewBox="0 0 288.27 110.47" width="100%" fill="none" className="partner_carousel-logo">
                      <path fill="currentColor" d="M145.53 86.78c-2.52 4.06-6.88 6.37-11.71 6.37-7.81 0-13.71-6.73-13.71-15.97 0-8.32 5.03-13.97 11.2-13.97 4.52 0 7.55 2.62 8.01 7.45l5.65-.67c-.36-6.16-6.26-9.6-12.53-9.6-8.94 0-17.31 7.04-17.31 19.05 0 11.3 7.86 18.23 17.15 18.23 6.26 0 12.53-3.49 13.25-10.89m38.89-15.97c-3.08 0-5.7 1.75-7.45 4.36v-4.11l-4.76.51v34.15h4.76v-9.35c1.49.72 3.54 1.13 5.55 1.13 7.04 0 12.07-5.6 12.07-14.07S189.4 70.8 184.42 70.8Zm-1.79 24.08c-2.16 0-4.42-1.03-5.65-2.57V76.3c1.18-.98 3.13-1.8 5.14-1.8 4.83 0 7.81 4.16 7.81 10.27 0 7.24-3.7 10.12-7.29 10.12Zm24.35-20.59h5.45V97h4.46V74.3h7.5v-2.98h-7.5v-7.39l-4.46.66v6.73h-5.45v2.98zM248.46 97h4.46l-.29-33.41-4.47.67.3 32.74zM130.57 17.19h-12.59v35.95h5.03V38.56h5.46c7.19 0 14.22-3.85 14.22-11.35 0-7.09-5.39-10.01-12.12-10.01Zm-2.05 18.64h-5.51V19.91h6.39c4.62 0 7.91 2.57 7.91 7.7 0 4.78-3.03 8.22-8.78 8.22Zm52.33-8.63c-.21-.05-.56-.05-.77-.05-4.06 0-7.09 2.36-8.83 4.67V27.2l-4.47.51v25.42h4.47V32.49h9.6V27.2Zm3.19 3.23h5.44v22.7h4.47v-22.7h7.5v-2.97h-7.5v-7.4l-4.47.67v6.73h-5.44v2.97zm20.6 22.7h4.47V32.74c2.05-1.23 4.36-1.95 6.47-1.95 3.29 0 5.03 2 5.03 6.32v16.02h4.47V35.47c0-5.6-2.88-8.52-7.14-8.52-3.29 0-6.27 1.64-8.83 4.83v-4.57l-4.47.51v25.42Zm44.96-18.07c0-5.29-4.62-8.11-9.29-8.11-7.75 0-11.91 6.78-11.91 13.76 0 7.55 5.08 12.94 11.61 12.94 4.67 0 8.94-3.13 9.24-7.39-1.85 2-4.72 3.29-7.86 3.29-4.26 0-7.86-2.88-8.47-8.78l16.64-4.67c.05-.36.05-.67.05-1.03Zm-16.64 1.84c.56-5.55 3.75-7.39 6.47-7.39 2.57 0 5.08 1.75 5.08 7.39h-11.55Zm34.13-9.7c-.21-.05-.56-.05-.77-.05-4.06 0-7.09 2.36-8.83 4.67V27.2l-4.47.51v25.42h4.47V32.49h9.6V27.2Zm1.46 19.36c0 4.72 4.62 7.09 9.65 7.09 5.29 0 10.06-2.77 10.06-7.86 0-3.08-1.95-5.19-5.96-6.78l-4.16-1.59c-3.29-1.28-4.16-2.88-4.16-4.31 0-2.05 2-3.59 4.42-3.59 3.08 0 4.57 1.85 4.57 4.16v.41l5.08-.62c-.31-4.16-4.11-6.52-8.94-6.52-5.14 0-9.35 2.93-9.35 7.5 0 3.34 2.26 5.49 6.57 7.19l3.9 1.54c2.67 1.08 3.54 2.41 3.54 4.06 0 2.26-2.05 3.85-4.93 3.85-3.44 0-5.24-2.31-5.24-4.78v-.36l-5.08.62ZM158.47 70.81c-2.02 0-4.24.41-5.84 1.54-1.36.98-2.77 2.62-3.01 5.44 1.97-2.05 4.52-2.93 7.06-2.93 3.52 0 6.72 1.59 6.72 5.44v1.23l-7.7 3.08c-4.26 1.69-6.97 4.31-6.97 7.65s2.67 5.24 6.01 5.24c3.54 0 6.82-2.21 8.66-5.75v5.24h4.26V79.32c0-5.8-4.27-8.52-9.2-8.52Zm4.83 20.23c-1.44 1.64-3.9 2.62-5.96 2.62-2.67 0-4.25-1.49-4.25-3.75 0-1.64.67-3.29 2.05-4.52h8.15v5.65Zm71.55-20.23c-2.02 0-4.24.41-5.84 1.54-1.36.98-2.77 2.62-3.01 5.44 1.97-2.05 4.52-2.93 7.06-2.93 3.52 0 6.72 1.59 6.72 5.44v1.23l-7.7 3.08c-4.26 1.69-6.97 4.31-6.97 7.65s2.67 5.24 6.01 5.24c3.54 0 6.82-2.21 8.66-5.75v5.24h4.26V79.32c0-5.8-4.27-8.52-9.2-8.52Zm4.83 20.23c-1.44 1.64-3.9 2.62-5.96 2.62-2.67 0-4.25-1.49-4.25-3.75 0-1.64.67-3.29 2.05-4.52h8.15v5.65Zm-82.13-43.86c-1.44 1.64-3.9 2.62-5.96 2.62-2.67 0-4.25-1.49-4.25-3.75 0-1.64.67-3.29 2.05-4.52h8.15v5.65Zm-4.83-20.24c-2.02 0-4.24.41-5.84 1.54-1.36.98-2.77 2.62-3.01 5.44 1.97-2.05 4.52-2.93 7.06-2.93 3.52 0 6.72 1.59 6.72 5.44v1.23l-7.7 3.08c-4.26 1.69-6.97 4.31-6.97 7.65s2.67 5.24 6.01 5.24c3.54 0 6.82-2.21 8.66-5.75v5.24h4.26V35.45c0-5.8-4.27-8.52-9.2-8.52M198.37 97h4.47V71.06l-4.47.52V97zm-.46-35.95h5.39v4.67h-5.39zM85.43 21.07c1.15 0 2.08.85 2.22 1.95.01.1.03.2.03.31-.01 1.25-1.04 2.26-2.3 2.26-.7 0-1.31-.32-1.73-.81-.33-.39-.53-.9-.52-1.45a2.305 2.305 0 0 1 2.3-2.26ZM59.37 70.13c5.01 3.42 10.48 9.68 13.82 16.31-1.04-6.27-2.71-11.8-2.57-19.17.15-7.93 1.79-15.54 5.33-22.62l1.16-2.33s-17 9.15-17.73 27.8Zm36.71-45.16c-1.39-2.19-3.2-4.26-5.37-6.12 1.37 3.32 3.21 13.93-20.86 16.94 6-2.51 7.54-7.26 7.73-9.67.1-1.24-.23-1.99-.84-2.34-1.15-.66-2.26.72-2.77 1.37-2.43 3.14-6.27 5.18-11.37 4.21-9.36-1.78-9.51-12.3-9.55-12.64 2.24-.91 4.33-1.82 6.64-2.33-1.4 1.32-2.26 3.15-2.26 5.16 0 4.05 3.49 7.33 7.81 7.33s7.81-3.28 7.81-7.33c0-.89-.18-1.74-.49-2.53.1.07.21.13.31.2 1.71 1.15 3.01 2.02 3.82 2.5 2.51 1.48 5.76 1.01 7.69-1.16.02-.02.04-.05.06-.06 2.59-3.08 2.5-6.55-.8-9.58 0 0-2.79-3.05-8.31-5.56C70.79 1.3 64.27-.02 56.5 0 37.98.06 30.44 7.65 27.86 9.63 14.55 19.83 5.85 40.54.02 62.84c-.07.26.05.53.29.65 22.55 11.71 41.53 28.9 58.88 46.98 1.1-5.17.28-20.87-7.8-29.73-6.29-6.89-12.99-10.89-17.5-14.96-3.94-3.56-6.78-7.86-7.63-9.96-2.71-6.71-2.55-15.16 2.64-23.56l-.05.37-.02-.03v.22l.03-.19v.02c.03-.25.05-.38.05-.39 0 .14 0 .28-.01.42l-.03-.03c-.17 2.36-.32 15.06 14.79 25.86 2.56-3.02 17.86-20.11 36.42-20.11.1 0 1.17 0 2.16.07.99.08 1.9.25 1.9.25 3.91.63 6.89 3.98 6.89 8.01 0 1.6-.47 3.09-1.28 4.34 4.7-3.27 8.59-8.19 9.32-13.65.58-4.34-.55-8.6-2.98-12.46Z" />
                    </svg>
                  </div>
                  <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Partners Capital</div>
                </div>

                {/* Layer Pm */}
                <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                  <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 2170 925" fill="none" className="partner_carousel-logo">
                      <path d="M3.75 0.337874C2.08 -0.622126 0 0.577874 0 2.49787V84.3379C0 105.648 11.31 125.358 29.7 136.128L416.99 358.728C482.12 396.838 562.69 397.068 628.04 359.338L858.21 226.428C876.77 215.708 888.21 195.898 888.21 174.468V92.8079C888.21 90.8879 886.13 89.6779 884.46 90.6379L627.34 239.108C562.37 276.618 482.31 276.618 417.34 239.108L3.75 0.337874Z" fill="currentColor" />
                      <path d="M3.75 181.338C2.08 180.378 0 181.578 0 183.508V249.188C0 271.118 11.97 291.308 31.21 301.828L418.79 524.758C483.09 559.918 561.07 559.018 624.54 522.368L858.21 387.438C876.77 376.718 888.21 356.908 888.21 335.478V273.818C888.21 271.898 886.13 270.688 884.46 271.648L627.34 420.118C562.37 457.628 482.31 457.628 417.34 420.118L3.75 181.338Z" fill="currentColor" />
                      <path d="M3.75 342.338C2.08 341.378 0 342.578 0 344.508V386.348C0 407.658 11.31 427.368 29.7 438.138L416.99 660.738C482.12 698.848 562.69 699.078 628.04 661.348L858.21 528.438C876.77 517.718 888.21 497.908 888.21 476.478V434.818C888.21 432.898 886.13 431.688 884.46 432.648L627.34 581.118C562.37 618.628 482.31 618.628 417.34 581.118L3.75 342.338Z" fill="currentColor" />
                      <path d="M3.75 483.338C2.08 482.378 0 483.578 0 485.508V506.348C0 527.658 11.31 547.368 29.7 558.138L416.99 780.738C482.12 818.848 562.69 819.078 628.04 781.348L858.21 648.438C876.77 637.718 888.21 617.908 888.21 596.478V575.818C888.21 573.898 886.13 572.688 884.46 573.648L627.34 722.118C562.37 759.628 482.31 759.628 417.34 722.118L3.75 483.338Z" fill="currentColor" />
                      <path d="M3.75 603.338C2.08 602.378 0 603.578 0 605.508V605.348C0 626.658 11.31 646.368 29.7 657.138L416.99 881.738C482.12 919.848 562.69 920.078 628.04 882.348L858.21 749.438C876.77 738.718 888.21 718.908 888.21 697.478V695.818C888.21 693.898 886.13 692.688 884.46 693.648L627.34 842.118C562.37 879.628 482.31 879.628 417.34 842.118L3.75 603.338Z" fill="currentColor" />
                      <path d="M1044.47 113.248V392.718C1044.47 393.808 1045.35 394.688 1046.44 394.688H1199.73C1212.78 394.688 1223.36 405.268 1223.36 418.318V431.218C1223.36 432.308 1222.48 433.188 1221.39 433.188H1028.76C1012.19 433.188 998.76 419.758 998.76 403.188V91.5979C998.76 90.5079 999.64 89.6279 1000.73 89.6279H1020.85C1033.9 89.6279 1044.48 100.208 1044.48 113.258L1044.47 113.248Z" fill="currentColor" />
                      <path d="M1436.19 211.778C1430.73 202.818 1423.51 195.858 1414.54 190.888C1405.56 185.928 1395.53 182.648 1384.47 181.048C1373.4 179.448 1362.25 178.638 1351.03 178.638C1336.91 178.638 1323.68 180.078 1311.33 182.968C1298.98 185.858 1287.99 190.588 1278.37 197.158C1268.75 203.738 1261.05 212.318 1255.27 222.898C1249.76 233.008 1246.58 245.308 1245.75 259.808C1245.69 260.928 1246.59 261.878 1247.72 261.878H1250.46C1271.1 261.878 1278.19 265.358 1292.65 237.538C1295.59 231.888 1299.95 227.648 1305.31 224.588C1316.86 218.018 1331.29 214.728 1348.62 214.728C1355.03 214.728 1361.53 215.208 1368.11 216.168C1374.68 217.128 1380.62 219.058 1385.91 221.938C1391.2 224.828 1395.53 228.998 1398.9 234.448C1402.27 239.908 1403.95 247.128 1403.95 256.098C1403.95 263.798 1401.7 269.658 1397.21 273.658C1392.71 277.668 1386.62 280.718 1378.93 282.798C1371.23 284.888 1362.33 286.488 1352.22 287.608C1342.11 288.738 1331.45 290.418 1320.22 292.658C1309.63 294.578 1299.29 296.988 1289.18 299.878C1279.08 302.768 1270.09 307.018 1262.23 312.628C1254.37 318.248 1248.04 325.548 1243.22 334.518C1238.41 343.498 1236 355.048 1236 369.158C1236 381.668 1238.16 392.338 1242.5 401.158C1246.83 409.988 1252.68 417.118 1260.06 422.568C1267.44 428.028 1276.18 432.038 1286.28 434.598C1296.39 437.158 1307.05 438.448 1318.28 438.448C1335.6 438.448 1351.72 435.478 1366.64 429.548C1381.56 423.618 1394.62 413.908 1405.86 400.438C1405.86 400.648 1405.86 406.208 1405.85 413.798C1405.84 425.248 1414.05 435.098 1425.33 437.088C1432.09 438.278 1437.48 438.528 1442.43 438.428C1443.5 438.408 1444.36 437.528 1444.36 436.458V246.788C1444.36 232.388 1441.63 220.708 1436.18 211.748L1436.19 211.778ZM1403.47 346.368C1403.47 352.108 1402.03 358.258 1399.14 364.808C1396.25 371.358 1391.76 377.418 1385.67 382.998C1379.57 388.588 1371.72 393.218 1362.09 396.888C1352.47 400.558 1340.92 402.388 1327.45 402.388C1321.03 402.388 1314.94 401.758 1309.17 400.478C1303.4 399.198 1298.34 397.128 1294.01 394.248C1289.68 391.378 1286.15 387.628 1283.42 382.988C1280.69 378.358 1279.33 372.698 1279.33 365.988C1279.33 355.778 1281.65 347.718 1286.31 341.808C1290.96 335.898 1296.97 331.348 1304.35 328.158C1311.73 324.968 1320.06 322.658 1329.37 321.218C1338.67 319.778 1347.9 318.508 1357.04 317.388C1366.18 316.278 1374.92 314.838 1383.26 313.078C1390.07 311.638 1395.81 309.518 1400.49 306.698C1401.8 305.908 1403.47 306.838 1403.47 308.378V346.358V346.368Z" fill="currentColor" />
                      <path d="M1578.66 466.388C1573.85 478.578 1569.11 488.838 1564.47 497.188C1559.82 505.528 1554.68 512.348 1549.07 517.638C1543.45 522.928 1537.2 526.778 1530.3 529.188C1523.4 531.598 1515.46 532.798 1506.48 532.798C1501.67 532.798 1496.86 532.478 1492.04 531.838C1491.99 531.838 1491.94 531.828 1491.9 531.818C1483.95 530.738 1478.09 523.818 1478.09 515.798V490.938C1481.62 492.538 1485.71 493.898 1490.36 495.028C1495.01 496.148 1498.94 496.708 1502.15 496.708C1510.49 496.708 1517.47 494.698 1523.08 490.698C1528.69 486.688 1532.94 480.988 1535.83 473.618L1552.67 431.758L1455.1 187.128C1454.58 185.838 1455.54 184.428 1456.93 184.428H1483.57C1493.56 184.428 1502.46 190.708 1505.82 200.108L1572.88 387.968H1573.84L1638.14 200.398C1641.41 190.848 1650.39 184.438 1660.49 184.438H1684.06C1685.44 184.438 1686.39 185.828 1685.9 187.108L1578.66 466.408V466.388Z" fill="currentColor" />
                      <path d="M1869.44 417.308C1850.83 431.428 1827.41 438.478 1799.19 438.478C1779.3 438.478 1762.06 435.268 1747.46 428.858C1732.86 422.448 1720.59 413.458 1710.65 401.908C1700.7 390.358 1693.24 376.568 1688.28 360.528C1683.3 344.488 1680.5 327.008 1679.86 308.078C1679.86 289.158 1682.75 271.828 1688.52 256.108C1694.29 240.398 1702.39 226.758 1712.82 215.208C1723.24 203.658 1735.59 194.678 1749.87 188.258C1764.14 181.848 1779.78 178.638 1796.79 178.638C1818.92 178.638 1837.28 183.208 1851.89 192.348C1866.48 201.488 1878.19 213.118 1887.02 227.238C1895.84 241.358 1901.94 256.758 1905.3 273.428C1906.8 280.858 1907.9 288.128 1908.61 295.248C1909.98 309.098 1899 321.068 1885.08 321.068H1725.1C1724.03 321.068 1723.14 321.928 1723.13 322.998C1723.01 333.198 1724.3 342.898 1727.02 352.098C1729.91 361.888 1734.55 370.548 1740.97 378.078C1747.38 385.618 1755.56 391.638 1765.51 396.118C1775.45 400.618 1787.16 402.858 1800.64 402.858C1817.96 402.858 1832.16 398.848 1843.22 390.828C1850.77 385.358 1856.56 377.948 1860.6 368.598C1864.35 359.918 1872.86 354.258 1882.32 354.258H1903.12C1904.37 354.258 1905.31 355.408 1905.05 356.618C1899.38 383.348 1887.51 403.578 1869.44 417.288V417.308ZM1859.58 257.558C1855.89 248.898 1850.92 241.438 1844.66 235.188C1838.41 228.928 1831.02 223.958 1822.53 220.268C1814.03 216.588 1804.64 214.738 1794.38 214.738C1784.12 214.738 1774.25 216.588 1765.75 220.268C1757.25 223.958 1749.95 229.008 1743.86 235.428C1737.76 241.848 1732.95 249.308 1729.42 257.798C1726.15 265.658 1724.13 273.998 1723.33 282.818C1723.23 283.978 1724.13 284.978 1725.29 284.978H1863.94C1865.11 284.978 1866.01 283.968 1865.9 282.808C1865.09 273.978 1862.98 265.558 1859.58 257.548V257.558Z" fill="currentColor" />
                      <path d="M2064.47 178.598C2065.55 178.598 2066.43 179.488 2066.43 180.568V200.058C2066.43 211.818 2057.69 221.648 2046.04 223.278C2038.14 224.388 2030.98 226.188 2024.56 228.688C2013.01 233.188 2003.7 239.748 1996.65 248.418C1989.59 257.078 1984.45 267.588 1981.25 279.938C1978.04 292.298 1976.44 306.488 1976.44 322.528V409.568C1976.44 422.618 1965.86 433.198 1952.81 433.198H1937.5C1936.41 433.198 1935.53 432.318 1935.53 431.228V186.388C1935.53 185.298 1936.41 184.418 1937.5 184.418H1950.4C1963.45 184.418 1974.03 194.998 1974.03 208.048V217.888C1977.1 213.088 1980.71 208.658 1984.83 204.638C1984.83 204.638 2008.18 178.618 2064.45 178.608L2064.47 178.598Z" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Layer Pm</div>
                </div>

                {/* Element BC */}
                <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                  <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                    <svg width="100%" viewBox="0 0 175 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner_carousel-logo">
                      <path d="M174.22 12.0567H163.262V14.46H174.22V12.0567ZM175 27.1462L174.253 24.9079C173.863 25.0829 173.47 25.2209 173.07 25.3286C172.67 25.4363 172.276 25.4902 171.886 25.4902C170.979 25.4902 170.283 25.2478 169.795 24.7598C169.308 24.2717 169.066 23.575 169.066 22.6661V7.08859L166.342 8.4518V22.7941C166.342 24.44 166.789 25.7056 167.687 26.5908C168.581 27.4794 169.842 27.9204 171.463 27.9204C172.761 27.9204 173.937 27.6612 174.997 27.1429M160.64 27.5367V17.5432C160.64 15.7054 160.132 14.2648 159.117 13.2281C158.101 12.188 156.676 11.6696 154.836 11.6696C152.244 11.6696 150.277 12.7737 148.936 14.9817L149.746 16.5401C150.933 14.938 152.459 14.1369 154.319 14.1369C155.442 14.1369 156.323 14.4566 156.961 15.0962C157.6 15.7357 157.916 16.6277 157.916 17.7721V27.54H160.64V27.5367ZM149.847 27.5367V15.1736L149.295 12.0567H147.123V27.5367H149.847ZM142.941 24.2246L140.671 23.2855C140.153 24.0428 139.525 24.6319 138.792 25.0526C138.059 25.4734 137.171 25.6854 136.132 25.6854C134.448 25.6854 133.14 25.1704 132.212 24.1438C131.284 23.1172 130.816 21.6732 130.816 19.8118C130.816 18.5765 131.028 17.5196 131.448 16.631C131.869 15.7458 132.464 15.0558 133.23 14.5711C133.997 14.083 134.922 13.8407 136.001 13.8407C136.993 13.8407 137.847 14.0628 138.563 14.5071C139.276 14.9514 139.821 15.5943 140.2 16.4358C140.58 17.2773 140.769 18.2837 140.769 19.4517L141.545 18.6405H129.586V20.6197H143.297C143.317 20.4244 143.327 20.2393 143.327 20.0676V19.5493C143.327 17.1056 142.675 15.1803 141.367 13.7733C140.059 12.3664 138.274 11.6629 136.004 11.6629C134.404 11.6629 133.025 11.9928 131.869 12.6525C130.712 13.3122 129.818 14.2547 129.179 15.4765C128.54 16.6983 128.224 18.1423 128.224 19.8085C128.224 22.3397 128.917 24.3256 130.299 25.7628C131.684 27.2034 133.617 27.9204 136.102 27.9204C139.212 27.9204 141.492 26.6885 142.941 24.2212M124.66 27.5367V17.348C124.66 15.5539 124.179 14.1571 123.218 13.1607C122.256 12.1678 120.888 11.6663 119.116 11.6663C117.818 11.6663 116.668 11.9423 115.663 12.4943C114.657 13.0463 113.83 13.8844 113.181 15.0086L114.123 16.7286C114.684 15.8872 115.343 15.2409 116.1 14.8C116.856 14.3556 117.677 14.1335 118.564 14.1335C119.623 14.1335 120.45 14.4331 121.046 15.0255C121.641 15.6212 121.937 16.4695 121.937 17.5735V27.5367H124.66ZM114.674 27.5367V17.348C114.674 15.5977 114.183 14.2109 113.198 13.1944C112.216 12.1779 110.848 11.6696 109.099 11.6696C106.699 11.6696 104.917 12.7097 103.75 14.7865L104.56 16.3449C105.078 15.6111 105.667 15.0591 106.326 14.6889C106.985 14.322 107.738 14.1369 108.578 14.1369C109.637 14.1369 110.465 14.4364 111.06 15.0288C111.655 15.6246 111.951 16.4728 111.951 17.5769V27.54H114.674V27.5367ZM104.661 27.5367V15.1736L104.11 12.0567H101.938V27.5367H104.661ZM97.7552 24.2246L95.4857 23.2855C94.9679 24.0428 94.3391 24.6319 93.6062 25.0526C92.8732 25.4734 91.9855 25.6854 90.9466 25.6854C89.2621 25.6854 87.9542 25.1704 87.0262 24.1438C86.0982 23.1172 85.6309 21.6732 85.6309 19.8118C85.6309 18.5765 85.8427 17.5196 86.263 16.631C86.6832 15.7458 87.2784 15.0558 88.045 14.5711C88.8116 14.083 89.7362 13.8407 90.8155 13.8407C91.8073 13.8407 92.6614 14.0628 93.3775 14.5071C94.0903 14.9514 94.635 15.5943 95.0149 16.4358C95.3949 17.2773 95.5832 18.2837 95.5832 19.4517L96.3599 18.6405H84.4003V20.6197H98.1116C98.1318 20.4244 98.1418 20.2393 98.1418 20.0676V19.5493C98.1418 17.1056 97.4896 15.1803 96.1817 13.7733C94.8737 12.3664 93.0884 11.6629 90.8188 11.6629C89.2184 11.6629 87.8399 11.9928 86.6866 12.6525C85.53 13.3122 84.6323 14.2547 83.9968 15.4765C83.358 16.6983 83.0419 18.1423 83.0419 19.8085C83.0419 22.3397 83.7345 24.3256 85.1164 25.7628C86.5017 27.2034 88.435 27.9204 90.9197 27.9204C94.0298 27.9204 96.3094 26.6885 97.7586 24.2212M79.2795 27.5367V5.04883L76.5561 6.41204V27.5367H79.2795ZM72.3768 24.2246L70.1073 23.2855C69.5895 24.0428 68.9607 24.6319 68.2278 25.0526C67.4948 25.4734 66.6071 25.6854 65.5682 25.6854C63.8837 25.6854 62.5758 25.1704 61.6478 24.1438C60.7198 23.1172 60.2525 21.6732 60.2525 19.8118C60.2525 18.5765 60.4643 17.5196 60.8846 16.631C61.3049 15.7458 61.9 15.0558 62.6666 14.5711C63.4332 14.083 64.3578 13.8407 65.4371 13.8407C66.4323 13.8407 67.2863 14.0628 67.9991 14.5071C68.7119 14.9514 69.26 15.5943 69.6365 16.4358C70.0131 17.2773 70.2048 18.2837 70.2048 19.4517L70.9815 18.6405H59.0219V20.6197H72.7332C72.7567 20.4244 72.7668 20.2393 72.7668 20.0676V19.5493C72.7668 17.1056 72.1145 15.1803 70.8066 13.7733C69.4987 12.3664 67.71 11.6629 65.4404 11.6629C63.84 11.6629 62.4648 11.9928 61.3082 12.6525C60.1516 13.3122 59.2572 14.2547 58.6184 15.4765C57.9796 16.6983 57.6602 18.1423 57.6602 19.8085C57.6602 22.3397 58.3528 24.3256 59.7347 25.7628C61.1199 27.2034 63.0532 27.9204 65.5379 27.9204C68.6514 27.9204 70.931 26.6885 72.3768 24.2212" fill="currentColor" />
                      <path d="M19.9056 0.505233V3.83078C19.9056 4.11352 19.677 4.3424 19.3945 4.3424H0.512051C-0.0561726 4.3424 -0.200753 5.1334 0.330485 5.33199L9.72466 8.88978C9.78182 8.91334 9.84234 8.92344 9.90623 8.92344H19.3979C19.6803 8.92344 19.909 9.15232 19.909 9.43506V13.5045H0.512051C-0.0561726 13.5045 -0.200753 14.2921 0.330485 14.4941L9.72466 18.0519C9.78182 18.0754 9.84234 18.0855 9.90623 18.0855H19.3979C19.6803 18.0855 19.909 18.3144 19.909 18.5971V22.6666H0.512051C-0.0561726 22.6666 -0.200753 23.4576 0.330485 23.6595L24.9154 32.9663C24.9725 32.9899 25.0331 33 25.0969 33H46.6894C46.9719 33 47.2005 32.7711 47.2005 32.4884V28.7758C47.2005 28.5637 47.066 28.3718 46.8676 28.2978L37.7155 24.8342C37.1843 24.6323 37.3289 23.8413 37.8971 23.8413H46.6861C46.9685 23.8413 47.1971 23.6124 47.1971 23.3297V19.617C47.1971 19.405 47.0626 19.2131 46.8643 19.1391L37.7122 15.6755C37.1809 15.4736 37.3255 14.6826 37.8937 14.6826H46.6827C46.9651 14.6826 47.1938 14.4537 47.1938 14.1709V10.455C47.1938 10.2429 47.0593 10.051 46.8609 9.97698L20.5949 0.033998C20.262 -0.0939076 19.9022 0.155176 19.9022 0.511966" fill="currentColor" />
                    </svg>
                  </div>
                  <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Element BC</div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

    </>
  );
}
