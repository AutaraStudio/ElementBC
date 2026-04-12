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

// Hardcoded short descriptions + bar widths for client review
const BAR_OVERRIDES: Record<string, { label: string; width: number }> = {
  '200+':       { label: 'Years Advising Blue Chip Clients',   width: 85 },
  '£350M':      { label: 'Projects Delivered',                 width: 95 },
  '50+':        { label: 'Acquisitions Advised',               width: 55 },
  '1M SQFT':    { label: 'Surveyed Pre-Acquisition',           width: 70 },
  '6M SQFT':    { label: 'Property Worked On',                 width: 80 },
  '<1%':        { label: 'Project Overspend',                  width: 35 },
  '50,000 FT²': { label: 'Dilapidations Settled',              width: 60 },
  '£40M':       { label: 'Cost Assessments',                   width: 50 },
  '665+':       { label: 'Residential Units Advised',           width: 65 },
}

// Fallback widths when no override matches
const DEFAULT_WIDTHS = [55, 95, 45, 70, 85, 35, 60, 50, 40]

export default function StatsBarGraph({ stats, heading, subheading, theme }: StatsBarGraphProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const easeReady = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    const list = listRef.current
    if (!section || !list) return

    let tl: gsap.core.Timeline | null = null

    function init() {
      if (!easeReady.current) {
        CustomEase.create(EASE_NAME, EASE_CURVE)
        easeReady.current = true
      }

      const rows = list!.querySelectorAll<HTMLElement>('[data-bar-row]')
      if (!rows.length) return

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

      gsap.set(fills, { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(values, { opacity: 0, y: 8 })
      gsap.set(labels, { opacity: 0, y: 6 })

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          once: true,
        },
      })

      tl.to(fills, {
        scaleX: 1,
        duration: 0.8,
        ease: EASE_NAME,
        stagger: 0.07,
      })

      tl.to(values, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.05,
      }, '-=0.5')

      tl.to(labels, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out',
        stagger: 0.04,
      }, '-=0.4')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const preloaderDone = !!(window as any)._preloaderComplete

    if (preloaderDone) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh()
        init()
      }, 350)
      return () => { clearTimeout(timer); if (tl) tl.kill() }
    } else {
      const handler = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any)._preloaderComplete = true
        init()
      }
      window.addEventListener('preloader:complete', handler, { once: true })
    }

    return () => {
      window.removeEventListener('preloader:complete', init)
      if (tl) tl.kill()
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
            const key = stat.statLabel?.trim() ?? ''
            const override = BAR_OVERRIDES[key]
            const width = override?.width ?? stat.barWidth ?? DEFAULT_WIDTHS[i % DEFAULT_WIDTHS.length]
            const label = override?.label ?? stat.statValue ?? ''
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
                      {label}
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
