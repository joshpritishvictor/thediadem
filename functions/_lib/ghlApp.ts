// Sign-in as the "Diadem Website Chat" GoHighLevel Marketplace app.
//
// The custom "Website chat" conversation provider belongs to that app, so only the app's
// own OAuth token can post messages on it (the Private Integration token, GHL_API_TOKEN,
// is refused). Installing the app on The Diadem sends the browser to /api/chat-connect with
// a one-time code; exchangeCode() swaps it for tokens and saves them in Cloudflare KV
// (GHL_TOKENS). appToken() returns a valid access token, renewing it when it's about to
// expire (GHL access tokens last about a day; each renewal returns a new refresh token,
// which is why they're stored rather than set as a secret).
//
// Settings (Cloudflare secrets; locally in .env.local):
//   GHL_CLIENT_ID, GHL_CLIENT_SECRET   the app's client keys (Marketplace → app → Auth)
// Binding: GHL_TOKENS, a KV namespace (wrangler.jsonc). In `npm run dev` there's no KV,
// so tokens are kept in memory until the dev server restarts.

const TOKEN_URL = 'https://services.leadconnectorhq.com/oauth/token'
/** Renew this long before the access token expires */
const RENEW_EARLY_MS = 10 * 60_000
const TIMEOUT_MS = 10_000

export type TokenStore = {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
}

export type AppEnv = {
  GHL_CLIENT_ID?: string
  GHL_CLIENT_SECRET?: string
  GHL_TOKENS?: TokenStore
}

type Saved = { access: string; refresh: string; expiresAt: number }

// Dev only: no KV binding, so keep tokens in memory
const memory = new Map<string, string>()
const memoryStore: TokenStore = {
  get: async (key) => memory.get(key) ?? null,
  put: async (key, value) => void memory.set(key, value),
}

const store = (env: AppEnv) => env.GHL_TOKENS ?? memoryStore
const keyFor = (locationId: string) => `ghl-app:${locationId}`

export const isAppConfigured = (env: AppEnv) =>
  Boolean(env.GHL_CLIENT_ID && env.GHL_CLIENT_SECRET)

type TokenResponse = {
  access_token?: string
  refresh_token?: string
  expires_in?: number
  userType?: string
  locationId?: string
}

async function requestTokens(env: AppEnv, params: Record<string, string>) {
  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      client_id: env.GHL_CLIENT_ID ?? '',
      client_secret: env.GHL_CLIENT_SECRET ?? '',
      user_type: 'Location',
      ...params,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) {
    // Logged server-side only
    throw new Error(
      `GHL OAuth ${response.status}: ${(await response.text()).slice(0, 300)}`,
    )
  }
  return (await response.json()) as TokenResponse
}

async function save(env: AppEnv, locationId: string, tokens: TokenResponse) {
  if (!tokens.access_token || !tokens.refresh_token)
    throw new Error('GHL OAuth: response without tokens')
  const saved: Saved = {
    access: tokens.access_token,
    refresh: tokens.refresh_token,
    expiresAt: Date.now() + (tokens.expires_in ?? 86_400) * 1000,
  }
  await store(env).put(keyFor(locationId), JSON.stringify(saved))
  return saved
}

/**
 * Swaps the install code for tokens and saves them. Only accepts an install on
 * `expectedLocationId` (The Diadem), so the app can't be pointed at another account.
 */
export async function exchangeCode(
  env: AppEnv,
  code: string,
  redirectUri: string,
  expectedLocationId: string,
) {
  const tokens = await requestTokens(env, {
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  })
  if (tokens.userType !== 'Location' || !tokens.locationId)
    return { error: 'not-location' as const }
  if (tokens.locationId !== expectedLocationId)
    return { error: 'wrong-location' as const }
  await save(env, tokens.locationId, tokens)
  return { connected: true as const }
}

async function read(env: AppEnv, locationId: string) {
  const raw = await store(env).get(keyFor(locationId))
  if (!raw) return undefined
  try {
    return JSON.parse(raw) as Saved
  } catch {
    return undefined
  }
}

/**
 * A valid access token for the app on this location, or undefined if the app isn't
 * connected (never installed, keys missing, or renewal failed).
 */
export async function appToken(env: AppEnv, locationId: string) {
  if (!isAppConfigured(env)) return undefined
  const saved = await read(env, locationId)
  if (!saved) return undefined
  if (saved.expiresAt - RENEW_EARLY_MS > Date.now()) return saved.access

  try {
    const tokens = await requestTokens(env, {
      grant_type: 'refresh_token',
      refresh_token: saved.refresh,
    })
    return (await save(env, locationId, tokens)).access
  } catch (error) {
    // Another request may have just renewed it (the old refresh token then fails)
    const latest = await read(env, locationId)
    if (latest && latest.refresh !== saved.refresh) return latest.access
    console.error('GHL app: token renewal failed', error)
    return saved.expiresAt > Date.now() ? saved.access : undefined
  }
}
