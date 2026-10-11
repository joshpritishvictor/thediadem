import { Mail, MapPin, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { featuredServices, servicePath } from '../content/services'
import { contactLink, legalLinks, navLinks, site } from '../content/site'
import Logo from './Logo'

const linkClass = 'text-cream/70 transition-colors hover:text-gold-300'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-teal-950 text-cream">
      <div className="grain" />
      <div className="relative container-page grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-cream/60">{site.tagline}</p>
        </div>

        <FooterColumn title="Quick Links">
          {[...navLinks, contactLink].map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className={linkClass}>
                {label}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Our Services">
          {featuredServices.map(({ slug, title }) => (
            <li key={slug}>
              <Link to={servicePath(slug)} className={linkClass}>
                {title}
              </Link>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact Us">
          <li>
            <a
              href={site.contact.phoneHref}
              className={`inline-flex items-center gap-2 ${linkClass}`}
            >
              <Phone size={16} /> {site.contact.phone}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${site.contact.email}`}
              className={`inline-flex items-center gap-2 ${linkClass}`}
            >
              <Mail size={16} /> {site.contact.email}
            </a>
          </li>
          <li className="inline-flex items-center gap-2 text-cream/70">
            <MapPin size={16} /> {site.location}
          </li>
        </FooterColumn>
      </div>

      <div className="relative border-t border-cream/10">
        <div className="container-page flex flex-wrap justify-between gap-4 py-6 text-xs text-cream/50">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}, operating as{' '}
            {site.name}
          </p>
          <div className="flex gap-6">
            {legalLinks.map(({ to, label }) => (
              <Link key={to} to={to} className="hover:text-cream">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div>
      <p className="eyebrow text-gold-400">{title}</p>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  )
}
