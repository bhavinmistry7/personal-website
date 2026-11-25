import { ImageResponse } from 'next/og'
import { profile, links } from '@/content/site'

export const alt = `${profile.name}: ${profile.title}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Typographic share card: near-black field, uppercase name, spec-sheet corners.
export default function OpengraphImage() {
  const channels = links.filter((l) => l.href).map((l) => l.label).join('  ·  ')
  const label = { fontSize: 18, letterSpacing: 2, color: 'rgba(242,242,240,0.5)', textTransform: 'uppercase' as const }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: 56, color: '#F2F2F0',
          background: 'radial-gradient(ellipse 70% 80% at 50% 45%, #262626 0%, #121212 50%, #0A0A0A 80%)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={label}>{profile.location}</span>
          <span style={label}>{new URL(profile.url).host}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 128, fontWeight: 600, letterSpacing: -5, textTransform: 'uppercase', lineHeight: 1 }}>
            {profile.name}
          </div>
          <div style={{ ...label, fontSize: 24, marginTop: 28, color: 'rgba(242,242,240,0.7)' }}>{profile.title}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span style={label}>{channels}</span>
        </div>
      </div>
    ),
    size,
  )
}
