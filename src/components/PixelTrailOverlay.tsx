'use client'

import { useEffect, useRef } from 'react'

// ─── Tuning constants ─────────────────────────────────────────────────────────
const BLOCK_SIZE  = 16    // px — side length of each pixel cell
const MAX_TRAIL   = 28    // max live trail points
const FADE_MS     = 700   // ms — how long each point lingers before fully gone
const SOFT_RADIUS = 180   // px — circular soft-falloff radius around cursor
const STORAGE_KEY = 'pixelTrail'

interface TrailPoint {
  x:    number   // grid-snapped X
  y:    number   // grid-snapped Y
  born: number   // performance.now() timestamp when added
}

// easeOutQuad — fast initial fade, smooth tail-off
function easeOut(t: number) { return 1 - (1 - t) * (1 - t) }

export function PixelTrailOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // ── Gate: touch-only devices & prefers-reduced-motion ──────────────────
    if (window.matchMedia('(hover: none)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.imageSmoothingEnabled = false

    const trail: TrailPoint[] = []
    let lastGX  = -1
    let lastGY  = -1
    let cursorX = -1
    let cursorY = -1
    let rafId:  number
    let isDark  = document.documentElement.classList.contains('dark')

    // Read persisted preference — default ON
    let pixelEnabled = localStorage.getItem(STORAGE_KEY) !== 'off'

    // ── Resize ──────────────────────────────────────────────────────────────
    function resize() {
      canvas!.width  = window.innerWidth
      canvas!.height = window.innerHeight
    }
    resize()

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(resize)
      : null
    ro?.observe(document.body)
    window.addEventListener('resize', resize, { passive: true })

    // ── Mouse tracking ──────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      cursorX = e.clientX
      cursorY = e.clientY
      if (!pixelEnabled) return

      // Snap to 16 px grid
      const gx = Math.floor(e.clientX / BLOCK_SIZE) * BLOCK_SIZE
      const gy = Math.floor(e.clientY / BLOCK_SIZE) * BLOCK_SIZE
      if (gx === lastGX && gy === lastGY) return
      lastGX = gx
      lastGY = gy

      trail.push({ x: gx, y: gy, born: performance.now() })
      if (trail.length > MAX_TRAIL) trail.splice(0, trail.length - MAX_TRAIL)
    }

    // ── Toggle listener ─────────────────────────────────────────────────────
    function onToggle(e: Event) {
      pixelEnabled = (e as CustomEvent).detail === 'on'
      if (!pixelEnabled) {
        trail.length = 0
        lastGX = -1
        lastGY = -1
      }
    }
    window.addEventListener('pixel-trail-toggle', onToggle)

    // ── Dark-mode observer ───────────────────────────────────────────────────
    const themeObs = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark')
      canvas!.style.mixBlendMode = isDark ? 'screen' : 'normal'
    })
    themeObs.observe(document.documentElement, {
      attributes: true, attributeFilter: ['class'],
    })

    // Initial blend mode
    canvas.style.mixBlendMode = isDark ? 'screen' : 'normal'

    // ── Render loop ─────────────────────────────────────────────────────────
    function render() {
      rafId = requestAnimationFrame(render)

      // Always clear first — ensures canvas goes blank the frame after disable
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)

      if (!pixelEnabled) return

      const now = performance.now()
      let i = 0

      while (i < trail.length) {
        const pt  = trail[i]
        const age = now - pt.born

        // Drop expired points
        if (age >= FADE_MS) {
          trail.splice(i, 1)
          continue
        }

        // Age-based fade (easeOut so it starts bright and lingers gently)
        const ageFade = 1 - easeOut(age / FADE_MS)

        // Circular soft-falloff from current cursor position
        const dx   = (pt.x + BLOCK_SIZE / 2) - cursorX
        const dy   = (pt.y + BLOCK_SIZE / 2) - cursorY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const radialFade = Math.max(0, 1 - dist / SOFT_RADIUS)

        const alpha = ageFade * radialFade

        if (alpha > 0.004) {
          if (isDark) {
            // Gold on dark: screen blend-mode makes it glow over the starfield
            ctx!.fillStyle = `rgba(255,230,0,${alpha})`
          } else {
            // Black on light: normal blend, clean pixel trail on white
            ctx!.fillStyle = `rgba(0,0,0,${alpha * 0.7})`
          }
          ctx!.fillRect(pt.x, pt.y, BLOCK_SIZE, BLOCK_SIZE)
        }

        i++
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    render()

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pixel-trail-toggle', onToggle)
      cancelAnimationFrame(rafId)
      ro?.disconnect()
      themeObs.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        9999,
        pointerEvents: 'none',
      }}
    />
  )
}
