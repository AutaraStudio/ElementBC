interface Partner {
  name: string
  logoUrl: string
  logoSvg: string
}

interface PartnerCarouselProps {
  heading?: string
  partners?: Partner[]
  theme?: string
  /** Optional anchor id (e.g. "bottom") — also registers as a progress-nav anchor. */
  id?: string
}

export default function PartnerCarousel({ heading, partners, theme, id }: PartnerCarouselProps) {
  const hasPartners = partners && partners.length > 0

  return (
      <section id={id} data-progress-nav-anchor={id ? '' : undefined} data-marquee-duplicate="3" data-marquee="" data-marquee-direction="left" data-marquee-speed="90" data-marquee-scroll-speed="20" data-theme={theme ?? 'buff'} className={`partner_carousel-wrap u-position-relative u-theme-${theme ?? 'buff'}`}>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
        <div className="partner_carousel-contain">
          <div className="partner_carousel_heading-contain u-container u-margin-bottom-6">
            <div data-split-wrapper="" className="partner_carousel_heading-wrap u-flex-horizontal-nowrap u-justify-content-between u-align-items-end">
              <div className="partner_carousel_heading-inner">
                <h2 data-split-text="word" className="partner_carousel-heading u-max-width-17ch u-text-style-h2 u-text-transform-uppercase u-text-decoration-justify-last">{heading ?? 'Trusted by those who rely on detail & value clarity.'}</h2>
              </div>
            </div>
          </div>
          <div data-marquee-mask="" className="partner_carousel-track-mask u-width-full u-overflow-hidden">
            <div data-marquee-track="" className="partner_carousel-track">
              <div data-marquee-collection="" className="partner_carousel-collection">

                {/* ── Render from Sanity (single source of truth) ── */}
                {hasPartners &&
                  partners.map((partner, i) => (
                    <div key={i} data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                      <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                        <div
                          className="partner_carousel-logo"
                          dangerouslySetInnerHTML={{ __html: partner.logoSvg }}
                        />
                      </div>
                      <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">{partner.name}</div>
                    </div>
                  ))}

              </div>
            </div>
          </div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>
  );
}
