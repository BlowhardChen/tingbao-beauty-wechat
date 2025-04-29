import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

const pathResolve = (dir: string): string => resolve(__dirname, '.', dir)

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        // 生产环境去除console
        drop_console: true,
      },
      sourceMap: true,
    },
  },
  esbuild: {
    target: 'esnext', // 配置目标环境为 esnext
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  optimizeDeps: {
    include: ['axios'], // 确保 axios 被正确优化
  },
  plugins: [uni()],
  resolve: {
    alias: [{ find: '@', replacement: pathResolve('src') }],
  },
  server: {
    port: 8848,
    open: true,
    host: '0.0.0.0',
    hmr: true,
  },
})
