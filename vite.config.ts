import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/alerts': 'http://localhost:8083',
      '/api/dashboard': 'http://localhost:8084',
      '/api/refreshAndGetDashboard': 'http://localhost:8084',
    },
  },
})
