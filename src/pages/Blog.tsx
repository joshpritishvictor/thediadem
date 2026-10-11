import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import PostCard from '../components/PostCard'
import Reveal, { RevealItem } from '../components/Reveal'
import Seo from '../components/Seo'
import { categories, categoryPath, getCategory, posts } from '../content/blog'
import { insights } from '../content/home'
import { site } from '../content/site'
import NotFound from './NotFound'

/** Serves both /blog/ and /category/<slug>/ */
export default function Blog() {
  const { category: categorySlug } = useParams()
  const category = getCategory(categorySlug)
  if (categorySlug && !category) return <NotFound />

  const visible = category
    ? posts.filter((p) => p.categories.includes(category.name))
    : posts
  const title = category ? category.name : 'Blog'

  return (
    <>
      <Seo
        title={category ? `${category.name} Articles` : insights.heading}
        description={`${insights.heading} from ${site.name} — practical guidance for Alberta business owners, incorporated professionals and families.`}
      />
      <PageHero
        eyebrow={insights.eyebrow}
        title={title}
        description={insights.heading}
        crumbs={category ? [{ to: '/blog/', label: 'Blog' }] : []}
      />

      <section className="container-page pb-24 md:pb-32">
        <Reveal>
          <nav
            aria-label="Categories"
            className="flex flex-wrap gap-2 border-b border-ink/8 pb-8"
          >
            <FilterLink to="/blog/" active={!category}>
              All articles
            </FilterLink>
            {categories.map((c) => (
              <FilterLink
                key={c.slug}
                to={categoryPath(c.name)}
                active={c.slug === category?.slug}
              >
                {c.name}
              </FilterLink>
            ))}
          </nav>
        </Reveal>

        <Reveal
          key={category?.slug ?? 'all'}
          staggerChildren={0.08}
          className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((post) => (
            <RevealItem key={post.slug}>
              <PostCard post={post} />
            </RevealItem>
          ))}
        </Reveal>
      </section>
    </>
  )
}

function FilterLink({
  to,
  active,
  children,
}: {
  to: string
  active: boolean
  children: string
}) {
  return (
    <Link
      to={to}
      aria-current={active ? 'page' : undefined}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-teal-900 text-cream'
          : 'bg-white text-ink/70 ring-1 ring-ink/10 hover:text-ink hover:ring-ink/25'
      }`}
    >
      {children}
    </Link>
  )
}
