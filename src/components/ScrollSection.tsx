'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// ─── Context ─────────────────────────────────────────────────────────────────
// Lets child elements know when their parent section is in view,
// enabling staggered reveals without prop drilling.

interface SectionContextValue {
  inView: boolean
}

const SectionContext = createContext<SectionContextValue>({ inView: false })

export function useSectionContext() {
  return useContext(SectionContext)
}

// ─── ScrollSection ────────────────────────────────────────────────────────────

interface ScrollSectionProps {
  /** Must match a SectionNav entry id so the dot activates correctly. */
  id:           string
  children:     React.ReactNode
  className?:   string
  /** Whether the section should be at least full viewport height. Default: true. */
  fullHeight?:  boolean
}

/**
 * A scroll-aware section that:
 * 1. Tracks its own visibility with a persistent IntersectionObserver
 *    (unlike FadeIn which disconnects after first reveal — this one stays alive
 *    so scrolling back up reactivates the correct SectionNav dot).
 * 2. Dispatches a 'section-active' CustomEvent for SectionNav to listen to.
 * 3. Exposes inView via context for child reveal animations.
 */
export function ScrollSection({
  id,
  children,
  className,
  fullHeight = true,
}: ScrollSectionProps) {
  const ref    = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Use rootMargin to only activate when the section occupies
    // the central 30% of the viewport — avoids flickering on edges.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) {
          window.dispatchEvent(
            new CustomEvent('section-active', { detail: { id } })
          )
        }
      },
      { threshold: 0, rootMargin: '-25% 0px -55% 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [id])

  return (
    <SectionContext.Provider value={{ inView }}>
      <section
        ref={ref}
        id={id}
        aria-label={id}
        // scroll-mt-16 accounts for the fixed Nav height so anchor jumps land correctly
        className={cn(
          'relative scroll-mt-16',
          fullHeight ? 'min-h-screen' : '',
          className
        )}
      >
        {children}
      </section>
    </SectionContext.Provider>
  )
}

// ─── SectionReveal ────────────────────────────────────────────────────────────

interface SectionRevealProps {
  children:   React.ReactNode
  className?: string
  /** Delay before the reveal animation starts (ms). Use for stagger. */
  delay?:     number
  /** Axis of the slide-in. Default: 'up'. */
  direction?: 'up' | 'left' | 'right' | 'none'
}

const translateMap = {
  up:    'translateY(28px)',
  left:  'translateX(-28px)',
  right: 'translateX(28px)',
  none:  'none',
}

/**
 * A child of ScrollSection that animates in when its parent section enters view.
 * Reads inView from SectionContext — no additional IntersectionObserver needed.
 */
export function SectionReveal({
  children,
  className,
  delay     = 0,
  direction = 'up',
}: SectionRevealProps) {
  const { inView } = useSectionContext()

  return (
    <div
      className={cn('will-change-transform', className)}
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'none' : translateMap[direction],
        transition: `opacity 0.75s ease, transform 0.75s ease`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
