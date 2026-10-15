import { existsSync } from 'node:fs'
import type { IncomingMessage } from 'node:http'
import path from 'node:path'
import { loadEnv, type Plugin } from 'vite'

async function readBody(req: IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  return Buffer.concat(chunks)
}

/** Method name → export Cloudflare Pages looks for, e.g. POST → onRequestPost */
const handlerName = (method: string) =>
  `onRequest${method[0]}${method.slice(1).toLowerCase()}`

/**
 * Dev only: serves the Cloudflare Pages Functions in functions/api/ (e.g.
 * POST /api/contact) from `npm run dev`, so the whole site — form included —
 * works locally without Wrangler. Server-side variables come from .env.local
 * and are passed as `env`, the way Cloudflare passes its bindings.
 */
export default function apiDev(): Plugin {
  return {
    name: 'diadem:api-dev',
    apply: 'serve',
    configureServer(server) {
      const { root, mode } = server.config

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
        const name = url.pathname.match(/^\/api\/([\w-]+)\/?$/)?.[1]
        const file = name && path.join(root, 'functions', 'api', `${name}.ts`)
        if (!file || !existsSync(file)) return next()

        try {
          const mod = await server.ssrLoadModule(file)
          const method = req.method ?? 'GET'
          const handler = mod[handlerName(method)] ?? mod.onRequest
          if (typeof handler !== 'function') {
            res.statusCode = 405
            return res.end()
          }

          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value)
          }
          const hasBody = method !== 'GET' && method !== 'HEAD'
          const request = new Request(url, {
            method,
            headers,
            body: hasBody ? await readBody(req) : undefined,
          })
          // Re-read on every request so edits to .env.local apply without a restart.
          // '' prefix = load every variable, not just VITE_*; real env vars win.
          const env = { ...loadEnv(mode, root, ''), ...process.env }
          const response: Response = await handler({ request, env })

          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}
