interface Partner {
  name: string
  logoUrl: string
  logoSvg: string
}

interface PartnerCarouselProps {
  heading?: string
  partners?: Partner[]
  theme?: string
}

export default function PartnerCarousel({ heading, partners, theme }: PartnerCarouselProps) {
  const hasPartners = partners && partners.length > 0

  return (
      <section data-marquee-duplicate="3" data-marquee="" data-marquee-direction="left" data-marquee-speed="90" data-marquee-scroll-speed="20" data-theme={theme ?? 'buff'} className={`partner_carousel-wrap u-theme-${theme ?? 'buff'}`}>
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

                {hasPartners ? (
                  /* ── Render from Sanity ── */
                  partners.map((partner, i) => (
                    <div key={i} data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                      <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                        <div
                          className="partner_carousel-logo"
                          style={{ width: '100%' }}
                          dangerouslySetInnerHTML={{ __html: partner.logoSvg }}
                        />
                      </div>
                      <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">{partner.name}</div>
                    </div>
                  ))
                ) : (
                  /* ── Fallback: hardcoded inline SVGs ── */
                  <>
                    {/* Hart Dixon */}
                    <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                      <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 249 44.459" fill="none" className="partner_carousel-logo">
                          <defs><clipPath id="clip-path"><rect width="249" height="44.459" fill="currentColor" /></clipPath></defs>
                          <g transform="translate(0 0)" clipPath="url(#clip-path)">
                            <path d="M0,39.91V.376H3.92A4.274,4.274,0,0,1,8.194,4.65V15.567A12.759,12.759,0,0,1,18,11.423q11.532,0,11.533,12V44.184h-3.92a4.274,4.274,0,0,1-4.274-4.274V23.421q0-5.38-5.349-5.38a12.075,12.075,0,0,0-7.792,3.185V44.184H4.274A4.274,4.274,0,0,1,0,39.91" transform="translate(0 -0.081)" fill="currentColor" />
                            <path d="M40.954,37.113c0-6.452,4.7-9.973,14.1-9.973a35.992,35.992,0,0,1,6.617.618V25.316q0-4.361-6.277-4.36a44.916,44.916,0,0,0-6.874.567,4.274,4.274,0,0,1-4.938-4.217v-1.3a51.415,51.415,0,0,1,11.812-1.546q14.471,0,14.47,10.7V47.224H66.873a4.274,4.274,0,0,1-3.022-1.252L62.2,44.317a16.455,16.455,0,0,1-9.337,3.2c-7.936,0-11.9-3.665-11.9-10.4m14.1-4.407c-3.937,0-5.906,1.634-5.906,4.314,0,2.886,1.649,4.624,4.948,4.624a12.641,12.641,0,0,0,7.575-2.535V33.325a33.7,33.7,0,0,0-6.617-.619" transform="translate(-8.838 -3.121)" fill="currentColor" />
                            <path d="M90.187,18.861,90,18.09a4.275,4.275,0,0,0-4.15-3.252H82.858V47.3h7.185V32.165c.076-6.4,5.073-10.835,11.5-10.835V14.837a17.979,17.979,0,0,0-11.36,4.024" transform="translate(-17.881 -3.202)" fill="currentColor" />
                            <path d="M125.3,39.365q-3.927,0-3.927-4.545V19.886h1.692a4.274,4.274,0,0,0,4.274-4.274V13.393h-5.918l-.039-5.257H116.2a2.061,2.061,0,0,0-2.061,2.062v3.195H110.07l-.047,6.493h4.112V37.108c0,5.834,2.721,9.045,8.163,9.045h1.557a6.751,6.751,0,0,0,6.493-6.788Z" transform="translate(-23.743 -1.756)" fill="currentColor" />
                            <path d="M169.14,42.53a57.461,57.461,0,0,1-14.563,1.948c-10.493,0-15.739-5.922-15.739-17.177,0-10.389,5.133-15.878,15.4-15.878a16.274,16.274,0,0,1,6.71,1.546V.375h3.92a4.274,4.274,0,0,1,4.274,4.274Zm-8.194-22.635a11.352,11.352,0,0,0-6.369-1.67c-5.092,0-7.637,3.149-7.637,8.859,0,6.782,2.648,10.468,7.946,10.468a20.026,20.026,0,0,0,6.06-.9Z" transform="translate(-29.961 -0.081)" fill="currentColor" />
                            <path d="M190.689,14.832V47.3h-8.194V23.026A8.194,8.194,0,0,1,190.689,14.832Z" transform="translate(-39.382 -3.201)" fill="currentColor" />
                            <path d="M190.69,4.1a4.1,4.1,0,1,1-4.1-4.1,4.1,4.1,0,0,1,4.1,4.1" transform="translate(-39.382 0)" fill="currentColor" />
                            <path d="M208.414,31.071,196.262,14.838H201.1a8.546,8.546,0,0,1,6.848,3.432l5.012,6.71,7.575-10.142h9.122L217.535,31.071,229.656,47.3h-4.838a8.546,8.546,0,0,1-6.848-3.432l-5.012-6.71L205.384,47.3h-9.122Z" transform="translate(-42.353 -3.202)" fill="currentColor" />
                            <path d="M235.525,30.99c0-10.884,5.359-16.528,16.079-16.528s16.078,5.644,16.078,16.528c0,10.864-5.359,16.59-16.078,16.59-10.678,0-16.037-5.726-16.079-16.59M251.6,41.334c5.256,0,7.884-3.686,7.884-10.468,0-6.616-2.628-10.22-7.884-10.22s-7.884,3.6-7.884,10.22c0,6.782,2.628,10.468,7.884,10.468" transform="translate(-50.826 -3.121)" fill="currentColor" />
                            <path d="M279.866,42.95V14.758h2.883a4.273,4.273,0,0,1,4.179,3.378l.3,1.088a14.52,14.52,0,0,1,10.637-4.762q11.533,0,11.533,12V47.224h-3.92A4.274,4.274,0,0,1,301.2,42.95V26.461q0-5.38-5.349-5.38a12.075,12.075,0,0,0-7.792,3.185V47.224h-3.92a4.274,4.274,0,0,1-4.274-4.274" transform="translate(-60.394 -3.121)" fill="currentColor" />
                          </g>
                        </svg>
                      </div>
                      <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Hart Dixon</div>
                    </div>

                    {/* Homie — placeholder */}
                    <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                      <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                        <span className="partner_carousel-logo" style={{ fontSize: '1.5rem', fontWeight: 600 }}>HOMIE</span>
                      </div>
                      <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Homie</div>
                    </div>

                    {/* Piercy & Company — placeholder */}
                    <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                      <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                        <span className="partner_carousel-logo" style={{ fontSize: '1.5rem', fontWeight: 600 }}>PIERCY &amp; CO</span>
                      </div>
                      <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Piercy &amp; Company</div>
                    </div>

                    {/* Partners Capital — placeholder */}
                    <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                      <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                        <span className="partner_carousel-logo" style={{ fontSize: '1.5rem', fontWeight: 600 }}>PARTNERS CAPITAL</span>
                      </div>
                      <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Partners Capital</div>
                    </div>

                    {/* Layer PM — placeholder */}
                    <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                      <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                        <span className="partner_carousel-logo" style={{ fontSize: '1.5rem', fontWeight: 600 }}>LAYER PM</span>
                      </div>
                      <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Layer PM</div>
                    </div>

                    {/* Element BC — placeholder */}
                    <div data-marquee-item="" className="partner_carousel-item u-flex-vertical-nowrap u-gap-4 u-alignment-center">
                      <div className="partner_carousel-card u-ratio-1-1 u-flex-vertical-wrap u-alignment-center">
                        <span className="partner_carousel-logo" style={{ fontSize: '1.5rem', fontWeight: 600 }}>ELEMENT BC</span>
                      </div>
                      <div className="partner_carousel-name u-text-style-small u-text-transform-uppercase">Element BC</div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
        <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
      </section>
  );
}
