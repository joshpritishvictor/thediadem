import { Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Prose from '../components/Prose'
import Seo from '../components/Seo'
import { getLegalPage, loadLegalHtml } from '../content/legal'
import NotFound from './NotFound'

/** Renders any Markdown file in content/legal/ (privacy policy, terms) */
export default function Legal() {
  const slug = useLocation().pathname.replace(/\//g, '')
  const page = getLegalPage(slug)
  if (!page) return <NotFound />

  return (
    <>
      <Seo title={page.title} />
      <PageHero title={page.title} />
      <section className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 md:pb-32">
        <Suspense fallback={<div className="min-h-screen" />}>
          <Prose html={loadLegalHtml(slug)} />
        </Suspense>
      </section>
    </>
  )
}
