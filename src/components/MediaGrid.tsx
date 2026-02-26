'use client'

import { useState, useMemo } from 'react'
import { FadeIn }            from '@/components/FadeIn'
import { MediaCard }         from '@/components/MediaCard'
import { MediaLightbox }     from '@/components/MediaLightbox'
import { media }             from '@/content/siteContent'
import type { MediaItem }    from '@/content/siteContent'

function FilterButton({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
        active ? 'border-gold text-gold' : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
      }`}
      style={active ? { borderColor: 'var(--gold)', color: 'var(--gold)' } : undefined}
    >
      {label}
    </button>
  )
}

export function MediaGrid() {
  const [activeFilter, setActiveFilter] = useState('All')

  // Lightbox state
  const [lightboxGroup, setLightboxGroup] = useState<MediaItem[] | null>(null)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Group all image items by title — used for prev/next navigation
  const groupsByTitle = useMemo(() => {
    const groups: Record<string, MediaItem[]> = {}
    media.items.forEach((item) => {
      if (!item.src) return
      if (!groups[item.title]) groups[item.title] = []
      groups[item.title].push(item)
    })
    return groups
  }, [])

  function openLightbox(item: MediaItem) {
    const group = groupsByTitle[item.title] ?? [item]
    const idx   = group.findIndex((i) => i.id === item.id)
    setLightboxGroup(group)
    setLightboxIndex(Math.max(0, idx))
  }

  const allItems: MediaItem[] = activeFilter === 'All'
    ? media.items
    : media.items.filter((item) => item.category === activeFilter)

  const featured = activeFilter === 'All' ? allItems.filter((i) => i.featured)  : []
  const rest     = activeFilter === 'All' ? allItems.filter((i) => !i.featured) : allItems

  return (
    <>
      {/* Lightbox overlay */}
      {lightboxGroup && (
        <MediaLightbox
          items={lightboxGroup}
          index={lightboxIndex}
          onClose={() => setLightboxGroup(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, i - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(lightboxGroup.length - 1, i + 1))}
        />
      )}

      {/* Filters */}
      <div className="container-site mb-10">
        <FadeIn>
          <div className="flex flex-wrap gap-2">
            {media.filterTags.map((tag) => (
              <FilterButton
                key={tag}
                label={tag}
                active={activeFilter === tag}
                onClick={() => setActiveFilter(tag)}
              />
            ))}
          </div>
        </FadeIn>
      </div>

      <div className="container-site space-y-10">
        {/* Featured */}
        {featured.length > 0 && (
          <>
            <FadeIn><p className="section-label">Featured</p></FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((item, i) => (
                <FadeIn key={item.id} delay={i * 40} duration={400}>
                  <MediaCard
                    item={item}
                    onClick={item.src ? () => openLightbox(item) : undefined}
                  />
                </FadeIn>
              ))}
            </div>
            {rest.length > 0 && (
              <FadeIn>
                <div className="border-t pt-8" style={{ borderColor: 'var(--border)' }}>
                  <p className="section-label">Archive</p>
                </div>
              </FadeIn>
            )}
          </>
        )}

        {/* Rest / filtered */}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {rest.map((item, i) => (
              <FadeIn key={item.id} delay={i * 25} duration={400}>
                <MediaCard
                  item={item}
                  onClick={item.src ? () => openLightbox(item) : undefined}
                />
              </FadeIn>
            ))}
          </div>
        )}

        {allItems.length === 0 && (
          <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
            <p className="text-sm">No items in this category yet.</p>
          </div>
        )}
      </div>
    </>
  )
}
