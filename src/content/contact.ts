import { Clock, Mail, Phone, Video } from 'lucide-react'
import { site } from './site'

export const contactPage = {
  eyebrow: 'Contact Us',
  heading: 'Virtual advisory and intake',
  body: 'Dollar Mount operates digitally to serve incorporated professionals, business owners, and families across Alberta.',
  details: [
    {
      icon: Video,
      title: 'Virtual consultations',
      body: 'Video or phone',
    },
    {
      icon: Clock,
      title: 'Response time',
      body: '1 business day',
    },
    {
      icon: Phone,
      title: 'Call us',
      body: site.contact.phone,
      href: site.contact.phoneHref,
    },
    {
      icon: Mail,
      title: 'Direct contact',
      body: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
  ],
}

export const contactForm = {
  heading: 'Request a Discovery Call',
  submit: 'Send Request',
  success: {
    heading: 'Thank you. We’ve received your request.',
    body: 'A member of our team will review it and reach out within 1 business day.',
  },
  error: `Something went wrong sending your request. Please try again, or email us at ${site.contact.email}.`,
  consent:
    'I agree to receive electronic communications (educational articles, tax updates, service announcements) from Dollar Mount. I can withdraw consent anytime via the unsubscribe link.',
  preferredContact: ['Email', 'Phone', 'Video Call'],
  // Service options come from the featured services, plus this catch-all
  serviceCatchAll: 'Combination of the above',
  entityTypes: [
    'Sole proprietor / self employed',
    'Incorporated business owner',
    'Professional corporation',
    'Employee',
    'Others / Not sure',
  ],
}
