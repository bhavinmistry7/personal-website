'use client'

import { useEffect } from 'react'
import { profile } from '@/content/site'
import { MotionProvider } from '../MotionProvider'
import { CompactHeader } from '../CompactHeader'
import { Chapter } from '../Chapter'
import { PhotoOpener } from '../photography/PhotoOpener'
import { PhotoColumn } from '../photography/PhotoColumn'
import { WorkIndex } from '../WorkIndex'
import { VideoCard } from '../VideoCard'
import { Favorites } from '../Favorites'
import { BookMe } from '../BookMe'
import { HeroMotion } from './HeroMotion'
import type { StoryData } from './types'

/**
 * The animated story. Loaded by <StoryLoader> after hydration, so
 * framer-motion and everything below the fold stays out of the first-load
 * bundle. Replaces the server-rendered <StoryFallback>.
 */
export default function Story({ data }: { data: StoryData }) {
  const n = (id: string) => data.chapters.find((c) => c.id === id)?.n ?? ''
  const intro = (id: string) => data.chapters.find((c) => c.id === id)?.intro || undefined

  // The fallback had different heights: if the page was opened at a #chapter
  // (or a redirected old URL), land on it again now the real chapter exists.
  useEffect(() => {
    document.documentElement.dataset.storyReady = 'true'
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (id && id !== 'top') document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
  }, [])

  return (
    <MotionProvider>
      <HeroMotion />
      <CompactHeader name={profile.name} chapters={data.chapters} />

      {data.photography && (
        <Chapter id="photography" n={n('photography')} label="Photography" intro={intro('photography')} specs={data.photography.specs}>
          <PhotoOpener photo={data.photography.opener} caption={data.photography.caption} />
          <PhotoColumn sets={data.photography.sets} />
        </Chapter>
      )}

      {data.work.length > 0 && (
        <Chapter id="work" n={n('work')} label="Work" intro={intro('work')} specs={[`${data.work.length} projects`, 'Data · AI · Web', 'GitHub ↗']}>
          <WorkIndex projects={data.work} />
        </Chapter>
      )}

      {data.videos.length > 0 && (
        <Chapter id="videos" n={n('videos')} label="Videos" intro={intro('videos')} specs={[`${data.videos.length} videos`, 'Tap to play', 'Sound on']}>
          <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-y-16 px-4 pb-[24svh] sm:grid-cols-2 sm:gap-x-6 md:px-6">
            {data.videos.map(({ video, poster, pending }) => (
              <li key={video.id} className={video.platform === 'youtube' ? 'sm:col-span-2' : 'mx-auto w-full max-w-[20rem]'}>
                <VideoCard video={video} poster={poster} pending={pending} />
              </li>
            ))}
          </ul>
        </Chapter>
      )}

      {data.favorites && (
        <Chapter
          id="favorites" n={n('favorites')} label="Favorites" intro={intro('favorites')}
          specs={[data.favorites.items.length ? `${data.favorites.items.length} picks` : 'Storefront', 'via ShopMy', 'Affiliate links']}
        >
          <Favorites items={data.favorites.items} storefront={data.favorites.storefront} disclosure={data.favorites.disclosure} />
        </Chapter>
      )}

      <BookMe n={n('book')} />
    </MotionProvider>
  )
}
