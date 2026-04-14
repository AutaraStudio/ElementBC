'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap, { ScrollTrigger } from '@/lib/gsap'
import CharStagger from '@/components/ui/CharStagger'

const NAV_ITEMS = [
  { label: 'About', target: '#about' },
  { label: 'Stats', target: '#stats' },
  { label: 'Services', target: '#services' },
  { label: 'Case Studies', target: '#case-studies' },
]

export default function ProgressNav() {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)
  const hasShown = useRef(false)

  useEffect(() => {
    if (pathname !== '/') return
    const nav = navRef.current
    const list = listRef.current
    const indicator = indicatorRef.current
    if (!nav || !list || !indicator) return

    function updateIndicator(activeBtn: Element) {
      const parentRect = list!.getBoundingClientRect()
      const btnRect = activeBtn.getBoundingClientRect()
      const leftPct = ((btnRect.left - parentRect.left) / parentRect.width) * 100
      const widthPct = (btnRect.width / parentRect.width) * 100

      indicator!.style.left = `${leftPct}%`
      indicator!.style.width = `${widthPct}%`
    }

    function show() {
      if (hasShown.current) return
      hasShown.current = true
      gsap.to(nav!, { y: 0, x: '-50%', opacity: 1, duration: 0.5, ease: 'power3.out' })
    }

    function hide() {
      hasShown.current = false
      gsap.to(nav!, { y: 20, x: '-50%', opacity: 0, duration: 0.4, ease: 'power2.in' })
    }

    const anchors = gsap.utils.toArray<HTMLElement>('[data-progress-nav-anchor]')
    const triggers: ScrollTrigger[] = []

    anchors.forEach((anchor) => {
      const id = anchor.getAttribute('id')
      if (!id) return

      // Hide on hero and footer
      if (id === 'top' || id === 'bottom') {
        const st = ScrollTrigger.create({
          trigger: anchor,
          start: '0% 50%',
          end: '100% 50%',
          onEnter: () => hide(),
          onEnterBack: () => hide(),
        })
        triggers.push(st)
        return
      }

      const st = ScrollTrigger.create({
        trigger: anchor,
        start: '0% 50%',
        end: '100% 50%',
        onEnter: () => { show(); activate(id) },
        onEnterBack: () => { show(); activate(id) },
      })
      triggers.push(st)
    })

    function activate(id: string) {
      const activeBtn = list!.querySelector(`[data-progress-target="#${id}"]`)
      if (!activeBtn) return

      list!.querySelectorAll('[data-progress-target]').forEach((btn) => {
        btn.classList.remove('is--active')
      })
      activeBtn.classList.add('is--active')
      updateIndicator(activeBtn)

      // Theme-aware: read the active section's theme
      const section = document.getElementById(id)
      if (section) {
        const theme = section.getAttribute('data-theme') || section.closest('[data-theme]')?.getAttribute('data-theme') || 'buff'
        nav!.setAttribute('data-theme', theme)
      }
    }

    return () => {
      triggers.forEach((st) => st.kill())
    }
  }, [pathname])

  if (pathname !== '/') return null

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, target: string) {
    e.preventDefault()
    const el = document.querySelector(target)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav ref={navRef} className="progress-nav" data-theme="charcoal" style={{ opacity: 0, transform: 'translateX(-50%) translateY(20px)' }}>
      <div ref={listRef} className="progress-nav__list">
        <div ref={indicatorRef} className="progress-nav__indicator" />
        {NAV_ITEMS.map((item) => (
          <a
            key={item.target}
            data-progress-target={item.target}
            href={item.target}
            onClick={(e) => handleClick(e, item.target)}
            className="progress-nav__btn link-stagger"
          >
            <div className="u-text-style-small u-text-transform-uppercase"><CharStagger>{item.label}</CharStagger></div>
          </a>
        ))}
      </div>
    </nav>
  )
}
