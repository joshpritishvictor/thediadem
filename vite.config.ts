import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import apiDev from './plugins/api-dev.ts'
import markdown from './plugins/markdown.ts'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [markdown(), react(), tailwindcss(), apiDev()],
  build: {
    // Client manifest lets scripts/prerender.ts add modulepreload hints per page
    manifest: !isSsrBuild,
  },
}))
