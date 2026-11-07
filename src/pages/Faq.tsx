import Accordion from '../components/Accordion'
import CtaBanner from '../components/CtaBanner'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { faqJsonLd } from '../lib/schema'
import { faqPage, faqs } from '../content/faq'

export default function Faq() {
  return (
    <>
      <Seo
        title={faqPage.heading}
        description={faqs[0].answer}
        jsonLd={faqJsonLd(faqs)}
      />
      <PageHero title={faqPage.heading} compact />

      <section className="container-page pt-6 section-b">
        {/* Same heading style as the other pages: gold, capitals, centred */}
        <Reveal className="mb-8 text-center">
          <h2 className="font-sans eyebrow text-base! font-bold md:text-xl!">
            {faqPage.tagline}
          </h2>
        </Reveal>

        <Reveal>
          <Accordion surface="beige" items={faqs} defaultOpen={-1} />
        </Reveal>
      </section>

      <CtaBanner />
    </>
  )
}
