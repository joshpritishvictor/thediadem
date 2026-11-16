// Cloudflare Pages Function: GET /api/chat-connect
// Redirect URL of the "Diadem Website Chat" GoHighLevel Marketplace app. Installing the
// app on The Diadem sends the browser here with a one-time ?code=; it's swapped for the
// app's tokens and saved (functions/_lib/ghlApp.ts), which lets the website post on the
// "Website chat" channel. Shows a short message; nothing on the site links here.
//
// Uses GHL_CLIENT_ID, GHL_CLIENT_SECRET, GHL_LOCATION_ID and the GHL_TOKENS KV binding.

import { exchangeCode, isAppConfigured, type AppEnv } from '../_lib/ghlApp.ts'

type Env = AppEnv & { GHL_LOCATION_ID?: string }

function page(title: string, message: string, status = 200) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f2eacf;color:#28241f;font-family:system-ui,'Segoe UI',sans-serif}main{max-width:28rem;margin:1rem;padding:2rem;border-radius:1.5rem;background:#faf8f3;border:1px solid #c9a84c66;text-align:center}h1{margin:0 0 .5rem;font-size:1.25rem;color:#163838}p{margin:0;line-height:1.5}</style></head>
<body><main><h1>${title}</h1><p>${message}</p></main></body></html>`
  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    },
  })
}

export async function GET(request: Request, env: Env) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  if (!code || code.length > 2000)
    return page(
      'Nothing to do here',
      'This page is only used by GoHighLevel.',
      400,
    )
  if (!isAppConfigured(env) || !env.GHL_LOCATION_ID)
    return page(
      'Not set up yet',
      'GHL_CLIENT_ID, GHL_CLIENT_SECRET and GHL_LOCATION_ID need to be set on the website first.',
      503,
    )

  try {
    const result = await exchangeCode(
      env,
      code,
      `${url.origin}${url.pathname}`,
      env.GHL_LOCATION_ID,
    )
    if ('error' in result)
      return page(
        'Install it on The Diadem',
        result.error === 'not-location'
          ? 'The app was installed on the agency. Install it again and choose The Diadem sub-account.'
          : 'The app was installed on a different sub-account. Install it again and choose The Diadem.',
        400,
      )
    return page(
      'Website chat is connected',
      'The website can now send chats to GoHighLevel on “Website chat”. You can close this tab.',
    )
  } catch (error) {
    console.error('GHL app: install failed', error)
    return page(
      'Couldn’t connect',
      'GoHighLevel didn’t accept the install. Try installing the app again; the link only works once.',
      502,
    )
  }
}

// Cloudflare Pages routes GET /api/chat-connect to this export; the dev plugin calls it the same way
export const onRequestGet = (context: { request: Request; env: Env }) =>
  GET(context.request, context.env)
