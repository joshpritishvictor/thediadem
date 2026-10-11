import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import markdown from './plugins/markdown.ts'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [markdown(), react(), tailwindcss()],
  build: {
    // Client manifest lets scripts/prerender.ts add modulepreload hints per page
    manifest: !isSsrBuild,
  },
}))
