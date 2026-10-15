import { Menu, X } from 'lucide-react'
import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { getPost } from '../content/blog'
import { bookingCta, contactLink, navLinks } from '../content/site'
import { easeOutExpo } from '../lib/motion'
import Logo from './Logo'

// Highlight "Services" on service pages and "Blog" on posts/categories too
function isSectionActive(to: string, pathname: string) {
  switch (to) {
    case '/':
      return pathname === '/'
    case '/our-services/':
      return pathname === to || pathname.startsWith('/service/')
    case '/blog/':
      return (
        pathname === to ||
        pathname.startsWith('/category/') ||
        getPost(pathname.replace(/\//g, '')) !== undefined
      )
    default:
      return pathname.startsWith(to)
  }
}

export default function Header() {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const [menuPath, setMenuPath] = useState(pathname)

  // Close the mobile menu after navigating
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setMenuOpen(false)
  }

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 12))

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[padding,background-color,border-color,box-shadow,backdrop-filter] duration-500 ease-out-expo ${
        scrolled || menuOpen
          ? `border-ink/5 py-2 shadow-sm backdrop-blur-xl ${menuOpen ? 'bg-cream' : 'bg-cream/85'}`
          : 'border-transparent bg-cream/0 py-4 shadow-none backdrop-blur-none'
      }`}
    >
      <div className="container-page flex items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {navLinks.map(({ to, label }) => {
            const active = isSectionActive(to, pathname)
            return (
              <Link
                key={to}
                to={to}
                aria-current={active ? 'page' : undefined}
                className="relative px-4 py-2 text-sm font-medium"
              >
                {active && (
                  <m.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-teal-900/8"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span
                  className={`relative transition-colors ${
                    active ? 'text-teal-900' : 'text-ink/60 hover:text-ink'
                  }`}
                >
                  {label}
                </span>
              </Link>
            )
          })}
        </nav>

        <Link to={contactLink.to} className="btn-primary hidden lg:inline-flex">
          {bookingCta}
        </Link>

        <button
          type="button"
          className="rounded-full p-2 lg:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <m.nav
            id="mobile-menu"
            aria-label="Main"
            className="container-page overflow-hidden lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
          >
            <div className="flex flex-col gap-1 py-4">
              {[...navLinks, contactLink].map(({ to, label }, i) => (
                <m.div
                  key={to}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-3 font-medium ${
                        isActive ? 'bg-teal-900/8 text-teal-900' : 'text-ink/70'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </m.div>
              ))}
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
