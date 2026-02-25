'use client'

import { useRef, useEffect }                                    from 'react'
import { motion, useScroll, useTransform, useReducedMotion }    from 'framer-motion'
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

  // ── "Bhavin Mistry" exits ────────────────────────────────────────────────
  // Exit remapped to 0.80 (was 0.44) so the fade uses most of the 50vh
  // scroll room — keeps the same physical scroll feel as before.
  const nameOpacity = useTransform(scrollYProgress, [0, 0.12, 0.80], [1, 1, 0])
  const nameY       = useTransform(scrollYProgress, [0.12, 0.80],     [0, -44])
  const nameScale   = useTransform(scrollYProgress, [0.12, 0.80],     [1, 0.93])
  const nameBlurRaw = useTransform(scrollYProgress, [0.12, 0.80],     [0, 9])
  const nameFilter  = useTransform(nameBlurRaw, (v) => `blur(${v}px)`)

  // ── Support content (pill + roles + tagline + CTAs) ─────────────────────
  // Exit remapped to 0.65 (was 0.38) proportionally to new scroll range.
  const supportOpacity = useTransform(scrollYProgress, [0, 0.04, 0.30, 0.65], [0, 1, 1, 0])
  const supportY       = useTransform(scrollYProgress, [0.30, 0.65], [0, -24])

  // ── Scroll hint ──────────────────────────────────────────────────────────
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04, 0.16], [0, 1, 0])

  return (
    // 120vh outer — 20vh of scroll room (~1 scroll gesture to reach About)
    <div ref={containerRef} style={{ height: '120vh', position: 'relative' }}>
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

          {/* ── Availability pill ────────────────────────────────────────── */}
          <motion.div
            style={reducedMotion ? {} : { opacity: supportOpacity, y: supportY }}
            className="mb-10"
          >
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-medium"
              style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {home.hero.availability}
            </div>
          </motion.div>

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
                  opacity: nameOpacity,
                  y:       nameY,
                  scale:   nameScale,
                  filter:  nameFilter,
                }),
              }}
            >
              {home.hero.heading}
            </motion.h1>

          </div>

          {/* ── Roles + tagline + CTAs ───────────────────────────────────── */}
          <motion.div
            style={reducedMotion ? {} : { opacity: supportOpacity, y: supportY }}
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
