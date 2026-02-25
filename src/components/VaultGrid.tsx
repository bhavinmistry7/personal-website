'use client'

import { useState }  from 'react'
import { FadeIn }    from '@/components/FadeIn'
import { VaultCard } from '@/components/VaultCard'
import { vault }     from '@/content/siteContent'

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

export function VaultGrid() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? vault.items
    : vault.items.filter((item) => item.category === activeFilter)

  return (
    <>
      {/* Filters */}
      <div className="container-site mb-10">
        <FadeIn>
          <div className="flex flex-wrap gap-2">
            {vault.filterTags.map((tag) => (
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

      {/* Grid */}
      <div className="container-site">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item, i) => (
            <FadeIn key={item.id} delay={i * 50}>
              <VaultCard item={item} />
            </FadeIn>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
            <p className="text-sm">Nothing in this category yet. Check back soon.</p>
          </div>
        )}
      </div>
    </>
  )
}
