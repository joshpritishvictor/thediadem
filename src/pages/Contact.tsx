import ContactForm from '../components/ContactForm'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { contactForm, contactPage } from '../content/contact'

export default function Contact() {
  return (
    <>
      <Seo title="Contact Us" description={contactPage.body} />
      <PageHero title="Contact Us" compact />

      <section className="container-page pt-6 section-b">
        {/* Same heading style as the other pages: gold, capitals, centred */}
        <Reveal className="mb-8 text-center">
          <h2 className="font-sans eyebrow text-base! font-bold md:text-xl!">
            {contactPage.heading}
          </h2>
          <p className="mt-2 text-sm font-semibold text-ink/60">
            {contactPage.body}
          </p>
        </Reveal>

        {/* One slim strip of four contact facts, above the form */}
        <Reveal>
          <ul className="grid divide-y divide-ink/8 overflow-hidden rounded-3xl border border-ink/8 bg-card shadow-sm sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {contactPage.details.map(({ icon: Icon, title, body, href }) => (
              <li key={title} className="flex items-center gap-3 px-5 py-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-teal-900 text-gold-300 ring-4 ring-gold-500/20">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <h2 className="text-[0.65rem] font-bold tracking-[0.18em] text-gold-600 uppercase">
                    {title}
                  </h2>
                  {href ? (
                    <a
                      href={href}
                      className="block text-sm font-semibold text-teal-900 hover:underline"
                    >
                      {body}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold text-teal-900">
                      {body}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="mt-6">
          <div className="rounded-3xl bg-teal-900 p-6 text-cream shadow-sm sm:p-8">
            <h2 className="text-2xl font-bold text-[#f2eacf]">
              {contactForm.heading}
            </h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
