import { lazy, Suspense } from 'react'
import logo from '../assets/images/logo.webp'
import { featuredServices } from '../content/services'
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
    <div
      className="relative mx-auto aspect-square w-full max-w-60 sm:max-w-sm"
      aria-hidden="true"
    >
      {/* Dashed orbit path */}
      <div className="absolute inset-[12%] rounded-full border border-dashed border-teal-900/20" />
      <div className="absolute inset-[30%] rounded-full border border-gold-500/30" />

      {/* Orbiting service labels; each label counter-rotates to stay upright */}
      <div className="absolute inset-[12%] animate-orbit">
        {featuredServices.slice(0, positions.length).map((service, i) => (
          <div key={service.slug} className={`absolute ${positions[i]}`}>
            <div className="animate-orbit-reverse">
              <span className="block rounded-full border border-ink/5 bg-white/90 px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap text-teal-900 shadow-lg shadow-teal-900/10 backdrop-blur sm:px-4 sm:py-2 sm:text-xs">
                {service.home?.label ?? service.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Centre emblem */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="relative grid size-24 animate-float place-items-center rounded-full bg-teal-900 shadow-2xl shadow-teal-900/40 sm:size-36">
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold-500" />
          <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold-500 [animation-delay:1.5s]" />
          <img
            src={logo}
            alt=""
            width={105}
            height={160}
            className="h-16 w-auto sm:h-24"
          />
        </div>
      </div>
    </div>
  )
}
