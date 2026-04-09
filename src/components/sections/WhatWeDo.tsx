import HomeAboutWaveSvg from '@/components/ui/svgs/HomeAboutWaveSvg'

interface WhatWeDoProps {
  heading: string
  subtitle: string
  tagline: string
  serviceGroups: Array<{ _key: string; groupTitle?: string; items?: string[] }>
  theme?: string
}

export default function WhatWeDo({ heading, subtitle, tagline, serviceGroups, theme = 'buff' }: WhatWeDoProps) {
  return (
    <section
      data-theme={theme}
      className={`u-position-relative u-theme-${theme}`}
      style={{ position: 'relative', zIndex: 2, backgroundColor: 'var(--_theme---background)', color: 'var(--_theme---text)' }}
    >
      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>

      <div className="u-container">
        <div className="u-grid-custom u-gap-row-6">

          {/* Left column — heading + service lists */}
          <div className="u-column-start-1 u-column-span-6 u-flex-vertical-nowrap u-gap-7">

            {/* Heading + subtitle */}
            <div className="u-flex-vertical-nowrap u-gap-2">
              <h2 data-split="word" className="u-text-style-h1 u-text-transform-uppercase">
                {heading}
              </h2>
              <p data-split="word" className="u-text-style-h4">
                {subtitle}
              </p>
            </div>

            {/* Service groups */}
            {serviceGroups.map((group) => (
              <div key={group._key} className="u-flex-vertical-nowrap u-gap-3">
                <h3 className="u-text-style-h5 u-text-transform-uppercase">
                  {group.groupTitle}
                </h3>
                <ul data-stagger="" role="list" className="u-flex-vertical-nowrap u-gap-1" style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
                  {group.items?.map((item, i) => (
                    <li key={i} data-stagger-item="" className="u-text-style-main">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Right column — SVG + tagline */}
          <div className="u-column-start-8 u-column-span-5 u-flex-vertical-nowrap u-justify-content-between">

            {/* Wave SVG */}
            <div className="breathing-bars_wrap">
              <HomeAboutWaveSvg className="home_about_wave-svg" />
            </div>

            {/* Tagline */}
            <p data-split="line" className="u-text-style-h3">
              {tagline}
            </p>
          </div>

        </div>
      </div>

      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
    </section>
  )
}
