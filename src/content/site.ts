// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT: the only file you need to edit.
//
// Drafts: anything with an empty `href` (or `draft: true`) shows up in
// `npm run dev` with a TODO tag, and is hidden automatically in production.
// Photos: refer to them by slug (filename in /public/photos without .jpg).
// Run `node scripts/optimize-photos.mjs` after adding originals to /originals.
// ─────────────────────────────────────────────────────────────────────────────

export type LinkItem = {
  id:         string
  label:      string          // "Instagram"
  handle?:    string          // "@bhavinmistryy" (right-hand detail)
  href:       string          // '' = not set yet (hidden in production)
  featured?:  boolean         // rendered as the larger chrome row
  sponsored?: boolean         // affiliate → rel="sponsored", counted for disclosure
}

export type PhotoSet = {
  id:     string
  title:  string              // "San Francisco, CA"
  year:   string
  photos: string[]            // slugs from photos.generated.json
}

export type Project = {
  id:          string
  title:       string
  kind:        string         // "Data / AI"
  year:        string
  description: string
  stack:       string[]
  href:        string
}

export type Video =
  | { id: string; title: string; year: string; platform: 'youtube'; videoId: string; draft?: boolean }
  | { id: string; title: string; year: string; platform: 'tiktok' | 'instagram'; href: string; poster: string; draft?: boolean }

export type Favorite = {
  id:     string
  name:   string
  brand?: string
  price?: string
  image:  string              // photo slug or absolute URL
  href:   string
  draft?: boolean
}

// ── IDENTITY ─────────────────────────────────────────────────────────────────
export const profile = {
  name:        'Bhavin Mistry',
  title:       'Technology Consultant · Creative Director',
  location:    'NJ / NY',
  email:       'bhavinmistry198@gmail.com',
  url:         'https://bhavinmistry.club',
  description: 'Bhavin Mistry: technology consultant and creative director. Photography, projects, videos and favorites, all in one place.',
  heroPhoto:   'dsc01423',    // TODO(Bhavin): confirm hero image
}

// ── LINKS (first screen, in this order) ──────────────────────────────────────
export const links: LinkItem[] = [
  { id: 'instagram', label: 'Instagram', handle: '@bhavinmistryy',   href: 'https://www.instagram.com/bhavinmistryy/' },
  { id: 'tiktok',    label: 'TikTok',    handle: '',                 href: '' },  // TODO(Bhavin): URL + handle
  { id: 'linkedin',  label: 'LinkedIn',  handle: 'in/bhavinmistry-', href: 'https://www.linkedin.com/in/bhavinmistry-/' },
  { id: 'shopmy',    label: 'ShopMy',    handle: 'My storefront',    href: '', featured: true },  // TODO(Bhavin): URL; confirm which link is featured
  // TODO(Bhavin): affiliate links go here, e.g.
  // { id: 'brand', label: 'Brand: 15% off', handle: 'CODE BHAVIN', href: 'https://…', sponsored: true },
  { id: 'github',    label: 'GitHub',    handle: '@bhavinmistry7',   href: 'https://github.com/bhavinmistry7' },
]

// ── 01 PHOTOGRAPHY ───────────────────────────────────────────────────────────
// TODO(Bhavin): provisional selection. Pick sets + frames from the contact sheet.
export const photography = {
  opener: 'dsc01699',
  sets: [
    {
      id: 'nav-noto', title: 'NAV @ Noto, Philadelphia', year: '2026',
      photos: ['dsc01206', 'dsc01901', 'dsc02142-2', 'dsc01253', 'dsc02039', 'dsc01939'],
    },
    {
      id: 'san-francisco', title: 'San Francisco, CA', year: '2024',
      photos: ['dsc09381', 'dsc09339', 'dsc09748', 'dsc09369', 'dsc09503', 'dsc09180'],
    },
  ] satisfies PhotoSet[],
}

