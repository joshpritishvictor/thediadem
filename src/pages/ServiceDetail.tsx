import { useParams } from 'react-router-dom'
import Accordion from '../components/Accordion'
import CtaBanner from '../components/CtaBanner'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import SectionHeading from '../components/SectionHeading'
import Seo from '../components/Seo'
import { faqJsonLd } from '../lib/schema'
import { advancedFor } from '../content/serviceAdvanced'
import { getService } from '../content/services'
import NotFound from './NotFound'

export default function ServiceDetail() {
  const service = getService(useParams().slug)
  if (!service) return <NotFound />

  const { slug, title, image, summary, intro, offerings, closing, faqs } =
    service
  // As many advanced items as basic ones, so the two columns match
  const advanced = advancedFor(slug).slice(0, offerings.length)

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
        compact
      />

      <section className="container-page pt-6 section-b">
        {/* Same style as the home page headings: gold, capitals, 20px, one line, centred */}
        <Reveal className="text-center">
          <h2 className="font-sans eyebrow text-base! font-bold md:text-xl! md:whitespace-nowrap">
            {intro.heading}
          </h2>
          <p className="mt-5 text-lg text-ink/65">{intro.body}</p>
        </Reveal>

        <div className="mt-12 grid items-start gap-8 lg:grid-cols-2">
          <Reveal>
            <h3 className="mb-4 text-center text-sm font-bold tracking-[0.2em] text-gold-600 uppercase">
              Basic
            </h3>
            <Accordion
              surface="beige"
              defaultOpen={-1}
              items={offerings.map(({ title: question, description }) => ({
                question,
                answer: description,
              }))}
            />
          </Reveal>

          {advanced.length > 0 && (
            <Reveal delay={0.15}>
              <h3 className="mb-4 text-center text-sm font-bold tracking-[0.2em] text-gold-600 uppercase">
                Advanced
              </h3>
              <Accordion surface="beige" items={advanced} defaultOpen={-1} />
            </Reveal>
          )}
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section-y">
          <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.5fr]">
            <SectionHeading
              eyebrow="FAQs"
              title="Common Questions Answered"
              className="lg:sticky lg:top-32 lg:self-start"
            />
            <Reveal>
              <Accordion surface="beige" items={faqs} defaultOpen={-1} />
            </Reveal>
          </div>
        </section>
      )}

      <CtaBanner
        service={title}
        heading={closing.heading}
        body={closing.body}
        cta={closing.cta}
      />
    </>
  )
}
