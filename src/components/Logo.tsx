import { Link } from 'react-router-dom'
import logo from '../assets/images/logo-dollarmount.svg'
import logoDark from '../assets/images/logo-dollarmount-dark.svg'
import logoFlat from '../assets/images/logo-dollarmount-flat.svg'
import logoFlatDark from '../assets/images/logo-dollarmount-flat-dark.svg'

type Props = {
  /** Lighter gold for dark backgrounds */
  light?: boolean
  /** "layered" is the bevelled stacked artwork; "flat" is the gradient version with the name beside the mark */
  variant?: 'layered' | 'flat'
}

export default function Logo({ light = false, variant = 'layered' }: Props) {
  const flat = variant === 'flat'
  const src = flat ? (light ? logoFlatDark : logoFlat) : light ? logoDark : logo
  return (
    <Link to="/" className="flex items-center" aria-label="Dollar Mount home">
      <img
        src={src}
        alt="Dollar Mount"
        width={flat ? 190 : 92}
        height={flat ? 56 : 72}
        className={flat ? 'h-12 w-auto sm:h-14' : 'h-14 w-auto sm:h-18'}
      />
    </Link>
  )
}
