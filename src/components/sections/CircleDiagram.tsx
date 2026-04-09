'use client'

import { useEffect, useRef } from 'react'
import styles from './CircleDiagram.module.css'

interface CircleDiagramProps {
  heading: string
  description: string
  items: Array<{ _key: string; title?: string; description?: string }>
  theme?: string
}

/* 8 items × 45° each = 360° — angle ranges for each service */
const ANGLE_RANGES = [
  [217, 262],
  [262, 307],
  [307, 352],
  [352, 37],
  [37, 82],
  [82, 127],
  [127, 172],
  [172, 217],
]

export default function CircleDiagram({ heading, description, items, theme = 'buff' }: CircleDiagramProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const diagram = diagramRef.current
    if (!section || !diagram) return
    if (typeof window === 'undefined') return

    /* Only run diagram on desktop */
    const mql = window.matchMedia('(min-width: 992px)')
    if (!mql.matches) return

    const rotatingLine = diagram.querySelector<HTMLElement>(`.${styles['diagram_rotating-line']}`)
    const circle = diagram.querySelector<HTMLElement>(`.${styles['diagram_circle']}`)
    const services = diagram.querySelectorAll<HTMLElement>(`.${styles['diagram_service']}`)
    const centralDot = diagram.querySelector<HTMLElement>(`.${styles['diagram_central-dot']}`)

    if (!rotatingLine || !circle || !services.length) return

    function getCenter() {
      const r = diagram!.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    }

    function updateContent(angle: number) {
      let activeIndex = -1

      services.forEach((s, i) => {
        const rangeStr = s.dataset.angles
        if (!rangeStr) return
        const [start, end] = rangeStr.split(',').map(Number)
        const inRange = start > end
          ? angle >= start || angle <= end
          : angle >= start && angle <= end

        s.classList.toggle(styles['diagram_service--active'], inRange)
        if (inRange) activeIndex = i
      })

      services.forEach((s, i) => {
        s.classList.remove(styles['diagram_service--neighbor'])
        if (activeIndex !== -1) {
          const total = services.length
          if (i === (activeIndex - 1 + total) % total ||
              i === (activeIndex + 1) % total) {
            s.classList.add(styles['diagram_service--neighbor'])
          }
        }
      })
    }

    function handleMouseMove(e: MouseEvent) {
      const center = getCenter()
      const deg = Math.atan2(e.clientY - center.y, e.clientX - center.x) * (180 / Math.PI)
      const angle = deg < 0 ? deg + 360 : deg

      if (typeof gsap !== 'undefined') {
        gsap.set(rotatingLine, { rotation: angle })
        gsap.set(circle, { rotation: angle })
      }

      updateContent(angle)
    }

    /* Initial state */
    updateContent(0)

    document.addEventListener('mousemove', handleMouseMove)

    /* Pulsing central dot */
    if (centralDot && typeof gsap !== 'undefined') {
      gsap.to(centralDot, {
        scale: 1.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      data-theme={theme}
      className={`${styles['diagram_wrap']} u-position-relative u-theme-${theme}`}
    >
      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>

      <div className={`${styles['diagram_contain']} u-container`}>
        <div className={styles['diagram_header']}>
          <h2 data-split="word" className={`${styles['diagram_heading']} u-text-style-h2`}>
            {heading}
          </h2>
          <p data-split="line" className={`${styles['diagram_description']} u-text-style-main u-text-decoration-justify-last`}>
            {description}
          </p>
        </div>
      </div>

      <div ref={diagramRef} className={`${styles['diagram_content']} u-container`}>

        {/* Rotating line */}
        <div className={styles['diagram_rotating-line']}>
          <div className={styles['diagram_rotating-line-el']}></div>
          <div className={styles['diagram_line-dot']}></div>
          <div className={styles['diagram_central-dot']}></div>
        </div>

        {/* Central circle */}
        <div className={styles['diagram_circle']}>
          <div className={styles['diagram_circle-inner']}></div>
          <div className={styles['diagram_circle-marker']}>
            <div className={styles['diagram_circle-marker-inner']}></div>
          </div>
        </div>

        {/* Service items */}
        <div className={styles['diagram_service-list']}>
          {items.slice(0, 8).map((item, i) => (
            <div
              key={item._key}
              data-angles={`${ANGLE_RANGES[i]?.[0]},${ANGLE_RANGES[i]?.[1]}`}
              className={`${styles['diagram_service']} ${styles[`diagram_service--${i + 1}`]}`}
            >
              <div className={styles['diagram_service-dot']}></div>
              <h3 className={`${styles['diagram_service-title']} u-text-style-h3`}>
                {item.title}
              </h3>
              <p className={`${styles['diagram_service-text']} u-text-style-main`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>
    </section>
  )
}
