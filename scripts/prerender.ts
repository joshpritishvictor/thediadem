// Renders every page to static HTML after `vite build`, plus sitemap.xml and robots.txt.
// Run via `npm run build`.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

type ManifestChunk = { file: string; imports?: string[]; css?: string[] }
type ServerEntry = {
  render: (url: string) => Promise<string>
  routeModules: (url: string) => string[]
  urls: string[]
  siteUrl: string
}

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const serverDir = path.join(root, 'dist-server')
const manifestFile = path.join(dist, '.vite', 'manifest.json')

const { render, routeModules, urls, siteUrl } = (await import(
  pathToFileURL(path.join(serverDir, 'entry-server.js')).href
)) as ServerEntry

const template = await readFile(path.join(dist, 'index.html'), 'utf8')
const manifest = JSON.parse(await readFile(manifestFile, 'utf8')) as Record<
  string,
  ManifestChunk
>

// React 19 emits <title>, <meta> and <link> where they're rendered; move them into <head>
const HEAD_TAG = /<title>[\s\S]*?<\/title>|<meta [^>]*\/?>|<link [^>]*\/?>/g

/** <link rel="modulepreload"> for a page's chunks so they download in parallel with the entry */
function preloadTags(url: string) {
  const files = new Set<string>()
  const visit = (key: string) => {
    const chunk = manifest[key]
    if (!chunk || files.has(chunk.file)) return
    files.add(chunk.file)
    chunk.imports?.forEach(visit)
  }
  routeModules(url).forEach(visit)
  // The entry and its static imports are already in the template
  return [...files]
    .filter((file) => !template.includes(file))
    .map((file) => `<link rel="modulepreload" crossorigin href="/${file}">`)
    .join('')
}

async function renderPage(url: string) {
  const appHtml = await render(url)
  const head = (appHtml.match(HEAD_TAG) ?? []).join('') + preloadTags(url)
  const body = appHtml.replace(HEAD_TAG, '')
  return template
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', body)
}

const outFile = (url: string) =>
  path.join(dist, ...url.split('/').filter(Boolean), 'index.html')

for (const url of urls) {
  const file = outFile(url)
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, await renderPage(url))
  console.log(`  prerendered ${url}`)
}

// Any unknown path renders the "not found" page
await writeFile(
  path.join(dist, '404.html'),
  await renderPage('/404-not-found/'),
)

const today = new Date().toISOString().slice(0, 10)
await writeFile(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${siteUrl}${url}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`,
)
await writeFile(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
)

// Build-only artifacts: don't deploy them
await rm(serverDir, { recursive: true, force: true })
await rm(path.join(dist, '.vite'), { recursive: true, force: true })
console.log(`\n✓ ${urls.length} pages, 404.html, sitemap.xml and robots.txt`)
