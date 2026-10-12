import '@fontsource-variable/cinzel'
import { m, type Variants } from 'motion/react'
import { Fragment } from 'react'
import type { whoWeAre } from '../content/home'
import { easeOutExpo, stagger } from '../lib/motion'

type Chapter = (typeof whoWeAre.chapters)[number]

// Timeline choreography: the gold line draws at a constant speed and each
// chapter's marker appears the moment the line reaches it.
const LINE_START = 0.2
const STEP = 0.7 // seconds for the line to travel from one chapter to the next

const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: easeOutExpo },
  },
}

const track = (axis: 'x' | 'y', chapters: number): Variants => ({
  hidden: axis === 'x' ? { scaleX: 0 } : { scaleY: 0 },
  visible: {
    ...(axis === 'x' ? { scaleX: 1 } : { scaleY: 1 }),
    transition: {
      delay: LINE_START,
      duration: STEP * (chapters - 1),
      ease: 'linear',
    },
  },
})

const marker: Variants = {
  hidden: { scale: 0, rotate: 45, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 45,
    opacity: 1,
    transition: {
      delay: LINE_START + i * STEP,
      type: 'spring',
      bounce: 0.45,
      duration: 0.7,
    },
  }),
}

const chapterText: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: LINE_START + i * STEP + 0.15,
      duration: 0.8,
      ease: easeOutExpo,
    },
  }),
}

/** The brand line set in engraved capitals, matching the DIADEM wordmark */
export function RegalTagline({ text }: { text: string }) {
  const phrases = text.replace(/\.$/, '').split(/,\s*/)

  return (
    <m.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={stagger(0.18)}
    >
      <h2
        aria-label={text}
        className="flex flex-col items-center gap-2 text-center font-regal text-xl font-semibold tracking-[0.14em] text-ink uppercase sm:flex-row sm:justify-center sm:gap-[1.1em] sm:text-[clamp(0.8rem,2.05vw,1.6rem)] sm:whitespace-nowrap"
      >
        {phrases.map((phrase, i) => (
          <Fragment key={phrase}>
            {i > 0 && (
              <m.span
                aria-hidden="true"
                variants={fadeUpBlur}
                className="hidden size-[0.32em] rotate-45 bg-gold-500 sm:block"
              />
            )}
            <m.span aria-hidden="true" variants={fadeUpBlur}>
              {phrase}
            </m.span>
          </Fragment>
        ))}
      </h2>
    </m.div>
  )
}

/** Chapters on a timeline: horizontal on desktop, vertical on phones */
export function StoryTimeline({ chapters }: { chapters: readonly Chapter[] }) {
  return (
    <m.ol
      className="relative mt-14 grid gap-12 lg:grid-cols-3 lg:gap-0"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Desktop track: runs between the first and last marker centres */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-[16.667%] left-[16.667%] hidden h-px bg-ink/10 lg:block"
      >
        <m.div
          variants={track('x', chapters.length)}
          className="h-full origin-left bg-gold-500"
        />
      </div>
      {/* Phone track */}
      <div
        aria-hidden="true"
        className="absolute top-6 bottom-6 left-6 w-px bg-ink/10 lg:hidden"
      >
        <m.div
          variants={track('y', chapters.length)}
          className="h-full w-full origin-top bg-gold-500"
        />
      </div>

      {chapters.map(({ icon: Icon, chapter, title, body }, i) => (
        <li
          key={title}
          className="relative pl-20 lg:flex lg:flex-col lg:items-center lg:px-8 lg:pl-8 lg:text-center"
        >
          <m.span
            custom={i}
            variants={marker}
            aria-hidden="true"
            className="absolute top-0 left-0 grid size-12 place-items-center rounded-lg border border-gold-500 bg-cream shadow-lg shadow-gold-500/20 lg:relative"
          >
            <Icon size={20} className="-rotate-45 text-gold-600" />
          </m.span>

          <m.div custom={i} variants={chapterText} className="lg:mt-8">
            <p className="eyebrow">{chapter}</p>
            <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
            <p className="mt-3 max-w-md text-ink/65 lg:mx-auto lg:max-w-xs">
              {body}
            </p>
          </m.div>
        </li>
      ))}
    </m.ol>
  )
}
