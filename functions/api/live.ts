// Cloudflare Pages Function: POST /api/live
// The website chat's line to GoHighLevel, where Kiara (GHL's AI agent) and the team
// answer (see functions/_lib/liveChat.ts).
//
//   { action: 'start', text }          → { session }: new visitor, first message
//   { action: 'send', session, text }  → posts the visitor's next message
//   { action: 'person', session?, name, phone, email } → saves their details on the contact
//                                        and asks for a real person → { session }
//   { action: 'poll', session, since } → { replies: [{ id, text, at, from }] } newer than since
//
// Uses GHL_API_TOKEN (with the conversation scopes) and GHL_LOCATION_ID. With
// GHL_CONVERSATION_PROVIDER_ID and the Marketplace app connected (GHL_CLIENT_ID,
// GHL_CLIENT_SECRET, GHL_TOKENS; see functions/_lib/ghlApp.ts), visitor messages go in on
// the "Website chat" channel so the team can reply on it; otherwise they go in as Live Chat.

import { EMAIL, PHONE } from '../_lib/ghl.ts'
import { appToken, type AppEnv } from '../_lib/ghlApp.ts'
import {
  chatReplies,
  createSession,
  postVisitorMessage,
  readSession,
  requestPerson,
  type Channel,
  startVisitorChat,
} from '../_lib/liveChat.ts'

type Env = AppEnv & {
  GHL_API_TOKEN?: string
  GHL_LOCATION_ID?: string
  GHL_CONVERSATION_PROVIDER_ID?: string
}

const MAX_MESSAGE_CHARS = 2000

const json = (body: object, status = 200) => Response.json(body, { status })

const messageText = (value: unknown) =>
  typeof value === 'string' ? value.trim().slice(0, MAX_MESSAGE_CHARS) : ''

export async function POST(request: Request, env: Env) {
  const token = env.GHL_API_TOKEN
  const locationId = env.GHL_LOCATION_ID
  if (!token || !locationId)
    return json({ error: 'Live chat is not configured.' }, 503)

  // Only accept requests from our own pages
  const origin = request.headers.get('origin')
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ error: 'Forbidden.' }, 403)
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ error: 'Invalid request.' }, 400)
  }
  const providerId = env.GHL_CONVERSATION_PROVIDER_ID || undefined
  /** "Website chat" with the app's token, when both are available */
  const channel = async (): Promise<Channel | undefined> => {
    if (!providerId) return undefined
    const token = await appToken(env, locationId)
    return token ? { providerId, token } : undefined
  }

  try {
    if (body?.action === 'start') {
      const text = messageText(body.text)
      if (!text) return json({ error: 'Empty message.' }, 400)
      const conversationId = await startVisitorChat(
        token,
        locationId,
        text,
        await channel(),
      )
      return json({ session: await createSession(token, conversationId) })
    }

    if (body?.action === 'person') {
      const field = (value: unknown, max: number) =>
        typeof value === 'string' ? value.trim().slice(0, max) : ''
      const [firstName, ...rest] = field(body.name, 160).split(/\s+/)
      const phone = field(body.phone, 30)
      const email = field(body.email, 254)
      if (!firstName) return json({ error: 'Name is needed.' }, 400)
      if (!PHONE.test(phone)) return json({ error: 'Invalid phone.' }, 400)
      if (!EMAIL.test(email)) return json({ error: 'Invalid email.' }, 400)
      // Without a chat yet, a new one is started on their contact
      const current = body.session
        ? await readSession(token, body.session)
        : undefined
      if (body.session && !current)
        return json({ error: 'Invalid session.' }, 403)
      const conversationId = await requestPerson(
        token,
        locationId,
        current,
        { firstName, lastName: rest.join(' '), email, phone },
        await channel(),
      )
      return json({ session: await createSession(token, conversationId) })
    }

    const conversationId = await readSession(token, body?.session)
    if (!conversationId) return json({ error: 'Invalid session.' }, 403)

    if (body.action === 'send') {
      const text = messageText(body.text)
      if (!text) return json({ error: 'Empty message.' }, 400)
      await postVisitorMessage(token, conversationId, text, await channel())
      return json({ sent: true })
    }
    if (body.action === 'poll') {
      const since = typeof body.since === 'number' ? body.since : Date.now()
      return json({
        replies: await chatReplies(token, conversationId, since, providerId),
      })
    }
    return json({ error: 'Invalid request.' }, 400)
  } catch (error) {
    console.error('Live chat: request failed', error)
    return json({ error: 'Live chat is unavailable right now.' }, 502)
  }
}

// Cloudflare Pages routes POST /api/live to this export; the dev plugin calls it the same way
export const onRequestPost = (context: { request: Request; env: Env }) =>
  POST(context.request, context.env)
