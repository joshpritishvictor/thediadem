import { readFile } from 'node:fs/promises'
import { Marked } from 'marked'
import type { Plugin } from 'vite'
import { parse as parseYaml } from 'yaml'

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/
const QUERY = /\.md\?(meta|html)$/
const WORDS_PER_MINUTE = 220

const marked = new Marked({ gfm: true })

/**
 * Compiles Markdown at build time so no parser ships to the browser.
 *
 *   import meta from './post.md?meta'  // frontmatter + readingMinutes
 *   import html from './post.md?html'  // rendered HTML string
 *
 * The two queries are separate modules, so a list page can import every
 * post's metadata without pulling in any post bodies.
 */
export default function markdown(): Plugin {
  return {
    name: 'diadem:markdown',
    enforce: 'pre',
    async load(id) {
      const match = id.match(QUERY)
      if (!match) return null

      const file = id.slice(0, id.indexOf('?'))
      this.addWatchFile(file)
      const source = await readFile(file, 'utf8')
      const fm = source.match(FRONTMATTER)
      const body = fm ? source.slice(fm[0].length) : source

      if (match[1] === 'html') {
        return `export default ${JSON.stringify(await marked.parse(body))}`
      }

      // YAML 1.2 core schema: dates stay plain strings, exactly as written
      const data = fm ? (parseYaml(fm[1]) as Record<string, unknown>) : {}
      const words = body.split(/\s+/).filter(Boolean).length
      data.readingMinutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE))

      return `export default ${JSON.stringify(data)}`
    },
  }
}
