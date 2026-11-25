'use client'

import { useEffect, useState, type ComponentType } from 'react'
import type { StoryData } from './types'

type StoryComponent = ComponentType<{ data: StoryData }>

/**
 * Shows the server-rendered static story (children) first, then swaps in the
 * animated <Story> once its chunk has loaded. The import starts after
 * hydration, i.e. after first paint, so framer-motion never competes with the
 * hero. Without JS, the static story simply stays.
 */
export function StoryLoader({ data, children }: { data: StoryData; children: React.ReactNode }) {
  const [Story, setStory] = useState<StoryComponent | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = () => import('./Story').then((mod) => { if (!cancelled) setStory(() => mod.default) })
    // Wait for the page's own load + an idle moment so the chunk never
    // competes with the hero; the 1.5s timeout caps the wait on busy devices.
    const idle = () =>
      typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(load, { timeout: 1500 }) : setTimeout(load, 200)
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener('load', idle)
    }
  }, [])

  return Story ? <Story data={data} /> : <>{children}</>
}
