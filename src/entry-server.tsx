import { StrictMode } from 'react'
import { prerender } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'
import App from './App'
import { categories, categoryPath, postPath, posts } from './content/blog'
import { legalPages } from './content/legal'
import { servicePath, services } from './content/services'
import { site } from './content/site'

export { routeModules } from './routes'
export const siteUrl = site.url

/** Every URL to pre-render at build time, derived from the content */
export const urls = [
  '/',
  '/about-us/',
  '/our-services/',
  '/faq/',
  '/blog/',
  '/contact-us/',
  ...services.map((s) => servicePath(s.slug)),
  ...posts.map((p) => postPath(p.slug)),
  ...categories.map((c) => categoryPath(c.name)),
  ...legalPages.map((p) => `/${p.slug}/`),
]

/** Renders a URL to HTML, waiting for lazy pages and Markdown to load */
export async function render(url: string) {
  const { prelude } = await prerender(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
  return new Response(prelude).text()
}
