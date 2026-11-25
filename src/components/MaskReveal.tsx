'use client'

import { m, type Variants } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

const line: Variants = {
  hidden: { y: '105%' },
  shown:  (delay: number) => ({ y: '0%', transition: { duration: 1.1, ease: EASE, delay } }),
}

const tags = { h2: m.h2, h3: m.h3, div: m.div, p: m.p }

/**
 * Line-mask reveal: text rises from behind a clipped edge once it enters view.
 *
 * The in-view check sits on the clipping wrapper, not the moving text, because
 * the hidden text is fully clipped and would never register as intersecting.
 * Reduced motion → MotionConfig skips the transform and shows it in place.
 */
export function MaskReveal({
  as = 'div',
  children,
  className,
  delay = 0,
}: {
  as?: keyof typeof tags
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const Tag = tags[as]
  return (
    <Tag
      className={`overflow-hidden pb-[0.04em] ${className ?? ''}`}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
    >
      <m.span className="block" variants={line} custom={delay}>
        {children}
      </m.span>
    </Tag>
  )
}
