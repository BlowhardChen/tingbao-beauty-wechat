import { defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

const pathResolve = (dir: string): string => resolve(__dirname, 'src', dir)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        API_BASE: JSON.stringify(env.VITE_API_BASE),
      },
      'import.meta.env': JSON.stringify(env),
    },
    plugins: [uni()],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: pathResolve(''),
          customResolver: (id) => {
            if (id.startsWith('@/assets')) {
              return id.replace('@', pathResolve('')) + '?url'
            }
            return id
          },
        },
      ],
    },
    server: {
      open: true,
      host: '0.0.0.0',
      port: 8888,
      hmr: {
        overlay: true, // 显示热更新错误提示
        protocol: 'ws', // 使用 WebSocket 协议
        host: 'localhost',
      },
      watch: {
        usePolling: true, // 解决部分系统文件监听失效问题
      },
    },
  }
})
