'use client'

import { useEffect, useState } from 'react'

/**
 * ScrollProgress — a 2 px gradient bar pinned to the very top of the viewport.
 * Uses a passive scroll listener; no layout thrashing.
 * Sits at z-[60] — above Nav (z-50) but non-interactive.
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let rafId = 0

    function update() {
      const el    = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }

    function onScroll() {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      role="presentation"
      style={{
        position:   'fixed',
        top:        0,
        left:       0,
        zIndex:     60,
        height:     '2px',
        width:      `${pct}%`,
        background: 'linear-gradient(90deg, #FFCC00 0%, #FFE600 100%)',
        transition: 'width 80ms linear',
        pointerEvents: 'none',
      }}
    />
  )
}
