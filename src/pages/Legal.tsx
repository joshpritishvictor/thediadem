import { Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import PageHero from '../components/PageHero'
import Prose from '../components/Prose'
import Reveal from '../components/Reveal'
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
      <PageHero title={page.title} compact />
      <section className="container-page pt-6 section-b">
        {/* Same heading style as the other pages: gold, capitals, centred */}
        <Reveal className="mb-8 text-center">
          <h2 className="font-sans eyebrow text-base! font-bold md:text-xl!">
            {page.title}
          </h2>
        </Reveal>

        <Suspense fallback={<div className="min-h-screen" />}>
          <Prose html={loadLegalHtml(slug)} />
        </Suspense>
      </section>
    </>
  )
}
