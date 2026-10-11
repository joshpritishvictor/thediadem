import { CalendarDays, Phone } from 'lucide-react'
import { useState } from 'react'
import ContactForm from '../components/ContactForm'
import PageHero from '../components/PageHero'
import Reveal, { RevealItem } from '../components/Reveal'
import Seo from '../components/Seo'
import { contactForm, contactPage } from '../content/contact'
import { site } from '../content/site'

export default function Contact() {
  return (
    <>
      <Seo title="Contact Us" description={contactPage.body} />
      <PageHero
        eyebrow={contactPage.eyebrow}
        title={contactPage.heading}
        description={contactPage.body}
      />

      <section className="container-page pb-24 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Reveal staggerChildren={0.08} className="space-y-4">
            {contactPage.details.map(({ icon: Icon, title, body, href }) => (
              <RevealItem key={title}>
                <div className="flex gap-4 rounded-3xl border border-ink/8 bg-white p-6">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-teal-900 text-gold-400">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h2 className="font-semibold">{title}</h2>
                    {href ? (
                      <a href={href} className="text-teal-800 hover:underline">
                        {body}
                      </a>
                    ) : (
                      <p className="text-ink/65">{body}</p>
                    )}
                  </div>
                </div>
              </RevealItem>
            ))}
            <RevealItem>
              <a
                href={site.contact.phoneHref}
                className="flex items-center gap-4 rounded-3xl bg-gold-500 p-6 font-semibold text-teal-950 transition hover:bg-gold-400"
              >
                <Phone size={22} /> {site.contact.phone}
              </a>
            </RevealItem>
            <RevealItem>
              <p className="px-2 text-xs text-ink/50">
                {contactPage.privacyNote}
              </p>
            </RevealItem>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-[2rem] border border-ink/8 bg-white p-6 shadow-xl shadow-teal-900/5 sm:p-10">
              <h2 className="text-3xl font-bold">{contactForm.heading}</h2>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>

        <BookingCalendar />
      </section>
    </>
  )
}

/** The third-party booking calendar loads only when asked for, keeping the page fast and cookie-free until then */
function BookingCalendar() {
  const [show, setShow] = useState(false)
  const { booking } = contactPage

  return (
    <Reveal className="mt-16 overflow-hidden rounded-[2rem] border border-ink/8 bg-white">
      <div className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
        <div>
          <h2 className="text-2xl font-semibold">{booking.heading}</h2>
          <p className="mt-2 text-ink/65">{booking.body}</p>
        </div>
        {!show && (
          <button
            type="button"
            onClick={() => setShow(true)}
            className="btn-primary"
          >
            <CalendarDays size={16} /> Show calendar
          </button>
        )}
      </div>
      {show && (
        <iframe
          src={booking.url}
          title="Book a discovery call"
          className="h-[720px] w-full border-t border-ink/8"
        />
      )}
    </Reveal>
  )
}
