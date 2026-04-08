import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllProjects, getProjectBySlug } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/imageUrl';
import PartnerCarousel from '@/components/sections/PartnerCarousel';
import EyebrowSvg from '@/components/ui/svgs/EyebrowSvg';

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
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <main>

      {/* ============================================================
          HERO SECTION
      ============================================================ */}
      <section data-hero-wrap="" data-theme="buff" className="project_hero-wrap u-min-height-screen">
        <div data-wf--spacer--variant="page-top" className="u-section-spacer is-page-top u-ignore-trim"></div>
        <div className="project_hero-contain u-container">
          <div className="project_hero-layout u-flex-vertical-nowrap u-alignment-center u-gap-7">

            <div data-stagger="" className="project_hero-eyebrow u-flex-horizontal-nowrap u-gap-2">
              <EyebrowSvg className="global_eyebrow-svg" />
              <h1 data-anim-hero="" data-split="word" className="project_hero_eyebrow-heading u-text-style-large u-text-transform-uppercase u-weight-bold">
                {project.projectName}
              </h1>
            </div>

            <div className="project_hero_heading-wrap">
              <div data-split="word" data-anim-hero="" className="project_hero-heading u-max-width-20ch u-text-style-h2 u-text-transform-uppercase">
                {[project.category?.name, project.location].filter(Boolean).join(' / ')}
              </div>
            </div>

          </div>
        </div>

        {/* Image marquee */}
        {project.galleryImages && project.galleryImages.length > 0 && (
          <div data-marquee-duplicate="2" data-marquee="" data-marquee-direction="left" data-marquee-speed="60" data-marquee-scroll-speed="15" className="project_image-marquee">
            <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
            <div data-marquee-mask="" className="project_image-marquee-mask u-width-full u-overflow-hidden">
              <div data-marquee-track="" className="project_image-marquee-track">
                <div data-marquee-collection="" className="project_image-marquee-collection">
                  {project.galleryImages.map((image) => {
                    const src = urlFor(image);
                    if (!src) return null;
                    const w = image.asset?.metadata?.dimensions?.width ?? 4;
                    const h = image.asset?.metadata?.dimensions?.height ?? 3;
                    const aspectRatio = w / h;
                    return (
                      <div key={image._key} data-marquee-item="" className="project_image-marquee-item u-position-relative u-overflow-hidden">
                        <Image
                          src={src}
                          width={Math.round(320 * aspectRatio)}
                          height={320}
                          alt={image.alt ?? project.projectName}
                          className="project_image-marquee-img"
                          style={{ aspectRatio: `${w} / ${h}` }}
                        />
                        <div data-overlay-start="top center" data-overlay="" className="color_reveal-overlay u-cover-absolute u-pointer-off"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          DETAILS SECTION
      ============================================================ */}
      <section data-theme="buff" className="project_details-wrap">
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="project_details-contain u-container">

          {/* Eyebrow + Our Role heading */}
          <div className="project_details-header u-grid-custom u-gap-row-6 u-margin-bottom-8">
            <div className="project_details-col u-column-start-1 u-column-span-3">
              <div data-stagger="" className="u-flex-horizontal-nowrap u-gap-2">
                <EyebrowSvg className="global_eyebrow-svg" />
                <div data-stagger-item="" className="u-text-style-main u-text-transform-uppercase u-weight-bold">Details</div>
              </div>
            </div>
            {project.ourRole && (
              <div className="project_details-col u-column-start-5 u-column-span-8">
                <h2 data-split="word" className="u-text-style-h3">{project.ourRole}</h2>
              </div>
            )}
          </div>

          {/* Stats table with hover tiles */}
          <div data-hover-axis="y" data-hover="" className="u-position-relative">

            {/* Column headers */}
            <div className="project_details-row u-grid-custom u-padding-bottom-3">
              <div className="u-column-start-5 u-column-span-4">
                <div className="u-text-style-small u-text-transform-uppercase u-color-faded">Detail</div>
              </div>
              <div className="u-column-start-9 u-column-span-4">
                <div className="u-text-style-small u-text-transform-uppercase u-color-faded">Value</div>
              </div>
            </div>

            {/* Data rows */}
            <div data-stagger="" className="project_details-list">
              {([
                { label: 'Client', value: project.client },
                { label: 'Type', value: project.category?.name },
                { label: 'Location', value: project.location },
                { label: 'Size', value: project.size },
                { label: 'Duration', value: project.duration },
                { label: 'Completed', value: project.completedDate },
                { label: 'Contractor', value: project.contractor },
                { label: 'MEP', value: project.mep },
              ] as const).filter(row => row.value).map((row) => (
                <div key={row.label} data-stagger-item="" data-hover-item="" className="contact_info-item u-grid-custom u-align-items-center u-overflow-hidden u-position-relative">
                  <div data-hover-tile="" className="contact_info-tile u-cover-absolute"></div>
                  <div className="contact_info-border u-position-absolute u-width-full"></div>

                  <div className="u-column-start-5 u-column-span-4 u-position-relative">
                    <div className="u-text-style-main u-weight-bold u-text-transform-uppercase">{row.label}</div>
                  </div>
                  <div className="u-column-start-9 u-column-span-4 u-position-relative">
                    <div className="u-text-style-main">{row.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact_info-border is-bottom u-position-absolute u-width-full"></div>
          </div>

        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>

      {/* ============================================================
          PARTNER CAROUSEL
      ============================================================ */}
      <div data-theme="charcoal">
        <PartnerCarousel />
      </div>

    </main>
  );
}
