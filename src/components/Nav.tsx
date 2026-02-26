'use client'

import Link            from 'next/link'
import { usePathname } from 'next/navigation'
import { useState }    from 'react'
import { ThemeToggle }       from './ThemeToggle'
import { PixelTrailToggle }  from './PixelTrailToggle'
import { site, nav }         from '@/content/siteContent'

// ─── Liquid glass nav link ────────────────────────────────────────────────────
//
// Each link renders:
//   1. A translucent glass ellipse that scales/fades in on hover & focus-visible
//   2. A subtle inner-highlight shimmer layer for depth
//   3. The text label, transitioning from ~40% → 100% opacity on interaction
//
// The <Link> itself carries group/navlink so every child can react to
// :hover and :focus-visible on the anchor via group-hover/navlink: and
// group-focus-visible/navlink: variants.

function GlassNavLink({
  href,
  label,
  active,
}: {
  href:   string
  label:  string
  active: boolean
}) {
  return (
    <Link
      href={href}
      // group/navlink — named group so children can target this element's
      // hover and focus-visible states without ambiguity.
      className="group/navlink relative inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium outline-none select-none"
    >
      {/* ── Glass ellipse ───────────────────────────────────────────────────
          Sits absolutely behind the text.
          Default: invisible (opacity-0, scale-95).
          Active: dim-visible (opacity-60) always.
          Hovered / focused: fully visible (opacity-100, scale-100).        */}
      <span
        aria-hidden="true"
        className={[
          'absolute inset-0 rounded-full pointer-events-none',
          'transition-all duration-[220ms] ease-out',
          active
            ? 'opacity-60 scale-100'
            : [
                'opacity-0 scale-95',
                'group-hover/navlink:opacity-100 group-hover/navlink:scale-100',
                'group-focus-visible/navlink:opacity-100 group-focus-visible/navlink:scale-100',
              ].join(' '),
        ].join(' ')}
        style={{
          // Radial fill — brighter at top (inner-highlight), fades to translucent
          background: [
            'radial-gradient(ellipse at 50% 0%,',
            '  var(--glass-shine) 0%,',
            '  var(--glass-fill) 55%,',
            '  transparent 100%)',
          ].join(' '),
          border:              '1px solid var(--glass-border)',
          backdropFilter:      'blur(4px) saturate(2.2)',
          WebkitBackdropFilter:'blur(4px) saturate(2.2)',
          boxShadow: [
            // Soft accent glow
            '0 0 18px 2px var(--glass-glow)',
            // Stronger specular top-edge — refraction rim
            'inset 0 1.5px 0 rgba(255,255,255,0.35)',
          ].join(', '),
        }}
      />

      {/* ── Shimmer layer ────────────────────────────────────────────────────
          A diagonal gradient sweep — adds a gentle "liquid" highlight depth.
          Only animates in on hover (not on always-active state).             */}
      <span
        aria-hidden="true"
        className={[
          'absolute inset-0 rounded-full overflow-hidden pointer-events-none',
          'transition-opacity duration-300',
          active
            ? 'opacity-40'
            : 'opacity-0 group-hover/navlink:opacity-100',
        ].join(' ')}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'linear-gradient(108deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)',
          }}
        />
      </span>

      {/* ── Label text ────────────────────────────────────────────────────────
          Default: ~40% opacity (muted, receded).
          Hovered / focused / active: 100% opacity.                           */}
      <span
        className={[
          'relative z-10 transition-all duration-200',
          active
            ? 'opacity-100'
            : [
                'opacity-[0.42]',
                'group-hover/navlink:opacity-100',
                'group-focus-visible/navlink:opacity-100',
              ].join(' '),
        ].join(' ')}
        style={{ color: active ? 'var(--gold)' : 'var(--text)' }}
      >
        {label}
      </span>
    </Link>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

export function Nav() {
  const pathname  = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50">

      {/* ── Near-invisible glass bar ────────────────────────────────────────
          Barely present at rest — a whisper of blur and gradient.
          Intentionally NOT a solid opaque box; the page breathes through it. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          // Stronger top-tint compensates for reduced blur so text stays readable
          background: [
            'linear-gradient(to bottom,',
            '  rgba(var(--bg-rgb, 9,9,9), 0.72) 0%,',
            '  rgba(var(--bg-rgb, 9,9,9), 0.22) 100%)',
          ].join(' '),
          backdropFilter:       'blur(3px) saturate(2.0)',
          WebkitBackdropFilter: 'blur(3px) saturate(2.0)',
          // Bright hairline bottom + specular top-edge — the "glass rim" refraction look
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          boxShadow:    'inset 0 1px 0 rgba(255,255,255,0.28)',
        }}
      />

      {/* ── Main nav row ────────────────────────────────────────────────── */}
      <nav className="container-site relative flex items-center justify-between h-16">

        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-lg font-normal tracking-tight outline-none transition-opacity duration-200 hover:opacity-60 focus-visible:opacity-60"
          style={{ color: 'var(--text)' }}
        >
          {site.shortName}
          <span style={{ color: 'var(--gold)' }}>.</span>
        </Link>

        {/* Desktop links — tighter gap, glass pills handle the spacing feel */}
        <div className="hidden md:flex items-center gap-0.5">
          {nav.links.map((link) => (
            <GlassNavLink
              key={link.href}
              href={link.href}
              label={link.label}
              active={pathname === link.href}
            />
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <PixelTrailToggle />
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full transition-colors hover:bg-white/5"
          >
            <span
              className={`block w-5 h-px transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}
              style={{ backgroundColor: 'var(--text)' }}
            />
            <span
              className={`block w-5 h-px transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
              style={{ backgroundColor: 'var(--text)' }}
            />
            <span
              className={`block w-5 h-px transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}
              style={{ backgroundColor: 'var(--text)' }}
            />
          </button>
        </div>
      </nav>

      {/* ── Mobile menu ─────────────────────────────────────────────────── */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? 'max-h-72 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          backgroundColor:      'rgba(var(--bg-rgb, 9,9,9), 0.92)',
          backdropFilter:       'blur(8px) saturate(2.0)',
          WebkitBackdropFilter: 'blur(8px) saturate(2.0)',
          borderBottom:         '1px solid rgba(255,255,255,0.10)',
        }}
      >
        <div className="container-site py-4 flex flex-col gap-0.5">
          {nav.links.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`py-3 px-2 text-sm rounded-xl transition-all duration-200 ${
                  active ? 'opacity-100 font-medium' : 'opacity-40 hover:opacity-80'
                }`}
                style={{ color: active ? 'var(--gold)' : 'var(--text)' }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      </div>

    </header>
  )
}
