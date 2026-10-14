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
 * also move it, and a swipe drags the slides along under the finger. All
 * slides share one grid cell, so the card is always as tall as the longest
 * slide and never jumps.
 */
export default function HeroCarousel({ slides }: { slides: readonly Slide[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = useReducedMotion()
  // How far the visitor has dragged the slides (null when not dragging)
  const [dragX, setDragX] = useState<number | null>(null)
  // Where the drag began; a ref so a quick swipe isn't lost between renders
  const dragStart = useRef<number | null>(null)
  const dragging = dragX !== null
  const playing = !paused && !dragging && !reduceMotion
  const count = slides.length

  const go = (next: number) => setIndex((next + count) % count)

  // Where each slide waits: the previous one to the left, the next one to the
  // right, so whichever way the carousel moves, the slide comes in from that side
  const offsetOf = (i: number) => {
    if (i === index) return 0
    if (i === (index - 1 + count) % count) return -1
    if (i === (index + 1) % count) return 1
    return i < index ? -1 : 1
  }

  const endDrag = (clientX: number) => {
    if (dragStart.current === null) return
    const dx = clientX - dragStart.current
    dragStart.current = null
    setDragX(null)
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
  }

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
      className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-beige/85 p-7 text-ink shadow-2xl shadow-ink/10 backdrop-blur-md select-none sm:p-7"
    >
      <div className="grain" />

      {/* pan-y: vertical swipes still scroll the page; sideways ones drag the slides */}
      <div
        onPointerDown={(e) => {
          dragStart.current = e.clientX
          setDragX(0)
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (dragStart.current !== null)
            setDragX(e.clientX - dragStart.current)
        }}
        onPointerUp={(e) => endDrag(e.clientX)}
        onPointerCancel={() => {
          dragStart.current = null
          setDragX(null)
        }}
        className="relative grid cursor-grab touch-pan-y active:cursor-grabbing"
      >
        {slides.map((slide, i) => {
          const active = i === index
          const offset = offsetOf(i)
          // While dragging, the slide being pulled in shows beside the current one
          const incoming =
            dragging && dragX !== 0 && offset === (dragX < 0 ? 1 : -1)
          return (
            <article
              key={slide.audience}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}: ${slide.audience}`}
              aria-hidden={!active}
              style={{
                transform: `translateX(calc(${offset} * (100% + 2.5rem) + ${dragX ?? 0}px))`,
              }}
              className={`col-start-1 row-start-1 self-center ${
                dragging ? '' : 'transition duration-700 ease-out-expo'
              } ${active || incoming ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
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
              <p className="mt-5 text-[15px] text-gold-600">
                {slide.closer.split('\n').map((sentence) => (
                  <span key={sentence} className="block">
                    <Emphasis text={sentence} phrase={slide.emphasis} />
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

/** The text with only the given phrase in bold */
function Emphasis({ text, phrase }: { text: string; phrase: string }) {
  const at = text.indexOf(phrase)
  if (at === -1) return text
  return (
    <>
      {text.slice(0, at)}
      <strong className="font-bold">{phrase}</strong>
      {text.slice(at + phrase.length)}
    </>
  )
}
