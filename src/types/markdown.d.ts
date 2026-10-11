// Modules produced by plugins/markdown.ts
declare module '*.md?meta' {
  const meta: Record<string, unknown> & { readingMinutes: number }
  export default meta
}

declare module '*.md?html' {
  const html: string
  export default html
}
