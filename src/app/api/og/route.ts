import { NextRequest, NextResponse } from 'next/server'

// Simple in-process cache: url → { image url or null, timestamp }
const cache = new Map<string, { value: string | null; ts: number }>()
const TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

async function fetchOgImage(url: string): Promise<string | null> {
  const cached = cache.get(url)
  if (cached && Date.now() - cached.ts < TTL_MS) return cached.value

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; bot/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const html = await res.text()

    // Try both attribute orderings of the og:image meta tag
    const value =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)?.[1] ??
      null

    cache.set(url, { value, ts: Date.now() })
    return value
  } catch {
    cache.set(url, { value: null, ts: Date.now() })
    return null
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ image: null }, { status: 400 })

  const image = await fetchOgImage(url)
  return NextResponse.json(
    { image },
    { headers: { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600' } },
  )
}
