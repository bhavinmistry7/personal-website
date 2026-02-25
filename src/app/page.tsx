import type { Metadata } from 'next'
import Link              from 'next/link'
import Image             from 'next/image'

import { ScrollProgress }                      from '@/components/ScrollProgress'
import { SectionNav }                          from '@/components/SectionNav'
import { HeroScrollSection }                   from '@/components/HeroScrollSection'
import { ScrollSection, SectionReveal }        from '@/components/ScrollSection'
import { ProjectCard }                         from '@/components/ProjectCard'
import { MediaCard }                           from '@/components/MediaCard'
import { VaultCard }                           from '@/components/VaultCard'
import { ContactForm }                         from '@/components/ContactForm'

import { site, home, education, experience, work, media, vault, contact } from '@/content/siteContent'

export const metadata: Metadata = {
  title:       `${site.name} — Cybersecurity Consultant & Creative Director`,
  description: site.seo.description,
}

// ─── Sections (drives SectionNav dots + ScrollSection IDs) ───────────────────
const SECTIONS = [
  { id: 'hero',       label: 'Home'       },
  { id: 'about',      label: 'About'      },
  { id: 'education',  label: 'Education'  },
  { id: 'experience', label: 'Experience' },
  { id: 'work',       label: 'Work'       },
  { id: 'media',      label: 'Media'      },
  { id: 'vault',      label: 'Vault'      },
  { id: 'contact',    label: 'Contact'    },
]

// ─── Inline arrow icon (no external dep) ─────────────────────────────────────
function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14" height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

// ─── Social icons (inline SVG) ────────────────────────────────────────────────
const socialIcons: Record<string, React.ReactNode> = {
  twitter: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 23.2 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  ),
  instagram: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
}

// ═════════════════════════════════════════════════════════════════════════════
// ABOUT SECTION
// ═════════════════════════════════════════════════════════════════════════════

function AboutSection() {
  return (
    <ScrollSection id="about" className="py-28 md:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,230,0,0.05) 0%, transparent 55%)' }}
      />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: profile photo */}
          <SectionReveal>
            <div
              className="relative aspect-[3/4] w-full max-w-sm mx-auto lg:mx-0 rounded-3xl overflow-hidden"
              style={{
                border:    '1px solid var(--glass-border)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.22), inset 0 1px 0 var(--glass-inset-t)',
              }}
            >
              {/* TODO: drop your photo at /public/images/about.jpg */}
              <Image
                src="/images/about.jpg"
                alt={site.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 80vw, 40vw"
                priority
              />
            </div>
          </SectionReveal>

          {/* Right: label + heading + body + CTA */}
          <div className="space-y-6">
            <SectionReveal>
              <p className="section-label mb-2">{home.about.label}</p>
            </SectionReveal>
            <SectionReveal delay={80}>
              <h2
                className="font-heading leading-[0.95] whitespace-pre-line"
                style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: 'var(--text)' }}
              >
                {home.about.heading}
              </h2>
            </SectionReveal>
            {home.about.body.map((paragraph, i) => (
              <SectionReveal key={i} delay={120 + i * 80}>
                <p className="text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {paragraph}
                </p>
              </SectionReveal>
            ))}
            <SectionReveal delay={300}>
              <Link href={home.about.cta.href} className="btn-outline mt-2 inline-flex">
                {home.about.cta.text}
                <ArrowIcon />
              </Link>
            </SectionReveal>
          </div>

        </div>
      </div>
    </ScrollSection>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// EDUCATION SECTION
// ═════════════════════════════════════════════════════════════════════════════

