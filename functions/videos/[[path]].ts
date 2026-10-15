// Cloudflare Pages Function: GET /videos/*
//
// Pages serves static files without HTTP Range support (every request gets a 200
// with the whole file). Safari on iOS and macOS refuses to play <video> unless the
// server answers its `Range: bytes=0-1` probe with a 206, so this function reads
// the file from the static asset store and slices it itself.

type Env = { ASSETS: { fetch: (request: Request) => Promise<Response> } }

const VIDEO_CACHE = 'public, max-age=86400'

/** Parses `bytes=start-end`, `bytes=start-` or `bytes=-suffix`; null when unusable */
export function parseRange(header: string | null, size: number) {
  const match = header?.match(/^bytes=(\d*)-(\d*)$/)
  if (!match || size === 0) return null
  const [, startText, endText] = match
  if (startText === '' && endText === '') return null

  let start: number
  let end: number
  if (startText === '') {
    // Suffix range: the last N bytes
    const suffix = Number(endText)
    start = Math.max(0, size - suffix)
    end = size - 1
  } else {
    start = Number(startText)
    end = endText === '' ? size - 1 : Math.min(Number(endText), size - 1)
  }
  if (start > end || start >= size) return null
  return { start, end }
}

/** Builds the 200 or 206 response for a video, honouring a Range header */
export async function serveWithRange(
  asset: Response,
  rangeHeader: string | null,
) {
  const headers = new Headers(asset.headers)
  headers.set('Accept-Ranges', 'bytes')
  headers.set('Cache-Control', VIDEO_CACHE)

  if (!rangeHeader) {
    return new Response(asset.body, { status: asset.status, headers })
  }

  const bytes = new Uint8Array(await asset.arrayBuffer())
  const range = parseRange(rangeHeader, bytes.byteLength)
  if (!range) {
    headers.set('Content-Range', `bytes */${bytes.byteLength}`)
    return new Response(null, { status: 416, headers })
  }

  const chunk = bytes.subarray(range.start, range.end + 1)
  headers.set(
    'Content-Range',
    `bytes ${range.start}-${range.end}/${bytes.byteLength}`,
  )
  headers.set('Content-Length', String(chunk.byteLength))
  return new Response(chunk, { status: 206, headers })
}

export const onRequestGet = async ({
  request,
  env,
}: {
  request: Request
  env: Env
}) => {
  // Ask the asset store for the whole file; it ignores Range anyway
  const assetRequest = new Request(request.url, { method: 'GET' })
  const asset = await env.ASSETS.fetch(assetRequest)
  if (!asset.ok) return asset

  return serveWithRange(asset, request.headers.get('range'))
}

export const onRequestHead = async (context: {
  request: Request
  env: Env
}) => {
  const response = await onRequestGet(context)
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  })
}
