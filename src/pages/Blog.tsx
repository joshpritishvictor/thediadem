import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Reveal, { RevealItem } from '../components/Reveal'
import Seo from '../components/Seo'
import {
  categories,
  categoryPath,
  formatDate,
  getCategory,
  postPath,
  posts,
  type Post,
} from '../content/blog'
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
  const [featured, ...rest] = visible
  const title = category ? category.name : 'Blog'

  return (
    <>
      <Seo
        title={category ? `${category.name} Articles` : insights.heading}
        description={`${insights.heading} from ${site.name} — practical guidance for Alberta business owners, incorporated professionals and families.`}
      />
      <PageHero
        title={title}
        crumbs={category ? [{ to: '/blog/', label: 'Blog' }] : []}
        compact
      />

      <section className="container-page section-b">
        <Reveal>
          <h2 className="pt-6 text-center font-sans eyebrow text-base! font-bold md:text-xl! md:whitespace-nowrap">
            {category ? category.name : insights.heading}
          </h2>

          <nav
            aria-label="Categories"
            className="mt-8 flex flex-wrap gap-2 border-b border-ink/8 pb-8"
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

        {featured && (
          <Reveal key={`f-${category?.slug ?? 'all'}`} className="mt-10">
            <Featured post={featured} />
          </Reveal>
        )}

        {rest.length > 0 && (
          <Reveal
            key={category?.slug ?? 'all'}
            staggerChildren={0.06}
            className="mt-6 divide-y divide-ink/8 overflow-hidden rounded-3xl border border-ink/8 bg-white"
          >
            {rest.map((post) => (
              <RevealItem key={post.slug}>
                <Row post={post} />
              </RevealItem>
            ))}
          </Reveal>
        )}
      </section>
    </>
  )
}

/** The newest article, as a compact green panel with no picture */
function Featured({ post }: { post: Post }) {
  return (
    <Link
      to={postPath(post.slug)}
      className="group relative block overflow-hidden rounded-3xl bg-teal-900 px-6 py-6 text-cream transition duration-500 ease-out-expo hover:shadow-2xl hover:shadow-teal-900/20 md:px-8"
    >
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold tracking-[0.18em] uppercase">
        <span className="rounded-full bg-gold-500 px-3 py-1 text-teal-950">
          Latest
        </span>
        {post.categories[0] && (
          <span className="text-gold-300">{post.categories[0]}</span>
        )}
      </div>
      <h3 className="mt-3 text-xl leading-tight font-bold md:text-2xl">
        {post.title}
      </h3>
      <p className="mt-2 text-cream/70">{post.excerpt}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm text-cream/60">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} /> {post.readingMinutes} min read
          </span>
        </div>
        <span className="inline-flex items-center gap-2 font-semibold text-gold-300">
          Read article
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  )
}

/** One article in the list: category, date and reading time, then title and summary, with an arrow on the right */
function Row({ post }: { post: Post }) {
  return (
    <Link
      to={postPath(post.slug)}
      className="group grid grid-cols-[1fr_auto] items-center gap-5 px-6 py-5 transition-colors hover:bg-beige/50 md:gap-8 md:px-8"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50">
          {post.categories[0] && (
            <span className="font-semibold text-gold-600">
              {post.categories[0]}
            </span>
          )}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {post.readingMinutes} min read
          </span>
        </div>
        <h3 className="mt-1.5 text-lg leading-snug font-semibold transition-colors group-hover:text-teal-800 md:text-xl">
          {post.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink/60">
          {post.excerpt}
        </p>
      </div>

      <span className="grid size-10 place-items-center rounded-full bg-teal-900/8 text-teal-900 transition duration-300 group-hover:bg-gold-500 group-hover:text-teal-950">
        <ArrowUpRight size={18} />
      </span>
    </Link>
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