// ── 02 WORK ──────────────────────────────────────────────────────────────────
export const work: Project[] = [
  {
    id:          'footy',
    title:       'Footy',
    kind:        'Data / AI',
    year:        '2024',
    description: 'Ask football questions in plain English and get back real shot maps, pass maps and heat maps. Built on 1,200+ shot records from real match data.',
    stack:       ['Python', 'Data viz', 'LLM'],
    href:        'https://github.com/bhavinmistry7/Footy',
  },
  {
    id:          'site',
    title:       'This site',
    kind:        'Web',
    year:        '2026',
    description: 'Designed and built from scratch: Next.js, TypeScript, Tailwind and framer-motion, deployed on Vercel.',
    stack:       ['Next.js', 'TypeScript', 'Motion'],
    href:        'https://github.com/bhavinmistry7/personal-website',
  },
]

// ── 03 VIDEOS ────────────────────────────────────────────────────────────────
// TODO(Bhavin): real videos. YouTube → { platform: 'youtube', videoId }.
// TikTok / Reels → { platform: 'tiktok' | 'instagram', href, poster: '<photo slug>' }.
export const videos: Video[] = [
  { id: 'v-draft-1', title: 'Koad @ Rutgers: live stream', year: '2024', platform: 'tiktok', href: '', poster: 'dsc09878', draft: true },
  { id: 'v-draft-2', title: 'NAV @ Noto: recap',            year: '2026', platform: 'instagram', href: '', poster: 'dsc01901', draft: true },
]

// ── 04 FAVORITES / SHOP ──────────────────────────────────────────────────────
// TODO(Bhavin): individual items, or leave empty to show only the storefront link.
export const favorites = {
  storefront: links.find((l) => l.id === 'shopmy')!,
  disclosure: 'Some links are affiliate links. I may earn a small commission at no cost to you.',
  items: [
    { id: 'f-draft-1', name: 'Camera body',   brand: 'Brand', price: '$—', image: 'dsc02142-2', href: '', draft: true },
    { id: 'f-draft-2', name: 'Sunglasses',    brand: 'Brand', price: '$—', image: 'dsc09369',   href: '', draft: true },
    { id: 'f-draft-3', name: 'Everyday item', brand: 'Brand', price: '$—', image: 'dsc09748',   href: '', draft: true },
  ] satisfies Favorite[],
}

// ── 05 BOOK ME ───────────────────────────────────────────────────────────────
export const booking = {
  business: 'Bhavin Mistry Media',
  pitch:    'Photo, video and multi-camera live streams for events, artists and brands.',
  stats: [
    { value: '$10K+',  label: '2025 revenue' },
    { value: '5,000+', label: 'Live viewers' },
    { value: '10+',    label: 'Clients' },
    { value: '50+',    label: 'Deliverables' },
  ],
  cta:      'Book a shoot',
  subject:  'Booking inquiry: Bhavin Mistry Media',
}

// ── CHAPTER INDEX (header + anchors) ─────────────────────────────────────────
// Numbers are assigned automatically from the chapters that are actually shown.
// TODO(Bhavin): intros are draft copy. Rewrite in your voice.
export const chapters = [
  { id: 'photography', n: '01', label: 'Photography', intro: 'Concerts, cities and portraits, shot on assignment and for myself.' },
  { id: 'work',        n: '02', label: 'Work',        intro: "Things I've built across data, AI and the web." },
  { id: 'videos',      n: '03', label: 'Videos',      intro: 'Recaps, live streams and short films.' },
  { id: 'favorites',   n: '04', label: 'Favorites',   intro: 'Gear and things I actually use.' },
  { id: 'book',        n: '05', label: 'Book me',     intro: '' },
] as const

export const intro = (id: (typeof chapters)[number]['id']) => chapters.find((c) => c.id === id)!.intro

// ── HELPERS ──────────────────────────────────────────────────────────────────
export const isDev = process.env.NODE_ENV !== 'production'

/** Production hides anything unfinished; dev shows it with a TODO tag. */
export function visible<T extends { href?: string; draft?: boolean }>(items: T[]): T[] {
  return isDev ? items : items.filter((i) => !i.draft && (i.href === undefined || i.href !== ''))
}

export const isPending = (i: { href?: string; draft?: boolean }) => !!i.draft || i.href === ''
