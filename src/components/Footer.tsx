import { Mail, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { contact, navLinks } from '../lib/navigation'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-teal-950 text-cream">
      <div className="grain" />
      <div className="relative container-page grid gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl font-bold">
            Diadem <span className="text-gold-500">&amp;</span> Co.
          </p>
          <p className="mt-3 max-w-xs text-sm text-cream/60">
            Build wisely, sow strategically, reap abundantly.
          </p>
        </div>

        <div>
          <p className="eyebrow text-gold-400">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-cream/70 transition-colors hover:text-gold-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold-400">Contact Us</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={contact.phoneHref}
                className="inline-flex items-center gap-2 text-cream/70 transition-colors hover:text-gold-300"
              >
                <Phone size={16} /> {contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 text-cream/70 transition-colors hover:text-gold-300"
              >
                <Mail size={16} /> {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-cream/10">
        <div className="container-page flex flex-wrap justify-between gap-4 py-6 text-xs text-cream/50">
          <p>&copy; {new Date().getFullYear()} Diadem &amp; Co.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-cream">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-cream">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
