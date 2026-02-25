'use client'

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

/**
 * AuroraBackground — fixed CSS-animated mesh gradient blobs with scroll parallax.
 *
 * Each blob is a two-layer structure:
 *   motion.div  — handles Framer Motion scroll parallax (translateY)
 *   inner div   — handles CSS aurora-float animations (no transform conflict)
 *
 * Visibility is controlled by --aurora-opacity CSS variable
 * (near-zero in light mode, 1 in dark mode) — no hydration mismatch.
 */
export function AuroraBackground() {
  const { scrollY }   = useScroll()
  const reducedMotion = useReducedMotion()

  // Parallax: each blob drifts upward at a different rate as the page scrolls.
  // Values are intentionally gentle — blobs span large areas so subtle drift reads clearly.
  const blob1Y = useTransform(scrollY, [0, 3000], [0, -80])
  const blob2Y = useTransform(scrollY, [0, 3000], [0, -130])
  const blob3Y = useTransform(scrollY, [0, 3000], [0, -55])
  const blob4Y = useTransform(scrollY, [0, 3000], [0, -100])

  return (
    <div
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
        overflow:      'hidden',
      }}
    >
      {/* ── Blob 1 — Indigo · top-left · slow parallax ────────────────── */}
      <motion.div
        style={{
          position:  'absolute',
          top:       '-15%',
          left:      '-15%',
          width:     '65vw',
          height:    '65vw',
          maxWidth:  '800px',
          maxHeight: '800px',
          y: reducedMotion ? 0 : blob1Y,
        }}
      >
        <div
          className="aurora-blob"
          style={{
            position:   'absolute',
            inset:      0,
            background: 'radial-gradient(circle at center, #6366f1 0%, transparent 68%)',
            filter:     'blur(80px)',
            animation:  'aurora-float-1 28s ease-in-out infinite',
          }}
        />
      </motion.div>

      {/* ── Blob 2 — Violet · center-right · deeper parallax ─────────── */}
      <motion.div
        style={{
          position:  'absolute',
          top:       '20%',
          right:     '-25%',
          width:     '80vw',
          height:    '80vw',
          maxWidth:  '1000px',
          maxHeight: '1000px',
          y: reducedMotion ? 0 : blob2Y,
        }}
      >
        <div
          className="aurora-blob"
          style={{
            position:       'absolute',
            inset:          0,
            background:     'radial-gradient(circle at center, #8b5cf6 0%, transparent 65%)',
            filter:         'blur(100px)',
            animation:      'aurora-float-2 35s ease-in-out infinite',
            animationDelay: '-10s',
          }}
        />
      </motion.div>

      {/* ── Blob 3 — Cyan · bottom-left · shallow parallax ───────────── */}
      <motion.div
        style={{
          position:  'absolute',
          bottom:    '-10%',
          left:      '10%',
          width:     '45vw',
          height:    '45vw',
          maxWidth:  '600px',
          maxHeight: '600px',
          y: reducedMotion ? 0 : blob3Y,
        }}
      >
        <div
          className="aurora-blob"
          style={{
            position:       'absolute',
            inset:          0,
            background:     'radial-gradient(circle at center, #06b6d4 0%, transparent 70%)',
            filter:         'blur(90px)',
            animation:      'aurora-float-3 22s ease-in-out infinite',
            animationDelay: '-5s',
          }}
        />
      </motion.div>

      {/* ── Blob 4 — Purple accent · top-right · ambient ─────────────── */}
      <motion.div
        style={{
          position:  'absolute',
          top:       '5%',
          right:     '5%',
          width:     '35vw',
          height:    '35vw',
          maxWidth:  '450px',
          maxHeight: '450px',
          y: reducedMotion ? 0 : blob4Y,
        }}
      >
        <div
          className="aurora-blob"
          style={{
            position:       'absolute',
            inset:          0,
            background:     'radial-gradient(circle at center, #a855f7 0%, transparent 72%)',
            filter:         'blur(70px)',
            // Extra dim compared to base aurora-blob opacity
            opacity:        'calc(var(--aurora-opacity) * 0.3)',
            animation:      'aurora-float-1 40s ease-in-out infinite reverse',
            animationDelay: '-15s',
          }}
        />
      </motion.div>

      {/* ── Noise texture overlay for depth ───────────────────────────── */}
      <div
        style={{
          position:        'absolute',
          inset:           0,
          opacity:         'calc(var(--aurora-opacity) * 0.04)',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
