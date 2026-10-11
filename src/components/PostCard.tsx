import { ArrowUpRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, postPath, type Post } from '../content/blog'

export default function PostCard({ post }: { post: Post }) {
  const { slug, title, date, excerpt, categories, image, readingMinutes } = post

  return (
    <Link
      to={postPath(slug)}
      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-ink/8 bg-white shadow-sm transition duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-900/10"
    >
      {image && (
        <div className="overflow-hidden">
          <img
            src={image}
            alt=""
            width={1200}
            height={770}
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full object-cover transition duration-700 ease-out-expo group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-7">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50">
          {categories[0] && (
            <span className="font-semibold text-gold-600">{categories[0]}</span>
          )}
          <time dateTime={date}>{formatDate(date)}</time>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {readingMinutes} min read
          </span>
        </div>
        <h3 className="mt-3 text-xl leading-snug font-semibold transition-colors group-hover:text-teal-800">
          {title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm text-ink/60">{excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-teal-900">
          Read more
          <ArrowUpRight
            size={16}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </Link>
  )
}
