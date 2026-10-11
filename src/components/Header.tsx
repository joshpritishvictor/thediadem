import { Menu, X } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'motion/react'
import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navLinks } from '../lib/navigation'

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
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo ${
        scrolled || menuOpen
          ? 'border-b border-ink/5 bg-cream/80 py-3 shadow-sm backdrop-blur-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container-page flex items-center justify-between gap-6">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          Diadem <span className="text-gold-500">&amp;</span> Co.
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className="relative px-4 py-2 text-sm font-medium"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-teal-900/8"
                      transition={{
                        type: 'spring',
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span
                    className={`relative transition-colors ${
                      isActive ? 'text-teal-900' : 'text-ink/60 hover:text-ink'
                    }`}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <Link to="/contact-us" className="btn-primary hidden md:inline-flex">
          Contact Us
        </Link>

        <button
          type="button"
          className="rounded-full p-2 md:hidden"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            className="container-page overflow-hidden md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col gap-1 py-4">
              {[...navLinks, { to: '/contact-us', label: 'Contact Us' }].map(
                ({ to, label }, i) => (
                  <motion.div
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
                          isActive
                            ? 'bg-teal-900/8 text-teal-900'
                            : 'text-ink/70'
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  </motion.div>
                ),
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
