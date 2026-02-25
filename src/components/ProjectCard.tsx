import Link from 'next/link'
import type { Project } from '@/content/siteContent'

interface ProjectCardProps {
  project:  Project
  featured?: boolean
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const Wrapper = project.href ? Link : 'div'
  const wrapperProps = project.href ? { href: project.href } : {}

  return (
    // @ts-expect-error — dynamic tag
    <Wrapper
      {...wrapperProps}
      className={`card group block p-6 md:p-8 ${project.href ? 'cursor-pointer' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          {project.client} · {project.year}
        </p>
        {project.href && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-gold opacity-0 group-hover:opacity-100"
          >
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        )}
      </div>

      {/* Title */}
      <h3
        className="font-heading text-xl md:text-2xl mb-3 transition-colors duration-200 group-hover:text-gold"
        style={{ color: 'var(--text)' }}
      >
        {project.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
        {project.description}
      </p>

      {/* Outcomes */}
      {featured && project.outcomes && project.outcomes.length > 0 && (
        <ul className="mb-5 space-y-1">
          {project.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="w-1 h-1 rounded-full bg-current text-gold shrink-0" style={{ backgroundColor: 'var(--gold)' }} />
              {outcome}
            </li>
          ))}
        </ul>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>
    </Wrapper>
  )
}
