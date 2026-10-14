import { ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { servicePath, type Service } from '../content/services'

// Three ticks sit in one row; other counts wrap in two columns
const columns: Record<number, string> = {
  1: 'sm:grid-cols-1',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
}

/** Detail panel for one service on /our-services/ */
export default function ServiceCard({ service }: { service: Service }) {
  const {
    slug,
    title,
    icon: Icon,
    shortLabel,
    summary,
    features,
    cta,
  } = service

  return (
    <article className="relative overflow-hidden rounded-3xl border border-ink/8 bg-white p-6 shadow-sm md:p-7">
      {/* Icon, title and badge share one row */}
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-teal-900 text-gold-400">
          <Icon size={22} />
        </span>
        <h3 className="min-w-0 flex-1 text-2xl font-semibold">{title}</h3>
        {shortLabel && (
          <span className="hidden shrink-0 rounded-full bg-gold-500/15 px-2.5 py-0.5 text-[0.65rem] leading-tight font-bold tracking-[0.15em] text-gold-600 uppercase sm:block">
            {shortLabel}
          </span>
        )}
      </div>

      <p className="mt-4 max-w-2xl leading-relaxed text-ink/65">{summary}</p>

      {features.length > 0 && (
        <ul
          className={`mt-4 grid gap-x-6 gap-y-2 text-sm ${columns[features.length] ?? 'sm:grid-cols-2'}`}
        >
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-gold-600" />
              {feature}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex justify-start">
        <Link
          to={servicePath(slug)}
          className="group inline-flex items-center gap-2 rounded-xl bg-teal-900 px-5 py-2.5 text-sm font-semibold text-cream transition duration-300 hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-lg hover:shadow-teal-900/25"
        >
          {cta}
          <ArrowUpRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </article>
  )
}
