import { ArrowRight } from 'lucide-react'
import { m } from 'motion/react'
import { Link } from 'react-router-dom'
import { bookingCta, contactLink, site } from '../content/site'
import Reveal from './Reveal'

type CtaBannerProps = {
  heading?: string
  body?: string
  cta?: string
  /** Service the button is about; the contact form opens with it pre-selected */
  service?: string
  /** Vertical spacing; the home page makes it fill a screen */
  className?: string
}

export default function CtaBanner({
  heading = 'Not sure where to start?',
  body = 'Tell us what you’re looking for and we’ll help connect you with the appropriate professional.',
  cta = bookingCta,
  service,
  className = 'section-y',
}: CtaBannerProps) {
  return (
    <section className={`container-page ${className}`}>
      <Reveal>
        {/* Slim and centred: the heading, one line of body text, and the buttons. It gently expands and contracts */}
        <div className="relative mx-auto max-w-4xl">
          <m.div
            className="relative overflow-hidden rounded-3xl bg-teal-900 px-6 py-5 text-center text-cream md:px-12 md:py-6"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <h2 className="text-xl font-bold md:text-2xl">{heading}</h2>
            <p className="mt-2 text-sm text-cream/70 md:text-pretty">{body}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Link
                to={
                  service
                    ? `${contactLink.to}?service=${encodeURIComponent(service)}`
                    : contactLink.to
                }
                className="group btn-primary"
              >
                {cta}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <a href={site.contact.phoneHref} className="btn-ghost text-cream">
                {site.contact.phone}
              </a>
            </div>
          </m.div>
        </div>
      </Reveal>
    </section>
  )
}
