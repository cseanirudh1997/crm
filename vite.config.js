import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir:                'dist',
    sourcemap:             false,
    minify:                'esbuild',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:     ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion'],
          icons:      ['lucide-react'],
          charts:     ['recharts'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['framer-motion', 'lucide-react', 'recharts'],
  },
})
