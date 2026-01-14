import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.JPG'],
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173,
    strictPort: false, // Try next port if 5173 is busy
    hmr: {
      overlay: false, // Disable error overlay
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'stripe-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
