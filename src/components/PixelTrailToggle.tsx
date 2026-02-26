'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'pixelTrail'

export function PixelTrailToggle() {
  // Default ON; read persisted preference after hydration
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'off') setEnabled(false)
  }, [])

  function toggle() {
    const next = !enabled
    setEnabled(next)
    localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
    window.dispatchEvent(
      new CustomEvent('pixel-trail-toggle', { detail: next ? 'on' : 'off' })
    )
  }

  return (
    <button
      onClick={toggle}
      aria-label={enabled ? 'Disable pixel trail' : 'Enable pixel trail'}
      title={enabled ? 'Disable pixel trail' : 'Enable pixel trail'}
      className="relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
    >
      {/* "On" icon — 2×2 pixel grid */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        className={`absolute transition-all duration-300 ${
          enabled ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      >
        <rect x="3"  y="3"  width="8" height="8" rx="1.5" />
        <rect x="13" y="3"  width="8" height="8" rx="1.5" />
        <rect x="3"  y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </svg>

      {/* "Off" icon — same grid, dimmed + diagonal slash */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={`absolute transition-all duration-300 ${
          enabled ? 'opacity-0 scale-50' : 'opacity-100 scale-100'
        }`}
      >
        <rect x="3"  y="3"  width="8" height="8" rx="1.5" opacity="0.35" />
        <rect x="13" y="3"  width="8" height="8" rx="1.5" opacity="0.35" />
        <rect x="3"  y="13" width="8" height="8" rx="1.5" opacity="0.35" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" opacity="0.35" />
        <line x1="3" y1="21" x2="21" y2="3" />
      </svg>
    </button>
  )
}
