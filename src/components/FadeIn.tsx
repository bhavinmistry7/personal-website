'use client'

import { useInView } from '@/lib/hooks'
import { cn }        from '@/lib/utils'

interface FadeInProps {
  children:    React.ReactNode
  className?:  string
  delay?:      number   // ms
  direction?:  'up' | 'down' | 'left' | 'right' | 'none'
  distance?:   number   // px
  duration?:   number   // ms
}

const directionMap = {
  up:    (d: number) => `translateY(${d}px)`,
  down:  (d: number) => `translateY(-${d}px)`,
  left:  (d: number) => `translateX(${d}px)`,
  right: (d: number) => `translateX(-${d}px)`,
  none:  ()         => 'none',
}

export function FadeIn({
  children,
  className,
  delay     = 0,
  direction = 'up',
  distance  = 20,
  duration  = 600,
}: FadeInProps) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{
        opacity:    inView ? 1 : 0,
        transform:  inView ? 'none' : directionMap[direction](distance),
        transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
