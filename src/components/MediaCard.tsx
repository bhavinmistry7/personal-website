import Link from 'next/link'
import type { MediaItem } from '@/content/siteContent'
import { getYouTubeThumbnailUrl } from '@/lib/thumbnails'
import { TiltCard } from '@/components/TiltCard'

// Category → gradient color map (shown when no src is provided)
const categoryGradients: Record<string, string> = {
  Photography: 'from-stone-800 to-stone-950',
  Video:       'from-zinc-700 to-zinc-950',
  Events:      'from-neutral-700 to-neutral-950',
  Travel:      'from-stone-600 to-stone-900',
  Concerts:    'from-violet-900 to-violet-950',
  Graduation:  'from-amber-900 to-amber-950',
  Personal:    'from-slate-700 to-slate-950',
}

// Category → icon
const categoryIcons: Record<string, React.ReactNode> = {
  Photography: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  Video: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  Events: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Travel: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),
  Concerts: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13"/>
      <circle cx="6" cy="18" r="3"/>
      <circle cx="18" cy="16" r="3"/>
    </svg>
  ),
  Graduation: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 7 12 12 2 7 12 2"/>
      <polyline points="7 9.5 7 14 12 16.5 17 14 17 9.5"/>
      <line x1="22" y1="7" x2="22" y2="12"/>
    </svg>
  ),
  Personal: (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
}

interface MediaCardProps {
  item:     MediaItem
  onClick?: () => void   // when provided, opens the lightbox instead of navigating
}

export function MediaCard({ item, onClick }: MediaCardProps) {
  const gradient   = categoryGradients[item.category] ?? 'from-stone-800 to-stone-950'
  const icon       = categoryIcons[item.category]

  // Resolve display image: YouTube thumbnail, direct image, or null (gradient placeholder)
  const isYouTube  = !!item.src && (item.src.includes('youtube.com') || item.src.includes('youtu.be'))
  const imgSrc     = isYouTube ? getYouTubeThumbnailUrl(item.src!) : (item.src ?? null)

  // If onClick provided (lightbox), render as button.
  // Otherwise: <a> for external hrefs, Next.js Link for internal, div if no href.
  const isExternal   = item.href?.startsWith('http')
  const Wrapper      = onClick
    ? 'button'
    : item.href ? (isExternal ? 'a' : Link) : 'div'
  const wrapperProps = onClick
    ? { onClick, type: 'button' as const }
    : item.href
      ? isExternal
        ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
        : { href: item.href }
      : {}

  return (
    <TiltCard className="rounded-2xl w-full">
    {/* @ts-expect-error — dynamic tag */}
    <Wrapper
      {...wrapperProps}
      className="group block rounded-2xl overflow-hidden cursor-pointer w-full text-left"
    >
      {/* Image / video thumbnail area */}
      <div
        className={`relative aspect-[4/3] flex items-end justify-between p-5 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] ${
          imgSrc ? 'bg-black' : `bg-gradient-to-br ${gradient}`
        }`}
      >
        {imgSrc ? (
          <>
            <img
              src={imgSrc}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Darken bottom so text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Play button overlay for YouTube */}
            {isYouTube && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                </div>
              </div>
            )}
            {/* Expand hint for lightbox images */}
            {onClick && !isYouTube && (
              <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
                  <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              </div>
            )}
          </>
        ) : (
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
              backgroundSize:  '30px 30px',
            }}
          />
        )}

        {/* Category badge */}
        <span className="tag-gold relative z-10 text-xs">
          {item.category}
        </span>

        {/* Icon */}
        <span className="relative z-10 opacity-40 text-white">
          {icon}
        </span>
      </div>

      {/* Info */}
      <div className="glass-panel px-4 py-3 border-t-0 rounded-b-2xl transition-all duration-200 group-hover:border-[rgba(255,230,0,0.35)]">
        <p
          className="text-sm font-medium transition-colors duration-200 group-hover:text-gold"
          style={{ color: 'var(--text)' }}
        >
          {item.title}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {item.year}
        </p>
      </div>
    </Wrapper>
    </TiltCard>
  )
}
