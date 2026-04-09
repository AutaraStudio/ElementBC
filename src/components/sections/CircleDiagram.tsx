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

const ANGLE_RANGES = [
  [217, 262], [262, 307], [307, 352], [352, 37],
  [37, 82], [82, 127], [127, 172], [172, 217],
]

const START_ANGLE = 307

export default function CircleDiagram({ heading, description, items, theme = 'buff' }: CircleDiagramProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const diagram = diagramRef.current
    const svgCircle = circleRef.current
    if (!section || !diagram) return

    const mql = window.matchMedia('(min-width: 992px)')
    if (!mql.matches) return

    const rotatingLine = diagram.querySelector<HTMLElement>(`.${styles['diagram_rotating-line']}`)
    const circleEl = diagram.querySelector<HTMLElement>(`.${styles['diagram_circle']}`)
    const services = diagram.querySelectorAll<HTMLElement>(`.${styles['diagram_service']}`)
    const centralDot = diagram.querySelector<HTMLElement>(`.${styles['diagram_central-dot']}`)
    const lineDot = diagram.querySelector<HTMLElement>(`.${styles['diagram_line-dot']}`)
    const lineEl = diagram.querySelector<HTMLElement>(`.${styles['diagram_rotating-line-el']}`)

    if (!rotatingLine || !circleEl || !services.length) return

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

    /* ── Initial hidden state ── */
    gsap.set(rotatingLine, { rotation: START_ANGLE, opacity: 0 })
    gsap.set(circleEl, { rotation: START_ANGLE, opacity: 0 })
    gsap.set(services, { opacity: 0 })
    if (centralDot) gsap.set(centralDot, { scale: 0, opacity: 0 })
    if (lineDot) gsap.set(lineDot, { scale: 0, opacity: 0 })
    if (lineEl) gsap.set(lineEl, { scaleX: 0, transformOrigin: 'left center' })

    // SVG circle stroke draw
    if (svgCircle) {
      const circumference = 2 * Math.PI * 49.5
      gsap.set(svgCircle, {
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
      })
    }

    /* ── Scroll rotation proxy ── */
    const proxy = { angle: START_ANGLE }

    function initScrollAnimation() {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })

      scrollTl.to(proxy, {
        angle: START_ANGLE + 360,
        duration: 1,
        ease: 'none',
        onUpdate: () => {
          const a = proxy.angle
          gsap.set(rotatingLine, { rotation: a })
          gsap.set(circleEl, { rotation: a })
          updateContent(a)
        },
      })

      return scrollTl
    }

    /* ── Intro animation sequence ── */
    function playIntro() {
      const intro = gsap.timeline({
        onComplete: () => {
          updateContent(START_ANGLE)
        },
      })

      // 1. Draw the SVG circle ring
      if (svgCircle) {
        intro.to(svgCircle, {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: 'power2.inOut',
        }, 0)
      }

      // 2. Fade in the visual circle element
      intro.to(circleEl, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, 0.4)

      // 3. Central square appears
      if (centralDot) {
        intro.to(centralDot, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: 'back.out(2)',
        }, 0.7)
      }

      // 4. Line draws out
      intro.to(rotatingLine, { opacity: 1, duration: 0.01 }, 0.9)
      if (lineEl) {
        intro.to(lineEl, {
          scaleX: 1,
          duration: 0.4,
          ease: 'power2.out',
        }, 0.9)
      }

      // 5. End square appears
      if (lineDot) {
        intro.to(lineDot, {
          scale: 1,
          opacity: 1,
          duration: 0.25,
          ease: 'back.out(2)',
        }, 1.2)
      }

      // 6. Service items fade in one by one
      intro.to(services, {
        opacity: 0.2,
        duration: 0.3,
        ease: 'power2.out',
        stagger: 0.04,
      }, 1.0)

      return intro
    }

    let scrollTl: gsap.core.Timeline | null = null
    let introTl: gsap.core.Timeline | null = null

    function run() {
      introTl = playIntro()
      scrollTl = initScrollAnimation()
    }

    if (ScrollTrigger.getAll().length > 0) {
      run()
    } else {
      window.addEventListener('preloader:complete', run, { once: true })
    }

    return () => {
      window.removeEventListener('preloader:complete', run)
      if (scrollTl) scrollTl.kill()
      if (introTl) introTl.kill()
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
          <h2 data-split="word" className={`${styles['diagram_heading']} u-text-style-h2 u-text-transform-uppercase`}>
            {heading}
          </h2>
          <p data-split="line" className={`${styles['diagram_description']} u-text-style-main u-text-decoration-justify-last`}>
            {description}
          </p>
        </div>
      </div>

      <div className={styles['diagram_sticky']}>
        <div ref={diagramRef} className={`${styles['diagram_content']} u-container`}>

          {/* SVG circle for stroke-draw animation */}
          <svg
            className={styles['diagram_circle-svg']}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              ref={circleRef}
              cx="50" cy="50" r="49.5"
              fill="none"
              stroke="var(--_theme---border)"
              strokeWidth="0.35"
            />
          </svg>

          {/* Rotating line */}
          <div className={styles['diagram_rotating-line']}>
            <div className={styles['diagram_rotating-line-el']}></div>
            <div className={styles['diagram_line-dot']}></div>
            <div className={styles['diagram_central-dot']}></div>
          </div>

          {/* Central circle (visual fill — rotates with line) */}
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
