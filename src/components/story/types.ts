import type { Favorite, LinkItem, Project, Video } from '@/content/site'
import type { Photo } from '@/lib/photos'

/** Everything the story needs, resolved on the server (plain, serialisable data). */
export type StoryData = {
  chapters: { id: string; n: string; label: string; intro: string }[]
  photography: {
    sets:    { id: string; title: string; year: string; photos: (Photo & { slug: string })[] }[]
    opener:  Photo
    caption: string
    specs:   [string, string, string]
  } | null
  work:      Project[]
  videos:    { video: Video; poster: Photo | null; pending: boolean }[]
  favorites: {
    items:      (Favorite & { photo: Photo | null })[]
    storefront: LinkItem | null
    disclosure: string
  } | null
}
