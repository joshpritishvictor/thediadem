import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'
import { m, useScroll } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Counter from '../components/Counter'
import CtaBanner from '../components/CtaBanner'
import HeroVisual from '../components/HeroVisual'
import PostCard from '../components/PostCard'
import Reveal, { RevealItem } from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import SpotlightCard from '../components/SpotlightCard'
import { posts } from '../content/blog'
import {
  approach,
  comparison,
  hero,
  howWeHelp,
  insights,
  outcomes,
  process,
  stats,
  whoWeAre,
} from '../content/home'
import { featuredServices, servicePath } from '../content/services'
import { contactLink, site } from '../content/site'
import { easeOutExpo } from '../lib/motion'

export default function Home() {
  return (
    <>
      <Seo
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          name: site.name,
          legalName: site.legalName,
          url: site.url,
          email: site.contact.email,
          telephone: site.contact.phone,
          areaServed: 'Alberta, Canada',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Calgary',
            addressRegion: 'AB',
            addressCountry: 'CA',
          },
        }}
      />
      <Hero />
      <Marquee />
      <WhoWeAre />
      <HowWeHelp />
      <Comparison />
      <Stats />
      <Approach />
      <Process />
      <Outcomes />
      <Insights />
      <CtaBanner />
    </>
  )
}

function Hero() {
  const words = hero.headline.flatMap((line, li) =>
    line
      .split(' ')
      .map((word, wi) => ({ word, accent: li > 0, br: wi === 0 && li > 0 })),
  )

  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      {/* Drifting brand-colour blobs */}
      <div className="absolute -top-32 -left-24 size-[28rem] animate-blob rounded-full bg-gold-300/40 blur-3xl" />
      <div className="absolute top-20 -right-32 size-[32rem] animate-blob rounded-full bg-sage-300/50 blur-3xl [animation-delay:-6s]" />
      <div className="absolute bottom-0 left-1/3 size-80 animate-blob rounded-full bg-gold-400/20 blur-3xl [animation-delay:-12s]" />

      <div className="relative container-page grid items-center gap-16 lg:grid-cols-2">
        <div>
          <m.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {hero.eyebrow}
          </m.p>

          <h1 className="mt-5 text-5xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl">
            {words.map(({ word, accent, br }, i) => (
              <span key={i}>
                {br && <br />}
                <span className="inline-block overflow-hidden pb-2 align-bottom">
                  <m.span
                    className={`inline-block ${accent ? 'text-shimmer' : ''}`}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.15 + i * 0.1,
                      ease: easeOutExpo,
                    }}
                  >
                    {word}
                  </m.span>
                </span>{' '}
              </span>
            ))}
          </h1>

          <m.p
            className="mt-6 max-w-lg text-lg text-ink/70"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: easeOutExpo }}
          >
            {hero.body}
          </m.p>

          <m.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: easeOutExpo }}
          >
            <Link to={contactLink.to} className="group btn-primary">
              {hero.cta}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link to="/our-services/" className="btn-ghost">
              Explore Services
            </Link>
          </m.div>
        </div>

        <m.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: easeOutExpo }}
        >
          <HeroVisual />
        </m.div>
      </div>
    </section>
  )
}

function Marquee() {
  const items = [
    ...featuredServices.map((s) => s.title),
    ...site.tagline.replace(/\.$/, '').split(', '),
  ]

  return (
    <div
      className="overflow-hidden border-y border-ink/5 bg-white/60 py-5"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
        {/* Rendered twice so the loop is seamless */}
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-lg font-semibold whitespace-nowrap text-teal-900/70 capitalize"
          >
            {item}
            <span className="size-1.5 rounded-full bg-gold-500" />
          </span>
        ))}
      </div>
    </div>
  )
}

