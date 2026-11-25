'use client'

import { LazyMotion, MotionConfig } from 'framer-motion'

const loadFeatures = () => import('./motion-features').then((mod) => mod.default)

/**
 * - LazyMotion: only the small `m` core ships up front; animation features
 *   load in a separate chunk after paint (keeps the LCP path light).
 *   `strict` makes any accidental full `motion.*` import an error.
 * - reducedMotion="user": honours the OS "reduce motion" setting.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  )
}
