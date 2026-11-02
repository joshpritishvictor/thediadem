import {
  BadgeCheck,
  BadgePercent,
  MapPin,
  Network,
  PiggyBank,
  ShieldCheck,
  Sprout,
} from 'lucide-react'

export const hero = {
  eyebrow: 'Alberta’s Integrated Professional Network',
  // The H1: says what Diadem is. The second line gets the gold accent
  headline: [
    'Diadem: Alberta’s Coordinated Team of',
    'Accountants, Financial Advisors, Insurance Advisors and Lawyers',
  ],
  // The brand line, moved out of the H1
  body: 'One team. One goal. Your plan, built and run together.',
}

// The hero carousel (see HeroCarousel)
export const heroSlides = [
  {
    audience: 'Business Owners & Investors',
    headline: 'Are you aware of all your options?',
    body: 'Did you know insurance and investments can work together?',
    quote: 'Why hasn’t anyone shown me this before?',
    attribution: 'The question we hear most',
    closer: 'Most people are never shown this.\nWe make sure you are.',
    emphasis: 'We make sure you are.',
  },
  {
    audience: 'New Professionals',
    headline: 'Paying off student loans is only half the plan.',
    body: 'Small payments and no strategy won’t build or protect anything.',
    quote: 'I’ll think about investing once the debt is gone.',
    attribution: 'The habit that costs a decade',
    closer:
      'A coordinated plan clears the debt and builds your future at the same time.',
    emphasis: 'builds your future at the same time.',
  },
  {
    audience: 'The Surprise Bill',
    headline: '$50K bill? Credit card at 20–30% interest?',
    body: 'Cards and loans are the usual fix, but a coordinated plan can be smarter.',
    quote: 'I just put it on the card. What else was I supposed to do?',
    attribution: 'The cost of advisors who never talk',
    closer:
      'Your accountant, advisor, and lawyer talking to each other changes the answer.',
    emphasis: 'changes the answer.',
  },
  {
    audience: 'Estate & Succession',
    headline: 'What happens to everything you’ve built?',
    body: 'Without a plan, your family pays more tax, waits longer for the estate to settle, and your business may be worth far less without you.',
    quote: 'We’ll sort that out eventually.',
    attribution: 'But eventually is too late',
    closer:
      'Wills, insurance, structure, and tax, lined up.\nLet’s plan it now.',
    emphasis: 'Let’s plan it now.',
  },
  {
    audience: 'How We Work',
    headline: 'Plain language. Best outcome.',
    body: 'Our professionals explain every option simply, then agree on one strategy built for you.',
    quote: 'For the first time, everything actually made sense.',
    attribution: 'What coordinated advice feels like',
    closer: 'No jargon, no handoffs, just clarity.',
    emphasis: 'just clarity.',
  },
]

// Told as a three-chapter story on a timeline (see WhoWeAre in pages/Home.tsx)
export const whoWeAre = {
  eyebrow: 'Who We Are',
  chapters: [
    {
      icon: BadgeCheck,
      chapter: 'The Foundation',
      title: 'Licensed Professionals',
      body: 'Every professional in our network holds the credentials their discipline requires.',
    },
    {
      icon: Network,
      chapter: 'The Connection',
      title: 'Our Network',
      body: 'Independent professionals who collaborate to deliver advice tailored to your goals.',
    },
    {
      icon: MapPin,
      chapter: 'The Roots',
      title: 'Proudly Alberta Based',
      body: 'We understand the local landscape and are committed to serving individuals, families, and businesses across Alberta.',
    },
  ],
}

// Each row is one topic: the frustration of the usual way, and how Diadem handles it (see CompareToggle)
export const comparison = {
  heading: 'Coordinated Advice for Calgary and Alberta Business Owners',
  columns: { traditional: 'The traditional way', diadem: 'The Diadem way' },
  rows: [
    {
      topic: 'Your contact',
      traditional: 'A different firm for every need',
      diadem: 'One Diadem contact for all of it',
    },
    {
      topic: 'Your story',
      traditional: 'Retold at every appointment',
      diadem: 'Shared once, known by every professional',
    },
    {
      topic: 'The advice',
      traditional: 'Each expert plans in isolation',
      diadem: 'Every recommendation built to fit together',
    },
    {
      topic: 'The legwork',
      traditional: 'You chase, relay and reconcile',
      diadem: 'We handle the hand-offs between professionals',
    },
    {
      topic: 'The timing',
      traditional: 'Problems surface after deadlines pass',
      diadem: 'Opportunities flagged while there’s still time to act',
    },
  ],
}

