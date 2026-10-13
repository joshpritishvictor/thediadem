import {
  Calculator,
  Landmark,
  PiggyBank,
  Scale,
  ScrollText,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import taxImg from '../assets/images/blog/tax-efficient-accounts.webp'
import accountingImg from '../assets/images/services/accounting-tax.webp'
import legalImg from '../assets/images/services/corporate-legal.webp'
import advisoryImg from '../assets/images/services/financial-advisory.webp'
import insuranceImg from '../assets/images/services/insurance-risk.webp'

export type Faq = { question: string; answer: string }

export type Service = {
  slug: string
  title: string
  icon: LucideIcon
  image: string
  /** Listed on /our-services/, the home page hero and the contact form */
  featured: boolean
  /** One-line summary for cards */
  summary: string
  /** Shorter name for the home page hero orbit */
  shortLabel?: string
  features: string[]
  cta: string
  intro: { heading: string; body: string }
  offerings: { title: string; description: string }[]
  closing: { heading: string; body: string; cta: string }
  faqs: Faq[]
}

/** Each entry becomes a page at /service/<slug>/ */
export const services: Service[] = [
  {
    slug: 'accounting-tax-solutions',
    title: 'Accounting & Tax Solutions',
    icon: Calculator,
    image: accountingImg,
    featured: true,
    summary:
      'Connect with experienced Alberta CPAs and tax specialists for proactive corporate tax planning, bookkeeping, financial reporting, and payroll management.',
    shortLabel: 'Accounting',
    features: [
      'Corporate Tax Returns',
      'Bookkeeping & Payroll',
      'GST Compliance',
    ],
    cta: 'Connect with an Accounting Professional',
    intro: {
      heading: 'Confidence in Your Books and Taxes',
      body: 'Accurate accounting and proactive tax planning are the foundation of every healthy business—giving you a clear, current view of exactly where your business stands.',
    },
    offerings: [
      {
        title: 'Personal Tax Returns (T1)',
        description:
          'Connect with licensed tax specialists to manage and file your annual T1 personal tax returns accurately and on time.',
      },
      {
        title: 'Family Tax Coordination',
        description:
          'Access experienced CPAs to help align tax filings across family members, exploring income splitting opportunities, dependent credits, and household tax efficiency.',
      },
      {
        title: 'Deductions & Tax Credits',
        description:
          'Get matched with accountants who help identify eligible deductions, including medical expenses, tuition credits, charitable donations, and property tax credits.',
      },
    ],
    closing: {
      heading: 'Simplify Your Personal Taxes',
      body: 'Skip the stress of navigating tax deadlines on your own.',
      cta: 'Book Appointment With Accountant',
    },
    faqs: [],
  },
  {
    slug: 'corporate-financial-advisory',
    title: 'Corporate & Financial Advisory',
    icon: PiggyBank,
    image: advisoryImg,
    featured: true,
    summary:
      'Gain access to licensed financial planners to align your business cash flow, tax-efficient capital strategies, and long-term wealth preservation.',
    shortLabel: 'Financial Planning',
    features: [
      'Business Advisory',
      'Cash Flow Optimization',
      'Access to Investment Advisory',
      'Succession Planning',
    ],
    cta: 'Explore Advisory Access',
    intro: {
      heading: 'Clarity for Every Stage of Growth',
      body: 'Navigating corporate growth, capital allocation, and business transitions requires a clear financial perspective and a roadmap toward long-term stability.',
    },
    offerings: [
      {
        title: 'Cash Flow & Capital Planning',
        description:
          'Connect with advisors to analyze corporate cash flow, model working capital requirements, and build structured financial projections for scaling operations.',
      },
      {
        title: 'Corporate Growth Strategy',
        description:
          'Access experienced business advisors to evaluate performance metrics, refine corporate expansion plans, and align financial models with your business objectives.',
      },
      {
        title: 'Corporate Succession Planning',
        description:
          'Get matched with specialists who design business transition roadmaps, ownership exit strategies, and executive continuity plans for private companies.',
      },
    ],
    closing: {
      heading: 'Align Your Corporate Strategy',
      body: 'Skip the friction of fragmented business decision-making.',
      cta: 'Connect With a Corporate Advisor',
    },
    faqs: [
      {
        question: 'What does investment advisory at Diadem & Co. include?',
        answer:
          'Our investment advisory service covers portfolio architecture and asset allocation, risk assessment and management, corporate and personal investment account structuring, tax-efficient investment selection, and ongoing portfolio coordination. Unlike a traditional advisor who focuses solely on returns, we view every investment decision through a financial, tax, and legal lens simultaneously — ensuring your portfolio works as part of a complete wealth strategy rather than a standalone plan.',
      },
      {
        question: 'How do you manage investment risk for your clients?',
        answer:
          'We begin with a thorough assessment of your risk tolerance, income requirements, time horizon, and overall financial situation. From there, we build a diversified portfolio strategy designed to grow your wealth while minimizing unnecessary exposure to market volatility. We also integrate risk management tools such as proper insurance coverage and legal structures — ensuring your wealth is protected not just from market risk but from life’s unexpected events as well.',
      },
      {
        question: 'Do you manage investments inside a corporation?',
        answer:
          'Yes. Corporate investment account management is one of our core specialties. Many incorporated professionals and business owners accumulate significant retained earnings inside their corporation and need a strategy to invest those funds efficiently. We structure corporate investment accounts to maximize growth, minimize passive income tax exposure, and plan for the most tax-efficient extraction of those funds over time — whether for retirement, reinvestment, or wealth transfer.',
      },
      {
        question: 'How often will my investment portfolio be reviewed?',
        answer:
          'We conduct formal portfolio reviews at least annually and proactively reach out whenever there are significant changes in market conditions, tax legislation, or your personal circumstances. Major life events — such as a business sale, inheritance, retirement transition, or significant income change — trigger an immediate review to ensure your investment strategy remains perfectly aligned with your current situation and future goals.',
      },
      {
        question:
          'How does financial planning help my business and personal finances?',
        answer:
          'Integrated financial planning aligns your business cash flow with your personal wealth goals — reducing tax drag, improving investment efficiency, and ensuring your corporate and personal finances work together rather than against each other. When your financial plan is built holistically, every dollar you earn is directed with purpose — minimizing what you lose to tax and maximizing what you keep and grow.',
      },
      {
        question: 'What qualifications do your financial advisors hold?',
        answer:
          'Our advisors are licensed professionals with deep expertise across financial planning, investment management, and tax strategy. Every professional within the Diadem & Co. network holds the credentials required in their specific discipline — ensuring you receive advice that is not only strategic but fully compliant with Canadian regulatory standards. We believe your wealth deserves qualified, accountable professionals at every step.',
      },
      {
        question:
          'What is your approach to retirement and investment planning?',
        answer:
          'We take a comprehensive, tax-first approach to retirement and investment planning. Rather than simply selecting investment products, we build a strategy that considers your corporate structure, personal income needs, tax brackets, and long-term legacy goals simultaneously. This includes retirement income modeling, tax-efficient withdrawal sequencing, and corporate investment account structuring — ensuring you retire with confidence and keep more of what you’ve built.',
      },
    ],
  },
  {
    slug: 'insurance-risk-management',
    title: 'Insurance & Risk Management',
    icon: ShieldCheck,
    image: insuranceImg,
    featured: true,
    summary:
      'Protect your business, assets, and executive team through direct access to licensed insurance brokers who understand corporate risk in Alberta.',
    shortLabel: 'Corporate Insurance',
    features: [
      'Commercial Liability',
      'Property & Asset Coverage',
      'Key Person Insurance',
      'Employee Benefits',
    ],
    cta: 'Connect with an Insurance Broker',
    intro: {
      heading: 'Protect What You’ve Built',
      body: 'Insurance and risk management is about identifying real vulnerabilities and closing the gaps that matter.',
    },
    offerings: [
      {
        title: 'Matched to Your Situation',
        description:
          'Get connected with a licensed insurance broker who reviews your income, assets, corporate structure, and family obligations to recommend coverage suited to your full situation.',
      },
      {
        title: 'Coverage That Evolves With You',
        description:
          'Your risk profile changes as your wealth and responsibilities grow. Stay connected to a broker who can review your coverage as your assets, income, and family situation change.',
      },
      {
        title: 'Coverage That Fits Your Budget',
        description:
          'The right insurance strategy shouldn’t be an unnecessary expense. We help connect you with a broker who can help identify coverage suited to your needs and budget.',
      },
    ],
    closing: {
      heading: 'Don’t Let Gaps Cost You',
      body: 'When your advisor, accountant, and broker aren’t connected, small gaps can turn into real exposure.',
      cta: 'Connect With An Insurance Broker',
    },
    faqs: [
      {
        question: 'Why is insurance important as part of a wealth strategy?',
        answer:
          'Insurance is the foundation that makes every other part of your wealth strategy viable. You can have the best investment portfolio, the most efficient corporate structure, and the most comprehensive tax plan — but a single uninsured event such as a critical illness, disability, or premature death can unravel everything instantly. At Diadem & Co., we integrate insurance into your overall financial plan as a strategic tool — not an afterthought — ensuring that no matter what life brings, your wealth, your family, and your legacy remain fully protected.',
      },
      {
        question:
          'What types of insurance do you recommend for incorporated professionals?',
        answer:
          'Incorporated professionals have unique insurance needs that go well beyond a standard personal policy. We typically assess and coordinate life insurance for estate and tax planning purposes, disability insurance to protect your income if you cannot work, critical illness insurance to cover the financial impact of a serious diagnosis, corporate-owned life insurance as a tax-efficient wealth transfer tool, and business overhead expense insurance to keep your practice running if you are temporarily unable to work. The right combination depends entirely on your specific situation, income level, and financial goals.',
      },
      {
        question:
          'What is corporate-owned life insurance and how does it benefit me?',
        answer:
          'Corporate-owned life insurance is a policy held and paid for by your corporation — making the premiums significantly more affordable on an after-tax basis than personally owned coverage. Upon death, the insurance proceeds are received by the corporation tax-free and can be distributed to your estate through the capital dividend account — one of the most tax-efficient wealth transfer mechanisms available to Canadian business owners. When integrated properly into your estate plan, corporate-owned life insurance can cover your entire tax liability at death while simultaneously delivering a significant, tax-free legacy to your family.',
      },
    ],
  },
  {
    slug: 'corporate-legal-services',
    title: 'Corporate Legal Services',
    icon: Scale,
    image: legalImg,
    featured: true,
    summary:
      'Fast-track your access to independent corporate lawyers for business formation, contract drafting, ongoing compliance, and dispute resolution.',
    shortLabel: 'Legal Services',
    features: [
      'Corporate Formation & Structuring',
      'Commercial Contracts',
      'Employment Law',
      'Governance & Compliance',
    ],
    cta: 'Connect with Legal Counsel',
    intro: {
      heading: 'Get the Right Legal Foundation for Your Business',
      body: 'From incorporation to ongoing compliance, your legal groundwork should keep pace with your business at every stage.',
    },
    offerings: [
      {
        title: 'Business Formation & Structuring',
        description:
          'Connect with corporate lawyers who handle incorporation, minute books, shareholder agreements, and structuring suited to your business and goals.',
      },
      {
        title: 'Financing & Capital Agreements',
        description:
          'Get matched with corporate lawyers who draft and review the legal documents behind your business’s financing — including credit agreements, security documentation, and shareholder loan agreements.',
      },
      {
        title: 'Compliance & Governance',
        description:
          'Stay connected to legal counsel who help keep your corporate filings, governance obligations, and regulatory requirements up to date.',
      },
    ],
    closing: {
      heading: 'Connect Your Legal & Financial Decisions',
      body: 'Skip the friction of managing legal and financial decisions in isolation.',
      cta: 'Connect With Legal Counsel',
    },
    faqs: [
      {
        question: 'What is corporate structuring and why does it matter?',
        answer:
          'Corporate structuring is the process of organizing your business and personal financial affairs through the most effective legal and corporate framework available to you. The right structure protects your personal assets from business liabilities, minimizes the tax you pay at both the corporate and personal level, enables income splitting with family members, and creates a clear pathway for wealth transfer and business succession. Without proper structuring, even the most successful business can leave its owner significantly overexposed to tax and liability — losing wealth that proper planning would have fully protected.',
      },
      {
        question:
          'When should I consider restructuring my existing corporation?',
        answer:
          'You should consider restructuring whenever your business experiences significant growth in revenue or retained earnings, when you are planning a business sale or succession, when your personal financial goals change significantly, or when new tax legislation creates opportunities your current structure cannot capture. Many business owners set up a basic corporate structure early in their career and never revisit it — missing years of tax savings and asset protection opportunities that a properly designed structure would have delivered automatically.',
      },
      {
        question: 'What is a holding company and do I need one?',
        answer:
          'A holding company is a separate corporation that holds the assets, investments, and retained earnings of your operating business. It creates a protective barrier between your active business operations and your accumulated wealth — ensuring that business liabilities can never threaten the assets you have built over years of hard work. Beyond protection, a holding company enables powerful tax planning strategies including income splitting, capital gains exemption planning, and tax-efficient wealth transfer to the next generation. If your corporation is accumulating retained earnings, a holding company is almost always worth serious consideration.',
      },
      {
        question:
          'How does corporate structuring help with business succession planning?',
        answer:
          'Proper corporate structuring is the foundation of every successful business succession plan. By implementing the right structure well in advance of a sale or transfer, we ensure your shares qualify for the Lifetime Capital Gains Exemption, your family members can participate in the growth of the business tax-efficiently, and the transition — whether to a family member, a partner, or an external buyer — happens as smoothly and tax-efficiently as possible. Succession planning is not something to think about when you are ready to leave — it is something to build toward from the very beginning.',
      },
    ],
  },
  {
    slug: 'tax-strategy',
    title: 'Tax Strategy',
    icon: Landmark,
    image: taxImg,
    featured: false,
    summary:
      'Proactive, forward-looking tax plans integrated with your investment strategy, corporate structure, and personal financial goals.',
    features: [],
    cta: 'Book a Free Consultation',
    intro: {
      heading: 'Pay Less Tax. Keep More of What You Earn.',
      body: 'Tax strategy at Diadem & Co. goes far beyond filing a return. We build proactive, forward-looking tax plans that are fully integrated with your investment strategy, corporate structure, and personal financial goals. Whether you are an incorporated professional, a business owner, or a high-net-worth individual, we identify every legal opportunity to reduce your tax burden — ensuring you never pay more than you are required to and always keep more of what you work so hard to earn.',
    },
    offerings: [
      {
        title: 'Consulting Service',
        description:
          'Our tax strategy consultations assess your complete income picture — corporate and personal — to identify proactive planning opportunities that reduce your overall tax burden while keeping your financial plan fully aligned and compliant.',
      },
      {
        title: 'Unlimited Support',
        description:
          'Tax laws change constantly. We monitor federal and provincial tax legislation year-round and proactively adjust your strategy whenever changes create new opportunities or risks — ensuring your plan is always current, always optimized, and always working in your favor.',
      },
      {
        title: 'Budget Friendly',
        description:
          'Effective tax strategy pays for itself many times over. The savings generated through proactive planning — retained earnings optimization, income splitting, and withdrawal sequencing — consistently and significantly outweigh the cost of our services.',
      },
    ],
    closing: {
      heading: 'Stop working in silos.',
      body: 'When your financial advisor, accountant, and lawyer don’t communicate, you leave money on the table.',
      cta: 'Book a Free Consultation',
    },
    faqs: [
      {
        question: 'What is the difference between tax filing and tax strategy?',
        answer:
          'Tax filing is a backward-looking exercise — it reports what already happened. Tax strategy is forward-looking — it structures your decisions in advance to legally minimize what you owe before it becomes owing. At Diadem & Co., we focus entirely on proactive tax strategy, not reactive filing. By planning ahead, we identify opportunities that are completely lost once the tax year has already closed — saving you money that a filing-only approach will never recover.',
      },
      {
        question: 'How do you reduce tax for incorporated professionals?',
        answer:
          'Incorporated professionals — doctors, dentists, lawyers, engineers — have access to powerful tax planning tools that most advisors never fully utilize. We implement strategies including retained earnings investment planning, salary and dividend optimization, income splitting with family members through proper structures, and corporate tax deferral — all working together to reduce your overall effective tax rate significantly and legally. The result is a strategy that keeps more money inside your corporation growing at a lower tax rate for longer.',
      },
      {
        question: 'What is income splitting and how does it benefit my family?',
        answer:
          'Income splitting is a strategy that distributes income among family members in lower tax brackets — reducing the total tax your family pays as a unit. Through properly structured family trusts, dividend payments to eligible family members, and spousal investment strategies, we legally shift income away from the highest earner and toward those who will pay less tax on it. Over time, this strategy can save families tens of thousands of dollars annually while building wealth more efficiently across the entire family unit.',
      },
      {
        question:
          'How do you approach tax strategy for business owners planning to sell?',
        answer:
          'A business sale is one of the most significant — and most tax-exposed — financial events of your life. We begin tax planning for a business exit years in advance, not weeks before closing. Our approach includes ensuring your shares qualify for the Lifetime Capital Gains Exemption, implementing an estate freeze to lock in today’s values, structuring a holding company to receive and protect sale proceeds, and planning the most tax-efficient distribution of those proceeds — ensuring you keep the maximum amount of what you have built over a lifetime of work.',
      },
      {
        question:
          'Can you help reduce tax on investment income inside my corporation?',
        answer:
          'Absolutely. Investment income earned inside a Canadian corporation is subject to higher tax rates under passive income rules — making proper planning essential. We structure your corporate investment accounts to minimize passive income tax exposure, utilize refundable tax mechanisms effectively, and plan withdrawal strategies that extract investment income from your corporation in the most tax-efficient manner possible — whether through dividends, capital gains, or other distribution strategies.',
      },
      {
        question: 'How often should my tax strategy be reviewed?',
        answer:
          'Your tax strategy should be reviewed at minimum once per year — ideally before your fiscal year end when there is still time to act on planning opportunities. Beyond the annual review, we proactively revisit your strategy whenever there are changes in federal or provincial tax legislation, significant changes in your income or business structure, or major personal life events such as marriage, divorce, a new child, a property purchase, or a business sale. Tax planning is not a one-time event — it is an ongoing discipline that requires constant attention to deliver its full value.',
      },
    ],
  },
  {
    slug: 'estate-legacy-planning',
    title: 'Estate & Legacy Planning',
    icon: ScrollText,
    image: legalImg,
    featured: false,
    summary:
      'A comprehensive legacy plan that integrates your corporate structure, investments, insurance, and family goals into one strategy.',
    features: [],
    cta: 'Book a Free Consultation',
    intro: {
      heading: 'Your Legacy Deserves to Be Protected and Preserved.',
      body: 'Estate and legacy planning at Diadem & Co. ensures that everything you have built during your lifetime is transferred to the people and causes you care about — efficiently, privately, and with the least possible tax burden. We go beyond simply drafting a will. We build a comprehensive legacy plan that integrates your corporate structure, investment portfolio, insurance coverage, and family goals into a single, cohesive strategy — ensuring your wealth survives and thrives long after you are gone.',
    },
    offerings: [
      {
        title: 'Consulting Service',
        description:
          'Our estate planning consultations assess your complete financial picture — assets, corporate structures, family dynamics, and legacy goals — to design a comprehensive plan that transfers your wealth exactly as you intend, with minimal tax and maximum efficiency.',
      },
      {
        title: 'Unlimited Support',
        description:
          'Your estate plan must evolve as your life evolves. We conduct ongoing reviews and proactive updates — ensuring your plan always reflects your current wishes, family situation, and the latest tax legislation so nothing is ever left to chance or circumstance.',
      },
      {
        title: 'Budget Friendly',
        description:
          'The cost of a poorly planned estate is always far greater than the cost of planning it properly. The tax savings, family conflict prevention, and wealth preservation that a well-designed estate plan delivers make it one of the highest-return investments you will ever make.',
      },
    ],
    closing: {
      heading: 'Stop working in silos.',
      body: 'When your financial advisor, accountant, and lawyer don’t communicate, you leave money on the table.',
      cta: 'Book a Free Consultation',
    },
    faqs: [
      {
        question: 'What is estate planning and why is it important?',
        answer:
          'Estate planning is the process of arranging your financial affairs so that your assets are transferred to your chosen beneficiaries as efficiently and tax-effectively as possible upon your death or incapacity. Without a proper estate plan, your estate could face significant and entirely avoidable tax bills, legal complications, and family disputes — potentially eroding a substantial portion of the wealth you spent a lifetime building. A well-designed estate plan ensures your wishes are carried out exactly as you intend, your family is protected, and your legacy endures for generations to come.',
      },
      {
        question:
          'What is an estate freeze and how does it preserve my legacy?',
        answer:
          'An estate freeze is a strategy that locks in the current value of your estate at today’s tax cost and transfers all future growth to the next generation — significantly reducing the tax liability your estate will face. It is particularly powerful for business owners and incorporated professionals whose companies or investment portfolios are growing in value. Every year you delay implementing an estate freeze, more future growth becomes subject to tax at your death. The earlier it is implemented, the greater the legacy you preserve for the people and causes you care about most.',
      },
      {
        question:
          'How does a family trust protect and transfer generational wealth?',
        answer:
          'A family trust holds assets on behalf of your beneficiaries — typically your spouse and children — providing both tax efficiency and asset protection simultaneously. Income earned inside the trust can be distributed to family members in lower tax brackets, reducing your family’s overall tax burden significantly. Beyond tax savings, a family trust protects assets from creditors, ensures wealth is transferred according to your specific wishes, and keeps family assets out of the public probate process — providing privacy, protection, and peace of mind for your entire family.',
      },
      {
        question: 'How do you minimize tax at death for my estate?',
        answer:
          'Tax at death can be one of the largest single tax events your family ever faces — but with proper planning, it can be significantly reduced. We implement a combination of strategies including estate freezes to cap future growth, family trusts to distribute assets tax-efficiently, life insurance to cover residual tax liabilities, corporate structures to protect and transfer accumulated wealth, and charitable giving strategies for clients who wish to leave a philanthropic',
      },
    ],
  },
]

export const servicesPage = {
  intro:
    'Connect with trusted professionals across the services your business needs.',
}

export const featuredServices = services.filter((s) => s.featured)

export const getService = (slug: string | undefined) =>
  services.find((s) => s.slug === slug)

export const servicePath = (slug: string) => `/service/${slug}/`
