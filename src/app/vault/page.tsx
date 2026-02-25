import type { Metadata } from 'next'
import Link              from 'next/link'
import { FadeIn }        from '@/components/FadeIn'
import { SectionHeader } from '@/components/SectionHeader'
import { VaultGrid }     from '@/components/VaultGrid'
import { site, vault }   from '@/content/siteContent'

export const metadata: Metadata = {
  title:       'Vault',
  description: `Curated resources, tools, templates, and notes from ${site.name}'s consulting and creative practice.`,
}

export default function VaultPage() {
  const freeCount    = vault.items.filter((i) => i.free).length
  const premiumCount = vault.items.filter((i) => !i.free).length

  return (
    <div className="pt-32 pb-24">
      {/* Hero */}
      <div className="container-site mb-16">
        <FadeIn>
          <SectionHeader
            label={vault.hero.label}
            heading={vault.hero.heading}
            subheading={vault.hero.subheading}
          />
        </FadeIn>

        {/* Stats row */}
        <FadeIn delay={100}>
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { label: 'Total resources', value: vault.items.length },
              { label: 'Free',            value: freeCount },
              { label: 'Premium',         value: premiumCount },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-heading text-4xl" style={{ color: 'var(--gold)' }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* Divider */}
      <div className="container-site">
        <div className="border-t mb-10" style={{ borderColor: 'var(--border)' }} />
      </div>

      {/* Client component: filter + grid */}
      <VaultGrid />

      {/* Subscribe CTA */}
      <div className="container-site mt-20">
        <FadeIn>
          <div className="glass-panel rounded-2xl p-8 md:p-12 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 0% 100%, rgba(212,168,39,0.06) 0%, transparent 60%)',
              }}
            />
            <div className="relative z-10 max-w-lg">
              <p className="section-label mb-4">Stay updated</p>
              <h2 className="font-heading text-3xl md:text-4xl mb-3" style={{ color: 'var(--text)' }}>
                New resources added regularly
              </h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                I update the Vault with new tools, templates, and notes from active engagements. Reach out to be notified.
              </p>
              <Link href="/contact" className="btn-primary">
                Get notified
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
