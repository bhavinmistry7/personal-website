'use client'

import { useRef, useEffect }                                                      from 'react'
import { motion, useScroll, useTransform, useReducedMotion, useMotionValue, animate } from 'framer-motion'
import Link                                                      from 'next/link'
import { home }                                                  from '@/content/siteContent'

// Shared arrow icon
function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14" height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

/**
 * HeroScrollSection — cinematic sticky scroll story.
 *
 * Structure:
 *   ┌─ 120vh outer container (provides scroll room)
 *   └─ sticky 100vh inner section (stays pinned while outer scrolls)
 *        ├─ Availability pill + roles + tagline + CTAs  (fade out 0–65%)
 *        ├─ "Bhavin Mistry"  h1  (morphs out: 12–80%)
 *        └─ Scroll hint  (fades out 0–16%)
 *
 * All transforms are driven by useScroll on the outer container so the
 * animations are precisely tied to scroll position, not time.
 */
export function HeroScrollSection() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  // Mark hero as active on mount (SectionNav listens for this event)
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('section-active', { detail: { id: 'hero' } })
    )
  }, [])

  // scrollYProgress: 0 → container top at viewport top
  //                  1 → container bottom at viewport bottom (= scrolled 100vh)
  const { scrollYProgress } = useScroll({
    target:  containerRef,
    offset:  ['start start', 'end end'],
  })

  // ── "Bhavin Mistry" scroll-exit ──────────────────────────────────────────
  const nameOpacity = useTransform(scrollYProgress, [0, 0.12, 0.80], [1, 1, 0])
  const nameY       = useTransform(scrollYProgress, [0.12, 0.80],     [0, -44])
  const nameScale   = useTransform(scrollYProgress, [0.12, 0.80],     [1, 0.93])
  const nameBlurRaw = useTransform(scrollYProgress, [0.12, 0.80],     [0, 9])

  // ── "Bhavin Mistry" load-in entrance (time-based, 3 s) ──────────────────
  // Combined with the scroll-exit values so both can coexist:
  //   opacity / scale: Math.min(loadValue, scrollValue) — most constrained wins
  //   blur:            loadBlur + scrollBlur — additive
  const loadOpacity        = useMotionValue(0)
  const loadScale          = useMotionValue(0.9)
  const loadBlur           = useMotionValue(10)
  const loadSupportOpacity = useMotionValue(0)
  const loadSupportY       = useMotionValue(12)

  useEffect(() => {
    if (reducedMotion) {
      loadOpacity.set(1);        loadScale.set(1);  loadBlur.set(0)
      loadSupportOpacity.set(1); loadSupportY.set(0)
      return
    }
    // Name: fades/scales/unblurs in over 3 s immediately
    const c1 = animate(loadOpacity, 1, { duration: 3,   ease: 'easeOut' })
    const c2 = animate(loadScale,   1, { duration: 3,   ease: 'easeOut' })
    const c3 = animate(loadBlur,    0, { duration: 3,   ease: 'easeOut' })
    // Support content: fades up 1 s after name starts, over 1.5 s
    const c4 = animate(loadSupportOpacity, 1, { duration: 1.5, ease: 'easeOut', delay: 1 })
    const c5 = animate(loadSupportY,       0, { duration: 1.5, ease: 'easeOut', delay: 1 })
    return () => { c1.stop(); c2.stop(); c3.stop(); c4.stop(); c5.stop() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  const combinedNameOpacity = useTransform(
    [loadOpacity, nameOpacity],
    ([load, scroll]: number[]) => Math.min(load, scroll),
  )
  const combinedNameScale = useTransform(
    [loadScale, nameScale],
    ([load, scroll]: number[]) => Math.min(load, scroll),
  )
  const combinedNameBlurRaw = useTransform(
    [loadBlur, nameBlurRaw],
    ([load, scroll]: number[]) => load + scroll,
  )
  const combinedNameFilter = useTransform(combinedNameBlurRaw, (v: number) => `blur(${v}px)`)

  // ── Support content (pill + roles + tagline + CTAs) ─────────────────────
  // Entrance is now time-based (load animation above).
  // These scroll-driven values only handle the exit (start at 1 / 0).
  const supportOpacity = useTransform(scrollYProgress, [0.30, 0.65], [1, 0])
  const supportY       = useTransform(scrollYProgress, [0.30, 0.65], [0, -24])

  // Combined: Math.min for opacity (most constrained wins); add for Y
  const combinedSupportOpacity = useTransform(
    [loadSupportOpacity, supportOpacity],
    ([load, scroll]: number[]) => Math.min(load, scroll),
  )
  const combinedSupportY = useTransform(
    [loadSupportY, supportY],
    ([load, scroll]: number[]) => (load as number) + (scroll as number),
  )

  // ── Scroll hint ──────────────────────────────────────────────────────────
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04, 0.16], [0, 1, 0])

  return (
    // 122vh outer — ~22vh of scroll room
    <div ref={containerRef} style={{ height: '122vh', position: 'relative' }}>
      <section
        id="hero"
        aria-label="hero"
        className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden scroll-mt-16"
      >
        {/* Dot grid — subtle texture behind content */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--text-muted) 1px, transparent 1px)',
            backgroundSize:  '48px 48px',
            opacity:         0.022,
          }}
        />

        {/* text-center + items centering cascade to all child elements */}
        <div className="container-site relative z-10 text-center">

          {/* ── Morphing heading ─────────────────────────────────────────── */}
          {/*
            Pattern: an invisible spacer holds the layout height so the
            content below doesn't shift as the texts morph. Two absolutely-
            positioned motion elements overlay the spacer.
          */}
          <div className="relative mb-8">
            {/* Spacer — no semantics, just reserves space */}
            <div
              aria-hidden="true"
              className="font-heading leading-[1.1] tracking-[-0.04em] lowercase invisible select-none pointer-events-none"
              style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}
            >
              {home.hero.heading}
            </div>

            {/* Semantic h1: "bhavin mistry" — morphs out on scroll */}
            <motion.h1
              className="absolute inset-x-0 top-0 font-heading leading-[1.1] tracking-[-0.04em] lowercase text-gradient-gold"
              style={{
                fontSize: 'clamp(4rem, 12vw, 10rem)',
                ...(reducedMotion ? {} : {
                  opacity: combinedNameOpacity,
                  y:       nameY,
                  scale:   combinedNameScale,
                  filter:  combinedNameFilter,
                }),
              }}
            >
              {home.hero.heading}
            </motion.h1>

          </div>

          {/* ── Roles + tagline + CTAs ───────────────────────────────────── */}
          <motion.div
            style={reducedMotion ? {} : { opacity: combinedSupportOpacity, y: combinedSupportY }}
          >
            {/* Roles */}
            <div className="flex flex-wrap items-center gap-3 mb-8 justify-center">
              {home.hero.roles.map((role, i) => (
                <span key={role} className="flex items-center gap-3">
                  <span
                    className="font-heading text-lg md:text-xl italic"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {role}
                  </span>
                  {i < home.hero.roles.length - 1 && (
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: 'var(--gold)' }}
                    />
                  )}
                </span>
              ))}
            </div>

            {/* Tagline */}
            <p
              className="max-w-lg text-base md:text-lg leading-relaxed mb-10 mx-auto"
              style={{ color: 'var(--text-muted)' }}
            >
              {home.hero.tagline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={home.hero.cta.primary.href} className="btn-primary">
                {home.hero.cta.primary.text}
                <ArrowIcon />
              </Link>
              <Link href={home.hero.cta.secondary.href} className="btn-outline">
                {home.hero.cta.secondary.text}
              </Link>
            </div>
          </motion.div>

          {/* ── Scroll hint ──────────────────────────────────────────────── */}
          <motion.div
            style={{
              color: 'var(--text-muted)',
              ...(reducedMotion ? {} : { opacity: hintOpacity }),
            }}
            className="flex items-center justify-center gap-3 mt-20 md:mt-28"
            aria-hidden="true"
          >
            <div className="w-px h-10" style={{ backgroundColor: 'var(--border)' }} />
            <span className="text-[10px] font-medium tracking-[0.3em] uppercase">Scroll</span>
          </motion.div>

        </div>
      </section>
    </div>
  )
}
