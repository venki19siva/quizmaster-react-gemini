import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 10000,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'quizmaster-5h6g.onrender.com',
      '.onrender.com'
    ]
  }
})
