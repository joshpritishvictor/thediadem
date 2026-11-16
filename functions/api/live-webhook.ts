// Cloudflare Pages Function: POST /api/live-webhook
// Delivery URL of the custom "Website chat" conversation provider in GoHighLevel (see
// functions/_lib/liveChat.ts). When the team replies on "Website chat", GHL saves the
// message in the conversation and posts it here. The website chat already reads replies
// straight from the conversation (/api/live), so this only marks the message delivered,
// otherwise GHL shows it as pending/failed in Conversations.
//
// The payload isn't trusted for anything else: it can only mark a message on our own
// location as delivered, using the Marketplace app's token (functions/_lib/ghlApp.ts).

import { appToken, type AppEnv } from '../_lib/ghlApp.ts'
import { markDelivered } from '../_lib/liveChat.ts'

type Env = AppEnv & { GHL_LOCATION_ID?: string }

const ok = () => Response.json({ received: true })

export async function POST(request: Request, env: Env) {
  let payload: { messageId?: unknown; locationId?: unknown }
  try {
    payload = (await request.json()) as typeof payload
  } catch {
    return ok()
  }

  const { messageId, locationId } = payload ?? {}
  if (
    typeof messageId !== 'string' ||
    !/^\w{10,40}$/.test(messageId) ||
    !env.GHL_LOCATION_ID ||
    locationId !== env.GHL_LOCATION_ID
  )
    return ok()

  try {
    const token = await appToken(env, env.GHL_LOCATION_ID)
    if (token) await markDelivered(token, messageId)
  } catch (error) {
    console.error('Live chat webhook: status not updated', error)
  }
  return ok()
}

// Cloudflare Pages routes POST /api/live-webhook to this export; the dev plugin calls it the same way
export const onRequestPost = (context: { request: Request; env: Env }) =>
  POST(context.request, context.env)
