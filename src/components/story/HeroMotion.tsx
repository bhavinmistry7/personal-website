'use client'

import { useEffect } from 'react'
import { useReducedMotion, useScroll } from 'framer-motion'

/**
 * Scroll-linked depth for the pinned (server-rendered) hero while the light
 * panel slides over it. Lives in the lazy Story chunk so the hero ships no JS.
 * Progress 0 → 1 across the first viewport of scroll:
 *   photo:   recedes (scale down, drifts up) and darkens
 *   content: drifts up slightly and dims
 */
export function HeroMotion() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()

  useEffect(() => {
    if (reduced) return
    const photo   = document.getElementById('hero-photo')
    const shade   = document.getElementById('hero-shade')
    const content = document.getElementById('hero-content')
    if (!photo || !shade || !content) return

    let vh = window.innerHeight || 800
    const onResize = () => { vh = window.innerHeight || 800 }
    const apply = (y: number) => {
      const p = Math.min(Math.max(y / vh, 0), 1)
      photo.style.transform   = `translateY(${-4 * p}%) scale(${1 - 0.1 * p})`
      shade.style.opacity     = String(0.75 * p)
      content.style.transform = `translateY(${-6 * p}%) scale(${1 - 0.03 * p})`
      content.style.opacity   = String(1 - 0.75 * Math.min(p / 0.8, 1))
    }

    apply(scrollY.get())
    const unsubscribe = scrollY.on('change', apply)
    window.addEventListener('resize', onResize)
    return () => {
      unsubscribe()
      window.removeEventListener('resize', onResize)
      for (const el of [photo, content]) { el.style.transform = ''; el.style.opacity = '' }
      shade.style.opacity = ''
    }
  }, [reduced, scrollY])

  return null
}
