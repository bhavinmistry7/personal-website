'use client'

import { useEffect, useRef, useState } from 'react'

export interface NavSection {
  id:    string
  label: string
}

interface SectionNavProps {
  sections: NavSection[]
}

/**
 * SectionNav — fixed left-side dot navigation for the scroll story.
 *
 * Desktop:
 *   - Thin vertical connector line with stacked dots
 *   - Active dot glows with aurora accent color
 *   - Hover over any dot shows a tooltip label pill to its right
 *   - Click scrolls to that section
 *
 * Mobile (below md breakpoint):
 *   - Dots hidden; a compact floating pill shows at bottom-left
 *   - Tap to open a bottom drawer listing all sections
 */
export function SectionNav({ sections }: SectionNavProps) {
  const [activeId,   setActiveId]   = useState<string>(sections[0]?.id ?? '')
  const [hoveredId,  setHoveredId]  = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Listen for 'section-active' events dispatched by <ScrollSection>
  useEffect(() => {
    const handler = (e: Event) => {
      const { id } = (e as CustomEvent<{ id: string }>).detail
      setActiveId(id)
    }
    window.addEventListener('section-active', handler)
    return () => window.removeEventListener('section-active', handler)
  }, [])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setDrawerOpen(false)
  }

  // Keep tooltip open briefly after mouse leaves the dot
  function onDotEnter(id: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setHoveredId(id)
  }
  function onDotLeave() {
    closeTimer.current = setTimeout(() => setHoveredId(null), 150)
  }

  const activeLabel = sections.find(s => s.id === activeId)?.label ?? ''

  return (
    <>
      {/* ── Desktop dots rail ─────────────────────────────────────────────── */}
      <nav
        aria-label="Page sections"
        className="hidden md:flex flex-col items-center gap-5 fixed left-5 top-1/2 -translate-y-1/2 z-40"
      >
        {/* Vertical connector line */}
        <div
          aria-hidden="true"
          className="absolute top-2 bottom-2 w-px"
          style={{ left: '5px', backgroundColor: 'var(--border)' }}
        />

        {sections.map(({ id, label }) => {
          const active  = activeId  === id
          const hovered = hoveredId === id

          return (
            <div
              key={id}
              className="relative flex items-center"
              onMouseEnter={() => onDotEnter(id)}
              onMouseLeave={onDotLeave}
            >
              {/* Dot */}
              <button
                onClick={() => scrollTo(id)}
                aria-label={`Jump to ${label}`}
                aria-current={active ? 'true' : undefined}
                className="relative z-10 block rounded-full transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{
                  width:           active ? '12px' : '8px',
                  height:          active ? '12px' : '8px',
                  backgroundColor: active
                    ? 'var(--gold)'
                    : hovered
                      ? 'var(--text-muted)'
                      : 'var(--border)',
                  boxShadow: active ? '0 0 10px 3px var(--gold)' : 'none',
                  outlineColor: 'var(--gold)',
                }}
              />

              {/* Tooltip label pill */}
              <span
                aria-hidden="true"
                className="absolute whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-lg pointer-events-none transition-all duration-200"
                style={{
                  left:            'calc(100% + 12px)',
                  top:             '50%',
                  transform:       'translateY(-50%)',
                  opacity:         hovered ? 1 : 0,
                  color:           active ? 'var(--gold)' : 'var(--text)',
                  backgroundColor: 'var(--bg-card)',
                  border:          '1px solid var(--border)',
                  backdropFilter:  'blur(8px)',
                  boxShadow:       '0 2px 12px rgba(0,0,0,0.15)',
                }}
              >
                {label}
              </span>
            </div>
          )
        })}
      </nav>

      {/* ── Mobile floating pill ──────────────────────────────────────────── */}
      <button
        onClick={() => setDrawerOpen(true)}
        aria-label="Open section menu"
        aria-expanded={drawerOpen}
        className="md:hidden fixed bottom-6 left-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-200 active:scale-95"
        style={{
          backgroundColor: 'var(--bg-card)',
          border:          '1px solid var(--border)',
          backdropFilter:  'blur(10px)',
          color:           'var(--text-muted)',
        }}
      >
        {/* Mini dot row */}
        <span className="flex items-center gap-1" aria-hidden="true">
          {sections.map(({ id }) => (
            <span
              key={id}
              className="block rounded-full transition-all duration-200"
              style={{
                width:           activeId === id ? '6px' : '4px',
                height:          activeId === id ? '6px' : '4px',
                backgroundColor: activeId === id ? 'var(--gold)' : 'var(--border)',
              }}
            />
          ))}
        </span>
        <span>{activeLabel}</span>
      </button>

      {/* ── Mobile drawer backdrop ────────────────────────────────────────── */}
      <div
        className={`md:hidden fixed inset-0 z-[45] transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* ── Mobile drawer panel ───────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-label="Section navigation"
        aria-modal="true"
        className={`md:hidden fixed bottom-0 left-0 right-0 z-[46] rounded-t-3xl transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          backgroundColor: 'var(--bg-card)',
          border:          '1px solid var(--border)',
          borderBottom:    'none',
          paddingBottom:   'max(env(safe-area-inset-bottom), 16px)',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
          <div className="w-9 h-1 rounded-full" style={{ backgroundColor: 'var(--border)' }} />
        </div>

        <p className="text-xs font-medium tracking-widest uppercase px-6 pt-2 pb-3" style={{ color: 'var(--text-muted)' }}>
          Jump to
        </p>

        <div className="flex flex-col px-4 pb-4 gap-1">
          {sections.map(({ id, label }) => {
            const active = activeId === id
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                aria-current={active ? 'page' : undefined}
                className="flex items-center gap-3 w-full px-3 py-3.5 rounded-xl text-left transition-colors duration-150"
                style={{ backgroundColor: active ? 'rgba(255,230,0,0.08)' : 'transparent' }}
              >
                <span
                  className="shrink-0 block rounded-full"
                  style={{
                    width:           '8px',
                    height:          '8px',
                    backgroundColor: active ? 'var(--gold)' : 'var(--border)',
                    boxShadow:       active ? '0 0 6px var(--gold)' : 'none',
                  }}
                />
                <span className="text-sm font-medium" style={{ color: active ? 'var(--gold)' : 'var(--text)' }}>
                  {label}
                </span>
                {active && (
                  <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>Current</span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
