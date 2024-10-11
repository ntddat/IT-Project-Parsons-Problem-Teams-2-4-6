import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
        host: '0.0.0.0',
        port: 5173, // or any port you're using
      },    
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./App', import.meta.url))
    }
  },
  outputDir: 'App',
  devServer: {
    proxy: 'http://localhost:3000',
  }
})
