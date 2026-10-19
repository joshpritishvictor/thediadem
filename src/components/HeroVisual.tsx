import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/images/logo-mark.svg'
import { featuredServices, servicePath } from '../content/services'
import { heroAnimation } from '../lib/animations'

const LottiePlayer = lazy(() => import('./LottiePlayer'))

const positions = [
  'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
  'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
]

/** Hero illustration: a Lottie file if one is configured, otherwise the service pillars orbiting the crown */
export default function HeroVisual() {
  if (heroAnimation) {
    return (
      <Suspense fallback={<div className="aspect-square w-full" />}>
        <LottiePlayer src={heroAnimation} className="aspect-square w-full" />
      </Suspense>
    )
  }

  return (
    <nav
      aria-label="Our services"
      className="group/orbit @container relative mx-auto aspect-square w-full max-w-80 sm:max-w-md lg:max-w-[min(31rem,calc(100svh-14rem))]"
    >
      {/* Dashed orbit path */}
      <div
        aria-hidden="true"
        className="absolute inset-[9%] rounded-full border border-dashed border-teal-900/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-[32%] rounded-full border border-gold-500/30"
      />

      {/* Orbiting service links; each counter-rotates to stay upright, and the orbit pauses on hover or focus so they're easy to click */}
      <div className="absolute inset-[9%] animate-orbit group-focus-within/orbit:[animation-play-state:paused] group-hover/orbit:[animation-play-state:paused]">
        {featuredServices.slice(0, positions.length).map((service, i) => (
          <div key={service.slug} className={`absolute ${positions[i]}`}>
            <div className="animate-orbit-reverse group-focus-within/orbit:[animation-play-state:paused] group-hover/orbit:[animation-play-state:paused]">
              <Link
                to={servicePath(service.slug)}
                className="block rounded-full border border-gold-500/30 bg-cream px-[3.5cqw] py-[1.8cqw] text-[clamp(0.7rem,2.9cqw,0.875rem)] font-semibold whitespace-nowrap text-teal-900 shadow-lg shadow-teal-900/10 transition duration-300 hover:-translate-y-0.5 hover:border-gold-500 hover:shadow-xl"
              >
                {service.shortLabel ?? service.title}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Centre emblem. It and the badges are sized in container units (cqw) so they
          scale with the orbit and the side badges never reach the emblem */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 grid place-items-center"
      >
        <div className="relative grid size-[28cqw] animate-float place-items-center rounded-full bg-teal-900 shadow-2xl shadow-teal-900/40">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold-500" />
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold-500 [animation-delay:1.5s]" />
          <img src={logo} alt="" width={64} height={62} className="w-[18cqw]" />
        </div>
      </div>
    </nav>
  )
}
