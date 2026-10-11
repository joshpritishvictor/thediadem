import { Link } from 'react-router-dom'
import logo from '../assets/images/logo.webp'

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      to="/"
      className="flex items-center gap-3"
      aria-label="Diadem & Co. home"
    >
      <img src={logo} alt="" width={105} height={160} className="h-11 w-auto" />
      <span
        className={`font-display text-xl font-bold tracking-tight ${light ? 'text-cream' : 'text-ink'}`}
      >
        Diadem <span className="text-gold-500">&amp;</span> Co.
      </span>
    </Link>
  )
}
