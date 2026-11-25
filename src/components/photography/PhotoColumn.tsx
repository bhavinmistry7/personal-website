'use client'

import { useMemo, useState } from 'react'
import type { Photo } from '@/lib/photos'
import { RevealImage } from './RevealImage'
import { Lightbox, type LightboxItem } from './Lightbox'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

export type ResolvedSet = { id: string; title: string; year: string; photos: (Photo & { slug: string })[] }

/**
 * Narrow centred column on paper with a lot of white space.
 * Portrait frames stay narrow; landscape frames get a little more width.
 */
export function PhotoColumn({ sets }: { sets: ResolvedSet[] }) {
  const [open, setOpen] = useState<number | null>(null)

  const flat: LightboxItem[] = useMemo(
    () => sets.flatMap((s) => s.photos.map((p) => ({ photo: p, caption: `${s.title}, ${s.year}` }))),
    [sets],
  )

  let k = -1
  return (
    <div className="px-4 pb-[24svh] md:px-6">
      {sets.map((set, si) => (
        <div key={set.id} className="pt-[22svh] first:pt-[14svh]">
          <div className="label mx-auto flex max-w-[26rem] justify-between border-t border-ink/15 pt-2 text-mute">
            <span>{LETTERS[si]}. {set.title}</span>
            <span>{set.year} · {set.photos.length} frames</span>
          </div>

          <div className="mt-[10svh] flex flex-col items-center gap-[14svh] md:gap-[18svh]">
            {set.photos.map((p, i) => {
              k += 1
              const idx = k
              const portrait = p.height > p.width
              return (
                <figure key={p.slug} className={portrait ? 'w-full max-w-[17rem] md:max-w-[21rem]' : 'w-full max-w-[26rem] md:max-w-[38rem]'}>
                  <RevealImage
                    photo={p}
                    alt={`${set.title}, frame ${i + 1}`}
                    sizes={portrait ? '(min-width: 768px) 336px, 272px' : '(min-width: 768px) 608px, 92vw'}
                    onOpen={() => setOpen(idx)}
                  />
                  <figcaption className="label mt-2 flex justify-between text-mute">
                    <span>{LETTERS[si]}.{String(i + 1).padStart(2, '0')}</span>
                    <span>{p.width > p.height ? 'Landscape' : 'Portrait'}</span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </div>
      ))}

      <Lightbox items={flat} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
    </div>
  )
}
