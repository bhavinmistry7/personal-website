import type { Metadata } from 'next'
import { FadeIn }        from '@/components/FadeIn'
import { ContactForm }   from '@/components/ContactForm'
import { site, contact } from '@/content/siteContent'

export const metadata: Metadata = {
  title:       'Contact',
  description: `Get in touch with ${site.name} for security consulting, creative projects, speaking, and advisory roles.`,
}

const socialIcons: Record<string, React.ReactNode> = {
  twitter: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  ),
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left: Info */}
          <div>
            <FadeIn>
              <p className="section-label mb-6">{contact.hero.label}</p>
              <h1
                className="font-heading text-5xl md:text-6xl lg:text-7xl leading-[0.95] mb-8 whitespace-pre-line"
                style={{ color: 'var(--text)' }}
              >
                {contact.hero.heading}
              </h1>
              <p
                className="text-base md:text-lg leading-relaxed mb-10 max-w-md"
                style={{ color: 'var(--text-muted)' }}
              >
                {contact.intro}
              </p>
            </FadeIn>

            {/* Direct email */}
            <FadeIn delay={100}>
              <div
                className="rounded-2xl p-6 mb-8"
                style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs font-medium tracking-widest uppercase mb-2" style={{ color: 'var(--text-muted)' }}>
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
            </FadeIn>

            {/* Social links */}
            <FadeIn delay={150}>
              <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                Social
              </p>
              <div className="flex flex-wrap gap-3">
                {Object.entries(contact.social).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={platform}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:text-gold hover:border-gold"
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border:          '1px solid var(--border)',
                      color:           'var(--text-muted)',
                    }}
                  >
                    {socialIcons[platform]}
                  </a>
                ))}
              </div>
            </FadeIn>

            {/* What I offer */}
            <FadeIn delay={200}>
              <div className="mt-12">
                <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
                  I can help with
                </p>
                <ul className="space-y-2">
                  {contact.subjects.slice(0, -1).map((subject) => (
                    <li key={subject} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--gold)' }} />
                      {subject}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          {/* Right: Form */}
          <FadeIn delay={80}>
            <div
              className="rounded-3xl p-8 md:p-10"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <h2 className="font-heading text-2xl mb-6" style={{ color: 'var(--text)' }}>
                Send a message
              </h2>
              <ContactForm />
            </div>
          </FadeIn>

        </div>
      </div>
    </div>
  )
}
