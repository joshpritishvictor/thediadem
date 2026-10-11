import {
  ArrowRight,
  Check,
  Compass,
  Landmark,
  Layers,
  ShieldCheck,
  Sprout,
  Users,
  X,
} from 'lucide-react'
import { motion, useScroll } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import HeroVisual from '../components/HeroVisual'
import Reveal, { RevealItem } from '../components/Reveal'
import SpotlightCard from '../components/SpotlightCard'
import { easeOutExpo } from '../lib/motion'
import { contact, services } from '../lib/navigation'

const benefits = [
  { icon: Users, title: 'One Coordinated Team' },
  { icon: Landmark, title: 'Proactive Tax Planning' },
  { icon: Sprout, title: 'Long-Term Wealth Strategies' },
  { icon: Layers, title: 'Business & Personal Integration' },
  { icon: ShieldCheck, title: 'Estate & Legacy Protection' },
]

const steps = [
  'Initial Consultation',
  'Cross-Discipline Analysis',
  'Strategy Development',
  'Execution & Ongoing Oversight',
]

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Approach />
      <Benefits />
      <Process />
      <CallToAction />
    </>
  )
}

function Hero() {
  const headline = ['One', 'Team.', 'One', 'Goal.']

  return (
    <section className="relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      {/* Drifting brand-colour blobs */}
      <div className="absolute -top-32 -left-24 size-[28rem] animate-blob rounded-full bg-gold-300/40 blur-3xl" />
      <div className="absolute top-20 -right-32 size-[32rem] animate-blob rounded-full bg-sage-300/50 blur-3xl [animation-delay:-6s]" />
      <div className="absolute bottom-0 left-1/3 size-80 animate-blob rounded-full bg-gold-400/20 blur-3xl [animation-delay:-12s]" />

      <div className="relative container-page grid items-center gap-16 lg:grid-cols-2">
        <div>
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Diadem &amp; Co.
          </motion.p>

          <h1 className="mt-5 text-5xl leading-[1.05] font-bold sm:text-6xl lg:text-7xl">
            {headline.map((word, i) => (
              <span
                key={i}
                className="inline-block overflow-hidden pb-2 align-bottom"
              >
                <motion.span
                  className={`inline-block ${i >= 2 ? 'text-shimmer' : ''}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.15 + i * 0.1,
                    ease: easeOutExpo,
                  }}
                >
                  {word}
                </motion.span>
                {i === 1 ? <br /> : ' '}
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-6 max-w-lg text-lg text-ink/70"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: easeOutExpo }}
          >
            Connect with trusted professionals across the services your business
            needs.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75, ease: easeOutExpo }}
          >
            <Link to="/contact-us" className="group btn-primary">
              Book a Consultation
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link to="/our-services" className="btn-ghost">
              Explore Services
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: easeOutExpo }}
        >
          <HeroVisual />
        </motion.div>
      </div>
    </section>
  )
}

function Marquee() {
  const items = [
    ...services,
    'Build wisely',
    'Sow strategically',
    'Reap abundantly',
  ]

  return (
    <div className="overflow-hidden border-y border-ink/5 bg-white/60 py-5">
      <div className="flex w-max animate-marquee gap-12 hover:[animation-play-state:paused]">
        {/* Rendered twice so the loop is seamless */}
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-lg font-semibold whitespace-nowrap text-teal-900/70"
            aria-hidden={i >= items.length}
          >
            {item}
            <span className="size-1.5 rounded-full bg-gold-500" />
          </span>
        ))}
      </div>
    </div>
  )
}

function Approach() {
  return (
    <section className="container-page py-24 md:py-32">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Why Diadem</p>
        <h2 className="mt-4 text-4xl font-bold md:text-5xl">
          Most people have advisors.{' '}
          <span className="text-teal-800">
            We make sure they work together.
          </span>
        </h2>
      </Reveal>

      <Reveal
        staggerChildren={0.15}
        className="mt-16 grid gap-6 md:grid-cols-2"
      >
        <RevealItem>
          <div className="h-full rounded-3xl border border-ink/10 bg-white/50 p-10">
            <p className="eyebrow text-ink/40">Traditional Approach</p>
            <ul className="mt-6 space-y-4">
              {['Fragmented.', 'Disconnected.', 'Reactive.'].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-display text-2xl font-semibold text-ink/40"
                >
                  <X size={20} className="text-ink/30" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>

        <RevealItem>
          <div className="relative h-full overflow-hidden rounded-3xl bg-teal-900 p-10 text-cream shadow-2xl shadow-teal-900/30">
            <div className="grain" />
            <div className="absolute -top-20 -right-20 size-64 animate-blob rounded-full bg-gold-500/25 blur-3xl" />
            <p className="relative eyebrow text-gold-400">
              The Diadem Approach
            </p>
            <ul className="relative mt-6 space-y-4">
              {['Integrated.', 'Aligned.', 'Proactive.'].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-display text-2xl font-semibold"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-gold-500 text-teal-950">
                    <Check size={16} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>
      </Reveal>
    </section>
  )
}

function Benefits() {
  return (
    <section className="bg-white/50 py-24 md:py-32">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Four pillars, one strategy</p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Most financial professionals work independently.{' '}
            <span className="text-shimmer">We don&apos;t.</span>
          </h2>
        </Reveal>

        <Reveal
          staggerChildren={0.08}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {benefits.map(({ icon: Icon, title }) => (
            <RevealItem key={title}>
              <SpotlightCard className="h-full">
                <span className="grid size-12 place-items-center rounded-2xl bg-teal-900 text-gold-400">
                  <Icon size={22} />
                </span>
                <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              </SpotlightCard>
            </RevealItem>
          ))}
          <RevealItem>
            <Link
              to="/our-services"
              className="group flex h-full min-h-48 flex-col justify-between rounded-3xl bg-gold-500 p-8 text-teal-950 transition duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-xl hover:shadow-gold-500/30"
            >
              <Compass size={28} />
              <span className="flex items-center justify-between font-display text-xl font-semibold">
                See all services
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </RevealItem>
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
    <section className="container-page py-24 md:py-32">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            Build wisely, sow strategically, reap abundantly.
          </h2>
        </Reveal>

        <ol ref={ref} className="relative space-y-12 pl-12">
          <div className="absolute top-2 bottom-2 left-[15px] w-0.5 bg-ink/10" />
          <motion.div
            className="absolute top-2 bottom-2 left-[15px] w-0.5 origin-top bg-gold-500"
            style={{ scaleY: scrollYProgress }}
          />
          {steps.map((step, i) => (
            <li key={step} className="relative">
              <span className="absolute top-0 -left-12 grid size-8 place-items-center rounded-full border-2 border-gold-500 bg-cream text-sm font-bold text-teal-900">
                {i + 1}
              </span>
              <Reveal>
                <p className="eyebrow text-ink/40">Step {i + 1}</p>
                <h3 className="mt-2 text-2xl font-semibold md:text-3xl">
                  {step}
                </h3>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function CallToAction() {
  return (
    <section className="container-page pb-24 md:pb-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-teal-900 px-8 py-16 text-center text-cream md:px-16 md:py-24">
          <div className="grain" />
          <div className="absolute -bottom-32 -left-20 size-96 animate-blob rounded-full bg-gold-500/20 blur-3xl" />
          <div className="absolute -top-32 -right-20 size-96 animate-blob rounded-full bg-sage-500/30 blur-3xl [animation-delay:-8s]" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold md:text-5xl">
              Tell us what you&apos;re looking for.
            </h2>
            <p className="mt-6 text-lg text-cream/70">
              We&apos;ll help connect you with the appropriate professional.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/contact-us" className="btn-primary">
                Contact Us <ArrowRight size={16} />
              </Link>
              <a href={contact.phoneHref} className="btn-ghost text-cream">
                {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
