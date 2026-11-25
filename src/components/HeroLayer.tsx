'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'

/**
 * Scroll-linked depth for the pinned hero while the light panel slides over it.
 * Progress 0 → 1 across the first viewport of scroll.
 *   photo:   recedes (scale down) and darkens
 *   content: drifts up slightly and dims
 * Nothing here runs on load, so the links are never blocked.
 */
export function HeroLayer({
  layer,
  className,
  children,
}: {
  layer: 'photo' | 'content'
  className?: string
  children: React.ReactNode
}) {
  const { scrollY } = useScroll()
  const vh = useRef(800)
  const progress = useMotionValue(0)

  useEffect(() => {
    const measure = () => { vh.current = window.innerHeight || 800 }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(
    () => scrollY.on('change', (y) => progress.set(Math.min(Math.max(y / vh.current, 0), 1))),
    [scrollY, progress],
  )

  const scale   = useTransform(progress, [0, 1], layer === 'photo' ? [1, 0.9] : [1, 0.97])
  const y       = useTransform(progress, [0, 1], layer === 'photo' ? ['0%', '-4%'] : ['0%', '-6%'])
  const shade   = useTransform(progress, [0, 1], [0, 0.75])
  const opacity = useTransform(progress, [0, 0.8], [1, 0.25])

  if (layer === 'photo') {
    return (
      <motion.div className={className} style={{ scale, y }}>
        {children}
        <motion.div aria-hidden className="absolute inset-0 bg-ink" style={{ opacity: shade }} />
      </motion.div>
    )
  }

  return (
    <motion.div className={className} style={{ scale, y, opacity }}>
      {children}
    </motion.div>
  )
}
