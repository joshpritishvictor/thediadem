import { ArrowRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Accordion from '../components/Accordion'
import CtaBanner from '../components/CtaBanner'
import PageHero from '../components/PageHero'
import Reveal, { RevealItem } from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import { faqJsonLd } from '../lib/schema'
import SpotlightCard from '../components/SpotlightCard'
import { featuredServices, getService, servicePath } from '../content/services'
import { contactLink } from '../content/site'
import NotFound from './NotFound'

export default function ServiceDetail() {
  const service = getService(useParams().slug)
  if (!service) return <NotFound />

  const { slug, title, image, summary, intro, offerings, closing, faqs, cta } =
    service

  return (
    <>
      <Seo
        title={title}
        description={summary}
        image={image}
        jsonLd={faqJsonLd(faqs)}
      />
      <PageHero
        title={title}
        crumbs={[{ to: '/our-services/', label: 'Services' }]}
        description={summary}
        image={image}
      >
        <Link to={contactLink.to} className="group btn-primary mt-8">
          {cta}
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </PageHero>

      <section className="container-page pb-24 md:pb-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_18rem]">
          <div>
            <SectionHeading title={intro.heading} description={intro.body} />

            <Reveal
              staggerChildren={0.1}
              className="mt-12 grid gap-6 md:grid-cols-3"
            >
              {offerings.map(({ title: heading, description }, i) => (
                <RevealItem key={heading}>
                  <SpotlightCard className="h-full">
                    <span className="font-display text-sm font-bold text-gold-600">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-4 text-xl font-semibold">{heading}</h3>
                    <p className="mt-3 text-sm text-ink/60">{description}</p>
                  </SpotlightCard>
                </RevealItem>
              ))}
            </Reveal>
          </div>

          {/* Other services */}
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <nav
              aria-label="Our services"
              className="rounded-3xl border border-ink/8 bg-white p-6"
            >
              <p className="eyebrow">Our Services</p>
              <ul className="mt-4 space-y-1">
                {featuredServices.map((s) => {
                  const active = s.slug === slug
                  return (
                    <li key={s.slug}>
                      <Link
                        to={servicePath(s.slug)}
                        aria-current={active ? 'page' : undefined}
                        className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-teal-900 text-cream'
                            : 'text-ink/70 hover:bg-teal-900/5 hover:text-ink'
                        }`}
                      >
                        {s.title}
                        <ArrowRight size={14} />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </Reveal>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="bg-white/50 py-24 md:py-32">
          <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <SectionHeading
              eyebrow="FAQs"
              title="Common Questions Answered"
              className="lg:sticky lg:top-32 lg:self-start"
            />
            <Reveal>
              <Accordion items={faqs} />
            </Reveal>
          </div>
        </section>
      )}

      <CtaBanner
        heading={closing.heading}
        body={closing.body}
        cta={closing.cta}
      />
    </>
  )
}
