export const site = {
  name: 'Diadem',
  legalName: 'Diadem Strategies Inc.',
  tagline: 'Plan wisely, sow strategically, reap abundantly.',
  /** Home page title in search results; other pages set their own */
  homeTitle: 'Diadem | Accountants, Advisors & Lawyers Working as One',
  /** Default search snippet, used by the home page */
  description:
    'Diadem coordinates accountants, financial advisors, insurance advisors and lawyers for business owners in Calgary and across Alberta.',
  url: 'https://www.thediadem.ca',
  location: 'Calgary, Alberta, Canada',
  /** Where clients are served; shown next to the location (meetings are virtual) */
  serviceArea: 'Serving Calgary and all of Alberta',
  contact: {
    phone: '1-587-316-1691',
    phoneHref: 'tel:+15873161691',
    email: 'contact@thediadem.ca',
  },
}

// Paths mirror the WordPress URLs (with trailing slashes) so old links and SEO keep working
export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about-us/', label: 'About Us' },
  { to: '/our-services/', label: 'Services' },
  { to: '/faq/', label: 'FAQs' },
  { to: '/blog/', label: 'Blog' },
]

export const contactLink = { to: '/contact-us/', label: 'Contact Us' }

/** The one label used for every "book a consultation" button on the site */
export const bookingCta = 'Book a Free Consultation'

export const legalLinks = [
  { to: '/privacy-policy/', label: 'Privacy Policy' },
  { to: '/terms-conditions/', label: 'Terms & Conditions' },
]
