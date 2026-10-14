import CtaBanner from '../components/CtaBanner'
import PageHero from '../components/PageHero'
import Seo from '../components/Seo'
import ServicesExplorer from '../components/ServicesExplorer'
import { featuredServices, servicesPage } from '../content/services'

export default function Services() {
  return (
    <>
      <Seo title="Our Services" description={servicesPage.intro} />
      <PageHero title="Services" compact />

      <section className="container-page pb-8">
        <ServicesExplorer services={featuredServices} />
      </section>

      <CtaBanner />
    </>
  )
}
