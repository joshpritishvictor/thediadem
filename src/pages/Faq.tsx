import { Link } from 'react-router-dom'
import Accordion from '../components/Accordion'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { faqJsonLd } from '../lib/schema'
import { faqPage, faqs } from '../content/faq'
import { contactLink, site } from '../content/site'

export default function Faq() {
  const { contactPrompt } = faqPage

  return (
    <>
      <Seo
        title={faqPage.heading}
        description={faqs[0].answer}
        jsonLd={faqJsonLd(faqs)}
      />
      <PageHero eyebrow={faqPage.eyebrow} title={faqPage.heading} />

      <section className="container-page pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <Accordion items={faqs} />
          </Reveal>

          <Reveal delay={0.15} className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl bg-teal-900 p-8 text-cream">
              <div className="grain" />
              <div className="absolute -top-16 -right-16 size-48 animate-blob rounded-full bg-gold-500/25 blur-3xl" />
              <div className="relative">
                <h2 className="text-2xl font-semibold">
                  {contactPrompt.heading}
                </h2>
                <p className="mt-3 text-cream/70">{contactPrompt.body}</p>
                <Link to={contactLink.to} className="btn-primary mt-6">
                  {contactPrompt.cta}
                </Link>
                <p className="mt-6 text-sm text-cream/60">
                  Or call{' '}
                  <a
                    href={site.contact.phoneHref}
                    className="font-semibold text-gold-300 hover:underline"
                  >
                    {site.contact.phone}
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
