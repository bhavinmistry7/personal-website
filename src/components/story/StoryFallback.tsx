import { booking, profile, links, visible } from '@/content/site'
import type { StoryData } from './types'

/**
 * Static, server-rendered version of the story: same chapters, ids, headings,
 * copy and links, no motion and no photos. It is what no-JS visitors and
 * crawlers get, and what sits below the fold for the moment before the
 * animated <Story> loads.
 */
export function StoryFallback({ data }: { data: StoryData }) {
  const ch = (id: string) => data.chapters.find((c) => c.id === id)

  const Head = ({ id }: { id: string }) => {
    const c = ch(id)!
    return (
      <header className="px-4 pb-[8svh] pt-[24svh] md:px-6 md:pt-[28svh]">
        <p className="label text-mute">{c.n}</p>
        <h2 className="mt-2 text-[clamp(2.75rem,12vw,13rem)] font-medium uppercase leading-[0.9] tracking-[-0.045em]">{c.label}</h2>
        {c.intro && <p className="mt-6 max-w-[34ch] text-[15px] leading-snug text-ink/65 md:text-[17px]">{c.intro}</p>}
      </header>
    )
  }

  return (
    <div className="bg-paper text-ink">
      {data.photography && (
        <section id="photography">
          <Head id="photography" />
          <ul className="label space-y-2 px-4 pb-[20svh] text-mute md:px-6">
            {data.photography.sets.map((s) => <li key={s.id}>{s.title}, {s.year} · {s.photos.length} frames</li>)}
          </ul>
        </section>
      )}

      {data.work.length > 0 && (
        <section id="work">
          <Head id="work" />
          <ol className="px-4 pb-[20svh] md:px-6">
            {data.work.map((p) => (
              <li key={p.id} className="border-t border-ink/15 py-8">
                <a href={p.href} className="text-[clamp(2rem,7vw,5.5rem)] font-medium uppercase leading-[0.9] tracking-[-0.04em]">{p.title}</a>
                <p className="mt-4 max-w-[38ch] text-[14px] leading-snug text-ink/65">{p.description}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {data.videos.length > 0 && (
        <section id="videos">
          <Head id="videos" />
          <ul className="label space-y-2 px-4 pb-[20svh] md:px-6">
            {data.videos.map(({ video }) => (
              <li key={video.id}>
                <a href={video.platform === 'youtube' ? `https://www.youtube.com/watch?v=${video.videoId}` : video.href || undefined}>
                  {video.title}, {video.year}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {data.favorites && (
        <section id="favorites">
          <Head id="favorites" />
          <ul className="space-y-2 px-4 md:px-6">
            {data.favorites.items.map((f) => (
              <li key={f.id}><a href={f.href || undefined} rel="sponsored noopener noreferrer">{f.name}{f.brand ? `, ${f.brand}` : ''}</a></li>
            ))}
            {data.favorites.storefront && (
              <li><a href={data.favorites.storefront.href || undefined}>Shop everything on ShopMy</a></li>
            )}
          </ul>
          <p className="label px-4 pb-[20svh] pt-6 text-mute md:px-6">{data.favorites.disclosure}</p>
        </section>
      )}

      <section id="book" className="bg-ink px-4 pb-12 pt-[24svh] text-paper md:px-6">
        <h2 className="text-[clamp(2.75rem,12vw,13rem)] font-medium uppercase leading-[0.9] tracking-[-0.045em]">Book me</h2>
        <p className="mt-6 max-w-[34ch] text-[15px] leading-snug text-white/65">{booking.pitch}</p>
        <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {booking.stats.map((s) => (
            <div key={s.label}><dt className="label text-white/60">{s.label}</dt><dd className="mt-1 text-3xl font-medium">{s.value}</dd></div>
          ))}
        </dl>
        <a href={`mailto:${profile.email}?subject=${encodeURIComponent(booking.subject)}`} className="mt-10 inline-block underline">
          {booking.cta}: {profile.email}
        </a>
        <ul className="label mt-12 flex flex-wrap gap-4 text-white/60">
          {visible(links).filter((l) => l.href).map((l) => <li key={l.id}><a href={l.href}>{l.label}</a></li>)}
        </ul>
      </section>
    </div>
  )
}
