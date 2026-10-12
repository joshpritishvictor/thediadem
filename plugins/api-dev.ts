import { existsSync } from 'node:fs'
import type { IncomingMessage } from 'node:http'
import path from 'node:path'
import { loadEnv, type Plugin } from 'vite'

// On globalThis because Vite re-imports this file on every restart
const injectedEnv: Set<string> = ((
  globalThis as { __apiDevEnv?: Set<string> }
).__apiDevEnv ??= new Set())

async function readBody(req: IncomingMessage) {
  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(chunk as Buffer)
  return Buffer.concat(chunks)
}

/**
 * Dev only: serves the Vercel functions in api/ (e.g. POST /api/contact) from
 * `npm run dev`, so the whole site — form included — works locally without the
 * Vercel CLI. Server-side env vars come from .env.local, as they would on Vercel.
 */
export default function apiDev(): Plugin {
  return {
    name: 'diadem:api-dev',
    apply: 'serve',
    configureServer(server) {
      const { root, mode } = server.config
      // Vite restarts in the same process when .env files change, so drop the
      // values we injected last time before reloading them
      for (const key of injectedEnv) delete process.env[key]
      injectedEnv.clear()
      // '' prefix = load every variable, not just VITE_*; real env vars win
      for (const [key, value] of Object.entries(loadEnv(mode, root, ''))) {
        if (!process.env[key]) {
          process.env[key] = value
          injectedEnv.add(key)
        }
      }

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? '/', `http://${req.headers.host}`)
        const name = url.pathname.match(/^\/api\/([\w-]+)\/?$/)?.[1]
        const file = name && path.join(root, 'api', `${name}.ts`)
        if (!file || !existsSync(file)) return next()

        try {
          const mod = await server.ssrLoadModule(file)
          const handler = mod[req.method ?? 'GET']
          if (typeof handler !== 'function') {
            res.statusCode = 405
            return res.end()
          }

          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (typeof value === 'string') headers.set(key, value)
          }
          const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
          const response: Response = await handler(
            new Request(url, {
              method: req.method,
              headers,
              body: hasBody ? await readBody(req) : undefined,
            }),
          )

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
