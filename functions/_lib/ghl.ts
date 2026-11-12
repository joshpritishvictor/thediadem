// GoHighLevel (HighLevel API v2) helpers shared by the contact form and the assistant.

import { daySlots, SLOT_LENGTH_MS, slotStart } from '../../src/lib/callHours.ts'

const GHL_API = 'https://services.leadconnectorhq.com'
const TIMEOUT_MS = 10_000

/** API version header per endpoint group */
export const CONTACTS_VERSION = '2021-07-28'
export const CALENDARS_VERSION = 'v3'

// Tags come from visitor answers; only allow plain text so nothing odd reaches the CRM
const SAFE_TAG = /^[\w &/,-]{1,60}$/

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const PHONE = /^[+()\-.\s\d]{7,30}$/

const DAY_MS = 86_400_000

/** Consultations can be booked from today to one year ahead */
function bookingWindow() {
  const now = new Date()
  const today = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  )
  const oneYearOut = Date.UTC(
    now.getUTCFullYear() + 1,
    now.getUTCMonth(),
    now.getUTCDate(),
  )
  // A day of slack either side: the visitor's "today" can differ from the server's (UTC)
  return { start: today - DAY_MS, end: oneYearOut + 2 * DAY_MS }
}

/** A real YYYY-MM-DD date from today to one year ahead */
export function isValidCallDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const [year, month, day] = match.slice(1).map(Number)
  const date = Date.UTC(year, month - 1, day)
  // Rejects impossible dates like 2026-02-31, which Date.UTC rolls over
  if (new Date(date).getUTCDate() !== day) return false
  const { start, end } = bookingWindow()
  return date >= start && date < end
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT'
  body?: object
  query?: Record<string, string | number>
  version?: string
}

export async function ghl(
  path: string,
  token: string,
  {
    method = 'POST',
    body,
    query,
    version = CONTACTS_VERSION,
  }: RequestOptions = {},
) {
  const url = new URL(`${GHL_API}${path}`)
  for (const [key, value] of Object.entries(query ?? {}))
    url.searchParams.set(key, String(value))

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: version,
      Accept: 'application/json',
      ...(body && { 'Content-Type': 'application/json' }),
    },
    body: body && JSON.stringify(body),
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

/** Lowercased, de-duplicated tags with anything unsafe dropped */
export function cleanTags(tags: string[]) {
  return [
    ...new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => SAFE_TAG.test(tag)),
    ),
  ]
}

type Lead = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  source: string
  tags: string[]
  note: string
}

/**
 * Creates the contact, or updates the existing one with the same email/phone,
 * then adds tags and a note. Returns the contact ID.
 */
export async function saveLead(
  token: string,
  locationId: string,
  lead: Lead,
): Promise<string | undefined> {
  // Tags are NOT sent with the upsert: it replaces the whole tag list, which would
  // wipe a returning client's earlier tags (including marketing-consent)
  const { contact } = (await ghl('/contacts/upsert', token, {
    body: {
      locationId,
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      ...(lead.phone && { phone: lead.phone }),
      source: lead.source,
    },
  })) as { contact?: { id?: string } }

  if (contact?.id) {
    // The contact is already saved, so these shouldn't fail the submission
    const results = await Promise.allSettled([
      // Adds to the existing tags; "website-lead" triggers the follow-up workflow
      ghl(`/contacts/${contact.id}/tags`, token, {
        body: { tags: cleanTags(lead.tags) },
      }),
      ghl(`/contacts/${contact.id}/notes`, token, {
        body: { body: lead.note },
      }),
    ])
    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('GHL: follow-up request failed', result.reason)
      }
    }
  }
  return contact?.id
}

/** An event time from GHL: an ISO string with offset, or epoch milliseconds */
const eventTime = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number'
    ? new Date(value).getTime()
    : NaN

/**
 * Slot labels (e.g. "1:00 PM") on a YYYY-MM-DD day that overlap an appointment or a
 * blocked time on the calendar, even partly (a 1:30–2:00 booking takes the 1:00 slot)
 */
export async function bookedTimes(
  token: string,
  locationId: string,
  calendarId: string,
  date: string,
) {
  const slots = daySlots(date)
  const booked = new Set<string>()
  if (!slots.length) return booked

  const dayStart = slotStart(date, slots[0])!.getTime()
  const dayEnd = slotStart(date, slots.at(-1)!)!.getTime() + SLOT_LENGTH_MS
  const query = { locationId, calendarId, startTime: dayStart, endTime: dayEnd }
  const options = { method: 'GET', version: CALENDARS_VERSION, query } as const

  const [appointments, blocked] = await Promise.all([
    ghl('/calendars/events', token, options),
    // Blocked times also take a slot; a failure here shouldn't hide real bookings
    ghl('/calendars/blocked-slots', token, options).catch((error) => {
      console.error('GHL: blocked slots not read', error)
      return {}
    }),
  ])

  const busy: [number, number][] = []
  for (const result of [appointments, blocked]) {
    const events = (result as { events?: unknown }).events
    if (!Array.isArray(events)) continue
    for (const event of events as Record<string, unknown>[]) {
      if (event.deleted) continue
      if (['cancelled', 'invalid'].includes(String(event.appointmentStatus)))
        continue
      const start = eventTime(event.startTime)
      const end = eventTime(event.endTime)
      if (Number.isFinite(start) && Number.isFinite(end))
        busy.push([start, end])
    }
  }

  for (const label of slots) {
    const start = slotStart(date, label)!.getTime()
    const end = start + SLOT_LENGTH_MS
    if (busy.some(([from, to]) => from < end && to > start)) booked.add(label)
  }
  return booked
}

/** Books a slot on a GHL calendar for a contact */
export function createAppointment(
  token: string,
  appointment: {
    calendarId: string
    locationId: string
    contactId: string
    start: Date
    end: Date
    title: string
    description?: string
  },
) {
  return ghl('/calendars/events/appointments', token, {
    version: CALENDARS_VERSION,
    body: {
      calendarId: appointment.calendarId,
      locationId: appointment.locationId,
      contactId: appointment.contactId,
      startTime: appointment.start.toISOString(),
      endTime: appointment.end.toISOString(),
      title: appointment.title,
      ...(appointment.description && { description: appointment.description }),
      appointmentStatus: 'confirmed',
      // Our own hours and booked-slot check decide what's open, not the calendar's
      // availability settings in GHL
      ignoreFreeSlotValidation: true,
      // GHL sends its usual confirmation (if set up on the calendar)
      toNotify: true,
    },
  })
}
