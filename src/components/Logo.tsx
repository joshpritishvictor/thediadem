import { Link } from 'react-router-dom'
import logo from '../assets/images/logo-diadem.svg'
import logoDark from '../assets/images/logo-diadem-dark.svg'

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center" aria-label="Diadem home">
      <img
        src={light ? logoDark : logo}
        alt="Diadem"
        width={212}
        height={64}
        className="h-14 w-auto"
      />
    </Link>
  )
}
