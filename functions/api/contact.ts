// Cloudflare Pages Function: POST /api/contact
// Saves contact form submissions to GoHighLevel (HighLevel API v2, Private Integration token).
//
// Required environment variables (Cloudflare → Workers & Pages → project → Settings →
// Variables and Secrets, stored as encrypted secrets):
//   GHL_API_TOKEN    Private Integration token with "View Contacts" + "Edit Contacts" scopes
//   GHL_LOCATION_ID  Sub-account (location) ID
// Optional:
//   GHL_TAGS         Extra comma-separated tags for every lead (default: "website-lead")

import { EMAIL, isValidCallDate, PHONE, saveLead } from '../_lib/ghl.ts'

const LIMITS = {
  firstName: 80,
  lastName: 80,
  email: 254,
  phone: 30,
  preferredContact: 40,
  preferredDate: 10,
  service: 80,
  entityType: 80,
  message: 3000,
} as const

type Field = keyof typeof LIMITS
type Submission = Record<Field, string> & { consent: boolean }

/** Variables Cloudflare passes to the function (see .env.example) */
export type Env = {
  GHL_API_TOKEN?: string
  GHL_LOCATION_ID?: string
  GHL_TAGS?: string
}

const json = (body: object, status = 200) => Response.json(body, { status })

/** Trims, length-limits and type-checks the untrusted request body */
function parseSubmission(body: unknown): Submission | string {
  if (typeof body !== 'object' || body === null) return 'Invalid request.'
  const raw = body as Record<string, unknown>

  const data = {} as Submission
  for (const [field, max] of Object.entries(LIMITS) as [Field, number][]) {
    const value = raw[field]
    data[field] = typeof value === 'string' ? value.trim().slice(0, max) : ''
  }
  data.consent = raw.consent === 'yes' || raw.consent === true

  if (!data.firstName || !data.lastName) return 'Please enter your name.'
  if (!EMAIL.test(data.email)) return 'Please enter a valid email address.'
  if (!PHONE.test(data.phone)) return 'Please enter a valid phone number.'
  if (data.preferredDate && !isValidCallDate(data.preferredDate))
    return 'Please choose a call date between today and one year from now.'
  return data
}

function buildNote(data: Submission) {
  const lines = [
    'Website contact form — discovery call request',
    '',
    `Preferred contact method: ${data.preferredContact || '—'}`,
    `Preferred call date: ${data.preferredDate || '—'}`,
    `Service needed: ${data.service || '—'}`,
    `Business / employment type: ${data.entityType || '—'}`,
    `Consent to electronic communications: ${data.consent ? 'Yes' : 'No'}`,
    `Submitted: ${new Date().toISOString()}`,
  ]
  if (data.message) lines.push('', 'Message:', data.message)
  return lines.join('\n')
}

export async function POST(request: Request, env: Env) {
  const token = env.GHL_API_TOKEN
  const locationId = env.GHL_LOCATION_ID
  if (!token || !locationId) {
    console.error('Contact form: GHL_API_TOKEN or GHL_LOCATION_ID is not set')
    return json({ error: 'The form is not configured yet.' }, 500)
  }

  // Only accept submissions from our own pages
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ error: 'Forbidden.' }, 403)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }

  // Honeypot: real visitors never see this field, so pretend success to bots
  if ((body as Record<string, unknown>)?.company) return json({ ok: true })

  const data = parseSubmission(body)
  if (typeof data === 'string') return json({ error: data }, 400)

  try {
    await saveLead(token, locationId, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      source: 'Website contact form',
      tags: [
        ...(env.GHL_TAGS ?? 'website-lead').split(','),
        data.service,
        data.consent ? 'marketing-consent' : '',
      ],
      note: buildNote(data),
    })

    return json({ ok: true })
  } catch (error) {
    console.error('Contact form: GoHighLevel request failed', error)
    return json({ error: 'Could not send your request.' }, 502)
  }
}

// Cloudflare Pages routes POST /api/contact to this export; the dev plugin calls it the same way
export const onRequestPost = (context: { request: Request; env: Env }) =>
  POST(context.request, context.env)