function WhoWeAre() {
  return (
    <section className="container-page py-24 md:py-32">
      <SectionHeading eyebrow={whoWeAre.eyebrow} title={site.tagline} />
      <Reveal
        staggerChildren={0.08}
        className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {whoWeAre.items.map(({ icon: Icon, title, body }) => (
          <RevealItem key={title}>
            <SpotlightCard className="h-full">
              <span className="grid size-12 place-items-center rounded-2xl bg-gold-500/15 text-gold-600">
                <Icon size={22} />
              </span>
              <h3 className="mt-6 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-ink/60">{body}</p>
            </SpotlightCard>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  )
}

function HowWeHelp() {
  return (
    <section className="bg-white/50 py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          eyebrow={howWeHelp.eyebrow}
          title={howWeHelp.heading}
          align="center"
        />
        <Reveal
          staggerChildren={0.08}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {featuredServices.map(({ slug, icon: Icon, title, home }) => (
            <RevealItem key={slug}>
              <Link to={servicePath(slug)} className="group block h-full">
                <SpotlightCard className="flex h-full flex-col">
                  <span className="grid size-12 place-items-center rounded-2xl bg-teal-900 text-gold-400 transition-transform duration-500 group-hover:rotate-6">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold">
                    {home?.label ?? title}
                  </h3>
                  <p className="mt-2 text-sm text-ink/60">{home?.blurb}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-900">
                    {home?.cta ?? 'Learn more'}
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </SpotlightCard>
              </Link>
            </RevealItem>
          ))}
        </Reveal>

        <Reveal className="mt-10 flex flex-col items-center justify-between gap-6 rounded-3xl border border-gold-500/30 bg-gold-500/10 p-8 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-2xl font-semibold">
              {howWeHelp.notSure.heading}
            </h3>
            <p className="mt-2 text-ink/65">{howWeHelp.notSure.body}</p>
          </div>
          <Link to={contactLink.to} className="btn-primary shrink-0">
            {howWeHelp.notSure.cta}
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function Comparison() {
  const { traditional, diadem } = comparison

  return (
    <section className="container-page py-24 md:py-32">
      <SectionHeading
        eyebrow={comparison.eyebrow}
        title={comparison.heading}
        description={comparison.body}
        align="center"
      />

      <Reveal
        staggerChildren={0.15}
        className="mt-16 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr]"
      >
        <RevealItem>
          <div className="h-full rounded-[2rem] border border-ink/10 bg-white/50 p-8 md:p-10">
            <p className="eyebrow text-ink/40">{traditional.title}</p>
            <p className="mt-3 font-display text-2xl font-semibold text-ink/50">
              {traditional.tagline}
            </p>
            <ul className="mt-8 space-y-5">
              {traditional.points.map(({ title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink/8 text-ink/40">
                    <X size={14} strokeWidth={3} />
                  </span>
                  <span>
                    <span className="block font-semibold text-ink/70">
                      {title}
                    </span>
                    <span className="text-sm text-ink/45">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-ink/10 pt-6 text-sm font-semibold text-ink/50">
              {traditional.outcome}
            </p>
          </div>
        </RevealItem>

        <RevealItem className="grid place-items-center">
          <span className="grid size-16 place-items-center rounded-full border border-gold-500/40 bg-cream font-display text-lg font-bold text-gold-600">
            VS
          </span>
        </RevealItem>

        <RevealItem>
          <div className="relative h-full overflow-hidden rounded-[2rem] bg-teal-900 p-8 text-cream shadow-2xl shadow-teal-900/30 md:p-10">
            <div className="grain" />
            <div className="absolute -top-20 -right-20 size-64 animate-blob rounded-full bg-gold-500/25 blur-3xl" />
            <div className="relative">
              <p className="eyebrow text-gold-400">{diadem.title}</p>
              <p className="mt-3 font-display text-2xl font-semibold">
                {diadem.tagline}
              </p>
              <ul className="mt-8 space-y-5">
                {diadem.points.map(({ title, body }) => (
                  <li key={title} className="flex gap-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold-500 text-teal-950">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span>
                      <span className="block font-semibold">{title}</span>
                      <span className="text-sm text-cream/60">{body}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-cream/15 pt-6 text-sm font-semibold text-gold-300">
                {diadem.outcome}
              </p>
            </div>
          </div>
        </RevealItem>
      </Reveal>
    </section>
  )
}

function Stats() {
  return (
    <section className="relative overflow-hidden bg-teal-950 py-16 text-cream">
      <div className="grain" />
      <Reveal
        staggerChildren={0.1}
        className="relative container-page grid gap-10 text-center sm:grid-cols-3"
      >
        {stats.map(({ value, suffix, label }) => (
          <RevealItem key={label}>
            <Counter
              value={value}
              suffix={suffix}
              className="block text-shimmer font-display text-5xl font-bold md:text-6xl"
            />
            <p className="mt-2 text-sm tracking-[0.15em] text-cream/60 uppercase">
              {label}
            </p>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  )
}

function Approach() {
  return (
    <section className="container-page py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow={approach.eyebrow}
            title={
              <>
                One Strategy. <span className="text-shimmer">Zero Silos.</span>
              </>
            }
            description={approach.body}
          />
          <Reveal className="mt-8">
            <Link to={contactLink.to} className="btn-primary">
              {approach.cta}
            </Link>
          </Reveal>
        </div>

        <Reveal staggerChildren={0.08} className="grid gap-5 sm:grid-cols-2">
          {approach.benefits.map(({ icon: Icon, title, body }, i) => (
            <RevealItem
              key={title}
              className={
                i === approach.benefits.length - 1 ? 'sm:col-span-2' : ''
              }
            >
              <SpotlightCard className="h-full">
                <span className="grid size-12 place-items-center rounded-2xl bg-teal-900 text-gold-400">
                  <Icon size={22} />
                </span>
                <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-ink/60">{body}</p>
              </SpotlightCard>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

function Process() {
  const ref = useRef<HTMLOListElement>(null)
  // Draws the gold line as the steps scroll past
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 75%', 'end 50%'],
  })

  return (
    <section className="bg-white/50 py-24 md:py-32">
      <div className="container-page grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow={process.eyebrow}
            title={process.heading}
            description={process.body}
          />
          <Reveal className="mt-8">
            <Link to={contactLink.to} className="btn-primary">
              {process.cta}
            </Link>
          </Reveal>
        </div>

        <ol ref={ref} className="relative space-y-12 pl-14">
          <div className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-ink/10" />
          <m.div
            className="absolute top-2 bottom-2 left-[19px] w-0.5 origin-top bg-gold-500"
            style={{ scaleY: scrollYProgress }}
          />
          {process.steps.map(({ title, body }, i) => (
            <li key={title} className="relative">
              <span className="absolute top-0 -left-14 grid size-10 place-items-center rounded-full border-2 border-gold-500 bg-cream font-display text-sm font-bold text-teal-900">
                {String(i + 1).padStart(2, '0')}
              </span>
              <Reveal>
                <h3 className="pt-1.5 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-ink/65">{body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Outcomes() {
  return (
    <section className="container-page py-24 md:py-32">
      <SectionHeading eyebrow={outcomes.eyebrow} title={outcomes.heading} />
      <Reveal staggerChildren={0.1} className="mt-14 grid gap-6 lg:grid-cols-3">
        {outcomes.items.map(({ value, suffix, title, body }) => (
          <RevealItem key={title}>
            <SpotlightCard className="h-full">
              <Counter
                value={value}
                suffix={suffix}
                className="font-display text-5xl font-bold text-teal-900"
              />
              <h3 className="mt-4 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-ink/60">{body}</p>
            </SpotlightCard>
          </RevealItem>
        ))}
      </Reveal>
    </section>
  )
}

function Insights() {
  if (posts.length === 0) return null

  return (
    <section className="bg-white/50 py-24 md:py-32">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow={insights.eyebrow} title={insights.heading} />
          <Reveal>
            <Link to="/blog/" className="btn-ghost">
              View all articles
            </Link>
          </Reveal>
        </div>
        <Reveal
          staggerChildren={0.1}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.slice(0, 3).map((post) => (
            <RevealItem key={post.slug}>
              <PostCard post={post} />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
