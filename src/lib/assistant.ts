import { faqs } from '../content/faq'
import { featuredServices, servicePath } from '../content/services'
import { contactLink, site } from '../content/site'

export type Reply = { text: string; link?: { to: string; label: string } }

const booking: Reply = {
  text: `You can book a free consultation online, or call us at ${site.contact.phone}.`,
  link: { to: contactLink.to, label: 'Book a Free Consultation' },
}

const fallback: Reply = {
  text: `I’m not sure about that one. A member of our team can help directly at ${site.contact.phone}.`,
  link: { to: contactLink.to, label: 'Contact us' },
}

const stop = new Set(
  'a an and are as at be by can do does for from how i in is it me my of on or our so that the this to we what when where which who why will with you your about get have'.split(
    ' ',
  ),
)

export const words = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stop.has(w))

// What the assistant knows: each FAQ, and each service, with the words that describe it
const knowledge = [
  ...faqs.map(({ question, answer }) => ({
    terms: [...words(question), ...words(question), ...words(answer)],
    reply: { text: answer } satisfies Reply,
  })),
  ...featuredServices.map(({ slug, title, summary }) => ({
    terms: [...words(title), ...words(title), ...words(summary)],
    reply: {
      text: `${title}: ${summary}`,
      link: { to: servicePath(slug), label: `Explore ${title}` },
    } satisfies Reply,
  })),
]

export function answer(question: string): Reply {
  const q = question.toLowerCase()
  if (
    /\b(book|appointment|consult|call|phone|contact|reach|speak|talk)/.test(q)
  )
    return booking
  if (/\b(hi|hello|hey)\b/.test(q))
    return { text: 'Hello! What would you like to know about Diadem?' }
  if (/\b(services?|offer|help with)\b/.test(q))
    return {
      text: `We connect you with licensed professionals across ${featuredServices
        .map((s) => s.title.toLowerCase())
        .join(', ')}.`,
      link: { to: '/our-services/', label: 'See our services' },
    }

  const asked = new Set(words(question))
  let best = { score: 0, reply: fallback }
  for (const item of knowledge) {
    const score = item.terms.filter((t) => asked.has(t)).length
    if (score > best.score) best = { score, reply: item.reply }
  }
  return best.score >= 2 ? best.reply : fallback
}
