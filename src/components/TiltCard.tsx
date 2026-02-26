'use client'

import { useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

interface TiltCardProps {
  children:       React.ReactNode
  className?:     string
  style?:         React.CSSProperties
  tiltIntensity?: number   // max tilt degrees (default 8)
}

export function TiltCard({
  children,
  className    = '',
  style,
  tiltIntensity = 8,
}: TiltCardProps) {
  const ref     = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const [tilt,      setTilt]      = useState({ rotX: 0, rotY: 0 })
  const [isHovered, setIsHovered] = useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx   = (e.clientX - rect.left)  / rect.width  - 0.5
    const cy   = (e.clientY - rect.top)   / rect.height - 0.5
    setTilt({ rotX: -cy * tiltIntensity * 2, rotY: cx * tiltIntensity * 2 })
  }

  function handleMouseEnter() { setIsHovered(true) }
  function handleMouseLeave() {
    setIsHovered(false)
    setTilt({ rotX: 0, rotY: 0 })
  }

  const transform = isHovered && !reduced
    ? `perspective(900px) rotateX(${tilt.rotX}deg) rotateY(${tilt.rotY}deg) scale3d(1.02, 1.02, 1.02)`
    : 'none'

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform,
        willChange:  reduced ? 'auto' : 'transform',
        transition:  'transform 0.15s ease',
        position:    'relative',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  )
}
