import {
  chapters, photography, work, videos, favorites,
  visible, isPending, isDev, intro,
} from '@/content/site'
import { photo } from '@/lib/photos'
import { Hero } from '@/components/Hero'
import { StoryLoader } from '@/components/story/StoryLoader'
import { StoryFallback } from '@/components/story/StoryFallback'
import type { StoryData } from '@/components/story/types'

const resolve = (slugOrUrl: string) => (/^https?:\/\//.test(slugOrUrl) ? null : photo(slugOrUrl))

/** Resolve all story content on the server into plain data (only what's used reaches the client). */
function storyData(): StoryData {
  const sets = photography.sets.map((s) => ({
    id: s.id, title: s.title, year: s.year,
    photos: s.photos.map((slug) => ({ slug, ...photo(slug) })),
  }))
  const frames    = sets.reduce((n, s) => n + s.photos.length, 0)
  const years     = sets.map((s) => Number(s.year)).sort()
  const openerSet = photography.sets.find((s) => s.photos.includes(photography.opener)) ?? photography.sets[0]

  const vids  = visible(videos).map((v) => ({ video: v, poster: v.platform === 'youtube' ? null : photo(v.poster), pending: isPending(v) }))
  const picks = visible(favorites.items).map((f) => ({ ...f, photo: resolve(f.image) }))
  const store = isDev || favorites.storefront.href ? favorites.storefront : null

  // Chapters with nothing to show are dropped (and leave the index)
  const has: Record<string, boolean> = {
    photography: sets.length > 0,
    work:        work.length > 0,
    videos:      vids.length > 0,
    favorites:   picks.length > 0 || !!store,
    book:        true,
  }

  return {
    chapters: chapters
      .filter((c) => has[c.id])
      .map((c, i) => ({ id: c.id, label: c.label, intro: intro(c.id), n: String(i + 1).padStart(2, '0') })),
    photography: sets.length
      ? {
          sets,
          opener:  photo(photography.opener),
          caption: `${openerSet.title}, ${openerSet.year}`,
          specs:   [`${sets.length} sets`, `${frames} frames`, `${years[0]}–${years[years.length - 1]}`],
        }
      : null,
    work,
    videos:    vids,
    favorites: has.favorites ? { items: picks, storefront: store, disclosure: favorites.disclosure } : null,
  }
}

export default function HomePage() {
  const data = storyData()

  return (
    <main>
      <Hero />

      {/* Opaque panel that slides up over the pinned hero. Static story is
          server-rendered; the animated one replaces it after first paint. */}
      <div id="story" className="relative z-10 shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.6)]">
        <StoryLoader data={data}>
          <StoryFallback data={data} />
        </StoryLoader>
      </div>
    </main>
  )
}
