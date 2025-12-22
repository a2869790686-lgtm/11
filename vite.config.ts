import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 强制将编译环境中的 API_KEY 注入到浏览器端的 process.env.API_KEY
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ""),
  },
  build: {
    chunkSizeWarningLimit: 1000,
  }
})