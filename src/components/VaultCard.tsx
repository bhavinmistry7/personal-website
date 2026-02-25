'use client'

import { useState, useEffect } from 'react'
import type { VaultItem } from '@/content/siteContent'
import { getYouTubeThumbnailUrl } from '@/lib/thumbnails'

// Category icons
const icons: Record<string, React.ReactNode> = {
  Tools: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),
  Reading: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  ),
  Notes: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Templates: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  Courses: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
}

interface VaultCardProps {
  item: VaultItem
}

export function VaultCard({ item }: VaultCardProps) {
  // Priority: manual thumbnail > YouTube auto-extract > OG image fetch > none
  const [thumbnail, setThumbnail] = useState<string | null>(() => {
    if (item.thumbnail) return item.thumbnail
    return getYouTubeThumbnailUrl(item.href)
  })
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    // Skip if already resolved, href is a placeholder, or it's a YouTube link
    if (thumbnail || !item.href || item.href === '#') return
    fetch(`/api/og?url=${encodeURIComponent(item.href)}`)
      .then((r) => r.json())
      .then((d: { image: string | null }) => { if (d.image) setThumbnail(d.image) })
      .catch(() => {})
  }, [item.href, thumbnail])

  const showThumbnail = !!thumbnail && !imgError
  const isExternal = item.href && item.href !== '#'

  return (
    <a
      href={isExternal ? item.href : undefined}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="card group flex flex-col"
      style={{ cursor: isExternal ? 'pointer' : 'default' }}
    >
      {/* Thumbnail — bleeds to card edges */}
      {showThumbnail && (
        <div className="-mx-0 overflow-hidden rounded-t-xl mb-0">
          <img
            src={thumbnail!}
            alt=""
            className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        {/* Top row: icon + free badge */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            {icons[item.category]}
          </div>
          <span className={item.free ? 'tag-gold' : 'tag'}>
            {item.free ? 'Free' : 'Premium'}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-heading text-lg mb-2 transition-colors duration-200 group-hover:text-gold leading-snug"
          style={{ color: 'var(--text)' }}
        >
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--text-muted)' }}>
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1.5 text-xs font-medium text-gold transition-gap duration-200">
          <span>Access resource</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </a>
  )
}
