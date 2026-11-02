import type { Faq } from '../content/services'
import { site } from '../content/site'

/** Where Diadem works, for search engines: Calgary first, then the rest of the province */
const areaServed = [
  { '@type': 'City', name: 'Calgary' },
  { '@type': 'AdministrativeArea', name: 'Alberta' },
]

/** schema.org data describing the business, for the home page */
export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: site.name,
  legalName: site.legalName,
  description: site.description,
  url: site.url,
  email: site.contact.email,
  telephone: site.contact.phone,
  areaServed,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Calgary',
    addressRegion: 'AB',
    addressCountry: 'CA',
  },
})

/** schema.org data for one service page */
export const serviceJsonLd = (
  name: string,
  description: string,
  path: string,
) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: site.url + path,
  areaServed,
  provider: {
    '@type': 'ProfessionalService',
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    telephone: site.contact.phone,
  },
})

/** schema.org FAQPage data so questions can show as rich results in Google */
export const faqJsonLd = (items: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})
