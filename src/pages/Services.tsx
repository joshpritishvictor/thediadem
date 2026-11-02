import CtaBanner from '../components/CtaBanner'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import ServicesExplorer from '../components/ServicesExplorer'
import { featuredServices, servicesPage } from '../content/services'

export default function Services() {
  return (
    <>
      <Seo
        fullTitle={servicesPage.seo.title}
        description={servicesPage.seo.description}
      />
      <PageHero title="Services" compact ownHeading />

      <section className="container-page pt-6 pb-8">
        {/* Same heading style as the other pages: gold, capitals, centred */}
        <Reveal className="mb-8 text-center">
          <h1 className="font-sans eyebrow text-base! font-bold text-balance md:text-xl!">
            {servicesPage.heading}
          </h1>
          <p className="mx-auto mt-2 max-w-3xl text-sm font-semibold text-ink/60">
            {servicesPage.intro}
          </p>
        </Reveal>

        <ServicesExplorer services={featuredServices} />
      </section>

      <CtaBanner />
    </>
  )
}
