import {
  profile, chapters, photography, work, videos, favorites,
  visible, isPending, isDev, intro,
} from '@/content/site'
import { photo } from '@/lib/photos'
import { Hero } from '@/components/Hero'
import { CompactHeader } from '@/components/CompactHeader'
import { Chapter } from '@/components/Chapter'
import { PhotoOpener } from '@/components/photography/PhotoOpener'
import { PhotoColumn, type ResolvedSet } from '@/components/photography/PhotoColumn'
import { WorkIndex } from '@/components/WorkIndex'
import { VideoCard } from '@/components/VideoCard'
import { Favorites } from '@/components/Favorites'
import { BookMe } from '@/components/BookMe'

const resolve = (slugOrUrl: string) => (/^https?:\/\//.test(slugOrUrl) ? null : photo(slugOrUrl))

export default function HomePage() {
  // ── Resolve content on the server (only what's used reaches the client) ──
  const sets: ResolvedSet[] = photography.sets.map((s) => ({
    id: s.id, title: s.title, year: s.year,
    photos: s.photos.map((slug) => ({ slug, ...photo(slug) })),
  }))
  const frames = sets.reduce((n, s) => n + s.photos.length, 0)
  const years  = sets.map((s) => Number(s.year)).sort()
  const opener = photo(photography.opener)
  const openerSet = photography.sets.find((s) => s.photos.includes(photography.opener)) ?? photography.sets[0]

  const vids   = visible(videos)
  const picks  = visible(favorites.items).map((f) => ({ ...f, photo: resolve(f.image) }))
  const store  = isDev || favorites.storefront.href ? favorites.storefront : null

  // ── Chapters with nothing to show are dropped (and leave the index) ──────
  const has: Record<string, boolean> = {
    photography: sets.length > 0,
    work:        work.length > 0,
    videos:      vids.length > 0,
    favorites:   picks.length > 0 || !!store,
    book:        true,
  }
  const shown = chapters.filter((c) => has[c.id]).map((c, i) => ({ ...c, n: String(i + 1).padStart(2, '0') }))
  const n = (id: string) => shown.find((c) => c.id === id)?.n ?? ''

  return (
    <main>
      <Hero />
      <CompactHeader name={profile.name} chapters={shown} />

      {/* Opaque panel that slides up over the pinned hero */}
      <div id="story" className="relative z-10 shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.6)]">
        {has.photography && (
          <Chapter
            id="photography" n={n('photography')} label="Photography"
            intro={intro('photography')}
            specs={[`${sets.length} sets`, `${frames} frames`, years.length ? `${years[0]}–${years[years.length - 1]}` : '']}
          >
            <PhotoOpener photo={opener} caption={`${openerSet.title}, ${openerSet.year}`} />
            <PhotoColumn sets={sets} />
          </Chapter>
        )}

        {has.work && (
          <Chapter
            id="work" n={n('work')} label="Work"
            intro={intro('work')}
            specs={[`${work.length} projects`, 'Data · AI · Web', 'GitHub ↗']}
          >
            <WorkIndex projects={work} />
          </Chapter>
        )}

        {has.videos && (
          <Chapter
            id="videos" n={n('videos')} label="Videos"
            intro={intro('videos')}
            specs={[`${vids.length} videos`, 'Tap to play', 'Sound on']}
          >
            <ul className="mx-auto grid max-w-5xl grid-cols-1 gap-y-16 px-4 pb-[24svh] sm:grid-cols-2 sm:gap-x-6 md:px-6">
              {vids.map((v) => (
                <li key={v.id} className={v.platform === 'youtube' ? 'sm:col-span-2' : 'mx-auto w-full max-w-[20rem]'}>
                  <VideoCard video={v} poster={v.platform === 'youtube' ? null : photo(v.poster)} pending={isPending(v)} />
                </li>
              ))}
            </ul>
          </Chapter>
        )}

        {has.favorites && (
          <Chapter
            id="favorites" n={n('favorites')} label="Favorites"
            intro={intro('favorites')}
            specs={[picks.length ? `${picks.length} picks` : 'Storefront', 'via ShopMy', 'Affiliate links']}
          >
            <Favorites items={picks} storefront={store} disclosure={favorites.disclosure} />
          </Chapter>
        )}

        <BookMe n={n('book')} />
      </div>
    </main>
  )
}
