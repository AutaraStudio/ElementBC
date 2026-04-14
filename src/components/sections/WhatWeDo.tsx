'use client'

import { useEffect, useRef } from 'react'
import gsap from '@/lib/gsap'

interface WhatWeDoProps {
  heading: string
  tagline: string
  serviceGroups: Array<{ _key: string; groupTitle?: string; items?: string[] }>
  theme?: string
}

export default function WhatWeDo({ heading, tagline, serviceGroups, theme = 'buff' }: WhatWeDoProps) {
  const leftGroup = serviceGroups[0]
  const rightGroup = serviceGroups[1]
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const t = window.animUtils?.ANIM
    const dur = t?.duration?.md ?? 0.5
    const ease = t?.ease?.out ?? 'power3.out'
    const staggerEach = t?.stagger?.item ?? 0.08

    const headers = wrap.querySelectorAll('.services_column-header')
    const items = wrap.querySelectorAll('.services_column-item')
    const lines = wrap.querySelectorAll('.services_line')

    gsap.set(headers, { opacity: 0, y: 10 })
    gsap.set(items, { opacity: 0, y: 8 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: 'top 80%',
        once: true,
      },
    })

    // 1. Headers fade in together
    tl.to(headers, { opacity: 1, y: 0, duration: dur, ease, stagger: 0.1 }, 0)

    // 2. Header underlines draw in
    const headerLines = wrap.querySelectorAll('.services_line-header')
    tl.to(headerLines, { scaleX: 1, duration: dur, ease, stagger: 0.1 }, 0.15)

    // 3. Left column items stagger in with their lines
    const leftItems = wrap.querySelectorAll('.services_column:first-child .services_column-item')
    const leftLines = wrap.querySelectorAll('.services_column:first-child .services_line-item')

    leftItems.forEach((item, i) => {
      const offset = 0.3 + i * staggerEach
      tl.to(item, { opacity: 1, y: 0, duration: dur, ease }, offset)
      if (leftLines[i]) tl.to(leftLines[i], { scaleX: 1, duration: dur * 0.7, ease }, offset + 0.08)
    })

    // 4. Right column items stagger in slightly delayed
    const rightItems = wrap.querySelectorAll('.services_column:last-child .services_column-item')
    const rightLines = wrap.querySelectorAll('.services_column:last-child .services_line-item')

    rightItems.forEach((item, i) => {
      const offset = 0.4 + i * staggerEach
      tl.to(item, { opacity: 1, y: 0, duration: dur, ease }, offset)
      if (rightLines[i]) tl.to(rightLines[i], { scaleX: 1, duration: dur * 0.7, ease }, offset + 0.08)
    })

    return () => { tl.kill() }
  }, [])

  return (
    <section
      data-theme={theme}
      className={`u-position-relative u-theme-${theme}`}
      style={{ position: 'relative', zIndex: 3, backgroundColor: 'var(--_theme---background)', color: 'var(--_theme---text)' }}
    >
      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>

      <div className="u-container">
        {/* Header — heading left, tagline bottom-right */}
        <div className="u-grid-custom u-gap-row-6">
          <div className="u-column-start-1 u-column-span-7">
            <div data-split-wrapper="">
              <h2 data-split="word" className="u-text-style-h1 u-text-transform-uppercase u-text-decoration-justify-last u-max-width-14ch">
                {heading}
              </h2>
            </div>
          </div>
          <div className="u-column-start-8 u-column-span-5 u-flex-vertical-nowrap u-justify-content-end">
            <p data-split="line" className="u-text-style-main u-text-decoration-justify-last u-max-width-40ch">
              {tagline}
            </p>
          </div>
        </div>

        {/* Services — two clean columns, whitespace-structured */}
        <div ref={wrapRef} className="services_columns" style={{ paddingTop: 'var(--_spacing---space--8-64px)' }}>
          {/* Left column */}
          {leftGroup && (
            <div className="services_column">
              <div className="services_column-header u-text-style-small u-text-transform-uppercase">
                {leftGroup.groupTitle}
              </div>
              <div className="services_line services_line-header" />
              {leftGroup.items?.map((item, i) => (
                <div key={i}>
                  <div className="services_column-item u-text-style-small">{item}</div>
                  <div className="services_line services_line-item" />
                </div>
              ))}
            </div>
          )}
          {/* Right column */}
          {rightGroup && (
            <div className="services_column">
              <div className="services_column-header u-text-style-small u-text-transform-uppercase">
                {rightGroup.groupTitle}
              </div>
              <div className="services_line services_line-header" />
              {rightGroup.items?.map((item, i) => (
                <div key={i}>
                  <div className="services_column-item u-text-style-small">{item}</div>
                  <div className="services_line services_line-item" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
    </section>
  )
}
