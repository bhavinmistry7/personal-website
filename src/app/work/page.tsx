import type { Metadata } from 'next'
import Link              from 'next/link'
import { FadeIn }        from '@/components/FadeIn'
import { SectionHeader } from '@/components/SectionHeader'
import { WorkGrid }      from '@/components/WorkGrid'
import { site, work }    from '@/content/siteContent'

export const metadata: Metadata = {
  title:       'Work',
  description: `Security consulting projects and engagements by ${site.name} — zero trust architecture, red team assessments, incident response, and more.`,
}

export default function WorkPage() {
  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <div className="container-site mb-16">
        <FadeIn>
          <SectionHeader
            label={work.hero.label}
            heading={work.hero.heading}
            subheading={work.hero.subheading}
          />
        </FadeIn>
      </div>

      {/* Divider */}
      <div className="container-site">
        <div className="border-t mb-10" style={{ borderColor: 'var(--border)' }} />
      </div>

      {/* Client component: filter + grid */}
      <WorkGrid />

      {/* Availability note */}
      <div className="container-site mt-20">
        <FadeIn>
          <div className="glass-panel rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
                  Currently available
                </span>
              </div>
              <p className="font-heading text-xl md:text-2xl" style={{ color: 'var(--text)' }}>
                Taking on new consulting engagements
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Q1 2026 · Security architecture, red team, and advisory roles
              </p>
            </div>
            <Link href="/contact" className="btn-primary shrink-0">
              Get in touch
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
