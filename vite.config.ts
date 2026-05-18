import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: [
      'fundamental-jemima-thebellapapayas-d5aa4f14.koyeb.app',
      'windseeker-app.ch',
      'localhost',
    ]
  },
  build: {
    outDir: 'dist',
  },
})