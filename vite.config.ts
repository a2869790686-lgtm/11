
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 确保 process.env.API_KEY 在浏览器端可用
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
  },
  build: {
    rollupOptions: {
      // 告诉 Rollup 不要打包这个模块，浏览器会通过 importmap 处理
      external: ['@google/genai'],
    },
  },
})
