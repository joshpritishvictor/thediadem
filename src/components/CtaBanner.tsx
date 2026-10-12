import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { bookingCta, contactLink, site } from '../content/site'
import Reveal from './Reveal'

type CtaBannerProps = {
  heading?: string
  body?: string
  cta?: string
}

export default function CtaBanner({
  heading = 'Not sure where to start?',
  body = 'Tell us what you’re looking for and we’ll help connect you with the appropriate professional.',
  cta = bookingCta,
}: CtaBannerProps) {
  return (
    <section className="container-page section-y">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-teal-900 px-8 py-12 text-center text-cream md:px-16 md:py-16">
          <div className="grain" />
          <div className="absolute -bottom-32 -left-20 size-96 animate-blob rounded-full bg-gold-500/20 blur-3xl" />
          <div className="absolute -top-32 -right-20 size-96 animate-blob rounded-full bg-sage-500/30 blur-3xl [animation-delay:-8s]" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold md:text-5xl">{heading}</h2>
            <p className="mt-6 text-lg text-cream/70">{body}</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to={contactLink.to} className="group btn-primary">
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
          </div>
        </div>
      </Reveal>
    </section>
  )
}
