import { Link, NavLink } from 'react-router-dom'
import { navLinks } from '../lib/navigation'

export default function Header() {
  return (
    <header className="border-b border-neutral-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-semibold">
          Diadem &amp; Co.
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                isActive ? 'font-semibold' : 'text-neutral-600 hover:text-black'
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}
