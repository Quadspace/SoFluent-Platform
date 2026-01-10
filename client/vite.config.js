import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.JPG'],
  server: {
    host: '0.0.0.0', // Allow external access
    port: 5173,
    strictPort: false, // Try next port if 5173 is busy
    hmr: {
      overlay: false, // Disable error overlay
    },
  },
})
