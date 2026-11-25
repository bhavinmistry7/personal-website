import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { profile } from '@/content/site'
import './globals.css'

const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

const title = `${profile.name} · ${profile.title}`

// Umami Cloud (link-click analytics). Off unless a website ID is configured.
// Only counts visits on the production domain unless overridden.
const umamiId      = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const umamiDomains = process.env.NEXT_PUBLIC_UMAMI_DOMAINS ?? new URL(profile.url).host

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
        {children}
        <Analytics />       {/* page views (Vercel, free on Hobby) */}
        <SpeedInsights />   {/* real-user LCP/INP/CLS (Vercel, free on Hobby) */}
        {umamiId && (
          // lazyOnload: injected after the page's load event, so it never touches LCP
          <Script src="https://cloud.umami.is/script.js" data-website-id={umamiId} data-domains={umamiDomains} strategy="lazyOnload" />
        )}
      </body>
    </html>
  )
}
