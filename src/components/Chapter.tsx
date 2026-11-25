import { MaskReveal } from './MaskReveal'

type Tone = 'light' | 'dark'

/**
 * A story chapter: opaque panel + giant masked title + corner spec labels.
 *
 * Corner specs: an absolute layer spanning exactly this section, holding a
 * sticky viewport-sized frame (pure CSS, so it can't overhang the next chapter).
 * It renders last with no z-index so mix-blend-difference blends against the
 * chapter's paper and photos, keeping labels legible on both.
 */
export function Chapter({
  id,
  n,
  label,
  title = label,
  intro,
  specs,
  tone = 'light',
  className,
  children,
}: {
  id:         string
  n:          string
  label:      string
  title?:     string
  intro?:     string
  specs:      [string, string, string]   // top-right, bottom-left, bottom-right
  tone?:      Tone
  className?: string
  children:   React.ReactNode
}) {
  const dark = tone === 'dark'

  return (
    <section
      id={id}
      data-tone={tone}
      aria-labelledby={`${id}-title`}
      className={`relative ${dark ? 'bg-ink text-paper' : 'bg-paper text-ink'} ${className ?? ''}`}
    >
      <header className="px-4 pb-[8svh] pt-[24svh] md:px-6 md:pt-[28svh]">
        <MaskReveal
          as="h2"
          className="text-[clamp(2.75rem,12vw,13rem)] font-medium uppercase leading-[0.9] tracking-[-0.045em]"
        >
          <span id={`${id}-title`}>{title}</span>
        </MaskReveal>
        {intro && (
          <MaskReveal as="p" delay={0.12} className={`mt-6 max-w-[34ch] text-[15px] leading-snug md:text-[17px] ${dark ? 'text-white/65' : 'text-ink/65'}`}>
            {intro}
          </MaskReveal>
        )}
      </header>

      {children}

      {/* ── Corner spec labels (last, so they paint over content) ─────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-svh text-white mix-blend-difference">
          <span className="label absolute left-4 top-14 md:left-6">{n} {label}</span>
          <span className="label absolute right-4 top-14 md:right-6">{specs[0]}</span>
          <span className="label absolute bottom-4 left-4 md:left-6">{specs[1]}</span>
          <span className="label absolute bottom-4 right-4 md:right-6">{specs[2]}</span>
        </div>
      </div>
    </section>
  )
}
