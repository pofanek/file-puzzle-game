import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' keeps the build working on any GitHub Pages path.
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: { sourcemap: false },
  test: { environment: 'node' },
})
