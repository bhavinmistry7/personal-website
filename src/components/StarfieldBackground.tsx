'use client'

import { useEffect, useRef } from 'react'

// ── Base configuration ────────────────────────────────────────────────────────
const CIRCLE_COUNT   = 250           // number of stars (density)
const CIRCLE_RADIUS  = 1.5           // px — base dot radius (logical pixels)
const CYCLE_DURATION = 6000          // ms — full slow-pulse cycle: 0 → 1 → 0
const CIRCLE_COLOR   = '255, 215, 0' // warm yellow — RGB values

// ── Glint configuration ───────────────────────────────────────────────────────
const GLINT_MIN_DURATION = 300    // ms — shortest shimmer
const GLINT_MAX_DURATION = 600    // ms — longest shimmer
const GLINT_MIN_INTERVAL = 4000   // ms — min wait between glints per star
const GLINT_MAX_INTERVAL = 12000  // ms — max wait between glints per star
const GLINT_GLOW_RADIUS  = 6      // px — halo radius at peak intensity
const GLINT_GLOW_OPACITY = 0.40   // max halo opacity (scaled by pulse + intensity)
const GLINT_SCALE_BOOST  = 0.50   // extra radius at peak (fraction of CIRCLE_RADIUS)

// ── Rocket configuration ──────────────────────────────────────────────────────
const ROCKET_SIZE       = 14    // px — half-length of rocket body (logical pixels)
const ROCKET_SPEED      = 60    // px/s — cruise speed
const ROCKET_TURN_MIN   = 2000  // ms — min interval between random direction changes
const ROCKET_TURN_MAX   = 5000  // ms — max interval between random direction changes
const ROCKET_ESCAPE_MUL = 3     // speed multiplier during escape burst

// ─────────────────────────────────────────────────────────────────────────────

function randBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

interface Circle {
  x:     number  // normalised horizontal position [0, 1]
  y:     number  // normalised vertical position [0, 1]
  phase: number  // pulse phase offset in ms — staggers the slow blink

  // Glint state — mutated in-place each time a glint cycle completes
  glintNextAt:   number  // rAF timestamp (ms) at which the next glint begins
  glintDuration: number  // ms — duration of the current/upcoming glint
}

/**
 * StarfieldBackground — fixed <canvas> rendering a field of tiny yellow stars
 * on a solid black background.
 *
 * Two layered animations per star:
 *
 *   1. Slow pulse  — each star independently oscillates 0 → 1 → 0 opacity
 *      over CYCLE_DURATION (6 s) using a cosine ease-in-out. Phase-offset
 *      per star prevents synchronised flashing.
 *
 *   2. Glint shimmer — every 4–12 s each star fires a short (300–600 ms)
 *      brightness spike. The spike follows a sinusoidal bell curve (sin πt)
 *      so it ramps in and out smoothly. It is rendered as:
 *        a) a soft radial-gradient halo (drawn first, behind the dot)
 *        b) a slight dot-radius increase
 *      The halo opacity is anchored to the star's current pulse opacity so
 *      nearly-invisible stars don't produce orphaned glows.
 *
 * Performance notes:
 *   • Single <canvas> + requestAnimationFrame — no per-star DOM nodes
 *   • ~13 stars glinting at any moment on average — only those stars use
 *     createRadialGradient (cheap, ~O(1), well within frame budget)
 *   • HiDPI (devicePixelRatio) scaling reapplied after every canvas resize
 *   • prefers-reduced-motion: static dots at 25 % opacity, no animation
 *
 * TypeScript note: resize and draw are const arrow functions (not hoisted
 * function declarations) so TypeScript correctly narrows canvas / ctx to
 * non-null within their bodies based on the guards at the top of useEffect.
 */
