import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllProjects, getProjectBySlug, getPartnerCarousel } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/imageUrl';
import TransitionLink from '@/components/ui/TransitionLink';
import PartnerCarousel from '@/components/sections/PartnerCarousel';
import EyebrowSvg from '@/components/ui/svgs/EyebrowSvg';
import SectionDivider from '@/components/ui/SectionDivider';
import ProjectGallerySlider from '@/components/sections/ProjectGallerySlider';

export const revalidate = 3600;

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
    title: { absolute: project?.seoTitle ?? `${project?.projectName ?? 'Project'} | Element BC` },
    description: project?.seoDescription,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, allProjects, partnerCarousel] = await Promise.all([
    getProjectBySlug(slug),
    getAllProjects(),
    getPartnerCarousel(),
  ]);

  if (!project) notFound();

  // Related projects — same category first, then others, exclude current
  const related = [
    ...allProjects.filter((p) => p.slug !== slug && p.category?.slug === project.category?.slug),
    ...allProjects.filter((p) => p.slug !== slug && p.category?.slug !== project.category?.slug),
  ].slice(0, 4);

  const stats = project.projectStats ?? [];

  return (
    <main>

      {/* ============================================================
          HERO + PROJECT INFO
      ============================================================ */}
      <section data-hero-wrap="" data-theme="buff" className="project_hero-wrap u-theme-buff">
        <div data-wf--spacer--variant="page-top" className="u-section-spacer is-page-top u-ignore-trim"></div>
        <div className="project_hero-contain u-container">
          {/* ── Hero header — heading left, description right ── */}
          <div className="project_hero-header">
            <div className="project_hero-header-left">
              <div data-stagger="" className="project_hero-eyebrow u-flex-horizontal-nowrap u-gap-2">
                <EyebrowSvg className="global_eyebrow-svg" />
                <h1 data-anim-hero="" data-split="word" className="project_hero_eyebrow-heading u-text-style-large u-text-transform-uppercase u-weight-bold">
                  {project.projectName}
                </h1>
              </div>
              <div className="project_hero_heading-wrap">
                <div data-split="word" data-anim-hero="" className="project_hero-heading u-max-width-20ch u-text-style-h2 u-text-transform-uppercase">
                  {[project.category?.name, stats.find(s => s.label === 'Location')?.value].filter(Boolean).join(' / ')}
                </div>
              </div>
            </div>
            {project.ourRole && (
              <div className="project_hero-header-right">
                <p data-split="line" className="u-text-style-main u-text-decoration-justify-last">{project.ourRole}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Project stats — full width ── */}
        <div className="project_stats-contain u-container">
          {stats.length > 0 && (
            <div data-stagger="" className="project_stats-row">
              {stats.map((row) => (
                <div key={row.label} data-stagger-item="" className="project_stats-item">
                  <div className="project_stats-label u-text-style-small u-text-transform-uppercase">{row.label}</div>
                  <div className="project_stats-value u-text-style-small">{row.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Gallery slider — full-bleed (replaces the directional marquee) ── */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <ProjectGallerySlider images={project.galleryImages} alt={project.projectName} />
        )}

      </section>

      <SectionDivider theme="buff" />

      {/* ============================================================
          RELATED CASE STUDIES
      ============================================================ */}
      {related.length > 0 && (
        <section data-theme="buff" className="project_details-wrap u-theme-buff">
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
          <div className="u-container">

            <div data-split-wrapper="">
              <h2 data-split="word" className="u-text-style-h2 u-text-transform-uppercase u-text-decoration-justify-last">Related Case Studies</h2>
            </div>

            <div data-stagger="" className="u-grid-custom u-gap-row-6">
              {related.map((p) => (
                <div key={p.slug} data-stagger-item="" className="u-column-span-3 u-position-relative u-flex-vertical-nowrap u-gap-3">
                  <div data-cursor-marquee-text="View Case Study" className="project_related-image u-position-relative u-overflow-hidden u-ratio-4-5">
                    <TransitionLink href={`/case-studies/${p.slug}`} className="u-cover-absolute u-zindex-3"></TransitionLink>
                    {urlFor(p.featuredImage1) && (
                      <Image
                        src={urlFor(p.featuredImage1)!}
                        fill
                        alt={p.featuredImage1?.alt ?? p.projectName}
                        className="u-cover-absolute"
                      />
                    )}
                    <div data-overlay-start="top center" data-overlay="" className="color_reveal-overlay u-cover-absolute u-pointer-off"></div>
                    <div className="project_image-marquee-overlay u-cover-absolute u-pointer-off"></div>
                  </div>
                  <div className="u-flex-vertical-nowrap u-gap-1">
                    <div className="u-text-style-main u-weight-bold u-text-transform-uppercase">{p.projectName}</div>
                    <div className="u-text-style-small u-color-faded u-text-transform-uppercase">{p.category?.name}</div>
                  </div>
                </div>
              ))}
            </div>

          </div>
          <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        </section>
      )}

      {/* ============================================================
          PARTNER CAROUSEL
      ============================================================ */}
      <div data-theme="charcoal" className="u-theme-charcoal">
        <PartnerCarousel heading={partnerCarousel?.heading} partners={partnerCarousel?.partners} />
      </div>

    </main>
  );
}
