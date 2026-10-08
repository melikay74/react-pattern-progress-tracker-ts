import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this repo at /react-pattern-progress-tracker-ts/, not at the site root
  base: '/react-pattern-progress-tracker-ts/',
})
