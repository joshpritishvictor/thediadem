import type { Faq } from './services'

export type AdvancedItem = { title: string; description: string }

/** The "Advanced" column on each service page, keyed by service slug */
export const advancedByService: Record<string, AdvancedItem[]> = {
  'accounting-tax-solutions': [
    {
      title: 'Corporate Tax Planning',
      description:
        'Work with CPAs on year-round planning for your corporation: salary and dividend mix, timing of income and expenses, and use of the small business deduction.',
    },
    {
      title: 'Bookkeeping, Payroll & Financial Reporting',
      description:
        'Keep your books current with monthly bookkeeping, payroll and remittances, and clear financial statements you can use to make decisions.',
    },
    {
      title: 'Corporate Restructuring',
      description:
        'Explore ways to restructure your corporation, manage retained earnings, improve tax efficiency, and prepare for long-term growth or succession through qualified accounting professionals.',
    },
    {
      title: 'Year-End & Cross-Border Filings',
      description:
        'Prepare corporate year-end packages and handle more complex filings, such as multiple entities, holding companies and foreign income.',
    },
  ],
  'corporate-financial-advisory': [
    {
      title: 'Retained Earnings & Surplus Strategy',
      description:
        'Explore ways to put surplus cash in your corporation to work, balancing growth, liquidity, tax efficiency and risk.',
    },
    {
      title: 'Holding Company Structures',
      description:
        'Review whether a holding company could help protect assets, move funds between entities and support long-term planning.',
    },
    {
      title: 'Business Valuation & Exit Planning',
      description:
        'Understand what your business may be worth and plan the steps toward a sale, a transition to family or a management buyout.',
    },
    {
      title: 'Owner Compensation & Retirement Planning',
      description:
        'Coordinate how you pay yourself with your personal retirement goals, so income, taxes and savings work together.',
    },
  ],
  'insurance-risk-management': [
    {
      title: 'Corporate-Owned Life Insurance',
      description:
        'Learn how permanent life insurance held in a corporation may provide protection, tax-advantaged growth and estate-planning opportunities.',
    },
    {
      title: 'Key Person & Buy-Sell Coverage',
      description:
        'Protect the business if an owner or key employee is lost, and fund the buyout of a partner’s share smoothly.',
    },
    {
      title: 'Business Liability & Property Coverage',
      description:
        'Review commercial liability, property, cyber and professional coverage to find gaps before they become costly.',
    },
    {
      title: 'Critical Illness & Disability Protection',
      description:
        'Match coverage to your income and obligations so an illness or injury does not put the business or your family at risk.',
    },
  ],
  'corporate-legal-services': [
    {
      title: 'Shareholder & Partnership Agreements',
      description:
        'Put clear terms in place for ownership, decision-making, disputes and what happens when an owner leaves.',
    },
    {
      title: 'Corporate Reorganizations',
      description:
        'Restructure your corporation or add a holding company with the right legal steps and documents behind the plan.',
    },
    {
      title: 'Commercial Contracts & Agreements',
      description:
        'Have contracts with clients, suppliers, lenders and employees drafted or reviewed so your rights are protected.',
    },
    {
      title: 'Wills, Powers of Attorney & Estate Documents',
      description:
        'Align your personal legal documents with your business plans so your wishes are followed and the transition is orderly.',
    },
  ],
  'tax-strategy': [
    {
      title: 'Income Splitting & Family Structures',
      description:
        'Explore compliant ways to share income across family members and entities, within the current tax rules.',
    },
    {
      title: 'Tax-Efficient Extraction of Wealth',
      description:
        'Plan how and when to take money out of your corporation to reduce the overall tax you and the business pay.',
    },
    {
      title: 'Capital Gains & Lifetime Exemption Planning',
      description:
        'Prepare your shares and assets ahead of a sale to make the most of available exemptions and deferral options.',
    },
    {
      title: 'Ongoing Review as Rules Change',
      description:
        'Revisit your strategy each year so changes to your business, family or the tax rules are reflected in your plan.',
    },
  ],
  'estate-legacy-planning': [
    {
      title: 'Estate Tax & Probate Planning',
      description:
        'Reduce taxes and delays on death through planning for ownership, beneficiaries and the use of trusts where appropriate.',
    },
    {
      title: 'Succession for Family Businesses',
      description:
        'Plan how leadership and ownership pass to the next generation, with fair treatment of family members in and out of the business.',
    },
    {
      title: 'Insurance-Funded Estate Liquidity',
      description:
        'Use insurance to provide cash when it is needed, so assets do not have to be sold to cover taxes or equalize shares.',
    },
    {
      title: 'Charitable Giving & Legacy Goals',
      description:
        'Build giving into your estate plan in a tax-aware way, so your values continue beyond your lifetime.',
    },
  ],
}

export const advancedFor = (slug: string): Faq[] =>
  (advancedByService[slug] ?? []).map(({ title, description }) => ({
    question: title,
    answer: description,
  }))
