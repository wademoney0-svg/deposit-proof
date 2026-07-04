import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Served from the root of the custom domain (depositcam.com)
  base: '/',
  plugins: [react()],
  server: { host: true },
})
