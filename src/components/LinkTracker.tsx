'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

/**
 * One delegated listener for every tracked link, so the link markup can stay
 * server-rendered. Mark a link with data-link-id (and optionally
 * data-placement) and its clicks are sent as a "Link Click" event.
 */
export function LinkTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[data-link-id]')
      if (!a) return
      track('Link Click', { id: a.dataset.linkId!, placement: a.dataset.placement ?? 'unknown' })
    }
    // capture: fires even if something stops propagation; auxclick covers middle-click
    document.addEventListener('click', onClick, { capture: true })
    document.addEventListener('auxclick', onClick, { capture: true })
    return () => {
      document.removeEventListener('click', onClick, { capture: true })
      document.removeEventListener('auxclick', onClick, { capture: true })
    }
  }, [])
  return null
}
