import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Seo from '../components/Seo'
import { navLinks } from '../content/site'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <meta name="robots" content="noindex" />
      <PageHero
        eyebrow="404"
        title="Page not found"
        description="The page you’re looking for has moved or no longer exists. These might help:"
      >
        <ul className="mt-8 flex flex-wrap gap-3">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link to={to} className="group btn-ghost">
                {label}
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>
    </>
  )
}
