
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 关键：将 Vercel 的环境变量注入到浏览器的 process.env 对象中
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    // 允许打包大型模块
    chunkSizeWarningLimit: 1000,
  }
})
