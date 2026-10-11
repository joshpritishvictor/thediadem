import { Clock, Mail, Video } from 'lucide-react'
import { site } from './site'

export const contactPage = {
  eyebrow: 'Contact Us',
  heading: 'Virtual advisory and intake',
  body: 'Diadem & Co operates digitally to serve incorporated professionals, business owners, and families across Alberta.',
  details: [
    {
      icon: Video,
      title: 'Virtual consultations',
      body: 'Video or phone, anywhere in Alberta.',
    },
    {
      icon: Clock,
      title: 'Response time',
      body: 'Reviewed within 1 business day.',
    },
    {
      icon: Mail,
      title: 'Direct contact',
      body: site.contact.email,
      href: `mailto:${site.contact.email}`,
    },
  ],
  privacyNote:
    'Diadem & Co respects your privacy. Information submitted here is handled securely under PIPEDA and used solely to evaluate your needs and connect you with appropriate independent professionals.',
  booking: {
    heading: 'Prefer to pick a time?',
    body: 'Book your complimentary discovery call directly in our calendar.',
    url: 'https://api.leadconnectorhq.com/widget/booking/MxkDdGqxzvSJiYgtfWX9',
  },
}

export const contactForm = {
  heading: 'Request a Discovery Call',
  submit: 'Request a Discovery Call',
  success: {
    heading: 'Thank you — we’ve received your request.',
    body: 'A member of our team will review it and reach out within 1 business day.',
  },
  error: `Something went wrong sending your request. Please try again, or email us at ${site.contact.email}.`,
  consent:
    'I agree to receive electronic communications (educational articles, tax updates, service announcements) from Diadem & Co. I can withdraw consent anytime via the unsubscribe link.',
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
