import type { Metadata } from 'next'
import { Instrument_Serif, Inter } from 'next/font/google'
import './globals.css'
import { Nav }            from '@/components/Nav'
import { Footer }         from '@/components/Footer'
import { SiteBackground } from '@/components/SiteBackground'
import { site }           from '@/content/siteContent'

// ─── FONTS ───────────────────────────────────────────────────────────────────
const instrumentSerif = Instrument_Serif({
  subsets:  ['latin'],
  weight:   ['400'],
  style:    ['normal', 'italic'],
  variable: '--font-heading',
  display:  'swap',
})

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-body',
  display:  'swap',
})

// ─── METADATA ────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default:  `${site.name} — Cybersecurity Consultant & Creative Director`,
    template: `%s — ${site.name}`,
  },
  description: site.seo.description,
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         site.url,
    siteName:    site.name,
    title:       `${site.name} — Cybersecurity Consultant & Creative Director`,
    description: site.seo.description,
    images: [{ url: site.seo.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       `${site.name} — Cybersecurity Consultant & Creative Director`,
    description: site.seo.description,
    images:      [site.seo.ogImage],
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

// ─── ROOT LAYOUT ─────────────────────────────────────────────────────────────
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrumentSerif.variable} ${inter.variable}`}
    >
      <head>
        {/* Prevent flash of wrong theme — runs before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s===null&&d)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        {/* z-0: liquid WebGL background, fixed, covers full viewport */}
        <SiteBackground />

        {/* z-50: sticky nav sits above the background */}
        <Nav />

        {/* z-10: all page content — relative+z-10 creates a stacking context
            above the z-0 background so every page is correctly layered  */}
        <main className="flex-1 relative z-10">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  )
}
