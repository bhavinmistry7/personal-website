'use client'

import { useState }  from 'react'
import { FadeIn }    from '@/components/FadeIn'
import { MediaCard } from '@/components/MediaCard'
import { media }     from '@/content/siteContent'
import type { MediaItem } from '@/content/siteContent'

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

  const allItems: MediaItem[] = activeFilter === 'All'
    ? media.items
    : media.items.filter((item) => item.category === activeFilter)

  const featured = activeFilter === 'All' ? allItems.filter((i) => i.featured)  : []
  const rest     = activeFilter === 'All' ? allItems.filter((i) => !i.featured) : allItems

  return (
    <>
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
                <FadeIn key={item.id} delay={i * 80}>
                  <MediaCard item={item} />
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
              <FadeIn key={item.id} delay={i * 50}>
                <MediaCard item={item} />
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
