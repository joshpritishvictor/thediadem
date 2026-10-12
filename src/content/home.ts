import {
  BadgeCheck,
  Briefcase,
  MapPin,
  Network,
  ShieldCheck,
  Sprout,
  Target,
} from 'lucide-react'

export const hero = {
  eyebrow: 'Alberta’s Integrated Professional Network',
  headline: ['One Team.', 'One Goal.'],
  body: 'A team of Financial Planners, Tax Strategists, Insurance Advisors, and Lawyers — coordinated through Diadem, working as one for you.',
}

// Told as a three-chapter story on a timeline (see WhoWeAre in pages/Home.tsx)
export const whoWeAre = {
  eyebrow: 'Who We Are',
  chapters: [
    {
      icon: BadgeCheck,
      chapter: 'The Foundation',
      title: 'Licensed Professionals',
      body: 'Our team includes licensed experts across financial planning, tax, accounting, insurance, and legal.',
    },
    {
      icon: Network,
      chapter: 'The Connection',
      title: 'Our Network',
      body: 'Multiple experts, one shared approach. We collaborate to deliver integrated advice tailored to your goals.',
    },
    {
      icon: MapPin,
      chapter: 'The Roots',
      title: 'Proudly Alberta Based',
      body: 'We understand the local landscape and are committed to serving individuals, families, and businesses across Alberta.',
    },
  ],
}

export const howWeHelp = {
  eyebrow: 'How We Help You',
  heading:
    'Connect with trusted professionals across the services your business needs.',
}

export const comparison = {
  eyebrow: 'The Diadem Difference',
  heading: 'One Strategy. Every Expert. Better Outcomes.',
  body: 'Most people have advisors. We make sure they work together.',
  traditional: {
    title: 'Traditional Approach',
    tagline: 'Fragmented. Disconnected. Reactive.',
    points: [
      { title: 'Separate Advisors', body: 'Work independently' },
      { title: 'Multiple Appointments', body: 'Repeat your story' },
      { title: 'Different Recommendations', body: 'Not aligned' },
      { title: 'You Coordinate', body: 'You’re in the middle' },
      {
        title: 'Missed Opportunities',
        body: 'Reactive advice. Gaps in the plan.',
      },
    ],
    outcome: 'Missed opportunities. More stress.',
  },
  diadem: {
    title: 'The Diadem Approach',
    tagline: 'Integrated. Aligned. Proactive.',
    points: [
      { title: 'One Coordinated Team', body: 'Working together' },
      { title: 'One Strategy', body: 'Unified and aligned' },
      { title: 'Aligned Recommendations', body: 'Every decision connected' },
      { title: 'We Lead the Process', body: 'One point of accountability' },
      { title: 'Built for Growth', body: 'Proactive advice. One clear plan.' },
    ],
    outcome: 'Integrated advice. One team. Greater confidence.',
  },
}

// Merges the former stats band and "Strategies Built for Real Outcomes" cards
export const stats = [
  {
    value: 100,
    suffix: '%',
    label: 'Licensed Alberta Network',
    detail:
      'Every partner across accounting, advisory, insurance, and legal holds active provincial credentials.',
  },
  {
    value: 15,
    suffix: '+',
    label: 'Years of Collective Experience',
    detail:
      'Helping individuals, families and business owners build wisely and protect what they’ve earned.',
  },
  {
    value: 200,
    suffix: '+',
    label: 'Trusted Clients',
    detail: 'Individuals, families and businesses across Alberta.',
  },
  {
    value: 4,
    suffix: '',
    label: 'Pillars, One Strategy',
    detail:
      'Accounting, advisory, insurance, and legal — one point of contact keeps everything aligned.',
  },
]

export const approach = {
  eyebrow: 'Our Approach',
  heading: 'Your Advisors,',
  headingAccent: 'Finally in Sync.',
  body: 'Most financial professionals work independently. We don’t. At Diadem, your Financial Planner, Tax Strategist, Accountant, and Lawyer work together under one coordinated strategy—so every decision supports your long-term success.',
  benefits: [
    {
      icon: Target,
      title: 'Proactive Tax Planning',
      body: 'We plan ahead to reduce tax exposures and maximize opportunities.',
    },
    {
      icon: Sprout,
      title: 'Long-Term Wealth Strategies',
      body: 'Strategies designed to build, protect, and grow your wealth for generations.',
    },
    {
      icon: Briefcase,
      title: 'Business & Personal Integration',
      body: 'Aligning your business and personal finances for greater efficiency and growth.',
    },
    {
      icon: ShieldCheck,
      title: 'Estate & Legacy Protection',
      body: 'Comprehensive planning to protect your assets and provide for the people you care about.',
    },
  ],
}

export const process = {
  eyebrow: 'Our Process',
  heading: 'Your Path From First Call to Coordinated Plan',
  steps: [
    {
      title: 'Initial Consultation',
      body: 'A complimentary 30-minute consultation to understand your financial situation, goals, challenges, and expectations — and review the data from your Financial Needs Analysis.',
    },
    {
      title: 'Cross-Discipline Analysis',
      body: 'We analyze your accounting, legal structure, tax liabilities, and insurance coverage to uncover risks and missed opportunities.',
    },
    {
      title: 'Strategy Development',
      body: 'We build a coordinated plan — covering financial planning, tax optimization, and legal considerations through our legal partners.',
    },
    {
      title: 'Execution & Ongoing Oversight',
      body: 'We coordinate execution across your team of professionals and stay engaged — reviewing progress and adjusting the plan as your life, business and goals evolve.',
    },
  ],
}

export const insights = {
  eyebrow: 'Our Blog',
  heading: 'Finance Insights, Updates and Trends',
}