function EducationSection() {
  return (
    <ScrollSection id="education" className="py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 60%, rgba(255,230,0,0.04) 0%, transparent 55%)' }}
      />

      <div className="container-site relative z-10">
        <SectionReveal>
          <p className="section-label mb-4">{education.label}</p>
        </SectionReveal>
        <SectionReveal delay={80}>
          <h2
            className="font-heading leading-[0.95] whitespace-pre-line mb-16"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: 'var(--text)' }}
          >
            {education.heading}
          </h2>
        </SectionReveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical rail — gradient fades from gold at top to transparent */}
          <div
            className="absolute left-[9px] top-2 bottom-2 w-px pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, var(--gold), var(--border) 80%, transparent)' }}
          />

          <div className="space-y-8">
            {education.items.map((item, i) => (
              <SectionReveal key={item.id} delay={160 + i * 100}>
                <div className="flex items-start gap-6">

                  {/* Dot — centered on the rail (rail at 9px, dot column w-5=20px → center at 10px) */}
                  <div className="flex-shrink-0 w-5 pt-5 flex justify-center">
                    <div
                      className="w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: 'var(--gold)', backgroundColor: 'var(--bg)' }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--gold)' }} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="card p-6 md:p-8 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex items-start gap-4">
                        {/* Logo or letter monogram */}
                        <div
                          className="relative w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
                          style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
                        >
                          {item.logo ? (
                            <Image
                              src={item.logo}
                              alt={`${item.school} logo`}
                              width={28}
                              height={28}
                              className="object-contain"
                            />
                          ) : (
                            <span
                              className="font-heading text-base font-bold"
                              style={{ color: 'var(--gold)' }}
                            >
                              {item.school.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <h3
                            className="font-heading text-xl md:text-2xl leading-tight"
                            style={{ color: 'var(--text)' }}
                          >
                            {item.school}
                          </h3>
                          <p className="text-sm md:text-base mt-1" style={{ color: 'var(--text-muted)' }}>
                            {item.degree}
                          </p>
                        </div>
                      </div>
                      <div className="sm:text-right shrink-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--gold)' }}>
                          {item.dates}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          {item.location}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </SectionReveal>
            ))}
          </div>
        </div>

      </div>
    </ScrollSection>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// EXPERIENCE SECTION
// ══════════════════════════════════════════════���══════════════════════════════

function ExperienceSection() {
  return (
    <ScrollSection id="experience" className="py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 40%, rgba(99,102,241,0.05) 0%, transparent 55%)' }}
      />

      <div className="container-site relative z-10">
        <SectionReveal>
          <p className="section-label mb-4">{experience.label}</p>
        </SectionReveal>
        <SectionReveal delay={80}>
          <h2
            className="font-heading leading-[0.95] whitespace-pre-line mb-16"
            style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', color: 'var(--text)' }}
          >
            {experience.heading}
          </h2>
        </SectionReveal>

        {/* Experience cards */}
        <div className="space-y-6">
          {experience.items.map((item, i) => (
            <SectionReveal key={item.id} delay={160 + i * 100}>
              <div className="card p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:gap-12 gap-6">

                  {/* Company info */}
                  <div className="md:w-52 flex-shrink-0">
                    {/* Logo or letter monogram */}
                    <div
                      className="relative w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center mb-4"
                      style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border)' }}
                    >
                      {item.logo ? (
                        <Image
                          src={item.logo}
                          alt={`${item.company} logo`}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      ) : (
                        <span
                          className="font-heading text-lg font-bold"
                          style={{ color: 'var(--gold)' }}
                        >
                          {item.company.charAt(0)}
                        </span>
                      )}
                    </div>

                    <p className="font-heading text-xl font-medium mb-1" style={{ color: 'var(--text)' }}>
                      {item.company}
                    </p>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>
                      {item.startDate} — {item.endDate}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {item.location}
                    </p>
                  </div>

                  {/* Horizontal divider on mobile */}
                  <div className="md:hidden h-px" style={{ backgroundColor: 'var(--border)' }} />

                  {/* Role + bullets */}
                  <div className="flex-1">
                    <p className="section-label mb-5">{item.jobTitle}</p>
                    <ul className="space-y-3">
                      {item.bullets.map((bullet, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <span
                            className="mt-[0.45em] flex-shrink-0 w-1 h-1 rounded-full"
                            style={{ backgroundColor: 'var(--gold)' }}
                          />
                          <span
                            className="text-sm md:text-base leading-relaxed"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </ScrollSection>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// WORK SECTION
// ═════════════════════════════════════════════════════════════════════════════

function WorkSection() {
  const featured = work.projects.slice(0, 3)

  return (
    <ScrollSection id="work" className="py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(99,102,241,0.04) 0%, transparent 60%)' }}
      />

      <div className="container-site relative z-10">
        <div className="flex items-end justify-between mb-16">
          <div>
            <SectionReveal>
              <p className="section-label mb-4">Selected Work</p>
            </SectionReveal>
            <SectionReveal delay={80}>
              <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl leading-[1.0]" style={{ color: 'var(--text)' }}>
                Consulting<br /><em>Projects</em>
              </h2>
            </SectionReveal>
          </div>
          <SectionReveal delay={120} direction="right">
            <Link
              href="/work"
              className="hidden sm:flex items-center gap-2 text-sm transition-colors hover:text-gold"
              style={{ color: 'var(--text-muted)' }}
            >
              All projects
              <ArrowIcon />
            </Link>
          </SectionReveal>
        </div>

        <SectionReveal delay={140}>
          <p className="text-base md:text-lg max-w-2xl mb-12 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {work.hero.subheading}
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((project, i) => (
            <SectionReveal key={project.id} delay={200 + i * 80}>
              <ProjectCard project={{ ...project, href: '/work' }} featured />
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={500}>
          <div className="mt-8 sm:hidden">
            <Link href="/work" className="btn-outline w-full justify-center">
              All projects
            </Link>
          </div>
        </SectionReveal>
      </div>
    </ScrollSection>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// MEDIA SECTION
// ═════════════════════════════════════════════════════════════════════════════

function MediaSection() {
  const featured = media.items.filter(i => i.featured)

  return (
    <ScrollSection id="media" className="py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 60%, rgba(139,92,246,0.05) 0%, transparent 55%)' }}
      />

      <div className="container-site relative z-10">
        <div className="flex items-end justify-between mb-16">
          <div>
            <SectionReveal>
              <p className="section-label mb-4">Media</p>
            </SectionReveal>
            <SectionReveal delay={80}>
              <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl leading-[1.0]" style={{ color: 'var(--text)' }}>
                Photography<br /><em>&amp; Film</em>
              </h2>
            </SectionReveal>
          </div>
          <SectionReveal delay={120} direction="right">
            <Link
              href="/media"
              className="hidden sm:flex items-center gap-2 text-sm transition-colors hover:text-gold"
              style={{ color: 'var(--text-muted)' }}
            >
              Full gallery
              <ArrowIcon />
            </Link>
          </SectionReveal>
        </div>

        <SectionReveal delay={140}>
          <p className="text-base md:text-lg max-w-xl mb-12 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {media.hero.subheading}
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((item, i) => (
            <SectionReveal key={item.id} delay={200 + i * 80} direction={i % 2 === 0 ? 'left' : 'right'}>
              <MediaCard item={{ ...item, href: '/media' }} />
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={500}>
          <div className="mt-8 sm:hidden">
            <Link href="/media" className="btn-outline w-full justify-center">
              Full gallery
            </Link>
          </div>
        </SectionReveal>
      </div>
    </ScrollSection>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// VAULT SECTION
// ═════════════════════════════════════════════════════════════════════════════

function VaultSection() {
  const preview   = vault.items.slice(0, 4)
  const freeCount = vault.items.filter(i => i.free).length

  return (
    <ScrollSection id="vault" className="py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 90% 30%, rgba(6,182,212,0.04) 0%, transparent 55%)' }}
      />

      <div className="container-site relative z-10">
        <SectionReveal>
          <p className="section-label mb-4">{vault.hero.label}</p>
        </SectionReveal>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionReveal delay={80}>
            <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl leading-[1.0]" style={{ color: 'var(--text)' }}>
              Resources<br /><em>&amp; References</em>
            </h2>
          </SectionReveal>

          <SectionReveal delay={160} direction="right">
            <div className="flex gap-8">
              {[
                { value: vault.items.length, label: 'Resources' },
                { value: freeCount,          label: 'Free'      },
              ].map(({ value, label }) => (
                <div key={label} className="text-center lg:text-right">
                  <p className="font-heading text-4xl text-gradient-gold">{value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{label}</p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>

        <SectionReveal delay={140}>
          <p className="text-base md:text-lg max-w-xl mb-12 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {vault.hero.subheading}
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {preview.map((item, i) => (
            <SectionReveal key={item.id} delay={200 + i * 60}>
              <VaultCard item={item} />
            </SectionReveal>
          ))}
        </div>

        <SectionReveal delay={500}>
          <div className="mt-10 flex justify-center">
            <Link href="/vault" className="btn-outline">
              Browse the Vault
              <ArrowIcon />
            </Link>
          </div>
        </SectionReveal>
      </div>
    </ScrollSection>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// CONTACT SECTION
// ═════════════════════════════════════════════════════════════════════════════

function ContactSection() {
  return (
    <ScrollSection id="contact" className="py-24 md:py-32">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 70%, rgba(99,102,241,0.05) 0%, transparent 60%)' }}
      />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: info */}
          <div>
            <SectionReveal>
              <p className="section-label mb-6">{contact.hero.label}</p>
            </SectionReveal>
            <SectionReveal delay={80}>
              <h2
                className="font-heading leading-[0.95] whitespace-pre-line mb-8"
                style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', color: 'var(--text)' }}
              >
                {contact.hero.heading}
              </h2>
            </SectionReveal>
            <SectionReveal delay={160}>
              <p className="text-base md:text-lg leading-relaxed mb-10 max-w-md" style={{ color: 'var(--text-muted)' }}>
                {contact.intro}
              </p>
            </SectionReveal>

            {/* Direct email */}
            <SectionReveal delay={220}>
              <div className="glass-panel rounded-2xl p-5 mb-8">
                <p className="text-xs font-medium tracking-widest uppercase mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  Direct email
                </p>
                <a
                  href={`mailto:${contact.email}`}
                  className="font-heading text-lg transition-colors hover:text-gold"
                  style={{ color: 'var(--text)' }}
                >
                  {contact.email}
                </a>
              </div>
            </SectionReveal>

            {/* Social links */}
            <SectionReveal delay={280}>
              <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                Connect
              </p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(contact.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="glass-panel w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:text-gold hover:border-[rgba(255,230,0,0.35)]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {socialIcons[platform]}
                  </a>
                ))}
              </div>
            </SectionReveal>
          </div>

          {/* Right: form */}
          <SectionReveal delay={100} direction="right">
            <div className="glass-panel rounded-3xl p-8 md:p-10">
              <h3 className="font-heading text-2xl mb-6" style={{ color: 'var(--text)' }}>
                Send a message
              </h3>
              <ContactForm />
            </div>
          </SectionReveal>

        </div>
      </div>
    </ScrollSection>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// PAGE ROOT
// ═════════════════════════════════════════════════════════════════════════════

export default function HomePage() {
  return (
    <>
      {/* Fixed layers (SiteBackground is in layout.tsx — no need to repeat it here) */}
      <ScrollProgress />
      <SectionNav sections={SECTIONS} />

      {/* Scrollable content — z-10 sits above aurora (z-0) but below nav (z-50) */}
      <div className="relative z-10">
        <HeroScrollSection />
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <WorkSection />
        <MediaSection />
        <VaultSection />
        <ContactSection />
      </div>
    </>
  )
}
