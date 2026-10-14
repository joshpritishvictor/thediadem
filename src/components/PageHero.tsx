import { ChevronRight } from 'lucide-react'
import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { fadeUp, stagger } from '../lib/motion'

type Crumb = { to: string; label: string }

type PageHeroProps = {
  eyebrow?: string
  title: string
  description?: ReactNode
  /** Breadcrumb trail between "Home" and the current page */
  crumbs?: Crumb[]
  image?: string
  /** Custom element for the right-hand side, used instead of the image */
  visual?: ReactNode
  children?: ReactNode
  /** Only the breadcrumb trail, so the page content starts straight away */
  compact?: boolean
}

/** Top section for inner pages: breadcrumbs, heading, optional image */
export default function PageHero({
  eyebrow,
  title,
  description,
  crumbs = [],
  image,
  visual,
  children,
  compact = false,
}: PageHeroProps) {
  const trail = [{ to: '/', label: 'Home' }, ...crumbs]

  if (compact) {
    return (
      <section className="container-page pt-24 pb-2 md:pt-28">
        <h1 className="sr-only">{title}</h1>
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-sm text-ink/50"
        >
          {trail.map((crumb) => (
            <span key={crumb.to} className="inline-flex items-center gap-1.5">
              <Link to={crumb.to} className="hover:text-teal-900">
                {crumb.label}
              </Link>
              <ChevronRight size={14} />
            </span>
          ))}
          <span aria-current="page" className="text-ink/80">
            {title}
          </span>
        </nav>
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden bg-beige pt-28 pb-10 md:pt-32 md:pb-14">
      {/* Same background as the home hero: the video under a beige gradient that is solid behind the text and fades out to the right */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-beige via-beige/80 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-beige/70 to-transparent"
        aria-hidden="true"
      />

      <m.div
        className={`relative container-page ${image || visual ? 'grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]' : ''}`}
        initial="hidden"
        animate="visible"
        variants={stagger(0.08)}
      >
        <div>
          <m.nav
            variants={fadeUp}
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-sm text-ink/50"
          >
            {[{ to: '/', label: 'Home' }, ...crumbs].map((crumb) => (
              <span key={crumb.to} className="inline-flex items-center gap-1.5">
                <Link to={crumb.to} className="hover:text-teal-900">
                  {crumb.label}
                </Link>
                <ChevronRight size={14} />
              </span>
            ))}
            <span aria-current="page" className="text-ink/80">
              {title}
            </span>
          </m.nav>

          {eyebrow && (
            <m.p variants={fadeUp} className="mt-8 eyebrow">
              {eyebrow}
            </m.p>
          )}
          <m.h1
            variants={fadeUp}
            className={`${eyebrow ? 'mt-4' : 'mt-8'} text-4xl leading-[1.1] font-bold sm:text-5xl lg:text-6xl`}
          >
            {title}
          </m.h1>
          {description && (
            <m.div
              variants={fadeUp}
              className="mt-6 max-w-2xl text-lg text-ink/65"
            >
              {description}
            </m.div>
          )}
          {children && <m.div variants={fadeUp}>{children}</m.div>}
        </div>

        {visual && (
          <m.div variants={fadeUp} className="w-full justify-self-center">
            {visual}
          </m.div>
        )}

        {image && (
          <m.div
            variants={fadeUp}
            className="overflow-hidden rounded-[2rem] shadow-2xl shadow-teal-900/15"
          >
            <img
              src={image}
              alt=""
              width={1200}
              height={800}
              fetchPriority="high"
              className="aspect-[3/2] w-full object-cover"
            />
          </m.div>
        )}
      </m.div>
    </section>
  )
}
