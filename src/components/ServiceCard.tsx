import { ArrowUpRight, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { servicePath, type Service } from '../content/services'

/** Large image card used on /our-services/ */
export default function ServiceCard({ service }: { service: Service }) {
  const { slug, title, icon: Icon, image, summary, features, cta } = service

  return (
    <Link
      to={servicePath(slug)}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-ink/8 bg-white shadow-sm transition duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-900/10"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt=""
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full object-cover transition duration-700 ease-out-expo group-hover:scale-105"
        />
        <span className="absolute bottom-0 left-8 grid size-14 translate-y-1/2 place-items-center rounded-2xl bg-teal-900 text-gold-400 shadow-lg">
          <Icon size={26} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-8 pt-12">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mt-3 text-ink/65">{summary}</p>
        {features.length > 0 && (
          <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <Check size={16} className="mt-0.5 shrink-0 text-gold-600" />
                {feature}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-8 font-semibold text-teal-900">
          {cta}
          <ArrowUpRight
            size={18}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  )
}
