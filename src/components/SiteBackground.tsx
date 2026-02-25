'use client'

import { StarfieldBackground } from './StarfieldBackground'

/**
 * SiteBackground — full-viewport starfield canvas rendered at the root
 * layout level so it persists across every page.
 *
 * Layering contract:
 *   z-0   this layer  (position: fixed)
 *   z-10  <main> in layout.tsx  (all page content)
 *   z-40  SectionNav (homepage only)
 *   z-50  Nav
 *   z-60  ScrollProgress
 */
export function SiteBackground() {
  return <StarfieldBackground />
}
