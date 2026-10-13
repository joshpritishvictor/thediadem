import { m, type Variants } from 'motion/react'
import type { whoWeAre } from '../content/home'
import { easeOutExpo } from '../lib/motion'

type Chapter = (typeof whoWeAre.chapters)[number]

// Timeline choreography: the gold line draws at a constant speed and each
// chapter's marker appears the moment the line reaches it.
const LINE_START = 0.2
const STEP = 0.7 // seconds for the line to travel from one chapter to the next

/** `steps` is the track length measured in chapter-to-chapter spacings */
const track = (axis: 'x' | 'y', steps: number): Variants => ({
  hidden: axis === 'x' ? { scaleX: 0 } : { scaleY: 0 },
  visible: {
    ...(axis === 'x' ? { scaleX: 1 } : { scaleY: 1 }),
    transition: { delay: LINE_START, duration: STEP * steps, ease: 'linear' },
  },
})

// On desktop the chapters mirror the motto line above: the first starts on the
// left margin, the middle is centred and the last ends on the right margin
const desktopAlign = (i: number, count: number) =>
  i === 0
    ? 'lg:items-start lg:text-left'
    : i === count - 1
      ? 'lg:items-end lg:text-right'
      : 'lg:items-center lg:text-center'

const marker: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: (i: number) => ({
    scale: 1,
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

/**
 * The motto as a scrolling billboard ticker. Two identical runs sit side by
 * side and the strip slides left by half its width, so the loop is seamless.
 */
export function MottoTicker({ text }: { text: string }) {
  const phrases = text.replace(/\.$/, '').split(/,\s*/)
  // Repeat the phrases so one run is wider than the widest screens
  const run = [...phrases, ...phrases]

  return (
    <div className="group overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <h2 className="sr-only">{text}</h2>
      <div
        aria-hidden="true"
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused]"
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((phrase, i) => (
              <span
                key={i}
                className="flex items-center gap-[1.25em] pr-[1.25em] text-xl font-semibold tracking-[0.12em] whitespace-nowrap text-teal-900 uppercase md:text-2xl"
              >
                {phrase}
                <span className="size-[0.32em] rotate-45 bg-gold-500" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Chapters on a timeline: horizontal on desktop, vertical on phones */
export function StoryTimeline({ chapters }: { chapters: readonly Chapter[] }) {
  return (
    <m.ol
      className="relative mt-14 grid gap-12 lg:grid-cols-3 lg:gap-10"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {/* Desktop track: between the first and last marker centres. The outer markers sit 10px in so their rotated corners touch the margins */}
      <div
        aria-hidden="true"
        className="absolute top-6 right-[2.125rem] left-[2.125rem] hidden h-px bg-ink/10 lg:block"
      >
        <m.div
          variants={track('x', chapters.length - 1)}
          className="h-full origin-left bg-gold-500"
        />
      </div>
      {/* Phone track */}
      <div
        aria-hidden="true"
        className="absolute top-6 bottom-6 left-6 w-px bg-ink/10 lg:hidden"
      >
        <m.div
          variants={track('y', chapters.length - 1)}
          className="h-full w-full origin-top bg-gold-500"
        />
      </div>

      {chapters.map(({ icon: Icon, chapter, title, body }, i) => (
        <li
          key={title}
          className={`relative pl-20 lg:flex lg:flex-col lg:pl-0 ${desktopAlign(i, chapters.length)}`}
        >
          <m.span
            custom={i}
            variants={marker}
            aria-hidden="true"
            className="absolute top-0 left-0 grid size-12 rotate-45 place-items-center rounded-lg border border-gold-500 bg-cream shadow-lg shadow-gold-500/20 lg:relative lg:mx-2.5"
          >
            <Icon size={20} className="-rotate-45 text-gold-600" />
          </m.span>

          <m.div custom={i} variants={chapterText} className="lg:mt-8">
            <p className="eyebrow">{chapter}</p>
            <h3 className="mt-3 text-2xl font-semibold">{title}</h3>
            <p className="mt-3 max-w-md text-ink/65">{body}</p>
          </m.div>
        </li>
      ))}
    </m.ol>
  )
}
