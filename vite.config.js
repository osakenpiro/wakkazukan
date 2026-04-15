import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: osakenpiro.github.io/wakkazukan/
export default defineConfig({
  plugins: [react()],
  base: '/wakkazukan/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react';
        }
      }
    }
  }
})
