import CtaBanner from '../components/CtaBanner'
import PageHero from '../components/PageHero'
import Reveal, { RevealItem } from '../components/Reveal'
import Seo from '../components/Seo'
import ServiceCard from '../components/ServiceCard'
import { howWeHelp } from '../content/home'
import { featuredServices } from '../content/services'

export default function Services() {
  return (
    <>
      <Seo title="Our Services" description={howWeHelp.heading} />
      <PageHero
        eyebrow="Our Services"
        title="Services"
        description={howWeHelp.heading}
      />

      <section className="container-page pb-8">
        <Reveal staggerChildren={0.1} className="grid gap-8 md:grid-cols-2">
          {featuredServices.map((service) => (
            <RevealItem key={service.slug}>
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </Reveal>
      </section>

      <CtaBanner {...howWeHelp.notSure} />
    </>
  )
}
