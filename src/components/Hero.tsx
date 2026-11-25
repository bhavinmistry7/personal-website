import Image from 'next/image'
import { profile, chapters } from '@/content/site'
import { photo } from '@/lib/photos'
import { HeroLayer } from './HeroLayer'
import { LinkList } from './LinkList'
import { ArrowDown } from './Icons'

/**
 * First screen = links. Pinned (sticky) so the light story panel slides up over it.
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
      <HeroLayer layer="photo" className="absolute inset-0">
        <div
          className="absolute inset-0 md:inset-auto md:bottom-[6svh] md:left-1/2 md:top-[6svh] md:-translate-x-1/2"
          style={{ aspectRatio: `${hero.width} / ${hero.height}` }}
        >
          <Image
            src={hero.src}
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 45vw, 100vw"
            placeholder="blur"
            blurDataURL={hero.blurDataURL}
            className="object-cover"
          />
          {/* Legibility: soft top, solid bottom where the links sit */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent via-25% to-transparent" />
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink via-ink/85 via-45% to-transparent" />
        </div>
      </HeroLayer>

      {/* ── Foreground ───────────────────────────────────────────────────── */}
      <HeroLayer layer="content" className="relative z-10 flex h-full flex-col px-4 pt-safe pb-safe md:px-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
          <p className="label whitespace-nowrap text-white/50">{profile.location}</p>
          <h1 className="text-center text-name font-medium uppercase">{profile.name}</h1>
          <a href={`#${chapters[0].id}`} className="label justify-self-end text-white/50 transition-colors hover:text-white">
            Index
          </a>
        </div>
        <p className="mt-1 text-center text-[10px] uppercase tracking-[0.08em] text-white/55">{profile.title}</p>

        <div className="flex-1" />

        <div className="mx-auto w-full max-w-[26rem]">
          <LinkList />
          <a
            href={`#${chapters[0].id}`}
            className="label mt-4 flex items-center justify-center gap-2 text-white/45 transition-colors hover:text-white"
          >
            <ArrowDown /> Photography · Work · Videos · More
          </a>
        </div>
      </HeroLayer>
    </section>
  )
}
