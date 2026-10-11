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
  children?: ReactNode
}

/** Top section for inner pages: breadcrumbs, heading, optional image */
export default function PageHero({
  eyebrow,
  title,
  description,
  crumbs = [],
  image,
  children,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24">
      <div className="absolute -top-32 -right-24 size-[28rem] animate-blob rounded-full bg-gold-300/30 blur-3xl" />
      <div className="absolute top-40 -left-32 size-96 animate-blob rounded-full bg-sage-300/40 blur-3xl [animation-delay:-8s]" />

      <m.div
        className={`relative container-page ${image ? 'grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]' : ''}`}
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
