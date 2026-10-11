// Each Markdown file in ./legal/ becomes a page at /<file-name>/
const metas = import.meta.glob<{ title: string }>('./legal/*.md', {
  query: '?meta',
  import: 'default',
  eager: true,
})
const bodies = import.meta.glob<string>('./legal/*.md', {
  query: '?html',
  import: 'default',
})

export const legalPages = Object.keys(metas).map((path) => {
  const slug = path.slice(path.lastIndexOf('/') + 1, -3)
  return { slug, title: metas[path].title }
})

export const getLegalPage = (slug: string) =>
  legalPages.find((page) => page.slug === slug)

// Cached so React's use() gets the same promise on every render
const htmlCache = new Map<string, Promise<string>>()

export const loadLegalHtml = (slug: string) => {
  let html = htmlCache.get(slug)
  if (!html) {
    html = bodies[`./legal/${slug}.md`]?.() ?? Promise.resolve('')
    htmlCache.set(slug, html)
  }
  return html
}
