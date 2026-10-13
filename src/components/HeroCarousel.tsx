import { Quote } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { heroSlides } from '../content/home'

type Slide = (typeof heroSlides)[number]

// How long each slide shows before the next one (matches the dot's fill bar)
const SLIDE_MS = 8000

/**
 * The hero's right half: one scenario at a time on a beige card. It advances by
 * itself, pausing while hovered or focused; dots, arrow keys and swipes
 * also move it. All slides share one grid cell, so the card is always as tall
 * as the longest slide and never jumps.
 */
export default function HeroCarousel({ slides }: { slides: readonly Slide[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  const swipeStart = useRef<number | null>(null)
  const playing = !paused && !reduceMotion
  const count = slides.length

  const go = (next: number) => setIndex((next + count) % count)

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(
      () => setIndex((i) => (i + 1) % count),
      SLIDE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [playing, index, count])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(index + 1)
    if (e.key === 'ArrowLeft') go(index - 1)
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Who we help"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onPointerDown={(e) => (swipeStart.current = e.clientX)}
      onPointerUp={(e) => {
        if (swipeStart.current === null) return
        const dx = e.clientX - swipeStart.current
        swipeStart.current = null
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
      }}
      className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-beige/85 p-7 text-ink shadow-2xl shadow-ink/10 backdrop-blur-md select-none sm:p-7"
    >
      <div className="grain" />

      <div className="relative grid">
        {slides.map((slide, i) => {
          const active = i === index
          return (
            <article
              key={slide.audience}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${slide.audience}`}
              aria-hidden={!active}
              className={`col-start-1 row-start-1 self-center transition duration-700 ease-out-expo ${
                active
                  ? 'translate-x-0 opacity-100'
                  : 'pointer-events-none translate-x-8 opacity-0'
              }`}
            >
              <p className="eyebrow text-gold-600">{slide.audience}</p>
              <h2 className="mt-3 text-2xl leading-tight font-bold text-balance sm:text-3xl">
                {slide.headline}
              </h2>
              <p className="mt-3 text-pretty text-ink/75">{slide.body}</p>
              <blockquote className="mt-5 flex gap-3 border-l-2 border-gold-500 pl-4 text-ink/90 italic">
                <Quote
                  size={16}
                  className="mt-1 shrink-0 rotate-180 text-gold-600"
                  aria-hidden="true"
                />
                <span className="text-balance">
                  {slide.quote}
                  <cite className="mt-1 block text-xs font-semibold tracking-wide text-ink/60 not-italic">
                    — {slide.attribution}
                  </cite>
                </span>
              </blockquote>
              <p className="mt-5 text-[15px] font-semibold text-gold-600">
                {slide.closer.split('\n').map((sentence) => (
                  <span key={sentence} className="block">
                    {sentence}
                  </span>
                ))}
              </p>
            </article>
          )
        })}
      </div>

      {/* Controls */}
      <div className="relative mt-5 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.audience}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show slide ${i + 1}: ${slide.audience}`}
              aria-current={i === index}
              className={`relative h-2 overflow-hidden rounded-full transition-all duration-500 ${
                i === index
                  ? 'w-10 bg-gold-400/30'
                  : 'w-2 bg-gold-400/60 hover:bg-gold-400'
              }`}
            >
              {/* The active dot fills up as its slide's time runs out */}
              {i === index && (
                <span
                  key={`${index}-${playing}`}
                  style={{ animationDuration: `${SLIDE_MS}ms` }}
                  className={`absolute inset-0 origin-left rounded-full bg-gold-400 ${
                    playing ? 'animate-progress' : ''
                  }`}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
