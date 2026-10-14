import { ChevronRight, Clock } from 'lucide-react'
import { Suspense } from 'react'
import { Link, useParams } from 'react-router-dom'
import CtaBanner from '../components/CtaBanner'
import PostCard from '../components/PostCard'
import Prose from '../components/Prose'
import Reveal, { RevealItem } from '../components/Reveal'
import Seo from '../components/Seo'
import {
  categoryPath,
  formatDate,
  getPost,
  loadPostHtml,
  posts,
} from '../content/blog'
import { site } from '../content/site'
import NotFound from './NotFound'

export default function BlogPost() {
  const post = getPost(useParams().slug)
  if (!post) return <NotFound />

  const { slug, title, date, excerpt, categories, image, readingMinutes } = post
  // Prefer posts that share a category, then fall back to the newest
  const related = posts
    .filter((p) => p.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.categories.some((c) => categories.includes(c))) -
        Number(a.categories.some((c) => categories.includes(c))),
    )
    .slice(0, 3)

  return (
    <>
      <Seo
        title={title}
        description={excerpt}
        image={image}
        type="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: title,
          description: excerpt,
          datePublished: date,
          image: image && new URL(image, site.url).href,
          author: { '@type': 'Organization', name: site.name },
          publisher: { '@type': 'Organization', name: site.name },
        }}
      />

      <article className="container-page pt-24 pb-12 md:pt-28">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-sm text-ink/50"
        >
          <Link to="/" className="hover:text-teal-900">
            Home
          </Link>
          <ChevronRight size={14} />
          <Link to="/blog/" className="hover:text-teal-900">
            Blog
          </Link>
          {categories[0] && (
            <>
              <ChevronRight size={14} />
              <Link
                to={categoryPath(categories[0])}
                aria-current="page"
                className="text-ink/80 hover:text-teal-900"
              >
                {categories[0]}
              </Link>
            </>
          )}
        </nav>

        {/* The whole article in one beige card, like the FAQ questions */}
        <Reveal className="mx-auto mt-6 max-w-4xl">
          <div className="rounded-3xl border border-ink/8 bg-beige px-6 py-8 md:px-12 md:py-12">
            <header>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/55">
                {categories.map((c) => (
                  <Link
                    key={c}
                    to={categoryPath(c)}
                    className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-semibold text-gold-600 hover:bg-gold-500/25"
                  >
                    {c}
                  </Link>
                ))}
                <time dateTime={date}>{formatDate(date)}</time>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} /> {readingMinutes} min read
                </span>
              </div>
              <h1 className="mt-5 text-3xl leading-tight font-bold md:text-4xl">
                {title}
              </h1>
            </header>

            <div className="mt-8 border-t border-ink/8 pt-8">
              <Suspense fallback={<div className="min-h-96" />}>
                <Prose html={loadPostHtml(slug)} />
              </Suspense>
            </div>
          </div>
        </Reveal>
      </article>

      {related.length > 0 && (
        <section className="bg-white/50 section-y">
          <div className="container-page">
            <h2 className="text-3xl font-bold">Keep reading</h2>
            <Reveal
              staggerChildren={0.08}
              className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {related.map((p) => (
                <RevealItem key={p.slug}>
                  <PostCard post={p} />
                </RevealItem>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  )
}
