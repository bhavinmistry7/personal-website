'use client'

import { useEffect, useState } from 'react'

type Chapter = { id: string; n: string; label: string }

/**
 * Appears once the light panel has covered the hero: name left, chapter index
 * right (desktop) or current chapter + "Links" (phone). Colours follow the
 * chapter underneath via its data-tone.
 */
export function CompactHeader({ name, chapters }: { name: string; chapters: Chapter[] }) {
  const [shown, setShown]   = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const [dark, setDark]     = useState(false)

  // Show once the story panel reaches the top of the viewport
  useEffect(() => {
    const story = document.getElementById('story')
    if (!story) return
    const onScroll = () => setShown(story.getBoundingClientRect().top <= 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Track which chapter sits under the header
  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setActive(e.target.id)
            setDark((e.target as HTMLElement).dataset.tone === 'dark')
          }
        }
      },
      { rootMargin: '0px 0px -90% 0px', threshold: 0 },  // thin band at the top of the viewport
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [chapters])

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 transition-[transform,opacity,background-color,color] duration-500 ease-out',
        shown ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-full opacity-0',
        dark ? 'bg-ink/80 text-paper' : 'bg-paper/80 text-ink',
      ].join(' ')}
      style={{ backdropFilter: 'blur(12px) saturate(1.4)', WebkitBackdropFilter: 'blur(12px) saturate(1.4)' }}
      aria-hidden={!shown}
    >
      <nav className="flex h-11 items-center justify-between px-4 md:px-6" aria-label="Chapters">
        <a href="#top" className="text-[11px] font-medium uppercase tracking-[0.06em]" tabIndex={shown ? 0 : -1}>
          {name}
        </a>

        {/* Desktop: full index */}
        <ol className="hidden items-center gap-5 md:flex">
          {chapters.map((c) => (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                tabIndex={shown ? 0 : -1}
                aria-current={active === c.id ? 'location' : undefined}
                className={`label transition-opacity duration-300 ${active === c.id ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              >
                {c.n} {c.label}
              </a>
            </li>
          ))}
        </ol>

        {/* Phone: the corner labels already say where you are; offer the way back */}
        <a href="#top" className="label md:hidden" tabIndex={shown ? 0 : -1}>Links ↑</a>
      </nav>
    </header>
  )
}
