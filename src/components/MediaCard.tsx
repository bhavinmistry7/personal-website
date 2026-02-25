import Link from 'next/link'
import type { MediaItem } from '@/content/siteContent'

// Category → gradient color map
const categoryGradients: Record<string, string> = {
  Photography: 'from-stone-800 to-stone-950',
  Video:       'from-zinc-700 to-zinc-950',
  Events:      'from-neutral-700 to-neutral-950',
  Travel:      'from-stone-600 to-stone-900',
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
}

interface MediaCardProps {
  item: MediaItem
}

export function MediaCard({ item }: MediaCardProps) {
  const gradient = categoryGradients[item.category] ?? 'from-stone-800 to-stone-950'
  const icon     = categoryIcons[item.category]
  const Wrapper  = item.href ? Link : 'div'
  const props    = item.href ? { href: item.href } : {}

  return (
    // @ts-expect-error — dynamic tag
    <Wrapper
      {...props}
      className="group block rounded-2xl overflow-hidden cursor-pointer"
    >
      {/* Image placeholder — replace bg-gradient with next/image when you have real images */}
      <div
        className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} flex items-end justify-between p-5 transition-transform duration-500 group-hover:scale-[1.02]`}
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
            backgroundSize:  '30px 30px',
          }}
        />

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
  )
}
