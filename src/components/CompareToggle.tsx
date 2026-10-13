import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { AnimatePresence, m, type Variants } from 'motion/react'
import { useState } from 'react'
import type { comparison } from '../content/home'
import { easeOutExpo } from '../lib/motion'

type Side = 'traditional' | 'diadem'
type Props = Pick<typeof comparison, 'columns' | 'rows'>

// The Diadem thumbs-up pops in with a little wiggle, card by card, whenever
// it appears: when the section scrolls into view and on every switch back
const thumbsUp: Variants = {
  hidden: { scale: 0, rotate: -35 },
  visible: (i: number) => ({
    scale: [0, 1.25, 1],
    rotate: [-35, 18, -8, 0],
    transition: { duration: 0.8, delay: 0.15 + i * 0.08, ease: 'easeOut' },
  }),
}

/**
 * A before/after switch: the same five topic cards show the Diadem way (teal,
 * the default) or the traditional way (muted)
 */
export default function CompareToggle({ columns, rows }: Props) {
  const [side, setSide] = useState<Side>('diadem')
  const isDiadem = side === 'diadem'

  return (
    <div>
      {/* Switch */}
      <div className="flex justify-center">
        <div
          role="group"
          aria-label="Compare approaches"
          className="relative inline-flex rounded-full border border-ink/10 bg-white/70 p-1 shadow-sm"
        >
          {(['traditional', 'diadem'] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={side === option}
              onClick={() => setSide(option)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 sm:px-7 ${
                side === option
                  ? option === 'diadem'
                    ? 'text-cream'
                    : 'text-ink'
                  : 'text-ink/50 hover:text-ink'
              }`}
            >
              {side === option && (
                <m.span
                  layoutId="compare-pill"
                  className={`absolute inset-0 rounded-full ${
                    option === 'diadem' ? 'bg-teal-900' : 'bg-ink/10'
                  }`}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative">{columns[option]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <ul
        aria-live="polite"
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {rows.map((row, i) => (
          <li
            key={row.topic}
            style={{ transitionDelay: `${i * 60}ms` }}
            className={`relative flex min-h-44 flex-col overflow-hidden rounded-3xl border p-6 transition-colors duration-500 ${
              isDiadem
                ? 'border-teal-900 bg-teal-900 text-cream shadow-xl shadow-teal-900/20'
                : 'border-dashed border-ink/15 bg-white/40 text-ink/55'
            }`}
          >
            <div className="flex items-center gap-3">
              <p
                className={`eyebrow transition-colors duration-500 ${
                  isDiadem ? 'text-gold-400' : 'text-ink/40'
                }`}
              >
                {row.topic}
              </p>
              {isDiadem ? (
                <m.span
                  custom={i}
                  variants={thumbsUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid size-8 shrink-0 place-items-center rounded-full bg-gold-500 text-teal-950"
                >
                  <ThumbsUp size={15} strokeWidth={2.25} />
                </m.span>
              ) : (
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink/8 text-ink/40">
                  <ThumbsDown size={15} strokeWidth={2.25} />
                </span>
              )}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <m.p
                key={side}
                className={`mt-4 leading-snug text-pretty ${isDiadem ? 'font-medium' : ''}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.45,
                    delay: i * 0.06,
                    ease: easeOutExpo,
                  },
                }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              >
                {row[side]}
              </m.p>
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </div>
  )
}
