import Image from 'next/image'
import { profile, chapters } from '@/content/site'
import { photo } from '@/lib/photos'
import { LinkList } from './LinkList'
import { ArrowDown } from './Icons'

/**
 * First screen = links. Pure server component: no client JS at all, so the
 * links work before (and without) JavaScript. Pinned (sticky) so the light
 * story panel slides up over it.
 *
 * The scroll-linked depth effect is attached later by <HeroMotion> inside the
 * lazily loaded Story, via the hero-photo / hero-shade / hero-content ids.
 *
 * Phone: photo is full-bleed; name on top, links anchored to the bottom.
 * Desktop: the photo sits centred like a lit gallery piece on a near-black field.
 */
export function Hero() {
  const hero = photo(profile.heroPhoto)

  return (
    <section
      id="top"
      aria-label="Links"
      className="sticky top-0 h-svh overflow-hidden bg-ink text-paper"
      style={{ background: 'radial-gradient(ellipse 55% 65% at 50% 42%, #262626 0%, #121212 45%, #0A0A0A 75%)' }}
    >
      {/* ── Photo ────────────────────────────────────────────────────────── */}
      <div id="hero-photo" className="absolute inset-0 will-change-transform">
        <div
          // Phone: full-bleed (inset-0). Desktop: centred piece sized by the photo's own ratio.
          className="absolute inset-0 md:inset-auto md:bottom-[6svh] md:left-1/2 md:top-[6svh] md:-translate-x-1/2 md:[aspect-ratio:var(--ar)]"
          style={{ '--ar': `${hero.width} / ${hero.height}`, backgroundColor: hero.color } as React.CSSProperties}
        >
          <Image
            src={hero.src}
            alt=""
            fill
            priority                  // preload <link> in <head>
            fetchPriority="high"      // Next 15 doesn't add this on its own; without it Chrome loads the LCP image at Low
            loading="eager"
            quality={60}
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
          {/* Legibility for the name row (measured ≥ 4.5:1 over the brightest skin tones) */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-[34%] bg-gradient-to-b from-ink/95 via-ink/75 via-40% to-transparent" />
        </div>
        <div id="hero-shade" aria-hidden className="absolute inset-0 bg-ink opacity-0" />
      </div>

      {/* ── Foreground ───────────────────────────────────────────────────── */}
      <div id="hero-content" className="relative z-10 flex h-full flex-col px-4 pt-safe pb-safe md:px-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
          <p className="label whitespace-nowrap text-white/75">{profile.location}</p>
          <h1 className="text-center text-name font-medium uppercase">{profile.name}</h1>
          <a href={`#${chapters[0].id}`} className="label justify-self-end text-white/75 transition-colors hover:text-white">
            Index
          </a>
        </div>
        <p className="mt-1 text-center text-[10px] uppercase tracking-[0.08em] text-white/80">{profile.title}</p>

        <div className="flex-1" />

        {/* Backing sized to the link block (not the viewport): solid under the
            links, fading out over 5rem above them, so the photo stays visible
            however many links there are. */}
        <div
          className="relative -mx-4 -mb-[max(1rem,env(safe-area-inset-bottom))] px-4 pb-safe pt-20 md:-mx-6 md:px-6"
          style={{ background: 'linear-gradient(to top, #0A0A0A 0%, rgba(10,10,10,0.94) calc(100% - 5rem), rgba(10,10,10,0) 100%)' }}
        >
          <div className="mx-auto w-full max-w-[26rem]">
            <LinkList />
            <a
              href={`#${chapters[0].id}`}
              className="label mt-4 flex items-center justify-center gap-2 text-white/70 transition-colors hover:text-white"
            >
              <ArrowDown /> Photography · Work · Videos · More
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
