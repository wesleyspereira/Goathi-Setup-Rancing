import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Caminhos relativos permitem publicar na Vercel e no subdiretório do GitHub Pages.
export default defineConfig({
  plugins: [react()],
  base: './',
})
