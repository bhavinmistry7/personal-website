import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { MotionProvider } from '@/components/MotionProvider'
import { LinkTracker } from '@/components/LinkTracker'
import { profile } from '@/content/site'
import './globals.css'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

const title = `${profile.name} · ${profile.title}`

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title,
  description:  profile.description,
  alternates:   { canonical: '/' },
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         '/',
    siteName:    profile.name,
    title,
    description: profile.description,
  },
  twitter: {
    card:        'summary_large_image',
    title,
    description: profile.description,
  },
}

export const viewport: Viewport = {
  themeColor:   '#0A0A0A',
  colorScheme:  'dark',
  viewportFit:  'cover',     // lets the hero run under the notch; safe-area padding keeps text clear
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
        <LinkTracker />
        <Analytics />
      </body>
    </html>
  )
}
