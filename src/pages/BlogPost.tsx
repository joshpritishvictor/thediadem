import { ArrowLeft, Clock } from 'lucide-react'
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

      <article>
        <header className="relative overflow-hidden pt-28 pb-10 md:pt-32">
          <div className="absolute -top-32 -right-24 size-[28rem] animate-blob rounded-full bg-gold-300/30 blur-3xl" />
          <Reveal className="relative mx-auto max-w-3xl px-4 sm:px-6">
            <Link
              to="/blog/"
              className="inline-flex items-center gap-2 text-sm font-medium text-ink/55 hover:text-teal-900"
            >
              <ArrowLeft size={16} /> All articles
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink/55">
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
            <h1 className="mt-5 text-4xl leading-tight font-bold md:text-5xl">
              {title}
            </h1>
          </Reveal>
        </header>

        {image && (
          <Reveal className="mx-auto max-w-5xl px-4 sm:px-6">
            <img
              src={image}
              alt=""
              width={1200}
              height={770}
              fetchPriority="high"
              className="aspect-[2/1] w-full rounded-[2rem] object-cover shadow-2xl shadow-teal-900/10"
            />
          </Reveal>
        )}

        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <Suspense fallback={<div className="min-h-96" />}>
            <Prose html={loadPostHtml(slug)} />
          </Suspense>
        </div>
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
