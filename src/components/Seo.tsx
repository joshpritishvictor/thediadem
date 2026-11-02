import { useLocation } from 'react-router-dom'
import { site } from '../content/site'

type SeoProps = {
  /** Page title; " | Diadem" is added. Omit on the home page */
  title?: string
  /** Exact title for search results, used as written (keep it to ~60 characters) */
  fullTitle?: string
  /** Search result snippet (keep it to ~150 characters so Google shows all of it) */
  description?: string
  image?: string
  type?: 'website' | 'article'
  /** Structured data (schema.org) for rich search results; one object or several */
  jsonLd?: object
}

/** React 19 hoists these tags into <head>, both in the browser and when pre-rendering */
export default function Seo({
  title,
  fullTitle,
  description = site.description,
  image,
  type = 'website',
  jsonLd,
}: SeoProps) {
  const { pathname } = useLocation()
  const pageTitle =
    fullTitle ?? (title ? `${title} | ${site.name}` : site.homeTitle)
  const url = site.url + pathname
  const imageUrl = image && new URL(image, site.url).href

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="en_CA" />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      <meta
        name="twitter:card"
        content={imageUrl ? 'summary_large_image' : 'summary'}
      />
      {jsonLd && (
        <script
          type="application/ld+json"
          // Serialised data we control; escape "<" so it can't close the tag
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\u003c'),
          }}
        />
      )}
    </>
  )
}
