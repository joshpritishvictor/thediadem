export const site = {
  name: 'Diadem',
  legalName: 'Diadem Strategies Incorporated',
  tagline: 'Plan wisely, sow strategically, reap abundantly.',
  description:
    'Alberta’s integrated professional network. Financial planners, tax strategists, accountants, insurance advisors and lawyers, coordinated through Diadem, working as one for you.',
  url: 'https://www.thediadem.ca',
  location: 'Calgary, Alberta, Canada',
  contact: {
    phone: '1-587-316-1691',
    phoneHref: 'tel:+15873161691',
    email: 'contactus@diadem.co',
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
