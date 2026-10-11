import { use } from 'react'

/**
 * Renders HTML compiled from our own Markdown at build time (plugins/markdown.ts).
 * Suspends until the HTML chunk has loaded, so wrap it in <Suspense>.
 */
export default function Prose({ html }: { html: Promise<string> }) {
  return (
    <div className="prose" dangerouslySetInnerHTML={{ __html: use(html) }} />
  )
}
