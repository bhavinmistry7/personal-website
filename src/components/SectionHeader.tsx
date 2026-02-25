import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  label?:      string
  heading:     string
  subheading?: string
  align?:      'left' | 'center'
  className?:  string
}

export function SectionHeader({
  label,
  heading,
  subheading,
  align     = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : '', className)}>
      {label && (
        <p className="section-label mb-4">{label}</p>
      )}
      <h2
        className="font-heading text-4xl md:text-5xl lg:text-6xl leading-[1.05] whitespace-pre-line"
        style={{ color: 'var(--text)' }}
      >
        {heading}
      </h2>
      {subheading && (
        <p
          className="mt-5 text-base md:text-lg max-w-2xl leading-relaxed"
          style={{ color: 'var(--text-muted)' }}
        >
          {subheading}
        </p>
      )}
    </div>
  )
}
