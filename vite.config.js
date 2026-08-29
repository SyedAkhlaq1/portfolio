import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' keeps asset paths relative so the build can be hosted
// at a domain root or in a sub-path (e.g. GitHub Pages project site).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    target: 'es2019',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1100, // the lazy Three.js hero chunk is expected to be large
  },
})
