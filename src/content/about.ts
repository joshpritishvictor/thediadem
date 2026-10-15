import {
  Briefcase,
  Calculator,
  Handshake,
  MessagesSquare,
  Scale,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'
import hemaImg from '../assets/images/team/hema.webp'
import jeswinImg from '../assets/images/team/jeswin.webp'
import joshImg from '../assets/images/team/josh.webp'
import judithImg from '../assets/images/team/judith.webp'
import wankelImg from '../assets/images/team/wankel.webp'

export type Person = {
  name: string
  /** Designations shown after the name, e.g. "CPA, CFP" */
  credentials?: string
  initials: string
  /** Portrait; people without one get their initials on a green block */
  photo?: string
  role: string
  body: string
}

export const about = {
  eyebrow: 'Meet the People Behind Diadem',
  heading: 'Shared Expertise. One Vision.',
  intro:
    'Behind every business is hard work and sacrifice. The people who help you plan for what you’ve built should understand that. Diadem brings together professionals to make complex financial conversations simpler and more collaborative.',
  // The intro paragraph, boiled down to three short points
  points: [
    {
      icon: Briefcase,
      title: 'Built on hard work',
      body: 'Every business is built on sacrifice. We respect what it took.',
    },
    {
      icon: Handshake,
      title: 'People who understand',
      body: 'Your plan deserves people who understand what you’ve built.',
    },
    {
      icon: MessagesSquare,
      title: 'Simpler conversations',
      body: 'Complex financial talks, made simple and truly collaborative.',
    },
  ] satisfies { icon: LucideIcon; title: string; body: string }[],

  founders: {
    eyebrow: 'Our Founders',
    people: [
      {
        name: 'Josh Victor',
        credentials: 'MPH, PG Dip (Fin Serv), HLLQP, CSC',
        photo: joshImg,
        initials: 'JV',
        role: 'Chief Executive Officer & Founder',
        body: 'Josh’s career spans healthcare and financial services. Working with business owners, he kept seeing capable people miss financial gaps they didn’t know to look for. He founded Diadem to close those gaps by bringing the right professionals together.',
      },
      {
        name: 'Judith Victor',
        photo: judithImg,
        initials: 'JV',
        role: 'President & Co-Founder',
        body: 'As a business owner and healthcare professional, Judith knows firsthand that a high income doesn’t make managing wealth simpler. She leads Diadem strategically and oversees the structure behind its operations, keeping our approach practical.',
      },
    ] satisfies Person[],
  },

  team: {
    eyebrow: 'Our Team',
    people: [
      {
        name: 'Wankel Garingalao',
        credentials: 'CPA, HLLQP',
        photo: wankelImg,
        initials: 'WG',
        role: 'Head of Accounting & Business Strategy',
        body: 'Brings about two decades of accounting experience to corporate structure and tax-planning considerations.',
      },
      {
        name: 'Jeswin Switzer',
        photo: jeswinImg,
        initials: 'JS',
        role: 'Director of Operations',
        body: 'Keeps Diadem’s workflows and team running smoothly, so client requests move from the first conversation to follow-through without delays.',
      },
      {
        name: 'Loryn Green',
        initials: 'LG',
        role: 'Digital Marketing & Client Success Specialist',
        body: 'Connects business owners with Diadem and supports every client, answering questions and making each step of the process feel straightforward and personal.',
      },
      {
        name: 'Shri Hema Priya Ganesan',
        photo: hemaImg,
        initials: 'SG',
        role: 'Software Architect',
        body: 'Architects the technology behind Diadem’s website, CRM, and automation, ensuring information flows securely and reliably between clients, our team, and our partners.',
      },
    ] satisfies Person[],
  },

  partners: {
    eyebrow: 'Our Professional Partners',
    roles: [
      { icon: Calculator, title: 'Accountants' },
      { icon: TrendingUp, title: 'Financial Advisors' },
      { icon: ShieldCheck, title: 'Insurance Agents' },
      { icon: Scale, title: 'Lawyers' },
    ] satisfies { icon: LucideIcon; title: string }[],
    expertise: 'Each practises in their own area of expertise',
    together: 'We help them work together around your goals',
  },
}
