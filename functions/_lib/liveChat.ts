// The website chat (src/components/AiAssistant.tsx) runs on GoHighLevel: every visitor
// message goes into a GHL conversation, and GHL's AI agent (Kiara, Conversation AI on the
// Live Chat channel) answers there. The chat polls /api/live and shows her replies, and
// the team's, in the same window.
//
// - The first message creates an anonymous "Website visitor" contact (tag "website-chat")
//   and its conversation. Kiara collects their details and books as configured in GHL.
// - When Kiara hands over (her Human Handover action), the team replies from GHL
//   Conversations or the mobile app on "Website chat": a custom conversation provider
//   from the "Diadem Website Chat" Marketplace app (GHL_CONVERSATION_PROVIDER_ID). Visitor
//   messages go in on that channel (posted with the app's own token, ghlApp.ts), and
//   replies on it appear only in the chat. If the app isn't connected, messages go in as
//   Live Chat and the team can only reply by email or SMS (GHL only offers Live Chat
//   replies inside its own widget); those replies show in the chat too, but also reach
//   the visitor's inbox or phone.
// - Workflow, campaign and other automated sends are ignored, so the visitor only sees
//   Kiara and real people.
//
// startHandover is the older entry point for functions/api/assistant.ts (Claude), which
// hands a visitor to the team the same way.
//
// The browser holds a signed session ("<conversationId>.<signature>"), so it can only
// read and write the conversation it was handed. Signed with the GHL token (server only).
//
// Token scopes needed, on top of the contact ones: "View/Edit Conversations" and
// "View/Edit Conversation Messages".

import { CONTACTS_VERSION, ghl, saveLead } from './ghl.ts'

const CONVERSATIONS_VERSION = '2021-04-15'
/** Kiara's replies (and anything else sent on Live Chat) */
const AGENT_REPLY_TYPE = 'TYPE_LIVE_CHAT'
/** Message types that a person on the team sends from GHL */
const TEAM_REPLY_TYPES = new Set(['TYPE_EMAIL', 'TYPE_SMS'])
/** Automated sends (e.g. the "we've received your request" workflow email), not a person */
const AUTOMATED_SOURCES = new Set([
  'workflow',
  'campaign',
  'bulk_actions',
  'api',
])
const MAX_REPLY_CHARS = 2000

