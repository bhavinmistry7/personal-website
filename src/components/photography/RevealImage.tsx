'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { Photo } from '@/lib/photos'

/** A photo that rises and unmasks from the bottom edge as it scrolls into view. */
export function RevealImage({
  photo,
  alt,
  sizes,
  onOpen,
}: {
  photo:  Photo
  alt:    string
  sizes:  string
  onOpen: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'start 50%'] })

  const clipPath = useTransform(p, [0, 1], ['inset(16% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'])
  const y        = useTransform(p, [0, 1], [56, 0])
  const scale    = useTransform(p, [0, 1], [1.12, 1])

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-label={`Open ${alt}`}
      className="relative block w-full cursor-zoom-in overflow-hidden bg-ink/5"
      style={{ aspectRatio: `${photo.width} / ${photo.height}`, ...(reduced ? {} : { clipPath, y }) }}
    >
      <motion.div className="absolute inset-0" style={reduced ? undefined : { scale }}>
        <Image
          src={photo.src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          blurDataURL={photo.blurDataURL}
          className="object-cover"
        />
      </motion.div>
    </motion.button>
  )
}