export function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rocketRef = useRef({
    x: 0, y: 0,
    vx: 1, vy: 0,
    size: ROCKET_SIZE,
    escapeUntilMs: 0,
    nextTurnAtMs: 0,
    prevTimestamp: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Generate all star data up-front.
    // glintNextAt uses a random initial delay (4–12 s from page t=0) so that
    // glints spread naturally across the first several seconds after mount.
    const circles: Circle[] = Array.from({ length: CIRCLE_COUNT }, () => ({
      x:             Math.random(),
      y:             Math.random(),
      phase:         Math.random() * CYCLE_DURATION,
      glintNextAt:   randBetween(GLINT_MIN_INTERVAL, GLINT_MAX_INTERVAL),
      glintDuration: randBetween(GLINT_MIN_DURATION, GLINT_MAX_DURATION),
    }))

    // Logical viewport size — updated on resize
    let vw = window.innerWidth
    let vh = window.innerHeight

    // ── Arrow functions (non-hoisted) — TypeScript correctly sees canvas/ctx
    //    as non-null here because these consts are initialised after the guards.

    // Setting canvas.width resets the 2D context state (including transforms),
    // so the DPR scale must be reapplied immediately after each resize.
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      vw = window.innerWidth
      vh = window.innerHeight
      canvas.width  = vw * dpr
      canvas.height = vh * dpr
      canvas.style.width  = `${vw}px`
      canvas.style.height = `${vh}px`
      ctx.scale(dpr, dpr)
    }

    // Slow pulse: smooth 0 → 1 → 0 over one normalised period t ∈ [0, 1]
    const pulseOpacity = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * 2 * t)

    // Glint bump: smooth bell 0 → 1 → 0 over one normalised period t ∈ [0, 1]
    // sin(πt) peaks at exactly 1 when t = 0.5 and returns to 0 at both ends.
    const glintBump = (t: number) => Math.sin(Math.PI * t)

    const draw = (timestamp: number) => {
      // ── Background ──────────────────────────────────────────────────────────
      const isDark = document.documentElement.classList.contains('dark')
      if (isDark) {
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, 0, vw, vh)
      } else {
        ctx.clearRect(0, 0, vw, vh)   // transparent — body's white bg shows through
      }

      if (prefersReduced) {
        // Reduced-motion fallback: static field in dark mode only, no animation
        if (isDark) {
          ctx.fillStyle = `rgba(${CIRCLE_COLOR}, 0.25)`
          for (const c of circles) {
            ctx.beginPath()
            ctx.arc(c.x * vw, c.y * vh, CIRCLE_RADIUS, 0, Math.PI * 2)
            ctx.fill()
          }
        }
        rafId = requestAnimationFrame(draw)
        return
      }

      // ── Animated field (dark mode only) ──────────────────────────────────
      for (const c of circles) {
        if (!isDark) continue   // stars invisible in light mode
        const cx = c.x * vw
        const cy = c.y * vh

        // ── 1. Slow pulse ───────────────────────────────────────────────────
        const pulseT  = ((timestamp + c.phase) % CYCLE_DURATION) / CYCLE_DURATION
        const opacity = pulseOpacity(pulseT)

        // ── 2. Glint shimmer ────────────────────────────────────────────────
        const elapsed = timestamp - c.glintNextAt
        let glintIntensity = 0

        if (elapsed >= 0) {
          if (elapsed < c.glintDuration) {
            // Mid-glint: smooth bell-curve intensity [0 → 1 → 0]
            glintIntensity = glintBump(elapsed / c.glintDuration)
          } else {
            // Glint complete — schedule the next one with a fresh random delay
            c.glintNextAt   = timestamp + randBetween(GLINT_MIN_INTERVAL, GLINT_MAX_INTERVAL)
            c.glintDuration = randBetween(GLINT_MIN_DURATION, GLINT_MAX_DURATION)
          }
        }

        // ── 2a. Soft radial glow halo (drawn before the solid dot) ──────────
        // Halo opacity is anchored to the star's pulse opacity so that stars
        // near their dim phase don't emit orphaned bright halos.
        if (glintIntensity > 0) {
          const glowRadius  = CIRCLE_RADIUS + GLINT_GLOW_RADIUS * glintIntensity
          const glowOpacity = GLINT_GLOW_OPACITY * glintIntensity * opacity

          const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius)
          grd.addColorStop(0, `rgba(${CIRCLE_COLOR}, ${glowOpacity})`)
          grd.addColorStop(1, `rgba(${CIRCLE_COLOR}, 0)`)

          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2)
          ctx.fill()
        }

        // ── 2b. Solid dot with subtle radius boost during glint ─────────────
        const radius = CIRCLE_RADIUS + glintIntensity * CIRCLE_RADIUS * GLINT_SCALE_BOOST
        ctx.fillStyle = `rgba(${CIRCLE_COLOR}, ${opacity})`
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── Rocket update ──────────────────────────────────────────────────────
      const r = rocketRef.current
      const dt = r.prevTimestamp === 0
        ? 0
        : Math.min((timestamp - r.prevTimestamp) / 1000, 0.1)
      r.prevTimestamp = timestamp

      // Choose a new random direction at scheduled intervals
      if (timestamp >= r.nextTurnAtMs) {
        const a = Math.random() * Math.PI * 2
        r.vx = Math.cos(a)
        r.vy = Math.sin(a)
        r.nextTurnAtMs = timestamp + randBetween(ROCKET_TURN_MIN, ROCKET_TURN_MAX)
      }

      const rSpeed = timestamp < r.escapeUntilMs
        ? ROCKET_SPEED * ROCKET_ESCAPE_MUL
        : ROCKET_SPEED
      r.x += r.vx * rSpeed * dt
      r.y += r.vy * rSpeed * dt

      // Wrap edges
      const rMargin = r.size * 2
      if      (r.x < -rMargin)     r.x += vw + rMargin * 2
      else if (r.x > vw + rMargin) r.x -= vw + rMargin * 2
      if      (r.y < -rMargin)     r.y += vh + rMargin * 2
      else if (r.y > vh + rMargin) r.y -= vh + rMargin * 2

      // ── Draw rocket ────────────────────────────────────────────────────────
      const rAngle = Math.atan2(r.vy, r.vx)
      const s = r.size
      ctx.save()
      ctx.translate(r.x, r.y)
      ctx.rotate(rAngle)

      // Flame — sinusoidal flicker, drawn first so body renders on top
      const flicker = 0.7 + 0.3 * Math.sin(timestamp * 0.008)
      const flameLen = s * 0.9 * flicker

      ctx.beginPath()  // outer flame (yellow)
      ctx.moveTo(-s * 0.72, -s * 0.22)
      ctx.lineTo(-s * 0.72 - flameLen, 0)
      ctx.lineTo(-s * 0.72, s * 0.22)
      ctx.closePath()
      ctx.fillStyle = `rgba(255, 210, 0, ${0.75 * flicker})`
      ctx.fill()

      ctx.beginPath()  // inner flame (orange)
      ctx.moveTo(-s * 0.72, -s * 0.13)
      ctx.lineTo(-s * 0.72 - flameLen * 0.65, 0)
      ctx.lineTo(-s * 0.72, s * 0.13)
      ctx.closePath()
      ctx.fillStyle = `rgba(255, 110, 0, ${0.9 * flicker})`
      ctx.fill()

      // Capsule body — white on dark, dark on light
      ctx.beginPath()
      ctx.ellipse(0, 0, s * 0.8, s * 0.32, 0, 0, Math.PI * 2)
      ctx.fillStyle = isDark ? '#ffffff' : '#1a1a1a'
      ctx.fill()

      // Red fins
      ctx.fillStyle = '#ee3333'
      ctx.beginPath()  // top fin
      ctx.moveTo(-s * 0.45, -s * 0.32)
      ctx.lineTo(-s * 0.82, -s * 0.65)
      ctx.lineTo(-s * 0.15, -s * 0.32)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()  // bottom fin
      ctx.moveTo(-s * 0.45, s * 0.32)
      ctx.lineTo(-s * 0.82, s * 0.65)
      ctx.lineTo(-s * 0.15, s * 0.32)
      ctx.closePath()
      ctx.fill()

      // Blue porthole window
      ctx.beginPath()
      ctx.arc(s * 0.2, 0, s * 0.17, 0, Math.PI * 2)
      ctx.fillStyle = '#5bc8f5'
      ctx.fill()
      ctx.strokeStyle = '#dddddd'
      ctx.lineWidth = 0.8
      ctx.stroke()

      ctx.restore()

      rafId = requestAnimationFrame(draw)
    }

    resize()

    // Initialise rocket at viewport centre with a random heading
    const ro = rocketRef.current
    ro.x = vw / 2
    ro.y = vh / 2
    const initAngle = Math.random() * Math.PI * 2
    ro.vx = Math.cos(initAngle)
    ro.vy = Math.sin(initAngle)
    ro.nextTurnAtMs = randBetween(ROCKET_TURN_MIN, ROCKET_TURN_MAX)

    window.addEventListener('resize', resize)

    // Click — hit-test then trigger escape burst
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left   // logical CSS pixels — matches rocket coords
      const my = e.clientY - rect.top
      const r = rocketRef.current
      const dx = mx - r.x
      const dy = my - r.y
      if (Math.sqrt(dx * dx + dy * dy) < r.size * 0.9) {
        r.escapeUntilMs = performance.now() + 1200
        // Flee away from the click point
        const away = Math.atan2(r.y - my, r.x - mx)
        r.vx = Math.cos(away)
        r.vy = Math.sin(away)
      }
    }
    canvas.addEventListener('click', onClick)

    let rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'auto',
        display:       'block',
      }}
    />
  )
}
