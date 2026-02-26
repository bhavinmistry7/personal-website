'use client'

import { useState }    from 'react'
import { FadeIn }      from '@/components/FadeIn'
import { ProjectCard } from '@/components/ProjectCard'
import { work }        from '@/content/siteContent'

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

export function WorkGrid() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? work.projects
    : work.projects.filter((p) => p.category === activeFilter)

  return (
    <>
      {/* Filters */}
      <div className="container-site mb-10">
        <FadeIn>
          <div className="flex flex-wrap gap-2">
            {work.filterTags.map((tag) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((project, i) => (
            <FadeIn key={project.id} delay={i * 60}>
              <ProjectCard project={project} featured />
            </FadeIn>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center" style={{ color: 'var(--text-muted)' }}>
            <p className="text-sm">No projects match this filter.</p>
          </div>
        )}
      </div>
    </>
  )
}
