import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      clientPort: 5173, // Explicitly set HMR port
    },
    watch: {
      usePolling: true // Helps with some WSL/file system issues
    }
  }
  
})