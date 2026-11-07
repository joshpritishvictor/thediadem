import CtaBanner from '../components/CtaBanner'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import ServicesExplorer from '../components/ServicesExplorer'
import { featuredServices, servicesPage } from '../content/services'

export default function Services() {
  return (
    <>
      <Seo title="Our Services" description={servicesPage.intro} />
      <PageHero title="Services" compact />

      <section className="container-page pt-6 pb-8">
        {/* Same heading style as the other pages: gold, capitals, centred */}
        <Reveal className="mb-8 text-center">
          <h2 className="font-sans eyebrow text-base! font-bold md:text-xl!">
            Our Services
          </h2>
        </Reveal>

        <ServicesExplorer services={featuredServices} />
      </section>

      <CtaBanner />
    </>
  )
}
