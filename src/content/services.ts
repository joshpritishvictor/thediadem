import {
  Calculator,
  Landmark,
  PiggyBank,
  Receipt,
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

/**
 * A service page follows the same six steps (see pages/ServiceDetail.tsx):
 * hero, the problem, we understand, how Diadem helps, why Diadem, the plan,
 * then the FAQs. All wording needs sign-off from Diadem's professionals.
 */
export type Service = {
  slug: string
  /** Short name: breadcrumbs, menus, cards and the contact form's service list */
  title: string
  icon: LucideIcon
  image: string
  /** Listed on /our-services/, in the footer and in the contact form */
  featured: boolean
  /** Search result title and snippet (~60 and ~150 characters) */
  seo?: { title: string; description: string }
  /** The page's visible H1 */
  heading: string
  /** One supporting sentence under the H1 */
  lead: string
  /** Card text on /our-services/; starts with the service and the city */
  summary: string
  /** Shorter label shown on cards */
  shortLabel?: string
  features: string[]
  /** Card button label */
  cta: string
  /** Step 2: the visitor's pains, in their own terms */
  problem: { heading: string; paragraphs: string[] }
  /** Step 3: empathy, without drama */
  understand?: { heading: string; body: string }
  /** Step 4: what the client actually gets; each title is an H2 */
  sections: { title: string; body: string }[]
  /** Step 5: the differentiator */
  why: { heading: string; paragraphs: string[]; points: string[] }
  /** Step 6: the heading over the three-step plan */
  planHeading: string
  faqs: Faq[]
}

/** Step 6 on every service page: a short plan instead of a generic button */
export const planSteps = [
  {
    title: 'Book a free 30-minute call',
    body: 'Tell us about your business, your family and your goals. No cost, no obligation.',
  },
  {
    title: 'We review your situation',
    body: 'We look across tax, advisory, insurance and legal to find the gaps and the opportunities.',
  },
  {
    title: 'You receive your Diadem plan',
    body: 'One coordinated plan, with each part led by the right licensed professional.',
  },
]

export const planCta = 'Get Your Diadem Plan'

/** Each entry becomes a page at /service/<slug>/ */
export const services: Service[] = [
  {
    slug: 'accounting-tax-solutions',
    title: 'Accounting & Tax Solutions',
    icon: Calculator,
    image: accountingImg,
    featured: true,
    seo: {
      title: 'Accountant Calgary | Corporate Tax & Bookkeeping | Diadem',
      description:
        'Accountant in Calgary for business owners. CPAs for corporate tax planning, bookkeeping, payroll and restructuring. Book a free call.',
    },
    heading: 'Accountants in Calgary for Business Owners',
    lead: 'CPAs in Diadem’s network plan your corporate tax, keep your books current and work alongside your financial advisor and lawyer, for business owners in Calgary and across Alberta.',
    summary:
      'Work with an accountant in Calgary who coordinates your corporate tax, bookkeeping and payroll. Experienced CPAs serve business owners across Alberta with proactive planning and clear financial reporting.',
    shortLabel: 'Corporate Accounting',
    features: [
      'Corporate Tax Planning',
      'Bookkeeping & Payroll',
      'Financial Reporting',
      'Corporate Restructuring',
    ],
    cta: 'Explore Corporate Accounting',
    problem: {
      heading: 'The Cost of Accounting That Only Looks Backward',
      paragraphs: [
        'If your corporation’s tax planning happens in March, you’re already paying more than you need to. Business owners in Calgary often lose money to timing: advice that arrives after year-end, or an accountant who never talks to their financial advisor or lawyer.',
        'The signs are familiar. Salary and dividend decisions get made in a rush at year-end. Deductions and credits are missed because nobody asked the right questions. The books fall months behind, so decisions are made on numbers that are already out of date. Payroll remittances and filing deadlines become something you chase instead of something that simply happens.',
        'Most of it comes down to three losses: losing money to tax that planning could have reduced, losing time to bookkeeping and paperwork you shouldn’t have to manage, and losing track of where your business actually stands.',
      ],
    },
    understand: {
      heading: 'We Understand What You’ve Built',
      body: 'You built your business through hard work and sacrifice, and you shouldn’t have to manage four advisors who never talk to each other. Most owners we speak with don’t want more meetings or more jargon. They want an accountant who plans ahead, explains things plainly and works with the rest of their team, so the decisions made this year still make sense five years from now.',
    },
    sections: [
      {
        title: 'Corporate Tax Planning in Calgary',
        body: 'Corporate tax planning works best year-round, not at filing time. CPAs in Diadem’s network review your salary and dividend mix, the timing of income and expenses, and your use of the small business deduction before year-end, while there is still time to act. Your T2 corporate return is prepared and filed on time, and your accountant coordinates with your financial advisor so tax decisions fit your investment and retirement plans instead of working against them.',
      },
      {
        title: 'Bookkeeping, Payroll and Financial Reporting',
        body: 'Clean, current books are the foundation of every good decision. Get monthly bookkeeping, payroll and source deduction remittances, GST filings and clear financial statements you can actually use. Instead of discovering problems at year-end, you see where your business stands each month, and your year-end package is ready for your accountant without a last-minute scramble for receipts.',
      },
      {
        title: 'Corporate Restructuring',
        body: 'As your business grows, the structure you started with may no longer fit. Accountants in the network help you explore a holding company, manage retained earnings, consider an estate freeze and prepare for a sale or succession. Because restructuring involves legal steps as well as tax, your accountant works directly with a corporate lawyer, so the plan is designed once and carried out correctly.',
      },
    ],
    why: {
      heading: 'Why Business Owners Choose Diadem',
      paragraphs: [
        'Most business owners have an accountant, a financial advisor, an insurance advisor and a lawyer who have never been in the same room. Each gives good advice in isolation, and you’re left to work out how it fits together. Diadem works differently: your accountant, advisor, insurance advisor and lawyer plan together, so every recommendation fits the others.',
        'In practice, that means your year-end tax plan reflects your investment strategy, your corporate structure supports your estate plan, and nothing important falls between two professionals. You have one Diadem contact, you tell your story once, and we handle the hand-offs.',
      ],
      points: [
        'Licensed, independent CPAs serving all of Alberta',
        'Planning before year-end, not after',
        'One plan across tax, advisory, insurance and legal',
        'Virtual meetings, wherever you are in the province',
      ],
    },
    planHeading: 'Get Your Diadem Corporate Tax Plan',
    faqs: [
      {
        question: 'What does a corporate accountant do for a business owner?',
        answer:
          'A corporate accountant prepares your corporation’s T2 return and financial statements, and the best ones also plan ahead: how you pay yourself, when income and expenses are recognized, and how to keep the corporation eligible for the small business deduction. Through Diadem, your accountant also coordinates with your financial advisor, insurance advisor and lawyer.',
      },
      {
        question: 'When is my corporation’s tax return due?',
        answer:
          'A T2 corporate return is generally due six months after your corporation’s fiscal year-end. Any balance owing is usually due two or three months after year-end, depending on the corporation, so tax planning needs to happen before year-end rather than when the return is filed.',
      },
      {
        question: 'Should I pay myself a salary or dividends?',
        answer:
          'It depends on your personal income needs, your RRSP and CPP goals, and how much profit you plan to leave in the corporation. Salary creates RRSP room and CPP contributions; dividends don’t, but they can suit other goals. Your accountant models both each year and recommends a mix that fits your overall plan.',
      },
      {
        question: 'Can you work with my existing bookkeeper or accountant?',
        answer:
          'Yes. You don’t need to replace anyone. We can coordinate with your current professionals, or connect you with CPAs in our network to fill any gaps.',
      },
      {
        question: 'Do you work with business owners outside Calgary?',
        answer:
          'Yes. Meetings are virtual, so we work with business owners in Calgary and across Alberta. Most clients never need to visit an office.',
      },
      {
        question: 'What does the first consultation cost?',
        answer:
          'Nothing. Your first 30-minute call is free and comes with no obligation. We review your situation and explain which professionals and services would help.',
      },
    ],
  },
  {
    slug: 'personal-tax-accountant',
    title: 'Personal Tax',
    icon: Receipt,
    image: taxImg,
    featured: true,
    seo: {
      title: 'Tax Accountant Calgary | Personal Tax Returns | Diadem',
      description:
        'Tax accountant in Calgary for personal and family tax returns, income splitting, deductions and credits. Serving all of Alberta. Book a free call.',
    },
    heading: 'Personal Tax Accountant in Calgary',
    lead: 'Accurate personal and family tax returns, every deduction and credit you’re entitled to, and a plan for the years ahead, for individuals and families in Calgary and across Alberta.',
    summary:
      'Work with a tax accountant in Calgary who prepares your personal and family returns, finds the deductions and credits you qualify for, and plans income splitting across your household.',
    shortLabel: 'Personal Tax',
    features: [
      'T1 Personal Returns',
      'Family Tax Coordination',
      'Income Splitting',
      'Deductions & Credits',
    ],
    cta: 'Explore Personal Tax',
    problem: {
      heading: 'Why Families Pay More Tax Than They Need To',
      paragraphs: [
        'For many families in Calgary, tax season means gathering slips in April and hoping nothing was missed. The return gets filed, but nobody looks at the bigger picture: whether income could be split more efficiently, whether every credit was claimed, or whether last year’s mistakes are being repeated.',
        'Common problems include medical expenses, childcare costs and charitable donations that go unclaimed, spouses filing without coordinating who claims what, and RRSP contributions made without a plan. When life changes, with a new child, a home purchase, a side business or a parent moving in, the return often doesn’t change with it.',
        'The result is money left on the table, time spent sorting paperwork, and the uneasy feeling of not knowing whether your return is right.',
      ],
    },
    understand: {
      heading: 'We Understand',
      body: 'Your finances are personal and your time is limited. You want your taxes done properly, explained in plain language, and handled by someone who looks ahead rather than just filling in forms. If you also own a business or hold investments, you want your personal return to fit the rest of your plan, not work against it.',
    },
    sections: [
      {
        title: 'Personal Tax Returns',
        body: 'Prepare and file your T1 personal return, plus T3 trust returns where needed, accurately and on time. Your accountant reviews your slips, receipts and prior-year notice of assessment, checks for carry-forward amounts, and explains what you owe or what you’re getting back before anything is filed. If the CRA follows up with a question, you have someone who already knows your file.',
      },
      {
        title: 'Family Tax Coordination and Income Splitting',
        body: 'Family taxes work best when they’re planned together. CPAs in Diadem’s network align filings across spouses and dependants, decide who should claim which credits, and look at income splitting opportunities such as pension income splitting and spousal RRSPs. Where a family business or trust is involved, your accountant applies the current tax on split income rules so the plan stays compliant.',
      },
      {
        title: 'Deductions and Tax Credits',
        body: 'Many people miss deductions simply because nobody asked. Your accountant works through the deductions and credits you may qualify for, including medical expenses, childcare costs, tuition, charitable donations, moving expenses and the disability tax credit, and keeps a record so nothing is missed next year.',
      },
    ],
    why: {
      heading: 'Why Families Choose Diadem',
      paragraphs: [
        'Your personal taxes don’t exist in isolation. Your RRSP, your investments, your insurance and your will all affect what you pay, now and in the future. At Diadem, your accountant works with your financial advisor, insurance advisor and lawyer, so your tax return reflects your whole plan, not just one year’s slips.',
        'If you own a business, your personal and corporate taxes are planned together, so salary, dividends and family income are decided in one conversation. And because meetings are virtual, you can work with us from anywhere in Alberta.',
      ],
      points: [
        'Accurate returns, explained in plain language',
        'Families planned together, not one return at a time',
        'Coordinated with your investment, insurance and estate plans',
        'Virtual meetings across Alberta',
      ],
    },
    planHeading: 'Get Your Diadem Tax Plan',
    faqs: [
      {
        question: 'When is the personal tax filing deadline?',
        answer:
          'For most individuals, the T1 return is due April 30. If you or your spouse or common-law partner are self-employed, the filing deadline is June 15, but any balance owing is still due April 30, so interest can apply to unpaid amounts after that date.',
      },
      {
        question: 'What is income splitting in Canada?',
        answer:
          'Income splitting means shifting income from a higher-earning family member to one in a lower tax bracket, so the family pays less tax overall. Common options include pension income splitting, spousal RRSPs and prescribed rate loans. Rules such as the tax on split income (TOSI) limit some strategies, so they need careful planning.',
      },
      {
        question: 'Which deductions and credits are most often missed?',
        answer:
          'Medical expenses, charitable donations, childcare costs, moving expenses, the disability tax credit and unused tuition amounts are among the most commonly missed. Your accountant reviews each one with you before filing.',
      },
      {
        question: 'Can you prepare returns for my whole family?',
        answer:
          'Yes. Preparing returns for spouses and dependants together is how your accountant finds the best way to claim credits and split income across the household.',
      },
      {
        question: 'Do I need a personal tax accountant if I own a corporation?',
        answer:
          'It helps. When you own a corporation, your personal return depends on how you pay yourself, so planning salary and dividends with your personal taxes in mind can lower the total tax your family pays.',
      },
    ],
  },
  {
    slug: 'corporate-financial-advisory',
    title: 'Corporate & Financial Advisory',
    icon: PiggyBank,
    image: advisoryImg,
    featured: true,
    seo: {
      title: 'Financial Advisor Calgary for Business Owners | Diadem',
      description:
        'Financial advisor in Calgary for business owners: cash flow, holding companies, retained earnings and succession planning across Alberta.',
    },
    heading: 'Financial Advisors in Calgary for Business Owners',
    lead: 'Licensed financial advisors in Diadem’s network help business owners in Calgary and across Alberta plan cash flow, invest retained earnings and prepare for succession, working alongside your accountant and lawyer.',
    summary:
      'Work with a financial advisor in Calgary who aligns your business cash flow, retained earnings and succession plans with your long-term personal wealth.',
    shortLabel: 'Financial Planning',
    features: [
      'Cash Flow & Capital Planning',
      'Succession Planning',
      'Holding Companies',
      'Access to Investment Advisory',
    ],
    cta: 'Explore Advisory Access',
    problem: {
      heading: 'When Business Growth Outpaces the Plan',
      paragraphs: [
        'Many business owners in Calgary reach a point where the business is doing well, but the plan behind it hasn’t kept up. Cash builds up in the corporation with no clear strategy. Investments are chosen without the accountant’s input, so passive income starts to erode the small business deduction. Succession is something to think about later, until later arrives.',
        'Without a coordinated financial plan, owners often hold too much cash or too little, take money out of the corporation in the least tax-efficient way, and approach a sale or transition without knowing what the business is worth or what they’ll keep after tax. Each of these costs money, and most can’t be fixed after the fact.',
      ],
    },
    understand: {
      heading: 'We Understand',
      body: 'You’ve spent years building a business, often at the expense of your own financial planning. That’s normal. What you need now is an advisor who understands corporate structures as well as investments, and who works with your accountant and lawyer rather than around them.',
    },
    sections: [
      {
        title: 'Cash Flow and Capital Planning',
        body: 'Understand where your cash goes and how much the business really needs. Advisors in Diadem’s network analyze corporate cash flow, model working capital needs and build projections for growth, so you know how much you can safely invest, distribute or set aside. Surplus cash in the corporation gets a plan that balances growth, liquidity, tax efficiency and risk.',
      },
      {
        title: 'Business Succession Planning',
        body: 'Business succession planning is best started years before you plan to step back. Your advisor helps you decide whether the business will pass to family, partners, management or an outside buyer, and builds a roadmap for ownership, leadership and timing. Your accountant and lawyer work on the tax and legal steps at the same time, so the plan holds together.',
      },
      {
        title: 'Holding Company Structures',
        body: 'A holding company can help protect retained earnings from business risk and give you more flexibility in how you invest and move funds between entities. Your advisor reviews whether a holding company fits your goals and how investments inside it should be managed, while your accountant and corporate lawyer handle the tax and legal set-up.',
      },
      {
        title: 'Business Valuation and Exit Planning',
        body: 'Know what your business may be worth before you need to. Advisors help you understand valuation, prepare for a sale or management buyout, and plan the steps that may help your shares qualify for the lifetime capital gains exemption. The aim is simple: keep more of what you’ve built when you exit.',
      },
    ],
    why: {
      heading: 'Why Business Owners Choose Diadem',
      paragraphs: [
        'A traditional advisor looks at your investments. A Diadem advisor looks at your investments, your corporation, your tax position and your estate plan together, because the professionals responsible for each of them are working as one team. Every recommendation is checked against the others before it reaches you.',
        'You get one coordinated plan instead of four separate opinions, one contact who knows your story, and advice that adapts as your business and family change.',
      ],
      points: [
        'Licensed financial advisors serving all of Alberta',
        'Corporate and personal finances planned together',
        'Coordinated with your accountant and lawyer',
        'Reviewed at least once a year',
      ],
    },
    planHeading: planCta,
    faqs: [
      {
        question: 'What does investment advisory at Diadem include?',
        answer:
          'Our investment advisory service covers portfolio architecture and asset allocation, risk assessment and management, corporate and personal investment account structuring, tax-efficient investment selection, and ongoing portfolio coordination. Unlike a traditional advisor who focuses solely on returns, we view every investment decision through a financial, tax, and legal lens simultaneously, ensuring your portfolio works as part of a complete wealth strategy rather than a standalone plan.',
      },
      {
        question: 'How do you manage investment risk for your clients?',
        answer:
          'We begin with a thorough assessment of your risk tolerance, income requirements, time horizon, and overall financial situation. From there, we build a diversified portfolio strategy designed to grow your wealth while minimizing unnecessary exposure to market volatility. We also integrate risk management tools such as proper insurance coverage and legal structures, ensuring your wealth is protected not just from market risk but from life’s unexpected events as well.',
      },
      {
        question: 'Do you manage investments inside a corporation?',
        answer:
          'Yes. Corporate investment account management is one of our core specialties. Many incorporated professionals and business owners in Calgary and across Alberta accumulate significant retained earnings inside their corporation and need a strategy to invest those funds efficiently. We structure corporate investment accounts to maximize growth, minimize passive income tax exposure, and plan for the most tax-efficient extraction of those funds over time, whether for retirement, reinvestment, or wealth transfer.',
      },
      {
        question: 'How often will my investment portfolio be reviewed?',
        answer:
          'We conduct formal portfolio reviews at least annually and proactively reach out whenever there are significant changes in market conditions, tax legislation, or your personal circumstances. Major life events, such as a business sale, inheritance, retirement transition, or significant income change, trigger an immediate review to ensure your investment strategy remains perfectly aligned with your current situation and future goals.',
      },
      {
        question:
          'How does financial planning help my business and personal finances?',
        answer:
          'For business owners in Calgary, integrated financial planning aligns your business cash flow with your personal wealth goals, reducing tax drag, improving investment efficiency, and ensuring your corporate and personal finances work together rather than against each other. When your financial plan is built holistically, every dollar you earn is directed with purpose, minimizing what you lose to tax and maximizing what you keep and grow.',
      },
      {
        question: 'What qualifications do your financial advisors hold?',
        answer:
          'Our advisors are licensed professionals with deep expertise across financial planning, investment management, and tax strategy. Every professional within the Diadem network, in Calgary and across Alberta, holds the credentials required in their specific discipline, ensuring you receive advice that is not only strategic but fully compliant with Canadian regulatory standards. We believe your wealth deserves qualified, accountable professionals at every step.',
      },
      {
        question:
          'What is your approach to retirement and investment planning?',
        answer:
          'We take a comprehensive, tax-first approach to retirement and investment planning. Rather than simply selecting investment products, we build a strategy that considers your corporate structure, personal income needs, tax brackets, and long-term legacy goals simultaneously. This includes retirement income modeling, tax-efficient withdrawal sequencing, and corporate investment account structuring, ensuring you retire with confidence and keep more of what you’ve built.',
      },
    ],
  },
  {
    slug: 'insurance-risk-management',
    title: 'Insurance & Risk Management',
    icon: ShieldCheck,
    image: insuranceImg,
    featured: true,
    seo: {
      title: 'Business Insurance Calgary & Alberta | Diadem',
      description:
        'Business insurance in Calgary: key person, buy-sell and corporate owned life insurance, coordinated with your tax and estate plan.',
    },
    heading: 'Business Insurance in Calgary and Across Alberta',
    lead: 'Licensed insurance advisors in Diadem’s network protect business owners in Calgary and across Alberta with coverage that fits their corporate structure, tax plan and estate plan.',
    summary:
      'Work with an insurance advisor in Calgary on business insurance, from key person and buy-sell coverage to corporate owned life insurance, coordinated with your tax plan.',
    shortLabel: 'Business Insurance',
    features: [
      'Life Insurance for Business Owners',
      'Disability Insurance',
      'Critical Illness Insurance',
      'Key Person & Buy-Sell',
    ],
    cta: 'Explore Business Insurance',
    problem: {
      heading: 'Gaps You Don’t See Until It’s Too Late',
      paragraphs: [
        'Most business owners in Calgary have some insurance, but few have coverage that was designed around the business. Policies get bought one at a time, from different people, for different reasons. Nobody checks whether they fit together, whether the corporation should own them, or whether they still match what the business is worth today.',
        'The gaps show up at the worst moment. A partner dies and there’s no money to buy their shares. A key employee falls ill and revenue drops. An owner can’t work for six months while the business overhead keeps coming. Or a large tax bill at death forces the family to sell assets they meant to keep.',
      ],
    },
    understand: {
      heading: 'We Understand',
      body: 'Insurance isn’t anyone’s favourite topic, and it’s easy to put off. You want to know you’re protected without paying for coverage you don’t need. That takes advice from someone who understands your corporation and your tax position, not just the policy.',
    },
    sections: [
      {
        title: 'Corporate Owned Life Insurance',
        body: 'When your corporation owns a permanent life insurance policy, premiums are paid with corporate dollars, which are often taxed at a lower rate than personal income. On death, much of the payout can generally reach your estate tax-free through the capital dividend account. Your insurance advisor and accountant work together to decide whether corporate ownership makes sense for you.',
      },
      {
        title: 'Key Person and Buy-Sell Insurance',
        body: 'Key person insurance protects the business if an owner or essential employee dies or becomes seriously ill, giving you funds to cover lost revenue or find a replacement. Buy-sell insurance funds your shareholder agreement, so surviving owners can buy a partner’s shares and the family receives fair value. Your lawyer makes sure the agreement and the policy match.',
      },
      {
        title: 'Disability and Critical Illness Coverage for Owners',
        body: 'For many owners, the risk of an extended disability before 65 is higher than the risk of dying in the same period. Disability insurance replaces income if you can’t work, critical illness insurance pays a lump sum after a serious diagnosis, and business overhead expense coverage keeps the business running while you recover. Coverage is matched to how you actually pay yourself.',
      },
      {
        title: 'Business Liability and Property Coverage',
        body: 'Commercial liability, property, cyber and professional liability coverage protect the business from claims and losses. Your advisor reviews what you have, finds the gaps before they become expensive, and connects you with the right specialists where needed.',
      },
    ],
    why: {
      heading: 'Why Business Owners Choose Diadem',
      paragraphs: [
        'Insurance works best as part of the plan, not as an afterthought. At Diadem, your insurance advisor works with your accountant and lawyer, so policy ownership, beneficiaries and buy-sell funding line up with your corporate structure, tax plan and will.',
        'When your advisor, accountant and insurance advisor aren’t connected, small gaps can turn into real exposure. Coordinated advice closes them before they cost you.',
      ],
      points: [
        'Matched to your situation: income, assets, corporate structure and family',
        'Coverage that evolves with you as your wealth and responsibilities grow',
        'Coverage that fits your budget, without paying for what you don’t need',
        'Coordinated with your tax and estate plan',
      ],
    },
    planHeading: planCta,
    faqs: [
      {
        question: 'Why is insurance important as part of a wealth strategy?',
        answer:
          'Insurance is the foundation that makes every other part of your wealth strategy viable. You can have the best investment portfolio, the most efficient corporate structure, and the most comprehensive tax plan, but a single uninsured event such as a critical illness, disability, or premature death can unravel everything instantly. At Diadem, we integrate insurance into your overall financial plan as a strategic tool, not an afterthought, ensuring that no matter what life brings, your wealth, your family, and your legacy remain fully protected.',
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
          'Corporate-owned life insurance is a policy held and paid for by your corporation, making the premiums significantly more affordable on an after-tax basis than personally owned coverage. Upon death, the insurance proceeds are received by the corporation tax-free and can be distributed to your estate through the capital dividend account, one of the most tax-efficient wealth transfer mechanisms available to Canadian business owners. When integrated properly into your estate plan, corporate-owned life insurance can cover your entire tax liability at death while simultaneously delivering a significant, tax-free legacy to your family.',
      },
      {
        question: 'What is key person insurance?',
        answer:
          'Key person insurance is a policy the business owns on the life or health of an owner or essential employee. If that person dies or becomes seriously ill, the business receives the payout to cover lost revenue, repay debt or find a replacement.',
      },
      {
        question: 'Do you work with business owners outside Calgary?',
        answer:
          'Yes. Meetings are virtual, so we work with business owners in Calgary and across Alberta.',
      },
    ],
  },
  {
    slug: 'corporate-legal-services',
    title: 'Corporate Legal Services',
    icon: Scale,
    image: legalImg,
    featured: true,
    seo: {
      title: 'Corporate Lawyer Calgary & Alberta | Diadem',
      description:
        'Corporate lawyer in Calgary for incorporation, shareholder agreements, reorganizations and commercial contracts across Alberta.',
    },
    heading: 'Corporate Lawyers in Calgary and Across Alberta',
    lead: 'Independent corporate lawyers in Diadem’s network help business owners in Calgary and across Alberta incorporate, structure and protect their businesses, working alongside your accountant.',
    summary:
      'Work with a corporate lawyer in Calgary for incorporation, shareholder agreements, reorganizations and commercial contracts, coordinated with your tax plan.',
    shortLabel: 'Legal Services',
    features: [
      'Incorporation & Structuring',
      'Shareholder Agreements',
      'Corporate Reorganizations',
      'Commercial Contracts',
    ],
    cta: 'Explore Legal Counsel',
    problem: {
      heading: 'When Legal Work Happens in Isolation',
      paragraphs: [
        'Many business owners in Calgary incorporated years ago from a basic template and haven’t looked at their legal structure since. The minute book is out of date. There’s no shareholder agreement, or the one that exists no longer reflects how the business works. Contracts get signed without review because involving a lawyer feels slow and expensive.',
        'The bigger risk is legal work done without the tax picture. A reorganization drafted without your accountant’s input can trigger tax you didn’t expect. A shareholder agreement with no insurance behind it can leave partners unable to buy each other out. These problems are costly to fix after the fact.',
      ],
    },
    understand: {
      heading: 'We Understand',
      body: 'Legal work can feel like a cost you only take on when something goes wrong. You want clear advice, documents that protect you, and a lawyer who talks to your accountant so you don’t have to carry messages between them.',
    },
    sections: [
      {
        title: 'Incorporating Your Business in Alberta',
        body: 'Incorporating your business in Alberta involves more than filing articles. Lawyers in Diadem’s network help you choose the right share structure, set up your minute book and bylaws, and plan ownership with your accountant so it supports income splitting, a future holding company and eventual succession. If you’re already incorporated, they can review and update what you have.',
      },
      {
        title: 'Shareholder and Partnership Agreements',
        body: 'A shareholder agreement sets clear terms for ownership, decision-making, disputes and what happens when an owner leaves, retires, becomes disabled or dies. Your lawyer drafts or reviews the agreement and coordinates with your insurance advisor so any buyout is properly funded.',
      },
      {
        title: 'Corporate Reorganizations and Holding Companies',
        body: 'As your business grows, you may need to add a holding company, complete an estate freeze or restructure your shares. Your lawyer handles the legal steps and documents while your accountant confirms the tax treatment, so the reorganization does what it’s meant to do.',
      },
      {
        title: 'Commercial Contracts',
        body: 'Contracts with clients, suppliers, lenders and employees protect your rights and set expectations. Have them drafted or reviewed before you sign, including financing and security agreements, shareholder loans and employment agreements, and keep your corporate filings and governance up to date.',
      },
    ],
    why: {
      heading: 'Why Business Owners Choose Diadem',
      paragraphs: [
        'Most legal work is done in isolation. At Diadem, your lawyer works with your accountant, financial advisor and insurance advisor, so every legal document fits your tax plan, investment strategy and insurance coverage. You have one contact, you tell your story once, and the professionals handle the hand-offs.',
        'The result is legal work done right the first time, and a structure that keeps serving you as your business grows.',
      ],
      points: [
        'Independent, licensed Alberta lawyers',
        'Legal work coordinated with your tax plan',
        'Clear documents, explained in plain language',
        'Virtual meetings across Alberta',
      ],
    },
    planHeading: planCta,
    faqs: [
      {
        question: 'How do I incorporate a business in Alberta?',
        answer:
          'Articles of incorporation are filed through an Alberta registry agent, along with a name search and your corporation’s registered office details. You then set up bylaws, a share structure and a minute book. A lawyer can handle the filing and, more importantly, design the share structure with your accountant so it supports your tax and succession plans.',
      },
      {
        question: 'What is corporate structuring and why does it matter?',
        answer:
          'Corporate structuring is the process of organizing your business and personal financial affairs through the most effective legal and corporate framework available to you. The right structure protects your personal assets from business liabilities, minimizes the tax you pay at both the corporate and personal level, enables income splitting with family members, and creates a clear pathway for wealth transfer and business succession. Without proper structuring, even the most successful business can leave its owner significantly overexposed to tax and liability, losing wealth that proper planning would have fully protected.',
      },
      {
        question:
          'When should I consider restructuring my existing corporation?',
        answer:
          'You should consider restructuring whenever your business experiences significant growth in revenue or retained earnings, when you are planning a business sale or succession, when your personal financial goals change significantly, or when new tax legislation creates opportunities your current structure cannot capture. Many business owners set up a basic corporate structure early in their career and never revisit it, missing years of tax savings and asset protection opportunities that a properly designed structure would have delivered automatically.',
      },
      {
        question: 'What is a holding company and do I need one?',
        answer:
          'A holding company is a separate corporation that holds the assets, investments, and retained earnings of your operating business. It creates a protective barrier between your active business operations and your accumulated wealth, ensuring that business liabilities can never threaten the assets you have built over years of hard work. Beyond protection, a holding company enables powerful tax planning strategies including income splitting, capital gains exemption planning, and tax-efficient wealth transfer to the next generation. If your corporation is accumulating retained earnings, a holding company is almost always worth serious consideration.',
      },
      {
        question:
          'How does corporate structuring help with business succession planning?',
        answer:
          'Proper corporate structuring is the foundation of every successful business succession plan. By implementing the right structure well in advance of a sale or transfer, we ensure your shares qualify for the Lifetime Capital Gains Exemption, your family members can participate in the growth of the business tax-efficiently, and the transition, whether to a family member, a partner, or an external buyer, happens as smoothly and tax-efficiently as possible. Succession planning is not something to think about when you are ready to leave; it is something to build toward from the very beginning.',
      },
    ],
  },
  {
    slug: 'tax-strategy',
    title: 'Tax Strategy',
    icon: Landmark,
    image: taxImg,
    featured: false,
    heading: 'Tax Strategy for Business Owners and Professionals',
    lead: 'Proactive, forward-looking tax plans integrated with your investment strategy, corporate structure, and personal financial goals.',
    summary:
      'Proactive, forward-looking tax plans integrated with your investment strategy, corporate structure, and personal financial goals.',
    features: [],
    cta: 'Book a Free Consultation',
    problem: {
      heading: 'Pay Less Tax. Keep More of What You Earn.',
      paragraphs: [
        'Tax strategy at Diadem goes far beyond filing a return. We build proactive, forward-looking tax plans that are fully integrated with your investment strategy, corporate structure, and personal financial goals. Whether you are an incorporated professional, a business owner, or a high-net-worth individual, we identify every legal opportunity to reduce your tax burden, ensuring you never pay more than you are required to and always keep more of what you work so hard to earn.',
      ],
    },
    sections: [
      {
        title: 'Income Splitting & Family Structures',
        body: 'Explore compliant ways to share income across family members and entities, within the current tax rules.',
      },
      {
        title: 'Tax-Efficient Extraction of Wealth',
        body: 'Plan how and when to take money out of your corporation to reduce the overall tax you and the business pay.',
      },
      {
        title: 'Capital Gains & Lifetime Exemption Planning',
        body: 'Prepare your shares and assets ahead of a sale to make the most of available exemptions and deferral options.',
      },
      {
        title: 'Ongoing Review as Rules Change',
        body: 'Revisit your strategy each year so changes to your business, family or the tax rules are reflected in your plan.',
      },
    ],
    why: {
      heading: 'Why Choose Diadem',
      paragraphs: [
        'Our tax strategy consultations assess your complete income picture, corporate and personal, to identify proactive planning opportunities that reduce your overall tax burden while keeping your financial plan fully aligned and compliant.',
        'Tax laws change constantly. We monitor federal and provincial tax legislation year-round and proactively adjust your strategy whenever changes create new opportunities or risks. And effective tax strategy pays for itself: the savings from proactive planning consistently outweigh the cost.',
      ],
      points: [
        'Corporate and personal tax planned together',
        'Reviewed as the rules change',
        'Coordinated with your advisor and lawyer',
      ],
    },
    planHeading: planCta,
    faqs: [
      {
        question: 'What is the difference between tax filing and tax strategy?',
        answer:
          'Tax filing is a backward-looking exercise; it reports what already happened. Tax strategy is forward-looking; it structures your decisions in advance to legally minimize what you owe before it becomes owing. At Diadem, we focus entirely on proactive tax strategy, not reactive filing. By planning ahead, we identify opportunities that are completely lost once the tax year has already closed, saving you money that a filing-only approach will never recover.',
      },
      {
        question: 'How do you reduce tax for incorporated professionals?',
        answer:
          'Incorporated professionals, doctors, dentists, lawyers, engineers, have access to powerful tax planning tools that most advisors never fully utilize. We implement strategies including retained earnings investment planning, salary and dividend optimization, income splitting with family members through proper structures, and corporate tax deferral, all working together to reduce your overall effective tax rate significantly and legally. The result is a strategy that keeps more money inside your corporation growing at a lower tax rate for longer.',
      },
      {
        question: 'What is income splitting and how does it benefit my family?',
        answer:
          'Income splitting is a strategy that distributes income among family members in lower tax brackets, reducing the total tax your family pays as a unit. Through properly structured family trusts, dividend payments to eligible family members, and spousal investment strategies, we legally shift income away from the highest earner and toward those who will pay less tax on it. Over time, this strategy can save families tens of thousands of dollars annually while building wealth more efficiently across the entire family unit.',
      },
      {
        question:
          'How do you approach tax strategy for business owners planning to sell?',
        answer:
          'A business sale is one of the most significant, and most tax-exposed, financial events of your life. We begin tax planning for a business exit years in advance, not weeks before closing. Our approach includes ensuring your shares qualify for the Lifetime Capital Gains Exemption, implementing an estate freeze to lock in today’s values, structuring a holding company to receive and protect sale proceeds, and planning the most tax-efficient distribution of those proceeds, ensuring you keep the maximum amount of what you have built over a lifetime of work.',
      },
      {
        question:
          'Can you help reduce tax on investment income inside my corporation?',
        answer:
          'Absolutely. Investment income earned inside a Canadian corporation is subject to higher tax rates under passive income rules, making proper planning essential. We structure your corporate investment accounts to minimize passive income tax exposure, utilize refundable tax mechanisms effectively, and plan withdrawal strategies that extract investment income from your corporation in the most tax-efficient manner possible, whether through dividends, capital gains, or other distribution strategies.',
      },
      {
        question: 'How often should my tax strategy be reviewed?',
        answer:
          'Your tax strategy should be reviewed at minimum once per year, ideally before your fiscal year end when there is still time to act on planning opportunities. Beyond the annual review, we proactively revisit your strategy whenever there are changes in federal or provincial tax legislation, significant changes in your income or business structure, or major personal life events such as marriage, divorce, a new child, a property purchase, or a business sale. Tax planning is not a one-time event; it is an ongoing discipline that requires constant attention to deliver its full value.',
      },
    ],
  },
  {
    slug: 'estate-legacy-planning',
    title: 'Estate & Legacy Planning',
    icon: ScrollText,
    image: legalImg,
    featured: false,
    heading: 'Estate and Legacy Planning for Business Owners',
    lead: 'A comprehensive legacy plan that integrates your corporate structure, investments, insurance, and family goals into one strategy.',
    summary:
      'A comprehensive legacy plan that integrates your corporate structure, investments, insurance, and family goals into one strategy.',
    features: [],
    cta: 'Book a Free Consultation',
    problem: {
      heading: 'Your Legacy Deserves to Be Protected and Preserved.',
      paragraphs: [
        'Estate and legacy planning at Diadem ensures that everything you have built during your lifetime is transferred to the people and causes you care about, efficiently, privately, and with the least possible tax burden. We go beyond simply drafting a will. We build a comprehensive legacy plan that integrates your corporate structure, investment portfolio, insurance coverage, and family goals into a single, cohesive strategy, ensuring your wealth survives and thrives long after you are gone.',
      ],
    },
    sections: [
      {
        title: 'Estate Tax & Probate Planning',
        body: 'Reduce taxes and delays on death through planning for ownership, beneficiaries and the use of trusts where appropriate.',
      },
      {
        title: 'Succession for Family Businesses',
        body: 'Plan how leadership and ownership pass to the next generation, with fair treatment of family members in and out of the business.',
      },
      {
        title: 'Insurance-Funded Estate Liquidity',
        body: 'Use insurance to provide cash when it is needed, so assets do not have to be sold to cover taxes or equalize shares.',
      },
      {
        title: 'Charitable Giving & Legacy Goals',
        body: 'Build giving into your estate plan in a tax-aware way, so your values continue beyond your lifetime.',
      },
    ],
    why: {
      heading: 'Why Choose Diadem',
      paragraphs: [
        'Our estate planning consultations assess your complete financial picture, assets, corporate structures, family dynamics, and legacy goals, to design a comprehensive plan that transfers your wealth exactly as you intend, with minimal tax and maximum efficiency.',
        'Your estate plan must evolve as your life evolves. We conduct ongoing reviews and proactive updates, so your plan always reflects your current wishes, family situation, and the latest tax legislation. The cost of a poorly planned estate is always far greater than the cost of planning it properly.',
      ],
      points: [
        'Corporate, investment and insurance planning in one strategy',
        'Reviewed as your life and the rules change',
        'Coordinated with your accountant and lawyer',
      ],
    },
    planHeading: planCta,
    faqs: [
      {
        question: 'What is estate planning and why is it important?',
        answer:
          'Estate planning is the process of arranging your financial affairs so that your assets are transferred to your chosen beneficiaries as efficiently and tax-effectively as possible upon your death or incapacity. Without a proper estate plan, your estate could face significant and entirely avoidable tax bills, legal complications, and family disputes, potentially eroding a substantial portion of the wealth you spent a lifetime building. A well-designed estate plan ensures your wishes are carried out exactly as you intend, your family is protected, and your legacy endures for generations to come.',
      },
      {
        question:
          'What is an estate freeze and how does it preserve my legacy?',
        answer:
          'An estate freeze is a strategy that locks in the current value of your estate at today’s tax cost and transfers all future growth to the next generation, significantly reducing the tax liability your estate will face. It is particularly powerful for business owners and incorporated professionals whose companies or investment portfolios are growing in value. Every year you delay implementing an estate freeze, more future growth becomes subject to tax at your death. The earlier it is implemented, the greater the legacy you preserve for the people and causes you care about most.',
      },
      {
        question:
          'How does a family trust protect and transfer generational wealth?',
        answer:
          'A family trust holds assets on behalf of your beneficiaries, typically your spouse and children, providing both tax efficiency and asset protection simultaneously. Income earned inside the trust can be distributed to family members in lower tax brackets, reducing your family’s overall tax burden significantly. Beyond tax savings, a family trust protects assets from creditors, ensures wealth is transferred according to your specific wishes, and keeps family assets out of the public probate process, providing privacy, protection, and peace of mind for your entire family.',
      },
      {
        question: 'How do you minimize tax at death for my estate?',
        answer:
          'Tax at death can be one of the largest single tax events your family ever faces, but with proper planning, it can be significantly reduced. We implement a combination of strategies including estate freezes to cap future growth, family trusts to distribute assets tax-efficiently, life insurance to cover residual tax liabilities, corporate structures to protect and transfer accumulated wealth, and charitable giving strategies for clients who wish to leave a philanthropic legacy.',
      },
    ],
  },
]

export const servicesPage = {
  seo: {
    title: 'Tax, Financial, Insurance & Legal Services Calgary | Diadem',
    description:
      'Accountants, financial advisors, insurance advisors and corporate lawyers working as one team for business owners in Calgary and across Alberta.',
  },
  heading: 'Accounting, Advisory, Insurance and Legal Services in Calgary',
  intro:
    'Connect with trusted professionals across the services your business needs, in Calgary and across Alberta.',
}

export const featuredServices = services.filter((s) => s.featured)

export const getService = (slug: string | undefined) =>
  services.find((s) => s.slug === slug)

export const servicePath = (slug: string) => `/service/${slug}/`
