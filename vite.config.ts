import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 关键修复：确保不管是本地 .env 还是 Vercel 后台设置的 API_KEY 都能被正确读取
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || process.env.VITE_API_KEY || ""),
  },
  build: {
    chunkSizeWarningLimit: 1000,
  }
})