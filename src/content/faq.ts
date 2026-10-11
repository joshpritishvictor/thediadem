import type { Faq } from './services'

export const faqPage = {
  eyebrow: 'FAQs',
  heading: 'Frequently Asked Questions',
  contactPrompt: {
    heading: 'Have a specific question not answered here?',
    body: 'Reach out and we’ll point you to the right answer — or the right professional.',
    cta: 'Contact Us',
  },
}

export const faqs: Faq[] = [
  {
    question:
      'What makes your approach different from a standard financial advisor?',
    answer:
      'Standard advisors typically focus on investment selection alone. We take a different approach — connecting you with a network of professionals across accounting, insurance, financial advisory, and legal, so your financial decisions aren’t made in isolation from each other.',
  },
  {
    question:
      'Do I need to fire my current accountant or lawyer to work with you?',
    answer:
      'Not at all. We can work alongside your existing professionals to keep everyone connected, or match you with trusted, licensed specialists from our network if you have gaps in your current team.',
  },
  {
    question: 'What are your fees?',
    answer:
      'Because we connect you with independent, licensed professionals across different disciplines (CPAs, financial advisors, insurance brokers, and corporate lawyers), fees vary based on the specific services required. Transparency is paramount, and fee structures are clearly outlined at respective virtual meetings before any work begins.',
  },
  {
    question: 'Is the first consultation really free?',
    answer:
      'Yes. Our initial discovery call comes with no cost or obligation. It gives us the opportunity to understand your corporate or personal requirements and identify which licensed professionals from our network are best suited to help.',
  },
  {
    question: 'Who is your ideal client?',
    answer:
      'We primarily serve business owners, incorporated professionals, high-net-worth individuals, and families in Alberta who want a streamlined, coordinated approach across their accounting, financial advisory, risk management, and corporate legal requirements.',
  },
  {
    question: 'Do you sell proprietary investment products?',
    answer:
      'No. Diadem & Co. is an independent access and coordination platform, not a product manufacturer. When investment or insurance needs arise, we match you with licensed, independent advisors and brokers who recommend products and solutions tailored to your unique situation.',
  },
  {
    question: 'How often will we meet once I become a client?',
    answer:
      'Meeting cadence depends on the complexity of your needs. Most clients engage in structured quarterly or bi-annual reviews, with additional touchpoints scheduled around key tax deadlines, corporate filings, or major financial transitions.',
  },
]
