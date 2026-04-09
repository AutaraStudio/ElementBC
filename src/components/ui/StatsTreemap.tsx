'use client'

import { useRef, useEffect, useCallback } from 'react'
import { gsap, CustomEase } from '@/lib/gsap'
import styles from './StatsTreemap.module.css'

interface StatsTreemapProps {
  stats: Array<{ statValue?: string; statLabel?: string }>
  heading: string
  subheading: string
  theme?: string
}

const HERO_INDEX = 1
const EASE_NAME = 'treemapFill'
const EASE_CURVE = 'M0,0 C0.16,1 0.3,1 1,1'
const DURATION = 0.5

const GRID_ASSIGNMENTS = [
  { col: '1 / 4',   row: '1 / 3' },
  { col: '4 / 8',   row: '1 / 3' },
  { col: '8 / 11',  row: '1 / 3' },
  { col: '11 / 13', row: '1 / 2' },
  { col: '11 / 13', row: '2 / 3' },
  { col: '1 / 4',   row: '3 / 4' },
  { col: '4 / 7',   row: '3 / 4' },
  { col: '7 / 10',  row: '3 / 4' },
  { col: '10 / 13', row: '3 / 4' },
]

function getTileRect(tile: HTMLElement, grid: HTMLElement) {
  const gr = grid.getBoundingClientRect()
  const tr = tile.getBoundingClientRect()
  return {
    x: tr.left - gr.left,
    y: tr.top - gr.top,
    width: tr.width,
    height: tr.height,
  }
}

export default function StatsTreemap({ stats, heading, subheading, theme }: StatsTreemapProps) {
  const gridRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const activeTileRef = useRef<HTMLElement | null>(null)
  const heroTileRef = useRef<HTMLElement | null>(null)
  const easeReady = useRef(false)

  const setActive = useCallback((tile: HTMLElement) => {
    const cls = styles['stats-treemap_tile--active']
    if (activeTileRef.current && activeTileRef.current !== tile) {
      activeTileRef.current.classList.remove(cls)
    }
    tile.classList.add(cls)
    activeTileRef.current = tile
  }, [])

  const animateTo = useCallback((tile: HTMLElement, instant = false) => {
    const grid = gridRef.current
    const fill = fillRef.current
    if (!grid || !fill) return

    if (!easeReady.current) {
      CustomEase.create(EASE_NAME, EASE_CURVE)
      easeReady.current = true
    }

    setActive(tile)
    const rect = getTileRect(tile, grid)

    if (instant) {
      gsap.set(fill, { ...rect, opacity: 1 })
    } else {
      gsap.to(fill, {
        ...rect,
        opacity: 1,
        duration: DURATION,
        ease: EASE_NAME,
        overwrite: true,
      })
    }
  }, [setActive])

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const tiles = Array.from(grid.querySelectorAll<HTMLElement>('[data-index]'))
    const hero = tiles[HERO_INDEX]

    if (hero) {
      heroTileRef.current = hero
      animateTo(hero, true)
    }

    const handlers: Array<[HTMLElement, () => void]> = []
    tiles.forEach((tile) => {
      const handler = () => animateTo(tile)
      tile.addEventListener('mouseenter', handler)
      handlers.push([tile, handler])
    })

    const gridLeave = () => {
      if (heroTileRef.current) animateTo(heroTileRef.current)
    }
    grid.addEventListener('mouseleave', gridLeave)

    return () => {
      handlers.forEach(([t, h]) => t.removeEventListener('mouseenter', h))
      grid.removeEventListener('mouseleave', gridLeave)
    }
  }, [animateTo])

  return (
    <section
      data-theme={theme ?? 'charcoal'}
      className={`${styles['stats-treemap_wrap']} u-position-relative u-theme-${theme ?? 'charcoal'}`}
    >
      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>

      <div className={`${styles['stats-treemap_contain']} u-container`}>

        <div data-stagger="" className={styles['stats-treemap_header']}>
          <h2 data-stagger-item="" className={`${styles['stats-treemap_heading']} u-text-style-h2 u-text-transform-uppercase`}>
            {heading}
          </h2>
          <p data-stagger-item="" className={`${styles['stats-treemap_subheading']} u-text-style-main u-text-decoration-justify-last`}>
            {subheading}
          </p>
        </div>

        <div ref={gridRef} data-stagger="" className={styles['stats-treemap_grid']}>
          <div ref={fillRef} className={styles['stats-treemap_cursor-fill']} style={{ opacity: 0 }} />

          {stats.slice(0, 9).map((stat, i) => (
            <div
              key={i}
              data-stagger-item=""
              data-index={String(i + 1).padStart(2, '0')}
              className={`${styles['stats-treemap_tile']} ${styles[`stats-treemap_tile--${i}`] ?? ''}`}
              style={{
                gridColumn: GRID_ASSIGNMENTS[i]?.col,
                gridRow:    GRID_ASSIGNMENTS[i]?.row,
              }}
            >
              <p className={`${styles['stats-treemap_value']} ${i === 1 ? 'u-text-style-h3' : 'u-text-style-h4'} u-text-transform-uppercase`}>
                {stat.statLabel}
              </p>
              <p className={`${styles['stats-treemap_label']} u-text-style-main`}>
                {stat.statValue}
              </p>
            </div>
          ))}
        </div>

        <ul data-stagger="" className={styles['stats-treemap_mobile-list']} role="list">
          {stats.map((stat, i) => (
            <li key={i} data-stagger-item="" className={styles['stats-treemap_mobile-item']}>
              <p className={`${styles['stats-treemap_mobile-value']} u-text-style-h4 u-text-transform-uppercase`}>
                {stat.statLabel}
              </p>
              <p className={`${styles['stats-treemap_mobile-label']} u-text-style-main`}>
                {stat.statValue}
              </p>
            </li>
          ))}
        </ul>

      </div>

      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
    </section>
  )
}
