import { ArrowRight, ChevronDown } from 'lucide-react'
import { m } from 'motion/react'
import { Link } from 'react-router-dom'
import { MottoTicker, StoryTimeline } from '../components/BrandStory'
import CompareToggle from '../components/CompareToggle'
import Counter from '../components/Counter'
import CtaBanner from '../components/CtaBanner'
import FocusAreas from '../components/FocusAreas'
import HeroCarousel from '../components/HeroCarousel'
import HeroVisual from '../components/HeroVisual'
import PostCard from '../components/PostCard'
import Reveal, { RevealItem } from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import { posts } from '../content/blog'
import {
  approach,
  comparison,
  hero,
  heroSlides,
  insights,
  process,
  stats,
  whoWeAre,
} from '../content/home'
import { bookingCta, contactLink, site } from '../content/site'
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
      <WhoWeAre />
      <Comparison />
      <StatsAndApproach />
      <Process />
      <Insights />
      <CtaBanner className="section-screen" />
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
    <section className="relative overflow-hidden bg-beige pt-28 pb-12 md:pt-32 md:pb-16 lg:flex lg:min-h-svh lg:items-center lg:pt-20 lg:pb-16">
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

      {/* Brand-colour gradient over the video, solid on the left behind the text and fading out to the right (same idea as enerva.ca) */}
      <div className="absolute inset-0 bg-gradient-to-r from-beige via-beige/80 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-beige/70 to-transparent" aria-hidden="true" />

      <div className="relative container-page grid items-center gap-10 lg:grid-cols-2 lg:items-end">
        <div>
          <m.p
            className="eyebrow text-ink"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {hero.eyebrow}
          </m.p>

          <h1 className="mt-3 text-5xl leading-[1.05] font-bold sm:text-6xl lg:text-6xl xl:text-7xl">
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
            className="mt-4 max-w-xl text-lg font-semibold text-balance text-ink [text-shadow:0_0_14px_rgb(246_238_219/0.9)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: easeOutExpo }}
          >
            {hero.body}
          </m.p>

          <m.div
            className="mt-6 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: easeOutExpo }}
          >
            <Link to={contactLink.to} className="group btn-primary">
              {bookingCta}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/our-services/"
              className="btn-ghost bg-beige/80 font-bold text-ink backdrop-blur-sm"
            >
              Explore Services
            </Link>
          </m.div>
        </div>

        <m.div
          className="w-full max-w-[26rem] lg:justify-self-end"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: easeOutExpo }}
        >
          <HeroCarousel slides={heroSlides} />
        </m.div>
      </div>

      {/* Scroll cue: only on desktop, where the hero fills the screen (lg:pb-24 keeps room for it) */}
      <m.button
        type="button"
        onClick={(e) =>
          e.currentTarget
            .closest('section')
            ?.nextElementSibling?.scrollIntoView({ behavior: 'smooth' })
        }
        aria-label="Scroll to the next section"
        className="group absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-xs font-semibold tracking-[0.2em] text-ink/80 uppercase transition-colors hover:text-ink lg:flex"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4, ease: easeOutExpo }}
      >
        Scroll
        <ChevronDown size={22} strokeWidth={2.5} className="animate-nudge" />
      </m.button>
    </section>
  )
}

/** The running motto band, then who we are: one section, one scroll stop */
function WhoWeAre() {
  return (
    <section className="flex flex-col lg:min-h-[calc(100svh-4.5rem)]">
      <div className="border-b border-gold-500/15 bg-beige/50 py-5 md:py-6">
        <MottoTicker text={site.tagline} />
      </div>
      {/* Centred in the space left under the band, with equal room above and below */}
      <div className="container-page flex flex-1 flex-col justify-center py-16 md:py-20 lg:py-10">
        <Reveal>
          <p className="text-center eyebrow">{whoWeAre.eyebrow}</p>
        </Reveal>
        <StoryTimeline chapters={whoWeAre.chapters} />
      </div>
    </section>
  )
}

function Comparison() {
  return (
    <section className="section-screen bg-sage-300/20">
      <div className="container-page">
        <Reveal>
          <h2 className="text-center font-sans eyebrow">
            {comparison.heading}
          </h2>
        </Reveal>
        <Reveal className="mt-6">
          <CompareToggle columns={comparison.columns} rows={comparison.rows} />
        </Reveal>
      </div>
    </section>
  )
}

/** The stats as a slim band across the top, then our approach: one section, one scroll stop */
function StatsAndApproach() {
  return (
    <section className="flex flex-col lg:min-h-[calc(100svh-4.5rem)]">
      <div className="relative overflow-hidden bg-teal-900 py-10 text-cream lg:py-5">
        <div className="grain" />
        <Reveal
          staggerChildren={0.1}
          className="relative container-page grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map(({ value, suffix, label }) => (
            <RevealItem key={label}>
              <Counter
                value={value}
                suffix={suffix}
                className="block text-shimmer font-display text-5xl font-bold lg:text-4xl"
              />
              <p className="mt-1 text-xs tracking-[0.15em] text-cream uppercase">
                {label}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </div>

      {/* Centred in the space left under the band, with equal room above and below */}
      <div className="container-page flex flex-1 flex-col justify-center py-16 md:py-20 lg:py-8">
        {/* Heading, then the four disciplines orbiting Diadem, then the focus areas */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1.3fr)] lg:items-center lg:gap-8">
          <SectionHeading
            eyebrow={approach.eyebrow}
            title={
              <>
                {approach.heading}{' '}
                <span className="text-shimmer">{approach.headingAccent}</span>
              </>
            }
            description={approach.body}
          />

          <Reveal>
            <HeroVisual />
          </Reveal>

          <Reveal>
            <FocusAreas areas={approach.focusAreas} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="section-screen bg-white/50">
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <SectionHeading eyebrow={process.eyebrow} title={process.heading} />
        </div>

        <ol className="relative space-y-12 pl-14 lg:space-y-6">
          <div className="absolute top-2 bottom-2 left-[19px] w-0.5 bg-ink/10" />
          {/* The gold line draws down through the steps once they're in view */}
          <m.div
            className="absolute top-2 bottom-2 left-[19px] w-0.5 origin-top bg-gold-500"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.6, ease: easeOutExpo }}
          />
          {process.steps.map(({ title, body }, i) => (
            <li key={title} className="relative">
              <span className="absolute top-0 -left-14 grid size-10 place-items-center rounded-full border-2 border-gold-500 bg-cream font-display text-sm font-bold text-teal-900">
                {String(i + 1).padStart(2, '0')}
              </span>
              <Reveal>
                <h3 className="pt-1.5 text-2xl font-semibold lg:text-xl">
                  {title}
                </h3>
                <p className="mt-3 text-ink/65 lg:mt-1.5 lg:text-sm">{body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Insights() {
  if (posts.length === 0) return null

  return (
    <section className="section-screen bg-beige/40">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow={insights.eyebrow}
            title={insights.heading}
            className="lg:max-w-4xl"
          />
          <Reveal>
            <Link to="/blog/" className="btn-ghost">
              View all articles
            </Link>
          </Reveal>
        </div>
        <Reveal
          staggerChildren={0.1}
          className="mt-10 grid gap-6 md:grid-cols-2 lg:mt-8 lg:grid-cols-3"
        >
          {posts.slice(0, 3).map((post) => (
            <RevealItem key={post.slug}>
              <PostCard post={post} compact />
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
