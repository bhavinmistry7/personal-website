import { MaskReveal } from './MaskReveal'

type Tone = 'light' | 'dark'

/**
 * A story chapter: opaque panel + giant masked title + corner spec labels.
 *
 * Corner specs: an absolute layer spanning exactly this section, holding a
 * sticky viewport-sized frame (pure CSS, so it can't overhang the next chapter).
 * It renders last so labels paint over photos; each label sits on a chip the
 * colour of the section, so contrast holds over paper and photos alike.
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

      {/* ── Corner spec labels (last, so they paint over content) ───────────
          Explicit colours per tone on a backing chip the same colour as the
          section: invisible on bare paper/ink, a subtle backing over photos.
          Measured ≥ 4.5:1 over every photo that scrolls beneath them. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="sticky top-0 h-svh">
          {[
            [`${n} ${label}`, 'left-3 top-[3.25rem] md:left-5'],
            [specs[0],        'right-3 top-[3.25rem] md:right-5'],
            [specs[1],        'bottom-3 left-3 md:left-5'],
            [specs[2],        'bottom-3 right-3 md:right-5'],
          ].map(([text, pos]) => (
            <span
              key={pos}
              className={`label absolute rounded-[2px] px-1 py-0.5 ${pos} ${dark ? 'bg-ink/80 text-paper' : 'bg-paper/85 text-ink'}`}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
