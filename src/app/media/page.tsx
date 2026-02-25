import type { Metadata } from 'next'
import Link              from 'next/link'
import { FadeIn }        from '@/components/FadeIn'
import { SectionHeader } from '@/components/SectionHeader'
import { MediaGrid }     from '@/components/MediaGrid'
import { site, media }   from '@/content/siteContent'

export const metadata: Metadata = {
  title:       'Media',
  description: `Photography and film work by ${site.name} — architecture, portraiture, events, and travel.`,
}

export default function MediaPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <div className="container-site mb-16">
        <FadeIn>
          <SectionHeader
            label={media.hero.label}
            heading={media.hero.heading}
            subheading={media.hero.subheading}
          />
        </FadeIn>
      </div>

      {/* Divider */}
      <div className="container-site">
        <div className="border-t mb-10" style={{ borderColor: 'var(--border)' }} />
      </div>

      {/* Client component: filter + grid */}
      <MediaGrid />

      {/* Commission CTA */}
      <div className="container-site mt-20">
        <FadeIn>
          <div className="glass-panel rounded-2xl p-8 md:p-10 text-center">
            <p className="section-label justify-center mb-4">Commission work</p>
            <h2 className="font-heading text-3xl md:text-4xl mb-4" style={{ color: 'var(--text)' }}>
              Need a photographer or filmmaker?
            </h2>
            <p className="text-sm mb-6 max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
              Available for corporate events, editorial, portraits, and short-form video.
            </p>
            <Link href="/contact" className="btn-primary">
              Discuss your project
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
