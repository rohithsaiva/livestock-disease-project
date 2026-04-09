import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Bind to all interfaces instead of just true
    port: 5173,      // Explicitly define the port
    cors: true       // Enable CORS for external devices
  }
})
