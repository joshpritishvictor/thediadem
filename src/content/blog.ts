// Every Markdown file in ./blog/ becomes a post at /<file-name>/ (matching the WordPress URLs).
// Frontmatter: title, date (ISO, e.g. 2026-06-23 or 2026-06-23T18:13:28-06:00),
// excerpt, categories, image (a file name in assets/images/blog/).

type Frontmatter = {
  title: string
  date: string
  excerpt: string
  categories?: string[]
  image?: string
  readingMinutes: number
}

export type Post = Omit<Frontmatter, 'image' | 'categories'> & {
  slug: string
  categories: string[]
  image?: string
}

// Metadata is small, so load it all up front; bodies load only when a post is opened
const metas = import.meta.glob<Frontmatter>('./blog/*.md', {
  query: '?meta',
  import: 'default',
  eager: true,
})
const bodies = import.meta.glob<string>('./blog/*.md', {
  query: '?html',
  import: 'default',
})
const images = import.meta.glob<string>('../assets/images/blog/*', {
  import: 'default',
  eager: true,
})

const slugFromPath = (path: string) => path.slice(path.lastIndexOf('/') + 1, -3)

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const posts: Post[] = Object.entries(metas)
  .map(([path, { image, categories = [], ...meta }]) => ({
    ...meta,
    slug: slugFromPath(path),
    categories,
    image: image ? images[`../assets/images/blog/${image}`] : undefined,
  }))
  .sort((a, b) => b.date.localeCompare(a.date))

const postsBySlug = new Map(posts.map((post) => [post.slug, post]))

export const getPost = (slug: string | undefined) =>
  slug ? postsBySlug.get(slug) : undefined

// Cached so React's use() gets the same promise on every render
const htmlCache = new Map<string, Promise<string>>()

export const loadPostHtml = (slug: string) => {
  let html = htmlCache.get(slug)
  if (!html) {
    html = bodies[`./blog/${slug}.md`]?.() ?? Promise.resolve('')
    htmlCache.set(slug, html)
  }
  return html
}

export const categories = [...new Set(posts.flatMap((p) => p.categories))]
  .sort()
  .map((name) => ({ name, slug: slugify(name) }))

export const getCategory = (slug: string | undefined) =>
  categories.find((c) => c.slug === slug)

export const postPath = (slug: string) => `/${slug}/`
export const categoryPath = (name: string) => `/category/${slugify(name)}/`

// Uses the calendar date as written (ignores time/zone) so it never shifts a day
export const formatDate = (date: string) =>
  new Date(`${date.slice(0, 10)}T12:00:00`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
