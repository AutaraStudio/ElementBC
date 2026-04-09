'use client'

import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger, CustomEase } from '@/lib/gsap'
import styles from './StatsBarGraph.module.css'

interface StatsBarGraphProps {
  stats: Array<{ statValue?: string; statLabel?: string; barWidth?: number }>
  heading: string
  subheading: string
  theme?: string
}

const EASE_NAME = 'barGrow'
const EASE_CURVE = 'M0,0 C0.16,1 0.3,1 1,1'

// Default widths when barWidth isn't set in Sanity — gives visual variety
const DEFAULT_WIDTHS = [55, 95, 45, 70, 85, 35, 60, 50, 40]

export default function StatsBarGraph({ stats, heading, subheading, theme }: StatsBarGraphProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const easeReady = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    const list = listRef.current
    if (!section || !list) return

    if (!easeReady.current) {
      CustomEase.create(EASE_NAME, EASE_CURVE)
      easeReady.current = true
    }

    const rows = list.querySelectorAll<HTMLElement>('[data-bar-row]')
    if (!rows.length) return

    // Gather elements per row
    const fills: HTMLElement[] = []
    const values: HTMLElement[] = []
    const labels: HTMLElement[] = []

    rows.forEach((row) => {
      const fill = row.querySelector<HTMLElement>('[data-bar-fill]')
      const value = row.querySelector<HTMLElement>('[data-bar-value]')
      const label = row.querySelector<HTMLElement>('[data-bar-label]')
      if (fill) fills.push(fill)
      if (value) values.push(value)
      if (label) labels.push(label)
    })

    // Set initial states
    gsap.set(fills, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(values, { opacity: 0, y: 8 })
    gsap.set(labels, { opacity: 0, y: 6 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        once: true,
      },
    })

    // 1. Bars grow left → right, staggered
    tl.to(fills, {
      scaleX: 1,
      duration: 0.8,
      ease: EASE_NAME,
      stagger: 0.07,
    })

    // 2. Values fade in + slide up, overlapping with bar growth
    tl.to(values, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
      stagger: 0.05,
    }, '-=0.5')

    // 3. Labels follow
    tl.to(labels, {
      opacity: 1,
      y: 0,
      duration: 0.35,
      ease: 'power2.out',
      stagger: 0.04,
    }, '-=0.4')

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      data-theme={theme ?? 'buff'}
      className={`${styles['stats-bar_wrap']} u-position-relative u-theme-${theme ?? 'buff'}`}
    >
      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>

      <div className={`${styles['stats-bar_contain']} u-container`}>

        <div data-stagger="" className={styles['stats-bar_header']}>
          <h2 data-stagger-item="" data-split="word" className={`${styles['stats-bar_heading']} u-text-style-h2 u-text-transform-uppercase`}>
            {heading}
          </h2>
          <p data-stagger-item="" data-split="line" className={`${styles['stats-bar_subheading']} u-text-style-main u-text-decoration-justify-last`}>
            {subheading}
          </p>
        </div>

        <div ref={listRef} className={styles['stats-bar_list']}>
          {stats.map((stat, i) => {
            const width = stat.barWidth ?? DEFAULT_WIDTHS[i % DEFAULT_WIDTHS.length]
            return (
              <div key={i} data-bar-row="" className={styles['stats-bar_row']}>
                <div
                  data-bar-fill=""
                  className={styles['stats-bar_fill']}
                  style={{ width: `${width}%` }}
                >
                  <div className={styles['stats-bar_content']}>
                    <p data-bar-value="" className={`${styles['stats-bar_value']} u-text-style-h4 u-text-transform-uppercase`}>
                      {stat.statLabel}
                    </p>
                    <p data-bar-label="" className={`${styles['stats-bar_label']} u-text-style-main`}>
                      {stat.statValue}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>

      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
    </section>
  )
}
