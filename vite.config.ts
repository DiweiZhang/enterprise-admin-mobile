import { resolve } from 'node:path'
import Uni from '@dcloudio/vite-plugin-uni'
import Components from '@uni-helper/vite-plugin-uni-components'
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'
import { defineConfig, loadEnv } from 'vite'
import { UniEcharts } from 'uni-echarts/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    base: './',
    plugins: [
      Components({
        dts: true,
        resolvers: [WotResolver()],
      }),
      UniEcharts(),
      Uni(),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        // uni 编译器的内部提升目录可能命中旧版 i18n，显式绑定业务版本。
        '@intlify/message-compiler': resolve(
          __dirname,
          'node_modules/@intlify/message-compiler/dist/message-compiler.esm-bundler.js',
        ),
        '@intlify/shared': resolve(
          __dirname,
          'node_modules/@intlify/shared/dist/shared.esm-bundler.js',
        ),
        // 该版本的 uni 编译器不会识别 zrender 的 exports，需显式定位 ESM 文件。
        'zrender/lib/core/util.js': resolve(__dirname, 'node_modules/zrender/lib/core/util.js'),
      },
    },
    optimizeDeps: {
      exclude: ['uni-echarts'],
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy:
        env.VITE_USE_MOCK === 'true'
          ? undefined
          : {
              '/api': {
                target: env.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
              },
            },
    },
    build: {
      target: 'es2017',
      sourcemap: mode !== 'production',
      chunkSizeWarningLimit: 1500,
    },
  }
})
