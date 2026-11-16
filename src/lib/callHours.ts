// When discovery calls can be booked, in Alberta time. Shared by the contact form
// (src/components/ContactForm.tsx) and its server check (functions/api/contact.ts).

export const CALL_TIME_ZONE = 'America/Edmonton'
/** Each call is one hour */
const SLOT_MINUTES = 60

/** Opening hours per weekday (0 = Sunday), as [opening, closing] in hours; the last call ends at closing */
const HOURS: Record<number, [number, number] | undefined> = {
  1: [9, 19],
  2: [9, 19],
  3: [9, 19],
  4: [9, 19],
  5: [9, 19],
  6: [13, 17],
}

/** 9:00 AM, 12:30 PM, … */
function timeLabel(minutes: number) {
  const hour = Math.floor(minutes / 60)
  const minute = String(minutes % 60).padStart(2, '0')
  return `${hour % 12 || 12}:${minute} ${hour < 12 ? 'AM' : 'PM'}`
}

/** Weekday of a YYYY-MM-DD date (the calendar day itself, so no time zone shift) */
function weekday(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay()
}

/** Every slot that day, as { minutes after midnight, label } */
function slotsFor(date: string) {
  const hours = /^\d{4}-\d{2}-\d{2}$/.test(date) && HOURS[weekday(date)]
  if (!hours) return []
  const slots: { minutes: number; label: string }[] = []
  for (let m = hours[0] * 60; m < hours[1] * 60; m += SLOT_MINUTES) {
    slots.push({ minutes: m, label: timeLabel(m) })
  }
  return slots
}

/** Today's date and the time of day (in minutes) in Alberta */
export function albertaNow(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: CALL_TIME_ZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  )
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  }
}

/** The same calendar day one year later (Feb 29 rolls to Mar 1) */
export function oneYearAfter(date: string) {
  const [year, month, day] = date.split('-').map(Number)
  return new Date(Date.UTC(year + 1, month - 1, day)).toISOString().slice(0, 10)
}

/** The real moment a slot starts, e.g. ("2026-11-09", "2:30 PM") → 2026-11-09T21:30:00.000Z */
export function slotStart(date: string, label: string) {
  const match = /^(\d{1,2}):(\d{2}) (AM|PM)$/.exec(label)
  if (!match || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined
  const hour = (Number(match[1]) % 12) + (match[3] === 'PM' ? 12 : 0)
  const [year, month, day] = date.split('-').map(Number)
  const wallClock = Date.UTC(year, month - 1, day, hour, Number(match[2]))
  // Alberta's offset from UTC (it changes with daylight saving), found by
  // comparing the wall clock there with the guess; a second pass settles DST edges
  const offset = (time: number) => {
    const there = albertaNow(new Date(time))
    const [y, m, d] = there.date.split('-').map(Number)
    return Date.UTC(y, m - 1, d) + there.minutes * 60_000 - time
  }
  const guess = wallClock - offset(wallClock)
  return new Date(wallClock - offset(guess))
}

export const SLOT_LENGTH_MS = SLOT_MINUTES * 60_000

export const isClosed = (date: string) => !HOURS[weekday(date)]

/** Every slot label that day, past or not */
export const daySlots = (date: string) =>
  slotsFor(date).map((slot) => slot.label)

/** Time labels still open on that date: none on Sundays, and only later ones today */
export function openTimes(date: string, now = albertaNow()) {
  return slotsFor(date)
    .filter((slot) => date !== now.date || slot.minutes > now.minutes)
    .map((slot) => slot.label)
}
