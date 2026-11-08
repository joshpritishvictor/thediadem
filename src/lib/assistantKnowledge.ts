import { faqs } from '../content/faq'
import { servicePath, services } from '../content/services'
import { contactLink, navLinks, site } from '../content/site'

/** What Crest (the Claude-powered assistant) knows, built from the site's own content */
export type AssistantKnowledge = {
  /** Plain-text reference given to Claude as its system prompt context */
  text: string
  /** Pages the assistant may link to: path → label */
  links: Record<string, string>
}

export function buildAssistantKnowledge(): AssistantKnowledge {
  const links: Record<string, string> = {}
  for (const { to, label } of [...navLinks, contactLink]) links[to] = label

  const sections = [
    `# ${site.legalName} (${site.name})`,
    site.description,
    `Tagline: ${site.tagline}`,
    `Location: ${site.location}`,
    `Phone: ${site.contact.phone}`,
    `Email: ${site.contact.email}`,
    `Website: ${site.url}`,
    `Free consultations are booked on the Contact Us page (${contactLink.to}).`,
    '',
    '# Services',
  ]

  for (const s of services) {
    const path = servicePath(s.slug)
    links[path] = s.title
    sections.push(
      '',
      `## ${s.title} (page: ${path})`,
      s.summary,
      `Highlights: ${s.features.join('; ')}`,
      `${s.intro.heading}: ${s.intro.body}`,
      ...s.offerings.map((o) => `- ${o.title}: ${o.description}`),
      `${s.closing.heading}: ${s.closing.body}`,
      ...s.faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
    )
  }

  sections.push(
    '',
    '# General FAQs (page: /faq/)',
    ...faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
  )

  return { text: sections.join('\n'), links }
}
