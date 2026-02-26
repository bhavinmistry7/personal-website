'use client'

import { useEffect } from 'react'
import type { MediaItem } from '@/content/siteContent'

interface MediaLightboxProps {
  items:   MediaItem[]   // all items in the same title group
  index:   number        // current position
  onClose: () => void
  onPrev:  () => void
  onNext:  () => void
}

// Shared class for all three control buttons
const btnClass =
  'flex items-center justify-center rounded-full transition-colors ' +
  'bg-black/10 hover:bg-black/20 text-black ' +
  'dark:bg-white/10 dark:hover:bg-white/20 dark:text-white'

export function MediaLightbox({ items, index, onClose, onPrev, onNext }: MediaLightboxProps) {
  const item    = items[index]
  const showNav = items.length > 1
  const hasPrev = index > 0
  const hasNext = index < items.length - 1

  // Lock body scroll while lightbox is open
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92"
      style={{ backdropFilter: 'blur(4px)' }}
    >
      {/* Close button — below the nav bar (nav is h-16 = 64px, top-20 = 80px clears it) */}
      <button
        onClick={onClose}
        className={`absolute top-20 right-5 z-10 w-10 h-10 ${btnClass}`}
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      {/* Prev arrow */}
      {showNav && (
        <button
          onClick={hasPrev ? onPrev : undefined}
          disabled={!hasPrev}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 ${btnClass}`}
          style={{ opacity: hasPrev ? 1 : 0.25, cursor: hasPrev ? 'pointer' : 'not-allowed' }}
          aria-label="Previous photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      )}

      {/* Next arrow */}
      {showNav && (
        <button
          onClick={hasNext ? onNext : undefined}
          disabled={!hasNext}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 ${btnClass}`}
          style={{ opacity: hasNext ? 1 : 0.25, cursor: hasNext ? 'pointer' : 'not-allowed' }}
          aria-label="Next photo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      )}

      {/* Image + title */}
      <div className="flex flex-col items-center gap-4 px-16 max-w-[95vw]">
        <img
          key={item.id}
          src={item.src!}
          alt={item.title}
          className="max-h-[82vh] max-w-full object-contain rounded-lg shadow-2xl"
          style={{ userSelect: 'none' }}
        />

        {/* Title + counter */}
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-black dark:text-white">{item.title}</p>
          {showNav && (
            <p className="text-xs text-black/40 dark:text-white/40">
              {index + 1} / {items.length}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
