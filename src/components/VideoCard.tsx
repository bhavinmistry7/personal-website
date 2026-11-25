'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Video } from '@/content/site'
import type { Photo } from '@/lib/photos'
import { ArrowUpRight, Play } from './Icons'

/**
 * Facade: show a poster only. YouTube swaps in the player on tap
 * (youtube-nocookie, no third-party JS until then). TikTok / Reels open the post.
 */
export function VideoCard({ video, poster, pending }: { video: Video; poster: Photo | null; pending: boolean }) {
  const [playing, setPlaying] = useState(false)
  const vertical = video.platform !== 'youtube'
  const aspect = vertical ? 'aspect-[9/16]' : 'aspect-video'

  const posterImg =
    video.platform === 'youtube' ? (
      <Image
        src={`https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    ) : poster ? (
      <Image src={poster.src} alt="" fill sizes="(min-width: 768px) 30vw, 80vw" placeholder="blur" blurDataURL={poster.blurDataURL} className="object-cover" />
    ) : null

  const overlay = (
    <>
      {posterImg}
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink transition-transform duration-500 ease-out group-hover:scale-110">
        <Play className="translate-x-px" />
      </span>
      <span className="label absolute bottom-3 left-3 right-3 flex justify-between text-white">
        <span>{video.platform === 'youtube' ? 'YouTube' : video.platform === 'tiktok' ? 'TikTok' : 'Reels'}</span>
        {vertical && <ArrowUpRight />}
      </span>
    </>
  )

  return (
    <figure>
      <div className={`group relative ${aspect} overflow-hidden bg-ink`}>
        {video.platform === 'youtube' ? (
          playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.videoId}?autoplay=1&playsinline=1&rel=0`}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${video.title}`} className="absolute inset-0">
              {overlay}
            </button>
          )
        ) : (
          <a href={video.href || undefined} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${video.title}`} className="absolute inset-0">
            {overlay}
          </a>
        )}
      </div>
      <figcaption className="label mt-2 flex items-center justify-between gap-3 text-mute">
        <span className="flex items-center gap-2 truncate">{video.title} {pending && <span className="todo-tag">todo</span>}</span>
        <span>{video.year}</span>
      </figcaption>
    </figure>
  )
}
