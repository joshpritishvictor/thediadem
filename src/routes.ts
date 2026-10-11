import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { matchPath } from 'react-router-dom'
import { getPost } from './content/blog'
import { legalPages } from './content/legal'

type PageModule = { default: ComponentType }
type Page = {
  /** File name in src/pages/ */
  page: string
  Component: LazyExoticComponent<ComponentType>
  preload: () => Promise<PageModule>
}

// Each page in src/pages/ becomes its own lazily loaded chunk
const pageModules = import.meta.glob<PageModule>('./pages/*.tsx')
const pageCache = new Map<string, Page>()

function page(name: string): Page {
  let entry = pageCache.get(name)
  if (!entry) {
    const preload = pageModules[`./pages/${name}.tsx`]
    entry = { page: name, Component: lazy(preload), preload }
    pageCache.set(name, entry)
  }
  return entry
}

/**
 * Route table. Paths keep the WordPress trailing slashes so existing links
 * and search rankings carry over. Order matters: first match wins, so the
 * catch-all post route (/:slug/) must stay near the end.
 */
export const routes = [
  { path: '/', ...page('Home') },
  { path: '/about-us/', ...page('About') },
  { path: '/our-services/', ...page('Services') },
  { path: '/service/:slug/', ...page('ServiceDetail') },
  { path: '/faq/', ...page('Faq') },
  { path: '/blog/', ...page('Blog') },
  { path: '/category/:category/', ...page('Blog') },
  { path: '/contact-us/', ...page('Contact') },
  ...legalPages.map(({ slug }) => ({ path: `/${slug}/`, ...page('Legal') })),
  { path: '/:slug/', ...page('BlogPost') },
  { path: '*', ...page('NotFound') },
]

export const matchRoute = (pathname: string) =>
  routes.find(({ path }) => matchPath(path, pathname))

/** Start downloading a page's code before it's needed (e.g. on link hover) */
export function preloadRoute(pathname: string) {
  return matchRoute(pathname)?.preload()
}

/** Source modules a URL needs, used at build time to add <link rel="modulepreload"> */
export function routeModules(pathname: string) {
  const route = matchRoute(pathname)
  if (!route) return []
  const modules = [`src/pages/${route.page}.tsx`]
  const slug = pathname.replace(/\//g, '')
  if (route.page === 'BlogPost' && getPost(slug)) {
    modules.push(`src/content/blog/${slug}.md?html`)
  }
  if (route.page === 'Legal') modules.push(`src/content/legal/${slug}.md?html`)
  return modules
}
