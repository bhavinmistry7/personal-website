'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { Photo } from '@/lib/photos'

/**
 * Pinned opener: the frame starts as a window in the paper and opens to
 * full-bleed as you scroll, while the photo settles from 1.3× to 1×.
 */
export function PhotoOpener({ photo, caption }: { photo: Photo; caption: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const clipPath = useTransform(p, [0, 0.7], ['inset(24% 22% 24% 22%)', 'inset(0% 0% 0% 0%)'])
  const scale    = useTransform(p, [0, 0.7], [1.3, 1])
  const capShow  = useTransform(p, [0.55, 0.75], [0, 1])

  const img = (
    <Image
      src={photo.src}
      alt={caption}
      fill
      sizes="100vw"
      className="object-cover"
    />
  )

  if (reduced) {
    return <div className="relative h-svh" style={{ backgroundColor: photo.color }}>{img}</div>
  }

  return (
    <div ref={ref} className="relative h-[220svh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <m.div className="absolute inset-0 will-change-[clip-path]" style={{ clipPath, backgroundColor: photo.color }}>
          <m.div className="absolute inset-0" style={{ scale }}>{img}</m.div>
        </m.div>
        <m.p
          className="label absolute bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-white"
          style={{ opacity: capShow }}
        >
          {caption}
        </m.p>
      </div>
    </div>
  )
}