export const stats = [
  { value: 100, suffix: '%', label: 'Licensed Alberta Network' },
  { value: 15, suffix: '+', label: 'Years of Collective Experience' },
  { value: 4, suffix: '', label: 'Professional Disciplines' },
]

export const approach = {
  eyebrow: 'Our Approach',
  heading: 'Your Advisors,',
  headingAccent: 'Finally in Sync.',
  body: 'So every decision supports your long-term success.',
  // Shown one at a time in FocusAreas, which cycles through them
  focusAreas: [
    {
      icon: BadgePercent,
      title: 'Corporate Tax Efficiency',
      body: 'Explore legitimate strategies to optimize corporate financial structures, identify tax-planning opportunities, and minimize unnecessary tax exposure.',
    },
    {
      icon: PiggyBank,
      title: 'Retained Earnings & Corporate Wealth',
      body: 'Understand how accumulated corporate profits can be strategically allocated, invested, or preserved to support long-term business and personal financial objectives.',
    },
    {
      icon: ShieldCheck,
      title: 'Insurance-Based Financial Strategies',
      body: 'Discover how appropriately structured corporate-owned permanent life insurance may provide financial protection, tax-advantaged policy growth, and estate-planning opportunities.',
    },
    {
      icon: Sprout,
      title: 'Wealth Extraction, Succession & Legacy',
      body: 'Explore strategies for accessing corporate wealth, planning business transitions, and transferring assets to future generations while managing potential tax consequences.',
    },
  ],
}

export const process = {
  eyebrow: 'Our Process',
  heading: 'Your First Call to a Coordinated Plan',
  steps: [
    {
      title: 'Initial Consultation',
      body: 'A complimentary 30-minute call to review your goals and intake information.',
    },
    {
      title: 'Cross-Discipline Analysis',
      body: 'Review your accounting, legal, tax, and insurance to uncover risks and missed opportunities.',
    },
    {
      title: 'Strategy Development',
      body: 'Our professionals build one coordinated plan, each part led by the right expert.',
    },
    {
      title: 'Execution & Ongoing Oversight',
      body: 'We coordinate your team to carry out the plan and adjust as your life evolves.',
    },
  ],
}

// Introduces each service with a link to its page. The link text is the search
// phrase each page targets, which tells Google what the linked page is about
export const servicesIntro = {
  heading: 'Every Professional Your Business Needs, Working as One',
  body: 'Diadem connects business owners and families in Calgary and across Alberta with licensed, independent professionals who plan together instead of in isolation.',
  items: [
    {
      before: 'Work with an ',
      link: 'accountant in Calgary',
      to: '/service/accounting-tax-solutions/',
      after:
        ' on corporate tax planning, bookkeeping, payroll and restructuring, planned before year-end rather than after it.',
    },
    {
      before: 'A ',
      link: 'tax accountant',
      to: '/service/personal-tax-accountant/',
      after:
        ' prepares your personal and family returns and finds the deductions, credits and income splitting you qualify for.',
    },
    {
      before: 'A ',
      link: 'financial advisor',
      to: '/service/corporate-financial-advisory/',
      after:
        ' helps you invest retained earnings, plan cash flow and prepare for succession.',
    },
    {
      before: 'The right ',
      link: 'business insurance',
      to: '/service/insurance-risk-management/',
      after:
        ', from key person and buy-sell coverage to corporate owned life insurance, protects what you’ve built.',
    },
    {
      before: 'A ',
      link: 'corporate lawyer',
      to: '/service/corporate-legal-services/',
      after:
        ' handles incorporation, shareholder agreements, reorganizations and contracts, in step with your tax plan.',
    },
  ],
}

export const insights = {
  seo: {
    title: 'Tax & Wealth Planning Blog for Alberta Owners | Diadem',
    description:
      'Tax, wealth and legal planning insights for business owners and incorporated professionals in Calgary and across Alberta.',
  },
  eyebrow: 'Our Blog',
  heading: 'Finance Insights, Updates and Trends',
}
