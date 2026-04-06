import Image from 'next/image';
import TransitionLink from '@/components/ui/TransitionLink';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllProjects, getProjectBySlug } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/imageUrl';

export const revalidate = 3600;

const EyebrowSvg = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 61 42" fill="none" data-stagger-item="" className={className}>
    <path d="M25.3848 0.64093V4.85967C25.3848 5.21835 25.0933 5.5087 24.7331 5.5087H0.652998C-0.0716348 5.5087 -0.256013 6.51215 0.421455 6.76408L12.4015 11.2774C12.4744 11.3073 12.5516 11.3201 12.633 11.3201H24.7374C25.0976 11.3201 25.3891 11.6105 25.3891 11.9692V17.1316H0.652998C-0.0716348 17.1316 -0.256013 18.1308 0.421455 18.387L12.4015 22.9003C12.4744 22.9302 12.5516 22.943 12.633 22.943H24.7374C25.0976 22.943 25.3891 23.2334 25.3891 23.5921V28.7545H0.652998C-0.0716348 28.7545 -0.256013 29.7579 0.421455 30.0141L31.7736 41.8206C31.8465 41.8505 31.9237 41.8633 32.0052 41.8633H59.5412C59.9014 41.8633 60.193 41.5729 60.193 41.2143V36.5045C60.193 36.2355 60.0214 35.9921 59.7685 35.8981L48.0972 31.5043C47.4197 31.2481 47.6041 30.2447 48.3287 30.2447H59.5369C59.8971 30.2447 60.1887 29.9543 60.1887 29.5957V24.8859C60.1887 24.6169 60.0172 24.3735 59.7642 24.2795L48.0929 19.8857C47.4154 19.6295 47.5998 18.6261 48.3244 18.6261H59.5326C59.8928 18.6261 60.1844 18.3357 60.1844 17.977V13.263C60.1844 12.994 60.0129 12.7506 59.7599 12.6566L26.2638 0.0431294C25.8394 -0.11913 25.3806 0.196854 25.3806 0.649472" fill="currentColor" />
  </svg>
);

