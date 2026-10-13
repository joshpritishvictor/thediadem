import { AnimatePresence, m, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import type { approach } from '../content/home'
import { easeOutExpo } from '../lib/motion'

type Area = (typeof approach.focusAreas)[number]

// How long each area stays open before the next one opens by itself
// (matches --animate-progress in index.css)
const CYCLE_MS = 7000

/**
 * The focus areas as a numbered list with one area open at a time. It moves
 * on to the next area by itself (a gold bar shows the time left), and pauses
 * while the visitor hovers over or focuses it. Clicking an area opens it.
 */
export default function FocusAreas({ areas }: { areas: readonly Area[] }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const ref = useRef<HTMLOListElement>(null)
  const inView = useInView(ref, { margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const cycling = inView && !paused && !reduceMotion

  useEffect(() => {
    if (!cycling) return
    const timer = window.setTimeout(
      () => setActive((i) => (i + 1) % areas.length),
      CYCLE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [cycling, active, areas.length])

  return (
    <ol
      ref={ref}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="space-y-3"
    >
      {areas.map(({ icon: Icon, title, body }, i) => {
        const open = i === active
        const panelId = `focus-area-${i}`
        return (
          <li
            key={title}
            className={`relative overflow-hidden rounded-3xl border transition-colors duration-500 ${
              open
                ? 'border-teal-900 bg-teal-900 text-cream shadow-xl shadow-teal-900/20'
                : 'border-ink/8 bg-white hover:border-gold-500/40'
            }`}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setActive(i)}
              className="flex w-full items-center gap-4 px-5 py-2.5 text-left"
            >
              <span
                className={`w-6 shrink-0 font-display text-sm font-bold tabular-nums transition-colors duration-500 ${
                  open ? 'text-gold-400' : 'text-gold-600'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors duration-500 ${
                  open
                    ? 'bg-gold-500 text-teal-950'
                    : 'bg-teal-900 text-gold-400'
                }`}
              >
                <Icon size={19} />
              </span>
              <span className="font-display text-lg leading-snug font-semibold">
                {title}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <m.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: easeOutExpo }}
                >
                  {/* Indented to line up with the icon: padding + number + gap */}
                  <p className="pr-5 pb-4 pl-[3.75rem] text-sm leading-relaxed text-cream/75">
                    {body}
                  </p>
                </m.div>
              )}
            </AnimatePresence>

            {/* Time left before the next area opens */}
            {open && (
              <span
                key={`${active}-${cycling}`}
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gold-500 ${
                  cycling ? 'animate-progress' : 'scale-x-0'
                }`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
