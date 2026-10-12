// Vercel serverless function: POST /api/contact
// Saves contact form submissions to GoHighLevel (HighLevel API v2, Private Integration token).
//
// Required environment variables (Vercel → Project → Settings → Environment Variables):
//   GHL_API_TOKEN    Private Integration token with "View Contacts" + "Edit Contacts" scopes
//   GHL_LOCATION_ID  Sub-account (location) ID
// Optional:
//   GHL_TAGS         Extra comma-separated tags for every lead (default: "website-lead")

const GHL_API = 'https://services.leadconnectorhq.com'
const GHL_VERSION = '2021-07-28'
const TIMEOUT_MS = 10_000

const LIMITS = {
  firstName: 80,
  lastName: 80,
  email: 254,
  phone: 30,
  preferredContact: 40,
  service: 80,
  entityType: 80,
  message: 3000,
} as const

type Field = keyof typeof LIMITS
type Submission = Record<Field, string> & { consent: boolean }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^[+()\-.\s\d]{7,30}$/
// Tags come from dropdown answers; only allow plain text so nothing odd reaches the CRM
const SAFE_TAG = /^[\w &/,-]{1,60}$/

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
  if (data.phone && !PHONE.test(data.phone))
    return 'Please enter a valid phone number.'
  return data
}

async function ghl(path: string, token: string, body: object) {
  const response = await fetch(`${GHL_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Version: GHL_VERSION,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) {
    // Logged server-side only; never sent to the browser
    throw new Error(
      `GHL ${path} ${response.status}: ${(await response.text()).slice(0, 500)}`,
    )
  }
  return response.json() as Promise<Record<string, unknown>>
}

function buildNote(data: Submission) {
  const lines = [
    'Website contact form — discovery call request',
    '',
    `Preferred contact method: ${data.preferredContact || '—'}`,
    `Service needed: ${data.service || '—'}`,
    `Business / employment type: ${data.entityType || '—'}`,
    `Consent to electronic communications: ${data.consent ? 'Yes' : 'No'}`,
    `Submitted: ${new Date().toISOString()}`,
  ]
  if (data.message) lines.push('', 'Message:', data.message)
  return lines.join('\n')
}

export async function POST(request: Request) {
  const token = process.env.GHL_API_TOKEN
  const locationId = process.env.GHL_LOCATION_ID
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

  const tags = [
    ...(process.env.GHL_TAGS ?? 'website-lead').split(','),
    data.service,
    data.consent ? 'marketing-consent' : '',
  ]
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => SAFE_TAG.test(tag))

  try {
    // Creates the contact, or updates the existing one with the same email/phone.
    // Tags are NOT sent here: upsert replaces the whole tag list, which would wipe
    // a returning client's earlier tags (including marketing-consent).
    const { contact } = (await ghl('/contacts/upsert', token, {
      locationId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      ...(data.phone && { phone: data.phone }),
      source: 'Website contact form',
    })) as { contact?: { id?: string } }

    if (contact?.id) {
      // The contact is already saved, so these shouldn't fail the submission
      const results = await Promise.allSettled([
        // Adds to the existing tags; "website-lead" triggers the follow-up workflow
        ghl(`/contacts/${contact.id}/tags`, token, { tags }),
        ghl(`/contacts/${contact.id}/notes`, token, { body: buildNote(data) }),
      ])
      for (const result of results) {
        if (result.status === 'rejected') {
          console.error('Contact form: follow-up request failed', result.reason)
        }
      }
    }

    return json({ ok: true })
  } catch (error) {
    console.error('Contact form: GoHighLevel request failed', error)
    return json({ error: 'Could not send your request.' }, 502)
  }
}
