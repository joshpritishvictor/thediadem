import { m, type Variants } from 'motion/react'
import { useState } from 'react'
import type { process } from '../content/home'
import { easeOutExpo } from '../lib/motion'

type Step = (typeof process.steps)[number]

// Each row comes in after the one before it: the row rises, then the line below its number draws down to the next
const STEP_DELAY = 0.45

const row: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, delay: i * STEP_DELAY, ease: easeOutExpo },
  }),
}

const node: Variants = {
  hidden: { scale: 0, rotate: -90 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 16,
      delay: i * STEP_DELAY,
    },
  }),
}

const spine: Variants = {
  hidden: { scaleY: 0 },
  visible: (i: number) => ({
    scaleY: 1,
    transition: {
      duration: 0.45,
      delay: i * STEP_DELAY + 0.3,
      ease: 'easeInOut',
    },
  }),
}

/**
 * The steps as a graph: numbered circles on a vertical line down the left,
 * then each step's heading, then its description, in three aligned columns.
 * Hovering or focusing a row lights the line up to it and pulses its number.
 */
export default function ProcessPath({ steps }: { steps: readonly Step[] }) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <m.ol
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      onMouseLeave={() => setActive(null)}
      className="mx-auto mt-8 grid max-w-5xl auto-rows-fr lg:mt-6"
    >
      {steps.map(({ title, body }, i) => {
        const reached = active !== null && i <= active
        const current = active === i
        const flowing = active !== null && i < active

        return (
          <m.li
            key={title}
            custom={i}
            variants={row}
            tabIndex={0}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className="relative grid cursor-default grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 px-2 py-5 outline-none lg:grid-cols-[3.5rem_minmax(0,18rem)_minmax(0,1fr)] lg:gap-x-5 lg:px-4 lg:py-4"
          >
            {/* Line down to the next circle: pale one draws in on scroll, gold one fills up to the hovered row */}
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute top-1/2 -bottom-1/2 left-[calc(0.5rem+1.75rem)] w-px lg:left-[calc(1rem+1.75rem)]"
              >
                <span className="absolute inset-0 bg-ink/10" />
                <m.span
                  custom={i}
                  variants={spine}
                  className="absolute inset-0 origin-top bg-gold-500/40"
                />
                <span
                  className={`absolute inset-0 origin-top bg-gold-500 transition-transform duration-500 ${
                    flowing ? 'scale-y-100' : 'scale-y-0'
                  }`}
                />
              </span>
            )}

            <m.div
              custom={i}
              variants={node}
              className="relative z-10 col-start-1 row-span-2 row-start-1 grid size-14 place-items-center lg:col-start-1 lg:row-span-1"
            >
              {/* Ripple while the row is active */}
              {current && (
                <m.span
                  aria-hidden="true"
                  className="absolute inset-1 rounded-full border-2 border-gold-500"
                  initial={{ scale: 1, opacity: 0.7 }}
                  animate={{ scale: 1.6, opacity: 0 }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}
              <m.span
                animate={{ scale: current ? 1.12 : 1 }}
                transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                className={`relative grid size-12 place-items-center rounded-full border-2 font-display text-sm font-bold transition-colors duration-300 ${
                  reached
                    ? 'border-gold-500 bg-teal-900 text-gold-400 shadow-lg shadow-gold-500/40'
                    : 'border-gold-500 bg-teal-900 text-gold-400'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
              </m.span>
            </m.div>

            <h3
              className={`col-start-2 row-start-1 self-end text-lg font-semibold transition-colors duration-300 lg:col-start-2 lg:self-center lg:text-xl ${
                current ? 'text-gold-600' : ''
              }`}
            >
              {title}
            </h3>
            <p
              className={`col-start-2 row-start-2 mt-1 text-sm leading-relaxed transition-colors duration-300 lg:col-start-3 lg:row-start-1 lg:mt-0 ${
                current ? 'text-ink' : 'text-ink/65'
              }`}
            >
              {body}
            </p>
          </m.li>
        )
      })}
    </m.ol>
  )
}
