import { booking, profile, links, visible } from '@/content/site'
import { MaskReveal } from './MaskReveal'
import { ArrowUpRight } from './Icons'

/** Dark outro: business, stats, mailto CTA, footer line. */
export function BookMe({ n }: { n: string }) {
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(booking.subject)}`
  const year = new Date().getFullYear()

  return (
    <section id="book" data-tone="dark" aria-labelledby="book-title" className="relative bg-ink text-paper">
      <div className="px-4 pb-8 pt-[22svh] md:px-6 md:pt-[26svh]">
        <div className="label flex justify-between border-t border-white/20 pt-2 text-white/50">
          <span>{n}</span>
          <span>{booking.business}</span>
        </div>

        <MaskReveal as="h2" className="mt-3 text-[clamp(2.75rem,12vw,13rem)] font-medium uppercase leading-[0.9] tracking-[-0.045em]">
          <span id="book-title">Book me</span>
        </MaskReveal>
        <MaskReveal as="p" delay={0.12} className="mt-6 max-w-[34ch] text-[15px] leading-snug text-white/65 md:text-[17px]">
          {booking.pitch}
        </MaskReveal>

        {/* Spec-sheet stats */}
        <dl className="mt-[12svh] grid grid-cols-2 border-t border-white/20 md:grid-cols-4">
          {booking.stats.map((s, i) => (
            <div key={s.label} className={`border-b border-white/20 py-6 md:border-b-0 md:py-8 ${i % 2 === 0 ? 'pr-3' : 'border-l border-white/20 pl-3'} ${i > 0 ? 'md:border-l md:pl-6' : ''}`}>
              <dt className="label text-white/45">{s.label}</dt>
              <dd className="mt-2 text-[clamp(2rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.04em]">{s.value}</dd>
            </div>
          ))}
        </dl>

        {/* CTA */}
        <div className="mt-[10svh] flex flex-col items-center gap-4">
          <a
            href={mailto}
            data-link-id="book"
            data-placement="outro"
            className="chrome-fill group flex h-14 w-full max-w-[26rem] items-center justify-between rounded-[3px] px-5 text-ink transition-transform duration-300 ease-out active:scale-[0.985]"
          >
            <span className="text-[13px] font-medium uppercase tracking-[0.06em]">{booking.cta}</span>
            <ArrowUpRight className="h-3 w-3 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a href={`mailto:${profile.email}`} className="label text-white/50 transition-colors hover:text-white">
            {profile.email}
          </a>
        </div>

        {/* Footer */}
        <footer className="pb-safe mt-[18svh] grid gap-4 border-t border-white/20 pt-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <p className="label text-white/45">© {year} {profile.name}</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {visible(links).filter((l) => l.href).map((l) => (
              <li key={l.id}>
                <a href={l.href} data-link-id={l.id} data-placement="footer" target="_blank" rel={l.sponsored ? 'sponsored noopener noreferrer' : 'noopener noreferrer'} className="label text-white/60 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a href="#top" className="label text-white/60 transition-colors hover:text-white md:justify-self-end">Back to links ↑</a>
        </footer>
      </div>
    </section>
  )
}
