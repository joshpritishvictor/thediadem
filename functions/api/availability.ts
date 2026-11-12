// Cloudflare Pages Function: GET /api/availability?date=YYYY-MM-DD
// Call times the contact form offers for a day: Diadem's hours (src/lib/callHours.ts),
// with the ones already taken on the GoHighLevel calendar marked as booked.
//
// Returns { times: ["9:00 AM", …], booked: ["1:00 PM", …] }.
// Uses GHL_API_TOKEN, GHL_LOCATION_ID and GHL_CALENDAR_ID (see functions/api/contact.ts).
// Without a calendar, or if GoHighLevel can't be read, nothing is marked booked; the
// time is checked again when the form is sent.

import { openTimes } from '../../src/lib/callHours.ts'
import { bookedTimes, isValidCallDate } from '../_lib/ghl.ts'

export type Env = {
  GHL_API_TOKEN?: string
  GHL_LOCATION_ID?: string
  GHL_CALENDAR_ID?: string
}

export async function GET(request: Request, env: Env) {
  const date = new URL(request.url).searchParams.get('date') ?? ''
  if (!isValidCallDate(date))
    return Response.json({ error: 'Invalid date.' }, { status: 400 })

  const times = openTimes(date)
  let booked: string[] = []
  if (
    env.GHL_API_TOKEN &&
    env.GHL_LOCATION_ID &&
    env.GHL_CALENDAR_ID &&
    times.length
  ) {
    try {
      const taken = await bookedTimes(
        env.GHL_API_TOKEN,
        env.GHL_LOCATION_ID,
        env.GHL_CALENDAR_ID,
        date,
      )
      booked = times.filter((time) => taken.has(time))
    } catch (error) {
      console.error('Availability: GoHighLevel request failed', error)
    }
  }

  return Response.json(
    { times, booked },
    // Fresh each time: someone else may have just booked a slot
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

// Cloudflare Pages routes GET /api/availability to this export; the dev plugin calls it the same way
export const onRequestGet = (context: { request: Request; env: Env }) =>
  GET(context.request, context.env)
