/** Extract YouTube video ID from standard and shortened URL formats. */
export function getYouTubeVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('?')[0] || null
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v')
  } catch {
    // invalid URL
  }
  return null
}

/** Return the mqdefault thumbnail URL for a YouTube link, or null if not YouTube. */
export function getYouTubeThumbnailUrl(url: string): string | null {
  const id = getYouTubeVideoId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}
