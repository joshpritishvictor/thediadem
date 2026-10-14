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

      <section className="container-page section-b">
        <Reveal>
          <Accordion surface="beige" items={faqs} />
        </Reveal>
      </section>

      <CtaBanner />
    </>
  )
}
