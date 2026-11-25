import manifest from '@/content/photos.generated.json'

export type Photo = {
  src:         string
  width:       number
  height:      number
  blurDataURL: string
}

const photos = manifest as Record<string, Photo>

/** Look up an optimized photo by slug (filename in /public/photos without .jpg). */
export function photo(slug: string): Photo {
  const p = photos[slug]
  if (!p) throw new Error(`Unknown photo "${slug}". Run: node scripts/optimize-photos.mjs`)
  return p
}

export const isPortrait = (p: Photo) => p.height > p.width
