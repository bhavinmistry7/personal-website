import Link from 'next/link'
import type { Project } from '@/content/siteContent'

interface ProjectCardProps {
  project:  Project
  featured?: boolean
}

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const isExternal   = project.href?.startsWith('http')
  const Wrapper      = project.href ? (isExternal ? 'a' : Link) : 'div'
  const wrapperProps = project.href
    ? isExternal
      ? { href: project.href, target: '_blank', rel: 'noopener noreferrer' }
      : { href: project.href }
    : {}

  return (
    // @ts-expect-error — dynamic tag
    <Wrapper
      {...wrapperProps}
      className={`card group block p-6 md:p-8 ${project.href ? 'cursor-pointer' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <p className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          {project.category} · {project.year}
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
      <div className={`flex flex-wrap gap-1.5 ${project.href ? 'mb-4' : ''}`}>
        {project.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* CTA — active when href is set; greyed-out placeholder when href is '' */}
      {project.href !== undefined && (
        project.href ? (
          /* Active: real URL provided — opens externally */
          <div className="flex items-center gap-1.5 text-xs font-medium text-gold">
            <span>Visit Project</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        ) : (
          /* TODO: replace href: '' with the actual project URL in siteContent.ts */
          <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--text-muted)', opacity: 0.45, cursor: 'default' }}>
            <span>Visit Project</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        )
      )}
    </Wrapper>
  )
}