// Layout config for the gallery grid — mirrors the original per-image column/ratio assignments
const GALLERY_LAYOUTS = [
  { col: 'u-column-start-1 u-column-span-12', ratio: 'u-ratio-2-1' },
  { col: 'u-column-start-1 u-column-span-6',  ratio: 'u-ratio-4-5' },
  { col: 'u-column-start-7 u-column-span-6',  ratio: 'u-ratio-4-5' },
  { col: 'u-column-start-1 u-column-span-12', ratio: 'u-ratio-2-1' },
  { col: 'u-column-start-1 u-column-span-12', ratio: 'u-ratio-2-1' },
  { col: 'u-column-start-1 u-column-span-6',  ratio: 'u-ratio-4-5' },
  { col: 'u-column-start-7 u-column-span-6',  ratio: 'u-ratio-4-5' },
  { col: 'u-column-start-1 u-column-span-12', ratio: 'u-ratio-2-1' },
  { col: 'u-column-start-1 u-column-span-6',  ratio: 'u-ratio-4-5' },
  { col: 'u-column-start-7 u-column-span-6',  ratio: 'u-ratio-4-5' },
] as const;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  return {
    title: project?.seoTitle ?? project?.projectName ?? 'Project',
    description: project?.seoDescription,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getAllProjects(),
  ]);

  if (!project) notFound();

  const relatedProjects = allProjects
    .filter((p) => p.slug !== slug)
    .slice(0, 4);

  return (
    <main>

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section data-hero-wrap="" className="project_hero-wrap u-min-height-screen">
        <div data-wf--spacer--variant="page-top" className="u-section-spacer is-page-top u-ignore-trim"></div>
        <div className="project_hero-contain u-container">
          <div className="project_hero-layout u-flex-vertical-nowrap u-alignment-center u-gap-7">

            <div data-stagger="" className="project_hero-eyebrow u-flex-horizontal-nowrap u-gap-2">
              <EyebrowSvg className="project_hero_eyebrow-svg" />
              <div data-anim-hero="" data-split="word" className="project_hero_eyebrow-heading u-text-style-large u-text-transform-uppercase u-weight-bold">
                {project.category?.name}
              </div>
            </div>

            <div className="project_hero_heading-wrap">
              <h3 data-split="word" data-anim-hero="" className="project_hero-heading u-text-style-h2 u-text-transform-uppercase">
                {project.projectName}
              </h3>
            </div>

            <div className="project_hero_featured-wrap u-position-relative u-ratio-4-5">
              {urlFor(project.featuredImage1) && (
                <Image
                  src={urlFor(project.featuredImage1)}
                  fill
                  priority
                  alt={project.featuredImage1?.alt ?? project.projectName}
                  className="project_hero_featured-img u-cover-absolute"
                />
              )}
              <div data-overlay-start="top center" data-overlay="" className="color_reveal-overlay u-cover-absolute u-pointer-off"></div>
            </div>

          </div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          SECTION 1 — EYEBROW, HEADING, STATS TABLES
      ============================================================ */}
      {project.sectionHeading1 && (
        <section className="project_section-wrap">
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
          <div className="project_section-contain u-container">
            <div className="project_section-layout u-grid-custom u-gap-row-6">

              {/* Eyebrow */}
              {project.sectionEyebrow1 && (
                <div className="project_section-col u-column-start-1 u-column-span-3">
                  <div data-stagger="" className="project_section_eyebrow-wrap u-flex-horizontal-nowrap u-gap-2">
                    <EyebrowSvg className="project_section_eyebrow-svg" />
                    <div data-split="word" className="project_section_eyebrow-heading u-text-style-large u-text-transform-uppercase u-weight-bold">
                      {project.sectionEyebrow1}
                    </div>
                  </div>
                </div>
              )}

              {/* Heading */}
              <div className="project_section-col u-column-start-4 u-column-span-9">
                <h2 data-split="word" className="project_section-heading u-text-style-h2 u-text-transform-uppercase">
                  {project.sectionHeading1}
                </h2>
              </div>

              {/* Stats tables */}
              {project.tableStats?.map((stat, i) => (
                <div key={stat._key} className={`project_table-col u-column-span-3${i === 0 ? ' u-column-start-4' : ''}`}>
                  <div className="project_table-item u-flex-vertical-nowrap u-gap-4">
                    {stat.header && <div className="project_table-header u-text-style-small u-text-transform-uppercase">{stat.header}</div>}
                    {stat.statA && <div className="project_table-stat u-text-style-main">{stat.statA}</div>}
                    {stat.statB && <div className="project_table-stat u-text-style-main">{stat.statB}</div>}
                    {stat.statC && <div className="project_table-stat u-text-style-main">{stat.statC}</div>}
                  </div>
                </div>
              ))}

            </div>
          </div>
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        </section>
      )}

      {/* ============================================================
          INFO SECTION
      ============================================================ */}
      <section className="project_info-wrap">
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="project_info-contain u-container">
          <div className="project_info-layout u-grid-custom">

            {project.client && (
              <div className="project_info-col u-column-span-6">
                <div className="project_info-item u-flex-vertical-nowrap u-gap-2">
                  <div className="project_info-label u-text-style-x-small u-text-transform-uppercase">Client</div>
                  <div className="project_info-value u-text-style-main">{project.client}</div>
                </div>
              </div>
            )}

            {project.completedDate && (
              <div className="project_info-col u-column-span-6">
                <div className="project_info-item u-flex-vertical-nowrap u-gap-2">
                  <div className="project_info-label u-text-style-x-small u-text-transform-uppercase">Completed</div>
                  <div className="project_info-value u-text-style-main">{project.completedDate}</div>
                </div>
              </div>
            )}

            {project.size && (
              <div className="project_info-col u-column-span-6">
                <div className="project_info-item u-flex-vertical-nowrap u-gap-2">
                  <div className="project_info-label u-text-style-x-small u-text-transform-uppercase">Size</div>
                  <div className="project_info-value u-text-style-main">{project.size}</div>
                </div>
              </div>
            )}

            {project.duration && (
              <div className="project_info-col u-column-span-6">
                <div className="project_info-item u-flex-vertical-nowrap u-gap-2">
                  <div className="project_info-label u-text-style-x-small u-text-transform-uppercase">Duration</div>
                  <div className="project_info-value u-text-style-main">{project.duration}</div>
                </div>
              </div>
            )}

          </div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          SECTION 2
      ============================================================ */}
      {project.sectionHeading2 && (
        <section className="project_section-wrap">
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
          <div className="project_section-contain u-container">
            <div className="project_section-layout u-grid-custom u-gap-row-6">

              {project.sectionEyebrow2 && (
                <div className="project_section-col u-column-start-1 u-column-span-3">
                  <div data-stagger="" className="project_section_eyebrow-wrap u-flex-horizontal-nowrap u-gap-2">
                    <EyebrowSvg className="project_section_eyebrow-svg" />
                    <div data-split="word" className="project_section_eyebrow-heading u-text-style-large u-text-transform-uppercase u-weight-bold">
                      {project.sectionEyebrow2}
                    </div>
                  </div>
                </div>
              )}

              <div className="project_section-col u-column-start-4 u-column-span-9 u-flex-vertical-nowrap u-gap-6">
                <h2 data-split="word" className="project_section-heading u-text-style-h2 u-text-transform-uppercase">
                  {project.sectionHeading2}
                </h2>
                {project.sectionParagraph2 && (
                  <p data-split="line" className="project_section-p u-text-style-main u-text-decoration-justify">
                    {project.sectionParagraph2}
                  </p>
                )}
              </div>

            </div>
          </div>
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        </section>
      )}

      {/* ============================================================
          SECTION 3
      ============================================================ */}
      {project.sectionHeading3 && (
        <section className="project_section-wrap">
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
          <div className="project_section-contain u-container">
            <div className="project_section-layout u-grid-custom u-gap-row-6">

              {project.sectionEyebrow3 && (
                <div className="project_section-col u-column-start-1 u-column-span-3">
                  <div data-stagger="" className="project_section_eyebrow-wrap u-flex-horizontal-nowrap u-gap-2">
                    <EyebrowSvg className="project_section_eyebrow-svg" />
                    <div data-split="word" className="project_section_eyebrow-heading u-text-style-large u-text-transform-uppercase u-weight-bold">
                      {project.sectionEyebrow3}
                    </div>
                  </div>
                </div>
              )}

              <div className="project_section-col u-column-start-4 u-column-span-9 u-flex-vertical-nowrap u-gap-6">
                <h2 data-split="word" className="project_section-heading u-text-style-h2 u-text-transform-uppercase">
                  {project.sectionHeading3}
                </h2>
                {project.sectionParagraph3 && (
                  <p data-split="line" className="project_section-p u-text-style-main u-text-decoration-justify">
                    {project.sectionParagraph3}
                  </p>
                )}
              </div>

            </div>
          </div>
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        </section>
      )}

      {/* ============================================================
          SECTION 4
      ============================================================ */}
      {project.sectionHeading4 && (
        <section className="project_section-wrap">
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
          <div className="project_section-contain u-container">
            <div className="project_section-layout u-grid-custom u-gap-row-6">

              {project.sectionEyebrow4 && (
                <div className="project_section-col u-column-start-1 u-column-span-3">
                  <div data-stagger="" className="project_section_eyebrow-wrap u-flex-horizontal-nowrap u-gap-2">
                    <EyebrowSvg className="project_section_eyebrow-svg" />
                    <div data-split="word" className="project_section_eyebrow-heading u-text-style-large u-text-transform-uppercase u-weight-bold">
                      {project.sectionEyebrow4}
                    </div>
                  </div>
                </div>
              )}

              <div className="project_section-col u-column-start-4 u-column-span-9 u-flex-vertical-nowrap u-gap-6">
                <h2 data-split="word" className="project_section-heading u-text-style-h2 u-text-transform-uppercase">
                  {project.sectionHeading4}
                </h2>
                {project.sectionParagraph4 && (
                  <p data-split="line" className="project_section-p u-text-style-main u-text-decoration-justify">
                    {project.sectionParagraph4}
                  </p>
                )}
              </div>

            </div>
          </div>
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        </section>
      )}

      {/* ============================================================
          GALLERY SECTION
      ============================================================ */}
      <section className="project_content-wrap">
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="project_content-contain u-container u-padding-top-4">
          <div className="project_content-layout u-grid-custom u-gap-row-4">

            {project.galleryImages?.map((image, i) => {
              const src = urlFor(image);
              if (!src) return null;
              const layout = GALLERY_LAYOUTS[i] ?? GALLERY_LAYOUTS[0];
              return (
                <div key={image._key} className={`project_content-col ${layout.col} u-position-relative ${layout.ratio}`}>
                  <Image
                    src={src}
                    fill
                    alt={image.alt ?? project.projectName}
                    className="project_content-img u-cover-absolute"
                  />
                </div>
              );
            })}

          </div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          RELATED PROJECTS SECTION
      ============================================================ */}
      {relatedProjects.length > 0 && (
        <section className="project_related-wrap u-position-relative">
          <style>{`
            .project_related_image-wrap .projects_related-img { transform: scale(1); transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); will-change: transform; }
            .projects_related_image-wrap:hover .projects_related-img { transform: scale(1.05); }
            .projects_related-item { grid-column: span 6; }
            .projects_related_image-wrap { aspect-ratio: 3 / 4; }
            .projects_related-item { transition: opacity 0.3s ease, transform 0.3s ease; }
          `}</style>
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
          <div className="project_related-contain u-container u-margin-top-5">
            <div className="projects_related-list u-grid-custom u-gap-row-6">
              {relatedProjects.map((related) => (
                <div key={related.slug} className="projects_related-item u-position-relative u-flex-vertical-nowrap u-gap-3">
                  <div data-overlay-medium="" data-cursor-marquee-text="View Project" className="projects_related_image-wrap u-position-relative u-overflow-hidden">
                    <TransitionLink href={`/projects/${related.slug}`} className="projects_related-link u-cover-absolute w-inline-block"></TransitionLink>
                    {urlFor(related.featuredImage1) && (
                      <Image
                        src={urlFor(related.featuredImage1)}
                        fill
                        alt={related.featuredImage1?.alt ?? related.projectName}
                        className="projects_related-img u-cover-absolute"
                      />
                    )}
                    <div data-overlay-start="top center" data-overlay="" className="color_reveal-overlay u-cover-absolute u-pointer-off"></div>
                  </div>
                  <div className="projects_related_info-wrap u-flex-horizontal-nowrap u-justify-content-between">
                    <div data-split="word" className="projects_related_info-title u-text-style-large">{related.projectName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        </section>
      )}

    </main>
  );
}
