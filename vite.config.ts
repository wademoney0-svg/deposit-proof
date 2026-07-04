import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GH_PAGES is set when building for GitHub Pages, which serves from /depositcam/
  base: process.env.GH_PAGES ? '/depositcam/' : '/',
  plugins: [react()],
  server: { host: true },
})
