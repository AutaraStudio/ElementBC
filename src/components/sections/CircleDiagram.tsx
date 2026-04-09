'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
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

const START_ANGLE = 307  // Start at item 3 (Planning & Feasibility)

export default function CircleDiagram({ heading, description, items, theme = 'buff' }: CircleDiagramProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const diagram = diagramRef.current
    if (!section || !diagram) return

    const mql = window.matchMedia('(min-width: 992px)')
    if (!mql.matches) return

    const rotatingLine = diagram.querySelector<HTMLElement>(`.${styles['diagram_rotating-line']}`)
    const circle = diagram.querySelector<HTMLElement>(`.${styles['diagram_circle']}`)
    const services = diagram.querySelectorAll<HTMLElement>(`.${styles['diagram_service']}`)
    const centralDot = diagram.querySelector<HTMLElement>(`.${styles['diagram_central-dot']}`)

    if (!rotatingLine || !circle || !services.length) return

    function updateContent(angle: number) {
      const normAngle = ((angle % 360) + 360) % 360
      let activeIndex = -1

      services.forEach((s, i) => {
        const rangeStr = s.dataset.angles
        if (!rangeStr) return
        const [start, end] = rangeStr.split(',').map(Number)
        const inRange = start > end
          ? normAngle >= start || normAngle <= end
          : normAngle >= start && normAngle <= end

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

    /* Set initial state */
    gsap.set(rotatingLine, { rotation: START_ANGLE })
    gsap.set(circle, { rotation: START_ANGLE })
    updateContent(START_ANGLE)

    /* Scroll-scrubbed rotation proxy */
    const proxy = { angle: START_ANGLE }

    function init() {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      tl.to(proxy, {
        angle: START_ANGLE + 360,
        duration: 1,
        ease: 'none',
        onUpdate: () => {
          const a = proxy.angle
          gsap.set(rotatingLine, { rotation: a })
          gsap.set(circle, { rotation: a })
          updateContent(a)
        },
      })

      return tl
    }

    /* Pulsing central dot */
    let dotTween: gsap.core.Tween | null = null
    if (centralDot) {
      dotTween = gsap.to(centralDot, {
        scale: 1.2,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    }

    /* Defer until Lenis ScrollTrigger proxy is ready */
    let tl: gsap.core.Timeline | null = null
    if (ScrollTrigger.getAll().length > 0) {
      tl = init()
    } else {
      const handler = () => { tl = init() }
      window.addEventListener('preloader:complete', handler, { once: true })
      return () => {
        window.removeEventListener('preloader:complete', handler)
        if (dotTween) dotTween.kill()
      }
    }

    return () => {
      if (tl) tl.kill()
      if (dotTween) dotTween.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      data-theme={theme}
      className={`${styles['diagram_wrap']} u-position-relative u-theme-${theme}`}
    >
      {/* Heading — scrolls away naturally */}
      <div data-wf--spacer--variant="main" className="u-section-spacer is-main u-ignore-trim"></div>

      <div className={`${styles['diagram_contain']} u-container`}>
        <div className={styles['diagram_header']}>
          <h2 data-split="word" className={`${styles['diagram_heading']} u-text-style-h2 u-text-transform-uppercase`}>
            {heading}
          </h2>
          <p data-split="line" className={`${styles['diagram_description']} u-text-style-main u-text-decoration-justify-last`}>
            {description}
          </p>
        </div>
      </div>

      {/* Sticky viewport — diagram stays in view while section scrolls */}
      <div className={styles['diagram_sticky']}>
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
                <h3 className={`${styles['diagram_service-title']} u-text-style-h5`}>
                  {item.title}
                </h3>
                <p className={`${styles['diagram_service-text']} u-text-style-main`}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
