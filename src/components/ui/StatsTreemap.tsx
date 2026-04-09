'use client'

import styles from './StatsTreemap.module.css'

interface StatsTreemapProps {
  stats: Array<{ statValue?: string; statLabel?: string }>
  heading: string
  subheading: string
  theme?: string
}

const GRID_ASSIGNMENTS = [
  { col: '1 / 4',   row: '1 / 3' },   // index 0 — tall, 3 cols, 2 rows
  { col: '4 / 8',   row: '1 / 3' },   // index 1 — hero, 4 cols, 2 rows
  { col: '8 / 11',  row: '1 / 3' },   // index 2 — tall, 3 cols, 2 rows
  { col: '11 / 13', row: '1 / 2' },   // index 3 — small, 2 cols, 1 row
  { col: '11 / 13', row: '2 / 3' },   // index 4 — small, 2 cols, 1 row
  { col: '1 / 4',   row: '3 / 4' },   // index 5 — bottom, 3 cols
  { col: '4 / 7',   row: '3 / 4' },   // index 6 — bottom, 3 cols
  { col: '7 / 10',  row: '3 / 4' },   // index 7 — bottom, 3 cols
  { col: '10 / 13', row: '3 / 4' },   // index 8 — bottom, 3 cols
]

export default function StatsTreemap({ stats, heading, subheading, theme }: StatsTreemapProps) {
  return (
    <section
      data-theme={theme ?? 'charcoal'}
      className={`${styles['stats-treemap_wrap']} u-position-relative u-theme-${theme ?? 'charcoal'}`}
    >
      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>

      <div className={`${styles['stats-treemap_contain']} u-container`}>

        {/* Heading row */}
        <div className={styles['stats-treemap_header']}>
          <h2 className={`${styles['stats-treemap_heading']} u-text-style-h2 u-text-transform-uppercase`}>
            {heading}
          </h2>
          <p className={`${styles['stats-treemap_subheading']} u-text-style-large`}>
            {subheading}
          </p>
        </div>

        {/* Desktop treemap grid — hidden on mobile via CSS */}
        <div className={styles['stats-treemap_grid']}>
          {stats.slice(0, 9).map((stat, i) => (
            <div
              key={i}
              className={`${styles['stats-treemap_tile']} ${styles[`stats-treemap_tile--${i}`]}`}
              style={{
                gridColumn: GRID_ASSIGNMENTS[i]?.col,
                gridRow:    GRID_ASSIGNMENTS[i]?.row,
              }}
            >
              <p className={`${styles['stats-treemap_value']} ${i === 1 ? 'u-text-style-h3' : 'u-text-style-h4'} u-text-transform-uppercase`}>
                {stat.statLabel}
              </p>
              <p className={`${styles['stats-treemap_label']} u-text-style-large`}>
                {stat.statValue}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile list — hidden on desktop via CSS */}
        <ul className={styles['stats-treemap_mobile-list']} role="list">
          {stats.map((stat, i) => (
            <li key={i} className={styles['stats-treemap_mobile-item']}>
              <p className={`${styles['stats-treemap_mobile-value']} u-text-style-h4 u-text-transform-uppercase`}>
                {stat.statLabel}
              </p>
              <p className={`${styles['stats-treemap_mobile-label']} u-text-style-large`}>
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
