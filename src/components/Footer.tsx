import Link         from 'next/link'
import { site, nav, footer } from '@/content/siteContent'

export function Footer() {
  return (
    <footer
      className="border-t mt-32"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="container-site py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">

          {/* Brand */}
          <div>
            <p className="font-heading text-2xl mb-3">
              {site.shortName}<span className="text-gold">.</span>
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {footer.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              Navigate
            </p>
            <ul className="flex flex-col gap-2">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-gold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase mb-4" style={{ color: 'var(--text-muted)' }}>
              Connect
            </p>
            <ul className="flex flex-col gap-2">
              {Object.entries(site.social).map(([platform, url]) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm capitalize transition-colors hover:text-gold"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {footer.copyright}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="text-xs transition-colors hover:text-gold"
            style={{ color: 'var(--text-muted)' }}
          >
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
