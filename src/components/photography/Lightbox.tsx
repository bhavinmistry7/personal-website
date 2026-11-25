'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import type { Photo } from '@/lib/photos'

export type LightboxItem = { photo: Photo; caption: string }

/**
 * Native <dialog>: focus trapping, Esc-to-close and inert background for free.
 * Arrows / swipe to move between frames.
 */
export function Lightbox({
  items,
  index,
  onIndex,
  onClose,
}: {
  items:   LightboxItem[]
  index:   number | null
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const startX = useRef<number | null>(null)
  const open = index !== null

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => { document.documentElement.style.overflow = '' }
  }, [open])

  const go = (delta: number) => {
    if (index === null) return
    onIndex((index + delta + items.length) % items.length)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const item = index !== null ? items[index] : null

  return (
    <dialog
      ref={ref}
      onCancel={(e) => { e.preventDefault(); onClose() }}
      onPointerDown={(e) => { startX.current = e.clientX }}
      onPointerUp={(e) => {
        if (startX.current === null) return
        const dx = e.clientX - startX.current
        startX.current = null
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
      }}
      className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-ink/95 p-0 text-paper backdrop:bg-transparent"
      aria-label="Photo viewer"
    >
      {item && (
        <div className="relative h-full w-full">
          <div className="absolute inset-x-3 bottom-16 top-14 md:inset-x-16">
            <Image
              key={item.photo.src}
              src={item.photo.src}
              alt={item.caption}
              fill
              sizes="100vw"
              placeholder="blur"
              blurDataURL={item.photo.blurDataURL}
              className="object-contain"
            />
          </div>

          <div className="pt-safe absolute inset-x-0 top-0 flex items-center justify-between px-4 md:px-6">
            <p className="label text-white/60">
              {String(index! + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>
            <button type="button" onClick={onClose} className="label h-11 px-1" autoFocus>
              Close ✕
            </button>
          </div>

          <div className="pb-safe absolute inset-x-0 bottom-0 flex items-center justify-between px-4 md:px-6">
            <button type="button" onClick={() => go(-1)} className="label h-11 px-1">← Prev</button>
            <p className="label truncate px-3 text-white/60">{item.caption}</p>
            <button type="button" onClick={() => go(1)} className="label h-11 px-1">Next →</button>
          </div>
        </div>
      )}
    </dialog>
  )
}