type Visitor = {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

// --- Signed session -------------------------------------------------------------

const encoder = new TextEncoder()

async function signature(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(`diadem-live-chat:${secret}`),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return btoa(String.fromCharCode(...new Uint8Array(mac).slice(0, 18)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export async function createSession(secret: string, conversationId: string) {
  return `${conversationId}.${await signature(secret, conversationId)}`
}

/** The conversation ID, if the session was issued by us */
export async function readSession(secret: string, session: unknown) {
  if (typeof session !== 'string' || session.length > 200) return undefined
  const [conversationId, mac] = session.split('.')
  if (!conversationId || !/^\w{10,40}$/.test(conversationId) || !mac)
    return undefined
  const expected = await signature(secret, conversationId)
  // Same length and constant-time-ish comparison
  if (expected.length !== mac.length) return undefined
  let diff = 0
  for (let i = 0; i < mac.length; i++)
    diff |= mac.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0 ? conversationId : undefined
}

// --- GHL conversations ------------------------------------------------------------

async function conversationFor(
  token: string,
  locationId: string,
  contactId: string,
) {
  const found = (await ghl('/conversations/search', token, {
    method: 'GET',
    version: CONVERSATIONS_VERSION,
    query: { locationId, contactId },
  })) as { conversations?: { id?: string }[] }
  const existing = found.conversations?.[0]?.id
  if (existing) return existing

  const created = (await ghl('/conversations/', token, {
    version: CONVERSATIONS_VERSION,
    body: { locationId, contactId },
  })) as { conversation?: { id?: string } }
  if (!created.conversation?.id)
    throw new Error('GHL: conversation not created')
  return created.conversation.id
}

/**
 * The "Website chat" conversation provider and the Marketplace app's token, which is
 * the only token GHL accepts for posting on it (functions/_lib/ghlApp.ts)
 */
export type Channel = { providerId: string; token: string }

/**
 * Adds a visitor message to the conversation: on "Website chat" when the app is
 * connected, otherwise (or if GHL refuses it) as Live Chat with the main token
 */
export async function postVisitorMessage(
  token: string,
  conversationId: string,
  message: string,
  channel?: Channel,
) {
  if (channel) {
    try {
      await ghl('/conversations/messages/inbound', channel.token, {
        version: CONVERSATIONS_VERSION,
        body: {
          type: 'Custom',
          conversationProviderId: channel.providerId,
          conversationId,
          message,
        },
      })
      return
    } catch (error) {
      console.error('Live chat: "Website chat" refused, using Live Chat', error)
    }
  }
  await ghl('/conversations/messages/inbound', token, {
    version: CONVERSATIONS_VERSION,
    body: { type: 'Live_Chat', conversationId, message },
  })
}

/** Marks the team's "Website chat" reply as delivered (only the app's token may) */
export async function markDelivered(appToken: string, messageId: string) {
  await ghl(`/conversations/messages/${messageId}/status`, appToken, {
    method: 'PUT',
    version: CONVERSATIONS_VERSION,
    body: { status: 'delivered' },
  })
}

/** Starts a chat for a new visitor: an anonymous contact, its conversation and their first message. Returns the conversation ID. */
export async function startVisitorChat(
  token: string,
  locationId: string,
  message: string,
  channel?: Channel,
) {
  const { contact } = (await ghl('/contacts/', token, {
    version: CONTACTS_VERSION,
    body: {
      locationId,
      firstName: 'Website',
      lastName: 'visitor',
      source: 'Website chat',
      tags: ['website-chat'],
    },
  })) as { contact?: { id?: string } }
  if (!contact?.id) throw new Error('GHL: contact not created')

  const conversationId = await conversationFor(token, locationId, contact.id)
  await postVisitorMessage(token, conversationId, message, channel)
  return conversationId
}

/**
 * The visitor asked for a real person and gave their details: saves them on their
 * contact, then posts the request so Kiara's Human Handover runs. Returns the
 * conversation ID (a new one if their details belong to another contact).
 */
export async function requestPerson(
  token: string,
  locationId: string,
  conversationId: string | undefined,
  visitor: Visitor & { phone: string },
  channel?: Channel,
) {
  const note = [
    'Website chat: asked to talk to a real person',
    '',
    `Name: ${`${visitor.firstName} ${visitor.lastName}`.trim()}`,
    `Phone: ${visitor.phone}`,
    `Email: ${visitor.email}`,
    `Requested: ${new Date().toISOString()}`,
  ].join('\n')

  let target = conversationId
  let contactId: string | undefined
  if (target) {
    // Fill in the anonymous contact this chat started with, keeping the chat history on it
    const found = (await ghl(`/conversations/${target}`, token, {
      method: 'GET',
      version: CONVERSATIONS_VERSION,
    })) as { contactId?: string; conversation?: { contactId?: string } }
    contactId = found.contactId ?? found.conversation?.contactId
    if (contactId) {
      try {
        await ghl(`/contacts/${contactId}`, token, {
          method: 'PUT',
          body: {
            firstName: visitor.firstName,
            lastName: visitor.lastName,
            email: visitor.email,
            phone: visitor.phone,
          },
        })
        await Promise.allSettled([
          ghl(`/contacts/${contactId}/tags`, token, {
            body: { tags: ['human handover'] },
          }),
          ghl(`/contacts/${contactId}/notes`, token, { body: { body: note } }),
        ])
      } catch (error) {
        // Usually: the email or phone already belongs to another contact
        console.error('Live chat: contact not updated, using upsert', error)
        contactId = undefined
      }
    }
  }

  if (!contactId) {
    // No chat yet, or the details match an existing client: save on that contact
    contactId = await saveLead(token, locationId, {
      ...visitor,
      source: 'Website chat',
      tags: ['website-chat', 'human handover'],
      note,
    })
    if (!contactId) throw new Error('GHL: upsert returned no contact ID')
    target = await conversationFor(token, locationId, contactId)
  }

  await postVisitorMessage(
    token,
    target!,
    [
      'I’d like to talk to a real person.',
      `Name: ${`${visitor.firstName} ${visitor.lastName}`.trim()}`,
      `Phone: ${visitor.phone}`,
      `Email: ${visitor.email}`,
    ].join('\n'),
    channel,
  )
  return target!
}

/**
 * Saves the visitor, tags them for the team ("human handover" triggers the alert
 * workflow) and opens the conversation with their request. Returns its ID.
 */
export async function startHandover(
  token: string,
  locationId: string,
  visitor: Visitor,
  summary: string,
  tags: string[],
  channel?: Channel,
) {
  const contactId = await saveLead(token, locationId, {
    ...visitor,
    source: 'Website AI assistant',
    tags: [...tags, 'ai-assistant', 'human handover'],
    note: [
      'Website AI assistant (Crest): asked to talk to a person',
      '',
      `What they need: ${summary || '—'}`,
      `Requested: ${new Date().toISOString()}`,
    ].join('\n'),
  })
  if (!contactId) throw new Error('GHL: upsert returned no contact ID')

  const conversationId = await conversationFor(token, locationId, contactId)
  await postVisitorMessage(
    token,
    conversationId,
    [
      'Website chat (Crest): this visitor asked to talk to a person.',
      `What they need: ${summary || '—'}`,
      '',
      channel
        ? 'Reply on "Website chat" here. Your reply shows up in their chat window on the website.'
        : 'Reply by email here. Your reply shows up in their chat window on the website, and they get it by email too.',
    ].join('\n'),
    channel,
  )
  return conversationId
}

// --- Team replies -------------------------------------------------------------------

type GhlMessage = {
  id?: string
  direction?: string
  messageType?: string
  body?: string
  dateAdded?: string
  source?: string
  conversationProviderId?: string
  meta?: { email?: { messageIds?: string[] } }
}

const entities: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  '#39': "'",
}

/** Plain text from an email body: no HTML, no quoted earlier messages or signature line */
export function emailText(body: string) {
  let text = body
    .replace(/<(style|script|head)[\s\S]*?<\/\1>/gi, '')
    // Gmail/Outlook wrap the quoted thread in these
    .replace(/<blockquote[\s\S]*$/i, '')
    .replace(/<div[^>]*class="?gmail_quote[\s\S]*$/i, '')
    .replace(/<(br|\/p|\/div|\/li|\/h\d)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(#?\w+);/g, (m, name: string) =>
      name in entities
        ? entities[name]
        : /^#\d+$/.test(name)
          ? String.fromCharCode(Number(name.slice(1)))
          : m,
    )

  // Cut plain-text quotes: "On … wrote:", "-----Original Message-----", "> …"
  const lines: string[] = []
  for (const line of text.split('\n')) {
    if (
      /^\s*On .{3,200} wrote:\s*$/.test(line) ||
      /^\s*-{2,}\s*Original Message/i.test(line) ||
      /^\s*From:\s.+/.test(line)
    )
      break
    if (/^\s*>/.test(line)) continue
    lines.push(line.trimEnd())
  }
  text = lines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return text.slice(0, MAX_REPLY_CHARS)
}

/** GHL's compliance footer on texts ("Reply STOP to unsubscribe." and the sign-off after it) */
function withoutSmsFooter(body: string) {
  const lines = body.trim().split('\n')
  const stop = lines.findIndex((line) =>
    /reply stop to unsubscribe/i.test(line),
  )
  return (stop === -1 ? lines : lines.slice(0, stop)).join('\n').trim()
}

async function messageText(token: string, message: GhlMessage) {
  if (message.messageType === 'TYPE_SMS')
    return withoutSmsFooter(message.body ?? '')
  if (message.messageType !== 'TYPE_EMAIL') return (message.body ?? '').trim()
  let body = message.body ?? ''
  const emailId = message.meta?.email?.messageIds?.at(-1)
  if (!body && emailId) {
    const email = (await ghl(
      `/conversations/messages/email/${emailId}`,
      token,
      {
        method: 'GET',
        version: CONVERSATIONS_VERSION,
      },
    )) as { emailMessage?: { body?: string } }
    body = email.emailMessage?.body ?? ''
  }
  return emailText(body)
}

export type ChatReply = {
  id: string
  text: string
  at: number
  /** "agent": Kiara on Live Chat; "team": a person replying by email, SMS or Website chat */
  from: 'agent' | 'team'
}

/** Replies in the conversation newer than `since` (epoch ms), oldest first */
export async function chatReplies(
  token: string,
  conversationId: string,
  since: number,
  providerId?: string,
) {
  const result = (await ghl(
    `/conversations/${conversationId}/messages`,
    token,
    {
      method: 'GET',
      version: CONVERSATIONS_VERSION,
      query: { limit: 20 },
    },
  )) as { messages?: { messages?: GhlMessage[] } }

  const isTeam = (m: GhlMessage) =>
    TEAM_REPLY_TYPES.has(m.messageType ?? '') ||
    (providerId !== undefined && m.conversationProviderId === providerId)
  const fresh = (result.messages?.messages ?? []).filter(
    (m) =>
      m.id &&
      m.direction === 'outbound' &&
      (m.messageType === AGENT_REPLY_TYPE || isTeam(m)) &&
      !AUTOMATED_SOURCES.has(m.source ?? '') &&
      Date.parse(m.dateAdded ?? '') > since,
  )

  const replies: ChatReply[] = []
  for (const m of fresh.reverse()) {
    const text = await messageText(token, m)
    if (text)
      replies.push({
        id: m.id!,
        text,
        at: Date.parse(m.dateAdded!),
        from: isTeam(m) ? 'team' : 'agent',
      })
  }
  return replies
}
