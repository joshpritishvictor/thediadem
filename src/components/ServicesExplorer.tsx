import { m } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Service } from '../content/services'
import Reveal from './Reveal'
import ServiceCard from './ServiceCard'

/**
 * Services as a list with a detail panel: a sticky list on the left, one panel
 * per service on the right. The list follows the scroll, fading everything but
 * the service in view, and clicking a name scrolls to its panel.
 */
export default function ServicesExplorer({
  services,
}: {
  services: readonly Service[]
}) {
  const [active, setActive] = useState(services[0]?.slug)

  useEffect(() => {
    // The panel crossing the middle band of the viewport is the active one
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id.slice(8))
        }
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )
    for (const { slug } of services) {
      const panel = document.getElementById(`service-${slug}`)
      if (panel) observer.observe(panel)
    }
    return () => observer.disconnect()
  }, [services])

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-14">
      <nav
        aria-label="Services"
        className="hidden lg:sticky lg:top-28 lg:block lg:self-start"
      >
        <ul>
          {services.map(({ slug, title, shortLabel }) => {
            const current = slug === active

            return (
              <li key={slug} className="border-b border-ink/8 last:border-0">
                <a
                  href={`#service-${slug}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document
                      .getElementById(`service-${slug}`)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                  }}
                  aria-current={current ? 'true' : undefined}
                  className={`group relative block py-5 transition-all duration-500 ease-out-expo ${
                    current
                      ? 'translate-x-1 opacity-100'
                      : 'opacity-35 hover:translate-x-1 hover:opacity-70'
                  }`}
                >
                  {shortLabel && (
                    <span
                      className={`block text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${
                        current ? 'text-gold-600' : 'text-ink'
                      }`}
                    >
                      {shortLabel}
                    </span>
                  )}
                  <span className="mt-1 block text-xl font-medium text-teal-900">
                    {title}
                  </span>
                  {/* Underline that draws in under the active service */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-teal-900 transition-transform duration-500 ease-out-expo ${
                      current ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="space-y-5">
        {services.map((service) => (
          <Reveal key={service.slug}>
            <m.div id={`service-${service.slug}`} className="scroll-mt-28">
              <ServiceCard service={service} />
            </m.div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
