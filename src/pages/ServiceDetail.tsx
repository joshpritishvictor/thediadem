import { ArrowRight, Check, ChevronRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Accordion from '../components/Accordion'
import Reveal, { RevealItem } from '../components/Reveal'
import Seo from '../components/Seo'
import { faqJsonLd, serviceJsonLd } from '../lib/schema'
import {
  getService,
  planCta,
  planSteps,
  servicePath,
  type Service,
} from '../content/services'
import { contactLink, site } from '../content/site'
import NotFound from './NotFound'

const h2Class = 'text-3xl leading-tight font-bold md:text-4xl'
const bodyClass = 'text-lg leading-relaxed text-ink/70'

/**
 * A service page walks the visitor through six steps: you're in the right
 * place (hero with a short form), the problem, we understand, how Diadem
 * helps, why Diadem, and the plan. The FAQs follow.
 */
export default function ServiceDetail() {
  const service = getService(useParams().slug)
  if (!service) return <NotFound />

  const { slug, title, heading, summary, image, seo, faqs } = service
  const description = seo?.description ?? summary

  return (
    <>
      <Seo
        title={title}
        fullTitle={seo?.title}
        description={description}
        image={image}
        jsonLd={[
          serviceJsonLd(heading, description, servicePath(slug)),
          ...(faqs.length > 0 ? [faqJsonLd(faqs)] : []),
        ]}
      />
      <Hero service={service} />
      <Problem service={service} />
      <Solutions service={service} />
      <Why service={service} />
      <Plan service={service} />

      {faqs.length > 0 && (
        <section className="section-y">
          <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <p className="eyebrow">FAQs</p>
              <h2 className={`mt-4 ${h2Class}`}>Common Questions</h2>
            </Reveal>
            <Reveal>
              <Accordion surface="beige" items={faqs} defaultOpen={-1} />
            </Reveal>
          </div>
        </section>
      )}
    </>
  )
}

/** Step 1: you're in the right place. Someone in a hurry can book straight away */
function Hero({
  service: { title, heading, lead, image },
}: {
  service: Service
}) {
  return (
    <section className="relative overflow-hidden bg-beige pt-24 pb-12 md:pt-28 md:pb-16">
      <img
        src={image}
        alt=""
        width={1200}
        height={800}
        fetchPriority="high"
        className="absolute inset-0 size-full object-cover"
      />
      {/* Solid behind the text so it stays readable, fading out to show the image */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-beige via-beige/95 to-beige/60 lg:via-beige/85 lg:to-beige/30"
        aria-hidden="true"
      />

      <div className="relative container-page">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-sm text-ink/55"
        >
          {[
            { to: '/', label: 'Home' },
            { to: '/our-services/', label: 'Services' },
          ].map((crumb) => (
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

        <div className="mt-6 max-w-4xl">
          <Reveal>
            <h1 className="text-4xl leading-[1.08] font-bold text-balance sm:text-5xl xl:text-6xl">
              {heading}
            </h1>
            <p className="mt-5 max-w-2xl text-lg font-medium text-ink/75 md:text-xl">
              {lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={`${contactLink.to}?service=${encodeURIComponent(title)}`}
                className="group btn-primary"
              >
                {planCta}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a
                href={site.contact.phoneHref}
                className="btn-ghost bg-beige/80 font-bold text-ink backdrop-blur-sm"
              >
                {site.contact.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** Steps 2 and 3: the problem in the visitor's own terms, then empathy */
function Problem({ service: { problem, understand } }: { service: Service }) {
  return (
    <section className="container-page section-y">
      <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
        <Reveal>
          <h2 className={h2Class}>{problem.heading}</h2>
          <div className="mt-6 space-y-4">
            {problem.paragraphs.map((paragraph) => (
              <p key={paragraph} className={bodyClass}>
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        {understand && (
          <Reveal delay={0.1} className="lg:self-center">
            <div className="rounded-3xl border border-gold-500/30 bg-card p-6 md:p-8">
              <h2 className="text-2xl font-bold">{understand.heading}</h2>
              <p className="mt-4 leading-relaxed text-ink/70">
                {understand.body}
              </p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

/** Step 4: how Diadem solves it, one heading per service */
function Solutions({ service: { sections } }: { service: Service }) {
  return (
    <section className="bg-beige/60 section-y">
      <div className="container-page">
        <Reveal className="text-center">
          <p className="eyebrow">How Diadem Helps</p>
        </Reveal>
        <Reveal
          staggerChildren={0.1}
          className={`mt-8 grid gap-5 md:grid-cols-2 ${sections.length % 2 === 0 ? '' : 'lg:grid-cols-3'}`}
        >
          {sections.map(({ title, body }) => (
            <RevealItem key={title} className="h-full">
              <article className="h-full rounded-3xl border border-ink/8 bg-card p-6 md:p-7">
                <h2 className="text-xl leading-snug font-bold md:text-2xl">
                  {title}
                </h2>
                <p className="mt-3 leading-relaxed text-ink/70">{body}</p>
              </article>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

/** Step 5: the differentiator */
function Why({ service: { why } }: { service: Service }) {
  return (
    <section className="bg-teal-900 section-y text-cream">
      <div className="container-page grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <Reveal>
          <h2 className={`${h2Class} text-[#f2eacf]`}>{why.heading}</h2>
          <div className="mt-6 space-y-4">
            {why.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-cream/75"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:self-center">
          <ul className="space-y-3">
            {why.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold-500 text-teal-950">
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className="text-cream/85">{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

/** Step 6: a short plan instead of a generic button */
function Plan({ service: { title, planHeading } }: { service: Service }) {
  return (
    <section className="container-page section-y">
      <Reveal className="text-center">
        <p className="eyebrow">The Plan</p>
        <h2 className={`mt-4 ${h2Class}`}>{planHeading}</h2>
      </Reveal>
      <Reveal
        staggerChildren={0.12}
        className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3"
      >
        {planSteps.map((step, i) => (
          <RevealItem key={step.title} className="h-full">
            <div className="h-full rounded-3xl border border-ink/8 bg-card p-6 text-center">
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-teal-900 font-display text-lg font-bold text-gold-400">
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">
                {step.body}
              </p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
      <Reveal className="mt-10 text-center">
        <Link
          to={`${contactLink.to}?service=${encodeURIComponent(title)}`}
          className="group btn-primary"
        >
          {planCta}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </Reveal>
    </section>
  )
}
